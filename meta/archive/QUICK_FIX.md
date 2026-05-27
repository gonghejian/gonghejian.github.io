# 🚀 快速修复指南 - Master 分支

## ✅ 立即检查这 3 个地方

### 1. GitHub Pages 设置（最重要！）

**步骤：**
1. 进入你的仓库
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Pages**
4. 查看 **Source** 部分

**必须显示：**
```
Source: GitHub Actions
```

**如果显示的是：**
```
Source: Deploy from a branch
Branch: master
```

**需要操作：**
1. 点击下拉菜单
2. 选择 **"GitHub Actions"**
3. 点击 **Save**（保存）

### 2. 检查 Actions 是否运行

**步骤：**
1. 进入仓库的 **Actions** 标签页
2. 查看左侧是否有 **"🚀 自动构建并部署到 GitHub Pages"**
3. 点击查看是否有运行记录

**如果没有运行记录：**
- 点击 **"🚀 自动构建并部署到 GitHub Pages"**
- 点击右侧的 **"Run workflow"** 按钮
- 选择分支：**master**
- 点击 **"Run workflow"**

### 3. 查看工作流状态

**如果工作流正在运行或已完成：**
- 点击运行记录查看详情
- 查看每个步骤的状态

**状态说明：**
- ✅ 绿色 ✓ = 成功
- ❌ 红色 ✗ = 失败（点击查看错误）
- 🟡 黄色 ⏳ = 正在运行

## 🔧 如果工作流失败

### 常见错误 1: Bundle install 失败

**解决方案：**
```bash
# 在本地运行测试
bundle install
```

如果本地也失败，可能需要更新 Gemfile。

### 常见错误 2: Jekyll build 失败

**解决方案：**
```bash
# 在本地测试构建
bundle exec jekyll build
```

检查 `_config.yml` 是否有语法错误。

### 常见错误 3: 权限错误

**解决方案：**
1. Settings → Actions → General
2. 找到 **Workflow permissions**
3. 选择 **"Read and write permissions"**
4. 保存

## ⏰ 等待时间

即使工作流成功，也需要等待：
- **5-10 分钟**：GitHub Pages CDN 更新
- 然后清除浏览器缓存（Ctrl+F5）

## 🎯 验证部署

1. **Settings → Pages**
   - 查看 **Recent deployments**
   - 应该显示最新的部署时间

2. **访问网站**
   - 使用无痕模式访问
   - 或强制刷新（Ctrl+F5）

## 📝 如果还是不行

请提供以下信息：
1. Settings → Pages 的截图（Source 部分）
2. Actions 标签页的截图（显示工作流状态）
3. 如果有错误，错误日志的截图

---

**快速操作：**
1. Settings → Pages → 选择 "GitHub Actions" → 保存
2. Actions → 手动触发工作流
3. 等待 5-10 分钟

