---
title: koa-jwt 实现自定义排除动态路由的鉴权
date: 2019-10-18
categories: "node" #分类
tags:  #标签
    - jwt鉴权
    - koa
    - token
---

# koa-jwt 实现自定义排除动态路由的鉴权
## 场景描述
🍭 之前在编写 [`PPAP.server`](https://github.com/ppap6/PPAP.server) 项目，一个基于 `koa2` 的 `nodejs` 服务端接口程序。  
由于接口采用的是 `RESTful API`，所以鉴权令牌由客户端携带发送到接口。  
业务需求的是部分接口是需要用户登陆再进行操作，比如需要记录用户点赞的接口。  
而不需要用户鉴权的接口，如查看帖子等不记录用户数据的接口。  

对于路由权限控制（鉴权），项目使用的是 [`koa-jwt`](https://github.com/auth0/node-jsonwebtoken)，支持对 `token` 的生成与校验，还能对接口路由进行过滤排除，指定不需要鉴权的接口。  

如：  
```JavaScript
//配置不需要jwt验证的接口
app.use(jwtKoa({ secret: tokenUtil.secret }).unless({
  path: [
    '/user/login',
    '/user/register'
  ]
}));
```
这样上面两个接口 `/user/login` 和 `/user/register` 都是可以跳过鉴权的，不需要携带 `token`。

对于本项目来说，棘手的是项目接口大多使用了动态路由，即比如 `/user/:id` 这样的接口，需要用正则表达式去进行匹配。  
但是动态路由 `/user/:id` 的请求方法可能会有 `get post put delete` 四种，所以不仅仅要排除配置的静态路由，还需要排除配置的特定请求方法的动态路由。  
<!--more-->
在阅读 `koa-jwt` 源码后，发现 `koa-jwt` 的 `unless` 方法调用了 [`koa-unless`](https://github.com/Foxandxss/koa-unless) 这个包，于是去阅读了 `koa-unless` 之后，发现可配置以下参数：  
```Bash
- method 它可以是一个字符串或字符串数组。如果请求方法匹配，则中间件将不会运行。
- path 它可以是字符串，正则表达式或其中任何一个的数组。如果请求路径匹配，则中间件将不会运行。
- ext 它可以是一个字符串或字符串数组。如果请求路径以这些扩展名之一结尾，则中间件将不会运行。
- custom 它必须是一个返回 true/ 的函数 false。如果函数针对给定的请求返回 true，则中间件将不会运行。该功能将通过 this 访问 Koa 的上下文
- useOriginalUrl 应该为 true 或 false，默认为 true。如果为false，path 则匹配 this.url 而不是 this.originalUrl。
```
结合项目的实际情况，解决方法只能是使用 `custom` 配置自定义函数进行判断。
## 解决方法
🍭 使用 `custom` 自定义函数进行过滤，创建文件 `jwt_unless.js`。
```JavaScript
/**
 * 用于判断客户端当前请求接口是否需要jwt验证
 */

//定义不需要jwt验证的接口数组(get方法)
const nonTokenApiArr = [
  '/',
  '/post'
]

//定义不需要jwt验证的接口正则数组(get方法)
const nonTokenApiRegArr = [
  /^\/user\/\d/,
  /^\/post\/\d/
]

//判断请求api是否在数组里
const isNonTokenApi = (path) => {
  return nonTokenApiArr.includes(path)
}

//判断请求api是否在正则数组里
const isNonTokenRegApi = (path) => {
  return nonTokenApiRegArr.some(p => {
    return (typeof p === 'string' && p === path) ||
      (p instanceof RegExp && !! p.exec(path))
  });
}

//判断当前请求api是否不需要jwt验证
const checkIsNonTokenApi = (ctx) => {
  if((isNonTokenApi(ctx.path) || isNonTokenRegApi(ctx.path)) && ctx.method == 'GET'){
    return true
  }else{
    //特殊post接口，不需要验证jwt
    if(ctx.path == '/user/login' || ctx.path == 'user/register'){
        return true
    }
    return false
  }
}

module.exports = {
  nonTokenApiArr,
  nonTokenApiRegArr,
  isNonTokenApi,
  isNonTokenRegApi,
  checkIsNonTokenApi
}
```
然后在 `app.js` 里引入 `jwt_unless.js`。
```JavaScript
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const jwtKoa = require('koa-jwt')  // 用于路由权限控制
const app = new Koa()

const config = require('./config/config')

const tokenUtil = require('./util/token')
const router = require('./router')

const jwtUnless = require('./util/jwt_unless')  //用于判断是否需要jwt验证

//配置ctx.body解析中间件
app.use(bodyParser())

// 错误处理
app.use((ctx, next) => {
  //设置CORS跨域
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE")
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type, Authorization")
  ctx.set("Content-Type", "application/json;charset=utf-8")
  ctx.set("Access-Control-Expose-Headers", "new_token")
  //获取token，保存全局变量
  if(ctx.request.header.authorization){
    global.token = ctx.request.header.authorization.split(' ')[1]
    //检测当前token是否到达续期时间段
    let obj = tokenUtil.parseToken()
    //解析token携带的信息
    global.uid = obj.uid
    global.name = obj.name
    global.account = obj.account
    global.email = obj.email
    global.roleId = obj.roleId
    //先解析全局变量再执行next()，保证函数实时获取到变量值
  }
  return next().then(() => {
    //执行完下面中间件后进入
    //判断不需要jwt验证的接口，跳过token续期判断
    if(jwtUnless.checkIsNonTokenApi(ctx)) return
    //判断token是否应该续期（有效时间）
    if(tokenUtil.getTokenRenewStatus()){
      //设置header
      ctx.set({
        new_token: tokenUtil.createNewToken()
      })
    }
  }).catch((err) => {
      //携带token的Authorization参数错误
      if(err.status === 401){
          ctx.status = 200
          ctx.body = {
            status: 401,
            message: '未携带token令牌或者token令牌已过期'
          }
      }else{
          throw err
      }
  })
})

//配置不需要jwt验证的接口
app.use(jwtKoa({ secret: tokenUtil.secret }).unless({
  //自定义过滤函数，详细参考koa-unless
  custom: ctx => {
    if(jwtUnless.checkIsNonTokenApi(ctx)){
      //是不需要验证token的接口
      return true
    }else{
      //是需要验证token的接口
      return false
    }
  }
}));

//初始化路由中间件
app.use(router.routes()).use(router.allowedMethods())

//监听启动窗口
app.listen(config.port, () => console.log(`PPAP.server is run on ${config.host}:${config.port}`))
```
到此就实现了对静态及动态路由鉴权，以及对 `token` 有效时间续期的判断。  
以上的示例针对的是 `get` 方法动态路由的判断，如果限制除了 `get` 请求外的多个请求方法，则需要在定义正则数组的时候，将请求方法跟正则表达式对应起来，如：
```JavaScript
const nonTokenApiRegArr = [
    { 
        path: /^\/user\/\d/,
        method: "GET"
    },
    { 
        path: /^\/user\/\d/,
        method: "POST"
    },
]
……
……
……
//判断请求api是否在正则数组里
const isNonTokenRegApi = (path, method) => {
  return nonTokenApiRegArr.some(p => {
    return (typeof p.path === 'string' && p.path === path && p.method === method) ||
      (p.path instanceof RegExp && !! p.path.exec(path) && p.method === method)
  });
}
//判断当前请求api是否不需要jwt验证
const checkIsNonTokenApi = (ctx) => {
  if(isNonTokenApi(ctx.path) || isNonTokenRegApi(ctx.path, ctx.method)){
    return true
  }else{
    return false
  }
}
```
更多详细请访问 [https://github.com/ppap6/PPAP.server](https://github.com/ppap6/PPAP.server)