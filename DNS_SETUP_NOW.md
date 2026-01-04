# DNS 验证记录配置 - 立即操作指南

## ✅ 你已获得验证码

GitHub 提供的验证码：
```
c0845ec6e3899530cdfa2bd0a7f327
```

## 🚀 立即配置步骤

### 步骤 1：登录阿里云控制台

1. 访问：https://ecs.console.aliyun.com/
2. 登录你的阿里云账号

### 步骤 2：进入域名解析

1. 在控制台顶部搜索框输入：**域名**
2. 点击 **域名** → **域名解析 DNS**
3. 找到你的域名：`gonghejian.cn`
4. 点击 **解析设置** 或 **添加记录**

### 步骤 3：添加 TXT 验证记录

点击 **添加记录**，填写以下信息：

| 字段 | 值 |
|------|-----|
| **记录类型** | `TXT` |
| **主机记录** | `_github-pages-challenge-gonghejian` |
| **记录值** | `c0845ec6e3899530cdfa2bd0a7f327` |
| **TTL** | `600`（或默认值） |

**重要提示：**
- 主机记录必须完全匹配：`_github-pages-challenge-gonghejian`（注意下划线和连字符）
- 记录值就是你刚才获得的验证码
- TTL 可以设置为 600 秒（10分钟）或使用默认值

### 步骤 4：保存并等待

1. 点击 **确认** 或 **保存**
2. 等待 **5-30 分钟** 让 DNS 记录生效

### 步骤 5：在 GitHub 中验证

1. 回到 GitHub 仓库：`https://github.com/gonghejian/gonghejian.github.io/settings/pages`
2. 在 **Custom domain** 输入框输入：`gonghejian.cn`
3. 点击 **Save**
4. GitHub 会自动检测 TXT 记录

## 🔍 验证 DNS 是否生效

### 方法一：使用命令行（Windows PowerShell）

```powershell
nslookup -type=TXT _github-pages-challenge-gonghejian.gonghejian.cn
```

如果看到你的验证码，说明 DNS 已生效。

### 方法二：使用在线工具

访问：https://dnschecker.org/

1. 选择 **TXT Record**
2. 输入：`_github-pages-challenge-gonghejian.gonghejian.cn`
3. 点击 **Search**
4. 如果看到你的验证码，说明 DNS 已生效

## ⏱️ 时间线

- **DNS 记录添加**：立即完成
- **DNS 传播**：5-30 分钟
- **GitHub 验证**：DNS 生效后自动验证（通常几分钟内）
- **HTTPS 证书**：验证成功后可能需要几分钟到几小时

## ✅ 成功标志

在 GitHub Pages 设置页面，你会看到：

1. ✅ 域名旁边显示绿色勾号
2. ✅ 显示 "DNS check successful" 或类似提示
3. ✅ **Enforce HTTPS** 选项可用（可能需要等待证书生成）

## ⚠️ 常见问题

### Q1: 添加记录后，GitHub 还是提示错误

**解决方案：**
1. 等待更长时间（最多 30 分钟）
2. 使用 nslookup 检查 DNS 是否生效
3. 确认主机记录完全正确（注意大小写和下划线）
4. 清除浏览器缓存后重试

### Q2: 找不到 "添加记录" 按钮

**解决方案：**
1. 确保你在正确的域名解析页面
2. 查找 **添加解析** 或 **添加记录** 按钮
3. 如果使用阿里云，路径是：域名 → 解析设置 → 添加记录

### Q3: 主机记录格式不对

**正确格式：**
```
_github-pages-challenge-gonghejian
```

**注意：**
- 开头是下划线 `_`
- 中间是连字符 `-`
- 结尾是你的 GitHub 用户名（gonghejian）
- 不要包含域名本身

### Q4: 验证成功后，网站还是打不开

**解决方案：**
1. 确保 `CNAME` 文件存在且内容为 `gonghejian.cn`
2. 确保 DNS 中有 CNAME 或 A 记录指向 GitHub Pages
3. 等待 HTTPS 证书生成（最多 24 小时）
4. 检查 `_config.yml` 中的 `url` 配置

## 📝 完整 DNS 配置清单

配置完 TXT 验证记录后，还需要确保有以下记录：

### 主域名 CNAME 记录

| 字段 | 值 |
|------|-----|
| **记录类型** | `CNAME` |
| **主机记录** | `@`（或留空） |
| **记录值** | `gonghejian.github.io` |
| **TTL** | `600` |

### www 子域名 CNAME 记录（可选）

| 字段 | 值 |
|------|-----|
| **记录类型** | `CNAME` |
| **主机记录** | `www` |
| **记录值** | `gonghejian.github.io` |
| **TTL** | `600` |

## 🎯 下一步

1. ✅ 添加 TXT 验证记录（使用你获得的验证码）
2. ⏳ 等待 5-30 分钟
3. 🔄 在 GitHub Pages 设置中保存域名
4. ✅ 等待验证成功
5. 🔒 启用 HTTPS（如果可用）

## 📞 需要帮助？

如果遇到问题：
1. 检查 DNS 记录是否正确
2. 使用 nslookup 验证 DNS 是否生效
3. 查看 GitHub Pages 设置页面的错误提示
4. 参考 `DOMAIN_VERIFY_FIX.md` 获取更多帮助

