const SVG_NS = "http://www.w3.org/2000/svg";

module.exports.createSvgElement = function createSvgElement(tag = 'g', className, attrs) {
    return fillWithAttrs(document.createElementNS(SVG_NS, tag), className, attrs);
};

module.exports.createHTMLElement = function createHTMLElement(tag = 'div', className, attrs) {
    return fillWithAttrs(document.createElement(tag), className, attrs);
};

function fillWithAttrs(el, className = '', attrs = {}) {
    if (className) {
        el.setAttribute('class', className);
    }

    for (const key in attrs) {
        el.setAttribute(key, attrs[key]);
    }

    return el;
}

