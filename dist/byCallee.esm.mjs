class Callable extends Function {
    constructor() {
        super("return arguments.callee._call.apply(arguments.callee, arguments)");
    }
}

export { Callable as default };
//# sourceMappingURL=byCallee.esm.mjs.map
