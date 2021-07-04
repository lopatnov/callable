class Callable extends Function {
    constructor() {
        super('...args', 'return this._bound._call(...args)');
        this._bound = this.bind(this);
        return this._bound;
    }
}

export default Callable;
//# sourceMappingURL=byBind.es.js.map
