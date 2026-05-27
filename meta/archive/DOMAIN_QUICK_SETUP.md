# 🚀 域名快速配置 - gonghejian.cn

## ⚡ 快速操作步骤

### 1️⃣ GitHub Pages 设置（2分钟）

1. 进入仓库：https://github.com/gonghejian/gonghejian.github.io/settings/pages
2. 在 **Custom domain** 输入：`gonghejian.cn`
3. 勾选 **"Enforce HTTPS"**
4. 点击 **Save**

### 2️⃣ 阿里云 DNS 配置（5分钟）

1. 登录 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 进入 **域名** → **域名解析**
3. 找到 `gonghejian.cn`，点击 **解析设置**
4. 点击 **添加记录**，填写：

```
记录类型: CNAME
主机记录: @
记录值: gonghejian.github.io
TTL: 10分钟
```

5. 再添加一条（可选，用于 www 子域名）：

```
记录类型: CNAME
主机记录: www
记录值: gonghejian.github.io
TTL: 10分钟
```

6. 点击 **确认** 保存

### 3️⃣ 提交配置更改

```bash
git add _config.yml CNAME
git commit -m "配置自定义域名 gonghejian.cn"
git push origin main
```

### 4️⃣ 等待生效

- **DNS 生效**：10分钟 - 48小时（通常 10-30 分钟）
- **HTTPS 证书**：几分钟到几小时（GitHub 自动生成）

### 5️⃣ 验证

1. 使用 [DNS Checker](https://dnschecker.org/) 检查 DNS 解析
2. 访问 `https://gonghejian.cn` 测试
3. 检查 GitHub Pages 设置中的证书状态

---

## ✅ 配置检查清单

- [ ] GitHub Pages 设置中已添加 `gonghejian.cn`
- [ ] 已勾选 "Enforce HTTPS"
- [ ] `_config.yml` 中 `url` 已更新为 `https://gonghejian.cn`
- [ ] `CNAME` 文件存在且内容为 `gonghejian.cn`
- [ ] 阿里云 DNS 已添加 CNAME 记录
- [ ] DNS 记录值正确（`gonghejian.github.io`）
- [ ] 已提交并推送更改

---

## 🔍 验证 DNS 是否生效

### 方法 1: 在线工具
访问 https://dnschecker.org/
- 输入域名：`gonghejian.cn`
- 选择记录类型：`CNAME`
- 查看是否解析到 `gonghejian.github.io`

### 方法 2: 命令行
```bash
# Windows
nslookup gonghejian.cn

# macOS/Linux
dig gonghejian.cn CNAME
```

---

## ⚠️ 常见问题

### DNS 未生效？
- 等待 10-30 分钟（最长 48 小时）
- 检查记录值是否正确
- 清除本地 DNS 缓存

### HTTPS 证书未生成？
- 等待 GitHub 自动生成（几小时）
- 确认 DNS 已生效
- 在 Pages 设置中重新保存域名

### 网站无法访问？
- 检查 DNS 是否生效
- 确认 GitHub Pages 部署成功
- 清除浏览器缓存

---

详细配置指南请查看：`DOMAIN_SETUP.md`


