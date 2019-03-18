const {createSvgElement} = require('../utils/createElement');
const {SimpleEventEmitter} = require('../utils/SimpleEventEmitter');

const DEFAULTS = {
    min: 0,
    max: 0,
    ticksNumber: 5,
    ticksTop: 0.9,
    ticksBottom: 0
};


class AxisBase extends SimpleEventEmitter {
    constructor(opts, tickGenerators = [], transformFn = () => '') {
        super();
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.ticks = {};
        this._tickGenerators = tickGenerators;
        this._transformFn = transformFn;
    }

    async init() {
        this.rerender(this.opts.min, this.opts.max);
    }

    async update({min = this.opts.min, max = this.opts.max}) {
        if (this.opts.min === min &&
            this.opts.max === max) {
            return;
        }

        return this.rerender(min, max);
    }

    async rerender(min, max) {
        // prep phase
        const prev = {
            min: this.opts.min,
            max: this.opts.max,
            ticks: this.ticks
        };

        const next = {
            min,
            max,
            ticks: this._getNewTicks(min, max)
        };

        const united = Object.assign({}, prev.ticks, next.ticks);

        // generate phase
        Object.entries(next.ticks).map(([tick, generated]) => {
            prev.ticks[tick] || this.emit(AxisBase.ON_NEW_TICK_GENERATED, generated, tick);
        });

        setTimeout(() => {
            // animate phase
            Object.entries(united).forEach(([tick, generated]) => {
                const transform = this._transformFn(tick, next.min, next.max);
                generated.forEach(svgEl => svgEl.style.transform = transform);
                if (next.ticks[tick]) {
                    generated.forEach(svgEl => svgEl.style.opacity = 1);
                } else if (prev.ticks[tick]) {
                    generated.forEach(svgEl => svgEl.style.opacity = 0);
                    generated.forEach(svgEl => svgEl.addEventListener('transitionend', ({target}) => {
                        target.parentNode.removeChild(target);
                    }, {once: true}));
                }
            });
        }, 1000 / 60);

        //end phase
        this.ticks = next.ticks;
        this.opts.min = next.min;
        this.opts.max = next.max;
    }

    _getNewTicks(min, max) {
        const ticksRange = this._getTicksRange(min, max);
        return ticksRange.reduce((ticks, tick) => {
            if (!this.ticks[tick]) {
                const transform = this._transformFn(tick, this.opts.min, this.opts.max);
                ticks[tick] = this._tickGenerators.map(gen => this._getTickG(gen(tick), transform));
            } else {
                ticks[tick] = this.ticks[tick];
            }
            return ticks;
        }, {})
    }

    _getTicksRange(min = this.opts.min, max = this.opts.max) {
        const start = min + (max - min) * this.opts.ticksBottom;
        const end = min + (max - min) * this.opts.ticksTop;
        const interval = end - start;

        const step = interval / this.opts.ticksNumber;
        return Array.from(Array(this.opts.ticksNumber + 1), (x, index) => {
            return (start + index * step) | 0;
        });
    }

    _getTickG(generatedChild, transform) {
        const g = createSvgElement('g', 'tick-container animate-to', {}, {
            transform,
            opacity: 0
        });

        g.appendChild(generatedChild);

        return g;
    }
}

AxisBase.ON_NEW_TICK_GENERATED = 'ON_NEW_TICK_GENERATED';

module.exports.AxisBase = AxisBase;
