# Hot Money News Lab - Daily Bot

生成时间：2026-09-02 13:34:11 UTC

## 这个工具做了什么

- 从 Hacker News RSS 抓取最新条目
- 过滤关键词：`Show HN`（通常是新项目发布）
- 调用 DeepSeek（`openai` 兼容）模型：`deepseek-chat`，输出“毒辣创业教练”式变现&模仿建议
- 将结果写入本目录下的 `README.md`

## 数据源

- RSS：`https://news.ycombinator.com/rss`
- 数据文件：`data.json`（给网页 / 小程序 / App 使用）

## 今日抓取结果

### 1. Show HN: Weedout – Safari extension that hides YouTube AI-labeled videos

- 链接：https://masteranza.github.io/weedout/
- 时间：Tue, 01 Sep 2026 22:06:57 +0000
- 摘要：<a href="https://news.ycombinator.com/item?id=49528895">Comments</a>

#### 分析（毒辣创业教练）

# Weedout 项目毒辣拆解

## 1. 它怎么赚钱？—— 大概率赚不到钱，且是“伪需求”的典型

- **直接收入：零。** 这是开源免费 Safari 扩展，没有付费墙、没有订阅、没有内购。作者连“打赏”按钮都没放（看了页面源码，只有 GitHub 链接）。
- **间接收入：几乎为零。** 没有广告、没有数据出售（扩展只做本地过滤）、没有引流到其他付费产品。唯一“资产”是 GitHub 星星和 HN 曝光，但这类工具无法转化为咨询或 SaaS。
- **为什么说它是伪需求？** 用户真正痛的不是“看到 AI 标签”，而是“AI 视频质量差”。隐藏标签只是掩耳盗铃——你依然会点开烂视频，只是不知道它是 AI 做的。这就像“隐藏垃圾邮件发件人”而不是“过滤垃圾邮件”。留存率会极低，卸载率极高。
- **唯一可能的“赚钱”路径（作者没做）：** 变成“AI 视频质量评分插件”，用社区投票/模型判断视频是否值得看，然后卖 API 给内容平台或做付费订阅。但技术上难度高 100 倍，且 YouTube 会封杀。

**结论：这是一个“作品集项目”，不是生意。作者要的是 HN 曝光和技术认可，不是钱。**

---

## 2. 普通人如何低成本模仿？—— 3 天可复制，但别指望赚钱

如果你非要模仿，以下是 5 步低成本路径（总成本 < 100 元，时间 < 20 小时）：

- **技术栈照抄：** 用 JavaScript + Safari App Extension（Xcode 模板），核心代码就是 `document.querySelectorAll('ytd-video-renderer')` 然后检查 `span` 文本是否含 “AI” 或 “Label”。GitHub 上搜 `youtube-ai-label-hider` 已有多个现成实现，直接 fork 改 UI。
- **发布渠道：** 不花钱上架 App Store（需 $99/年 开发者账号，这是唯一硬成本）。如果不想付，就学作者只发 GitHub + 手动安装说明（Safari 允许未签名扩展，但用户需开启“允许未验证开发者”）。
- **差异化（别做纯隐藏）：** 改成“AI 视频降权”——把 AI 标签视频移到列表底部，或加红色边框。或者做“AI 视频举报助手”，一键批量举报低质 AI 内容（更符合用户真实情绪）。
- **推广策略：** 复制作者路径——发 HN Show HN，标题用“I’m so tired of AI slop on YouTube”，配一张对比截图。再发 Reddit r/Safari 和 r/youtube。别花钱投广告。
- **变现试探（可选）：** 在 GitHub README 放 BuyMeACoffee 链接，或加一个“高级版：自动跳过 AI 视频”的付费开关（用 StoreKit 收 $0.99）。预期收入：每月 0-5 美元。

---

## 最终毒辣建议

**别做这个。** 如果你真想赚小钱，把同样精力花在“YouTube 去广告 + 自动跳过赞助段落”的扩展上（已有成熟开源项目，但 Safari 版稀缺，且用户付费意愿强）。或者做“YouTube 时间戳跳转器”给长视频用户。**隐藏 AI 标签是情绪发泄，不是解决方案——用户最终会意识到，然后抛弃你。**
