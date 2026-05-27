# 🚀 立即部署到 GitHub Pages - 完整指南

## 问题：GitHub Pages 显示 "last week"

这说明部署没有更新。按照以下步骤操作：

## ✅ 步骤 1: 确保所有文件已提交

```bash
# 检查状态
git status

# 如果有未提交的文件
git add .
git commit -m "Update site content"
```

## ✅ 步骤 2: 推送所有更改到 GitHub

```bash
# 推送到 main 分支
git push origin main

# 如果遇到连接问题，尝试：
git push origin main --verbose

# 或者使用 SSH（如果已配置）
git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git
git push origin main
```

## ✅ 步骤 3: 在 GitHub 上配置 Pages

**重要！必须完成这一步：**

1. 进入仓库：https://github.com/gonghejian/gonghejian.github.io
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - **必须选择 "GitHub Actions"**（不是 "Deploy from a branch"）
   - 如果显示分支部署，点击下拉菜单
   - 选择 **"GitHub Actions"**
   - 点击 **Save**（保存）

## ✅ 步骤 4: 手动触发部署

1. 进入仓库的 **Actions** 标签页
2. 左侧应该能看到 **"Deploy GitHub Pages"** 工作流
3. 如果看不到，等待 30 秒后刷新页面
4. 点击 **"Deploy GitHub Pages"**
5. 点击右侧的 **"Run workflow"** 按钮
6. 选择分支：**main**
7. 点击 **"Run workflow"**

## ✅ 步骤 5: 等待部署完成

1. 在 Actions 页面查看部署进度
2. 通常需要 2-5 分钟
3. 看到绿色 ✓ 表示成功

## ✅ 步骤 6: 验证部署

1. 进入 **Settings** → **Pages**
2. 查看 **Recent deployments** 部分
3. 应该显示最新的部署时间（不是 "last week"）
4. 等待 5-10 分钟让 CDN 更新
5. 访问你的网站查看更新

## 🔧 如果工作流没有运行

### 检查 1: Actions 是否启用

1. Settings → Actions → General
2. 确认 **Actions permissions** 已启用
3. 选择 **"Allow all actions and reusable workflows"**

### 检查 2: 工作流文件是否存在

确认 `.github/workflows/pages.yml` 文件已推送到 GitHub：
- 在 GitHub 上查看文件树
- 路径：`.github/workflows/pages.yml`

### 检查 3: 分支名称

确认你的默认分支是 `main` 还是 `master`：
- 在仓库主页查看分支名称
- 工作流已配置支持两个分支

## 🚨 快速修复命令

如果推送遇到连接问题：

```bash
# 方法 1: 增加缓冲区
git config --global http.postBuffer 524288000
git push origin main

# 方法 2: 使用详细模式
git push origin main --verbose

# 方法 3: 切换到 SSH（推荐）
git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git
git push origin main
```

## 📋 完整操作清单

- [ ] 所有文件已提交（`git status` 显示 clean）
- [ ] 文件已推送到 GitHub（`git push origin main` 成功）
- [ ] Settings → Pages → Source 选择为 "GitHub Actions"
- [ ] Actions 标签页能看到 "Deploy GitHub Pages" 工作流
- [ ] 手动触发了工作流（Run workflow）
- [ ] 工作流运行成功（绿色 ✓）
- [ ] Settings → Pages 显示最新部署时间
- [ ] 等待 5-10 分钟让 CDN 更新
- [ ] 网站内容已更新

## 🎯 成功标志

部署成功后，你应该看到：

1. ✅ Actions 中工作流显示绿色 ✓
2. ✅ Settings → Pages → Recent deployments 显示最新时间
3. ✅ 网站内容已更新（等待几分钟后）

## 💡 提示

- **首次部署**：第一次使用 GitHub Actions 可能需要授权 Pages 权限
- **等待时间**：部署完成后，需要等待 5-10 分钟让 CDN 更新
- **浏览器缓存**：清除浏览器缓存或使用无痕模式查看更新

---

**现在执行：**
1. `git push origin main`（推送文件）
2. Settings → Pages → 选择 "GitHub Actions"
3. Actions → 手动触发工作流

完成后告诉我结果！

