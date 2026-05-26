# -*- coding: utf-8 -*-
"""
将豆瓣书评转换为 Jekyll Markdown 格式
"""

import json
import logging
import re
import html
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
from dateutil.parser import parse as parse_date

from config import (
    OUTPUT_CONFIG, JEKYLL_CONFIG, FILTER_CONFIG, CONTENT_CONFIG
)

# ==================== 日志配置 ====================
logging.basicConfig(
    level=OUTPUT_CONFIG['log_level'],
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


class DoubanReviewsToJekyll:
    """豆瓣书评到 Jekyll 转换器"""
    
    def __init__(self):
        self.reviews = []
        self.converted_reviews = []
        self.skipped_reviews = []
    
    def load_data(self, filename: str = None):
        """加载爬取的原始数据"""
        if not filename:
            filename = 'douban_reviews.json'
        
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                self.reviews = json.load(f)
            logger.info(f'已加载 {len(self.reviews)} 条书评')
            return True
        except Exception as e:
            logger.error(f'加载数据失败: {e}')
            return False
    
    def convert_all(self) -> List[Dict]:
        """转换所有书评"""
        logger.info('开始转换书评...')
        
        for i, review in enumerate(self.reviews, 1):
            logger.info(f'转换 {i}/{len(self.reviews)}: {review.get("book_title", "未知")}')
            converted = self.convert_review(review)
            
            if converted:
                self.converted_reviews.append(converted)
            else:
                self.skipped_reviews.append(review)
        
        logger.info(f'转换完成: {len(self.converted_reviews)} 条转换成功，{len(self.skipped_reviews)} 条跳过')
        return self.converted_reviews
    
    def convert_review(self, review: Dict) -> Optional[Dict]:
        """转换单条书评"""
        try:
            # 检查过滤条件
            if not self._pass_filters(review):
                logger.info(f'书评已跳过: {review.get("book_title")} (不符合过滤条件)')
                return None
            
            # 解析日期
            date_obj = self._parse_date(review.get('date', ''))
            if not date_obj:
                logger.warning(f'无法解析日期: {review.get("date")}')
                date_obj = datetime.now()
            
            # 生成标题（包含书名）
            book_title = review.get('book_title', 'Unknown')
            review_title = review.get('title', 'Untitled')
            title = f'{book_title} - {review_title}'
            title = self._normalize_title(title)
            
            # 处理内容
            content = self._process_content(review.get('content', ''))
            
            # 添加书籍信息和评分到内容开头
            book_info = self._generate_book_info(review)
            content = book_info + '\n\n' + content
            
            # 提取并处理图片
            if review.get('local_cover'):
                content = self._add_cover_image(content, review.get('local_cover'), book_title)
            
            # 构建 Front Matter
            front_matter = {
                'layout': JEKYLL_CONFIG['layout'],
                'title': title,
                'date': date_obj.strftime('%Y-%m-%d %H:%M:%S +0800'),
                'categories': JEKYLL_CONFIG['review_category'],
                'tags': JEKYLL_CONFIG['review_tags'],
                'author': JEKYLL_CONFIG['author'],
                'book_title': book_title,
                'book_url': review.get('book_url', ''),
                'rating': review.get('rating', ''),
            }
            
            # 添加原始链接
            if CONTENT_CONFIG['keep_source_link'] and review.get('url'):
                front_matter['source_url'] = review.get('url')
            
            return {
                'date': date_obj,
                'title': title,
                'filename': self._generate_filename(date_obj, title),
                'front_matter': front_matter,
                'content': content,
                'original_review': review,
            }
        
        except Exception as e:
            logger.error(f'转换书评失败: {review.get("book_title")}: {e}')
            return None
    
    def _pass_filters(self, review: Dict) -> bool:
        """检查书评是否符合过滤条件"""
        if not review.get('content', '').strip():
            return False
        if not review.get('book_title', '').strip():
            return False
        if not review.get('url', '').strip():
            return False

        # 检查日期范围
        date_obj = self._parse_date(review.get('date', ''))
        if date_obj:
            if FILTER_CONFIG['start_date']:
                start = parse_date(FILTER_CONFIG['start_date']).date()
                if date_obj.date() < start:
                    return False
            
            if FILTER_CONFIG['end_date']:
                end = parse_date(FILTER_CONFIG['end_date']).date()
                if date_obj.date() > end:
                    return False
        
        # 检查最少字数
        content = review.get('content', '')
        if len(content) < FILTER_CONFIG['min_length']:
            return False
        
        # 检查排除关键词
        for keyword in FILTER_CONFIG['exclude_keywords']:
            if keyword.lower() in content.lower() or keyword.lower() in review.get('title', '').lower():
                return False
        
        # 检查包含关键词
        if FILTER_CONFIG['include_keywords']:
            found = False
            for keyword in FILTER_CONFIG['include_keywords']:
                if keyword.lower() in content.lower() or keyword.lower() in review.get('title', '').lower():
                    found = True
                    break
            if not found:
                return False
        
        return True
    
    def _parse_date(self, date_str: str) -> Optional[datetime]:
        """解析日期字符串"""
        if not date_str:
            return None
        
        try:
            return parse_date(date_str)
        except Exception:
            logger.warning(f'无法解析日期: {date_str}')
            return None
    
    def _normalize_title(self, title: str) -> str:
        """规范化标题"""
        title = title.strip()
        title = re.sub(r'[<>:"/\\|?*]', '', title)
        
        if len(title) > 150:
            title = title[:150]
        
        return title or 'Untitled'
    
    def _process_content(self, content: str) -> str:
        """处理书评内容"""
        if not content:
            return ''
        
        # 删除过多的空白行
        lines = content.split('\n')
        processed_lines = []
        empty_count = 0
        
        for line in lines:
            if line.strip():
                processed_lines.append(line)
                empty_count = 0
            else:
                empty_count += 1
                if empty_count <= 2:
                    processed_lines.append(line)
        
        content = '\n'.join(processed_lines)
        
        # 处理 HTML
        content = self._convert_html_to_markdown(content)
        
        return content.strip()
    
    def _generate_book_info(self, review: Dict) -> str:
        """生成书籍信息块"""
        book_title = review.get('book_title', '')
        rating = review.get('rating', '')
        book_url = review.get('book_url', '')
        
        lines = [
            '> ## 书籍信息',
            f'> - **书名**: {book_title}',
        ]
        
        if rating:
            lines.append(f'> - **评分**: {rating}')
        
        if book_url:
            lines.append(f'> - **链接**: [{book_title}]({book_url})')
        
        return '\n'.join(lines)
    
    def _add_cover_image(self, content: str, image_path: str, book_title: str) -> str:
        """在内容开头添加书籍封面图片"""
        img_markdown = f'![{book_title}]({image_path})\n'
        return img_markdown + '\n' + content
    
    def _convert_html_to_markdown(self, content: str) -> str:
        """将 HTML 转换为 Markdown"""
        replacements = [
            (r'<br\s*/?>', '\n'),
            (r'<p>(.*?)</p>', r'\1\n'),
            (r'<strong>(.*?)</strong>', r'**\1**'),
            (r'<b>(.*?)</b>', r'**\1**'),
            (r'<em>(.*?)</em>', r'*\1*'),
            (r'<i>(.*?)</i>', r'*\1*'),
            (r'<a href="(.*?)">(.*?)</a>', r'[\2](\1)'),
            (r'<img[^>]+src="([^"]+)"[^>]*>', r'![](\1)'),
        ]
        
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        content = re.sub(r'<[^>]+>', '', content)
        
        return html.unescape(content)
    
    def _generate_filename(self, date_obj: datetime, title: str) -> str:
        """生成符合 Jekyll 规范的文件名"""
        date_str = date_obj.strftime('%Y-%m-%d')
        
        slug = title.lower()
        slug = re.sub(r'[^\w\u4e00-\u9fff\-]', '', slug)
        slug = re.sub(r'\-+', '-', slug)
        
        return f'{date_str}-{slug}.md'
    
    def save_converted_data(self, filename: str = None):
        """保存转换后的数据"""
        if not filename:
            filename = 'douban_reviews_converted.json'
        
        data = []
        for review in self.converted_reviews:
            review_copy = review.copy()
            review_copy['date'] = review_copy['date'].isoformat()
            data.append(review_copy)
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            logger.info(f'转换后的数据已保存到 {filename}')
        except Exception as e:
            logger.error(f'保存转换后的数据失败: {e}')
    
    def generate_markdown_files(self):
        """生成 Markdown 文件"""
        output_dir = Path(JEKYLL_CONFIG['output_dir'])
        output_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info(f'生成 Markdown 文件到 {output_dir}...')
        
        for review in self.converted_reviews:
            filename = output_dir / review['filename']
            
            # 处理重复文件名
            counter = 1
            base_stem = filename.stem
            while filename.exists():
                filename = filename.parent / f'{base_stem}-{counter}.md'
                counter += 1
            
            try:
                # 生成 Front Matter
                fm_lines = ['---']
                for key, value in review['front_matter'].items():
                    fm_lines.append(f'{key}: {json.dumps(value, ensure_ascii=False)}')
                fm_lines.append('---')
                
                # 写入文件
                content = '\n'.join(fm_lines) + '\n\n' + review['content']
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                logger.info(f'生成文件: {filename}')
            
            except Exception as e:
                logger.error(f'生成文件失败 {filename}: {e}')
    
    def generate_report(self, filename: str = None):
        """生成转换报告"""
        if not filename:
            filename = 'DOUBAN_REVIEWS_REPORT.md'
        
        report_lines = [
            '# 豆瓣书评导入报告',
            f'\n生成时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
            f'\n## 导入统计',
            f'- 总书评数: {len(self.reviews)}',
            f'- 转换成功: {len(self.converted_reviews)}',
            f'- 转换跳过: {len(self.skipped_reviews)}',
            f'- 转换成功率: {len(self.converted_reviews) / len(self.reviews) * 100:.1f}%' if self.reviews else '',
            f'\n## 生成的文件列表',
        ]
        
        for review in sorted(self.converted_reviews, key=lambda x: x['date']):
            report_lines.append(f'\n### {review["date"].strftime("%Y-%m-%d")} - {review["front_matter"]["book_title"]}')
            report_lines.append(f'- 评论: {review["title"]}')
            report_lines.append(f'- 文件: `{review["filename"]}`')
            report_lines.append(f'- 评分: {review["front_matter"]["rating"]}')
            if review["front_matter"].get('source_url'):
                report_lines.append(f'- 原始链接: {review["front_matter"]["source_url"]}')
        
        if self.skipped_reviews:
            report_lines.append(f'\n## 跳过的书评')
            for review in self.skipped_reviews:
                report_lines.append(f'- {review.get("date", "未知日期")} - {review.get("book_title", "未知书名")}')
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('\n'.join(report_lines))
            logger.info(f'报告已生成: {filename}')
        except Exception as e:
            logger.error(f'生成报告失败: {e}')


def main():
    """主函数"""
    logger.info('=' * 50)
    logger.info('豆瓣书评转换 - 开始执行')
    logger.info('=' * 50)
    
    converter = DoubanReviewsToJekyll()
    
    # 加载原始数据
    if not converter.load_data():
        logger.error('加载数据失败')
        return
    
    # 转换所有书评
    converter.convert_all()
    
    # 保存转换后的数据
    converter.save_converted_data()
    
    # 生成 Markdown 文件
    converter.generate_markdown_files()
    
    # 生成报告
    converter.generate_report()
    
    logger.info('=' * 50)
    logger.info('转换完成！')
    logger.info('=' * 50)


if __name__ == '__main__':
    main()
