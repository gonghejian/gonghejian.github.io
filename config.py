# -*- coding: utf-8 -*-
"""
豆瓣日记导入配置文件
"""

# ==================== 豆瓣账户信息 ====================
DOUBAN_CONFIG = {
    # 豆瓣用户ID或URL
    'user_id': 'atsf',  # 修改为你的豆瓣用户ID
    
    # 登录方式选择：'phone' (短信登录) 或 'password' (密码登录)
    'login_type': 'phone',
    
    # 如果使用密码登录，填写以下信息
    'username': '',  # 邮箱或用户名
    'password': '',  # 密码 (强烈建议不要硬编码，改为环境变量)
    
    # 如果有现成的 Cookies，可以直接使用
    # 获取方法：打开 Chrome DevTools -> Application -> Cookies -> 复制 cookie_str
    'cookies_file': 'douban_cookies.json',  # 保存登录 cookies
    
    # 导入内容类型
    'import_notes': True,     # 导入日记
    'import_reviews': True,   # 导入书评
}

# ==================== 爬虫配置 ====================
SCRAPER_CONFIG = {
    # 爬虫延迟（秒），防止被封IP
    'request_delay': 2,
    
    # 浏览器配置
    'browser': {
        'headless': False,  # 是否无头模式（不显示浏览器窗口）
        'timeout': 30,  # 页面加载超时时间（秒）
    },
    
    # 代理设置（如需要）
    'proxy': None,  # 例如: 'http://proxy.example.com:8080'
    
    # User-Agent
    'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}

# ==================== 内容转换配置 ====================
CONTENT_CONFIG = {
    # 图片处理方式：'keep_link' (保留链接) 或 'download' (下载本地)
    'image_handling': 'download',  # 书评需要保留图片，改为 download
    
    # 本地图片保存目录（如果选择 download）
    'image_dir': 'assets/images/douban-import/',
    
    # 是否保留豆瓣原文链接
    'keep_source_link': True,
}

# ==================== Jekyll 配置 ====================
JEKYLL_CONFIG = {
    # 文章分类
    'default_category': ['diary'],  # 默认分类
    
    # 文章标签
    'default_tags': ['豆瓣日记'],  # 默认标签
    
    # 书评专用配置
    'review_category': ['reading'],  # 书评分类
    'review_tags': ['豆瓣书评'],     # 书评标签
    
    # 文章作者
    'author': 'gong',
    
    # 文章 layout
    'layout': 'post',
    
    # 输出目录
    'output_dir': '_posts/',
    
    # 草稿目录（可选）
    'draft_dir': '_drafts/',
}

# ==================== 导入筛选条件 ====================
FILTER_CONFIG = {
    # 导入的日期范围（格式: 'YYYY-MM-DD'）
    'start_date': None,  # None 表示从最早开始
    'end_date': None,    # None 表示到最近
    
    # 最少字数要求
    'min_length': 100,
    
    # 排除的关键词（包含这些关键词的日记会被跳过）
    'exclude_keywords': [],
    
    # 只导入包含特定关键词的日记（空列表表示导入所有）
    'include_keywords': [],
}

# ==================== 日志和输出 ====================
OUTPUT_CONFIG = {
    # 原始数据输出
    'raw_data_file': 'douban_notes.json',
    
    # 转换后的数据输出
    'converted_data_file': 'douban_notes_converted.json',
    
    # 导入报告
    'report_file': 'DOUBAN_IMPORT_REPORT.md',
    
    # 日志文件
    'log_file': 'douban_import.log',
    
    # 日志级别：'DEBUG', 'INFO', 'WARNING', 'ERROR'
    'log_level': 'INFO',
}

# ==================== 其他配置 ====================
MISC_CONFIG = {
    # 是否自动创建 git commit
    'auto_commit': False,
    'commit_message': 'Import articles from Douban notes',
    
    # 是否打开预览
    'open_preview': False,
    
    # 线程数（爬虫优化）
    'max_workers': 3,
}
