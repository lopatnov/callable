export default abstract class Callable<TResult> extends Function {
    constructor();
    abstract _call(...args: any[]): TResult;
}
