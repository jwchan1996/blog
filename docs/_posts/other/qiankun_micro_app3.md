---
title: qiankun 微前端应用实践与部署（三）
date: 2020-08-14
categories: "other" #分类
tags:  #标签
    - qiankun
    - micro-frontend
---

# qiankun 微前端应用实践与部署（三）

微前端架构下，主应用有自己的路由模块，同时主应用支持以微前端的方式嵌入业务模块（子应用），如何实现呢？

## 关于路由

`qiankun` 在主应用初始化会自动监听路由的变化去匹配注册好的子应用路由活动规则，同时 `vue` 路由也会监听路由变化。

因为主应用有自己的业务模块，需要支持页面刷新，所以采用 `hash` 路由模式。`qiankun` 官方 `demo` 使用的是 `history` 路由模式。

那么，采用 `hash` 路由模式的话，主应用路由会有 `/#/` 的前缀，比如主应用的 `resource` 组件路由：

```
http://localhost:8889/#/resource
```

假设 `history` 路由模式下子应用的注册信息为：

```javascript
{
  name: 'live',
  entry: '//localhost:7102',
  container: '#subapp-viewport',
  activeRule: '/live',
}
```

此时 `qiankun` 只有命中 `url` 为 `http://localhost:8889/live` 才会加载子应用。

此处假设使用的路由切换代码为：

```javascript
this.$router.push({
  path: '/live'
})
```

所以现在切换的 `url` 是 `http://localhost:8889/#/live`，显然不能匹配 `/live`，所以加载子应用失败。我们需要修改一下子应用注册的 `activeRule`，使得匹配 `hash` 路由模式。

为了区分开主应用的自身模块与子应用的路由区别，子应用的路由增加 `/micro` 前缀，比如 `/micro/live` 是子应用的路由。

那么 `hash` 路由模式下子应用的注册信息变成：

```javascript
{
  name: 'live',
  entry: '//localhost:7102',
  container: '#subapp-viewport',
  activeRule: '/#/micro/live',
}
```

路由切换代码修改为：

```javascript
this.$router.push({
  path: '/micro/live'
})
```

这样的话，主应用路由切换后的 `url` 就能命中子应用的 `activeRule` 了。

同时，子应用也需要将路由模式设置为 `hash` 模式，否则，会出现在子应用切换自身路由时，改变主应用 `hash` 路由的情况。比如子应用切换自身路由 `/about`，此时 `url` 会变成 `http://localhost:8889/about/#/micro/live`，导致路由命中失败。我们期望的 `url` 是 `http://localhost:8889/#/micro/live/about`。

所以，为了兼容主应用的 `hash` 模式路由，子应用也需要设置为 `hash` 模式的路由，最终结果是实现子应用路由与子应用注册在主应用的 `activeRule` 的一致性。

下面会分别对主应用与子应用进行配置。

## 配置子应用路由

子应用是常规 `vue` 项目，需要做调整的的是路由配置文件 `/router/index.js` 以及入口文件 `main.js`。

```javascript
// router/index.js

let prefix = ''

// 判断是 qiankun 环境则增加路由前缀
if(window.__POWERED_BY_QIANKUN__){
  prefix = '/micro/live'
}

const routes = [
  {
    path: prefix + '/',
    name: 'home',
    component: Home,
  },
  {
    path: prefix +'/about',
    name: 'about',
    component: About
  },
]
```

```javascript
// main.js

let router = null;
let instance = null;

function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    // 默认为 hash 路由模式
    // base: window.__POWERED_BY_QIANKUN__ ? '/micro/live' : '/',
    // mode: 'history',
    routes,
  })

  // 判断 qiankun 环境则进行路由拦截，判断跳转路由是否有 /micro 开头前缀，没有则加上
  if(window.__POWERED_BY_QIANKUN__){
    router.beforeEach((to, from, next) => {
      if(!to.path.includes('/micro')){
        next({
          path: '/micro/live' + to.path
        })
      }else{
        next()
      }
    })
  }

  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}
```

## 配置主应用路由

主应用需要修改的是子应用注册的路由匹配规则，因为主应用采用的是 `hash` 路由模式，`qiankun` 需要命中路由的话，`activeRule` 需要带上 `/#/` 前缀。

```javascript
// App.vue

const apps = [
  {
    name: 'live',
    entry: '//localhost:7101',
    container: '#subapp-viewport',
    activeRule: '/#/micro/live',
  }
]

registerMicroApps(apps, 
  {
    beforeLoad: [
      app => {
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
      },
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
      },
    ],
  },
)
```

```javascript
// router/index.js

// httpRoutes 非必要，主要用于匹配 vue 应用路由，与路由通配符 {path: '*'} 一起使用
// 因为如果 vue 路由没有匹配，默认是加载 Home 组件的
// 这样 vue 路由视图会与子应用共存，不符合业务需求
//
// 当前 httpRoutes 的路由配置是没有设置 path 对应的组件，所以匹配的路由视图必为空
//
// 如果不设置路由通配符，则 httpRoutes 不需要配置
const httpRoutes = [
  {
    path: '/micro/live',
    name: 'Live'
    // 没有配置 component，则 router-view 不会加载组件
  },
  {
    path: '/micro/live/:microRoute',
    name: 'Live*'
    // 没有配置 component，则 router-view 不会加载组件
  }
]

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    ...httpRoutes,
    {
      path: '*',
      component: Home
    }
  ]
})
```

当 `url` 变化时，首先主应用进入的是 `qiankun` 的路由匹配规则，匹配到 `/#/micro/live` 时，会加载子应用，同时主应用的 `vue` 路由匹配到路由后不会加载路由组件，这样就达到只显示子应用而 `vue` 路由组件不显示的目的。

当子应用内部的 `<router-link to="/about">` 被点击时，首先子应用跳转路由前会加上 `/micro/live` 前缀，实际上是 `/micro/live/about`，匹配到 `about` 路由，然后在主应用的 `vue` 路由中匹配到 `/micro/live/:microRoute`，同样不会加载组件。

> 本文参考：[前端微服务（qiankun）哈希路由实践](https://www.cnblogs.com/scdisplay/p/13037536.html)

#### 往期系列文章

[qiankun 微前端应用实践与部署](https://jwchan.cn/_posts/other/qiankun_micro_app.html)

[qiankun 微前端应用实践与部署（二）](https://jwchan.cn/_posts/other/qiankun_micro_app2.html)

[qiankun 微前端应用实践与部署（三）](https://jwchan.cn/_posts/other/qiankun_micro_app3.html)