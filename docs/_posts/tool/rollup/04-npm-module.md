# 加载 npm 模块

`rollup` 默认只能通过文件路径的方式去加载本地文件模块，对于 `node_modules` 下的模块 `rollup` 并不能像 `webpack` 一样能够通过模块名称找到对应的模块。为了抹平这个差异，`rollup` 官方提供了 `rollup-plugin-node-resolve`这个插件，有了这个插件就可以直接在代码中使用模块名称导入对应的模块。

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/04-npm-module)

```bash
yarn add rollup-plugin-node-resolve --dev
```

```diff
  // rollup.config.js

  import json from 'rollup-plugin-json'
+ import resolve from 'rollup-plugin-node-resolve'

  export default {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'iife'
    },
    plugins: [
      json(),
+     resolve()
    ]
  }
```

```diff
  // src/index.js

  // 导入模块成员
+ import _ from 'lodash-es'
  import { log } from './logger'
  import messages from './messages'
  import { name, version } from '../package.json'

  // 使用模块成员
  const msg = messages.hi

  log(msg)

  log(name)
  log(version)
+ log(_.camelCase('hello world'))
```

这里使用 `lodash` 库的 `es` 版本是因为 `rollup` 默认只能处理 `ESM`，如果想要使用 `loadsh` 的普通版本，则需要进行另外的处理。