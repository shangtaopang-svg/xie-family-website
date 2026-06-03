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

// ===== LOGIN SYSTEM =====
// Each player has own password, stored in data/passwords.json (SHA256)

window.LOGIN_MODAL_HTML = `
<div class="modal-overlay" id="login-overlay" style="display:none;">
  <div class="modal" style="max-width:380px;text-align:center;">
    <div style="font-size:48px;margin-bottom:8px;">🀄</div>
    <h3 style="margin-bottom:4px;font-family:var(--font-title);">宁海三中98届麻将交流群</h3>
    <p style="font-size:13px;color:var(--text-tertiary);margin-bottom:16px;">请登录后查看个人数据</p>
    <div class="form-group">
      <label>选择选手</label>
      <select class="form-input" id="login-player">
        <option value="">-- 请选择 --</option>
      </select>
    </div>
    <div class="form-group">
      <label>密码</label>
      <input class="form-input" type="password" id="login-password" placeholder="输入密码"
        onkeydown="if(event.key==='Enter')doLogin()">
    </div>
    <div id="login-error" style="color:var(--accent-red);font-size:13px;margin-bottom:8px;display:none;"></div>
    <button class="btn btn-primary" onclick="doLogin()" style="width:100%;justify-content:center;">登 录</button>
  </div>
</div>`;

// Init auth: check if user is already logged in
function initAuth() {
  var player = localStorage.getItem('mj_player');
  if (player) {
    showLoggedInUI(player);
    return true;
  }
  showLoginOverlay();
  return false;
}

