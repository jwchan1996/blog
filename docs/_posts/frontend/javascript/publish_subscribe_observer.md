---
title: 发布订阅模式和观察者模式
date: 2020-10-23
categories: "javascript" #分类
tags:  #标签
    - JS
---

# 发布订阅模式和观察者模式

## 发布/订阅模式

- **订阅者**
- **发布者**
- **事件中心**

> 我们假定，存在一个“事件中心”，某个任务执行完成，就向事件中心“发布”（publish）一个事件，其他任务可以向事件中心“订阅”（subscribe）这个事件，从而知道什么时候自己可以执行。这就叫做“发布/订阅模式”（publish-subscribe pattern）

```javascript
// vue 实现的中央事件总线

let vm = new Vue()

// { 'dataChange': [fn1, fn2], 'handleData: [fn]' }
// 注册事件（订阅消息）
vm.$on('dataChange', () => {
    console.log('dataChange1')
})

vm.$on('dataChange', () => {
    console.log('dataChange2')
})

// 触发事件（发布消息）
vm.$emit('dataChange')
```

下面实现一个发布订阅：

```javascript
// 手写实现发布订阅

// 事件触发器
class EventEmitter {
    constructor () { 
        // { 'click': [fn1, fn2], 'change: [fn]' }
        // 用一个对象来储存事件订阅信息，同一个事件可被订阅多次，故事件的回调函数用数组储存
        this.subs = Object.create(null)
    }
    
    // 注册事件
    $on (eventType, handler) {
        // 需要找到储存事件订阅信息对象里是否有当前事件，有则获取已有数组，否则赋值为空数组
        this.subs[eventType] = this.subs[eventType] || []   
        // 新注册事件处理函数
        this.subs[eventType].push(handler)
    }
    
    // 触发事件
    $emit (enventType) {
        // 先判断是否有当前事件，有则执行，没有则不作处理
        if(this.subs[eventType]){
            // 遍历数组调用事件函数
            this.subs[eventType].forEach(handler => {
                handler()       
            })
        }
    }
}

const em = new EventEmitter()

em.$on('click', () => {
    console.log('click1')
})
em.$on('click', () => {
    console.log('click2')
})

em.$emit('click')
```

## 观察者模式

- **观察者（订阅者）**-- Watcher
    - update()： 当事件发生时，具体要做的事情
- **目标（发布者）**-- Dep
    - subs 数组： 储存所有观察者
    - addSub()： 添加观察者
    - notify()： 当事件发生时，调用所有观察者的 update() 方法
- **没有事件中心**

> 关于为什么目标（发布者）用 Dep 表示，是因为 Dep 是 dependence（依赖）的缩写。因为 Watcher 观察者（订阅者）需要依赖 Dep 才能了解数据的变化，没有 Dep，Watcher 根本不可能知道数据发生了变化，当有数据变化发生时，Dep 会通知 Watcher。

```javascript
// 发布者-目标
class Dep {
    constructor () {
        // 记录所有的订阅者
        this.subs = []
    }
    
    // 添加订阅者
    addSub (sub) {
        // 在添加之前，要确保订阅者存在且具有update方法
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }
    
    // 发布通知
    notify () {
        // 找到所有的订阅者并调用它们的update方法
        this.subs.forEach(sub => {
            sub.updatre()
        })
    }
}

// 订阅者-观察者
class Watcher {
    update () {
        console.log('update')
    }
}

let dep = new Dep()
let watcher = new Watcher()

dep.addSub(watcher)

dep.notify()
```

## 总结

- **观察者模式** 是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者和发布者之间是存在依赖的
- **发布/订阅模式** 由统一调度中心（事件中心）调用，因此发布者和订阅者不需要知道对方的存在

> 事件中心隔离了发布者和订阅者，去除它们之间的相互依赖。观察者模式中，目标与观察者是相互依赖的，而发布订阅模式中，多了个事件中心。事件中心是隔离发布者和订阅者的，减少发布者和订阅者的依赖关系，会变得更加灵活。

![图示](~public/javascript/publish_subscribe_observer/example.png)