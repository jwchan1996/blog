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
            { title: '关于 ref 与 $refs 对 dom 元素的操作', path:'/_posts/frontend/vue/vue_$refs'}
          ]
        }
      ],
      '/_posts/frontend/javascript/': [
        {
          title: 'JavaScript',
          collapsable: true, 
          children: [
            { title: 'JavaScript 中的 call()、apply()、bind() 的用法', path:'/_posts/frontend/javascript/js_call_apply_bind'},
            { title: 'JS 模拟实现 call、apply、bind', path:'/_posts/frontend/javascript/js_simulate_call_apply_bind'}
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
            { title: 'centos7 使用 docker 部署 gitlab + gitlab-runner', path:'/_posts/tool/docker/docker-deploy-gitlab'}
          ]
        }
      ],
      '/_posts/tool/git/': [
        {
          title: 'Git',
          collapsable: true, 
          children: [
            { title: 'Git 代码托管', path:'/_posts/tool/git/git_command'},
            { title: '使用 git 向开源项目提交 pr', path:'/_posts/tool/git/git_pull_request'}
          ]
        }
      ],
      '/_posts/across/electron/': [
        {
          title: 'Electron',
          collapsable: true, 
          children: [
            { title: 'Electron 踩坑记录（一）', path:'/_posts/across/electron/electron_note_1'},
            { title: 'Electron 踩坑记录（二）', path:'/_posts/across/electron/electron_note_2'}
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
    },
    displayAllHeaders: true, // 默认值：false
    lastUpdated: '上次更新', // string | boolean
    smoothScroll: true,
  },
  configureWebpack: {
    resolve: {
      alias: {
        'public': './public' 
      }
    }
  }
}