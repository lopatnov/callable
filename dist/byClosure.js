(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.callable = factory());
}(this, (function () { 'use strict';

  class Callable extends Function {
      constructor() {
          super();
          var closure = function (...args) { return closure._call(...args); };
          return Object.setPrototypeOf(closure, new.target.prototype);
      }
  }

  return Callable;

})));
//# sourceMappingURL=byClosure.js.map
