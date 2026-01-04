// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
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

