# Stable and safe GitHub Pages push helper.
# Usage:
#   .\safe-push.ps1
#   .\safe-push.ps1 -Message "Update posts"
#   .\safe-push.ps1 -IncludeUntracked

[CmdletBinding()]
param(
    [string]$Message = "",
    [switch]$IncludeUntracked,
    [switch]$SkipPull
)

$ErrorActionPreference = "Stop"

function Write-Step($Text) {
    Write-Host "`n==> $Text" -ForegroundColor Cyan
}

function Write-Ok($Text) {
    Write-Host "[OK] $Text" -ForegroundColor Green
}

function Write-Warn($Text) {
    Write-Host "[WARN] $Text" -ForegroundColor Yellow
}

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    & git @Args
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Args -join ' ') failed"
    }
}

function Test-Port($HostName, $Port) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $async = $client.BeginConnect($HostName, $Port, $null, $null)
        if (-not $async.AsyncWaitHandle.WaitOne(2500, $false)) {
            $client.Close()
            return $false
        }
        $client.EndConnect($async)
        $client.Close()
        return $true
    } catch {
        return $false
    }
}

function Try-Push {
    Write-Step "Trying direct push"
    git config --local --unset http.proxy 2>$null
    git config --local --unset https.proxy 2>$null
    & git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Pushed directly"
        return $true
    }

    Write-Step "Trying common local proxies"
    $proxies = @(
        @{ Type = "http"; Port = 7890 },
        @{ Type = "socks5"; Port = 7891 },
        @{ Type = "http"; Port = 10809 },
        @{ Type = "socks5"; Port = 10808 },
        @{ Type = "http"; Port = 8080 },
        @{ Type = "socks5"; Port = 1080 }
    )

    foreach ($proxy in $proxies) {
        if (-not (Test-Port "127.0.0.1" $proxy.Port)) {
            continue
        }

        if ($proxy.Type -eq "socks5") {
            $proxyUrl = "socks5h://127.0.0.1:$($proxy.Port)"
        } else {
            $proxyUrl = "http://127.0.0.1:$($proxy.Port)"
        }

        Write-Warn "Detected proxy $proxyUrl, trying push"
        git config --local http.proxy $proxyUrl
        git config --local https.proxy $proxyUrl
        & git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Pushed via $proxyUrl"
            return $true
        }
    }

    return $false
}

Set-Location -LiteralPath $PSScriptRoot

Write-Step "Checking repository"
$branch = (& git branch --show-current).Trim()
if ($branch -ne "main") {
    throw "Current branch is '$branch'. Switch to main before pushing."
}

$remote = (& git remote get-url origin).Trim()
Write-Host "Branch: $branch"
Write-Host "Remote: $remote"

Write-Step "Checking for ignored sensitive files"
$sensitive = @(
    "douban_cookie_string.txt",
    "douban_cookies.json",
    "douban_import.log",
    "douban_notes.json",
    "douban_notes_converted.json",
    "douban_reviews.json",
    "douban_reviews_converted.json"
)
foreach ($file in $sensitive) {
    if (Test-Path -LiteralPath $file) {
        $ignored = (& git check-ignore $file 2>$null)
        if (-not $ignored) {
            throw "$file is not ignored. Refusing to continue."
        }
    }
}
Write-Ok "Sensitive Douban files are ignored"

Write-Step "Reviewing working tree"
$status = & git status --short
if ($status) {
    $status | ForEach-Object { Write-Host $_ }
} else {
    Write-Ok "No working tree changes"
}

if ($IncludeUntracked) {
    Write-Warn "Including untracked files, except ignored files"
    Invoke-Git add --all
} else {
    Write-Warn "Staging tracked changes only. Use -IncludeUntracked to add new files."
    Invoke-Git add --update
}

$stagedNames = & git diff --cached --name-only
if ($stagedNames) {
    $blockedPatterns = @(
        "douban_cookie_string.txt",
        "douban_cookies.json",
        "douban_import.log",
        "douban_notes.json",
        "douban_notes_converted.json",
        "douban_reviews.json",
        "douban_reviews_converted.json"
    )

    foreach ($name in $stagedNames) {
        foreach ($blocked in $blockedPatterns) {
            if ($name -eq $blocked) {
                Invoke-Git restore --staged -- $name
                throw "Blocked sensitive file from commit: $name"
            }
        }
    }

    Write-Step "Staged files"
    & git diff --cached --stat

    if ([string]::IsNullOrWhiteSpace($Message)) {
        $Message = Read-Host "Commit message"
        if ([string]::IsNullOrWhiteSpace($Message)) {
            $Message = "Update site content"
        }
    }

    Write-Step "Committing"
    Invoke-Git commit -m $Message
} else {
    Write-Ok "No staged changes to commit"
}

if (-not $SkipPull) {
    Write-Step "Rebasing on origin/main"
    Invoke-Git pull --rebase --autostash origin main
}

Write-Step "Pushing"
if (-not (Try-Push)) {
    throw "Push failed. Start your proxy or use push-helper.bat for SSH fallback diagnostics."
}

Write-Step "Done"
Invoke-Git status --branch --short
