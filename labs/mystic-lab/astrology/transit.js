/**
 * 行运计算与年度运势生成模块
 * 计算外行星行运、相位分析，并生成中文年度运势文本
 */

const SIGNS = [
    '白羊座', '金牛座', '双子座', '巨蟹座',
    '狮子座', '处女座', '天秤座', '天蝎座',
    '射手座', '摩羯座', '水瓶座', '双鱼座'
];

const PLANET_SPEEDS = {
    '木星': { speed: 0.0830853, baseLongitude: 34.3515, symbol: '♃', periodYears: 12 },
    '土星': { speed: 0.0334442, baseLongitude: 50.0774, symbol: '♄', periodYears: 29 },
    '天王星': { speed: 0.011769, baseLongitude: 314.055, symbol: '♅', periodYears: 84 },
    '海王星': { speed: 0.006027, baseLongitude: 304.3487, symbol: '♆', periodYears: 165 },
    '冥王星': { speed: 0.004027, baseLongitude: 238.9583, symbol: '♇', periodYears: 248 }
};

const ASPECT_TYPES = [
    { name: '合相', angle: 0, orb: 8, nature: '融合' },
    { name: '对相', angle: 180, orb: 8, nature: '张力' },
    { name: '三分相', angle: 120, orb: 8, nature: '和谐' },
    { name: '四分相', angle: 90, orb: 8, nature: '挑战' }
];

const HOUSE_MEANINGS = {
    '第一宫': '自我形象、个性、外表与人生方向',
    '第二宫': '金钱收入、物质资源、个人价值观',
    '第三宫': '沟通交流、学习考试、短途旅行与兄弟姐妹',
    '第四宫': '家庭根基、房产、内心世界与安全感',
    '第五宫': '创造表达、恋爱桃花、子女与投机娱乐',
    '第六宫': '日常工作、健康保养、服务他人与生活习惯',
    '第七宫': '婚姻伴侣、合作关系、公开的对手与契约',
    '第八宫': '深度转化、共享资源、保险税务与神秘领域',
    '第九宫': '高等教育、长途旅行、哲学信仰与出版传播',
    '第十宫': '事业成就、社会地位、公众形象与权威关系',
    '第十一宫': '社交圈子、团体组织、理想愿景与人脉资源',
    '第十二宫': '潜意识、隐秘事务、灵性修行与业力释放'
};

function getSignFromLongitude(longitude) {
    const idx = Math.floor(((longitude % 360) + 360) % 360 / 30) % 12;
    return { sign: SIGNS[idx], index: idx };
}

function normalizeAngle(angle) {
    let a = angle % 360;
    if (a < 0) a += 360;
    return a;
}

function angularDistance(a, b) {
    let diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
    if (diff > 180) diff = 360 - diff;
    return diff;
}

function julianDayFromDate(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
        Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return jdn;
}

function daysSinceJ2000(year, month, day) {
    return julianDayFromDate(year, month, day) - 2451545.0;
}

function findPlanetHouse(longitude, houses) {
    for (let i = 0; i < houses.length; i++) {
        const start = normalizeAngle(houses[i].cuspLongitude);
        const end = normalizeAngle(houses[(i + 1) % houses.length].cuspLongitude);
        let lng = normalizeAngle(longitude);
        if (end < start) {
            if (lng >= start || lng < end) return houses[i];
        } else {
            if (lng >= start && lng < end) return houses[i];
        }
    }
    return houses[0];
}

function getHouseNumber(house) {
    return house && house.houseNumber ? house.houseNumber : 1;
}

