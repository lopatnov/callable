(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.callable = factory());
}(this, (function () { 'use strict';

  class Callable extends Function {
      constructor() {
          super('...args', 'return this._bound._call(...args)');
          this._bound = this.bind(this);
          return this._bound;
      }
  }

  return Callable;

})));
//# sourceMappingURL=byBind.js.map
