export default abstract class Callable<TResult> extends Function {
  constructor() {
    super();
    const closure: any = function (...args: any[]) {
      return closure._call(...args);
    };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }

  abstract _call(...args: any[]): TResult;
}
