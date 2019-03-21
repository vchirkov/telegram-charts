const {createSVGElement} = require('../../utils/createElement');
const {AxisBase} = require('../AxisBase');

require('./axis-y.css');

const DEFAULTS = {
    height: 0,
    width: 0,
    max: 0,
    ticksNumber: 5,
    ticksTop: 0.9,
    ticksBottom: 0,
    textOffset: 6
};

module.exports.AxisY = class AxisY extends AxisBase {
    constructor(opts) {
        super({}, [
                () => this._getAxisTickLine(),
                (tick) => this._getAxisTickText(tick)
            ],
            (tick, intervalStart, intervalEnd) => this._getTickTransform(tick, intervalEnd));

        this.linesG = createSVGElement('g', 'y-axis-lines-container');
        this.titlesG = createSVGElement('g', 'y-axis-titles-container');

        this.opts = Object.assign({}, DEFAULTS, this.opts, opts);

        this.on(AxisBase.ON_NEW_TICK_GENERATED, ([lineG, textG]) => {
            this.linesG.appendChild(lineG);
            this.titlesG.appendChild(textG);
        });
    }

    getLinesRoot() {
        return this.linesG;
    }

    getTitlesRoot() {
        return this.titlesG;
    }

    _getAxisTickLine() {
        return createSVGElement('line', 'y-axis-tick-line', {
            'x2': this.opts.width
        });
    }

    _getAxisTickText(tick) {
        const text = createSVGElement('text', 'y-axis-tick-text', {
            'y': -this.opts.textOffset
        });

        text.appendChild(document.createTextNode(tick));
        return text;
    }

    _getTickTransform(tick, intervalEnd) {
        return `translate(0, ${(1 - tick / (this.opts.max * intervalEnd)) * this.opts.height}px)`;
    }
};
