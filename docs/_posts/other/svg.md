---
title: SVG 基础
date: 2020-07-20
categories: "other" #分类
tags:  #标签
    - svg
---

# SVG 基础

## svg 语法

### svg 标签

<p>SVG 代码都放在顶层标签 svg 之中。</p>

```html
<svg width="100%" height="100%">
  <circle id="mycircle" cx="50" cy="50" r="50" />
</svg>
```

<svg width="100%" height="100%">
  <circle id="mycircle" cx="50" cy="50" r="50" />
</svg>

<p>SVG 的 width 属性和 height 属性，指定了 SVG 图像在 HTML 元素中所占据的宽度和高度。除了相对单位，也可以采用绝对单位（单位：像素）。如果不指定这两个属性，SVG 图像默认大小是 300 像素（宽） x 150 像素（高）。</p>

<p>如果只想展示 SVG 图像的一部分，就要指定 viewBox 属性。</p>

```html
<svg width="100" height="100" viewBox="50 50 50 50">
  <circle id="mycircle" cx="50" cy="50" r="50" />
</svg>
```

<svg width="100" height="100" viewBox="50 50 50 50">
  <circle id="mycircle" cx="50" cy="50" r="50" />
</svg>

<p>viewBox 属性的值有四个数字，分别是左上角的横坐标和纵坐标、视口的宽度和高度。上面代码中，SVG 图像是 100 像素宽 x 100 像素高，viewBox 属性指定视口从 (50, 50) 这个点开始。所以，实际看到的是右下角的四分之一圆。</p>
<p>注意，视口必须适配所在的空间。上面代码中，视口的大小是 50 x 50，由于 SVG 图像的大小是 100 x 100，所以视口会放大去适配 SVG 图像的大小，即放大了四倍。</p>
<p>如果不指定 width 属性和 height 属性，只指定 viewBox 属性，则相当于只给定 SVG 图像的长宽比。这时，SVG 图像的默认大小将等于所在的 HTML 元素的大小。</p>

<h3>circle 圆形 样式</h3>

```html
<svg width="300" height="180">
  <circle cx="30"  cy="50" r="25" />
  <circle cx="90"  cy="50" r="25" class="red" />
  <circle cx="150" cy="50" r="25" class="fancy" />
</svg>
```

<svg width="300" height="100">
  <circle cx="30"  cy="50" r="25" />
  <circle cx="90"  cy="50" r="25" style="fill: red;" class="red" />
  <circle cx="150" cy="50" r="25" style="fill: none; stroke: black; stroke-width: 3pt;" class="fancy" />
</svg>

<p>上面的代码定义了三个圆。circle 标签的 cx、cy、r 属性分别为横坐标、纵坐标和半径，单位为像素。坐标都是相对于 svg 画布的左上角原点。</p>
<p>class 属性用来指定对应的 CSS 类。</p>

```html
.red {
  fill: red;
}

.fancy {
  fill: none;
  stroke: black;
  stroke-width: 3pt;
}
```

<p>SVG 的 CSS 属性与网页元素有所不同。</p>

```html
fill：填充色
stroke：描边色
stroke-width：边框宽度
```

### line 直线

```html
<svg width="300" height="50">
  <line x1="0" y1="25" x2="200" y2="25" style="stroke:rgb(0,0,0);stroke-width:5" />
</svg>
```

<svg width="300" height="50">
  <line x1="0" y1="25" x2="200" y2="25" style="stroke:rgb(0,0,0);stroke-width:5" />
</svg>

<p>上面代码中，line 标签的 x1 属性和 y1 属性，表示线段起点的横坐标和纵坐标；x2 属性和 y2 属性，表示线段终点的横坐标和纵坐标；style 属性表示线段的样式。</p>

### polyline 折线

<p>polyline 的 points 属性指定了每个端点的坐标，横坐标与纵坐标之间与逗号分隔，点与点之间用空格分隔</p>

```html
<svg width="300" height="100">
  <polyline points="3,50 30,28 40,0 50,10 60,30 70,40 80,0 90,80 100,60 110,60" fill="none" stroke="red" />
</svg>
```

<svg width="300" height="100">
  <polyline points="3,50 30,28 40,0 50,10 60,30 70,40 80,0 90,80 100,60 110,60" fill="none" stroke="red" />
</svg>

### rect 矩形

```html
<svg width="300" height="100">
  <rect x="0" y="0" height="80" width="160" style="stroke: #70d5dd; fill: #dd524b" />
</svg>
```

