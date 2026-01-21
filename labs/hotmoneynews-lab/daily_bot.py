"""
daily_bot.py

AI 搞钱项目分析器（最小闭环版）

你要的流程（一步到位可见结果）：
1) 抓取 Hacker News RSS（默认用 feedparser；没有就用 requests + xml 解析）
2) 过滤关键词：Show HN（通常是新项目发布/展示）
3) 调用 DeepSeek API（openai 兼容客户端）做“毒辣创业教练”分析：
   - 它怎么赚钱？
   - 普通人如何低成本模仿？
4) 在脚本所在目录生成 README.md（先看结果，再迭代成博客/站点结构）

环境变量：DEEPSEEK_API_KEY（通过 os.getenv('DEEPSEEK_API_KEY') 读取）

用法示例：
  python daily_bot.py --limit 8
  python daily_bot.py --dry-run --limit 5
  python daily_bot.py --keyword "Show HN" --rss-url "https://news.ycombinator.com/rss"
"""

from __future__ import annotations

import argparse
import importlib
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timezone


DEFAULT_RSS_URL = "https://news.ycombinator.com/rss"
DEFAULT_KEYWORD = "Show HN"
DEFAULT_MODEL = "deepseek-chat"
DEFAULT_DATA_FILENAME = "data.json"


def log(msg: str) -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"[daily_bot] {ts} - {msg}", flush=True)


def _try_import_requests():
    try:
        import requests  # type: ignore

        return requests
    except Exception:
        return None


def _require_openai() -> None:
    try:
        importlib.import_module("openai")
    except ImportError:
        print("Missing dependency: openai\n  pip install openai", file=sys.stderr)
        raise SystemExit(1)


def _try_import_feedparser():
    try:
        import feedparser  # type: ignore

        return feedparser
    except Exception:
        return None


@dataclass(frozen=True)
class HNItem:
    title: str
    link: str
    summary: str
    published: str = ""


def _extract_href_from_html(html: str) -> str:
    """
    HN RSS 的 description 常见是：<a href="https://news.ycombinator.com/item?id=...">Comments</a>
    """
    m = re.search(r'href="([^"]+)"', html or "", flags=re.I)
    return (m.group(1) if m else "").strip()


def _strip_html(s: str) -> str:
    # 足够满足当前 RSS 的简单 description（不引入第三方依赖）
    return re.sub(r"<[^>]+>", "", s or "").strip()


def _domain_of(url: str) -> str:
    try:
        return urllib.parse.urlparse(url).netloc.replace("www.", "")
    except Exception:
        return ""


def fetch_hn_rss_items(rss_url: str) -> list[HNItem]:
    """
    优先 feedparser；如果不可用/解析失败，回退到 requests + xml.etree.ElementTree。
    """
    feedparser = _try_import_feedparser()
    if feedparser is not None:
        log(f"使用 feedparser 抓取 RSS：{rss_url}")
        feed = feedparser.parse(rss_url)
        if getattr(feed, "bozo", False) and not getattr(feed, "entries", None):
            log(f"feedparser 解析异常（bozo）：{getattr(feed, 'bozo_exception', None)!r}，将回退 requests")
        else:
            items: list[HNItem] = []
            for e in getattr(feed, "entries", []) or []:
                title = (getattr(e, "title", "") or "").strip()
                link = (getattr(e, "link", "") or "").strip()
                summary = (
                    (getattr(e, "summary", "") or getattr(e, "description", "") or "").strip()
                )
                published = (getattr(e, "published", "") or "").strip()
                if title and link:
                    items.append(HNItem(title=title, link=link, summary=summary, published=published))
            if items:
                log(f"Parsed RSS items: {len(items)}")
                return items
            log("feedparser returned 0 items; falling back")

    requests = _try_import_requests()

    user_agent = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )

    if requests is not None:
        log(f"Fetching RSS via requests: {rss_url}")
        resp = requests.get(
            rss_url,
            headers={"User-Agent": user_agent},
            timeout=30,
        )
        resp.raise_for_status()
        rss_text = resp.text
    else:
        log(f"Fetching RSS via urllib (requests not installed): {rss_url}")
        req = urllib.request.Request(rss_url, headers={"User-Agent": user_agent})
        with urllib.request.urlopen(req, timeout=30) as r:
            rss_text = r.read().decode("utf-8", errors="replace")

    # 尽量用最朴素的 RSS2 解析：<rss><channel><item>...
    try:
        root = ET.fromstring(rss_text)
    except Exception as e:
        raise RuntimeError(f"RSS XML 解析失败：{e!r}")

    items: list[HNItem] = []
    channel = root.find("channel")
    if channel is None:
        # 有些 RSS 可能是 Atom；这里先不复杂处理，直接报错提醒换源
        raise RuntimeError("未找到 <channel>，可能不是 RSS2 格式；建议安装 feedparser 或更换 RSS 源。")

    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        summary = (item.findtext("description") or "").strip()
        published = (item.findtext("pubDate") or "").strip()
        if title and link:
            items.append(HNItem(title=title, link=link, summary=summary, published=published))

    log(f"Parsed RSS items: {len(items)}")
    return items


