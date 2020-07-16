---
title: 关于 ref 与 $refs 对 dom 元素的操作
date: 2019-05-14
categories: "vue" #分类
tags:  #标签
    - vue
---

# 关于 ref 与 $refs 对 dom 元素的操作
## 如何获取 v-for 渲染的多个 ref 的 dom
🍍 在编写 `vue` 项目过程中，遇到了获取不到正确的 `dom` 元素节点的问题。

功能界面如图所示：

![界面](~public/vue/vue_$refs/vue_$refs_01.png)

需要实现的是，点击每个播放器的右上角的关闭按钮，则关闭播放器。  
代码如下：
```HTML
<template>
  <div class="device-status">
    <!-- 树组件 -->
    <Tree></Tree>
    <!-- 业务内容 -->
    <div class="content-container" ref="container">
      <h1>{{ msg }}</h1>
      <div>{{buildings}}</div>
      <div class="video-box" ref="video1">
        <Player 
                src="https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/12846619_51a524dffce6834f1d221be2a1037834.mp4"
                poster="https://puui.qpic.cn/fans_admin/0/3_118841988_1557667793407/0"
        ></Player>
        <i class="el-icon-circle-close" @click="close('video1')"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from "component/checkbox-tree/tree";
import Player from "component/player/player";

export default {
  data() {
    return {
      msg: "我是组件",
      videoList: [
        {
          id: 1,
          index: 0,
          src: "https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/12846619_51a524dffce6834f1d221be2a1037834.mp4",
          poster: "https://puui.qpic.cn/fans_admin/0/3_118841988_1557667793407/0"
        },
        {
          id: 2,
          index: 1,
          src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
          poster: "https://ww1.sinaimg.cn/large/007i4MEmgy1g29h63wl0yj30et08c0tc.jpg"
        }
      ]
    };
  },
  computed: {
    buildings(){
      return this.$store.state.buildingTree
    }
  },
  components: {
    Tree,
    Player
  },
  watch: {
    buildings(newVal, oldVal){
      console.log("监听到树选中值变化",JSON.stringify(newVal))
      //判断树数组的值，空则不作操作，否则带上树id
      //进行 http 请求获取数据

    }
  },
  methods: {
    //关闭播放器
    close(videoStr){
      //应该用数据驱动dom，这里直接操作了dom，不符合vue的理念，暂时
      let video = this.$refs[videoStr]
      video.parentNode.removeChild(video)
    }
  }
};
</script>
```
至此代码功能正常，点击右上角关闭按钮，则移除播放器元素。

然后问题在于，播放器可能有多个存在，这时候，如何实现点击每个关闭按钮，关闭对应的播放器呢？

尝试修改代码如下：
```HTML
<template v-for="video in videoList">
  <!-- 播放器组件，带关闭按钮 -->
  <div class="video-box" :ref="`video${video.id}`" >
    <Player 
           :src="video.src"
           :poster="video.poster"
    ></Player>
    <i class="el-icon-circle-close" @click="close(`video${video.id}`)"></i>
  </div>
</template>
```
```JavaScript
methods: {
  //关闭播放器
  close(videoStr){
    //应该用数据驱动dom，这里直接操作了dom，不符合vue的理念，暂时
    let video = this.$refs[videoStr]
    video.parentNode.removeChild(video)
  }
}
```
然后点击关闭按钮时，可以看到控制台报错：

![报错](~public/vue/vue_$refs/vue_$refs_02.png)

提示不能获取未定义的属性，则表明该 `dom` 元素节点获取不对。

## 发现问题所在

后面经过一番折腾，发现以上代码 `this.$refs[videoStr]` 获取的是一个 `ref` 等于 `videoStr` （此处为变量）的 `dom` 节点数组，不是单个 `dom` 节点元素！

![数组节点](~public/vue/vue_$refs/vue_$refs_03.png)

至此，踩坑这个之后，就明白了为什么获取不到对应的 `dom` 元素了。

代码修改如下即可：
```JavaScript
methods: {
  //关闭播放器
  close(videoStr){
    //应该用数据驱动dom，这里直接操作了dom，不符合vue的理念，暂时
    let video = this.$refs[videoStr][0]
    video.parentNode.removeChild(video)
  }
}
```
功能实现后，再来拓展其他方法。

比如当 `ref` 的值一样，都为 `videoBox` 时：
```HTML
<template v-for="video in videoList">
  <div class="video-box" ref="videoBox" >
    <Player 
           :src="video.src"
           :poster="video.poster"
    ></Player>
    <i class="el-icon-circle-close" @click="close(video.index)"></i>
  </div>
</template>
```
```JavaScript
methods: {
  //关闭播放器
  close(index){
    // 利用数组下标操作
    let video = this.$refs.videoBox[index]
    video.parentNode.removeChild(video)
  }
}
```
又或者不使用 `ref` 属性，改而为每个播放器元素赋值 `id`，也可：
```HTML
<template v-for="video in videoList">
  <div class="video-box" :id="`video${video.id}`">
    <Player 
           :src="video.src"
           :poster="video.poster"
    ></Player>
    <i class="el-icon-circle-close" @click="close(`video${video.id}`)"></i>
  </div>
</template>
```
```JavaScript
methods: {
  //关闭播放器
  close(videoId){
    // 利用数组下标操作
    let video = document.querySelector(`#${videoId}`)
    video.parentNode.removeChild(video)
  }
}
```
官网概念：

![官网概念](~public/vue/vue_$refs/vue_$refs_04.png)

总结：

> ref 相当于给元素或组件赋予一个 ID 引用，用来注册引用信息的，方便获取 dom 元素或获取组件实例。

使用场景：
```bash
1. ref 加在普通元素上，this.$refs.name 获取的是 dom 元素
2. ref 加在子组件上，this.$refs.name 获取到的是组件实例，方便父组件使用子组件的所有方法
3. 当 v-for 用于元素或组件，ref 获取的将是一组数组或 dom 节点
```
文章所说遇到的问题即是上述第三种情况。