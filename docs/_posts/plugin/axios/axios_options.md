---
title: 关于 axios 请求出现 OPTIONS
date: 2019-05-06
categories: "axios" #分类
tags:  #标签
    - axios
    - 跨域
    - options
---

# 关于 axios 请求出现 OPTIONS
## 为什么 axios 先要先请求 OPTIONS

🎨 最近在用 `vue` 重写一个以前的 `angular` + `thinkjs` 的项目，由于项目环境的前后端分离了，就出现了跨域问题，配置了一下 `CORS` 解决了跨域问题之后，又出现了 `axios` 请求发送两次的情况。

以登录功能为例，一共发送两个请求，第一个是 `OPTIONS` 请求，第二个是 `POST` 请求。

`axios` 配置如下：
```JavaScript
import axios from 'axios'
import qs from 'qs'

const baseURL = 'http://localhost:8888'

axios.interceptors.request.use((config) => {
  if(config.method  === 'post'){
    config.data = qs.stringify(config.data)
  }
  return config
},(error) =>{
  return Promise.reject(error)
})

const request = axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest', 
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  withCredentials: true // 允许携带cookie
})

export default request
```
执行功能请求的时候，控制台 `XHR` 请求如下：

![等待options](~public/axios/axios_options/axios_options_01.png)

一直处于 `pending` 状态，即等待中状态。

![等待options](~public/axios/axios_options/axios_options_02.png)

`thinkjs` 控制台显示请求时间如下：

![options请求处理时间](~public/axios/axios_options/axios_options_03.png)

![post请求处理时间](~public/axios/axios_options/axios_options_04.png)

👎 可以看到，`OPTIONS` 请求占用了差不多两分钟的时间之后，才进行 `POST` 请求，简直不能忍！！！

所以，问题来了，为什么会出现两次请求呢？这个 `OPTIONS` 请求到底是何方神圣？

### CORS 是什么

`CORS` 是一个 `W3C` 标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出 `XMLHttpRequest` 请求，从而克服了 `AJAX` 只能同源使用的限制。

### CORS 的局限性

`CORS` 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于 `IE10`。
整个 `CORS` 通信过程，都是浏览器自动完成，不需要用户参与。
浏览器一旦发现 `AJAX` 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求。
实现 `CORS` 通信的关键是服务器，只要服务器实现了 `CORS` 接口，就可以跨源通信。

### CORS 的类别

- 简单请求（simple request）
- 非简单请求（not-so-simple request）

### 简单请求（simple request）
只要同时满足以下两大条件，就属于简单请求：
```bash
请求方法是以下三种方法之一：
- HEAD
- GET
- POST
```
```bash
HTTP 的头信息不超出以下几种字段：
- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type: 只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain
```
🙄 对于简单请求，浏览器直接发出 `CORS` 请求。
具体来说，就是在头信息之中，增加一个 `Origin` 字段。
- `Access-Control-Allow-Origin`: 该字段是必须的。它的值要么是请求时 `Origin` 字段的值，要么是一个 `*` ，表示接受任意域名的请求。
- `Access-Control-Allow-Credentials`: 该字段可选。它的值是一个布尔值，表示是否允许发送 `Cookie`。默认情况下，`Cookie` 不包括在 `CORS` 请求之中。设为 `true`，即表示服务器明确许可，`Cookie` 可以包含在请求中，一起发给服务器。这个值也只能设为 `true`，如果服务器不要浏览器发送 `Cookie`，删除该字段即可。
- `Access-Control-Expose-Headers`: 该字段可选。`CORS` 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到 `6` 个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。

### 非简单请求（not-so-simple request）
复杂跨域请求要满足以下：
```bash
- 请求方法不是 HEAD/GET/POST
- POST 请求的 Content-Type 并非 application/x-www-form-urlencoded、multipart/form-data、text/plain
- 请求设置了自定义的 header 字段
```
1. 非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或者 `Content-Type` 字段的类型是 `application/json`。
2. 非简单请求的 `CORS` 请求，会在正式通信之前，增加一次 `HTTP` 查询请求，称为"预检"请求（preflight）。
3. "预检"请求用的请求方法是 `OPTIONS`，表示这个请求是用来询问的。头信息里面，关键字段是 `Origin`，表示请求来自哪个源。
4. 浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 `HTTP` 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest` 请求，否则就报错。
5. 除了 `Origin` 字段，"预检"请求的头信息包括两个特殊字段：
    - `Access-Control-Request-Method`：该字段是必须的，用来列出浏览器的 `CORS` 请求会用到哪些 `HTTP` 方法。
    - `Access-Control-Request-Headers`：该字段是一个逗号分隔的字符串，指定浏览器 `CORS` 请求会额外发送的头信息字段。

一旦服务器通过了"预检"请求，以后每次浏览器正常的 `CORS` 请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。服务器的回应，也都会有一个 `Access-Control-Allow-Origin` 头信息字段。

## 解决 axios 请求 OPTIONS 的方法
😑 就是！把非简单请求转换为简单请求！！！

简单粗暴~

![修改header](~public/axios/axios_options/axios_options_05.png)

再次请求接口，发现 `OPTIONS` 请求已经没有了，直接 `POST` 请求响应速度杠杠的！

![post请求成功](~public/axios/axios_options/axios_options_06.png)

`END`