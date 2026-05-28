#!/bin/bash
# Deploy script for xie-family-website
# Usage: ./deploy.sh
set -e
cd /opt/xie-family-v2
git pull origin master
pm2 restart xie-family
echo Deploy complete!
