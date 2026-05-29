const DEFAULT_BASE_URL = 'https://aicli.qzz.io/v1';
const DEFAULT_MODEL = 'gpt-5.5';

function normalizeBaseUrl(value) {
  return (value || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }
  return req.body;
}

function extractText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(extractText).filter(Boolean).join('\n');
  if (typeof value === 'object') {
    if (typeof value.output_text === 'string') return value.output_text;
    if (typeof value.text === 'string') return value.text;
    if (value.message) return extractText(value.message);
    if (value.content) return extractText(value.content);
    if (value.output) return extractText(value.output);
    if (value.choices) return extractText(value.choices);
  }
  return '';
}

function sourceBlock(sources) {
  if (!Array.isArray(sources) || !sources.length) return '无直接命中文章。';
  return sources.slice(0, 5).map((item, index) => [
    `${index + 1}. ${item.title || '未命名文章'}`,
    `链接：${item.url || ''}`,
    `摘要：${item.excerpt || item.content || ''}`
  ].join('\n')).join('\n\n');
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ error: '只支持 POST 请求。' });
    return;
  }

  const body = parseBody(req);
  if (!body) {
    res.status(400).json({ error: '请求体不是有效 JSON。' });
    return;
  }

  const question = String(body.question || '').trim();
  if (!question) {
    res.status(400).json({ error: '缺少问题。' });
    return;
  }

  const apiKey = process.env.AICLI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(501).json({
      error: '还没有配置 AICLI_API_KEY 或 OPENAI_API_KEY，已无法调用真实模型。'
    });
    return;
  }

  const baseUrl = normalizeBaseUrl(process.env.AICLI_BASE_URL || process.env.OPENAI_BASE_URL);
  const model = process.env.AICLI_CHAT_MODEL || process.env.OPENAI_CHAT_MODEL || DEFAULT_MODEL;
  const sources = Array.isArray(body.sources) ? body.sources : [];
  const mode = String(body.mode || 'system');

  const instructions = [
    '你是“弓箭对话室”的真实模型回答引擎，不是简单模板。',
    '你代表 gonghejian.cn 的公开内容与写作风格：冷静、克制、实用，有反思但不鸡血，有方法但不像卖课。',
    '核心叙事可以使用，但不要硬套。只有当问题真的与个人系统、AI 工作流、知识输出、身体纪律、一人公司有关时，才回到这些概念。',
    '如果用户问生活、身体、喝酒、情绪、健康类问题，先给具体、谨慎、低风险的当下处理建议，再提醒危险信号；不要牵强谈 AI 时代。',
    '医疗相关内容只能提供一般信息，不能诊断。出现严重症状、意识不清、持续呕吐、呼吸异常、胸痛、外伤、疑似酒精中毒等，要建议立刻就医或联系急救。',
    '回答 4-6 段，每段短一点。最后给一个今天能执行的小动作。',
    '如果引用站内材料，只引用真正相关的；不相关就明确说这次不强行引用文章。'
  ].join('\n');

  const input = [
    `用户问题：${question}`,
    `回答模式：${mode}`,
    '',
    '站内检索材料：',
    sourceBlock(sources)
  ].join('\n');

  try {
    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: 900
      })
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      data = { message: text };
    }

    if (!response.ok) {
      const message = data.error?.message || data.message || text || `模型返回 ${response.status}`;
      res.status(response.status).json({
        error: message,
        hint: response.status === 403 ? '当前令牌可能没有可用模型权限。' : undefined
      });
      return;
    }

    const answer = extractText(data).trim();
    if (!answer) {
      res.status(502).json({ error: '模型已响应，但没有返回可读文本。' });
      return;
    }

    res.status(200).json({ answer, model });
  } catch (error) {
    res.status(500).json({ error: error.message || '模型调用失败。' });
  }
};
