/**
 * 易经64卦数据
 * 包含卦名、卦辞、爻辞等信息
 */

const HEXAGRAMS = [
    {
        number: 1,
        name: '乾',
        nameEn: 'Qian',
        symbol: '☰',
        description: '天行健，君子以自强不息',
        guaci: '元，亨，利，贞。',
        guaciMeaning: '创始、通达、适宜、正固。',
        yaoci: [
            { line: 1, text: '初九：潜龙，勿用。', meaning: '龙潜藏在深渊，暂时不要施展才能。' },
            { line: 2, text: '九二：见龙在田，利见大人。', meaning: '龙出现在田野，有利于见到大人物。' },
            { line: 3, text: '九三：君子终日乾乾，夕惕若，厉无咎。', meaning: '君子整天勤奋努力，晚上保持警惕，虽有危险但无灾祸。' },
            { line: 4, text: '九四：或跃在渊，无咎。', meaning: '龙有时跃出深渊，没有灾祸。' },
            { line: 5, text: '九五：飞龙在天，利见大人。', meaning: '龙飞在天上，有利于见到大人物。' },
            { line: 6, text: '上九：亢龙有悔。', meaning: '龙飞得过高，会有悔恨。' }
        ]
    },
    {
        number: 2,
        name: '坤',
        nameEn: 'Kun',
        symbol: '☷',
        description: '地势坤，君子以厚德载物',
        guaci: '元，亨，利牝马之贞。',
        guaciMeaning: '创始、通达，适宜像母马那样正固。',
        yaoci: [
            { line: 1, text: '初六：履霜，坚冰至。', meaning: '踩到霜，坚冰即将到来。' },
            { line: 2, text: '六二：直，方，大，不习无不利。', meaning: '正直、方正、广大，不学习也没有不利。' },
            { line: 3, text: '六三：含章可贞，或从王事，无成有终。', meaning: '蕴含文采可以正固，或者跟随君王做事，没有成就但有好的结果。' },
            { line: 4, text: '六四：括囊，无咎无誉。', meaning: '扎紧口袋，没有灾祸也没有赞誉。' },
            { line: 5, text: '六五：黄裳，元吉。', meaning: '黄色的下裳，最为吉祥。' },
            { line: 6, text: '上六：龙战于野，其血玄黄。', meaning: '龙在野外战斗，流出的血是黑黄色的。' }
        ]
    },
    {
        number: 3,
        name: '屯',
        nameEn: 'Zhun',
        symbol: '☵☳',
        description: '云雷屯，君子以经纶',
        guaci: '元，亨，利，贞。勿用有攸往，利建侯。',
        guaciMeaning: '创始、通达、适宜、正固。不要有所前往，适宜建立侯国。',
        yaoci: [
            { line: 1, text: '初九：磐桓，利居贞，利建侯。', meaning: '徘徊不进，适宜守住正固，适宜建立侯国。' },
            { line: 2, text: '六二：屯如邅如，乘马班如。', meaning: '困难重重，徘徊不前，乘着马团团转。' },
            { line: 3, text: '六三：即鹿无虞，惟入于林中。', meaning: '追逐鹿而没有向导，只能进入林中。' },
            { line: 4, text: '六四：乘马班如，求婚媾，往吉，无不利。', meaning: '乘着马团团转，求婚配，前往吉祥，没有不利。' },
            { line: 5, text: '九五：屯其膏，小贞吉，大贞凶。', meaning: '囤积膏脂，小的正固吉祥，大的正固凶险。' },
            { line: 6, text: '上六：乘马班如，泣血涟如。', meaning: '乘着马团团转，哭泣流血不断。' }
        ]
    },
    {
        number: 4,
        name: '蒙',
        nameEn: 'Meng',
        symbol: '☶☵',
        description: '山下出泉，蒙，君子以果行育德',
        guaci: '亨。匪我求童蒙，童蒙求我。',
        guaciMeaning: '通达。不是我去求蒙昧的儿童，而是蒙昧的儿童来求我。',
        yaoci: [
            { line: 1, text: '初六：发蒙，利用刑人，用说桎梏，以往吝。', meaning: '启发蒙昧，适宜用刑罚来规范人，用来脱去桎梏，前往会有困难。' },
            { line: 2, text: '九二：包蒙，吉。纳妇，吉。子克家。', meaning: '包容蒙昧，吉祥。娶妻，吉祥。儿子能够持家。' },
            { line: 3, text: '六三：勿用取女，见金夫，不有躬，无攸利。', meaning: '不要娶这个女子，她见到有钱的男子，不能保持自身，没有好处。' },
            { line: 4, text: '六四：困蒙，吝。', meaning: '困在蒙昧中，有困难。' },
            { line: 5, text: '六五：童蒙，吉。', meaning: '儿童蒙昧，吉祥。' },
            { line: 6, text: '上九：击蒙，不利为寇，利御寇。', meaning: '打击蒙昧，不利于做盗寇，有利于抵御盗寇。' }
        ]
    }
];

// 为了简化，这里只包含前4卦的完整数据
// 实际应用中应该包含全部64卦
// 这里提供一个函数来获取卦的数据
function getHexagram(number) {
    if (number < 1 || number > 64) {
        return null;
    }
    
    // 如果数据中有，直接返回
    const hexagram = HEXAGRAMS.find(h => h.number === number);
    if (hexagram) {
        return hexagram;
    }
    
    // 否则返回一个基础结构（实际应该补充完整数据）
    return {
        number: number,
        name: `卦${number}`,
        nameEn: `Hexagram${number}`,
        symbol: '☰',
        description: '待补充',
        guaci: '待补充',
        guaciMeaning: '待补充',
        yaoci: [
            { line: 1, text: '待补充', meaning: '待补充' },
            { line: 2, text: '待补充', meaning: '待补充' },
            { line: 3, text: '待补充', meaning: '待补充' },
            { line: 4, text: '待补充', meaning: '待补充' },
            { line: 5, text: '待补充', meaning: '待补充' },
            { line: 6, text: '待补充', meaning: '待补充' }
        ]
    };
}

// 根据六爻生成卦数（0-63）
function getHexagramNumber(lines) {
    // lines 是一个数组，包含6个数字：0（阴）或1（阳）
    // 从下往上：lines[0]是初爻，lines[5]是上爻
    let number = 0;
    for (let i = 0; i < 6; i++) {
        if (lines[i] === 1) {
            number += Math.pow(2, i);
        }
    }
    return number + 1; // 卦数从1开始
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HEXAGRAMS, getHexagram, getHexagramNumber };
}
