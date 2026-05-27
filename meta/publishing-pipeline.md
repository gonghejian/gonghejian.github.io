# 内容生产到发布流程

## 当前状态

当前网站使用 Jekyll：

- `_posts/` 是正式文章发布目录；
- `whitepaper.md` 是白皮书发布入口；
- `labs/` 是实验室和产品页面；
- `content/` 是新建立的创作源骨架；
- `meta/` 是内部规划和维护文档；
- 自定义域名可能经过 Vercel 或 GitHub Pages。

## 内容生产逻辑

一篇内容不只是文章，而是影响力资产的源头。

重要内容可以拆成：

- 网站长文；
- 精选记录；
- 白皮书段落；
- 小红书笔记；
- X 观点；
- 微信/newsletter 大纲；
- 实验室产品想法；
- 私域访谈或课程 MVP 材料。

## 推荐流程

1. 在 `_posts/` 中继续维护已发布文章。
2. 文章改写时使用 `skills/article-editor/SKILL.md`。
3. 判断文章对应哪条主线：
   - AI 工作流；
   - 知识与表达系统；
   - 身体与纪律系统。
4. 重要文章可以同步沉淀到 `content/articles/` 作为创作源或后续版本记录。
5. 白皮书材料沉淀到 `content/whitepapers/`，成熟后更新发布页。
6. 产品和实验说明沉淀到 `content/labs/` 或 `meta/product-ideas.md`，成熟后进入 `labs/`。

## 后续自动化设想

```text
content/articles/*.md -> _posts/YYYY-MM-DD-title.md
content/whitepapers/*.md -> whitepaper sections/pages
content/labs/*.md -> labs project brief
```

自动化之前必须先定义：

- front matter 标准；
- slug 规则；
- 标签规则；
- 精选记录规则；
- 分发摘要规则；
- 回滚和人工校对流程。

## 不做的事

- 不直接把 94 篇 `_posts` 搬到 `content/articles/`。
- 不改变已发布文章 URL。
- 不把内部规划文档发布到网站。
- 不把“最新文章”作为首页核心逻辑。
