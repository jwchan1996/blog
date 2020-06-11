module.exports = {
  title: '飘香豆腐の博客',
  description: 'Just playing around',
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
          }
        ],
      },
      { text: 'GitHub', link: 'https://github.com/jwchan1996/blog' }
    ],
    sidebarDepth: 2,
    sidebar: {
      '/_posts/tool/docker/': [
        {
          title: 'Docker',
          collapsable: true, 
          children: [
            { title: 'docker 访问宿主机的 ip 配置问题', path:'/_posts/tool/docker/docker-call-centos-host-machine'}
          ]
        }
      ]
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