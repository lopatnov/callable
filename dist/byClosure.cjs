'use strict';

/**
 * Abstract base class that makes subclass instances callable as functions.
 *
 * **Mechanism:** Creates a plain closure function inside the constructor and
 * uses `Object.setPrototypeOf` to wire it into the subclass's prototype
 * chain. The closure captures a reference to itself and delegates calls to
 * the `_call` method.
 *
 * **Characteristics:** Works in strict mode. Modifies the prototype chain of
 * the returned object (`Object.setPrototypeOf` is called once per instance).
 * `instanceof` works correctly because the prototype is manually set.
 *
 * @example
 * ```ts
 * class Multiplier extends CallableByClosure<number> {
 *   constructor(private factor: number) {
 *     super();
 *   }
 *   _call(n: number): number {
 *     return n * this.factor;
 *   }
 * }
 * const triple = new Multiplier(3);
 * triple(7); // 21
 * ```
 *
 * @typeParam TResult - The return type of the callable instance.
 */
class Callable extends Function {
    constructor() {
        super();
        const closure = function (...args) {
            return closure._call(...args);
        };
        return Object.setPrototypeOf(closure, new.target.prototype);
    }
}

module.exports = Callable;
//# sourceMappingURL=byClosure.cjs.map
