const DEBOUNCE_DURRATION = 100;

module.exports.debounce = function debounce(fn, ms = DEBOUNCE_DURRATION) {
    return (...args) => {
        if (!fn.debouncing) {
            fn.lastReturnVal = fn.apply(window, args);
            fn.debouncing = true;
        }
        clearTimeout(fn.debounceTimeout);
        fn.debounceTimeout = setTimeout(() => fn.debouncing = false, ms);
        return fn.lastReturnVal;
    }
};

// function debounce(fn, ms = DEBOUNCE_DURRATION) {
//
//     let timer = null;
//
//     return function (...args) {
//         const onComplete = () => {
//             fn.apply(this, args);
//             timer = null;
//         };
//
//         if (timer) {
//             clearTimeout(timer);
//         }
//
//         timer = setTimeout(onComplete, ms);
//     };
// }
