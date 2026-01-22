/**
 * 星盘解析模块
 * 提供行星落座、落宫、相位的解读
 */

class ChartInterpreter {
    constructor() {
        // 行星落座解读
        this.planetSignMeanings = {
            '太阳': {
                '白羊座': '你充满活力和冲劲，具有领导才能和开拓精神。',
                '金牛座': '你稳重务实，重视物质享受和安全感。',
                '双子座': '你聪明好奇，善于沟通，喜欢学习和交流。',
                '巨蟹座': '你情感丰富，重视家庭，具有很强的直觉。',
                '狮子座': '你自信热情，喜欢表现，具有创造力和领导力。',
                '处女座': '你细致认真，追求完美，注重细节和实用性。',
                '天秤座': '你追求和谐平衡，重视人际关系和美感。',
                '天蝎座': '你深沉神秘，具有强大的意志力和洞察力。',
                '射手座': '你乐观开朗，热爱自由，追求真理和智慧。',
                '摩羯座': '你务实稳重，有强烈的责任感和事业心。',
                '水瓶座': '你独立创新，思想前卫，重视友谊和理想。',
                '双鱼座': '你敏感浪漫，富有同情心，具有艺术天赋。'
            },
            '月亮': {
                '白羊座': '你的情绪直接而强烈，需要快速的情感表达。',
                '金牛座': '你情绪稳定，需要安全感和物质保障。',
                '双子座': '你情绪多变，喜欢通过交流来释放情感。',
                '巨蟹座': '你情感丰富，对家庭和过去有强烈依恋。',
                '狮子座': '你情绪热烈，需要被关注和认可。',
                '处女座': '你情绪细腻，喜欢通过服务他人来表达情感。',
                '天秤座': '你情绪平和，需要和谐的人际关系。',
                '天蝎座': '你情绪深沉，情感强烈而持久。',
                '射手座': '你情绪乐观，喜欢通过探索来满足情感需求。',
                '摩羯座': '你情绪内敛，情感表达较为克制。',
                '水瓶座': '你情绪独立，需要自由的情感空间。',
                '双鱼座': '你情绪敏感，具有强烈的共情能力。'
            }
        };

        // 宫位含义
        this.houseMeanings = {
            '第一宫': '自我形象、个性、外表',
            '第二宫': '金钱、物质、价值观',
            '第三宫': '沟通、学习、兄弟姐妹',
            '第四宫': '家庭、根源、内心',
            '第五宫': '创造、恋爱、子女',
            '第六宫': '工作、健康、服务',
            '第七宫': '伴侣、合作、公开的敌人',
            '第八宫': '转变、共享资源、神秘',
            '第九宫': '哲学、高等教育、远行',
            '第十宫': '事业、社会地位、公众形象',
            '第十一宫': '朋友、团体、理想',
            '第十二宫': '潜意识、隐藏、灵性'
        };

        // 相位含义
        this.aspectMeanings = {
            '合相': '两颗行星能量融合，相互强化',
            '对相': '两颗行星形成对立，需要平衡',
            '三分相': '两颗行星和谐配合，带来幸运',
            '四分相': '两颗行星形成冲突，需要克服困难',
            '六分相': '两颗行星相互支持，带来机会'
        };
    }

    /**
     * 解析行星落座
     */
    interpretPlanetSigns(planets) {
        const interpretations = [];
        
        planets.forEach(planet => {
            const meaning = this.planetSignMeanings[planet.planet]?.[planet.sign];
            if (meaning) {
                interpretations.push({
                    planet: planet.planet,
                    symbol: planet.symbol,
                    sign: planet.sign,
                    position: planet.position,
                    meaning: meaning
                });
            } else {
                // 通用解读
                interpretations.push({
                    planet: planet.planet,
                    symbol: planet.symbol,
                    sign: planet.sign,
                    position: planet.position,
                    meaning: `${planet.planet}落在${planet.sign}，影响你的${this.getPlanetInfluence(planet.planet)}方面。`
                });
            }
        });
        
        return interpretations;
    }

    /**
     * 解析行星落宫
     */
    interpretPlanetHouses(planets, houses) {
        const interpretations = [];
        
        planets.forEach(planet => {
            // 找到行星所在的宫位
            const house = this.findPlanetHouse(planet.longitude, houses);
            if (house) {
                interpretations.push({
                    planet: planet.planet,
                    symbol: planet.symbol,
                    house: house.house,
                    houseNumber: house.houseNumber,
                    meaning: `${planet.planet}落在${house.house}，影响你的${this.houseMeanings[house.house]}。`
                });
            }
        });
        
        return interpretations;
    }

    /**
     * 找到行星所在的宫位
     */
    findPlanetHouse(planetLongitude, houses) {
        // 在等宫制中，每个宫位是30度
        // 找到行星所在的宫位（从宫位起点到下一个宫位起点之间）
        for (let i = 0; i < houses.length; i++) {
            const currentHouse = houses[i];
            const nextHouse = houses[(i + 1) % houses.length];
            
            let startLongitude = currentHouse.cuspLongitude;
            let endLongitude = nextHouse.cuspLongitude;
            
            // 处理跨越0度的情况
            if (endLongitude < startLongitude) {
                endLongitude += 360;
            }
            
            // 检查行星是否在这个宫位范围内
            let planetLng = planetLongitude;
            if (planetLng < startLongitude && startLongitude > 180) {
                planetLng += 360;
            }
            
            if (planetLng >= startLongitude && planetLng < endLongitude) {
                return currentHouse;
            }
        }
        
        // 如果没找到，返回第一个宫位（作为默认值）
        return houses[0];
    }

    /**
     * 解析相位
     */
    interpretAspects(aspects) {
        return aspects.map(aspect => ({
            ...aspect,
            meaning: `${aspect.planet1}与${aspect.planet2}形成${aspect.aspect}，${this.aspectMeanings[aspect.aspect] || '需要关注这两颗行星的互动。'}`
        }));
    }

    /**
     * 生成综合解读
     */
    generateSummary(chartData) {
        const planets = chartData.planets;
        const ascendant = chartData.ascendant;
        const aspects = chartData.aspects;
        
        let summary = `你的上升星座是${ascendant.sign}，这影响你的外在表现和第一印象。\n\n`;
        
        // 主要行星
        const sun = planets.find(p => p.planet === '太阳');
        const moon = planets.find(p => p.planet === '月亮');
        
        if (sun) {
            summary += `太阳落在${sun.sign}，代表你的核心自我和人生目标。`;
        }
        if (moon) {
            summary += `月亮落在${moon.sign}，代表你的情感需求和内在感受。`;
        }
        
        summary += `\n\n`;
        
        // 重要相位
        if (aspects.length > 0) {
            summary += `你的星盘中有${aspects.length}个重要相位，这些相位影响你的人格特质和人生经历。`;
            
            const majorAspects = aspects.filter(a => 
                ['合相', '对相', '三分相', '四分相'].includes(a.aspect)
            );
            if (majorAspects.length > 0) {
                summary += `其中${majorAspects.length}个是主要相位，对你的影响更为显著。`;
            }
        }
        
        return summary;
    }

    /**
     * 获取行星影响领域
     */
    getPlanetInfluence(planet) {
        const influences = {
            '太阳': '核心自我',
            '月亮': '情感需求',
            '水星': '思维沟通',
            '金星': '爱情审美',
            '火星': '行动意志',
            '木星': '幸运扩张',
            '土星': '责任限制',
            '天王星': '创新变革',
            '海王星': '灵感直觉',
            '冥王星': '转化重生'
        };
        return influences[planet] || '个人特质';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartInterpreter;
}
