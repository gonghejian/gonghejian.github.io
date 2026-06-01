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

KEYWORD_WEIGHTS = {
    "rate": 5,
    "inflation": 5,
    "employment": 4,
    "fomc": 5,
    "tariff": 4,
    "growth": 4,
    "recession": 5,
    "stablecoin": 3,
    "liquidity": 5,
    "financial stability": 4,
    "bond": 4,
    "treasury": 4,
    "oil": 4,
    "china": 4,
    "credit": 4,
    "fiscal": 4,
    "policy": 3,
    "央行": 5,
    "通胀": 5,
    "就业": 4,
    "降息": 5,
    "加息": 5,
    "财政": 4,
    "信用": 4,
    "流动性": 5,
    "增长": 4,
    "衰退": 5,
    "黄金": 4,
    "美元": 4,
}


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


def importance_score(item: NewsItem) -> int:
    text = f"{item.title} {item.summary} {item.tag}".lower()
    score = 0
    for keyword, weight in KEYWORD_WEIGHTS.items():
        if keyword.lower() in text:
            score += weight
    if item.source in {"Federal Reserve", "ECB", "IMF"}:
        score += 2
    return score


def rank_news(items: list[NewsItem], limit: int = 10) -> list[NewsItem]:
    return sorted(items, key=importance_score, reverse=True)[:limit]


def analyze_event(item: NewsItem) -> dict:
    text = f"{item.title} {item.summary}".lower()
    if "discount rate" in text or "fomc" in text or "monetary" in text:
        why = "这类信息直接影响市场对美联储政策利率路径的判断，是美债收益率、美元和全球风险资产估值的上游变量。"
        impact = "若纪要偏鹰，权益估值承压、美元和短端利率偏强；若偏鸽，成长股、长久期债券和黄金更容易获得支撑。"
    elif "stablecoin" in text or "money market" in text or "digital" in text:
        why = "货币市场基金、稳定币和数字货币讨论，本质上涉及流动性载体、支付体系和金融稳定边界。"
        impact = "短期影响偏主题和监管预期；中期会影响美元流动性、银行负债结构、金融科技和加密资产风险偏好。"
    elif "bank" in text or "resolution" in text or "enforcement" in text:
        why = "银行监管和处置计划会影响信用创造、金融系统稳定预期和银行股风险溢价。"
        impact = "若监管趋严，银行板块估值和信用扩张受压；若风险处置清晰，反而有助于降低系统性风险溢价。"
    elif "payment account" in text or "clearing" in text or "settling" in text:
        why = "支付账户和清算结算安排关系到金融基础设施开放程度，也会影响非银机构接入央行支付体系的预期。"
        impact = "对短期大类资产影响有限，但会改变金融机构竞争格局，并影响长期支付、稳定币和银行负债结构。"
    elif "independence" in text or "chairman" in text or "governors" in text:
        why = "央行人事和独立性影响政策可信度。市场通常会重新评估未来政策反应函数和沟通风格。"
        impact = "若市场认为政策可信度增强，长端利率风险溢价下降；若政治干扰预期升温，美元和债券波动可能上升。"
    else:
        why = f"{item.source} 的信息会影响市场对{item.tag}的定价，尤其是政策边际、风险偏好和跨资产资金流。"
        impact = "若信息强化不确定性，通常压制权益估值、支撑防御资产；若信息缓和，则有利于风险资产修复。"
    return {"event": item.title, "why": why, "asset_impact": impact}


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
    for idx, item in enumerate(rank_news(items, 12), 1):
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
  "market_context": "当日投资环境判断，说明风险偏好、利率、美元、流动性、增长或通胀的组合，250字以内",
  "macro": "宏观总览，200字以内",
  "important_events": [
    {{"event": "事件标题", "why": "为什么重要", "asset_impact": "对资产的可能影响"}}
  ],
  "policy": [
    {{"region": "美国", "view": "...", "watch": "..."}},
    {{"region": "中国", "view": "...", "watch": "..."}},
    {{"region": "欧洲", "view": "...", "watch": "..."}},
    {{"region": "日本", "view": "...", "watch": "..."}}
  ],
  "assets": [
    {{"asset": "美股", "stance": "超配/标配/低配/观察", "reason": "...", "trigger": "什么变化会改变判断"}},
    {{"asset": "A股/港股", "stance": "超配/标配/低配/观察", "reason": "...", "trigger": "什么变化会改变判断"}},
    {{"asset": "美债", "stance": "超配/标配/低配/观察", "reason": "...", "trigger": "什么变化会改变判断"}},
    {{"asset": "黄金", "stance": "超配/标配/低配/观察", "reason": "...", "trigger": "什么变化会改变判断"}},
    {{"asset": "美元/人民币", "stance": "超配/标配/低配/观察", "reason": "...", "trigger": "什么变化会改变判断"}}
  ],
  "allocation": [
    {{"profile": "稳健型", "view": "配置建议，用区间和原则表达，不给个股"}},
    {{"profile": "平衡型", "view": "配置建议，用区间和原则表达，不给个股"}},
    {{"profile": "进取型", "view": "配置建议，用区间和原则表达，不给个股"}}
  ],
  "scenarios": [
    {{"scenario": "基准情景", "probability": "高/中/低", "strategy": "..."}},
    {{"scenario": "风险情景", "probability": "高/中/低", "strategy": "..."}}
  ],
  "actions": ["三到五条今日观察或行动清单"],
  "risks": ["三到五条风险提示"]
}}

