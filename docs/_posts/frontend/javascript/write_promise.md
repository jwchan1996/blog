---
title: 手写实现一个 Promise
date: 2020-11-02
categories: "javascript" #分类
tags:  #标签
    - JS
---

# 手写实现一个 Promise

## 关于 Promsie

- Promise 就是一个类，在执行这个类的时候，需要传递一个执行器（executor）进去，执行器会立即执行。
- Promise 中有三种状态，分别为成功（fulfilled）、失败（rejected）和等待（pending）。其中 pending 状态会变为 fulfilled 或者 rejected，且一旦状态确定就不可以更改。
- resolve 和 reject 函数是用来改变状态的： `resolve -> fulfilled`、`reject -> rejected`。
- then 方法内部做的事情就是判断状态。如果状态是成功，调用成功的回调函数。如果状态是失败，调用失败的回调函数。每一个 Promise 对象都能够调用 then 方法，then 方法是被定义在原型对象中的。
- then 的成功回调函数有一个参数，表示成功之后的值。then 的 失败回调函数也有一个参数，表示失败后的原因。

```javascript
let promise = new Promise((resolve, reject) => {
    resolve('成功')
    //reject('失败')
})

promise.then(value => {
    console.log(value)
}, reason => {
    console.log(reason)
})
```

## 实现一个简单 Promise 类

```javascript
const PENDING = 'pending'   // 等待
const FULFILLED = 'fulfilled'   // 成功
const REJECTED = 'rejected'     // 失败

class MyPromise {
    constructor (executor) {
        // 传入一个执行器并立即执行（执行器两个参数是函数）
        executor(this.resolve, this.reject)
    }
    
    // promise 状态初始值
    status = PENDING
    // promise 成功 resolve 传递的值（默认值）
    value = undefined
    // promise 失败 reject 传递的原因（默认值）
    reason = undefined
    
    resolve = value => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存 promise 成功传过来的值
        this.value = value 
    }
    
    reject = reason => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为失败
        this.status = REJECTED
        // 保存 promise 失败传过来的原因
        this.reason = reason 
    }
    
    // 类的所有方法都是定义在类的 prototype 属性上面的
    // 即类的方法是被定义在原型对象中的，此处 then 方法就是
    // then 方法期望的参数是回调函数
    then (successCallback, failCallback) {
        // 判断状态
        if (this.status === FULFILLED) {
            successCallback(this.value)
        } else if (this.status === REJECTED) {
            failCallback(this.reason)
        }
    }
}
```

## Promise 类中处理异步逻辑

假设在我们在 MyPromise 类实例对象的执行器中执行异步任务 setTimeout。

```javascript
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功')
    }, 2000)
    //reject('失败')
})

promise.then(value => {
    console.log(value)
}, reason => {
    console.log(reason)
})
```

代码的执行顺序是从上到下依次执行的，在创建 MyPromsie 类实例对象后，执行器会立即执行。在执行器代码执行过程中，发现 setTimeout 是异步任务，那么代码执行主线程会在开启这个异步任务后会立即往下执行，不会等待异步任务的完成，所以会立即往下执行 then 方法。

但是，由于此时还没有发生状态改变，MyPromise 实例对象的状态还是处于 pending 状态，因此我们要在 then 方法内对 pending 这种状态进行处理（因为 then 方法 只执行一次，等异步任务结束后 Promise 状态改变已经不会再执行这一次的 then 方法了）。

异步耗时任务结束后会调用 resolve 或者 reject 方法，因此我们还需要在 MyPromise 类的 resolve 属性方法和 reject 属性方法内调用定义在 then 方法内的成功回调函数和失败回调函数。
那么就要在 then 方法中判断当前状态是否处于 pending，在 MyPromise 类中添加两个新属性 successCallback 和 failCallback 来接收 then 方法的成功回调函数和失败回调函数，以便于在异步任务结束后能在 resolve 或 reject 属性方法内进行调用，使 then 方法在 Promise 执行器有异步任务的情况下能正常工作。

