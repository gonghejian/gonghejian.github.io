# 社交媒体链接配置指南

## 📍 配置位置

所有社交媒体链接都在 `_config.yml` 文件中的 `social` 部分配置。

## 🔧 如何配置

### 1. 打开配置文件

找到项目根目录下的 `_config.yml` 文件，找到以下部分：

```yaml
# 社交媒体
social:
  zhihu: https://www.zhihu.com/people/your-username
  xiaohongshu: https://www.xiaohongshu.com/user/profile/your-id
  douban: https://www.douban.com/people/your-username
  wechat: https://mp.weixin.qq.com/your-account
```

### 2. 获取各平台链接

#### 📘 知乎（Zhihu）

1. 访问你的知乎个人主页：`https://www.zhihu.com/people/你的用户名`
2. 复制浏览器地址栏的完整链接
3. 将链接粘贴到 `_config.yml` 中的 `zhihu:` 后面

**示例：**
```yaml
zhihu: https://www.zhihu.com/people/gonghejian
```

#### 📕 小红书（Xiaohongshu）

1. 打开小红书 App 或网页版
2. 进入你的个人主页
3. 复制浏览器地址栏的完整链接
4. 将链接粘贴到 `_config.yml` 中的 `xiaohongshu:` 后面

**示例：**
```yaml
xiaohongshu: https://www.xiaohongshu.com/user/profile/5f8a9b2c3d4e5f6a7b8c9d0
```

#### 🟢 豆瓣（Douban）

1. 访问你的豆瓣个人主页：`https://www.douban.com/people/你的用户名`
2. 复制浏览器地址栏的完整链接
3. 将链接粘贴到 `_config.yml` 中的 `douban:` 后面

**示例：**
```yaml
douban: https://www.douban.com/people/gonghejian
```

#### 💬 微信公众号（WeChat）

有两种方式：

**方式一：公众号主页链接**
```yaml
wechat: https://mp.weixin.qq.com/s/你的文章链接
```

**方式二：二维码图片链接**
1. 将公众号二维码图片上传到 `assets/images/` 目录
2. 使用相对路径：
```yaml
wechat: /assets/images/wechat-qrcode.jpg
```

### 3. 完整配置示例

```yaml
# 社交媒体
social:
  github: gonghejian
  email: your.email@example.com
  zhihu: https://www.zhihu.com/people/gonghejian
  xiaohongshu: https://www.xiaohongshu.com/user/profile/5f8a9b2c3d4e5f6a7b8c9d0
  douban: https://www.douban.com/people/gonghejian
  wechat: https://mp.weixin.qq.com/s/your-article-link
```

### 4. 隐藏不需要的平台

如果某个平台你不想显示，有两种方式：

**方式一：删除该行**
直接删除不需要的平台配置行

**方式二：留空或注释**
```yaml
# zhihu:  # 已注释，不会显示
xiaohongshu: https://www.xiaohongshu.com/user/profile/your-id
```

## 🎨 图标说明

- **知乎**：蓝色背景，白色问号图标
- **小红书**：红色背景，白色音符图标
- **豆瓣**：绿色背景，白色豆子图标
- **微信公众号**：微信绿色，对话气泡图标

所有图标都采用圆角矩形设计，与网站整体风格保持一致。

## 📝 注意事项

1. **必须使用完整 URL**：链接必须以 `https://` 或 `http://` 开头
2. **链接格式**：确保链接格式正确，不要有多余的空格
3. **保存后生效**：修改 `_config.yml` 后，需要重新构建网站才能看到效果
4. **本地预览**：使用 `bundle exec jekyll serve` 预览效果
5. **部署更新**：修改后推送到 GitHub，GitHub Pages 会自动更新

## 🔍 如何验证配置

1. 修改 `_config.yml` 文件
2. 运行本地预览：`bundle exec jekyll serve`
3. 访问 `http://localhost:4000`
4. 在首页查看社交媒体图标是否正确显示
5. 点击图标测试链接是否正确跳转

## ❓ 常见问题

**Q: 图标不显示怎么办？**
A: 检查 `_config.yml` 中的链接格式是否正确，确保以 `https://` 开头。

**Q: 如何添加其他社交媒体平台？**
A: 需要在 `index.html` 中添加对应的 HTML 代码，并更新 `_config.yml`。

**Q: 图标颜色可以自定义吗？**
A: 可以，修改 `index.html` 中 SVG 的 `fill` 属性即可。

**Q: 链接打不开怎么办？**
A: 检查链接是否正确，确保链接是公开可访问的。

## 📞 需要帮助？

如果遇到问题，请检查：
1. `_config.yml` 文件格式是否正确（YAML 语法）
2. 链接是否完整且可访问
3. 是否重新构建了网站
4. 浏览器控制台是否有错误信息


