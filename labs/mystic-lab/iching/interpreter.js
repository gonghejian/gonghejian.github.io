/**
 * 易经解卦模块
 * 提供卦辞、爻辞解读
 */

class IChingInterpreter {
    constructor() {
        // 这里可以扩展更多的解读内容
    }

    /**
     * 解卦
     * @param {Object} divinationResult - 起卦结果
     * @param {Object} hexagramData - 卦的数据
     * @returns {Object} 解卦结果
     */
    interpret(divinationResult, hexagramData) {
        const interpretation = {
            question: divinationResult.question || '未提供问题',
            method: this.getMethodName(divinationResult.method),
            original: {
                hexagram: hexagramData,
                interpretation: this.interpretHexagram(hexagramData, divinationResult.movingLine)
            },
            changed: null,
            mutual: null,
            summary: ''
        };

        // 如果有变卦
        if (divinationResult.changed) {
            // 这里应该获取变卦的数据
            interpretation.changed = {
                number: divinationResult.changed.number,
                interpretation: '变卦解读待补充'
            };
        }

        // 如果有互卦
        if (divinationResult.mutual) {
            interpretation.mutual = {
                number: divinationResult.mutual.number,
                interpretation: '互卦解读待补充'
            };
        }

        // 生成综合解读
        interpretation.summary = this.generateSummary(interpretation, divinationResult);

        return interpretation;
    }

    /**
     * 解读单个卦
     */
    interpretHexagram(hexagramData, movingLine) {
        if (!hexagramData) {
            return '卦数据不完整';
        }

        let interpretation = `【${hexagramData.name}卦】\n\n`;
        interpretation += `卦辞：${hexagramData.guaci}\n`;
        interpretation += `含义：${hexagramData.guaciMeaning}\n\n`;

        if (movingLine && hexagramData.yaoci) {
            const movingYao = hexagramData.yaoci.find(yao => yao.line === movingLine);
            if (movingYao) {
                interpretation += `【动爻】\n`;
                interpretation += `${movingYao.text}\n`;
                interpretation += `解读：${movingYao.meaning}\n\n`;
            }
        }

        interpretation += `【整体解读】\n`;
        interpretation += `${hexagramData.description}\n`;

        return interpretation;
    }

    /**
     * 生成综合解读
     */
    generateSummary(interpretation, divinationResult) {
        let summary = `你通过${interpretation.method}起卦，得到${interpretation.original.hexagram.name}卦。\n\n`;
        
        summary += `本卦${interpretation.original.hexagram.name}卦的卦辞是：${interpretation.original.hexagram.guaciMeaning}\n\n`;
        
        if (divinationResult.movingLine) {
            summary += `动爻在第${divinationResult.movingLine}爻，这是你当前需要重点关注的变化点。\n\n`;
        }
        
        if (interpretation.changed) {
            summary += `变卦为第${interpretation.changed.number}卦，代表事情的发展方向。\n\n`;
        }
        
        summary += `建议：根据卦象的指引，保持正固的态度，顺应自然规律，做出明智的决策。`;

        return summary;
    }

    /**
     * 获取起卦方法名称
     */
    getMethodName(method) {
        const methods = {
            'time': '时间起卦',
            'number': '数字起卦',
            'coin': '手动起卦（三枚硬币）'
        };
        return methods[method] || '未知方法';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IChingInterpreter;
}