```javascript
const PENDING = 'pending'   // 等待
const FULFILLED = 'fulfilled'   // 成功
const REJECTED = 'rejected'     // 失败

class MyPromise {
    constructor (executor) {
        // 传入一个执行器并立即执行（执行器的两个参数是函数）
        executor(this.resolve, this.reject)
    }
    
    // promise 状态初始值
    status = PENDING
    // promise 成功 resolve 传递的值（默认值）
    value = undefined
    // promise 失败 reject 传递的原因（默认值）
    reason = undefined
    
    // 成功回调
    successCallback = undefined
    // 失败回调
    failCallback = undefined
    
    resolve = value => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存 promise 成功传过来的值
        this.value = value 
        
        // 判断成功回调是否存在，如果存在，则调用
        this.successCallback && this.successCallback(this.value)
    }
    
    reject = reason => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为失败
        this.status = REJECTED
        // 保存 promise 失败传过来的原因
        this.reason = reason 
        
        // 判断失败回调是否存在，如果存在，则调用
        this.failCallback && this.failCallback(this.reason)
    }
    
    // 类的所有方法都是定义在类的 prototype 属性上面的
    // 即类的方法是被定义在原型对象中的，此处 then 方法就是
    // then 方法期望的参数是回调函数
    then (successCallback, failCallback) {
        // 判断状态
        if (this.status === FULFILLED) {
            successCallback(this.value)
        } else if (this.status === REJECTED) {
            failCallback(this.reason)
        } else {
        
            // pending 等待状态
            // 如果 Promsie 实例对象传入的执行器存在异步任务时
            // 会开启异步任务后立即执行 then，此时状态还是处于 pending
            // 将成功回调和失败回调函数通过类的属性储存起来
            // 以便于异步任务结束后在 resolve 或 reject 中执行 then 的回调函数
            this.successCallback = successCallback
            this.failCallback = failCallback
            
        }
    }
}
```

## 实现 then 方法多次调用

同一个 Promise 实例对象的 then 方法是可以被多次调用的，当 Promise 状态变为成功或失败时，then 方法里面的成功或失败回调函数是要被依次调用的。其中，Promise 实例对象传入的执行器里面的代码有可能是同步执行也有可能是异步执行。

如果是同步执行，执行 then 方法的时候 Promise 状态已经改变，那么执行 then 方法内相对应的回调函数即可。如果是异步执行，那么我们需要将多次调用 then 方法所触发的回调函数用数组储存起来，等待 Promise 执行器的异步代码执行完毕后，根据返回状态成功或失败，在 resolve 或 reject 属性方法内循环数组，依次调用（队列先进先出）回调函数即可。

```javascript
let promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功')
    }, 2000)
    // resolve('成功')
    // reject('失败')
})

promise.then(value => {
    console.log(value)
})
promise.then(value => {
    console.log(value)
})
```

```javascript
const PENDING = 'pending'   // 等待
const FULFILLED = 'fulfilled'   // 成功
const REJECTED = 'rejected'     // 失败

class MyPromise {
    constructor (executor) {
        // 传入一个执行器并立即执行（执行器两个参数是函数）
        executor(this.resolve, this.reject)
    }
    
    // promise 状态初始值
    status = PENDING
    // promise 成功 resolve 传递的值（默认值）
    value = undefined
    // promise 失败 reject 传递的原因（默认值）
    reason = undefined
    
    // 成功回调
    // successCallback = undefined
    // 因为多次调用 then 方法，所以用数组来存储多个回调函数
    successCallback = []
    // 失败回调
    // failCallback = undefined
    failCallback = []
    
    resolve = value => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存 promise 成功传过来的值
        this.value = value 
        
        // 判断成功回调是否存在，如果存在，则调用
        // this.successCallback && this.successCallback(this.value)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.successCallback.length) this.successCallback.shift()(this.value)
    }
    
    reject = reason => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为失败
        this.status = REJECTED
        // 保存 promise 失败传过来的原因
        this.reason = reason 
        
        // 判断失败回调是否存在，如果存在，则调用
        // this.failCallback && this.failCallback(this.reason)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.failCallback.length) this.failCallback.shift()(this.reason)
    }
    
    // 类的所有方法都是定义在类的 prototype 属性上面的
    // 即类的方法是被定义在原型对象中的，此处 then 方法就是
    // then 方法期望的参数是回调函数
    then (successCallback, failCallback) {
        // 判断状态
        if (this.status === FULFILLED) {
            successCallback(this.value)
        } else if (this.status === REJECTED) {
            failCallback(this.reason)
        } else {
        
            // pending 等待状态
            // 如果 Promsie 实例对象传入的执行器存在异步任务时
            // 会开启异步任务后立即执行 then，此时状态还是处于 pending
            // 将成功回调和失败回调函数通过类的属性储存起来
            // 以便于异步任务结束后在 resolve 或 reject 中执行 then 的回调函数
            
            // 多次调用 then 方法，回调函数存储到数组中
            // this.successCallback = successCallback
            this.successCallback.push(successCallback)
            // this.failCallback = failCallback
            this.failCallback.push(failCallback)
            
        }
    }
}
```

