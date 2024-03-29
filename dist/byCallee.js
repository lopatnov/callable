(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.callable = factory());
}(this, (function () { 'use strict';

  class Callable extends Function {
      constructor() {
          super('return arguments.callee._call.apply(arguments.callee, arguments)');
      }
  }

  return Callable;

})));
//# sourceMappingURL=byCallee.js.map