const transitTemplates = {
    planetSign: {
        '木星': {
            '白羊座': '木星点燃你的白羊座领域，扩张的能量带来主动出击的机遇，适合开创新局。',
            '金牛座': '木星在金牛座稳健增长，物质与资源的扩张期，适合积累财富与巩固基础。',
            '双子座': '木星在双子座拓展信息与人脉，学习与交流成为年度主题，机会藏在沟通中。',
            '巨蟹座': '木星进入巨蟹座，家庭与情感领域迎来滋养与扩展，内心安全感显著提升。',
            '狮子座': '木星在狮子座闪耀，创造力与自我表达获得放大，是展现才华的黄金时期。',
            '处女座': '木星在处女座细化你的计划，务实与服务精神带来成长，细节中藏着机遇。',
            '天秤座': '木星在天秤座促进关系与合作，婚姻与合伙事务迎来扩展，平衡中收获丰盛。',
            '天蝎座': '木星深入天蝎座，深度转化与资源共享带来扩张，秘密与真相将浮出水面。',
            '射手座': '木星回归守护星座射手座，信仰与远行能量高涨，是探索真理与拓宽视野之年。',
            '摩羯座': '木星在摩羯座务实攀登，事业与社会地位有望提升，努力将在结构中结果。',
            '水瓶座': '木星在水瓶座激发革新与团体愿景，科技与人道主义带来意想不到的机遇。',
            '双鱼座': '木星在双鱼座消融边界，灵性直觉与艺术创作被放大，慈悲与梦想成为主题。'
        },
        '土星': {
            '白羊座': '土星考验你的白羊座领域，冲动受到约束，需要在行动中建立纪律与耐心。',
            '金牛座': '土星在金牛座审视你的价值观与财务，物质安全感面临现实考验，需务实规划。',
            '双子座': '土星在双子座要求你认真对待沟通与学习，思维结构需要重整，避免浮躁。',
            '巨蟹座': '土星在巨蟹座触及家庭与情感根基，责任与压力可能来自家人，需巩固内在。',
            '狮子座': '土星在狮子座压制自我表达，创造力面临现实检验，学会谦逊与长期经营。',
            '处女座': '土星在处女座强化工作与健康纪律，细节与效率成为过关关键，服务中见真章。',
            '天秤座': '土星在天秤座严肃对待承诺与关系，婚姻合作需承担责任，成熟的关系观被建立。',
            '天蝎座': '土星深入天蝎座，共享资源与深度情感面临清算，转化必须经历现实的淬炼。',
            '射手座': '土星在射手座考验信仰与远见，理想需落地，高等教育或长途计划可能受阻。',
            '摩羯座': '土星回归摩羯座，事业与社会责任达到高峰，是建立权威与长期成就的关键时期。',
            '水瓶座': '土星在水瓶座重塑团体与社会角色，革新必须伴随责任，朋友与理想需要现实支撑。',
            '双鱼座': '土星在双鱼座模糊边界中建立结构，灵性修行需有纪律，梦境必须面对现实。'
        },
        '天王星': {
            '白羊座': '天王星在白羊座带来个人身份与行动的突变，你可能突然改变形象或人生方向。',
            '金牛座': '天王星在金牛座震荡财务与价值观，收入方式与物质观念将经历革命性转变。',
            '双子座': '天王星在双子座颠覆沟通与学习模式，新技术与非常规思维带来突破。',
            '巨蟹座': '天王星在巨蟹座动摇家庭根基，居住状况或家人关系可能出现意外变化。',
            '狮子座': '天王星在狮子座打破自我表达的常规，创造力与恋爱方式变得前卫不可预测。',
            '处女座': '天王星在处女座革新工作与健康习惯，日常流程可能被科技或突发事件改变。',
            '天秤座': '天王星在天秤座冲击合作关系，婚姻与合伙可能经历非传统或突然的转折。',
            '天蝎座': '天王星在天蝎座引爆深度共享领域，遗产、税务或亲密关系可能出现意外变故。',
            '射手座': '天王星在射手座颠覆信仰体系，高等教育或远行计划可能走向非传统道路。',
            '摩羯座': '天王星在摩羯座瓦解事业结构，社会地位与权威关系面临突如其来的重组。',
            '水瓶座': '天王星回归水瓶座，团体与人道主义领域迎来革命，你是变革的先锋。',
            '双鱼座': '天王星在双鱼座模糊现实与幻想的界限，灵性体验与艺术表达变得前卫独特。'
        },
        '海王星': {
            '白羊座': '海王星在白羊座消融个人意志的边界，你可能感到方向迷茫，需警惕冲动中的幻想。',
            '金牛座': '海王星在金牛座模糊物质安全感，财务上需防欺骗，也可能在艺术中寻得价值。',
            '双子座': '海王星在双子座弥漫思维沟通，信息辨别力下降，学习与交流中易有误解。',
            '巨蟹座': '海王星在巨蟹座浸润家庭情感，家人关系可能带有牺牲色彩，居住环境趋于灵性化。',
            '狮子座': '海王星在狮子座淡化自我光芒，恋爱与创造中易有浪漫幻想，需警惕盲目崇拜。',
            '处女座': '海王星在处女座溶解工作健康边界，日常规律易被打乱，适合灵性疗愈与奉献服务。',
            '天秤座': '海王星在天秤座理想化伴侣关系，婚姻合伙中易有牺牲或欺骗，需建立清晰边界。',
            '天蝎座': '海王星在天蝎座潜入深层资源，共享财务与亲密关系充满神秘，直觉力异常敏锐。',
            '射手座': '海王星在射手座升华信仰追求，高等教育与远行带有灵性目的，避免盲目理想化。',
            '摩羯座': '海王星在摩羯座软化事业野心，公众形象可能带有神秘色彩，适合艺术或慈善事业。',
            '水瓶座': '海王星在水瓶座模糊团体边界，社交圈子中易有牺牲或欺骗，人道主义带有浪漫色彩。',
            '双鱼座': '海王星回归双鱼座，灵性直觉达到巅峰，艺术与慈悲能量满溢，但需警惕逃避现实。'
        },
        '冥王星': {
            '白羊座': '冥王星在白羊座彻底转化个人身份，你将经历重生般的自我重塑，意志力被极端考验。',
            '金牛座': '冥王星在金牛座深度转化价值观与财务，资源结构将经历毁灭与重生的剧变。',
            '双子座': '冥王星在双子座颠覆思维模式，沟通与学习方式经历深刻转化，真相可能震撼认知。',
            '巨蟹座': '冥王星在巨蟹座触及家庭根源，家族秘密可能浮现，情感安全感经历生死般的转化。',
            '狮子座': '冥王星在狮子座剧烈转化创造力与恋爱，自我表达经历权力斗争，重生后更强大。',
            '处女座': '冥王星在处女座深刻改变工作与健康，日常习惯被彻底检视，服务中经历权力转化。',
            '天秤座': '冥王星在天秤座剧烈转化合作关系，婚姻合伙经历权力与控制的深层清算。',
            '天蝎座': '冥王星回归天蝎座，深度共享与亲密关系经历极致转化，死亡与重生是年度主题。',
            '射手座': '冥王星在射手座颠覆信仰体系，高等教育与远行经历深刻转化，真理需经黑暗检验。',
            '摩羯座': '冥王星在摩羯座彻底重组事业与社会结构，权威与成就经历毁灭后重建。',
            '水瓶座': '冥王星在水瓶座深度转化团体与社会角色，朋友与理想经历权力结构的剧烈重组。',
            '双鱼座': '冥王星在双鱼座潜入潜意识深渊，灵性修行经历极致转化，梦境与直觉蕴含巨大力量。'
        }
    },

    aspect: {
        '合相': (tPlanet, nPlanet, sign) => `${tPlanet}与出生星图中的${nPlanet}形成紧密合相，两颗行星的能量完全融合。这是全新的开始周期，${nPlanet}所代表的领域将被${tPlanet}的能量彻底重塑。`,
        '对相': (tPlanet, nPlanet, sign) => `${tPlanet}对分你的出生${nPlanet}，外在压力与内在需求形成张力。你可能在${nPlanet}相关领域感受到强烈的对抗，需要在对立中寻找平衡。`,
        '三分相': (tPlanet, nPlanet, sign) => `${tPlanet}与你的出生${nPlanet}形成和谐三分相，能量流动顺畅。这是${nPlanet}领域获得支持与机遇的时期，幸运之门悄然开启。`,
        '四分相': (tPlanet, nPlanet, sign) => `${tPlanet}四分你的出生${nPlanet}，内在冲突与外在挑战交织。${nPlanet}所代表的领域面临成长的阵痛，突破后将获得实质性成长。`
    },

    career: {
        '木星': {
            '合相': '事业宫迎来木星合相，职场机遇显著扩张，可能获得晋升或重要项目。',
            '三分相': '木星三分事业相关行星，职场贵人相助，合作机会带来事业发展。',
            '四分相': '木星四分事业点，机遇与挑战并存，需避免过度扩张导致资源分散。',
            '对相': '木星对分事业领域，合作关系中的机会需要平衡个人与他人的需求。'
        },
        '土星': {
            '合相': '土星合相事业点，职场压力增大但亦是建立权威的关键期，需稳扎稳打。',
            '三分相': '土星三分事业相关行星，务实的努力获得认可，长期规划开始结果。',
            '四分相': '土星四分事业点，职场阻力明显，旧有结构面临考验，需耐心突破。',
            '对相': '土星对分事业领域，合作关系中的责任加重，需在限制中寻找成长空间。'
        },
        '天王星': {
            '合相': '天王星合相事业点，职场可能发生突变，转行、创业或技术革新在即。',
            '三分相': '天王星三分事业相关行星，创新思维带来突破，非传统路径可能成功。',
            '四分相': '天王星四分事业点，职场动荡不安，突发事件考验应变能力。',
            '对相': '天王星对分事业领域，合作关系中的突变需要灵活调整，固守旧规将受冲击。'
        },
        '海王星': {
            '合相': '海王星合相事业点，事业方向可能迷茫，适合艺术、慈善或灵性相关工作。',
            '三分相': '海王星三分事业相关行星，直觉与创意在工作中发挥作用，灵感带来机遇。',
            '四分相': '海王星四分事业点，职场中需防欺骗或误解，目标可能模糊不清。',
            '对相': '海王星对分事业领域，合作关系中的理想化需警惕，避免牺牲自我。'
        },
        '冥王星': {
            '合相': '冥王星合相事业点，职场经历深刻转化，权力斗争后可能获得重生般的提升。',
            '三分相': '冥王星三分事业相关行星，深层资源与洞察力推动事业，暗中的支持力量强大。',
            '四分相': '冥王星四分事业点，职场权力斗争激烈，旧有模式必须死亡才能新生。',
            '对相': '冥王星对分事业领域，合作关系中的控制议题浮现，需面对深层恐惧。'
        }
    },

    love: {
        '木星': {
            '合相': '感情生活迎来丰盛期，单身者可能遇到重要对象，伴侣关系更加融洽。',
            '三分相': '木星带来感情好运，社交活动增多，恋爱机会藏在朋友与团体中。',
            '四分相': '木星四分感情点，感情中可能过度乐观，需避免因承诺过多而难以兑现。',
            '对相': '木星对分感情领域，伴侣关系中的价值观差异需要调和，共同成长是关键。'
        },
        '土星': {
            '合相': '感情进入严肃考验期，关系需要承担责任，不适合玩乐心态。',
            '三分相': '土星三分感情相关行星，成熟稳重的态度带来感情稳定，长期承诺可期。',
            '四分相': '土星四分感情点，感情压力增大，现实问题考验关系基础。',
            '对相': '土星对分感情领域，伴侣关系中的责任分配成为议题，需共同面对现实。'
        },
        '天王星': {
            '合相': '感情生活可能发生突变，单身者易遇非传统对象，伴侣关系需要空间。',
            '三分相': '天王星三分感情相关行星，感情中充满惊喜与新鲜感，自由恋爱模式吸引你。',
            '四分相': '天王星四分感情点，感情不稳定，突发事件可能冲击现有关系。',
            '对相': '天王星对分感情领域，伴侣关系中的独立需求增强，传统模式受到挑战。'
        },
        '海王星': {
            '合相': '感情充满浪漫幻想，容易理想化对方，需警惕盲目投入与欺骗。',
            '三分相': '海王星三分感情相关行星，灵性连接加深，艺术或慈善活动中可能邂逅缘分。',
            '四分相': '海王星四分感情点，感情边界模糊，易陷入暧昧或不切实际的期待。',
            '对相': '海王星对分感情领域，伴侣关系中的牺牲与救赎议题浮现，需建立清晰界限。'
        },
        '冥王星': {
            '合相': '感情经历深刻转化，可能经历分合或权力斗争，重生后的关系更加真实。',
            '三分相': '冥王星三分感情相关行星，深层情感连接带来蜕变，亲密关系更加深入。',
            '四分相': '冥王星四分感情点，感情中的控制与嫉妒浮现，旧有模式必须死亡。',
            '对相': '冥王星对分感情领域，伴侣关系中的权力博弈激烈，需面对深层恐惧与欲望。'
        }
    },

    wealth: {
        '木星': {
            '合相': '财运亨通，收入可能显著增加，但需避免过度乐观导致的大手大脚。',
            '三分相': '木星三分财帛相关点，投资与理财获得好运，适合适度扩张财务版图。',
            '四分相': '木星四分财运点，财务机会虽多但需谨慎评估，避免贪心冒进。',
            '对相': '木星对分财务领域，合作财务或伴侣金钱观需要协调，共享资源有扩张机会。'
        },
        '土星': {
            '合相': '财务进入紧缩期，需严格预算与储蓄，长期规划比短期获利更重要。',
            '三分相': '土星三分财帛相关点，务实的理财策略带来稳定收益，适合保守投资。',
            '四分相': '土星四分财运点，财务压力增大，可能面临债务或收入减少的考验。',
            '对相': '土星对分财务领域，合作财务中的责任加重，需共同承担经济现实。'
        },
        '天王星': {
            '合相': '财务可能发生突变，意外收入或支出皆有可能，需保持财务弹性。',
            '三分相': '天王星三分财帛相关点，创新投资或非传统收入来源带来惊喜。',
            '四分相': '天王星四分财运点，财务波动剧烈，需防范突发性的金钱损失。',
            '对相': '天王星对分财务领域，合作财务中的不稳定因素增加，需灵活应对变化。'
        },
        '海王星': {
            '合相': '财务边界模糊，需防诈骗与不切实际的投资，慈善支出可能增加。',
            '三分相': '海王星三分财帛相关点，直觉型投资可能有意外收获，艺术相关收入可期。',
            '四分相': '海王星四分财运点，财务迷雾重重，需警惕被骗或过度理想化的理财方案。',
            '对相': '海王星对分财务领域，合作财务中的透明度不足，需避免牺牲个人利益。'
        },
        '冥王星': {
            '合相': '财务经历深刻转化，可能涉及遗产、税务或大额资金重组，毁灭后重生。',
            '三分相': '冥王星三分财帛相关点，深层资源与隐秘投资带来回报，洞察力是财富。',
            '四分相': '冥王星四分财运点，财务权力斗争激烈，可能面临重大经济损失后重建。',
            '对相': '冥王星对分财务领域，合作财务中的控制议题浮现，需面对深层恐惧。'
        }
    },

    health: {
        '木星': '注意肝脏与过度放纵带来的问题，保持适度运动与饮食平衡。',
        '土星': '关注骨骼、关节与慢性疲劳，规律作息与适度压力管理是关键。',
        '天王星': '注意神经系统与突发状况，保持生活弹性，避免过度紧张。',
        '海王星': '关注免疫系统与药物敏感，避免过度饮酒，灵性疗愈有助身心。',
        '冥王星': '注意生殖系统与深层毒素，定期体检，转化旧有健康习惯。'
    },

    timing: {
        '木星': '年初与年中是木星能量最强的时期，重要计划宜在此时推进。',
        '土星': '土星逆行期间（年中前后）适合检视与调整长期计划。',
        '天王星': '天王星带来的突变往往发生在意想不到的时刻，保持开放心态。',
        '海王星': '海王星逆行期间适合灵性反思，避免做重大财务或感情决定。',
        '冥王星': '冥王星转化往往在年度中后期深化，重大蜕变需要耐心等待。'
    }
};

