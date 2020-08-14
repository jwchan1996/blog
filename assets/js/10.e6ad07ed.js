(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{362:function(t,s,a){t.exports=a.p+"assets/img/master.d6e2b9ea.png"},363:function(t,s,a){t.exports=a.p+"assets/img/gh-pages.fc1d226d.png"},425:function(t,s,a){"use strict";a.r(s);var n=a(43),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"vuepress-使用-cdn-优化-gh-pages-加载速度"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#vuepress-使用-cdn-优化-gh-pages-加载速度"}},[t._v("#")]),t._v(" Vuepress 使用 CDN 优化 gh-pages 加载速度")]),t._v(" "),n("p",[t._v("众所周知，"),n("code",[t._v("github")]),t._v(" 在国内访问极不稳定，有时候加载速度极慢，导致国内用户体验极差。"),n("br"),t._v("\n我的 "),n("code",[t._v("Vuepress")]),t._v(" "),n("a",{attrs:{href:"https://jwchan.cn/",target:"_blank",rel:"noopener noreferrer"}},[t._v("博客网站"),n("OutboundLink")],1),t._v("刚好是托管在 "),n("code",[t._v("gh-pages")]),t._v(" 上，所以就想优化访问速度，让页面更加顺滑。")]),t._v(" "),n("h2",{attrs:{id:"优化方案"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#优化方案"}},[t._v("#")]),t._v(" 优化方案")]),t._v(" "),n("p",[t._v("下面优化博客加载速度的一些方案：")]),t._v(" "),n("ul",[n("li",[t._v("优化打包代码文件大小")]),t._v(" "),n("li",[t._v("压缩加载资源文件大小")]),t._v(" "),n("li",[t._v("减少 "),n("code",[t._v("http")]),t._v(" 请求次数")]),t._v(" "),n("li",[t._v("采用 "),n("code",[t._v("cdn")]),t._v(" 加速")])]),t._v(" "),n("p",[t._v("因为 "),n("code",[t._v("Vuepress")]),t._v(" 是静态博客，而且 "),n("code",[t._v("Vuepress")]),t._v(" 本身会优化打包代码文件大小，所以现在方向是压缩图片等资源文件大小，并且使用 "),n("code",[t._v("cdn")]),t._v(" 加速。")]),t._v(" "),n("h2",{attrs:{id:"使用-cdn-加速"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#使用-cdn-加速"}},[t._v("#")]),t._v(" 使用 CDN 加速")]),t._v(" "),n("p",[t._v("免费的 "),n("code",[t._v("jsDelivr CDN")]),t._v(" 天然支持 "),n("code",[t._v("Github")]),t._v(" 仓库的加速，那么如何使用呢？")]),t._v(" "),n("p",[t._v("以我的博客仓库为例，仓库地址是 "),n("code",[t._v("https://github.com/jwchan1996/blog")]),t._v("。"),n("br"),t._v("\n其中，仓库资源可以通过 "),n("code",[t._v("https://cdn.jsdelivr.net/gh/jwchan1996/blog")]),t._v(" + "),n("code",[t._v("仓库文件路径")]),t._v(" 直接访问。")]),t._v(" "),n("p",[t._v("比如："),n("code",[t._v("https://cdn.jsdelivr.net/gh/jwchan1996/blog/README.md")])]),t._v(" "),n("p",[t._v("默认是访问 "),n("code",[t._v("master")]),t._v(" 分支下的资源，如果需要访问其他分支的资源，需要指定分支：")]),t._v(" "),n("div",{staticClass:"language-bash extra-class"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# master分支")]),t._v("\nhttps://cdn.jsdelivr.net/gh/jwchan1996/blog@master/README.md\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# gh-pages分支")]),t._v("\nhttps://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/logo.png\n")])])]),n("h2",{attrs:{id:"配置-vuepress"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#配置-vuepress"}},[t._v("#")]),t._v(" 配置 Vuepress")]),t._v(" "),n("p",[t._v("下面分别是 "),n("code",[t._v("Vuepress")]),t._v(" 编译前的博客源码与编译后的目录截图：")]),t._v(" "),n("blockquote",[n("p",[t._v("master 分支")])]),t._v(" "),n("p",[n("img",{attrs:{src:a(362),alt:"master"}})]),t._v(" "),n("blockquote",[n("p",[t._v("gh-pages 分支")])]),t._v(" "),n("p",[n("img",{attrs:{src:a(363),alt:"gh-pages"}})]),t._v(" "),n("p",[t._v("我们的目的是部署博客代码到 "),n("code",[t._v("gh-pages")]),t._v(" 的时候使用 "),n("code",[t._v("cdn")]),t._v(" 资源路径，而本地开发依然采用本地路径。")]),t._v(" "),n("p",[t._v("那么，如何配置呢？")]),t._v(" "),n("p",[t._v("找到 "),n("code",[t._v("config.js")]),t._v(" 配置文件的 "),n("code",[t._v("configureWebpack")]),t._v(" 配置：")]),t._v(" "),n("div",{staticClass:"language-javascript extra-class"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[t._v("module"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  title"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'飘香豆腐的博客'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  …\n  …\n  configureWebpack"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    \n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("其中 "),n("code",[t._v("configureWebpack")]),t._v(" 是用于修改 "),n("code",[t._v("Vuepress")]),t._v(" 内部的 "),n("code",[t._v("Webpack")]),t._v(" 配置的，可以是一个对象，也可以是一个函数，然后返回一个对象。")]),t._v(" "),n("p",[t._v("因为我们需要做环境判断是开发环境还是生产环境，所以我们使用函数配置。")]),t._v(" "),n("div",{staticClass:"language-javascript extra-class"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" path "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'path'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\nmodule"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  …\n  …\n  "),n("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("configureWebpack")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token constant"}},[t._v("NODE_ENV")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" process"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("env"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token constant"}},[t._v("NODE_ENV")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//判断是否是生产环境")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token constant"}},[t._v("NODE_ENV")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'production'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        output"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          publicPath"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/'")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        resolve"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//配置路径别名")]),t._v("\n          alias"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'public'")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" path"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("__dirname"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./public'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" \n          "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        resolve"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//配置路径别名")]),t._v("\n          alias"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'public'")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" path"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("__dirname"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./public'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" \n          "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("此时我们 "),n("code",[t._v("markdown")]),t._v(" 文件里面图片路径还是这样的：")]),t._v(" "),n("div",{staticClass:"language-md extra-class"},[n("pre",{pre:!0,attrs:{class:"language-md"}},[n("code",[n("span",{pre:!0,attrs:{class:"token url"}},[t._v("!["),n("span",{pre:!0,attrs:{class:"token content"}},[t._v("gitlab 503")]),t._v("](/docker/docker_gitlab_restore/02.png)")]),t._v("\n")])])]),n("p",[t._v("这样编译出来的的 "),n("code",[t._v("html")]),t._v(" 文件图片路径依然是 "),n("code",[t._v("/docker/docker_gitlab_restore/02.png")]),t._v("，因为没有识别图片为 "),n("code",[t._v("Webpack")]),t._v(" 模块，所以没有添加任何路径前缀。")]),t._v(" "),n("p",[t._v("要想添加前缀，修改 "),n("code",[t._v("markdown")]),t._v(" 文件图片地址即可，添加 "),n("code",[t._v("Webpack")]),t._v(" 配置好的路径别名前缀：")]),t._v(" "),n("div",{staticClass:"language-md extra-class"},[n("pre",{pre:!0,attrs:{class:"language-md"}},[n("code",[n("span",{pre:!0,attrs:{class:"token url"}},[t._v("!["),n("span",{pre:!0,attrs:{class:"token content"}},[t._v("gitlab 503")]),t._v("](~public/docker/docker_gitlab_restore/02.png)")]),t._v("\n")])])]),n("p",[t._v("这样所有 "),n("code",[t._v("markdown")]),t._v(" 文件的图片都会被打包到 "),n("code",[t._v("assets")]),t._v(" 目录下，如 "),n("code",[t._v("/assets/img/02.706d49fc.png")])]),t._v(" "),n("p",[t._v("同时 "),n("code",[t._v("html")]),t._v(" 文件的图片路径也会加上配置的 "),n("code",[t._v("publicPath")]),t._v(" 前缀：")]),t._v(" "),n("div",{staticClass:"language-shell extra-class"},[n("pre",{pre:!0,attrs:{class:"language-shell"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 打包后的CDN地址")]),t._v("\nhttps://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/assets/img/02.706d49fc.png\n")])])]),n("div",{staticClass:"language-shell extra-class"},[n("pre",{pre:!0,attrs:{class:"language-shell"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 打包后的html文件图片标签")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("img "),n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("src")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"https://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/assets/img/02.706d49fc.png"')]),t._v(" "),n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("alt")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"gitlab 503"')]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n")])])]),n("p",[t._v("到此 "),n("code",[t._v("Vuepress")]),t._v(" 的配置就完成了，将代码 "),n("code",[t._v("push")]),t._v(" 到 "),n("code",[t._v("github")]),t._v(" 仓库，等待自动化部署后，可以发现访问速度明显地提升了许多，顺滑许多！")]),t._v(" "),n("p",[t._v("具体访问体验可参考 "),n("a",{attrs:{href:"https://jwchan.cn/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://jwchan.cn"),n("OutboundLink")],1)])])}),[],!1,null,null,null);s.default=e.exports}}]);