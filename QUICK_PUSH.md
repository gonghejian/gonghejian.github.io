# 🚀 Cursor 中快速推送 GitHub 指南

## ✅ 当前配置状态

你的 Git 已经配置好了：
- **仓库**: `https://github.com/gonghejian/gonghejian.github.io.git`
- **分支**: `main`
- **用户**: `gonghejian`

## 🔑 认证方式设置

### 方式一：使用 Personal Access Token（推荐，简单）

#### 1. 创建 Token

1. 访问：https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 设置：
   - **Note**: `Cursor Push`
   - **Expiration**: 90 days 或 No expiration
   - **Scopes**: ✅ 勾选 `repo`
4. 点击 **Generate token**
5. **复制 token**（只显示一次！）

#### 2. 使用 Token 推送

当执行 `git push` 时：
- **Username**: `gonghejian`
- **Password**: 粘贴刚才复制的 token（不是 GitHub 密码！）

#### 3. 保存凭据（可选）

Windows 会自动保存凭据，下次就不需要输入了。

---

### 方式二：使用 SSH 密钥（更安全，推荐长期使用）

#### 1. 生成 SSH 密钥

在 Cursor 终端运行：

```powershell
# 检查是否已有密钥
ls ~/.ssh

# 如果没有，生成新密钥
ssh-keygen -t ed25519 -C "gonghejian@gmail.com"

# 按提示操作（直接回车使用默认设置）
```

#### 2. 复制公钥

```powershell
# 复制公钥内容
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

#### 3. 添加到 GitHub

1. 访问：https://github.com/settings/keys
2. 点击 **New SSH key**
3. **Title**: `Cursor`
4. **Key**: 粘贴刚才复制的公钥
5. 点击 **Add SSH key**

#### 4. 切换远程仓库为 SSH

```powershell
git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git
```

#### 5. 测试连接

```powershell
ssh -T git@github.com
# 应该看到：Hi gonghejian! You've successfully authenticated...
```

---

## 🎯 快速推送方法

### 方法 1：使用推送脚本（最简单）

```powershell
.\push.ps1
```

脚本会自动：
1. 检查更改
2. 添加所有文件
3. 提示输入提交信息
4. 提交并推送

### 方法 2：手动命令

```powershell
# 1. 查看状态
git status

# 2. 添加更改
git add .

# 3. 提交
git commit -m "更新内容描述"

# 4. 推送
git push origin main
```

---

## 🔧 常见问题解决

### 问题 1: 提示 "Authentication failed"

**解决**：
- 如果使用 HTTPS，确保使用 Personal Access Token 而不是密码
- 如果使用 SSH，确保已添加 SSH 密钥到 GitHub

### 问题 2: 提示 "Permission denied"

**解决**：
```powershell
# 检查远程仓库 URL
git remote -v

# 确保 URL 正确
git remote set-url origin https://github.com/gonghejian/gonghejian.github.io.git
```

### 问题 3: 需要清除缓存的凭据

**解决**：
```powershell
# Windows 凭据管理器
# 搜索 "git:https://github.com" 并删除
# 或使用命令：
git credential-manager-core erase
```

### 问题 4: 分支名称问题

**解决**：
```powershell
# 查看当前分支
git branch

# 如果分支是 master，使用：
git push origin master

# 或重命名分支
git branch -M main
```

---

## 📝 完整推送示例

```powershell
# 1. 检查状态
git status

# 2. 添加所有更改
git add .

# 3. 提交（使用有意义的提交信息）
git commit -m "优化：删除文章导航，优化分类页面"

# 4. 推送到 GitHub
git push origin main

# 5. 查看结果
git log --oneline -3
```

---

## 🎨 推荐工作流程

1. **日常开发**：
   ```powershell
   .\push.ps1
   ```

2. **查看更改**：
   ```powershell
   git status
   git diff
   ```

3. **查看历史**：
   ```powershell
   git log --oneline -10
   ```

---

## ✅ 验证设置

运行以下命令验证：

```powershell
# 检查 Git 配置
git config --list | Select-String "user|remote"

# 检查远程仓库
git remote -v

# 检查分支
git branch
```

---

## 🚀 现在就可以推送了！

1. **使用脚本**（推荐）：
   ```powershell
   .\push.ps1
   ```

2. **或手动推送**：
   ```powershell
   git add .
   git commit -m "你的提交信息"
   git push origin main
   ```

**提示**：如果是第一次推送，会提示输入用户名和密码，使用 Personal Access Token 作为密码。

