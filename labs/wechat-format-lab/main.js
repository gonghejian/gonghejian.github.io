const input = document.getElementById('markdownInput');
const preview = document.getElementById('wechatPreview');
const htmlOutput = document.getElementById('htmlOutput');
const counter = document.getElementById('counter');
const statusLine = document.getElementById('statusLine');
const themeButtons = Array.from(document.querySelectorAll('[data-theme]'));

let currentTheme = 'system';

const sample = `# 从组织能力，到个人系统

过去很多能力，是在组织里被训练出来的。

流程、协作、汇报、项目推进、资源协调，这些东西让人变得专业。但问题是，一旦离开组织，很多能力没有出口。

## 我正在关注的三个方向

1. **AI 工作流**：用 AI 重构写作、研究和项目管理。
2. **知识与表达系统**：让阅读、笔记和经验变成可交付的内容。
3. **身体与纪律系统**：用训练、饮食和睡眠维护长期输出。

> 一个人真正需要训练的，不只是效率，而是在组织之外独立完成闭环的能力。

## 一个判断

个人系统不是把工具堆起来。

它更像一套反复运行的流程：

- 输入材料
- 做出判断
- 形成输出
- 收到反馈
- 再次修正

---

如果这个闭环能运转，一个人就不只是内容生产者，而是在训练自己的选择权。`;

const themeStyles = {
    system: {
        wrapper: 'padding: 28px 24px; color: #172033; font-size: 16px; line-height: 1.85; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;',
        h1: 'margin: 0 0 22px; padding: 0 0 14px; border-bottom: 2px solid #172033; color: #172033; font-size: 24px; line-height: 1.35; font-weight: 800;',
        h2: 'margin: 34px 0 14px; padding-left: 12px; border-left: 4px solid #2563eb; color: #172033; font-size: 20px; line-height: 1.45; font-weight: 800;',
        h3: 'margin: 26px 0 12px; color: #1f2937; font-size: 18px; line-height: 1.5; font-weight: 800;',
        p: 'margin: 0 0 16px; color: #344054; font-size: 16px; line-height: 1.9;',
        blockquote: 'margin: 22px 0; padding: 16px 18px; border-left: 4px solid #0f9f6e; background: #f0fdf4; color: #1f513f; font-size: 16px; line-height: 1.85;',
        ul: 'margin: 0 0 18px; padding-left: 22px; color: #344054; font-size: 16px; line-height: 1.9;',
        ol: 'margin: 0 0 18px; padding-left: 22px; color: #344054; font-size: 16px; line-height: 1.9;',
        li: 'margin: 0 0 8px;',
        code: 'padding: 2px 5px; border-radius: 4px; background: #eef2ff; color: #3730a3; font-family: Menlo, Consolas, monospace; font-size: 0.9em;',
        pre: 'margin: 20px 0; padding: 16px; border-radius: 8px; background: #111827; color: #e5e7eb; overflow-x: auto; font-size: 13px; line-height: 1.7;',
        hr: 'margin: 30px auto; border: 0; border-top: 1px solid #d0d5dd; width: 88%;',
        a: 'color: #2563eb; text-decoration: none; border-bottom: 1px solid rgba(37, 99, 235, 0.35);',
        strong: 'color: #111827; font-weight: 800;'
    },
    letter: {
        wrapper: 'padding: 30px 24px; color: #2f2a24; font-size: 16px; line-height: 1.95; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;',
        h1: 'margin: 0 0 24px; color: #2f2a24; font-size: 25px; line-height: 1.35; font-weight: 800; text-align: center;',
        h2: 'margin: 34px 0 14px; color: #6f4e37; font-size: 20px; line-height: 1.45; font-weight: 800;',
        h3: 'margin: 26px 0 12px; color: #6f4e37; font-size: 18px; line-height: 1.5; font-weight: 800;',
        p: 'margin: 0 0 17px; color: #4b443c; font-size: 16px; line-height: 1.95;',
        blockquote: 'margin: 22px 0; padding: 16px 18px; border: 1px solid #eadfcf; background: #fffaf2; color: #6f4e37; font-size: 16px; line-height: 1.9;',
        ul: 'margin: 0 0 18px; padding-left: 22px; color: #4b443c; font-size: 16px; line-height: 1.95;',
        ol: 'margin: 0 0 18px; padding-left: 22px; color: #4b443c; font-size: 16px; line-height: 1.95;',
        li: 'margin: 0 0 8px;',
        code: 'padding: 2px 5px; border-radius: 4px; background: #f7eadb; color: #7c2d12; font-family: Menlo, Consolas, monospace; font-size: 0.9em;',
        pre: 'margin: 20px 0; padding: 16px; border-radius: 8px; background: #2f2a24; color: #fff7ed; overflow-x: auto; font-size: 13px; line-height: 1.7;',
        hr: 'margin: 30px auto; border: 0; border-top: 1px solid #eadfcf; width: 70%;',
        a: 'color: #8a4b16; text-decoration: none; border-bottom: 1px solid rgba(138, 75, 22, 0.35);',
        strong: 'color: #2f2a24; font-weight: 800;'
    },
    dark: {
        wrapper: 'padding: 28px 24px; background: #111827; color: #e5e7eb; font-size: 16px; line-height: 1.85; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;',
        h1: 'margin: 0 0 22px; color: #ffffff; font-size: 24px; line-height: 1.35; font-weight: 800;',
        h2: 'margin: 34px 0 14px; padding-left: 12px; border-left: 4px solid #60a5fa; color: #dbeafe; font-size: 20px; line-height: 1.45; font-weight: 800;',
        h3: 'margin: 26px 0 12px; color: #bfdbfe; font-size: 18px; line-height: 1.5; font-weight: 800;',
        p: 'margin: 0 0 16px; color: #d1d5db; font-size: 16px; line-height: 1.9;',
        blockquote: 'margin: 22px 0; padding: 16px 18px; border-left: 4px solid #34d399; background: rgba(52, 211, 153, 0.1); color: #d1fae5; font-size: 16px; line-height: 1.85;',
        ul: 'margin: 0 0 18px; padding-left: 22px; color: #d1d5db; font-size: 16px; line-height: 1.9;',
        ol: 'margin: 0 0 18px; padding-left: 22px; color: #d1d5db; font-size: 16px; line-height: 1.9;',
        li: 'margin: 0 0 8px;',
        code: 'padding: 2px 5px; border-radius: 4px; background: rgba(96, 165, 250, 0.16); color: #bfdbfe; font-family: Menlo, Consolas, monospace; font-size: 0.9em;',
        pre: 'margin: 20px 0; padding: 16px; border-radius: 8px; background: #020617; color: #e5e7eb; overflow-x: auto; font-size: 13px; line-height: 1.7;',
        hr: 'margin: 30px auto; border: 0; border-top: 1px solid rgba(148, 163, 184, 0.38); width: 88%;',
        a: 'color: #93c5fd; text-decoration: none; border-bottom: 1px solid rgba(147, 197, 253, 0.45);',
        strong: 'color: #ffffff; font-weight: 800;'
    }
};

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function inlineFormat(text, styles) {
    let html = escapeHtml(text);
    html = html.replace(/`([^`]+)`/g, `<code style="${styles.code}">$1</code>`);
    html = html.replace(/\*\*([^*]+)\*\*/g, `<strong style="${styles.strong}">$1</strong>`);
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" style="${styles.a}">$1</a>`);
    return html;
}

