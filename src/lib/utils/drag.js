const {debounce} = require('./debounce');
const noop = () => undefined;

const MOUSE = {
    start: 'mousedown',
    move: 'mousemove',
    end: ['mouseup']
};

const TOUCH = {
    start: 'touchstart',
    move: 'touchmove',
    end: ['touchend', 'touchcancel']
};

function getCoordinates(e) {
    if (e.touches && e.touches[0]) {
        return {pageX, pageY} = e.touches[0];
    } else {
        return {pageX, pageY} = e;
    }
}

module.exports.drag = function drag(el, cbChange = noop, cbPause = noop, cbEnd = noop) {
    el.addEventListener(MOUSE.start, listen(MOUSE));
    if ('ontouchstart' in document.documentElement) {
        el.addEventListener(TOUCH.start, listen(TOUCH));
    }

    function listen({move, end}) {
        return function ondown(e) {
            e.preventDefault();

            const {pageX, pageY} = getCoordinates(e);
            let x = pageX;
            let y = pageY;
            let xPause = pageX;
            let yPause = pageY;

            let onmove = (e) => {
                e.preventDefault();

                const {pageX, pageY} = getCoordinates(e);
                cbChange(pageX - x, pageY - y);
                x = pageX;
                y = pageY;
            };

            let onmovePause = debounce((e) => {
                e.preventDefault();

                const {pageX, pageY} = getCoordinates(e);
                cbPause(pageX - xPause, pageY - yPause);
                xPause = pageX;
                yPause = pageY;
            }, 15);

            let onend = () => {
                e.preventDefault();

                document.removeEventListener(move, onmove);
                document.removeEventListener(move, onmovePause);
                end.forEach(e => document.removeEventListener(e, onend));

                cbEnd();
            };

            document.addEventListener(move, onmove);
            document.addEventListener(move, onmovePause);
            end.forEach(e => document.addEventListener(e, onend));
        }
    }
};
