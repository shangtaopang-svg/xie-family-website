/* ============================================
   麻将朋友圈 — 通用工具
   ============================================ */

// API helper — works with server.js /api/data/* endpoints
window.api = {
  base: '/api/data/',
  async get(module) {
    var res = await fetch(this.base + module);
    return res.json();
  },
  async save(module, data) {
    var res = await fetch(this.base + module, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

// Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Toast notification
function showToast(msg, type) {
  type = type || 'success';
  var el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 2500);
}

// Format date
function fmtDate(d) {
  if (!d) return '';
  var date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

// Get all unique player names from records
async function getAllPlayers() {
  try {
    var records = await api.get('records');
    var names = {};
    (records || []).forEach(function(r) {
      (r.players || []).forEach(function(p) {
        if (p.name && p.name.trim()) names[p.name.trim()] = true;
      });
    });
    return Object.keys(names).sort();
  } catch(e) { return []; }
}


// Default players for Ninghai No.3 High School 1998 class
window.DEFAULT_PLAYERS = ["王建军", "邵伟军", "冯善雷", "庞尚韬", "冯悦", "张展", "张林松", "张和翔", "张文杰"];
