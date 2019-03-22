const DEBOUNCE_DURRATION = 200;

module.exports.debounce = function debounce(fn, ms = DEBOUNCE_DURRATION) {
    let timeout = null;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(context, args), ms)
    }
};


