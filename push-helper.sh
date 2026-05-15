#!/bin/bash
# GitHub 推送助手
# 自动检测本地代理并切换，解决 GitHub 推送不稳定问题

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "      GitHub 推送助手"
echo "========================================"

# 1. 检查待推送的提交
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null || echo "")

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    echo -e "${GREEN}本地与远程一致，无需推送。${NC}"
    exit 0
fi

echo "待推送提交: $(git log --oneline -1 HEAD)"
echo ""

# 2. 检测 GitHub 443 连通性
check_github() {
    timeout 8 bash -c 'exec 3<>/dev/tcp/github.com/443' 2>/dev/null
}

# 3. 检测本地常见代理端口
# 返回格式: "类型 地址 端口"
detect_proxy() {
    local ports=("7890" "7891" "10809" "10808" "1080" "8080" "7070" "6152")
    for port in "${ports[@]}"; do
        # 检测 SOCKS5
        if timeout 2 bash -c "exec 3<>/dev/tcp/127.0.0.1/$port" 2>/dev/null; then
            # 简单验证是否为代理（尝试连接 GitHub）
            if curl -s --socks5-hostname "127.0.0.1:$port" -o /dev/null --connect-timeout 5 https://github.com 2>/dev/null; then
                echo "socks5 127.0.0.1 $port"
                return 0
            fi
        fi
        # 检测 HTTP 代理
        if timeout 2 bash -c "exec 3<>/dev/tcp/127.0.0.1/$port" 2>/dev/null; then
            if curl -s -x "http://127.0.0.1:$port" -o /dev/null --connect-timeout 5 https://github.com 2>/dev/null; then
                echo "http 127.0.0.1 $port"
                return 0
            fi
        fi
    done
    return 1
}

# 4. 使用代理推送
push_with_proxy() {
    local proxy_type=$1
    local proxy_host=$2
    local proxy_port=$3

    if [ "$proxy_type" = "socks5" ]; then
        git config --local http.proxy "socks5h://${proxy_host}:${proxy_port}"
        git config --local https.proxy "socks5h://${proxy_host}:${proxy_port}"
        echo -e "${YELLOW}已配置 SOCKS5 代理: ${proxy_host}:${proxy_port}${NC}"
    else
        git config --local http.proxy "http://${proxy_host}:${proxy_port}"
        git config --local https.proxy "http://${proxy_host}:${proxy_port}"
        echo -e "${YELLOW}已配置 HTTP 代理: ${proxy_host}:${proxy_port}${NC}"
    fi

    echo "正在推送..."
    if git push origin main; then
        echo -e "${GREEN}推送成功！${NC}"
        # 可选：推送后清除代理配置（取消注释下行则启用）
        # git config --local --unset http.proxy 2>/dev/null || true
        # git config --local --unset https.proxy 2>/dev/null || true
        return 0
    else
        return 1
    fi
}

# 5. 直接推送
push_direct() {
    echo "尝试直接推送..."
    # 清除可能存在的代理配置
    git config --local --unset http.proxy 2>/dev/null || true
    git config --local --unset https.proxy 2>/dev/null || true

    if git push origin main; then
        echo -e "${GREEN}直接推送成功！${NC}"
        return 0
    else
        return 1
    fi
}

# 6. 使用 SSH 备用推送
push_ssh() {
    local ssh_url="git@github.com:gonghejian/gonghejian.github.io.git"
    echo -e "${YELLOW}尝试通过 SSH 推送...${NC}"
    # 临时修改 remote 为 SSH
    git remote set-url origin "$ssh_url"
    if git push origin main; then
        echo -e "${GREEN}SSH 推送成功！${NC}"
        # 恢复 HTTPS（可选）
        # git remote set-url origin "https://github.com/gonghejian/gonghejian.github.io.git"
        return 0
    else
        # 恢复 HTTPS
        git remote set-url origin "https://github.com/gonghejian/gonghejian.github.io.git"
        return 1
    fi
}

# ========== 主逻辑 ==========

# 先尝试直接推送
echo "[1/3] 检测 GitHub 直接连通性..."
if check_github; then
    echo -e "${GREEN}GitHub 443 端口可达。${NC}"
    if push_direct; then
        exit 0
    fi
else
    echo -e "${RED}GitHub 443 端口连接超时。${NC}"
fi

# 检测本地代理
echo ""
echo "[2/3] 检测本地代理..."
PROXY_INFO=$(detect_proxy)
if [ -n "$PROXY_INFO" ]; then
    read -r PTYPE PHOST PPORT <<< "$PROXY_INFO"
    echo -e "${GREEN}检测到本地代理: ${PTYPE}://${PHOST}:${PPORT}${NC}"
    if push_with_proxy "$PTYPE" "$PHOST" "$PPORT"; then
        exit 0
    fi
else
    echo -e "${RED}未检测到可用的本地代理。${NC}"
    echo "常见代理端口检测: 7890/7891(Clash) 10809/10808(V2RayN) 1080/8080"
fi

# 尝试 SSH 备用
echo ""
echo "[3/3] 尝试 SSH 备用通道..."
if push_ssh; then
    exit 0
fi

echo ""
echo -e "${RED}========================================${NC}"
echo -e "${RED}  所有推送方式均失败${NC}"
echo -e "${RED}========================================${NC}"
echo ""
echo "可能的原因及解决方案："
echo "1. 网络完全中断 → 检查 WiFi/网线连接"
echo "2. GitHub 被封锁 → 开启 Clash/V2Ray 等代理工具后重试"
echo "3. 代理已开启但脚本未识别 → 手动设置代理:"
echo "   git config --local http.proxy http://127.0.0.1:7890"
echo "   git config --local https.proxy http://127.0.0.1:7890"
echo "4. SSH 未配置密钥 → 运行: ssh-keygen -t ed25519 -C '你的邮箱'"
echo "   然后将 ~/.ssh/id_ed25519.pub 添加到 GitHub Settings -> SSH Keys"
echo ""
echo "当前 git remote:"
git remote -v
exit 1
