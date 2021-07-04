export default abstract class Callable<TResult> extends Function {
  constructor() {
    super()
    return new Proxy(this, {
      apply: (target, thisArg, args) => target._call(...args)
    })
  }

  abstract _call(...args: any[]): TResult;
}