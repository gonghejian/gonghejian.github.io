@echo off
chcp 65001 > nul
title GitHub 推送助手
echo ========================================
echo       GitHub 推送助手
echo ========================================
echo.

set REPO_DIR=%~dp0
cd /d "%REPO_DIR%"

REM 检查是否有未推送的提交
for /f "tokens=*" %%a in ('git rev-parse HEAD') do set LOCAL_COMMIT=%%a
for /f "tokens=*" %%a in ('git rev-parse origin/main 2^>nul') do set REMOTE_COMMIT=%%a

if "%LOCAL_COMMIT%"=="%REMOTE_COMMIT%" (
    echo [OK] 本地与远程一致，无需推送。
    pause
    exit /b 0
)

echo 待推送提交:
git log --oneline -1 HEAD
echo.

REM 测试 GitHub 443 连通性
echo [1/3] 检测 GitHub 直接连通性...
timeout /t 1 > nul

powershell -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('github.com', 443); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel% == 0 (
    echo [OK] GitHub 443 端口可达，尝试直接推送...
    git config --local --unset http.proxy 2> nul
    git config --local --unset https.proxy 2> nul
    git push origin main
    if %errorlevel% == 0 (
        echo [OK] 直接推送成功！
        pause
        exit /b 0
    )
) else (
    echo [X] GitHub 443 端口连接超时。
)

echo.
echo [2/3] 检测本地代理...

REM 检测常见代理端口
set PROXY_FOUND=0
set PROXY_TYPE=
set PROXY_PORT=

REM Clash HTTP 代理
powershell -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1', 7890); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel% == 0 (
    echo [OK] 检测到 Clash HTTP 代理 (127.0.0.1:7890)
    set PROXY_FOUND=1
    set PROXY_TYPE=http
    set PROXY_PORT=7890
    goto :DO_PUSH
)

REM Clash SOCKS5 代理
powershell -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1', 7891); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel% == 0 (
    echo [OK] 检测到 Clash SOCKS5 代理 (127.0.0.1:7891)
    set PROXY_FOUND=1
    set PROXY_TYPE=socks5
    set PROXY_PORT=7891
    goto :DO_PUSH
)

REM V2RayN HTTP 代理
powershell -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1', 10809); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel% == 0 (
    echo [OK] 检测到 V2RayN HTTP 代理 (127.0.0.1:10809)
    set PROXY_FOUND=1
    set PROXY_TYPE=http
    set PROXY_PORT=10809
    goto :DO_PUSH
)

REM V2RayN SOCKS5 代理
powershell -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1', 10808); $c.Close(); exit 0 } catch { exit 1 }"
if %errorlevel% == 0 (
    echo [OK] 检测到 V2RayN SOCKS5 代理 (127.0.0.1:10808)
    set PROXY_FOUND=1
    set PROXY_TYPE=socks5
    set PROXY_PORT=10808
    goto :DO_PUSH
)

echo [X] 未检测到本地代理。
echo     常见代理: Clash (7890/7891), V2RayN (10809/10808)
echo.

:DO_PUSH
if %PROXY_FOUND% == 1 (
    if "%PROXY_TYPE%"=="socks5" (
        echo [INFO] 正在配置 SOCKS5 代理...
        git config --local http.proxy socks5h://127.0.0.1:%PROXY_PORT%
        git config --local https.proxy socks5h://127.0.0.1:%PROXY_PORT%
    ) else (
        echo [INFO] 正在配置 HTTP 代理...
        git config --local http.proxy http://127.0.0.1:%PROXY_PORT%
        git config --local https.proxy http://127.0.0.1:%PROXY_PORT%
    )

    echo [INFO] 正在通过代理推送...
    git push origin main
    if %errorlevel% == 0 (
        echo [OK] 代理推送成功！
        pause
        exit /b 0
    ) else (
        echo [X] 代理推送也失败了。
    )
)

echo.
echo [3/3] 尝试 SSH 备用通道...
git remote set-url origin git@github.com:gonghejian/gonghejian.github.io.git
git push origin main
if %errorlevel% == 0 (
    echo [OK] SSH 推送成功！
    pause
    exit /b 0
) else (
    git remote set-url origin https://github.com/gonghejian/gonghejian.github.io.git
)

echo.
echo ========================================
echo   所有推送方式均失败
echo ========================================
echo.
echo 可能的原因及解决方案：
echo 1. 网络完全中断 ^-^> 检查 WiFi/网线连接
echo 2. GitHub 被封锁 ^-^> 开启 Clash/V2Ray 等代理工具后重试
echo 3. 代理已开启但脚本未识别 ^-^> 手动设置代理:
echo    git config --local http.proxy http://127.0.0.1:7890
echo    git config --local https.proxy http://127.0.0.1:7890
echo 4. SSH 未配置密钥 ^-^> 运行: ssh-keygen -t ed25519 -C "你的邮箱"
echo    然后将 ~/.ssh/id_ed25519.pub 添加到 GitHub Settings ^-^> SSH Keys
echo.
echo 当前 git remote:
git remote -v
pause
exit /b 1
