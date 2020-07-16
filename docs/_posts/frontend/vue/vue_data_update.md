---
title: vue 数据与视图更新
date: 2019-01-02
categories: "vue" #分类
tags:  #标签
    - vue
---

# vue 数据与视图更新
## 场景
`vue` 数据 `data` 更新了，但是视图没有更新  
其中缘由在于对 `vue` 的响应式原理的理解偏差
## 追踪变化
把一个普通的 `JavaScript` 对象传给 `Vue` 实例的 data 选项，`Vue` 将遍历此对象所有的属性，并使用 `Object.defineProperty` 把这些属性全部转为 `getter/setter`。  
这些 `getter/setter` 对用户来说是不可见的，但是在内部它们让 `Vue` 追踪依赖，在属性被访问和修改时通知变化。<!--more-->
每个组件实例都有相应的 `watcher` 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 `setter` 被调用时，会通知 `watcher` 重新计算，从而致使它关联的组件得以更新。 

![数据更新](~public/vue/vue_data_update/data.png)

## 声明响应性属性
在 `Vue` 中，一般只有在 `data` 选项中声明的属性（或者是属性的属性）才是具有响应特性的。如果需要在 `data` 选项之外对已有属性添加具有响应特性的属性，需要用到 `Vue` 的 `set` 方法。
```JavaScript
var vm = new Vue({
  data: {
    a: {              //a就是根级属性，不可动态添加
      b: 0          //b就是属性的属性，可以动态添加
    }
  }
})
```
`Vue` 不允许动态添加根级响应式属性，必须在初始化实例前声明根级响应式属性，哪怕只是一个空值：
```JavaScript
var vm = new Vue({
  data: {
    // 声明 message 为一个空值字符串
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// 之后设置 `message`
vm.message = 'Hello!'
```
何为响应特性？就是当我们更改 `data` 中的值的时候，`HTML` 与之绑定的部分会随之更新的特性。 
## 数组更新检测
### 变异方法替换数组  

`Vue` 包含一组观察数组的变异方法，所以它们也将会触发视图更新。这些方法如下：
- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

打开控制台，然后用 `items` 数组调用变异方法：`example1.items.push({ message: 'Baz' })` 。  

### 非变异方法替换数组  

变异方法 (mutation method)，顾名思义，会改变被这些方法调用的原始数组。相比之下，也有非变异 (non-mutating method) 方法，例如：`filter()`, `concat()` 和 `slice()` 。这些不会改变原始数组，但总是返回一个新数组。当使用非变异方法时，可以用新数组替换旧数组：
```JavaScript
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```
你可能认为这将导致 `Vue` 丢弃现有 `DOM` 并重新渲染整个列表。幸运的是，事实并非如此。`Vue` 为了使得 `DOM` 元素得到最大范围的重用而实现了一些智能的、启发式的方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。  

### 注意事项  

由于 `JavaScript` 的限制，`Vue` 不能检测以下变动的数组：  
1. 当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength` 

举个栗子： 
```JavaScript
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```
为了解决第一类问题，以下两种方式都可以实现和 `vm.items[indexOfItem] = newValue` 相同的效果，同时也将触发状态更新：
```JavaScript
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
```
你也可以使用 `vm.$set` 实例方法，该方法是全局方法 `Vue.set` 的一个别名：
```JavaScript
vm.$set(vm.items, indexOfItem, newValue)
```
为了解决第二类问题，你可以使用 `splice`：
```JavaScript
vm.items.splice(newLength)
```
## 对象更新检测
还是由于 `JavaScript` 的限制，`Vue` 不能检测对象属性的添加或删除：
```JavaScript
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` 现在是响应式的

vm.b = 2
// `vm.b` 不是响应式的
```
你可以添加一个新的 `age` 属性到嵌套的 `userProfile` 对象：
```JavaScript
Vue.set(vm.userProfile, 'age', 27)
```
你还可以使用 `vm.$set` 实例方法，它只是全局 `Vue.set` 的别名：
```JavaScript
vm.$set(vm.userProfile, 'age', 27)
```
有时你可能需要为已有对象赋予多个新属性，比如使用 `Object.assign()` 或 `_.extend()`。在这种情况下，你应该用两个对象的属性创建一个新的对象。所以，如果你想添加新的响应式属性，不要像这样：
```JavaScript
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```
你应该这样做：
```JavaScript
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```



