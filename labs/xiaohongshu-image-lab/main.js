(function () {
    const canvas = document.getElementById('coverCanvas');
    const ctx = canvas.getContext('2d');

    const controls = {
        topic: document.getElementById('topicInput'),
        contentType: document.getElementById('contentType'),
        stylePreset: document.getElementById('stylePreset'),
        title: document.getElementById('titleInput'),
        subtitle: document.getElementById('subtitleInput'),
        quote: document.getElementById('quoteInput'),
        author: document.getElementById('authorInput'),
        tag: document.getElementById('tagInput'),
        prompt: document.getElementById('promptOutput'),
        note: document.getElementById('noteOutput'),
        titleOptions: document.getElementById('titleOptions'),
        status: document.getElementById('statusLine')
    };

    const typeMap = {
        history: { label: '历史知识', mark: 'HISTORY', topic: '历史时间线、朝代脉络、关键人物、地图感元素' },
        fitness: { label: '健身知识', mark: 'FITNESS', topic: '训练动作、身体部位、计划表、运动装备' },
        reading: { label: '读书笔记', mark: 'READING', topic: '书桌、书页、便签、读书笔记' },
        ai: { label: 'AI 工具', mark: 'AI TOOL', topic: '电脑屏幕、产品界面、智能助手、工作台' },
        reflection: { label: '日常复盘', mark: 'REVIEW', topic: '日历、清单、晨间桌面、复盘纸张' },
        method: { label: '效率方法', mark: 'METHOD', topic: '流程图、卡片、笔记系统、任务清单' },
        life: { label: '生活方式', mark: 'LIFE', topic: '咖啡、运动、轻旅行、生活记录' }
    };

    const palettes = {
        editorial: ['#fff4f6', '#111827', '#ff2d55', '#ffffff', '#2563eb'],
        notebook: ['#fff7ed', '#231f20', '#ff6b00', '#ffffff', '#0f9f6e'],
        minimal: ['#f8fafc', '#111827', '#0f766e', '#ffffff', '#ff2d55'],
        tech: ['#111827', '#f8fafc', '#38bdf8', '#172554', '#f59e0b'],
        warm: ['#fff2df', '#2b2118', '#d9480f', '#ffffff', '#7c3aed']
    };

    const hookMap = {
        pain: { label: '痛点', badge: '别再零散学', spark: '避坑' },
        counter: { label: '反常识', badge: '很多人都想反了', spark: '反差' },
        list: { label: '清单', badge: '收藏这 4 点', spark: '清单' },
        result: { label: '结果', badge: '一图看懂', spark: '省时' }
    };

    const templatePresets = {
        history: {
            topic: '帮我介绍历史，做成一张适合小红书的时间线知识图',
            contentType: 'history',
            stylePreset: 'editorial',
            title: '一张图看懂中国历史脉络',
            subtitle: '先抓时代顺序，再看人物和制度变化',
            quote: '历史不是背年份，而是看清一条条因果链。',
            tag: '历史入门',
            hookType: 'result'
        },
        fitness: {
            topic: '帮我介绍健身方式，生成适合新手收藏的训练图示',
            contentType: 'fitness',
            stylePreset: 'notebook',
            title: '新手健身先选对训练方式',
            subtitle: '力量、有氧、柔韧和恢复，目标不同练法不同',
            quote: '先稳定训练频率，再追求强度和复杂动作。',
            tag: '健身新手',
            hookType: 'list'
        },
        reading: {
            topic: '把一本书整理成小红书读书笔记知识图',
            contentType: 'reading',
            stylePreset: 'warm',
            title: '把读过的书变成行动清单',
            subtitle: '读书不是收藏观点，而是改变下一个动作',
            quote: '每本书只留下一个可执行动作，长期看会比摘抄一百句更有力量。',
            tag: '读书复盘',
            hookType: 'pain'
        },
        ai: {
            topic: '介绍一个 AI 工具，生成使用场景和工作流图示',
            contentType: 'ai',
            stylePreset: 'tech',
            title: '这个 AI 工具帮我省下 3 小时',
            subtitle: '把重复劳动拆成输入、判断和输出',
            quote: 'AI 真正有用的时候，往往是它接住了一个稳定流程。',
            tag: 'AI工具',
            hookType: 'result'
        }
    };

    const knowledgeBase = {
        history: {
            diagram: 'timeline',
            sections: [
                { title: '先看顺序', body: '朝代更替、统一与分裂，是理解历史的骨架。' },
                { title: '再看人物', body: '人物不是孤立故事，要放回制度和时代压力里。' },
                { title: '抓住制度', body: '土地、税收、官僚和军队，决定很多历史走向。' },
                { title: '最后看影响', body: '把事件放到长期变化里，才不只是背知识点。' }
            ],
            labels: ['先秦', '秦汉', '隋唐', '宋元', '明清', '近现代'],
            noteLead: '历史入门最怕一上来就背细节。先搭一条主线，再往里面放人物和事件，会轻松很多。'
        },
        fitness: {
            diagram: 'matrix',
            sections: [
                { title: '力量训练', body: '提升肌肉和基础代谢，适合塑形、增肌和改善体态。' },
                { title: '有氧训练', body: '提升心肺能力，适合减脂、耐力和日常活力。' },
                { title: '柔韧训练', body: '改善活动度，适合久坐、紧绷和运动前后放松。' },
                { title: '恢复管理', body: '睡眠、饮食和休息，比多练一天更影响长期效果。' }
            ],
            labels: ['力量', '有氧', '柔韧', '恢复'],
            noteLead: '健身不是动作越多越好，新手先分清训练类型，再按目标组合，会少走很多弯路。'
        },
        reading: {
            diagram: 'steps',
            sections: [
                { title: '一句话问题', body: '这本书想解决什么问题？先把问题写出来。' },
                { title: '三个关键点', body: '只保留最能改变理解的观点，不追求摘抄完整。' },
                { title: '一个行动', body: '读完后今天能做什么，决定书有没有进入生活。' },
                { title: '一次复盘', body: '两周后回看，这本书还留下了什么。' }
            ],
            labels: ['问题', '观点', '行动', '复盘'],
            noteLead: '读书笔记不一定要长，关键是从信息转成行动。'
        },
        ai: {
            diagram: 'flow',
            sections: [
                { title: '输入', body: '明确角色、背景、目标和输出格式。' },
                { title: '处理', body: '让 AI 拆步骤、列选项、找风险，而不是只要答案。' },
                { title: '校对', body: '事实、语气和边界必须人工复核。' },
                { title: '复用', body: '把好用提示词沉淀成模板。' }
            ],
            labels: ['输入', '处理', '校对', '复用'],
            noteLead: 'AI 工具的核心不是炫技，而是把一个重复流程变得更稳定。'
        },
        default: {
            diagram: 'cards',
            sections: [
                { title: '是什么', body: '先用一句话解释概念，降低理解门槛。' },
                { title: '为什么重要', body: '说清它解决了什么问题，和读者有什么关系。' },
                { title: '怎么做', body: '拆成可执行步骤，避免只讲道理。' },
                { title: '注意什么', body: '给出边界、误区和下一步。' }
            ],
            labels: ['概念', '价值', '步骤', '误区'],
            noteLead: '一个好知识图示，要让读者快速知道这件事是什么、为什么重要、下一步怎么做。'
        }
    };

    function getRadioValue(name) {
        return document.querySelector(`input[name="${name}"]:checked`).value;
    }

    function setRadioValue(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
    }

    function inferType(text) {
        const source = text.toLowerCase();
        if (/历史|朝代|中国史|世界史|人物|战争|秦汉|唐宋|明清/.test(source)) return 'history';
        if (/健身|训练|减脂|增肌|肌肉|有氧|力量|瑜伽|跑步/.test(source)) return 'fitness';
        if (/读书|书评|阅读|书单|笔记/.test(source)) return 'reading';
        if (/ai|人工智能|提示词|工具|自动化|deepseek|chatgpt/.test(source)) return 'ai';
        if (/效率|方法|项目|管理|计划|时间/.test(source)) return 'method';
        return controls.contentType.value || 'method';
    }

    function resizeCanvas() {
        const dimensions = {
            '3:4': [900, 1200],
            '1:1': [1080, 1080],
            '4:5': [1080, 1350]
        }[getRadioValue('ratio')];
        canvas.width = dimensions[0];
        canvas.height = dimensions[1];
    }

    function wrapText(text, maxChars) {
        const lines = [];
        let current = '';
        Array.from((text || '').replace(/\s+/g, ' ').trim()).forEach((char) => {
            if ((current + char).length > maxChars) {
                lines.push(current);
                current = char;
            } else {
                current += char;
            }
        });
        if (current) lines.push(current);
        return lines;
    }

    function drawRoundRect(x, y, width, height, radius, fill) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
    }

    function drawBackground(colors, style) {
        const w = canvas.width;
        const h = canvas.height;
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, style === 'tech' ? '#172554' : colors[3]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        ctx.globalAlpha = 0.1;
        ctx.fillStyle = colors[2];
        ctx.fillRect(w * 0.74, 0, w * 0.26, h);
        ctx.fillStyle = colors[4];
        ctx.fillRect(0, h * 0.78, w, h * 0.22);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = style === 'tech' ? 'rgba(255,255,255,0.06)' : 'rgba(17,24,39,0.045)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 48) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 48) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    function currentKnowledge() {
        const type = controls.contentType.value;
        return knowledgeBase[type] || knowledgeBase.default;
    }

    function drawCover() {
        resizeCanvas();
        const style = controls.stylePreset.value;
        const colors = palettes[style];
        const type = typeMap[controls.contentType.value] || typeMap.method;
        const knowledge = currentKnowledge();
        const hook = hookMap[getRadioValue('hookType')];
        const w = canvas.width;
        const h = canvas.height;
        const pad = Math.round(w * 0.07);

        drawBackground(colors, style);
        drawRoundRect(pad, pad, w - pad * 2, h - pad * 2, 30, style === 'tech' ? 'rgba(15,23,42,0.9)' : '#ffffff');

        drawRoundRect(pad + 30, pad + 26, Math.round(w * 0.32), Math.round(w * 0.066), 999, colors[2]);
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${Math.round(w * 0.028)}px sans-serif`;
        ctx.fillText(hook.badge, pad + 54, pad + Math.round(w * 0.071));

        ctx.fillStyle = style === 'tech' ? '#bfdbfe' : '#667085';
        ctx.font = `800 ${Math.round(w * 0.026)}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(`${type.mark} · KNOWLEDGE CARD`, w - pad - 36, pad + 58);
        ctx.textAlign = 'left';

        let y = pad + Math.round(h * 0.18);
        ctx.fillStyle = style === 'tech' ? '#e0f2fe' : colors[1];
        wrapText(controls.title.value, w < 1000 ? 10 : 12).slice(0, 3).forEach((line) => {
            ctx.font = `900 ${Math.round(w * (line.length <= 6 ? 0.088 : 0.074))}px sans-serif`;
            ctx.fillText(line, pad + 36, y);
            ctx.globalAlpha = 0.16;
            ctx.fillStyle = colors[2];
            ctx.fillRect(pad + 36, y + Math.round(w * 0.012), Math.min(w * 0.66, line.length * w * 0.07), Math.round(w * 0.022));
            ctx.globalAlpha = 1;
            ctx.fillStyle = style === 'tech' ? '#e0f2fe' : colors[1];
            y += Math.round(w * 0.095);
        });

        ctx.fillStyle = style === 'tech' ? '#bae6fd' : '#4b5563';
        ctx.font = `500 ${Math.round(w * 0.035)}px sans-serif`;
        wrapText(controls.subtitle.value, 18).slice(0, 2).forEach((line) => {
            ctx.fillText(line, pad + 40, y + 8);
            y += Math.round(w * 0.046);
        });

        const diagramY = Math.max(y + 42, h * 0.41);
        drawKnowledgeDiagram(knowledge, colors, style, pad + 36, diagramY, w - pad * 2 - 72, h * 0.38);

        const quoteY = h - pad - Math.round(h * 0.16);
        drawRoundRect(pad + 36, quoteY, w - pad * 2 - 72, Math.round(h * 0.09), 20, style === 'tech' ? 'rgba(56,189,248,0.12)' : '#f8fafc');
        ctx.fillStyle = colors[2];
        ctx.font = `900 ${Math.round(w * 0.028)}px sans-serif`;
        ctx.fillText(`# ${controls.tag.value}`, pad + 62, quoteY + 42);
        ctx.fillStyle = style === 'tech' ? '#f8fafc' : colors[1];
        ctx.font = `600 ${Math.round(w * 0.028)}px sans-serif`;
        wrapText(controls.quote.value, 25).slice(0, 2).forEach((line, index) => {
            ctx.fillText(line, pad + 62, quoteY + 78 + index * Math.round(w * 0.04));
        });

        ctx.fillStyle = style === 'tech' ? '#cbd5e1' : '#4b5563';
        ctx.font = `700 ${Math.round(w * 0.026)}px sans-serif`;
        ctx.fillText(`${controls.author.value || '弓箭'} · ${type.label}`, pad + 36, h - pad - 38);

        updatePrompt();
        updatePublishCopy(false);
    }

    function drawKnowledgeDiagram(knowledge, colors, style, x, y, width, height) {
        if (knowledge.diagram === 'timeline') {
            drawTimeline(knowledge, colors, style, x, y, width, height);
            return;
        }
        if (knowledge.diagram === 'matrix') {
            drawMatrix(knowledge, colors, style, x, y, width, height);
            return;
        }
        drawCards(knowledge, colors, style, x, y, width, height);
    }

    function drawTimeline(knowledge, colors, style, x, y, width, height) {
        drawRoundRect(x, y, width, height, 24, style === 'tech' ? 'rgba(255,255,255,0.08)' : '#f8fafc');
        const lineY = y + height * 0.26;
        ctx.strokeStyle = colors[2];
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(x + 34, lineY);
        ctx.lineTo(x + width - 34, lineY);
        ctx.stroke();

        knowledge.labels.forEach((label, index) => {
            const px = x + 34 + ((width - 68) / (knowledge.labels.length - 1)) * index;
            ctx.fillStyle = index % 2 === 0 ? colors[2] : colors[4];
            ctx.beginPath();
            ctx.arc(px, lineY, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = style === 'tech' ? '#e0f2fe' : '#17202a';
            ctx.font = `900 ${Math.round(canvas.width * 0.024)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(label, px, lineY + 48);
        });
        ctx.textAlign = 'left';

        const cardGap = 12;
        const cardW = (width - cardGap) / 2;
        const cardH = (height * 0.54 - cardGap) / 2;
        const startY = y + height * 0.42;
        knowledge.sections.forEach((item, index) => {
            const cx = x + (index % 2) * (cardW + cardGap);
            const cy = startY + Math.floor(index / 2) * (cardH + cardGap);
            drawInfoCard(item, index, colors, style, cx, cy, cardW, cardH);
        });
    }

    function drawMatrix(knowledge, colors, style, x, y, width, height) {
        const gap = 14;
        const cardW = (width - gap) / 2;
        const cardH = (height - gap) / 2;
        knowledge.sections.forEach((item, index) => {
            const cx = x + (index % 2) * (cardW + gap);
            const cy = y + Math.floor(index / 2) * (cardH + gap);
            drawInfoCard(item, index, colors, style, cx, cy, cardW, cardH);
        });
    }

    function drawCards(knowledge, colors, style, x, y, width, height) {
        const gap = 12;
        const cardH = (height - gap * 3) / 4;
        knowledge.sections.forEach((item, index) => {
            const cy = y + index * (cardH + gap);
            drawInfoCard(item, index, colors, style, x, cy, width, cardH);
        });
    }

    function drawInfoCard(item, index, colors, style, x, y, width, height) {
        const fill = style === 'tech' ? 'rgba(248,250,252,0.1)' : '#ffffff';
        drawRoundRect(x, y, width, height, 18, fill);

        ctx.globalAlpha = style === 'tech' ? 0.14 : 0.08;
        ctx.fillStyle = index % 2 === 0 ? colors[2] : colors[4];
        ctx.fillRect(x, y, width, height);
        ctx.globalAlpha = 1;

        const badgeSize = Math.min(46, height * 0.32);
        drawRoundRect(x + 18, y + 18, badgeSize, badgeSize, 12, index % 2 === 0 ? colors[2] : colors[4]);
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${Math.round(canvas.width * 0.024)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`0${index + 1}`, x + 18 + badgeSize / 2, y + 18 + badgeSize * 0.64);
        ctx.textAlign = 'left';

        const textX = x + 18 + badgeSize + 16;
        ctx.fillStyle = style === 'tech' ? '#e0f2fe' : '#111827';
        ctx.font = `900 ${Math.round(canvas.width * 0.028)}px sans-serif`;
        ctx.fillText(item.title, textX, y + 43);

        ctx.fillStyle = style === 'tech' ? '#dbeafe' : '#475467';
        ctx.font = `600 ${Math.round(canvas.width * 0.022)}px sans-serif`;
        wrapText(item.body, width > canvas.width * 0.6 ? 24 : 13).slice(0, 2).forEach((line, lineIndex) => {
            ctx.fillText(line, textX, y + 76 + lineIndex * Math.round(canvas.width * 0.032));
        });
    }

    function generateFromTopic() {
        const type = inferType(controls.topic.value);
        const preset = templatePresets[type];
        controls.contentType.value = type;
        if (preset) {
            controls.stylePreset.value = preset.stylePreset;
            controls.title.value = preset.title;
            controls.subtitle.value = preset.subtitle;
            controls.quote.value = preset.quote;
            controls.tag.value = preset.tag;
            setRadioValue('hookType', preset.hookType);
        } else {
            const clean = controls.topic.value.replace(/^帮我|请|生成|做成/g, '').slice(0, 18) || '这个主题';
            controls.title.value = `一张图看懂${clean}`;
            controls.subtitle.value = '先抓核心概念，再看步骤、误区和行动';
            controls.quote.value = '好内容不是堆知识点，而是帮读者形成清晰结构。';
            controls.tag.value = clean.replace(/[，。,. ]/g, '') || '知识图示';
        }
        syncTemplateActive(type);
        drawCover();
        setStatus('已根据主题生成知识图示。');
    }

    function updatePrompt() {
        const type = typeMap[controls.contentType.value] || typeMap.method;
        const styleName = controls.stylePreset.options[controls.stylePreset.selectedIndex].text;
        controls.prompt.value = [
            `请生成一张适合小红书发布的中文知识图示，比例 ${getRadioValue('ratio')}。`,
            `用户需求：${controls.topic.value}`,
            `主题：${controls.title.value}`,
            `内容场景：${type.topic}。`,
            `画面结构：标题区 + ${currentKnowledge().diagram === 'timeline' ? '时间线图示' : currentKnowledge().diagram === 'matrix' ? '四象限知识卡片' : '步骤卡片'} + 总结金句。`,
            `视觉风格：${styleName}，信息清晰，有收藏感，适合小红书知识类笔记。`,
            `要求：中文文字清晰，不要水印，不要真实品牌 Logo，画面不要杂乱。`
        ].join('\n');
    }

    function buildTitleIdeas() {
        const tag = controls.tag.value || typeMap[controls.contentType.value].label;
        const base = controls.title.value || `一张图看懂${tag}`;
        return [
            { type: '收藏版', title: `${base}，新手先收藏` },
            { type: '避坑版', title: `别再碎片化学${tag}了` },
            { type: '入门版', title: `${tag}入门：先看这张图` },
            { type: '清单版', title: `${tag}最重要的 4 个知识点` }
        ];
    }

    function updatePublishCopy(forceStatus) {
        const ideas = buildTitleIdeas();
        controls.titleOptions.innerHTML = ideas.map((item, index) => (
            `<button type="button" class="title-option" data-title-index="${index}"><strong>${item.type}</strong><span>${item.title}</span></button>`
        )).join('');

        const knowledge = currentKnowledge();
        controls.note.value = [
            ideas[0].title,
            '',
            knowledge.noteLead,
            '',
            '这张图我拆成 4 个部分：',
            ...knowledge.sections.map((item, index) => `${index + 1}. ${item.title}：${item.body}`),
            '',
            `最后记住一句：${controls.quote.value}`,
            '',
            `#${controls.tag.value} #知识图示 #小红书学习 #个人成长 #学习方法`
        ].join('\n');

        controls.titleOptions.querySelectorAll('.title-option').forEach((button) => {
            button.addEventListener('click', () => {
                const idea = ideas[Number(button.dataset.titleIndex)];
                controls.title.value = idea.title;
                drawCover();
                setStatus('已套用标题。');
            });
        });

        if (forceStatus) setStatus('发布文案已生成。');
    }

    function applyTemplate(key) {
        const preset = templatePresets[key];
        if (!preset) return;
        controls.topic.value = preset.topic;
        controls.contentType.value = preset.contentType;
        controls.stylePreset.value = preset.stylePreset;
        controls.title.value = preset.title;
        controls.subtitle.value = preset.subtitle;
        controls.quote.value = preset.quote;
        controls.tag.value = preset.tag;
        setRadioValue('hookType', preset.hookType);
        syncTemplateActive(key);
        drawCover();
    }

    function syncTemplateActive(key) {
        document.querySelectorAll('.template-card').forEach((card) => {
            card.classList.toggle('active', card.dataset.template === key);
        });
    }

    function randomize() {
        const keys = Object.keys(templatePresets);
        applyTemplate(keys[Math.floor(Math.random() * keys.length)]);
        setStatus('已换一个主题。');
    }

    function downloadImage() {
        const link = document.createElement('a');
        const safeTitle = (controls.title.value || 'xiaohongshu-infographic').replace(/[\\/:*?"<>|]/g, '').slice(0, 24);
        link.download = `${safeTitle || 'xiaohongshu-infographic'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setStatus('PNG 已生成并开始下载。');
    }

    function copyTextFrom(element, successMessage) {
        element.focus();
        element.select();
        try {
            const copied = document.execCommand('copy');
            setStatus(copied ? successMessage : '复制失败，可以手动选中文案。');
        } catch (error) {
            setStatus('复制失败，可以手动选中文案。');
        }
    }

    function copyPrompt() {
        updatePrompt();
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(controls.prompt.value).then(
                () => setStatus('AI 生图提示词已复制。'),
                () => copyTextFrom(controls.prompt, 'AI 生图提示词已复制。')
            );
            return;
        }
        copyTextFrom(controls.prompt, 'AI 生图提示词已复制。');
    }

    function setStatus(text) {
        controls.status.textContent = text;
        window.clearTimeout(setStatus.timer);
        setStatus.timer = window.setTimeout(() => {
            controls.status.textContent = '已实时生成预览。';
        }, 2400);
    }

    Object.values(controls).forEach((control) => {
        if (control && control.tagName && !['promptOutput', 'noteOutput', 'titleOptions', 'statusLine'].includes(control.id)) {
            control.addEventListener('input', drawCover);
            control.addEventListener('change', drawCover);
        }
    });

    document.querySelectorAll('input[name="ratio"], input[name="hookType"]').forEach((radio) => {
        radio.addEventListener('change', drawCover);
    });
    document.querySelectorAll('.template-card').forEach((card) => {
        card.addEventListener('click', () => applyTemplate(card.dataset.template));
    });

    document.getElementById('generateTopicBtn').addEventListener('click', generateFromTopic);
    document.getElementById('randomizeBtn').addEventListener('click', randomize);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('copyPromptBtn').addEventListener('click', copyPrompt);
    document.getElementById('generateCopyBtn').addEventListener('click', () => updatePublishCopy(true));
    document.getElementById('copyNoteBtn').addEventListener('click', () => copyTextFrom(controls.note, '发布文案已复制。'));
    document.getElementById('refreshPromptBtn').addEventListener('click', () => {
        updatePrompt();
        setStatus('提示词已刷新。');
    });

    drawCover();
})();
