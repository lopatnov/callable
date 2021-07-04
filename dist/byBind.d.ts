export default abstract class Callable<TResult> extends Function {
    _bound: any;
    constructor();
    abstract _call(...args: any[]): TResult;
}
