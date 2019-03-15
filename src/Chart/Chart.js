const {createSvgElement} = require('../utils/createElement');

const DEFAULTS = {
    width: 600,
    height: 400,
    scaleFactor: 1,
    intervalStart: 0,
    intervalEnd: 1
};

module.exports.Chart = class Chart {
    constructor(opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.chartSvg = this._getChartSvg();
        this.verticalTransfromG = this._getVerticalTransformG();
        this.horizontalTransformG = this._getHorizontalTransformG();

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
            this.opts.intervalStart = intervalStart;
            this.opts.intervalEnd = intervalEnd;
            this.rerenderTransformX();
        }
        if (scaleFactor) {
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
    }

    rerenderTransfromY() {
        if (this.opts.scaleFactor === Number.NEGATIVE_INFINITY) {
            return this.verticalTransfromG.style.transform = '';
        }

        const scaleY = 1 / this.opts.scaleFactor;
        const translateY = (this.opts.scaleFactor - 1) * this.opts.height * scaleY;

        this.verticalTransfromG.style.transform = `translate(0,${translateY}px) scale(1,${scaleY})`;
    }

    rerenderTransformX() {
        const scaleX = 1 / (this.opts.intervalEnd - this.opts.intervalStart);
        const translateX = -this.opts.intervalStart * this.opts.width;

        this.horizontalTransformG.style.transform = `scale(${scaleX},1) translate(${translateX}px,0)`;
    }

    _combine() {
        this.horizontalTransformG.appendChild(this.verticalTransfromG);
        this.verticalTransfromG.appendChild(this.beforeBgG);
        this.verticalTransfromG.appendChild(this.bgG);
        this.verticalTransfromG.appendChild(this.afterBgG);


        this.chartSvg.appendChild(this.horizontalTransformG);
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

    _getBeforeBgG() {
        return createSvgElement('g', 'before-bg');
    }

    _getAfterBgG() {
        return createSvgElement('g', 'after-bg');
    }

    _getVerticalTransformG() {
        return createSvgElement('g', 'vertical-transform animate-transform');
    }

    _getHorizontalTransformG() {
        return createSvgElement('g', 'horizontal-transform');
    }
};
