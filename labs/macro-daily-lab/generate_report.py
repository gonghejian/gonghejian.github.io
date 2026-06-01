from __future__ import annotations

import argparse
import html
import importlib
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data.json"
REPORTS_DIR = BASE_DIR / "reports"
DEFAULT_MODEL = os.getenv("MACRO_DAILY_MODEL", "deepseek-chat")
CN_TZ = timezone(timedelta(hours=8))

FEEDS = [
    {
        "name": "Federal Reserve",
        "url": "https://www.federalreserve.gov/feeds/press_all.xml",
        "tag": "美国货币政策",
    },
    {
        "name": "ECB",
        "url": "https://www.ecb.europa.eu/rss/press.html",
        "tag": "欧元区政策",
    },
    {
        "name": "IMF",
        "url": "https://www.imf.org/en/News/RSS",
        "tag": "全球宏观",
    },
]


@dataclass
class NewsItem:
    title: str
    url: str
    source: str
    tag: str
    published: str = ""
    summary: str = ""


def log(message: str) -> None:
    print(f"[macro-daily] {message}", flush=True)


def strip_html(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value or "")
    return html.unescape(value).strip()


def domain_of(url: str) -> str:
    return urllib.parse.urlparse(url).netloc.replace("www.", "")


def fetch_feed(feed: dict, limit: int = 6) -> list[NewsItem]:
    req = urllib.request.Request(
        feed["url"],
        headers={"User-Agent": "gonghejian-macro-daily-lab/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        raw = response.read().decode("utf-8", errors="replace")

    root = ET.fromstring(raw)
    items: list[NewsItem] = []

    if root.tag.lower().endswith("rss") or root.find("channel") is not None:
        channel = root.find("channel")
        for node in (channel.findall("item") if channel is not None else []):
            title = (node.findtext("title") or "").strip()
            url = (node.findtext("link") or "").strip()
            summary = strip_html(node.findtext("description") or "")
            published = (node.findtext("pubDate") or "").strip()
            if title and url:
                items.append(NewsItem(title, url, feed["name"], feed["tag"], published, summary))
    else:
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        for node in root.findall("atom:entry", ns):
            title = (node.findtext("atom:title", default="", namespaces=ns) or "").strip()
            link_node = node.find("atom:link", ns)
            url = link_node.attrib.get("href", "") if link_node is not None else ""
            summary = strip_html(node.findtext("atom:summary", default="", namespaces=ns) or "")
            published = (node.findtext("atom:updated", default="", namespaces=ns) or "").strip()
            if title and url:
                items.append(NewsItem(title, url, feed["name"], feed["tag"], published, summary))

    return items[:limit]


def collect_news(limit_per_feed: int = 5) -> list[NewsItem]:
    items: list[NewsItem] = []
    for feed in FEEDS:
        try:
            log(f"fetch {feed['name']}")
            items.extend(fetch_feed(feed, limit_per_feed))
        except Exception as exc:
            log(f"feed failed: {feed['name']} {exc!r}")
    return items


def openai_client():
    key = os.getenv("DEEPSEEK_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not key:
        return None

    try:
        openai_mod = importlib.import_module("openai")
    except Exception:
        return None

    if os.getenv("DEEPSEEK_API_KEY"):
        return openai_mod.OpenAI(base_url="https://api.deepseek.com", api_key=key)
    return openai_mod.OpenAI(api_key=key)


def build_prompt(report_date: str, items: list[NewsItem]) -> str:
    news_lines = []
    for idx, item in enumerate(items, 1):
        news_lines.append(
            f"{idx}. [{item.source}/{item.tag}] {item.title}\n"
            f"   URL: {item.url}\n"
            f"   Published: {item.published}\n"
            f"   Summary: {item.summary[:400]}"
        )

    return f"""
请生成一份中文《宏观政策解读与全球资产配置策略日报》。

日期：{report_date}

公开信息源如下：
{chr(10).join(news_lines) if news_lines else "今日抓取源为空，请按宏观框架生成谨慎版日报。"}

输出必须是 JSON，不要 Markdown，不要代码块。结构如下：
{{
  "title": "...",
  "summary": "...",
  "stance": "风险偏好/中性观察/防御观察 三选一",
  "risk_level": "低/中/高 三选一",
  "highlights": ["三到五条"],
  "macro": "宏观总览，200字以内",
  "policy": [
    {{"region": "美国", "view": "...", "watch": "..."}},
    {{"region": "中国", "view": "...", "watch": "..."}},
    {{"region": "欧洲", "view": "...", "watch": "..."}},
    {{"region": "日本", "view": "...", "watch": "..."}}
  ],
  "assets": [
    {{"asset": "美股", "stance": "...", "reason": "..."}},
    {{"asset": "A股/港股", "stance": "...", "reason": "..."}},
    {{"asset": "美债", "stance": "...", "reason": "..."}},
    {{"asset": "黄金", "stance": "...", "reason": "..."}},
    {{"asset": "美元/人民币", "stance": "...", "reason": "..."}}
  ],
  "actions": ["三到五条今日观察或行动清单"],
  "risks": ["三到五条风险提示"]
}}

要求：
- 冷静、克制、像专业研究助理，不要鸡血，不要夸大确定性。
- 明确说明这是研究参考，不构成投资建议。
- 不要编造具体行情点位；如无实时数据，用“观察”而不是“断言”。
""".strip()


def fallback_report(report_date: str, items: list[NewsItem]) -> dict:
    titles = [item.title for item in items[:4]]
    return {
        "title": "宏观政策解读与全球资产配置策略日报",
        "summary": "自动生成器已运行，但未调用模型或模型不可用。本报告先给出谨慎版宏观框架和信息源摘要。",
        "stance": "中性观察",
        "risk_level": "中",
        "highlights": titles or [
            "跟踪主要央行政策、通胀、就业与地缘变量。",
            "资产配置维持多元分散，等待更清晰的政策与数据确认。",
            "本页为自动化日报实验版，不构成投资建议。",
        ],
        "macro": "当前日报处于自动化实验阶段。若模型密钥可用，系统会结合公开信息源生成完整政策解读；若模型不可用，则输出谨慎框架，提醒读者回到政策周期、流动性、增长和风险偏好四个变量。",
        "policy": [
            {"region": "美国", "view": "关注美联储对通胀和就业的权衡。", "watch": "CPI、PCE、非农、FOMC 表态。"},
            {"region": "中国", "view": "关注稳增长政策、信用扩张和地产链修复。", "watch": "社融、PMI、财政和房地产政策。"},
            {"region": "欧洲", "view": "关注欧央行降息节奏与增长压力。", "watch": "通胀、工资、信贷和欧元走势。"},
            {"region": "日本", "view": "关注货币政策正常化对日元和全球套息交易的影响。", "watch": "BOJ 表态、工资和日元波动。"},
        ],
        "assets": [
            {"asset": "美股", "stance": "结构观察", "reason": "盈利与估值仍需利率路径确认。"},
            {"asset": "A股/港股", "stance": "政策修复", "reason": "估值修复需要基本面和信心共振。"},
            {"asset": "美债", "stance": "等待拐点", "reason": "降息预期与通胀粘性仍在拉扯。"},
            {"asset": "黄金", "stance": "战略配置", "reason": "实际利率、美元和地缘风险共同影响。"},
            {"asset": "美元/人民币", "stance": "区间观察", "reason": "利差、结汇和政策稳定信号仍是主线。"},
        ],
        "actions": [
            "把当日重要政策事件和资产反应分开记录，避免用结果倒推原因。",
            "关注美元、美债收益率和黄金是否同向异动。",
            "对权益资产保持结构化观察，不把指数涨跌等同于整体机会。",
        ],
        "risks": [
            "公开信息源抓取不完整。",
            "模型输出可能存在遗漏或过度概括。",
            "本报告不构成投资建议，市场决策需结合实时数据。",
        ],
    }


def generate_with_ai(report_date: str, items: list[NewsItem], model: str) -> dict:
    client = openai_client()
    if client is None:
        return fallback_report(report_date, items)

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "你是严谨的宏观研究助理和多资产配置分析师。"},
                {"role": "user", "content": build_prompt(report_date, items)},
            ],
            temperature=0.25,
        )
        content = response.choices[0].message.content or ""
        content = re.sub(r"^```json\s*|\s*```$", "", content.strip(), flags=re.S)
        return json.loads(content)
    except Exception as exc:
        log(f"ai failed: {exc!r}")
        return fallback_report(report_date, items)


