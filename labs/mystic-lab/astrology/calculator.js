/**
 * 星盘计算模块
 * 负责计算行星位置、宫位、相位等
 */

class AstrologyCalculator {
    constructor() {
        this.planets = [
            { id: 0, name: '太阳', symbol: '☉', enName: 'Sun' },
            { id: 1, name: '月亮', symbol: '☽', enName: 'Moon' },
            { id: 2, name: '水星', symbol: '☿', enName: 'Mercury' },
            { id: 3, name: '金星', symbol: '♀', enName: 'Venus' },
            { id: 4, name: '火星', symbol: '♂', enName: 'Mars' },
            { id: 5, name: '木星', symbol: '♃', enName: 'Jupiter' },
            { id: 6, name: '土星', symbol: '♄', enName: 'Saturn' },
            { id: 7, name: '天王星', symbol: '♅', enName: 'Uranus' },
            { id: 8, name: '海王星', symbol: '♆', enName: 'Neptune' },
            { id: 9, name: '冥王星', symbol: '♇', enName: 'Pluto' }
        ];

        this.signs = [
            '白羊座', '金牛座', '双子座', '巨蟹座',
            '狮子座', '处女座', '天秤座', '天蝎座',
            '射手座', '摩羯座', '水瓶座', '双鱼座'
        ];

        this.houses = [
            '第一宫', '第二宫', '第三宫', '第四宫',
            '第五宫', '第六宫', '第七宫', '第八宫',
            '第九宫', '第十宫', '第十一宫', '第十二宫'
        ];
    }

    /**
     * 计算星盘数据
     * @param {Object} birthData - 出生信息
     * @param {string} birthData.date - 日期 (YYYY-MM-DD)
     * @param {string} birthData.time - 时间 (HH:MM)
     * @param {number} birthData.latitude - 纬度
     * @param {number} birthData.longitude - 经度
     * @param {string} birthData.timezone - 时区
     * @returns {Object} 星盘数据
     */
    async calculateChart(birthData) {
        try {
            // 解析日期时间
            const dateTime = this.parseDateTime(birthData.date, birthData.time, birthData.timezone);
            
            // 计算儒略日
            const julianDay = this.calculateJulianDay(dateTime);
            
            // 计算行星位置（简化版本，使用近似公式）
            const planetPositions = this.calculatePlanetPositions(julianDay);
            
            // 计算上升点（简化计算）
            const ascendant = this.calculateAscendant(dateTime, birthData.latitude, birthData.longitude);
            
            // 计算宫位
            const houses = this.calculateHouses(ascendant, birthData.latitude);
            
            // 计算相位
            const aspects = this.calculateAspects(planetPositions);
            
            return {
                planets: planetPositions,
                houses: houses,
                aspects: aspects,
                ascendant: ascendant,
                mc: this.calculateMC(ascendant)
            };
        } catch (error) {
            console.error('计算星盘时出错:', error);
            throw error;
        }
    }

    /**
     * 解析日期时间
     */
    parseDateTime(date, time, timezone) {
        const dateTimeStr = `${date}T${time}`;
        const dateObj = new Date(dateTimeStr);
        
        // 简单的时区处理（实际应该使用更精确的时区库）
        const timezoneOffset = this.getTimezoneOffset(timezone);
        const utcTime = dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000);
        const localTime = new Date(utcTime + (timezoneOffset * 3600000));
        
