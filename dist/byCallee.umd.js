(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.callable = factory());
})(this, (function () { 'use strict';

    /**
     * Abstract base class that makes subclass instances callable as functions.
     *
     * **Mechanism:** Passes a function body string to `new Function(...)` that
     * references `arguments.callee` to locate the callable instance and delegate
     * to its `_call` method. Because `new Function(...)` always produces a
     * non-strict function, `arguments.callee` is available even when the caller
     * is in strict mode.
     *
     * **Characteristics:** Does **not** work in environments that fully forbid
     * `arguments.callee` at the engine level (rare). No Proxy or prototype
     * mutation required.
     *
     * @example
     * ```ts
     * class Adder extends CallableByCallee<number> {
     *   _call(a: number, b: number): number {
     *     return a + b;
     *   }
     * }
     * const add = new Adder();
     * add(3, 4); // 7
     * ```
     *
     * @typeParam TResult - The return type of the callable instance.
     */
    class Callable extends Function {
        constructor() {
            super("return arguments.callee._call.apply(arguments.callee, arguments)");
        }
    }

    return Callable;

}));
//# sourceMappingURL=byCallee.umd.js.map
