---
title: JS 模拟实现 call、apply、bind
date: 2019-11-09
categories: "笔记" #分类
tags:  #标签
    - JS
---

# JS 模拟实现 call、apply、bind
## 实现call
`call` 的参数是直接放进去的，第二第三第 `n` 个参数全部都是用逗号分割  

下面是 `call` 的用法形式：

```JavaScript
function test(arg1, arg2) {
  console.log(arg1, arg2)
  console.log(this.a, this.b)
}

run.call(
  {
    a: "a",
    b: "b"
  },
  1,
  2
)
```

`call` 的作用是可以改变函数的上下文对象，也就是函数里 `this` 的指向  
👉 这是我们模拟实现 `call` 的关键  

**如果一个函数作为一个对象的属性，那么通过调用这个对象的属性调用该函数，`this` 就是该对象**
<!--more-->
```JavaScript
let obj = {
  a: "a",
  b: "b",
  test: function(arg1, arg2) {
    console.log(arg1, arg2)
    // this.a 就是 a; this.b 就是 b
    console.log(this.a, this.b)
  }
}

obj.test(1, 2)
```
下面就是模拟实现 `call`：
```JavaScript
Function.prototype.call2 = function(context){

    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    
    //默认执行上下文是window
    context = context || window
    
    //this指向调用call2的函数（调用函数）
    //将"调用函数"赋值给执行上下文对象的一个属性
    //成为上下文对象的方法
    //context.fn = this
    //考虑到属性名可能重复的情况，需要一个唯一的属性名（使用Symbol）
    const fn = Symbol('fn')
    context[fn] = this
    
    //对call2传入的参数进行提取
    //[...arguments].slice(0,1)是上下文对象
    //[...arguments].slice(1)是参数数组
    const args = [...arguments].slice(1)
    //调用上下文对象的方法
    //此时方法内部的this指向的是上下文对象
    //实现重定义"调用函数"的this指向
    const result = context[fn](...args)
    
    //删除临时定义的属性
    delete context[fn]
    
    return result
    
}

// 以下是测试代码
function test(arg1, arg2) {
  console.log(arg1, arg2)       //1,2
  console.log(this.a, this.b)   //a,b
}

test.call2(
  {
    a: "a",
    b: "b"
  },
  1,
  2
)
```

## 实现apply
`apply` 的参数都必须放在一个数组里面传进去，即第二个参数是数组
```JavaScript
Function.prototype.apply2 = function(context){
    
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    
    context = context || window
    //context.fn = this
    //考虑到属性名可能重复的情况，需要一个唯一的属性名（使用Symbol）
    const fn = Symbol('fn')
    context[fn] = this
    
    let result
    //apply要求传入的第二个参数是数组
    if(Array.isArray(arguments[1])){
        result = context[fn](...arguments[1])
    }else{
        result = context[fn]()
    }
    
    delete context[fn]
    
    return result
}

// 以下是测试代码
function test(arg1, arg2) {
  console.log(arg1, arg2)       //1,2
  console.log(this.a, this.b)   //a,b
}

test.apply2(
  {
    a: "a",
    b: "b"
  },
  [1, 2]
)
```

## 实现bind
`bind` 返回的是一个函数，参数传递跟 `call` 一样，返回的函数被调用是也可以带参数，`bind` 内部会将参数进行合并  

因为 `bind` 返回的是一个函数，所以需要考虑函数作为构造函数进行 `new` 创建对象的情况
```JavaScript
Function.prototype.bind2 = function(context){
    
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    
    context = context || window
    
    //this指向调用bind2的函数
    const that = this
    //此处的arguments指传入bind2的参数
    const args = [...arguments].slice(1)
    
    return function F(){
    
        //若返回的F函数被当作构造函数new创建实例
        //则此时this指向构造函数实例，不会改变上下文
        //若返回的F函数当作普通函数全局调用时
        //则this指向window
        if(this instanceof F){
            //此处的arguments指传入F的参数
            return new that(...args, ...arguments)
        }
        
        //return that.call(context, ...args.concat(...arguments))
        return that.apply(context, args.concat(...arguments))
        
    }
    
}

// 以下是测试代码
function test(arg1, arg2) {
  console.log(arg1, arg2)       //1,2
  console.log(this.a, this.b)   //a,b
}

const test2 = test.call2(
  {
    a: "a",
    b: "b"
  },
  1     //参数一
)

test2(2)    //参数二
```