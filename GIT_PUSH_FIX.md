# 🔧 Git Push 连接问题解决方案

## 错误信息
```
fatal: unable to access 'https://github.com/gonghejian/gonghejian.github.io.git/': 
Recv failure: Connection was reset
```

## ✅ 已完成的配置

我已经为你配置了以下设置：
- ✅ 增加 HTTP 缓冲区大小
- ✅ 设置低速度限制

## 🚀 解决方案

### 方法 1: 重试推送（推荐先试这个）

```bash
git push origin main
```

如果还是失败，继续尝试下面的方法。

### 方法 2: 使用 SSH 代替 HTTPS（推荐）

如果经常遇到连接问题，建议切换到 SSH：

```bash
# 1. 检查是否已有 SSH 密钥
ls ~/.ssh/id_rsa.pub

# 如果没有，生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 2. 复制公钥内容
cat ~/.ssh/id_rsa.pub

# 3. 在 GitHub 添加 SSH 密钥
# Settings → SSH and GPG keys → New SSH key

# 4. 更改远程地址为 SSH
git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git

# 5. 测试连接
ssh -T git@github.com

# 6. 推送
git push origin main
```

### 方法 3: 配置代理（如果使用代理）

```bash
# 设置 HTTP 代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# 取消代理（如果需要）
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 方法 4: 分批推送（如果文件很大）

```bash
# 先推送少量文件
git push origin main --verbose

# 如果文件太大，可以分批提交
```

### 方法 5: 使用 GitHub CLI（备选）

```bash
# 安装 GitHub CLI
# 然后使用
gh repo sync
```

## 🔍 诊断步骤

### 1. 检查网络连接

```bash
# 测试 GitHub 连接
ping github.com

# 测试 HTTPS 连接
curl -I https://github.com
```

### 2. 检查 Git 配置

```bash
# 查看当前配置
git config --list | grep http

# 查看远程地址
git remote -v
```

### 3. 尝试小文件测试

```bash
# 创建一个测试文件
echo "test" > test.txt
git add test.txt
git commit -m "test"
git push origin main
```

## 💡 快速修复命令

如果只是临时网络问题，可以尝试：

```bash
# 方法 A: 增加重试次数
git config --global http.postBuffer 524288000
git push origin main

# 方法 B: 使用详细模式查看具体错误
git push origin main --verbose

# 方法 C: 强制使用 IPv4
git config --global http.version HTTP/1.1
git push origin main
```

## ⚠️ 常见原因

1. **网络不稳定**：网络连接中断
2. **防火墙/代理**：公司网络或代理设置
3. **文件太大**：推送的文件超过限制
4. **GitHub 服务问题**：GitHub 临时故障

## 🎯 推荐方案

**最佳方案：使用 SSH**

SSH 连接更稳定，不受 HTTPS 连接重置影响：

```bash
# 1. 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 添加 SSH 密钥到 GitHub
# 复制 ~/.ssh/id_ed25519.pub 内容
# 在 GitHub: Settings → SSH and GPG keys → New SSH key

# 3. 更改远程地址
git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git

# 4. 测试并推送
ssh -T git@github.com
git push origin main
```

## 📝 如果还是不行

1. **检查 GitHub 状态**：https://www.githubstatus.com/
2. **尝试不同时间**：避开网络高峰期
3. **使用 VPN**：如果网络受限
4. **联系网络管理员**：如果在公司网络

---

**现在可以尝试：**
```bash
git push origin main
```

如果还是失败，告诉我具体错误信息，我会继续帮你解决。

