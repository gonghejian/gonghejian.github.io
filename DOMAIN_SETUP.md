# 🌐 域名配置指南 - gonghejian.cn

本指南将帮助你将阿里云域名 `gonghejian.cn` 指向 GitHub Pages 网站。

## 📋 前置条件

- ✅ 已拥有域名 `gonghejian.cn`（阿里云）
- ✅ GitHub Pages 网站已正常部署
- ✅ 仓库名称：`gonghejian.github.io`（或你的仓库名）

## 🔧 配置步骤

### 步骤 1: 更新 GitHub Pages 配置

#### 1.1 在 GitHub 仓库中设置自定义域名

1. 进入你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Custom domain** 部分：
   - 输入域名：`gonghejian.cn`
   - 勾选 **"Enforce HTTPS"**（强制 HTTPS）
   - 点击 **Save**（保存）

#### 1.2 更新 _config.yml 配置

编辑 `_config.yml` 文件，更新 `url` 字段：

```yaml
url: "https://gonghejian.cn"
baseurl: ""
```

**重要**：确保使用 `https://` 协议。

---

### 步骤 2: 配置阿里云 DNS

#### 2.1 登录阿里云控制台

1. 访问 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 登录你的账号
3. 进入 **域名** → **域名解析**

#### 2.2 添加 DNS 记录

找到你的域名 `gonghejian.cn`，点击 **解析设置**，添加以下记录：

##### 方法一：使用 CNAME 记录（推荐）

| 记录类型 | 主机记录 | 记录值 | TTL | 说明 |
|---------|---------|--------|-----|------|
| CNAME | @ | gonghejian.github.io | 600 | 主域名 |
| CNAME | www | gonghejian.github.io | 600 | www 子域名 |

**说明**：
- **主机记录** `@` 表示主域名 `gonghejian.cn`
- **主机记录** `www` 表示 `www.gonghejian.cn`
- **记录值** 填写你的 GitHub Pages 地址（格式：`username.github.io`）
- **TTL** 建议设置为 600 秒（10分钟）

##### 方法二：使用 A 记录（备选）

如果 CNAME 不工作，可以使用 A 记录指向 GitHub Pages 的 IP 地址：

| 记录类型 | 主机记录 | 记录值 | TTL | 说明 |
|---------|---------|--------|-----|------|
| A | @ | 185.199.108.153 | 600 | GitHub Pages IP 1 |
| A | @ | 185.199.109.153 | 600 | GitHub Pages IP 2 |
| A | @ | 185.199.110.153 | 600 | GitHub Pages IP 3 |
| A | @ | 185.199.111.153 | 600 | GitHub Pages IP 4 |
| CNAME | www | gonghejian.github.io | 600 | www 子域名 |

**注意**：GitHub Pages 的 IP 地址可能会变化，建议优先使用 CNAME 记录。

---

### 步骤 3: 验证 CNAME 文件

确保项目根目录有 `CNAME` 文件，内容为：

```
gonghejian.cn
```

**检查方法**：
```bash
cat CNAME
```

应该显示：`gonghejian.cn`

---

### 步骤 4: 提交并推送更改

```bash
# 更新 _config.yml
git add _config.yml CNAME

# 提交更改
git commit -m "配置自定义域名 gonghejian.cn"

# 推送到 GitHub
git push origin main
```

---

### 步骤 5: 等待 DNS 生效

