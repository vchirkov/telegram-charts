const {createSvgElement} = require('../utils/createElement');

const DEFAULTS = {
    height: 0,
    width: 0,
    maxY: 0,
    intervalMaxY: 0,
    ticksNumber: 5,
    ticksTop: 0.8,
    color: '#000',
    textOffset: 10,
    digitsAfterComma: 0
};

module.exports.AxisY = class AxisY {
    constructor(opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.axisSvg = this._getAxisSvg();
        this.axisContainerG = this._getAxisContainer();

        this.ticks = {};

        this.rerender();
        this._combine();
    }

    getRoot() {
        return this.axisSvg;
    }

    update({intervalMaxY}) {
        if (this.opts.intervalMaxY === intervalMaxY) {
            return;
        }
        this.opts.intervalMaxY = intervalMaxY;
        this.rerender();
    }

    rerender() {
        this.rerenderTicks();
    }

    rerenderTicks() {
        const ticksArr = this._getTicksRange();
        const ticks = {};

        ticksArr.forEach(tick => {
            if (this.ticks[tick]) {
                ticks[tick] = this.ticks[tick];
                ticks[tick].style.transform = this._getTickTransform(tick);
            } else {
                ticks[tick] = this._getAxisTickG(tick);
                this._addAxisTickG(ticks[tick]);
            }
        });

        for (let key in this.ticks) {
            if (!ticks[key]) {
                this._removeAxisTickG(this.ticks[key]);
            }
        }

        this.ticks = ticks;
    }

    _combine() {
        this.axisSvg.appendChild(this.axisContainerG);
    }

    _addAxisTickG(tickG) {
        this.axisContainerG.appendChild(tickG);
    }

    _removeAxisTickG(tickG) {
        this.axisContainerG.removeChild(tickG);
    }


    _getAxisSvg() {
        return createSvgElement('svg', 'y-axis');
    }

    _getAxisContainer() {
        return createSvgElement('g', 'y-axis-container');
    }

    _getAxisTickG(tick) {
        const tickG = createSvgElement('g', 'y-axis-tick animate-to', {}, {
            'transform': this._getTickTransform(tick)
        });

        const line = createSvgElement('line', 'y-axis-tick-line', {
            'stroke': this.opts.color,
            'vector-effect': 'non-scaling-stroke',
            'x2': this.opts.width
        });

        const text = createSvgElement('text', 'y-axis-tick-text', {
            'y': -this.opts.textOffset,
            'vector-effect': 'non-scaling-stroke'
        });

        text.appendChild(document.createTextNode(tick));

        tickG.appendChild(line);
        tickG.appendChild(text);

        return tickG;
    }

    _getTicksRange() {
        const step = this.opts.ticksTop * this.opts.intervalMaxY / this.opts.ticksNumber;
        const digitsAfterComma = this.opts.digitsAfterComma || step < 1 ? 1 : this.opts.digitsAfterComma;

        return Array.from(Array(this.opts.ticksNumber + 1), (x, index) => (index * step).toFixed(digitsAfterComma));
    }

    _getTickTransform(tick) {
        return `translate(0, ${(1 - tick / this.opts.intervalMaxY) * this.opts.height}px)`;
    }
};