<svg width="300" height="100">
  <rect x="0" y="0" height="80" width="160" style="stroke: #70d5dd; fill: #dd524b" />
</svg>

<p>rect 的 x 属性和 y 属性，指定了矩形左上角端点的横坐标和纵坐标；width 属性和 height 属性指定了矩形的宽度和高度（单位像素）。</p>

### ellipse 椭圆

```html
<svg width="300" height="80">
  <ellipse cx="60" cy="40" ry="20" rx="40" stroke="black" stroke-width="5" fill="silver"/>
</svg>
```

<svg width="300" height="80">
  <ellipse cx="60" cy="40" ry="20" rx="40" stroke="black" stroke-width="5" fill="silver"/>
</svg>

<p>ellipse 的 cx 属性和 cy 属性，指定了椭圆中心的横坐标和纵坐标（单位像素）；rx 属性和 ry 属性，指定了椭圆横向轴和纵向轴的半径（单位像素）。</p>

### polygon 多边形

```html
<svg width="300" height="100">
  <polygon fill="green" stroke="orange" stroke-width="1" points="0,0 100,0 150,50 100,100 0,100 0,0"/>
</svg>
```

<svg width="300" height="100">
  <polygon fill="green" stroke="orange" stroke-width="1" points="0,0 100,0 150,50 100,100 0,100 0,0"/>
</svg>

<p>polygon 的 points 属性指定了每个端点的坐标，横坐标与纵坐标之间与逗号分隔，点与点之间用空格分隔。</p>

### path 路径

```html
<svg width="300" height="80">
  <path d="
    M 18,3
    L 46,3
    L 46,40
    L 61,40
    L 32,68
    L 3,40
    L 18,40
    Z
  "></path>
</svg>
```

<svg width="300" height="80">
  <path d="
    M 18,3
    L 46,3
    L 46,40
    L 61,40
    L 32,68
    L 3,40
    L 18,40
    Z
  "></path>
</svg>

<p>path 的 d 属性表示绘制顺序，它的值是一个长字符串，每个字母表示一个绘制动作，后面跟着坐标。</p>

```html
M：移动到（moveto）
L：画直线到（lineto）
Z：闭合路径
```

### text 文本

```html
<svg width="300" height="40">
  <text x="20" y="25">Hello World</text>
</svg>
```

<svg width="300" height="40">
  <text x="20" y="25">Hello World</text>
</svg>

<p>text 的 x 属性和 y 属性，表示文本区块基线（baseline）起点的横坐标和纵坐标。文字的样式可以用 class 或 style 属性指定。</p>

### use 复制一个形状

```html
<svg width="300" viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
  <circle id="myCircle3" cx="5" cy="5" r="4"/>

  <use href="#myCircle3" x="10" y="0" fill="#009688" />
  <use href="#myCircle3" x="20" y="0" fill="white" stroke="#f2aa24" />
</svg>
```

<svg width="300" viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
  <circle id="myCircle3" cx="5" cy="5" r="4"/>
  <use href="#myCircle3" x="10" y="0" fill="#009688" />
  <use href="#myCircle3" x="20" y="0" fill="white" stroke="#f2aa24" />
</svg>

<p>use 的 href 属性指定所要复制的节点，x 属性和 y 属性是 use 左上角的坐标。另外，还可以指定 width 和 height 坐标。</p>

### g 分组

<p>g 标签用于将多个形状组成一个组（group），方便复用。</p>

```html
<svg width="300" height="100">
  <g id="myCircle">
    <text x="25" y="20">圆形</text>
    <circle cx="50" cy="50" r="20"/>
  </g>

  <use href="#myCircle" x="100" y="0" fill="blue" />
  <use href="#myCircle" x="200" y="0" fill="white" stroke="blue" />
</svg>
```

<svg width="300" height="100">
  <g id="myCircle">
    <text x="25" y="20">圆形</text>
    <circle cx="50" cy="50" r="20"/>
  </g>
  <use href="#myCircle" x="100" y="0" fill="#009688" />
  <use href="#myCircle" x="200" y="0" fill="white" stroke="#f2aa24" />
</svg>

### defs 自定义形状

<p>defs 标签用于自定义形状，它内部的代码不会显示，仅供引用</p>

```html
<svg width="300" height="100">
  <defs>
    <g id="myCircle">
      <text x="25" y="20">圆形</text>
      <circle cx="50" cy="50" r="20"/>
    </g>
  </defs>

  <use href="#myCircle" x="0" y="0" />
  <use href="#myCircle" x="100" y="0" fill="#bc3545" />
  <use href="#myCircle" x="200" y="0" fill="white" stroke="#bc3545" />
</svg>
```

