(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.callable = {}));
}(this, (function (exports) { 'use strict';

  class Callable extends Function {
      constructor() {
          super('...args', 'return this._bound._call(...args)');
          this._bound = this.bind(this);
          return this._bound;
      }
  }
  class CallableByProxy extends Function {
      constructor() {
          super();
          return new Proxy(this, {
              apply: (target, thisArg, args) => target._call(...args)
          });
      }
  }
  class CallableByClosure extends Function {
      constructor() {
          super();
          var closure = function (...args) { return closure._call(...args); };
          return Object.setPrototypeOf(closure, new.target.prototype);
      }
  }
  class CallableByCallee extends Function {
      constructor() {
          super('return arguments.callee._call.apply(arguments.callee, arguments)');
      }
  }

  exports.Callable = Callable;
  exports.CallableByCallee = CallableByCallee;
  exports.CallableByClosure = CallableByClosure;
  exports.CallableByProxy = CallableByProxy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=callable.js.map