## 实现 then 方法的链式调用

Promise 实例对象的 then 方法是可以被链式调用的。要实现 then 方法的链式调用，then 方法必须返回一个 Promise 对象。所以我们要在 then 方法里创建一个新的 Promise 对象并返回， 还要实现将上一个 then 方法的回调函数返回值传递给下一个 then 方法。

具体实现是在上一个 then 方法里返回的新 Promise 对象的执行器里执行 resolve 方法，resolve 方法会把上一个 then 方法的回调函数返回的值传递给新 Promise 对象的 then 方法，这样就实现了 then 方法的链式调用。

```javascript
let promise = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    //    resolve('成功')
    // }, 2000)
    resolve('成功')
    // reject('失败')
})

promise.then(value => {
    console.log(value)
    return 100
}).then(value => {
    console.log(value)
})
```

```javascript
const PENDING = 'pending'   // 等待
const FULFILLED = 'fulfilled'   // 成功
const REJECTED = 'rejected'     // 失败

class MyPromise {
    constructor (executor) {
        // 传入一个执行器并立即执行（执行器两个参数是函数）
        executor(this.resolve, this.reject)
    }
    
    // promise 状态初始值
    status = PENDING
    // promise 成功 resolve 传递的值（默认值）
    value = undefined
    // promise 失败 reject 传递的原因（默认值）
    reason = undefined
    
    // 成功回调
    // successCallback = undefined
    // 因为多次调用 then 方法，所以用数组来存储多个回调函数
    successCallback = []
    // 失败回调
    // failCallback = undefined
    failCallback = []
    
    resolve = value => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存 promise 成功传过来的值
        this.value = value 
        
        // 判断成功回调是否存在，如果存在，则调用
        // this.successCallback && this.successCallback(this.value)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.successCallback.length) this.successCallback.shift()(this.value)
    }
    
    reject = reason => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为失败
        this.status = REJECTED
        // 保存 promise 失败传过来的原因
        this.reason = reason 
        
        // 判断失败回调是否存在，如果存在，则调用
        // this.failCallback && this.failCallback(this.reason)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.failCallback.length) this.failCallback.shift()(this.reason)
    }
    
    // 类的所有方法都是定义在类的 prototype 属性上面的
    // 即类的方法是被定义在原型对象中的，此处 then 方法就是
    // then 方法期望的参数是回调函数
    then (successCallback, failCallback) {
    
        // 创建新的 Promise 对象作为返回值，实现链式调用 then 方法
        let newPromise = new MyPromise((resolve, reject) => {
        
            // 判断状态
            if (this.status === FULFILLED) {
                
                // 新的 Promise 对象的执行器调用 resolve 方法，参数是上一个 then 方法的回调函数返回值
                // 因为是实现 then 方法的链式调用，所以只在 fulfilled 状态处理即可
                let x = successCallback(this.value)
                resolve(x)
                
            } else if (this.status === REJECTED) {
                failCallback(this.reason)
            } else {
            
                // pending 等待状态
                // 如果 Promsie 实例对象传入的执行器存在异步任务时
                // 会开启异步任务后立即执行 then，此时状态还是处于 pending
                // 将成功回调和失败回调函数通过类的属性储存起来
                // 以便于异步任务结束后在 resolve 或 reject 中执行 then 的回调函数
                
                // 多次调用 then 方法，回调函数存储到数组中
                // this.successCallback = successCallback
                this.successCallback.push(successCallback)
                // this.failCallback = failCallback
                this.failCallback.push(failCallback)
                
            }
            
        })
        
        return newPromise
        
    }
}
```

