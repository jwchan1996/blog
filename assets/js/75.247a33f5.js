(window.webpackJsonp=window.webpackJsonp||[]).push([[75],{515:function(s,n,t){"use strict";t.r(n);var a=t(43),e=Object(a.a)({},(function(){var s=this,n=s.$createElement,t=s._self._c||n;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"webpack-优化配置之-code-splitting-动态导入"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack-优化配置之-code-splitting-动态导入"}},[s._v("#")]),s._v(" webpack 优化配置之 Code Splitting 动态导入")]),s._v(" "),t("p",[s._v("所有模块打包在一起，会导致 "),t("code",[s._v("bundle")]),s._v(" 文件体积过大。而实际上应用在开始工作时，并不是每个模块在启动时都是必须要加载进来的。更合理的做法是将代码通过合理的规则拆分成多个 "),t("code",[s._v("bundle")]),s._v("，根据应用的运行需要进行按需加载这些模块，这样可以大大提高应用的响应速度与运行效率。")]),s._v(" "),t("p",[t("code",[s._v("webpack")]),s._v(" 实现分包的方式有两种：")]),s._v(" "),t("ul",[t("li",[s._v("多入口打包")]),s._v(" "),t("li",[s._v("动态导入")])]),s._v(" "),t("p",[s._v("下面来看一下如何配置动态导入。")]),s._v(" "),t("p",[s._v("所谓动态导入，也就是按需加载的方式。"),t("code",[s._v("webpack")]),s._v(" 支持动态导入的方式实现按需加载，所有动态导入的模块都会被自动分包。")]),s._v(" "),t("p",[s._v("相比于多入口的方式，动态导入方式更加灵活，因为可以通过代码逻辑去控制需不需要加载某个模块，或者什么时候加载。按照 "),t("code",[s._v("ES Modules")]),s._v(" 动态导入的方式调用方法，"),t("code",[s._v("webpack")]),s._v(" 在打包的时候会自动按照动态导入的方式进行模块分包和按需加载。下面分别对比非动态导入方式与动态导入方式的写法与打包结果。")]),s._v(" "),t("p",[t("a",{attrs:{href:"https://github.com/jwchan1996/webpack-play/blob/main/17-dynamic-import",target:"_blank",rel:"noopener noreferrer"}},[s._v("示例代码仓库"),t("OutboundLink")],1)]),s._v(" "),t("p",[s._v("非动态导入方式以及打包结果：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// src/index.js")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("import")]),s._v(" posts "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("from")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./posts/posts'")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("import")]),s._v(" album "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("from")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./album/album'")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function-variable function"}},[s._v("render")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" hash "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" window"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("location"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("hash "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("||")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'#posts'")]),s._v("\n\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" mainElement "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" document"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("querySelector")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'.main'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n  mainElement"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("innerHTML "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("''")]),s._v("\n\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("hash "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'#posts'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    mainElement"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("appendChild")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("posts")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("else")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("hash "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'#album'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    mainElement"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("appendChild")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("album")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("render")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\nwindow"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("addEventListener")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'hashchange'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" render"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])])]),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打包结果 ")]),s._v("\n├── dist\n│   ├── index.html\n│   └── main.bundle.js  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称")]),s._v("\n")])])]),t("p",[s._v("动态导入方式以及打包结果：")]),s._v(" "),t("div",{staticClass:"language-diff extra-class"},[t("pre",{pre:!0,attrs:{class:"language-diff"}},[t("code",[t("span",{pre:!0,attrs:{class:"token deleted-sign deleted"}},[s._v("- import posts from './posts/posts'\n- import album from './album/album'\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("  const render = () => {\n    const hash = window.location.hash || '#posts'\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    const mainElement = document.querySelector('.main')\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    mainElement.innerHTML = ''\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    if (hash === '#posts') {\n")]),t("span",{pre:!0,attrs:{class:"token deleted-sign deleted"}},[s._v("-     mainElement.appendChild(posts())\n")]),t("span",{pre:!0,attrs:{class:"token inserted-sign inserted"}},[s._v("+     import('./posts/posts').then(({ default: posts }) => {\n+       mainElement.appendChild(posts())\n+     })\n")]),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    } else if (hash === '#album') {\n")]),t("span",{pre:!0,attrs:{class:"token deleted-sign deleted"}},[s._v("-     mainElement.appendChild(album())\n")]),t("span",{pre:!0,attrs:{class:"token inserted-sign inserted"}},[s._v("+     import('./album/album').then(({ default: album }) => {\n+       mainElement.appendChild(album())\n+     })\n")]),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    }\n  }\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("  render()\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("  window.addEventListener('hashchange', render)\n")])])])]),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打包结果 ")]),s._v("\n├── dist\n│   ├── "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(".bundle.js\n│   ├── "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v(".bundle.js\n│   ├── index.html\n│   └── main.bundle.js  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称")]),s._v("\n")])])]),t("p",[s._v("如果使用的是单页面开发框架 "),t("code",[s._v("vue")]),s._v(" 和 "),t("code",[s._v("react")]),s._v("，项目中的路由映射组件就可以实现这种动态导入按需引用的加载方式。")]),s._v(" "),t("p",[s._v("从打包结果可以发现，通过动态导入的方式导入的模块打包后的文件名就是一个序号，如果需要给这些文件命名的话，可以使用 "),t("code",[s._v("webpack")]),s._v(" 特有的魔法注释来实现。具体就是在调用 "),t("code",[s._v("import")]),s._v(" 方法的参数位置添加一个行内注释。")]),s._v(" "),t("p",[s._v("特定的格式：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/* webpackChunkName: posts */")]),s._v("\n")])])]),t("p",[s._v("添加行内注释：")]),s._v(" "),t("div",{staticClass:"language-diff extra-class"},[t("pre",{pre:!0,attrs:{class:"language-diff"}},[t("code",[t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("  const render = () => {\n    const hash = window.location.hash || '#posts'\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    const mainElement = document.querySelector('.main')\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    mainElement.innerHTML = ''\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    if (hash === '#posts') {\n")]),t("span",{pre:!0,attrs:{class:"token deleted-sign deleted"}},[s._v("-     import('./posts/posts').then(({ default: posts }) => {\n")]),t("span",{pre:!0,attrs:{class:"token inserted-sign inserted"}},[s._v("+     import(/* webpackChunkName: 'posts' */'./posts/posts').then(({ default: posts }) => {\n+       mainElement.appendChild(posts())\n+     })\n")]),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    } else if (hash === '#album') {\n")]),t("span",{pre:!0,attrs:{class:"token deleted-sign deleted"}},[s._v("-     import('./album/album').then(({ default: album }) => {\n")]),t("span",{pre:!0,attrs:{class:"token inserted-sign inserted"}},[s._v("+     import(/* webpackChunkName: 'album' */'./album/album').then(({ default: album }) => {\n+       mainElement.appendChild(album())\n+     })\n")]),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("    }\n  }\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("  render()\n")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token unchanged"}},[s._v("  window.addEventListener('hashchange', render)\n")])])])]),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打包结果 ")]),s._v("\n├── dist\n│   ├── album.bundle.js "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 通过行内注释指定 album 名称生成文件名")]),s._v("\n│   ├── index.html\n│   ├── main.bundle.js  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称")]),s._v("\n│   └── posts.bundle.js "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 通过行内注释指定 posts 名称生成文件名")]),s._v("\n")])])]),t("p",[s._v("如果两个模块的魔法注释名字一样，那么这两个模块会被打包合并在一起。比如都是 "),t("code",[s._v("/* webpackChunkName: 'components' */")]),s._v("，则打包出来是：")]),s._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打包结果 ")]),s._v("\n├── dist\n│   ├── components.bundle.js "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 通过行内注释指定 components 名称生成文件名")]),s._v("\n│   ├── index.html \n│   └── main.bundle.js "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 这里生成的 main 前缀是因为指定了入口文件的 chunk 名称")]),s._v("\n")])])])])}),[],!1,null,null,null);n.default=e.exports}}]);