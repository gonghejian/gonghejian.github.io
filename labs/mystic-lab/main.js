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

document.addEventListener('DOMContentLoaded', () => {
    // 初始化组件
    calculator = new AstrologyCalculator();
    renderer = new ChartRenderer('chart-canvas');
    interpreter = new ChartInterpreter();
    divination = new IChingDivination();
    ichingInterpreter = new IChingInterpreter();
    
    // 标签页切换
    setupTabs();
    
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
        
        const birthDate = document.getElementById('birth-date').value;
        const birthTime = document.getElementById('birth-time').value;
        const birthLocation = document.getElementById('birth-location').value;
        const timezone = document.getElementById('timezone').value;
        
        if (!birthDate || !birthTime || !birthLocation) {
            alert('请填写完整的出生信息');
            return;
        }
        
        // 显示加载状态
        generateBtn.textContent = '计算中...';
        generateBtn.disabled = true;
        
        try {
            // 获取经纬度（简化版本，实际应该使用地理编码API）
            const coordinates = await getCoordinates(birthLocation);
            
            if (!coordinates) {
                throw new Error('无法获取地点坐标，请尝试输入更具体的地点名称');
            }
            
            // 计算星盘
            const birthData = {
                date: birthDate,
                time: birthTime,
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                timezone: timezone
            };
            
            const chartData = await calculator.calculateChart(birthData);
            
            // 验证计算结果
            if (!chartData || !chartData.planets || !chartData.houses) {
                throw new Error('星盘计算失败，返回数据不完整');
            }
            
            // 保存数据
            saveData(birthData, chartData);
            
            // 绘制星盘
            try {
                renderer.drawChart(chartData);
            } catch (drawError) {
                console.error('绘制星盘时出错:', drawError);
                throw new Error('绘制星盘失败: ' + drawError.message);
            }
            
            // 显示星盘和解析
            document.getElementById('chart-section').style.display = 'block';
            document.getElementById('interpretation-section').style.display = 'block';
            
            // 生成解析
            generateInterpretations(chartData);
            
            // 滚动到星盘
            document.getElementById('chart-section').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('生成星盘时出错:', error);
            console.error('错误堆栈:', error.stack);
            alert('生成星盘时出错: ' + error.message + '\n\n请检查控制台获取更多信息。');
        } finally {
            generateBtn.textContent = '生成星盘';
            generateBtn.disabled = false;
        }
    });
}

/**
 * 获取地点坐标（简化版本）
 * 实际应该使用地理编码API，如 Google Geocoding API 或 OpenStreetMap Nominatim
 */
