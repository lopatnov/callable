'use strict';

class Callable extends Function {
    constructor() {
        super("return arguments.callee._call.apply(arguments.callee, arguments)");
    }
}

module.exports = Callable;
//# sourceMappingURL=byCallee.cjs.map
