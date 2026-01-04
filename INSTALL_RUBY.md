# 📦 Ruby 和 Jekyll 安装指南（Windows）

## 问题诊断

当前系统未安装 Ruby，导致无法运行 Jekyll 预览服务器。

## 🚀 快速安装步骤

### 步骤 1: 下载 RubyInstaller

1. 访问：https://rubyinstaller.org/downloads/
2. 下载 **Ruby+Devkit 3.1.x (x64)** 版本
   - 推荐：Ruby+Devkit 3.1.7 (x64)
   - 文件大小约 150MB

### 步骤 2: 安装 Ruby

1. 运行下载的安装程序
2. **重要**：勾选以下选项：
   - ✅ "Add Ruby executables to your PATH"
   - ✅ "Associate .rb and .rbw files with this Ruby installation"
3. 点击 "Install"
4. 安装完成后，会弹出 MSYS2 安装窗口
   - 选择 "1" 安装基础开发工具
   - 等待安装完成

### 步骤 3: 验证安装

**重新打开 Cursor 终端**（重要！），然后运行：

```powershell
ruby -v
# 应该显示：ruby 3.1.x

gem -v
# 应该显示：gem 版本号
```

### 步骤 4: 安装 Bundler

```powershell
gem install bundler
```

### 步骤 5: 安装项目依赖

```powershell
cd C:\Dev\gonghejian.github.io
bundle install
```

### 步骤 6: 启动预览服务器

```powershell
bundle exec jekyll serve --host 0.0.0.0 --port 4000
```

访问：http://localhost:4000

---

## 🔄 临时预览方案（无需安装 Ruby）

如果暂时不想安装 Ruby，可以使用静态预览文件：

### 方法 1: 打开静态预览文件

```powershell
# 在文件管理器中打开
start preview.html
start preview-categories.html
```

### 方法 2: 推送到 GitHub 在线预览

```powershell
# 使用推送脚本
.\push.ps1

# 或手动推送
git add .
git commit -m "更新内容"
git push origin main
```

等待 2-5 分钟后访问：https://gonghejian.cn

---

## ⚠️ 常见问题

### 问题 1: 安装后仍找不到 ruby 命令

**解决**：
1. **完全关闭 Cursor 并重新打开**
2. 检查环境变量：
   ```powershell
   $env:PATH -split ';' | Select-String "ruby"
   ```
3. 如果找不到，手动添加到 PATH：
   - 系统属性 → 高级 → 环境变量
   - 编辑 PATH，添加 Ruby 安装目录（通常是 `C:\Ruby31-x64\bin`）

### 问题 2: bundle install 失败

**解决**：
```powershell
# 更新 RubyGems
gem update --system

# 使用国内镜像（如果下载慢）
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/

# 重新安装
bundle install
```

### 问题 3: 端口 4000 被占用

**解决**：
```powershell
# 使用其他端口
bundle exec jekyll serve --port 4001

# 或查找并关闭占用端口的进程
netstat -ano | findstr :4000
```

---

## 📝 安装后验证

运行以下命令验证安装成功：

```powershell
# 1. 检查 Ruby
ruby -v

# 2. 检查 Gem
gem -v

# 3. 检查 Bundler
bundle -v

# 4. 检查项目依赖
bundle check

# 5. 测试构建
bundle exec jekyll build

# 6. 启动服务器
bundle exec jekyll serve
```

---

## 🎯 推荐方案

**长期使用**：安装 Ruby + Jekyll（方案 1）
- ✅ 支持实时预览
- ✅ 自动检测文件变化
- ✅ 完整的 Jekyll 功能

**临时使用**：静态预览文件或在线预览（方案 2）
- ✅ 无需安装
- ✅ 快速查看效果
- ⚠️ 功能有限

---

## 📚 相关资源

- RubyInstaller: https://rubyinstaller.org/
- Jekyll 文档: https://jekyllrb.com/docs/
- GitHub Pages: https://pages.github.com/

