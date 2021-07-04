export default abstract class Callable<TResult> extends Function {
  _bound: any;
  constructor() {
    super('...args', 'return this._bound._call(...args)');
    this._bound = this.bind(this)
    return this._bound;
  }

  abstract _call(...args: any[]): TResult;
}