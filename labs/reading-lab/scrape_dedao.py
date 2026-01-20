#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
简易抓取脚本：从得到「热门」页面抓取卡片信息，用于生成 books.json 草稿。

使用方法（在命令行中）：
1. cd 到项目根目录，例如：
   cd C:\Dev\gonghejian.github.io
2. 安装依赖：
   pip install requests beautifulsoup4
3. 运行脚本（可以替换为你想抓取的 URL）：
   python labs/reading-lab/scrape_dedao.py "https://www.dedao.cn/..."

脚本会在 labs/reading-lab/ 目录下生成：
   - dedao-books.json  抓取到的书籍信息（title、author、cover 等）

注意：
- 这是本地辅助工具，用来生成/更新 books.json 的草稿，不会在浏览器里运行。
- 得到页面结构如果有调整，下面的 CSS 选择器可能需要根据实际 HTML 做微调。
"""

import json
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup


def scrape_dedao(url: str):
    print(f"开始抓取页面: {url}")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )
    }
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # 下面的选择器是通用示例，实际需要根据得到页面的 HTML 结构微调：
    # 比如卡片容器可能是 class="product-card" 或类似结构。
    # 建议你打开浏览器开发者工具查看真实 class 名，再修改这里。
    cards = []

    # 尝试几种常见卡片容器选择器
    candidate_selectors = [
        "div[class*='ProductCard']",
        "div[class*='product-card']",
        "div[class*='card']",
    ]

    for selector in candidate_selectors:
        found = soup.select(selector)
        if len(found) > 5:  # 找到数量比较多时，认为命中
            cards = found
            print(f"使用选择器 {selector} 找到 {len(cards)} 个卡片节点")
            break

    if not cards:
        print("未能根据预设选择器找到足够的卡片节点，请查看 HTML 结构后微调脚本。")
        return []

    results = []
    for idx, card in enumerate(cards, start=1):
        # 封面图
        img = card.find("img")
        cover = ""
        if img and img.get("src"):
            cover = img["src"]

        # 标题
        title = ""
        title_el = (
            card.find("h3")
            or card.find("h2")
            or card.find("p", class_=lambda c: c and "title" in c)
        )
        if title_el:
            title = title_el.get_text(strip=True)

        # 作者或讲师（根据实际结构可能是另一个 class）
        author = ""
        author_el = card.find("p", class_=lambda c: c and ("author" in c or "teacher" in c))
        if author_el:
            author = author_el.get_text(strip=True)

        # 简介
        summary = ""
        summary_el = card.find("p", class_=lambda c: c and ("desc" in c or "summary" in c))
        if summary_el:
            summary = summary_el.get_text(strip=True)

        if not title and not cover:
            # 太空的卡片直接跳过
            continue

        book = {
            "id": f"dedao-{idx}",
            "title": title or f"得到热门 {idx}",
            "author": author or "得到 · 热门",
            "cover": cover,  # 后续建议手动下载到 covers/ 并改成本地路径
            "category": "得到热门",
            "year": None,
            "source": "得到热门",
            "url": url,
            "summary": summary,
        }
        results.append(book)

    return results


def main():
    if len(sys.argv) < 2:
        print("用法: python labs/reading-lab/scrape_dedao.py <得到热门页面URL>")
        sys.exit(1)

    url = sys.argv[1]
    try:
        books = scrape_dedao(url)
    except Exception as e:
        print(f"抓取过程中出错: {e}")
        sys.exit(1)

    if not books:
        print("未抓取到任何书籍数据。")
        sys.exit(0)

    out_path = Path(__file__).parent / "dedao-books.json"
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)

    print(f"已将 {len(books)} 条记录写入: {out_path}")
    print("下一步建议：")
    print("1. 打开 dedao-books.json，挑选你真正想放进灵感墙的书。")
    print("2. 手动下载封面图片到 labs/reading-lab/covers/ 目录，并把 cover 字段改成本地路径。")
    print("3. 将最终选定的数据合并进 books.json，供展示页使用。")


if __name__ == "__main__":
    main()




