module.exports.SimpleEventEmitter = class SimpleEventEmitter {
    constructor() {
        this._listeners = new Map();
    }

    on(key, cb) {
        this._listeners.has(key) || this._listeners.set(key, []);
        this._listeners.get(key).push(cb);
    }

    off(key, cb) {
        let listeners = this._listeners.get(key),
            index;

        if (listeners && listeners.length) {
            index = listeners.reduce((i, listener, index) => {
                return (isFunction(listener) && listener === callback) ? index : i;
            }, -1);

            if (index > -1) {
                listeners.splice(index, 1);
                this._listeners.set(key, listeners);
                return true;
            }
        }
        return false;
    }

    emit(key, ...args) {
        let listeners = this._listeners.get(key);

        if (listeners && listeners.length) {
            listeners.forEach((listener) => listener(...args));
            return true;
        }
        return false;
    }
};