class TransitCalculator {
    constructor() {
        this.transitPlanets = Object.keys(PLANET_SPEEDS);
    }

    /**
     * 计算指定年份的行运位置
     * @param {Object} birthChart - 出生星盘数据
     * @param {number} year - 目标年份
     * @returns {Object} 行运数据
     */
    calculateYearlyTransits(birthChart, year) {
        const transits = [];
        const keyDates = [];

        // 计算该年每月1日的外行星位置
        for (let month = 1; month <= 12; month++) {
            const days = daysSinceJ2000(year, month, 1);
            const monthTransits = {};

            this.transitPlanets.forEach(planet => {
                const params = PLANET_SPEEDS[planet];
                const longitude = normalizeAngle(params.baseLongitude + params.speed * days);
                const signInfo = getSignFromLongitude(longitude);
                monthTransits[planet] = {
                    planet,
                    symbol: params.symbol,
                    longitude,
                    sign: signInfo.sign,
                    signIndex: signInfo.index,
                    date: `${year}-${String(month).padStart(2, '0')}-01`
                };
            });

            transits.push({
                month,
                year,
                planets: monthTransits
            });
        }

        // 检测星座换座事件
        for (let i = 0; i < this.transitPlanets.length; i++) {
            const planet = this.transitPlanets[i];
            for (let m = 0; m < 11; m++) {
                const curr = transits[m].planets[planet];
                const next = transits[m + 1].planets[planet];
                if (curr.signIndex !== next.signIndex) {
                    // 估算换座日期（线性插值）
                    const dayEst = Math.floor(15 + (30 - (curr.longitude % 30)) / (next.longitude - curr.longitude) * 30);
                    const estDate = `${year}-${String(m + 1).padStart(2, '0')}-${String(Math.min(28, Math.max(1, dayEst))).padStart(2, '0')}`;
                    keyDates.push({
                        type: 'signChange',
                        planet: curr.planet,
                        symbol: curr.symbol,
                        fromSign: curr.sign,
                        toSign: next.sign,
                        date: estDate,
                        description: `${curr.planet}将于${estDate}前后进入${next.sign}`
                    });
                }
            }
        }

        // 检测与出生星盘行星的重要相位
        const natalPlanets = birthChart.planets || [];
        const monthlyAspects = [];

        transits.forEach(monthData => {
            const monthAspectList = [];
            this.transitPlanets.forEach(tPlanet => {
                const tData = monthData.planets[tPlanet];
                natalPlanets.forEach(nPlanet => {
                    const distance = angularDistance(tData.longitude, nPlanet.longitude);
                    ASPECT_TYPES.forEach(aspect => {
                        const orb = Math.abs(distance - aspect.angle);
                        if (orb <= aspect.orb) {
                            monthAspectList.push({
                                date: tData.date,
                                transitingPlanet: tPlanet,
                                natalPlanet: nPlanet.planet,
                                aspect: aspect.name,
                                angle: aspect.angle,
                                orb: parseFloat(orb.toFixed(2)),
                                nature: aspect.nature,
                                transitingLongitude: tData.longitude,
                                natalLongitude: nPlanet.longitude
                            });
                        }
                    });
                });
            });
            monthlyAspects.push({
                month: monthData.month,
                aspects: monthAspectList.sort((a, b) => a.orb - b.orb)
            });
        });

        // 提取年度关键相位事件（取最接近的月份）
        const aspectEvents = [];
        const seenAspects = new Set();
        monthlyAspects.forEach(m => {
            m.aspects.forEach(asp => {
                const key = `${asp.transitingPlanet}-${asp.natalPlanet}-${asp.aspect}`;
                if (!seenAspects.has(key)) {
                    seenAspects.add(key);
                    aspectEvents.push({
                        type: 'aspect',
                        ...asp,
                        description: `${asp.transitingPlanet}${asp.aspect}出生${asp.natalPlanet}（容许度${asp.orb}°）`
                    });
                }
            });
        });

        return {
            year,
            monthlyTransits: transits,
            monthlyAspects,
            keyEvents: [...keyDates, ...aspectEvents].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
        };
    }

