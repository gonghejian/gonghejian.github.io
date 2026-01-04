// 管理员面板功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查管理员权限
    if (typeof auth !== 'undefined' && auth.isAdmin()) {
        loadAdminData();
        initTabs();
        updateWelcomeMessage();
    } else {
        // 如果不是管理员，重定向到个人中心或首页
        if (typeof auth !== 'undefined' && auth.isAuthenticated()) {
            window.location.href = '/profile.html';
        } else {
            window.location.href = '/';
        }
    }
});

function initTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // 更新标签状态
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 更新内容显示
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            const content = document.getElementById('tab-' + tabName);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

function updateWelcomeMessage() {
    if (typeof auth !== 'undefined') {
        const authData = auth.getAuth();
        if (authData) {
            const welcomeEl = document.getElementById('adminWelcome');
            if (welcomeEl) {
                welcomeEl.textContent = `欢迎回来，${authData.name || authData.username}`;
            }
        }
    }
}

function loadAdminData() {
    // 加载统计数据
    loadStats();
    
    // 加载最近文章
    loadRecentPosts();
    
    // 加载用户列表
    loadUsers();
}

function loadStats() {
    // 这里应该从后端API获取数据
    // 简化版本：从页面数据计算
    
    // 总文章数（从Jekyll数据获取）
    const posts = document.querySelectorAll('[data-post-count]');
    const totalPosts = posts.length || 0;
    
    // 分类数
    const categories = new Set();
    document.querySelectorAll('[data-category]').forEach(el => {
        categories.add(el.getAttribute('data-category'));
    });
    
    // 标签数
    const tags = new Set();
    document.querySelectorAll('[data-tag]').forEach(el => {
        tags.add(el.getAttribute('data-tag'));
    });
    
    // 用户数（从localStorage获取）
    const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
    const totalUsers = users.length;
    
    // 更新显示
    document.getElementById('totalPosts').textContent = totalPosts || '{{ site.posts.size }}';
    document.getElementById('totalCategories').textContent = categories.size || 6;
    document.getElementById('totalTags').textContent = tags.size || 0;
    document.getElementById('totalUsers').textContent = totalUsers || 2;
}

function loadRecentPosts() {
    // 这里应该从后端API获取
    // 简化版本：显示提示信息
    const tbody = document.getElementById('recentPosts');
    
    // 实际应该从API获取文章列表
    tbody.innerHTML = `
        <tr>
            <td>欢迎来到我的博客</td>
            <td>生活方式</td>
            <td>2024-01-15</td>
            <td>
                <a href="#" style="color: var(--color-primary); text-decoration: none; font-size: 14px;">编辑</a>
            </td>
        </tr>
        <tr>
            <td>Jekyll 入门指南</td>
            <td>技术分享</td>
            <td>2024-01-20</td>
            <td>
                <a href="#" style="color: var(--color-primary); text-decoration: none; font-size: 14px;">编辑</a>
            </td>
        </tr>
    `;
}

function loadUsers() {
    // 从localStorage获取用户列表
    const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
    const authData = JSON.parse(localStorage.getItem('blog_auth') || 'null');
    
    const tbody = document.getElementById('usersList');
    
    let html = '';
    
    // 显示本地用户
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.username}</td>
                <td><span style="padding: 2px 8px; background: ${user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-bg-secondary)'}; color: ${user.role === 'admin' ? 'white' : 'var(--color-text)'}; border-radius: 4px; font-size: 12px;">${user.role === 'admin' ? '管理员' : '用户'}</span></td>
                <td>本地</td>
                <td>-</td>
            </tr>
        `;
    });
    
    // 显示当前登录用户（如果是GitHub登录）
    if (authData && authData.loginMethod === 'github') {
        html += `
            <tr>
                <td>${authData.username}</td>
                <td><span style="padding: 2px 8px; background: ${authData.role === 'admin' ? 'var(--color-primary)' : 'var(--color-bg-secondary)'}; color: ${authData.role === 'admin' ? 'white' : 'var(--color-text)'}; border-radius: 4px; font-size: 12px;">${authData.role === 'admin' ? '管理员' : '用户'}</span></td>
                <td>GitHub</td>
                <td>${new Date(authData.loginTime).toLocaleString('zh-CN')}</td>
            </tr>
        `;
    }
    
    if (html === '') {
        html = '<tr><td colspan="4" style="text-align: center; color: var(--color-text-secondary);">暂无用户数据</td></tr>';
    }
    
    tbody.innerHTML = html;
}

