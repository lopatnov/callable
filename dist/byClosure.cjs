'use strict';

class Callable extends Function {
    constructor() {
        super();
        const closure = function (...args) {
            return closure._call(...args);
        };
        return Object.setPrototypeOf(closure, new.target.prototype);
    }
}

module.exports = Callable;
//# sourceMappingURL=byClosure.cjs.map
