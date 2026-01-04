#!/bin/bash
# GitHub Pages 部署检查脚本

echo "🔍 检查 GitHub Actions 部署配置..."
echo ""

# 检查工作流文件是否存在
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ 工作流文件存在: .github/workflows/deploy.yml"
else
    echo "❌ 工作流文件不存在: .github/workflows/deploy.yml"
    exit 1
fi

# 检查分支名称
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 当前分支: $CURRENT_BRANCH"

# 检查工作流文件中的分支配置
if grep -q "$CURRENT_BRANCH" .github/workflows/deploy.yml; then
    echo "✅ 当前分支在工作流配置中"
else
    echo "⚠️  当前分支可能不在工作流配置中"
    echo "   请检查 .github/workflows/deploy.yml 中的分支配置"
fi

echo ""
echo "📋 检查清单："
echo "1. 进入 GitHub 仓库 → Settings → Pages"
echo "2. 确认 Source 选择为 'GitHub Actions'"
echo "3. 进入 Actions 标签页查看工作流运行状态"
echo "4. 如果工作流失败，查看错误日志"
echo "5. 等待 5-10 分钟让 CDN 更新"
echo ""
echo "🔗 相关链接："
echo "- Actions: https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
echo "- Pages 设置: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/pages"
echo ""