在链式调用 then 方法时，可以在回调函数返回一个普通值，也可以返回一个 Promise 对象。 

如果 then 方法的成功回调函数返回的是普通值，可以直接在 then 方法返回的新 Promise 对象的执行器中直接调用 resolve 方法，就可以把值传递给新 Promise 对象接下来要调用的 then 方法的回调函数。

如果 then 方法的成功回调函数返回的是 Promise 对象，则需要查看 Promise 对象返回的结果，再根据结果决定调用 resolve 方法还是 reject 方法。

```javascript
let promise = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    //    resolve('成功')
    // }, 2000)
    resolve('成功')
    // reject('失败')
})

promise.then(value => {
    console.log(value)
    // return 100
    return Promise.resolve('other')
}).then(value => {
    console.log(value)
})
```

```javascript
const PENDING = 'pending'   // 等待
const FULFILLED = 'fulfilled'   // 成功
const REJECTED = 'rejected'     // 失败

class MyPromise {
    constructor (executor) {
        // 传入一个执行器并立即执行（执行器两个参数是函数）
        executor(this.resolve, this.reject)
    }
    
    // promise 状态初始值
    status = PENDING
    // promise 成功 resolve 传递的值（默认值）
    value = undefined
    // promise 失败 reject 传递的原因（默认值）
    reason = undefined
    
    // 成功回调
    // successCallback = undefined
    // 因为多次调用 then 方法，所以用数组来存储多个回调函数
    successCallback = []
    // 失败回调
    // failCallback = undefined
    failCallback = []
    
    resolve = value => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存 promise 成功传过来的值
        this.value = value 
        
        // 判断成功回调是否存在，如果存在，则调用
        // this.successCallback && this.successCallback(this.value)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.successCallback.length) this.successCallback.shift()(this.value)
    }
    
    reject = reason => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为失败
        this.status = REJECTED
        // 保存 promise 失败传过来的原因
        this.reason = reason 
        
        // 判断失败回调是否存在，如果存在，则调用
        // this.failCallback && this.failCallback(this.reason)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.failCallback.length) this.failCallback.shift()(this.reason)
    }
    
    // 类的所有方法都是定义在类的 prototype 属性上面的
    // 即类的方法是被定义在原型对象中的，此处 then 方法就是
    // then 方法期望的参数是回调函数
    then (successCallback, failCallback) {
    
        // 创建新的 Promise 对象作为返回值，实现链式调用 then 方法
        let newPromise = new MyPromise((resolve, reject) => {
        
            // 判断状态
            if (this.status === FULFILLED) {
                
                // 新的 Promise 对象的执行器调用 resolve 方法，参数是上一个 then 方法的回调函数返回值
                // 因为是实现 then 方法的链式调用，所以只在 fulfilled 状态处理即可
                let x = successCallback(this.value)
                // 注释掉 resolve(x)，因为返回值有两种
                // 判断 x 的值是普通值还是 Promise 对象
                // 如果是普通值，直接调用 resolve
                // 如果是 Promise 对象，查看 Promise 对象返回的结果
                // 再根据 Promise 对象返回的结果，决定调用 resolve 还是 reject
                resolvePromise(x, resolve, reject)
                // ↑ 抽离为一个通用函数
                
            } else if (this.status === REJECTED) {
                failCallback(this.reason)
            } else {
            
                // pending 等待状态
                // 如果 Promsie 实例对象传入的执行器存在异步任务时
                // 会开启异步任务后立即执行 then，此时状态还是处于 pending
                // 将成功回调和失败回调函数通过类的属性储存起来
                // 以便于异步任务结束后在 resolve 或 reject 中执行 then 的回调函数
                
                // 多次调用 then 方法，回调函数存储到数组中
                // this.successCallback = successCallback
                this.successCallback.push(successCallback)
                // this.failCallback = failCallback
                this.failCallback.push(failCallback)
                
            }
            
        })
        
        return newPromise
        
    }
}

function resolvePromise (x, resolve, reject) {
    // 判断 x 是否是 Promise 实例
    if (x instanceof MyPromise) {
        // Promise 对象
        // x.then(value => resolve(value), reason => reject(reason))
        // 因为 resolve 跟 reject 都是函数，且在这里是作为 then 方法的回调函数，所以可以简化为
        x.then(resolve, reject)
    } else {
        // 普通值
        resolve(x)
    }
}
```

