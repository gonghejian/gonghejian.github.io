---
layout: default
title: AI 时代个人系统白皮书
permalink: /whitepaper/
description: 写给中高端职场人的 AI 时代个人系统重建手册。
---

<div class="whitepaper-page">
    <div class="container">
        <section class="whitepaper-hero">
            <p class="whitepaper-kicker">Whitepaper</p>
            <h1>AI 时代个人系统白皮书</h1>
            <p class="whitepaper-lead">一份写给中高端职场人的 20 页行动手册。</p>
            <p class="whitepaper-description">
                它不是 AI 工具清单，而是一套关于工作流、知识出口、身体底盘和个人商业化的系统框架。
            </p>
        </section>

        <section class="whitepaper-section">
            <h2>这份白皮书解决什么问题</h2>
            <div class="whitepaper-grid">
                <article>
                    <h3>AI 替代焦虑</h3>
                    <p>从追逐工具，转向重建自己的工作流和交付方式。</p>
                </article>
                <article>
                    <h3>组织依赖</h3>
                    <p>把组织内能力翻译成组织之外也能运转的个人系统。</p>
                </article>
                <article>
                    <h3>知识无出口</h3>
                    <p>让阅读、笔记和项目经验变成文章、产品、决策和服务。</p>
                </article>
                <article>
                    <h3>长期输出失稳</h3>
                    <p>用训练、饮食、睡眠和恢复维护判断力、交付力和选择权。</p>
                </article>
            </div>
        </section>

        <section class="whitepaper-section">
            <h2>你会得到什么</h2>
            <ul class="whitepaper-list">
                <li>一套 AI 工作流重建框架</li>
                <li>一份个人知识系统出口模型</li>
                <li>一个一人公司 90 天启动路径</li>
                <li>一个身体底盘与输出节奏的基础模板</li>
            </ul>
        </section>

        <section class="whitepaper-section whitepaper-status">
            <h2>当前状态</h2>
            <p>
                白皮书正在整理中。你可以先阅读精选文章，或通过关于页面联系我参与种子用户访谈。
            </p>
            <div class="whitepaper-actions">
                <a href="{{ '/docs/' | relative_url }}">阅读精选文章</a>
                <a href="{{ '/about/' | relative_url }}">联系我</a>
            </div>
        </section>
    </div>
</div>

<style>
.whitepaper-page {
    padding: 72px 0 88px;
}

.whitepaper-hero {
    max-width: 760px;
    margin-bottom: var(--spacing-lg);
}

.whitepaper-kicker {
    margin: 0 0 var(--spacing-xs);
    color: var(--color-text-secondary);
    font-family: 'SF Mono', Monaco, Consolas, monospace;
    font-size: 12px;
    line-height: 1.6;
    letter-spacing: 0;
    text-transform: uppercase;
}

.whitepaper-hero h1 {
    margin: 0;
    color: var(--color-text);
    font-size: 44px;
    line-height: 1.18;
    font-weight: 720;
    letter-spacing: 0;
}

.whitepaper-lead {
    margin: var(--spacing-sm) 0 0;
    color: var(--color-text);
    font-size: 24px;
    line-height: 1.45;
    font-weight: 650;
}

.whitepaper-description {
    margin: var(--spacing-sm) 0 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-large);
    line-height: 1.8;
}

.whitepaper-section {
    max-width: 900px;
    padding: var(--spacing-lg) 0;
    border-top: 1px solid var(--color-border);
}

.whitepaper-section h2 {
    margin: 0 0 var(--spacing-md);
    color: var(--color-text);
    font-size: var(--font-size-h3);
    line-height: 1.35;
    font-weight: 680;
}

.whitepaper-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-md);
}

.whitepaper-grid article {
    min-height: 132px;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: 8px;
}

.whitepaper-grid h3 {
    margin: 0;
    color: var(--color-text);
    font-size: var(--font-size-large);
    line-height: 1.45;
    font-weight: 650;
}

.whitepaper-grid p,
.whitepaper-status p {
    margin: var(--spacing-xs) 0 0;
    color: var(--color-text-secondary);
    line-height: 1.75;
}

.whitepaper-list {
    display: grid;
    gap: var(--spacing-sm);
    margin: 0;
    padding: 0;
    list-style: none;
}

.whitepaper-list li {
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    background: var(--color-bg-secondary);
}

.whitepaper-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
}

.whitepaper-actions a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 0 var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    text-decoration: none;
    font-size: var(--font-size-small);
    font-weight: 650;
    transition: var(--transition);
}

.whitepaper-actions a:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-bg-secondary);
}

@media (max-width: 768px) {
    .whitepaper-page {
        padding: 48px 0 64px;
    }

    .whitepaper-hero h1 {
        font-size: 34px;
    }

    .whitepaper-lead {
        font-size: 20px;
    }

    .whitepaper-description {
        font-size: var(--font-size-base);
    }

    .whitepaper-section {
        padding: var(--spacing-md) 0;
    }

    .whitepaper-grid {
        grid-template-columns: 1fr;
    }

    .whitepaper-actions a {
        flex: 1 1 auto;
    }
}
</style>
