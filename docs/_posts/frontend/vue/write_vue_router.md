---
title: 手写实现一个 VueRouter
date: 2020-12-10
categories: "vue" #分类
tags:  #标签
    - vue-router
---

# 手写实现一个 VueRouter

## 两种路由模式的实现思路

### Hash 模式

- `URL` 中 `#` 后面的内容作为路径地址
- 监听 `hashchange` 事件
- 根据当前路由地址找到对应组件进行重新渲染

### History 模式

- 通过 `window.history.pushState()` 方法改变地址栏
- 监听 `popstate` 事件
- 根据当前路由地址找到对应组件重新渲染

## 关于 VueRouter 模拟实现的分析

![VueRouter用法](~public/vue/write_vue_router/use_vue_router.png)

`Vue.use()` 的参数支持传入一个函数或对象。如果传入函数，`Vue.use()` 会调用这个函数。如果传入对象，`Vue.use()` 内部会调用这个对象的 `install` 方法。

下面是 `VueRouter` 的类图：

![VueRouter类图](~public/vue/write_vue_router/class_display.png)

类图一共分为三部分，上面部分是类的名称，中间部分是类的属性，下面部分是类的方法。

`VueRouter` 有三个属性，分别是 `options`、`data` 和 `routeMap`。

- `options` 属性的作用是记录构造函数中传入 的对象，传入的对象包含了 `routes` 属性，也就是路由规则。

- `routeMap` 是一个对象，它是用来记录路由地址与组件的对应关系的，将来会把路由地址解析到 `routeMap` 中来。

- `data` 是一个对象，它有一个属性 `current`，这个属性是用来记录当前路由地址的。此处设置有一个 `data` 对象的目的是我们需要一个响应式的对象。
路由地址发生变化之后组件要自动更新，需要调用 `Vue.observable()` 方法。

`VueRouter` 类图方法中 `+` 号是对外公开的方法，`-` 号是静态方法。其中 `install` 就是静态方法，用来实现 `Vue` 的插件机制。`init` 方法是用来调用后面的三个方法的。`initEvent` 方法用来监听 `popstate` 事件，用来监听浏览器历史变化。`createRouteMap` 方法是用来初始化 `routeMap` 属性的，能够把构造函数中传入的路由规则转化为键值对的形式存储到 `routeMap` 里面。`routeMap` 是一个对象，其中键就是路由地址，值是地址对应的组件，在 `<router-view />` 这个组件中会使用到 `routeMap`。`initComponents` 方法是用来创建 `<router-link />` 和 `<router-view />` 这两个组件的。

## 实现 VueRouter 的 install 方法

`Vue.use()` 方法注册 `VueRouter` 的时候自动调用 `VueRouter` 的 `install`
静态方法。下面模拟实现 `VueRouter`。

`install` 方法中要做几件事：

1. 判断当前插件是否已安装
2. 把 `Vue` 的构造函数记录到全局变量，因为将来需要在 `VueRouter` 的实例方法中使用这个 `Vue` 构造函数，比如在创建 `<router-link />` 和 `<router-view />` 这两个组件的时候需要调用 `Vue.initComponents()` 方法
3. 把创建 `Vue` 实例时传入的 `router` 对象注入到所有 `Vue` 实例上，我们之前使用的 `this.$router` 就是在这时候注入到 `Vue` 实例上的，并且所有的组件也是 `Vue` 的实例

```javascript
// myVueRouter.js

let _Vue = null

export default class VueRouter {
    // install 静态方法参数是 Vue 的构造函数
    static install (Vue) {
        // 1. 判断当前产插件是否已经被安装
        if (VueRouter.install.installed) {
            return
        }
        VueRouter.install.installed = true
        // 2. 把 Vue 构造函数记录到全局变量
        _Vue = Vue
        // 3. 把创建 Vue 实例时候传入的 router 对象注入到 Vue 实例上
        _Vue.mixin({
            beforeCreate () {
                // 判断是 Vue 根实例还是 Vue 组件，组件不需要重复注入，第一次实例化 Vue 注入即可
                if (this.$options && this.$options.router) {
                    // 只有 Vue 根实例的 $options 选项才有 router 属性
                    _Vue.prototype.$router = this.$options.router
                }
            }
        })
    }
}
```

## 实现 VueRouter 的构造函数