## then 方法链式调用识别 Promise 对象自返回

then 方法回调函数可以返回 Promise 对象，但是有一种情况是例外，那就是在 then 方法回调函数里，不能返回当前 then 方法的 Promise 对象，否则程序会抛出循环调用的错误。如：

```javascript
var promise = new Promise(function (resolve, reject) {
    resolve(100)
})

var p1 = promise.then(function (value) {
    console.log(value)
    // 这样写会发生 Promise 对象的循环调用，会抛出错误
    return p1
})

p1.then(function () {}, function (reason) {
    console.log(reason.message)     // Chaining cycle detected for promise #<Promise>
})
```

那么，下面在我们自己实现的 MyPromise 类实现对这个错误进行捕获并提示。

首先我们需要判断 then 方法所返回的 Promise 对象是否是当前 then 方法的 Promise 对象，我们需要将 newPromise 实例对象传到 resolvePromise 函数去。

```javascript
class Mypromise {
    ...
    ...
    
    then (successCallback, failCallback) {
        // 创建新的 Promise 对象作为返回值，实现链式调用 then 方法
        let newPromise = new MyPromise((resolve, reject) => {
        
            // 判断状态
            if (this.status === FULFILLED) {
                
                // 只需要判断 x 跟 newPromise 是否相等
                // 即可判断出回调函数返回的 promise 对象是否是当前 then 方法的 Promise 对象
                let x = successCallback(this.value)
                // 将 newPromise 对象传递到 resolvePromise 函数中做判断
                resolvePromise(newPromise, x, resolve, reject)
                
            } else if (this.status === REJECTED) {
                failCallback(this.reason)
            } else {
                
                // pending
                this.successCallback.push(successCallback)
                this.failCallback.push(failCallback)
                
            }
            
        })
        
        return newPromise
    }
}

let promise = new Promise((resolve, reject) => {
    resolve(100)
})

let p1 = promise.then(function (value) {
    console.log(value)
    // 这样写会发生 Promise 对象的循环调用，会抛出错误
    return p1
})

p1.then(function () {}, function (reason) {
    console.log(reason.message)     // Chaining cycle detected for promise #<Promise>
})
```

resolvePromise 函数增加对传递过来的两个参数进行相等判断。

```javascript
function resolvePromise (newPromise, x, resolve, reject) {
    // 判断 newPromise 与 x 是否是同一个 Promise 对象
    if (newPromise === x) {
        // 触发失败回调函数
        reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
        return
    }
    ...
    ...
}
```

但是，当前代码尚未可以正常运行，因为上面调用 `resolvePromise(newPromise, x, resolve, reject)` 的时候，newPromise 还没有被赋值，此时还是 undefined，我们需要在调用 `resolvePromise(newPromise, x, resolve, reject)` 函数时 newPromise 是被赋值完成的。

方法就是将 newPromise 对象执行器所执行的 resolvePromise 方法变成异步任务即可，这样就可以获取到 newPromise 被赋值后的值。因为**异步任务的回调函数会在所有同步任务完成后才会被执行**，使用 setTimeout 改造一下即可。

```javascript
// 判断状态
if (this.status === FULFILLED) {
    
    setTimeout(() => {
        // 只需要判断 x 跟 newPromise 是否相等
        // 即可判断出回调函数返回的 promise 对象是否是当前 then 方法的 Promise 对象
        let x = successCallback(this.value)
        // 将 newPromise 对象传递到 resolvePromise 函数中做判断
        resolvePromise(newPromise, x, resolve, reject)
    }, 0)
    
}
```

