/**
 * Tests against the compiled dist files (CJS format).
 *
 * Verifies that:
 *   - Module exports are structured correctly (class constructor is the default export)
 *   - Instances are callable (typeof "function")
 *   - Arguments are forwarded to _call correctly
 *   - instanceof checks are preserved for all four implementations
 *   - `this` context inside _call is the callable instance
 *   - Instance fields (including constructor arguments) are accessible in _call
 *   - Multi-level inheritance works
 *   - TypeScript declaration files expose the correct generic types
 *
 * Ava has no moduleNameMapper, so imports use explicit ".cjs" extensions.
 * TypeScript resolves types from tests/dist-cjs.d.ts at compile time.
 */

import test from "ava";
import CallableByBind from "../dist/byBind.cjs";
import CallableByCallee from "../dist/byCallee.cjs";
import CallableByClosure from "../dist/byClosure.cjs";
import CallableByProxy from "../dist/byProxy.cjs";

// ---------------------------------------------------------------------------
// Shared suite — run for every implementation
// ---------------------------------------------------------------------------

// When a class extends a variable typed as `any`, TypeScript cannot trace the
// inheritance chain back to `Function` and therefore loses call signatures on
// instances.  We cast to `any` here so the helper compiles; the per-
// implementation sections below verify the correct TypeScript behaviour using
// the fully-typed imports.
function distSuite(label: string, Ctor: any): void {
  test(`${label} — exports a constructor function`, (t) => {
    t.is(typeof Ctor, "function");
  });

  test(`${label} — creates an instance that is callable (typeof 'function')`, (t) => {
    class Impl extends Ctor {
      _call(): string {
        return "ok";
      }
    }
    const x: any = new Impl();
    t.is(typeof x, "function");
  });

  test(`${label} — instance() invokes _call and returns its value`, (t) => {
    class Impl extends Ctor {
      _call(a: string): string {
        return `hello ${a}`;
      }
    }
    const x: any = new Impl();
    t.is(x("world"), "hello world");
  });

  test(`${label} — forwards multiple arguments to _call`, (t) => {
    class Impl extends Ctor {
      _call(a: number, b: number, c: number): number {
        return a + b + c;
      }
    }
    const x: any = new Impl();
    t.is(x(1, 2, 3), 6);
  });

  test(`${label} — x instanceof OwnClass is true`, (t) => {
    class Impl extends Ctor {
      _call(): void {}
    }
    const x: any = new Impl();
    t.true(x instanceof Impl);
  });

  test(`${label} — x instanceof base Callable class is true`, (t) => {
    class Impl extends Ctor {
      _call(): void {}
    }
    const x: any = new Impl();
    t.true(x instanceof Ctor);
  });

  test(`${label} — this inside _call refers to the callable instance`, (t) => {
    class Impl extends Ctor {
      tag = "context-marker";
      _call(): string {
        return this.tag;
      }
    }
    const x: any = new Impl();
    t.is(x(), "context-marker");
  });

  test(`${label} — instance fields set via constructor arguments are accessible in _call`, (t) => {
    class Impl extends Ctor {
      value: string;
      constructor(v: string) {
        super();
        this.value = v;
      }
      _call(): string {
        return this.value;
      }
    }
    const x: any = new Impl("dynamic");
    t.is(x(), "dynamic");
  });

  test(`${label} — state accumulates across successive calls`, (t) => {
    class Counter extends Ctor {
      private n = 0;
      _call(): number {
        return ++this.n;
      }
    }
    const counter: any = new Counter();
    t.is(counter(), 1);
    t.is(counter(), 2);
    t.is(counter(), 3);
  });

  test(`${label} — works across a multi-level inheritance chain`, (t) => {
    class Base extends Ctor {
      protected prefix = "base";
      _call(s: string): string {
        return `${this.prefix}:${s}`;
      }
    }
    class Child extends Base {
      protected prefix = "child";
    }
    const x: any = new Child();
    t.true(x instanceof Child);
    t.true(x instanceof Base);
    t.true(x instanceof Ctor);
    t.is(x("test"), "child:test");
  });

  test(`${label} — two independent instances do not share state`, (t) => {
    class Impl extends Ctor {
      private n = 0;
      _call(): number {
        return ++this.n;
      }
    }
    const a: any = new Impl();
    const b: any = new Impl();
    a();
    a();
    t.is(a(), 3);
    t.is(b(), 1);
  });
}

distSuite("dist/byBind.cjs", CallableByBind);
distSuite("dist/byCallee.cjs", CallableByCallee);
distSuite("dist/byClosure.cjs", CallableByClosure);
distSuite("dist/byProxy.cjs", CallableByProxy);

// ---------------------------------------------------------------------------
// TypeScript call-signature behaviour
//
// Subclasses of Callable that extend `Function` ARE callable in TypeScript —
// but only when the inheritance chain is explicit (not via an `any` variable).
// The tests below confirm this and serve as a compile-time regression guard.
// ---------------------------------------------------------------------------

