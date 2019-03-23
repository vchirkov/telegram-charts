const {createSVGElement} = require('../utils/createElement');

const DEFAULTS = {
    width: 600,
    height: 400,
    xAxisHeight: 0,
    scaleFactor: 1,
    intervalStart: 0,
    intervalEnd: 1,
    padding: 2,
    maxY: 0,
    maxX: 0
};

module.exports.Chart = class Chart {
    constructor(opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.chartSvg = createSVGElement('svg', 'chart', {
            'width': this.opts.width,
            'height': this.opts.height + this.opts.xAxisHeight + this.opts.padding * 2
        });

        this.chartContainerG = createSVGElement('g', 'chart-container', {
            'transform': `translate(0,${this.opts.padding})`
        });

        this.bgG = createSVGElement('g', 'bg');
        this.baseDimensionG = createSVGElement('g', 'base-dimension');
        this.beforeBgG = createSVGElement('g', 'before-bg');
        this.afterBgG = createSVGElement('g', 'after-bg');

        this.verticalTransfromG = createSVGElement('g', 'vertical-transform animate-t');
        this.horizontalTransformG = createSVGElement('g', 'horizontal-transform');

        this.rerender();
        this._combine();
    }

    getRoot() {
        return this.chartSvg;
    }

    update({intervalStart, intervalEnd, scaleFactor}) {
        if (intervalStart || intervalEnd) {
            if (this.opts.intervalStart !== intervalStart || this.opts.intervalEnd !== intervalEnd) {
                this.opts.intervalStart = intervalStart;
                this.opts.intervalEnd = intervalEnd;
                this.rerenderTransformX();
            }
        }
        if (scaleFactor && this.opts.scaleFactor !== scaleFactor) {
            this.opts.scaleFactor = scaleFactor;
            this.rerenderTransfromY();
        }
    }

    addBeforeBackground(el) {
        if (!el) {
            return;
        }
        this.beforeBgG.appendChild(el);
    }

    addToBackground(el) {
        if (!el) {
            return;
        }
        this.bgG.appendChild(el);
    }

    addAfterBackground(el) {
        if (!el) {
            return;
        }
        this.afterBgG.appendChild(el);
    }

    rerender() {
        this.rerenderTransformX();
        this.rerenderTransfromY();
        this.rerenderBaseDimensions()
    }

    rerenderBaseDimensions() {
        const scaleX = this.opts.width / this.opts.maxX;
        const scaleY = this.opts.height / this.opts.maxY;

        this.baseDimensionG.setAttribute('transform', `scale(${scaleX},${scaleY})`);
    }

    rerenderTransfromY() {
        if (this.opts.scaleFactor === Number.NEGATIVE_INFINITY) {
            return this.verticalTransfromG.style.transform = '';
        }

        const scaleY = 1 / this.opts.scaleFactor;
        const translateY = (this.opts.scaleFactor - 1) * this.opts.maxY * scaleY;

        this.verticalTransfromG.style.transform = `translate(0,${translateY}px) scale(1,${scaleY})`;
    }

    rerenderTransformX() {
        const scaleX = 1 / (this.opts.intervalEnd - this.opts.intervalStart);
        const translateX = -this.opts.intervalStart * this.opts.maxX;

        this.horizontalTransformG.style.transform = ` scale(${scaleX},1) translate(${translateX}px,0)`;
    }

    _combine() {
        this.baseDimensionG.appendChild(this.horizontalTransformG);
        this.horizontalTransformG.appendChild(this.verticalTransfromG);
        this.verticalTransfromG.appendChild(this.bgG);

        this.chartContainerG.appendChild(this.beforeBgG);
        this.chartContainerG.appendChild(this.baseDimensionG);
        this.chartContainerG.appendChild(this.afterBgG);
        this.chartSvg.appendChild(this.chartContainerG);
    }
};
