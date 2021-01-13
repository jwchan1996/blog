# 使用插件

`rollup` 自身的功能就只是 `js` 模块的合并打包，如果项目有更高级的需求，比如想要加载其他类型的资源模块，导入 `CommonJS` 模块，或者编译 `ECMAScript` 新特性。这些额外的需求，`rollup` 支持使用插件的方式进行扩展，而且插件是 `rollup` 唯一的扩展方式，它不像 `webpack` 中划分了 `loader`、`plugin` 和 `minimizer` 这三种方式。

下面尝试使用一个可以在代码中导入 `json` 的插件。

```bash
yarn add rollup-plugin-json --dev
```

![01](~public/rollup/03/01.png)

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/03-plugins)

```javascript
// src/index.js

// 导入模块成员
import { log } from './logger'
import messages from './messages'
// 导入 json 资源文件内容
import { name, version } from '../package.json'

// 使用模块成员
const msg = messages.hi

log(msg)

log(name)
log(version)
```

配置插件后，在 `js` 中引入 `json` 文件，运行打包命令，可以看到 `package.json` 文件中的 `name` 以及 `version` 属性正常被打包进来，文件中其他属性都被 `tree-shaking` 移除掉了。

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

  var name = "03-plugins";
  var version = "1.0.0";

  // 导入模块成员

  // 使用模块成员
  const msg = messages.hi;

  log(msg);

  log(name);
  log(version);

}());
```