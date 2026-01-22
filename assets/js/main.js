// 主题切换功能
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // 应用保存的主题
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// 语言切换功能
function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    const currentLang = localStorage.getItem('lang') || 'zh';
    
    // 应用保存的语言
    if (currentLang === 'en') {
        document.documentElement.setAttribute('lang', 'en');
        if (langToggle) {
            langToggle.querySelector('.lang-text').textContent = 'EN';
        }
    }
    
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const currentLang = document.documentElement.getAttribute('lang') || 'zh-CN';
            const newLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
            const langText = newLang === 'en' ? 'EN' : '中';
            
            document.documentElement.setAttribute('lang', newLang);
            localStorage.setItem('lang', newLang);
            langToggle.querySelector('.lang-text').textContent = langText;
            
            // 这里可以添加实际的语言切换逻辑
            // 例如：重新加载页面或更新文本内容
        });
    }
}

// 邮件订阅表单处理
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (email) {
                // 这里可以添加实际的邮件订阅逻辑
                // 例如：发送到后端 API 或第三方服务
                alert('感谢订阅！我们会及时为您推送最新内容。');
                emailInput.value = '';
            }
        });
    }
}

// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题和语言
    initTheme();
    initLanguage();
    initNewsletter();
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        // 使用 touchstart 和 click 事件，确保移动端和桌面端都能正常工作
        const handleMenuToggle = function(e) {
            e.preventDefault();
            e.stopPropagation();
            navList.classList.toggle('active');
        };
        
        menuToggle.addEventListener('touchstart', handleMenuToggle, { passive: false });
        menuToggle.addEventListener('click', handleMenuToggle);
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 微信按钮点击事件（支持触摸和点击）
    const wechatButton = document.getElementById('wechatButton');
    if (wechatButton) {
        // 使用 touchstart 和 click 事件，确保移动端和桌面端都能正常工作
        const handleWechatClick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 获取配置的微信号（从 data 属性或全局变量）
            const wechatId = wechatButton.getAttribute('data-wechat-id') || window.siteConfig?.wechatId;
            if (wechatId && wechatId !== '请配置微信号' && wechatId !== 'your-wechat-id') {
                // 复制微信号到剪贴板
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(wechatId).then(function() {
                        alert('微信号已复制到剪贴板：' + wechatId + '\n\n请在微信中搜索并添加我！');
                    }).catch(function() {
                        // 如果复制失败，显示提示框
                        prompt('请复制以下微信号：', wechatId);
                    });
                } else {
                    // 不支持剪贴板 API，使用 prompt
                    prompt('请复制以下微信号：', wechatId);
                }
            } else {
                // 如果没有配置，显示提示
                alert('请先在 _config.yml 中配置 wechat_id 或 wechat_private\n\n配置后点击按钮即可复制微信号或查看二维码');
            }
        };
        
        // 添加触摸和点击事件
        wechatButton.addEventListener('touchstart', handleWechatClick, { passive: false });
        wechatButton.addEventListener('click', handleWechatClick);
    }
    
    // 移动端菜单点击外部区域关闭
    document.addEventListener('click', function(e) {
        const navList = document.querySelector('.nav-list');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navList && menuToggle && navList.classList.contains('active')) {
            // 如果点击的不是菜单或菜单按钮，则关闭菜单
            if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
                navList.classList.remove('active');
            }
        }
    });
});

