const {SimpleEventEmitter} = require('../utils/SimpleEventEmitter');
const {createSVGElement} = require('../utils/createElement');
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
    overflowOpacity: 0.04,
    controlsOpacity: 0.12,
    color: '#30A3F0',
    maxY: 0,
    maxX: 0,
    padding: 2,
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
 *  @event Navigation.ON_INTERVAL_CHANGE_PAUSE
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
        this.scaleContainerG = this._getScaleContainerG();
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
        this.rerenderNavigation();
        this.rerenderBaseDimensions();
    }

    rerenderNavigation() {
        this.rerenderNavControls();
        this.rerenderNavRect();
    }

    rerenderTransform() {
        if (this.opts.scaleFactor === 1 || this.opts.scaleFactor === Number.NEGATIVE_INFINITY) {
            return this.scaleContainerG.style.transform = '';
        }

        const scaleY = 1 / this.opts.scaleFactor;
        const translateY = (this.opts.scaleFactor - 1) * this.opts.height * scaleY;

        this.scaleContainerG.style.transform = `translate(0,${translateY}px) scale(1,${scaleY}) `;
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

    rerenderBaseDimensions() {
        const scaleX = this.opts.width / this.opts.maxX;
        const scaleY = this.opts.height / this.opts.maxY;

        this.bgG.style.transform = `scale(${scaleX},${scaleY})`;
    }

    _combine() {
        this.navMask.appendChild(this.navMaskRectG);

        this.navControlsG.appendChild(this.navRect);
        this.navControlsG.appendChild(this.startControlRect);
        this.navControlsG.appendChild(this.endControlRect);

        this.bgContainerG.appendChild(this.scaleContainerG);
        this.scaleContainerG.appendChild(this.bgG);

        this.navSvg.appendChild(this.navMask);
        this.navSvg.appendChild(this.bgContainerG);
        this.navSvg.appendChild(this.navControlsG);
    }

    _getNavSvg() {
        return createSVGElement('svg', 'nav', {
            'width': this.opts.width,
            'height': this.opts.height
        });
    }

    _getBgContainerG() {
        const padding = this.opts.padding + this.opts.controlBorderWidth;
        const scaleY = 1 - 2 * padding / this.opts.height;
        return createSVGElement('g', 'bg-container', {
            'transform': `scale(1,${scaleY}) translate(0, ${padding})`
        });
    }

    _getScaleContainerG() {
        return createSVGElement('g', 'scale-container animate-t');
    }

    _getBgG() {
        return createSVGElement('g', 'bg');
    }

    _getMask() {
        const mask = createSVGElement('mask', 'nav-mask', {
            'id': this.maskId,
            'x': 0,
            'y': 0,
            'width': this.opts.width,
            'height': this.opts.height
        });

        const rect = createSVGElement('rect', 'mask-overflow', {
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
        const g = createSVGElement('g', 'mask-window-container');

        const outerRect = createSVGElement('rect', 'mask-window-border', {
            'x': 0,
            'y': 0,
            'width': this.opts.width,
            'height': this.opts.height,
            'fill': '#fff'
        });

        const innerRect = createSVGElement('rect', 'mask-window', {
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
        const g = createSVGElement('g', 'nav-controls-container');

        const rect = createSVGElement('rect', 'mask-carrier', {
            'x': 0,
            'y': 0,
            'fill': this.opts.color,
            'fill-opacity': this.opts.controlsOpacity,
            'width': this.opts.width,
            'height': this.opts.height,
            'mask': `url(#${this.maskId})`
        });

        g.appendChild(rect);

        return g;
    }

    _getNavControl(typeClassName = '') {
        return createSVGElement('rect', `nav-control ${typeClassName}`, {
            'x': 0,
            'y': this.opts.controlBorderWidth,
            'height': this.opts.height - 2 * this.opts.controlBorderWidth,
            'width': this.opts.controlWidth,
            'fill': this.opts.color,
            'fill-opacity': this.opts.controlsOpacity,
            'stroke-width': this.opts.controlBorderWidth * 2,
            'stroke-opacity': 0,
            'cursor': 'pointer'
        });
    }

    _getNavRect() {
        const rect = createSVGElement('rect', 'nav-control nav-move-control', {
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
            this.rerenderNavigation();
        }, () => this._emitIntervalChangePause());

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
            this.rerenderNavigation();
        }, () => this._emitIntervalChangePause());

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
            this.rerenderNavigation();
        }, () => this._emitIntervalChangePause());

        return rect;
    }

    _emitIntervalChange() {
        this.emit(Navigation.ON_INTERVAL_CHANGE, {
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd
        });
    }

    _emitIntervalChangePause() {
        this.emit(Navigation.ON_INTERVAL_CHANGE_PAUSE, {
            intervalStart: this.opts.intervalStart,
            intervalEnd: this.opts.intervalEnd
        });
    }
}

Navigation.ON_INTERVAL_CHANGE = 'ON_INTERVAL_CHANGE';
Navigation.ON_INTERVAL_CHANGE_PAUSE = 'ON_INTERVAL_CHANGE_PAUSE';

module.exports.Navigation = Navigation;
