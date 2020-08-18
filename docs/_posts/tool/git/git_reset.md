---
title: Git 撤销操作
date: 2020-08-18
categories: "git" #分类
tags:  #标签
    - git
---

# Git 撤销操作

我们在使用 `git` 管理代码的时候，在步骤内经常会出现一些不符合规范或错误的提交，比如在 `git add`，`git commit`，`git push` 操作的时候，这时候就需要做撤销相关操作的处理，再进行合乎规范以及正确的代码提交。

## git 文件恢复

当我们对某个文件进行了代码修改之后，还没有进行 `git add` 操作，但是我们意识到不应该修改这个文件的时候，可以使用命令 `git checkout -- <file>` 使文件恢复到到上一次提交时的样子。

```bash
$ git checkout -- src/render/VueRender.js
```

## git add 撤销

当已经进行了 `git add` 操作，想要撤销 `git add` 操作。

`HEAD` 代表当前版本，`HEAD^` 代表前一个版本，`HEAD^^` 代表前两个版本，以此类推。

```bash
# 全部撤销
$ git reset HEAD
```

![git_reset_HEAD.png](~public/git/git_reset/git_reset_HEAD.png)

```bash
# 指定文件撤销 git reset HEAD <file>，文件名可通过 git status 获取。
$ git reset HEAD src/render/VueRender.js
```

## git commit 撤销

当已经进行了 `git add`，并且 `git commit`，但是还没有 `git push`。

```bash
# 回退到 git add 操作
$ git reset --soft HEAD^

# 如果进行了 2 次 commit，想都撤回，可以使用以下命令，以此类推
$ git reset --soft HEAD^^

# 或者使用 HEAD~1，HEAD~2 也可以，以此类推
$ git reset --soft HEAD~1
$ git reset --soft HEAD~2
```

![git_reset_--soft_HEAD^.png](~public/git/git_reset/git_reset_--soft_HEAD_.png)

```bash
# 不保留 `git add` 操作，则需要再进行 git add 回退，共两条命令
$ git reset --soft HEAD^
$ git reset HEAD
```

## git commit 信息修改

不进行代码变动，`git commit` 操作之后，`git push` 操作之前，只修改 `git commit` 提交的信息内容。

```bash
$ git commit --amend
```
输入命令后，会进入 `vim` 编辑，修改保存即可。

![git_commit_--amend.png](~public/git/git_reset/git_commit_--amend.png)

## git push 撤销

当我们进行了 `git add`，`git commit`，`git push` 等操作后，我们的本地的代码已经同步到远端了。

首先我们需要在本地回退版本：

```bash
# 回退上一个版本
$ git reset --hard HEAD^
```

或者查看 `commit` 的代码版本号，使用指定的版本号进行回退：

```bash
$ git log
```

![git_log.png](~public/git/git_reset/git_log.png)

回退到版本号为 `840d8a` 的版本：

```bash
$ git reser --hard 840d8a
```

![git_reset_--hard_sha1.png](~public/git/git_reset/git_reset_--hard_sha1.png)

如果不小心回退错了版本，没关系！  
只要命令窗口没关，向上滑查看版本号，依然可以回到任意版本号。

![git_reset_--hard_sha1_2.png](~public/git/git_reset/git_reset_--hard_sha1_2.png)

当我们回退到我们需要的版本后，剩下的就是同步远端的代码库：

```bash
$ git push -f
```

使用 `-f` 参数强制推送，即可覆盖远端版本库，使之与本地版本库一致。