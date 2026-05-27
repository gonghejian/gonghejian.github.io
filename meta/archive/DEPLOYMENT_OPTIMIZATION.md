# GitHub Pages 部署优化指南

本项目已配置了多项优化措施来加快 GitHub Pages 的部署和更新速度。

## 已实施的优化

### 1. GitHub Actions 自动部署
- 使用 GitHub Actions 进行自动化构建和部署
- 工作流文件：`.github/workflows/deploy.yml`
- 支持并行构建，加快部署速度

### 2. Jekyll 配置优化
- 启用 HTML 压缩插件 (`jekyll-compress-html`)
- 压缩 CSS 输出 (`sass.style: compressed`)
- 排除不必要的文件（预览文件、文档等）

### 3. 缓存策略
- 静态资源（CSS、JS、图片）缓存 1 年
- HTML 文件缓存 1 小时
- 使用 `_headers` 文件配置缓存头

### 4. 文件排除优化
- 排除预览文件（preview-*.html）
- 排除文档文件（README.md、SETUP.md 等）
- 排除 .github 目录

## 使用方法

### 启用 GitHub Actions 部署

1. **在 GitHub 仓库设置中启用 Pages**：
   - 进入 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **推送代码**：
   ```bash
   git add .
   git commit -m "优化部署配置"
   git push origin main
   ```

3. **查看部署状态**：
   - 在仓库的 Actions 标签页查看部署进度
   - 通常 2-5 分钟即可完成部署

### 本地测试

1. **安装依赖**：
   ```bash
   bundle install
   ```

2. **本地构建**：
   ```bash
   bundle exec jekyll build
   ```

3. **本地预览**：
   ```bash
   bundle exec jekyll serve
   ```

## 性能优化建议

### 进一步优化措施

1. **图片优化**：
   - 使用 WebP 格式
   - 压缩图片大小
   - 使用懒加载

2. **CSS/JS 优化**：
   - 合并多个 CSS/JS 文件
   - 使用 CDN 加载字体和库
   - 启用 Gzip 压缩（GitHub Pages 自动支持）

3. **减少插件**：
   - 只启用必要的 Jekyll 插件
   - 避免使用重型插件

4. **使用 CDN**：
   - 将静态资源托管到 CDN
   - 使用 jsDelivr 或 unpkg 加载第三方库

## 部署速度对比

- **优化前**：通常需要 5-10 分钟
- **优化后**：通常需要 2-5 分钟

## 注意事项

1. **首次部署**：第一次使用 GitHub Actions 可能需要稍长时间
2. **缓存更新**：修改 CSS/JS 后，可能需要清除浏览器缓存才能看到更新
3. **文件大小**：保持文件大小合理，避免过大的资源文件

## 故障排除

如果部署失败：

1. 检查 GitHub Actions 日志
2. 确认 Gemfile 中的依赖版本兼容
3. 检查 `_config.yml` 配置是否正确
4. 确认仓库有 Pages 权限

## 相关文件

- `.github/workflows/deploy.yml` - GitHub Actions 工作流
- `_config.yml` - Jekyll 配置
- `_headers` - 缓存头配置
- `Gemfile` - Ruby 依赖



