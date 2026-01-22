# Obsidian 到 Jekyll 博客文章对接指南

## 📋 方案概览

### 方案 1：Obsidian 插件（推荐）⭐
使用 Obsidian 插件自动转换和发布文章

### 方案 2：自动化脚本
使用 Python/PowerShell 脚本批量转换

### 方案 3：手动转换模板
快速手动添加 Front Matter

### 方案 4：其他工具
使用其他 Markdown 编辑器

---

## 🚀 方案 1：Obsidian 插件（最推荐）

### 1.1 使用 "Jekyll Post" 插件

**安装步骤：**
1. 打开 Obsidian → 设置 → 第三方插件
2. 搜索 "Jekyll Post" 或 "Jekyll"
3. 安装并启用插件

**配置：**
- 设置输出目录为你的 `_posts` 文件夹路径
- 配置 Front Matter 模板

### 1.2 使用 "Templater" + 自定义模板

**安装 Templater 插件：**
1. 安装 Templater 插件
2. 创建模板文件

**创建模板：**
在 Obsidian 中创建模板文件 `Jekyll Post Template.md`：

```yaml
---
layout: post
title: "{{title}}"
date: {{date:YYYY-MM-DD}} {{time:HH:mm:ss}} +0800
categories: [分类]
tags: [标签1, 标签2]
author: {{author}}
description: "{{description}}"
---

{{content}}
```

**使用方法：**
1. 在 Obsidian 中创建新笔记
2. 使用 Templater 插入模板
3. 填写 Front Matter
4. 复制到 `_posts` 目录，文件名格式：`YYYY-MM-DD-title.md`

---

## 🤖 方案 2：自动化脚本（批量转换）

### 2.1 Python 脚本

创建 `obsidian-to-jekyll.py`：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Obsidian 笔记转 Jekyll 文章脚本
使用方法：python obsidian-to-jekyll.py "笔记标题" "分类" "标签1,标签2"
"""

import sys
import os
from datetime import datetime
import re

def create_jekyll_post(title, category, tags, obsidian_file=None):
    """创建 Jekyll 文章"""
    
    # 生成文件名（去除特殊字符）
    safe_title = re.sub(r'[^\w\s-]', '', title).strip()
    safe_title = re.sub(r'[-\s]+', '-', safe_title)
    
    # 生成日期
    date_str = datetime.now().strftime("%Y-%m-%d")
    time_str = datetime.now().strftime("%H:%M:%S")
    
    # 生成文件名
    filename = f"{date_str}-{safe_title}.md"
    filepath = os.path.join("_posts", filename)
    
    # Front Matter
    front_matter = f"""---
layout: post
title: "{title}"
date: {date_str} {time_str} +0800
categories: [{category}]
tags: [{tags}]
author: {os.getenv('USERNAME', 'Your Name')}
---

