# Jekyll 本地预览设置指南

## Windows 系统安装步骤

### 1. 安装 Ruby

**方法一：使用 RubyInstaller（推荐）**

1. 访问 https://rubyinstaller.org/
2. 下载 Ruby+Devkit 版本（建议 3.2.x 或 3.3.x）
3. 运行安装程序，勾选 "Add Ruby executables to your PATH"
4. 安装完成后，打开新的 PowerShell 窗口

**方法二：使用 Chocolatey**

```powershell
choco install ruby
```

### 2. 验证安装

打开 PowerShell，运行：

```powershell
ruby --version
gem --version
```

### 3. 安装 Jekyll 和 Bundler

```powershell
gem install jekyll bundler
```

### 4. 安装项目依赖

在项目目录下运行：

```powershell
bundle install
```

### 5. 启动本地服务器

```powershell
bundle exec jekyll serve
```

### 6. 访问预览

打开浏览器访问：`http://localhost:4000`

## 快速预览（无需安装）

如果你想快速查看 HTML 结构，可以直接打开 `index.html` 文件，但请注意：
- Jekyll 的 Liquid 模板语法不会被执行
- 样式和布局可能显示不完整
- 这是静态 HTML 预览，不是完整的 Jekyll 预览

## 使用 GitHub Codespaces（在线预览）

如果你有 GitHub 账号，可以使用 GitHub Codespaces：
1. 将代码推送到 GitHub
2. 在仓库中点击 "Code" > "Codespaces" > "Create codespace"
3. 在 Codespaces 中运行 `bundle install` 和 `bundle exec jekyll serve`

## 直接部署到 GitHub Pages

如果只是想查看最终效果，可以直接：
1. 将代码推送到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 等待几分钟后访问你的 GitHub Pages URL

