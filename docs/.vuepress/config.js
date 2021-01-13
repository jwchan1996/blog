const path = require('path')

module.exports = {
  title: '飘香豆腐の博客',
  description: '记录技术与生活',
  base: '/',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '主页', link: '/' },
      { text: '归档', link: '/archives/' },
      { 
        text: '分类',
        items: [
          { 
            text: '前端',
            items: [
              { text: 'vue', link: '/_posts/frontend/vue/' },
              { text: 'react', link: '/_posts/frontend/react/' },
              { text: 'javascript', link: '/_posts/frontend/javascript/' },
              { text: 'typescript', link: '/_posts/frontend/typescript/' }
            ] 
          },
          { 
            text: '后端', 
            items: [
              { text: 'node', link: '/_posts/backend/node/' },
              { text: 'deno', link: '/_posts/backend/deno/' },
              { text: 'go', link: '/_posts/backend/go/' },
              { text: 'rust', link: '/_posts/backend/rust/' },
            ] 
          },
          { 
            text: '工具', 
            items: [
              { text: 'docker', link: '/_posts/tool/docker/' },
              { text: 'git', link: '/_posts/tool/git/' },
              { text: 'webpack', link: '/_posts/tool/webpack/' }
            ] 
          },
          {
            text: '跨端', 
            items: [
              { text: 'flutter', link: '/_posts/across/flutter/' },
              { text: 'electron', link: '/_posts/across/electron/' }
            ] 
          },
          {
            text: '第三方库', 
            items: [
              { text: 'axios', link: '/_posts/plugin/axios/' }
            ] 
          },
          {
            text: '其他', 
            items: [
              { text: '未分类', link: '/_posts/other/' }
            ] 
          },
        ],
      },
      { text: '关于', link: '/about/' },
      { text: 'GitHub', link: 'https://github.com/jwchan1996/blog' }
    ],
    sidebarDepth: 2,
    sidebar: {
      '/_posts/frontend/vue/': [
        {
          title: 'Vue',
          collapsable: true, 
          children: [
            { title: 'vue 数据与视图更新', path:'/_posts/frontend/vue/vue_data_update'},
            { title: '关于 ref 与 $refs 对 dom 元素的操作', path:'/_posts/frontend/vue/vue_$refs'},
            { title: '手写实现一个 VueRouter', path:'/_posts/frontend/vue/write_vue_router'}
          ]
        }
      ],
      '/_posts/frontend/javascript/': [
        {
          title: 'JavaScript',
          collapsable: true, 
          children: [
            { title: 'JavaScript 中的 call()、apply()、bind() 的用法', path:'/_posts/frontend/javascript/js_call_apply_bind'},
            { title: 'JS 模拟实现 call、apply、bind', path:'/_posts/frontend/javascript/js_simulate_call_apply_bind'},
            { title: '发布订阅模式和观察者模式', path:'/_posts/frontend/javascript/publish_subscribe_observer'},
            { title: '手写实现一个 Promise', path:'/_posts/frontend/javascript/write_promise'}
          ]
        }
      ],
      '/_posts/backend/node/': [
        {
          title: 'Node',
          collapsable: true, 
          children: [
            { title: 'koa 实现 token 有效时间续期的思路', path:'/_posts/backend/node/koa_token'},
            { title: 'koa-jwt 实现自定义排除动态路由的鉴权', path:'/_posts/backend/node/koa_jwt_unless'}
          ]
        }
      ],
      '/_posts/tool/docker/': [
        {
          title: 'Docker',
          collapsable: true, 
          children: [
            { title: 'docker 访问宿主机的 ip 配置问题', path:'/_posts/tool/docker/docker-call-centos-host-machine'},
            { title: 'centos7 使用 docker 部署 gitlab + gitlab-runner', path:'/_posts/tool/docker/docker-deploy-gitlab'},
            { title: 'docker gitlab 备份还原', path:'/_posts/tool/docker/docker-gitlab-restore'},
            { title: 'docker 访问外部 https 的数字证书验证问题', path:'/_posts/tool/docker/docker-call-https'}
          ]
        }
      ],
      '/_posts/tool/git/': [
        {
          title: 'Git',
          collapsable: true, 
          children: [
            { title: 'Git 代码托管', path:'/_posts/tool/git/git_command'},
            { title: '使用 git 向开源项目提交 pr', path:'/_posts/tool/git/git_pull_request'},
            { title: '版本库提交信息规范与自动验证', path:'/_posts/tool/git/git_commit_msg'},
            { title: 'Git 撤销操作', path:'/_posts/tool/git/git_reset'}
          ]
        }
      ],
      '/_posts/tool/webpack/': [
        {
          title: 'Webpack',
          collapsable: true, 
          children: [
            { title: '01-快速上手', path:'/_posts/tool/webpack/01-quickly-start'},
            { title: '02-配置文件', path:'/_posts/tool/webpack/02-configuration'},
            { title: '03-资源模块加载', path:'/_posts/tool/webpack/03-asset-load'},
            { title: '04-处理 ES6 代码', path:'/_posts/tool/webpack/04-babel-loader'},
            { title: '05-Loader 加载器机制', path:'/_posts/tool/webpack/05-loader-theory'},
            { title: '06-webpack 常用插件', path:'/_posts/tool/webpack/06-generally-used-plugins'},
            { title: '07-Plugin 插件机制', path:'/_posts/tool/webpack/07-plugin-theory'},
            { title: '08-webpack-dev-server', path:'/_posts/tool/webpack/08-webpack-dev-server'},
            { title: '09-HMR 模块热更新', path:'/_posts/tool/webpack/09-webpack-hmr'},
            { title: '10-使用 Source Map', path:'/_posts/tool/webpack/10-webpack-source-map'},
            { title: '11-为不同环境抽离配置', path:'/_posts/tool/webpack/11-merge-webpack-config'},
            { title: '12-提取单个 CSS 文件并压缩', path:'/_posts/tool/webpack/12-mini-css-extract-plugin'},
            { title: '13-webpack 优化配置之 DefinePlugin', path:'/_posts/tool/webpack/13-define-plugin'},
            { title: '14-webpack 优化配置之 Tree-shaking', path:'/_posts/tool/webpack/14-tree-shaking'},
            { title: '15-webpack 优化配置之 sideEffects', path:'/_posts/tool/webpack/15-side-effects'},
            { title: '16-webpack 优化配置之 Code Splitting 多入口打包', path:'/_posts/tool/webpack/16-multiple-entry'},
            { title: '17-webpack 优化配置之 Code Splitting 动态导入', path:'/_posts/tool/webpack/17-dynamic-import'},
          ]
        }
      ],
      '/_posts/tool/rollup/': [
        {
          title: 'Rollup',
          collapsable: true, 
          children: [
            { title: '01-快速上手', path:'/_posts/tool/rollup/01-quickly-start'},
          ]
        }
      ],
      '/_posts/across/flutter/': [
        {
          title: 'Flutter',
          collapsable: true, 
          children: [
            { title: 'Flutter 读取应用资源并显示', path:'/_posts/across/flutter/flutter_load_asset'},
          ]
        }
      ],
      '/_posts/across/electron/': [
        {
          title: 'Electron',
          collapsable: true, 
          children: [
            { title: 'Electron 踩坑记录（一）', path:'/_posts/across/electron/electron_note_1'},
            { title: 'Electron 踩坑记录（二）', path:'/_posts/across/electron/electron_note_2'},
            { title: 'Electron 踩坑记录（三）', path:'/_posts/across/electron/electron_note_3'}
          ]
        }
      ],
      '/_posts/plugin/axios/': [
        {
          title: 'Axios',
          collapsable: true, 
          children: [
            { title: '关于 axios 请求出现 OPTIONS', path:'/_posts/plugin/axios/axios_options'}
          ]
        }
      ],
      '/_posts/other/': [
        {
          title: 'Other',
          collapsable: true, 
          children: [
            { title: 'Vuepress 使用 CDN 优化 gh-pages 加载速度', path:'/_posts/other/vuepress_gh-pages_cdn'},
            { title: 'SVG 基础', path:'/_posts/other/svg'},
            { title: 'qiankun 微前端应用实践与部署', path:'/_posts/other/qiankun_micro_app'},
            { title: 'qiankun 微前端应用实践与部署（二）', path:'/_posts/other/qiankun_micro_app2'},
            { title: 'qiankun 微前端应用实践与部署（三）', path:'/_posts/other/qiankun_micro_app3'},
            { title: 'qiankun 微前端应用实践与部署（四）', path:'/_posts/other/qiankun_micro_app4'},
          ]
        }
      ],
    },
    displayAllHeaders: true, // 默认值：false
    lastUpdated: '上次更新', // string | boolean
    smoothScroll: true,
  },
  configureWebpack: () => {
    const NODE_ENV = process.env.NODE_ENV
    if(NODE_ENV === 'production'){
      return {
        output: {
          publicPath: 'https://cdn.jsdelivr.net/gh/jwchan1996/blog@gh-pages/'
        },
        resolve: {
          alias: {
            'public': path.resolve(__dirname, './public') 
          }
        }
      }
    }else{
      return {
        resolve: {
          alias: {
            'public': path.resolve(__dirname, './public') 
          }
        }
      }
    }
  }
}