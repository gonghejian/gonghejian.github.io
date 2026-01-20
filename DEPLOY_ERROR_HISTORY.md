# 📋 GitHub Pages 部署错误修复历史

本文档记录了在部署到 GitHub Pages 过程中遇到的所有错误及其修复过程。

---

## 🔴 错误 #1: jekyll-compress-html gem 不可用

### 错误信息
```
Could not find gem 'jekyll-compress-html (~> 3.0)' in rubygems repository
https://rubygems.org/ or installed locally.
Error: The process '/opt/hostedtoolcache/Ruby/3.1.7/x64/bin/bundle' failed with exit code 7
```

### 错误原因
- `jekyll-compress-html` gem 在 RubyGems 上不存在或版本不正确
- Gemfile 中引用了不可用的 gem

### 修复方案
1. **从 Gemfile 中移除** `jekyll-compress-html` gem
2. **从 _config.yml 中移除** 插件引用和配置

### 修复后的代码

**Gemfile:**
```ruby
# 之前：
gem "jekyll-compress-html", "~> 3.0"

# 修复后：
# jekyll-compress-html 插件在 RubyGems 上不可用，已移除
```

**_config.yml:**
```yaml
# 之前：
plugins:
  - jekyll-compress-html

compress_html:
  clippings: all
  comments: all
  # ...

# 修复后：
plugins:
  # jekyll-compress-html 插件已移除（RubyGems 上不可用）

# HTML 压缩配置已移除
```

### 修复时间
2026-01-04

---

## 🔴 错误 #2: 缺少 jekyll-paginate gem

### 错误信息
```
Deprecation: You appear to have pagination turned on, but you haven't included the `jekyll-paginate` gem. 
Ensure you have `plugins: [jekyll-paginate]` in your configuration file.
```

### 错误原因
- `_config.yml` 中配置了分页功能（`paginate: 10`）
- 但 Gemfile 中缺少 `jekyll-paginate` gem
- `_config.yml` 的 plugins 列表中也缺少该插件

### 修复方案
1. **在 Gemfile 中添加** `jekyll-paginate` gem
2. **在 _config.yml 的 plugins 中添加** `jekyll-paginate`

### 修复后的代码

**Gemfile:**
```ruby
# 添加：
gem "jekyll-paginate", "~> 1.1"
```

**_config.yml:**
```yaml
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-paginate  # 新增
```

### 修复时间
2026-01-04

---

## 🔴 错误 #3: 数字标签无法使用 slugify 过滤器

### 错误信息
```
Liquid Exception: undefined method `gsub' for 2026:Integer 
string.gsub(replaceable_char, "-") 
^^^^^ in /home/runner/work/gonghejian.github.io/gonghejian.github.io/_layouts/post.html

undefined method `gsub' for 2026:Integer (NoMethodError)
```

### 错误原因
- 文章标签中包含数字（如 `2026`）
- `slugify` 过滤器只能处理字符串类型
- 数字类型的标签直接传递给 `slugify` 导致错误

### 错误位置
`_layouts/post.html` 第 34 行

### 修复方案
在 `slugify` 之前先将标签转换为字符串

### 修复后的代码

**之前：**
```liquid
{% for tag in page.tags %}
<a href="{{ '/tags/' | relative_url }}{{ tag | slugify }}" class="tag-link">#{{ tag }}</a>
{% endfor %}
```

**修复后：**
```liquid
{% for tag in page.tags %}
{% assign tag_string = tag | append: '' %}
<a href="{{ '/tags/' | relative_url }}{{ tag_string | slugify }}" class="tag-link">#{{ tag }}</a>
{% endfor %}
```

### 修复说明
- 使用 `append: ''` 将标签值转换为字符串
- 使用 `assign` 创建新变量 `tag_string`
- 对字符串变量使用 `slugify` 过滤器

### 修复时间
2026-01-04

---

## 🔴 错误 #4: 重复的文章文件

### 错误信息
虽然没有直接报错，但发现存在重复文件：
- `2024-12-31-2026-reading.md`
- `2026-01-01-2026-reading.md`

### 错误原因
- 在修复日期问题时创建了重复文件
- 两个文件内容相同，但文件名不同

### 修复方案
删除重复的文件 `2026-01-01-2026-reading.md`，保留正确的文件 `2024-12-31-2026-reading.md`

### 修复时间
2026-01-04

---

## ✅ 最终修复总结

### 所有修复的文件

1. **Gemfile**
   - ✅ 移除 `jekyll-compress-html`
   - ✅ 添加 `jekyll-paginate`

2. **_config.yml**
   - ✅ 移除 `jekyll-compress-html` 插件引用
   - ✅ 添加 `jekyll-paginate` 插件
   - ✅ 移除 `compress_html` 配置块

3. **_layouts/post.html**
   - ✅ 修复数字标签的 `slugify` 问题

4. **文件清理**
   - ✅ 删除重复的文章文件

5. **.github/workflows/pages.yml**
   - ✅ 优化工作流配置
   - ✅ 添加明确的错误处理

### 当前配置状态

**Gemfile:**
```ruby
gem "jekyll", "~> 4.3"
gem "jekyll-feed", "~> 0.12"
gem "jekyll-sitemap", "~> 1.4"
gem "jekyll-seo-tag", "~> 2.8"
gem "jekyll-paginate", "~> 1.1"
```

**_config.yml plugins:**
```yaml
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-paginate
```

**标签处理:**
```liquid
{% assign tag_string = tag | append: '' %}
<a href="{{ '/tags/' | relative_url }}{{ tag_string | slugify }}" class="tag-link">#{{ tag }}</a>
```

---

## 📚 经验总结

### 常见问题类型

1. **Gem 依赖问题**
   - 检查 gem 是否在 RubyGems 上可用
   - 验证 gem 版本兼容性
   - 确保所有配置的插件都有对应的 gem

2. **类型转换问题**
   - Liquid 模板中注意数据类型
   - 数字需要转换为字符串才能使用某些过滤器
   - 使用 `append: ''` 或 `to_string` 进行转换

3. **配置一致性问题**
   - 确保 Gemfile 和 _config.yml 中的插件列表一致
   - 确保所有引用的插件都已安装

4. **文件管理问题**
   - 避免创建重复文件
   - 保持文件命名规范

### 调试技巧

1. **本地测试**
   ```bash
   bundle install
   bundle exec jekyll build
   ```

2. **查看详细错误**
   ```bash
   bundle exec jekyll build --trace
   ```

3. **检查配置语法**
   - 使用 YAML 验证器检查 _config.yml
   - 使用 Ruby 语法检查器检查 Gemfile

4. **查看 GitHub Actions 日志**
   - 进入 Actions 标签页
   - 查看失败的步骤
   - 展开查看详细错误信息

---

## 🎯 预防措施

### 部署前检查清单

- [ ] 所有 gem 都在 RubyGems 上可用
- [ ] Gemfile 和 _config.yml 中的插件列表一致
- [ ] 所有模板文件中的类型转换正确
- [ ] 没有重复文件
- [ ] 本地构建测试通过
- [ ] 工作流配置正确

### 最佳实践

1. **使用稳定的 gem 版本**
   - 避免使用 `~>` 过于宽松的版本约束
   - 定期更新 gem 版本

2. **类型安全**
   - 在使用过滤器前确保数据类型正确
   - 对不确定的类型进行显式转换

3. **配置验证**
   - 每次修改配置后本地测试
   - 使用版本控制跟踪配置变更

4. **文档记录**
   - 记录所有配置变更
   - 记录遇到的问题和解决方案

---

*最后更新：2026-01-04*
*文档版本：1.0*




