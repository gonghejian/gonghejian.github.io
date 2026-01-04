# Jekyll 个人博客

一个简洁优雅的 Jekyll 个人博客主题，参考苹果和少数派的设计风格，专注于提供优秀的中文阅读体验。

## 特性

- 🎨 **现代设计** - 参考苹果和少数派的设计风格，简洁优雅
- 📱 **响应式布局** - 完美适配桌面、平板和移动设备
- 🇨🇳 **中文优化** - 针对中文阅读体验进行优化
- ⚡ **性能优先** - 静态生成，快速加载
- 🔍 **SEO 友好** - 内置 SEO 优化，支持文章描述和元数据
- 📝 **Markdown 支持** - 使用 Markdown 编写文章
- 📚 **书单功能** - 精美的书单展示，类似比尔盖茨推荐书的图文效果
- 🏷️ **智能标签** - 标签可点击，支持数字标签，显示标签数量
- 📊 **分类管理** - 智能分类显示，按日期排序，平滑滚动导航
- 🎯 **易于定制** - 清晰的代码结构，易于修改和扩展
- ♿ **可访问性** - 完善的语义化标签和 ARIA 属性

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
   - **重要**：选择 Source 为 **"GitHub Actions"**（不是分支！）
   - 保存后等待几分钟，访问 `https://yourusername.github.io`

### GitHub Actions 自动部署

项目已配置 GitHub Actions 自动部署，每次推送到 `main` 或 `master` 分支时会自动构建和部署。

**工作流文件**：`.github/workflows/pages.yml`

**手动触发部署**：
1. 进入仓库的 **Actions** 标签页
2. 选择 **"Deploy GitHub Pages"** 工作流
3. 点击 **"Run workflow"**
4. 选择分支并运行

**常见问题**：如遇部署失败，请查看 `DEPLOY_ERROR_HISTORY.md` 和 `DEPLOY_FIX.md`

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
categories: [分类]  # 必须与 _config.yml 中 home_categories 的 slug 匹配
tags: [标签1, 标签2, 2026]  # 支持数字标签（如年份）
author: 作者名（可选）
description: "文章描述，用于 SEO"  # 推荐添加，提升 SEO
---
```

**重要提示**：
- `categories` 的值必须与 `_config.yml` 中 `home_categories` 的 `slug` 字段匹配
- `tags` 支持中文、英文和数字（如年份）
- 添加 `description` 可以提升 SEO 效果

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
- **工作流配置**：`.github/workflows/pages.yml` - GitHub Actions 部署配置

### 分类和标签使用

#### 分类配置

在 `_config.yml` 中配置分类：

```yaml
home_categories:
  - name: 阅读笔记
    slug: reading  # 这个值必须与文章中的 categories 匹配
    icon: 📚
    description: 读书笔记和读后感，分享阅读心得和思考
```

**文章中使用分类**：
```yaml
categories: [reading]  # 必须与 slug 匹配
```

#### 标签使用

- **支持类型**：中文、英文、数字（如年份 `2026`）
- **标签链接**：标签会自动生成链接，点击可查看相关文章
- **标签显示**：首页和分类页面最多显示 3 个标签，超过会显示 "+N"
- **数字标签**：系统已自动处理数字标签的类型转换

#### 文章排序

- **主页分类**：按日期倒序，最新文章在前
- **分类页面**：按日期倒序，最新文章在前
- **最新文章**：按日期倒序显示

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

### 修改分类配置

编辑 `_config.yml` 中的 `home_categories` 部分：

```yaml
home_categories:
  - name: 分类名称
    slug: category-slug  # 必须与文章中的 categories 字段匹配
    icon: 📚  # 表情符号图标
    description: 分类描述
```

**注意事项**：
- `slug` 必须与文章中的 `categories` 字段值匹配
- 分类顺序决定了在主页和分类页面的显示顺序
- 建议使用有意义的 slug（英文小写，使用连字符）

### 标签系统配置

标签系统已优化，支持：
- ✅ 中文、英文、数字标签（如年份 `2026`）
- ✅ 标签可点击，链接到标签页面
- ✅ 自动处理数字标签的类型转换
- ✅ 显示标签数量提示（超过3个显示 "+N"）

**使用示例**：
```yaml
tags: [阅读, 书单, 2026, 目标, 规划]
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

### 文章排序和显示

- **自动排序**：所有文章按日期倒序显示（最新在前）
- **分类筛选**：主页和分类页面自动筛选对应分类的文章
- **条件显示**：分类区块仅在存在文章时显示，"查看更多" 仅在文章数 > 5 时显示
- **锚点导航**：分类页面支持锚点定位和平滑滚动

## 📝 更新日志

### 2026-01-04 - 全面优化更新

#### ✨ 新功能
- ✅ 标签可点击，链接到标签页面
- ✅ 标签数量提示（超过3个显示 "+N"）
- ✅ 分类锚点定位和平滑滚动
- ✅ 文章自动按日期排序
- ✅ 空状态友好提示

#### 🔧 优化改进
- ✅ 主页类目：文章按日期倒序，标签可点击
- ✅ 分类页面：优化排序、标签显示、锚点定位
- ✅ 新文章：添加 SEO description 元数据
- ✅ 可访问性：添加 datetime、title、aria-label 属性
- ✅ 分类配置：优化描述和顺序

#### 🐛 问题修复
- ✅ 修复 jekyll-compress-html gem 不可用问题
- ✅ 添加缺失的 jekyll-paginate gem
- ✅ 修复数字标签无法使用 slugify 的问题
- ✅ 清理重复文件
- ✅ 优化 GitHub Actions 工作流配置

详细修复历史请查看：
- `DEPLOY_ERROR_HISTORY.md` - 部署错误修复历史
- `OPTIMIZATION_SUMMARY.md` - 优化总结
- `DEPLOY_FIX.md` - 故障排除指南

### 2026-01-01 - 书单功能

- ✅ 新增书单展示功能
- ✅ 支持书籍封面图片
- ✅ 简约科技风格设计

## 🔧 故障排除

### 部署问题

如果遇到 GitHub Pages 部署失败：

1. **查看错误日志**
   - 进入仓库的 **Actions** 标签页
   - 查看失败的运行记录
   - 参考 `DEPLOY_ERROR_HISTORY.md` 查找解决方案

2. **常见问题**
   - **jekyll-compress-html 错误**：已移除，无需处理
   - **jekyll-paginate 警告**：已添加，无需处理
   - **数字标签错误**：已修复，支持数字标签
   - **权限错误**：检查 GitHub Pages 设置，确保选择 "GitHub Actions"

3. **本地测试**
   ```bash
   bundle install
   bundle exec jekyll build
   ```

详细故障排除指南请查看 `DEPLOY_FIX.md`

## 📚 相关文档

- `DEPLOY_ERROR_HISTORY.md` - 部署错误修复历史
- `OPTIMIZATION_SUMMARY.md` - 优化总结
- `DEPLOY_FIX.md` - 故障排除指南
- `DEPLOY_CHECKLIST.md` - 部署检查清单
- `FINAL_DEPLOY_CHECK.md` - 最终部署检查

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