```javascript
// myVueRouter.js

let _Vue = null

export default class VueRouter {
    ...
    ...
    constructor (options) {
        this.options = options
        this.routeMap = {}
        // observable 方法是 Vue 提供的能够将对象定义为响应式的一个方法
        this.data = _Vue.observable({
            current: '/'
        })
    }
}
```

## 实现 VueRouter 的 createRouteMap 方法

`createRouteMap` 方法的作用是将构造函数传入的 `routes` 路由规则转换为键值对的形式保存在 routeMap 对象中，其中键就是路由地址，值是地址对应的组件。将来路由地址发生变化的时候，可以根据 `routeMap` 中的路由地址找到对应的组件，渲染到 `<router-view />` 组件中来。

```javascript
// myVueRouter.js

let _Vue = null

export default class VueRouter {
    ...
    ...
    constructor (options) {
        this.options = options
        this.routeMap = {}
        // observable 方法是 Vue 提供的能够将对象定义为响应式的一个方法
        this.data = _Vue.observable({
            current: '/'
        })
    }
    
    createRouteMap () {
        // 遍历所有的路由规则，把路由规则解析成键值对的形式储存到 routeMap 中
        this.options.routes.forEach(route => {
            // 键 -> 值
            // 路由地址 -> 组件
            this.routeMap[route.path] = route.component
        })
    }
}
```

## 实现 VueRouter 的 initComponents 方法

`initComponents` 方法是用来创建 `<router-link />` 和 `<router-view />` 这两个组件的。

定义一个 `init` 方法来调用 `createRouteMap` 方法与 `initComponents` 方法，在 `install` 静态方法内 `Vue` 根实例初始化时调用 `init` 方法。

```javascript
// myVueRouter.js

let _Vue = null

export default class VueRouter {
    // install 静态方法参数是 Vue 的构造函数
    static install (Vue) {
        // 1. 判断当前产插件是否已经被安装
        if (VueRouter.install.installed) {
            return
        }
        VueRouter.install.installed = true
        // 2. 把 Vue 构造函数记录到全局变量
        _Vue = Vue
        // 3. 把创建 Vue 实例时候传入的 router 对象注入到 Vue 实例上
        _Vue.mixin({
            beforeCreate () {
                // 判断是 Vue 根实例还是 Vue 组件，组件不需要重复注入，第一次实例化 Vue 注入即可
                if (this.$options && this.$options.router) {
                    // 只有 Vue 根实例的 $options 选项才有 router 属性
                    _Vue.prototype.$router = this.$options.router
                    // 调用定义好的 init 初始化方法 
                    this.$options.router.init()
                }
            }
        })
    }
    
    constructor (options) {
        this.options = options
        this.routeMap = {}
        // observable 方法是 Vue 提供的能够将对象定义为响应式的一个方法
        this.data = _Vue.observable({
            current: '/'
        })
    }
    
    createRouteMap () {
        // 遍历所有的路由规则，把路由规则解析成键值对的形式储存到 routeMap 中
        this.options.routes.forEach(route => {
            // 键 -> 值
            // 路由地址 -> 组件
            this.routeMap[route.path] = route.component
        })
    }
    
    // 实现这个 initComponents 方法时参数需要传 Vue 实例
    // 也可以通过全局变量 _Vue 获取，这里为了减少该方法对外部变量的依赖，使用传递 Vue 实例的方式
    initComponents (Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            template: '<a :href="to"><slot></slot></a>'
        })
    }
    
    // 定义一个初始化方法
    init () {
        this.createRouteMap()
        this.iniComponents(_Vue)
    }
}
```

如果是使用 `vue-cli` 创建出来的项目，默认是使用运行时版本，因为效率更高。上面自定义的 `VueRouter` 在使用时会报错，因为运行时 `Vue` 版本不支持 `template`。

### 关于 Vue 的构建版本

- 运行时版本：不支持 `template` 模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，体积比运行时版本大 `10K` 左右，程序运行的时候模板转换成 `render` 函数。

## 使用完整版 Vue 解决 template 模板问题

脚手架创建的根目录下，配置 `vue.config.js` 的 `runtimeCompiler`。

```javascript
// vue.config.js

module.exports = {
    // 选项
    runtimeCompiler: true
}
```

## 使用运行时版本的 Vue 解决 template 问题

