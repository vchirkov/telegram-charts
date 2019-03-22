module.exports.largeNumber = function largeNumber(number) {
    if (number / 1000000 > 10) {
        return ((number / 1000000) | 0) + 'M';
    } else if (number / 1000000 > 1) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number / 1000 > 10) {
        return ((number / 1000) | 0) + 'K';
    } else if (number / 1000 > 1) {
        return (number / 1000).toFixed(1) + 'K';
    }

    return number;
};
