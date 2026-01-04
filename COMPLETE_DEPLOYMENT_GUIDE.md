# 🚀 完整部署指南 - 解决 "last week" 问题

## 问题
GitHub Pages 显示 "last week"，说明部署没有更新。

## ✅ 完整解决方案

### 第一步：提交并推送文件

```powershell
# 使用我创建的部署脚本（推荐）
.\deploy.ps1

# 或者手动执行：
git add .
git commit -m "Update site content"
git push origin main
```

**如果推送遇到连接问题：**
- 查看 `GIT_PUSH_FIX.md` 获取解决方案
- 或使用 SSH：`git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git`

### 第二步：在 GitHub 上配置 Pages（最重要！）

1. **进入仓库**：https://github.com/gonghejian/gonghejian.github.io
2. **点击 Settings**（设置）
3. **左侧菜单 → Pages**
4. **在 Source 部分**：
   - 如果显示 "Deploy from a branch"
   - 点击下拉菜单
   - **选择 "GitHub Actions"**
   - 点击 **Save**（保存）

**这一步非常关键！** 如果不切换到 GitHub Actions，工作流不会运行。

### 第三步：手动触发部署

1. **进入 Actions 标签页**
2. **左侧应该能看到 "Deploy GitHub Pages"**
3. **如果看不到**：
   - 等待 30 秒后刷新
   - 确认 `.github/workflows/pages.yml` 文件已推送
4. **点击 "Deploy GitHub Pages"**
5. **点击右侧 "Run workflow"**
6. **选择分支：main**
7. **点击 "Run workflow"**

### 第四步：等待部署完成

1. **查看部署进度**（Actions 页面）
2. **通常需要 2-5 分钟**
3. **看到绿色 ✓ 表示成功**

### 第五步：验证部署

1. **Settings → Pages**
2. **查看 "Recent deployments"**
3. **应该显示最新时间**（不是 "last week"）
4. **等待 5-10 分钟让 CDN 更新**
5. **访问网站查看更新**

## 🔧 工作流文件已更新

我已经更新了 `.github/workflows/pages.yml`：
- ✅ 支持 `main` 和 `master` 两个分支
- ✅ 使用最新的 Actions 版本
- ✅ 包含完整的构建和部署步骤

## 📋 检查清单

完成以下所有步骤：

- [ ] 文件已提交（`git status` 显示 clean）
- [ ] 文件已推送（`git push origin main` 成功）
- [ ] **Settings → Pages → Source 选择为 "GitHub Actions"** ⚠️ 最重要！
- [ ] Actions 标签页能看到 "Deploy GitHub Pages"
- [ ] 手动触发了工作流（Run workflow）
- [ ] 工作流运行成功（绿色 ✓）
- [ ] Settings → Pages 显示最新部署时间
- [ ] 等待 5-10 分钟
- [ ] 网站内容已更新

## 🚨 常见问题

### 问题 1: Actions 看不到工作流

**解决：**
1. 确认 `.github/workflows/pages.yml` 已推送到 GitHub
2. 等待 30 秒后刷新页面
3. 检查 Settings → Actions → General 中 Actions 是否启用

### 问题 2: 工作流运行但失败

**解决：**
1. 点击失败的运行查看错误日志
2. 检查 Gemfile 和 _config.yml 是否有错误
3. 在本地测试：`bundle exec jekyll build`

### 问题 3: 推送失败（连接重置）

**解决：**
1. 查看 `GIT_PUSH_FIX.md`
2. 使用 SSH 代替 HTTPS
3. 配置代理（如果使用）

### 问题 4: Pages 还是显示 "last week"

**解决：**
1. **确认 Settings → Pages → Source 是 "GitHub Actions"**（不是分支）
2. 手动触发一次工作流
3. 等待部署完成
4. 等待 5-10 分钟让 CDN 更新

## 💡 快速命令

```powershell
# 一键部署（使用脚本）
.\deploy.ps1

# 或手动执行
git add .
git commit -m "Update site"
git push origin main
```

## 🎯 成功标志

部署成功后：
- ✅ Actions 显示绿色 ✓
- ✅ Settings → Pages 显示最新部署时间
- ✅ 网站内容已更新

---

**现在执行：**
1. 运行 `.\deploy.ps1` 或手动推送
2. **Settings → Pages → 选择 "GitHub Actions"** ⚠️
3. Actions → 手动触发工作流

完成后告诉我结果！

