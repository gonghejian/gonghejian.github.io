// 认证系统
class AuthSystem {
    constructor() {
        this.storageKey = 'blog_auth';
        // 从_config.yml获取（需要通过Jekyll变量，这里使用默认值）
        this.githubClientId = 'YOUR_GITHUB_CLIENT_ID'; // 需要在_config.yml中配置
        this.githubRedirectUri = window.location.origin + '/auth/callback.html';
        this.init();
    }

    init() {
        // 检查是否已登录
        this.checkAuth();
        
        // 绑定登录按钮事件
        const githubBtn = document.getElementById('githubLoginBtn');
        if (githubBtn) {
            githubBtn.addEventListener('click', () => this.githubLogin());
        }

        // 绑定本地登录表单
        const loginForm = document.getElementById('localLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLocalLogin(e));
        }

        // 检查GitHub回调
        if (window.location.pathname.includes('auth/callback.html')) {
            this.handleGitHubCallback();
        }
    }

    // GitHub OAuth 登录
    githubLogin() {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.githubClientId}&redirect_uri=${encodeURIComponent(this.githubRedirectUri)}&scope=read:user&state=${this.generateState()}`;
        window.location.href = githubAuthUrl;
    }

    // 处理GitHub回调
    async handleGitHubCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
            console.error('No authorization code received');
            return;
        }

        try {
            // 这里需要后端API来交换token，或者使用GitHub Pages Functions
            // 简化版本：直接使用code（不安全，仅用于演示）
            const user = await this.exchangeCodeForUser(code);
            
            if (user) {
                // 检查是否为管理员
                const isAdmin = this.checkAdminUser(user.login);
                const userData = {
                    username: user.login,
                    name: user.name || user.login,
                    avatar: user.avatar_url,
                    role: isAdmin ? 'admin' : 'user',
                    loginMethod: 'github',
                    loginTime: new Date().toISOString()
                };
                
                this.setAuth(userData);
                window.location.href = '/';
            }
        } catch (error) {
            console.error('GitHub auth error:', error);
            this.showError('GitHub 登录失败，请重试');
        }
    }

    // 交换code获取用户信息（需要后端支持）
    async exchangeCodeForUser(code) {
        // 注意：这需要后端API，因为client_secret不能暴露在前端
        // 这里使用模拟数据，实际应该调用后端API
        try {
            // 如果使用GitHub Pages，可以使用Serverless Functions
            const response = await fetch('/api/github-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('API call failed, using fallback');
        }

        // 回退方案：使用localStorage存储code（不安全，仅用于演示）
        // 实际项目中应该使用后端API
        return null;
    }

    // 本地登录
    handleLocalLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 验证用户（实际应该调用后端API）
        const user = this.verifyLocalUser(username, password);
        
        if (user) {
            const userData = {
                username: user.username,
                name: user.name,
                role: user.role,
                loginMethod: 'local',
                loginTime: new Date().toISOString()
            };
            
            this.setAuth(userData);
            window.location.href = '/';
        } else {
            this.showError('用户名或密码错误');
        }
    }

    // 验证本地用户（简化版本，实际应该调用后端API）
    verifyLocalUser(username, password) {
        // 这里应该从后端API验证
        // 简化版本：使用预设用户（仅用于演示，不安全）
        const users = this.getLocalUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            return {
                username: user.username,
                name: user.name,
                role: user.role
            };
        }
        return null;
    }

    // 获取本地用户列表（应该从后端获取）
    getLocalUsers() {
        // 简化版本：从localStorage获取（不安全，仅用于演示）
        const stored = localStorage.getItem('blog_users');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // 默认用户（仅用于演示）
        const defaultUsers = [
            {
                username: 'admin',
                password: 'admin123', // 实际应该使用哈希密码
                name: '管理员',
                role: 'admin'
            },
            {
                username: 'user',
                password: 'user123',
                name: '普通用户',
                role: 'user'
            }
        ];
        
        localStorage.setItem('blog_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }

    // 检查是否为管理员
    checkAdminUser(githubUsername) {
        // 从配置中获取管理员列表
        const adminUsers = ['your-github-username']; // 应该在_config.yml中配置
        return adminUsers.includes(githubUsername);
    }

    // 设置认证信息
    setAuth(userData) {
        const authData = {
            ...userData,
            token: this.generateToken(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24小时
        };
        localStorage.setItem(this.storageKey, JSON.stringify(authData));
        this.updateUI();
    }

    // 检查认证状态
    checkAuth() {
        const authData = this.getAuth();
        
        if (authData && authData.expiresAt > Date.now()) {
            this.updateUI();
            return true;
        } else {
            this.clearAuth();
            return false;
        }
    }

    // 获取认证信息
    getAuth() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // 清除认证信息
    clearAuth() {
        localStorage.removeItem(this.storageKey);
        this.updateUI();
    }

    // 登出
    logout() {
        this.clearAuth();
        window.location.href = '/';
    }

    // 检查是否为管理员
    isAdmin() {
        const auth = this.getAuth();
        return auth && auth.role === 'admin';
    }

    // 检查是否已登录
    isAuthenticated() {
        return this.checkAuth();
    }

    // 更新UI
    updateUI() {
        const auth = this.getAuth();
        const userMenu = document.getElementById('userMenu');
        const loginLink = document.getElementById('loginLink');
        const loginLinkHeader = document.getElementById('loginLinkHeader');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminPanelLink = document.getElementById('adminPanelLink');
        const adminPanelLinkMenu = document.getElementById('adminPanelLinkMenu');

        if (auth) {
            // 显示用户菜单
            if (userMenu) {
                userMenu.style.display = 'flex';
                const userName = userMenu.querySelector('.user-name');
                if (userName) {
                    userName.textContent = auth.name || auth.username;
                }
                const userAvatar = userMenu.querySelector('.user-avatar');
                if (userAvatar && auth.avatar) {
                    userAvatar.src = auth.avatar;
                    userAvatar.style.display = 'block';
                } else if (userAvatar) {
                    // 如果没有头像，显示首字母
                    userAvatar.style.display = 'none';
                }
            }

            // 隐藏登录链接
            if (loginLink) {
                loginLink.style.display = 'none';
            }
            if (loginLinkHeader) {
                loginLinkHeader.style.display = 'none';
            }

            // 显示登出按钮
            if (logoutBtn) {
                logoutBtn.style.display = 'block';
                logoutBtn.onclick = () => this.logout();
            }

            // 显示管理员面板链接（如果是管理员）
            if (adminPanelLink && this.isAdmin()) {
                adminPanelLink.style.display = 'block';
            }
            if (adminPanelLinkMenu && this.isAdmin()) {
                adminPanelLinkMenu.style.display = 'block';
            } else if (adminPanelLinkMenu) {
                // 普通用户显示个人中心链接
                const profileLink = document.createElement('a');
                profileLink.href = '/profile.html';
                profileLink.className = 'user-dropdown-item';
                profileLink.textContent = '个人中心';
                adminPanelLinkMenu.parentNode.insertBefore(profileLink, adminPanelLinkMenu);
            }
        } else {
            // 隐藏用户菜单
            if (userMenu) {
                userMenu.style.display = 'none';
            }

            // 显示登录链接
            if (loginLink) {
                loginLink.style.display = 'block';
            }
            if (loginLinkHeader) {
                loginLinkHeader.style.display = 'block';
            }

            // 隐藏登出按钮
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }

            // 隐藏管理员面板链接
            if (adminPanelLink) {
                adminPanelLink.style.display = 'none';
            }
            if (adminPanelLinkMenu) {
                adminPanelLinkMenu.style.display = 'none';
            }
        }
    }

    // 显示错误信息
    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    // 生成状态token
    generateState() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // 生成JWT token（简化版本）
    generateToken() {
        return btoa(JSON.stringify({
            timestamp: Date.now(),
            random: Math.random()
        }));
    }

    // 保护路由
    protectRoute(requiredRole = 'user') {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }

        if (requiredRole === 'admin' && !this.isAdmin()) {
            window.location.href = '/';
            return false;
        }

        return true;
    }
}

// 初始化认证系统
const auth = new AuthSystem();

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}