def esc(value: object) -> str:
    return html.escape(str(value or ""))


def render_report_html(report_date: str, report: dict, items: list[NewsItem]) -> str:
    policy_rows = "\n".join(
        f"<tr><td><strong>{esc(x.get('region'))}</strong></td><td>{esc(x.get('view'))}</td><td>{esc(x.get('watch'))}</td></tr>"
        for x in report.get("policy", [])
    )
    asset_rows = "\n".join(
        f"<tr><td><strong>{esc(x.get('asset'))}</strong></td><td>{esc(x.get('stance'))}</td><td>{esc(x.get('reason'))}</td></tr>"
        for x in report.get("assets", [])
    )
    highlights = "\n".join(f"<li>{esc(x)}</li>" for x in report.get("highlights", []))
    actions = "\n".join(f"<li>{esc(x)}</li>" for x in report.get("actions", []))
    risks = "\n".join(f"<li>{esc(x)}</li>" for x in report.get("risks", []))
    sources = "\n".join(
        f"<li><a href=\"{esc(item.url)}\" target=\"_blank\" rel=\"noopener noreferrer\">{esc(item.title)}</a><span>{esc(item.source)} · {esc(domain_of(item.url))}</span></li>"
        for item in items[:12]
    )

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(report.get("title"))} - {report_date}</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <main class="report-page">
    <div class="report-shell">
      <a class="back-link" href="../">返回日报实验室</a>
      <section class="report-cover">
        <p class="report-kicker">MACRO POLICY & GLOBAL ASSET ALLOCATION</p>
        <h1>{esc(report.get("title"))}</h1>
        <div class="report-meta">
          <span>{report_date}</span>
          <span>{esc(report.get("stance"))}</span>
          <span>风险等级：{esc(report.get("risk_level"))}</span>
        </div>
      </section>
      <section class="report-notice">本报告由自动化脚本生成，用于研究和内容生产辅助，不构成投资建议。</section>
      <section class="report-section"><h2>今日摘要</h2><p>{esc(report.get("summary"))}</p><ul>{highlights}</ul></section>
      <section class="report-section"><h2>宏观总览</h2><p>{esc(report.get("macro"))}</p></section>
      <section class="report-section"><h2>政策解读</h2><table><thead><tr><th>区域</th><th>判断</th><th>观察点</th></tr></thead><tbody>{policy_rows}</tbody></table></section>
      <section class="report-section"><h2>全球资产配置</h2><table><thead><tr><th>资产</th><th>方向</th><th>理由</th></tr></thead><tbody>{asset_rows}</tbody></table></section>
      <section class="report-grid">
        <div class="report-card"><h3>今日行动清单</h3><ul>{actions}</ul></div>
        <div class="report-card"><h3>风险提示</h3><ul>{risks}</ul></div>
      </section>
      <section class="report-section"><h2>公开信息源</h2><ul class="source-list">{sources or "<li>今日未抓取到公开信息源。</li>"}</ul></section>
    </div>
  </main>
