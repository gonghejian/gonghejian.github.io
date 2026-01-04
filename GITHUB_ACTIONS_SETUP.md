# GitHub Actions 自动部署设置指南

本指南将帮助你设置 GitHub Actions 工作流，实现每次 push 自动构建并部署到 GitHub Pages。

## 📋 前置要求

1. GitHub 仓库已创建
2. 仓库已启用 GitHub Pages
3. 项目使用 Jekyll（或其他静态网站生成器）

## 🚀 快速开始

### 步骤 1: 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 **Source** 部分，选择 **GitHub Actions**（而不是分支）
4. 保存设置

### 步骤 2: 添加工作流文件

工作流文件已创建在 `.github/workflows/deploy.yml`

如果文件不存在，创建以下路径和文件：
```
.github/workflows/deploy.yml
```

### 步骤 3: 推送代码

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "添加 GitHub Actions 自动部署"

# 推送到 GitHub
git push origin main
```

### 步骤 4: 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 你应该能看到工作流正在运行
3. 点击运行记录查看详细日志
4. 部署完成后，你的网站将在几分钟内更新

## 📁 工作流文件说明

### 文件位置
```
.github/workflows/deploy.yml
```

### 主要功能

- ✅ **自动触发**：每次推送到 `main` 或 `master` 分支时自动构建和部署
- ✅ **手动触发**：支持在 Actions 页面手动触发
- ✅ **并发控制**：确保同一时间只有一个部署任务
- ✅ **缓存优化**：自动缓存 Ruby 和 Bundler 依赖
- ✅ **环境隔离**：使用 GitHub Pages 环境

### 工作流程

```
推送代码 → 检出代码 → 设置 Ruby → 安装依赖 → 构建站点 → 上传产物 → 部署
```

## ⚙️ 自定义配置

### 修改 Ruby 版本

如果你的项目需要特定版本的 Ruby，修改 `deploy.yml`：

```yaml
ruby-version: '3.1'  # 改为你需要的版本，如 '3.2' 或 '3.0'
```

### 修改触发分支

如果你的默认分支不是 `main` 或 `master`，修改：

```yaml
push:
  branches:
    - main
    - master
    - your-branch-name  # 添加你的分支名
```

### 添加环境变量

如果需要使用环境变量：

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加你的密钥
4. 在工作流中使用：`${{ secrets.YOUR_SECRET_NAME }}`

### 自定义构建命令

如果需要自定义构建命令，修改构建步骤：

```yaml
- name: 🔨 构建站点
  run: |
    bundle exec jekyll build
    # 添加其他构建命令
```

## 🔍 故障排除

### 问题 1: 工作流没有触发

**解决方案：**
- 检查是否推送到正确的分支（main 或 master）
- 确认 `.github/workflows/deploy.yml` 文件存在
- 检查文件语法是否正确（YAML 格式）

### 问题 2: 构建失败

**常见原因：**
- Gemfile 中的依赖版本不兼容
- `_config.yml` 配置错误
- Ruby 版本不匹配

**解决方案：**
1. 查看 Actions 日志中的错误信息
2. 在本地运行 `bundle install` 和 `jekyll build` 测试
3. 检查 Gemfile 和 _config.yml 的语法

### 问题 3: 部署成功但页面未更新

**解决方案：**
- 清除浏览器缓存（Ctrl+F5 或 Cmd+Shift+R）
- 等待几分钟，GitHub Pages 使用 CDN，需要时间传播
- 检查部署是否真的成功（查看 Actions 日志）

### 问题 4: 权限错误

**解决方案：**
- 确认仓库设置中已启用 GitHub Pages
- 检查工作流的 permissions 配置
- 确认仓库有 Pages 写入权限

## 📊 性能优化

### 1. 启用缓存

工作流已自动启用 Bundler 缓存，无需额外配置。

### 2. 减少构建时间

- 使用 Jekyll 压缩插件减少文件大小
- 优化图片和资源文件
- 减少不必要的 Jekyll 插件

### 3. 并行构建

如果需要构建多个版本，可以创建多个 job：

```yaml
jobs:
  build-en:
    # 构建英文版本
  build-zh:
    # 构建中文版本
```

## 📝 工作流文件模板

完整的工作流文件已保存在 `.github/workflows/deploy.yml`，包含：

- 详细的步骤说明（中文注释）
- 错误处理
- 并发控制
- 缓存优化

## 🔗 相关资源

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Jekyll 官方文档](https://jekyllrb.com/docs/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Ruby Setup Action](https://github.com/ruby/setup-ruby)

## 💡 提示

1. **首次部署**：第一次使用 GitHub Actions 可能需要授权 Pages 权限
2. **部署时间**：通常需要 2-5 分钟完成部署
3. **更新频率**：每次 push 都会触发新的部署
4. **手动触发**：可以在 Actions 页面手动触发部署，无需 push

## ✅ 验证部署

部署成功后，你可以：

1. 在仓库的 **Settings** → **Pages** 查看部署状态
2. 访问你的 GitHub Pages URL 查看网站
3. 在 **Actions** 标签页查看部署历史

---

**需要帮助？** 查看工作流日志或参考 GitHub Actions 文档。