    /**
     * 分析行运与出生星盘的相位
     * @param {Object} natalChart - 出生星盘
     * @param {Object} transitData - 行运数据（单年）
     * @returns {Array} 排序后的相位列表
     */
    analyzeTransits(natalChart, transitData) {
        const natalPlanets = natalChart.planets || [];
        const houses = natalChart.houses || [];
        const allAspects = [];

        // 收集该年所有月份的相位，去重后取最佳（最小容许度）
        const aspectMap = new Map();

        (transitData.monthlyAspects || []).forEach(monthData => {
            monthData.aspects.forEach(asp => {
                const key = `${asp.transitingPlanet}-${asp.natalPlanet}-${asp.aspect}`;
                if (!aspectMap.has(key) || aspectMap.get(key).orb > asp.orb) {
                    const natalPlanetData = natalPlanets.find(p => p.planet === asp.natalPlanet);
                    const house = natalPlanetData ? findPlanetHouse(natalPlanetData.longitude, houses) : null;
                    aspectMap.set(key, {
                        ...asp,
                        natalSign: natalPlanetData ? natalPlanetData.sign : null,
                        natalHouse: house ? house.house : null,
                        houseNumber: house ? house.houseNumber : null
                    });
                }
            });
        });

        const results = Array.from(aspectMap.values());
        results.sort((a, b) => a.orb - b.orb);
        return results;
    }

