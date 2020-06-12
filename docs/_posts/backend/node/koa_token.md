---
title: koa 实现 token 有效时间续期的思路
date: 2019-09-06
categories: "node" #分类
tags:  #标签
    - koa
    - token
---

# koa 实现 token 有效时间续期的思路
## 场景描述
🍭 在前后端的交互中，无可避免的存在一些需要验证身份的请求。  
🍭 一般来说，使用 `token` 作为身份令牌可以实现身份验证的问题。  
🍭 以此同时，`token` 作为自带描述信息的无状态数据，唯一的判断标准就是生成 `token` 时设置的有效期时间，当超过有效期时则作废。  
🍭 我们在使用 `APP` 或 `WEB` 应用时，如果正在操作的时候，`token` 刚好过期了，那就出大问题了。  
🍭 所有的数据请求都会失败，给用户带来极其糟糕的体验。  
🍭 所以，如何才能让 `token` 进行续期呢？  

## 分析思路
🍤 因为 `token` 是无状态数据，一旦生成了，不能主动删除或者让它失效，唯一的就是等待有效期时间到。  
🍤 所以，我们会想到，在 `token` 过期时客户端携带新的 `token` 来访问数据接口，是不是就可以了呢。  
🍤 答案是的，那么现在需要解决的问题就是：
```bash
1.怎么返回新的 token 给到客户端
2.什么时候返回 token 使得用户登录状态得到续期
```
## 处理思路
1. 通过设置返回头设置新 `token` 的值，客户端使用 `axios` 进行响应拦截判断是否有新 `token` 字段，有则保存起来。
2. 如果用户在一定的 `token` 有效时间段期间（比如有效期时间的后半段）访问了数据接口，就应该对 `token` 进行续期。

### 代码实现
🍥 本次项目采用的是 `koa` 基于 `node` 实现的 `api` 服务端。  
🍥 主要文件有两个，一个是入口文件 `app.js`，另一个是工具函数文件 `token.js`。  
🍥 完整 `github` 项目可以查看 [PPAP.server](https://github.com/ppap6/PPAP.server)。  
```JavaScript
//token.js

const jwt = require('jsonwebtoken')
const secret = require('../config/config').secret

//判断token是否应该更新有效期（续期）
const getTokenRenewStatus = () => {

  //检测当前token是否到达续期时间段
  let obj = parseToken()
  if(!obj.email){
    return false
  }
  //更新时间段在过期前3天
  if(obj.exp - new Date().getTime()/1000 > 60*60*24*3){
    return false
  }else{
    return true
  }

}

//获取一个期限为7天的token
const getToken = (payload = {}) => {
  return jwt.sign(payload, secret, { expiresIn: 60*60*24*7 })
}

//重新生成一个期限为7天的token
const createNewToken = () => {

  let token = global.token
  let obj = jwt.verify(token, secret)
  let payload = {
    uid: obj.uid,
    name: obj.name,
    account: obj.account,
    roleId: obj.roleId,
    email: obj.email,
    password: obj.password
  }
  return getToken(payload)

}

//解析token为对象
const parseToken = () => {
  
  let token = global.token
  try {
    return jwt.verify(token, secret)
  }catch {
    console.log('token is expired')
    return {}
  }
  
}

module.exports = {
  secret,
  getTokenRenewStatus,
  getToken,
  createNewToken,
  parseToken
}
```
```JavaScript
//app.js

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