下面是增加 then 方法链式调用识别 Promise 对象自返回处理的 MyPromise 类完整代码。

```javascript
const PENDING = 'pending'   // 等待
const FULFILLED = 'fulfilled'   // 成功
const REJECTED = 'rejected'     // 失败

class MyPromise {
    constructor (executor) {
        // 传入一个执行器并立即执行（执行器两个参数是函数）
        executor(this.resolve, this.reject)
    }
    
    // promise 状态初始值
    status = PENDING
    // promise 成功 resolve 传递的值（默认值）
    value = undefined
    // promise 失败 reject 传递的原因（默认值）
    reason = undefined
    
    // 成功回调
    // successCallback = undefined
    // 因为多次调用 then 方法，所以用数组来存储多个回调函数
    successCallback = []
    // 失败回调
    // failCallback = undefined
    failCallback = []
    
    resolve = value => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存 promise 成功传过来的值
        this.value = value 
        
        // 判断成功回调是否存在，如果存在，则调用
        // this.successCallback && this.successCallback(this.value)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.successCallback.length) this.successCallback.shift()(this.value)
    }
    
    reject = reason => {
        // 如果状态不是等待，阻止程序向下执行
        // 因为 Promise 一旦状态改变，是不可以再改变的 
        if(this.status !== PENDING) return
        // 将状态更改为失败
        this.status = REJECTED
        // 保存 promise 失败传过来的原因
        this.reason = reason 
        
        // 判断失败回调是否存在，如果存在，则调用
        // this.failCallback && this.failCallback(this.reason)
        // 因为多次调用 then 方法，回调函数存储在数组中，所以需要循环依次调用（队列先进先出）
        while(this.failCallback.length) this.failCallback.shift()(this.reason)
    }
    
    // 类的所有方法都是定义在类的 prototype 属性上面的
    // 即类的方法是被定义在原型对象中的，此处 then 方法就是
    // then 方法期望的参数是回调函数
    then (successCallback, failCallback) {
    
        // 创建新的 Promise 对象作为返回值，实现链式调用 then 方法
        let newPromise = new MyPromise((resolve, reject) => {
        
            // 判断状态
            if (this.status === FULFILLED) {
                
                // 异步任务，保证获取到 newPromise 对象
                setTimeout(() => {
                    // 新的 Promise 对象的执行器调用 resolve 方法，参数是上一个 then 方法的回调函数返回值
                    // 因为是实现 then 方法的链式调用，所以只在 fulfilled 状态处理即可
                    let x = successCallback(this.value)
                    // 注释掉 resolve(x)，因为返回值有两种
                    // 判断 x 的值是普通值还是 Promise 对象
                    // 如果是普通值，直接调用 resolve
                    // 如果是 Promise 对象，查看 Promise 对象返回的结果
                    // 再根据 Promise 对象返回的结果，决定调用 resolve 还是 reject
                    // 增加判断 newPromise 跟 x 是否是同一个 Promise 对象，避免程序异常
                    resolvePromise(newPromise, x, resolve, reject)
                }, 0)
                
            } else if (this.status === REJECTED) {
                failCallback(this.reason)
            } else {
            
                // pending 等待状态
                // 如果 Promsie 实例对象传入的执行器存在异步任务时
                // 会开启异步任务后立即执行 then，此时状态还是处于 pending
                // 将成功回调和失败回调函数通过类的属性储存起来
                // 以便于异步任务结束后在 resolve 或 reject 中执行 then 的回调函数
                
                // 多次调用 then 方法，回调函数存储到数组中
                // this.successCallback = successCallback
                this.successCallback.push(successCallback)
                // this.failCallback = failCallback
                this.failCallback.push(failCallback)
                
            }
            
        })
        
        return newPromise
        
    }
}

function resolvePromise (newPromise, x, resolve, reject) {
    // 判断 newPromise 与 x 是否是同一个 Promise 对象
    if (newPromise === x) {
        // 触发失败回调函数
        reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
        return
    }
    // 判断 x 是否是 Promise 实例
    if (x instanceof MyPromise) {
        // Promise 对象
        // x.then(value => resolve(value), reason => reject(reason))
        // 因为 resolve 跟 reject 都是函数，且在这里是作为 then 方法的回调函数，所以可以简化为
        x.then(resolve, reject)
    } else {
        // 普通值
        resolve(x)
    }
}
```

