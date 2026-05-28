from __future__ import annotations

import html
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "whitepapers" / "ai-personal-system.md"
HTML_OUT = ROOT / "content" / "whitepapers" / "ai-personal-system-pdf.html"


def strip_front_matter(text: str) -> str:
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return text[end + 5 :]
    return text


def skip_editor_notes(lines: list[str]) -> list[str]:
    start = 0
    for i, line in enumerate(lines):
        if line.startswith("## 第 1 页"):
            start = i
            break
    return lines[start:]


def inline(text: str) -> str:
    text = html.escape(text.strip())
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    return text


def md_blocks_to_html(lines: list[str]) -> str:
    out: list[str] = []
    list_open = False
    quote_open = False
    code_open = False
    code_lines: list[str] = []

    def close_list() -> None:
        nonlocal list_open
        if list_open:
            out.append("</ul>")
            list_open = False

    def close_quote() -> None:
        nonlocal quote_open
        if quote_open:
            out.append("</blockquote>")
            quote_open = False

    def close_code() -> None:
        nonlocal code_open, code_lines
        if code_open:
            out.append("<pre><code>" + html.escape("\n".join(code_lines)) + "</code></pre>")
            code_open = False
            code_lines = []

    for raw in lines:
        line = raw.rstrip()

        if line.startswith("```"):
            if code_open:
                close_code()
            else:
                close_list()
                close_quote()
                code_open = True
                code_lines = []
            continue

        if code_open:
            code_lines.append(line)
            continue

        if not line.strip():
            close_list()
            close_quote()
            continue

        if line.startswith("> "):
            close_list()
            if not quote_open:
                out.append("<blockquote>")
                quote_open = True
            out.append(f"<p>{inline(line[2:])}</p>")
            continue

        if line.startswith("- "):
            close_quote()
            if not list_open:
                out.append("<ul>")
                list_open = True
            out.append(f"<li>{inline(line[2:])}</li>")
            continue

        close_list()
        close_quote()

        if line.startswith("### "):
            out.append(f"<h3>{inline(line[4:])}</h3>")
        elif line.startswith("## "):
            out.append(f"<h2>{inline(clean_page_title(line[3:]))}</h2>")
        elif line.startswith("# "):
            out.append(f"<h1>{inline(line[2:])}</h1>")
        elif line == "---":
            out.append('<hr class="soft-rule">')
        else:
            out.append(f"<p>{inline(line)}</p>")

    close_code()
    close_list()
    close_quote()
    return "\n".join(out)


def split_pages(lines: list[str]) -> list[tuple[str, list[str]]]:
    pages: list[tuple[str, list[str]]] = []
    current_title = ""
    current: list[str] = []

    page_heading = re.compile(r"^## (第 \d+ 页|结语|附录)")
    for line in lines:
        if page_heading.match(line):
            if current:
                pages.append((current_title, current))
            current_title = line[3:].strip()
            current = [line]
        else:
            current.append(line)
    if current:
        pages.append((current_title, current))
    return pages


def clean_page_title(title: str) -> str:
    title = title.strip()
    match = re.match(r"第\s*\d+\s*页[：:]\s*(.+)$", title)
    if match:
        return match.group(1).strip()
    return title


def build_cover_html() -> str:
    return """
<div class="cover-panel">
  <div class="cover-label">WHITEPAPER 2026 / GONGHEJIAN.CN</div>
  <h1>AI 时代<br>个人系统<br>白皮书</h1>
  <p class="deck">写给中高端职场人与专业创造者的 20 页行动手册</p>
  <div class="cover-meta">
    <span>弓箭</span>
    <span>Draft 0.2</span>
    <span>Personal System</span>
  </div>
  <p class="cover-line">在 AI 时代，训练一种新的个人能力。</p>
  <blockquote>
    <p>当普通执行被 AI 压缩，当组织不再天然提供安全感，一个人如何把经验、知识、判断和交付能力，整理成一套可以长期运转的个人系统。</p>
  </blockquote>
</div>
<div class="cover-number">20</div>
"""


