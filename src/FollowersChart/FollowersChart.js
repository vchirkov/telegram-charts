const {createHTMLElement} = require('../utils/createElement');

const {Chart} = require('../Chart/Chart');
const {Navigation} = require('../Navigation/Navigation');
const {Path} = require('../Path/Path');
const {Legend} = require('../Legend/Legend');
const {AxisY} = require('../Axis/AxisY');

require('./followers-chart.css');

const DAY = 24 * 60 * 60 * 1000;

const DEFAULTS = {
    width: 600,
    chartHeight: 400,
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

/**
 *
 *  @generates
 *  div.followers-chart.chart-container
 *      @instance Chart
 *      @instance Navigation
 *      @instance Legend
 *
 *  @event Legend ON_COL_TOGGLE - triggers on click, emits {col}
 *
 *  @method getRoot(): rootElement
 *
 */

class FollowersChart {
    //assumption: width and height are fixed and passed explicitly
    constructor(data, opts = {}) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        const {x, y} = this._parseData(data);

        this.x = x;
        this.y = y;
        this.xDays = this.x.map(i => (i - this.x[0]) / DAY);

        this.maxY = this._getMaxY();
        this.intervalMaxY = this._getIntervalMaxY();

        this.chart = this._getChart();
        this.axisY = this._getAxisY();
        this.nav = this._getNav();
        this.legend = this._getLegend();

        this.chartPaths = this._getChartPaths(data);
        this.navPaths = this._getNavPaths();

        this.containerDiv = this._getContainerDiv();

        this._combine();
        this._listenToChangeEvents();

    }

    getRoot() {
        return this.containerDiv;
    }

    _parseData({columns, names, types, colors}) {
        return columns.reduce((memo, column) => {
            if (column[0] === 'x') {
                memo.x = column.slice(1);
            } else {
                const id = column[0];
                memo.y.push({
                    id,
                    y: column.slice(1),
                    color: colors[id],
                    name: names[id],
                    type: types[id],
                    visible: true,
                })
            }
            return memo;
        }, {y: []});
    }

    _listenToChangeEvents() {
        this.nav.on(Navigation.ON_INTERVAL_CHANGE, ({intervalStart, intervalEnd}) => {
            Object.assign(this.opts, {intervalStart, intervalEnd});

            this.chart.update({intervalStart, intervalEnd});
        });

        this.nav.on(Navigation.ON_INTERVAL_CHANGE_END, () => {
            this.intervalMaxY = this._getIntervalMaxY();

            const scaleFactor = this.intervalMaxY / this.maxY;

            this.chart.update({scaleFactor});
            this.axisY.update({intervalMaxY: this.intervalMaxY});
        });

        this.legend.on(Legend.ON_COL_TOGGLE, col => {
            const column = this.y.find(({id}) => col.id === id);
            column.visible = !col.visible;

            const intervalMaxY = this._getIntervalMaxY();
            const visibleMaxY = this._getVisibleMaxY();

            this.intervalMaxY = intervalMaxY;

            this.legend.update(column);
            this.axisY.update({intervalMaxY});
            this.chart.update({scaleFactor: intervalMaxY / this.maxY});
            this.nav.update({scaleFactor: visibleMaxY / this.maxY});

            this.chartPaths.find(({id}) => col.id === id).update({visible: col.visible});
            this.navPaths.find(({id}) => col.id === id).update({visible: col.visible});
        });
    }

    _combine() {
        this.containerDiv.appendChild(this.chart.getRoot());
        this.containerDiv.appendChild(this.nav.getRoot());
        this.containerDiv.appendChild(this.legend.getRoot());

        this.chart.addBeforeBackground(this.axisY.getRoot());

        this.chartPaths.forEach(path => this.chart.addToBackground(path.getRoot()));
        this.navPaths.forEach(path => this.nav.addToBackground(path.getRoot()));
    }


    _getChart() {
        return new Chart({
            width: this.opts.width,
            height: this.opts.chartHeight,
            scaleFactor: this.intervalMaxY / this.maxY,
            intervalMaxY: this.intervalMaxY,
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd,
            maxY: this.maxY,
            maxX: this.xDays[this.xDays.length - 1]
        });
    }

    _getAxisY() {
        return new AxisY({
            width: this.opts.width,
            height: this.opts.chartHeight,
            maxY: this.maxY,
            intervalMaxY: this.intervalMaxY,
            scaleFactor: this.intervalMaxY / this.maxY
        });
    }

    _getNav() {
        return new Navigation({
            y: this.opts.chartHeight + this.opts.yAxisHeight,
            width: this.opts.width,
            height: this.opts.navHeight,
            scaleFactor: this._getVisibleMaxY() / this.maxY,
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd,
            minInterval: this.opts.minInterval,
            maxY: this.maxY,
            maxX: this.xDays[this.xDays.length - 1]
        });
    }

    _getLegend() {
        return new Legend({
            columns: this.y
        });
    }

    _getChartPaths() {
        //assumption: data can be mutated
        return this.y.map(({id, y, name, color}) => {
            return new Path(id, {
                y,
                name,
                color,
                x: this.xDays,
                height: this.maxY,
                strokeWidth: this.opts.strokeWidth
            });
        });
    }

    _getNavPaths() {
        return this.chartPaths.map((path) => new Path(path.id, Object.assign({}, path.opts)));
    }

    _getContainerDiv() {
        return createHTMLElement('div', 'followers-chart chart-container');
    }

    _getMaxY() {
        return this.y.reduce((memo, {y}) => {
            return y.reduce((memo, val) => Math.max(memo, val), memo);
        }, Number.NEGATIVE_INFINITY);
    }

    _getVisibleMaxY() {
        return this.y.reduce((memo, {y, visible}) => {
            if (!visible) {
                return memo;
            }
            return y.reduce((memo, val) => Math.max(memo, val), memo);
        }, Number.NEGATIVE_INFINITY);
    }

    _getIntervalMaxY() {
        const from = Math.floor(this.opts.intervalStart * this.x.length);
        const to = Math.ceil(this.opts.intervalEnd * this.x.length);

        return this.y.reduce((memo, {y, visible}) => {
            let i = from;
            if (!visible) {
                return memo;
            }
            while (i < to) {
                memo = Math.max(y[i], memo);
                i++;
            }
            return memo;
        }, Number.NEGATIVE_INFINITY);
    }
}

module.exports.FollowersChart = FollowersChart;
