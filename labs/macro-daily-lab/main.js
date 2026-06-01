async function loadReports() {
  const res = await fetch('./data.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`data.json ${res.status}`);
  return res.json();
}

const fallbackData = {
  generated_at: '等待自动生成',
  latest: {
    date: '2026-06-01',
    title: '宏观政策解读与全球资产配置策略日报',
    summary: '自动日报实验版：聚焦全球政策周期、流动性、权益、债券、黄金、汇率与风险事件。',
    path: './reports/2026-06-01.html',
    stance: '中性观察',
    risk_level: '中',
    highlights: [
      '跟踪美联储、欧洲央行、中国政策与日本央行的边际变化。',
      '用战略配置和战术交易两个层次拆解资产方向。',
      '自动化运行后会写入当日新报告。'
    ]
  },
  reports: [
    {
      date: '2026-06-01',
      title: '宏观政策解读与全球资产配置策略日报',
      path: './reports/2026-06-01.html',
      stance: '中性观察',
      risk_level: '中'
    }
  ]
};

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '-';
}

function render(data) {
  const latest = data.latest || {};
  setText('generatedAt', data.generated_at ? `生成时间：${data.generated_at}` : '等待自动生成');
  setText('latestDate', latest.date);
  setText('latestStance', latest.stance);
  setText('latestRisk', latest.risk_level ? `风险：${latest.risk_level}` : '-');
  setText('latestTitle', latest.title);
  setText('latestSummary', latest.summary);

  const latestLink = document.getElementById('latestLink');
  if (latestLink && latest.path) latestLink.href = latest.path;

  const highlights = document.getElementById('latestHighlights');
  if (highlights) {
    highlights.innerHTML = '';
    (latest.highlights || []).forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      highlights.appendChild(li);
    });
  }

  const archive = document.getElementById('archiveList');
  if (archive) {
    archive.innerHTML = '';
    (data.reports || []).forEach((report) => {
      const a = document.createElement('a');
      a.className = 'archive-item';
      a.href = report.path;
      a.innerHTML = `
        <span>${report.date || '-'}</span>
        <strong>${report.title || '宏观日报'}</strong>
        <em>${report.stance || '-'} · 风险 ${report.risk_level || '-'}</em>
      `;
      archive.appendChild(a);
    });
  }
}

loadReports()
  .then(render)
  .catch((error) => {
    console.error(error);
    render(fallbackData);
    setText('generatedAt', '使用本地默认数据');
  });