要求：
- 冷静、克制、像专业研究助理，不要鸡血，不要夸大确定性。
- 给出可执行的资产配置观点，但必须表达为“研究参考/组合原则”，不要给个股、不要承诺收益。
- 不要编造具体行情点位；没有实时行情数据时，用“观察、等待确认、提高/降低风险暴露”表达。
- 必须解释“为什么重要”，不要只复述新闻标题。
""".strip()


def fallback_report(report_date: str, items: list[NewsItem]) -> dict:
    ranked = rank_news(items, 6)
    titles = [item.title for item in ranked[:4]]
    important_events = [analyze_event(item) for item in ranked[:4]]
    return {
        "title": "宏观政策解读与全球资产配置策略日报",
        "summary": "今日自动生成器已完成公开信息抓取。模型不可用时，本报告按宏观研究框架输出谨慎版配置观点：先看政策边际，再看利率与美元，最后落到权益、债券、黄金和汇率的组合暴露。",
        "stance": "中性观察",
        "risk_level": "中",
        "highlights": titles or [
            "跟踪主要央行政策、通胀、就业与地缘变量。",
            "资产配置维持多元分散，等待更清晰的政策与数据确认。",
            "本页为自动化日报实验版，不构成投资建议。",
        ],
        "market_context": "当前环境应按“政策分化 + 利率再定价 + 风险偏好摇摆”处理。美国仍是全球资产定价锚，欧元区和日本政策边际会影响美元、利率和套息交易，中国资产则更依赖政策兑现与信用修复。组合上不宜单边押注，应保留防御资产和再平衡空间。",
        "macro": "日报优先追踪四个变量：主要央行政策边际、通胀和增长组合、美元与美债收益率、地缘与信用风险。没有实时行情时，不做点位判断，而是判断哪些变量正在改变资产的风险收益比。",
        "important_events": important_events,
        "policy": [
            {"region": "美国", "view": "美联储仍是全球风险资产的核心锚。若通胀粘性高于预期，估值扩张会受限；若就业明显降温，债券和黄金的防御价值上升。", "watch": "CPI、PCE、非农、FOMC 表态、美债收益率曲线。"},
            {"region": "中国", "view": "中国资产的关键不是估值便宜，而是政策是否能转化为信用扩张、盈利修复和居民风险偏好恢复。", "watch": "社融、PMI、财政支出节奏、地产链政策和人民币稳定信号。"},
            {"region": "欧洲", "view": "欧元区更偏增长压力与金融稳定观察，政策宽松若继续推进，可能支撑债券，但对欧元形成约束。", "watch": "通胀、工资、信贷、ECB 官员表态和欧元走势。"},
            {"region": "日本", "view": "日本政策正常化会影响日元和全球套息交易。若日元快速波动，全球风险资产可能出现去杠杆压力。", "watch": "BOJ 表态、工资谈判、日债收益率和日元波动。"},
        ],
        "assets": [
            {"asset": "美股", "stance": "标配/结构观察", "reason": "盈利韧性仍有支撑，但估值对利率敏感，适合偏质量和现金流，而不是追高贝塔。", "trigger": "若美债收益率下行且盈利上修，可提高风险暴露；若通胀反复，则降低估值敏感资产。"},
            {"asset": "A股/港股", "stance": "观察/逢低分批", "reason": "政策修复预期存在，但需要信用、盈利和成交共同确认。港股弹性更大，波动也更高。", "trigger": "社融、地产销售、财政节奏和人民币企稳是提高仓位的确认信号。"},
            {"asset": "美债", "stance": "标配偏多", "reason": "在增长放缓或风险事件上升时，美债仍是组合稳定器；但通胀粘性会限制久期收益。", "trigger": "若就业和通胀同步回落，可适度拉长久期；若通胀上行，控制久期。"},
            {"asset": "黄金", "stance": "战略标配", "reason": "黄金适合作为真实利率、美元信用和地缘风险的对冲，不适合用短期涨跌做单一判断。", "trigger": "美元和实际利率同步上行会压制黄金；地缘风险或央行购金预期强化则支撑配置。"},
            {"asset": "美元/人民币", "stance": "区间观察", "reason": "美元由美债利率和避险需求驱动，人民币则取决于中美利差、结汇和国内政策信心。", "trigger": "若美元走弱且中国信用数据改善，人民币压力缓和；反之保持汇率风险对冲。"},
        ],
        "allocation": [
            {"profile": "稳健型", "view": "以现金、短久期债券和黄金作为底仓，权益保持低到中等暴露；重点是控制回撤，不追逐单日行情。"},
            {"profile": "平衡型", "view": "权益、债券、黄金保持分散，权益内部偏质量资产和红利现金流；等待政策和盈利确认后再提高进攻性。"},
            {"profile": "进取型", "view": "可以保留部分权益弹性，但需要用黄金、美元资产或债券对冲尾部风险；不建议在政策和数据未确认前满仓押方向。"},
        ],
        "scenarios": [
            {"scenario": "基准情景", "probability": "中", "strategy": "政策边际温和、增长放缓但未失速，组合维持均衡：权益结构化、债券标配、黄金战略持有。"},
            {"scenario": "风险情景", "probability": "中", "strategy": "若通胀反复、地缘冲突或流动性收紧，降低高估值权益，提高现金、黄金和高质量债券比例。"},
            {"scenario": "修复情景", "probability": "低到中", "strategy": "若降息预期增强且中国信用修复，逐步提高权益暴露，优先选择盈利确定性和政策受益方向。"},
        ],
        "actions": [
            "先记录政策事件，再记录资产反应，避免用市场涨跌倒推原因。",
            "每天跟踪美元、美债收益率、黄金和主要股指是否同向或背离。",
            "权益仓位不要只看指数涨跌，要拆成估值、盈利、流动性和风险偏好四项。",
            "若没有明确数据确认，组合操作以再平衡和风险控制为主。",
        ],
        "risks": [
            "公开信息源可能不完整，且不包含实时行情报价。",
            "模型或兜底框架可能遗漏突发事件和区域市场细节。",
            "宏观判断不等于交易信号，市场决策需结合个人风险承受能力和实时数据。",
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
    event_cards = "\n".join(
        f"<article><h3>{esc(x.get('event'))}</h3><p>{esc(x.get('why'))}</p><strong>{esc(x.get('asset_impact'))}</strong></article>"
        for x in report.get("important_events", [])
    )
    policy_rows = "\n".join(
        f"<tr><td><strong>{esc(x.get('region'))}</strong></td><td>{esc(x.get('view'))}</td><td>{esc(x.get('watch'))}</td></tr>"
        for x in report.get("policy", [])
    )
    asset_rows = "\n".join(
        f"<tr><td><strong>{esc(x.get('asset'))}</strong></td><td>{esc(x.get('stance'))}</td><td>{esc(x.get('reason'))}</td><td>{esc(x.get('trigger'))}</td></tr>"
        for x in report.get("assets", [])
    )
    allocation_rows = "\n".join(
        f"<tr><td><strong>{esc(x.get('profile'))}</strong></td><td>{esc(x.get('view'))}</td></tr>"
        for x in report.get("allocation", [])
    )
    scenario_cards = "\n".join(
        f"<article><span>{esc(x.get('probability'))}</span><h3>{esc(x.get('scenario'))}</h3><p>{esc(x.get('strategy'))}</p></article>"
        for x in report.get("scenarios", [])
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
      <section class="report-section"><h2>投资环境</h2><p>{esc(report.get("market_context"))}</p></section>
      <section class="event-grid">{event_cards}</section>
      <section class="report-section"><h2>宏观总览</h2><p>{esc(report.get("macro"))}</p></section>
      <section class="report-section"><h2>政策解读</h2><table><thead><tr><th>区域</th><th>判断</th><th>观察点</th></tr></thead><tbody>{policy_rows}</tbody></table></section>
      <section class="report-section"><h2>全球资产配置</h2><table><thead><tr><th>资产</th><th>方向</th><th>理由</th><th>触发条件</th></tr></thead><tbody>{asset_rows}</tbody></table></section>
      <section class="report-section"><h2>组合建议</h2><table><thead><tr><th>类型</th><th>研究参考</th></tr></thead><tbody>{allocation_rows}</tbody></table></section>
      <section class="scenario-grid">{scenario_cards}</section>
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
