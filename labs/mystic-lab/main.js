/**
 * 主逻辑文件
 * 处理用户交互和页面逻辑
 */

// 初始化
let calculator;
let renderer;
let interpreter;
let divination;
let ichingInterpreter;
let recommender;
let transitCalculator;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化组件
    calculator = new AstrologyCalculator();
    renderer = new ChartRenderer('chart-canvas');
    interpreter = new ChartInterpreter();
    recommender = new ChartRecommender();
    transitCalculator = new TransitCalculator();
    divination = new IChingDivination();
    ichingInterpreter = new IChingInterpreter();

    // 标签页切换
    setupTabs();

    // 省市区级联
    initRegionCascades();

    // 设为当前时间
    setupCurrentTimeLink();

    // 高级设置折叠面板
    setupAccordion();

    // 表单提交
    setupForm();

    // 解析结果标签页切换
    setupInterpretationTabs();

    // 易经功能
    setupIChing();

    // 尝试加载保存的数据
    loadSavedData();
});

/**
 * 设置标签页切换
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新内容显示
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * 设置表单提交
 */
function setupForm() {
    const form = document.getElementById('birth-form');
    const generateBtn = document.getElementById('generate-chart-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 读取所有字段
        const nickName = document.getElementById('nick-name').value.trim();
        const sex = document.querySelector('input[name="sex"]:checked')?.value;
        let birthDate = document.getElementById('birth-date').value;
        let birthTime = document.getElementById('birth-time').value;
        const isLunar = document.getElementById('is-lunar-date').checked;
        const isDst = document.getElementById('is-dst').checked;
        const province = document.getElementById('province').value;
        const city = document.getElementById('city').value;
        const district = document.getElementById('district').value;
        const timezone = document.getElementById('timezone').value;
        const houseSystem = document.getElementById('house-system').value;
        const orbSetting = document.getElementById('orb-setting').value;

        // 农历日期转换为公历
        if (isLunar && birthDate) {
            const [year, month, day] = birthDate.split('-').map(Number);
            try {
                const lunar = new LunarCalendar();
                const solar = lunar.lunarToSolar(year, month, day);
                birthDate = `${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`;
            } catch (e) {
                alert('农历日期转换失败：' + e.message);
                return;
            }
        }

        if (!birthDate || !birthTime) {
            alert('请填写完整的出生日期和时间');
            return;
        }
        if (!province || !city || !district) {
            alert('请选择完整的出生城市（省、市、区县）');
            return;
        }

        // 夏令时处理：输入时间减 1 小时得到标准时间
        if (isDst && birthTime) {
            const [h, m] = birthTime.split(':').map(Number);
            let adjustedH = h - 1;
            let adjustedDate = birthDate;
            if (adjustedH < 0) {
                adjustedH += 24;
                const d = new Date(adjustedDate);
                d.setDate(d.getDate() - 1);
                adjustedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            }
            birthTime = `${String(adjustedH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            birthDate = adjustedDate;
        }

        // 获取坐标：优先从区县选项的 data 属性读取
        let coordinates = null;
        const districtSelect = document.getElementById('district');
        const selectedOption = districtSelect.options[districtSelect.selectedIndex];
        if (selectedOption && selectedOption.dataset.lat && selectedOption.dataset.lng) {
            coordinates = {
                lat: parseFloat(selectedOption.dataset.lat),
                lng: parseFloat(selectedOption.dataset.lng)
            };
        }

        // 如果未找到，回退到城市名匹配
        if (!coordinates) {
            const citySelect = document.getElementById('city');
            const cityName = citySelect.options[citySelect.selectedIndex]?.text || '';
            try {
                coordinates = await getCoordinates(cityName);
            } catch (e) {
                console.warn('无法从城市名获取坐标:', e);
            }
        }

        if (!coordinates) {
            alert('无法获取所选城市的坐标，请重新选择');
            return;
        }

        // 显示加载状态
        generateBtn.textContent = '计算中...';
        generateBtn.disabled = true;

        try {
            const birthData = {
                nickName,
                sex,
                date: birthDate,
                time: birthTime,
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                timezone: timezone,
                houseSystem: houseSystem,
                orb: parseInt(orbSetting, 10)
            };

            const chartData = await calculator.calculateChart(birthData);

            if (!chartData || !chartData.planets || !chartData.houses) {
                throw new Error('星盘计算失败，返回数据不完整');
            }

            saveData(birthData, chartData);

            try {
                renderer.drawChart(chartData);
            } catch (drawError) {
                console.error('绘制星盘时出错:', drawError);
                throw new Error('绘制星盘失败: ' + drawError.message);
            }

            document.getElementById('chart-section').style.display = 'block';
            document.getElementById('interpretation-section').style.display = 'block';

            generateInterpretations(chartData);

            document.getElementById('chart-section').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('生成星盘时出错:', error);
            console.error('错误堆栈:', error.stack);
            alert('生成星盘时出错: ' + error.message + '\n\n请检查控制台获取更多信息。');
        } finally {
            generateBtn.textContent = '查看星盘报告';
            generateBtn.disabled = false;
        }
    });
}

/**
 * 初始化省市区级联选择器
 */
function initRegionCascades() {
    if (typeof REGION_DATA === 'undefined') {
        console.error('REGION_DATA 未加载，级联选择器初始化失败');
        return;
    }

    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');

    if (!provinceSelect || !citySelect || !districtSelect) return;

    // 填充省份
    REGION_DATA.provinces.forEach(p => {
        const option = document.createElement('option');
        option.value = p.code;
        option.textContent = p.name;
        provinceSelect.appendChild(option);
    });

    // 省份切换 → 填充城市
    provinceSelect.addEventListener('change', () => {
        citySelect.innerHTML = '<option value="">选择城市</option>';
        districtSelect.innerHTML = '<option value="">选择区县</option>';
        const provinceCode = provinceSelect.value;
        if (!provinceCode || !REGION_DATA.cities[provinceCode]) return;

        REGION_DATA.cities[provinceCode].forEach(c => {
            const option = document.createElement('option');
            option.value = c.code;
            option.textContent = c.name;
            citySelect.appendChild(option);
        });
    });

    // 城市切换 → 填充区县
    citySelect.addEventListener('change', () => {
        districtSelect.innerHTML = '<option value="">选择区县</option>';
        const cityCode = citySelect.value;
        if (!cityCode || !REGION_DATA.districts[cityCode]) return;

        REGION_DATA.districts[cityCode].forEach(d => {
            const option = document.createElement('option');
            option.value = d.code;
            option.textContent = d.name;
            option.dataset.lat = d.lat;
            option.dataset.lng = d.lng;
            districtSelect.appendChild(option);
        });
    });
}

/**
 * 设置“设为当前时间”链接
 */
function setupCurrentTimeLink() {
    const link = document.getElementById('set-current-time');
    if (!link) return;

    link.addEventListener('click', (e) => {
        e.preventDefault();
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        document.getElementById('birth-date').value = `${year}-${month}-${day}`;
        document.getElementById('birth-time').value = `${hours}:${minutes}`;
    });
}

/**
 * 设置高级设置折叠面板
 */
function setupAccordion() {
    const toggle = document.getElementById('adv-settings-toggle');
    const content = document.getElementById('adv-settings-content');
    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        content.classList.toggle('active');
    });
}

/**
 * 获取地点坐标（简化版本）
 * 实际应该使用地理编码API，如 Google Geocoding API 或 OpenStreetMap Nominatim
 */
async function getCoordinates(location) {
    // 合并外部数据库和本地补充数据
    const cityCoordinates = {
        ...(typeof CITY_DATABASE !== 'undefined' ? CITY_DATABASE : {})
    };
    
    // 清理输入：去除空格和常见后缀
    const cleanLocation = location.trim().replace(/[市县区省]$/g, '');
    
    // 尝试精确匹配
    if (cityCoordinates[location]) {
        return cityCoordinates[location];
    }
    
    // 尝试清理后的精确匹配
    if (cityCoordinates[cleanLocation]) {
        return cityCoordinates[cleanLocation];
    }
    
    // 尝试模糊匹配（优先匹配更长的城市名）
    const sortedCities = Object.keys(cityCoordinates).sort((a, b) => b.length - a.length);
    
    for (const city of sortedCities) {
        // 如果输入包含城市名，或者城市名包含输入（去除后缀后）
        if (location.includes(city) || city.includes(cleanLocation)) {
            return cityCoordinates[city];
        }
    }
    
    // 如果找不到，抛出错误
    const cityList = Object.keys(cityCoordinates).slice(0, 15).join('、');
    throw new Error(`无法找到城市 "${location}" 的坐标。\n\n支持的城市包括：${cityList}等。\n请尝试输入这些城市名称，或输入省份名称。`);
}

/**
 * 星座中文名到英文key的映射
 */
const SIGN_NAME_MAP = {
    '白羊座': 'aries', '金牛座': 'taurus', '双子座': 'gemini',
    '巨蟹座': 'cancer', '狮子座': 'leo', '处女座': 'virgo',
    '天秤座': 'libra', '天蝎座': 'scorpio', '射手座': 'sagittarius',
    '摩羯座': 'capricorn', '水瓶座': 'aquarius', '双鱼座': 'pisces'
};

/**
 * 生成解析内容
 */
function generateInterpretations(chartData) {
    // 行星落座
    const planetSigns = interpreter.interpretPlanetSigns(chartData.planets);
    displayPlanetSigns(planetSigns);

    // 行星落宫
    const planetHouses = interpreter.interpretPlanetHouses(chartData.planets, chartData.houses);
    displayPlanetHouses(planetHouses);

    // 相位
    const aspects = interpreter.interpretAspects(chartData.aspects);
    displayAspects(aspects);

    // 综合解读
    const summary = interpreter.generateSummary(chartData);
    displaySummary(summary);

    // 人生建议
    const lifeAdvice = interpreter.generateLifeAdvice(chartData);
    displayLifeAdvice(lifeAdvice);

    // 文化推荐
    const sun = chartData.planets.find(p => p.planet === '太阳');
    const moon = chartData.planets.find(p => p.planet === '月亮');
    const ascendantSign = chartData.ascendant ? chartData.ascendant.sign : null;
    const recommendationData = {
        sunSign: sun ? SIGN_NAME_MAP[sun.sign] : null,
        moonSign: moon ? SIGN_NAME_MAP[moon.sign] : null,
        ascendantSign: ascendantSign ? SIGN_NAME_MAP[ascendantSign] : null
    };
    try {
        const recommendations = recommender.generateRecommendations(recommendationData);
        displayRecommendations(recommendations);
    } catch (e) {
        console.error('生成推荐失败:', e);
        document.getElementById('recommendations-content').innerHTML = '<p>推荐生成失败，请重试。</p>';
    }

    // 未来三年运势
    try {
        const currentYear = new Date().getFullYear();
        const forecasts = transitCalculator.generateYearlyForecast(chartData, currentYear);
        displayTransitForecasts(forecasts);
    } catch (e) {
        console.error('生成运势失败:', e);
        document.getElementById('transit-content').innerHTML = '<p>运势生成失败，请重试。</p>';
    }
}

/**
 * 显示行星落座
 */
function displayPlanetSigns(planetSigns) {
    const container = document.getElementById('planets-content');
    container.innerHTML = '';
    
    planetSigns.forEach(item => {
        const div = document.createElement('div');
        div.className = 'planet-item';
        div.innerHTML = `
            <h3>${item.symbol} ${item.planet} 落在 ${item.sign} ${item.position}</h3>
            <p>${item.meaning}</p>
        `;
        container.appendChild(div);
    });
}

/**
 * 显示行星落宫
 */
function displayPlanetHouses(planetHouses) {
    const container = document.getElementById('houses-content');
    container.innerHTML = '';
    
    planetHouses.forEach(item => {
        const div = document.createElement('div');
        div.className = 'house-item';
        div.innerHTML = `
            <h3>${item.symbol} ${item.planet} 落在 ${item.house}</h3>
            <p>${item.meaning}</p>
        `;
        container.appendChild(div);
    });
}

/**
 * 显示相位
 */
function displayAspects(aspects) {
    const container = document.getElementById('aspects-content');
    container.innerHTML = '';
    
    if (aspects.length === 0) {
        container.innerHTML = '<p>当前星盘中未发现主要相位。</p>';
        return;
    }
    
    aspects.forEach(item => {
        const div = document.createElement('div');
        div.className = 'aspect-item';
        div.innerHTML = `
            <h3>${item.planet1} ${item.aspect} ${item.planet2}</h3>
            <p>角度: ${item.angle}° | 容许度: ${item.orb}°</p>
            <p>${item.meaning}</p>
        `;
        container.appendChild(div);
    });
}

/**
 * 显示综合解读
 */
function displaySummary(summary) {
    const container = document.getElementById('summary-content');
    container.innerHTML = `<p style="white-space: pre-line; line-height: 1.8;">${summary}</p>`;
}

/**
 * 显示人生建议
 */
function displayLifeAdvice(advice) {
    const container = document.getElementById('advice-content');
    container.innerHTML = '';

    const sections = [
        { key: 'career', title: '职业发展建议' },
        { key: 'love', title: '情感关系建议' },
        { key: 'growth', title: '个人成长建议' }
    ];

    sections.forEach(section => {
        const div = document.createElement('div');
        div.className = 'planet-item';
        div.innerHTML = `
            <h3>${section.title}</h3>
            <p style="white-space: pre-line; line-height: 1.8;">${advice[section.key] || '暂无建议'}</p>
        `;
        container.appendChild(div);
    });
}

/**
 * 显示文化推荐
 */
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-content');
    container.innerHTML = '';

    // 书籍推荐
    if (recommendations.books && recommendations.books.length > 0) {
        const booksDiv = document.createElement('div');
        booksDiv.className = 'planet-item';
        let booksHtml = '<h3>推荐书籍</h3>';
        recommendations.books.forEach(book => {
            booksHtml += `<p><strong>${book.title}</strong> — ${book.author}<br/>${book.reason}</p>`;
        });
        booksDiv.innerHTML = booksHtml;
        container.appendChild(booksDiv);
    }

    // 电影推荐
    if (recommendations.movies && recommendations.movies.length > 0) {
        const moviesDiv = document.createElement('div');
        moviesDiv.className = 'planet-item';
        let moviesHtml = '<h3>推荐电影</h3>';
        recommendations.movies.forEach(movie => {
            moviesHtml += `<p><strong>${movie.title}</strong>（${movie.year}）— ${movie.director}<br/>${movie.reason}</p>`;
        });
        moviesDiv.innerHTML = moviesHtml;
        container.appendChild(moviesDiv);
    }

    // 佩戴建议
    const accessoryDiv = document.createElement('div');
    accessoryDiv.className = 'planet-item';
    accessoryDiv.innerHTML = `
        <h3>佩戴与色彩建议</h3>
        <p><strong>主水晶：</strong>${recommendations.crystals.primary.name} — ${recommendations.crystals.primary.description}</p>
        <p><strong>辅助水晶：</strong>${recommendations.crystals.secondary.name} — ${recommendations.crystals.secondary.description}</p>
        <p><strong>幸运色：</strong>${recommendations.colors.lucky.name} — ${recommendations.colors.lucky.description}</p>
        <p><strong>日常色：</strong>${recommendations.colors.daily.name} — ${recommendations.colors.daily.description}</p>
        <p><strong>推荐材质：</strong>${recommendations.material.material} — ${recommendations.material.description}</p>
    `;
    container.appendChild(accessoryDiv);

    // 综合总结
    if (recommendations.summary) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'aspect-item';
        summaryDiv.innerHTML = `<h3>综合推荐语</h3><p style="white-space: pre-line; line-height: 1.8;">${recommendations.summary}</p>`;
        container.appendChild(summaryDiv);
    }
}

/**
 * 显示未来三年运势
 */
function displayTransitForecasts(forecasts) {
    const container = document.getElementById('transit-content');
    container.innerHTML = '';

    if (!forecasts || forecasts.length === 0) {
        container.innerHTML = '<p>运势数据生成失败。</p>';
        return;
    }

    forecasts.forEach((forecast, index) => {
        const yearDiv = document.createElement('div');
        yearDiv.className = 'planet-item';
        yearDiv.style.marginBottom = '20px';

        let html = `<h3>${forecast.year}年运势</h3>`;
        html += `<p><strong>年度主题：</strong>${forecast.theme || '平稳发展的一年'}</p>`;
        html += `<p><strong>事业运势：</strong>${forecast.career || '职场节奏平稳，适合巩固基础。'}</p>`;
        html += `<p><strong>情感运势：</strong>${forecast.love || '感情生活趋于平淡，顺其自然。'}</p>`;
        html += `<p><strong>财富运势：</strong>${forecast.wealth || '财务状况维持现状，稳健积累。'}</p>`;
        html += `<p><strong>健康提醒：</strong>${forecast.health || '保持规律作息与适度运动。'}</p>`;

        if (forecast.timing && forecast.timing.length > 0) {
            html += `<p><strong>关键时间节点：</strong></p><ul>`;
            forecast.timing.forEach(t => {
                html += `<li>${t}</li>`;
            });
            html += `</ul>`;
        }

        yearDiv.innerHTML = html;
        container.appendChild(yearDiv);
    });
}

/**
 * 设置解析结果标签页
 */
function setupInterpretationTabs() {
    const interpTabs = document.querySelectorAll('.interp-tab');
    const interpContents = document.querySelectorAll('.interp-content');
    
    interpTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetInterp = tab.dataset.interp;
            
            // 更新标签状态
            interpTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新内容显示
            interpContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetInterp}-content`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * 保存数据到本地存储
 */
function saveData(birthData, chartData) {
    const data = {
        birthData: birthData,
        chartData: chartData,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('mystic-lab-last-chart', JSON.stringify(data));
}

/**
 * 加载保存的数据
 */
function loadSavedData() {
    const saved = localStorage.getItem('mystic-lab-last-chart');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // 可以在这里恢复表单数据（可选）
            // 暂时不自动加载，让用户主动生成
        } catch (e) {
            console.error('加载保存数据失败:', e);
        }
    }
}

/**
 * 设置易经功能
 */
function setupIChing() {
    // 方法标签页切换
    setupMethodTabs();
    
    // 时间起卦表单
    setupTimeDivination();
    
    // 数字起卦表单
    setupNumberDivination();
    
    // 手动起卦表单
    setupCoinDivination();
    
    // 初始化手动起卦的投掷输入
    initCoinThrows();
}

/**
 * 设置方法标签页切换
 */
function setupMethodTabs() {
    const methodTabs = document.querySelectorAll('.method-tab');
    const methodContents = document.querySelectorAll('.method-content');
    
    methodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetMethod = tab.dataset.method;
            
            // 更新标签状态
            methodTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新内容显示
            methodContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetMethod}-method`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * 设置时间起卦
 */
function setupTimeDivination() {
    const form = document.getElementById('time-divination-form');
    if (!form) return;
    
    // 设置默认时间为当前时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('divination-date').value = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const question = document.getElementById('divination-question').value;
        const dateStr = document.getElementById('divination-date').value;
        const date = new Date(dateStr);
        
        try {
            const result = divination.timeDivination(date, question);
            displayIChingResult(result);
        } catch (error) {
            alert('起卦失败: ' + error.message);
        }
    });
}

/**
 * 设置数字起卦
 */
function setupNumberDivination() {
    const form = document.getElementById('number-divination-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const question = document.getElementById('divination-question-number').value;
        const num1 = parseInt(document.getElementById('number1').value);
        const num2 = parseInt(document.getElementById('number2').value);
        
        if (!num1 || !num2 || num1 < 1 || num2 < 1) {
            alert('请输入有效的数字（大于0）');
            return;
        }
        
        try {
            const result = divination.numberDivination(num1, num2, question);
            displayIChingResult(result);
        } catch (error) {
            alert('起卦失败: ' + error.message);
        }
    });
}

/**
 * 设置手动起卦
 */
function setupCoinDivination() {
    const form = document.getElementById('coin-divination-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const question = document.getElementById('divination-question-coin').value;
        const coinResults = [];
        
        // 收集6次投掷结果
        for (let i = 0; i < 6; i++) {
            const throwInput = document.getElementById(`coin-throw-${i}`);
            if (!throwInput || !throwInput.value) {
                alert(`请完成第${i + 1}次投掷的输入`);
                return;
            }
            
            // 解析输入：例如 "1,0,1" 或 "1 0 1"
            const values = throwInput.value.split(/[,\s]+/).map(v => parseInt(v.trim()));
            if (values.length !== 3 || values.some(v => v !== 0 && v !== 1)) {
                alert(`第${i + 1}次投掷输入格式错误，请输入3个0或1，用逗号或空格分隔`);
                return;
            }
            
            coinResults.push(values);
        }
        
        try {
            const result = divination.coinDivination(coinResults, question);
            displayIChingResult(result);
        } catch (error) {
            alert('起卦失败: ' + error.message);
        }
    });
}

/**
 * 初始化手动起卦的投掷输入
 */
function initCoinThrows() {
    const container = document.getElementById('coin-throws');
    if (!container) return;
    
    const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    
    for (let i = 0; i < 6; i++) {
        const div = document.createElement('div');
        div.className = 'coin-throw-item';
        div.innerHTML = `
            <label>${yaoNames[i]}（第${i + 1}次投掷）</label>
            <input type="text" id="coin-throw-${i}" placeholder="例如：1,0,1 或 1 0 1" required>
            <small class="form-hint">输入3个数字：0（反面）或1（正面）</small>
        `;
        container.appendChild(div);
    }
}

/**
 * 显示易经起卦结果
 */
function displayIChingResult(result) {
    const resultSection = document.getElementById('iching-result');
    const visualizationDiv = document.getElementById('hexagram-visualization');
    const interpretationDiv = document.getElementById('hexagram-interpretation');
    
    if (!resultSection || !visualizationDiv || !interpretationDiv) return;
    
    // 获取卦数据
    const hexagramData = getHexagram(result.original.number);
    
    // 显示卦象可视化
    const lines = result.original.lines;
    const visualization = divination.visualizeHexagram(lines);
    visualizationDiv.innerHTML = `
        <div style="font-size: 3rem; line-height: 1.5; margin-bottom: 15px;">
            ${visualization}
        </div>
        <div style="font-size: 1.2rem; color: #667eea; font-weight: 600;">
            ${hexagramData.name}卦（第${result.original.number}卦）
        </div>
        ${result.movingLine ? `<div style="margin-top: 10px; color: #666;">动爻：第${result.movingLine}爻</div>` : ''}
    `;
    
    // 显示解读
    const interpretation = ichingInterpreter.interpret(result, hexagramData);
    interpretationDiv.innerHTML = `
        <h4>本卦解读</h4>
        <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.8;">${interpretation.original.interpretation}</pre>
        ${interpretation.changed ? `
            <h4 style="margin-top: 20px;">变卦解读</h4>
            <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.8;">${interpretation.changed.interpretation}</pre>
        ` : ''}
        <h4 style="margin-top: 20px;">综合解读</h4>
        <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.8;">${interpretation.summary}</pre>
    `;
    
    // 显示结果区域
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}
