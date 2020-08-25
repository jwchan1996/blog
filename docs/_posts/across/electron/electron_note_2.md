---
title: Electron 踩坑记录（二）
date: 2019-09-12
categories: "electron" #分类
tags:  #标签
    - electron
    - flash
---

# Electron 踩坑记录（二）

## 场景描述
-- `2020-04-28` 更新：由于 `flash 30` 版本以后会出现提示“未能正确加载必要组件”（其实是广告程序），导致失效，`flash` 版本应该替换为 `29` 版本。--  

[electron 引用 flash 插件打包示例](https://github.com/jwchan1996/electron-rtmp)

上一篇 `electron` 踩坑(一) 说到 `electron` 加载 `flash` 的问题  
采用的是加载系统安装好的 `flash` 插件，需要用户提前安装好 `flash` 才能正常工作 
```JavaScript
app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
```
其中 `app.getPath('pepperFlashSystemPlugin')` 会自动找寻系统 `flash` 的所在路径  
但是，如果用户没装 `flash` 就打开应用，就会提示报错，带来不好的用户体验  
所以，我们需要将 `flash` 嵌入应用依赖，也就是插件跟着应用打包  

`win` 下面的软件有 `32` 位和 `64` 位的说法，而且安装位置会有不同。那么 `flash` 也不例外  
```Bash
C:\Windows\System32\Macromed\Flash\pepflashplayer64_29_0_0_238.dll
C:\Windows\SysWOW64\Macromed\Flash\pepflashplayer32_29_0_0_238.dll
```
当然，上面版本号会变化，但是 `dll` 所在路径基本是如上所示  
找到 `flash` 所在路径后，我们就可以提取文件放到我们的应用目录下了  
编译后就会成为应用安装包的一部分，这样就不需要用户手动安装 `flash` 了  
🔥 那么，在 `electron` 目录下应该如何引入呢？

## 问题解决
将 `flash` 插件目录放到根目录的 `lib` 文件夹下  
```Bash
/lib/pepflashplayer64_29_0_0_238.dll
/lib/pepflashplayer32_29_0_0_238.dll
```
接下来需要在主程序入口文件 `/src/main/index.js` 下进行引入  
也就是将这一句获取系统 `flash` 插件路径的代码
```JavaScript
app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
```
换为
```JavaScript
let flashPlugins = process.arch == 'x64' 
  ? require('path').resolve(__dirname, '../../lib/pepflashplayer64_29_0_0_238.dll')
  : require('path').resolve(__dirname, '../../lib/pepflashplayer32_29_0_0_238.dll')
app.commandLine.appendSwitch('ppapi-flash-path', flashPlugins);
```
如果使用的是 `BrowserWindow`：  
```JavaScript
const mainWindow = new BrowserWindow({
    height: 900,
    width: 1600,
    useContentSize: true,
    frame: false,
    center: true,
    fullscreenable: false, // 是否允许全屏
    center: true, // 是否出现在屏幕居中的位置
    title: 'Electron应用',
    backgroundColor: '#fff', // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'hidden', // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    webPreferences: {    //配置web参数选项  
      plugins: true,    //开启插件
      webSecurity: false,   //安全
      defaultFontFamily: {      //字体相关
        standard: "Microsoft YaHei",
        defaultEncoding: "utf-8"
      }
    }
})
```
其中，`plugins: true` 是必须要配置的，这是告诉 `electron` 需要使用插件  
然后就是打包配置 `package.json`，在 `build` 项配置下面内容  
```Json
"build": {
    ……
    ……
    "win": {
      "icon": "build/icons/icon.ico",
      "extraResources": "./lib/*.dll"    //将特定的文件排除，不打包在asar包内
    },
    ……
    ……
}
```

还有一个问题比较困扰的是，在第一次进行应用打包时，打包需要的三个包文件下载速度极慢，导致体验很差，需要再进行镜像配置。

```Json
"build": {
    "electronDownload": {
      "mirror": "https://npm.taobao.org/mirrors/electron/"
    },
}
```

至此，开发模式和生产模式下都是可以成功运行的  
以下是 `/src/main/index.js` 完整代码  
```JavaScript
import { app, BrowserWindow } from 'electron'
import express from 'express'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

//解决flash本地file不安全问题，express用作本地服务器
function localServer() {
  let server = express();
  server.use(express.static(__dirname));
  server.listen(9080);
}

if (process.env.NODE_ENV === "production") {
  localServer();
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  // : `file://${__dirname}/index.html`
  //解决flash在file下不安全的问题
  : `http://localhost:9080/index.html`

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

function createWindow () {
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
    title: 'Electron应用',
    backgroundColor: '#fff', // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'hidden', // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    webPreferences: {
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
`End`