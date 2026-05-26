# -*- coding: utf-8 -*-
"""
简化版豆瓣书评爬虫 - 不使用 Selenium
直接使用 requests 库，依赖 cookies 文件
"""

import json
import time
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

from config import DOUBAN_CONFIG, OUTPUT_CONFIG, CONTENT_CONFIG

# ==================== 日志配置 ====================
logging.basicConfig(
    level=OUTPUT_CONFIG['log_level'],
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(OUTPUT_CONFIG['log_file'], encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class SimpleDoubanReviewsScraper:
    """简化版豆瓣书评爬虫 - 直接使用 requests"""
    
    def __init__(self):
        self.user_id = DOUBAN_CONFIG['user_id']
        self.base_url = f'https://www.douban.com/people/{self.user_id}/reviews'
        self.reviews = []
        self.seen_review_urls = set()
        self.session = requests.Session()
        self._load_cookies()
        self._setup_session()
        
        # 创建图片下载目录
        if CONTENT_CONFIG['image_handling'] == 'download':
            self.image_dir = Path(CONTENT_CONFIG['image_dir'])
            self.image_dir.mkdir(parents=True, exist_ok=True)
    
    def _setup_session(self):
        """设置请求会话"""
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        })
    
    def _load_cookies(self):
        """加载保存的 cookies"""
        cookies_file = DOUBAN_CONFIG['cookies_file']
        if Path(cookies_file).exists():
            try:
                logger.info(f'从 {cookies_file} 加载 cookies...')
                with open(cookies_file, 'r', encoding='utf-8') as f:
                    cookies_list = json.load(f)
                
                # 将 cookies 列表转换为字典
                for cookie in cookies_list:
                    self.session.cookies.set(cookie.get('name'), cookie.get('value'))
                
                logger.info('Cookies 加载成功')
            except Exception as e:
                logger.error(f'加载 cookies 失败: {e}')
    
    def scrape(self) -> List[Dict]:
        """爬取所有书评"""
        logger.info('=' * 50)
        logger.info('豆瓣书评爬虫（简化版）- 开始执行')
        logger.info('=' * 50)
        logger.info('开始爬取书评...')
        
        try:
            self._scrape_reviews_list()
            logger.info(f'成功爬取 {len(self.reviews)} 条书评')
            return self.reviews
        
        except Exception as e:
            logger.error(f'爬取过程中发生错误: {e}', exc_info=True)
            return self.reviews
    
    def _scrape_reviews_list(self):
        """爬取书评列表"""
        start = 0
        page = 0
        
        while True:
            page += 1
            url = f'{self.base_url}?start={start}'
            
            logger.info(f'爬取第 {page} 页: {url}')
            
            try:
                response = self.session.get(url, timeout=10)
                response.encoding = 'utf-8'
                
                if response.status_code != 200:
                    logger.error(f'请求失败，状态码：{response.status_code}')
                    break
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # 多种方法查找书评项
                review_items = self._find_review_items(soup)
                
                logger.info(f'找到 {len(review_items)} 条书评')
                
                if not review_items:
                    logger.info('没有找到更多书评，爬取完成')
                    break
                
                # 提取每条书评
                for item in review_items:
                    review = self._extract_review_item(item)
                    if review:
                        self.reviews.append(review)
                        logger.debug(f'提取书评: {review.get("book_title", "未知")} - {review.get("title", "未知")}')
                
                # 检查下一页
                if not self._has_next_page(soup):
                    logger.info('已到最后一页，爬取完成')
                    break
                
                time.sleep(2)  # 延迟
                start += 15  # 豆瓣每页的数量
            
            except Exception as e:
                logger.error(f'爬取第 {page} 页时出错: {e}')
                break
    
    def _find_review_items(self, soup) -> list:
        """使用多种方法查找书评项"""
        review_items = list(soup.select('div.review-item'))
        if review_items:
            return review_items

        # 只接受真实书评链接，避免把导航、头像、主页链接误判成书评。
        for link in soup.find_all('a', href=True):
            if not self._is_review_url(link['href']):
                continue

            item = link.find_parent('div', class_='review-item') or link.find_parent(['li', 'div'])
            if item and item not in review_items:
                review_items.append(item)

        return review_items
    
    def _extract_review_item(self, item) -> Optional[Dict]:
        """从页面元素中提取书评信息"""
        try:
            # 查找图片（书籍封面）
            img = item.find('img')
            if not img:
                return None
            
            book_title = img.get('alt', '未知书籍')
            cover_url = img.get('src', '')
            
            # 查找所有链接
            links = item.find_all('a')
            if len(links) < 2:
                return None
            
            # 书籍链接
            book_link = next((link for link in links if 'book.douban.com/subject/' in link.get('href', '')), None)
            book_url = urljoin('https://www.douban.com', book_link.get('href', '')) if book_link else ''
            
            # 查找评论链接
            review_url = ''
            review_title = '无标题'
            for link in links:
                href = link.get('href', '')
                if self._is_review_url(href):
                    review_url = urljoin('https://www.douban.com', href)
                    review_title = link.get_text(strip=True) or review_title
                    break

            if not review_url or review_url in self.seen_review_urls:
                return None
            self.seen_review_urls.add(review_url)
            
            # 查找评分
            rating_elem = item.find('span', class_='rating') or item.find('span', class_=re.compile(r'allstar\d+'))
            rating = ''
            if rating_elem:
                rating = rating_elem.get('title', '') or rating_elem.get_text(strip=True)
            
            # 查找日期
            date_elem = item.find('span', class_='date') or item.find('span', class_='main-meta')
            date_str = date_elem.get_text(strip=True) if date_elem else ''
            
            # 如果没有找到，尝试从其他地方提取日期
            if not date_str:
                for span in item.find_all('span'):
                    text = span.get_text(strip=True)
                    if re.match(r'\d{4}-\d{2}-\d{2}', text):
                        date_str = text
                        break
            
            # 查找评论摘要
            abstract = ''
            for p in item.find_all('p'):
                text = p.get_text(strip=True)
                if text and len(text) > 10:
                    abstract = text
                    break
            
            review = {
                'book_title': book_title,
                'book_url': book_url,
                'cover_url': cover_url,
                'title': review_title,
                'url': review_url,
                'rating': rating,
                'date': date_str,
                'abstract': abstract,
                'content': '',
                'local_cover': '',
                'scraped_at': datetime.now().isoformat(),
            }
            return self.scrape_review_content(review)
        
        except Exception as e:
            logger.error(f'提取书评项失败: {e}')
            return None

    def _is_review_url(self, href: str) -> bool:
        """Return True for real Douban book review detail URLs."""
        return bool(re.search(r'https?://book\.douban\.com/review/\d+/?', href) or re.search(r'^/review/\d+/?', href))

    def scrape_review_content(self, review: Dict) -> Dict:
        """爬取单条书评的完整内容"""
        if not review['url']:
            return review

        logger.info(f'爬取书评内容: {review["book_title"]} - {review["title"]}')

        try:
            response = self.session.get(review['url'], timeout=10)
            response.encoding = 'utf-8'
            if response.status_code != 200:
                logger.warning(f'书评详情请求失败: {review["url"]} ({response.status_code})')
                return review

            soup = BeautifulSoup(response.content, 'html.parser')
            content_elem = (
                soup.find('div', class_='review-content')
                or soup.find('div', id='link-report')
                or soup.find('div', class_='article')
            )
            if content_elem:
                review['content'] = content_elem.get_text('\n', strip=True)

            date_elem = soup.find('span', class_='main-meta') or soup.find('span', property='v:dtreviewed')
            if date_elem:
                review['date'] = date_elem.get_text(strip=True)

            rating_elem = soup.find('span', class_=re.compile(r'allstar\d+'))
            if rating_elem and not review.get('rating'):
                review['rating'] = rating_elem.get('title', '') or rating_elem.get_text(strip=True)

            if review['cover_url'] and CONTENT_CONFIG['image_handling'] == 'download':
                review['local_cover'] = self._download_image(review['cover_url'], review['book_title'])

            time.sleep(1)

        except Exception as e:
            logger.error(f'爬取书评内容失败 {review["url"]}: {e}')

        return review
    
    def _has_next_page(self, soup) -> bool:
        """检查是否有下一页"""
        # 查找后页链接
        next_btn = soup.find('a', class_='next')
        if next_btn:
            return True
        
        # 备选方法：查找包含 "后页" 的链接
        for link in soup.find_all('a'):
            if '后页' in link.get_text():
                return True
        
        return False
    
    def _download_image(self, image_url: str, book_title: str) -> str:
        """下载图片到本地"""
        if not image_url:
            return ''
        
        try:
            logger.info(f'下载图片: {book_title}')
            
            # 生成本地文件名
            safe_title = re.sub(r'[<>:"/\\|?*\s]+', '-', book_title).strip('-')[:40] or 'cover'
            filename = f'{len(self.reviews):03d}-{safe_title}.jpg'
            filepath = self.image_dir / filename
            
            # 下载图片
            response = self.session.get(image_url, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                return f'{CONTENT_CONFIG["image_dir"]}{filename}'
            else:
                logger.warning(f'下载图片失败: {image_url} (状态码: {response.status_code})')
                return ''
        
        except Exception as e:
            logger.error(f'下载图片失败 {image_url}: {e}')
            return ''
    
    def save_data(self, reviews: List[Dict], filename: str = None):
        """保存爬取的数据到 JSON 文件"""
        if not filename:
            filename = 'douban_reviews.json'
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(reviews, f, indent=2, ensure_ascii=False)
            logger.info(f'数据已保存到 {filename}')
        except Exception as e:
            logger.error(f'保存数据失败: {e}')


def main():
    """主函数"""
    scraper = SimpleDoubanReviewsScraper()
    
    # 爬取书评
    reviews = scraper.scrape()
    
    if reviews:
        # 保存原始数据
        scraper.save_data(reviews)
        
        logger.info('=' * 50)
        logger.info(f'爬取完成！共获取 {len(reviews)} 条书评')
        logger.info('=' * 50)
    else:
        logger.error('未获取到任何书评')
        raise SystemExit(1)


if __name__ == '__main__':
    main()
