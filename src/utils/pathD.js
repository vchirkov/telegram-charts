module.exports.pathDMaxY = function pathDMaxY(x, y, maxY) {
    // assumption: x.length > 0
    // assumption: x.length === y.length
    // assumption: y[i] > 0 (i:0 - y.length)
    let d = `M ${x[0]} ${maxY - y[0]}`;
    let i = 1;
    while (i < x.length) {
        d += ` L ${x[i]} ${maxY - y[i]}`;
        i++;
    }
    return d;
};
