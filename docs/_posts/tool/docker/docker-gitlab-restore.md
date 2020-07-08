---
title: docker gitlab 备份还原
date: 2020-07-01
categories: "docker" #分类
tags:  #标签
    - docker
    - gitlab
---

# docker gitlab 备份还原

## 灾难起源

起因是服务器 `root` 文件系统内存较小，只有 `50G`，经常爆仓。  
于是乎，就把 `gitlab` 整体移动到内存相对较大 `home` 文件系统下。  
这不，转移了，我人直接裂开来。  

### 噩耗！！！

我打开命令窗口，口嚼香糖，一顿蜻蜓点水，在键盘上滑过 `cp -R /app /home`，刹那间，整整几个 `G` 的文件便搬了家。当然，其中包含着这个星期来所备份的文件。  

然而，此时的我仍然在享受着香糖在口腔带来的愉悦，却不知下一秒，`gitlab` 的明天与意外哪个会先来。  

我对着 `gitlab` 满心许下祝福，轻轻地敲下：
```
$ cd /home/app/docker/gitlab
$ docker-compose up
```
而此刻，等待我的却是，无尽的无尽。

![gitaly cant up](/docker/docker_gitlab_restore/01.png)

有个 `gitaly` 服务启动失败！

### 失格！！！

啊，这……  

在重新尝试多次启动无果后，似乎走上了一条不归路。  
漆黑的命令窗口，如同深渊，凝视着你的凝视。

随着：
```bash
$ docker rm `docker ps -a | grep Exited | awk '{print $1}'`  
$ docker rmi -f `docker images | grep '<none>' | awk '{print $3}'`  
```
命令的执行，似乎变得清净起来。  
清除了停止的容器与无用的镜像。干净的环境，总会为 `gitlab` 带来好运吧。然而，到头来还是一场梦。  

依然启动不了 `gitaly` 服务，而带来的后果，就是仓库页面数据读取的失败。 

![gitlab 503](/docker/docker_gitlab_restore/02.png)

其他页面功能正常，仓库页面访问返回 `503`。

### 返璞！！！

既然是转移之后出现的错误，那我再转移回来会报错吗？  

随着我把命令喂给窗口后，`gitlab` 回到了原本属于它的家乡。正如同古诗句“乡音无改鬓毛衰”，此刻的 `gitlab` 与 它生长的 `/app` 环境却那么的格格不入。  

依然是启动不了 `gitaly`，那么，`gitaly` 启动失败跟仓库页面 `503` 有什么关系呢？

> Gitaly 是一个 Git RPC 
服务，用于处理 GitLab 进行的所有 git 调用。  
后台服务，专门负责访问磁盘以高效处理 git 操作，并缓存耗时操作。所有 git 操作都通过 Gitaly 处理。

即是 `gitaly` 是 `gitlab` 使用的处理读取 `git` 的桥梁服务，`gitaly` 开不起来，那么 `gitlab` 的 `git` 仓库数据的读取便是失了效。  

### 归真！！！

经过一番查找，定位问题为数据卷挂载目录下 `/app/volumes/gitlab/gitlab/repositoies/` 这个文件夹。  

执行 `ls`，列出目录下文件：
```bash
+gitaly @hashed  @pools
```
有三个文件，试着把 `+gitaly` 文件夹删掉，重新启动 `docker gitlab`，发现会重新生成 `+gitaly` 文件夹，此时的 `gitlab`，好像一个捉迷藏玩的很好的孩子，藏了很久终于被发现了一样。  

仓库页面已经可以打开了，除了代码仓库显示为空仓库，其他数据也可以读取了。

![空仓库](/docker/docker_gitlab_restore/03.png)

执行 `ls -a`，大家都摊牌，别藏着掖着了：
```bash
$ ls -a
+gitaly .gitaly-metadata  @hashed  @pools
```
发现有一个隐藏的文件 `.gitaly-metadata`，查看 `cat .gitaly-metadata`： 
```
{"gitaly_filesystem_id":"c19d98bb-9bf7-4579-b120-c6e33902c225"}
```

估计就是这个生成的配置文件系统 `ID` 指向失效了，导致找不到 `git` 仓库地址。  

尝试过去查找 `gitaly_filesystem_id` 的意义，发现源码是 `ruby` 函数生成，精力有限，遂无深究。  

## 人祸湮灭

### 时间旅行

没错，就是恢复备份。

执行：
```bash
$ cd /app/docker/gitlab
$ docker-compose run --rm gitlab app:rake gitlab:backup:restore
```

执行中，会让选择恢复的备份文件，输入备份 `tar` 包完整名称，回车即可。  
如：`1593450065_2020_06_29_13.0.6_gitlab_backup.tar`

但是，很不幸，出现权限问题。

![还原出现权限问题](/docker/docker_gitlab_restore/04.png)
![还原失败](/docker/docker_gitlab_restore/05.png)

### 精准夺权

遇到阻碍，那就夺权。  

目标是备份文件 `tar` 包下所有文件的用户组与所有者，都修改为 `root` 用户。

把备份文件 `tar` 包拖出来，解压到 `backup` 文件夹，修改权限到 `root` 用户组与 `root` 所有者。

![备份文件解压](/docker/docker_gitlab_restore/06.png)

修改 `backup` 文件夹里面所有文件为用户组 `root`
```bash
chgrp -R root backup
```

修改 `backup` 文件夹里面所有文件为所有者 `root`
```bash
chown -R root backup
```

然后将夺权后的文件再重新打包为 `tar` 包。

继续执行：
```bash
$ cd /app/docker/gitlab
$ docker-compose run --rm gitlab app:rake gitlab:backup:restore
```

![还原过程](/docker/docker_gitlab_restore/07.png)

虽然还有报权限错误，因为 `tar.gz` 包里面没有夺权，但是问题不大。

### 柳暗花明

回到 `docker-compose.yml` 目录，启动容器！
```bash
$ cd /app/docker/gitlab
$ docker-compose up
```

柳暗花明又一村，我胡汉三又回来了！

![启动成功](/docker/docker_gitlab_restore/08.png)