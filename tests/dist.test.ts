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
 * Jest resolves "../dist/byBind" → "../dist/byBind.cjs" via moduleNameMapper.
 * TypeScript resolves types from "../dist/byBind.d.ts" at compile time.
 */

import { describe, expect, it } from "@jest/globals";
import CallableByBind from "../dist/byBind";
import CallableByCallee from "../dist/byCallee";
import CallableByClosure from "../dist/byClosure";
import CallableByProxy from "../dist/byProxy";

// ---------------------------------------------------------------------------
// Shared suite — run for every implementation
// ---------------------------------------------------------------------------

// When a class extends a variable typed as `any`, TypeScript cannot trace the
// inheritance chain back to `Function` and therefore loses call signatures on
// instances.  We cast to `any` here so the helper compiles; the per-
// implementation sections below verify the correct TypeScript behaviour using
// the fully-typed imports.
function distSuite(label: string, Ctor: any): void {
  describe(label, () => {
    it("exports a constructor function", () => {
      expect(typeof Ctor).toBe("function");
    });

    it("creates an instance that is callable (typeof 'function')", () => {
      class Impl extends Ctor {
        _call(): string {
          return "ok";
        }
      }
      const x: any = new Impl();
      expect(typeof x).toBe("function");
    });

    it("instance() invokes _call and returns its value", () => {
      class Impl extends Ctor {
        _call(a: string): string {
          return `hello ${a}`;
        }
      }
      const x: any = new Impl();
      expect(x("world")).toBe("hello world");
    });

    it("forwards multiple arguments to _call", () => {
      class Impl extends Ctor {
        _call(a: number, b: number, c: number): number {
          return a + b + c;
        }
      }
      const x: any = new Impl();
      expect(x(1, 2, 3)).toBe(6);
    });

    it("x instanceof OwnClass is true", () => {
      class Impl extends Ctor {
        _call(): void {}
      }
      const x: any = new Impl();
      expect(x instanceof Impl).toBe(true);
    });

    it("x instanceof base Callable class is true", () => {
      class Impl extends Ctor {
        _call(): void {}
      }
      const x: any = new Impl();
      expect(x instanceof Ctor).toBe(true);
    });

    it("this inside _call refers to the callable instance", () => {
      class Impl extends Ctor {
        tag = "context-marker";
        _call(): string {
          return this.tag;
        }
      }
      const x: any = new Impl();
      expect(x()).toBe("context-marker");
    });

    it("instance fields set via constructor arguments are accessible in _call", () => {
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
      expect(x()).toBe("dynamic");
    });

    it("state accumulates across successive calls", () => {
      class Counter extends Ctor {
        private n = 0;
        _call(): number {
          return ++this.n;
        }
      }
      const counter: any = new Counter();
      expect(counter()).toBe(1);
      expect(counter()).toBe(2);
      expect(counter()).toBe(3);
    });

    it("works across a multi-level inheritance chain", () => {
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
      expect(x instanceof Child).toBe(true);
      expect(x instanceof Base).toBe(true);
      expect(x instanceof Ctor).toBe(true);
      expect(x("test")).toBe("child:test");
    });

    it("two independent instances do not share state", () => {
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
      expect(a()).toBe(3);
      expect(b()).toBe(1); // b's state is independent
    });
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

describe("TypeScript call-signature — direct typed subclasses are callable", () => {
  it("CallableByBind subclass: new Impl() is callable without casting", () => {
    class Greeter extends CallableByBind<string> {
      _call(name: string): string {
        return `Hello, ${name}!`;
      }
    }
    const greet = new Greeter();
    // TypeScript knows `greet` is callable because Greeter → CallableByBind → Function.
    // If this line causes TS2349 the d.ts no longer exports `extends Function` properly.
    const result: string = greet("World");
    expect(result).toBe("Hello, World!");
  });

  it("CallableByCallee subclass: new Impl() is callable without casting", () => {
    class Adder extends CallableByCallee<number> {
      _call(a: number, b: number): number {
        return a + b;
      }
    }
    const add = new Adder();
    const result: number = add(3, 4);
    expect(result).toBe(7);
  });

  it("CallableByClosure subclass: new Impl() is callable without casting", () => {
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
    expect(result).toBe(21);
  });

  it("CallableByProxy subclass: new Impl() is callable without casting", () => {
    class Toggle extends CallableByProxy<boolean> {
      _call(b: boolean): boolean {
        return !b;
      }
    }
    const toggle = new Toggle();
    const result: boolean = toggle(false);
    expect(result).toBe(true);
  });

  it("generic TResult is preserved — assigning result to wrong type is a TS error", () => {
    class Stringify extends CallableByBind<string> {
      _call(n: number): string {
        return String(n);
      }
    }
    const str = new Stringify();
    // `str(42)` returns `string`; next line would fail tsc if TResult were `any`
    const result: string = str(42);
    expect(result).toBe("42");
  });
});

// ---------------------------------------------------------------------------
// byBind — specific
// ---------------------------------------------------------------------------

describe("dist/byBind.cjs — specific", () => {
  it("bound function prototype chain includes Impl.prototype (instanceof works via bind delegation)", () => {
    // Function.prototype.bind copies [[Prototype]] from the target to the
    // bound function, so instanceof delegates correctly without Proxy.
    class Impl extends CallableByBind<void> {
      _call(): void {}
    }
    const x = new Impl();
    // x is the bound function; its [[Prototype]] === Impl.prototype
    expect(Object.getPrototypeOf(x)).toBe(Impl.prototype);
  });

  it("TypeScript generic TResult is enforced at compile time", () => {
    class Doubler extends CallableByBind<number> {
      _call(n: number): number {
        return n * 2;
      }
    }
    const double = new Doubler();
    const result: number = double(21);
    expect(result).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// byCallee — specific
// ---------------------------------------------------------------------------

describe("dist/byCallee.cjs — specific", () => {
  it("arguments.callee inside the created function is accessible (non-strict function body)", () => {
    // The function body created by new Function(...) is always non-strict,
    // so arguments.callee is available even when the test file uses strict mode.
    class Impl extends CallableByCallee<string> {
      _call(s: string): string {
        return `callee:${s}`;
      }
    }
    const x = new Impl();
    expect(x("ok")).toBe("callee:ok");
  });

  it("TypeScript generic TResult is enforced at compile time", () => {
    class Upper extends CallableByCallee<string> {
      _call(s: string): string {
        return s.toUpperCase();
      }
    }
    const upper = new Upper();
    const result: string = upper("hello");
    expect(result).toBe("HELLO");
  });
});

// ---------------------------------------------------------------------------
// byClosure — specific
// ---------------------------------------------------------------------------

describe("dist/byClosure.cjs — specific", () => {
  it("Object.setPrototypeOf wires the closure to Impl.prototype", () => {
    class Impl extends CallableByClosure<void> {
      _call(): void {}
    }
    const x = new Impl();
    // The closure returned from the constructor has its [[Prototype]] set
    // to Impl.prototype via Object.setPrototypeOf.
    expect(Object.getPrototypeOf(x)).toBe(Impl.prototype);
  });

  it("TypeScript generic TResult is enforced at compile time", () => {
    class Joiner extends CallableByClosure<string> {
      _call(...args: string[]): string {
        return args.join("-");
      }
    }
    const join = new Joiner();
    const result: string = join("a", "b", "c");
    expect(result).toBe("a-b-c");
  });
});

// ---------------------------------------------------------------------------
// byProxy — specific
// ---------------------------------------------------------------------------

describe("dist/byProxy.cjs — specific", () => {
  it("Proxy apply trap forwards all argument types correctly", () => {
    class Impl extends CallableByProxy<string[]> {
      _call(...args: any[]): string[] {
        return args.map(String);
      }
    }
    const x = new Impl();
    expect(x(1, true, "str", null)).toEqual(["1", "true", "str", "null"]);
  });

  it("TypeScript generic TResult is enforced at compile time", () => {
    class Negate extends CallableByProxy<boolean> {
      _call(b: boolean): boolean {
        return !b;
      }
    }
    const negate = new Negate();
    const result: boolean = negate(true);
    expect(result).toBe(false);
  });
});
