---
layout: post
title: "Jekyll 入门指南"
date: 2024-01-20 14:30:00 +0800
categories: [efficiency]
tags: [Jekyll, 教程, 静态网站]
author: Your Name
---

Jekyll 是一个简单、可扩展的静态网站生成器，非常适合创建博客和个人网站。本文将介绍如何开始使用 Jekyll。

## 什么是 Jekyll？

Jekyll 是一个将纯文本转换为静态网站和博客的工具。它使用 Markdown 和 Liquid 模板引擎，让你专注于内容创作，而不需要担心数据库或服务器配置。

## 安装 Jekyll

### 前置要求

- Ruby（建议使用 2.5 或更高版本）
- RubyGems
- GCC 和 Make

### 安装步骤

1. 安装 Jekyll 和 Bundler：

```bash
gem install jekyll bundler
```

2. 创建新站点：

```bash
jekyll new my-blog
cd my-blog
```

3. 构建站点并启动服务器：

```bash
bundle exec jekyll serve
```

访问 `http://localhost:4000` 即可查看你的网站。

## 目录结构

一个典型的 Jekyll 站点包含以下目录：

```
.
├── _config.yml      # 配置文件
├── _posts/          # 博客文章
├── _layouts/        # 布局模板
├── _includes/       # 可重用组件
├── assets/          # CSS、JS、图片等资源
└── index.html       # 首页
```

## 编写文章

在 `_posts` 目录下创建 Markdown 文件，文件名格式为：

```
YYYY-MM-DD-title.md
```

文章开头需要包含 Front Matter：

```yaml
---
layout: post
title: "文章标题"
date: 2024-01-20 14:30:00 +0800
categories: [分类]
tags: [标签]
---
```

## 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源
4. 访问 `https://username.github.io/repository-name`

## 总结

Jekyll 是一个强大而简单的工具，适合创建静态网站和博客。通过本文的介绍，你应该已经了解了如何开始使用 Jekyll。

如果你有任何问题，欢迎在评论区留言讨论！

