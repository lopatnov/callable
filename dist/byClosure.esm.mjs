class Callable extends Function {
    constructor() {
        super();
        const closure = function (...args) {
            return closure._call(...args);
        };
        return Object.setPrototypeOf(closure, new.target.prototype);
    }
}

export { Callable as default };
//# sourceMappingURL=byClosure.esm.mjs.map
