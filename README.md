# @lopatnov/callable

[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fcallable.svg)](https://www.npmjs.com/package/@lopatnov/callable)
![License](https://img.shields.io/github/license/lopatnov/callable)
[![Build Status](https://travis-ci.org/lopatnov/callable.png?branch=master)](https://travis-ci.org/lopatnov/callable)
[![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fcallable)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fcallable)

A callable object is a data structure that behaves as both an object and a function.

## Install

[![https://nodei.co/npm/@lopatnov/callable.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@lopatnov/callable.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@lopatnov/callable)

```shell
npm install @lopatnov/callable
```

[Browser](//lopatnov.github.io/callable/dist/callable.js)

```html
<script src="//lopatnov.github.io/callable/dist/callable.min.js"></script>
```

## Import package to the project

```typescript
import {
  Callable,
  CallableByCallee,
  CallableByClosure,
  CallableByProxy
} from "callable";
```

or

```javascript
var module = require("callable");
var Callable = module.Callable,
  CallableByCallee = module.CallableByCallee,
  CallableByClosure = module.CallableByClosure,
  CallableByProxy = module.CallableByProxy;
```

## How to use

```typescript
class ChildCallable extends Callable<string> {
      _call(...args: any[]): string {
        return `Hello ${args[0]}`;
      }
    }

let x = new ChildCallable();
let xc = x("World");

console.log(xc); //Hello World
```

## `Callable<TResult>`

The Bind Way

Pros

- Doesn’t rely on deprecated or modern features.
- No need to modify prototypes.

Cons

- Requires wrapping the function object in a bound function.

## `abstract class CallableByCallee<TResult>`

Pros

- Very simple.
- No need to modify prototypes.

Cons

- arguments and arguments.callee are unavailable in ‘strict mode’, see MDN for more.

## `CallableByProxy<TResult>`

Pros

- Simple, native way to intercept calls and redirect them.
- No need to modify prototypes.

Cons

- Requires wrapping objects created by Callable in a Proxy.
- A small performance penalty for using Proxy handlers.

## `CallableByClosure<TResult>`

Pros

- Requires no wrapping of the returned object with a Proxy or bind.

Cons

- Requires modifying prototypes.
- Modifying prototypes is slow and has other side effects, see MDN.

## Demo

See, how it's working: [https://runkit.com/lopatnov/callable-demo](https://runkit.com/lopatnov/callable-demo)

Test it with a runkit: [https://npm.runkit.com/@lopatnov/callable](https://npm.runkit.com/%40lopatnov%2Fcallable)

## Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/callable/blob/master/LICENSE)

Copyright 2019 Oleksandr Lopatnov