def build_toc_html(pages: list[tuple[str, list[str]]]) -> str:
    items = []
    for idx, (title, _page_lines) in enumerate(pages[:20], start=1):
        items.append(
            f'<li><span>{idx:02d}</span><strong>{inline(clean_page_title(title))}</strong></li>'
        )
    return f"""
<h2>目录</h2>
<p class="lead">这份白皮书按“判断 - 职业 - 行业 - 行动”的顺序展开。先建立共同框架，再让不同职业和行业找到自己的落点。</p>
<ol class="toc-list">
{chr(10).join(items)}
</ol>
<div class="toc-note">
  <strong>阅读方式</strong>
  <p>先读第 1-6 页理解框架，再跳到与你职业和行业最接近的章节，最后用自检表和 90 天路线启动行动。</p>
</div>
"""


def section_class(title: str, index: int) -> str:
    classes = ["sheet"]
    if index == 0:
        classes.append("cover")
    if "自检表" in title:
        classes.append("worksheet")
    if "90 天" in title:
        classes.append("timeline")
    if "公开表达" in title:
        classes.append("channels")
    if "从内容到产品" in title:
        classes.append("product")
    if title.startswith("结语"):
        classes.append("closing")
    if title.startswith("附录"):
        classes.append("appendix")
    return " ".join(classes)


def build_html() -> str:
    text = strip_front_matter(SOURCE.read_text(encoding="utf-8"))
    lines = skip_editor_notes(text.splitlines())
    pages = split_pages(lines)

    sections = []
    for idx, (title, page_lines) in enumerate(pages):
        body = build_cover_html() if idx == 0 else md_blocks_to_html(page_lines)
        kicker = "AI Personal System Whitepaper"
        page_no = f"{idx + 1:02d}"
        sections.append(
            f"""<section class="{section_class(title, idx)}">
  <div class="page-mark">{page_no}</div>
  <div class="kicker">{kicker}</div>
  <div class="content">
{body}
  </div>
  <footer>gonghejian.cn / 在 AI 时代，训练一种新的个人能力</footer>
</section>"""
        )
        if idx == 0:
            sections.append(
                f"""<section class="sheet toc">
  <div class="page-mark">TOC</div>
  <div class="kicker">AI Personal System Whitepaper</div>
  <div class="content">
{build_toc_html(pages)}
  </div>
  <footer>gonghejian.cn / 在 AI 时代，训练一种新的个人能力</footer>
</section>"""
            )

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI 时代个人系统白皮书</title>
  <style>
{PDF_CSS}
  </style>
</head>
<body>
{chr(10).join(sections)}
</body>
</html>
"""


PDF_CSS = r"""
@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #e8ebed;
  color: #111111;
  font-family: "Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", "Source Han Sans SC", Arial, sans-serif;
}

body {
  counter-reset: page;
}

.sheet {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  padding: 26mm 20mm 18mm 26mm;
  margin: 0 auto;
  overflow: hidden;
  break-after: page;
  page-break-after: always;
  background:
    linear-gradient(90deg, rgba(30, 111, 140, 0.07) 0, rgba(30, 111, 140, 0.07) 1px, transparent 1px),
    linear-gradient(180deg, #ffffff 0%, #fbfaf6 100%);
  background-size: 12mm 12mm, auto;
}

.sheet::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 8mm;
  height: 100%;
  background: #111111;
}

.sheet::after {
  content: "";
  position: absolute;
  top: 0;
  left: 8mm;
  width: 54mm;
  height: 4.2mm;
  background: #1e6f8c;
}

.kicker,
footer,
.page-mark {
  position: absolute;
  z-index: 2;
  color: #6e7478;
  font-size: 8.5pt;
  letter-spacing: 0.02em;
}

.kicker {
  top: 13mm;
  left: 26mm;
  font-family: "Segoe UI", Arial, sans-serif;
  text-transform: uppercase;
}

.page-mark {
  top: 12mm;
  right: 20mm;
  color: #1e6f8c;
  font-size: 18pt;
  font-weight: 800;
}

footer {
  left: 26mm;
  right: 20mm;
  bottom: 12mm;
  padding-top: 4mm;
  border-top: 1px solid #d9dddf;
}

.content {
  position: relative;
  z-index: 1;
}

