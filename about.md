---
layout: default
title: 关于
permalink: /about/
---

<div class="about-page">
    <div class="container">
        <div class="about-content">
            <h1 class="page-title">关于我</h1>
            
            <div class="about-section">
                <h2>简介</h2>
                <p>
                    欢迎来到弓箭的博客！这里记录着我的思考、学习和探索。
                </p>
                <p>
                    我热爱技术，喜欢分享知识，希望通过这个博客与更多人交流。
                </p>
            </div>
            
            <div class="about-section">
                <h2>技能</h2>
                <ul>
                    <li>Web 开发</li>
                    <li>前端技术</li>
                    <li>后端开发</li>
                    <li>其他技能...</li>
                </ul>
            </div>
            
            <div class="about-section">
                <h2>联系方式</h2>
                <p>
                    如果你有任何问题或建议，欢迎通过以下方式联系我：
                </p>
                <ul>
                    <li>Email: <a href="mailto:your.email@example.com">your.email@example.com</a></li>
                    <li>GitHub: <a href="https://github.com/yourusername" target="_blank">@yourusername</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
.about-page {
    padding: var(--spacing-xl) 0;
}

.about-content {
    max-width: var(--content-width);
    margin: 0 auto;
}

.page-title {
    font-size: var(--font-size-h1);
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
    color: var(--color-text);
}

.about-section {
    margin-bottom: var(--spacing-lg);
}

.about-section h2 {
    font-size: var(--font-size-h2);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
}

.about-section p {
    font-size: var(--font-size-large);
    line-height: 1.8;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
}

.about-section ul {
    list-style: none;
    padding-left: 0;
}

.about-section li {
    font-size: var(--font-size-large);
    line-height: 1.8;
    color: var(--color-text);
    padding-left: var(--spacing-md);
    position: relative;
}

.about-section li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--color-primary);
}

.about-section a {
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: var(--transition);
}

.about-section a:hover {
    border-bottom-color: var(--color-primary);
}
</style>

