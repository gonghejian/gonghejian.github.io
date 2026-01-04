# 🎨 Favicon 设置指南

## ✅ 已完成的配置

Favicon 已配置完成，现在只需要将你的 favicon.ico 文件放在正确的位置即可。

## 📁 文件位置

将 `favicon.ico` 文件放在项目**根目录**（与 `_config.yml` 同级）：

```
gonghejian.github.io/
├── _config.yml
├── favicon.ico  ← 放在这里
├── index.html
├── CNAME
└── ...
```

## 🔧 配置说明

### 1. HTML 配置

已在 `_layouts/default.html` 中添加了以下 favicon 链接：

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="{{ '/favicon.ico' | relative_url }}">
<link rel="shortcut icon" type="image/x-icon" href="{{ '/favicon.ico' | relative_url }}">
<link rel="apple-touch-icon" href="{{ '/favicon.ico' | relative_url }}">
```

### 2. Jekyll 配置

已在 `_config.yml` 的 `include` 中添加了 `favicon.ico`，确保文件会被包含在构建中：

```yaml
include:
  - assets
  - CNAME
  - favicon.ico
```

## 📝 使用步骤

1. **将 favicon.ico 文件放到根目录**
   - 确保文件名是 `favicon.ico`（小写）
   - 文件应该在项目根目录，与 `_config.yml` 同级

2. **验证文件位置**
   ```
   gonghejian.github.io/
   ├── favicon.ico  ← 应该在这里
   ├── _config.yml
   └── ...
   ```

3. **提交并推送**
   ```bash
   git add favicon.ico
   git commit -m "添加网站 favicon"
   git push origin main
   ```

4. **清除浏览器缓存**
   - 按 `Ctrl + Shift + Delete`（Windows）或 `Cmd + Shift + Delete`（Mac）
   - 清除缓存后刷新页面查看效果

## 🎯 Favicon 要求

- **文件格式**：`.ico`（推荐）或 `.png`
- **文件大小**：建议 16x16、32x32 或 48x48 像素
- **文件位置**：项目根目录
- **文件名**：`favicon.ico`（小写，标准命名）

## 🔍 验证方法

1. **本地测试**
   - 启动 Jekyll 服务器：`bundle exec jekyll serve`
   - 访问 `http://localhost:4000`
   - 查看浏览器标签页是否显示图标

2. **在线验证**
   - 部署后访问网站
   - 查看浏览器标签页图标
   - 使用在线工具验证：https://realfavicongenerator.net/favicon_checker

## 📚 相关资源

- [Favicon Generator](https://realfavicongenerator.net/) - 生成多平台 favicon
- [Favicon 最佳实践](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#linking_to_favicons)

---

**注意**：如果使用 `.png` 格式，需要修改 `_layouts/default.html` 中的 `type` 属性为 `image/png`。