<svg width="300" height="100">
  <defs>
    <g id="myCircle">
      <text x="25" y="20">圆形</text>
      <circle cx="50" cy="50" r="20"/>
    </g>
  </defs>
  <use href="#myCircle" x="0" y="0" />
  <use href="#myCircle" x="100" y="0" fill="#bc3545" />
  <use href="#myCircle" x="200" y="0" fill="white" stroke="#bc3545" />
</svg>

### pattern 自定义形状

<p>pattern 标签用于自定义一个形状，该形状可以被引用来平铺一个区域。</p>

```html
<svg width="500" height="200">
  <defs>
    <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <circle fill="#bee9e8" cx="50" cy="50" r="35" />
    </pattern>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
</svg>
```

<svg width="500" height="200">
  <defs>
    <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <circle fill="#bee9e8" cx="50" cy="50" r="35" />
    </pattern>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
</svg>

<p>上面代码中，pattern 标签将一个圆形定义为 dots 模式。patternUnits="userSpaceOnUse" 表示 pattern 的宽度和长度是实际的像素值。然后，指定这个模式去填充下面的矩形。</p>

### image 插入图片

```html
<svg viewBox="0 0 100 100" width="150" height="80">
  <image xlink:href="https://jwchan.cn/logo.png" width="90%" height="90%"/>
</svg>
```

<svg viewBox="0 0 100 100" width="150" height="80">
  <image xlink:href="https://jwchan.cn/logo.png" width="90%" height="90%"/>
</svg>

<p>上面代码中，image 的 xlink:href 属性表示图像的来源。</p>

### animate 动画

```html
<svg width="500px" height="100px">
  <rect x="0" y="0" width="100" height="100" fill="#feac5e">
    <animate attributeName="x" from="0" to="500" dur="2s" repeatCount="indefinite" />
  </rect>
</svg>
```

<svg width="500px" height="100px">
  <rect x="0" y="0" width="100" height="100" fill="#feac5e">
    <animate attributeName="x" from="0" to="500" dur="2s" repeatCount="indefinite" />
  </rect>
</svg>

<p>上面代码中，矩形会不断移动，产生动画效果。</p>
<p>animate 的属性含义如下。</p>

```html
attributeName：发生动画效果的属性名。
from：单次动画的初始值。
to：单次动画的结束值。
dur：单次动画的持续时间。
repeatCount：动画的循环模式。
```

<p>可以在多个属性上面定义动画。</p>

```html
<svg width="500px" height="100px">
  <rect x="0" y="0" width="100" height="100" fill="#feac5e">
    <animate attributeName="x" from="0" to="500" dur="2s" repeatCount="indefinite" />
    <animate attributeName="width" to="500" dur="2s" repeatCount="indefinite" />
  </rect>
</svg>
```

<svg width="500px" height="100px">
  <rect x="0" y="0" width="100" height="100" fill="#feac5e">
    <animate attributeName="x" from="0" to="500" dur="2s" repeatCount="indefinite" />
    <animate attributeName="width" to="500" dur="2s" repeatCount="indefinite" />
  </rect>
</svg>

### animateTransform 变形

<p>animate 标签对 CSS 的 transform 属性不起作用，如果需要变形，就要使用 animateTransform 标签。</p>

```html
<svg width="500px" height="300px">
  <rect x="200" y="200" width="50" height="50" fill="#4bc0c8">
    <animateTransform attributeName="transform" type="rotate" begin="0s" dur="3s" from="0 200 100" to="360 300 200" repeatCount="indefinite" />
  </rect>
</svg>
```

<svg width="500px" height="300px">
  <rect x="200" y="200" width="50" height="50" fill="#4bc0c8">
    <animateTransform attributeName="transform" type="rotate" begin="0s" dur="3s" from="0 200 100" to="360 300 200" repeatCount="indefinite" />
  </rect>
</svg>

<p>上面代码中，animateTransform 的效果为旋转（rotate），这时 from 和 to 属性值有三个数字，第一个数字是角度值，第二个值和第三个值是旋转中心的坐标。from="0 200 100"表示开始时，角度为 0，围绕(200, 100)开始旋转；to="360 300 200"表示结束时，角度为 360，围绕(300, 200)旋转。</p>

## JavaScript 操作

### DOM 操作

<p>如果 SVG 代码直接写在 HTML 网页之中，它就成为网页 DOM 的一部分，可以直接用 DOM 操作。</p>