```javascript
export default class VueRouter {
    ...
    ...
    initComponents (Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            //template: '<a :href="to"><slot></slot></a>'
            render (h) {
                return h ('a', {
                    attrs: {
                        href: this.to
                    }
                }, [this.$slots.default])
            }
        })
    }
}
```

运行时版本的 `Vue` 不支持 `template` 的编译，那就使用 `render` 函数进行渲染。

## 实现 VueRouter 的 router-view 组件

在定义 `<router-view />` 组件的时候需要先找到当前路由的地址，再去 `routeMap` 中找到当前路由地址所对应的组件，然后借助 `h` 函数将组件转换成虚拟 `DOM` 直接返回。

```javascript
export default class VueRouter {
    ...
    ...
    initComponents (Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            //template: '<a :href="to"><slot></slot></a>'
            render (h) {
                return h ('a', {
                    attrs: {
                        href: this.to
                    }
                }, [this.$slots.default])
            }
        })
        
        // 获取 VueRouter 实例
        const self = this
        Vue.component('router-view', {
            render (h) {
                // 获取当前路由对应的组件
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }
}
```

然后实际使用我们自定义的 `VueRouter` 发现点击 `<router-link />` 生成的 `a` 标签默认会刷新页面向服务器发生请求，我们需要给渲染生成 `a` 标签增加点击事件，阻止默认行为。其中 `pushState` 方法能够改变浏览器地址栏而不向服务器发送请求。

```javascript
export default class VueRouter {
    ...
    ...
    initComponents (Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            //template: '<a :href="to"><slot></slot></a>'
            render (h) {
                return h ('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler (e) {
                    // 改变浏览器地址栏 url
                    window.history.pushState({}, '', this.to)
                    // 设置当前路由地址到 VueRouter 实例的响应式属性 data 中，data 的成员改变，成员所对应的组件也会自动更新
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
        })
        
        // 获取 VueRouter 实例
        const self = this
        Vue.component('router-view', {
            render (h) {
                // 获取当前路由对应的组件
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }
}
```

## 实现 VueRouter 的 initEvent 方法

下面来实现 `initEvent` 方法，在这个方法中需要注册一个 `popstate` 事件。因为当前代码没有处理浏览器的前进后退，路由地址变了而组件没有跟着变。

> 注意：pushState 与 replaceState 方法都是不能触发 popstate 事件的。

```javascript
export default class VueRouter {
    init () {
        this.createRouteMap()
        this.initComponents(_vue)
        this.initEvent()
    }

    initEvent () {
       window.addEventListener('popstate', () => {
           this.data.current = window.location.pathname
       })
    } 
}
```

## 处理 VueRouter 的不同路由模式

上面只是支持处理 `history` 模式，还需要支持 `hash` 模式。在 `initEvent` 方法内对路由模式进行判断，进行相对应的处理。还需要对 `initComponents` 方法进行修改，其中方法内定义的 `<router-link>` 组件需要处理 `hash` 路由模式。

```javascript
export default class VueRouter {
    ...
    ...

    initComponents(Vue) {
        // 获取传入的路由模式
        const mode = this.options.mode === 'history' ? 'history' : 'hash'
        Vue.component('router-link', {
            props: {
                to: String
            },
            //template: '<a :href="to"><slot></slot></a>'
            render(h) {
                return h('a', {
                    attrs: {
                        // 增加对 hash 路由模式的处理
                        href: mode === 'history' ? this.to : `/#${this.to}`
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler(e) {
                    // hash 模式下不需要重写 a 标签默认行为，这里直接返回
                    if (mode === 'hash') return
                    // history 模式下改变浏览器地址栏 url
                    window.history.pushState({}, '', this.to)
                    // 设置当前路由地址到 VueRouter 实例的响应式属性 data 中，data 的成员改变，成员所对应的组件也会自动更新
                    this.$router.data.current = this.to
                    // history 模式下阻止 a 标签默认行为
                    e.preventDefault()
                }
            }
        })
        
        ...
        ...
    }
    
    initEvent () {
        // 对路由模式的判断以及处理，对浏览器前进后退的处理
        if (this.options.mode && this.options.mode === 'history') {
            // 监听浏览器前进后退触发的 popstate 事件，手动更改 current，触发更新组件视图
            window.addEventListener('popstate', () => {
                this.data.current = window.location.pathname
            }) 
        } else {
            // hash 模式
            // 判断是否已存在 hash 符号，不存在则添加 #/
            window.location.hash ? '' : window.location.hash = '/'
            // 第一次加载的时候对 hash 路由进行渲染
            window.addEventListener('load', () => {
                this.data.current = window.location.hash.slice(1)
            })
            // 监听 hash 变化
            window.addEventListener('hashchange', () => {
                // 这里因为是 hash 模式，所以 location.hash 的值是 #/ 开头的字符串 
                // 这里用 slice 截取去掉 #，赋值给 current，根据 routeMap 键值对触发组件的渲染
                this.data.current = window.location.hash.slice(1)
            })
        }
    }
}
```

## 完整 VueRouter 代码

下面是模拟实现的一个简单的 `VueRouter` 完整代码，尝试用模拟的 `VueRouter` 去代替 `vue-cli` 新创建出来的项目所引入的 `vue-router`，可以正常工作。

[仓库代码示例](https://github.com/jwchan1996/vue-router)

```javascript
// router/index.js

