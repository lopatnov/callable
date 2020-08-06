export declare abstract class Callable<TResult> extends Function {
    _bound: any;
    constructor();
    abstract _call(...args: any[]): TResult;
}
export declare abstract class CallableByProxy<TResult> extends Function {
    constructor();
    abstract _call(...args: any[]): TResult;
}
export declare abstract class CallableByClosure<TResult> extends Function {
    constructor();
    abstract _call(...args: any[]): TResult;
}
export declare abstract class CallableByCallee<TResult> extends Function {
    constructor();
    abstract _call(...args: any[]): TResult;
}
