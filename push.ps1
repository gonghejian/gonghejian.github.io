# Git 推送脚本 - 在 Cursor 中直接推送到 GitHub

Write-Host "`n=== Git 推送工具 ===" -ForegroundColor Cyan
Write-Host ""

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "发现以下更改：" -ForegroundColor Yellow
    git status --short
    
    Write-Host "`n是否要提交并推送？(Y/N)" -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq "Y" -or $confirm -eq "y") {
        # 添加所有更改
        Write-Host "`n正在添加更改..." -ForegroundColor Cyan
        git add .
        
        # 输入提交信息
        Write-Host "`n请输入提交信息：" -ForegroundColor Yellow
        $message = Read-Host
        
        if ([string]::IsNullOrWhiteSpace($message)) {
            $message = "更新内容"
        }
        
        # 提交
        Write-Host "`n正在提交..." -ForegroundColor Cyan
        git commit -m $message
        
        # 推送
        Write-Host "`n正在推送到 GitHub..." -ForegroundColor Cyan
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✓ 推送成功！" -ForegroundColor Green
            Write-Host "访问: https://github.com/gonghejian/gonghejian.github.io" -ForegroundColor Cyan
        } else {
            Write-Host "`n✗ 推送失败，请检查错误信息" -ForegroundColor Red
        }
    } else {
        Write-Host "已取消操作" -ForegroundColor Gray
    }
} else {
    Write-Host "工作目录干净，没有需要提交的更改" -ForegroundColor Green
    Write-Host "`n是否要强制推送？(Y/N)" -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq "Y" -or $confirm -eq "y") {
        git push origin main
    }
}

Write-Host ""


