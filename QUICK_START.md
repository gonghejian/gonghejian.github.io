# ⚡ 快速开始 - 解决 "last week" 问题

## 🎯 3 个关键步骤

### 步骤 1: 推送文件到 GitHub

```powershell
# 方法 A: 使用部署脚本（推荐）
.\deploy.ps1

# 方法 B: 手动推送
git push origin main
```

**如果推送失败**（连接重置）：
- 使用 SSH：`git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git`
- 或查看 `GIT_PUSH_FIX.md`

### 步骤 2: 配置 GitHub Pages（最重要！）

1. 进入：https://github.com/gonghejian/gonghejian.github.io/settings/pages
2. **Source** 选择：**"GitHub Actions"**（不是分支！）
3. 点击 **Save**

### 步骤 3: 手动触发部署

1. 进入：https://github.com/gonghejian/gonghejian.github.io/actions
2. 点击 **"Deploy GitHub Pages"**
3. 点击 **"Run workflow"**
4. 选择分支：**main**
5. 点击 **"Run workflow"**
6. 等待 2-5 分钟完成

## ✅ 验证

- Settings → Pages → Recent deployments 显示最新时间
- 等待 5-10 分钟让 CDN 更新
- 访问网站查看更新

## 📝 详细说明

查看 `COMPLETE_DEPLOYMENT_GUIDE.md` 获取完整指南。

