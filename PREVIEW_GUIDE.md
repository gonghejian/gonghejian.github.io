# 预览指南

## 问题诊断

当前系统未检测到 Ruby 环境，无法运行 Jekyll 预览服务器。

## 解决方案

### 方案 1：安装 Ruby 环境（推荐）

#### Windows 安装步骤：

1. **下载 RubyInstaller**
   - 访问：https://rubyinstaller.org/
   - 下载 **Ruby+Devkit** 版本（推荐 3.2.x 或 3.3.x）
   - 选择 `.exe` 安装程序

2. **安装 Ruby**
   - 运行安装程序
   - **重要**：勾选 "Add Ruby executables to your PATH"
   - 完成安装后，**重新打开 PowerShell 窗口**

3. **验证安装**
   ```powershell
   ruby --version
   gem --version
   ```

4. **安装 Jekyll 和 Bundler**
   ```powershell
   gem install jekyll bundler
   ```

5. **安装项目依赖**
   ```powershell
   cd c:\Dev\gonghejian.github.io
   bundle install
   ```

6. **启动预览服务器**
   ```powershell
   bundle exec jekyll serve
   ```

7. **访问预览**
   - 打开浏览器访问：http://localhost:4000

### 方案 2：使用 GitHub Pages 在线预览

如果不想安装 Ruby，可以直接部署到 GitHub Pages：

1. **提交代码到 GitHub**
   ```powershell
   git add .
   git commit -m "网站改版"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 等待几分钟后访问你的 GitHub Pages URL

### 方案 3：使用 GitHub Codespaces（在线环境）

1. 将代码推送到 GitHub
2. 在仓库中点击 "Code" → "Codespaces" → "Create codespace"
3. 在 Codespaces 终端中运行：
   ```bash
   bundle install
   bundle exec jekyll serve
   ```

## 快速检查清单

- [ ] Ruby 已安装（`ruby --version` 有输出）
- [ ] Bundler 已安装（`bundle --version` 有输出）
- [ ] 项目依赖已安装（`bundle install` 成功）
- [ ] Jekyll 可以构建（`bundle exec jekyll build` 成功）
- [ ] 服务器可以启动（`bundle exec jekyll serve` 成功）

## 常见问题

### Q: 安装 Ruby 后仍然提示找不到命令？
A: 需要重新打开 PowerShell 窗口，或者手动添加到 PATH 环境变量。

### Q: bundle install 失败？
A: 检查网络连接，确保可以访问 rubygems.org。可能需要配置代理。

### Q: Jekyll build 报错？
A: 检查 `_config.yml` 语法是否正确，查看错误信息中的具体文件位置。

## 需要帮助？

如果遇到问题，可以：
1. 查看项目中的 `SETUP.md` 文件
2. 查看 `TROUBLESHOOTING.md` 文件
3. 检查 Jekyll 官方文档：https://jekyllrb.com/docs/
