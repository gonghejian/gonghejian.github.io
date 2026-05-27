# 🔧 预览问题修复指南

## 问题诊断

### 错误信息
```
bundle : 无法将"bundle"识别为 cmdlet、函数、脚本文件或可运行程序
```

### 原因
Ruby 和 Bundler 未安装或未在系统 PATH 中。

## 解决方案

### 方案 1: 安装 Ruby 和 Bundler（推荐）

#### Windows 安装步骤

1. **下载 RubyInstaller**
   - 访问：https://rubyinstaller.org/downloads/
   - 下载 **Ruby+Devkit 3.1.x (x64)** 版本
   - 运行安装程序，勾选 "Add Ruby executables to your PATH"

2. **安装完成后，重新打开 Cursor 终端**

3. **验证安装**
   ```powershell
   ruby -v
   gem -v
   ```

4. **安装 Bundler**
   ```powershell
   gem install bundler
   ```

5. **安装项目依赖**
   ```powershell
   bundle install
   ```

6. **启动预览**
   ```powershell
   bundle exec jekyll serve
   ```

---

### 方案 2: 使用静态预览文件（临时方案）

如果暂时无法安装 Ruby，可以使用已生成的预览文件：

1. **打开预览文件**
   - `preview.html` - 首页预览
   - `preview-categories.html` - 分类页面预览
   - `preview-reading.html` - 阅读分类预览

2. **直接在浏览器中打开这些文件**

---

### 方案 3: 使用 GitHub Pages 在线预览

1. **推送代码到 GitHub**
   ```powershell
   git add .
   git commit -m "更新内容"
   git push origin main
   ```

2. **等待 GitHub Actions 自动部署**（约 2-5 分钟）

3. **访问网站**
   - https://gonghejian.cn
   - 或 https://gonghejian.github.io

---

## 快速检查清单

- [ ] Ruby 已安装 (`ruby -v`)
- [ ] Bundler 已安装 (`bundle -v`)
- [ ] 项目依赖已安装 (`bundle install`)
- [ ] 端口 4000 未被占用
- [ ] `_config.yml` 配置正确

---

## 常见问题

### 问题 1: Ruby 安装后仍找不到命令

**解决**：
1. 重新打开 Cursor 终端
2. 检查 PATH 环境变量
3. 手动添加到 PATH（如果安装时未勾选）

### 问题 2: bundle install 失败

**解决**：
```powershell
# 更新 RubyGems
gem update --system

# 清理并重新安装
bundle clean --force
bundle install
```

### 问题 3: Jekyll 构建错误

**解决**：
```powershell
# 查看详细错误
bundle exec jekyll build --trace

# 检查配置文件
# 确保 _config.yml 语法正确
```

---

## 推荐工作流程

1. **开发时**：使用本地 Jekyll 服务器预览
2. **测试时**：推送到 GitHub 在线预览
3. **发布时**：GitHub Actions 自动部署

---

## 下一步

选择最适合你的方案：
- **方案 1**：完整安装，支持实时预览（推荐）
- **方案 2**：临时预览，无需安装
- **方案 3**：在线预览，需要推送代码