1. **DNS 传播时间**：通常需要 10 分钟到 48 小时
2. **检查 DNS 解析**：
   - 使用 [DNS Checker](https://dnschecker.org/) 检查全球 DNS 解析
   - 输入域名 `gonghejian.cn`，选择 CNAME 记录类型
   - 查看是否解析到 `gonghejian.github.io`

3. **本地测试**：
   ```bash
   # Windows
   nslookup gonghejian.cn
   
   # macOS/Linux
   dig gonghejian.cn
   ```

---

### 步骤 6: 验证 HTTPS 证书

1. 等待 GitHub 自动生成 SSL 证书（通常需要几分钟到几小时）
2. 在 GitHub 仓库的 **Settings** → **Pages** 中查看证书状态
3. 当显示 **"Certificate is valid"** 时，HTTPS 已启用

---

## ✅ 验证配置

### 检查清单

- [ ] GitHub Pages 设置中已添加自定义域名
- [ ] `_config.yml` 中的 `url` 已更新为 `https://gonghejian.cn`
- [ ] `CNAME` 文件存在且内容正确
- [ ] 阿里云 DNS 已添加 CNAME 记录
- [ ] DNS 记录已生效（可通过 DNS Checker 验证）
- [ ] GitHub 已生成 SSL 证书
- [ ] 可以通过 `https://gonghejian.cn` 访问网站

### 测试访问

1. **清除浏览器缓存**（重要！）
   - Windows: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`

2. **使用无痕模式访问**
   - 访问 `https://gonghejian.cn`
   - 访问 `https://www.gonghejian.cn`

3. **检查 HTTPS**
   - 确保浏览器显示锁图标
   - 确保 URL 以 `https://` 开头

---

## 🔍 故障排除

### 问题 1: 域名无法访问

**可能原因**：
- DNS 记录未生效
- DNS 记录配置错误
- GitHub Pages 未正确配置

**解决方案**：
1. 检查 DNS 记录是否正确
2. 使用 DNS Checker 验证解析
3. 确认 GitHub Pages 设置中的域名正确
4. 等待 DNS 传播完成（最长 48 小时）

### 问题 2: HTTPS 证书未生成

**可能原因**：
- DNS 未完全生效
- 域名配置不正确

**解决方案**：
1. 确认 DNS 记录已生效
2. 在 GitHub Pages 设置中重新保存域名
3. 等待 GitHub 自动生成证书（可能需要几小时）

### 问题 3: www 子域名无法访问

**解决方案**：
1. 在阿里云 DNS 中添加 `www` 的 CNAME 记录
2. 在 GitHub Pages 设置中添加 `www.gonghejian.cn`（可选）

### 问题 4: 网站显示 GitHub 404 页面

**可能原因**：
- `_config.yml` 中的 `url` 配置错误
- `baseurl` 配置错误

**解决方案**：
1. 检查 `_config.yml`：
   ```yaml
   url: "https://gonghejian.cn"
   baseurl: ""
   ```
2. 重新构建和部署网站

---

## 📝 DNS 记录配置示例（阿里云）

### 完整配置示例

```
记录类型: CNAME
主机记录: @
记录值: gonghejian.github.io
TTL: 600
优先级: -（CNAME 无优先级）

记录类型: CNAME
主机记录: www
记录值: gonghejian.github.io
TTL: 600
优先级: -
```

### 阿里云控制台操作步骤

1. 登录 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 进入 **产品与服务** → **域名** → **域名解析**
3. 找到域名 `gonghejian.cn`，点击 **解析设置**
4. 点击 **添加记录**
5. 填写记录信息：
   - **记录类型**：选择 `CNAME`
   - **主机记录**：输入 `@`（主域名）或 `www`（子域名）
   - **记录值**：输入 `gonghejian.github.io`
   - **TTL**：选择 `10分钟`（600秒）
6. 点击 **确认** 保存

---

## 🔐 HTTPS 配置

### 自动 HTTPS

GitHub Pages 会自动为自定义域名生成 SSL 证书，无需手动配置。

### 强制 HTTPS

1. 在 GitHub 仓库的 **Settings** → **Pages** 中
2. 勾选 **"Enforce HTTPS"**
3. 保存设置

**注意**：只有在证书生成后才能启用强制 HTTPS。

---

## 📚 相关资源

- [GitHub Pages 自定义域名文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [阿里云 DNS 解析文档](https://help.aliyun.com/product/29697.html)
- [DNS Checker](https://dnschecker.org/) - 检查 DNS 解析

---

## ⚠️ 重要提示

1. **DNS 传播时间**：DNS 更改可能需要 10 分钟到 48 小时才能在全球生效
2. **SSL 证书**：GitHub 会自动生成证书，通常需要几分钟到几小时
3. **不要删除 CNAME 文件**：CNAME 文件必须保留在仓库中
4. **HTTPS 强制**：建议启用强制 HTTPS，提升安全性
5. **定期检查**：定期检查 DNS 记录和证书状态

---

## ✅ 配置完成检查

配置完成后，你应该能够：

- ✅ 通过 `https://gonghejian.cn` 访问网站
- ✅ 通过 `https://www.gonghejian.cn` 访问网站（如果配置了）
- ✅ 浏览器显示 HTTPS 锁图标
- ✅ GitHub Pages 设置中显示 "Certificate is valid"

---

*最后更新：2026-01-04*
*域名：gonghejian.cn*


