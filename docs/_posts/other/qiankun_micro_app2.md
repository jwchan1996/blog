---
title: qiankun 微前端应用实践与部署（二）
date: 2020-08-07
categories: "other" #分类
tags:  #标签
    - qiankun
    - micro-frontend
---

# qiankun 微前端应用实践与部署（二）

下面是两种方案的简要描述。

## 传统部署

### 方式

通过配置 `nginx` 端口到目录的转发。

具体可查看
[上一篇文章](https://jwchan.cn/_posts/other/qiankun_micro_app.html)
### 特点

需要对外开放子应用对应的端口，将编译好的应用文件放到对应的配置目录。

## docker 部署

### 方式

首先构建主应用与子应用的 `docker` 镜像，通过 `docker run` 或者 `docker-compose` 的方式启动容器。

通过配置 `nginx` 转发规则，匹配访问路径子应用容器端口。  

假设服务器 `ip` 是 `192.168.2.192`，主应用容器端口是 `8889`，子应用容器端口是 `7100`、`7101`。

其中应用容器在构建镜像时是实现了 `web` 服务的，容器跑起来之后在服务器上是可以通过 `127.0.0.1:7100` 来访问应用的。

因为前端子应用需要注册到主应用上，需要填写子应用的入口地址。  

```javascript
// index.js

registerMicroApps(
  [
    {
      name: 'app1',
      entry: process.env.NODE_ENV === 'production' ? '//192.168.2.192:7100' : '//localhost:7100',
      container: '#subapp-viewport',
      loader,
      activeRule: '/app1',
    },
    {
      name: 'app2',
      entry: process.env.NODE_ENV === 'production' ? '//192.168.2.192:7101' : '//localhost:7101',
      container: '#subapp-viewport',
      loader,
      activeRule: '/app2',
    }
  ]
}
```

此时服务器需要开放的端口是主应用的 `8889`，子应用的 `7100`、`7101`。

为了减少对外开放的端口数，我们要对 `8889` 端口进行 `nginx` 路径匹配转发。

修改子应用注册信息：
```javascript
// index.js

registerMicroApps(
  [
    {
      name: 'app1',
      entry: process.env.NODE_ENV === 'production' ? '//192.168.2.192:8889/app1' : '//localhost:7100',
      container: '#subapp-viewport',
      loader,
      activeRule: '/app1',
    },
    {
      name: 'app2',
      entry: process.env.NODE_ENV === 'production' ? '//192.168.2.192:8889/app2' : '//localhost:7101',
      container: '#subapp-viewport',
      loader,
      activeRule: '/app2',
    }
  ]
}
```

当前子应用在主应用配置的入口地址 `entry` 是 `192.168.2.192:8889/app1`，实际经过 `nginx` 代理访问的是 `127.0.0.1:7100`，即实际访问的是运行在服务器的子应用。

配置 `nginx` 代理规则：
```bash
# nginx.conf

http {
    server {
      listen	8889;
      server_name 192.168.2.192;
      
      location /app1 {
        proxy_pass  127.0.0.1:7100

        try_files $uri $uri/ /index.html;
      }
    }
    
    server {
      listen	8889;
      server_name 192.168.2.192;
      
      location /app2 {
        proxy_pass  127.0.0.1:7101

        try_files $uri $uri/ /index.html;
      }
    }
}
```

主应用访问子应用流程图：

![process](~public/other/qiankun_micro_app2/process.png)

> 如果子应用部署在其他服务器，还需在其他服务器配置 `nginx` 的跨域问题

### 特点

访问权限规则由 `nginx` 的转发配置决定，可开放较少端口，对外开放的端口只有主应用服务的端口。