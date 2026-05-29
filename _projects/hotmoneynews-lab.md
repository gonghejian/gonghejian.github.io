---
title: "AI 商业样本分析器（Show HN）"
description: "每天自动抓取 Hacker News 的 Show HN 项目，用 DeepSeek 以创业教练视角输出：商业化路径、低成本复刻方式和风险判断。"
short_description: "每天抓取 Show HN 项目，用 AI 分析商业化路径和复刻方式"
icon: "💰"
tags: ["Show HN", "Hacker News", "DeepSeek", "AI", "商业样本"]
status: "实验中"
order: 2
link: "/labs/hotmoneynews-lab/"
external: false
layout: project
---

这个实验用最短路径把「信息源 → AI 分析 → 可读结果」跑通：

- 数据源：Hacker News RSS（过滤 `Show HN`）
- 分析：DeepSeek（`openai` 兼容接口，读取 `DEEPSEEK_API_KEY`）
- 输出：`labs/hotmoneynews-lab/README.md`（页面会直接渲染它）

