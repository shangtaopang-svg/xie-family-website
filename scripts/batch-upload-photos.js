/**
 * 活动照片批量上传工具
 * 用法: node scripts/batch-upload-photos.js <活动ID> <照片目录>
 *
 * 示例: node scripts/batch-upload-photos.js 1 "活动照片/清明祭祖"
 *
 * 流程:
 * 1. 读取指定目录下的所有图片文件
 * 2. 逐个上传到服务器
 * 3. 获取URL后写入活动数据的 photos 字段
 * 4. 保存到服务器
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER = '8.160.117.120';
const PORT = 80;

const activityId = parseInt(process.argv[2]);
const photoDir = process.argv[3];

if (!activityId || !photoDir) {
  console.log('用法: node scripts/batch-upload-photos.js <活动ID> <照片目录>');
  console.log('示例: node scripts/batch-upload-photos.js 1 "活动照片/清明祭祖"');
  process.exit(1);
}

const dir = path.resolve(__dirname, '..', photoDir);
if (!fs.existsSync(dir)) {
  console.error('目录不存在:', dir);
  process.exit(1);
}

function httpRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: SERVER, port: PORT, path: urlPath, method: method, headers: {} };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(body);
    }
    const req = http.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg','.jpeg','.png','.webp','.gif','.bmp'].includes(ext)) {
      return resolve(null);
    }
    const data = fs.readFileSync(filePath);
    const base64 = data.toString('base64');
    const mimeMap = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.bmp':'image/bmp' };
    const mime = mimeMap[ext] || 'image/jpeg';
    const dataUrl = `data:${mime};base64,${base64}`;
    const name = 'batch_' + Date.now() + '_' + path.basename(filePath);

    const opts = {
      hostname: SERVER, port: PORT,
      path: '/api/upload',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const body = JSON.stringify({ name, data: dataUrl });
    opts.headers['Content-Length'] = Buffer.byteLength(body);

    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(d);
          if (r && r.url) resolve(r.url);
          else reject(new Error('Upload returned no URL: ' + d));
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Step 1: Get current activities
  console.log('获取当前活动数据...');
  const activities = await httpRequest('GET', '/api/data/activities');
  let dataArr = Array.isArray(activities) ? activities : null;
  if (!dataArr) {
    console.error('无法获取活动数据，返回:', JSON.stringify(activities).slice(0,200));
    process.exit(1);
  }

  const activity = dataArr.find(a => a.id === activityId);
  if (!activity) {
    console.error('未找到活动 ID:', activityId);
    console.log('现有活动:');
    dataArr.forEach(a => console.log('  ID:', a.id, '|', a.title));
    process.exit(1);
  }

  console.log('找到活动:', activity.title);

  // Step 2: Read photo files
  const files = fs.readdirSync(dir).sort();
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(f));
  if (imageFiles.length === 0) {
    console.error('目录中没有图片文件:', dir);
    process.exit(1);
  }

  console.log('找到', imageFiles.length, '张照片，开始上传...');

  // Step 3: Upload each file
  let photos = activity.photos || [];
  if (typeof photos === 'string') { try { photos = JSON.parse(photos); } catch(e) { photos = []; } }

  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = path.join(dir, imageFiles[i]);
    console.log('  [' + (i+1) + '/' + imageFiles.length + ']', imageFiles[i], '...');
    try {
      const url = await uploadFile(filePath);
      if (url) {
        photos.push(url);
        console.log('    ✓', url);
      }
    } catch(err) {
      console.error('    ✗ 上传失败:', err.message);
    }
  }

  // Step 4: Update activity data
  activity.photos = photos;
  console.log('\n共上传 ' + photos.length + ' 张照片，保存到服务器...');

  const result = await httpRequest('POST', '/api/data/activities', JSON.stringify(dataArr));
  console.log('保存结果:', result ? '✓ 成功' : '✗ 失败');

  console.log('\n完成！活动 "' + activity.title + '" 现有 ' + photos.length + ' 张照片。');
  console.log('访问 http://' + SERVER + '/pages/activities.html 查看效果');
}

main().catch(err => { console.error('出错:', err); process.exit(1); });
