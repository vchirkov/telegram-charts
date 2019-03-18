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
        //prep
        const prevIntervalMaxY = this.opts.intervalMaxY;
        const newIntervalMaxY = intervalMaxY;

        // ticks prep
        const oldTicks = this.ticks;
        const newTicks = this.getNewTicks(newIntervalMaxY, prevIntervalMaxY);

        const unitedTicks = Object.assign({}, newTicks, oldTicks);

        // append ticks
        for (let tick in newTicks) {
            oldTicks[tick] || this._addAxisTickG(newTicks[tick]);
        }

        //animate ticks
        setTimeout(() => {
            for (let tick in unitedTicks) {
                unitedTicks[tick].style.transform = this._getTickTransform(tick);
                if (oldTicks[tick] && !newTicks[tick]) {
                    oldTicks[tick].style.opacity = 0;
                    oldTicks[tick].addEventListener('transitionend', ({target}) => {
                        target.parentNode.removeChild(target);
                    }, {once: true});
                } else {
                    unitedTicks[tick].style.opacity = 1;
                }
            }
            this.ticks = newTicks;
        });

        //finish update
        this.opts.intervalMaxY = intervalMaxY;
    }

    rerender() {
        this.rerenderTicks();
    }

    getNewTicks(intervalMaxY, prevIntervalMaxY) {
        const ticksRange = this._getTicksRange(intervalMaxY);

        return ticksRange.reduce((ticks, tick) => {
            if (!this.ticks[tick]) {
                ticks[tick] = this._getAxisTickG(tick, prevIntervalMaxY);
                ticks[tick].style.opacity = 0;
            } else {
                ticks[tick] = this.ticks[tick];
            }
            return ticks;
        }, {});
    }

    rerenderTicks() {
        const ticksRange = this._getTicksRange();
        const ticks = {};

        ticksRange.forEach(tick => {
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

    _getAxisTickG(tick, intervalMaxY = this.opts.intervalMaxY) {
        const tickG = createSvgElement('g', 'y-axis-tick animate-to', {}, {
            'transform': this._getTickTransform(tick, intervalMaxY)
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

    _getTicksRange(intervalMaxY = this.opts.intervalMaxY) {
        const step = this.opts.ticksTop * intervalMaxY / this.opts.ticksNumber;
        const digitsAfterComma = this.opts.digitsAfterComma || step < 1 ? 1 : this.opts.digitsAfterComma;

        return Array.from(Array(this.opts.ticksNumber + 1), (x, index) => (index * step).toFixed(digitsAfterComma));
    }

    _getTickTransform(tick, intervalMaxY = this.opts.intervalMaxY) {
        return `translate(0, ${(1 - tick / intervalMaxY) * this.opts.height}px)`;
    }
};
