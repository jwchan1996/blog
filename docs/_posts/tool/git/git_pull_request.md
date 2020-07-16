---
title: 使用 git 向开源项目提交 pr
date: 2019-01-20
categories: "git" #分类
tags:  #标签
    - git
---

# 使用 git 向开源项目提交 pr
## Pull Request 是什么
⛏️ `Pull Request` 是一种通知机制  
你修改了他人的代码，将你的修改通知原来的作者，希望他合并你的修改，这就是 `Pull Request`  

⛏️ `Pull Request` 本质上是一种软件的合作方式，是将涉及不同功能的代码，纳入主干的一种流程。这个过程中，还可以进行讨论、审核和修改代码  

⛏️ 简单的说是在自己本地仓库修改代码，提交到自己远程仓库，提交 `PR` 后被接受后，再会被合并到 `master`
## 具体流程
### fork
将项目 `fork` 到自己的仓库中，以 `vue-clicli` 为例

![](~public/git/git_pull_request/fork.png)

进入到 `vue-clicli` 的 `Github` 项目中，点击右上角的 `fork`，稍等片刻，此项目便会出现在自己的仓库中

进到自己 `fork` 的项目中，就能看到 `Clone or download` 按钮，复制一下 `SSH` 链接或者 `HTTPS` 链接

通过上面的步骤，已经将远程仓库建好了
### clone
将刚才 `fork` 过来的项目 `clone` 到本地，用的是你刚才复制的 `SSH` 链接或者 `HTTPS` 链接
```bash
$ git clone https://github.com/acgzone/vue-clicli.git
```
进到 `vue-clicli` 目录中，试试跑一下 `git status`，会提示现在是 `master` 分支

用 `git remote -v` 命令，可以看到此时只与自己的远程仓库建立了连接

![](~public/git/git_pull_request/git_remote_-v_1.png)

还需要与上游建立连接，这里上游指的是一开始 `fork` 的那个项目源，以 `vue-clicli` 为例，执行如下命令：
```bash
$ git remote add upstream https://github.com/acgzone/vue-clicli.git
```
再用 `git remote -v` 可以看到

![](~public/git/git_pull_request/git_remote_-v_2.png)

接下来就能创建分支了
### 创建分支
当然，一般需要提交新功能的时候才需要创建新分支，如果是修复 `bug` 的话，就不需要切换分支，可以直接在主分支 `master` 里完成修改，下面创建分支的步骤就可以省略。  
继续运行命令：( 看情况是否创建新分支 )
```bash
$ git checkout -b dev
```
这个命令的意思是创建一个叫 `dev` 的分支，运行这个命令后 `bash` 将自动切换到新的分支下
### 修改代码
自行修改代码，完成开发等等
### 提交
可以先使用 `git status` 来查看有哪些文件被修改了

![](~public/git/git_pull_request/git_status.png)

然后再 `git add .` 将要提交的文件都加上  

然后再 `git commit -m "modify XX"`，需要注意的是 `git commit` 只是把修改的代码提交到当前分支 ( 如果前面没有切换新分支的话，默认分支是 `master` ) ，`"modify XX"` 是本次提交的简单说明  

然后再 `git push origin master`，这一步才是将当前分支推送到自己的远程仓库  

这时，在自己的远程仓库便能看刚才 `push` 上去的分支了
## 提交 PR
找到 `New pull request`，需要注意的是 `compare` 处选择刚才提交上来的分支 ( 当前示例的是代码提交在主分支 `master` 的情况 )

![](~public/git/git_pull_request/compare.png)

然后点 `Create pull request`  

写好名字，写好说明，提交

🎨 `PR` 创建后，就等着管理者是否接受该 `PR` 了
## 关于 check 不通过的问题
`github` 有代码自己编译和 `check` 机制，在你提交 `pr` 的时候，项目可能已经有了比较大的变更 ( 每天都有世界各地的 `coder` 提 `pr` )，而你没有将分支保持与项目同步，所以有可能会导致 `check` 失败，`pr` 被无视  

还记得我们在自己本地有一个 `master` 分支，然后又拉了一个 `dev` 分支，然后在 `dev`上进行修改，提交的也是 `dev`，然后又想起了之前有一步是"与上游建立连接"，说到你可能已经知道了 `master` 的作用 —— 用于远程代码同步  

所以每次提交 `pr` 前，都要先从做代码同步。过程如下：  

先 `git fetch upstream`

![](~public/git/git_pull_request/git_fetch_upstream.png)

再 `git rebase upstream/master`

![](~public/git/git_pull_request/git_rebase_upstream+master.png)

再 `git push origin master`  

![](~public/git/git_pull_request/git_push_origin_master.png)

`push` 完后，远程仓库便可看到你的 `branch` 版本和 `master` 分支一致了，否则会显示与 `master` 相差了多少次 `commit`  

![](~public/git/git_pull_request/branch_commit.png)![](~public/git/git_pull_request/branch_commit_even.png)

🍭 注：此处 `branch` 指的是你自己的远程仓库，`master` 指的是 `fork` 的项目的仓库  

🌥️ 做完这些操作，就可以回到之前的步骤来操作了