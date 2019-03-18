const {createSvgElement} = require('../utils/createElement');
const {AxisBase} = require('./AxisBase');
const {monthDay} = require('../utils/dateFormatter');

const DAY = 24 * 60 * 60 * 1000;

const DEFAULTS = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    min: 0,
    max: 0,
    ticksNumber: 4,
    ticksBottom: 0.1,
    ticksTop: 0.9,
    color: '#000',
    textOffset: 20
};

module.exports.AxisX = class AxisX extends AxisBase {
    constructor(opts) {
        super({
                min: opts.min || DEFAULTS.min,
                max: opts.max || DEFAULTS.max,
                ticksNumber: opts.ticksNumber || DEFAULTS.ticksNumber,
                ticksTop: opts.ticksTop || DEFAULTS.ticksTop,
                ticksBottom: opts.ticksBottom || DEFAULTS.ticksBottom
            }, [
                (tick) => this._getAxisTickText(tick)
            ],
            (tick, min, max) => this._getTickTransform(tick, min, max));

        this.opts = Object.assign({}, DEFAULTS, this.opts, opts);

        this.axisXG = this._getAxisXG();

        this.on(AxisBase.ON_NEW_TICK_GENERATED, ([textG]) => this.axisXG.appendChild(textG));
    }

    getRoot() {
        return this.axisXG;
    }

    _getAxisXG() {
        return createSvgElement('g', 'x-axis', {
            'transform': `translate(${this.opts.x},${this.opts.y})`
        });
    }

    _getAxisTickText(tick) {
        const text = createSvgElement('text', 'y-axis-tick-text', {
            'y': this.opts.textOffset,
            'text-anchor': 'middle'
        });

        text.appendChild(document.createTextNode(this._getAxisTickTitle(tick)));
        return text;
    }

    _getAxisTickTitle(tick) {
        return monthDay((this.opts.xDaysMin + tick) * DAY);
    }

    _getTickTransform(tick, min = this.opts.min, max = this.opts.max) {
        return `translate(${((tick - min) / (max - min)) * this.opts.width}px,0)`;
    }
};