test("TypeScript call-signature — CallableByBind subclass is callable without casting", (t) => {
  class Greeter extends CallableByBind<string> {
    _call(name: string): string {
      return `Hello, ${name}!`;
    }
  }
  const greet = new Greeter();
  // TypeScript knows `greet` is callable because Greeter → CallableByBind → Function.
  // If this line causes TS2349 the d.ts no longer exports `extends Function` properly.
  const result: string = greet("World");
  t.is(result, "Hello, World!");
});

test("TypeScript call-signature — CallableByCallee subclass is callable without casting", (t) => {
  class Adder extends CallableByCallee<number> {
    _call(a: number, b: number): number {
      return a + b;
    }
  }
  const add = new Adder();
  const result: number = add(3, 4);
  t.is(result, 7);
});

test("TypeScript call-signature — CallableByClosure subclass is callable without casting", (t) => {
  class Multiplier extends CallableByClosure<number> {
    constructor(private factor: number) {
      super();
    }
    _call(n: number): number {
      return n * this.factor;
    }
  }
  const triple = new Multiplier(3);
  const result: number = triple(7);
  t.is(result, 21);
});

test("TypeScript call-signature — CallableByProxy subclass is callable without casting", (t) => {
  class Toggle extends CallableByProxy<boolean> {
    _call(b: boolean): boolean {
      return !b;
    }
  }
  const toggle = new Toggle();
  const result: boolean = toggle(false);
  t.true(result);
});

test("TypeScript call-signature — generic TResult is preserved", (t) => {
  class Stringify extends CallableByBind<string> {
    _call(n: number): string {
      return String(n);
    }
  }
  const str = new Stringify();
  // `str(42)` returns `string`; next line would fail tsc if TResult were `any`
  const result: string = str(42);
  t.is(result, "42");
});

// ---------------------------------------------------------------------------
// byBind — specific
// ---------------------------------------------------------------------------

test("dist/byBind.cjs — bound function prototype chain includes Impl.prototype", (t) => {
  // Function.prototype.bind copies [[Prototype]] from the target to the
  // bound function, so instanceof delegates correctly without Proxy.
  class Impl extends CallableByBind<void> {
    _call(): void {}
  }
  const x = new Impl();
  t.is(Object.getPrototypeOf(x), Impl.prototype);
});

test("dist/byBind.cjs — TypeScript generic TResult is enforced at compile time", (t) => {
  class Doubler extends CallableByBind<number> {
    _call(n: number): number {
      return n * 2;
    }
  }
  const double = new Doubler();
  const result: number = double(21);
  t.is(result, 42);
});

// ---------------------------------------------------------------------------
// byCallee — specific
// ---------------------------------------------------------------------------

test("dist/byCallee.cjs — arguments.callee is accessible (non-strict function body)", (t) => {
  // The function body created by new Function(...) is always non-strict,
  // so arguments.callee is available even when the test file uses strict mode.
  class Impl extends CallableByCallee<string> {
    _call(s: string): string {
      return `callee:${s}`;
    }
  }
  const x = new Impl();
  t.is(x("ok"), "callee:ok");
});

test("dist/byCallee.cjs — TypeScript generic TResult is enforced at compile time", (t) => {
  class Upper extends CallableByCallee<string> {
    _call(s: string): string {
      return s.toUpperCase();
    }
  }
  const upper = new Upper();
  const result: string = upper("hello");
  t.is(result, "HELLO");
});

// ---------------------------------------------------------------------------
// byClosure — specific
// ---------------------------------------------------------------------------

test("dist/byClosure.cjs — Object.setPrototypeOf wires the closure to Impl.prototype", (t) => {
  class Impl extends CallableByClosure<void> {
    _call(): void {}
  }
  const x = new Impl();
  // The closure returned from the constructor has its [[Prototype]] set
  // to Impl.prototype via Object.setPrototypeOf.
  t.is(Object.getPrototypeOf(x), Impl.prototype);
});

test("dist/byClosure.cjs — TypeScript generic TResult is enforced at compile time", (t) => {
  class Joiner extends CallableByClosure<string> {
    _call(...args: string[]): string {
      return args.join("-");
    }
  }
  const join = new Joiner();
  const result: string = join("a", "b", "c");
  t.is(result, "a-b-c");
});

// ---------------------------------------------------------------------------
// byProxy — specific
// ---------------------------------------------------------------------------

test("dist/byProxy.cjs — Proxy apply trap forwards all argument types correctly", (t) => {
  class Impl extends CallableByProxy<string[]> {
    _call(...args: any[]): string[] {
      return args.map(String);
    }
  }
  const x = new Impl();
  t.deepEqual(x(1, true, "str", null), ["1", "true", "str", "null"]);
});

test("dist/byProxy.cjs — TypeScript generic TResult is enforced at compile time", (t) => {
  class Negate extends CallableByProxy<boolean> {
    _call(b: boolean): boolean {
      return !b;
    }
  }
  const negate = new Negate();
  const result: boolean = negate(true);
  t.false(result);
});
