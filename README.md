# @lopatnov/callable

[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fcallable.svg)](https://www.npmjs.com/package/@lopatnov/callable)
![npm](https://img.shields.io/npm/dt/@lopatnov/callable)
![License](https://img.shields.io/github/license/lopatnov/callable)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/callable)](https://github.com/lopatnov/callable/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/callable)](https://github.com/lopatnov/callable/issues)

A TypeScript abstract base class that lets you create class instances that behave as callable functions. Extend `Callable<TResult>`, implement the `_call` method, and every `new` instance becomes directly invokable — with full prototype chain, type safety, and IDE completion preserved.

Four independent implementations are provided, each with different trade-offs, so you can pick the one that best fits your runtime environment and performance requirements.

## Install

```shell
npm install @lopatnov/callable
```

**Browser (CDN via jsDelivr):**

```html
<script src="https://cdn.jsdelivr.net/npm/@lopatnov/callable/dist/byBind.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@lopatnov/callable/dist/byCallee.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@lopatnov/callable/dist/byClosure.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@lopatnov/callable/dist/byProxy.umd.min.js"></script>
```

## Usage

### TypeScript / ES Modules

```typescript
import CallableByBind from "@lopatnov/callable/byBind";
import CallableByCallee from "@lopatnov/callable/byCallee";
import CallableByClosure from "@lopatnov/callable/byClosure";
import CallableByProxy from "@lopatnov/callable/byProxy";

class Greeter extends CallableByBind<string> {
  _call(...args: any[]): string {
    return `Hello, ${args[0]}!`;
  }
}

const greet = new Greeter(); // instance is a callable function
console.log(greet("World")); // "Hello, World!"
```

### CommonJS

```javascript
const CallableByBind = require("@lopatnov/callable/byBind");

class Greeter extends CallableByBind {
  _call(...args) {
    return `Hello, ${args[0]}!`;
  }
}

const greet = new Greeter();
console.log(greet("World")); // "Hello, World!"
```

### Browser UMD

After loading the script tag, the class is available as the global `callable`:

```html
<script src="https://cdn.jsdelivr.net/npm/@lopatnov/callable/dist/byBind.umd.min.js"></script>
<script>
  class Greeter extends callable {
    _call(...args) {
      return `Hello, ${args[0]}!`;
    }
  }

  const greet = new Greeter();
  console.log(greet("World")); // "Hello, World!"
</script>
```

## API

### Abstract method

Every subclass must implement:

```typescript
abstract _call(...args: any[]): TResult
```

| Parameter | Type  | Description                                                |
| --------- | ----- | ---------------------------------------------------------- |
| `...args` | any[] | Arguments passed when the instance is called as a function |

**Returns:** `TResult` — the value returned to the caller.

### Implementations comparison

| Class               | Import path                    | Mechanism                         | Strict mode              | Modifies prototype |
| ------------------- | ------------------------------ | --------------------------------- | ------------------------ | ------------------ |
| `CallableByBind`    | `@lopatnov/callable/byBind`    | `Function.prototype.bind`         | ✅ Yes                   | ❌ No              |
| `CallableByCallee`  | `@lopatnov/callable/byCallee`  | `arguments.callee`                | ❌ No (sloppy mode only) | ❌ No              |
| `CallableByClosure` | `@lopatnov/callable/byClosure` | Closure + `Object.setPrototypeOf` | ✅ Yes                   | ✅ Yes             |
| `CallableByProxy`   | `@lopatnov/callable/byProxy`   | `Proxy` apply trap                | ✅ Yes                   | ❌ No              |

---

### `CallableByBind<TResult>`

Uses `Function.prototype.bind` to return a bound function from the constructor. The bound function delegates to `_call` on the original instance.

**Pros:**

- No deprecated APIs
- No prototype modification
- Works in strict mode

**Cons:**

- Constructor returns a bound wrapper, not the raw instance

```typescript
import CallableByBind from "@lopatnov/callable/byBind";

class Multiplier extends CallableByBind<number> {
  constructor(private factor: number) {
    super();
  }
  _call(value: number): number {
    return value * this.factor;
  }
}

const triple = new Multiplier(3);
console.log(triple(7)); // 21
```

---

### `CallableByCallee<TResult>`

Uses `arguments.callee` inside the dynamically constructed function body to reference the function itself.

**Pros:**

- Minimal implementation

**Cons:**

- `arguments.callee` is forbidden in strict mode (`"use strict"` or ES modules)
- Not suitable for modern bundler output

```javascript
// Must be used in non-strict (sloppy) mode only
const CallableByCallee = require("@lopatnov/callable/byCallee");

class Adder extends CallableByCallee {
  _call(a, b) {
    return a + b;
  }
}

const add = new Adder();
console.log(add(2, 3)); // 5
```

---

### `CallableByClosure<TResult>`

Creates an anonymous function in the constructor that closes over a reference to itself, then rewires the prototype chain with `Object.setPrototypeOf`.

**Pros:**

- Works in strict mode
- No bound wrapper — the returned object is the closure itself

**Cons:**

- Calls `Object.setPrototypeOf`, which may affect JIT optimization
- Modifies the prototype chain

```typescript
import CallableByClosure from "@lopatnov/callable/byClosure";

class Counter extends CallableByClosure<void> {
  private count = 0;
  _call(): void {
    console.log(++this.count);
  }
}

const counter = new Counter();
counter(); // 1
counter(); // 2
```

---

### `CallableByProxy<TResult>`

Wraps the constructed instance in an ES6 `Proxy` with an `apply` trap that delegates to `_call`.

**Pros:**

- Clean, idiomatic ES2015+ approach
- Works in strict mode
- No prototype modification

**Cons:**

- Adds a `Proxy` wrapper with a minor per-call overhead

```typescript
import CallableByProxy from "@lopatnov/callable/byProxy";

class Logger extends CallableByProxy<void> {
  _call(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

const log = new Logger();
log("Server started"); // [LOG] Server started
```

---

## Distribution formats

Each implementation is published in four formats:

| Format         | File                     | Use case                         |
| -------------- | ------------------------ | -------------------------------- |
| CommonJS       | `dist/{name}.cjs`        | Node.js `require()`              |
| ES Module      | `dist/{name}.esm.mjs`    | Bundlers, native ESM `import`    |
| UMD            | `dist/{name}.umd.js`     | Browser globals (with sourcemap) |
| UMD (minified) | `dist/{name}.umd.min.js` | Production browser               |

TypeScript declaration files (`*.d.ts`) are included for all four implementations.

## Demo

Try it live:

- [RunKit demo](https://runkit.com/lopatnov/callable-demo)
- [npm.runkit.com](https://npm.runkit.com/%40lopatnov%2Fcallable)

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

If you find this project useful, consider giving it a ⭐ on [GitHub](https://github.com/lopatnov/callable) — it helps others discover it.

## License

[Apache-2.0](https://github.com/lopatnov/callable/blob/master/LICENSE)

Copyright 2019–2026 Oleksandr Lopatnov
