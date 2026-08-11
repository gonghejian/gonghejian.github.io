---
layout: default
title: 关于弓箭
description: 弓箭关于企业项目、企业 AI 研究、工作流实验与创业实践的个人说明。
permalink: /about/
---

<div class="about-page">
    <div class="container about-container">
        <header class="about-hero">
            <div class="about-identity">
                <img src="{{ '/favicon.ico' | relative_url }}" alt="" class="about-mark">
                <p>关于弓箭</p>
            </div>
            <h1>从企业项目现场，<br>走向企业 AI 实践。</h1>
            <p class="about-intro">
                我过去的工作长期围绕企业项目展开，涉及项目管理、商务协同、团队协作与结果交付。现在，我把这些来自组织和项目现场的经验，带进企业 AI 的研究与产品实验。
            </p>
        </header>

        <main class="about-sections">
            <section class="about-section" aria-labelledby="about-who">
                <div class="about-section-label">
                    <span>背景</span>
                    <h2 id="about-who">我是谁</h2>
                </div>
                <div class="about-section-body about-prose">
                    <p>我是弓箭。过去的工作经验主要来自企业项目：理解目标，协调不同角色，在约束中推进事情，并对最终交付负责。</p>
                    <p>这段经历让我更关心一项技术如何进入真实业务，而不只是它在演示里能做什么。我对企业 AI 的研究仍在持续积累；当前的重点，是把已有的企业项目经验转化为一套能够被验证、复盘和迭代的实践方法。</p>
                </div>
            </section>

            <section class="about-section" aria-labelledby="about-why">
                <div class="about-section-label">
                    <span>起点</span>
                    <h2 id="about-why">为什么做企业 AI</h2>
                </div>
                <div class="about-section-body about-prose">
                    <p>长期参与企业项目让我看到，企业真正困难的通常不是“不知道一个工具”。</p>
                    <p>真正决定项目能否落地的，是需求是否清楚、流程能否拆解、人员是否愿意改变、数据是否可用，以及方案能不能被执行和持续维护。AI 只是其中一个变量，业务结果才是起点和终点。</p>
                </div>
            </section>

            <section class="about-section" aria-labelledby="about-now">
                <div class="about-section-label">
                    <span>当前</span>
                    <h2 id="about-now">现在正在做什么</h2>
                </div>
                <div class="about-section-body about-focus-list">
                    <div>
                        <strong>企业 AI 应用场景</strong>
                        <p>识别哪些问题值得使用 AI，哪些问题应先调整流程或管理方式。</p>
                    </div>
                    <div>
                        <strong>企业 AI 诊断</strong>
                        <p>从目标、流程、人员、数据与实施风险出发，判断机会是否成立。</p>
                    </div>
                    <div>
                        <strong>工作流与产品实验</strong>
                        <p>把判断做成可操作的流程、原型和小工具，再用真实反馈修正。</p>
                    </div>
                    <div>
                        <strong>企业 AI 创业实践</strong>
                        <p>记录从问题发现、用户访谈到交付验证的过程，而不是只展示结果。</p>
                    </div>
                </div>
            </section>

            <section class="about-section about-method-section" aria-labelledby="about-method">
                <div class="about-section-label">
                    <span>方法</span>
                    <h2 id="about-method">我的工作方法</h2>
                </div>
                <div class="about-section-body">
                    <p class="about-method-intro">不从模型开始，从业务现场开始。</p>
                    <ol class="about-method" aria-label="企业 AI 实践方法">
                        <li>
                            <small>01</small>
                            <strong>访谈</strong>
                            <span>还原目标、流程和真实约束。</span>
                        </li>
                        <li>
                            <small>02</small>
                            <strong>诊断</strong>
                            <span>找到高频、耗时且可以衡量的环节。</span>
                        </li>
                        <li>
                            <small>03</small>
                            <strong>原型</strong>
                            <span>用最小闭环验证关键假设。</span>
                        </li>
                        <li>
                            <small>04</small>
                            <strong>交付</strong>
                            <span>让结果进入行动，并持续接收反馈。</span>
                        </li>
                    </ol>
                </div>
            </section>

            <section class="about-section about-public-section" aria-labelledby="about-public">
                <div class="about-section-label">
                    <span>公开资产</span>
                    <h2 id="about-public">继续了解我的实践</h2>
                </div>
                <div class="about-section-body">
                    <a class="about-public-link" href="{{ '/knowledge/' | relative_url }}">
                        <span>
                            <strong>企业 AI 现场工作簿</strong>
                            <small>企业访谈、流程诊断、产品实验与创业交付的公开记录。</small>
                        </span>
                        <span aria-hidden="true">→</span>
                    </a>
                </div>
            </section>

            {% assign contact_email = site.social.email | default: '' | strip %}
            {% assign twitter_handle = site.social.twitter | default: '' | strip %}
            {% if contact_email != empty or twitter_handle != empty %}
            <section class="about-section" aria-labelledby="about-contact">
                <div class="about-section-label">
                    <span>联系</span>
                    <h2 id="about-contact">联系我</h2>
                </div>
                <div class="about-section-body about-contact-links">
                    {% if contact_email != empty %}<a href="mailto:{{ contact_email | escape }}">Email</a>{% endif %}
                    {% if twitter_handle != empty %}<a href="https://twitter.com/{{ twitter_handle | escape }}" target="_blank" rel="noopener noreferrer">X / Twitter</a>{% endif %}
                </div>
            </section>
            {% endif %}
        </main>
    </div>
