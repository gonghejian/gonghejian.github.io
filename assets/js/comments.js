// 评论系统
(function() {
    'use strict';
    
    // 获取当前页面的唯一标识（使用路径）
    const pageId = window.location.pathname || '/';
    
    // 评论存储键名
    const STORAGE_KEY = 'blog_comments_' + btoa(pageId).replace(/[+/=]/g, '');
    
    // 评论系统类
    class CommentSystem {
        constructor() {
            this.comments = this.loadComments();
            this.init();
        }
        
        // 初始化
        init() {
            this.renderComments();
            this.setupForm();
            this.updateCommentCount();
        }
        
        // 加载评论
        loadComments() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch (e) {
                console.error('加载评论失败:', e);
            }
            return [];
        }
        
        // 保存评论
        saveComments() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.comments));
            } catch (e) {
                console.error('保存评论失败:', e);
            }
        }
        
        // 添加评论
        addComment(author, text) {
            const comment = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                author: author || '匿名访客',
                text: text.trim(),
                date: new Date().toISOString(),
                likes: 0,
                replies: []
            };
            
            this.comments.unshift(comment); // 新评论放在最前面
            this.saveComments();
            this.renderComments();
            this.updateCommentCount();
            
            return comment;
        }
        
        // 点赞评论
        likeComment(commentId) {
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                comment.likes = (comment.likes || 0) + 1;
                this.saveComments();
                this.renderComments();
            }
        }
        
        // 渲染评论列表
        renderComments() {
            const container = document.getElementById('commentsList');
            if (!container) return;
            
            if (this.comments.length === 0) {
                container.innerHTML = '<div class="comments-empty" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">暂无评论，快来发表第一条评论吧！</div>';
                return;
            }
            
            container.innerHTML = this.comments.map(comment => {
                const date = this.formatDate(comment.date);
                const avatar = this.getAvatar(comment.author);
                
                return `
                    <div class="comment-item" data-comment-id="${comment.id}">
                        <div class="comment-avatar">${avatar}</div>
                        <div class="comment-content">
                            <div class="comment-header">
                                <span class="comment-author">${this.escapeHtml(comment.author)}</span>
                                <span class="comment-time">${date}</span>
                            </div>
                            <div class="comment-body">
                                <p>${this.formatCommentText(comment.text)}</p>
                            </div>
                            <div class="comment-actions">
                                <button class="comment-action-btn" onclick="commentSystem.likeComment('${comment.id}')">
                                    👍 <span class="like-count">${comment.likes || 0}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // 格式化日期
        formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (seconds < 60) {
                return '刚刚';
            } else if (minutes < 60) {
                return `${minutes} 分钟前`;
            } else if (hours < 24) {
                return `${hours} 小时前`;
            } else if (days < 7) {
                return `${days} 天前`;
            } else {
                return date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }
        
        // 获取头像（显示首字符）
        getAvatar(name) {
            if (!name || name === '匿名访客') {
                return '匿';
            }
            // 获取第一个字符（支持中文和英文）
            const firstChar = name.charAt(0);
            return firstChar.toUpperCase();
        }
        
        // 转义 HTML
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // 格式化评论文本（支持换行）
        formatCommentText(text) {
            return this.escapeHtml(text).replace(/\n/g, '<br>');
        }
        
        // 设置表单
        setupForm() {
            const form = document.getElementById('commentForm');
            if (!form) return;
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const authorInput = document.getElementById('commentAuthor');
                const textInput = document.getElementById('commentText');
                
                const author = (authorInput.value || '').trim();
                const text = textInput.value.trim();
                
                if (!text) {
                    alert('请输入评论内容');
                    return;
                }
                
                // 添加评论
                this.addComment(author || null, text);
                
                // 清空表单
                textInput.value = '';
                if (authorInput) {
                    authorInput.value = '';
                }
                
                // 显示成功提示
                this.showSuccessMessage();
            });
        }
        
        // 显示成功消息
        showSuccessMessage() {
            const form = document.getElementById('commentForm');
            if (!form) return;
            
            const successMsg = document.createElement('div');
            successMsg.className = 'comment-success';
            successMsg.textContent = '评论已发表！';
            successMsg.style.cssText = 'padding: 10px; background: #d4edda; color: #155724; border-radius: 4px; margin-top: 10px;';
            
            form.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        }
        
        // 更新评论数量
        updateCommentCount() {
            const countEl = document.getElementById('commentCount');
            if (countEl) {
                const count = this.comments.length;
                countEl.textContent = count > 0 ? `(${count})` : '';
            }
        }
    }
    
    // 初始化评论系统
    let commentSystem;
    function initCommentSystem() {
        commentSystem = new CommentSystem();
        window.commentSystem = commentSystem;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCommentSystem);
    } else {
        initCommentSystem();
    }
})();