    /**
     * 生成年运势文本
     * @param {Object} birthChart - 出生星盘
     * @param {number} startYear - 起始年份
     * @returns {Array} 三年运势数组
     */
    generateYearlyForecast(birthChart, startYear) {
        const forecasts = [];
        const houses = birthChart.houses || [];
        const natalPlanets = birthChart.planets || [];

        for (let offset = 0; offset < 3; offset++) {
            const year = startYear + offset;
            const transitData = this.calculateYearlyTransits(birthChart, year);
            const aspects = this.analyzeTransits(birthChart, transitData);

            // 找出年度主导行运
            const dominant = this.findDominantTransit(transitData, aspects, houses, natalPlanets);

            // 年度主题
            const annualTheme = this.generateAnnualTheme(dominant, houses, natalPlanets);

            // 各领域运势
            const career = this.generateDomainForecast('career', aspects, natalPlanets, houses);
            const love = this.generateDomainForecast('love', aspects, natalPlanets, houses);
            const wealth = this.generateDomainForecast('wealth', aspects, natalPlanets, houses);
            const health = this.generateHealthForecast(aspects);
            const timing = this.generateTimingHints(transitData, aspects);

            forecasts.push({
                year,
                theme: annualTheme,
                career,
                love,
                wealth,
                health,
                timing,
                dominantTransit: dominant,
                keyAspects: aspects.slice(0, 6)
            });
        }

        return forecasts;
    }

