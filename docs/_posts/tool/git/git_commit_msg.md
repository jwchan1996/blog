---
title: 版本库提交信息规范与自动验证
date: 2020-06-22
categories: "git" #分类
tags:  #标签
    - git
---

# 版本库提交信息规范与自动验证

## 版本库提交信息规范

本文规范借鉴社区使用最广的 `Angular` 规范，稍加修改。

一般提交命令我们使用如 `git commit- m "feat(user): add user login"`

其中当前 `commit message` 信息包括三部分：`type`（必需）、`scope`（可选）、 `subject`（必需）

### type

`type` 用于说明 `commit` 的类别，允许使用下面 `8` 个标识。

```bash
feat: # 新功能（feature）

fix: # 修补 bug

docs: # 文档（documentation）

style: # 格式（不影响代码执行的变动，非css样式专用）

refactor: # 重构（既不是新增功能，也不是修改 bug 的代码变动）

test: # 增加测试

chore: # 构建过程或辅助工具的变动

revert: # 对之前修改代码 commit 记录的还原
```

### scope

`scope` 用于说明 `commit` 的影响范围，比如数据层、控制层、视图层、功能模块等，视项目的不同而不同。

例如：

- 新增用户管理的新增用户功能
```bash
$ git commit -m "feat(user): add addUser"
```

- 修复了用户管理的新增用户功能的`bug`
```bash
$ git commit -m "fix(user): addUser"
```

- 更新文档说明
```bash
$ git commit -m "docs(readme): update readme"
```

- 调整新增用户代码格式（代码换行或者删除换行）
```bash
$ git commit -m "style(user/add): wrap line"
```

- 增加单元测试代码
```bash
$ git commit -m "test: add test"
```

- 配置或者修改自动化部署文件或者构建工具
```bash
$ git commit -m "chore: cicd"

$ git commit -m "chore: add vue-router"
```

还有一种是相对来说比较特殊的对之前 `commit` 代码的回退，比如还原之前修改 `bug` 的错误提交
```bash
$ git commit -m "revert: fix(user): addUser"
```

### subject

`subject` 是 `commit` 目的的简短描述，不超过 `50` 个字符

```bash
$ git commit -m "feat(course): 完成课程管理模块"
```

### issue_id and pr_id

`gitlab` 与 `github` 还提供了自动识别 `issue` 与 `pr` 链接的功能。  
在提交信息后面加上对应的 `issue_id` 或 `pr_id`，能够自动识别为对应链接，点击可跳转到对应界面。 

```bash
$ git commit -m "fix(user): check user pwd (#1)"
```

这样的话，会自动识别 `#1` 为链接，跳到对应的 `issue` 或者 `pr` 页面。

## 自动验证提交信息规范

为了达到提交信息规范的校验效果，我们使用配置本地 `git hooks` 模板的方法，只需设置一次，之后从`github` 上 `clone` 下来的代码都会沿用当前 `hooks` 配置。

下面命令操作环境为 `git bash`：

- `github` 克隆仓库到本地
```bash
$ git clone https://github.com/jwchan1996/commit-msg.git
$ cd /commit-msg
```

- 创建 `git` 钩子模板文件夹
```bash
$ mkdir -p ~/.git_template/hooks 
```

- 复制当前配置好的 `commit-msg` `hooks` 文件到模板 
```bash
$ cp commit-msg ~/.git_template/hooks
```

- 设置 `git` 的初始化模板的使用模板
```bash
$ git config --global init.templatedir ~/.git_template 
```

具体 `commit-msg` 文件可以点击[查看详情](https://github.com/jwchan1996/commit-msg.git)