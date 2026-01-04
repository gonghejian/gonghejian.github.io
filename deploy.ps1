# GitHub Pages 一键部署脚本

Write-Host "🚀 开始部署到 GitHub Pages..." -ForegroundColor Green
Write-Host ""

# 检查 Git 状态
Write-Host "📋 检查 Git 状态..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "发现未提交的文件，正在添加..." -ForegroundColor Yellow
    git add .
    $message = Read-Host "请输入提交信息（直接回车使用默认）"
    if ([string]::IsNullOrWhiteSpace($message)) {
        $message = "Update site - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    git commit -m $message
    Write-Host "✅ 文件已提交" -ForegroundColor Green
} else {
    Write-Host "✅ 工作区干净，无需提交" -ForegroundColor Green
}

# 检查当前分支
Write-Host ""
Write-Host "🌿 当前分支：" -ForegroundColor Yellow
$branch = git branch --show-current
Write-Host $branch -ForegroundColor Cyan

# 推送到 GitHub
Write-Host ""
Write-Host "📤 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "如果遇到连接问题，请尝试：" -ForegroundColor Yellow
Write-Host "1. 使用 SSH: git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git" -ForegroundColor Gray
Write-Host "2. 配置代理（如果使用）" -ForegroundColor Gray
Write-Host ""

$pushResult = git push origin $branch 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 推送成功！" -ForegroundColor Green
} else {
    Write-Host "❌ 推送失败：" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 解决方案：" -ForegroundColor Yellow
    Write-Host "1. 检查网络连接" -ForegroundColor Gray
    Write-Host "2. 尝试使用 SSH: git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git" -ForegroundColor Gray
    Write-Host "3. 查看 GIT_PUSH_FIX.md 获取详细解决方案" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "✅ 部署步骤完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 接下来需要在 GitHub 上操作：" -ForegroundColor Yellow
Write-Host "1. 进入仓库 Settings → Pages" -ForegroundColor Gray
Write-Host "2. Source 选择 'GitHub Actions'" -ForegroundColor Gray
Write-Host "3. 进入 Actions 标签页" -ForegroundColor Gray
Write-Host "4. 点击 'Deploy GitHub Pages' → 'Run workflow'" -ForegroundColor Gray
Write-Host "5. 等待部署完成（2-5分钟）" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 仓库地址: https://github.com/gonghejian/gonghejian.github.io" -ForegroundColor Cyan