    findDominantTransit(transitData, aspects, houses, natalPlanets) {
        // 优先找合相，其次找进入重要宫位（10宫、7宫、1宫）的行星
        const conjunctions = aspects.filter(a => a.aspect === '合相');
        if (conjunctions.length > 0) {
            const c = conjunctions[0];
            const house = findPlanetHouse(c.natalLongitude, houses);
            return {
                planet: c.transitingPlanet,
                target: c.natalPlanet,
                aspect: '合相',
                house: house ? house.house : null,
                houseNumber: house ? house.houseNumber : null,
                orb: c.orb
            };
        }

        // 检查是否有行星进入重要宫位宫头所在星座
        const importantHouses = [1, 4, 7, 10];
        for (const monthData of transitData.monthlyTransits || []) {
            for (const planet of this.transitPlanets) {
                const t = monthData.planets[planet];
                for (const hNum of importantHouses) {
                    const house = houses.find(h => h.houseNumber === hNum);
                    if (house && t.signIndex === house.signIndex) {
                        return {
                            planet: t.planet,
                            target: house.house,
                            aspect: '进入宫位',
                            house: house.house,
                            houseNumber: hNum,
                            orb: null
                        };
                    }
                }
            }
        }

        // 找最小的四分相或对相
        const hardAspects = aspects.filter(a => a.aspect === '四分相' || a.aspect === '对相');
        if (hardAspects.length > 0) {
            const h = hardAspects[0];
            const house = findPlanetHouse(h.natalLongitude, houses);
            return {
                planet: h.transitingPlanet,
                target: h.natalPlanet,
                aspect: h.aspect,
                house: house ? house.house : null,
                houseNumber: house ? house.houseNumber : null,
                orb: h.orb
            };
        }

        //  fallback: 取第一个三分相或任意行运
        if (aspects.length > 0) {
            const a = aspects[0];
            const house = findPlanetHouse(a.natalLongitude, houses);
            return {
                planet: a.transitingPlanet,
                target: a.natalPlanet,
                aspect: a.aspect,
                house: house ? house.house : null,
                houseNumber: house ? house.houseNumber : null,
                orb: a.orb
            };
        }

        // 最后 fallback: 木星位置
        const dec = transitData.monthlyTransits[0];
        const jup = dec ? dec.planets['木星'] : null;
        if (jup) {
            return { planet: '木星', target: jup.sign, aspect: '进入星座', house: null, houseNumber: null, orb: null };
        }
        return { planet: '木星', target: '年度运势', aspect: '一般', house: null, houseNumber: null, orb: null };
    }

    generateAnnualTheme(dominant, houses, natalPlanets) {
        const planet = dominant.planet;
        const target = dominant.target;
        const aspect = dominant.aspect;
        const houseNumber = dominant.houseNumber;

        let text = '';

        if (aspect === '合相' && target) {
            const houseText = houseNumber ? `${houseNumber}宫` : '';
            const houseMeaning = houseNumber ? (HOUSE_MEANINGS[`第${['一','二','三','四','五','六','七','八','九','十','十一','十二'][houseNumber-1]}宫`] || '') : '';
            text = `${planet}过境精准合相你的出生${target}`;
            if (houseText) text += `（${houseText}${houseMeaning ? '，' + houseMeaning.split('、')[0] : ''}）`;
            text += `，这一年是${this.getPlanetThemeKeyword(planet)}的关键时期。`;
        } else if (aspect === '进入宫位' && dominant.house) {
            const houseMeaning = HOUSE_MEANINGS[dominant.house] || '';
            text = `${planet}过境你的${dominant.house}（${houseMeaning}），这一年${this.getHouseThemeKeyword(dominant.houseNumber)}成为核心议题。`;
        } else if (aspect === '四分相') {
            text = `${planet}与你的出生${target}形成紧张四分相`;
            if (houseNumber) text += `（涉及第${houseNumber}宫）`;
            text += `，内在冲突与外在挑战交织，成长必须伴随阵痛。`;
        } else if (aspect === '对相') {
            text = `${planet}对分你的出生${target}`;
            if (houseNumber) text += `（通过第${houseNumber}宫呈现）`;
            text += `，关系与对立中的张力推动你寻找平衡。`;
        } else if (aspect === '三分相') {
            text = `${planet}三分你的出生${target}`;
            if (houseNumber) text += `（经由第${houseNumber}宫）`;
            text += `，宇宙的支持能量顺畅流动，把握机遇顺势而为。`;
        } else {
            text = `${planet}的年度行运主导这一年的节奏，${this.getPlanetGeneralKeyword(planet)}。`;
        }

        return text;
    }

