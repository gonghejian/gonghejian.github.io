# 测试 Jekyll 构建
Write-Host "检查 Jekyll 环境..." -ForegroundColor Yellow

# 检查 Ruby
try {
    $rubyVersion = ruby -v 2>&1
    Write-Host "Ruby: $rubyVersion" -ForegroundColor Green
} catch {
    Write-Host "Ruby 未安装或不在 PATH 中" -ForegroundColor Red
    exit 1
}

# 检查 Bundle
try {
    $bundleVersion = bundle -v 2>&1
    Write-Host "Bundler: $bundleVersion" -ForegroundColor Green
} catch {
    Write-Host "Bundler 未安装，尝试安装..." -ForegroundColor Yellow
    gem install bundler
}

# 检查 categories.html
if (Test-Path "categories.html") {
    Write-Host "✓ categories.html 文件存在" -ForegroundColor Green
} else {
    Write-Host "✗ categories.html 文件不存在" -ForegroundColor Red
}

# 检查 _config.yml
if (Test-Path "_config.yml") {
    Write-Host "✓ _config.yml 文件存在" -ForegroundColor Green
    $config = Get-Content "_config.yml" -Raw
    if ($config -match "categories\.html") {
        Write-Host "✓ _config.yml 中包含 categories.html 配置" -ForegroundColor Green
    } else {
        Write-Host "✗ _config.yml 中未找到 categories.html 配置" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ _config.yml 文件不存在" -ForegroundColor Red
}

Write-Host "`n尝试构建 Jekyll..." -ForegroundColor Yellow
bundle exec jekyll build --trace 2>&1 | Select-Object -First 50