def filter_items_by_keyword(items: list[HNItem], keyword: str) -> list[HNItem]:
    k = (keyword or "").strip().lower()
    if not k:
        return items

    result = [it for it in items if k in it.title.lower() or k in it.summary.lower()]

    # 去重（按 link）
    dedup: dict[str, HNItem] = {}
    for it in result:
        dedup[it.link] = it
    return list(dedup.values())


def get_deepseek_client():
    _require_openai()
    openai_mod = importlib.import_module("openai")
    OpenAI = getattr(openai_mod, "OpenAI")

    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        print("Missing env var: DEEPSEEK_API_KEY", file=sys.stderr)
        raise SystemExit(1)

    log("Init DeepSeek OpenAI-compatible client")
    return OpenAI(base_url="https://api.deepseek.com", api_key=api_key)


def analyze_project(client, item: HNItem, model: str) -> str:
    """
    Prompt（按你的要求）：
    “你是一个毒辣的创业教练。请分析这个项目：1. 它怎么赚钱？2. 普通人如何低成本模仿？”
    """
    system = "你是一个毒辣的创业教练。"
    user = (
        "请分析这个项目：\n"
        f"标题：{item.title}\n"
        f"链接：{item.link}\n"
        f"摘要：{(item.summary or '').strip()}\n\n"
        "1. 它怎么赚钱？\n"
        "2. 普通人如何低成本模仿？\n"
        "要求：中文输出，条理清晰，直接给可执行建议（用 Markdown 列表）。"
    )

    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        temperature=0.4,
    )
    return (resp.choices[0].message.content or "").strip()


def build_readme(
    items: list[HNItem],
    analyses: dict[str, str],
    rss_url: str,
    keyword: str,
    model: str,
    dry_run: bool,
) -> str:
    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    lines: list[str] = []
    lines.append("# Hot Money News Lab - Daily Bot")
    lines.append("")
    lines.append(f"生成时间：{now_utc}")
    lines.append("")
    lines.append("## 这个工具做了什么")
    lines.append("")
    lines.append("- 从 Hacker News RSS 抓取最新条目")
    lines.append(f"- 过滤关键词：`{keyword}`（通常是新项目发布）")
    if dry_run:
        lines.append("- 本次为 `--dry-run`：不会调用 DeepSeek，只产出抓取与结构化结果")
    else:
        lines.append(f"- 调用 DeepSeek（`openai` 兼容）模型：`{model}`，输出“毒辣创业教练”式变现&模仿建议")
    lines.append("- 将结果写入本目录下的 `README.md`")
    lines.append("")
    lines.append("## 数据源")
    lines.append("")
    lines.append(f"- RSS：`{rss_url}`")
    lines.append(f"- 数据文件：`{DEFAULT_DATA_FILENAME}`（给网页 / 小程序 / App 使用）")
    lines.append("")
    lines.append("## 今日抓取结果")
    lines.append("")

    if not items:
        lines.append("> 没有抓到任何匹配条目。可以尝试增大 RSS 范围或换 RSS 源。")
        lines.append("")
        return "\n".join(lines)

    items_sorted = sorted(items, key=lambda x: x.published or "", reverse=True)

    for idx, it in enumerate(items_sorted, start=1):
        lines.append(f"### {idx}. {it.title}")
        lines.append("")
        lines.append(f"- 链接：{it.link}")
        if it.published:
            lines.append(f"- 时间：{it.published}")
        if it.summary:
            lines.append(f"- 摘要：{it.summary}")
        lines.append("")
        lines.append("#### 分析（毒辣创业教练）")
        lines.append("")
        lines.append(analyses.get(it.link, "- （无内容）").strip() or "- （无内容）")
        lines.append("")

    return "\n".join(lines)


