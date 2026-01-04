# GitHub Actions 工作流说明

## pages-deploy.yml

这个工作流实现了自动构建和部署 Jekyll 站点到 GitHub Pages。

### 功能特性

- ✅ **自动触发**：每次推送到 `main` 或 `master` 分支时自动构建和部署
- ✅ **手动触发**：支持在 GitHub Actions 页面手动触发部署
- ✅ **并发控制**：确保同一时间只有一个部署任务运行
- ✅ **缓存优化**：自动缓存 Ruby 和 Bundler 依赖，加快构建速度
- ✅ **环境隔离**：使用 GitHub Pages 环境，支持环境变量和密钥管理

### 触发条件

1. **Push 事件**：推送到 `main` 或 `master` 分支
2. **手动触发**：在 Actions 页面点击 "Run workflow"
3. **Pull Request**：创建 PR 时会构建（但不部署）

### 工作流程

1. **检出代码**：从仓库获取最新代码
2. **设置 Ruby 环境**：安装指定版本的 Ruby 和 Bundler
3. **安装依赖**：运行 `bundle install` 安装 Gemfile 中的依赖
4. **配置 Pages**：设置 GitHub Pages 的基础路径
5. **构建站点**：运行 `jekyll build` 生成静态文件
6. **上传产物**：将构建好的 `_site` 目录上传
7. **部署**：自动部署到 GitHub Pages

### 使用步骤

#### 1. 启用 GitHub Pages

1. 进入仓库的 **Settings** → **Pages**
2. 在 **Source** 部分，选择 **GitHub Actions**

#### 2. 推送代码

```bash
git add .
git commit -m "添加 GitHub Actions 自动部署"
git push origin main
```

#### 3. 查看部署状态

- 进入仓库的 **Actions** 标签页
- 查看工作流运行状态
- 点击运行记录查看详细日志

### 自定义配置

#### 修改 Ruby 版本

在 `pages-deploy.yml` 中修改：

```yaml
ruby-version: '3.1'  # 改为你需要的版本
```

#### 修改触发分支

在 `pages-deploy.yml` 中修改：

```yaml
push:
  branches:
    - main
    - master
    - gh-pages  # 添加其他分支
```

#### 添加环境变量

在仓库的 **Settings** → **Secrets and variables** → **Actions** 中添加：

- `SITE_URL`: 自定义域名（如果有）
- 其他需要的环境变量

然后在工作流中使用：

```yaml
env:
  SITE_URL: ${{ secrets.SITE_URL }}
```

### 故障排除

#### 部署失败

1. **检查 Actions 日志**：查看具体的错误信息
2. **检查 Gemfile**：确保所有依赖都正确
3. **检查 _config.yml**：确保配置没有错误
4. **检查权限**：确保仓库有 Pages 权限

#### 构建缓慢

1. **启用缓存**：工作流已自动启用 Bundler 缓存
2. **减少插件**：移除不必要的 Jekyll 插件
3. **优化资源**：压缩图片和 CSS/JS 文件

#### 页面未更新

1. **清除浏览器缓存**：强制刷新（Ctrl+F5）
2. **检查部署状态**：确认部署已完成
3. **等待 CDN 更新**：GitHub Pages 使用 CDN，可能需要几分钟

### 性能优化建议

1. **使用 Jekyll 压缩插件**：减少 HTML 文件大小
2. **优化图片**：使用 WebP 格式，压缩图片大小
3. **合并资源**：减少 CSS/JS 文件数量
4. **启用 Gzip**：GitHub Pages 自动支持

### 相关文件

- `.github/workflows/pages-deploy.yml` - 工作流配置文件
- `Gemfile` - Ruby 依赖配置
- `_config.yml` - Jekyll 配置

### 更多信息

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Jekyll 文档](https://jekyllrb.com/docs/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)