</body>
</html>
"""


def load_data() -> dict:
    if DATA_PATH.exists():
        return json.loads(DATA_PATH.read_text(encoding="utf-8"))
    return {"schema": "macro-daily-lab/v1", "reports": []}


def save_outputs(report_date: str, report: dict, items: list[NewsItem]) -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / f"{report_date}.html"
    report_path.write_text(render_report_html(report_date, report, items), encoding="utf-8")

    data = load_data()
    rel_path = f"/labs/macro-daily-lab/reports/{report_date}.html"
    latest = {
        "date": report_date,
        "title": report.get("title") or "宏观政策解读与全球资产配置策略日报",
        "summary": report.get("summary") or "",
        "path": rel_path,
        "stance": report.get("stance") or "中性观察",
        "risk_level": report.get("risk_level") or "中",
        "highlights": report.get("highlights") or [],
    }
    reports = [r for r in data.get("reports", []) if r.get("date") != report_date]
    reports.insert(0, {k: latest[k] for k in ["date", "title", "path", "stance", "risk_level"]})
    data.update(
        {
            "schema": "macro-daily-lab/v1",
            "generated_at": datetime.now(CN_TZ).isoformat(timespec="seconds"),
            "latest": latest,
            "reports": reports[:60],
        }
    )
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate macro policy and global asset allocation daily report.")
    parser.add_argument("--date", default=datetime.now(CN_TZ).strftime("%Y-%m-%d"))
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--limit-per-feed", type=int, default=5)
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    items = collect_news(args.limit_per_feed)
    report = generate_with_ai(args.date, items, args.model)
    save_outputs(args.date, report, items)
    log(f"saved report {args.date}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