</div>

<style>
.about-page {
    --about-paper: #f7f9fc;
    --about-ink: #111827;
    --about-muted: #64748b;
    --about-faint: #94a3b8;
    --about-line: #dbe1e8;
    --about-accent: #3155a6;
    padding: 92px 0 112px;
    color: var(--about-ink);
    background: var(--about-paper);
}

.about-container {
    max-width: 1120px;
}

.about-hero {
    max-width: 910px;
    padding-bottom: 72px;
}

.about-identity {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 34px;
}

.about-mark {
    width: 32px;
    height: 32px;
    object-fit: cover;
}

.about-identity p,
.about-section-label > span {
    margin: 0;
    color: var(--about-muted);
    font-size: 11px;
    font-weight: 650;
    letter-spacing: 0.06em;
}

.about-hero h1 {
    max-width: 850px;
    margin: 0;
    font-size: clamp(46px, 6.1vw, 72px);
    font-weight: 650;
    letter-spacing: -0.055em;
    line-height: 1.1;
}

.about-intro {
    max-width: 760px;
    margin: 30px 0 0;
    color: #475569;
    font-size: 18px;
    line-height: 1.9;
}

.about-sections {
    border-top: 1px solid var(--about-ink);
}

.about-section {
    display: grid;
    grid-template-columns: minmax(180px, .46fr) minmax(0, 1.54fr);
    gap: 72px;
    padding: 52px 0 58px;
    border-bottom: 1px solid var(--about-line);
}

.about-section-label > span {
    display: block;
    margin-bottom: 12px;
    color: var(--about-faint);
}

.about-section-label h2 {
    max-width: 230px;
    margin: 0;
    font-size: 25px;
    font-weight: 630;
    letter-spacing: -0.035em;
    line-height: 1.35;
}

.about-section-body {
    min-width: 0;
}

.about-prose {
    max-width: 720px;
    color: #334155;
    font-size: 16px;
    line-height: 1.9;
}

.about-prose p {
    margin: 0;
}

.about-prose p + p {
    margin-top: 18px;
}

.about-focus-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 46px;
}

.about-focus-list > div {
    min-height: 138px;
    padding: 5px 0 26px;
    border-bottom: 1px solid var(--about-line);
}

.about-focus-list strong {
    font-size: 17px;
    font-weight: 630;
}

