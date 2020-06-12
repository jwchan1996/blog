---
home: true 
# heroImage: /hero.png
heroText: null
tagline: null
# heroText: 七号仓库
# tagline: 记录与分享 bug 的诞生
# actionText: 围观吃瓜 →
# actionLink: /archives/ 
footer: MIT Licensed | Copyright © 2020 飘香豆腐
---


<link href="https://fonts.googleapis.com/css?family=Rubik:300,500,700" rel="stylesheet">

<template>
  <div class="about">
    <h1>Hello.</h1>
    <p style="font-weight:500; font-size:2.2em">
      My name is Jwchan.
    </p>
    <p>
      I am a front-end development engineer who has been practicing for two years. 
      You can find me or follow me on
      <a href="https://github.com/jwchan1996" target="_blank">GitHub</a>.
      Welcome to communicate with me.
    </p>
    <h1>大家好。</h1>
    <p style="font-weight:500; font-size:2.2em">
      我是飘香豆腐。
    </p>
    <p>
      我是一个练习时长两年的前端开发工程师，你可以在 
      <a href="https://github.com/jwchan1996" target="_blank">GitHub</a>
      上找到我或者关注我。
      欢迎与我交流。
    </p>
  </div>
</template>

<style scoped>
  .about {
    font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: calc(10px + 0.33vw);
    -webkit-font-smoothing: antialiased;
    padding: 5vh 10%;
    color: #121314;
  }
  h1 {
    font-size: 4.5em;
    font-weight: 500;
    margin-bottom: 0;
  }
  p {
    font-size: 1.6em;
    font-weight: 300;
    line-height: 1.4;
    max-width: 26em;
  }
  a {
    text-decoration: none;
    color: #121314;
    position: relative;
  }
  a:after {
    content: "";
    position: absolute;
    z-index: 0;
    top: 60%;
    left: -0.1em;
    right: -0.1em;
    bottom: 0;
    transition: top 200ms cubic-bezier(0, .8, .13, 1);
    background-color: rgba(79,192,141,0.5);
  }
  a:hover:after {
    top: 0%;
  }
</style>