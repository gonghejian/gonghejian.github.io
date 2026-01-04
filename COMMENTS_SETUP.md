# 评论功能设置指南

本博客支持两种评论系统：**Utterances** 和 **Gitalk**，都基于 GitHub。

## 推荐：Utterances（更简单）

Utterances 是一个基于 GitHub Issues 的评论系统，无需服务器，完全免费。

### 设置步骤：

1. **安装 Utterances App**
   - 访问 https://github.com/apps/utterances
   - 点击 "Install" 安装到你的 GitHub 仓库
   - 选择要启用评论的仓库（通常是你的博客仓库）

2. **配置 `_config.yml`**
   
   在 `_config.yml` 中已经配置好了，只需要修改仓库名称：
   
   ```yaml
   comments:
     provider: utterances
     utterances:
       repo: yourusername/your-repo-name  # 修改为：用户名/仓库名
       issue_term: pathname  # 或使用 title, url, og:title
       theme: github-light  # 或 github-dark
   ```

3. **完成！**
   - 评论会自动创建 GitHub Issues
   - 访客需要使用 GitHub 账号登录才能评论

## 备选：Gitalk（需要 OAuth App）

Gitalk 也是基于 GitHub Issues，但需要创建 OAuth App。

### 设置步骤：

1. **创建 GitHub OAuth App**
   - 访问 https://github.com/settings/developers
   - 点击 "New OAuth App"
   - Application name: 填写应用名称
   - Homepage URL: 填写你的博客地址
   - Authorization callback URL: 填写你的博客地址
   - 点击 "Register application"
   - 记录下 Client ID 和 Client Secret

2. **配置 `_config.yml`**
   
   ```yaml
   comments:
     provider: gitalk
     gitalk:
       client_id: "你的 Client ID"
       client_secret: "你的 Client Secret"
       repo: "your-repo-name"  # 仓库名（不含用户名）
       owner: "yourusername"   # GitHub 用户名
       admin: ["yourusername"] # 管理员用户名（数组）
   ```

3. **修改 `_includes/comments.html`**
   
   将 `_config.yml` 中的 `comments.provider` 改为 `gitalk`

## 主题选择

Utterances 支持以下主题：
- `github-light` - 浅色主题（默认）
- `github-dark` - 深色主题
- `github-dark-orange` - 深色橙色主题
- `icy-dark` - 冰蓝深色主题
- `dark-blue` - 深蓝色主题
- `photon-dark` - Photon 深色主题

## 注意事项

1. **Utterances 需要公开仓库**：如果你的仓库是私有的，评论功能将无法使用
2. **首次评论**：访客首次评论时，需要授权 Utterances App 访问仓库
3. **Issue 标签**：Utterances 会自动创建 Issue，标签为 `comment`
4. **性能**：Utterances 是客户端加载，不会影响网站性能

## 测试

设置完成后，访问任意文章页面，滚动到底部，应该能看到评论框。如果看不到，请检查：
- GitHub App 是否已安装
- 仓库名称是否正确
- 浏览器控制台是否有错误信息

