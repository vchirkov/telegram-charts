const {createSvgElement} = require('../utils/createElement');
const {pathD} = require('../utils/pathD');

const DEFAULTS = {
    d: '',
    x: [],
    y: [],
    height: 0,
    name: '',
    color: '#000',
    strokeWidth: 2,
    visible: true
};

module.exports.Path = class Path {
    constructor(id, opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.id = id;
        this.opts.d = this.opts.d || pathD(this.opts.x, this.opts.y, this.opts.height);

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
    }

    rerenderVisibility() {
        if (this.opts.visible) {
            this.path.style.opacity = 1;
        } else {
            this.path.style.opacity = 0;
        }
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
