import test from "ava";
import CallableByBind from "../src/byBind";
import CallableByCallee from "../src/byCallee";
import CallableByClosure from "../src/byClosure";
import CallableByProxy from "../src/byProxy";

test("Base — should create Callable by bind", (t) => {
  class ChildCallable extends CallableByBind<string> {
    _call(...args: any[]): string {
      return `Test 1 ${args[0]}`;
    }
  }

  const x = new ChildCallable();
  const actual = x("Arg 1");
  t.is(actual, "Test 1 Arg 1");
});

test("Base — should create Callable by callee", (t) => {
  class ChildCallable extends CallableByCallee<string> {
    _call(...args: any[]): string {
      return `Test 2 ${args[0]}`;
    }
  }

  const x = new ChildCallable();
  const actual = x("Arg 1");
  t.is(actual, "Test 2 Arg 1");
});

test("Base — should create Callable by closure", (t) => {
  class ChildCallable extends CallableByClosure<string> {
    _call(...args: any[]): string {
      return `Test 3 ${args[0]}`;
    }
  }

  const x = new ChildCallable();
  const actual = x("Arg 1");
  t.is(actual, "Test 3 Arg 1");
});

test("Base — should create Callable by proxy", (t) => {
  class ChildCallable extends CallableByProxy<string> {
    _call(...args: any[]): string {
      return `Test 4 ${args[0]}`;
    }
  }

  const x = new ChildCallable();
  const actual = x("Arg 1");
  t.is(actual, "Test 4 Arg 1");
});
