<h2 align="center">🌈 Webpack</h2>

# 学会 webpack 从零到一系列

使用 `webpack 5` 作为实践，由于部分特性改动以及周边工具库更新等问题需要踩坑。`webpack` 周边工具库更新速度也很快，遇到报错需要去官网查看最新用法的改动。

## 系列文章

- [01-快速上手](/_posts/tool/webpack/01-quickly-start.html)
- [02-配置文件](/_posts/tool/webpack/02-configuration.html)
- [03-资源模块加载](/_posts/tool/webpack/03-asset-load.html)
- [04-处理 ES6 代码](/_posts/tool/webpack/04-babel-loader.html)
- [05-Loader 加载器机制](/_posts/tool/webpack/05-loader-theory.html)
- [06-webpack 常用插件](/_posts/tool/webpack/06-generally-used-plugins.html)
- [07-Plugin 插件机制](/_posts/tool/webpack/07-plugin-theory.html)
- [08-webpack-dev-server](/_posts/tool/webpack/08-webpack-dev-server.html)
- [09-HMR 模块热更新](/_posts/tool/webpack/09-webpack-hmr.html)
- [10-使用 Source Map](/_posts/tool/webpack/10-webpack-source-map.html)
- [11-为不同环境抽离配置](/_posts/tool/webpack/11-merge-webpack-config.html)
- [12-提取单个 CSS 文件并压缩](/_posts/tool/webpack/12-mini-cee-extract-plugin.html)
- [13-webpack 优化配置之 DefinePlugin](/_posts/tool/webpack/13-define-plugin.html)
- [14-webpack 优化配置之 Tree-shaking](/_posts/tool/webpack/14-tree-shaking.html)
- [15-webpack 优化配置之 sideEffects](/_posts/tool/webpack/15-side-effects.html)
- [16-webpack 优化配置之 Code Splitting 多入口打包](/_posts/tool/webpack/16-multiple-entry.html)
- [17-webpack 优化配置之 Code Splitting 动态导入](/_posts/tool/webpack/17-dynamic-import.html)

> 以此仓库记录 webpack 的使用与原理

## webpack 5 需要注意的事项

### webpack-cli 4.x 版本下使用 webpack-dev-server

关于 `webpack-cli 4.0` 及以上版本和 `webpack-dev-server` 之间的依赖报错问题，在 `webpack` 官网上面可以看到安装和配置的方式没有变动，启动的命令变了，直接使用 `webpack serve` 命令启动。

之前的依赖关系是 `webpack-dev-server` 依赖于 `webpack-cli` 内部的 `config-yargs`，`webpack-cli` 升级到 `4.0` 以后，统一了 `webpack` 命令的入口文件，反过来依赖 `webpack-dev-server` 来实现 `webpack serve` 的命令。

### 关于 target 默认输出代码格式

`webpack 5` 默认打包生成的组织代码中包含了现代化浏览器所支持的 `const` 与箭头函数，而默认的 `target: 'web'` 属性在 `webpack 4` 下转换组织代码格式为 `es5`，如果需要 `webpack 5` 打包输出的组织代码也为 `es5`，需要配置 `target` 属性值为 `es5`。

```diff
  // webpack.config.js
  module.exports = {
    ...
+   {
+     target: 'es5'
+   },
    ...
  }
```

![01](~public/webpack/00/01.png)