const {createSvgElement} = require('../utils/createElement');
const {SimpleEventEmitter} = require('../utils/SimpleEventEmitter');

const DEFAULTS = {
    max: 0,
    intervalStart: 0,
    intervalEnd: 1,
    ticksNumber: 5,
    ticksTop: 0.9,
    ticksBottom: 0,
    className: 'animate-to'
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
        this.rerender(this.opts.intervalStart, this.opts.intervalEnd);
    }

    async update({intervalStart = this.opts.intervalStart, intervalEnd = this.opts.intervalEnd}) {
        if (this.opts.intervalStart === intervalStart &&
            this.opts.intervalEnd === intervalEnd) {
            return;
        }
        return this.rerender(intervalStart, intervalEnd);
    }

    async rerender(intervalStart, intervalEnd, animate = true) {
        // prep phase
        const prev = {
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd,
            ticks: this.ticks
        };

        const next = {
            intervalStart,
            intervalEnd,
            ticks: this._getNewTicks(intervalStart, intervalEnd)
        };

        const united = Object.assign({}, prev.ticks, next.ticks);

        // generate phase
        Object.entries(next.ticks).map(([tick, generated]) => {
            prev.ticks[tick] || this.emit(AxisBase.ON_NEW_TICK_GENERATED, generated, tick);
        });
        // animate phase
        if (animate) {
            setTimeout(() => this._animate(united, next, prev), 1000 / 60);
        } else {
            this._animate(united, next, prev, false);
        }

        //end phase
        this.ticks = next.ticks;
        this.opts.intervalStart = next.intervalStart;
        this.opts.intervalEnd = next.intervalEnd;
    }

    _animate(united, next, prev, animate = true) {
        Object.entries(united).forEach(([tick, generated]) => {
            const transform = this._transformFn(tick, next.intervalStart, next.intervalEnd);
            generated.forEach(svgEl => svgEl.style.transform = transform);
            if (next.ticks[tick]) {
                generated.forEach(svgEl => svgEl.style.opacity = 1);
            } else if (prev.ticks[tick]) {
                generated.forEach(svgEl => svgEl.style.opacity = 0);
                generated.forEach(svgEl => this._removeGeneratedElement(svgEl, animate), {once: true});
            }
        });
    }

    _removeGeneratedElement(svgEl, animate = true) {
        if (animate) {
            svgEl.addEventListener('transitionend', ({target}) => target.parentNode.removeChild(target));
        } else {
            svgEl.parentNode.removeChild(svgEl);
        }
    }

    _getNewTicks(intervalStart, intervalEnd) {
        const ticksRange = this._getTicksRange(intervalStart, intervalEnd);
        return ticksRange.reduce((ticks, tick) => {
            if (!this.ticks[tick]) {
                const transform = this._transformFn(tick, this.opts.intervalStart, this.opts.intervalEnd);
                ticks[tick] = this._tickGenerators.map(gen => this._getTickG(gen(tick), transform));
            } else {
                ticks[tick] = this.ticks[tick];
            }
            return ticks;
        }, {})
    }

    _getTicksRange(intervalStart = this.opts.intervalStart, intervalEnd = this.opts.intervalEnd) {
        const start = intervalStart + (intervalEnd - intervalStart) * this.opts.ticksBottom * this.opts.max;
        const end = intervalStart + (intervalEnd - intervalStart) * this.opts.ticksTop * this.opts.max;
        const interval = end - start;

        const step = interval / this.opts.ticksNumber;
        return Array.from(Array(this.opts.ticksNumber + 1), (x, index) => {
            return (start + index * step) | 0;
        });
    }

    _getTickG(generatedChild, transform) {
        const g = createSvgElement('g', `tick-container ${this.opts.className}`, {}, {
            transform,
            opacity: 0
        });

        g.appendChild(generatedChild);

        return g;
    }
}

AxisBase.ON_NEW_TICK_GENERATED = 'ON_NEW_TICK_GENERATED';

module.exports.AxisBase = AxisBase;
