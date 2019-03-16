const {createSvgElement} = require('../utils/createElement');

const DEFAULTS = {
    width: 600,
    height: 400,
    scaleFactor: 1,
    intervalStart: 0,
    intervalEnd: 1,
    maxY: 0,
    maxX: 0
};

module.exports.Chart = class Chart {
    constructor(opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.chartSvg = this._getChartSvg();
        this.verticalTransfromG = this._getVerticalTransformG();
        this.horizontalTransformG = this._getHorizontalTransformG();

        this.baseDimensionG = this._getBaseDimensionG();
        this.bgG = this._getBgG();
        this.beforeBgG = this._getBeforeBgG();
        this.afterBgG = this._getAfterBgG();

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

    rerender() {
        this.rerenderTransformX();
        this.rerenderTransfromY();
        this.rerenderBaseDimensions()
    }

    rerenderBaseDimensions() {
        const scaleX = this.opts.width / this.opts.maxX;
        const scaleY = this.opts.height / this.opts.maxY;

        this.baseDimensionG.style.transform = `scale(${scaleX},${scaleY})`;
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

        this.chartSvg.appendChild(this.beforeBgG);
        this.chartSvg.appendChild(this.baseDimensionG);
        this.chartSvg.appendChild(this.afterBgG);
    }

    _getChartSvg() {
        return createSvgElement('svg', 'chart', {
            'width': this.opts.width,
            'height': this.opts.height
        });
    }

    _getBgG() {
        return createSvgElement('g', 'bg');
    }

    _getBaseDimensionG() {
        return createSvgElement('g', 'base-dimension');
    }

    _getBeforeBgG() {
        return createSvgElement('g', 'before-bg');
    }

    _getAfterBgG() {
        return createSvgElement('g', 'after-bg');
    }

    _getVerticalTransformG() {
        return createSvgElement('g', 'vertical-transform animate-t');
    }

    _getHorizontalTransformG() {
        return createSvgElement('g', 'horizontal-transform');
    }
};
