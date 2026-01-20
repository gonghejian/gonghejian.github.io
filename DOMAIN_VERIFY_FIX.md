# 域名验证和释放问题解决方案

## 🔴 问题描述

在 GitHub Pages 设置自定义域名时，遇到错误：
```
The custom domain `gonghejian.cn` is already taken.
```

这表示域名 `gonghejian.cn` 已经被其他 GitHub Pages 站点使用，或者需要验证域名所有权。

## ✅ 解决方案

### 方案一：验证域名所有权（推荐）

#### 步骤 1：添加 DNS 验证记录

1. **登录你的域名服务商**（如阿里云、腾讯云等）
2. **添加 TXT 记录**用于验证：
   - **主机记录**：`_github-pages-challenge-gonghejian`（或 `_github-pages-challenge-gonghejian.www` 如果使用 www）
   - **记录类型**：`TXT`
   - **记录值**：GitHub 会提供（在 GitHub Pages 设置页面查看）
   - **TTL**：600（10分钟）

3. **等待 DNS 传播**（通常 5-30 分钟）

#### 步骤 2：在 GitHub 中验证

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 **Custom domain** 部分，输入 `gonghejian.cn`
4. 点击 **Save**
5. GitHub 会自动检测 TXT 记录并验证域名

### 方案二：检查并释放域名

如果域名之前在其他仓库使用过：

#### 步骤 1：检查其他仓库

1. 检查你的其他 GitHub 仓库是否使用了这个域名
2. 如果有，进入该仓库的 **Settings** → **Pages**
3. 删除或更改该仓库的自定义域名

#### 步骤 2：移除旧的 CNAME 文件

如果域名之前在其他仓库使用过，需要：

1. 找到之前使用该域名的仓库
2. 删除该仓库中的 `CNAME` 文件
3. 提交更改
4. 等待几分钟让 GitHub 释放域名

### 方案三：使用子域名（临时方案）

如果暂时无法验证主域名，可以先用子域名：

1. 在 DNS 中添加 CNAME 记录：
   - **主机记录**：`www`
   - **记录类型**：`CNAME`
   - **记录值**：`gonghejian.github.io`（或你的 GitHub 用户名）
   - **TTL**：600

2. 在 GitHub Pages 设置中使用：`www.gonghejian.cn`

3. 在 `CNAME` 文件中写入：`www.gonghejian.cn`

## 📝 详细操作步骤

### 1. 检查当前 CNAME 文件

确保 `CNAME` 文件内容正确：
```
gonghejian.cn
```

### 2. 配置 DNS 记录（阿里云示例）

#### 方式 A：使用 CNAME 记录（推荐）

1. 登录阿里云控制台
2. 进入 **域名** → **解析**
3. 找到 `gonghejian.cn` 域名
4. 添加记录：
   - **记录类型**：`CNAME`
   - **主机记录**：`@`（或留空）
   - **记录值**：`gonghejian.github.io`（替换为你的 GitHub 用户名）
   - **TTL**：600

5. 如果也想支持 `www.gonghejian.cn`，再添加一条：
   - **记录类型**：`CNAME`
   - **主机记录**：`www`
   - **记录值**：`gonghejian.github.io`
   - **TTL**：600

#### 方式 B：使用 A 记录

如果 CNAME 不工作，可以使用 A 记录：

添加 4 条 A 记录，主机记录都是 `@`，记录值分别是：
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### 3. 在 GitHub 中设置

1. 进入仓库：`https://github.com/gonghejian/gonghejian.github.io/settings/pages`
2. 在 **Custom domain** 输入框输入：`gonghejian.cn`
3. 勾选 **Enforce HTTPS**（如果可用）
4. 点击 **Save**

### 4. 等待生效

- DNS 记录生效：通常 5-30 分钟
- GitHub Pages 部署：通常 1-5 分钟
- HTTPS 证书：可能需要几分钟到几小时

## 🔍 验证步骤

### 检查 DNS 记录

使用命令行工具检查：

```bash
# Windows PowerShell
nslookup gonghejian.cn

# 或使用在线工具
# https://dnschecker.org/
```

### 检查 GitHub Pages 状态

1. 访问：`https://github.com/gonghejian/gonghejian.github.io/settings/pages`
2. 查看 **Custom domain** 部分的状态
3. 如果显示绿色勾号 ✅，说明配置成功

### 测试访问

1. 等待 DNS 生效后，访问：`https://gonghejian.cn`
2. 应该能看到你的网站
3. 检查浏览器地址栏是否显示你的域名（而不是 `gonghejian.github.io`）

## ⚠️ 常见问题

### Q1: 域名一直显示 "already taken"

**解决方案：**
1. 检查所有 GitHub 仓库，确保没有其他仓库使用该域名
2. 添加 TXT 验证记录
3. 等待 24 小时后重试
4. 如果还是不行，联系 GitHub 支持

### Q2: DNS 记录已添加，但 GitHub 还是提示错误

**解决方案：**
1. 使用 `nslookup` 或在线工具检查 DNS 是否生效
2. 确保记录值完全正确（注意大小写）
3. 清除 DNS 缓存后重试
4. 等待更长时间（有时需要几小时）

### Q3: HTTPS 证书无法启用

**解决方案：**
1. 确保 DNS 记录正确
2. 确保域名在 GitHub Pages 中显示为已验证
3. 等待 24 小时让 Let's Encrypt 生成证书
4. 如果 24 小时后还是不行，删除域名后重新添加

### Q4: 访问域名显示 404

**解决方案：**
1. 检查 `CNAME` 文件是否存在且内容正确
2. 检查 GitHub Actions 部署是否成功
3. 确保仓库是公开的（或已启用 Pages）
4. 检查 `_config.yml` 中的 `url` 配置是否正确

## 📞 需要帮助？

如果以上方法都不行：

1. **检查 GitHub 文档**：
   https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages

2. **联系 GitHub 支持**：
   https://support.github.com/

3. **检查 DNS 配置**：
   使用 https://dnschecker.org/ 检查全球 DNS 解析情况

## 🎯 快速检查清单

- [ ] `CNAME` 文件存在且内容为 `gonghejian.cn`
- [ ] DNS 记录已添加（CNAME 或 A 记录）
- [ ] DNS 记录已生效（使用 nslookup 检查）
- [ ] GitHub Pages 设置中已输入域名
- [ ] 等待至少 10-30 分钟让配置生效
- [ ] 检查所有仓库，确保没有其他仓库使用该域名
- [ ] 如果使用 HTTPS，等待证书生成（最多 24 小时）




