import { describe, it, expect } from "@jest/globals";
import CallableByBind from "../src/byBind";
import CallableByCallee from "../src/byCallee";
import CallableByClosure from "../src/byClosure";
import CallableByProxy from "../src/byProxy";

describe("Base tests", () => {
  it("should create Callable by bind", () => {
    class ChildCallable extends CallableByBind<string> {
      _call(...args: any[]): string {
        return `Test 1 ${args[0]}`;
      }
    }

    const x = new ChildCallable();
    const actual = x("Arg 1");
    expect(actual).toBe("Test 1 Arg 1");
  });

  it("should create Callable by callee", () => {
    class ChildCallable extends CallableByCallee<string> {
      _call(...args: any[]): string {
        return `Test 2 ${args[0]}`;
      }
    }

    const x = new ChildCallable();
    const actual = x("Arg 1");
    expect(actual).toBe("Test 2 Arg 1");
  });

  it("should create Callable by closure", () => {
    class ChildCallable extends CallableByClosure<string> {
      _call(...args: any[]): string {
        return `Test 3 ${args[0]}`;
      }
    }

    const x = new ChildCallable();
    const actual = x("Arg 1");
    expect(actual).toBe("Test 3 Arg 1");
  });

  it("should create Callable by proxy", () => {
    class ChildCallable extends CallableByProxy<string> {
      _call(...args: any[]): string {
        return `Test 4 ${args[0]}`;
      }
    }

    const x = new ChildCallable();
    const actual = x("Arg 1");
    expect(actual).toBe("Test 4 Arg 1");
  });
});