    generateDomainForecast(domain, aspects, natalPlanets, houses) {
        // 找到与该领域最相关的相位
        const domainKeywords = {
            career: ['太阳', '月亮', '水星', '火星', '木星', '土星', '第十宫', '第六宫', '第二宫'],
            love: ['金星', '月亮', '火星', '木星', '土星', '第七宫', '第五宫', '第一宫'],
            wealth: ['金星', '木星', '土星', '冥王星', '海王星', '第二宫', '第八宫', '第十宫']
        };

        const keywords = domainKeywords[domain] || [];

        // 按相关性排序相位
        const scored = aspects.map(a => {
            let score = 0;
            const natalPlanet = natalPlanets.find(p => p.planet === a.natalPlanet);
            const houseNum = natalPlanet ? getHouseNumber(findPlanetHouse(natalPlanet.longitude, houses)) : 0;

            if (keywords.includes(a.natalPlanet)) score += 3;
            if (keywords.includes(`第${['一','二','三','四','五','六','七','八','九','十','十一','十二'][houseNum-1]}宫`)) score += 2;
            if (a.aspect === '合相') score += 2;
            if (a.aspect === '四分相' || a.aspect === '对相') score += 1;
            score -= a.orb * 0.2;
            return { ...a, score, houseNum };
        }).filter(a => a.score > 0).sort((a, b) => b.score - a.score);

        const top = scored.slice(0, 2);
        if (top.length === 0) {
            // 无显著相位时给出通用提示
            const generics = {
                career: '这一年职场节奏相对平稳，适合巩固基础与提升专业技能，等待更有利的时机再作大动作。',
                love: '感情生活趋于平淡，是审视内心真实需求的好时机，不必强求，顺其自然反而有惊喜。',
                wealth: '财务状况维持现状，建议保守理财，避免高风险投资，稳健积累为上策。'
            };
            return generics[domain] || '';
        }

        const texts = top.map(a => {
            const tmpl = transitTemplates[domain];
            if (!tmpl || !tmpl[a.transitingPlanet]) {
                return `${a.transitingPlanet}${a.aspect}你的出生${a.natalPlanet}，${this.getDomainGenericText(domain, a)}`;
            }
            const planetTmpl = tmpl[a.transitingPlanet];
            return planetTmpl[a.aspect] || planetTmpl['合相'];
        });

        return texts.join('；');
    }

    generateHealthForecast(aspects) {
        const healthPlanets = ['土星', '天王星', '海王星', '冥王星'];
        const relevant = aspects.filter(a => healthPlanets.includes(a.transitingPlanet));
        if (relevant.length === 0) {
            return '整体健康状况平稳，保持规律作息与适度运动即可维持良好状态。';
        }

        const top = relevant.slice(0, 2);
        const texts = top.map(a => {
            const base = transitTemplates.health[a.transitingPlanet] || '';
            if (a.aspect === '合相' || a.aspect === '四分相') {
                return `${a.transitingPlanet}的紧张相位提示：${base}`;
            }
            return base;
        });

        // 去重
        const unique = [...new Set(texts)];
        return unique.join('；') || '注意劳逸结合，定期体检，防患于未然。';
    }

    generateTimingHints(transitData, aspects) {
        const hints = [];
        const events = transitData.keyEvents || [];

        // 换座事件
        const signChanges = events.filter(e => e.type === 'signChange').slice(0, 2);
        signChanges.forEach(e => {
            hints.push(`${e.date}前后，${e.planet}进入${e.toSign}，${this.getTimingKeyword(e.planet, e.toSign)}`);
        });

        // 关键相位时间
        const keyAspects = aspects.filter(a => a.orb < 3).slice(0, 2);
        keyAspects.forEach(a => {
            hints.push(`${a.transitingPlanet}${a.aspect}出生${a.natalPlanet}（容许度${a.orb}°），${this.getAspectTimingKeyword(a)}`);
        });

        if (hints.length === 0) {
            hints.push('年初制定全年计划，年中检视调整，年末总结沉淀，顺应宇宙节奏。');
        }

        return hints;
    }

    getPlanetThemeKeyword(planet) {
        const map = {
            '木星': '扩展成长与机遇把握',
            '土星': '建立根基与现实检验',
            '天王星': '突破变革与自由觉醒',
            '海王星': '灵性消融与梦想追寻',
            '冥王星': '深度转化与权力重生'
        };
        return map[planet] || '个人成长';
    }

    getHouseThemeKeyword(houseNumber) {
        const map = {
            1: '自我重塑与个人方向',
            2: '财务价值观与资源管理',
            3: '学习沟通与日常互动',
            4: '家庭根基与内心安全',
            5: '创造表达与恋爱子女',
            6: '工作健康与服务细节',
            7: '伴侣关系与合作契约',
            8: '深度转化与资源共享',
            9: '信仰追求与远见拓展',
            10: '事业成就与社会地位',
            11: '社交团体与理想愿景',
            12: '灵性修行与潜意识清理'
        };
        return map[houseNumber] || '人生成长';
    }

    getPlanetGeneralKeyword(planet) {
        const map = {
            '木星': '机遇与扩张是年度主旋律，保持开放心态迎接丰盛',
            '土星': '责任与限制教会你耐心，稳扎稳打方能建立长久成就',
            '天王星': '突变与革新不可避免，拥抱变化才能抓住机遇',
            '海王星': '梦想与灵性引领方向，但需脚踏实地避免迷失',
            '冥王星': '深刻的转化正在发生，旧我必须死亡，新我才能诞生'
        };
        return map[planet] || '内在成长与外在调整同步进行';
    }

    getDomainGenericText(domain, aspect) {
        const texts = {
            career: {
                '合相': '事业领域迎来重要转折，新周期开启。',
                '对相': '合作关系中的张力影响职场，需平衡双方利益。',
                '三分相': '职场贵人相助，机遇自然来。',
                '四分相': '事业挑战促使你突破舒适区，成长在即。'
            },
            love: {
                '合相': '感情生活迎来重要节点，新关系或关系新阶段开启。',
                '对相': '伴侣关系中的对立需要调和，理解与妥协是关键。',
                '三分相': '感情和谐顺畅，桃花与温情并存。',
                '四分相': '感情中的摩擦是成长的催化剂，坦诚沟通可化解。'
            },
            wealth: {
                '合相': '财务结构面临重组，新的收入模式可能出现。',
                '对相': '合作财务中的分歧需要协商，避免单方面承担风险。',
                '三分相': '财运顺畅，投资与理财获得支持。',
                '四分相': '财务压力促使你重新审视消费习惯，调整后可改善。'
            }
        };
        return (texts[domain] && texts[domain][aspect.aspect]) || '相关领域受到显著影响，需留意变化。';
    }