h1,
h2,
h3,
p,
ul,
blockquote,
pre {
  margin-top: 0;
}

h1 {
  max-width: 142mm;
  margin-bottom: 9mm;
  color: #101010;
  font-size: 34pt;
  line-height: 1.08;
  font-weight: 760;
}

h2 {
  max-width: 146mm;
  margin-bottom: 7.5mm;
  color: #101010;
  font-size: 23pt;
  line-height: 1.22;
  font-weight: 740;
}

h2::after {
  content: "";
  display: block;
  width: 18mm;
  height: 1.2mm;
  margin-top: 5mm;
  background: #d9a441;
}

h3 {
  margin: 6mm 0 2.5mm;
  color: #0b465c;
  font-size: 12.5pt;
  line-height: 1.35;
  font-weight: 700;
}

p {
  margin-bottom: 3.8mm;
  color: #2f3335;
  font-size: 10.1pt;
  line-height: 1.72;
}

ul {
  display: grid;
  gap: 2mm;
  margin: 3mm 0 5mm;
  padding: 0;
  list-style: none;
}

li {
  position: relative;
  padding: 2.5mm 3.2mm 2.5mm 7.2mm;
  border: 1px solid rgba(30, 111, 140, 0.16);
  border-left: 3px solid #1e6f8c;
  background: rgba(255, 255, 255, 0.78);
  color: #2b3033;
  font-size: 9.6pt;
  line-height: 1.58;
  break-inside: avoid;
}

li::before {
  content: "";
  position: absolute;
  top: 4.3mm;
  left: 2.5mm;
  width: 2mm;
  height: 2mm;
  background: #d9a441;
}

blockquote {
  margin: 5mm 0;
  padding: 5mm 6mm 5mm 7mm;
  border: 1px solid #e0d7bf;
  border-left: 4px solid #d9a441;
  background: rgba(250, 246, 235, 0.88);
  break-inside: avoid;
}

blockquote p {
  margin-bottom: 2mm;
  color: #151515;
  font-size: 13pt;
  line-height: 1.62;
  font-weight: 640;
}

pre {
  margin: 4mm 0 6mm;
  padding: 4mm;
  white-space: pre-wrap;
  border: 1px solid #d4dcdf;
  background: #102027;
  color: #f3f7f8;
  font-size: 8.5pt;
  line-height: 1.55;
  border-radius: 2mm;
}

code {
  font-family: Consolas, "SF Mono", monospace;
}

.sheet:not(.cover):not(.toc) .content {
  columns: 2;
  column-gap: 10mm;
}

.sheet:not(.cover):not(.toc) h2 {
  column-span: all;
}

.sheet:not(.cover):not(.toc) h3,
.sheet:not(.cover):not(.toc) ul,
.sheet:not(.cover):not(.toc) blockquote,
.sheet:not(.cover):not(.toc) pre {
  break-inside: avoid;
}

.sheet:not(.cover):not(.toc) h2 + p,
.sheet:not(.cover):not(.toc) .lead {
  column-span: all;
  max-width: 142mm;
  color: #1c2428;
  font-size: 11.4pt;
  line-height: 1.7;
}

.soft-rule {
  display: none;
}

