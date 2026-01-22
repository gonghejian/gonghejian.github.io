# Ruby 安装验证脚本
Write-Host "正在验证 Ruby 安装..." -ForegroundColor Cyan
Write-Host ""

# 检查 Ruby
Write-Host "检查 Ruby..." -ForegroundColor Yellow
try {
    $rubyVersion = ruby -v 2>&1
    Write-Host "✓ Ruby: $rubyVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Ruby 未安装或未在 PATH 中" -ForegroundColor Red
    Write-Host "请确保已安装 Ruby 并重新打开终端" -ForegroundColor Yellow
    exit 1
}

# 检查 Gem
Write-Host "检查 Gem..." -ForegroundColor Yellow
try {
    $gemVersion = gem -v 2>&1
    Write-Host "✓ Gem: $gemVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Gem 未找到" -ForegroundColor Red
    exit 1
}

# 检查 Bundler
Write-Host "检查 Bundler..." -ForegroundColor Yellow
try {
    $bundleVersion = bundle -v 2>&1
    Write-Host "✓ Bundler: $bundleVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ Bundler 未安装，正在安装..." -ForegroundColor Yellow
    gem install bundler
    Write-Host "✓ Bundler 安装完成" -ForegroundColor Green
}

Write-Host ""
Write-Host "✓ 所有检查通过！" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Cyan
Write-Host "1. cd c:\Dev\gonghejian.github.io" -ForegroundColor Gray
Write-Host "2. bundle install" -ForegroundColor Gray
Write-Host "3. bundle exec jekyll serve" -ForegroundColor Gray
