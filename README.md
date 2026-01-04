# Jekyll 个人博客

一个简洁优雅的 Jekyll 个人博客主题，参考苹果和少数派的设计风格，专注于提供优秀的中文阅读体验。

## 特性

- 🎨 **现代设计** - 参考苹果和少数派的设计风格，简洁优雅
- 📱 **响应式布局** - 完美适配桌面、平板和移动设备
- 🇨🇳 **中文优化** - 针对中文阅读体验进行优化
- ⚡ **性能优先** - 静态生成，快速加载
- 🔍 **SEO 友好** - 内置 SEO 优化
- 📝 **Markdown 支持** - 使用 Markdown 编写文章
- 🎯 **易于定制** - 清晰的代码结构，易于修改和扩展

## 快速开始

### 本地开发

1. 安装 Ruby 和 Bundler

```bash
# macOS (使用 Homebrew)
brew install ruby

# 或使用 rbenv/rvm
```

2. 安装依赖

```bash
bundle install
```

3. 启动本地服务器

```bash
bundle exec jekyll serve
```

访问 `http://localhost:4000` 查看网站。

### 部署到 GitHub Pages

1. Fork 或克隆此仓库

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. 修改 `_config.yml` 中的配置

```yaml
title: "你的博客标题"
description: "你的博客描述"
author: "你的名字"
url: "https://yourusername.github.io"
baseurl: ""
```

3. 推送到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

4. 在 GitHub 仓库设置中启用 GitHub Pages
   - 进入 Settings > Pages
   - 选择 Source 为 main 分支
   - 保存后等待几分钟，访问 `https://yourusername.github.io`

## 项目结构

```
.
├── _config.yml          # Jekyll 配置文件
├── _includes/           # 可重用组件
│   ├── header.html      # 头部导航
│   └── footer.html      # 页脚
├── _layouts/            # 布局模板
│   ├── default.html     # 默认布局
│   └── post.html        # 文章布局
├── _posts/              # 博客文章
│   └── *.md
├── assets/              # 静态资源
│   ├── css/
│   │   └── style.css    # 样式文件
│   └── js/
│       └── main.js      # JavaScript 文件
├── about.md             # 关于页面
├── archive.html         # 归档页面
├── posts.html           # 所有文章页面
├── index.html           # 首页
├── Gemfile              # Ruby 依赖
└── README.md            # 说明文档
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
date: 2024-01-15 10:00:00 +0800
categories: [分类]
tags: [标签1, 标签2]
author: 作者名（可选）
---
```

## 自定义配置

### 修改导航菜单

编辑 `_config.yml` 中的 `navigation` 部分：

```yaml
navigation:
  - title: 首页
    url: /
  - title: 文章
    url: /posts/
  - title: 关于
    url: /about/
```

### 修改社交媒体链接

编辑 `_config.yml` 中的 `social` 部分：

```yaml
social:
  github: yourusername
  twitter: yourusername
  email: your.email@example.com
```

### 自定义样式

编辑 `assets/css/style.css` 文件，修改 CSS 变量：

```css
:root {
    --color-primary: #007AFF;
    --color-text: #1d1d1f;
    /* ... 其他变量 */
}
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

- [Jekyll](https://jekyllrb.com/) - 静态网站生成器
- [GitHub Pages](https://pages.github.com/) - 免费托管服务
- 设计灵感来自苹果和少数派网站