## 捕获错误

使用 try catch 捕获错误，并使用 reject 方法将原因传递给下一个 then 方法的失败回调函数。

- 捕获 MyPromise 对象执行器抛出的错误
- 捕获 then 方法成功回调抛出的错误

## 将 then 方法的参数变成可选参数

Promise 对象的 then 方法可以不传递参数，此时 Promise 对象的状态可以依次往后传递，直到传递给有回调函数的 then 方法。

```javascript
var promise = new Promise(function (resolve, reject) {
    resolve(100)
})

promise.then().then().then(value => console.log(value))     // 100
```

其内部处理实现类似于： 

```javascript
promise.then(value => value).then(value => value).then(value => console.log(value))     // 100
```

我们可以在 MyPromise 类里面实现：

```javascript
class MyPromise {
    ...
    ...
    
    then (successCallback, failCallback) {
        // 增加 then 参数的判断，没有参数则默认设置一个函数参数
        successCallback = successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback : reason => reason
        // 创建新的 Promise 对象作为返回值，实现链式调用 then 方法
        let newPromise = new MyPromise((resolve, reject) => {
            // 判断状态
            if (this.status === FULFILLED) {
                // 只需要判断 x 跟 newPromise 是否相等
                // 即可判断出回调函数返回的 promise 对象是否是当前 then 方法的 Promise 对象
                let x = successCallback(this.value)
                // 将 newPromise 对象传递到 resolvePromise 函数中做判断
                resolvePromise(newPromise, x, resolve, reject)
            } else if (this.status === REJECTED) {
                failCallback(this.reason)
            } else {
                // pending
                this.successCallback.push(successCallback)
                this.failCallback.push(failCallback)
            }
        })
        return newPromise
    }
}
```

```javascript
let promise = new MyPromise((resolve, reject) => {
    resolve('成功')
})

promise.then().then().then(value => console.log(value))     // 成功
```
```javascript
let promise = new MyPromise((resolve, reject) => {
    reject('失败')
})

promise.then().then().then(value => console.log(value), reason => console.log(reason))     // 失败
```

【注意】ES6 中的 Promise 对象的 then 方法期待的参数是一个回调函数，**如果该参数不是函数，则会在内部被替换为 `(x) => x`，即原样返回 ==promise 最终结果==的函数（此现象又被称为值穿透）**。

```javascript
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log)   // 1
```
等同于
```javascript
Promise.resolve(1).then(x => x).then(x => x).then(console.log(x))   // 1
```

## Promise.all 方法的实现

Promise.all 允许按照异步代码调用的顺序执行代码。Promise.all 接收一个数组作为参数，数组里面可以填入任何值，包括普通值和 Promise 对象，这个数组中值的顺序一定是得到结果的顺序。

Promise.all 的返回值也是一个 Promise 对象，所以也可以链式调用 then 方法。

Promise.all 有一个特点，在 all 方法中所有 Promise 对象，如果状态都是成功的，那么最后 all 方法也是成功的。如果有一个失败了，那么最后 all 方法就是失败的。

```javascript
Promise.all(['a', 'b', p1(), p2(), 'c']).then(result => {
    // result -> ['a', 'b', p1, p2, '3']
})
```

从调用方式来看，all 是一个静态方法。在 ES6 的 class 中，使用 static 定义的方法为静态方法，该方法不能被实例对象调用，只能通过类（即构造函数）来调用，且静态方法可以与动态方法重名。静态方法中的 this 指向的是类，不是实例对象。

下面实现 Promise.all 功能：

