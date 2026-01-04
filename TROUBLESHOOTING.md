# GitHub Actions 部署故障排除指南

## 🔍 快速检查清单

### 1. 检查 GitHub Pages 设置

**步骤：**
1. 进入仓库 → **Settings** → **Pages**
2. 确认 **Source** 显示为 **"GitHub Actions"**（不是 "Deploy from a branch"）
3. 如果还是显示分支部署，需要：
   - 选择 **"GitHub Actions"**
   - 保存设置

### 2. 检查工作流是否运行

**步骤：**
1. 进入仓库 → **Actions** 标签页
2. 查看是否有工作流运行记录
3. 点击最新的运行记录查看状态

**可能的情况：**
- ✅ **绿色 ✓**：部署成功，等待几分钟让 CDN 更新
- ❌ **红色 ✗**：部署失败，查看错误日志
- 🟡 **黄色 ⏳**：正在运行，等待完成

### 3. 检查分支名称

**确认你的默认分支名称：**
- 进入仓库主页，查看分支名称
- 常见分支名：`main`、`master`、`gh-pages`

**如果分支名不匹配：**
- 修改 `.github/workflows/deploy.yml` 中的分支名
- 或者重命名分支

### 4. 检查工作流文件位置

**确认文件存在：**
```
.github/workflows/deploy.yml
```

**检查文件语法：**
- YAML 文件必须使用 2 个空格缩进
- 不能使用 Tab
- 确保文件编码为 UTF-8

### 5. 检查权限设置

**步骤：**
1. 进入仓库 → **Settings** → **Actions** → **General**
2. 确认 **Workflow permissions** 设置为：
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"

## 🐛 常见问题及解决方案

### 问题 1: Actions 标签页没有显示工作流

**原因：**
- 工作流文件路径错误
- 文件语法错误
- 没有推送到正确的分支

**解决方案：**
1. 确认文件路径：`.github/workflows/deploy.yml`
2. 检查 YAML 语法（可以使用在线 YAML 验证器）
3. 确认推送到 `main` 或 `master` 分支

### 问题 2: 工作流运行但失败

**查看错误日志：**
1. 进入 **Actions** → 点击失败的运行
2. 展开失败的步骤查看错误信息

**常见错误：**

#### 错误：`bundle install` 失败
```
解决方案：
- 检查 Gemfile 语法
- 确认 Ruby 版本兼容
- 尝试更新依赖：bundle update
```

#### 错误：`jekyll build` 失败
```
解决方案：
- 检查 _config.yml 语法
- 确认所有插件已安装
- 查看构建日志中的具体错误
```

#### 错误：权限不足
```
解决方案：
- 检查仓库 Settings → Actions → General → Workflow permissions
- 确认设置为 "Read and write permissions"
```

### 问题 3: 工作流成功但页面未更新

**可能原因：**
1. CDN 缓存未更新（需要等待几分钟）
2. 浏览器缓存
3. 部署到错误的环境

**解决方案：**
1. **等待 5-10 分钟**：GitHub Pages 使用 CDN，需要时间传播
2. **清除浏览器缓存**：
   - Chrome/Edge: Ctrl+Shift+Delete
   - 或使用无痕模式访问
3. **强制刷新**：Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)
4. **检查部署环境**：
   - 进入 **Settings** → **Pages**
   - 查看 **Recent deployments** 确认最新部署

### 问题 4: Pages 设置显示 "Deploy from a branch"

**解决方案：**
1. 进入 **Settings** → **Pages**
2. 在 **Source** 下拉菜单中选择 **"GitHub Actions"**
3. 保存设置
4. 手动触发一次部署（在 Actions 页面点击 "Run workflow"）

### 问题 5: 工作流没有自动触发

**检查清单：**
- [ ] 确认推送到 `main` 或 `master` 分支
- [ ] 确认 `.github/workflows/deploy.yml` 文件存在
- [ ] 确认文件语法正确
- [ ] 检查仓库的 Actions 是否被禁用

**解决方案：**
1. 手动触发：进入 **Actions** → 选择工作流 → **Run workflow**
2. 检查分支名：确认你的默认分支名称
3. 重新推送：`git push origin main --force`（谨慎使用）

## 🔧 手动触发部署

如果自动触发不工作，可以手动触发：

1. 进入仓库 → **Actions** 标签页
2. 在左侧选择 **"🚀 自动构建并部署到 GitHub Pages"**
3. 点击右侧的 **"Run workflow"** 按钮
4. 选择分支（通常是 `main`）
5. 点击 **"Run workflow"**

## 📊 验证部署状态

### 方法 1: 查看 Pages 设置
1. **Settings** → **Pages**
2. 查看 **Recent deployments** 部分
3. 确认有最新的部署记录

### 方法 2: 查看 Actions
1. **Actions** 标签页
2. 查看最新的工作流运行记录
3. 点击运行记录查看详细日志

### 方法 3: 检查网站
1. 访问你的 GitHub Pages URL
2. 查看页面源代码中的时间戳
3. 或添加一个测试内容验证更新

## 🚨 紧急修复步骤

如果以上方法都不行，尝试以下步骤：

1. **删除并重新创建工作流文件**
   ```bash
   # 删除
   rm .github/workflows/deploy.yml
   
   # 重新创建（使用提供的模板）
   ```

2. **重新配置 Pages**
   - Settings → Pages
   - 先选择 "None"
   - 保存
   - 再选择 "GitHub Actions"
   - 保存

3. **检查仓库权限**
   - Settings → Actions → General
   - 确认 Actions 没有被禁用

4. **联系 GitHub 支持**
   - 如果问题持续，可能是 GitHub 服务问题

## 📝 调试信息收集

如果问题持续，收集以下信息：

1. **工作流运行日志**（Actions → 失败的运行 → 查看日志）
2. **Pages 设置截图**（Settings → Pages）
3. **分支名称**（仓库主页显示）
4. **工作流文件内容**（`.github/workflows/deploy.yml`）

## ✅ 成功标志

部署成功时，你应该看到：

1. ✅ Actions 中工作流显示绿色 ✓
2. ✅ Settings → Pages 显示最新的部署时间
3. ✅ 网站内容已更新（可能需要等待几分钟）

---

**需要更多帮助？** 查看 GitHub Actions 文档或提交 Issue。

