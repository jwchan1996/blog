# webpack 优化配置之 sideEffects

`webpack 4` 新增的 `sideEffects` 新特性允许通过配置的方式去标识我们的代码是否有副作用，从而为 `tree-shaking` 提供更大的压缩空间。

**副作用**：模块执行时除了导出成员之外所做的事情。

`sideEffects` 一般用于开发 `npm` 模块时标记模块代码是否有副作用。

下面是在入口文件导入 `button` 组件模块，但是导出 `button` 组件的 `index.js` 文件还有许多其他组件模块，这样在打包时整个 `index.js` 的模块都会被打包进来。

[示例代码仓库](https://github.com/jwchan1996/webpack-play/blob/main/15-side-effects)

```javascript
// src/components/index.js
export { default as Button } from './button'
export { default as Link } from './link'
export { default as Heading } from './heading'
```

```javascript
// src/index.js
import { Button } from './components'

document.body.appendChild(Button())
```

打包后可以看到没用到的 `Link` 和 `Heading` 也会打包到 `bundle` 中来。

```javascript
// dist/bundle.js
((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button": () => /* reexport safe */ _button__WEBPACK_IMPORTED_MODULE_0__.default,
/* harmony export */   "Link": () => /* reexport safe */ _link__WEBPACK_IMPORTED_MODULE_1__.default,
/* harmony export */   "Heading": () => /* reexport safe */ _heading__WEBPACK_IMPORTED_MODULE_2__.default
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _heading__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/***/ })
```

为了给 `tree-shaking` 提供更大的压缩空间，我们可以手动配置 `webpack` 的 `optimization` 选项的 `sideEffects` 属性，它表示是否处理无副作用的代码。默认值是 `false`，表示不处理无副作用的（没用的）代码。

> tips：在生产模式下，webpack 会自动开启 sideEffects 功能。

而 `webpack` 在打包某个模块之前，会先检查这个模块所属的 `package.json` 中的 `sideEffects` 标识，以此来判断这个模块是否有副作用，如果没有副作用的话，这些没用到的模块就不会被打包。也就是说，我们可以通过手动配置 `package.json` 的 `sideEffects` 选项来标识代码是否有副作用。即便这些没有用到的模块中存在一些副作用代码，我们也可以通过 `package.json` 中的 `sideEffects` 去强制声明没有副作用。

```javascript
// webpack.config.js
module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  optimization: {
    sideEffects: true   // 开启 sideEffects 功能，不会把标识为无副作用的代码打包到 bubdle
  }
}
```

```javascript
// package.json
{
  // 不配置 sideEffects 的话，默认是 true，表示模块代码都有副作用
  // 标识模块代码是否有副作用，webpack 会根据这个标识（false）从而处理无副作用的代码，不打包到 bundle
  "sideEffects": false  
}
```

打包后可以看到，那些没有用到的模块是没有被打包到 `bundle` 的。

这里设置了两个地方：

- `webpack.config.js` 中的 `sideEffects` 用来开启这个功能；
- `package.json` 中的 `sideEffects` 用来标识我们的代码没有副作用。

目前很多第三方的库或者框架都已经使用了 `sideEffects` 标识，所以不用担心为了一个小功能引入一个很大体积的库。

**需要注意的是**，使用 `sideEffects` 功能的**前提是确保代码真的没有副作用**，否则 `webpack` 打包的时候会误删掉那些有用的代码。

比如 `extend.js` 文件没有导出代码，`index.js` 将它引入，此时的 `extend.js` 的代码对于 `index.js` 来说就是副作用，但是确实实在在有用的代码。此时像上面一样配置开启 `sideEffects` 的话，`extend.js` 代码将不会被打包进来，造成打包后的代码会运行出错。

```javascript
// src/components/index.js
import { Button } from './components'

// 样式文件属于副作用模块
import './global.css'

// 副作用模块
import './extend'

console.log((8).pad(3))

document.body.appendChild(Button())
```

```javascript
// src/extend.js
// 为 Number 的原型添加一个扩展方法，这里对于 webpack 来说是有副作用的代码
Number.prototype.pad = function (size) {
  // 将数字转为字符串 => '8'
  let result = this + ''
  // 在数字前补指定个数的 0 => '008'
  while (result.length < size) {
    result = '0' + result
  }
  return result
}
```

打包后，发现副作用模块都被移除了，运行打包后的文件会发生报错，显然不符合我们的期望的结果。

解决办法是在 `package.json` 中不作 `sideEffects` 的标识，或者标识当前项目哪些文件是有副作用的，这样 `webpack` 就不会去忽略掉这些有副作用的模块。

```javascript
// webpack.config.js
{
  // 使用数组形式，标识哪些模块具有副作用
  "sideEffects": [
    "./src/extend.js",
    "*.css"
  ]
}
```

打包后，可以看到手动标识为具有副作用的模块的代码会被打包进来，运行打包后的文件则正常运行不报错。

```javascript
// dist/bundle.js
console.log((8).pad(3))

/* 5 */
/***/ (() => {

// 为 Number 的原型添加一个扩展方法
Number.prototype.pad = function (size) {
  // 将数字转为字符串 => '8'
  let result = this + ''
  // 在数字前补指定个数的 0 => '008'
  while (result.length < size) {
    result = '0' + result
  }
  return result
}

/***/ })
```