        return {
            year: localTime.getFullYear(),
            month: localTime.getMonth() + 1,
            day: localTime.getDate(),
            hour: localTime.getHours(),
            minute: localTime.getMinutes(),
            second: localTime.getSeconds()
        };
    }

    /**
     * 获取时区偏移（小时）
     */
    getTimezoneOffset(timezone) {
        // 支持数字格式（如 "8", "-5", "3.5"）
        if (typeof timezone === 'number') {
            return timezone;
        }
        if (typeof timezone === 'string') {
            const parsed = parseFloat(timezone);
            if (!isNaN(parsed)) {
                return parsed;
            }
        }

        // 保留旧的 IANA 名称映射作为兼容
        const offsets = {
            'Asia/Shanghai': 8,
            'Asia/Hong_Kong': 8,
            'Asia/Taipei': 8,
            'America/New_York': -5,
            'America/Los_Angeles': -8,
            'Europe/London': 0,
            'Europe/Paris': 1,
            'Asia/Tokyo': 9
        };
        return offsets[timezone] || 8;
    }

    /**
     * 计算儒略日（简化版本）
     */
    calculateJulianDay(dateTime) {
        const { year, month, day, hour, minute, second } = dateTime;
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        
        const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
            Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        
        const jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400;
        return jd;
    }

    /**
     * 计算行星位置（简化版本，使用近似公式）
     * 注意：这是简化版本，实际应该使用 Swiss Ephemeris 等专业库
     */
    calculatePlanetPositions(julianDay) {
        const positions = [];
        const daysSince2000 = julianDay - 2451545.0;
        
        this.planets.forEach((planet, index) => {
            // 简化的行星位置计算（仅用于演示）
            // 实际应该使用精确的天文计算
            let longitude;
            
            switch (index) {
                case 0: // 太阳
                    longitude = (280.4665 + 0.98564736 * daysSince2000) % 360;
                    break;
                case 1: // 月亮
                    longitude = (218.3165 + 13.176396 * daysSince2000) % 360;
                    break;
                case 2: // 水星
                    longitude = (252.2509 + 4.092334 * daysSince2000) % 360;
                    break;
                case 3: // 金星
                    longitude = (181.9798 + 1.6021 * daysSince2000) % 360;
                    break;
                case 4: // 火星
                    longitude = (355.433 + 0.524032 * daysSince2000) % 360;
                    break;
                case 5: // 木星
                    longitude = (34.3515 + 0.0830853 * daysSince2000) % 360;
                    break;
                case 6: // 土星
                    longitude = (50.0774 + 0.0334442 * daysSince2000) % 360;
                    break;
                case 7: // 天王星
                    longitude = (314.055 + 0.011769 * daysSince2000) % 360;
                    break;
                case 8: // 海王星
                    longitude = (304.3487 + 0.006027 * daysSince2000) % 360;
                    break;
                case 9: // 冥王星
                    longitude = (238.9583 + 0.004027 * daysSince2000) % 360;
                    break;
                default:
                    longitude = 0;
            }
            
            if (longitude < 0) longitude += 360;
            
            const signIndex = Math.floor(longitude / 30);
            const signDegree = longitude % 30;
            
            positions.push({
                planet: planet.name,
                symbol: planet.symbol,
                longitude: longitude,
                sign: this.signs[signIndex],
                signIndex: signIndex,
                degree: signDegree,
                position: `${Math.floor(signDegree)}°${Math.floor((signDegree % 1) * 60)}'`
            });
        });
        
        return positions;
    }

    /**
     * 计算上升点（简化版本）
     */
    calculateAscendant(dateTime, latitude, longitude) {
        // 简化的上升点计算
        // 实际应该使用更精确的算法
        const hour = dateTime.hour + dateTime.minute / 60;
        const dayOfYear = this.getDayOfYear(dateTime.year, dateTime.month, dateTime.day);
        
        // 简化的上升点计算（仅用于演示）
        let ascendantLongitude = (longitude + (hour - 12) * 15 + dayOfYear * 0.9856) % 360;
        if (ascendantLongitude < 0) ascendantLongitude += 360;
        
        const signIndex = Math.floor(ascendantLongitude / 30);
        const signDegree = ascendantLongitude % 30;
        
        return {
            longitude: ascendantLongitude,
            sign: this.signs[signIndex],
            signIndex: signIndex,
            degree: signDegree,
            position: `${Math.floor(signDegree)}°${Math.floor((signDegree % 1) * 60)}'`
        };
    }

    /**
     * 获取一年中的第几天
     */
    getDayOfYear(year, month, day) {
        const monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        return monthDays[month - 1] + day + (month > 2 && isLeap ? 1 : 0);
    }

    /**
     * 计算宫位（简化版本，使用等宫制）
     */
    calculateHouses(ascendant, latitude) {
        const houses = [];
        const ascendantLongitude = ascendant.longitude;
        
        // 等宫制：每个宫位30度
        for (let i = 0; i < 12; i++) {
            const cuspLongitude = (ascendantLongitude + i * 30) % 360;
            const signIndex = Math.floor(cuspLongitude / 30);
            const signDegree = cuspLongitude % 30;
            
            houses.push({
                house: this.houses[i],
                houseNumber: i + 1,
                cuspLongitude: cuspLongitude,
                sign: this.signs[signIndex],
                signIndex: signIndex,
                degree: signDegree
            });
        }
        
        return houses;
    }

    /**
     * 计算天顶（MC）
     */
    calculateMC(ascendant) {
        const mcLongitude = (ascendant.longitude + 90) % 360;
        const signIndex = Math.floor(mcLongitude / 30);
        const signDegree = mcLongitude % 30;
        
        return {
            longitude: mcLongitude,
            sign: this.signs[signIndex],
            signIndex: signIndex,
            degree: signDegree
        };
    }

    /**
     * 计算相位
     */
    calculateAspects(planetPositions) {
        const aspects = [];
        const aspectOrbs = {
            'conjunction': 8,    // 合相
            'opposition': 8,     // 对相
            'trine': 8,          // 三分相
            'square': 8,         // 四分相
            'sextile': 6         // 六分相
        };
        
        for (let i = 0; i < planetPositions.length; i++) {
            for (let j = i + 1; j < planetPositions.length; j++) {
                const planet1 = planetPositions[i];
                const planet2 = planetPositions[j];
                
                let angle = Math.abs(planet1.longitude - planet2.longitude);
                if (angle > 180) angle = 360 - angle;
                
                // 检查各种相位
                if (Math.abs(angle - 0) <= aspectOrbs.conjunction) {
                    aspects.push({
                        planet1: planet1.planet,
                        planet2: planet2.planet,
                        aspect: '合相',
                        angle: angle.toFixed(2),
                        orb: (angle - 0).toFixed(2)
                    });
                } else if (Math.abs(angle - 180) <= aspectOrbs.opposition) {
                    aspects.push({
                        planet1: planet1.planet,
                        planet2: planet2.planet,
                        aspect: '对相',
                        angle: angle.toFixed(2),
                        orb: (angle - 180).toFixed(2)
                    });
                } else if (Math.abs(angle - 120) <= aspectOrbs.trine) {
                    aspects.push({
                        planet1: planet1.planet,
                        planet2: planet2.planet,
                        aspect: '三分相',
                        angle: angle.toFixed(2),
                        orb: (angle - 120).toFixed(2)
                    });
                } else if (Math.abs(angle - 90) <= aspectOrbs.square) {
                    aspects.push({
                        planet1: planet1.planet,
                        planet2: planet2.planet,
                        aspect: '四分相',
                        angle: angle.toFixed(2),
                        orb: (angle - 90).toFixed(2)
                    });
                } else if (Math.abs(angle - 60) <= aspectOrbs.sextile) {
                    aspects.push({
                        planet1: planet1.planet,
                        planet2: planet2.planet,
                        aspect: '六分相',
                        angle: angle.toFixed(2),
                        orb: (angle - 60).toFixed(2)
                    });
                }
            }
        }
        
        return aspects;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AstrologyCalculator;
}
