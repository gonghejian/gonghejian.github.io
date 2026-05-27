# 快速发布文章指南

## 🚀 最快方式：使用脚本

### PowerShell 脚本（Windows）

```powershell
# 从 Obsidian 文件转换
.\obsidian-to-jekyll.ps1 -Title "文章标题" -Category "lifestyle" -Tags "生活,思考" -ObsidianFile "path/to/obsidian.md"

# 创建新文章（无 Obsidian 文件）
.\obsidian-to-jekyll.ps1 -Title "新文章" -Category "reading" -Tags "阅读"
```

### Python 脚本（跨平台）

```bash
# 从 Obsidian 文件转换
python obsidian-to-jekyll.py "文章标题" "lifestyle" "生活,思考" "path/to/obsidian.md"

# 创建新文章
python obsidian-to-jekyll.py "新文章" "reading" "阅读"
```

---

## 📝 可用分类

根据 `_config.yml` 配置，可用分类：

- `reading` - 阅读笔记
- `lifestyle` - 生活方式  
- `efficiency` - 效率工具

---

## ⚡ 快速工作流

1. **在 Obsidian 中写作**
   - 正常使用 Obsidian 的所有功能
   - 使用 `#标签` 和 `[[链接]]`

2. **运行转换脚本**
   ```powershell
   .\obsidian-to-jekyll.ps1 -Title "标题" -Category "分类" -Tags "标签" -ObsidianFile "obsidian文件路径"
   ```

3. **预览效果**
   ```powershell
   bundle exec jekyll serve
   ```
   访问 http://localhost:4000

4. **提交发布**
   ```powershell
   git add _posts/
   git commit -m "添加新文章"
   git push
   ```

---

## 💡 提示

- 脚本会自动转换 Obsidian 语法到 Jekyll 格式
- 文件名会自动生成：`YYYY-MM-DD-title.md`
- 如果文件已存在，会提示是否覆盖
- 可以批量转换多个文件

---

## 🔧 自定义

编辑脚本可以：
- 修改默认作者名
- 添加更多 Front Matter 字段
- 自定义文件命名规则
- 添加更多 Obsidian 语法转换
