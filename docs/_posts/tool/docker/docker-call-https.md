---
title: docker 访问外部 https 的数字证书验证问题
date: 2020-07-15
categories: "docker" #分类
tags:  #标签
    - docker
    - alpine
    - ca
---

# docker 访问外部 https 的数字证书验证问题

我们在构建 `docker` 镜像时一般使用的是 `alpine linux` 系统，默认是不带 `ca-certificates` 根证书的，导致无法识别外部 https 携带的数字证书。

那么，在访问的时候就会抛出 `x509: certificate signed by unknown authority` 的错误，导致 `docker` 容器的接口服务返回 `500`。

为了解决证书验证的问题，我们要在构建 `docker` 镜像的时候把 `ca-certificates` 根证书给装上，这样就能识别来自外部 `https` 的数字证书了。

在编辑 `Dockerfile` 的时候加入以下命令即可：

```bash
RUN apk --no-cache add ca-certificates \
  && update-ca-certificates
```

如果不想重新构建镜像的话，可以直接进入容器：
```bash
$ docker exec -it '容器ID或容器名称' bash
```
然后执行安装根证书命令：
```bash
$ apk --no-cache add ca-certificates && update-ca-certificates
```
出现以下警告，可以忽略：
```
WARNING: ca-certificates.crt does not contain exactly one certificate or CRL: skipping
```

然后重启容器即可：
```bash
$ docker restart '容器ID或容器名称'
```