import {SVG_NS} from './constants';

const MASK_ID = 'nav_mask';

const DEFAULTS = {
    x: 0,
    y: 0,
    width: 600,
    height: 100,
    intervalStart: 0.8,
    intervalEnd: 1,
    minInterval: 0.1,
    overflowOpacity: 0.03
};

export class Navigation {
    constructor(opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);
        this.navG = this._getNavG();
        this.bgG = this._getBgG();
        this.overflowRect = this._getNavOverFlow();
        this.mask = this._getMask();

        this._combineSvg();
    }

    _combineSvg() {
        this.navG.appendChild(this.mask);
        this.navG.appendChild(this.bgG);
        this.navG.appendChild(this.overflowRect);
    }

    _getNavG() {
        const g = document.createElementNS(SVG_NS, 'g');

        g.setAttribute('class', 'nav');
        g.setAttribute('transform', `translate(${this.opts.x},${this.opts.y})`);

        return g;
    }

    _getBgG() {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'bg');
        return g;
    }

    _getMask() {
        const mask = document.createElementNS(SVG_NS, 'mask');
        mask.setAttribute('id', MASK_ID);
        mask.setAttribute('class', 'nav_mask');

        const rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('fill', '#fff');
        rect.setAttribute('width', this.opts.width);
        rect.setAttribute('height', this.opts.height);

        mask.appendChild(rect);

        return mask;
    }

    _getNavOverFlow() {
        const rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('fill', '#000');
        rect.setAttribute('fill-opacity', this.opts.overflowOpacity);
        rect.setAttribute('width', this.opts.width);
        rect.setAttribute('height', this.opts.height);
        rect.setAttribute('stroke-width', 0);

        return rect;
    }

    addToBackground(el) {
        if (!el) {
            return;
        }
        this.bgG.appendChild(el);
    }

    getRoot() {
        return this.navG;
    }
}
