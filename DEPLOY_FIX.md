# 🚨 GitHub Pages 部署失败修复指南

## 快速检查清单

### 1. 检查 GitHub Pages 设置 ⚙️

**必须设置：**
1. 进入仓库 **Settings** → **Pages**
2. **Source** 必须选择 **"GitHub Actions"**（不是分支！）
3. 点击 **Save**

### 2. 检查 Actions 权限 🔐

1. 进入 **Settings** → **Actions** → **General**
2. 找到 **Workflow permissions**
3. 选择 **"Read and write permissions"**
4. 勾选 **"Allow GitHub Actions to create and approve pull requests"**
5. 点击 **Save**

### 3. 查看错误日志 📋

1. 进入仓库的 **Actions** 标签页
2. 点击最新的工作流运行（红色 ❌ 表示失败）
3. 展开失败的步骤查看具体错误信息

## 常见错误及解决方案

### 错误 1: Bundle install 失败

**错误信息：**
```
Could not find gem 'xxx' in locally installed gems
```

**解决方案：**
1. 检查 `Gemfile` 语法是否正确
2. 确认所有 gem 名称拼写正确
3. 尝试更新 gem 版本

**修复命令（本地测试）：**
```bash
bundle install
```

### 错误 2: Jekyll build 失败

**错误信息：**
```
Liquid Exception: ... in ...
```

**解决方案：**
1. 检查 `_config.yml` 语法是否正确
2. 检查所有 Markdown 文件的 Front Matter
3. 检查是否有未闭合的 HTML 标签

**修复命令（本地测试）：**
```bash
bundle exec jekyll build
```

### 错误 3: 插件兼容性问题

**错误信息：**
```
jekyll-compress-html: error
```

**解决方案：**
如果 `jekyll-compress-html` 插件导致问题，可以临时移除：

1. 编辑 `_config.yml`，注释掉插件：
```yaml
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  # - jekyll-compress-html  # 临时禁用
```

2. 编辑 `Gemfile`，注释掉 gem：
```ruby
# gem "jekyll-compress-html", "~> 3.0"
```

3. 提交并推送更改

### 错误 4: 权限不足

**错误信息：**
```
Permission denied
Resource not accessible by integration
```

**解决方案：**
1. 检查工作流的 `permissions` 部分是否正确
2. 确认仓库设置中的 Actions 权限
3. 确保仓库是公开的，或者你有足够的权限

### 错误 5: Ruby 版本不兼容

**错误信息：**
```
Your Ruby version is X, but your Gemfile specified Y
```

**解决方案：**
1. 检查 `.github/workflows/pages.yml` 中的 Ruby 版本
2. 确保 Ruby 版本与 Gemfile 兼容
3. 当前配置使用 Ruby 3.1

## 手动测试构建

在本地测试构建，确保没有错误：

```bash
# 1. 安装依赖
bundle install

# 2. 构建站点
bundle exec jekyll build

# 3. 检查构建输出
ls _site
```

如果本地构建成功，但 GitHub Actions 失败，可能是：
- 环境差异
- 缓存问题
- 权限问题

## 清理并重新部署

### 方法 1: 清除 Actions 缓存

1. 进入 **Settings** → **Actions** → **Caches**
2. 删除所有缓存
3. 重新运行工作流

### 方法 2: 手动触发部署

1. 进入 **Actions** 标签页
2. 选择 **"Deploy GitHub Pages"** 工作流
3. 点击 **"Run workflow"**
4. 选择分支：**main** 或 **master**
5. 点击 **"Run workflow"**

### 方法 3: 强制重新构建

```bash
# 创建一个空提交来触发重新构建
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

## 验证部署

部署成功后：

1. **等待 5-10 分钟**：GitHub Pages 使用 CDN，需要时间传播
2. **检查部署状态**：
   - 进入 **Settings** → **Pages**
   - 查看 **Recent deployments**
   - 确认最新部署时间
3. **清除浏览器缓存**：
   - Windows: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`
   - 或使用无痕模式访问

## 获取帮助

如果以上方法都无法解决问题：

1. **查看完整错误日志**：
   - Actions → 失败的运行 → 查看所有步骤的详细日志
2. **检查 GitHub 状态**：
   - 访问 https://www.githubstatus.com/
3. **参考官方文档**：
   - https://docs.github.com/en/pages
   - https://jekyllrb.com/docs/github-pages/

## 当前工作流配置

你的工作流文件 (`.github/workflows/pages.yml`) 已优化：

✅ 添加了明确的错误处理
✅ 指定了构建输出路径
✅ 添加了依赖安装步骤
✅ 使用了最新的 Actions 版本

如果仍有问题，请检查 Actions 日志中的具体错误信息。