## 数据响应式的几个例子
```JavaScript
var vm = new Vue({
  data:{
    a:1
  }
})

// `vm.a` 是响应的

vm.b = 2
// `vm.b` 是非响应的
```
`a` 就是在 `data` 中声明的具有响应特性的属性，而 `b` 就不是。  
```JavaScript
var vm = new Vue({
  data: {
    a: {
      a1:''
    }
  },
  methods: {
    change：function(){
      this.a.a1 = "text1"    //a1就是响应式的
      this.a.a2 = "text2"    //a2就不是响应式的
    }
  }
})
```
`a2` 虽然不是响应式的，但它却是可以在 `HTML` 部分被渲染更新出来。这里就是一个比较容易掉进去的坑。由于 `Vue` 是异步执行 `DOM` 更新，虽然更新的动作是由 `this.a.a1 = "text1"` 触发，可动作的完成是在 `this.a.a2 = "text2"` 之后，下面有详细解析。  
```JavaScript
var vm = new Vue({
  data: {
    a: {
      a1:''
    }
  },
  methods: {
    change: function () {
      this.a.a1 = "text1"    //a1就是响应式的
      this.a.a2 = "text2"    //a2就不是响应式的
      var that = this;
      setTimeout(function () {
        that.a.a3 = 'new text'; //这里与a2是相同的，区别在于这里的a3并不会被渲染到DOM中
        that.$set(that.a, 'a4', 'new text');    //这是正确的添加属性的方法
        that.a = {                              //这种写法与a2不同，a5可以被更新到DOM中
          a5: 'hahaha'
        }
      }, 300);
    }
  }
})
```

## 异步更新带来的数据响应式误解
异步数据的处理基本是一定会遇到的，处理不好就会遇到数据不更新的问题，但有一种情况是在未正确处理的情况下也能正常更新，这就会造成一种误解，详情如下所示：
```JavaScript
new Vue({
    el: '#app',
    data: {
        dataObj: {}
    },
    ready: function () {
        var self = this;

        /**
         * 异步请求模拟
         */
        setTimeout(function () {
            self.dataObj = {}; 
            self.dataObj['text'] = 'new text';
        }, 3000);
    }
})
```
上面的代码非常简单，我们都知道 `vue` 中在 `data` 里面声明的数据才具有响应式的特性，所以我们一开始在 `data` 中声明了一个 `dataObj` 空对象，然后在异步请求中执行了两行代码，如下：
```JavaScript
self.dataObj = {}; 
self.dataObj['text'] = 'new text';
```
首先清空原始数据，然后添加一个 `text` 属性并赋值。到这里为止一切都如我们所想的，数据和模板都更新了。   

<span style="color:red;">那么问题来了，`dataObj.text` 具有响应式的特性吗？</span>  

模板更新了，应该具有响应式特性，如果这么想那么你就已经走入了误区，一开始我们并没有在 `data` 中声明 `.text` 属性，所以该属性是不具有响应式的特性的。  

但模板切切实实已经更新了，这又是怎么回事呢？  

那是因为 `vue` 的 `dom` 更新是异步的，即当 `setter` 操作发生后，指令并不会立马更新，指令的更新操作会有一个延迟，当指令更新真正执行的时候，此时 `.text` 属性已经赋值，所以指令更新模板时得到的是新值。  
具体流程如下所示：
- `self.dataObj = { }`; 发生 `setter` 操作
- `vue` 监测到 `setter` 操作，通知相关指令执行更新操作
- `self.dataObj['text'] = 'new text'`; 赋值语句
- 指令更新开始执行    

所以真正的触发更新操作是 `self.dataObj = { }`; 这一句引起的，所以单看上述例子，具有响应式特性的数据只有 `dataObj` 这一层，它的子属性是不具备的。

注：其实 `vue` 文档中已经有说明，对于新增以及删除的属性，`vue` 是无法监测到的。  
```JavaScript
var a = {};

a.b = 0;    //新增b属性
a = {
    c: 0
};              //更改a属性的值
```
上述两种赋值方式对 `vue` 造成的影响是不同的。  

对比示例：
```JavaScript
new Vue({
    el: '#app',
    data: {
        dataObj: {}
    },
    ready: function () {
        var self = this;

        /**
         * 异步请求模拟
         */
        setTimeout(function () {
            self.dataObj['text'] = 'new text';
        }, 3000);
    }
})
```
上述例子的模板是不会更新的。

🍭 <span style="font-weight:700;">Vue.$set </span> 

通过 `$set` 方法可以将添加一个具备响应式特性的属性，并且其子属性也具备响应式特性，但是必须是新属性才可以，如果是本身已有的属性该方法是不起作用的。
```JavaScript
new Vue({
    el: '#app',
    data: {
        dataObj: {}
    },
    ready: function () {
        var self = this;

        /**
         * 异步请求模拟
         */
        setTimeout(function () {
            var data = {
                name: 'xiaofu',
                age: 18
            };
            var data01 = {
                name: 'yangxiaofu',
                age: 19
            };
            self.dataObj['person'] = {};
            self.$set('dataObj.info', data);
            self.$set('dataObj.person', data01); 
        }, 3000);
    }
})
```
如上所示，`.person` 属性是不具备响应式特性的。  
