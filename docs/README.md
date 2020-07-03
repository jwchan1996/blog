---
home: true 
# heroImage: /hero.png
heroText: null
tagline: null
# heroText: 七号仓库
# tagline: 记录与分享 bug 的诞生
# actionText: 围观吃瓜 →
# actionLink: /archives/ 
# footer: MIT Licensed | Copyright © 2020 飘香豆腐
---

<template>
  <div class="star">
    <div class="background">
      <canvas id="startrack"></canvas>
      <div style="height: 700px; background: #212121"></div>
      <div class="cover"></div>
    </div>
    <div class="main">
      <div class="intro">
        <div class="container">
          <div class="hello">
              <h1 class="slogan">你看那个人，Ta好像一条狗啊</h1>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                飘香豆腐 / jwchan1996
              </h2>
          </div>
        </div>
      </div>
      <div class="intro">
        <div class="container">
          <div class="hello reset-bottom">
              <h1 class="slogan">近期目标</h1>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                完成 PPAP.admin
              </h2>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                react hooks
              </h2>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                TypeScript 重构 PPAP.admin
              </h2>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                整理总结 webpack
              </h2>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                阅读 Vue 源码
              </h2>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                Flutter
              </h2>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                Deno / Rust
              </h2>
              <h2>
                <div class="circle">
                  <span></span> 
                  <span></span> 
                  <span></span>
                </div>
                webAssembly
              </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      cf: null,
      c: null,
      ctx: null,
      cftx: null,
      centerX: 0,
      centerY: 0,
      stars: [],
      drawTimes: 0,
      longside: 0,
      x: 0,
      y: 0
    }
  },
  mounted(){
    this.cf = document.createElement("canvas")
    this.c = document.querySelector("#startrack")
    let cw = this.c.offsetWidth
    this.cf.width = cw
    this.c.width = this.cf.width
    let ch = this.c.offsetHeight
    this.cf.height = ch
    this.c.height = this.cf.height
    this.longside = Math.max(cw, ch)
    this.cf.width = 2.6 * this.longside
    this.cf.height = 2.6 * this.longside
    this.ctx = this.c.getContext("2d")
    this.cftx = this.cf.getContext("2d")
    this.centerX = cw
    this.centerY = 0
    this.stars = []
    this.drawTimes = 0
    
    window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (t) {window.setTimeout(t, 1e3 / 60)}
    window.onresize = () => {
      let cw = this.c.offsetWidth
      this.c.width = cw
      let ch = this.c.offsetHeight 
      this.c.height = ch
      this.ctx.fillStyle = "rgba(21,21,21,1)"
      this.ctx.fillRect(0, 0, cw, ch)
    };

    this.ctx.fillStyle = "rgba(21,21,21,1)"
    this.ctx.fillRect(0, 0, cw, ch)
    this.ctx.lineCap = "round"
    for (let count = 2e4; count--;) this.createStar();
    this.drawStar();
    this.x = this.centerX,
    this.y = this.centerY;

    this.ctx.translate(this.x, this.y), this.fireAnimate(), window.onload = () => {
      this.getMsg()
    }, window.onscroll = () => {
      //获取滚动高度
      let osTop = document.documentElement.scrollTop || document.body.scrollTop;
      //可视区域高度
      let clientHeight = document.documentElement.clientHeight; 
      let currentClassName = document.querySelector(".background").getAttribute("class")
      if(osTop > .6 * clientHeight){
        if(currentClassName.indexOf("fixed") > -1){
          return
        }
        let newClassName = currentClassName + " fixed"
        document.querySelector(".background").setAttribute("class", newClassName)
      }else{
        let newClassName = currentClassName.replace(" fixed", "")
        document.querySelector(".background").setAttribute("class", newClassName)
      }
    }

    //修改背景
    document.querySelector('.cover').style.background = 'linear-gradient(to top,rgba(32,32,32,1) 30%,rgba(32,32,32,0) 100%)'
  },
  methods: {
    rand(t, a) {
      let e = a - t,
        n = Math.random();
      return t + Math.round(n * e)
    },
    createStar() {
      this.stars.push({
        x: this.rand(-this.cf.width, this.cf.width),
        y: this.rand(-this.cf.height, this.cf.height),
        size: 1,
        color: this.randomColor()
      })
    },
    randomColor() {
      return "rgba(" + this.rand(120, 255) + "," + this.rand(120, 255) + "," + this.rand(120, 255) + "," + this.rand(30, 100) / 100 + ")"
    },
    drawStar() {
      for (let t = this.stars.length; t--;) {
        let a = this.stars[t];
        this.cftx.beginPath(), this.cftx.arc(a.x, a.y, a.size, 0, 2 * Math.PI, !0), this.cftx.fillStyle = a.color, this.cftx.closePath(), this.cftx.fill()
      }
    },
    drawfromCache() {
      this.ctx.drawImage(this.cf, -this.cf.width / 2, -this.cf.height / 2)
    },
    loop() {
      this.drawfromCache(), ++this.drawTimes > 150 && this.drawTimes % 8 == 0 && (this.ctx.fillStyle = "rgba(0,0,0,.04)", this.ctx.fillRect(-3 * this.longside, -3 * this.longside, 6 * this.longside, 6 * this.longside)), this.rotateCanvas(.025)
    },
    rotateCanvas(t) {
      this.ctx.rotate(t * Math.PI / 180)
    },
    fireAnimate() {
      requestAnimFrame(this.fireAnimate), this.loop()
    },
    getMsg() {
      let t = [
        "你看那个人，Ta好像一条狗啊", 
        "那时候时间很慢<br>慢到只能用一生去爱一个人", 
        "迷失的人迷失了<br>相逢的人会再相逢",
        "给时光以生命<br>给岁月以文明", 
        "愿你岁月无波澜<br>敬我余生不悲欢",
        "平凡的日常正奇迹的发生着", 
        "暗影猎手<br>准备就绪!!!", 
        "搞事！搞事！搞事！",  
        "喜欢是淡淡的爱<br>爱是深深的喜欢",
        "不是吧阿sir，这都可以？"
      ]
      let a = this.random(0, t.length - 1)
      document.querySelector(".slogan").innerHTML = t[a]
    },
    random(t, a) {
      let e = a - t
      let n = Math.random()
      return t + Math.round(n * e)
    }

  }
}
</script>

