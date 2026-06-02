const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const stemElements = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
const branchElements = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
const elementColors = { 木: '#1f7a69', 火: '#b5362d', 土: '#a36b2c', 金: '#8b7a42', 水: '#233a5e' };

const chapterTitles = [
    '八字概要',
    '人生相对论',
    '格局推演',
    '五行喜忌',
    '细断人生',
    '爱情密码',
    '大运解析（现在）',
    '大运展望（未来）',
    '人生周期图',
    `${new Date().getFullYear()}运势`,
    '未完待续——'
];

document.addEventListener('DOMContentLoaded', () => {
    drawCoverPreview();
    setupPlaceSearch();
    document.getElementById('bazi-form').addEventListener('submit', (event) => {
        event.preventDefault();
        generateReport();
    });
    document.getElementById('download-current')?.addEventListener('click', downloadCoverImage);
    generateReport();
});

function getFormData() {
    const placeInput = document.getElementById('birth-place');
    return {
        name: document.getElementById('person-name').value.trim() || '未命名',
        sex: document.getElementById('person-sex').value,
        calendar: document.getElementById('calendar-type').value,
        date: document.getElementById('birth-date').value,
        time: document.getElementById('birth-time').value,
        place: placeInput.value.trim() || '未设定',
        latitude: Number(placeInput.dataset.lat || 32.060255),
        longitude: Number(placeInput.dataset.lng || 118.796877),
        focus: document.getElementById('focus-question').value.trim() || '个人节奏与长期选择'
    };
}

function setupPlaceSearch() {
    const input = document.getElementById('birth-place');
    const results = document.getElementById('place-search-results');
    const hint = document.getElementById('selected-place-info');
    if (!input || !results || typeof CITY_DATABASE === 'undefined') return;

    const cityIndex = Object.entries(CITY_DATABASE)
        .map(([name, coord]) => ({ name, lat: coord.lat, lng: coord.lng }))
        .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));

    selectPlace({ name: '南京市', lat: 32.060255, lng: 118.796877 }, false);

    function selectPlace(item, shouldGenerate = true) {
        input.value = item.name;
        input.dataset.lat = item.lat;
        input.dataset.lng = item.lng;
        hint.textContent = `已定位：${item.name}（${item.lat.toFixed(2)}, ${item.lng.toFixed(2)}）`;
        results.classList.remove('active');
        if (shouldGenerate) generateReport();
    }

    function render(matches) {
        results.innerHTML = '';
        if (!matches.length) {
            results.classList.remove('active');
            return;
        }
        matches.forEach((item) => {
            const option = document.createElement('div');
            option.className = 'place-option';
            option.textContent = `${item.name}（${item.lat.toFixed(2)}, ${item.lng.toFixed(2)}）`;
            option.addEventListener('mousedown', (event) => {
                event.preventDefault();
                selectPlace(item);
            });
            results.appendChild(option);
        });
        results.classList.add('active');
    }

    input.addEventListener('input', () => {
        delete input.dataset.lat;
        delete input.dataset.lng;
        const query = input.value.trim();
        if (!query) {
            hint.textContent = '输入城市或区县名称后选择定位结果。';
            results.classList.remove('active');
            return;
        }
        const matches = cityIndex
            .filter((item) => item.name.includes(query))
            .slice(0, 12);
        hint.textContent = matches.length ? '请选择下方定位结果。' : '未找到匹配地点，可继续作为文本使用。';
        render(matches);
    });

    input.addEventListener('blur', () => {
        window.setTimeout(() => results.classList.remove('active'), 140);
    });
}

