# 配置文件

`rollup` 也支持以配置文件的方式去配置打包过程中的各项参数。

首先在项目根目录新建 `rollup.config.js` 文件，这个文件本身是运行在 `node` 环境的，不过由于 `rollup` 自身会处理这个配置文件，所以配置文件中可以直接使用 `ES Modules`。

![01](~public/rollup/02/01.png)

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/02-configuration-file)

在命令行中运行打包命令，使用 `--config` 参数说明使用配置文件的方式，因为 `rollup` 默认是不会去读取配置文件的。

```bash
yarn rollup --config
```

也可以通过这个 `--config` 参数指定配置文件的名称，比如 `rollup.production.js` 和 `rollup.development.js`。

```bash
yarn rollup --config rollup.config.js
```