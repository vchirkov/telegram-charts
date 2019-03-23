const {createSVGElement} = require('../../utils/createElement');
const {AxisBase} = require('../AxisBase');
const {largeNumber} = require('../../utils/numberFormatter');

require('./axis-y.css');
require('./axis-y_night.css');

const DEFAULTS = {
    height: 0,
    width: 0,
    max: 0,
    ticksNumber: 5,
    ticksTop: 0.9,
    textOffset: 6,
    nightMode: false
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

    update(opts) {
        if (typeof opts.nightMode === "boolean") {
            this.opts.nightMode = opts.nightMode;
            this._setDisplayMode();
        }

        super.update(opts);
    }

    _setDisplayMode() {
        this.linesG.setAttribute('night', this.opts.nightMode);
        this.titlesG.setAttribute('night', this.opts.nightMode);
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

        text.appendChild(document.createTextNode(largeNumber(tick)));
        return text;
    }

    _getTickTransform(tick, intervalEnd) {
        return `translate(0, ${(1 - tick / (this.opts.max * intervalEnd)) * this.opts.height}px)`;
    }
};
