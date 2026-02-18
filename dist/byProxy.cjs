'use strict';

class Callable extends Function {
    constructor() {
        super();
        return new Proxy(this, {
            apply: (target, thisArg, args) => target._call(...args)
        });
    }
}

module.exports = Callable;
//# sourceMappingURL=byProxy.cjs.map
