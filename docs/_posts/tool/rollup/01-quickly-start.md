# 快速上手

`rollup` 仅仅是一款 `ESM` 打包工具，并没有其他额外的功能。例如 `webpack` 有对开发者友好的 `HMR` 热更新功能，`rollup` 并不支持类似 `HMR` 这种高级特性。`rollup` 的诞生并不是为了与 `webpack` 全面竞争，`rollup` 的初衷是提供一个充分利用 `ESM` 各项特性的高效打包器，通过充分利用 `ESM` 的各种特性，构建出结构比较扁平且性能比较出众的类库。

![01](~public/rollup/01/01.png)

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/01-quickly-start)

首先安装 `rollup` 依赖：

```bash
yarn add rollup --dev
```

`rollup` 打包需要指定入口文件路径以及输出代码格式，下面是可选的代码格式。

```bash
amd     cjs     system      esm     iife    umd
```

这里选择最适合浏览器的 `iife`（立即执行函数）格式，默认是 `esm` 格式。

```bash
yarn rollup ./src/index.js --format iife
```

还可以指定打包文件的输出路径。

```bash
yarn rollup ./src/index.js --format iife --file dist/bundle.js
```

执行打包命令后输出的文件：

```javascript
// dist/bundle.js

(function () {
  'use strict';

  const log = msg => {
    console.log('---------- INFO ----------');
    console.log(msg);
    console.log('--------------------------');
  };

  var messages = {
    hi: 'Hey Guys, I am jwchan~'
  };

  // 导入模块成员

  // 使用模块成员
  const msg = messages.hi;

  log(msg);

}());
```

可以看到打包后的 `bundle` 代码很简洁，相比于 `webpack` 打包文件大量的引导代码以及模块函数，这里的代码几乎没有多余的代码。`rollup` 就是把我们的代码根据依赖的先后顺序，先后地拼接到了一起。仔细观察打包结果可以发现，`rollup` 打包结果只会保留需要用到的部分，对于未引用的部分，都没有输出。这是因为 `rollup` 会自动开启 `tree-shaking` 来优化打包结果，`tree-shaking` 这个概念最早也是在 `rollup` 这个工具提出来的。