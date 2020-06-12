---
title: JavaScript 中的 call()、apply()、bind() 的用法
date: 2019-10-21
categories: "笔记" #分类
tags:  #标签
    - JS
---

# JavaScript 中的 call()、apply()、bind() 的用法 

**例1**  
```JavaScript
var name = '小陈'
var age = 18

var obj = {
  name: '小猪',
  objAge: this.age,
  fun: function(){
    console.log(this.name + '年龄' + this.age)
  }
}

obj.objAge    //18
obj.fun()    //小猪年龄undefined
```

**例2**  
```JavaScript
var name = 'PDD'
function show(){
  console.log(this.name)
}

show()    //PDD
```

比较一下这两者 `this` 的差别，第一个打印里面的 `this` 指向 `obj`，第二个全局声明的 `show()` 函数 `this` 是 `window`。  

> `call()、apply()、bind()` 都是用来重定义 `this` 这个对象的！  

如：    
```JavaScript
var name = '小陈'
var age = 18

var obj = {
  name: '小猪',
  objAge: this.age,
  fun: function(){
    console.log(this.name + '年龄' + this.age)
  }
}

var boy = {
  name: '朱丽叶',
  age: 16
}

obj.fun.call(boy)　　　//朱丽叶年龄16
obj.fun.apply(boy)　　　 //朱丽叶年龄16
obj.fun.bind(boy)()　　　//朱丽叶年龄16
```
以上除了 `bind` 方法后面多了个 `()` 外，结果返回都一致！  
由此得出结论，`bind` 返回的是一个新的函数，你必须调用它才会被执行。  

> 对比call 、bind 、 apply 传参情况下  
  
```JavaScript
var name = '小陈'
var age = 18

var obj = {
  name: '小猪',
  objAge: this.age,
  fun: function(a, b){
    console.log(this.name + ' 年龄 ' + this.age, ' 来自 ' + a + '去往' + b)
  }
}

var boy = {
  name: '朱丽叶',
  age: 16
}

obj.fun.call(db,'广州','深圳')　　　　 //朱丽叶 年龄 16  来自 广州去往深圳
obj.fun.apply(db,['广州','深圳'])      //朱丽叶 年龄 16  来自 广州去往深圳
obj.fun.bind(db,'广州','深圳')()       //朱丽叶 年龄 16  来自 广州去往深圳
obj.fun.bind(db,['广州','深圳'])()　　 //朱丽叶 年龄 16  来自 广州,深圳去往undefined
```

从上面四个结果不难看出 `call、bind、apply` 这三个函数的第一个参数都是 `this` 的指向对象，第二个参数差别就来了：  

- `call` 的参数是直接放进去的，第二第三第 `n` 个参数全都用逗号分隔，直接放到后面  `obj.fun.call(db,'成都', ... ,'string')`  

- `apply` 的所有参数都必须放在一个数组里面传进去 `obj.fun.apply(db,['成都', ..., 'string'])`

- `bind` 除了返回是函数以外，它的参数和 `call` 一样