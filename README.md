# @lopatnov/callable

> A TypeScript abstract base class that lets you create class instances that behave as callable functions.
> Extend `Callable<TResult>`, implement `_call`, and every `new` instance becomes directly invokable —
> with full prototype chain, type safety, and IDE completion preserved.

[![npm downloads](https://img.shields.io/npm/dt/@lopatnov/callable)](https://www.npmjs.com/package/@lopatnov/callable)
[![npm version](https://badge.fury.io/js/%40lopatnov%2Fcallable.svg)](https://www.npmjs.com/package/@lopatnov/callable)
[![License](https://img.shields.io/github/license/lopatnov/callable)](https://github.com/lopatnov/callable/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/callable)](https://github.com/lopatnov/callable/issues)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/callable)](https://github.com/lopatnov/callable/stargazers)

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Distribution Formats](#distribution-formats)
- [Demo](#demo)
- [Contributing](#contributing)
- [Built With](#built-with)
- [License](#license)

---

## Installation

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

---

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

---

## API

### Abstract method

Every subclass must implement:

```typescript
abstract _call(...args: any[]): TResult
```

| Parameter | Type    | Description                                                |
| --------- | ------- | ---------------------------------------------------------- |
| `...args` | `any[]` | Arguments passed when the instance is called as a function |

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

**Pros:** no deprecated APIs, no prototype modification, works in strict mode.

**Cons:** constructor returns a bound wrapper, not the raw instance.

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

Uses `arguments.callee` inside the dynamically constructed function body.

**Pros:** minimal implementation.

**Cons:** `arguments.callee` is forbidden in strict mode — not suitable for modern bundlers.

```javascript
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

Creates an anonymous function in the constructor that closes over itself, then rewires the prototype chain with `Object.setPrototypeOf`.

**Pros:** works in strict mode, no bound wrapper.

**Cons:** calls `Object.setPrototypeOf`, which may affect JIT optimization.

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

**Pros:** clean ES2015+ approach, works in strict mode, no prototype modification.

**Cons:** adds a `Proxy` wrapper with a minor per-call overhead.

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

## Distribution Formats

Each implementation is published in four formats:

| Format         | File                     | Use case                         |
| -------------- | ------------------------ | -------------------------------- |
| CommonJS       | `dist/{name}.cjs`        | Node.js `require()`              |
| ES Module      | `dist/{name}.esm.mjs`    | Bundlers, native ESM `import`    |
| UMD            | `dist/{name}.umd.js`     | Browser globals (with sourcemap) |
| UMD (minified) | `dist/{name}.umd.min.js` | Production browser               |

TypeScript declaration files (`*.d.ts`) are included for all four implementations.

---

## Demo

Try it live:

- [RunKit demo](https://runkit.com/lopatnov/callable-demo)
- [npm.runkit.com](https://npm.runkit.com/%40lopatnov%2Fcallable)

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Bug reports → [open an issue](https://github.com/lopatnov/callable/issues)
- Questions → [Discussions](https://github.com/lopatnov/callable/discussions)
- Found it useful? A [star on GitHub](https://github.com/lopatnov/callable) helps others discover the project

---

## Built With

- [TypeScript](https://www.typescriptlang.org/) — strict typing throughout
- [Rollup](https://rollupjs.org/) — bundled to ESM, CJS, and UMD formats
- [Ava](https://github.com/avajs/ava) — fast, concurrent test runner
- [OXLint](https://oxc.rs/docs/guide/usage/linter.html) — fast JavaScript/TypeScript linter
- [dprint](https://dprint.dev/) — code formatter

---

## License

[Apache-2.0](https://github.com/lopatnov/callable/blob/master/LICENSE) © 2019–2026 [Oleksandr Lopatnov](https://github.com/lopatnov) · [LinkedIn](https://www.linkedin.com/in/lopatnov/)