"""
    
    # 如果有 Obsidian 文件，读取内容
    content = ""
    if obsidian_file and os.path.exists(obsidian_file):
        with open(obsidian_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 移除 Obsidian 的 Front Matter（如果有）
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                content = parts[2].strip()
    
    # 写入文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(front_matter + content)
    
    print(f"✅ 文章已创建：{filepath}")
    return filepath

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("使用方法：")
        print("  python obsidian-to-jekyll.py \"标题\" \"分类\" \"标签1,标签2\" [obsidian文件路径]")
        print("\n示例：")
        print("  python obsidian-to-jekyll.py \"我的第一篇文章\" \"lifestyle\" \"生活,思考\"")
        sys.exit(1)
    
    title = sys.argv[1]
    category = sys.argv[2]
    tags = sys.argv[3] if len(sys.argv) > 3 else ""
    obsidian_file = sys.argv[4] if len(sys.argv) > 4 else None
    
    create_jekyll_post(title, category, tags, obsidian_file)
```

### 2.2 PowerShell 脚本

创建 `obsidian-to-jekyll.ps1`：

```powershell
# Obsidian 转 Jekyll 文章脚本
param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Category,
    
    [Parameter(Mandatory=$false)]
    [string]$Tags = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ObsidianFile = ""
)

# 生成安全文件名
$safeTitle = $Title -replace '[^\w\s-]', '' -replace '\s+', '-'
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm:ss"
$filename = "$date-$safeTitle.md"
$filepath = Join-Path "_posts" $filename

# Front Matter
$frontMatter = @"
---
layout: post
title: "$Title"
date: $date $time +0800
categories: [$Category]
tags: [$Tags]
author: $env:USERNAME
---

"@

# 读取 Obsidian 文件内容（如果有）
$content = ""
if ($ObsidianFile -and (Test-Path $ObsidianFile)) {
    $content = Get-Content $ObsidianFile -Raw -Encoding UTF8
    
    # 移除 Obsidian Front Matter
    if ($content -match '^---.*?---\s*(.*)$') {
        $content = $matches[1]
    }
}

# 写入文件
$fullContent = $frontMatter + $content
$fullContent | Out-File -FilePath $filepath -Encoding UTF8

Write-Host "✅ 文章已创建：$filepath" -ForegroundColor Green
```

**使用方法：**
```powershell
.\obsidian-to-jekyll.ps1 -Title "我的文章" -Category "lifestyle" -Tags "生活,思考" -ObsidianFile "path/to/obsidian.md"
```

---

## 📝 方案 3：手动转换模板

### 3.1 快速模板

在 Obsidian 中创建笔记后，复制以下模板到文件开头：

```yaml
---
layout: post
title: "你的文章标题"
date: 2026-01-XX 10:00:00 +0800
categories: [分类]
tags: [标签1, 标签2]
author: 你的名字
description: "文章描述"
---

你的文章内容...
```

### 3.2 分类对照表

根据你的 `_config.yml`，可用分类：
- `reading` - 阅读笔记
- `lifestyle` - 生活方式
- `efficiency` - 效率工具

---

## 🔧 方案 4：其他工具

### 4.1 Typora
- 支持 Front Matter
- 可以直接编辑 Markdown
- 支持导出

### 4.2 Mark Text
- 开源 Markdown 编辑器
- 支持 Front Matter
- 实时预览

### 4.3 VS Code + 插件
- Markdown All in One
- Jekyll Support
- Front Matter

---

## 🎯 推荐工作流

### 最佳实践流程：

1. **在 Obsidian 中写作**
   - 使用 Obsidian 的链接、标签等功能
   - 专注于内容创作

2. **使用脚本转换**
   - 运行 Python/PowerShell 脚本
   - 自动添加 Front Matter
   - 转换 Obsidian 链接格式（如果需要）

3. **复制到 `_posts` 目录**
   - 文件名格式：`YYYY-MM-DD-title.md`
   - 确保 Front Matter 正确

4. **本地预览**
   ```powershell
   bundle exec jekyll serve
   ```

5. **提交并推送**
   ```powershell
   git add _posts/
   git commit -m "添加新文章：标题"
   git push
   ```

---

## 📌 注意事项

### Obsidian 特有语法转换

1. **内部链接**
   - Obsidian: `[[文章标题]]`
   - Jekyll: `[文章标题](/path/to/article)`

2. **标签**
   - Obsidian: `#标签`
   - Jekyll: 在 Front Matter 中使用 `tags: [标签]`

3. **图片路径**
   - Obsidian: `![[image.png]]`
   - Jekyll: `![alt](/assets/images/image.png)`

### 文件名要求

- 格式：`YYYY-MM-DD-title.md`
- 只能包含字母、数字、连字符
- 不能有空格和特殊字符

---

## 🚀 快速开始

1. **选择方案**：推荐方案 2（自动化脚本）
2. **运行脚本**：使用提供的 Python 或 PowerShell 脚本
3. **预览效果**：`bundle exec jekyll serve`
4. **发布**：推送到 GitHub

---

## 💡 提示

- 可以在 Obsidian 中创建模板，快速生成 Front Matter
- 使用脚本批量转换多篇文章
- 保持 Obsidian 作为主要写作工具，Jekyll 作为发布平台
- 定期同步，避免内容丢失
