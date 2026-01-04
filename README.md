# Jekyll 个人博客

一个简洁优雅的 Jekyll 个人博客主题，参考苹果和少数派的设计风格，专注于提供优秀的中文阅读体验。

## 特性

- 🎨 **现代设计** - 参考苹果和少数派的设计风格，简洁优雅
- 📱 **响应式布局** - 完美适配桌面、平板和移动设备
- 🇨🇳 **中文优化** - 针对中文阅读体验进行优化
- ⚡ **性能优先** - 静态生成，快速加载
- 🔍 **SEO 友好** - 内置 SEO 优化
- 📝 **Markdown 支持** - 使用 Markdown 编写文章
- 📚 **书单功能** - 精美的书单展示，类似比尔盖茨推荐书的图文效果
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
│   ├── js/
│   │   └── main.js      # JavaScript 文件
│   └── images/
│       └── books/       # 书籍封面图片目录
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

## 📚 书单功能

博客支持创建精美的书单文章，类似比尔盖茨推荐书的图文展示效果。书单采用简约科技风格设计，与主站风格完美融合。

### 创建书单文章

1. **创建文章文件**

在 `_posts` 目录下创建新的 Markdown 文件，例如：

```
_posts/2026-01-01-2026-reading.md
```

2. **设置文章 Front Matter**

```yaml
---
layout: post
title: "2026的阅读"
date: 2026-01-01 10:00:00 +0800
categories: [reading]  # 使用 reading 分类
tags: [阅读, 书单, 2026]
author: 你的名字
---
```

3. **添加书单内容**

在文章中使用以下 HTML 结构创建书单：

```html
<div class="book-list">
    <div class="book-item">
        <div class="book-cover">
            <img src="{{ '/assets/images/books/book1.jpg' | relative_url }}" 
                 alt="《书名》封面" 
                 onerror="this.src='https://via.placeholder.com/200x300/007AFF/FFFFFF?text=书名'">
        </div>
        <div class="book-info">
            <h3 class="book-title">《书名》</h3>
            <p class="book-author">作者：作者名</p>
            <p class="book-description">书籍简介和推荐理由...</p>
            <div class="book-meta">
                <span class="book-category">分类·标签</span>
                <span class="book-rating">⭐⭐⭐⭐⭐</span>
            </div>
        </div>
    </div>
    
    <!-- 添加更多书籍，复制上面的 book-item 结构 -->
</div>
```

### 上传书籍封面

1. **准备封面图片**
   - 将书籍封面图片保存到 `assets/images/books/` 目录
   - 命名格式：`book1.jpg`, `book2.jpg`, `book3.jpg` 等
   - 建议尺寸：200x300px 或更高分辨率（保持 2:3 的宽高比）
   - 支持格式：JPG、PNG、WebP
   - 建议大小：每张图片不超过 500KB

2. **获取封面图片**
   - [豆瓣读书](https://book.douban.com/)
   - [Amazon](https://www.amazon.com/)
   - [Google Books](https://books.google.com/)
   - 注意确保图片版权合规

3. **图片路径设置**
   - 在文章中使用 `{{ '/assets/images/books/book1.jpg' | relative_url }}` 引用图片
   - 如果图片不存在，会自动显示占位符

### 书单样式特点

- **简约设计**：清晰的布局，充足的留白
- **科技感**：使用主题蓝色（#007AFF），现代阴影效果
- **交互效果**：鼠标悬停时卡片上浮，边框高亮
- **响应式**：移动端自动调整为垂直布局，完美适配各种设备

### 完整示例

参考 `_posts/2026-01-01-2026-reading.md` 文件查看完整的书单文章示例。

### 自定义书单样式

如需自定义书单样式，编辑 `assets/css/style.css` 文件中的 `.book-list` 相关样式：

```css
/* 书单容器 */
.book-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
}

/* 单个书籍项 */
.book-item {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    /* ... 更多样式 */
}
```

### 注意事项

- 确保图片路径正确，使用 Jekyll 的 `relative_url` 过滤器
- 图片加载失败时会自动显示占位符
- 建议每篇文章的书单不超过 10 本书，以保持良好的阅读体验
- 书籍描述建议控制在 100-200 字之间

## 📖 快速参考

### 常用操作

| 操作 | 说明 | 文件位置 |
|------|------|----------|
| 创建普通文章 | 在 `_posts` 目录创建 `.md` 文件 | `_posts/YYYY-MM-DD-title.md` |
| 创建书单文章 | 使用书单 HTML 结构 | `_posts/YYYY-MM-DD-title.md` |
| 上传书籍封面 | 将图片放到书籍目录 | `assets/images/books/` |
| 修改导航菜单 | 编辑配置文件 | `_config.yml` → `navigation` |
| 自定义样式 | 修改 CSS 变量 | `assets/css/style.css` → `:root` |
| 修改分类配置 | 编辑主页分类 | `_config.yml` → `home_categories` |

### 文件路径说明

- **文章目录**：`_posts/` - 所有博客文章
- **书籍封面**：`assets/images/books/` - 书单封面图片
- **样式文件**：`assets/css/style.css` - 所有样式定义
- **布局模板**：`_layouts/` - 页面布局模板
- **配置文件**：`_config.yml` - Jekyll 配置

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

