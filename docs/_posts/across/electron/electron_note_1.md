---
title: Electron 踩坑记录（一）
date: 2019-08-09
categories: "electron" #分类
tags:  #标签
    - electron
    - elecrton-vue
    - vue
    - flash
    - vue-video-player
    - rtmp
    - ant-design-vue
---

# Electron 踩坑记录（一）
## 场景描述
构建 `pc` 客户端，采用 `electron-vue` 脚手架进行快速搭建环境。  
功能点在 `web` 端全部正常，移植代码到 `electron` 时出现问题的功能点有：  
```
1. rtmp 流媒体的播放  
2. ant-design-vue UI 框架部分组件失效
```
🔥 播放器使用的是 `vue-video-player`，播放 `rtmp` 流需要使用 `flash` 技术。  

[electron 引用 flash 插件打包示例](https://github.com/jwchan1996/electron-rtmp)

## 问题解决
简单记录问题关键
```
问题：pc 客户端 ant-design-vue 部分组件不能正常工作 
原因：electron-vue 将它视为 webpack 的 externals 了，其中 UI 组件含有的 vue 文件没有被 vue-loader 正常编译，才导致功能失效
解决：找到 .electron-vue/webpack.renderer.config.js 将 ant-design-vue 加入到白名单 whiteListedModules
```
🔥 [electron 白名单配置](https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals)
```
问题：pc 客户端引入 flash 之后还是不能正常播放 rtmp 流
原因：electron 无法读取 vue-video-player 依赖安装的 videojs-flash 插件
解决：单独安装 videojs-flash 插件为项目的依赖 npm i videojs-flash -S
```
```
问题：编译成 pc 客户端后出现 vue-video-player 在即将 ready 这一步卡住
原因：flash 加载的安全问题，不允许在 "file://" 协议下加载
解决：在主线程里起一个 express 服务，使得页面运行在本地的端口服务即可
```

[electron 引用 flash 插件打包示例](https://github.com/jwchan1996/electron-rtmp)