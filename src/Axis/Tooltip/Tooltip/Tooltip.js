const {createHTMLElement, createSVGElement} = require('../../../utils/createElement');
const {DayMonthDate} = require('../../../utils/dateFormatter');

require('./tooltip.css');

DEFAULTS = {
    columns: [],
    x: [],
    index: -1,
    height: 0,
    intervalMaxY: 0,
    r: 5,
    strokeWidth: 2,
    boundContainer: null
};

module.exports.Tooltip = class Tooltip {
    constructor(opts) {
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.tooltipDiv = createHTMLElement('div', 'tooltip');
        this.tooltipDataContainerDiv = createHTMLElement('div', 'tooltip-data-container');
        this.dateDiv = createHTMLElement('div', 'tooltip-text');
        this.yDivsContainer = createHTMLElement('div', 'ys-data-container');
        this.yDivs = this._getYDivs();

        this.yLineContainerSvg = createSVGElement('svg', 'y-line-container', {
            'width': 2 * this.opts.r + this.opts.strokeWidth,
            'height': this.opts.height,
            'transform': `translate(${-this.opts.r - this.opts.strokeWidth / 2}, 0)`
        });
        this.yLine = createSVGElement('line', 'y-line', {
            'y1': 0,
            'y2': this.opts.height,
            'stroke-width': 1,
            'transform': `translate(${this.opts.r + this.opts.strokeWidth / 2}, 0)`
        });
        this.yCircles = this._getYCircles();

        this._combine();
    }

    getRoot() {
        return this.tooltipDiv;
    }

    update({index, intervalMaxY}) {
        if (intervalMaxY) {
            this.opts.intervalMaxY = intervalMaxY;
        }
        if (!Number.isInteger(index)) {
            return;
        }
        this.opts.index = index;
        this.rerender();
    }

    rerender() {
        this.dateDiv.innerText = DayMonthDate(this.opts.x[this.opts.index]);

        if (!this.opts.columns.find(({visible}) => visible)) {
            return this.tooltipDiv.style.display = visible ? '' : 'none';
        }

        this.opts.columns.forEach(({id, y, visible}) => {
            const translateY = (1 - y[this.opts.index] / this.opts.intervalMaxY) * this.opts.height - this.opts.r;

            this.yDivs[id].style.display = visible ? '' : 'none';
            this.yCircles[id].style.display = visible ? '' : 'none';

            this.yCircles[id].style.transform = `translate(0, ${translateY}px)`;
            this.yDivs[id].__setVal(y[this.opts.index]);
        });

        if (this.opts.boundContainer) {
            this.tooltipDataContainerDiv.style.transform = '';

            const {left, right} = this.tooltipDataContainerDiv.getBoundingClientRect();
            const boundRect = this.opts.boundContainer.getBoundingClientRect();

            if (left < boundRect.left) {
                this.tooltipDataContainerDiv.style.transform = `translate(${boundRect.left - left}px,0)`;
            } else if (right > boundRect.right) {
                this.tooltipDataContainerDiv.style.transform = `translate(${boundRect.right - right}px,0)`;
            }
        }
    }

    _combine() {
        this.yLineContainerSvg.appendChild(this.yLine);
        Object.values(this.yCircles).forEach(yCircle => this.yLineContainerSvg.appendChild(yCircle));

        this.tooltipDataContainerDiv.appendChild(this.dateDiv);
        this.tooltipDataContainerDiv.appendChild(this.yDivsContainer);
        Object.values(this.yDivs).forEach(yDiv => this.yDivsContainer.appendChild(yDiv));

        this.tooltipDiv.appendChild(this.yLineContainerSvg);
        this.tooltipDiv.appendChild(this.tooltipDataContainerDiv);
    }

    _getYDivs() {
        return this.opts.columns.reduce((yDivs, col) => {
            const yDataContainerDiv = createHTMLElement('div', 'y-data-container', {}, {
                color: col.color
            });

            const yDataNameDiv = createHTMLElement('div', 'y-data-name');
            const yDataValueDiv = createHTMLElement('div', 'y-data-value');

            yDataNameDiv.innerText = col.name;
            yDataContainerDiv.__setVal = val => yDataValueDiv.innerText = val;

            yDataContainerDiv.appendChild(yDataValueDiv);
            yDataContainerDiv.appendChild(yDataNameDiv);

            yDivs[col.id] = yDataContainerDiv;
            return yDivs;
        }, {});
    }

    _getYCircles() {
        const pos = this.opts.r + this.opts.strokeWidth / 2;
        return this.opts.columns.reduce((yCircles, col) => {
            yCircles[col.id] = createSVGElement('circle', 'y-circle', {
                'stroke': col.color,
                'stroke-width': 2,
                'fill': '#fff',
                'r': this.opts.r,
                'cx': pos,
                'cy': pos
            });

            return yCircles;
        }, {});
    }
};
