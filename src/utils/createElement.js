const SVG_NS = "http://www.w3.org/2000/svg";

module.exports.createSvgElement = function createSvgElement(tag = 'g', className, attrs, style) {
    return fillWithAttrs(document.createElementNS(SVG_NS, tag), className, attrs, style);
};

module.exports.createHTMLElement = function createHTMLElement(tag = 'div', className, attrs, style) {
    return fillWithAttrs(document.createElement(tag), className, attrs);
};

function fillWithAttrs(el, className = '', attrs = {}, style = {}) {
    if (className) {
        el.setAttribute('class', className);
    }

    for (const key in attrs) {
        el.setAttribute(key, attrs[key]);
    }

    Object.assign(el.style, style);

    return el;
}

