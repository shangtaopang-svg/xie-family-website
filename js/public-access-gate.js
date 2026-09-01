(function () {
  'use strict';

  var CONSENT_VERSION = 'privacy-v4-20260827';
  var SESSION_KEY = 'xie_public_access_v2';
  var ADMIN_TOKEN_KEY = 'xie_admin_token';
  var AI_TOKEN_KEY = 'ai_admin_token';
  var TRUST_VERSION = 'trusted-device-v1';
  var TRUSTED_DEVICE_TTL = 365 * 864e5;
  var state = { step: 'consent', role: '', provider: 'phone', authenticated: false };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch];
    });
  }
  function readSession() {
    var session = null;
    var persistent = null;
    var cookieSession = null;
    try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (e) {}
    if (sessionUsable(session)) return rememberTrustedSession(session);
    // 页面跳转通常会保留 sessionStorage；localStorage 作为同一浏览器的兜底，
    // 避免重复打开族谱页或新标签页时再次要求验证。
    try { persistent = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) {}
    if (sessionUsable(persistent)) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(persistent)); } catch (e) {}
      return rememberTrustedSession(persistent);
    }
    try {
      var cookieMatch = document.cookie.match(new RegExp('(?:^|;\\s*)' + SESSION_KEY.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '=([^;]*)'));
      if (cookieMatch) cookieSession = JSON.parse(decodeURIComponent(cookieMatch[1]));
    } catch (e) {}
    if (sessionUsable(cookieSession)) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(cookieSession)); } catch (e) {}
      try { localStorage.setItem(SESSION_KEY, JSON.stringify(cookieSession)); } catch (e) {}
      return rememberTrustedSession(cookieSession);
    }
    return session || persistent || cookieSession;
  }
  // 管理员完成手机号校验后同样应记住本机，避免每次打开手机端都重复验证。
  // 清除“本机信任”或主动退出后，才重新要求身份确认。
  function trustedRole(role) { return role === 'visitor' || role === 'clan' || role === 'admin'; }
  function sessionValid(session) {
    if (!session) return false;
    var now = Date.now();
    var normalValid = session.expiresAt && Number(session.expiresAt) > now;
    var trustedValid = trustedRole(session.role)
      && session.trusted === true
      && session.trustVersion === TRUST_VERSION
      && session.trustedUntil
      && Number(session.trustedUntil) > now;
    return !!(normalValid || trustedValid);
  }
  function sessionUsable(session) { return !!(sessionValid(session) && session.consentVersion === CONSENT_VERSION && session.role); }
  function validSession() {
    return sessionUsable(readSession());
  }
  function rememberTrustedSession(session) {
    if (!sessionUsable(session) || !trustedRole(session.role)) return session;
    var now = Date.now();
    if (session.trusted === true && session.trustVersion === TRUST_VERSION && Number(session.trustedUntil) > now) return session;
    var upgraded = Object.assign({}, session, {
      trusted: true,
      trustVersion: TRUST_VERSION,
      trustedAt: session.trustedAt || now,
      trustedUntil: now + TRUSTED_DEVICE_TTL,
      expiresAt: Math.max(Number(session.expiresAt) || 0, now + TRUSTED_DEVICE_TTL)
    });
    saveSession(upgraded);
    return upgraded;
  }
  function saveSession(value) {
    var now = Date.now();
    var shouldTrust = trustedRole(value.role);
    var trustedUntil = shouldTrust ? Math.max(Number(value.trustedUntil) || 0, now + TRUSTED_DEVICE_TTL) : null;
    value = Object.assign({}, value, {
      trusted: shouldTrust,
      trustVersion: shouldTrust ? TRUST_VERSION : '',
      trustedAt: shouldTrust ? (value.trustedAt || now) : null,
      trustedUntil: trustedUntil,
      expiresAt: shouldTrust ? Math.max(Number(value.expiresAt) || 0, trustedUntil) : value.expiresAt
    });
    var serialized = JSON.stringify(value);
    try { sessionStorage.setItem(SESSION_KEY, serialized); } catch (e) {}
    try { localStorage.setItem(SESSION_KEY, serialized); } catch (e) {}
    try {
      var maxAge = Math.max(60, Math.floor((Number(value.expiresAt) - Date.now()) / 1000));
      document.cookie = SESSION_KEY + '=' + encodeURIComponent(serialized) + '; Max-Age=' + maxAge + '; Path=/; SameSite=Lax';
    } catch (e) {}
  }
  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    try {
      localStorage.removeItem('ai_clan_token');
      localStorage.removeItem('ai_clan_person');
      localStorage.removeItem(AI_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch (e) {}
    try { document.cookie = SESSION_KEY + '=; Max-Age=0; Path=/; SameSite=Lax'; } catch (e) {}
  }
  function api(path, options) {
    options = Object.assign({ credentials: 'same-origin' }, options || {});
    return fetch(path, options).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) throw new Error(data.message || data.error || '服务暂不可用');
        return data;
      });
    });
  }
  function getBackdrop() { return document.getElementById('public-access-backdrop'); }
  function getBody() { return document.getElementById('public-access-body'); }
  function localizedAccessText(value) {
    if (!(window.getLang && window.getLang() === 'en') || !window.translateString) return value;
    var translated = window.translateString(value, 'en');
    return translated.indexOf('[Source text pending translation]') === -1
      ? translated
      : 'The request could not be completed. Please try again.';
  }
  function close() {
    if (!state.authenticated) {
      var body = getBody();
      if (body) {
        var note = document.getElementById('public-access-lock-message');
        if (!note) {
          note = document.createElement('div');
          note.id = 'public-access-lock-message';
          note.className = 'public-access-message';
          body.appendChild(note);
        }
        note.textContent = localizedAccessText('请先完成隐私确认和身份核验，才能进入网站。');
      }
      return;
    }
    var modal = getBackdrop();
    if (modal) {
      modal.hidden = true;
      modal.setAttribute('hidden', 'hidden');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
    document.documentElement.classList.remove('public-access-open');
    var callback = window.__publicAccessAfterClose;
    window.__publicAccessAfterClose = null;
    if (typeof callback === 'function') setTimeout(callback, 0);
  }
  function showMessage(message, success) {
    var el = document.getElementById('public-access-message');
    if (el) { el.textContent = localizedAccessText(message || ''); el.classList.toggle('success', !!success); }
  }
  function actions(backLabel) {
    return '<div class="public-access-actions"><button class="public-access-btn" type="button" data-access-action="back">' + (backLabel || '上一步') + '</button><button class="public-access-btn primary" type="button" data-access-action="submit">确认进入</button></div>';
  }
  function render() {
    var body = getBody();
    if (!body) return;
    if (state.step === 'consent') {
      var privacyOpen = window.matchMedia && window.matchMedia('(min-width: 601px)').matches ? ' open' : '';
      body.innerHTML = '<p>欢迎访问下枫槎谢氏数字宗谱。本网站包含家族世系、历史资料及部分近现代族人信息。</p><details class="public-access-privacy"' + privacyOpen + '><summary><span>隐私保护说明</span><small>点击展开完整说明</small></summary><div class="public-access-note"><p>为保护族谱资料及族人隐私，本网站将根据您的选择收集必要的登录信息，用于身份认证、访问权限管理和族谱服务。</p><p>族谱中的历史资料、世系关系等信息仅用于文化传承与查询，不得擅自复制、传播、商业使用或用于其他用途。对于在世族人的出生日期、联系方式、居住地等个人信息，网站将进行权限控制，未经本人或管理授权不会公开展示。</p><p>您可以选择“族人”或“普通访客”身份访问。族人身份需要经过核验，普通访客无需提交族谱内部信息。您可以申请查询、更正或删除与本人相关的信息。</p><p>点击“同意并继续”，表示您已阅读并同意本说明；点击“不同意”，将退出登录流程。</p></div></details><div class="public-access-actions"><button class="public-access-btn danger" type="button" data-access-action="decline">不同意</button><button class="public-access-btn primary" type="button" data-access-action="consent">同意并继续</button></div>';
      return;
    }
    if (state.step === 'role') {
      body.innerHTML = '<p>请选择您的访问身份。管理员仅限登记手机号登录；族人需要完成三代信息核验；普通访客只浏览公开内容。</p><div class="public-access-role-grid public-access-role-grid-3"><button class="public-access-role" type="button" data-access-action="role-clan"><strong>我是族人</strong><span>登录后核验本人、父亲和祖父姓名。</span></button><button class="public-access-role" type="button" data-access-action="role-visitor"><strong>普通访客</strong><span>手机号登记后浏览公开内容。</span></button><button class="public-access-role admin-role" type="button" data-access-action="role-admin"><strong>管理员</strong><span>仅登记管理员手机号可进入，拥有全部页面和 AI 咨询权限。</span></button></div><div class="public-access-provider"><span class="public-access-provider-title">登录方式</span><div class="public-access-provider-actions"><button class="public-access-btn" type="button" data-access-action="provider-phone">手机号登录</button><button class="public-access-btn" type="button" data-access-action="provider-wechat">微信登录</button></div><small id="public-access-provider-status">微信登录需服务器配置官方授权参数；未配置时不会虚假放行。</small></div>';
      return;
    }
    if (state.step === 'admin') {
      body.innerHTML = '<p>管理员是唯一可访问后台、全部族谱页面并使用 AI 全部咨询能力的身份。</p><form class="public-access-form" id="public-access-admin-form"><label>管理员手机号<input id="access-admin-phone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="20" placeholder="请输入登记的管理员手机号" required></label></form><div id="public-access-message" class="public-access-message" aria-live="polite"></div>' + actions('返回身份选择') + '<div class="public-access-provider"><span class="public-access-provider-title">当前登录方式：' + (state.provider === 'wechat' ? '微信' : '手机号') + '</span><small>管理员手机号由服务器安全校验，页面不会保存明文手机号。</small></div>';
      return;
    }
    if (state.step === 'visitor') {
      body.innerHTML = '<p>普通访客登录后仅可浏览公开的村史、公开世系和公开查询内容。</p><form class="public-access-form" id="public-access-visitor-form"><label>手机号<input id="access-visitor-phone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="20" placeholder="请输入手机号" required></label></form><div id="public-access-message" class="public-access-message" aria-live="polite"></div>' + actions('返回身份选择') + '<div class="public-access-provider"><span class="public-access-provider-title">当前登录方式：' + (state.provider === 'wechat' ? '微信' : '手机号') + '</span><small>手机号访问登记不等同于族人身份核验；敏感族谱信息仍需族人三代信息核验。</small></div>';
      return;
    }
    if (state.step === 'clan') {
      body.innerHTML = '<p>请填写三项信息，系统将与族谱管理后台的唯一主数据逐项匹配。</p><form class="public-access-form" id="public-access-clan-form"><label>本人姓名<input id="access-name" autocomplete="name" required></label><label>父亲姓名<input id="access-father" autocomplete="off" required></label><label>祖父姓名<input id="access-grandpa" autocomplete="off" required></label></form><div id="public-access-message" class="public-access-message" aria-live="polite"></div>' + actions('返回身份选择') + '<div class="public-access-provider"><span class="public-access-provider-title">登录方式：' + (state.provider === 'wechat' ? '微信' : '手机号') + '</span><small>登录方式与族谱三代信息核验同时记录；核验结果以管理后台主数据为准。</small></div>';
    }
  }
  function decline() {
    var body = getBody();
    if (body) body.innerHTML = '<div class="public-access-message">您已选择不同意，本次不会提交身份信息，也不能进入网站。</div><div class="public-access-actions"><button class="public-access-btn primary" type="button" data-access-action="restart">重新确认</button></div>';
  }
  function finish(result) {
    state.authenticated = true;
    var session = { role: result.role, name: result.name || '', personId: result.personId || null, sessionId: result.sessionId || '', consentVersion: CONSENT_VERSION, provider: state.provider, expiresAt: result.expiresAt || (Date.now() + 12 * 3600e3) };
    saveSession(session);
    if (result.role === 'admin' && result.token) { try { localStorage.setItem(ADMIN_TOKEN_KEY, result.token); localStorage.setItem(AI_TOKEN_KEY, result.token); } catch (e) {} }
    var body = getBody();
    if (body) {
       var trustHint = trustedRole(result.role)
         ? '身份确认已保存到当前手机浏览器，今后进入网站和点击族谱查询都无需重复验证；本机信任有效期为一年。'
         : '本次管理员会话已建立，关闭浏览器后可能需要重新验证。';
       var forgetAction = trustedRole(result.role) ? '<button class="public-access-btn danger" type="button" data-access-action="forget">退出本机信任</button>' : '';
       body.innerHTML = '<div class="public-access-success">' + (result.role === 'admin' ? '管理员身份验证通过，全部页面和 AI 咨询权限已开启。' : result.role === 'clan' ? '族人身份核验通过，欢迎回家。' : '普通访客登录成功。') + '</div><p>' + trustHint + '</p><div class="public-access-actions"><button class="public-access-btn primary" type="button" data-access-action="close">开始浏览</button>' + forgetAction + '</div>';
      var browseButton = body.querySelector('[data-access-action="close"]');
      if (browseButton) browseButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }, { once: true });
    }
  }
  function validPhone(value) { return /^1\d{10}$/.test(String(value || '').replace(/[\s-]/g, '').replace(/^\+86/, '')); }
  function adminLogin() {
    var phone = ((document.getElementById('access-admin-phone') || {}).value || '').trim();
    if (!validPhone(phone)) { showMessage('请输入有效的11位手机号'); return; }
    showMessage('正在核验管理员手机号…');
    api('/api/admin/phone-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: phone }) }).then(finish).catch(function (error) { showMessage(error.message || '管理员手机号核验失败'); });
  }
  function visitorLogin() {
    var phone = ((document.getElementById('access-visitor-phone') || {}).value || '').trim();
    if (!validPhone(phone)) { showMessage('请输入有效的11位手机号'); return; }
    showMessage('正在建立访客登录会话…');
    api('/api/public-auth/visitor-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: phone, consentVersion: CONSENT_VERSION, provider: state.provider }) }).then(finish).catch(function (error) { showMessage(error.message || '登录失败，请重试'); });
  }
  function clanVerify() {
    var name = ((document.getElementById('access-name') || {}).value || '').trim();
    var fatherName = ((document.getElementById('access-father') || {}).value || '').trim();
    var grandpaName = ((document.getElementById('access-grandpa') || {}).value || '').trim();
    if (!name || !fatherName || !grandpaName) { showMessage('请完整填写本人、父亲和祖父姓名'); return; }
    showMessage('正在与族谱管理后台主数据核对…');
    api('/api/public-auth/verify-member', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, fatherName: fatherName, grandpaName: grandpaName, consentVersion: CONSENT_VERSION, provider: state.provider }) }).then(function (result) {
      if (!result.verified) { showMessage(result.message || '信息不匹配，请核对姓名'); return; }
      try { localStorage.setItem('ai_clan_token', result.token || ''); localStorage.setItem('ai_clan_person', JSON.stringify({ id: result.personId, name: result.name })); } catch (e) {}
      finish(result);
    }).catch(function (error) { showMessage(error.message || '网络错误，请重试'); });
  }
  function providerMessage(provider) {
    state.provider = provider;
    if (state.step === 'role') {
      var status = document.getElementById('public-access-provider-status');
      if (status) status.textContent = localizedAccessText(provider === 'wechat' ? '已选择微信登录；服务器配置官方授权参数后将进入微信授权。' : '已选择手机号登录；族人仍需完成三代信息核验。');
      return;
    }
    render();
    if (provider === 'wechat') api('/api/public-auth/config').then(function (config) { if (!(config.providers && config.providers.wechat)) showMessage('当前服务器尚未配置微信 OAuth 参数，请改用手机号登录。'); }).catch(function () { showMessage('微信登录服务状态暂时无法读取。'); });
  }
  function build() {
    if (getBackdrop()) return;
    var backdrop = document.createElement('div');
    backdrop.id = 'public-access-backdrop';
    backdrop.className = 'public-access-backdrop';
    backdrop.innerHTML = '<section class="public-access-dialog" role="dialog" aria-modal="true" aria-labelledby="public-access-title"><header class="public-access-head"><div><span class="public-access-kicker">XIAFENGCHA · ACCESS</span><h2 id="public-access-title">安全访问族谱</h2></div><button class="public-access-close" type="button" data-access-action="close" aria-label="关闭">×</button></header><div class="public-access-body" id="public-access-body"></div></section>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) return;
      var action = event.target.closest && event.target.closest('[data-access-action]');
      if (!action) return;
      var name = action.getAttribute('data-access-action');
      if (name === 'close') close();
      else if (name === 'restart') { state.authenticated = false; state.step = 'consent'; state.role = ''; state.provider = 'phone'; render(); }
      else if (name === 'forget') { clearSession(); state.authenticated = false; state.step = 'consent'; state.role = ''; state.provider = 'phone'; render(); }
      else if (name === 'decline') decline();
      else if (name === 'consent') { state.step = 'role'; render(); }
      else if (name === 'role-clan') { state.role = 'clan'; state.step = 'clan'; render(); }
      else if (name === 'role-visitor') { state.role = 'visitor'; state.step = 'visitor'; render(); }
      else if (name === 'role-admin') { state.role = 'admin'; state.step = 'admin'; render(); }
      else if (name === 'provider-phone') providerMessage('phone');
      else if (name === 'provider-wechat') providerMessage('wechat');
      else if (name === 'back') { state.step = 'role'; render(); }
      else if (name === 'submit') { if (state.role === 'admin') adminLogin(); else if (state.role === 'visitor') visitorLogin(); else clanVerify(); }
    });
  }
  function isMobile() {
    return !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  }
  function launch(force) {
    if (!isMobile()) return;
    if (!force && validSession()) return;
    build();
    var modal = getBackdrop();
    if (!modal) return;
    modal.hidden = false;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.style.removeProperty('display');
    document.documentElement.classList.add('public-access-open');
    state.authenticated = false;
    state.step = 'consent'; state.role = ''; state.provider = 'phone';
    render();
  }
  function boot() {
    if (!document.body) return;
    if (document.body.getAttribute('data-public-gate') === 'off') return;
    if (!isMobile() || document.body.getAttribute('data-public-gate') !== 'always') return;
    if (validSession()) return;
    launch(false);
  }
  // 手机浏览器通过 back/forward cache 恢复时，只在本页配置为 always 且会话失效时重新确认。
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted || !isMobile()) return;
    if (!document.body || document.body.getAttribute('data-public-gate') !== 'always') return;
    if (validSession()) return;
    launch(false);
  });
  document.addEventListener('click', function (event) {
    var launcher = event.target.closest && event.target.closest('[data-access-launcher]');
    if (!launcher) return;
    event.preventDefault();
    launch(false);
  });
  window.openPublicAccessGate = function () { launch(false); };
  window.clearPublicAccessSession = clearSession;
  window.publicAccessSessionValid = validSession;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
}());
