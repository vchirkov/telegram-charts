const DAYS_SHORT = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
];

const MONTHS_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

module.exports.monthDate = function monthDate(ts) {
    const date = new Date(ts);
    return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
};

module.exports.DayMonthDate = function monthDate(ts) {
    const date = new Date(ts);
    return `${DAYS_SHORT[date.getDay()]}, ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
};
