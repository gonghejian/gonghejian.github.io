# 🔄 重置 GitHub Pages 部署

## ✅ 已完成的操作

1. ✅ 删除了所有旧的工作流文件
2. ✅ 创建了新的工作流文件：`.github/workflows/pages.yml`

## 🚀 现在需要执行的步骤

### 步骤 1: 推送新文件到 GitHub

```bash
# 添加新文件
git add .github/workflows/pages.yml

# 删除旧文件（如果还在）
git add .github/workflows/

# 提交
git commit -m "Reset GitHub Actions workflow for Pages deployment"

# 推送到 master 分支
git push origin master
```

### 步骤 2: 在 GitHub 上配置 Pages

1. 进入你的仓库
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 如果显示 "Deploy from a branch"，点击下拉菜单
   - 选择 **"GitHub Actions"**
   - 点击 **Save**（保存）

### 步骤 3: 检查 Actions

1. 推送后等待 10-30 秒
2. 进入仓库的 **Actions** 标签页
3. 应该能看到 **"Deploy GitHub Pages"** 工作流
4. 如果看到，点击它
5. 点击右侧的 **"Run workflow"** 按钮
6. 选择分支：**master**
7. 点击 **"Run workflow"**

### 步骤 4: 等待部署完成

1. 在 Actions 页面查看部署进度
2. 通常需要 2-5 分钟
3. 看到绿色 ✓ 表示成功

### 步骤 5: 验证部署

1. 进入 **Settings** → **Pages**
2. 查看 **Recent deployments** 部分
3. 应该显示最新的部署时间
4. 等待 5-10 分钟让 CDN 更新
5. 访问你的网站查看更新

## 📋 新工作流文件特点

- ✅ 简洁明了，无多余配置
- ✅ 只针对 master 分支
- ✅ 使用最新的 Actions 版本
- ✅ 自动缓存依赖，加快构建
- ✅ 支持手动触发

## 🔍 如果还是看不到工作流

### 检查 1: Actions 是否启用

1. Settings → Actions → General
2. 确认 **Actions permissions** 已启用
3. 选择 **"Allow all actions and reusable workflows"**

### 检查 2: 文件是否正确推送

确认 `.github/workflows/pages.yml` 文件已存在于 GitHub 仓库中：
- 在 GitHub 上查看文件树
- 确认路径：`.github/workflows/pages.yml`

### 检查 3: 文件内容

如果文件存在但工作流不显示，检查文件内容是否正确：
- YAML 语法是否正确
- 缩进是否使用空格（不是 Tab）
- 编码是否为 UTF-8

## ⚠️ 重要提示

1. **首次部署**：第一次使用 GitHub Actions 可能需要授权 Pages 权限
2. **等待时间**：部署完成后，需要等待 5-10 分钟让 CDN 更新
3. **浏览器缓存**：清除浏览器缓存或使用无痕模式查看更新

## 🎯 成功标志

部署成功后，你应该看到：

1. ✅ Actions 中工作流显示绿色 ✓
2. ✅ Settings → Pages 显示最新部署时间
3. ✅ 网站内容已更新（等待几分钟后）

---

**如果还有问题，请提供：**
- Actions 标签页的截图
- Settings → Pages 的截图
- 任何错误信息

