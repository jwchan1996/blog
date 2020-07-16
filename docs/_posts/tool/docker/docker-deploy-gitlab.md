---
title: centos7 使用 docker 部署 gitlab + gitlab-runner
date: 2020-06-17
categories: "docker" #分类
tags:  #标签
    - docker
    - gitlab
    - gitlab-runner
---

# centos7 使用 docker 部署 gitlab + gitlab-runner
## 快速配置应用
### docker-compose.yml

使用 `docker-compose` 对 `docker` 容器集群进行快速编排

获取 `docker-gitlab` 的 `docker-compose.yml` 配置文件，进行快速构建

```bash
$ wget https://raw.githubusercontent.com/sameersbn/docker-gitlab/master/docker-compose.yml
```
获取 `docker-compose.yml` 文件后，进行自定义配置。

### 配置环境

打开 `docker-compose.yml` 文件，针对 `gitlab` 进行环境配置
```yaml
version: '2.3'

services:
  
  ...
  # 省略显示其他服务
  ...
  
  gitlab:
    restart: always
    image: sameersbn/gitlab:13.0.6
    depends_on:
    - redis
    - postgresql
    ports:
    - "10080:80"
    - "10022:22"
    volumes:
    - gitlab-data:/home/git/data:Z
    healthcheck:
      test: ["CMD", "/usr/local/sbin/healthcheck"]
      interval: 5m
      timeout: 10s
      retries: 3
      start_period: 5m
    environment:
    - DEBUG=false

    - DB_ADAPTER=postgresql
    - DB_HOST=postgresql
    - DB_PORT=5432
    - DB_USER=gitlab
    - DB_PASS=password
    - DB_NAME=gitlabhq_production

    - REDIS_HOST=redis
    - REDIS_PORT=6379

    - TZ=Asia/Kolkata
    - GITLAB_TIMEZONE=Kolkata

    - GITLAB_HTTPS=false
    - SSL_SELF_SIGNED=false

    - GITLAB_HOST=localhost
    - GITLAB_PORT=10080
    - GITLAB_SSH_PORT=10022
    - GITLAB_RELATIVE_URL_ROOT=
    - GITLAB_SECRETS_DB_KEY_BASE=long-and-random-alphanumeric-string
    - GITLAB_SECRETS_SECRET_KEY_BASE=long-and-random-alphanumeric-string
    - GITLAB_SECRETS_OTP_KEY_BASE=long-and-random-alphanumeric-string

    ...
    # 省略其他配置
    ...
```