async function getCoordinates(location) {
    // 这里使用一个简化的城市坐标数据库
    // 包含主要城市和部分县级市
    const cityCoordinates = {
        // 直辖市和省会城市
        '北京': { lat: 39.9042, lng: 116.4074 },
        '上海': { lat: 31.2304, lng: 121.4737 },
        '天津': { lat: 39.3434, lng: 117.3616 },
        '重庆': { lat: 29.5630, lng: 106.5516 },
        '广州': { lat: 23.1291, lng: 113.2644 },
        '深圳': { lat: 22.5431, lng: 114.0579 },
        '杭州': { lat: 30.2741, lng: 120.1551 },
        '成都': { lat: 30.6624, lng: 104.0633 },
        '西安': { lat: 34.3416, lng: 108.9398 },
        '南京': { lat: 32.0603, lng: 118.7969 },
        '武汉': { lat: 30.5928, lng: 114.3055 },
        '郑州': { lat: 34.7466, lng: 113.6254 },
        '长沙': { lat: 28.2278, lng: 112.9388 },
        '沈阳': { lat: 41.8057, lng: 123.4315 },
        '青岛': { lat: 36.0671, lng: 120.3826 },
        '大连': { lat: 38.9140, lng: 121.6147 },
        '厦门': { lat: 24.4798, lng: 118.0819 },
        '福州': { lat: 26.0745, lng: 119.2965 },
        '济南': { lat: 36.6512, lng: 117.1201 },
        '合肥': { lat: 31.8206, lng: 117.2272 },
        '石家庄': { lat: 38.0428, lng: 114.5149 },
        '哈尔滨': { lat: 45.7731, lng: 126.6168 },
        '长春': { lat: 43.8171, lng: 125.3235 },
        '昆明': { lat: 25.0389, lng: 102.7183 },
        '南昌': { lat: 28.6820, lng: 115.8579 },
        '太原': { lat: 37.8706, lng: 112.5489 },
        '南宁': { lat: 22.8170, lng: 108.3669 },
        '海口': { lat: 20.0444, lng: 110.1999 },
        '贵阳': { lat: 26.6470, lng: 106.6302 },
        '乌鲁木齐': { lat: 43.8256, lng: 87.6168 },
        '拉萨': { lat: 29.6626, lng: 91.1409 },
        '银川': { lat: 38.4872, lng: 106.2309 },
        '西宁': { lat: 36.6171, lng: 101.7782 },
        
        // 江西省主要城市
        '鹰潭': { lat: 28.2602, lng: 117.0692 },
        '贵溪': { lat: 28.2936, lng: 117.2123 },
        '九江': { lat: 29.7051, lng: 116.0019 },
        '赣州': { lat: 25.8294, lng: 114.9350 },
        '上饶': { lat: 28.4543, lng: 117.9434 },
        '宜春': { lat: 27.8044, lng: 114.4161 },
        '吉安': { lat: 27.1117, lng: 114.9928 },
        '抚州': { lat: 27.9492, lng: 116.3584 },
        '新余': { lat: 27.8178, lng: 114.9173 },
        '萍乡': { lat: 27.6229, lng: 113.8542 },
        '景德镇': { lat: 29.2689, lng: 117.1782 },
        
        // 其他主要地级市
        '苏州': { lat: 31.2989, lng: 120.5853 },
        '无锡': { lat: 31.4911, lng: 120.3124 },
        '宁波': { lat: 29.8683, lng: 121.5440 },
        '温州': { lat: 28.0006, lng: 120.6994 },
        '嘉兴': { lat: 30.7522, lng: 120.7509 },
        '台州': { lat: 28.6564, lng: 121.4208 },
        '金华': { lat: 29.0790, lng: 119.6474 },
        '绍兴': { lat: 30.0303, lng: 120.5820 },
        '湖州': { lat: 30.8930, lng: 120.0868 },
        '舟山': { lat: 29.9853, lng: 122.2072 },
        '衢州': { lat: 28.9700, lng: 118.8594 },
        '丽水': { lat: 28.4676, lng: 119.9229 },
        
        '东莞': { lat: 23.0205, lng: 113.7518 },
        '佛山': { lat: 23.0215, lng: 113.1219 },
        '中山': { lat: 22.5170, lng: 113.3827 },
        '珠海': { lat: 22.2707, lng: 113.5767 },
        '惠州': { lat: 23.1104, lng: 114.4158 },
        '江门': { lat: 22.5787, lng: 113.0815 },
        '肇庆': { lat: 23.0472, lng: 112.4655 },
        '汕头': { lat: 23.3540, lng: 116.6819 },
        '湛江': { lat: 21.2707, lng: 110.3647 },
        '茂名': { lat: 21.6629, lng: 110.9254 },
        '韶关': { lat: 24.8104, lng: 113.5972 },
        '清远': { lat: 23.6850, lng: 113.0510 },
        '阳江': { lat: 21.8579, lng: 111.9822 },
        '潮州': { lat: 23.6569, lng: 116.6226 },
        '揭阳': { lat: 23.5499, lng: 116.3728 },
        '汕尾': { lat: 22.7864, lng: 115.3752 },
        '河源': { lat: 23.7463, lng: 114.6978 },
        '梅州': { lat: 24.2886, lng: 116.1222 },
        '云浮': { lat: 22.9153, lng: 112.0445 },
        
        '烟台': { lat: 37.4638, lng: 121.4479 },
        '潍坊': { lat: 36.7069, lng: 119.1077 },
        '临沂': { lat: 35.0527, lng: 118.3264 },
        '淄博': { lat: 36.8135, lng: 118.0549 },
        '济宁': { lat: 35.4149, lng: 116.5872 },
        '泰安': { lat: 36.2003, lng: 117.1201 },
        '威海': { lat: 37.5133, lng: 122.1214 },
        '日照': { lat: 35.4167, lng: 119.5269 },
        '德州': { lat: 37.4513, lng: 116.3594 },
        '聊城': { lat: 36.4560, lng: 115.9853 },
        '滨州': { lat: 37.3830, lng: 118.0169 },
        '东营': { lat: 37.4347, lng: 118.6747 },
        '菏泽': { lat: 35.2337, lng: 115.4806 },
        '枣庄': { lat: 34.8105, lng: 117.3239 },
        '莱芜': { lat: 36.2138, lng: 117.6767 },
        
        '洛阳': { lat: 34.6197, lng: 112.4540 },
        '南阳': { lat: 33.0007, lng: 112.5283 },
        '新乡': { lat: 35.3030, lng: 113.9268 },
        '焦作': { lat: 35.2154, lng: 113.2418 },
        '安阳': { lat: 36.0975, lng: 114.3932 },
        '开封': { lat: 34.7970, lng: 114.3074 },
        '平顶山': { lat: 33.7390, lng: 113.3008 },
        '信阳': { lat: 32.1471, lng: 114.0927 },
        '周口': { lat: 33.6204, lng: 114.6496 },
        '驻马店': { lat: 32.9773, lng: 114.0250 },
        '商丘': { lat: 34.4141, lng: 115.6505 },
        '许昌': { lat: 34.0229, lng: 113.8526 },
        '漯河': { lat: 33.5814, lng: 114.0168 },
        '三门峡': { lat: 34.7726, lng: 111.2001 },
        '濮阳': { lat: 35.7618, lng: 115.0293 },
        '鹤壁': { lat: 35.7482, lng: 114.2954 },
        
        '株洲': { lat: 27.8270, lng: 113.1339 },
        '湘潭': { lat: 27.8297, lng: 112.9441 },
        '衡阳': { lat: 26.8967, lng: 112.5719 },
        '岳阳': { lat: 29.3572, lng: 113.1289 },
        '常德': { lat: 29.0316, lng: 111.6984 },
        '邵阳': { lat: 27.2388, lng: 111.4677 },
        '益阳': { lat: 28.5539, lng: 112.3551 },
        '郴州': { lat: 25.7706, lng: 113.0147 },
        '永州': { lat: 26.4203, lng: 111.6122 },
        '怀化': { lat: 27.5695, lng: 110.0019 },
        '娄底': { lat: 27.7000, lng: 111.9964 },
        '张家界': { lat: 29.1274, lng: 110.4791 },
        '湘西': { lat: 28.3119, lng: 109.7337 },
        
        '芜湖': { lat: 31.3263, lng: 118.3764 },
        '蚌埠': { lat: 32.9406, lng: 117.3632 },
        '淮南': { lat: 32.6254, lng: 116.9999 },
        '马鞍山': { lat: 31.6893, lng: 118.5079 },
        '淮北': { lat: 33.9548, lng: 116.7982 },
        '铜陵': { lat: 30.9456, lng: 117.8121 },
        '安庆': { lat: 30.5255, lng: 117.0535 },
        '黄山': { lat: 29.7146, lng: 118.3370 },
        '滁州': { lat: 32.3036, lng: 118.3162 },
        '阜阳': { lat: 32.8969, lng: 115.8197 },
        '宿州': { lat: 33.6338, lng: 116.9783 },
        '六安': { lat: 31.7528, lng: 116.5077 },
        '亳州': { lat: 33.8693, lng: 115.7789 },
        '池州': { lat: 30.6648, lng: 117.4891 },
        '宣城': { lat: 30.9455, lng: 118.7588 },
        
        '泉州': { lat: 24.8741, lng: 118.6758 },
        '漳州': { lat: 24.5108, lng: 117.6471 },
        '莆田': { lat: 25.4540, lng: 119.0077 },
        '三明': { lat: 26.2654, lng: 117.6390 },
        '南平': { lat: 26.6415, lng: 118.1777 },
        '龙岩': { lat: 25.0916, lng: 117.0179 },
        '宁德': { lat: 26.6654, lng: 119.5278 },
        
        // 更多县级市和区县（部分）
        '余姚': { lat: 30.0371, lng: 121.1546 },
        '慈溪': { lat: 30.1690, lng: 121.2665 },
        '义乌': { lat: 29.3064, lng: 120.0750 },
        '诸暨': { lat: 29.7136, lng: 120.2443 },
        '海宁': { lat: 30.5255, lng: 120.6808 },
        '桐乡': { lat: 30.6301, lng: 120.5513 },
        '平湖': { lat: 30.6989, lng: 121.0151 },
        '乐清': { lat: 28.1128, lng: 120.9671 },
        '瑞安': { lat: 27.7783, lng: 120.6551 },
        '永康': { lat: 28.8884, lng: 120.0474 },
        '东阳': { lat: 29.2894, lng: 120.2415 },
        '温岭': { lat: 28.3718, lng: 121.3856 },
        '临海': { lat: 28.8584, lng: 121.1449 },
        '玉环': { lat: 28.1359, lng: 121.2317 },
        '江山': { lat: 28.7372, lng: 118.6274 },
        '建德': { lat: 29.4727, lng: 119.2812 },
        '富阳': { lat: 30.0489, lng: 119.9600 },
        '临安': { lat: 30.2338, lng: 119.7157 },
        
        '昆山': { lat: 31.3856, lng: 120.9658 },
        '张家港': { lat: 31.8756, lng: 120.5559 },
        '常熟': { lat: 31.6536, lng: 120.7485 },
        '太仓': { lat: 31.4589, lng: 121.1122 },
        '江阴': { lat: 31.9200, lng: 120.2850 },
        '宜兴': { lat: 31.3404, lng: 119.8233 },
        '溧阳': { lat: 31.4159, lng: 119.4839 },
        '丹阳': { lat: 32.0094, lng: 119.6067 },
        '扬中': { lat: 32.2370, lng: 119.7978 },
        '句容': { lat: 31.9449, lng: 119.1687 },
        '高邮': { lat: 32.7816, lng: 119.4583 },
        '仪征': { lat: 32.2720, lng: 119.1844 },
        '兴化': { lat: 32.9104, lng: 119.8525 },
        '靖江': { lat: 32.0145, lng: 120.2682 },
        '泰兴': { lat: 32.1688, lng: 120.0132 },
        '如皋': { lat: 32.3916, lng: 120.5728 },
        '启东': { lat: 31.8080, lng: 121.6597 },
        '海门': { lat: 31.8713, lng: 121.1816 },
        '如东': { lat: 32.3142, lng: 121.1854 },
        '海安': { lat: 32.5386, lng: 120.4657 },
        
        '增城': { lat: 23.2905, lng: 113.8295 },
        '从化': { lat: 23.5489, lng: 113.5867 },
        '花都': { lat: 23.3760, lng: 113.2201 },
        '番禺': { lat: 22.9372, lng: 113.3841 },
        '南沙': { lat: 22.8016, lng: 113.5254 },
        '顺德': { lat: 22.8038, lng: 113.2933 },
        '南海': { lat: 23.0288, lng: 113.1426 },
        '三水': { lat: 23.1559, lng: 112.8970 },
        '高明': { lat: 22.9001, lng: 112.8921 },
        '新会': { lat: 22.4583, lng: 113.0386 },
        '台山': { lat: 22.2516, lng: 112.7939 },
        '开平': { lat: 22.3763, lng: 112.6985 },
        '鹤山': { lat: 22.7654, lng: 112.9644 },
        '恩平': { lat: 22.1829, lng: 112.3050 },
        '四会': { lat: 23.3268, lng: 112.7337 },
        '高要': { lat: 23.0277, lng: 112.4600 },
        '广宁': { lat: 23.6346, lng: 112.4406 },
        '怀集': { lat: 23.9112, lng: 112.1844 },
        '封开': { lat: 23.4343, lng: 111.5024 },
        '德庆': { lat: 23.1417, lng: 111.7855 },
        '罗定': { lat: 22.7692, lng: 111.5700 },
        '新兴': { lat: 22.6959, lng: 112.2253 },
        '郁南': { lat: 23.2377, lng: 111.5352 },
        '云安': { lat: 23.0730, lng: 112.0056 },
        
        '即墨': { lat: 36.3893, lng: 120.4471 },
        '胶州': { lat: 36.2640, lng: 120.0333 },
        '平度': { lat: 36.7867, lng: 119.9594 },
        '莱西': { lat: 36.8880, lng: 120.5176 },
        '滕州': { lat: 35.1133, lng: 117.1659 },
        '曲阜': { lat: 35.5809, lng: 116.9919 },
        '邹城': { lat: 35.4052, lng: 116.9738 },
        '新泰': { lat: 35.9089, lng: 117.7679 },
        '肥城': { lat: 36.1856, lng: 116.7691 },
        '章丘': { lat: 36.7120, lng: 117.5262 },
        '平阴': { lat: 36.2890, lng: 116.4550 },
        '济阳': { lat: 36.9784, lng: 117.1766 },
        '商河': { lat: 37.3106, lng: 117.1563 },
        '长清': { lat: 36.5538, lng: 116.7519 },
        
        '登封': { lat: 34.4556, lng: 113.0377 },
        '新密': { lat: 34.5394, lng: 113.3904 },
        '新郑': { lat: 34.3956, lng: 113.7395 },
        '巩义': { lat: 34.7521, lng: 112.9820 },
        '荥阳': { lat: 34.7873, lng: 113.3830 },
        '中牟': { lat: 34.7189, lng: 114.0221 },
        '偃师': { lat: 34.7280, lng: 112.7879 },
        '孟津': { lat: 34.8256, lng: 112.4353 },
        '新安': { lat: 34.7282, lng: 112.1322 },
        '栾川': { lat: 33.7858, lng: 111.6157 },
        '嵩县': { lat: 34.1346, lng: 112.0857 },
        '汝阳': { lat: 34.1532, lng: 112.4737 },
        '宜阳': { lat: 34.5167, lng: 112.1797 },
        '洛宁': { lat: 34.3877, lng: 111.6554 },
        '伊川': { lat: 34.4201, lng: 112.4258 },
        '吉利': { lat: 34.9008, lng: 112.5891 },
        
        // 更多常见县级市
        '常熟': { lat: 31.6536, lng: 120.7485 },
        '张家港': { lat: 31.8756, lng: 120.5559 },
        '太仓': { lat: 31.4589, lng: 121.1122 },
        '昆山': { lat: 31.3856, lng: 120.9658 },
        '吴江': { lat: 31.1387, lng: 120.6453 },
        '江阴': { lat: 31.9200, lng: 120.2850 },
        '宜兴': { lat: 31.3404, lng: 119.8233 },
        '溧阳': { lat: 31.4159, lng: 119.4839 },
        '金坛': { lat: 31.7234, lng: 119.5733 },
        '武进': { lat: 31.7016, lng: 119.9424 },
        '新北': { lat: 31.8086, lng: 119.9739 },
        '天宁': { lat: 31.7796, lng: 119.9638 },
        '钟楼': { lat: 31.7808, lng: 119.9489 },
        '戚墅堰': { lat: 31.7234, lng: 120.0614 },
        
        // 支持省份名称，使用省会坐标
        '江西': { lat: 28.6820, lng: 115.8579 }, // 南昌
        '江苏': { lat: 32.0603, lng: 118.7969 }, // 南京
        '浙江': { lat: 30.2741, lng: 120.1551 }, // 杭州
        '广东': { lat: 23.1291, lng: 113.2644 }, // 广州
        '山东': { lat: 36.6512, lng: 117.1201 }, // 济南
        '河南': { lat: 34.7466, lng: 113.6254 }, // 郑州
        '湖南': { lat: 28.2278, lng: 112.9388 }, // 长沙
        '湖北': { lat: 30.5928, lng: 114.3055 }, // 武汉
        '安徽': { lat: 31.8206, lng: 117.2272 }, // 合肥
        '福建': { lat: 26.0745, lng: 119.2965 }, // 福州
        '四川': { lat: 30.6624, lng: 104.0633 }, // 成都
        '陕西': { lat: 34.3416, lng: 108.9398 }, // 西安
        '山西': { lat: 37.8706, lng: 112.5489 }, // 太原
        '河北': { lat: 38.0428, lng: 114.5149 }, // 石家庄
        '辽宁': { lat: 41.8057, lng: 123.4315 }, // 沈阳
        '吉林': { lat: 43.8171, lng: 125.3235 }, // 长春
        '黑龙江': { lat: 45.7731, lng: 126.6168 }, // 哈尔滨
        '云南': { lat: 25.0389, lng: 102.7183 }, // 昆明
        '贵州': { lat: 26.6470, lng: 106.6302 }, // 贵阳
        '广西': { lat: 22.8170, lng: 108.3669 }, // 南宁
        '海南': { lat: 20.0444, lng: 110.1999 }, // 海口
        '新疆': { lat: 43.8256, lng: 87.6168 }, // 乌鲁木齐
        '西藏': { lat: 29.6626, lng: 91.1409 }, // 拉萨
        '宁夏': { lat: 38.4872, lng: 106.2309 }, // 银川
        '青海': { lat: 36.6171, lng: 101.7782 }, // 西宁
        '内蒙古': { lat: 40.8413, lng: 111.7519 }, // 呼和浩特
        '甘肃': { lat: 36.0611, lng: 103.8343 }, // 兰州
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
