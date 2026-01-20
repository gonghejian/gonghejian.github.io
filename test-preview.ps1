# Jekyll 预览测试脚本

Write-Host "正在检查 Jekyll 环境..." -ForegroundColor Cyan

# 检查 Ruby
try {
    $rubyVersion = ruby -v 2>&1
    Write-Host "✓ Ruby: $rubyVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Ruby 未安装或未在 PATH 中" -ForegroundColor Red
    exit 1
}

# 检查 Bundle
try {
    $bundleVersion = bundle -v 2>&1
    Write-Host "✓ Bundler: $bundleVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Bundler 未安装" -ForegroundColor Red
    Write-Host "正在安装 Bundler..." -ForegroundColor Yellow
    gem install bundler
}

# 检查依赖
Write-Host "`n正在检查依赖..." -ForegroundColor Cyan
bundle check
if ($LASTEXITCODE -ne 0) {
    Write-Host "正在安装依赖..." -ForegroundColor Yellow
    bundle install
}

# 检查文件
Write-Host "`n正在检查关键文件..." -ForegroundColor Cyan
$files = @("_config.yml", "categories.html", "index.html", "_includes/header.html")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file 不存在" -ForegroundColor Red
    }
}

# 测试构建
Write-Host "`n正在测试构建..." -ForegroundColor Cyan
bundle exec jekyll build --trace 2>&1 | Select-Object -First 20

Write-Host "`n构建完成！" -ForegroundColor Green
Write-Host "`n启动服务器..." -ForegroundColor Cyan
Write-Host "访问地址: http://localhost:4000" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Gray

bundle exec jekyll serve --host 0.0.0.0 --port 4000




