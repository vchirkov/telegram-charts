const {SimpleEventEmitter} = require('../utils/SimpleEventEmitter');
const {createSvgElement} = require('../utils/createElement');
const {drag} = require('../utils/drag');
const {puid} = require('../utils/puid');

const MASK_ID = 'nav-mask';

const DEFAULTS = {
    width: 600,
    height: 100,
    scaleFactor: 1,
    controlWidth: 8,
    controlBorderWidth: 2,
    intervalStart: 0.8,
    intervalEnd: 1,
    minInterval: 0.1,
    overflowOpacity: 0.06,
    controlsOpacity: 0.2,
    navColor: '#339'
};

/**
 *
 *  @generates
 *      svg.nav[width={this.opts.width}][height={this.opts.height}]
 *          mask#nav-mask-${id}.nav-mask
 *              rect.mask-overflow
 *              g.mask-window-container
 *                  rect.mask-window-border
 *                  rect.mask-window
 *          g.bg-container
 *              g.bg
 *                  {this.addToBackground()}
 *          g.nav-controls-container
 *              rect.mask-carrier
 *              rect.nav-control.nav-move-control
 *              rect.nav-control.nav-start-control
 *              rect.nav-control.nav-end-control
 *
 *  @event Navigation.ON_INTERVAL_CHANGE
 *  @event Navigation.ON_INTERVAL_CHANGE_END
 *
 *  @method getRoot(): rootElement
 *  @method update({scaleFactor}): void
 *  @method addToBackground(): el|false
 *  @method rerender(): void
 *  @method rerenderTransform(): void
 *  @method rerenderNavRect(): void
 *  @method rerenderNavControls(): void
 *
 */
class Navigation extends SimpleEventEmitter {
    constructor(opts) {
        super();
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.maskId = `${MASK_ID}-${puid()}`;

        this.navSvg = this._getNavSvg();
        this.bgContainerG = this._getBgContainerG();
        this.bgG = this._getBgG();
        this.navControlsG = this._getNavControlsG();
        this.navMask = this._getMask();
        this.navRect = this._getNavRect();
        this.navMaskRectG = this._getMaskRectG();
        this.startControlRect = this._getStartControl();
        this.endControlRect = this._getEndControl();

        this.rerender();

        this._combine();
    }

    getRoot() {
        return this.navSvg;
    }

    update({scaleFactor}) {
        this.opts.scaleFactor = scaleFactor;
        this.rerenderTransform();
    }

    addToBackground(el) {
        if (!el) {
            return false;
        }
        return this.bgG.appendChild(el);
    }

    rerender() {
        this.rerenderTransform();
        this.rerenderNavControls();
        this.rerenderNavRect();
    }

    rerenderTransform() {
        if (this.opts.scaleFactor === 1 || this.opts.scaleFactor === Number.NEGATIVE_INFINITY) {
            return this.bgG.style.transform = '';
        }

        const scaleY = 1 / this.opts.scaleFactor;
        const translateY = (this.opts.scaleFactor - 1) * this.opts.height * scaleY;

        this.bgG.style.transform = `translate(0,${translateY}px) scale(1,${scaleY}) `;
    }

    rerenderNavRect() {
        const scaleX = this.opts.intervalEnd - this.opts.intervalStart;
        const translateX = this.opts.intervalStart * this.opts.width;
        const transform = `translate(${translateX}px,0) scale(${scaleX},1)`;

        this.navRect.style.transform = transform;
        this.navMaskRectG.style.transform = transform;
    }

    rerenderNavControls() {
        const translateXStart = this.opts.intervalStart * this.opts.width;
        const translateXEnd = this.opts.intervalEnd * this.opts.width - this.opts.controlWidth;

        this.startControlRect.style.transform = `translate(${translateXStart}px,0)`;
        this.endControlRect.style.transform = `translate(${translateXEnd}px,0)`;
    }

    _combine() {
        this.navMask.appendChild(this.navMaskRectG);

        this.navControlsG.appendChild(this.navRect);
        this.navControlsG.appendChild(this.startControlRect);
        this.navControlsG.appendChild(this.endControlRect);

        this.bgContainerG.appendChild(this.bgG);

        this.navSvg.appendChild(this.navMask);
        this.navSvg.appendChild(this.bgContainerG);
        this.navSvg.appendChild(this.navControlsG);
    }

    _getNavSvg() {
        return createSvgElement('svg', 'nav', {
            'width': this.opts.width,
            'height': this.opts.height
        });
    }

    _getBgContainerG() {
        const scaleY = 1 - 2 * this.opts.controlBorderWidth / this.opts.height;
        return createSvgElement('g', 'bg-container', {
            'transform': `translate(0, ${this.opts.controlBorderWidth}) scale(1,${scaleY})`
        });
    }

    _getBgG() {
        return createSvgElement('g', 'bg animate-transform');
    }

