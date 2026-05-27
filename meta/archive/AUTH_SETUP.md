# 登录系统设置指南

本博客已集成登录系统，支持管理员和普通用户两种角色，可以使用 GitHub OAuth 或本地账号登录。

## 功能特性

- ✅ GitHub OAuth 登录
- ✅ 本地账号登录
- ✅ 用户角色管理（管理员/普通用户）
- ✅ 管理员面板
- ✅ 会话管理（24小时有效期）
- ✅ 权限控制

## 快速开始

### 1. 本地账号登录（无需配置）

系统已预设两个测试账号：

**管理员账号：**
- 用户名：`admin`
- 密码：`admin123`

**普通用户：**
- 用户名：`user`
- 密码：`user123`

直接访问 `/login.html` 即可使用这些账号登录。

### 2. GitHub OAuth 登录（需要配置）

#### 步骤 1：创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   - **Application name**: 你的博客名称
   - **Homepage URL**: `https://yourusername.github.io`（你的博客地址）
   - **Authorization callback URL**: `https://yourusername.github.io/auth/callback.html`
4. 点击 "Register application"
5. 记录下 **Client ID**（不需要 Client Secret，因为这是公开应用）

#### 步骤 2：配置 `_config.yml`

编辑 `_config.yml`，找到 `auth` 部分：

```yaml
auth:
  github:
    client_id: "你的_GitHub_Client_ID"  # 替换为你的 Client ID
    redirect_uri: "/auth/callback.html"
  admin_users:
    - "your-github-username"  # 替换为你的 GitHub 用户名（管理员）
  local_users:
    - username: "admin"
      password: "admin123"
      name: "管理员"
      role: "admin"
    - username: "user"
      password: "user123"
      name: "普通用户"
      role: "user"
```

#### 步骤 3：更新 JavaScript 配置

编辑 `assets/js/auth.js`，找到：

```javascript
this.githubClientId = 'YOUR_GITHUB_CLIENT_ID';
```

替换为你的 Client ID：

```javascript
this.githubClientId = '你的_GitHub_Client_ID';
```

## 用户角色

### 管理员（Admin）

管理员可以：
- 访问管理面板 (`/admin/`)
- 查看统计数据
- 管理用户
- 编辑文章（需要后端支持）
- 修改设置（需要后端支持）

### 普通用户（User）

普通用户可以：
- 登录系统
- 查看个人信息
- 发表评论（如果启用）

## 管理面板

访问 `/admin/` 可以进入管理面板，包含：

- **统计数据**：文章数、分类数、标签数、用户数
- **最近文章**：显示最新的文章列表
- **用户管理**：查看所有用户信息
- **快速操作**：新建文章、设置等

## 安全注意事项

⚠️ **重要提示**：

1. **本地用户密码**：当前版本使用明文密码存储，**仅用于演示**。生产环境应该：
   - 使用密码哈希（如 bcrypt）
   - 通过后端API验证
   - 使用 HTTPS

2. **GitHub OAuth**：完整实现需要后端API来交换 token，因为 `client_secret` 不能暴露在前端。当前版本是简化实现。

3. **会话管理**：当前使用 localStorage 存储会话，有效期24小时。生产环境应该：
   - 使用 HTTP-only cookies
   - 实现 token 刷新机制
   - 添加 CSRF 保护

## 自定义用户

### 添加本地用户

编辑 `_config.yml` 的 `auth.local_users` 部分：

```yaml
local_users:
  - username: "newuser"
    password: "newpassword"
    name: "新用户"
    role: "user"  # 或 "admin"
```

### 添加管理员

#### GitHub 用户

在 `_config.yml` 的 `auth.admin_users` 中添加：

```yaml
admin_users:
  - "your-github-username"
  - "another-admin-username"
```

#### 本地用户

将 `local_users` 中用户的 `role` 设置为 `admin`。

## 受保护的路由

当前受保护的页面：
- `/admin/` - 仅管理员可访问

如果需要保护其他页面，在页面中添加：

```javascript
if (typeof auth !== 'undefined') {
    if (!auth.protectRoute('admin')) {
        return; // 会重定向到登录页或首页
    }
}
```

## 测试

1. **测试本地登录**：
   - 访问 `/login.html`
   - 使用 `admin/admin123` 登录
   - 应该能看到"管理"链接

2. **测试管理员面板**：
   - 登录后访问 `/admin/`
   - 应该能看到统计数据和管理功能

3. **测试登出**：
   - 点击用户菜单中的"登出"
   - 应该返回首页并清除登录状态

## 故障排除

### GitHub 登录不工作

- 检查 Client ID 是否正确
- 检查回调 URL 是否匹配
- 检查浏览器控制台是否有错误

### 无法访问管理面板

- 确认已使用管理员账号登录
- 检查 `auth.admin_users` 配置
- 检查浏览器控制台是否有错误

### 会话过期太快

- 编辑 `assets/js/auth.js` 中的 `expiresAt` 计算
- 默认是24小时，可以修改为其他值

## 后续改进建议

1. **后端API集成**：实现真正的后端API来处理认证
2. **密码加密**：使用 bcrypt 等加密算法
3. **Token 刷新**：实现自动刷新 token 机制
4. **权限细化**：更细粒度的权限控制
5. **审计日志**：记录用户操作日志
6. **双因素认证**：增强安全性

## 技术支持

如有问题，请检查：
- 浏览器控制台错误信息
- `_config.yml` 配置是否正确
- GitHub OAuth App 设置是否正确

