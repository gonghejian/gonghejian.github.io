(function () {
    const STORAGE_KEY = 'shengdi-exam-lab-state-v1';
    const IMPORT_KEY = 'shengdi-exam-lab-imports-v1';

    const baseQuestions = [
        {
            id: 'bio-cell-01',
            subject: 'bio',
            chapter: '生物体的结构层次',
            question: '使用显微镜观察洋葱表皮细胞时，若视野太暗，较合适的调节方式是？',
            options: ['换用平面镜并缩小光圈', '换用凹面镜并放大光圈', '转动粗准焦螺旋', '直接换高倍物镜'],
            answer: 1,
            explain: '凹面镜能聚光，放大光圈能增加进光量，适合视野偏暗时调节。'
        },
        {
            id: 'bio-cell-02',
            subject: 'bio',
            chapter: '生物体的结构层次',
            question: '植物细胞和动物细胞共有的结构是？',
            options: ['细胞壁、细胞膜、细胞核', '细胞膜、细胞质、细胞核', '叶绿体、液泡、细胞核', '细胞壁、叶绿体、液泡'],
            answer: 1,
            explain: '动植物细胞都具有细胞膜、细胞质和细胞核。植物细胞通常还有细胞壁、液泡、叶绿体等。'
        },
        {
            id: 'bio-plant-01',
            subject: 'bio',
            chapter: '生物圈中的绿色植物',
            question: '绿色植物进行光合作用的主要场所是？',
            options: ['线粒体', '叶绿体', '细胞核', '液泡'],
            answer: 1,
            explain: '叶绿体中含有叶绿素，是绿色植物进行光合作用的主要场所。'
        },
        {
            id: 'bio-plant-02',
            subject: 'bio',
            chapter: '生物圈中的绿色植物',
            question: '植物蒸腾作用的主要意义之一是？',
            options: ['制造有机物', '分解有机物', '促进水分和无机盐运输', '产生氧气'],
            answer: 2,
            explain: '蒸腾作用产生拉力，有助于根吸收的水分和无机盐向上运输。'
        },
        {
            id: 'bio-human-01',
            subject: 'bio',
            chapter: '人体生命活动',
            question: '人体消化和吸收营养物质的主要场所是？',
            options: ['口腔', '胃', '小肠', '大肠'],
            answer: 2,
            explain: '小肠长度长、内表面积大，并有多种消化液，是消化和吸收的主要场所。'
        },
        {
            id: 'bio-human-02',
            subject: 'bio',
            chapter: '人体生命活动',
            question: '血液循环中，负责把血液从心脏输送到全身各处的血管是？',
            options: ['动脉', '静脉', '毛细血管', '淋巴管'],
            answer: 0,
            explain: '动脉把血液从心脏输送到身体各部分，静脉把血液送回心脏。'
        },
        {
            id: 'bio-ecology-01',
            subject: 'bio',
            chapter: '生物与环境',
            question: '生态系统中，绿色植物通常属于？',
            options: ['生产者', '消费者', '分解者', '非生物部分'],
            answer: 0,
            explain: '绿色植物能通过光合作用制造有机物，是生态系统中的生产者。'
        },
        {
            id: 'bio-ecology-02',
            subject: 'bio',
            chapter: '生物与环境',
            question: '下列食物链书写正确的是？',
            options: ['鹰→蛇→鼠→草', '草→鼠→蛇→鹰', '鼠→草→蛇→鹰', '草→鹰→蛇→鼠'],
            answer: 1,
            explain: '食物链从生产者开始，箭头指向捕食者，表示物质和能量流动方向。'
        },
        {
            id: 'geo-earth-01',
            subject: 'geo',
            chapter: '地球与地图',
            question: '经线指示的方向是？',
            options: ['东西方向', '南北方向', '东北方向', '西南方向'],
            answer: 1,
            explain: '经线连接南北两极，指示南北方向；纬线指示东西方向。'
        },
        {
            id: 'geo-earth-02',
            subject: 'geo',
            chapter: '地球与地图',
            question: '比例尺 1:100000 表示图上 1 厘米代表实地距离？',
            options: ['100 米', '1 千米', '10 千米', '100 千米'],
            answer: 1,
            explain: '100000 厘米等于 1000 米，即 1 千米。'
        },
        {
            id: 'geo-climate-01',
            subject: 'geo',
            chapter: '天气与气候',
            question: '一天中最高气温通常出现在？',
            options: ['日出前后', '正午 12 点', '午后 2 点左右', '日落之后'],
            answer: 2,
            explain: '地面吸收太阳辐射后再加热空气，最高气温通常滞后于正午，出现在午后 2 点左右。'
        },
        {
            id: 'geo-climate-02',
            subject: 'geo',
            chapter: '天气与气候',
            question: '表示一个地区多年平均天气状况的是？',
            options: ['天气', '气候', '气温', '降水'],
            answer: 1,
            explain: '气候是一个地区多年平均的天气状况，具有相对稳定性。'
        },
        {
            id: 'geo-china-01',
            subject: 'geo',
            chapter: '中国地理',
            question: '我国地势总特征是？',
            options: ['东高西低', '西高东低，呈阶梯状分布', '南高北低', '中部高四周低'],
            answer: 1,
            explain: '我国地势西高东低，大致呈三级阶梯状分布。'
        },
        {
            id: 'geo-china-02',
            subject: 'geo',
            chapter: '中国地理',
            question: '我国水资源空间分布特点大致是？',
            options: ['南多北少，东多西少', '北多南少，西多东少', '全国均匀', '西北最多'],
            answer: 0,
            explain: '受季风气候和降水分布影响，我国水资源总体南多北少、东多西少。'
        },
        {
            id: 'geo-world-01',
            subject: 'geo',
            chapter: '世界地理',
            question: '世界上面积最大的洲是？',
            options: ['非洲', '欧洲', '亚洲', '南美洲'],
            answer: 2,
            explain: '亚洲是世界上面积最大、人口最多的大洲。'
        },
        {
            id: 'geo-world-02',
            subject: 'geo',
            chapter: '世界地理',
            question: '世界人口主要分布在？',
            options: ['中低纬度近海平原地区', '高纬度内陆地区', '高山高原地区', '沙漠地区'],
            answer: 0,
            explain: '中低纬度、近海、平原地区气候适宜、交通便利，人口较集中。'
        }
    ];

    const paperYears = [2025, 2024, 2023, 2022, 2021];
    const state = loadState();
    let questions = baseQuestions.concat(loadImports());
    let session = null;
    let timer = null;

    const views = {
        dashboard: document.getElementById('dashboardView'),
        chapters: document.getElementById('chaptersView'),
        papers: document.getElementById('papersView'),
        mock: document.getElementById('mockView'),
        wrongbook: document.getElementById('wrongbookView'),
        records: document.getElementById('recordsView'),
        import: document.getElementById('importView'),
        practice: document.getElementById('practiceView')
    };

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { records: [], wrongIds: [], chapterStats: {} };
        } catch (error) {
            return { records: [], wrongIds: [], chapterStats: {} };
        }
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function loadImports() {
        try {
            return JSON.parse(localStorage.getItem(IMPORT_KEY)) || [];
        } catch (error) {
            return [];
        }
    }

    function saveImports(items) {
        localStorage.setItem(IMPORT_KEY, JSON.stringify(items));
    }

    function showView(name) {
        Object.entries(views).forEach(([key, view]) => view.classList.toggle('active', key === name));
        document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === name));
        if (name === 'dashboard') renderDashboard();
        if (name === 'chapters') renderChapters();
        if (name === 'papers') renderPapers();
        if (name === 'wrongbook') renderWrongBook();
        if (name === 'records') renderRecords();
    }

    function subjectLabel(subject) {
        return subject === 'bio' ? '生物' : '地理';
    }

    function groupByChapter() {
        const map = {};
        questions.forEach((q) => {
            const key = `${q.subject}::${q.chapter}`;
            if (!map[key]) map[key] = { subject: q.subject, chapter: q.chapter, questions: [] };
            map[key].questions.push(q);
        });
        return Object.values(map);
    }

    function renderDashboard() {
        const done = state.records.length;
        const avg = done ? Math.round(state.records.reduce((sum, r) => sum + r.score, 0) / done) : 0;
        const wrong = state.wrongIds.length;
        const imported = questions.filter((q) => q.year).length;
        document.getElementById('statsGrid').innerHTML = [
            ['练习次数', done],
            ['平均分', avg],
            ['错题数', wrong],
            ['已导入真题', imported]
        ].map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`).join('');

        const chapters = groupByChapter().slice(0, 4);
        document.getElementById('todayPlan').innerHTML = chapters.map((item) => (
            `<div class="plan-item"><strong>${subjectLabel(item.subject)} · ${item.chapter}</strong><span>${item.questions.length} 题，可以先刷一轮。</span></div>`
        )).join('');
        renderRecentRecords('recentRecords', 5);
    }

    function renderRecentRecords(targetId, limit) {
        const target = document.getElementById(targetId);
        const list = state.records.slice(-limit).reverse();
        target.innerHTML = list.length ? list.map(recordHtml).join('') : '<div class="empty">还没有考试记录。</div>';
    }

    function renderChapters() {
        document.getElementById('chapterGrid').innerHTML = groupByChapter().map((item) => {
            const key = `${item.subject}::${item.chapter}`;
            const stat = state.chapterStats[key];
            const statText = stat ? `最近 ${stat.score} 分，正确 ${stat.correct}/${stat.total}` : '还未练习';
            return `
                <div class="chapter-card">
                    <span class="subject ${item.subject}">${subjectLabel(item.subject)}</span>
                    <h3>${item.chapter}</h3>
                    <p>${item.questions.length} 题 · ${statText}</p>
                    <button class="primary-btn" data-chapter="${key}">开始篇章测试</button>
                </div>
            `;
        }).join('');
        document.querySelectorAll('[data-chapter]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const [subject, chapter] = btn.dataset.chapter.split('::');
                startPractice({
                    title: `${subjectLabel(subject)} · ${chapter}`,
                    mode: 'chapter',
                    questions: questions.filter((q) => q.subject === subject && q.chapter === chapter),
                    chapterKey: btn.dataset.chapter,
                    duration: null
                });
            });
        });
    }

    function renderPapers() {
        document.getElementById('paperGrid').innerHTML = paperYears.map((year) => {
            const items = questions.filter((q) => Number(q.year) === year);
            const status = items.length ? `${items.length} 题已导入` : '待导入真题';
            return `
                <div class="paper-card">
                    <h3>${year} 深圳生地会考</h3>
                    <p>${status}。可以先使用核心知识点模拟训练，导入真题后这里会变成年份卷。</p>
                    <button class="${items.length ? 'primary-btn' : 'secondary-btn'}" data-year="${year}">${items.length ? '开始年份卷' : '查看导入方式'}</button>
                </div>
            `;
        }).join('');
        document.querySelectorAll('[data-year]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const year = Number(btn.dataset.year);
                const items = questions.filter((q) => Number(q.year) === year);
                if (!items.length) {
                    showView('import');
                    return;
                }
                startPractice({ title: `${year} 深圳生地会考真题`, mode: 'paper', questions: items, duration: 80 * 60 });
            });
        });
    }

    function renderWrongBook() {
        const items = state.wrongIds.map((id) => questions.find((q) => q.id === id)).filter(Boolean);
        document.getElementById('wrongList').innerHTML = items.length
            ? items.map((q) => questionReviewHtml(q)).join('')
            : '<div class="panel empty">还没有错题。做完练习后，答错的题会自动进入这里。</div>';
    }

    function renderRecords() {
        const target = document.getElementById('recordList');
        target.innerHTML = state.records.length ? state.records.slice().reverse().map(recordHtml).join('') : '<div class="panel empty">还没有成绩记录。</div>';
    }

    function recordHtml(record) {
        return `<div class="record-item"><strong>${record.title} · ${record.score} 分</strong><span>${record.correct}/${record.total} 正确 · ${record.date}</span></div>`;
    }

    function startPractice(config) {
        if (!config.questions.length) return;
        session = {
            ...config,
            index: 0,
            answers: {},
            startedAt: Date.now(),
            remaining: config.duration
        };
        showView('practice');
        renderQuestion();
        startTimer();
    }

    function startTimer() {
        clearInterval(timer);
        const timerBox = document.getElementById('timerBox');
        if (!session.remaining) {
            timerBox.textContent = '不限时';
            return;
        }
        const tick = () => {
            const min = Math.floor(session.remaining / 60);
            const sec = session.remaining % 60;
            timerBox.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
            if (session.remaining <= 0) submitPractice();
            session.remaining -= 1;
        };
        tick();
        timer = setInterval(tick, 1000);
    }

    function renderQuestion() {
        const q = session.questions[session.index];
        document.getElementById('practiceTitle').textContent = session.title;
        document.getElementById('practiceMeta').textContent = `第 ${session.index + 1} / ${session.questions.length} 题`;
        document.getElementById('questionBox').innerHTML = `
            <div class="question-card">
                <p class="question-title">${session.index + 1}. ${q.question}</p>
                ${q.options.map((option, index) => `
                    <button class="option ${session.answers[q.id] === index ? 'selected' : ''}" data-answer="${index}">
                        <strong>${String.fromCharCode(65 + index)}.</strong><span>${option}</span>
                    </button>
                `).join('')}
            </div>
        `;
        document.querySelectorAll('[data-answer]').forEach((btn) => {
            btn.addEventListener('click', () => {
                session.answers[q.id] = Number(btn.dataset.answer);
                renderQuestion();
            });
        });
    }

    function submitPractice() {
        if (!session) return;
        clearInterval(timer);
        let correct = 0;
        session.questions.forEach((q) => {
            if (session.answers[q.id] === q.answer) {
                correct += 1;
            } else if (!state.wrongIds.includes(q.id)) {
                state.wrongIds.push(q.id);
            }
        });
        const score = Math.round((correct / session.questions.length) * 100);
        const record = {
            title: session.title,
            mode: session.mode,
            score,
            correct,
            total: session.questions.length,
            date: new Date().toLocaleString('zh-CN', { hour12: false })
        };
        state.records.push(record);
        if (session.chapterKey) {
            state.chapterStats[session.chapterKey] = { score, correct, total: session.questions.length };
        }
        saveState();
        renderResult(score, correct);
    }

    function renderResult(score, correct) {
        document.getElementById('practiceMeta').textContent = `得分 ${score}，正确 ${correct}/${session.questions.length}`;
        document.getElementById('timerBox').textContent = '已交卷';
        document.getElementById('questionBox').innerHTML = session.questions.map((q, index) => questionReviewHtml(q, session.answers[q.id], index)).join('');
    }

    function questionReviewHtml(q, selected, index) {
        return `
            <div class="question-card">
                <p class="question-title">${index !== undefined ? `${index + 1}. ` : ''}${q.question}</p>
                ${q.options.map((option, optionIndex) => {
                    const cls = optionIndex === q.answer ? 'correct' : selected === optionIndex ? 'wrong' : '';
                    return `<div class="option ${cls}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong><span>${option}</span></div>`;
                }).join('')}
                <div class="explain">答案：${String.fromCharCode(65 + q.answer)}。${q.explain || '暂无解析。'}</div>
            </div>
        `;
    }

    function importQuestions() {
        const raw = document.getElementById('importText').value.trim();
        if (!raw) {
            alert('请先粘贴 JSON。');
            return;
        }
        try {
            const data = JSON.parse(raw);
            if (!Array.isArray(data)) throw new Error('JSON 顶层必须是数组');
            data.forEach(validateQuestion);
            const existing = loadImports();
            const merged = existing.concat(data);
            saveImports(merged);
            questions = baseQuestions.concat(merged);
            alert(`已导入 ${data.length} 题。`);
            renderPapers();
            showView('papers');
        } catch (error) {
            alert(`导入失败：${error.message}`);
        }
    }

    function validateQuestion(q) {
        const required = ['id', 'subject', 'chapter', 'question', 'options', 'answer'];
        required.forEach((key) => {
            if (!(key in q)) throw new Error(`缺少字段 ${key}`);
        });
        if (!Array.isArray(q.options) || q.options.length < 2) throw new Error('options 至少需要 2 个选项');
        if (typeof q.answer !== 'number') throw new Error('answer 必须是数字下标');
    }

    function resetAll() {
        if (!confirm('确定清空本地成绩、错题和导入题库吗？')) return;
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(IMPORT_KEY);
        location.reload();
    }

    document.querySelectorAll('.nav-item').forEach((btn) => btn.addEventListener('click', () => showView(btn.dataset.view)));
    document.getElementById('startMockBtn').addEventListener('click', () => {
        startPractice({ title: '80 分钟生地合卷模拟', mode: 'mock', questions: shuffle(questions).slice(0, Math.min(questions.length, 20)), duration: 80 * 60 });
    });
    document.getElementById('prevQuestionBtn').addEventListener('click', () => {
        if (!session) return;
        session.index = Math.max(0, session.index - 1);
        renderQuestion();
    });
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        if (!session) return;
        session.index = Math.min(session.questions.length - 1, session.index + 1);
        renderQuestion();
    });
    document.getElementById('submitPracticeBtn').addEventListener('click', submitPractice);
    document.getElementById('importBtn').addEventListener('click', importQuestions);
    document.getElementById('resetBtn').addEventListener('click', resetAll);

    function shuffle(items) {
        return items.slice().sort(() => Math.random() - 0.5);
    }

    renderDashboard();
    renderChapters();
    renderPapers();
})();
