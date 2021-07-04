class Callable extends Function {
    constructor() {
        super();
        var closure = function (...args) { return closure._call(...args); };
        return Object.setPrototypeOf(closure, new.target.prototype);
    }
}

export default Callable;
//# sourceMappingURL=byClosure.es.js.map