function inlineLines(lines, styles) {
    return lines.map(line => inlineFormat(line, styles)).join('<br>');
}

function renderMarkdown(markdown, themeName) {
    const styles = themeStyles[themeName] || themeStyles.system;
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            i += 1;
            continue;
        }

        if (trimmed.startsWith('```')) {
            const codeLines = [];
            i += 1;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i += 1;
            }
            i += 1;
            blocks.push(`<pre style="${styles.pre}"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
            continue;
        }

        if (/^---+$/.test(trimmed)) {
            blocks.push(`<hr style="${styles.hr}">`);
            i += 1;
            continue;
        }

        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
            const level = heading[1].length;
            const tag = `h${level}`;
            blocks.push(`<${tag} style="${styles[tag]}">${inlineFormat(heading[2], styles)}</${tag}>`);
            i += 1;
            continue;
        }

        if (trimmed.startsWith('>')) {
            const quoteLines = [];
            while (i < lines.length && lines[i].trim().startsWith('>')) {
                quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
                i += 1;
            }
            blocks.push(`<blockquote style="${styles.blockquote}">${inlineLines(quoteLines, styles)}</blockquote>`);
            continue;
        }

        if (/^[-*]\s+/.test(trimmed)) {
            const items = [];
            while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
                i += 1;
            }
            blocks.push(`<ul style="${styles.ul}">${items.map(item => `<li style="${styles.li}">${inlineFormat(item, styles)}</li>`).join('')}</ul>`);
            continue;
        }

        if (/^\d+\.\s+/.test(trimmed)) {
            const items = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
                i += 1;
            }
            blocks.push(`<ol style="${styles.ol}">${items.map(item => `<li style="${styles.li}">${inlineFormat(item, styles)}</li>`).join('')}</ol>`);
            continue;
        }

        const paragraphLines = [];
        while (
            i < lines.length &&
            lines[i].trim() &&
            !/^(#{1,3})\s+/.test(lines[i].trim()) &&
            !/^[-*]\s+/.test(lines[i].trim()) &&
            !/^\d+\.\s+/.test(lines[i].trim()) &&
            !lines[i].trim().startsWith('>') &&
            !lines[i].trim().startsWith('```') &&
            !/^---+$/.test(lines[i].trim())
        ) {
            paragraphLines.push(lines[i].trim());
            i += 1;
        }
        blocks.push(`<p style="${styles.p}">${inlineLines(paragraphLines, styles)}</p>`);
    }

    return `<section style="${styles.wrapper}">${blocks.join('\n')}</section>`;
}

function update() {
    const markdown = input.value;
    const html = renderMarkdown(markdown, currentTheme);
    preview.innerHTML = html;
    htmlOutput.value = html;
    counter.textContent = `${markdown.replace(/\s/g, '').length} 字`;
    statusLine.textContent = '已生成公众号排版';
}

async function copyHtml() {
    await navigator.clipboard.writeText(htmlOutput.value);
    statusLine.textContent = 'HTML 已复制';
}

function copyRichText() {
    const range = document.createRange();
    range.selectNodeContents(preview);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    const ok = document.execCommand('copy');
    selection.removeAllRanges();
    statusLine.textContent = ok ? '富文本已复制，可以粘贴到公众号编辑器' : '复制失败，请手动选中预览区复制';
}

input.addEventListener('input', update);

themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentTheme = button.dataset.theme;
        themeButtons.forEach(item => item.classList.toggle('active', item === button));
        update();
    });
});

document.getElementById('copyHtmlBtn').addEventListener('click', copyHtml);
document.getElementById('copyRichBtn').addEventListener('click', copyRichText);
document.getElementById('sampleBtn').addEventListener('click', () => {
    input.value = sample;
    update();
});
document.getElementById('clearBtn').addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
});

update();
