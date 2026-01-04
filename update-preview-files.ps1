# 批量更新预览文件，删除登录相关内容

$previewFiles = Get-ChildItem preview*.html | Where-Object { $_.Name -ne "preview-login.html" -and $_.Name -ne "preview-admin.html" -and $_.Name -ne "preview-profile.html" }

foreach ($file in $previewFiles) {
    Write-Host "更新: $($file.Name)" -ForegroundColor Cyan
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 删除登录链接
    $content = $content -replace '<li class="nav-item">\s*<a href="preview-login\.html"[^>]*>登录</a>\s*</li>', ''
    
    # 删除用户菜单
    $content = $content -replace '<div class="header-right">\s*<div id="userMenu"[^>]*>.*?</div>\s*</div>', '' -replace '(?s)'
    
    # 删除 auth.js 引用
    $content = $content -replace '<script src="assets/js/auth\.js"></script>\s*', ''
    
    # 更新标题，添加 logo
    if ($content -notmatch 'site-logo') {
        $content = $content -replace '(<a href="[^"]*" class="site-title">)([^<]+)(</a>)', '$1<img src="favicon.ico" alt="Logo" class="site-logo" onerror="this.src=''ico.jpg''; this.onerror=null;"><span class="site-title-text">$2</span>$3'
    }
    
    # 更新导航菜单，删除"文章"，保留"分类"、"归档"、"关于"
    $content = $content -replace '<li class="nav-item">\s*<a href="preview-posts\.html"[^>]*>文章</a>\s*</li>', ''
    
    # 确保导航顺序正确
    $navPattern = '(?s)(<nav class="site-nav">\s*<ul class="nav-list">)(.*?)(</ul>\s*</nav>)'
    if ($content -match $navPattern) {
        $navContent = $matches[2]
        $newNav = @"
                        <li class="nav-item">
                            <a href="preview.html" class="nav-link">首页</a>
                        </li>
                        <li class="nav-item">
                            <a href="preview-categories.html" class="nav-link">分类</a>
                        </li>
                        <li class="nav-item">
                            <a href="preview-archive.html" class="nav-link">归档</a>
                        </li>
                        <li class="nav-item">
                            <a href="preview-about.html" class="nav-link">关于</a>
                        </li>
"@
        $content = $content -replace $navPattern, "`$1$newNav`$3"
    }
    
    # 保存文件
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    
    Write-Host "✓ 完成: $($file.Name)" -ForegroundColor Green
}

Write-Host "`n所有预览文件已更新！" -ForegroundColor Green

