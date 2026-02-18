class Callable extends Function {
    constructor() {
        super();
        return new Proxy(this, {
            apply: (target, thisArg, args) => target._call(...args)
        });
    }
}

export { Callable as default };
//# sourceMappingURL=byProxy.esm.mjs.map
