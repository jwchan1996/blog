(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{319:function(t,i,s){},352:function(t,i,s){var n=s(0),e=s(353),a=s(92);n({target:"Array",proto:!0},{fill:e}),a("fill")},353:function(t,i,s){"use strict";var n=s(11),e=s(96),a=s(13);t.exports=function(t){for(var i=n(this),s=a(i.length),r=arguments.length,c=e(r>1?arguments[1]:void 0,s),o=r>2?arguments[2]:void 0,h=void 0===o?s:e(o,s);h>c;)i[c++]=t;return i}},354:function(t,i,s){var n=s(0),e=s(3),a=s(100),r=[].slice,c=function(t){return function(i,s){var n=arguments.length>2,e=n?r.call(arguments,2):void 0;return t(n?function(){("function"==typeof i?i:Function(i)).apply(this,e)}:i,s)}};n({global:!0,bind:!0,forced:/MSIE .\./.test(a)},{setTimeout:c(e.setTimeout),setInterval:c(e.setInterval)})},355:function(t,i,s){"use strict";var n=s(319);s.n(n).a},409:function(t,i,s){"use strict";s.r(i);s(352),s(167),s(44),s(65),s(354);var n={data:function(){return{cf:null,c:null,ctx:null,cftx:null,centerX:0,centerY:0,stars:[],drawTimes:0,longside:0,x:0,y:0}},mounted:function(){var t=this;this.cf=document.createElement("canvas"),this.c=document.querySelector("#startrack");var i=this.c.offsetWidth;this.cf.width=i,this.c.width=this.cf.width;var s=this.c.offsetHeight;this.cf.height=s,this.c.height=this.cf.height,this.longside=Math.max(i,s),this.cf.width=2.6*this.longside,this.cf.height=2.6*this.longside,this.ctx=this.c.getContext("2d"),this.cftx=this.cf.getContext("2d"),this.centerX=i,this.centerY=0,this.stars=[],this.drawTimes=0,window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)},window.onresize=function(){var i=t.c.offsetWidth;t.c.width=i;var s=t.c.offsetHeight;t.c.height=s,t.ctx.fillStyle="rgba(21,21,21,1)",t.ctx.fillRect(0,0,i,s)},this.ctx.fillStyle="rgba(21,21,21,1)",this.ctx.fillRect(0,0,i,s),this.ctx.lineCap="round";for(var n=2e4;n--;)this.createStar();this.drawStar(),this.x=this.centerX,this.y=this.centerY,this.ctx.translate(this.x,this.y),this.fireAnimate(),window.onload=function(){t.getMsg()},window.onscroll=function(){if("/"==t.$route.path){var i=document.documentElement.scrollTop||document.body.scrollTop,s=document.documentElement.clientHeight,n=document.querySelector(".background").getAttribute("class");if(i>.6*s){if(n.indexOf("fixed")>-1)return;var e=n+" fixed";document.querySelector(".background").setAttribute("class",e)}else{var a=n.replace(" fixed","");document.querySelector(".background").setAttribute("class",a)}}},document.querySelector(".cover").style.background="linear-gradient(to top,rgba(32,32,32,1) 30%,rgba(32,32,32,0) 100%)"},methods:{rand:function(t,i){var s=i-t,n=Math.random();return t+Math.round(n*s)},createStar:function(){this.stars.push({x:this.rand(-this.cf.width,this.cf.width),y:this.rand(-this.cf.height,this.cf.height),size:1,color:this.randomColor()})},randomColor:function(){return"rgba("+this.rand(120,255)+","+this.rand(120,255)+","+this.rand(120,255)+","+this.rand(30,100)/100+")"},drawStar:function(){for(var t=this.stars.length;t--;){var i=this.stars[t];this.cftx.beginPath(),this.cftx.arc(i.x,i.y,i.size,0,2*Math.PI,!0),this.cftx.fillStyle=i.color,this.cftx.closePath(),this.cftx.fill()}},drawfromCache:function(){this.ctx.drawImage(this.cf,-this.cf.width/2,-this.cf.height/2)},loop:function(){this.drawfromCache(),++this.drawTimes>150&&this.drawTimes%8==0&&(this.ctx.fillStyle="rgba(0,0,0,.04)",this.ctx.fillRect(-3*this.longside,-3*this.longside,6*this.longside,6*this.longside)),this.rotateCanvas(.025)},rotateCanvas:function(t){this.ctx.rotate(t*Math.PI/180)},fireAnimate:function(){requestAnimFrame(this.fireAnimate),this.loop()},getMsg:function(){var t=["你看那个人，Ta好像一条狗啊","那时候时间很慢<br>慢到只能用一生去爱一个人","迷失的人迷失了<br>相逢的人会再相逢","给时光以生命<br>给岁月以文明","愿你岁月无波澜<br>敬我余生不悲欢","平凡的日常正奇迹的发生着","暗影猎手<br>准备就绪!!!","搞事！搞事！搞事！","喜欢是淡淡的爱<br>爱是深深的喜欢","不是吧阿sir，这都可以？"],i=this.random(0,t.length-1);document.querySelector(".slogan").innerHTML=t[i]},random:function(t,i){var s=i-t,n=Math.random();return t+Math.round(n*s)}}},e=(s(355),s(43)),a=Object(e.a)(n,(function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[[s("div",{staticClass:"star"},[s("div",{staticClass:"background"},[s("canvas",{attrs:{id:"startrack"}}),t._v(" "),s("div",{staticStyle:{height:"700px",background:"#212121"}}),t._v(" "),s("div",{staticClass:"cover"})]),t._v(" "),s("div",{staticClass:"main"},[s("div",{staticClass:"intro"},[s("div",{staticClass:"container"},[s("div",{staticClass:"hello"},[s("h1",{staticClass:"slogan"},[t._v("你看那个人，Ta好像一条狗啊")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                飘香豆腐 / jwchan1996\n              ")])])])]),t._v(" "),s("div",{staticClass:"intro"},[s("div",{staticClass:"container",staticStyle:{height:"700px"}},[s("div",{staticClass:"hello reset-bottom"},[s("h1",{staticClass:"slogan"},[t._v("近期目标")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                完成 PPAP.admin\n              ")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                react hooks\n              ")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                TypeScript 重构 PPAP.admin\n              ")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                整理总结 webpack\n              ")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                阅读 Vue 源码\n              ")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                Flutter\n              ")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                Deno / Rust\n              ")]),t._v(" "),s("h2",[s("div",{staticClass:"circle"},[s("span"),t._v(" "),s("span"),t._v(" "),s("span")]),t._v("\n                webAssembly\n              ")])])])])])])]],2)}),[],!1,null,null,null);i.default=a.exports}}]);