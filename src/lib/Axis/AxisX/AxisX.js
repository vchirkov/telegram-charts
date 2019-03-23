const {createSVGElement} = require('../../utils/createElement');
const {AxisBase} = require('../AxisBase');
const {monthDate} = require('../../utils/dateFormatter');

require('./axis-x.css');
require('./axis-x_night.css');

const DAY = 24 * 60 * 60 * 1000;
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
    startDay: 0,
    padding: 15,
    nightMode: false
};

module.exports.AxisX = class AxisX extends AxisBase {
    constructor(opts) {
        super({}, [
                (tick) => this._getAxisTickText(tick)
            ],
            (tick, intervalStart, intervalEnd) => this._getTickTransform(tick, intervalStart, intervalEnd));
        this.opts = Object.assign({}, DEFAULTS, opts);
        this.axisXG = this._getAxisXG();

        this.minTicksNumber = Math.ceil(this.opts.ticksNumber / 1.75);
        this.maxTicksNumber = Math.floor(this.opts.ticksNumber * 1.75);

        this.on(AxisBase.ON_NEW_TICK_GENERATED, ([textG]) => this.axisXG.appendChild(textG));
    }

    async update({
                     intervalStart = this.opts.intervalStart,
                     intervalEnd = this.opts.intervalEnd,
                     animated = true,
                     nightMode
                 }) {
        if (typeof nightMode === "boolean") {
            this.opts.nightMode = nightMode;
            this._setDisplayMode();
        }

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

    _setDisplayMode() {
        this.axisXG.setAttribute('night', this.opts.nightMode);
    }

    getRoot() {
        return this.axisXG;
    }

    getStep(intervalStart = this.opts.intervalStart, intervalEnd = this.opts.intervalEnd) {
        return this.step || this.setStep((intervalEnd - intervalStart) * this.opts.max / this.opts.ticksNumber | 0);
    }

    setStep(step) {
        return this.step = step;
    }

    _getTicksRange(intervalStart = this.opts.intervalStart, intervalEnd = this.opts.intervalEnd) {
        if (intervalStart === this.opts.intervalStart && intervalEnd !== this.opts.intervalEnd) {
            return this._getTickRangeStart(intervalStart, intervalEnd);
        } else if (intervalStart !== this.opts.intervalStart && intervalEnd === this.opts.intervalEnd) {
            return this._getTickRangeEnd(intervalStart, intervalEnd);
        } else {
            return this._getTickRangeSlide(intervalStart, intervalEnd);
        }
    }

    _getTickRangeStart(intervalStart, intervalEnd) {
        const interval = (intervalEnd - intervalStart) * this.opts.max;
        let number = interval / this.getStep() | 0;
        if (number > this.maxTicksNumber - 2) {
            this.setStep(this.getStep() * 2);
            number = this.opts.ticksNumber;
        }
        if (number < this.minTicksNumber) {
            this.setStep(this.getStep() / 2);
            number = this.opts.ticksNumber;
        }

        let ticks = Array.from(Array(number + 2), (x, index) => (this.start + index * this.getStep()) | 0);

        this.end = ticks[ticks.length - 1];

        return ticks;
    }

    _getTickRangeEnd(intervalStart, intervalEnd) {
        const interval = (intervalEnd - intervalStart) * this.opts.max;
        let number = interval / this.getStep() | 0;
        if (number > this.maxTicksNumber - 2) {
            this.setStep(this.getStep() * 2);
            number = this.opts.ticksNumber;
        }
        if (number < this.minTicksNumber) {
            this.setStep(this.getStep() / 2);
            number = this.opts.ticksNumber;
        }

        let ticks = Array.from(Array(number + 2), (x, index) => (this.end - (number - index + 1) * this.getStep()) | 0);

        this.start = ticks[0];

        return ticks;
    }

    _getTickRangeSlide(intervalStart, intervalEnd) {
        const step = this.getStep(intervalStart, intervalEnd);
        const start = (((this.opts.max * intervalStart / step) | 0)) * step + (this.start || 0) % step;
        const interval = (intervalEnd - intervalStart) * this.opts.max;
        let number = interval / this.getStep() | 0;

        let ticks = Array.from(Array(number + 2), (x, index) => (start + index * step) | 0);

        this.start = ticks[0];
        this.end = ticks[ticks.length - 1];

        return ticks;
    }


    _getAxisXG() {
        const scaleX = !this.opts.width ? this.opts.width : 1 - this.opts.padding * 2 / this.opts.width;
        return createSVGElement('g', 'x-axis', {
            'transform': `translate(${this.opts.x + this.opts.padding},${this.opts.y}) scale(${scaleX},1)`
        });
    }

    _getAxisTickText(tick) {
        const text = createSVGElement('text', 'x-axis-tick-text', {
            'y': this.opts.textOffset,
            'text-anchor': 'middle'
        });

        text.appendChild(document.createTextNode(this._getAxisTickTitle(tick)));
        return text;
    }

    _getAxisTickTitle(tick) {
        return monthDate((this.opts.startDay + tick) * DAY);
    }

    _getTickTransform(tick, intervalStart, intervalEnd) {
        return `translate(${(tick / this.opts.max - intervalStart) / (intervalEnd - intervalStart) * this.opts.width}px,0)`;
    }
};
