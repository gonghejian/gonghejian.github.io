#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Obsidian 笔记转 Jekyll 文章脚本
使用方法：python obsidian-to-jekyll.py "标题" "分类" "标签1,标签2" [obsidian文件路径]
"""

import sys
import os
import re
from datetime import datetime
from pathlib import Path

def create_jekyll_post(title, category, tags="", obsidian_file=None, author=None, description=""):
    """创建 Jekyll 文章"""
    
    # 确保 _posts 目录存在
    posts_dir = Path("_posts")
    posts_dir.mkdir(exist_ok=True)
    
    # 生成文件名（去除特殊字符）
    safe_title = re.sub(r'[^\w\s-]', '', title).strip()
    safe_title = re.sub(r'[-\s]+', '-', safe_title)
    
    # 生成日期
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M:%S")
    
    # 生成文件名
    filename = f"{date_str}-{safe_title}.md"
    filepath = posts_dir / filename
    
    # 检查文件是否已存在
    if filepath.exists():
        overwrite = input(f"文件已存在: {filepath}\n是否覆盖？(y/n): ")
        if overwrite.lower() != 'y':
            print("已取消")
            return None
    
    # 读取 Obsidian 文件内容（如果有）
    content = ""
    if obsidian_file and os.path.exists(obsidian_file):
        print(f"读取 Obsidian 文件: {obsidian_file}")
        with open(obsidian_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 移除 Obsidian 的 Front Matter（如果有）
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                obsidian_fm = parts[1]
                content = parts[2].strip()
                
                # 尝试从 Obsidian Front Matter 提取信息
                if 'title:' in obsidian_fm:
                    match = re.search(r'title:\s*(.+)', obsidian_fm)
                    if match:
                        title = match.group(1).strip()
                if 'tags:' in obsidian_fm:
                    match = re.search(r'tags:\s*\[(.+)\]', obsidian_fm)
                    if match:
                        tags = match.group(1).strip()
                if 'description:' in obsidian_fm:
                    match = re.search(r'description:\s*(.+)', obsidian_fm)
                    if match:
                        description = match.group(1).strip()
        
        # 转换 Obsidian 内部链接格式 [[链接]] -> [链接](/path)
        content = re.sub(r'\[\[([^\]]+)\]\]', r'[\1](/posts/\1/)', content)
        
        # 转换 Obsidian 图片格式 ![[image.png]] -> ![alt](/assets/images/image.png)
        content = re.sub(r'!\[\[([^\]]+)\]\]', r'![\1](/assets/images/\1)', content)
    else:
        # 如果没有提供文件，创建空内容
        content = f"# {title}\n\n在这里开始写作...\n"
    
    # 构建 Front Matter
    front_matter = "---\n"
    front_matter += "layout: post\n"
    front_matter += f'title: "{title}"\n'
    front_matter += f"date: {date_str} {time_str} +0800\n"
    front_matter += f"categories: [{category}]\n"
    if tags:
        front_matter += f"tags: [{tags}]\n"
    if author:
        front_matter += f"author: {author}\n"
    elif os.getenv('USERNAME'):
        front_matter += f"author: {os.getenv('USERNAME')}\n"
    if description:
        front_matter += f'description: "{description}"\n'
    front_matter += "---\n\n"
    
    # 写入文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(front_matter + content)
    
    print(f"\n✅ 文章已创建：{filepath}")
    print(f"   标题: {title}")
    print(f"   分类: {category}")
    if tags:
        print(f"   标签: {tags}")
    print(f"\n下一步：")
    print(f"1. 编辑文章: code {filepath}")
    print(f"2. 预览: bundle exec jekyll serve")
    print(f"3. 提交: git add {filepath}")
    
    return str(filepath)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("使用方法：")
        print("  python obsidian-to-jekyll.py \"标题\" \"分类\" \"标签1,标签2\" [obsidian文件路径]")
        print("\n示例：")
        print("  python obsidian-to-jekyll.py \"我的第一篇文章\" \"lifestyle\" \"生活,思考\"")
        print("  python obsidian-to-jekyll.py \"我的文章\" \"reading\" \"阅读,笔记\" \"path/to/obsidian.md\"")
        sys.exit(1)
    
    title = sys.argv[1]
    category = sys.argv[2]
    tags = sys.argv[3] if len(sys.argv) > 3 else ""
    obsidian_file = sys.argv[4] if len(sys.argv) > 4 else None
    author = sys.argv[5] if len(sys.argv) > 5 else None
    description = sys.argv[6] if len(sys.argv) > 6 else ""
    
    create_jekyll_post(title, category, tags, obsidian_file, author, description)
