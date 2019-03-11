import {DAY, SVG_NS} from './constants';
import {Navigation} from "./Navigation";

const DEFAULTS = {
    width: 600,
    chartHeight: 400,
    chartPadding: 2,
    navHeight: 100,
    navPadding: 2,
    yAxisHeight: 20,
    strokeWidth: 2,
    ticksX: 5,
    ticksY: 5,
    intervalStart: 0.8,
    intervalEnd: 1,
    minInterval: 0.1
};

export class FollowersChart {
    //assumption: width and height are fixed and passed explicitly
    constructor(data, opts = {}) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.x = this._extractX(data);
        this.xDays = this.x.map(i => i / DAY);
        this.minX = this.x[0];
        this.maxX = this.x[this.x.length - 1];

        this.minDayX = this.xDays[0];
        this.maxDayX = this.xDays[this.xDays.length - 1];

        this.lines = this._getLinesData(data);

        this.maxY = this._getMaxY(0, this.x.length);
        this.lines.forEach((line) => line.d = this._getPathD(this.xDays, line.column));

        this.intervalStart = Math.min(this.opts.intervalStart, 1 - this.opts.minInterval);
        this.intervalEnd = Math.max(this.opts.intervalEnd, this.opts.intervalStart + this.opts.minInterval);
        this.minInterval = this.opts.minInterval;

        this.nav = new Navigation({
            y: this.opts.chartHeight + this.opts.yAxisHeight,
            width: this.opts.width,
            height: this.opts.navHeight,
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd,
            minInterval: this.opts.minInterval,
        });

        this.svg = this._getSvg();
        this.chartG = this._getChartG();
        this.navG = this.nav.getRoot();
        this.lines.forEach((line) => line.chartPath = this._getPathG(line.d, line.color, this.opts.chartHeight));
        this.lines.forEach((line) => line.navPath = this._getPathG(line.d, line.color, this.opts.navHeight));

        this.rescaleChart();

        this._combineSvg();
    }

    _combineSvg() {
        this.svg.appendChild(this.chartG);
        this.svg.appendChild(this.navG);

        this.lines.forEach(({chartPath}) => this.chartG.appendChild(chartPath));
        this.lines.forEach(({navPath}) => this.nav.addToBackground(navPath));
    }

    _extractX({columns}) {
        //assumption: only called in constructor
        //assumption: data passed in constructor can be mutated
        //assumption: x is always first in columns array
        columns[0].shift();
        let x = columns[0];
        delete columns[0];
        return x;
    }

    _getLinesData({columns, types, names, colors}) {
        //assumption: data can be mutated
        return columns.reduce((memo, column) => {
            const id = column.shift();
            memo.push({
                id,
                column,
                type: types[id],
                name: names[id],
                color: colors[id]
            });
            return memo;
        }, []);
    }

    _getMaxY(from, to) {
        return this.lines.reduce((memo, {column}) => {
            for (let i = from; i < to; i++) {
                memo = Math.max(memo, column[i]);
            }
            return memo;
        }, Number.NEGATIVE_INFINITY);
    }

    _getSvg() {
        const svg = document.createElementNS(SVG_NS, 'svg');

        svg.setAttribute('width', this.opts.width);
        svg.setAttribute('height', this.opts.chartHeight + this.opts.yAxisHeight + this.opts.navHeight);

        return svg;
    }

    _getChartG() {
        const g = document.createElementNS(SVG_NS, 'g');

        g.setAttribute('class', 'chart');

        return g;
    }

    _getPathD(x, y) {
        // assumption: x.length > 0
        // assumption: x.length === y.length
        // assumption: y[i] > 0 (i:0 - y.length)
        let d = `M ${x[0]} ${this.maxY - y[0]}`;
        for (let i = 1; i < x.length; i++) {
            d += ` L ${x[i]} ${this.maxY - y[i]}`;
        }
        return d;
    }

    _getPathG(d, color, height) {
        const g = document.createElementNS(SVG_NS, 'g');
        const path = document.createElementNS(SVG_NS, 'path');

        g.appendChild(path);

        path.setAttribute('fill', 'none');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', this.opts.strokeWidth);

        const scaleX = this.opts.width / (this.maxDayX - this.minDayX);
        const scaleY = height / this.maxY;

        path.setAttribute('d', d);
        path.setAttribute('transform', `scale(${scaleX},${scaleY}) translate(-${this.minDayX},0)`);

        return g;
    }

    rescaleChart() {
        const scaleX = 1 / (this.intervalEnd - this.intervalStart);
        const scaleY = 1;

        const translateX = this.intervalStart * this.opts.width;

        this.chartG.setAttribute('transform', `scale(${scaleX},${scaleY}) translate(-${translateX},0)`);
    }
}
