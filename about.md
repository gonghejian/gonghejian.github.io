---
layout: default
title: 关于
permalink: /about/
---

<div class="about-page">
    <div class="container">
        <div class="about-hero">
            <div class="about-avatar">
                <img src="{{ '/assets/images/avatar.jpg' | relative_url }}" alt="{{ site.title }}" class="avatar-image" onerror="this.src='{{ '/favicon.ico' | relative_url }}'; this.onerror=null;">
            </div>
            <h1 class="about-name">{{ site.title }}</h1>
            {% if site.subtitle %}
            <p class="about-subtitle">{{ site.subtitle }}</p>
            {% endif %}
            <p class="about-description">
                我长期关注项目管理、阅读、训练、AI 工具和个人系统建设。过去的经验来自组织，未来的能力必须能脱离组织独立运转。这个网站记录的，就是这个转变过程。
            </p>
            {% if site.social.twitter %}
            <div class="about-actions">
                <a href="https://twitter.com/{{ site.social.twitter }}" target="_blank" rel="noopener noreferrer" class="about-follow-btn">
                    关注我
                </a>
            </div>
            {% endif %}
        </div>
        
        <div class="about-content">
            <div class="about-section">
                <h2 class="section-title">实验室</h2>
                <p class="section-description">正在被验证的小工具、自动化流程和产品原型。</p>
                {% assign projects = site.projects | sort: "order" %}
                {% if projects.size > 0 %}
                <div class="projects-grid">
                    {% for project in projects %}
                    <div class="project-item">
                        {% assign target_link = project.link | default: project.url %}
                        {% if project.icon %}
                        <div class="project-icon">{{ project.icon }}</div>
                        {% endif %}
                        <div class="project-content">
                            <h3 class="project-title">
                                {% if project.external %}
                                <a href="{{ target_link }}" target="_blank" rel="noopener noreferrer">{{ project.title }}</a>
                                {% else %}
                                <a href="{{ target_link | relative_url }}">{{ project.title }}</a>
                                {% endif %}
                            </h3>
                            {% if project.short_description %}
                            <p class="project-description">{{ project.short_description }}</p>
                            {% elsif project.description %}
                            <p class="project-description">{{ project.description }}</p>
                            {% endif %}
                        </div>
                    </div>
                    {% endfor %}
                </div>
                {% else %}
                <p class="projects-empty">暂无项目</p>
                {% endif %}
            </div>
        </div>
    </div>
</div>

<style>
.about-page {
    padding: 60px 0 80px;
}

.about-hero {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 80px;
}

.about-avatar {
    margin-bottom: 24px;
}

.avatar-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    margin: 0 auto;
}

.about-name {
    font-size: 32px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: var(--color-text);
    line-height: 1.2;
    letter-spacing: -0.01em;
}

.about-subtitle {
    font-size: 16px;
    color: var(--color-text-secondary);
    margin: 0 0 16px 0;
    font-weight: 400;
    line-height: 1.5;
}

.about-description {
    font-size: 15px;
    color: var(--color-text);
    line-height: 1.6;
    margin: 0 0 24px 0;
    max-width: 100%;
}

.about-actions {
    margin-top: 24px;
}

.about-follow-btn {
    display: inline-block;
    padding: 8px 16px;
    background: var(--color-text);
    color: var(--color-bg);
    border-radius: 6px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: var(--transition);
    border: none;
}

.about-follow-btn:hover {
    background: var(--color-primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.about-content {
    max-width: 900px;
    margin: 0 auto;
}

.about-section {
    margin-bottom: 64px;
    text-align: center;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: var(--color-text);
    letter-spacing: -0.01em;
    line-height: 1.4;
}

.section-description {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0 0 24px 0;
    font-weight: 400;
    line-height: 1.5;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
    text-align: left;
}

.project-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 0;
    transition: var(--transition);
}

.project-icon {
    font-size: 24px;
    line-height: 1;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary);
    border-radius: 8px;
    transition: var(--transition);
}

.project-item:hover .project-icon {
    background: var(--color-primary);
    transform: scale(1.05);
}

.project-content {
    flex: 1;
    min-width: 0;
}

.project-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
    line-height: 1.4;
    letter-spacing: -0.01em;
}

.project-title a {
    color: var(--color-text);
    text-decoration: none;
    transition: var(--transition);
    border-bottom: none;
    display: inline-block;
}

.project-title a:hover {
    color: var(--color-primary);
}

.project-description {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin: 0;
}

.projects-empty {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    font-style: italic;
}

@media (max-width: 768px) {
    .about-page {
        padding: 40px 0 60px;
    }
    
    .about-hero {
        margin-bottom: 60px;
        padding: 0 16px;
    }
    
    .avatar-image {
        width: 64px;
        height: 64px;
    }
    
    .about-name {
        font-size: 28px;
    }
    
    .about-subtitle {
        font-size: 15px;
    }
    
    .about-description {
        font-size: 14px;
    }
    
    .about-content {
        padding: 0 16px;
    }
    
    .about-section {
        margin-bottom: 48px;
    }
    
    .section-title {
        font-size: 18px;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .project-item {
        gap: 10px;
    }
    
    .project-icon {
        width: 36px;
        height: 36px;
        font-size: 20px;
    }
    
    .project-title {
        font-size: 15px;
    }
    
    .project-description {
        font-size: 12px;
    }
}
</style>

