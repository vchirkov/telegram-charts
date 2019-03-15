// primitive unique identifier
let id = 0;

module.exports.puid = function puid() {
    return id++;
};
