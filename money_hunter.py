import json
import os
import re
import sys
from datetime import datetime, timezone


def ensure_dependencies():
    missing = []
    try:
        import requests  # noqa: F401
    except ImportError:
        missing.append("requests")
    try:
        from bs4 import BeautifulSoup  # noqa: F401
    except ImportError:
        missing.append("beautifulsoup4")
    try:
        from openai import OpenAI  # noqa: F401
    except ImportError:
        missing.append("openai")

    if missing:
        print(
            "缺少依赖库，请先安装：\n"
            f"  pip install {' '.join(missing)}",
            file=sys.stderr,
        )
        sys.exit(1)


def log(msg):
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"[money_hunter] {ts} - {msg}", flush=True)


def fetch_today_page():
    import requests

    url = "https://www.producthunt.com/"
    log(f"开始抓取 Product Hunt 首页：{url}")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    log(f"抓取完成（HTTP {response.status_code}），长度：{len(response.text)}")
    return response.text


def extract_next_data(html):
    log("尝试从 HTML 提取 __NEXT_DATA__ ...")
    match = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        html,
        re.S,
    )
    if not match:
        raise RuntimeError("未找到 __NEXT_DATA__，页面结构可能发生变化。")
    log(f"__NEXT_DATA__ 提取成功，JSON 字符长度：{len(match.group(1))}")
    return json.loads(match.group(1))


def collect_posts(data):
    posts = []

    def walk(node):
        if isinstance(node, dict):
            if node.get("__typename") == "Post":
                name = node.get("name")
                tagline = node.get("tagline") or node.get("description")
                slug = node.get("slug")
                url = node.get("url")
                if not url and slug:
                    url = f"https://www.producthunt.com/posts/{slug}"
                if name and tagline:
                    posts.append(
                        {
                            "id": node.get("id") or slug or name,
                            "name": name,
                            "tagline": tagline,
                            "slug": slug,
                            "url": url,
                            "rank": node.get("rank")
                            or node.get("dailyRank")
                            or node.get("position"),
                            "votes": node.get("votesCount") or node.get("votes"),
                        }
                    )
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    walk(data)

    # 去重
    deduped = {}
    for item in posts:
        deduped[item["id"]] = item

    result = list(deduped.values())
    result.sort(key=lambda x: (x["rank"] is None, x["rank"] or 9999))
    log(f"解析到候选 Post 数量：{len(result)}")
    return result


def fetch_hackernews_posts(limit=20):
    """
    备选爬虫：Hacker News API（结构稳定）
    """
    import requests

    log("启动备选爬虫：Hacker News API")
    top_url = "https://hacker-news.firebaseio.com/v0/topstories.json"
    ids = requests.get(top_url, timeout=30).json() or []
    ids = ids[:limit]
    log(f"HN topstories 获取到 {len(ids)} 条 id，开始拉取详情...")

    posts = []
    for i, item_id in enumerate(ids, start=1):
        item_url = f"https://hacker-news.firebaseio.com/v0/item/{item_id}.json"
        item = requests.get(item_url, timeout=30).json() or {}
        title = item.get("title") or f"HN Item {item_id}"
        url = item.get("url") or f"https://news.ycombinator.com/item?id={item_id}"
        by = item.get("by") or ""
        score = item.get("score")
        posts.append(
            {
                "id": str(item_id),
                "name": title,
                "tagline": title,
                "slug": None,
                "url": url,
                "rank": i,
                "votes": score,
                "source": f"Hacker News{' · by ' + by if by else ''}",
            }
        )

    log("Hacker News 备选数据准备完成")
    return posts


def get_client():
    from openai import OpenAI

    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        print("未检测到环境变量 DEEPSEEK_API_KEY。", file=sys.stderr)
        sys.exit(1)
    log("初始化 DeepSeek OpenAI 兼容客户端（openai>=1.0.0 语法）")
    return OpenAI(base_url="https://api.deepseek.com", api_key=api_key)


