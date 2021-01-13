# 多入口打包

`rollup` 同样支持多入口打包，而且对于模块的公共部分会自动提取到单个独立的 `bundle` 文件中。

使用数组或对象方式匹配多入口都是可以的。

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/07-multi-entry)

```diff
  // rollup.config.js

  export default {
-   // input: ['src/index.js', 'src/album.js'],
+   input: {
+     foo: 'src/index.js',
+     bar: 'src/album.js'
+   },
    output: {
      dir: 'dist',
      format: 'amd'
    }
  }
```

打包输出：

```bash
├── dist
│   ├── bar.js
│   ├── foo.js
│   └── logger-9c715805.js
```

打包输出 `amd` 格式的结果后，浏览器是不能直接加载的，需要通过 `require.js` 这个库进行转换。

在 `dist` 目录下新建 `index.html`，这样引入打包后 `amd` 格式文件：

```html
// dist/index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- AMD 标准格式的输出 bundle 不能直接引用 -->
  <!-- <script src="foo.js"></script> -->
  <!-- 需要 Require.js 这样的库 -->
  <script src="https://cdn.jsdelivr.net/npm/requirejs@2.3.6/require.js" data-main="foo.js"></script>
</body>
</html>
```