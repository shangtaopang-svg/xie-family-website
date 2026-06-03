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

// ===== SHA256 pure JS =====
function sha256(str) {
  function rsh(n,x){for(var i=0;i<n;i++)x>>>=1;return x;}
  function rot(n,x){return(x>>>n)|(x<<(32-n));}
  function ch(x,y,z){return(x&y)^((~x)&z);}
  function maj(x,y,z){return(x&y)^(x&z)^(y&z);}
  function sigma0(x){return rot(2,x)^rot(13,x)^rot(22,x);}
  function sigma1(x){return rot(6,x)^rot(11,x)^rot(25,x);}
  function g0(x){return rot(7,x)^rot(18,x)^rsh(3,x);}
  function g1(x){return rot(17,x)^rot(19,x)^rsh(10,x);}
  var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  var len = str.length * 8;
  var msg = [];
  for(var i=0;i<str.length;i++) msg.push(str.charCodeAt(i));
  msg.push(0x80);
  while((msg.length*8)%512!==448) msg.push(0);
  msg.push(0);msg.push(0);msg.push(0);msg.push(0);
  msg.push((len/0x100000000)|0);msg.push(len&0xffffffff);
  for(var i=0;i<msg.length;i+=16){
    var W = [];
    for(var t=0;t<16;t++) W[t]=msg[i+t];
    for(var t=16;t<64;t++) W[t]=(g1(W[t-2])+W[t-7]+g0(W[t-15])+W[t-16])|0;
    var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
    for(var t=0;t<64;t++){
      var T1=(h+sigma1(e)+ch(e,f,g)+K[t]+W[t])|0;
      var T2=(sigma0(a)+maj(a,b,c))|0;
      h=g;g=f;f=e;e=(d+T1)|0;d=c;c=b;b=a;a=(T1+T2)|0;
    }
    H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;
    H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;
  }
  var hex='';
  for(var i=0;i<8;i++) hex+=('00000000'+H[i].toString(16)).slice(-8);
  return hex;
}

// ===== LOGIN SYSTEM =====
window.LOGIN_MODAL_HTML = [
'<div class="modal-overlay" id="login-overlay" style="display:none;">',
'  <div class="modal" style="max-width:380px;text-align:center;">',
'    <div style="font-size:48px;margin-bottom:8px;">🀄</div>',
'    <h3 style="margin-bottom:4px;font-family:var(--font-title);">宁海三中98届麻将交流群</h3>',
'    <p style="font-size:13px;color:var(--text-tertiary);margin-bottom:16px;">初始密码: 123456</p>',
'    <div class="form-group">',
'      <label style="text-align:left;display:block;">选择选手</label>',
'      <select class="form-input" id="login-player">',
'        <option value="">-- 请选择 --</option>',
'      </select>',
'    </div>',
'    <div class="form-group">',
'      <label style="text-align:left;display:block;">密码</label>',
'      <input class="form-input" type="password" id="login-password" placeholder="输入密码"',
'        onkeydown="if(event.key===\'Enter\')doLogin()">',
'    </div>',
'    <div id="login-error" style="color:var(--accent-red);font-size:13px;margin-bottom:8px;display:none;"></div>',
'    <button class="btn btn-primary" onclick="doLogin()" style="width:100%;justify-content:center;">登 录</button>',
'  </div>',
'</div>'].join('\\n');

function showLoginOverlay() {
  var overlay = document.getElementById('login-overlay');
  if (!overlay) {
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
    var hash = sha256(pwd);
    if (passwords[name] === hash) {
      localStorage.setItem('mj_player', name);
      errorEl.style.display = 'none';
      document.getElementById('login-overlay').style.display = 'none';
      showLoggedInUI(name);
      location.reload();
    } else {
      errorEl.textContent = '密码错误，请重试（初始密码: 123456）';
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
