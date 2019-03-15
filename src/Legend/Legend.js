const {createHTMLElement} = require('../utils/createElement');
const {SimpleEventEmitter} = require('../utils/SimpleEventEmitter');

require('./legend.css');

const DEFAULTS = {
    columns: []
};


/**
 *
 *  @generates
 *  div.legend
 *      div.legend-item[selected=true|false] (0-n)
 *          div.legend-item-icon-container[style="color:{col.color}"]
 *              i.legend-item-icon
 *          span.legend-item-name
 *              {col.name}
 *
 *  @event Legend ON_COL_TOGGLE - triggers on click, emits {col}
 *
 *  @method getRoot(): rootElement
 *  @method update(col): void
 *
 */
class Legend extends SimpleEventEmitter {
    constructor(opts) {
        super();
        this.opts = Object.assign({}, DEFAULTS, opts);

        this.legendDiv = this._getLegendDiv();
        this.legendItemDivsMap = this._getLegendItemsMap();

        this._combine();
    }

    getRoot() {
        return this.legendDiv;
    }

    update(col) {
        this.opts.columns.find(({id}) => id === col.id).visible = !!col.visible;
        this.legendItemDivsMap[col.id].setAttribute('selected', !!col.visible);
    }

    _combine() {
        Object.entries(this.legendItemDivsMap).forEach(([id, item]) => {
            this.legendDiv.appendChild(item)
        });
    }

    _getLegendDiv() {
        return createHTMLElement('div', 'legend', {});
    }

    _getLegendItemsMap() {
        return this.opts.columns.reduce((map, col) => {
            map[col.id] = this._getLegendItem(col);
            return map;
        }, {});
    }

    _getLegendItem(col) {
        const legendDiv = createHTMLElement('div', 'legend-item', {
            'selected': !!col.visible
        });

        const iconContainer = createHTMLElement('div', 'legend-item-icon-container', {
            'style': `color: ${col.color}`
        });

        const icon = createHTMLElement('i', 'legend-item-icon');

        const nameSpan = createHTMLElement('span', 'legend-item-name');

        nameSpan.innerText = col.name;

        legendDiv.addEventListener('click', () => this.emit(Legend.ON_COL_TOGGLE, col));

        iconContainer.appendChild(icon);

        legendDiv.appendChild(iconContainer);
        legendDiv.appendChild(nameSpan);

        return legendDiv;
    }
}

Legend.ON_COL_TOGGLE = 'ON_COL_TOGGLE';

module.exports.Legend = Legend;
