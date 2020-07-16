---
title: Vuepress 使用 CDN 优化 gh-pages 加载速度
date: 2020-07-16
categories: "other" #分类
tags:  #标签
    - vuepress
    - webpack
---

# Vuepress 使用 CDN 优化 gh-pages 加载速度

众所周知，`github` 在国内访问极不稳定，有时候加载速度极慢，导致国内用户体验极差。  
我的 `Vuepress` [博客网站](https://jwchan.cn/)刚好是托管在 `gh-pages` 上，所以就想优化访问速度，让页面更加顺滑。

## 优化方案

下面优化博客加载速度的一些方案：

- 优化打包代码文件大小
- 压缩加载资源文件大小  
- 减少 `http` 请求次数
- 采用 `cdn` 加速

因为 `Vuepress` 是静态博客，而且 `Vuepress` 本身会优化打包代码文件大小，所以现在方向是压缩图片等资源文件大小，并且使用 `cdn` 加速。

## 使用 CDN 加速

免费的 `jsDelivr CDN` 天然支持 `Github` 仓库的加速，那么如何使用呢？

以我的博客仓库为例，仓库地址是 `https://github.com/jwchan1996/blog`。  
其中，仓库资源可以通过 `https://cdn.jsdelivr.net/gh/jwchan1996/blog` + `仓库文件路径` 直接访问。

比如：`https://cdn.jsdelivr.net/gh/jwchan1996/blog/README.md`

默认是访问 `master` 分支下的资源，如果需要访问其他分支的资源，需要指定分支：

```bash
# master分支
https://cdn.jsdelivr.net/gh/jwchan1996/blog@master/README.md

# gh-pages分支
https://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/logo.png
```

## 配置 Vuepress 

下面分别是 `Vuepress` 编译前的博客源码与编译后的目录截图：

> master 分支

![master](~public/other/vuepress_gh-pages_cdn/master.png)

> gh-pages 分支

![gh-pages](~public/other/vuepress_gh-pages_cdn/gh-pages.png)

我们的目的是部署博客代码到 `gh-pages` 的时候使用 `cdn` 资源路径，而本地开发依然采用本地路径。  

那么，如何配置呢？

找到 `config.js` 配置文件的 `configureWebpack` 配置：

```javascript
module.exports = {
  title: '飘香豆腐的博客',
  …
  …
  configureWebpack: {
    
  }
}
```

其中 `configureWebpack` 是用于修改 `Vuepress` 内部的 `Webpack` 配置的，可以是一个对象，也可以是一个函数，然后返回一个对象。

因为我们需要做环境判断是开发环境还是生产环境，所以我们使用函数配置。

```javascript
const path = require('path')

module.exports = {
  …
  …
  configureWebpack: () => {
    const NODE_ENV = process.env.NODE_ENV
    //判断是否是生产环境
    if(NODE_ENV === 'production'){
      return {
        output: {
          publicPath: 'https://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/'
        },
        resolve: {
          //配置路径别名
          alias: {
            'public': path.resolve(__dirname, './public') 
          }
        }
      }
    }else{
      return {
        resolve: {
          //配置路径别名
          alias: {
            'public': path.resolve(__dirname, './public') 
          }
        }
      }
    }
  }
}
```

此时我们 `markdown` 文件里面图片路径还是这样的：
```md
![gitlab 503](/docker/docker_gitlab_restore/02.png)
```
这样编译出来的的 `html` 文件图片路径依然是 `/docker/docker_gitlab_restore/02.png`，因为没有识别图片为 `Webpack` 模块，所以没有添加任何路径前缀。  

要想添加前缀，修改 `markdown` 文件图片地址即可，添加 `Webpack` 配置好的路径别名前缀：
```md
![gitlab 503](~public/docker/docker_gitlab_restore/02.png)
```

这样所有 `markdown` 文件的图片都会被打包到 `assets` 目录下，如 `/assets/img/02.706d49fc.png`  

同时 `html` 文件的图片路径也会加上配置的 `publicPath` 前缀：
```shell
# 打包后的CDN地址
https://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/assets/img/02.706d49fc.png
```
```shell
# 打包后的html文件图片标签
<img src="https://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/assets/img/02.706d49fc.png" alt="gitlab 503">
```

到此 `Vuepress` 的配置就完成了，将代码 `push` 到 `github` 仓库，等待自动化部署后，可以发现访问速度明显地提升了许多，顺滑许多！

具体访问体验可参考 [https://jwchan.cn](https://jwchan.cn/)