    _getMask() {
        const mask = createSvgElement('mask', 'nav-mask', {
            'id': this.maskId,
            'x': 0,
            'y': 0,
            'width': this.opts.width,
            'height': this.opts.height
        });

        const rect = createSvgElement('rect', 'mask-overflow', {
            'x': 0,
            'y': 0,
            'width': this.opts.width,
            'height': this.opts.height,
            'opacity': this.opts.overflowOpacity / this.opts.controlsOpacity,
            'fill': '#fff'
        });

        mask.appendChild(rect);

        return mask;
    }

    _getMaskRectG() {
        const g = createSvgElement('g', 'mask-window-container');

        const outerRect = createSvgElement('rect', 'mask-window-border', {
            'x': 0,
            'y': 0,
            'width': this.opts.width,
            'height': this.opts.height,
            'fill': '#fff'
        });

        const innerRect = createSvgElement('rect', 'mask-window', {
            'x': 0,
            'y': this.opts.controlBorderWidth,
            'width': this.opts.width,
            'height': this.opts.height - 2 * this.opts.controlBorderWidth,
            'fill': '#000'
        });

        g.appendChild(outerRect);
        g.appendChild(innerRect);

        return g;
    }

    _getNavControlsG() {
        const g = createSvgElement('g', 'nav-controls-container');

        const rect = createSvgElement('rect', 'mask-carrier', {
            'x': 0,
            'y': 0,
            'fill': this.opts.navColor,
            'fill-opacity': this.opts.controlsOpacity,
            'width': this.opts.width,
            'height': this.opts.height,
            'mask': `url(#${this.maskId})`
        });

        g.appendChild(rect);

        return g;
    }

    _getNavControl(typeClassName = '') {
        return createSvgElement('rect', `nav-control ${typeClassName}`, {
            'x': 0,
            'y': this.opts.controlBorderWidth,
            'height': this.opts.height - 2 * this.opts.controlBorderWidth,
            'width': this.opts.controlWidth,
            'fill': this.opts.navColor,
            'fill-opacity': this.opts.controlsOpacity,
            'stroke-width': this.opts.controlBorderWidth * 2,
            'stroke-opacity': 0,
            'cursor': 'pointer'
        });
    }

    _getNavRect() {
        const rect = createSvgElement('rect', 'nav-control nav-move-control', {
            'x': 0,
            'y': 0,
            'width': this.opts.width,
            'height': this.opts.height,
            'fill-opacity': 0,
            'cursor': 'pointer'
        });

        drag(rect, (x) => {
            if (!x) {
                return;
            }
            const diff = x / this.opts.width;
            const interval = this.opts.intervalEnd - this.opts.intervalStart;
            this.opts.intervalStart = Math.max(Math.min(this.opts.intervalStart + diff, 1 - interval), 0);
            this.opts.intervalEnd = Math.min(Math.max(this.opts.intervalEnd + diff, interval), 1);

            this._emitIntervalChange();
            this.rerender();
        }, () => this._emitIntervalChangeEnd());

        return rect;
    }

    _getStartControl() {
        const rect = this._getNavControl('nav-start-control');

        drag(rect, x => {
            if (!x) {
                return;
            }
            this.opts.intervalStart = this.opts.intervalStart + x / this.opts.width;
            this.opts.intervalStart = Math.max(this.opts.intervalStart, 0);
            this.opts.intervalStart = Math.min(this.opts.intervalStart, 1 - this.opts.minInterval);
            this.opts.intervalEnd = Math.max(this.opts.intervalEnd, this.opts.intervalStart + this.opts.minInterval);

            this._emitIntervalChange();
            this.rerender();
        }, () => this._emitIntervalChangeEnd());

        return rect;
    }

    _getEndControl() {
        const rect = this._getNavControl('nav-end-control');

        drag(rect, x => {
            if (!x) {
                return;
            }
            this.opts.intervalEnd = this.opts.intervalEnd + x / this.opts.width;
            this.opts.intervalEnd = Math.min(this.opts.intervalEnd, 1);
            this.opts.intervalEnd = Math.max(this.opts.intervalEnd, this.opts.minInterval);
            this.opts.intervalStart = Math.min(this.opts.intervalStart, this.opts.intervalEnd - this.opts.minInterval);

            this._emitIntervalChange();
            this.rerender();
        }, () => this._emitIntervalChangeEnd());

        return rect;
    }

    _emitIntervalChange() {
        this.emit(Navigation.ON_INTERVAL_CHANGE, {
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd
        });
    }

    _emitIntervalChangeEnd() {
        this.emit(Navigation.ON_INTERVAL_CHANGE_END, {
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd
        });
    }
}

Navigation.ON_INTERVAL_CHANGE = 'ON_INTERVAL_CHANGE';
Navigation.ON_INTERVAL_CHANGE_END = 'ON_INTERVAL_CHANGE_END';

module.exports.Navigation = Navigation;
