const DEFAULT_BASE_URL = 'https://aicli.qzz.io/v1';
const DEFAULT_MODEL = 'gpt-image-1';

function normalizeBaseUrl(value) {
  return (value || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

function sizeForRatio(ratio) {
  if (ratio === '1:1') return '1024x1024';
  if (ratio === '4:5') return '1024x1536';
  return '1024x1536';
}

function asDataUrl(value) {
  if (!value || typeof value !== 'string') return null;
  if (value.startsWith('data:image/')) return value;
  if (/^https?:\/\//i.test(value)) return null;
  return `data:image/png;base64,${value}`;
}

function findImage(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    if (value.startsWith('data:image/') || /^https?:\/\//i.test(value) || value.length > 800) {
      return value;
    }
    return null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findImage(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof value === 'object') {
    const direct =
      value.b64_json ||
      value.base64 ||
      value.image_base64 ||
      value.image ||
      value.url ||
      value.image_url ||
      value.result;
    const foundDirect = findImage(direct);
    if (foundDirect) return foundDirect;

    for (const key of ['data', 'images', 'output', 'content', 'message', 'choices']) {
      const found = findImage(value[key]);
      if (found) return found;
    }
  }
  return null;
}

async function imageUrlToDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  const contentType = response.headers.get('content-type') || 'image/png';
  const buffer = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${buffer.toString('base64')}`;
}

async function callResponsesApi({ baseUrl, apiKey, model, prompt, ratio }) {
  const response = await fetch(`${baseUrl}/responses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: prompt,
      tools: [{ type: 'image_generation', size: sizeForRatio(ratio) }]
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
    const message = data.error?.message || data.message || text || `AICLI 返回 ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function callImagesApi({ baseUrl, apiKey, model, prompt, ratio }) {
  const response = await fetch(`${baseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: sizeForRatio(ratio),
      response_format: 'b64_json'
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
    const message = data.error?.message || data.message || text || `AICLI 返回 ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ error: '只支持 POST 请求。' });
    return;
  }

  const apiKey = process.env.AICLI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: '还没有配置 AICLI_API_KEY。请在 Vercel 项目环境变量里添加令牌，然后重新部署。'
    });
    return;
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch (error) {
      res.status(400).json({ error: '请求体不是有效 JSON。' });
      return;
    }
  }
  const prompt = String(body.prompt || '').trim();
  if (!prompt) {
    res.status(400).json({ error: '缺少生图提示词。' });
    return;
  }

  const baseUrl = normalizeBaseUrl(process.env.AICLI_BASE_URL);
  const model = process.env.AICLI_IMAGE_MODEL || DEFAULT_MODEL;
  const ratio = body.ratio || '3:4';
  const apiMode = process.env.AICLI_IMAGE_API || 'responses';

  try {
    const data = apiMode === 'images'
      ? await callImagesApi({ baseUrl, apiKey, model, prompt, ratio })
      : await callResponsesApi({ baseUrl, apiKey, model, prompt, ratio });

    const rawImage = findImage(data);
    const imageUrl = /^https?:\/\//i.test(rawImage || '') ? rawImage : null;
    const imageDataUrl = asDataUrl(rawImage) || (imageUrl ? await imageUrlToDataUrl(imageUrl) : null);

    if (!imageDataUrl) {
      res.status(502).json({
        error: 'AICLI 已响应，但没有在返回结果里找到图片数据。',
        rawType: data?.object || data?.type || 'unknown'
      });
      return;
    }

    res.status(200).json({
      imageDataUrl,
      model,
      apiMode
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || '生图失败。',
      hint: status === 403 ? '当前令牌可能没有 vip 分组权限，或 AICLI 后台没有给这个令牌开通生图能力。' : undefined
    });
  }
};