function showLoginOverlay() {
  // Populate player list
  var overlay = document.getElementById('login-overlay');
  if (!overlay) {
    // First time: inject modal HTML
    var div = document.createElement('div');
    div.innerHTML = window.LOGIN_MODAL_HTML;
    document.body.appendChild(div.firstElementChild);
    overlay = document.getElementById('login-overlay');
  }
  var select = document.getElementById('login-player');
  if (select && !select.options.length) {
    var players = window.DEFAULT_PLAYERS || [];
    players.forEach(function(name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
  }
  overlay.style.display = 'flex';
}

async function doLogin() {
  var name = document.getElementById('login-player').value;
  var pwd = document.getElementById('login-password').value;
  var errorEl = document.getElementById('login-error');
  if (!name || !pwd) {
    errorEl.textContent = '请选择选手并输入密码';
    errorEl.style.display = 'block';
    return;
  }
  try {
    var passwords = await api.get('passwords') || {};
    var hash = '';
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      var enc = new TextEncoder();
      var buf = await crypto.subtle.digest('SHA-256', enc.encode(pwd));
      var arr = Array.from(new Uint8Array(buf));
      hash = arr.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    } else {
      // Fallback: simple hash
      var h = 0;
      for (var i = 0; i < pwd.length; i++) {
        h = ((h << 5) - h) + pwd.charCodeAt(i);
        h |= 0;
      }
      hash = 'simple_' + Math.abs(h);
    }
    if (passwords[name] === hash) {
      localStorage.setItem('mj_player', name);
      errorEl.style.display = 'none';
      document.getElementById('login-overlay').style.display = 'none';
      showLoggedInUI(name);
      // Reload page data for logged-in view
      if (typeof onLogin === 'function') onLogin(name);
      else location.reload();
    } else {
      errorEl.textContent = '密码错误，请重试';
      errorEl.style.display = 'block';
    }
  } catch(e) {
    errorEl.textContent = '登录服务异常，请稍后重试';
    errorEl.style.display = 'block';
  }
}

function showLoggedInUI(name) {
  var btn = document.getElementById('auth-btn');
  if (btn) {
    btn.innerHTML = escapeHtml(name) + ' <span style="font-size:11px;">▼</span>';
    btn.onclick = function() { toggleUserMenu(); };
    btn.style.background = 'var(--accent-orange-dim)';
    btn.style.color = 'var(--accent-orange)';
    btn.style.borderColor = 'var(--accent-orange)';
  }
}

function toggleUserMenu() {
  var menu = document.getElementById('user-menu');
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    return;
  }
  var player = localStorage.getItem('mj_player');
  var div = document.createElement('div');
  div.id = 'user-menu';
  div.style.cssText = 'position:absolute;top:100%;right:0;background:var(--bg-primary);border:1px solid var(--glass-border);border-radius:10px;padding:8px;box-shadow:0 8px 30px rgba(0,0,0,0.12);z-index:100;min-width:150px;margin-top:4px;';
  div.innerHTML =
    '<div style="padding:6px 10px;font-size:13px;font-weight:600;border-bottom:1px solid var(--divider);margin-bottom:4px;">' + escapeHtml(player) + '</div>' +
    '<button class="btn btn-outline btn-sm" onclick="location.reload()" style="width:100%;margin-bottom:4px;">刷新</button>' +
    '<button class="btn btn-danger btn-sm" onclick="logout()" style="width:100%;">退出登录</button>';
  document.body.appendChild(div);
  // Position below the auth button
  var btn = document.getElementById('auth-btn');
  if (btn) {
    var rect = btn.getBoundingClientRect();
    div.style.top = (rect.bottom + 4) + 'px';
    div.style.right = (window.innerWidth - rect.right) + 'px';
  }
  // Close on click outside
  setTimeout(function() {
    document.addEventListener('click', function closeMenu(e) {
      if (!div.contains(e.target) && e.target.id !== 'auth-btn') {
        div.style.display = 'none';
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 10);
}

function logout() {
  localStorage.removeItem('mj_player');
  var menu = document.getElementById('user-menu');
  if (menu) menu.remove();
  location.reload();
}

// Auto-init on page load
document.addEventListener('DOMContentLoaded', function() {
  var player = localStorage.getItem('mj_player');
  if (player) {
    showLoggedInUI(player);
  } else {
    // Only show login overlay on pages that need it
    if (document.querySelector('[data-require-auth]')) {
      showLoginOverlay();
    }
  }
});


// ===== AVATAR SYSTEM =====
// Each player gets a unique avatar based on their nickname/personality
window.PLAYER_AVATARS = {
  "王建军": { emoji: "🐰", color: "#ffd700", bg: "linear-gradient(135deg,#ffd700,#f9a825)", nick: "卯兔" },
  "邵伟军": { emoji: "🦍", color: "#8B4513", bg: "linear-gradient(135deg,#8B4513,#654321)", nick: "猩猩" },
  "冯善雷": { emoji: "🐍", color: "#4ade80", bg: "linear-gradient(135deg,#2e7d32,#4ade80)", nick: "蛇" },
  "庞尚韬": { emoji: "🤝", color: "#22d3ee", bg: "linear-gradient(135deg,#0891b2,#22d3ee)", nick: "可与" },
  "冯悦":   { emoji: "🐸", color: "#4ade80", bg: "linear-gradient(135deg,#16a34a,#4ade80)", nick: "青蛙" },
  "张展":   { emoji: "🐱", color: "#f97316", bg: "linear-gradient(135deg,#ea580c,#f97316)", nick: "展昭" },
  "张林松": { emoji: "🌲", color: "#34d399", bg: "linear-gradient(135deg,#047857,#34d399)", nick: "" },
  "张和翔": { emoji: "🐻", color: "#f97316", bg: "linear-gradient(135deg,#c2410c,#f97316)", nick: "胖子" },
  "张文杰": { emoji: "⭐", color: "#a78bfa", bg: "linear-gradient(135deg,#7c3aed,#a78bfa)", nick: "德杰" },
};

// Get avatar data for a player
function getAvatar(name) {
  var data = window.PLAYER_AVATARS[name];
  if (data) return data;
  var colors = ["#ff6b00","#22d3ee","#4ade80","#fbbf24","#a78bfa","#f87171","#34d399","#f97316"];
  var hash = 0;
  for (var i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  var c = colors[Math.abs(hash) % colors.length];
  return { emoji: "🎵", color: c, bg: "linear-gradient(135deg," + c + "," + c + "cc)", nick: "" };
}

// Render avatar HTML for a player
function avatarHtml(name, size) {
  size = size || 32;
  var a = getAvatar(name);
  var fontSize = Math.round(size * 0.45);
  return '<div class="player-avatar" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + a.bg + ';display:inline-flex;align-items:center;justify-content:center;font-size:' + fontSize + 'px;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.1);" title="' + escapeHtml(name) + (a.nick ? ' (' + a.nick + ')' : '') + '">' + a.emoji + '</div>';
}

// Render player name with avatar
function playerWithAvatar(name, size) {
  size = size || 24;
  var fontSize = Math.round(size * 0.4);
  return '<span style="display:inline-flex;align-items:center;gap:6px;">' +
    '<div class="player-avatar" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + getAvatar(name).bg + ';display:inline-flex;align-items:center;justify-content:center;font-size:' + fontSize + 'px;flex-shrink:0;">' + getAvatar(name).emoji + '</div>' +
    escapeHtml(name) +
  '</span>';
}
