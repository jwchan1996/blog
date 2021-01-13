# 加载 CommonJS 模块

`rollup` 提供的 `rollup-plugin-commonjs` 可以使得 `rollup` 支持处理 `CommonJS` 的模块。

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/05-commonjs)

```bash
yarn add rollup-plugin-commonjs --dev
```

```diff
  // rollup.config.js

  import json from 'rollup-plugin-json'
  import resolve from 'rollup-plugin-node-resolve'
+ import commonjs from 'rollup-plugin-commonjs'

  export default {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'iife'
    },
    plugins: [
      json(),
      resolve(),
+     commonjs()
    ]
  }
```

新建一个 `CommonJS` 模块文件，然后对这个文件的导出进行引入：

```javascript
// src/cjs-module.js

module.exports = {
  foo: 'bar'
}
```

```diff
  // src/index.js

  // 导入模块成员
  import _ from 'lodash-es'
  import { log } from './logger'
  import messages from './messages'
  import { name, version } from '../package.json'
+ import cjs from './cjs-module'

  // 使用模块成员
  const msg = messages.hi

  log(msg)

  log(name)
  log(version)
  log(_.camelCase('hello world'))
+ log(cjs)
```

打包后，可以看到 `CommonJS` 模块的导出会以一个对象的形式出现在打包后的代码中。

![01](~public/rollup/05/01.png)