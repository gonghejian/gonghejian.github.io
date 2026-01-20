# 私人微信添加功能配置指南

## 📍 功能说明

在网站底部添加了一个精美的微信添加按钮，包含：
- 💬 生动的邀请文案："想和我聊聊？"
- 👋 友好的描述文字
- 🎨 美观的微信绿色按钮设计
- ✨ 动画效果和交互反馈

## 🔧 配置方法

### 方式一：使用二维码图片链接（推荐）

1. **准备二维码图片**
   - 将你的微信二维码保存为图片（建议尺寸：300x300px 或更大）
   - 上传到 `assets/images/` 目录，命名为 `wechat-qrcode.jpg`（或 `.png`）

2. **配置 `_config.yml`**
   
   打开 `_config.yml`，找到 `social` 部分，添加：
   ```yaml
   social:
     # ... 其他配置 ...
     wechat_private: /assets/images/wechat-qrcode.jpg  # 二维码图片路径
   ```

3. **效果**
   - 点击按钮会打开二维码图片，用户可以扫码添加

### 方式二：使用微信号（复制到剪贴板）

1. **配置 `_config.yml`**
   
   ```yaml
   social:
     # ... 其他配置 ...
     wechat_id: your-wechat-id  # 你的微信号
   ```

2. **效果**
   - 点击按钮会自动复制微信号到剪贴板
   - 显示提示信息，用户可以在微信中搜索添加

### 方式三：使用在线二维码链接

如果你有在线二维码服务（如草料二维码），可以直接使用链接：

```yaml
social:
  wechat_private: https://your-qrcode-service.com/qrcode.jpg
```

## 📝 完整配置示例

```yaml
# 社交媒体
social:
  github: yourusername
  email: your.email@example.com
  zhihu: https://www.zhihu.com/people/your-username
  xiaohongshu: https://www.xiaohongshu.com/user/profile/your-id
  douban: https://www.douban.com/people/your-username
  wechat: https://mp.weixin.qq.com/your-account  # 微信公众号
  wechat_private: /assets/images/wechat-qrcode.jpg  # 私人微信二维码（推荐）
  wechat_id: your-wechat-id  # 私人微信号（可选，如果配置了会复制微信号）
```

## 🎨 自定义文案

如果你想修改邀请文案，可以编辑 `_includes/footer.html` 文件：

```html
<p class="wechat-title">💬 想和我聊聊？</p>
<p class="wechat-description">添加我的微信，一起分享生活、交流想法，或者只是简单打个招呼 👋</p>
```

可以改为：
- "💬 交个朋友吧！"
- "📱 想聊聊？加我微信"
- "🤝 一起交流，一起成长"
- 等等...

## 🎯 功能特点

1. **自动检测配置**
   - 如果配置了 `wechat_private`，按钮会链接到二维码
   - 如果只配置了 `wechat_id`，点击会复制微信号
   - 如果都没配置，会显示提示信息

2. **美观设计**
   - 微信绿色主题（#07C160）
   - 圆角按钮，带阴影效果
   - 悬停动画和点击反馈
   - 图标脉冲动画

3. **响应式设计**
   - 移动端自动调整布局
   - 图标和文字居中显示
   - 适配各种屏幕尺寸

## 📱 移动端优化

- 按钮在小屏幕上自动调整大小
- 图标和文字垂直排列
- 触摸友好的点击区域

## ❓ 常见问题

**Q: 如何生成微信二维码？**
A: 
1. 打开微信 -> 我 -> 设置 -> 个人信息 -> 我的二维码
2. 截图保存
3. 或者使用微信的"添加朋友" -> "我的二维码"功能

**Q: 二维码图片放在哪里？**
A: 建议放在 `assets/images/` 目录下，文件名可以是 `wechat-qrcode.jpg` 或 `wechat-qrcode.png`

**Q: 可以同时配置二维码和微信号吗？**
A: 可以，如果同时配置了 `wechat_private` 和 `wechat_id`，会优先使用二维码链接。

**Q: 如何测试功能？**
A: 
1. 配置完成后，运行 `bundle exec jekyll serve`
2. 访问 `http://localhost:4000`
3. 滚动到页面底部
4. 点击"添加微信"按钮测试

## 🔍 验证配置

配置完成后，检查：
1. ✅ 二维码图片路径正确
2. ✅ `_config.yml` 格式正确（注意缩进）
3. ✅ 重新构建网站（`bundle exec jekyll build`）
4. ✅ 在浏览器中查看效果

## 📞 需要帮助？

如果遇到问题：
1. 检查 `_config.yml` 语法是否正确
2. 确认图片路径是否正确
3. 查看浏览器控制台是否有错误
4. 确保重新构建了网站