    getTimingKeyword(planet, sign) {
        const map = {
            '木星': {
                '白羊座': '适合开启新计划，主动出击。',
                '金牛座': '财务机遇浮现，稳健投资可期。',
                '双子座': '信息交流活跃，学习考试有利。',
                '巨蟹座': '家庭事务扩展，房产或家人关系有进展。',
                '狮子座': '创造力爆发，适合展现自我。',
                '处女座': '工作细节优化，健康改善可期。',
                '天秤座': '合作关系扩展，婚姻合伙有利。',
                '天蝎座': '深度资源共享，投资回报可期。',
                '射手座': '远行与信仰拓展，视野大开。',
                '摩羯座': '事业地位提升，长期规划结果。',
                '水瓶座': '团体活动增多，人道主义项目有利。',
                '双鱼座': '灵性觉醒，艺术创作灵感涌现。'
            },
            '土星': {
                '白羊座': '个人计划需务实调整，避免冲动。',
                '金牛座': '财务紧缩，需严格储蓄计划。',
                '双子座': '学习计划需持之以恒，避免浮躁。',
                '巨蟹座': '家庭责任加重，需承担更多。',
                '狮子座': '自我表达受限，学会低调务实。',
                '处女座': '工作纪律强化，健康需规律管理。',
                '天秤座': '合作关系面临考验，承诺需慎重。',
                '天蝎座': '共享资源面临清算，深度转化不可避免。',
                '射手座': '信仰体系受到挑战，理想需落地。',
                '摩羯座': '事业责任达到高峰，建立权威的关键时期。',
                '水瓶座': '团体角色重组，社会责任加重。',
                '双鱼座': '灵性修行需有纪律，梦境面对现实。'
            },
            '天王星': {
                '白羊座': '个人形象突变，可能突然改变方向。',
                '金牛座': '财务结构革新，收入方式可能改变。',
                '双子座': '沟通方式革新，新技术带来突破。',
                '巨蟹座': '家庭状况突变，居住可能改变。',
                '狮子座': '恋爱与创造方式变得前卫独特。',
                '处女座': '工作方式革新，日常流程可能被科技改变。',
                '天秤座': '合作关系突变，非传统模式出现。',
                '天蝎座': '深度资源突变，遗产或税务有意外。',
                '射手座': '信仰体系颠覆，远行计划可能突变。',
                '摩羯座': '事业结构重组，权威关系突变。',
                '水瓶座': '团体角色革新，你是变革先锋。',
                '双鱼座': '灵性体验独特，艺术表达前卫。'
            },
            '海王星': {
                '白羊座': '个人意志模糊，方向感需重新确认。',
                '金牛座': '物质安全感迷茫，艺术中寻得价值。',
                '双子座': '思维沟通易有误解，信息辨别力下降。',
                '巨蟹座': '家庭情感浸润，居住环境趋于灵性化。',
                '狮子座': '恋爱浪漫幻想，创造力带有神秘色彩。',
                '处女座': '工作健康边界模糊，适合灵性疗愈。',
                '天秤座': '伴侣关系理想化，需建立清晰边界。',
                '天蝎座': '深层资源神秘，直觉力异常敏锐。',
                '射手座': '信仰带有灵性目的，避免盲目理想化。',
                '摩羯座': '事业带有神秘色彩，适合艺术慈善事业。',
                '水瓶座': '团体边界模糊，人道主义带有浪漫色彩。',
                '双鱼座': '灵性直觉巅峰，但需警惕逃避现实。'
            },
            '冥王星': {
                '白羊座': '个人身份彻底转化，重生般的自我重塑。',
                '金牛座': '价值观与财务深度转化，资源结构剧变。',
                '双子座': '思维模式颠覆，真相可能震撼认知。',
                '巨蟹座': '家庭根源触及，家族秘密可能浮现。',
                '狮子座': '创造力与恋爱剧烈转化，权力斗争后更强大。',
                '处女座': '工作健康彻底检视，服务中经历权力转化。',
                '天秤座': '合作关系深层清算，权力与控制议题浮现。',
                '天蝎座': '深度共享极致转化，死亡与重生是主题。',
                '射手座': '信仰体系颠覆，真理需经黑暗检验。',
                '摩羯座': '事业社会结构重组，权威经历毁灭后重建。',
                '水瓶座': '团体社会角色剧烈重组，理想面临权力考验。',
                '双鱼座': '潜意识深渊探索，梦境与直觉蕴含巨大力量。'
            }
        };
        return (map[planet] && map[planet][sign]) || '能量转换期，留意相关领域的变化。';
    }

    getAspectTimingKeyword(aspect) {
        const map = {
            '合相': '能量聚焦，是启动新计划的关键窗口。',
            '对相': '张力达到顶点，关系与对立中的抉择时刻。',
            '三分相': '和谐能量流动，顺势而为可获佳绩。',
            '四分相': '挑战加剧，突破瓶颈需要额外努力。'
        };
        return map[aspect.aspect] || '重要能量交汇，留意相关领域动态。';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TransitCalculator, transitTemplates };
}
