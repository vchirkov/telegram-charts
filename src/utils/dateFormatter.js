const MONTHS = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
};

module.exports.monthDay = function monthShortDay(ts) {
    const date = new Date(ts);
    return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
};