.about-focus-list p {
    margin: 12px 0 0;
    color: var(--about-muted);
    font-size: 13px;
    line-height: 1.75;
}

.about-method-intro {
    margin: 0 0 31px;
    color: var(--about-ink);
    font-size: 23px;
    font-weight: 630;
    letter-spacing: -0.03em;
}

.about-method {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--about-ink);
    list-style: none;
}

.about-method li {
    min-height: 192px;
    padding: 21px 20px 24px 0;
    border-bottom: 1px solid var(--about-line);
}

.about-method li + li {
    padding-left: 20px;
    border-left: 1px solid var(--about-line);
}

.about-method small,
.about-method strong,
.about-method span {
    display: block;
}

.about-method small {
    color: var(--about-faint);
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 9px;
}

.about-method strong {
    margin-top: 30px;
    font-size: 20px;
    font-weight: 650;
}

.about-method span {
    margin-top: 12px;
    color: var(--about-muted);
    font-size: 12px;
    line-height: 1.7;
}

.about-public-link {
    display: flex;
    gap: 32px;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0 22px;
    border-bottom: 1px solid var(--about-ink);
    color: var(--about-ink);
    text-decoration: none;
}

.about-public-link strong,
.about-public-link small {
    display: block;
}

.about-public-link strong {
    font-size: 24px;
    font-weight: 630;
    letter-spacing: -0.025em;
}

.about-public-link small {
    margin-top: 9px;
    color: var(--about-muted);
    font-size: 13px;
    line-height: 1.7;
}

.about-public-link > span:last-child {
    color: var(--about-faint);
    font-size: 21px;
}

.about-public-link:hover strong,
.about-public-link:focus-visible strong {
    color: var(--about-accent);
}

.about-public-link:focus-visible,
.about-contact-links a:focus-visible {
    outline: 2px solid var(--about-accent);
    outline-offset: 5px;
}

.about-contact-links {
    display: flex;
    gap: 24px;
}

.about-contact-links a {
    color: var(--about-ink);
    text-underline-offset: 4px;
}

[data-theme="dark"] .about-page {
    --about-paper: #10141b;
    --about-ink: #eef1f5;
    --about-muted: #a0aaba;
    --about-faint: #778295;
    --about-line: #2d3542;
    --about-accent: #9da7ff;
}

[data-theme="dark"] .about-intro,
[data-theme="dark"] .about-prose {
    color: #b8c1ce;
}

@media (max-width: 760px) {
    .about-page {
        padding: 58px 0 78px;
    }

    .about-hero {
        padding-bottom: 52px;
    }

    .about-identity {
        margin-bottom: 25px;
    }

    .about-hero h1 {
        font-size: clamp(39px, 11vw, 48px);
    }

    .about-intro {
        margin-top: 22px;
        font-size: 16px;
        line-height: 1.8;
    }

    .about-section {
        grid-template-columns: 1fr;
        gap: 26px;
        padding: 39px 0 43px;
    }

    .about-section-label h2 {
        max-width: none;
        font-size: 23px;
    }

    .about-prose {
        font-size: 15px;
        line-height: 1.85;
    }

    .about-focus-list {
        grid-template-columns: 1fr;
    }

    .about-focus-list > div {
        min-height: 0;
        padding: 18px 0 22px;
    }

    .about-focus-list > div:first-child {
        padding-top: 0;
    }

    .about-method-intro {
        font-size: 21px;
    }

    .about-method {
        grid-template-columns: 1fr 1fr;
    }

    .about-method li {
        min-height: 164px;
        padding: 19px 16px 21px 0;
    }

    .about-method li + li {
        padding-left: 16px;
    }

    .about-method li:nth-child(3) {
        padding-left: 0;
        border-left: 0;
    }

    .about-method strong {
        margin-top: 22px;
        font-size: 18px;
    }

    .about-public-link strong {
        font-size: 21px;
    }
}
</style>
