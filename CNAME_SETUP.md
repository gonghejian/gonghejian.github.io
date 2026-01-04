# 🌐 自定义域名 gonghejian.cn 设置指南

## ✅ 已完成的配置

1. ✅ CNAME 文件已创建：`gonghejian.cn`
2. ✅ `_config.yml` 已更新，确保 CNAME 文件被包含

## 🚀 需要执行的步骤

### 步骤 1: 在 GitHub Pages 设置中配置域名

1. 进入你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Pages**
4. 在 **Custom domain**（自定义域名）部分：
   - 输入：`gonghejian.cn`
   - 勾选 **"Enforce HTTPS"**（强制 HTTPS）
   - 点击 **Save**（保存）

### 步骤 2: 配置 DNS 记录

在你的域名服务商（如阿里云、腾讯云等）配置 DNS：

#### 方法 A: 使用 CNAME 记录（推荐）

```
类型: CNAME
主机记录: @
记录值: yourusername.github.io
```

或者如果支持：

```
类型: CNAME
主机记录: www
记录值: yourusername.github.io
```

#### 方法 B: 使用 A 记录

如果必须使用 A 记录，使用以下 IP 地址：

```
类型: A
主机记录: @
记录值: 
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
```

### 步骤 3: 等待 DNS 生效

- DNS 配置生效通常需要 **几分钟到几小时**
- 可以使用以下工具检查 DNS 是否生效：
  - https://dnschecker.org/
  - https://www.whatsmydns.net/

### 步骤 4: 验证配置

1. **检查 CNAME 文件**：
   - 在 GitHub 仓库中确认 `CNAME` 文件存在
   - 内容应该是：`gonghejian.cn`

2. **检查 Pages 设置**：
   - Settings → Pages
   - 应该显示自定义域名：`gonghejian.cn`
   - 应该显示 DNS 检查状态

3. **访问网站**：
   - 等待 DNS 生效后（可能需要几小时）
   - 访问 `https://gonghejian.cn`
   - 应该能看到你的网站

## 🔍 故障排除

### 问题 1: DNS 检查失败

**症状：** GitHub Pages 设置中显示 DNS 检查失败

**解决方案：**
1. 确认 DNS 记录已正确配置
2. 等待 DNS 传播（最多 48 小时）
3. 检查记录值是否正确（特别是 CNAME 记录）

### 问题 2: HTTPS 证书未生效

**症状：** 只能通过 HTTP 访问，HTTPS 报错

**解决方案：**
1. 在 Pages 设置中勾选 "Enforce HTTPS"
2. 等待 GitHub 自动生成证书（可能需要几小时）
3. 确认 DNS 已正确配置

### 问题 3: 网站无法访问

**检查清单：**
- [ ] DNS 记录已配置
- [ ] DNS 已生效（使用 DNS 检查工具验证）
- [ ] GitHub Pages 设置中已配置自定义域名
- [ ] CNAME 文件存在于仓库中
- [ ] 等待足够的时间让配置生效

### 问题 4: CNAME 文件被删除

**如果使用 GitHub Actions 部署：**
- CNAME 文件会被自动复制到 `_site` 目录
- 确保 `_config.yml` 中 `include` 包含 `CNAME`

## 📋 验证清单

完成以下检查：

- [ ] CNAME 文件存在于仓库根目录
- [ ] `_config.yml` 中 `include` 包含 `CNAME`
- [ ] GitHub Pages 设置中已配置 `gonghejian.cn`
- [ ] DNS 记录已配置（CNAME 或 A 记录）
- [ ] DNS 已生效（使用检查工具验证）
- [ ] 等待 HTTPS 证书生成（可能需要几小时）

## ⏰ 时间线

- **DNS 配置**：几分钟到几小时
- **GitHub Pages 识别**：几分钟
- **HTTPS 证书生成**：几小时到 24 小时
- **完全生效**：通常 24 小时内

## 🔗 相关资源

- [GitHub Pages 自定义域名文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS 检查工具](https://dnschecker.org/)
- [GitHub Pages IP 地址](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain)

---

**重要提示：**
- 配置 DNS 后需要等待生效，请耐心等待
- 确保 DNS 记录值正确（特别是你的 GitHub Pages 地址）
- 如果 24 小时后仍未生效，检查 DNS 配置和 GitHub Pages 设置



