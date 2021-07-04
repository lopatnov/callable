(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.callable = factory());
}(this, (function () { 'use strict';

  class Callable extends Function {
      constructor() {
          super();
          return new Proxy(this, {
              apply: (target, thisArg, args) => target._call(...args)
          });
      }
  }

  return Callable;

})));
//# sourceMappingURL=byProxy.js.map
