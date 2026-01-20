# 分类页面 404 问题修复

## 已完成的修复

### 1. 添加 permalink 配置
在 `categories.html` 的 front matter 中添加了：
```yaml
permalink: /categories/
```

### 2. 更新导航菜单 URL
在 `_config.yml` 中更新为：
```yaml
- title: 分类
  url: /categories/
```

### 3. 更新首页链接
在 `index.html` 中更新"查看更多"链接为：
```liquid
{{ '/categories/' | relative_url }}#{{ category.slug }}
```

## 验证方法

1. **本地测试**
   ```bash
   bundle exec jekyll serve
   ```
   访问：http://localhost:4000/categories/

2. **检查文件**
   - 确保 `categories.html` 文件存在
   - 确保文件有正确的 front matter
   - 确保 permalink 配置正确

3. **清除缓存**
   - 删除 `_site` 目录
   - 重新构建：`bundle exec jekyll build`

## 如果仍然 404

1. **检查 Jekyll 版本**
   ```bash
   bundle exec jekyll --version
   ```

2. **检查构建输出**
   ```bash
   bundle exec jekyll build --trace
   ```

3. **检查 _site 目录**
   - 查看 `_site/categories/index.html` 是否存在
   - 如果不存在，说明构建有问题

4. **尝试其他 URL 格式**
   - `/categories.html` (不带斜杠)
   - `/categories/` (带斜杠)
   - `/categories` (不带斜杠和扩展名)