function calculateProfile(data) {
    const birth = new Date(`${data.date}T${data.time || '00:00'}:00`);
    const year = birth.getFullYear();
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    const hour = birth.getHours();
    const daySeed = Math.floor((birth - new Date('1900-01-01T00:00:00')) / 86400000);

    const yearStem = mod(year - 4, 10);
    const yearBranch = mod(year - 4, 12);
    const monthStem = mod(yearStem * 2 + month, 10);
    const monthBranch = mod(month + 1, 12);
    const dayStem = mod(daySeed + 10, 10);
    const dayBranch = mod(daySeed + 12, 12);
    const hourBranch = mod(Math.floor((hour + 1) / 2), 12);
    const hourStem = mod(dayStem * 2 + hourBranch, 10);

    const pillars = [
        { label: '年柱', stem: stems[yearStem], branch: branches[yearBranch], element: stemElements[yearStem] },
        { label: '月柱', stem: stems[monthStem], branch: branches[monthBranch], element: stemElements[monthStem] },
        { label: '日柱', stem: stems[dayStem], branch: branches[dayBranch], element: stemElements[dayStem] },
        { label: '时柱', stem: stems[hourStem], branch: branches[hourBranch], element: stemElements[hourStem] }
    ];

    const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    pillars.forEach((pillar) => {
        counts[pillar.element] += 1;
        counts[branchElements[branches.indexOf(pillar.branch)]] += 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];
    const lacking = sorted[sorted.length - 1][0];
    const dayMaster = stems[dayStem];
    const dayElement = stemElements[dayStem];
    const rhythm = getRhythm(dominant, lacking);

    return {
        birth,
        pillars,
        counts,
        dominant,
        lacking,
        dayMaster,
        dayElement,
        rhythm,
        currentDecade: Math.floor((new Date().getFullYear() - year) / 10) * 10,
        age: Math.max(0, new Date().getFullYear() - year)
    };
}

function getRhythm(dominant, lacking) {
    const map = {
        木: '适合持续生长、先扎根再扩张，忌同时打开太多战线。',
        火: '适合公开表达、快速试错和建立影响力，忌情绪先于判断。',
        土: '适合搭建稳定系统、承接复杂事务，忌在惯性里失去弹性。',
        金: '适合标准化、裁剪和做决断，忌把控制感误当安全感。',
        水: '适合研究、迁移、连接资源和长期蓄势，忌长期只观察不交付。'
    };
    return `${map[dominant]}补足${lacking}，意味着要刻意训练自己不擅长的那一类能力。`;
}

function generateChapters(data, profile) {
    const pillarText = profile.pillars.map((item) => `${item.label}${item.stem}${item.branch}`).join('，');
    const elementText = Object.entries(profile.counts).map(([key, value]) => `${key}${value}`).join('、');
    const focus = data.focus;

    return [
        {
            title: chapterTitles[0],
            lines: [
                `${data.name}，${data.sex}，${data.calendar} ${data.date} ${data.time}，出生地：${data.place}。`,
                `实验排盘得到四柱：${pillarText}。日主为${profile.dayMaster}${profile.dayElement}，整体五行分布为：${elementText}。`,
                `这份报告不追求神秘结论，而是把出生信息转译成一套观察个人节奏的框架。它适合用来反思长期选择、工作方式和关系模式。`
            ]
        },
        {
            title: chapterTitles[1],
            lines: [
                `一个人的命局可以理解为内在资源和外部环境之间的相对论。${profile.dayElement}日主遇到${profile.dominant}偏旺，说明你更容易在${profile.dominant}所代表的场景里感到熟悉。`,
                `当前关注是「${focus}」。从报告角度看，真正重要的不是一次决定的吉凶，而是你能否让判断、交付和恢复形成闭环。`,
                `当优势过度使用，它会变成盲点；当短板被纳入系统，它会变成边界感。`
            ]
        },
        {
            title: chapterTitles[2],
            lines: [
                `格局推演先看主气。你的结构里${profile.dominant}较强，${profile.lacking}较弱，适合把优势做成稳定工作流，而不是只靠状态爆发。`,
                `如果把人生看成项目，年柱像早期环境，月柱像社会接口，日柱像自我核心，时柱像未来延展。四柱之间的张力，就是你反复遇到的同一类选择题。`,
                `这一格局的关键动作是：降低内耗，减少无效解释，把注意力放在可积累的作品、关系和资产上。`
            ]
        },
        {
            title: chapterTitles[3],
            lines: [
                `五行喜忌不是简单地说喜欢什么、忌讳什么，而是提醒系统如何保持平衡。${profile.dominant}偏旺时，容易形成路径依赖；${profile.lacking}偏弱时，容易在关键场景里能量不足。`,
                `${profile.rhythm}`,
                `建议把${profile.lacking}对应的能力做成日常训练：给它固定时间、固定标准和可见产出。短板不必一次补满，但要进入节奏。`
            ]
        },
        {
            title: chapterTitles[4],
            lines: [
                `细断人生要看阶段，而不是只看标签。少年期更多受年柱影响，青年期由月柱打开社会接口，中年以后日柱的选择权越来越重要。`,
                `你现在约${profile.age}岁，处在把经验重组为方法的阶段。此时最怕重复证明自己，最需要沉淀可复用的系统。`,
                `适合保留三类资产：能反复交付的技能、能长期信任的关系、能持续产生复利的表达出口。`
            ]
        },
        {
            title: chapterTitles[5],
            lines: [
                `爱情密码关注的是亲密关系里的节奏。${profile.dayElement}日主在关系里需要被理解的不是情绪表面，而是背后的秩序感和安全感。`,
                `当${profile.dominant}能量过强时，容易把自己的运行方式当成默认标准；当${profile.lacking}不足时，容易回避某些必要沟通。`,
                `长期关系的关键不是寻找完全契合的人，而是共同建立一种可修复的沟通机制。`
            ]
        },
        {
            title: chapterTitles[6],
            lines: [
                `当前大运可理解为${profile.currentDecade}岁到${profile.currentDecade + 9}岁这一阶段的主旋律。这个阶段的关键词是重新定义身份、输出和责任。`,
                `如果你正在做个人系统、一人公司或长期内容，重点不是突然放大，而是先把核心流程跑顺：输入、判断、生产、反馈、迭代。`,
                `现在适合做减法，把消耗判断力的事情外包、自动化或明确拒绝。`
            ]
        },
        {
            title: chapterTitles[7],
            lines: [
                `未来十年的主线会从单点能力转向结构能力。你需要的不只是会做事，而是能设计一套让自己持续做成事的环境。`,
                `当${profile.lacking}被补上，你的选择权会明显提高；当${profile.dominant}被过度放大，你会重新遭遇同一种瓶颈。`,
                `建议提前布局三个出口：知识产品、可信社群、可复用工具。它们会成为组织之外的支点。`
            ]
        },
        {
            title: chapterTitles[8],
            lines: [
                `人生周期图可以分成四段：0-20 岁建立底层感受，20-35 岁寻找社会位置，35-50 岁重建个人系统，50 岁以后把系统转化为影响力。`,
                `你当前更接近第三段：不是从零开始，而是把过去分散的经验重新编排。`,
                `周期真正的价值，是提醒你不要用上一个阶段的策略，解决下一个阶段的问题。`
            ]
        },
        {
            title: chapterTitles[9],
            lines: [
                `${new Date().getFullYear()} 年的关键词是「定型」。不要急着让每件事都有规模，先让核心能力可以稳定复现。`,
                `适合推进：系统化写作、AI 工作流、身体训练、访谈和小产品 MVP。谨慎处理：过度承诺、短期热点、没有沉淀的合作。`,
                `年度建议：每季度只押一个主项目，每周保留一次复盘，每天保留一段不被打断的深工作时间。`
            ]
        },
        {
            title: chapterTitles[10],
            lines: [
                `这份报告先到这里。它不是终点，而是一套可以继续扩写的目录。`,
                `下一步可以补充：更精确的节气换月、真太阳时、藏干、十神、大运流年和可编辑报告模板。`,
                `真正有价值的不是一句结论，而是让你更清楚自己如何判断、如何交付、如何在组织之外建立选择权。`
            ]
        }
    ];
}

function buildReportPages(data, profile) {
    const pillarText = profile.pillars.map((item) => `${item.label}${item.stem}${item.branch}`).join('，');
    const elementText = Object.entries(profile.counts).map(([key, value]) => `${key}${value}`).join('、');
    const focus = data.focus;
    const year = new Date().getFullYear();
    const context = {
        subject: `${data.name}，${data.sex}，${data.calendar} ${data.date} ${data.time}，出生地：${data.place}`,
        pillars: pillarText,
        elements: elementText,
        day: `${profile.dayMaster}${profile.dayElement}`,
        dominant: profile.dominant,
        lacking: profile.lacking,
        age: profile.age,
        decade: `${profile.currentDecade}岁到${profile.currentDecade + 9}岁`,
        focus,
        year
    };

    const chapters = [
        {
            title: chapterTitles[0],
            sections: [
                ['基本盘', [
                    `${context.subject}。实验排盘得到四柱：${context.pillars}。日主为${context.day}，五行分布为${context.elements}。这是一份用于内容产品验证的结构化报告，重在把出生信息转译成可阅读、可复盘、可改写的个人节奏分析。`,
                    `八字报告最容易被误读成一句定论，但更有价值的读法，是把它看成一张个人系统草图。年柱像早期环境，月柱像社会接口，日柱像自我核心，时柱像未来延展。四柱不是给人贴标签，而是帮助你观察自己反复进入的情境。`,
                    `这份报告会持续围绕三个问题展开：你天然容易把力气用在哪里，你在哪些地方需要刻意补足，以及你如何把优势从情绪化的发挥，变成稳定、可交付、可复用的能力。`,
                    `当前关注是「${context.focus}」。因此后面的解释会把命理语言尽量翻译成具体行动：如何做选择、如何安排工作流、如何处理关系、如何维护长期输出，而不是停留在玄学词汇里。`
                ]],
                ['四柱关系', [
                    `年柱代表早期土壤，它不决定人会成为什么，却会影响一个人最初如何理解安全、秩序、竞争和资源。月柱更接近现实社会的入口，决定你进入组织、市场和关系网络时，最先使用哪一种策略。`,
                    `日柱是报告的中心，因为它代表一个人处理压力、欲望和自我期待的基本方式。日主${context.day}不只是一个符号，它提示你在关键时刻更容易用哪类能量回应世界：是生发、照亮、承载、裁剪，还是流动。`,
                    `时柱常被理解为后半生、子女或未来延伸，在这个实验报告里，我们更愿意把它理解为“长期作品”。一个人真正能留下什么，不只取决于早期天赋，也取决于后期是否能建立节奏、工具和边界。`,
                    `四柱合起来看，最重要的不是哪一柱好或不好，而是它们之间是否形成闭环。能量有出口，经验能沉淀，选择能复盘，人生就不会只是被事件推着走。`
                ]],
                ['五行初判', [
                    `你的五行分布呈现出${context.dominant}较突出、${context.lacking}较薄弱的倾向。偏旺不等于一定有利，它表示你熟悉这类能量，也容易过度使用它；偏弱不等于坏，它表示你需要用制度、环境或伙伴关系来补足。`,
                    `${profile.rhythm}`,
                    `如果把五行翻译成现代语言，木像生长和规划，火像表达和影响，土像承载和稳定，金像标准和决断，水像研究和流动。你不是只属于某一种元素，而是在不同阶段学习让五种能力轮流上场。`,
                    `后续章节会把五行放进具体议题：工作、关系、财富、身体、表达、长期事业。这样读，命理不再是一套抽象符号，而是一种观察个人系统运行状态的仪表盘。`
                ]],
                ['报告边界', [
                    `这份报告目前使用前端实验算法生成，尚未接入精确节气换月、真太阳时、藏干、十神、大运流年等完整排盘系统。因此它适合做内容原型、个人反思和产品体验，不适合作为专业命理判断。`,
                    `报告会使用传统词汇，但表达会尽量克制。所谓“运势”，在这里不是神秘承诺，而是阶段性环境和个人能力之间的匹配度。所谓“喜忌”，不是禁令，而是系统平衡建议。`,
                    `你可以把它当作一份个人年度复盘的底稿：哪些地方正在形成惯性，哪些能力需要训练，哪些选择其实是在重复旧模式，哪些出口值得投入更长期的时间。`,
                    `如果后续继续开发，最值得补强的是计算精度、解释体系、可编辑模板和导出能力。现在这一版先把目录、叙事和图片报告形态跑通。`
                ]]
            ]
        },
        {
            title: chapterTitles[1],
            sections: [
                ['内外相对论', [
                    `人生不是单纯由内在性格决定，也不是完全被外部环境塑造。更准确的说法是：人会带着自己的能量结构进入环境，再被环境反复训练、放大或修正。命局的价值，是提醒你看见这种互动。`,
                    `${context.day}日主遇到${context.dominant}偏旺，意味着你更容易在${context.dominant}代表的场景里找到熟悉感。熟悉感会带来效率，也会带来盲区，因为人往往会把擅长的方式误当成唯一正确的方式。`,
                    `当你面对不确定性，第一反应可能不是客观分析，而是回到自己最熟悉的能量通道。有人会更想表达，有人会更想控制，有人会更想逃进研究，有人会更想照顾全局。理解这一点，判断才会变清醒。`,
                    `所谓相对论，就是不要孤立地看一个特质。一个特质在某种环境中是优势，换到另一种环境里可能就是成本。报告后面的分析，会持续把“能力”和“场景”放在一起看。`
                ]],
                ['判断力', [
                    `判断力不是知道很多，而是在混乱中识别主次。你的结构提示：如果${context.dominant}被过度使用，判断容易被熟悉路径牵引；如果${context.lacking}长期缺席，判断会在某些关键维度上失衡。`,
                    `提升判断力的第一步，是把问题从“我应该怎么选”改成“这件事要用哪种能力来处理”。有的问题需要木的规划，有的问题需要火的表达，有的问题需要土的耐心，有的问题需要金的切割，有的问题需要水的调研。`,
                    `当你把五行看成能力菜单，而不是神秘标签，很多困惑会变得具体。你会知道自己不是缺少答案，而是总用同一种能力去解不同类型的问题。`,
                    `建议每次重大选择前做一个五行式复盘：目标是否清楚，证据是否足够，节奏是否可持续，边界是否明确，是否给未来留下回旋空间。`
                ]],
                ['交付力', [
                    `交付力是命局落到现实的地方。再好的想法，如果不能变成一个可被别人接收的东西，就只能停留在内在体验里。你当前关注长期输出，这说明交付力比灵感更重要。`,
                    `${context.dominant}能量较强时，容易在启动阶段表现出优势，但真正决定长期结果的是后续节奏。你需要把“想做”变成“按周期完成”，把“我有理解”变成“别人能使用”。`,
                    `交付力的核心不是逼迫自己，而是设计一个能降低启动成本的系统。输入有入口，素材有仓库，判断有标准，生产有模板，反馈有记录，迭代有节奏。`,
                    `当交付成为系统而不是情绪，运势就不再只是外部事件。很多所谓机会，本质上是在你准备好之后，终于能被你接住。`
                ]],
                ['选择权', [
                    `选择权不是选项越多越好，而是你拥有不被单一环境绑架的能力。命局里的强项提供初始动能，弱项提醒风险边界，真正的选择权来自持续积累后的可替代路径。`,
                    `如果你长期只依赖${context.dominant}，选择权会看似扩大，实际变窄。因为所有机会都会被你加工成同一种形态，最后你会觉得世界重复、关系重复、问题也重复。`,
                    `补足${context.lacking}，不是为了变成另一个人，而是为了让系统多一个支点。多一个支点，就多一种看问题的方法；多一种方法，就多一点从旧循环里出来的可能。`,
                    `这也是个人系统的意义：让你在组织之外仍然有判断、交付和恢复的能力。不是拒绝组织，而是不把自己的全部选择权交给组织。`
                ]]
            ]
        },
        {
            title: chapterTitles[2],
            sections: [
                ['主气', [
                    `格局推演先看主气。主气不是“命好命坏”的判断，而是一个人最容易形成稳定行为模式的能量。你的结构里${context.dominant}更突出，说明某些反应已经内化成默认动作。`,
                    `默认动作的好处是快，坏处是容易跳过观察。你可能在还没真正理解问题之前，就已经开始使用熟悉的策略。短期看这会提高效率，长期看会让人生不断绕回同一个题目。`,
                    `格局的关键，不是压制主气，而是给主气找到合适的容器。强木需要方向，强火需要节制，强土需要流动，强金需要温度，强水需要岸线。不同主气，都需要不同的承载方式。`,
                    `你最适合做的不是完全改变自己，而是把熟悉能量从本能反应，训练成有意识的工具。`
                ]],
                ['用神思路', [
                    `传统命理会谈“用神”，现代化理解可以是：系统最需要被调用的平衡能力。你的${context.lacking}偏弱，因此报告会把它视为需要补足的方向。`,
                    `补足不是机械地追求平均。一个人不可能五项能力永远均匀，真正有效的是知道自己何时该用优势推进，何时该请短板上场，何时该借助外部结构来补位。`,
                    `如果${context.lacking}对应的是你不常使用的能力，那它一开始会显得笨拙。不要因为笨拙就放弃。短板进入系统的过程，往往就是一个人升级的过程。`,
                    `用神思路最适合转化为行动清单：建立一个提醒机制、找一个互补伙伴、设置一个固定训练、做一个能暴露短板的项目。`
                ]],
                ['格局风险', [
                    `每一种格局都有风险。偏强的地方会让你自信，也会让你固执；偏弱的地方会让你谨慎，也会让你回避。真正的风险不是某个元素多或少，而是你对自己的模式没有觉察。`,
                    `当${context.dominant}过旺时，你可能会把效率、热情、稳定、标准或洞察其中之一推到极端。极端会带来短期成果，也会消耗关系、身体或长期弹性。`,
                    `当${context.lacking}过弱时，你可能在需要它的时候突然失语、拖延、僵硬或失控。这种失衡通常不会每天出现，但会在关键节点影响选择。`,
                    `风险管理不是恐惧未来，而是提前设计缓冲。重要决定留出冷却期，重要项目设置复盘点，重要关系保留解释空间，重要身体信号不要硬扛。`
                ]],
                ['成局方式', [
                    `一个格局要成，靠的不是标签，而是持续把能量变成结构。结构包括时间安排、工作流程、表达渠道、合作规则、财务边界和身体纪律。`,
                    `你适合把个人经验沉淀为方法。不要只记录发生了什么，而要记录你如何判断、如何试错、如何修正。经验一旦变成方法，就可以复用、传播和交易。`,
                    `成局的第二个条件是减少分散。你不需要同时证明所有可能性，只需要在一个阶段把一个主线打穿。主线打穿之后，旁支才有意义。`,
                    `成局的第三个条件是外部反馈。闭门理解再深，如果没有真实用户、真实读者或真实合作对象，也很难知道系统是否成立。`
                ]],
                ['格局建议', [
                    `建议把未来一年看成格局定型期。不要急着追求规模，先检查你的核心循环是否稳定：输入是否高质量，判断是否有标准，输出是否能复现，反馈是否能进入下一轮。`,
                    `如果你正在做内容，先建立选题库和表达模板；如果你正在做产品，先建立用户问题库和原型节奏；如果你正在做训练，先建立最低行动标准和恢复机制。`,
                    `所有复杂系统，都要回到一个很朴素的问题：你是否能在状态一般的日子里，仍然完成基本交付。能做到这一点，格局就不再只靠天赋。`,
                    `格局不是一次看懂，而是长期校准。每一次选择、每一次关系、每一次项目，都会重新验证这套结构是否真的能支撑你往前走。`
                ]]
            ]
        },
        {
            title: chapterTitles[3],
            sections: [
                ['五行地图', [
                    `五行是一套动态语言。木不是树，火不是火焰，土不是土地，金不是金属，水也不是河流。它们在报告里代表五种能力：生长、表达、承载、裁剪和流动。`,
                    `你的分布为${context.elements}。${context.dominant}偏旺说明该能力容易被调用，${context.lacking}偏弱说明该能力需要被训练或借力。不要把多当成好，也不要把少当成坏。`,
                    `真正重要的是平衡方式。旺的能力要被纳入规则，否则会变成惯性；弱的能力要被纳入日程，否则永远只是愿望。`,
                    `五行喜忌最后要落实成生活设计：怎么安排工作，怎么表达需求，怎么建立边界，怎么训练身体，怎么管理信息。`
                ]],
                ['木', [
                    `木代表生长、规划、学习和长期主义。木好的人能看见趋势，也愿意给事情时间。但木过强时，容易不断发散，计划很多，真正完成的东西反而变少。`,
                    `如果木是你的强项，要学会修枝。不是所有想法都值得执行，不是所有可能性都要打开。木需要金来裁剪，需要土来承载，需要水来滋养。`,
                    `如果木是你的弱项，就需要建立计划能力。最简单的方式不是写宏大目标，而是每周固定一次整理：我在推进什么，为什么推进，下一步最小动作是什么。`,
                    `在个人系统里，木对应路线图。没有路线图的人会被事件推着走，路线图过度膨胀的人会被自己的想象消耗。`
                ]],
                ['火', [
                    `火代表表达、热情、传播和可见度。火好的人能点燃场域，也能把抽象想法讲得有感染力。但火过强时，容易急于回应、急于证明、急于获得即时反馈。`,
                    `如果火是强项，要给表达设置边界。不是每个情绪都要发布，不是每个观点都要争辩。真正有力量的火，是能持续照亮，而不是瞬间烧尽。`,
                    `如果火是弱项，就要训练可见度。好的东西如果长期不被表达，就无法进入他人的世界。你可以从短笔记、复盘、公开日志开始，让表达变成低成本动作。`,
                    `在个人系统里，火对应影响力。影响力不是讨好所有人，而是让真正需要你的人更容易发现你、理解你、信任你。`
                ]],
                ['土', [
                    `土代表承载、稳定、责任和系统化。土好的人能把复杂事务落地，也能在混乱中提供秩序。但土过强时，容易背负太多，最后把责任感变成迟钝。`,
                    `如果土是强项，要学会流动。稳定不等于一成不变，承载不等于替所有人解决问题。土需要水来更新，需要木来生长，需要火来激活。`,
                    `如果土是弱项，就要训练基本盘。睡眠、饮食、财务、文件、日程、复盘，这些东西看起来不锋利，却决定长期输出的下限。`,
                    `在个人系统里，土对应基础设施。基础设施越稳，你越不需要用意志力硬撑。`
                ]],
                ['金水', [
                    `金代表标准、边界、决断和压缩。金好的人知道什么该留下、什么该删掉。但金过强时，容易过度评判，让系统变冷，让关系变紧。`,
                    `水代表研究、迁移、连接和洞察。水好的人能在复杂信息里找到暗线。但水过强时，容易一直观察、一直准备，却迟迟不进入交付。`,
                    `金和水是现代工作里非常重要的能力：一个负责筛选，一个负责理解。缺金会难以取舍，缺水会难以迁移；金水过强，则可能陷入冷处理和过度分析。`,
                    `你的${context.lacking}需要被刻意补足。建议把它拆成一个具体练习，而不是一句模糊愿望。比如每周做一次剪枝、一次公开表达、一次身体训练或一次深度研究。`
                ]]
            ]
        },
        {
            title: chapterTitles[4],
            sections: [
                ['0-20岁', [
                    `0-20岁更像底层感受的形成期。很多人以为早期经历已经过去，其实它会以默认反应的方式留在身体里：你如何感到安全，如何面对权威，如何理解竞争，如何处理失败。`,
                    `年柱不决定命运，但它会影响一个人最早学会的生存策略。有人学会讨好，有人学会独立，有人学会隐忍，有人学会表现。这些策略在早期有用，成年后却需要重新评估。`,
                    `如果你现在反复遇到同一种情绪，可能不是当下事件本身太大，而是它激活了早期模式。细断人生的意义，就是把“我就是这样”拆成“我曾经这样学会保护自己”。`,
                    `对这个阶段最好的处理不是责备过去，而是重新教育自己的反应系统。你可以承认旧策略曾经保护过你，同时不再让它决定所有未来。`
                ]],
                ['20-35岁', [
                    `20-35岁是社会接口打开的阶段。月柱的意义在这里变得明显：你如何进入组织，如何理解专业，如何获得认可，如何在别人制定的规则里找到自己的位置。`,
                    `这个阶段容易把外部评价误认为自我价值。升职、薪水、关系、标签、平台，都可能让人短暂确认自己。但如果没有内在标准，人会不断被新的评价系统牵着走。`,
                    `你在这个阶段积累的不是单一履历，而是一组对现实的理解：什么样的合作可靠，什么样的承诺危险，什么样的努力有复利，什么样的忙碌只是消耗。`,
                    `如果回看这段时间，最值得提炼的不是成败，而是方法。哪些能力被证明可以迁移，哪些场景反复让你失衡，哪些人和环境真正让你变好。`
                ]],
                ['35-50岁', [
                    `35-50岁更接近日柱发力的阶段。一个人开始意识到，不能永远用外部标准解释自己，也不能只靠年轻时的冲劲解决问题。`,
                    `你当前约${context.age}岁，已经进入把经验重组为系统的时期。此时最怕重复证明自己，最需要把过去分散的经验变成方法、资产和稳定输出。`,
                    `这个阶段的重点不是重新开始，而是重新编排。你已经拥有素材、经历、判断和关系，现在要做的是把它们整理成可持续运转的结构。`,
                    `如果你正在做个人系统，这正是关键阶段。不要再只问“我还能做什么”，要开始问“什么东西值得我连续做十年”。`
                ]],
                ['50岁以后', [
                    `50岁以后，时柱象征的长期延展会越来越重要。一个人留下的不是忙碌本身，而是作品、方法、关系、影响和某种可被后人继续使用的东西。`,
                    `如果前半生一直在积累能力，后半生就要学会转化能力。转化的形式可能是课程、书、工具、社群、咨询、作品，也可能是更稳定的生活秩序。`,
                    `这个阶段最怕的是只剩惯性。过去有效的方法不一定继续有效，过去证明身份的方式也不一定继续值得。你需要让系统保持更新。`,
                    `长期来看，命局的价值不是告诉你终点，而是提醒你在每个阶段用合适的策略。不同阶段有不同的主线，顺势就是不把旧答案带到新问题里。`
                ]],
                ['人生复盘', [
                    `细断人生最后要回到复盘。复盘不是自责，也不是写漂亮总结，而是把经历转化成下一次选择的依据。没有复盘，人生只会堆积事件；有复盘，事件才会变成经验。`,
                    `建议你为自己建立一个年度复盘模板：今年最消耗我的是什么，最滋养我的是什么，哪些关系值得加深，哪些工作流需要删除，哪些能力已经出现复利。`,
                    `如果你愿意把八字报告当成个人系统入口，可以每年回来重看一次。你会发现，真正改变你的不是报告文本，而是你在不同年份读它时，能看见不同层次的问题。`,
                    `人生不是一次性解释清楚的。它更像一个长期版本管理系统：你不断提交、回滚、合并、重构，最后形成自己的主线。`
                ]]
            ]
        },
        {
            title: chapterTitles[5],
            sections: [
                ['关系底色', [
                    `爱情密码不是预测某个人会不会出现，而是观察你在亲密关系里如何建立安全感。${context.day}日主需要被理解的，往往不是表面情绪，而是内在秩序和被尊重的节奏。`,
                    `当${context.dominant}能量较强，你可能会把自己的运行方式当成默认标准。你以为自己是在讲道理，对方感受到的却可能是压迫、疏离或难以靠近。`,
                    `关系里的很多冲突，并不是谁对谁错，而是两套节奏没有翻译。一个人需要确定性，另一个人需要空间；一个人需要表达，另一个人需要沉默。`,
                    `看见自己的关系底色，才有机会把“你为什么不懂我”改成“我如何让你更容易懂我”。`
                ]],
                ['吸引模式', [
                    `你容易被什么吸引，通常和命局里的缺口有关。强项让你有自信，缺口让你产生渴望。很多关系一开始的吸引，来自对方身上有你不常使用的能量。`,
                    `如果你缺${context.lacking}，你可能会被拥有这种能量的人吸引。对方一开始像补足，后来也可能成为挑战，因为TA会不断提醒你那些不熟悉的部分。`,
                    `成熟关系不是要求对方永远补足你，而是借由对方看见自己需要成长的地方。否则，吸引会变成依赖，互补会变成拉扯。`,
                    `最好的吸引模式，是两个人都能把对方的差异视为资源，而不是威胁。`
                ]],
                ['沟通机制', [
                    `长期关系的关键不是找到完全契合的人，而是建立可修复的沟通机制。可修复意味着冲突出现后，双方有办法回到同一张桌子上。`,
                    `沟通机制至少包括三件事：及时说出感受，具体描述需求，给对方可执行的回应方式。只说情绪会让对方无从下手，只说指责会让对方进入防御。`,
                    `如果${context.dominant}过强，沟通里要避免把自己的感受包装成客观事实。如果${context.lacking}过弱，要避免在关键时刻沉默、逃避或让对方猜。`,
                    `关系越重要，越不能只靠默契。默契是长期沟通后的结果，不是沟通的替代品。`
                ]],
                ['边界与承诺', [
                    `亲密关系需要承诺，也需要边界。没有承诺，关系缺少稳定；没有边界，关系容易互相吞没。你的结构提示，边界感会是关系质量的重要开关。`,
                    `边界不是冷漠，而是让爱不被消耗。你可以关心对方，但不替对方承担全部人生；你可以回应对方，但不放弃自己的长期主线。`,
                    `承诺也不是一句话，而是一组可见行动：稳定出现、诚实沟通、共同复盘、愿意修正。没有行动的承诺，会消耗信任。`,
                    `好的关系会让你的系统更稳定，而不是让你长期失去判断力。`
                ]],
                ['关系建议', [
                    `建议你在关系里练习三件事：少一点预设，多一点确认；少一点证明，多一点表达；少一点情绪堆积，多一点及时修复。`,
                    `如果你正在进入一段关系，可以观察对方如何处理冲突、时间、金钱、压力和承诺。这些细节比浪漫表达更能说明长期适配度。`,
                    `如果你已经在关系里，可以建立固定复盘：最近什么让我们更靠近，什么让我们更远，下一周我们各自可以做一个什么小动作。`,
                    `爱情不只是命中注定，也是一种共同维护系统的能力。真正稳定的关系，是两个人都愿意让关系越来越可理解。`
                ]]
            ]
        },
        {
            title: chapterTitles[6],
            sections: [
                ['当前阶段', [
                    `当前大运可以理解为${context.decade}这一阶段的主旋律。它不是精确断语，而是提醒你：人生正在从某一种问题，逐步转向另一种问题。`,
                    `这个阶段的关键词是重新定义身份、输出和责任。你不再只是积累经验的人，而是需要把经验变成方法、产品和关系资产的人。`,
                    `如果你正在做个人系统、一人公司或长期内容，重点不是突然放大，而是先把核心循环跑顺：输入、判断、生产、反馈、迭代。`,
                    `当前阶段最怕的是看起来很忙，实际没有沉淀。越忙越要问：这件事做完之后，会留下什么可复用的东西？`
                ]],
                ['事业', [
                    `事业上，适合从“职位逻辑”转向“能力组合逻辑”。职位会变化，平台会变化，但能力组合可以迁移。你的组合里应当包含专业判断、表达交付、工具使用和关系经营。`,
                    `不要只做执行者，也不要急着只做管理者。更好的路径是成为系统设计者：你能理解问题，设计流程，组织资源，并把结果交付给真实对象。`,
                    `如果当前工作消耗较大，要区分两种累：一种是能力增长带来的累，一种是系统错配带来的累。前者值得承受，后者需要调整。`,
                    `事业运的本质不是某年突然变好，而是你的能力、作品和市场需求终于形成匹配。`
                ]],
                ['财富', [
                    `财富不是单独存在的，它来自能力、信用、渠道和风险控制。命局里强的部分负责创造动能，弱的部分往往对应财务系统中的漏洞。`,
                    `建议把财富看成三层：现金流保障生活，技能资产保障交换能力，长期资产保障选择权。只追短期收入，会让人被机会牵着走；只谈长期理想，又容易忽略现实压力。`,
                    `你适合建立一个清晰的财务边界：固定储蓄、项目预算、学习投入、风险上限。边界不是保守，而是让你有资格持续试错。`,
                    `真正稳定的财运，来自可重复交付和可信任关系。靠情绪下注的收益，即使短期出现，也很难成为长期系统。`
                ]],
                ['身体', [
                    `身体是当前阶段的重要底盘。很多人把运势理解成外部机会，却忽略了身体状态决定你能否接住机会。睡眠、饮食、训练和恢复，是长期输出的基础设施。`,
                    `${context.dominant}偏旺时，身体上容易出现某种过度：过度紧绷、过度兴奋、过度承载、过度控制或过度消耗。你需要识别自己的典型信号。`,
                    `建议建立最低身体标准：固定睡眠窗口，每周力量训练，减少高波动饮食，定期离开屏幕。标准不必复杂，但要能长期坚持。`,
                    `身体不是效率工具，而是人生系统本身。身体崩掉时，判断力、交付力和关系耐心都会一起下降。`
                ]],
                ['阶段建议', [
                    `当前阶段适合做减法。把消耗判断力的事情外包、自动化、明确拒绝或降低频率。你需要保护的不是时间本身，而是高质量注意力。`,
                    `每季度只押一个主项目。主项目之外的事情，要么服务它，要么维护身体和关系，要么直接删掉。分散会让你误以为自己在推进，实际只是在切换。`,
                    `建立三个清单：长期资产清单、消耗源清单、机会过滤清单。每当新机会出现，先问它属于哪一类，再决定是否投入。`,
                    `这个阶段真正的好运，是系统开始稳定运转。稳定不是没有变化，而是变化来了，你也有能力接住。`
                ]]
            ]
        },
        {
            title: chapterTitles[7],
            sections: [
                ['十年主线', [
                    `未来十年的主线，会从单点能力转向结构能力。你需要的不只是会做事，而是能设计一套让自己持续做成事的环境。`,
                    `单点能力让你获得机会，结构能力让你保住机会并复制机会。没有结构的人，靠状态；有结构的人，靠系统。`,
                    `当${context.lacking}被补上，选择权会明显提高；当${context.dominant}被过度放大，你会重新遭遇同一种瓶颈。未来十年的训练，就是让两者不再互相拖拽。`,
                    `建议提前布局三个出口：知识产品、可信社群、可复用工具。它们会成为组织之外的支点。`
                ]],
                ['知识出口', [
                    `知识出口是把阅读、经验、案例、工具和判断转化成公开作品。它可以是文章、白皮书、课程、播客、报告，也可以是一个能被他人使用的小工具。`,
                    `你已经有长期记录的基础，下一步要做的是提高组织度。不要只是写很多内容，而要让内容彼此连接，形成读者能进入的路径。`,
                    `知识出口最怕散。建议围绕三条主线持续沉淀：AI 工作流、知识与表达系统、身体与纪律系统。每一条主线都能连接你的经验和未来服务。`,
                    `当知识出口稳定，信任会逐渐积累。信任不是靠夸张承诺获得，而是靠长期清晰、克制、可验证的输出获得。`
                ]],
                ['工具出口', [
                    `工具出口是把你的方法做成可交互的产品。现在这个八字报告实验室，就是一种工具出口：它把一个想法变成用户可以输入、生成、保存和反馈的体验。`,
                    `未来可以继续做小工具矩阵：选题生成、阅读整理、训练记录、报告生成、访谈管理。每个工具都不必一开始很大，但要解决一个真实流程问题。`,
                    `工具的价值不只在功能，也在它迫使你把方法说清楚。一个不能被工具化的方法，往往还没有真正结构化。`,
                    `建议保持 MVP 思维：先跑通最小闭环，再决定是否扩展。不要在没有用户反馈前，把系统做得过重。`
                ]],
                ['社群出口', [
                    `社群出口不是简单拉群，而是围绕共同问题建立持续互动。对你来说，社群可以从访谈、共学、挑战和小范围反馈开始。`,
                    `真正有价值的私域，不是反复推销，而是让合适的人围绕共同议题持续发生关系。关系越真实，未来产品越容易自然长出来。`,
                    `社群要有边界。边界包括主题边界、时间边界、成员边界和交付边界。没有边界的热闹，会迅速消耗组织者。`,
                    `如果未来做课程或服务，社群会是最好的试验田。它能帮你观察真实问题，而不是只在想象中设计产品。`
                ]],
                ['未来建议', [
                    `未来十年最值得坚持的，不是某一个平台，而是一套能跨平台迁移的个人系统。平台会变化，算法会变化，但判断力、交付力和选择权可以积累。`,
                    `每年选择一个系统升级主题：一年升级表达，一年升级产品，一年升级身体，一年升级财务，一年升级关系。不要贪多，但要连续。`,
                    `当你开始拥有多个出口，更要警惕分散。所有出口都应服务同一个核心命题：在 AI 时代训练一种新的个人能力。`,
                    `未来不是等来的，而是通过一轮轮实验建出来的。你不需要一次押中，只需要持续让自己变得更能判断、更能交付、更能选择。`
                ]]
            ]
        },
        {
            title: chapterTitles[8],
            sections: [
                ['周期总览', [
                    `人生周期图把时间拆成几个阶段：0-20岁建立底层感受，20-35岁寻找社会位置，35-50岁重建个人系统，50岁以后把系统转化为影响力。`,
                    `周期不是绝对年龄表，而是提醒你：不同阶段的问题不同，不同阶段的策略也应该不同。用旧策略解决新问题，是很多人长期卡住的原因。`,
                    `你当前更接近“重建个人系统”的阶段。它不是从零开始，而是把过去分散的经验重新编排，让它们服务一个更清晰的主线。`,
                    `周期图最重要的作用，是帮助你从事件里抬头，看见更长的趋势。`
                ]],
                ['上升期', [
                    `上升期的特点是输入、试错、寻找位置。这个阶段不要过早追求稳定，因为稳定可能只是还没见过更多可能性。`,
                    `但上升期也不能无限延长。一直试错而不沉淀，会让人拥有很多故事，却没有形成能力资产。`,
                    `如果你回看自己的上升期，可以提炼三类东西：我真正擅长什么，我不愿再重复什么，我在哪些场景里最容易成长。`,
                    `这些提炼会成为下一阶段的地图。没有地图的人，会把每一次新机会都当成重新开始。`
                ]],
                ['重构期', [
                    `重构期的关键词是筛选。你不再需要证明自己什么都可以，而是要知道什么值得留下，什么应该结束，什么需要升级。`,
                    `这个阶段会出现一种不适：过去有效的激励不再有效，过去追求的认可变得没那么重要，过去能忍受的消耗开始变得难以忍受。`,
                    `这不是退步，而是系统在要求更新。你需要从外部驱动转向内部标准，从机会导向转向主线导向。`,
                    `重构期最适合做的事，是整理资产：文章、方法、工具、案例、关系、身体习惯。资产整理完成，下一阶段才有放大的基础。`
                ]],
                ['放大期', [
                    `放大期不是盲目扩张，而是把已经验证的东西交给更多人使用。没有验证就放大，会放大问题；有验证再放大，会放大价值。`,
                    `放大可以通过内容、产品、服务、合作和社群完成。你不必每条路都走，但要知道哪条路最符合你的能力结构。`,
                    `如果${context.dominant}是你的优势，放大时要防止它变成单一风格。越放大，越要让${context.lacking}进入系统，负责校准和平衡。`,
                    `真正成熟的放大，是你不必每次亲自燃烧，也能让系统持续产生结果。`
                ]],
                ['周期行动', [
                    `建议把人生周期图转化成三张清单：已经结束的周期，正在强化的周期，准备开启的周期。每张清单都写下具体项目，而不是抽象感受。`,
                    `已经结束的周期，要感谢它，然后停止向它索要新的意义。正在强化的周期，要给它资源。准备开启的周期，要先做小实验。`,
                    `每半年复盘一次：我是不是还在用旧身份处理新问题？我是不是为了维持熟悉感，拒绝了必要升级？`,
                    `周期感会让人变稳。因为你知道低谷不是全部，上升也不是永恒，真正重要的是每个阶段都提炼出下一阶段可用的东西。`
                ]]
            ]
        },
        {
            title: chapterTitles[9],
            sections: [
                ['年度关键词', [
                    `${year}年的关键词是“定型”。不要急着让每件事都有规模，先让核心能力可以稳定复现。定型不是保守，而是让系统有可识别的形状。`,
                    `适合推进：系统化写作、AI 工作流、身体训练、访谈和小产品 MVP。谨慎处理：过度承诺、短期热点、没有沉淀的合作。`,
                    `今年最重要的不是做很多事，而是让外界更容易理解你正在构建什么。品牌定性、内容目录、实验室入口、私域关系，都应该围绕同一个核心叙事。`,
                    `年度运势的本质，是年度策略。策略越清楚，事件越不容易把你带偏。`
                ]],
                ['春夏', [
                    `春夏适合打开局面。春天偏向计划和试探，夏天偏向表达和验证。你可以在这个阶段发布更多公开内容，做几次小范围访谈，测试哪些议题最能引发真实反馈。`,
                    `但打开局面不等于四处扩散。每一次发布都要回到主线：它是否帮助别人理解你的个人系统，是否能成为白皮书、精选记录或实验室产品的素材。`,
                    `春夏也适合训练表达节奏。不要等到完全想清楚才输出，很多清晰是在输出过程中形成的。`,
                    `注意控制火气：表达越多，越需要保留安静整理的时间。`
                ]],
                ['秋冬', [
                    `秋冬适合收束和沉淀。秋天偏向筛选，把春夏打开的线索分类；冬天偏向储备，把有效经验写进系统。`,
                    `如果上半年做了很多实验，下半年就要判断哪些值得继续，哪些应该结束。结束不是失败，而是让资源回到更重要的主线上。`,
                    `秋冬也适合做产品化整理：把文章变成目录，把目录变成白皮书，把白皮书变成课程或工具原型。`,
                    `注意不要因为外界节奏变慢，就误以为自己停滞。很多真正的积累，都发生在不那么热闹的时候。`
                ]],
                ['年度风险', [
                    `今年的风险是被热点牵引。AI 时代信息密度很高，如果每个新工具、新观点、新机会都要追，你会很快失去自己的主线。`,
                    `第二个风险是过度承诺。你可能因为看见太多可能性而答应太多事情，但长期系统最怕承诺超过承载。`,
                    `第三个风险是身体被忽略。越是想加速，越要维护睡眠、训练和饮食。身体一旦掉线，判断和表达都会变形。`,
                    `风险管理的办法很简单：每季度只押一个主项目，每周固定复盘，每天保留一段不被打断的深工作。`
                ]],
                ['年度行动', [
                    `年度行动可以分成四组：内容、工具、关系、身体。内容负责建立信任，工具负责验证方法，关系负责形成私域，身体负责保证长期输出。`,
                    `内容上，建立精选记录和白皮书目录；工具上，继续迭代实验室项目；关系上，启动访谈和小范围共学；身体上，保持力量训练和恢复节奏。`,
                    `每个月只问一个问题：这个月是否留下了一个可见资产？资产可以是一篇文章、一个页面、一个工具、一次访谈纪要或一套训练记录。`,
                    `${year}年最好的结果，不是突然爆发，而是当别人来到官网时，能清楚看见你是谁、你在构建什么、为什么值得继续关注。`
                ]]
            ]
        },
        {
            title: chapterTitles[10],
            sections: [
                ['当前版本', [
                    `这份报告先到这里。它不是终点，而是一套可以继续扩写的目录。当前版本已经具备输入、生辰结构生成、目录导航、报告图片渲染和逐页下载。`,
                    `它的价值不在于一次性给出完美答案，而在于把一个内容产品的形态跑出来：用户输入信息，系统生成结构化解释，结果能以图片形式保存和传播。`,
                    `下一步可以围绕两个方向继续：一是提高排盘精度，二是提高内容生成质量。前者让结果更可靠，后者让体验更像真正的报告产品。`,
                    `目前这版先服务原型验证，后续可以逐步接入更完整的命理模块。`
                ]],
                ['算法待补', [
                    `需要补充的算法包括：节气换月、真太阳时、藏干、十神、旺衰、格局、神煞、大运起运、流年流月等。只有这些补齐后，报告才能从“象意解释器”升级为更完整的八字排盘工具。`,
                    `出生地也需要更精确处理。不同经度会影响真太阳时，夏令时和农历转换也需要可靠数据源。`,
                    `如果未来要严肃化，建议把计算逻辑拆成独立模块，并给每一步加测试样例。命理产品最怕看起来丰富，但基础数据不稳定。`,
                    `算法越复杂，越需要在界面上说明边界。透明比神秘更能建立信任。`
                ]],
                ['内容待补', [
                    `内容层面可以继续扩展：每章增加更多分支，根据五行强弱、日主、季节、年龄和关注问题生成不同段落，而不是所有用户使用同一套模板。`,
                    `也可以增加“个人系统版解读”：把命理语言映射到 AI 工作流、知识表达、身体纪律、一人公司实验等更符合 gonghejian.cn 的叙事主线。`,
                    `报告图片可以增加更多版式：册页、长卷、签文、年运卡、五行雷达图、人生周期图。不同章节使用不同版式，会更有产品感。`,
                    `内容越丰富，越要保持克制。好的报告不是堆砌吉凶，而是让读者更能理解自己。`
                ]],
                ['产品待补', [
                    `产品层面可以增加保存、分享、导出 PDF、生成长图、编辑文案、选择风格、隐藏敏感信息等功能。`,
                    `如果未来接入 AI，可以让用户选择报告语气：克制版、详细版、行动建议版、年度规划版。但核心结构应该先固定，否则 AI 很容易发散。`,
                    `也可以设计“白皮书联动”：报告最后引导用户阅读 AI 时代个人系统白皮书，把玄学实验转化为个人系统入口。`,
                    `这会让工具不只是好玩，而是服务官网的品牌定性和转化入口。`
                ]],
                ['结束语', [
                    `真正有价值的不是一句结论，而是让你更清楚自己如何判断、如何交付、如何在组织之外建立选择权。`,
                    `命理语言如果被用来逃避现实，它会变成迷信；如果被用来组织经验，它可以成为一种反思工具。关键在于你把解释权交给谁。`,
                    `这份报告希望把解释权还给使用者：你可以借它看见模式，但最终仍要回到行动、关系、身体和长期作品。`,
                    `未完待续。下一版，应该让这份报告更准、更长、更能被保存，也更像一个真正属于 gonghejian.cn 的实验室产品。`
                ]]
            ]
        }
    ];

    return chapters.flatMap((chapter, chapterIndex) => {
        const sectionPages = [];
        chapter.sections.forEach(([subtitle, lines], sectionIndex) => {
            chunkLines(lines, 2).forEach((chunk, chunkIndex, chunks) => {
                sectionPages.push({
                    title: chapter.title,
                    subtitle: `${subtitle} · ${sectionIndex + 1}/${chapter.sections.length}${chunks.length > 1 ? `-${chunkIndex + 1}` : ''}`,
                    lines: chunk,
                    chapterIndex,
                    pageInChapter: sectionPages.length + 1,
                    totalInChapter: 0
                });
            });
        });
        sectionPages.forEach((page) => {
            page.totalInChapter = sectionPages.length;
        });
        return sectionPages;
    });
}

function chunkLines(lines, size) {
    const chunks = [];
    for (let index = 0; index < lines.length; index += size) {
        chunks.push(lines.slice(index, index + size));
    }
    return chunks;
}

function generateReport() {
    const data = getFormData();
    const profile = calculateProfile(data);
    const pages = buildReportPages(data, profile);
    const stage = document.getElementById('report-stage');
    const nav = document.getElementById('chapter-nav');
    const reportPanel = document.getElementById('report-panel');
    const navButtons = [];

    stage.innerHTML = '';
    nav.innerHTML = '';
    reportPanel.scrollTop = 0;

    document.getElementById('report-title').textContent = `${data.name}的八字报告`;
    if (document.getElementById('download-current')) {
        document.getElementById('download-current').disabled = false;
    }
    drawCoverPreview(data, profile);

    chapterTitles.forEach((title, chapterIndex) => {
        if (!pages.some((page) => page.chapterIndex === chapterIndex)) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = title;
        button.dataset.chapterIndex = String(chapterIndex);
        button.addEventListener('click', () => {
            navButtons.forEach((item) => item.classList.toggle('active', item === button));
            document.getElementById(`chapter-${chapterIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        nav.appendChild(button);
        navButtons.push(button);
    });

    const grouped = groupPagesByChapter(pages);
    grouped.forEach((chapterPages, chapterIndex) => {
        if (!chapterPages?.length) return;
        const section = document.createElement('section');
        section.className = 'long-report-chapter';
        section.id = `chapter-${chapterIndex}`;

        const heading = document.createElement('div');
        heading.className = 'long-report-heading';
        heading.innerHTML = `
            <span>${String(chapterIndex + 1).padStart(2, '0')}</span>
            <h3>${chapterTitles[chapterIndex]}</h3>
            <p>${data.name} · ${data.date} ${data.time} · ${data.place}</p>
        `;
        section.appendChild(heading);

        if (chapterIndex === 0) {
            section.appendChild(createProfileSummary(profile));
        }

        chapterPages.forEach((pageData) => {
            const block = document.createElement('article');
            block.className = 'long-report-block';
            const subtitle = document.createElement('h4');
            subtitle.textContent = pageData.subtitle.replace(/ · 本章.*$/, '');
            block.appendChild(subtitle);
            pageData.lines.forEach((line) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = line;
                block.appendChild(paragraph);
            });
            section.appendChild(block);
        });

        stage.appendChild(section);
    });

    if (navButtons[0]) {
        navButtons[0].classList.add('active');
    }

    const updateActiveChapter = () => {
        const panelTop = reportPanel.getBoundingClientRect().top;
        let activeIndex = navButtons[0]?.dataset.chapterIndex || '0';
        stage.querySelectorAll('.long-report-chapter').forEach((section) => {
            if (section.getBoundingClientRect().top - panelTop <= 190) {
                activeIndex = section.id.replace('chapter-', '');
            }
        });
        navButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.chapterIndex === activeIndex);
        });
    };

    reportPanel.onscroll = updateActiveChapter;
    updateActiveChapter();
}

function groupPagesByChapter(pages) {
    return chapterTitles.map((_, chapterIndex) => pages.filter((page) => page.chapterIndex === chapterIndex));
}

function createProfileSummary(profile) {
    const summary = document.createElement('div');
    summary.className = 'profile-summary';
    profile.pillars.forEach((pillar) => {
        const item = document.createElement('div');
        item.innerHTML = `<span>${pillar.label}</span><strong style="color:${elementColors[pillar.element]}">${pillar.stem}${pillar.branch}</strong>`;
        summary.appendChild(item);
    });
    return summary;
}

function downloadCoverImage() {
    const canvas = document.getElementById('cover-preview');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'bazi-report-cover.png';
    link.click();
}

function drawCoverPreview(dataOverride = null, profileOverride = null) {
    const canvas = document.getElementById('cover-preview');
    if (!canvas) return;
    const data = dataOverride || { name: '弓箭', date: '1997-09-01', time: '01:00', place: '南京市' };
    const profile = profileOverride || calculateProfile({ ...data, sex: '男', calendar: '公历', focus: '个人系统' });
    drawReportPage(canvas, {
        title: '八字概要',
        lines: [
            '传统报告图片样式预览。',
            `四柱示例：${profile.pillars.map((p) => p.stem + p.branch).join(' / ')}`,
            '生成后可逐页查看、下载和继续改写。'
        ]
    }, 0, data, profile);
}

function drawReportPage(canvas, chapter, index, data, profile, totalPages = chapterTitles.length) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    drawPaper(ctx, width, height);
    drawFrame(ctx, width, height);
    drawMountains(ctx, width, height, index);
    drawSeal(ctx, width - 170, 96, index);

    const textFont = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';

    ctx.fillStyle = '#18202b';
    ctx.textAlign = 'left';
    ctx.font = `700 26px ${textFont}`;
    ctx.fillText('八字报告实验室', 78, 94);

    ctx.fillStyle = '#68717f';
    ctx.font = `20px ${textFont}`;
    ctx.fillText(`${data.name || '未命名'} · ${data.date || ''} ${data.time || ''} · ${data.place || ''}`, 78, 130);

    ctx.fillStyle = '#b5362d';
    ctx.font = `700 24px ${textFont}`;
    ctx.fillText(String(index + 1).padStart(2, '0'), 78, 194);

    ctx.fillStyle = '#18202b';
    ctx.font = `800 48px ${textFont}`;
    wrapText(ctx, chapter.title, 78, 262, 720, 58);

    if (chapter.subtitle) {
        ctx.fillStyle = '#68717f';
        ctx.font = `700 22px ${textFont}`;
        wrapText(ctx, `${chapter.subtitle} · 本章 ${chapter.pageInChapter}/${chapter.totalInChapter}`, 78, 320, 720, 30);
    }

    drawPillars(ctx, profile, 78, 358);

    ctx.fillStyle = '#243040';
    ctx.font = `24px ${textFont}`;
    let y = 512;
    chapter.lines.forEach((paragraph) => {
        y = wrapParagraph(ctx, paragraph, 86, y, 720, 38) + 24;
    });

    drawElementStrip(ctx, profile, 86, 1088);

    ctx.fillStyle = '#68717f';
    ctx.font = `20px ${textFont}`;
    ctx.fillText('实验型解释器 · 非专业命理结论', 78, 1194);
    ctx.textAlign = 'right';
    ctx.fillText(`${index + 1} / ${totalPages}`, width - 78, 1194);
}

function drawPaper(ctx, width, height) {
    ctx.fillStyle = '#f7f0df';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 900; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = `rgba(60, 50, 38, ${Math.random() * 0.035})`;
        ctx.fillRect(x, y, Math.random() * 2 + 0.4, Math.random() * 2 + 0.4);
    }
}

function drawFrame(ctx, width, height) {
    ctx.strokeStyle = 'rgba(24, 32, 43, 0.28)';
    ctx.lineWidth = 4;
    ctx.strokeRect(44, 44, width - 88, height - 88);
    ctx.strokeStyle = 'rgba(181, 54, 45, 0.42)';
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, width - 116, height - 116);
}

function drawMountains(ctx, width, height, index) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = index % 2 ? '#1f7a69' : '#233a5e';
    ctx.lineWidth = 5;
    for (let row = 0; row < 3; row += 1) {
        ctx.beginPath();
        const base = height - 250 + row * 54;
        ctx.moveTo(50, base);
        for (let x = 50; x <= width - 50; x += 80) {
            ctx.lineTo(x + 40, base - 70 - row * 10);
            ctx.lineTo(x + 80, base);
        }
        ctx.stroke();
    }
    ctx.restore();
}

function drawSeal(ctx, x, y, index) {
    ctx.save();
    ctx.fillStyle = '#b5362d';
    ctx.translate(x, y);
    ctx.rotate((index % 3 - 1) * 0.05);
    ctx.fillRect(0, 0, 92, 92);
    ctx.fillStyle = '#f7f0df';
    ctx.font = '700 27px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('弓箭', 46, 40);
    ctx.fillText('实验', 46, 70);
    ctx.restore();
}

function drawPillars(ctx, profile, x, y) {
    const cellWidth = 168;
    profile.pillars.forEach((pillar, index) => {
        const left = x + index * (cellWidth + 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.46)';
        ctx.fillRect(left, y, cellWidth, 104);
        ctx.strokeStyle = 'rgba(24, 32, 43, 0.18)';
        ctx.strokeRect(left, y, cellWidth, 104);
        ctx.fillStyle = '#68717f';
        ctx.font = '20px "Microsoft YaHei", "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pillar.label, left + cellWidth / 2, y + 30);
        ctx.fillStyle = elementColors[pillar.element];
        ctx.font = '800 38px "Microsoft YaHei", "PingFang SC", sans-serif';
        ctx.fillText(`${pillar.stem}${pillar.branch}`, left + cellWidth / 2, y + 76);
    });
    ctx.textAlign = 'left';
}

function drawElementBars(ctx, profile, x, y) {
    const max = Math.max(...Object.values(profile.counts), 1);
    ctx.fillStyle = '#18202b';
    ctx.font = '700 24px "Microsoft YaHei", sans-serif';
    ctx.fillText('五行分布', x, y);
    Object.entries(profile.counts).forEach(([element, value], index) => {
        const top = y + 38 + index * 34;
        ctx.fillStyle = '#68717f';
        ctx.font = '20px "Microsoft YaHei", sans-serif';
        ctx.fillText(element, x, top + 20);
        ctx.fillStyle = 'rgba(24, 32, 43, 0.1)';
        ctx.fillRect(x + 52, top, 340, 20);
        ctx.fillStyle = elementColors[element];
        ctx.fillRect(x + 52, top, 340 * (value / max), 20);
        ctx.fillStyle = '#243040';
        ctx.fillText(String(value), x + 410, top + 20);
    });
}

function drawElementStrip(ctx, profile, x, y) {
    const total = Object.values(profile.counts).reduce((sum, value) => sum + value, 0) || 1;
    let left = x;
    ctx.fillStyle = '#18202b';
    ctx.font = '700 22px "Microsoft YaHei", sans-serif';
    ctx.fillText('五行分布', x, y);
    Object.entries(profile.counts).forEach(([element, value]) => {
        const width = Math.max(28, 480 * (value / total));
        ctx.fillStyle = elementColors[element];
        ctx.fillRect(left, y + 28, width, 16);
        ctx.fillStyle = '#243040';
        ctx.font = '18px "Microsoft YaHei", sans-serif';
        ctx.fillText(`${element}${value}`, left, y + 68);
        left += width + 12;
    });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let line = '';
    let cursorY = y;
    for (const char of text) {
        const testLine = line + char;
        if (ctx.measureText(testLine).width > maxWidth && line) {
            ctx.fillText(line, x, cursorY);
            line = char;
            cursorY += lineHeight;
        } else {
            line = testLine;
        }
    }
    if (line) {
        ctx.fillText(line, x, cursorY);
    }
    return cursorY;
}

function wrapParagraph(ctx, text, x, y, maxWidth, lineHeight) {
    const firstLineIndent = 34;
    let line = '';
    let cursorY = y;
    let isFirstLine = true;
    for (const char of text) {
        const offset = isFirstLine ? firstLineIndent : 0;
        const testLine = line + char;
        if (ctx.measureText(testLine).width > maxWidth - offset && line) {
            ctx.fillText(line, x + offset, cursorY);
            line = char;
            cursorY += lineHeight;
            isFirstLine = false;
        } else {
            line = testLine;
        }
    }
    if (line) {
        ctx.fillText(line, x + (isFirstLine ? firstLineIndent : 0), cursorY);
    }
    return cursorY;
}

function mod(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
}
