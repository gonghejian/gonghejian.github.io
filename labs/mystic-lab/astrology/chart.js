/**
 * 星盘绘制模块
 * 使用 Canvas 绘制圆形星盘
 */

class ChartRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        this.ctx = this.canvas.getContext('2d');
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        
        // 星座颜色
        this.signColors = [
            '#FF6B6B', '#FFD93D', '#6BCF7F', '#4ECDC4',
            '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E',
            '#BC6C25', '#6C5CE7', '#A29BFE', '#FD79A8'
        ];
        
        // 行星符号映射
        this.planetSymbols = {
            '太阳': '☉',
            '月亮': '☽',
            '水星': '☿',
            '金星': '♀',
            '火星': '♂',
            '木星': '♃',
            '土星': '♄',
            '天王星': '♅',
            '海王星': '♆',
            '冥王星': '♇'
        };
    }

    /**
     * 初始化画布尺寸
     */
    initCanvas() {
        const container = this.canvas.parentElement;
        let containerWidth = container.clientWidth;

        // 如果容器尚未布局（例如刚从 display:none 切换），尝试使用父容器或默认宽度
        if (!containerWidth || containerWidth <= 0) {
            containerWidth = container.getBoundingClientRect().width;
        }
        if (!containerWidth || containerWidth <= 0) {
            containerWidth = 600; // 兜底默认值
        }

        const dpr = window.devicePixelRatio || 1;
        const cssSize = Math.min(containerWidth - 40, 600);
        const finalSize = Math.max(cssSize, 280); // 确保最小 280px，避免负半径

        // 画布像素尺寸考虑 DPR，保证高清屏不模糊
        this.canvas.width = finalSize * dpr;
        this.canvas.height = finalSize * dpr;

        // 不设置 style.width/height，由 CSS 控制显示尺寸，防止手机端被拉伸变形
        this.canvas.style.width = '';
        this.canvas.style.height = '';

        // 所有绘制逻辑以 css 尺寸为基准，通过 scale 适配 DPR
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.centerX = finalSize / 2;
        this.centerY = finalSize / 2;
        this.radius = finalSize / 2 - 60;
    }

    /**
     * 绘制星盘
     */
    drawChart(chartData) {
        // 验证数据
        if (!chartData) {
            throw new Error('星盘数据为空');
        }
        if (!chartData.planets || !Array.isArray(chartData.planets) || chartData.planets.length === 0) {
            throw new Error('行星数据无效');
        }
        if (!chartData.houses || !Array.isArray(chartData.houses) || chartData.houses.length === 0) {
            throw new Error('宫位数据无效');
        }
        if (!chartData.ascendant) {
            throw new Error('上升点数据无效');
        }
        if (!chartData.mc) {
            throw new Error('天顶数据无效');
        }
        
        this.initCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制外圈（星座）
        this.drawZodiacCircle();
        
        // 绘制宫位
        this.drawHouses(chartData.houses, chartData.ascendant);
        
        // 绘制相位线
        if (chartData.aspects && Array.isArray(chartData.aspects)) {
            this.drawAspects(chartData.planets, chartData.aspects);
        }
        
        // 绘制行星
        this.drawPlanets(chartData.planets, chartData.houses);

        // 绘制上升点和天顶
        this.drawAngles(chartData.ascendant, chartData.mc);
    }

    /**
     * 绘制星座圈
     */
    drawZodiacCircle() {
        const signs = ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女', 
                      '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'];
        
        // 绘制外圈
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 绘制星座分割线和标签
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x1 = this.centerX + this.radius * Math.cos(angle);
            const y1 = this.centerY + this.radius * Math.sin(angle);
            const x2 = this.centerX + (this.radius - 20) * Math.cos(angle);
            const y2 = this.centerY + (this.radius - 20) * Math.sin(angle);
            
            // 绘制分割线
            this.ctx.strokeStyle = this.signColors[i];
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
            
            // 绘制星座标签
            const labelAngle = ((i + 0.5) * 30 - 90) * Math.PI / 180;
            const labelX = this.centerX + (this.radius + 15) * Math.cos(labelAngle);
            const labelY = this.centerY + (this.radius + 15) * Math.sin(labelAngle);
            
            this.ctx.fillStyle = this.signColors[i];
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(signs[i], labelX, labelY);
        }
    }

    /**
     * 绘制宫位
     */
    drawHouses(houses, ascendant) {
        const innerRadius = this.radius - 100;
        
        // 绘制宫位分割线
        houses.forEach((house, index) => {
            const angle = (house.cuspLongitude - 90) * Math.PI / 180;
            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);
            const innerX = this.centerX + innerRadius * Math.cos(angle);
            const innerY = this.centerY + innerRadius * Math.sin(angle);
            
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(innerX, innerY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // 绘制宫位数字
            const labelAngle = (house.cuspLongitude - 90) * Math.PI / 180;
            const labelX = this.centerX + (innerRadius - 15) * Math.cos(labelAngle);
            const labelY = this.centerY + (innerRadius - 15) * Math.sin(labelAngle);
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(house.houseNumber, labelX, labelY);
        });
    }

    /**
     * 绘制相位线
     */
    drawAspects(planets, aspects) {
        const planetPositions = {};
        planets.forEach(planet => {
            planetPositions[planet.planet] = planet.longitude;
        });
        
        aspects.forEach(aspect => {
            const angle1 = (planetPositions[aspect.planet1] - 90) * Math.PI / 180;
            const angle2 = (planetPositions[aspect.planet2] - 90) * Math.PI / 180;
            const radius1 = this.radius - 50;
            const radius2 = this.radius - 50;
            
            const x1 = this.centerX + radius1 * Math.cos(angle1);
            const y1 = this.centerY + radius1 * Math.sin(angle1);
            const x2 = this.centerX + radius2 * Math.cos(angle2);
            const y2 = this.centerY + radius2 * Math.sin(angle2);
            
            // 根据相位类型选择颜色
            let color = '#999';
            if (aspect.aspect === '合相') color = '#FF6B6B';
            else if (aspect.aspect === '对相') color = '#4ECDC4';
            else if (aspect.aspect === '三分相') color = '#6BCF7F';
            else if (aspect.aspect === '四分相') color = '#FFD93D';
            else if (aspect.aspect === '六分相') color = '#A29BFE';
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        });
    }

    /**
     * 绘制行星
     */
    drawPlanets(planets, houses) {
        const planetRadius = this.radius - 50;
        
        planets.forEach(planet => {
            // 验证行星数据
            if (typeof planet.longitude !== 'number' || isNaN(planet.longitude)) {
                console.warn('行星数据无效:', planet);
                return;
            }
            
            const angle = (planet.longitude - 90) * Math.PI / 180;
            const x = this.centerX + planetRadius * Math.cos(angle);
            const y = this.centerY + planetRadius * Math.sin(angle);
            
            // 验证signIndex
            const signIndex = (planet.signIndex !== undefined && planet.signIndex >= 0 && planet.signIndex < 12) 
                ? planet.signIndex 
                : Math.floor(planet.longitude / 30) % 12;
            
            // 绘制行星圆圈
            this.ctx.fillStyle = 'rgba(30, 30, 50, 0.9)';
            this.ctx.strokeStyle = this.signColors[signIndex] || '#999';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 12, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // 绘制行星符号
            this.ctx.fillStyle = '#f5f7fa';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.planetSymbols[planet.planet] || planet.planet[0] || '?', x, y);
        });
    }

    /**
     * 绘制上升点和天顶
     */
    drawAngles(ascendant, mc) {
        // 绘制上升点（ASC）
        const ascAngle = (ascendant.longitude - 90) * Math.PI / 180;
        const ascX = this.centerX + this.radius * Math.cos(ascAngle);
        const ascY = this.centerY + this.radius * Math.sin(ascAngle);
        
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(ascX, ascY);
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ASC', ascX + 20, ascY);
        
        // 绘制天顶（MC）
        const mcAngle = (mc.longitude - 90) * Math.PI / 180;
        const mcX = this.centerX + this.radius * Math.cos(mcAngle);
        const mcY = this.centerY + this.radius * Math.sin(mcAngle);
        
        this.ctx.strokeStyle = '#4ECDC4';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(mcX, mcY);
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#4ECDC4';
        this.ctx.fillText('MC', mcX, mcY - 20);
    }

    /**
     * 绘制图例
     */
    drawLegend() {
        const legendX = this.canvas.width - 150;
        const legendY = 20;
        
        this.ctx.fillStyle = 'rgba(20, 20, 40, 0.85)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.roundRect(legendX - 10, legendY - 10, 140, 200, 8);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#f5f7fa';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('相位说明', legendX, legendY + 15);
        
        const aspectColors = {
            '合相': '#FF6B6B',
            '对相': '#4ECDC4',
            '三分相': '#6BCF7F',
            '四分相': '#FFD93D',
            '六分相': '#A29BFE'
        };
        
        let yOffset = 35;
        Object.entries(aspectColors).forEach(([aspect, color]) => {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.roundRect(legendX, yOffset, 15, 15, 3);
            this.ctx.fill();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(aspect, legendX + 22, yOffset + 12);
            yOffset += 20;
        });
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartRenderer;
}
