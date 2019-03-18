const {debounce} = require('./debounce');
const noop = () => {
};

module.exports.drag = function drag(el, cbChange = noop, cbEnd = noop) {
    el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        let x = e.pageX;
        let y = e.pageY;

        let onmousemove = (e) => {
            e.preventDefault();

            cbChange(e.pageX - x, e.pageY - y);
            x = e.pageX;
            y = e.pageY;
        };

        let onmouseup = (e) => {
            e.preventDefault();
            document.removeEventListener('mousemove', onmousemove);
            document.removeEventListener('mouseup', onmouseup);

            cbEnd();
        };

        document.addEventListener('mousemove', onmousemove);
        document.addEventListener('mouseup', onmouseup);
    });
};
