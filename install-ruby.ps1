# Ruby 自动安装脚本
# 使用方法：在 PowerShell 中运行 .\install-ruby.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ruby 和 Jekyll 安装脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否已安装 Ruby
Write-Host "正在检查 Ruby 安装状态..." -ForegroundColor Yellow
try {
    $rubyVersion = ruby -v 2>&1
    Write-Host "✓ Ruby 已安装: $rubyVersion" -ForegroundColor Green
    Write-Host "跳过安装步骤" -ForegroundColor Gray
    exit 0
} catch {
    Write-Host "✗ Ruby 未安装，开始安装流程..." -ForegroundColor Yellow
}

# 检查 Chocolatey
Write-Host "`n检查 Chocolatey..." -ForegroundColor Yellow
try {
    $chocoVersion = choco --version 2>&1
    Write-Host "✓ Chocolatey 已安装: $chocoVersion" -ForegroundColor Green
    
    Write-Host "`n使用 Chocolatey 安装 Ruby..." -ForegroundColor Cyan
    Write-Host "注意：这需要管理员权限" -ForegroundColor Yellow
    Write-Host ""
    
    # 使用 Chocolatey 安装 Ruby
    choco install ruby -y
    
    Write-Host "`n等待安装完成..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # 刷新环境变量
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
} catch {
    Write-Host "✗ Chocolatey 未安装或安装失败" -ForegroundColor Red
    Write-Host ""
    Write-Host "请手动安装 Ruby：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://rubyinstaller.org/downloads/" -ForegroundColor Cyan
    Write-Host "2. 下载 Ruby+Devkit 3.2.x 或 3.3.x (x64)" -ForegroundColor Cyan
    Write-Host "3. 运行安装程序，勾选 'Add Ruby executables to your PATH'" -ForegroundColor Cyan
    Write-Host "4. 安装完成后，重新打开终端" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "或者安装 Chocolatey 后重试：" -ForegroundColor Yellow
    Write-Host "  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
    exit 1
}

# 验证安装
Write-Host "`n验证安装..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $rubyVersion = ruby -v 2>&1
    Write-Host "✓ Ruby 安装成功: $rubyVersion" -ForegroundColor Green
    
    $gemVersion = gem -v 2>&1
    Write-Host "✓ Gem 安装成功: $gemVersion" -ForegroundColor Green
    
    Write-Host "`n安装 Bundler..." -ForegroundColor Yellow
    gem install bundler
    
    Write-Host "`n✓ 安装完成！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Cyan
    Write-Host "1. 运行: cd c:\Dev\gonghejian.github.io" -ForegroundColor Gray
    Write-Host "2. 运行: bundle install" -ForegroundColor Gray
    Write-Host "3. 运行: bundle exec jekyll serve" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "✗ 验证失败，请检查安装" -ForegroundColor Red
    Write-Host "可能需要重新打开终端窗口" -ForegroundColor Yellow
    exit 1
}
