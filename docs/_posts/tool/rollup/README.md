<h2 align="center">🌈 Rollup</h2>

# 学会 rollup 从零到一系列

- [01-快速上手](/_posts/tool/rollup/01-quickly-start.html)
- [02-配置文件](/_posts/tool/rollup/02-configuration-file.html)
- [03-使用插件](/_posts/tool/rollup/03-plugins.html)
- [04-加载 npm 模块](/_posts/tool/rollup/04-npm-module.html)
- [05-加载 CommonJS 模块](/_posts/tool/rollup/05-commonjs.html)
- [06-代码拆分](/_posts/tool/rollup/06-code-splitting.html)
- [07-多入口打包](/_posts/tool/rollup/07-multi-entry.html)
- [08-尝试多种打包格式](/_posts/tool/rollup/08-formats.html)

## 选用原则

rollup 的优点

- 输出结果更加扁平
- 自动移除未引用代码，也就是 tree-shaking
- 打包代码依然完全可读

rollup 的缺点

- 加载非 ESM 的第三方模块比较复杂
- 模块最终都打包都一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分功能依赖 AMD 库

**总结**：rollup 不适合用来开发一些比较复杂的应用，适合用来开发一个框架或类库。