```javascript
class MyPromise {
    ...
    ...
    
    static all (array) {
        // 结果数组
        let result = []
        // 考虑到数组中 Promise 存在异步操作，故用计数器判断全部执行完成返回 Promise.all 的结果
        let index = 0
        
        return MyPromise((resolve, reject) => {
            // 添加数据函数（放在 MyPromise 里面是为了能调用 resolve）
            function addData (key, value) {
                result[key] = value
                index ++
                if (index === array.length) {
                    resolve(result)
                }
            }
            // 循环判断数组的值是普通值还是 Promise 对象
            // 如果是普通值，则直接放进结果数组
            // 如果是 Promise 对象，则先去执行 Promise 对象，再把 Promise 对象执行的结果放到结果数组中
            for (let i=0; i< array.length; i++) {
                let current = array[i]
                // instanceof 简单来说就是检测原型链的
                if (current instanceof MyPromise) {
                    // promise 对象
                    current.then(value => addData(i, value), reason => reject(reason))
                } else {
                    // 普通值
                    addData(i, current)
                }
            }
        })
    }
}
```

## Promise.race 方法的实现

Promise.race 同样接收一个数组作为参数，数组里面可以填入任何值，包括普通值和 Promise 对象。Promise.race 的返回值也是一个 Promise 对象，所以也可以链式调用 then 方法。

Promise.race 方法的参数与 Promise.all 方法一样，如果参数的项不是 Promise 实例，会将参数转为 Promise 实例，再进一步处理。

Promise.race 的特点是，race 方法中的所有 Promise 对象，只要有一个率先改变状态，无论是成功还是失败，那就是 Promise.race 方法返回的 Promise 对象的最终结果。

下面实现 Promise.race 功能：

```javascript
class MyPromise {
    ...
    ...
    
    static race (array) {
        return MyPromise((resolve, reject) => {
            // 循环判断数组的值是普通值还是 Promise 对象
            // 如果是 Promise 对象，则先去执行 Promise 对象，再把 Promise 对象执行的结果放到结果数组中
            for (let i=0; i< array.length; i++) {
                let current = array[i]
                // instanceof 简单来说就是检测原型链的
                if (current instanceof MyPromise) {
                    // promise 对象
                    current.then(value => resolve(value), reason => reject(reason))
                } else {
                    // 普通值
                    resolve(current)
                }
            }
        })
    }
}
```

## Promise.resolve 方法的实现

在 resolve 方法内部，首先判断给定的参数是不是 Promise 对象。如果是 Promise 对象，则原封不动直接返回。如果不是 Promise 对象，则创建一个新的 Promise 对象，把给定的值包裹在 Promise 对象当中，然后返回这个 Promise 对象即可。

代码实现如下：

```javascript
class MyPromise {
    ...
    ...
    
    static resolve (value) {
        // 如果是 Promise 对象，原封不动返回
        if (value instancof MyPromise) return value
        // 不是 Promise 对象的话，则创建并返回一个 Promise 对象
        return new MyPromise(resolve => resolve(value))
    }
}
```

## finally 方法的实现

- 无论当前 Promise 对象的最终状态是成功或失败，finally 方法的回调函数都会被执行
- 在 finally 方法后面，可以链式调用 then 方法来拿到当前这个 Promise 对象返回的最终结果

```javascript
class MyPromise {
    ...
    ...
    
    finally (callback) {
        return this.then(value => {
            // callback()
            // return value
            // 保证 callback 中的异步任务的完成后再触发后面的 then 方法回调函数
            return MyPromise,resolve(callback()).then(() => value)
        }, reason => {
            // callback()
            // throw reason
            // 保证 callback 中的异步任务的完成后再触发后面的 then 方法回调函数
            return MyPromise,resolve(callback()).then(() => { throw reason })
        })
    }
}
```

## catch 方法的实现

catch 方法是用来处理当前这个 Promise 对象最终的状态为失败的情况的，这样 then 方法里面可以不传入失败回调函的数，这个失败会被 catch 方法捕获，从而执行 catch 方法内的回调函数。

```javascript
class MyPromise {
    ...
    ...
    
    catch (failCallback) {
        // 调用了 then 方法，只注册了失败回调函数
        return this.then(undefined, failCallback)
    }
}
```