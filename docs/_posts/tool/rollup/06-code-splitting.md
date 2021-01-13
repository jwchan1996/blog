# 代码拆分

`rollup` 最新的版本已经支持代码拆分了，可以使用动态导入的方式去实现代码的按需加载，`rollup` 的内部也会自动处理代码的拆分，也就是分包。

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/06-code-splitting)

```diff
  // src/index.js

- // // 导入模块成员
- // import { log } from './logger'
- // import messages from './messages'

- // // 使用模块成员
- // const msg = messages.hi

- // log(msg)

+  import('./logger').then(({ log }) => {
+    log('code splitting~')
+  })
```

需要注意的是，使用动态导入代码拆分的方式引入模块，打包输出的格式就不能是 `iife`，必须使用 `amd`、`cmd` 等其他标准。这里浏览器环境下，需要输出 `amd` 格式的打包结果。而且我们需要输出多个打包文件，配置文件的 `output` 属性就不能是 `file` 指定文件，需要配置的是 `dir` 输出目录。

```diff
  // rollup.config.js

  export default {
    input: 'src/index.js',
    output: {
-     // file: 'dist/bundle.js',
-     // format: 'iife'
+     dir: 'dist',
+     format: 'amd'
    }
  }
```

打包后可以看到分包文件以 `amd` 格式导出的。

![02](~public/rollup/06/01.png)