def write_text(path: str, content: str) -> None:
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        if not content.endswith("\n"):
            f.write("\n")


def write_json(path: str, data: object) -> None:
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="AI 搞钱项目分析器（HN Show HN RSS -> DeepSeek -> README.md）")
    p.add_argument("--rss-url", default=DEFAULT_RSS_URL, help="HN RSS 地址")
    p.add_argument("--keyword", default=DEFAULT_KEYWORD, help="过滤关键词（默认 Show HN）")
    p.add_argument("--limit", type=int, default=10, help="最多分析多少条（默认 10）")
    p.add_argument("--model", default=DEFAULT_MODEL, help="DeepSeek 模型名（默认 deepseek-chat）")
    p.add_argument("--sleep", type=float, default=0.3, help="每次模型调用间隔秒数（默认 0.3）")
    p.add_argument(
        "--out",
        default="",
        help="输出 README.md 路径（默认写到脚本所在目录）",
    )
    p.add_argument(
        "--data-out",
        default="",
        help=f"输出 {DEFAULT_DATA_FILENAME} 路径（默认写到脚本所在目录）",
    )
    p.add_argument("--dry-run", action="store_true", help="不调用 DeepSeek，仅生成结构化 README")
    return p.parse_args(argv)


def run(argv: list[str]) -> int:
    args = parse_args(argv)

    out_path = args.out.strip()
    if not out_path:
        out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "README.md")

    data_out_path = args.data_out.strip()
    if not data_out_path:
        data_out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), DEFAULT_DATA_FILENAME)

    log("Start daily bot")
    log(f"RSS: {args.rss_url}")
    log(f"Keyword: {args.keyword!r}")
    log(f"Limit: {args.limit}")
    log(f"Output: {out_path}")
    log(f"Data: {data_out_path}")
    if args.dry_run:
        log("Mode: dry-run (DeepSeek disabled)")

    items = fetch_hn_rss_items(args.rss_url)
    items = filter_items_by_keyword(items, args.keyword)

    if args.limit and args.limit > 0:
        items = items[: args.limit]

    log(f"Matched items: {len(items)}")

    analyses: dict[str, str] = {}
    client = None
    if not args.dry_run and items:
        client = get_deepseek_client()

    for i, it in enumerate(items, start=1):
        log(f"[{i}/{len(items)}] {it.title}")
        if args.dry_run:
            analyses[it.link] = "- （dry-run）未调用 DeepSeek API。"
            continue

        try:
            analyses[it.link] = analyze_project(client, it, args.model)
        except Exception as e:
            analyses[it.link] = f"- （调用失败）{e!r}"

        if args.sleep and args.sleep > 0:
            time.sleep(args.sleep)

    # 结构化数据：给 Web / 小程序 / App 共用
    now_utc_iso = datetime.now(timezone.utc).isoformat()
    items_sorted = sorted(items, key=lambda x: x.published or "", reverse=True)
    data = {
        "schema": "hotmoneynews-lab/v1",
        "generated_at_utc": now_utc_iso,
        "source": {"rss_url": args.rss_url, "keyword": args.keyword},
        "ai": {"model": args.model, "enabled": (not args.dry_run)},
        "items": [
            {
                "rank": idx,
                "title": it.title,
                "url": it.link,
                "domain": _domain_of(it.link),
                "published": it.published,
                "hn_comments_url": _extract_href_from_html(it.summary),
                "summary_html": it.summary,
                "summary_text": _strip_html(it.summary),
                "analysis_md": analyses.get(it.link, "").strip(),
            }
            for idx, it in enumerate(items_sorted, start=1)
        ],
    }

    readme = build_readme(
        items=items,
        analyses=analyses,
        rss_url=args.rss_url,
        keyword=args.keyword,
        model=args.model,
        dry_run=args.dry_run,
    )
    write_text(out_path, readme)
    write_json(data_out_path, data)
    log("README.md written")
    log(f"{DEFAULT_DATA_FILENAME} written")
    return 0


def main() -> None:
    raise SystemExit(run(sys.argv[1:]))


if __name__ == "__main__":
    main()

