# 尝试多种打包格式

`rollup.config.js` 文件支持导出一个数组，`rollup` 会遍历数组依次根据配置进行打包。

[示例代码仓库](https://github.com/jwchan1996/rollup-play/blob/main/08-formats)

```javascript
// rollup.config.js

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.iife.js',
      format: 'iife'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.cjs.js',
      format: 'cjs'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.esm.js',
      format: 'esm'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.amd.js',
      format: 'amd'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.system.js',
      format: 'system'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.umd.js',
      format: 'umd'
    }
  }
]
```

运行打包命令后会输出多种格式的打包结果。

```bash
├── dist
│   ├── bundle.amd.js
│   ├── bundle.cjs.js
│   ├── bundle.esm.js
│   ├── bundle.iife.js
│   ├── bundle.system.js
│   └── bundle.umd.js
```