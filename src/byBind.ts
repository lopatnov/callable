/**
 * Abstract base class that makes subclass instances callable as functions.
 *
 * **Mechanism:** Uses `Function.prototype.bind` to create a bound wrapper
 * that delegates invocations to the `_call` method. The bound function's
 * `[[Prototype]]` is automatically set to the subclass prototype by the
 * JavaScript engine, so `instanceof` checks work correctly without a Proxy.
 *
 * **Characteristics:** Works in strict mode. Does not modify the prototype
 * chain manually.
 *
 * @example
 * ```ts
 * class Greeter extends CallableByBind<string> {
 *   _call(name: string): string {
 *     return `Hello, ${name}!`;
 *   }
 * }
 * const greet = new Greeter();
 * greet("World"); // "Hello, World!"
 * ```
 *
 * @typeParam TResult - The return type of the callable instance.
 */
export default abstract class Callable<TResult> extends Function {
  /** @internal */
  _bound: any;

  constructor() {
    super("...args", "return this._bound._call(...args)");
    this._bound = this.bind(this);
    return this._bound;
  }

  /**
   * Called when the instance is invoked as a function.
   * Must be implemented by subclasses.
   */
  abstract _call(...args: any[]): TResult;
}
