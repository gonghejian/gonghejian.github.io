/**
 * 易经起卦模块
 * 支持时间起卦、数字起卦、手动起卦
 */

class IChingDivination {
    constructor() {
        this.yaoSymbols = {
            0: { name: '阴', symbol: '⚋', value: 2 },
            1: { name: '阳', symbol: '⚊', value: 3 }
        };
    }

    /**
     * 时间起卦
     * @param {Date} date - 日期时间
     * @param {string} question - 问题（可选）
     * @returns {Object} 卦象数据
     */
    timeDivination(date = new Date(), question = '') {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        
        // 上卦：年+月+日，除以8取余
        const upperNumber = (year + month + day) % 8;
        const upperHex = upperNumber === 0 ? 8 : upperNumber;
        
        // 下卦：年+月+日+时，除以8取余
        const lowerNumber = (year + month + day + hour) % 8;
        const lowerHex = lowerNumber === 0 ? 8 : lowerNumber;
        
        // 动爻：年+月+日+时，除以6取余
        const movingLineNumber = (year + month + day + hour) % 6;
        const movingLine = movingLineNumber === 0 ? 6 : movingLineNumber;
        
        return this.generateHexagram(upperHex, lowerHex, movingLine, question, 'time');
    }

    /**
     * 数字起卦
     * @param {number} num1 - 第一个数字
     * @param {number} num2 - 第二个数字
     * @param {string} question - 问题（可选）
     * @returns {Object} 卦象数据
     */
    numberDivination(num1, num2, question = '') {
        // 上卦：第一个数字除以8取余
        const upperNumber = num1 % 8;
        const upperHex = upperNumber === 0 ? 8 : upperNumber;
        
        // 下卦：第二个数字除以8取余
        const lowerNumber = num2 % 8;
        const lowerHex = lowerNumber === 0 ? 8 : lowerNumber;
        
        // 动爻：两个数字之和除以6取余
        const movingLineNumber = (num1 + num2) % 6;
        const movingLine = movingLineNumber === 0 ? 6 : movingLineNumber;
        
        return this.generateHexagram(upperHex, lowerHex, movingLine, question, 'number');
    }

    /**
     * 手动起卦（三枚硬币）
     * @param {Array} coinResults - 硬币结果数组，6个元素，每个元素是3次投掷的结果
     *                              每个结果是一个数组，包含3个数字：0（反面）或1（正面）
     * @param {string} question - 问题（可选）
     * @returns {Object} 卦象数据
     */
    coinDivination(coinResults, question = '') {
        if (!coinResults || coinResults.length !== 6) {
            throw new Error('需要6次投掷结果，每次投掷3枚硬币');
        }
        
        const lines = [];
        let movingLine = null;
        
        // 从下往上（初爻到上爻）
        for (let i = 0; i < 6; i++) {
            const throws = coinResults[i];
            if (!throws || throws.length !== 3) {
                throw new Error(`第${i + 1}次投掷结果不完整`);
            }
            
            // 计算正面数（1的个数）
            const heads = throws.filter(t => t === 1).length;
            
            // 0个正面 = 老阴（变爻）
            // 1个正面 = 少阳
            // 2个正面 = 少阴
            // 3个正面 = 老阳（变爻）
            let lineValue;
            if (heads === 0) {
                lineValue = 0; // 老阴，变爻
                movingLine = i + 1;
            } else if (heads === 1) {
                lineValue = 1; // 少阳
            } else if (heads === 2) {
                lineValue = 0; // 少阴
            } else { // heads === 3
                lineValue = 1; // 老阳，变爻
                movingLine = i + 1;
            }
            
            lines.push(lineValue);
        }
        
        // 如果没有变爻，使用第6爻作为动爻
        if (movingLine === null) {
            movingLine = 6;
        }
        
        // 计算上下卦
        const upperHex = this.linesToHexagramNumber(lines.slice(3, 6));
        const lowerHex = this.linesToHexagramNumber(lines.slice(0, 3));
        
        return this.generateHexagram(upperHex, lowerHex, movingLine, question, 'coin', lines);
    }

    /**
     * 生成卦象数据
     */
    generateHexagram(upperHex, lowerHex, movingLine, question, method, lines = null) {
        // 计算本卦数（下卦 + 上卦 * 8）
        const originalNumber = (lowerHex - 1) + (upperHex - 1) * 8 + 1;
        
        // 计算变卦
        let changedLines = null;
        let changedNumber = null;
        if (lines) {
            changedLines = [...lines];
            // 变爻：老阴变阳，老阳变阴
            changedLines[movingLine - 1] = changedLines[movingLine - 1] === 0 ? 1 : 0;
            const changedUpperHex = this.linesToHexagramNumber(changedLines.slice(3, 6));
            const changedLowerHex = this.linesToHexagramNumber(changedLines.slice(0, 3));
            changedNumber = (changedLowerHex - 1) + (changedUpperHex - 1) * 8 + 1;
        }
        
        // 计算互卦（本卦的2、3、4爻作为下卦，3、4、5爻作为上卦）
        let mutualNumber = null;
        if (lines) {
            const mutualLower = this.linesToHexagramNumber([lines[1], lines[2], lines[3]]);
            const mutualUpper = this.linesToHexagramNumber([lines[2], lines[3], lines[4]]);
            mutualNumber = (mutualLower - 1) + (mutualUpper - 1) * 8 + 1;
        }
        
        return {
            question: question,
            method: method,
            original: {
                number: originalNumber,
                upperHex: upperHex,
                lowerHex: lowerHex,
                lines: lines || this.hexagramToLines(upperHex, lowerHex)
            },
            changed: changedNumber ? {
                number: changedNumber,
                lines: changedLines
            } : null,
            mutual: mutualNumber ? {
                number: mutualNumber
            } : null,
            movingLine: movingLine
        };
    }

    /**
     * 将三爻转换为卦数（1-8）
     */
    linesToHexagramNumber(lines) {
        let number = 0;
        for (let i = 0; i < 3; i++) {
            if (lines[i] === 1) {
                number += Math.pow(2, i);
            }
        }
        return number + 1;
    }

    /**
     * 将卦数转换为三爻
     */
    hexagramToLines(upperHex, lowerHex) {
        const lines = [];
        
        // 下卦（初、二、三爻）
        const lowerNumber = lowerHex - 1;
        for (let i = 0; i < 3; i++) {
            lines.push((lowerNumber & Math.pow(2, i)) ? 1 : 0);
        }
        
        // 上卦（四、五、上爻）
        const upperNumber = upperHex - 1;
        for (let i = 0; i < 3; i++) {
            lines.push((upperNumber & Math.pow(2, i)) ? 1 : 0);
        }
        
        return lines;
    }

    /**
     * 生成卦象可视化文本
     */
    visualizeHexagram(lines) {
        const symbols = lines.map(line => 
            line === 1 ? '⚊' : '⚋'
        );
        return symbols.reverse().join('\n'); // 从上往下显示
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IChingDivination;
}
