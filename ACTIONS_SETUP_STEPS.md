# GitHub Actions 设置步骤

## 问题：Actions 标签页看不到工作流

### 可能的原因：
1. 工作流文件还没有推送到 GitHub
2. Actions 功能被禁用
3. 工作流文件格式有问题

## 解决步骤

### 步骤 1: 确认工作流文件已推送

检查本地是否有 `.github/workflows/` 目录和文件：

```bash
# 检查文件是否存在
ls .github/workflows/
```

应该看到：
- `deploy.yml` 或
- `jekyll.yml` 或
- `pages-deploy.yml`

### 步骤 2: 推送工作流文件到 GitHub

```bash
# 添加文件
git add .github/workflows/

# 提交
git commit -m "Add GitHub Actions workflow"

# 推送到 master 分支
git push origin master
```

### 步骤 3: 检查 Actions 是否启用

1. 进入仓库 → **Settings**
2. 左侧菜单找到 **Actions** → **General**
3. 确认 **Actions permissions** 设置为：
   - ✅ "Allow all actions and reusable workflows"
   - 或者至少允许本地操作

### 步骤 4: 等待几秒钟

推送后，等待 10-30 秒，然后：
1. 刷新 GitHub 页面
2. 进入 **Actions** 标签页
3. 应该能看到工作流了

### 步骤 5: 如果还是看不到

**方法 A: 使用标准文件名**

我已经创建了 `jekyll.yml`，这是 GitHub 推荐的标准文件名。

**方法 B: 检查文件路径**

确保文件路径完全正确：
```
.github/workflows/jekyll.yml
```

**方法 C: 检查 YAML 语法**

YAML 文件必须：
- 使用 2 个空格缩进（不能用 Tab）
- 编码为 UTF-8
- 文件名以 `.yml` 或 `.yaml` 结尾

### 步骤 6: 手动触发（如果能看到工作流）

1. 进入 **Actions** 标签页
2. 点击左侧的 **"Jekyll site CI"**
3. 点击右侧的 **"Run workflow"**
4. 选择分支：**master**
5. 点击 **"Run workflow"**

## 验证

推送后，你应该能看到：

1. **Actions 标签页**：
   - 左侧显示工作流名称
   - 有运行记录（如果是自动触发）

2. **Settings → Pages**：
   - Source 可以选择 "GitHub Actions"
   - 显示可用的工作流

## 如果还是不行

请告诉我：
1. 是否已经推送了 `.github/workflows/` 目录？
2. Settings → Actions → General 中 Actions 是否启用？
3. Actions 标签页显示什么？（截图最好）

