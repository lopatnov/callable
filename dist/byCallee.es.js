class Callable extends Function {
    constructor() {
        super('return arguments.callee._call.apply(arguments.callee, arguments)');
    }
}

export default Callable;
//# sourceMappingURL=byCallee.es.js.map
