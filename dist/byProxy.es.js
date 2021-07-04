class Callable extends Function {
    constructor() {
        super();
        return new Proxy(this, {
            apply: (target, thisArg, args) => target._call(...args)
        });
    }
}

export default Callable;
//# sourceMappingURL=byProxy.es.js.map
