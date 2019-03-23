const {createSVGElement, createHTMLElement} = require('../../../utils/createElement');
const {AxisBase} = require('../../AxisBase');

require('./tooltip-renderer.css');

const DEFAULTS = {
    height: 0,
    width: 0,
    max: 0,
    intervalStart: 0,
    intervalEnd: 1,
    className: '',
    transformAsAttribute: true
};

module.exports.TooltipRenderer = class TooltipRenderer extends AxisBase {
    constructor(opts, tooltip) {
        super({}, [
                (tick) => this._getTooltipHoverTrigger(tick)
            ],
            (tick, intervalStart, intervalEnd) => this._getTickTransform(tick, intervalStart, intervalEnd));

        this.opts = Object.assign({}, DEFAULTS, opts);
        this.tooltipRendererG = this._getTooltipRendererG();
        this.tooltipCarrierDiv = this._getTooltipCarrierDiv();
        this.tooltip = tooltip;

        this._listenToChangeEvents();
        this._combine();
    }

    _listenToChangeEvents() {
        this.on(AxisBase.ON_NEW_TICK_GENERATED, ([textG]) => this.tooltipRendererG.appendChild(textG));
        this.tooltipRendererG.addEventListener('mouseleave', () => this.tooltipCarrierDiv.style.display = '');
    }

    async update({intervalStart = this.opts.intervalStart, intervalEnd = this.opts.intervalEnd}) {
        if (this.opts.intervalStart === intervalStart &&
            this.opts.intervalEnd === intervalEnd) {
            return;
        }

        return this.rerender(intervalStart, intervalEnd, false);
    }

    getRoot() {
        return this.tooltipRendererG;
    }

    _combine() {
        this.tooltipCarrierDiv.appendChild(this.tooltip.getRoot());
        document.body.appendChild(this.tooltipCarrierDiv);
    }

    _getTicksRange(intervalStart = this.opts.intervalStart, intervalEnd = this.opts.intervalEnd) {
        const start = (this.opts.max * intervalStart | 0) + 1;
        const end = (this.opts.max * intervalEnd | 0) + 1;
        return Array.from(Array(end - start), (x, index) => {
            return (start + index);
        });
    }

    _getTooltipRendererG() {
        return createSVGElement('g', 'tooltip-renderer-container');
    }

    _getTooltipCarrierDiv() {
        return createHTMLElement('div', 'tooltip-carrier');
    }

    _getTooltipHoverTrigger(tick) {
        const trigger = createSVGElement('rect', 'tooltip-renderer-trigger', {
            'width': 1,
            'height': this.opts.height,
            'fill-opacity': 0
        });

        trigger.addEventListener('mouseenter', ({target}) => {
            const {top, left} = this._getTriggerOffset(target);

            this.tooltipCarrierDiv.style.display = 'block';
            this.tooltipCarrierDiv.style.top = top + 'px';
            this.tooltipCarrierDiv.style.left = left + 'px';
            this.tooltip.update({index: tick});
        });

        return trigger;
    }

    _getTickTransform(tick, intervalStart, intervalEnd) {
        const translateX = (tick / this.opts.max - intervalStart) / (intervalEnd - intervalStart) * this.opts.width;
        const scale = 1 / (this.opts.max * (intervalEnd - intervalStart)) * this.opts.width;
        return `translate(${translateX - scale / 2},0) scale(${scale}, 1)`;
    }

    _getTriggerOffset(trigger) {
        const {top, left, width} = trigger.getBoundingClientRect();
        const {clientTop, clientLeft} = document.documentElement;

        return {
            top: top + window.pageYOffset - clientTop,
            left: left + window.pageXOffset - clientLeft + width / 2
        };
    }
};