<style>
  .star{
    font-family: "Microsoft YaHei";
    -webkit-font-smoothing: antialiased;
    color: #fff;
    line-height: 1.5;
    background-color: #212121;
    font-size: 14px;
    overflow: hidden;
  }

  .background{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #212121;
  }
  .fixed{
    position: fixed;
    top: -60%;
  }
  
  #startrack{
    height: 140%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .cover{
    position: absolute;
    bottom: -42%;
    left: 0;
    height: 100%;
    width: 100%;
    background: #212121;
  }

  .main{
    
  }
  
  .intro {
    color: #fff;
    height: 100%;
    overflow-y: hidden;
    /* max-height: 900px; */
    padding: 0;
    animation: fadedown 1s cubic-bezier(.19,1,.22,1);
    -webkit-animation: fadedown 1s cubic-bezier(.19,1,.22,1);
    -ms-animation: fadedown 1s cubic-bezier(.19,1,.22,1);
    -moz-animation: fadedown 1s cubic-bezier(.19,1,.22,1);
  }
  @keyframes fadedown{
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .intro .container {
    animation: fadedown 3.5s cubic-bezier(.19,1,.22,1);
    -webkit-animation: fadedown 3.5s cubic-bezier(.19,1,.22,1);
    -ms-animation: fadedown 3.5s cubic-bezier(.19,1,.22,1);
    -moz-animation: fadedown 3.5s cubic-bezier(.19,1,.22,1);
  }

  .container {
    position: relative;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    padding: 20px 0;
  }
  
  .hello {
    position: absolute;
    bottom: 20%;
    left: 0;
  }
  .reset-bottom{
    bottom: 60px !important;
  }
  @media screen and (max-width: 500px) {
    .reset-bottom{
      bottom: 20px !important;
    }
  }
  .hello .slogan {
    font-size: 42px;
    letter-spacing: .5em;
    font-weight: 400;
    line-height: 1.5em;
  }
  .hello h2 {
    padding-top: .6em;
    font-weight: 400;
    font-size: 22px;
    line-height: 1.5em;
    letter-spacing: .2em;
    border-bottom: none !important;
  }
  .hello .circle {
    float: left;
    margin-right: 10px;
    letter-spacing: 0;
  }

  .hello .circle span {
    display: inline-block;
    width: 13px;
    height: 13px;
    background-color: #fff;
    border-radius: 100%;
    margin-right: 5px;
  }
  .hello .circle span:nth-child(1) {
    background-color: #ff493f;
  }
  .hello .circle span:nth-child(2) {
    background-color: #f7c900;
  }
  .hello .circle span:nth-child(3) {
    background-color: #00ff37;
  }
</style>