export abstract class Callable<TResult> extends Function {
  _bound: any;
  constructor() {
    super('...args', 'return this._bound._call(...args)')
    this._bound = this.bind(this)
    return this._bound;
  }

  abstract _call(...args: any[]): TResult;
}

export abstract class CallableByProxy<TResult> extends Function {
  constructor() {
    super()
    return new Proxy(this, {
      apply: (target, thisArg, args) => target._call(...args)
    })
  }

  abstract _call(...args: any[]): TResult;
}

export abstract class CallableByClosure<TResult> extends Function {
  constructor() {
    super();
    var closure: any = function(...args: any[]) { return closure._call(...args) }
    return Object.setPrototypeOf(closure, new.target.prototype)
  }

  abstract _call(...args: any[]): TResult;
}

export abstract class CallableByCallee<TResult> extends Function {
  constructor() {
    super('return arguments.callee._call.apply(arguments.callee, arguments)');
  }

  abstract _call(...args: any[]): TResult;
}