def analyze_project(client, project):
    name = project["name"]
    tagline = project["tagline"]
    url = project.get("url") or ""
    log(f"调用 DeepSeek 分析：{name}")
    prompt = (
        f"项目：{name}\n"
        f"简介：{tagline}\n"
        f"链接：{url}\n\n"
        "请分析该项目可能的搞钱/变现路径，输出 3-5 条要点，"
        "使用中文，直接给出 Markdown 列表（以 - 开头）。"
    )
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "你是擅长产品变现策略的商业分析师。"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
    )
    content = response.choices[0].message.content.strip()
    log(f"DeepSeek 返回完成：{name}（字符数：{len(content)}）")
    return content

def build_post_content(posts, date_str, client, source_label):
    lines = [
        "---",
        "layout: post",
        f'title: "Product Hunt 今日搞钱趋势（{date_str}）"',
        f"date: {date_str}",
        "categories: [趋势, 变现]",
        "tags: [ProductHunt, AI, 变现]",
        "---",
        "",
        f"# Product Hunt 今日榜单变现路径分析（{date_str}）",
        "",
        f"本文基于 {source_label} 的项目列表，自动提炼其潜在的变现逻辑。",
        "",
    ]

    for idx, project in enumerate(posts, start=1):
        name = project["name"]
        tagline = project["tagline"]
        url = project.get("url") or ""
        rank = project.get("rank")
        votes = project.get("votes")
        source = project.get("source")
        meta_parts = []
        if rank:
            meta_parts.append(f"Rank {rank}")
        if votes:
            meta_parts.append(f"{votes} votes")
        if source:
            meta_parts.append(str(source))
        meta = " · ".join(meta_parts) if meta_parts else "今日榜单项目"

        try:
            analysis = analyze_project(client, project)
        except Exception as e:
            log(f"DeepSeek 调用失败：{name}，错误：{e!r}")
            analysis = "- （调用失败）请稍后重试或检查 Actions 日志中的错误信息。"
        lines.append(f"## {idx}. {name}")
        lines.append(f"- 简介：{tagline}")
        if url:
            lines.append(f"- 链接：{url}")
        lines.append(f"- {meta}")
        lines.append("- 变现路径：")
        lines.append(analysis)
        lines.append("")

    return "\n".join(lines)


def append_or_create_post(content, date_str):
    # 文件检查：写入前确保 _posts 存在
    os.makedirs("_posts", exist_ok=True)
    posts_dir = os.path.join(os.getcwd(), "_posts")
    os.makedirs(posts_dir, exist_ok=True)
    filename = f"{date_str}-money-trends.md"
    target_path = os.path.join(posts_dir, filename)

    if os.path.exists(target_path):
        with open(target_path, "a", encoding="utf-8") as f:
            f.write("\n")
            f.write(content)
        action = "追加"
    else:
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(content)
        action = "新建"

    print(f"{action}完成：{target_path}")


def main():
    log("启动脚本")
    ensure_dependencies()

    source_label = "Product Hunt 首页（今日）"
    try:
        html = fetch_today_page()
        data = extract_next_data(html)
        posts = collect_posts(data)
        if not posts:
            raise RuntimeError("解析结果为空")
        log("Product Hunt 流程成功，准备进入 DeepSeek 分析")
    except Exception as e:
        log(f"Product Hunt 抓取/解析失败：{e!r}，将切换到备选方案（Hacker News API）")
        try:
            posts = fetch_hackernews_posts(limit=20)
            source_label = "Hacker News Top Stories（API 备选）"
        except Exception as hn_err:
            log(f"Hacker News 备选也失败：{hn_err!r}")
            log("无法获取任何项目数据，脚本退出（exit 1）")
            sys.exit(1)

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    client = get_client()
    log(f"开始构建文章内容：{date_str}")
    content = build_post_content(posts, date_str, client, source_label)
    log("开始写入 _posts/ ...")
    append_or_create_post(content, date_str)
    log("脚本结束")


if __name__ == "__main__":
    main()
