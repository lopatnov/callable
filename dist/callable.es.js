class Callable extends Function {
    constructor() {
        super('...args', 'return this._bound._call(...args)');
        this._bound = this.bind(this);
        return this._bound;
    }
}
class CallableByProxy extends Function {
    constructor() {
        super();
        return new Proxy(this, {
            apply: (target, thisArg, args) => target._call(...args)
        });
    }
}
class CallableByClosure extends Function {
    constructor() {
        super();
        var closure = function (...args) { return closure._call(...args); };
        return Object.setPrototypeOf(closure, new.target.prototype);
    }
}
class CallableByCallee extends Function {
    constructor() {
        super('return arguments.callee._call.apply(arguments.callee, arguments)');
    }
}

export { Callable, CallableByCallee, CallableByClosure, CallableByProxy };
//# sourceMappingURL=callable.es.js.map
