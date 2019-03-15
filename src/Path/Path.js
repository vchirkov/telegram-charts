const {createSvgElement} = require('../utils/createElement');
const {pathDMaxY} = require('../utils/pathD');

const DEFAULTS = {
    d: '',
    x: [],
    y: [],
    minY: 0,
    maxY: 0,
    minX: 0,
    maxX: 0,
    name: '',
    color: '#000',
    strokeWidth: 2,
    width: 600,
    height: 400,
    visible: true
};

module.exports.Path = class Path {
    constructor(id, opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.id = id;
        this.opts.minX = this.opts.minX || this.opts.x[0];
        this.opts.maxX = this.opts.maxX || this.opts.x[this.opts.x.length - 1];
        this.opts.d = this.opts.d || pathDMaxY(this.opts.x, this.opts.y, this.opts.maxY);

        this.pathG = this._getPathG();
        this.path = this._getPath();

        this.rerender();

        this._combine();
    }

    getRoot() {
        return this.pathG;
    }

    update({visible}) {
        this.opts.visible = visible;
        this.rerenderVisibility();
    }

    rerender() {
        this.rerenderVisibility();
        this.rerenderTransform();
    }

    rerenderVisibility() {
        if (this.opts.visible) {
            this.path.style.opacity = 1;
        } else {
            this.path.style.opacity = 0;
        }
    }

    rerenderTransform() {
        const scaleX = this.opts.width / (this.opts.maxX - this.opts.minX);
        const scaleY = this.opts.height / (this.opts.maxY - this.opts.minY);

        this.path.style.transform = `scale(${scaleX},${scaleY}) translate(-${this.opts.minX}px,0)`;

    }

    _combine() {
        this.pathG.appendChild(this.path);
    }

    _getPath() {
        return createSvgElement('path', 'y-path animate-opacity', {
            'fill': 'none',
            'vector-effect': 'non-scaling-stroke',
            'd': this.opts.d,
            'stroke-width': this.opts.strokeWidth,
            'stroke': this.opts.color
        });
    }

    _getPathG() {
        return createSvgElement('g', 'y-path-container');
    }
};