参考[配置文档](https://github.com/sameersbn/docker-gitlab/)，我们需要将时区设置为东八时区，设置数据混淆密匙，设置服务地址。

```yaml
environment:
- TZ=Asia/Shanghai
- GITLAB_TIMEZONE=Asia/Shanghai

- GITLAB_HOST=192.168.2.192
```

设置混淆密匙，一般推荐 `64` 位随机字符串，可以用 `pwgen` 生成，可以安装 `pwgen` 服务，然后运行 `pwgen -Bsv1 64` 即可生成随机字符串。

```yaml
environment:
- GITLAB_SECRETS_DB_KEY_BASE=nvqgzJdgrmr3tqsC4F9gKVNhKvTq3N7cJPjNggR93qthNhJ3MWkc7jNmNTLRXdhX
- GITLAB_SECRETS_SECRET_KEY_BASE=pcrf73fX4rM7bKxc7tcq3kwKWdtKKtrmmsHwT3J9rwCLMsK37PxCnXbMgnRpqJbk
- GITLAB_SECRETS_OTP_KEY_BASE=3d9tPCzpv7rfmVgnjN9McbztRVbp4rjxWWqFbNLTCbRz9mKkpvqqWgxMq7NM7c9w
```

同理，`docker-compose.yml` 的其他服务也需要配置东八时区。

### 数据卷挂载

数据卷挂载可对数据进行持久化保存，不会因为容器的删除而删除，数据挂载的目录数据会自动与容器内的数据同步，数据挂载的目录数据优先于容器内数据，即修改数据卷数据，会自动同步到容器内数据。

```yaml
version: '2.3'

services:
  redis:
    restart: always
    image: redis:5.0.9
    command:
    - --loglevel warning
    volumes:
    - redis-data:/var/lib/redis:Z
    environment:
    - TZ=Asia/Shanghai

  postgresql:
    restart: always
    image: sameersbn/postgresql:11-20200524
    volumes:
    - postgresql-data:/var/lib/postgresql:Z
    environment:
    - DB_USER=gitlab
    - DB_PASS=password
    - DB_NAME=gitlabhq_production
    - DB_EXTENSION=pg_trgm
    - TZ=Asia/Shanghai

  gitlab:
    restart: always
    image: sameersbn/gitlab:13.0.6
    depends_on:
    - redis
    - postgresql
    ports:
    - "10080:80"
    - "10022:22"
    volumes:
    - gitlab-data:/home/git/data:Z
    healthcheck:
      test: ["CMD", "/usr/local/sbin/healthcheck"]
      interval: 5m
      timeout: 10s
      retries: 3
      start_period: 5m
```

注意：数据卷的挂载，需要在宿主机提前创建好对应的目录。

手动创建以下目录：
```
/app/volumes/gitlab/gitlab/
/app/volumes/gitlab/postgresql/
/app/volumes/gitlab/redis/
```

修改对应数据卷配置：
```yaml
redis:
    restart: always
    image: redis:5.0.9
    command:
    - --loglevel warning
    volumes:
    - /app/volumes/gitlab/redis:/var/lib/redis:Z
```
```yaml
postgresql:
    restart: always
    image: sameersbn/postgresql:11-20200524
    volumes:
    - /app/volumes/gitlab/postgresql:/var/lib/postgresql:Z
```
```yaml
gitlab:
    restart: always
    image: sameersbn/gitlab:13.0.6
    depends_on:
    - redis
    - postgresql
    ports:
    - "10080:80"
    - "10022:22"
    volumes:
    - /app/volumes/gitlab/gitlab:/home/git/data:Z
```

### gitlab-runner

拉下来的 `docker-compose.yml` 文件默认是没有 `gitlab-runner` 的，我们需要将 `gitlab-runner` 写到 `docker-compose.yml` 配置上来。

也要先创建数据卷挂载文件目录：
```
/app/volumes/gitlab-runner/config/
```

```yaml
gitlab-runner: 
    restart: always
    image: gitlab/gitlab-runner
    depends_on:
    - gitlab
    volumes:
    - /app/volumes/gitlab-runner/config:/etc/gitlab-runner:Z
    - /var/run/docker.sock:/var/run/docker.sock
    environment:
    - TZ=Asia/Shanghai
```

## 快速构建应用

将配置好的 `docker-compose.yml` 文件放到 `/app/docker/gitlab/` 下，执行以下命令：

```bash
$ cd /app/docker/gitlab/
$ docker-compose up
```

`docker-compose` 会自动管理 `docker` 容器集群，包括对镜像进行拉取、创建以及启动。

稍等片刻，我们即可通过 `http://192.168.2.192:10080/` 打开 `gitlab` 页面，第一次打开是直接设置 `root` 账号的密码，设置密码后即可登录进入 `gitlab` 内页。

英文不好的同学可以进入个人设置那里设置 `language` 为简体中文。

![设置语言](/docker/docker_deploy_github/01.png)

### 注册runner

什么是 `runner`，`runner` 就是 `gitlab` 进行可持续集成与可持续交付过程所跑的环境容器服务。

为了进行 `ci/cd` => 可持续集成/可持续部署，我们需要注册 `runner`，一般我们注册的是共享 `runner`，也就是任何仓库的 `ci/cd` 都可以在上面跑。当然，我们也可以创建多个 `runner` 服务，为特定仓库指定 `runner`。

下面以注册共享 `runner` 为例：

![runner列表](/docker/docker_deploy_github/02.png)

比如
1. 进入 `runner` 容器
```bash
$ docker exec -it 容器ID bash
```
2. 注册 `runner`
```bash
$ gitlab-runner register
```
3. 输入 `gitlab` 示例的 `url`
```bash
 $ Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com ):
 http://192.168.2.192:10080/
```
4. 输入用来注册 `runner` 的 `token`
```bash
$ Please enter the gitlab-ci token for this runner:
yrErncrc8XY_e5-g7bU8
```
5. 输入 `runner` 的描述，随后可在 `gitlab` 界面中修改
```bash
$ Please enter the gitlab-ci description for this runner:
gitlab-ci
```
6. 输入与 `runner` 绑定的标签（可修改）
```bash
$ Please enter the gitlab-ci tags for this runner (comma separated):
gitlab-ci
```
7. 选择 `runner` 的执行方式（推荐`docker`）
```
 $ Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:
 docker

```
8. 如果选择的执行方式是 `docker`，会要求填写默认的镜像
```bash
$ Please enter the Docker image (eg. ruby:2.1):
alpine:latest
```

注册成功后会在 `runner` 容器 `~/etc/gitlab-runner/` 目录下生成 `config.toml` 配置文件，这时候就可以在 `gitlab` 的管理页面中看到激活的 `runner`

![激活的runner](/docker/docker_deploy_github/03.png)

然后，对 `runner` 进行修改，勾选 `runner 可以选择无标签的项目`（默认是同样标签的项目才能使用对应标签的 `runner`）。这样，`runner` 就可以变为共享 `runner` 了。

当我们需要专门为某个项目跑的 `runner` 时，那就不需要勾选 `runner` 可选择无标签选项，在下面配置添加 `runner` 服务的项目保存即可。

![配置runner共享](/docker/docker_deploy_github/04.png)

## 可持续集成/部署

可持续集成与部署需要配置 `.gitlab-ci.yml` 文件，`gitlab` 会检查每个仓库根目录是否存在 `.gitlab-ci.yml` 文件，有的话 `runner` 则自动跑起来。

> runner 会根据 .gitlab-ci.yml 文件配置，在宿主机创建容器，根据配置步骤一步步进行构建任务，构建成功或失败都会自动销毁容器。

`gitlab` 默认开启 `auto devops` 功能，如果没有 `.gitlab-ci.yml` 文件，则会自动运行 `auto devops`，如果没有配置 `Auto DevOps` 功能与 `Kubernetes` 集成的话，建议关闭默认的 `auto devops` 功能。

![关闭默认](/docker/docker_deploy_github/05.png)

### .gitlab-ci.yml

这是一个自动编译前端代码并发布到 `gitlab page` 的配置文件：

```yaml
building: 
  image: node:alpine    # 指定运行环境
  stage: build          # 当前stage阶段为build
  script:               # build阶段运行的脚本
    - yarn --registry=https://registry.npm.taobao.org
    - yarn docs:build
  artifacts:            # 工件，可以缓存在gitlab的流水线记录中，供直接下载
    expire_in: 3 days   # 工件缓存的有效时间
    paths:              # 路径
      - docs/.vuepress/dist/            # 工件指向的目录，这里指整个dist目录

cache:                  # 缓存
  paths:                # 路径
    - node_modules/     # 缓存node_mudules将大大提高ci运行的速度

deploying: 
  stage: deploy         # 当前阶段为deploy
  script:               # deploy阶段运行的命令
    - rm -rf public/*   # linux命令，递归无询问删除public目录下所有文件- mv dist/* public //将dist目录下的所有文件都移动到public目录下
  artifacts:            # 工件缓存
    expire_in: 3 days   # 时效为3天
    paths:              # 路径
      - public          # 缓存整个public目录的文件
  only: 
    - master               # ceate pages下的所有操作只在 master 分支上进行

```

### 自动化

当我们提交我们的代码后，`gitlab` 会自动根据 `.gitlab-ci.yml` 的配置运行 `runner`。

![提交代码](/docker/docker_deploy_github/06.png)

![运行通过](/docker/docker_deploy_github/07.png)

这样我们就实现自动化集成与部署了，大大的提高了我们的开发效率。

## 身份认证

我们在 `gitlab` 上注册了自己的账号后，为了方便身份认证，一般需要用 `ssh` 生成身份认证密匙，这样就不需要每次访问都要输入账号密码。

### 配置SHH密匙

在我们的电脑 `git bash` 输入：
```bash
$ ssh-keygen -t rsa -C "我们在gitlab注册的邮箱" -f ~/.ssh/gitlab_id_rsa
```
此时会在我们电脑用户根目录的 `/.ssh` 下生成私匙跟公匙：
```
gitlab_id_rsa
gitlab_id_rsa.pub
```

打开 `pub` 后缀的公匙，复制粘贴到 `gitlab` 用户设置，保存即可。

![身份认证](/docker/docker_deploy_github/08.png)

在对 `gitlab` 仓库使用 `git` 命令的时候，如果出现提示没有权限的话，多半是因为 `git` 混淆了 `github` 与 `gitlab` 的 `ssh` 密钥，解决方法看下一步。

### github与gitlab共存

假设我们之前就已经生成了 `github` 的 `ssh` 密匙:
```
github_id_rsa
github_id_rsa.pub
```

在我们电脑的用户目录 `/.ssh/` 下创建 `config` 文件，配置如下，保存即可:

```shell
#github
Host github.com
HostName github.com
IdentityFile C:/Users/jwchan/.ssh/github_id_rsa

#gitlab
Host 192.168.2.192
HostName 192.168.2.192
IdentityFile C:/Users/jwchan/.ssh/gitlab_id_rsa
```

这样，我们在提交代码的时候，会自动区分目标服务器从而使用对应的 `ssh` 密匙。

### git基本操作

1. 拉取仓库
```bash
$ git clone ssh://git@192.168.2.192:10022/jwchan/blog.git
```
2. 进入仓库贡献代码
```bash
$ cd /blog/
```
3. 查看仓库代码修改状态
```bash
$ git status
```
4. 添加代码缓冲区
```bash
$ git add .
```
5. 提交代码并注释
```bash
$ git commit -m "[fix]: bug"
```
6. 推送代码到远程仓库
```bash
$ git push 
```