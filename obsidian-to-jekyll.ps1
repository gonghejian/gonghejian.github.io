# Obsidian 转 Jekyll 文章脚本
# 使用方法：.\obsidian-to-jekyll.ps1 -Title "标题" -Category "分类" -Tags "标签1,标签2" [-ObsidianFile "文件路径"]

param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Category,
    
    [Parameter(Mandatory=$false)]
    [string]$Tags = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ObsidianFile = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Author = $env:USERNAME,
    
    [Parameter(Mandatory=$false)]
    [string]$Description = ""
)

# 检查 _posts 目录
$postsDir = "_posts"
if (-not (Test-Path $postsDir)) {
    Write-Host "创建 _posts 目录..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $postsDir | Out-Null
}

# 生成安全文件名
$safeTitle = $Title -replace '[^\w\s-]', '' -replace '\s+', '-'
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm:ss"
$filename = "$date-$safeTitle.md"
$filepath = Join-Path $postsDir $filename

# 检查文件是否已存在
if (Test-Path $filepath) {
    $overwrite = Read-Host "文件已存在，是否覆盖？(y/n)"
    if ($overwrite -ne "y") {
        Write-Host "已取消" -ForegroundColor Yellow
        exit
    }
}

# 读取 Obsidian 文件内容（如果有）
$content = ""
if ($ObsidianFile -and (Test-Path $ObsidianFile)) {
    Write-Host "读取 Obsidian 文件: $ObsidianFile" -ForegroundColor Cyan
    $content = Get-Content $ObsidianFile -Raw -Encoding UTF8
    
    # 移除 Obsidian Front Matter（如果存在）
    if ($content -match '^---\s*\r?\n(.*?)\r?\n---\s*\r?\n(.*)$') {
        $obsidianFrontMatter = $matches[1]
        $content = $matches[2]
        
        # 尝试从 Obsidian Front Matter 提取信息
        if ($obsidianFrontMatter -match 'title:\s*(.+)') {
            $Title = $matches[1].Trim()
        }
        if ($obsidianFrontMatter -match 'tags:\s*(.+)') {
            $Tags = $matches[1].Trim() -replace '\[|\]', ''
        }
        if ($obsidianFrontMatter -match 'description:\s*(.+)') {
            $Description = $matches[1].Trim()
        }
    }
    
    # 转换 Obsidian 内部链接格式 [[链接]] -> [链接](/path)
    $content = $content -replace '\[\[([^\]]+)\]\]', '[${1}](/posts/${1}/)'
    
    # 转换 Obsidian 图片格式 ![[image.png]] -> ![alt](/assets/images/image.png)
    $content = $content -replace '!\[\[([^\]]+)\]\]', '![${1}](/assets/images/${1})'
} else {
    # 如果没有提供文件，创建空内容
    $content = "# $Title`n`n在这里开始写作...`n"
}

# 构建 Front Matter
$frontMatter = "---`n"
$frontMatter += "layout: post`n"
$frontMatter += "title: `"$Title`"`n"
$frontMatter += "date: $date $time +0800`n"
$frontMatter += "categories: [$Category]`n"
if ($Tags) {
    $frontMatter += "tags: [$Tags]`n"
}
if ($Author) {
    $frontMatter += "author: $Author`n"
}
if ($Description) {
    $frontMatter += "description: `"$Description`"`n"
}
$frontMatter += "---`n`n"

# 写入文件
$fullContent = $frontMatter + $content
$fullContent | Out-File -FilePath $filepath -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "✅ 文章已创建：" -ForegroundColor Green
Write-Host "   文件路径: $filepath" -ForegroundColor Cyan
Write-Host "   标题: $Title" -ForegroundColor Cyan
Write-Host "   分类: $Category" -ForegroundColor Cyan
if ($Tags) {
    Write-Host "   标签: $Tags" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "下一步：" -ForegroundColor Yellow
Write-Host "1. 编辑文章: code $filepath" -ForegroundColor Gray
Write-Host "2. 预览: bundle exec jekyll serve" -ForegroundColor Gray
Write-Host "3. 提交: git add $filepath" -ForegroundColor Gray
