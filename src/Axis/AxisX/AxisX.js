const {createSvgElement} = require('../../utils/createElement');
const {AxisBase} = require('../AxisBase');
const {monthDay} = require('../../utils/dateFormatter');

require('./axis-x.css');

const DAY = 24 * 60 * 60 * 1000;
const ADDITIONAL_ELS = 1;
const DEFAULTS = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    max: 0,
    intervalStart: 0,
    intervalEnd: 1,
    ticksNumber: 5,
    textOffset: 20,
    className: 'animate-o',
    startDay: 0
};

module.exports.AxisX = class AxisX extends AxisBase {
    constructor(opts) {
        super({}, [
                (tick) => this._getAxisTickText(tick)
            ],
            (tick, intervalStart, intervalEnd) => this._getTickTransform(tick, intervalStart, intervalEnd));
        this.opts = Object.assign({}, DEFAULTS, opts);
        this.axisXG = this._getAxisXG();

        this.on(AxisBase.ON_NEW_TICK_GENERATED, ([textG]) => this.axisXG.appendChild(textG));
    }

    async update({
                     intervalStart = this.opts.intervalStart,
                     intervalEnd = this.opts.intervalEnd,
                     animated = true
                 }) {
        if (this.opts.intervalStart === intervalStart &&
            this.opts.intervalEnd === intervalEnd) {
            return;
        }

        const prevInterval = (this.opts.intervalEnd - this.opts.intervalStart).toFixed(3);
        const newInterval = (intervalEnd - intervalStart).toFixed(3);

        if (prevInterval === newInterval) {
            return this.rerender(intervalStart, intervalEnd, false);
        }

        return this.rerender(intervalStart, intervalEnd);
    }

    getRoot() {
        return this.axisXG;
    }

    _getTicksRange(intervalStart = this.opts.intervalStart, intervalEnd = this.opts.intervalEnd) {
        const interval = (intervalEnd - intervalStart) * this.opts.max;
        const step = interval / this.opts.ticksNumber | 0;
        const start = (((this.opts.max * intervalStart / step) | 0) - ADDITIONAL_ELS) * step;
        return Array.from(Array(this.opts.ticksNumber + 1 + 2 * ADDITIONAL_ELS), (x, index) => {
            return (start + index * step) | 0;
        });
    }

    _getAxisXG() {
        return createSvgElement('g', 'x-axis', {
            'transform': `translate(${this.opts.x},${this.opts.y})`
        });
    }

    _getAxisTickText(tick) {
        const text = createSvgElement('text', 'x-axis-tick-text', {
            'y': this.opts.textOffset,
            'text-anchor': 'middle'
        });

        text.appendChild(document.createTextNode(this._getAxisTickTitle(tick)));
        return text;
    }

    _getAxisTickTitle(tick) {
        return monthDay((this.opts.startDay + tick) * DAY);
    }

    _getTickTransform(tick, intervalStart, intervalEnd) {
        return `translate(${(tick / this.opts.max - intervalStart) / (intervalEnd - intervalStart) * this.opts.width}px,0)`;
    }
};
