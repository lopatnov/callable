export abstract class Callable<TResult> extends Function {
  constructor() {
    super('return arguments.callee._call.apply(arguments.callee, arguments)');
  }

  abstract _call(args: any[]): TResult;
}
