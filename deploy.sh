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

echo "[deploy] Restarting PM2..."
pm2 restart xie-family 2>&1
echo "[deploy] Deploy complete!"
