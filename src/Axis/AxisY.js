const {createSvgElement} = require('../utils/createElement');
const {AxisBase} = require('./AxisBase');

const DEFAULTS = {
    height: 0,
    width: 0,
    max: 0,
    ticksNumber: 5,
    ticksTop: 0.9,
    ticksBottom: 0,
    color: '#000',
    textOffset: 10
};

module.exports.AxisY = class AxisY extends AxisBase {
    constructor(opts) {
        super({
                min: 0,
                max: opts.max || DEFAULTS.max,
                ticksNumber: opts.ticksNumber || DEFAULTS.ticksNumber,
                ticksTop: opts.ticksTop || DEFAULTS.ticksTop,
                ticksBottom: opts.ticksBottom || DEFAULTS.ticksBottom
            }, [
                () => this._getAxisTickLine(),
                (tick) => this._getAxisTickText(tick)
            ],
            (tick, min, max) => this._getTickTransform(tick, max));

        this.opts = Object.assign({}, DEFAULTS, this.opts, opts);
    }

    _getAxisTickLine() {
        return createSvgElement('line', 'y-axis-tick-line', {
            'stroke': this.opts.color,
            'x2': this.opts.width
        });
    }

    _getAxisTickText(tick) {
        const text = createSvgElement('text', 'y-axis-tick-text', {
            'y': -this.opts.textOffset
        });

        text.appendChild(document.createTextNode(tick));
        return text;
    }

    _getTickTransform(tick, max = this.opts.max) {
        return `translate(0, ${(1 - tick / max) * this.opts.height}px)`;
    }
};