// import VueRouter from 'vue-router'
import VueRouter from '../../myVueRouter'
```

```javascript
// myVueRouter.js

let _Vue = null

export default class VueRouter {
  // install 静态方法参数是 Vue 的构造函数
  static install(Vue) {
    // 1. 判断当前产插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2. 把 Vue 构造函数记录到全局变量
    _Vue = Vue
    // 3. 把创建 Vue 实例时候传入的 router 对象注入到 Vue 实例上
    _Vue.mixin({
      beforeCreate() {
        // 判断是 Vue 根实例还是 Vue 组件，组件不需要重复注入，第一次实例化 Vue 注入即可
        if (this.$options && this.$options.router) {
          // 只有 Vue 根实例的 $options 选项才有 router 属性
          _Vue.prototype.$router = this.$options.router
          // 调用定义好的 init 初始化方法 
          this.$options.router.init()
        }
      }
    })
  }

  constructor(options) {
    this.options = options
    this.routeMap = {}
    // observable 方法是 Vue 提供的能够将对象定义为响应式的一个方法
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式储存到 routeMap 中
    this.options.routes.forEach(route => {
      // 键 -> 值
      // 路由地址 -> 组件
      this.routeMap[route.path] = route.component
    })
  }

  // 实现这个 initComponents 方法时参数需要传 Vue 实例
  // 也可以通过全局变量 _Vue 获取，这里为了减少该方法对外部变量的依赖，使用传递 Vue 实例的方式
  initComponents(Vue) {
    // 获取传入的路由模式
    const mode = this.options.mode === 'history' ? 'history' : 'hash'
    Vue.component('router-link', {
      props: {
        to: String
      },
      //template: '<a :href="to"><slot></slot></a>'
      render(h) {
        return h('a', {
          attrs: {
            // 增加对 hash 路由模式的处理
            href: mode === 'history' ? this.to : `/#${this.to}`
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandler(e) {
          // hash 模式下不需要重写 a 标签默认行为，这里直接返回
          if (mode === 'hash') return
          // history 模式下改变浏览器地址栏 url
          window.history.pushState({}, '', this.to)
          // 设置当前路由地址到 VueRouter 实例的响应式属性 data 中，data 的成员改变，成员所对应的组件也会自动更新
          this.$router.data.current = this.to
          // history 模式下阻止 a 标签默认行为
          e.preventDefault()
        }
      }
    })

    // 获取 VueRouter 实例
    const self = this
    Vue.component('router-view', {
      render(h) {
        // 获取当前路由对应的组件
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvent() {
    // 对路由模式的判断以及处理，对浏览器前进后退的处理
    if (this.options.mode && this.options.mode === 'history') {
      // 监听浏览器前进后退触发的 popstate 事件，手动更改 current，触发更新组件视图
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    } else {
      // hash 模式
      // 判断是否已存在 hash 符号，不存在则添加 #/
      window.location.hash ? '' : window.location.hash = '/'
      // 第一次加载的时候对 hash 路由进行渲染
      window.addEventListener('load', () => {
        this.data.current = window.location.hash.slice(1)
      })
      // 监听 hash 变化
      window.addEventListener('hashchange', () => {
        // 这里因为是 hash 模式，所以 location.hash 的值是 #/ 开头的字符串 
        // 这里用 slice 截取去掉 #，赋值给 current，根据 routeMap 键值对触发组件的渲染
        this.data.current = window.location.hash.slice(1)
      })
    }
  }
}
```