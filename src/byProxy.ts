/**
 * Abstract base class that makes subclass instances callable as functions.
 *
 * **Mechanism:** Wraps `this` in an ES6 `Proxy` with an `apply` trap that
 * delegates invocations to the `_call` method. The Proxy is transparent to
 * all other operations (property access, `instanceof`, etc.).
 *
 * **Characteristics:** Works in strict mode. Requires ES6 Proxy support
 * (cannot be polyfilled). No prototype mutation is needed.
 *
 * @example
 * ```ts
 * class Toggle extends CallableByProxy<boolean> {
 *   _call(b: boolean): boolean {
 *     return !b;
 *   }
 * }
 * const toggle = new Toggle();
 * toggle(false); // true
 * ```
 *
 * @typeParam TResult - The return type of the callable instance.
 */
export default abstract class Callable<TResult> extends Function {
  constructor() {
    super();
    return new Proxy(this, {
      apply: (target, thisArg, args) => target._call(...args)
    });
  }

  /**
   * Called when the instance is invoked as a function.
   * Must be implemented by subclasses.
   */
  abstract _call(...args: any[]): TResult;
}
