/**
 * 农历转换模块
 * 支持 1900-2100 年公历与农历互转
 * 无外部依赖，纯前端实现
 */

class LunarCalendar {
    constructor() {
        // 农历数据：1900-2100年
        // 每个元素为16进制，格式：0x0LDDD，L=闰月月份(0无闰月)，DDD=12-13个月的大小月信息
        // 大月30天，小月29天
        this.lunarInfo = [
            0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
            0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
            0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
            0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
            0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
            0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
            0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
            0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
            0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
            0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
            0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
            0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
            0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
            0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
            0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
            0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
            0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
            0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
            0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
            0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
            0x0d520,0x0dd40,0x06b64,0x0ada0,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,0x0e968,
            0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,0x0d520
        ];

        // 天干
        this.tianGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
        // 地支
        this.diZhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        // 生肖
        this.zodiac = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
        // 农历月份名称
        this.lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
        // 农历日期名称
        this.lunarDays = [
            '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
            '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
            '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
        ];
    }

    /**
     * 判断某年是否为闰年
     */
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * 获取某年农历信息
     */
    getLunarYearInfo(year) {
        const index = year - 1900;
        if (index < 0 || index >= this.lunarInfo.length) {
            throw new Error('年份超出支持范围（1900-2100）');
        }
        return this.lunarInfo[index];
    }

    /**
     * 解析农历年数据
     * @returns {Object} { leapMonth: 闰月月份(0=无), monthDays: 每月天数数组 }
     */
    parseLunarYear(year) {
        const info = this.getLunarYearInfo(year);
        const leapMonth = info & 0x0f; // 低4位为闰月
        const monthData = info >> 4; // 高位为月份大小信息
        const monthDays = [];
        for (let i = 0; i < 12; i++) {
            monthDays.push((monthData & (1 << i)) ? 30 : 29);
        }
        const hasLeap = leapMonth > 0;
        const leapDays = hasLeap ? ((monthData & (1 << 12)) ? 30 : 29) : 0;
        return { leapMonth, monthDays, hasLeap, leapDays };
    }

    /**
     * 公历转农历
     * @param {number} year 公历年
     * @param {number} month 公历月 (1-12)
     * @param {number} day 公历日
     * @returns {Object} 农历信息
     */
    solarToLunar(year, month, day) {
        // 验证范围
        if (year < 1900 || year > 2100) {
            throw new Error('年份超出支持范围（1900-2100）');
        }

        // 计算从1900年1月31日（农历1900年正月初一）到目标日期的天数
        const baseDate = new Date(1900, 0, 31); // 1900-01-31
        const targetDate = new Date(year, month - 1, day);
        let offset = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));

        // 逐年推算农历年
        let lunarYear = 1900;
        while (lunarYear <= 2100) {
            const yearInfo = this.parseLunarYear(lunarYear);
            let yearDays = yearInfo.monthDays.reduce((a, b) => a + b, 0);
            if (yearInfo.hasLeap) {
                yearDays += yearInfo.leapDays;
            }
            if (offset < yearDays) {
                break;
            }
            offset -= yearDays;
            lunarYear++;
        }

        // 推算农历月
        const yearInfo = this.parseLunarYear(lunarYear);
        let lunarMonth = 1;
        let isLeapMonth = false;

        for (let i = 0; i < 12; i++) {
            const monthDays = yearInfo.monthDays[i];
            if (offset < monthDays) {
                lunarMonth = i + 1;
                break;
            }
            offset -= monthDays;

            // 检查闰月
            if (yearInfo.hasLeap && yearInfo.leapMonth === i + 1) {
                if (offset < yearInfo.leapDays) {
                    lunarMonth = i + 1;
                    isLeapMonth = true;
                    break;
                }
                offset -= yearInfo.leapDays;
            }
            lunarMonth = i + 2;
        }

        // 处理年末闰月的情况
        if (yearInfo.hasLeap && yearInfo.leapMonth === 12 && offset >= yearInfo.monthDays[11]) {
            offset -= yearInfo.monthDays[11];
            if (offset < yearInfo.leapDays) {
                lunarMonth = 12;
                isLeapMonth = true;
            }
        }

        const lunarDay = offset + 1;

        // 计算干支纪年
        const ganZhiYear = this.getGanZhiYear(lunarYear);
        const ganZhiMonth = this.getGanZhiMonth(lunarYear, lunarMonth);
        const ganZhiDay = this.getGanZhiDay(year, month, day);

        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeap: isLeapMonth,
            ganZhiYear,
            ganZhiMonth,
            ganZhiDay,
            zodiac: this.zodiac[(lunarYear - 4) % 12],
            monthName: (isLeapMonth ? '闰' : '') + this.lunarMonths[lunarMonth - 1] + '月',
            dayName: this.lunarDays[lunarDay - 1] || '初' + lunarDay
        };
    }

    /**
     * 农历转公历
     * @param {number} year 农历年
     * @param {number} month 农历月 (1-12)
     * @param {number} day 农历日
     * @param {boolean} isLeap 是否为闰月
     * @returns {Object} 公历日期 {year, month, day}
     */
    lunarToSolar(year, month, day, isLeap = false) {
        if (year < 1900 || year > 2100) {
            throw new Error('年份超出支持范围（1900-2100）');
        }

        let offset = 0;
        // 累加之前所有年的天数
        for (let y = 1900; y < year; y++) {
            const info = this.parseLunarYear(y);
            let days = info.monthDays.reduce((a, b) => a + b, 0);
            if (info.hasLeap) days += info.leapDays;
            offset += days;
        }

        // 累加当年之前月份的天数
        const yearInfo = this.parseLunarYear(year);
        for (let m = 1; m < month; m++) {
            offset += yearInfo.monthDays[m - 1];
            if (yearInfo.hasLeap && yearInfo.leapMonth === m) {
                offset += yearInfo.leapDays;
            }
        }

        // 处理目标月为闰月的情况
        if (isLeap) {
            offset += yearInfo.monthDays[month - 1];
        }

        offset += day - 1;

        // 从1900年1月31日加上偏移量
        const baseDate = new Date(1900, 0, 31);
        const targetDate = new Date(baseDate.getTime() + offset * 24 * 60 * 60 * 1000);

        return {
            year: targetDate.getFullYear(),
            month: targetDate.getMonth() + 1,
            day: targetDate.getDate()
        };
    }

    /**
     * 获取干支纪年
     */
    getGanZhiYear(year) {
        const gan = (year - 4) % 10;
        const zhi = (year - 4) % 12;
        return this.tianGan[gan] + this.diZhi[zhi];
    }

    /**
     * 获取干支纪月
     */
    getGanZhiMonth(year, month) {
        const gan = (year * 12 + month + 12) % 10;
        const zhi = (month + 1) % 12;
        return this.tianGan[gan] + this.diZhi[zhi];
    }

    /**
     * 获取干支纪日
     */
    getGanZhiDay(year, month, day) {
        const date = new Date(year, month - 1, day);
        const baseDate = new Date(1900, 0, 31);
        const offset = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
        const gan = (offset + 40) % 10;
        const zhi = (offset + 16) % 12;
        return this.tianGan[gan] + this.diZhi[zhi];
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LunarCalendar;
}
