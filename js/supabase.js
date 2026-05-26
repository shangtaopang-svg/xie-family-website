/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   数据存储客户端 — 本地服务器优先，Supabase 备份
   ============================================ */

// ===== 本地服务器 API（主存储，毫秒级响应） =====

async function serverGetAll(module) {
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, 10000);
  try {
    var res = await fetch('/api/data/' + module, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('serverGetAll ' + module + ': ' + res.status);
    return res.json();
  } catch(e) {
    clearTimeout(timer);
    // Retry once on failure
    var c2 = new AbortController();
    var t2 = setTimeout(function() { c2.abort(); }, 10000);
    try {
      var res2 = await fetch('/api/data/' + module, { signal: c2.signal });
      clearTimeout(t2);
      if (!res2.ok) throw new Error('serverGetAll retry ' + module + ': ' + res2.status);
      return res2.json();
    } catch(e2) {
      clearTimeout(t2);
      throw e2;
    }
  }
}

async function serverSaveAll(module, records) {
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, 10000);
  try {
    var res = await fetch('/api/data/' + module, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(records),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('serverSaveAll ' + module + ': ' + res.status);
    return res.json();
  } catch(e) {
    clearTimeout(timer);
    throw e;
  }
}

// ===== 从服务器加载所有模块数据到 localStorage =====
async function dbLoadAll() {
  var modules = ['reports', 'news', 'members', 'activities', 'honors', 'temple_carousel', 'photos', 'videos', 'messages', 'settings', 'genealogy'];
  // Load in batches of 3 to avoid overwhelming connections
  var total = 0;
  for (var i = 0; i < modules.length; i += 3) {
    var batch = modules.slice(i, i + 3);
    var results = await Promise.allSettled(batch.map(function(mod) {
      return serverGetAll(mod).then(function(data) {
        if (data && data.length > 0) {
          localStorage.setItem('xie_admin_' + mod, JSON.stringify(data));
          return data.length;
        }
        return 0;
      });
    }));
    for (var j = 0; j < results.length; j++) {
      if (results[j].status === 'fulfilled') {
        total += results[j].value || 0;
      } else {
        console.warn('Server load failed for ' + batch[j] + ':', results[j].reason);
      }
    }
  }
  return total;
}

// ===== 同步单个模块到服务器 =====
async function dbSyncModule(module, data) {
  return await serverSaveAll(module, data);
}

// ===== 获取单个模块数据（供页面使用） =====
async function dbGetAll(module, opts) {
  var data = await serverGetAll(module);
  // Apply ordering if requested
  if (opts && opts.order && data.length > 0) {
    var field = opts.order.replace(/\.(asc|desc)$/, '');
    var dir = opts.order.indexOf('desc') > -1 ? -1 : 1;
    data.sort(function(a, b) {
      if (a[field] < b[field]) return -1 * dir;
      if (a[field] > b[field]) return 1 * dir;
      return 0;
    });
  }
  return data;
}

// ===== 保留 Supabase 同步作为可选备份 =====
const SUPABASE_URL = 'https://vtrhbbdkojnyahumehfe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cmhiYmRrb2pueWFodW1laGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDUwMjIsImV4cCI6MjA5NTI4MTAyMn0.F8t14avrY3q-HliGR3sbaRUdIgZXdAtFE-koG_BDoQ0';

var API_BASE = SUPABASE_URL + '/rest/v1';

function supabaseHeaders(extra) {
  var h = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json'
  };
  if (extra) {
    for (var k in extra) h[k] = extra[k];
  }
  return h;
}

// Supabase 后台静默同步（不影响主流程）
async function dbSyncToSupabase(module) {
  var data = JSON.parse(localStorage.getItem('xie_admin_' + module) || '[]');
  if (!data.length) return;
  var table = module === 'templeCarousel' ? 'temple_carousel' : module;
  try {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 10000);
    var res = await fetch(API_BASE + '/' + table + '?on_conflict=id', {
      method: 'POST',
      headers: supabaseHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (res.ok) console.log('Supabase backup sync OK: ' + module);
  } catch(e) {
    // Silent fail — Supabase is optional backup
  }
}

// 后台同步所有数据到 Supabase（用户不感知）
function backgroundSyncToSupabase() {
  var modules = ['reports', 'news', 'members', 'activities', 'honors', 'temple_carousel', 'photos', 'videos', 'messages', 'settings', 'genealogy'];
  modules.forEach(function(mod) {
    setTimeout(function() { dbSyncToSupabase(mod); }, 1000);
  });
}

// ===== 保留旧 Supabase 函数引用（兼容性） =====
async function dbGetById(table, id) {
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, 5000);
  try {
    var res = await fetch(API_BASE + '/' + table + '?id=eq.' + id + '&select=*', {
      headers: supabaseHeaders(), signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('dbGetById ' + table + ': ' + res.status);
    var data = await res.json();
    return data[0] || null;
  } catch(e) {
    clearTimeout(timer);
    // Fall back to server data
    var allData = await serverGetAll(table);
    return allData.find(function(d) { return d.id == id; }) || null;
  }
}

async function dbInsert(table, record) {
  // Save locally via server
  var allData = await serverGetAll(table);
  allData.push(record);
  await serverSaveAll(table, allData);
  return record;
}

async function dbUpdate(table, id, record) {
  var allData = await serverGetAll(table);
  for (var i = 0; i < allData.length; i++) {
    if (allData[i].id == id) {
      for (var k in record) allData[i][k] = record[k];
      break;
    }
  }
  await serverSaveAll(table, allData);
  return record;
}

async function dbDelete(table, id) {
  var allData = await serverGetAll(table);
  allData = allData.filter(function(d) { return d.id != id; });
  await serverSaveAll(table, allData);
  return true;
}

async function dbUpsertAll(table, records) {
  return await serverSaveAll(table, records);
}

// ===== 暴露到全局 =====
window.dbGetAll = dbGetAll;
window.dbGetById = dbGetById;
window.dbInsert = dbInsert;
window.dbUpdate = dbUpdate;
window.dbDelete = dbDelete;
window.dbUpsertAll = dbUpsertAll;
window.dbLoadAll = dbLoadAll;
window.dbSyncModule = dbSyncModule;
window.backgroundSyncToSupabase = backgroundSyncToSupabase;
