# Hot Money News Lab - Daily Bot

生成时间：2026-07-25 10:40:30 UTC

## 这个工具做了什么

- 从 Hacker News RSS 抓取最新条目
- 过滤关键词：`Show HN`（通常是新项目发布）
- 调用 DeepSeek（`openai` 兼容）模型：`deepseek-chat`，输出“毒辣创业教练”式变现&模仿建议
- 将结果写入本目录下的 `README.md`

## 数据源

- RSS：`https://news.ycombinator.com/rss`
- 数据文件：`data.json`（给网页 / 小程序 / App 使用）

## 今日抓取结果

### 1. Show HN: I simulated closing the Strait of Hormuz on real oil trade data

- 链接：https://globaloilnetwork.staffinganalytics.io/
- 时间：Thu, 23 Jul 2026 12:31:21 +0000
- 摘要：<a href="https://news.ycombinator.com/item?id=49020545">Comments</a>

#### 分析（毒辣创业教练）

- （调用失败）BadRequestError("Error code: 400 - {'error': {'message': 'The supported API model names are deepseek-v4-pro or deepseek-v4-flash, but you passed deepseek-chat.', 'type': 'invalid_request_error', 'param': None, 'code': 'invalid_request_error'}}")
