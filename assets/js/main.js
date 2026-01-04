// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
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
    
    // 微信按钮点击事件
    const wechatButton = document.getElementById('wechatButton');
    if (wechatButton) {
        wechatButton.addEventListener('click', function() {
            // 获取配置的微信号（从 data 属性或全局变量）
            const wechatId = this.getAttribute('data-wechat-id') || window.siteConfig?.wechatId;
            if (wechatId && wechatId !== '请配置微信号') {
                // 复制微信号到剪贴板
                if (navigator.clipboard) {
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
        });
    }
});

