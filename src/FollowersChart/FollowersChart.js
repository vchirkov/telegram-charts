const {createHTMLElement} = require('../utils/createElement');

const {Chart} = require('../Chart/Chart');
const {Navigation} = require('../Navigation/Navigation');
const {Path} = require('../Path/Path');
const {Legend} = require('../Legend/Legend');
const {AxisY} = require('../Axis/AxisY');
const {AxisX} = require('../Axis/AxisX');

require('./followers-chart.css');

const DAY = 24 * 60 * 60 * 1000;

const DEFAULTS = {
    width: 600,
    chartHeight: 400,
    navHeight: 100,
    navPadding: 2,
    xAxisHeight: 30,
    strokeWidth: 2,
    ticksX: 5,
    ticksY: 5,
    intervalStart: 0.8,
    intervalEnd: 1,
    minInterval: 0.15
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
        this.xDaysMin = this.xDays[0];
        this.xDaysMax = this.xDays[this.xDays.length - 1];

        this.maxY = this._getMaxY();
        this.intervalMaxY = this._getIntervalMaxY();

        this.chart = this._getChart();
        this.axisY = this._getAxisY();
        this.axisX = this._getAxisX();
        this.nav = this._getNav();
        this.legend = this._getLegend();

        this.chartYs = this._getChartYs(data);
        this.navYs = this._getNavYs();

        this.containerDiv = this._getContainerDiv();

        this._combine();
        this._listenToChangeEvents();

        this.init();
    }

    init() {
        this.axisY.init();
        this.axisX.init();
    }

    getRoot() {
        return this.containerDiv;
    }

    _parseData({columns, names, types, colors}) {
        return columns.reduce((memo, column) => {
            if (types[column[0]] === 'x') {
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
            this.axisX.update({
                min: this.opts.intervalStart * this.xDaysMax,
                max: this.opts.intervalEnd * this.xDaysMax
            });
        });

        this.nav.on(Navigation.ON_INTERVAL_CHANGE_END, () => {
            this.intervalMaxY = this._getIntervalMaxY();

            const scaleFactor = this.intervalMaxY / this.maxY;

            this.chart.update({scaleFactor});
            this.axisY.update({max: this.intervalMaxY});
        });

        this.legend.on(Legend.ON_COL_TOGGLE, col => {
            const column = this.y.find(({id}) => col.id === id);
            column.visible = !col.visible;

            const intervalMaxY = this._getIntervalMaxY();
            const visibleMaxY = this._getVisibleMaxY();

            this.intervalMaxY = intervalMaxY;

            this.legend.update(column);
            this.axisY.update({max: intervalMaxY});
            this.chart.update({scaleFactor: intervalMaxY / this.maxY});
            this.nav.update({scaleFactor: visibleMaxY / this.maxY});

            this.chartYs.find(({id}) => col.id === id).update({visible: col.visible});
            this.navYs.find(({id}) => col.id === id).update({visible: col.visible});
        });

        this.axisY.on(AxisY.ON_NEW_TICK_GENERATED, ([lineG, textG]) => {
            this.chart.addBeforeBackground(lineG);
            this.chart.addAfterBackground(textG);
        });
    }

    _combine() {
        this.containerDiv.appendChild(this.chart.getRoot());
        this.containerDiv.appendChild(this.nav.getRoot());
        this.containerDiv.appendChild(this.legend.getRoot());

        this.chart.addAfterBackground(this.axisX.getRoot());

        this.chartYs.forEach(path => this.chart.addToBackground(path.getRoot()));
        this.navYs.forEach(path => this.nav.addToBackground(path.getRoot()));
    }


    _getChart() {
        return new Chart({
            width: this.opts.width,
            height: this.opts.chartHeight,
            xAxisHeight: this.opts.xAxisHeight,
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
            max: this.intervalMaxY
        });
    }

    _getAxisX() {
        return new AxisX({
            y: this.opts.chartHeight,
            height: this.opts.xAxisHeight,
            width: this.opts.width,
            min: this.opts.intervalStart * this.xDaysMax,
            max: this.opts.intervalEnd * this.xDaysMax,
            xDaysMin: this.xDaysMin
        });
    }

    _getNav() {
        return new Navigation({
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

    _getChartYs() {
        //assumption: data can be mutated
        return this.y.map(({id, y, name, color, type}) => {
            switch (type) {
                case 'line':
                    return this._getChartPath({id, y, name, color});
                default:
                    return this._getChartPath({id, y, name, color});
            }
        });
    }

    _getChartPath({id, y, name, color}) {
        return new Path(id, {
            y,
            name,
            color,
            x: this.xDays,
            height: this.maxY,
            strokeWidth: this.opts.strokeWidth
        });
    }

    _getNavYs() {
        return this.chartYs.map((path) => new Path(path.id, Object.assign({}, path.opts)));
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
