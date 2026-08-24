#!/bin/bash
# Deploy script for xie-family-website
# Usage: ./deploy.sh
set -e

DIR="/opt/xie-family-v2"
echo "[deploy] Starting deploy at $(date)"

if [ ! -d "$DIR" ]; then
  echo "[deploy] ERROR: Directory $DIR does not exist"
  exit 1
fi

cd "$DIR"
echo "[deploy] In directory: $(pwd)"

# Try HTTPS git pull as fallback if SSH fails
echo "[deploy] Pulling latest code..."
git pull origin master 2>&1 || {
  echo "[deploy] SSH pull failed, trying HTTPS..."
  git remote set-url origin https://github.com/shangtaopang-svg/xie-family-website.git
  git pull origin master
  git remote set-url origin git@github.com:shangtaopang-svg/xie-family-website.git
}

# 旧族谱快照可能曾由历史版本以 gitignored 文件写入网站目录，
# 即使新代码不再引用，Nginx 仍会直接把它们作为静态文件公开。
# 先移到网站目录之外保存，再继续部署；唯一活跃数据 data/genealogy.json 不移动。
LEGACY_DIR="/opt/xie-family-v2-legacy-backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$LEGACY_DIR"
find "$DIR/data" -maxdepth 1 -type f \( \
  -name 'genealogy_full.json' -o \
  -name 'genealogy_*backup*.json' -o \
  -name 'genealogy_backup*.json' -o \
  -name 'genealogy_pre_*.json' -o \
  -name 'genealogy_prod_backup*.json' -o \
  -name 'final_genealogy.json' -o \
  -name '_supa_*.json' \
\) -print -exec mv {} "$LEGACY_DIR/" \;
echo "[deploy] Legacy genealogy snapshots isolated at $LEGACY_DIR"

echo "[deploy] Ensuring genealogy canonical data..."
node scripts/ensure-canonical-genealogy.js

echo "[deploy] Restarting PM2..."
pm2 restart xie-family 2>&1
echo "[deploy] Deploy complete!"
