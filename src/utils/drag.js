const {debounce} = require('./debounce');
const noop = () => {
};

module.exports.drag = function drag(el, cbChange = noop, cbPause = noop, cbEnd = noop) {
    el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        let x = e.pageX;
        let y = e.pageY;
        let xPause = e.pageX;
        let yPause = e.pageY;

        let onmousemove = (e) => {
            e.preventDefault();

            cbChange(e.pageX - x, e.pageY - y);
            x = e.pageX;
            y = e.pageY;
        };

        let onmousemovePause = debounce((e) => {
            e.preventDefault();

            cbPause(e.pageX - xPause, e.pageY - yPause);
            xPause = e.pageX;
            yPause = e.pageY;
        }, 100);

        let onmouseup = (e) => {
            e.preventDefault();
            document.removeEventListener('mousemove', onmousemove);
            document.removeEventListener('mousemove', onmousemovePause);
            document.removeEventListener('mouseup', onmouseup);

            cbEnd();
        };

        document.addEventListener('mousemove', onmousemove);
        document.addEventListener('mousemove', onmousemovePause);
        document.addEventListener('mouseup', onmouseup);
    });
};