```html
<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 600"
  preserveAspectRatio="xMidYMid meet"
>
  <circle id="mycircle" cx="100" cy="60" r="50" />
</svg>
```

<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 150"
  preserveAspectRatio="xMidYMid meet">
  <circle id="mycircle" cx="100" cy="60" r="50" />
</svg>

<p>上面代码插入网页之后，就可以用 CSS 定制样式。</p>

```html
<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 150"
  preserveAspectRatio="xMidYMid meet"
>
  <style>
    .mycircle-1-1 { stroke-width: 5; stroke: #f00; fill: #ff0; }
    .mycircle-1-1:hover { stroke: #090; fill: #fff; cursor: pointer; }
  </style>
  <circle id="mycircle" class="mycircle-1-1" cx="100" cy="60" r="50" />
</svg>
```

<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 150"
  preserveAspectRatio="xMidYMid meet">
  <style>
    .mycircle-1-1 { stroke-width: 5; stroke: #f00; fill: #ff0; }
    .mycircle-1-1:hover { stroke: #090; fill: #fff; cursor: pointer; }
  </style>
  <circle id="mycircle" class="mycircle-1-1" cx="100" cy="60" r="50" />
</svg>

<p>然后，可以用 JavaScript 代码操作 SVG。</p>

```html
<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 150"
  preserveAspectRatio="xMidYMid meet"
>
  <style>
    .mycircle-1-2 { stroke-width: 5; stroke: #f00; fill: #ff0; }
    .mycircle-1-2:hover { stroke: #090; fill: #fff; cursor: pointer; }
  </style>
  <circle id="mycircle" class="mycircle-1-2" cx="100" cy="60" r="50" />
  <script type="text/javascript">
    const mycircle = document.querySelector('.mycircle-1-2')
    mycircle.addEventListener('click', function(){
      mycircle.setAttribute('r', 60)
      mycircle.setAttribute('cy', 80)
    }, false)
  </script>
</svg>
```

<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 150"
  preserveAspectRatio="xMidYMid meet">
  <style>
    .mycircle-1-2 { stroke-width: 5; stroke: #f00; fill: #ff0; }
    .mycircle-1-2:hover { stroke: #090; fill: #fff; cursor: pointer; }
  </style>
  <circle id="mycircle" class="mycircle-1-2" cx="100" cy="60" r="50" />
  <script type="text/javascript">
    const mycircle = document.querySelector('.mycircle-1-2')
    mycircle.addEventListener('click', function(){
      mycircle.setAttribute('r', 60)
      mycircle.setAttribute('cy', 80)
    }, false)
  </script>
</svg>

<p>上面代码指定，如果点击图形，就改写 circle 元素的 r 属性和 cy 属性。</p>

### 获取 SVG DOM

<p>使用 object、iframe、embed 标签插入 SVG 文件，可以获取 SVG DOM。</p>

```html
const svgObject = document.getElementById('object').contentDocument
const svgIframe = document.getElementById('iframe').contentDocument
const svgEmbed = document.getElementById('embed').getSVGDocument()
```

<p>注意，如果使用 img 标签插入 SVG 文件，就无法获取 SVG DOM。</p>

### 读取 SVG 源码

<p>由于 SVG 文件就是一段 XML 文本，因此可以通过读取 XML 代码的方式，读取 SVG 源码。</p>

```html
<svg
  id="svg-container"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xml:space="preserve" width="500" height="440"
>
  <rect id="svg-rect" x="0" y="0" height="80" width="160" style="stroke: #70d5dd; fill: #dd524b" />
</svg>
```

<svg
  id="svg-container"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xml:space="preserve" width="500" height="100">
  <rect id="svg-rect" x="0" y="0" height="80" width="160" style="stroke: #70d5dd; fill: #dd524b; cursor: pointer;" />
</svg>
<script type="text/javascript">
  const svgString = new XMLSerializer().serializeToString(document.querySelector('#svg-container'))
  document.querySelector('#svg-rect').addEventListener('click', function(){
    alert(svgString)
  }, false)
</script>

<p>使用 XMLSerializer 实例的 serializeToString() 方法，获取 SVG 元素的代码。</p>

```html
const svgString = new XMLSerializer().serializeToString(document.querySelector('#svg-container'))
```

<p>点击矩形，获取 svg 元素字符串。</p>

> 参考链接 [http://www.ruanyifeng.com/blog/2018/08/svg.html](http://www.ruanyifeng.com/blog/2018/08/svg.html)