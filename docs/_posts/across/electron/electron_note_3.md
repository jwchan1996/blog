---
title: Electron 踩坑记录（三）
date: 2020-08-28
categories: "electron" #分类
tags:  #标签
    - electron
    - flash
    - babel
---

# Electron 踩坑记录（三）

本文内容只适用于使用 `electron-vue` 模板生成的 `electron` 工程，相关配置也是围绕其进行。当然，使用 `vuecli3` 生成的 `electron` 工程也可参考。

对于 `electron-vue` 工程，由于理论上默认写死的 `9080` 端口可能出现被占用的情况，所以应用 `http` 服务应该采用自我判断的方式来使得端口保证可用。

[electron 引用 flash 插件打包示例](https://github.com/jwchan1996/electron-rtmp)

## 实现判断逻辑

在 `/lib/utils/` 下创建文件 `portIsOccupied.js`，实现判断端口占用情况，向进程环境 `process.env` 注入变量 `DEV_PORT`，并且返回可用的端口，使得主进程页面可以通过进程环境读取可用的端口，也可以获取通过 `Promise.resolve()` 返回的可用端口。

```javascript
const net = require('net')

function portIsOccupied(port) {

  const server = net.createServer().listen(port)
  
  return new Promise((resolve, reject) => {
  
    server.on('listening', () => {
      console.log(`the server is runnint on port ${port}`)
      server.close()
      // 使用注入进程环境变量的方式进行状态共享
      process.env.DEV_PORT = port
      process.env.PROD_PORT = port
      // 返回可用端口
      resolve(port)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        //注意这句，如占用端口号+1
        resolve(portIsOccupied(port + 1))
        console.log(`this port ${port} is occupied.try another.`)
      } else {
        reject(err)
      }
    })
    
  })

}

export default portIsOccupied
```

## 配置开发模式下的端口

因为项目使用 `electron-vue` 生成工程，与现在主流使用的 `vuecli3` 生成的 `electron` 工程结构有差别，但逻辑基本一样。下面是针对 `electron-vue` 工程的配置。

找到工程的 `/.electron/dev-runner.js` 文件，可以看到服务是通过 `WebpackDevServer` 插件跑起来的，其中端口是写死的 `9080`。

```javascript
const server = new WebpackDevServer(
  compiler,
  {
    contentBase: path.join(__dirname, '../'),
    quiet: true,
    before (app, ctx) {
      app.use(hotMiddleware)
      ctx.middleware.waitUntilValid(() => {
        resolve()
      })
    }
  }
)


server.listen(9080)
```

稍作修改，引入上面写好的函数，即可自行判断使用空闲的端口保证应用的运行。

```javascript
const portIsOccupied = require('../lib/utils/portIsOccupied')

……
……

portIsOccupied(9080).then(port => {
  server.listen(port)
})
```

因为纯 `node` 环境下不支持 `es6` 的 `import/export` 语法，所以我们需要借助 `babel` 来使得支持 `import/export`。

安装依赖：

```bash
$ npm install babel-cli -D
$ npm install babel-preset-es2015 -D
```

配置 `.babelrc`：

```json
{
    "presets": [
        "es2015"
    ]
}
```

修改 package.js 脚本运行命令：

`before` :

```json
{
    "scripts": [
        "dev": "node .electron-vue/dev-runner.js"
    ]
}
```

`after` :

```json
{
    "scripts": [
        "dev": "babel-node .electron-vue/dev-runner.js"
    ]
}
```

## 配置生产模式下的端口

在主线程文件 `/src/main/index.js` 下引入判断函数，判断是生产模式则使用 `express` 作为本地打包文件的 `http` 静态服务器，使得 `flash` 能正常加载。

对原先写死端口的 `localServer` 函数进行改造，引入端口判断函数。

`before` :

```javascript
function localServer() {
  let server = express()
  server.use(express.static(__dirname))
  server.listen(9080)
}
```

`after` : 

```javascript
import portIsOccupied from '../../lib/utils/portIsOccupied'

function localServer() {
  // 使用 promise 配合 await 实现同步
  return new Promise((resolve, reject) => {
    let server = express()
    server.use(express.static(__dirname))
    portIsOccupied(9080).then(port => {
      server.listen(port)
      resolve(port)
    })
  }) 
}
```

当在生产模式下执行 `localServer` 函数后，则可以在任意位置从进程环境读取到可用的端口，保证服务成功开启。

## 完整逻辑

下面是完整主线程文件 `/src/main/index.js`，具体逻辑如下：

```javascript
import { app, BrowserWindow } from 'electron'
import express from 'express'

//引入自动判断端口可用函数
import portIsOccupied from '../../lib/utils/portIsOccupied'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

//打包后的文件默认是以 "file://" 协议加载的
//因为 flash 不允许在 "file://" 协议下加载，为了解决 flash 加载的安全问题
//使用 express 用作本地服务器，使得页面运行在本地 http 端口服务
function localServer() {
  // 使用 promise 配合 await 实现同步
  return new Promise((resolve, reject) => {
    let server = express()
    server.use(express.static(__dirname));
    portIsOccupied(9080).then(port => {
      server.listen(port)
      resolve(port)
    })
  }) 
}

let mainWindow

let flashPlugins = process.arch == 'x64' 
  ? require('path').resolve(__dirname, '../../lib/pepflashplayer64_29_0_0_238.dll')
  : require('path').resolve(__dirname, '../../lib/pepflashplayer32_29_0_0_238.dll')

if (__dirname.includes(".asar")) {
  flashPlugins = process.arch == 'x64' 
    ? require('path').join(process.resourcesPath + '/lib/pepflashplayer64_29_0_0_238.dll')
    : require('path').join(process.resourcesPath + '/lib/pepflashplayer32_29_0_0_238.dll')
}
app.commandLine.appendSwitch('ppapi-flash-path', flashPlugins);
app.commandLine.appendSwitch('ppapi-flash-version', '29.0.0.238');

async function createWindow () {

  if (process.env.NODE_ENV === "production") {
    // 使用 async / await 实现同步等待，保证 process.env.PROD_PORT 的赋值
    await localServer()
  }

  const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.DEV_PORT}`
  // : `file://${__dirname}/index.html`
  // 解决 flash 不允许在 "file://" 协议下加载的问题
  : `http://localhost:${process.env.PROD_PORT}/index.html`

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    width: 1600,
    useContentSize: true,
    frame: false,
    center: true,
    fullscreenable: false, // 是否允许全屏
    center: true, // 是否出现在屏幕居中的位置
    title: 'electron-rtmp',
    backgroundColor: '#fff', // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'hidden', // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    'webPreferences': {
      plugins: true,
      webSecurity: false,
      defaultFontFamily: {
        standard: "Microsoft YaHei",
        defaultEncoding: "utf-8"
      }
    }
  })

  if (process.env.NODE_ENV == 'development') {
    mainWindow.webContents.openDevTools()
  }
  
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
```