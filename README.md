# @lopatnov/callable [![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fcallable)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fcallable)

![npm](https://img.shields.io/npm/dt/@lopatnov/callable)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fcallable.svg)](https://www.npmjs.com/package/@lopatnov/callable)
![License](https://img.shields.io/github/license/lopatnov/callable)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/callable)](https://github.com/lopatnov/callable/issues)
[![GitHub forks](https://img.shields.io/github/forks/lopatnov/callable)](https://github.com/lopatnov/callable/network)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/callable)](https://github.com/lopatnov/callable/stargazers)
[![Build Status](https://travis-ci.org/lopatnov/callable.png?branch=master)](https://travis-ci.org/lopatnov/callable)

[![Patreon](https://img.shields.io/badge/Donate-Patreon-informational)](https://www.patreon.com/lopatnov)
[![sobe.ru](https://img.shields.io/static/v1?label=sobe.ru&message=%D0%91%D0%BB%D0%B0%D0%B3%D0%BE%D0%B4%D0%B0%D1%80%D0%BD%D0%BE%D1%81%D1%82%D1%8C&color=yellow&logo=data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAArlBMVEUAAAD//////////////////////////////////////////////////////////////////PP/3l7/9c//0yb/zAD/6ZP/zQf/++7/3FD/88X/0h7//v7/5oX/zATUqQDktgD/5HjQpgAFBACQcwD/zw/fsgCOcQD6yADZrQD2xAD8yQDnuADxwADcsADbrwDpugD3xQD5xwDjtQDywQD+ywD9ygDvvwD7yAD/1jRaObVGAAAAEHRSTlMAA3zg707pEJP8MMUBYN5fiwXJMQAAAAFiS0dEAf8CLd4AAAAHdElNRQflBgMAAxO4O2jCAAAAuElEQVQoz42S1w7CMAxFS8ueYZgNLZuyRynw/z9GdtxIkbgPceQT6Tq2vZwfEKx8wRPyiaViSYDABqQsAMq0OzxUqhbo9kBcavUM6A9AAtJAYDgC0ID7i+t4AghwfxanszlAGBnA/Flc0MfL1doA5s/ChoLtbg8QI392gpIBzf/AwYAWAsdTrIE05/nz5Xq7S6DKpenHM0pe+o/qg5Am74/0ybTkm+q6wG4iltV2LTko52idy+Banx9RYiS6Vrsc3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0wM1QwMDowMzoxOCswMDowMLvSSCkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMDNUMDA6MDM6MTgrMDA6MDDKj/CVAAAAAElFTkSuQmCC)](https://sobe.ru/na/tech_knigi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lopatnov-informational?style=social&logo=linkedin)](https://www.linkedin.com/in/lopatnov/)

Abstract class Callable is abstraction for creating new instances of a class as functions, not objects.

## Install

[![https://nodei.co/npm/@lopatnov/callable.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@lopatnov/callable.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@lopatnov/callable)

```shell
npm install @lopatnov/callable
```

[Browser](//lopatnov.github.io/callable/dist/callable.js)

```html
<script src="//lopatnov.github.io/callable/dist/byBind.min.js"></script>
<script src="//lopatnov.github.io/callable/dist/byCallee.min.js"></script>
<script src="//lopatnov.github.io/callable/dist/byClosure.min.js"></script>
<script src="//lopatnov.github.io/callable/dist/byProxy.min.js"></script>
```

## Import package to the project

### TypeScript package import

```typescript
import Callable from "@lopatnov/callable"; // byBind
```

or

```typescript
import CallableByBind from "@lopatnov/callable/dist/byBind";
import CallableByCallee from "@lopatnov/callable/dist/byCallee";
import CallableByClosure from "@lopatnov/callable/dist/byClosure";
import CallableByProxy from "@lopatnov/callable/dist/byProxy";
```

### JavaScript package import

```javascript
var Callable = require("@lopatnov/callable"); // byBind
```

or

```javascript
var CallableByBind = require("@lopatnov/callable/dist/byBind");
var CallableByCallee = require("@lopatnov/callable/dist/byCallee");
var CallableByClosure = require("@lopatnov/callable/dist/byClosure");
var CallableByProxy = require("@lopatnov/callable/dist/byProxy");
```

## How to use

### TypeScript usage

```typescript
import Callable from "@lopatnov/callable";

class ChildCallable extends Callable<string> {
  _call(...args: any[]): string {
    return `Hello ${args[0]}`;
  }
}

let x = new ChildCallable(); // <-- returns function
let xc = x("World"); // <-- calls _call function of ChildCallable class

console.log(xc); // "Hello World"
```

### JavaScript usage

```javascript
var Callable = require("@lopatnov/callable");

class ChildCallable extends Callable {
  _call(...args) {
    return `Hello ${args[0]}`;
  }
}

let x = new ChildCallable(); // <-- returns function
let xc = x("World"); // <-- calls _call function of ChildCallable class

console.log(xc); // "Hello World"
```

## Description of abstract class `Callable<TResult>` and it's variations

Abstract class `Callable` has different realizations. They have different plus side and minus side.

The parameter `TResult` is a result type of a function.

## `abstract class CallableByBind<TResult>`

This is the function bind way.

Plus side

- Doesn’t rely on deprecated or modern features.
- No need to modify prototypes.

Minus side

- Requires wrapping the function object in a bound function.

## `abstract class CallableByCallee<TResult>`

Plus side

- Very simple.
- No need to modify prototypes.

Minus side

- arguments and arguments.callee are unavailable in ‘strict mode’, see MDN for more.

## `abstract class CallableByProxy<TResult>`

Plus side

- Simple, native way to intercept calls and redirect them.
- No need to modify prototypes.

Minus side

- Requires wrapping objects created by Callable in a Proxy.
- A small performance penalty for using Proxy handlers.

## `abstract class CallableByClosure<TResult>`

Plus side

- Requires no wrapping of the returned object with a Proxy or bind.

Minus side

- Requires modifying prototypes.
- Modifying prototypes is slow and has other side effects, see MDN.

## Demo

See, how it's working: [https://runkit.com/lopatnov/callable-demo](https://runkit.com/lopatnov/callable-demo)

Test it with a runkit: [https://npm.runkit.com/@lopatnov/callable](https://npm.runkit.com/%40lopatnov%2Fcallable)

## Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/callable/blob/master/LICENSE)

Copyright 2019-2021 Oleksandr Lopatnov