.cover {
  padding: 24mm 20mm 18mm 24mm;
  background:
    linear-gradient(110deg, #111111 0 34%, transparent 34%),
    linear-gradient(135deg, rgba(30, 111, 140, 0.16), transparent 48%),
    linear-gradient(180deg, #ffffff 0%, #f7f6ef 100%);
}

.cover::before {
  width: 8mm;
  height: 100%;
  background: #d9a441;
}

.cover::after {
  left: auto;
  right: -26mm;
  top: auto;
  bottom: 18mm;
  width: 104mm;
  height: 104mm;
  border: 1px solid rgba(17, 17, 17, 0.18);
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(13deg);
}

.cover .kicker,
.cover footer {
  color: rgba(255, 255, 255, 0.68);
}

.cover footer {
  border-top-color: rgba(255, 255, 255, 0.25);
}

.cover-panel {
  position: relative;
  z-index: 2;
  width: 126mm;
  min-height: 174mm;
  padding: 16mm 12mm 12mm;
  background: #ffffff;
  box-shadow: 0 14mm 34mm rgba(10, 20, 25, 0.12);
}

.cover-label {
  margin-bottom: 11mm;
  color: #1e6f8c;
  font-size: 9pt;
  font-family: "Segoe UI", Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.cover h1 {
  max-width: 102mm;
  margin: 0 0 7mm;
  color: #0b0b0b;
  font-size: 34pt;
  line-height: 1.12;
  letter-spacing: 0;
}

.cover .deck {
  max-width: 94mm;
  margin: 0 0 7mm;
  color: #1e6f8c;
  font-size: 12.8pt;
  line-height: 1.5;
  font-weight: 720;
}

.cover-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4mm;
  margin: 0 0 10mm;
}

.cover-meta span {
  display: inline-flex;
  align-items: center;
  min-height: 9mm;
  padding: 0 3.5mm;
  border: 1px solid #ccd7db;
  background: rgba(255, 255, 255, 0.72);
  color: #2d3538;
  font-size: 9pt;
  font-weight: 650;
}

.cover .cover-line {
  position: static;
  max-width: 94mm;
  margin: 0 0 7mm;
  color: #111111;
  font-size: 12.5pt;
  line-height: 1.78;
  font-weight: 650;
}

.cover blockquote {
  position: static;
  width: auto;
  margin: 0;
  background: #faf6eb;
  box-shadow: none;
}

.cover-number {
  position: absolute;
  z-index: 1;
  right: 18mm;
  top: 48mm;
  color: rgba(30, 111, 140, 0.16);
  font-size: 124pt;
  line-height: 1;
  font-weight: 900;
}

.cover .page-mark {
  display: none;
}

.toc {
  background:
    linear-gradient(90deg, rgba(30, 111, 140, 0.06) 0, rgba(30, 111, 140, 0.06) 1px, transparent 1px),
    linear-gradient(180deg, #ffffff 0%, #f8f7f2 100%);
  background-size: 12mm 12mm, auto;
}

.toc h2 {
  font-size: 34pt;
}

.toc .lead {
  max-width: 142mm;
  color: #283237;
  font-size: 12pt;
  line-height: 1.75;
}

.toc-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 3mm;
  margin: 10mm 0 8mm;
  padding: 0;
  list-style: none;
}

.toc-list li {
  display: grid;
  grid-template-columns: 12mm minmax(0, 1fr);
  gap: 3mm;
  align-items: center;
  min-height: 15mm;
  padding: 3mm;
  border: 1px solid #d9dddf;
  background: rgba(255, 255, 255, 0.86);
}

.toc-list li::before {
  display: none;
}

.toc-list span {
  color: #1e6f8c;
  font-size: 12pt;
  font-weight: 800;
}

.toc-list strong {
  color: #111111;
  font-size: 10pt;
  line-height: 1.35;
}

.toc-note {
  display: grid;
  grid-template-columns: 26mm minmax(0, 1fr);
  gap: 5mm;
  padding: 5mm 6mm;
  border-left: 4px solid #d9a441;
  background: #f7f2e7;
}

.toc-note strong {
  color: #111111;
  font-size: 12pt;
}

.toc-note p {
  margin: 0;
  color: #303638;
}

.worksheet ul,
.timeline ul,
.channels ul,
.product ul {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.3mm;
}

.worksheet li,
.timeline li,
.channels li,
.product li {
  min-height: 12mm;
  border: 1px solid #d7dde0;
  border-left: 3px solid #1e6f8c;
  background: rgba(255, 255, 255, 0.78);
}

.appendix {
  background:
    linear-gradient(135deg, rgba(217, 164, 65, 0.11), transparent 48%),
    linear-gradient(180deg, #ffffff 0%, #faf9f4 100%);
}

.closing h2 {
  margin-top: 18mm;
  font-size: 30pt;
}

@media screen {
  .sheet {
    margin: 16px auto;
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.14);
  }
}
"""


def main() -> None:
    HTML_OUT.write_text(build_html(), encoding="utf-8")
    print(HTML_OUT)


if __name__ == "__main__":
    main()
