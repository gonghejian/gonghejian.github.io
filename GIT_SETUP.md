# 🔧 Cursor 中直接推送 GitHub 设置指南

## 📋 前置条件

1. ✅ 已安装 Git
2. ✅ 已有 GitHub 账号
3. ✅ 已有 GitHub 仓库（或需要创建）

## 🔑 方法一：使用 HTTPS + Personal Access Token（推荐）

### 步骤 1: 创建 Personal Access Token

1. 登录 GitHub
2. 进入 **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. 点击 **Generate new token (classic)**
4. 设置：
   - **Note**: `Cursor Git Push`（描述用途）
   - **Expiration**: 选择过期时间（建议 90 天或 No expiration）
   - **Scopes**: 勾选 `repo`（完整仓库权限）
5. 点击 **Generate token**
6. **重要**：复制生成的 token（只显示一次！）

### 步骤 2: 配置 Git 远程仓库

```powershell
# 查看当前远程仓库
git remote -v

# 如果还没有远程仓库，添加一个
git remote add origin https://github.com/你的用户名/仓库名.git

# 如果已有但需要更新 URL
git remote set-url origin https://github.com/你的用户名/仓库名.git
```

### 步骤 3: 推送代码

```powershell
# 添加所有更改
git add .

# 提交更改
git commit -m "更新内容描述"

# 推送到 GitHub（会提示输入用户名和密码）
# 用户名：你的 GitHub 用户名
# 密码：使用刚才创建的 Personal Access Token
git push origin main
```

**注意**：Windows 可能会缓存凭据，如果提示输入密码，使用 Personal Access Token 而不是 GitHub 密码。

---

## 🔐 方法二：使用 SSH 密钥（更安全，推荐长期使用）

### 步骤 1: 生成 SSH 密钥

```powershell
# 检查是否已有 SSH 密钥
ls ~/.ssh

# 如果没有，生成新的 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 按提示操作：
# - 保存位置：直接回车（使用默认 ~/.ssh/id_ed25519）
# - 密码：可以设置密码或直接回车（不设置）
```

### 步骤 2: 添加 SSH 密钥到 GitHub

```powershell
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# 或使用 PowerShell
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

然后在 GitHub：
1. 进入 **Settings** → **SSH and GPG keys**
2. 点击 **New SSH key**
3. **Title**: `Cursor Development`
4. **Key**: 粘贴刚才复制的公钥
5. 点击 **Add SSH key**

### 步骤 3: 配置 Git 使用 SSH

```powershell
# 设置远程仓库使用 SSH
git remote set-url origin git@github.com:你的用户名/仓库名.git

# 测试 SSH 连接
ssh -T git@github.com
# 应该看到：Hi 你的用户名! You've successfully authenticated...
```

### 步骤 4: 推送代码

```powershell
git add .
git commit -m "更新内容描述"
git push origin main
```

---

## 🚀 快速推送脚本

创建一个 PowerShell 脚本方便推送：

```powershell
# 保存为 push.ps1
git add .
$message = Read-Host "输入提交信息"
git commit -m $message
git push origin main
Write-Host "推送完成！" -ForegroundColor Green
```

使用方法：
```powershell
.\push.ps1
```

---

## 🔍 常见问题

### 问题 1: 提示需要认证

**解决方案**：
- 使用 Personal Access Token 而不是密码
- 或配置 SSH 密钥

### 问题 2: 推送被拒绝（Permission denied）

**解决方案**：
```powershell
# 检查远程仓库 URL
git remote -v

# 确保 URL 正确
git remote set-url origin https://github.com/你的用户名/仓库名.git
```

### 问题 3: 分支名称不匹配

**解决方案**：
```powershell
# 查看当前分支
git branch

# 如果分支是 master，推送时使用
git push origin master

# 或者重命名分支
git branch -M main
git push origin main
```

### 问题 4: 需要设置 Git 用户信息

**解决方案**：
```powershell
git config --global user.name "你的名字"
git config --global user.email "your_email@example.com"
```

---

## 📝 完整推送流程示例

```powershell
# 1. 检查状态
git status

# 2. 添加更改
git add .

# 3. 提交
git commit -m "更新：优化分类页面和导航"

# 4. 推送
git push origin main

# 5. 查看结果
git log --oneline -5
```

---

## ✅ 验证设置

```powershell
# 检查 Git 配置
git config --list

# 检查远程仓库
git remote -v

# 测试连接（SSH）
ssh -T git@github.com
```

---

## 🎯 推荐配置

**对于日常使用**：
- 使用 SSH 密钥（一次配置，长期使用）
- 创建推送脚本方便操作

**对于临时使用**：
- 使用 Personal Access Token（简单快速）




