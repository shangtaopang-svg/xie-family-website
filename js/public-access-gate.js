(function () {
  'use strict';

  var CONSENT_VERSION = 'privacy-v2-20260826';
  var SESSION_KEY = 'xie_public_access_v2';
  var ADMIN_TOKEN_KEY = 'xie_admin_token';
  var AI_TOKEN_KEY = 'ai_admin_token';
  var state = { step: 'consent', role: '', provider: 'phone' };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch];
    });
  }
  function readSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; } }
  function sessionValid(session) { return !!(session && session.expiresAt && Number(session.expiresAt) > Date.now()); }
  function saveSession(value) { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(value)); } catch (e) {} }
  function api(path, options) {
    return fetch(path, options).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) throw new Error(data.message || data.error || '服务暂不可用');
        return data;
      });
    });
  }
  function getBackdrop() { return document.getElementById('public-access-backdrop'); }
  function getBody() { return document.getElementById('public-access-body'); }
  function close() {
    var modal = getBackdrop();
    if (modal) modal.hidden = true;
    document.documentElement.classList.remove('public-access-open');
  }
  function showMessage(message, success) {
    var el = document.getElementById('public-access-message');
    if (el) { el.textContent = message || ''; el.classList.toggle('success', !!success); }
  }
  function actions(backLabel) {
    return '<div class="public-access-actions"><button class="public-access-btn" type="button" data-access-action="back">' + (backLabel || '上一步') + '</button><button class="public-access-btn primary" type="button" data-access-action="submit">确认进入</button></div>';
  }
  function render() {
    var body = getBody();
    if (!body) return;
    if (state.step === 'consent') {
      body.innerHTML = '<p>欢迎访问下枫槎谢氏数字宗谱。本网站包含家族世系、历史资料及部分近现代族人信息。</p><div class="public-access-note"><b>隐私保护说明</b><br>我们只使用您主动填写的登录或核验信息，用于身份识别、访问控制和族谱展示；不会在公开页面显示您的手机号、微信号或其他登录凭证，也不会向无关第三方出售或提供。族人核验只需本人姓名、父亲姓名和祖父姓名，不要求上传身份证件。您可以随时停止访问。</div><div class="public-access-actions"><button class="public-access-btn danger" type="button" data-access-action="decline">不同意</button><button class="public-access-btn primary" type="button" data-access-action="consent">同意并继续</button></div>';
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
    if (body) body.innerHTML = '<div class="public-access-message">您已选择不同意，本次不会提交身份信息。</div><div class="public-access-actions"><button class="public-access-btn" type="button" data-access-action="close">关闭</button></div>';
  }
  function finish(result) {
    var session = { role: result.role, name: result.name || '', personId: result.personId || null, sessionId: result.sessionId || '', consentVersion: CONSENT_VERSION, provider: state.provider, expiresAt: result.expiresAt || (Date.now() + 12 * 3600e3) };
    saveSession(session);
    if (result.role === 'admin' && result.token) { try { localStorage.setItem(ADMIN_TOKEN_KEY, result.token); localStorage.setItem(AI_TOKEN_KEY, result.token); } catch (e) {} }
    var body = getBody();
    if (body) body.innerHTML = '<div class="public-access-success">' + (result.role === 'admin' ? '管理员身份验证通过，全部页面和 AI 咨询权限已开启。' : result.role === 'clan' ? '族人身份核验通过，欢迎回家。' : '普通访客登录成功。') + '</div><p>本次登录仅用于当前页面；进入其他公开页面时，需要重新完成身份确认。</p><div class="public-access-actions"><button class="public-access-btn primary" type="button" data-access-action="close">开始浏览</button></div>';
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
      if (status) status.textContent = provider === 'wechat' ? '已选择微信登录；服务器配置官方授权参数后将进入微信授权。' : '已选择手机号登录；族人仍需完成三代信息核验。';
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
  function launch(force) {
    if (!force && sessionValid(readSession())) return;
    build();
    var modal = getBackdrop();
    if (!modal) return;
    modal.hidden = false;
    document.documentElement.classList.add('public-access-open');
    state.step = 'consent'; state.role = ''; state.provider = 'phone';
    render();
  }
  function boot() {
    if (!document.body || document.body.getAttribute('data-app-mode') === 'admin' || document.body.getAttribute('data-public-gate') === 'off') return;
    if (!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) return;
    // 每次进入手机端公开页面都重新经过完整入口流程：隐私确认 → 身份选择 → 登录/核验。
    // sessionStorage 仍保留本次结果，供当前页面的业务功能读取；但不能用它跳过下一次进入。
    // 管理员令牌同样只用于登录后的权限与 AI 请求，不能绕过入口流程。
    launch(true);
  }
  document.addEventListener('click', function (event) {
    var launcher = event.target.closest && event.target.closest('[data-access-launcher]');
    if (!launcher) return;
    event.preventDefault();
    launch(true);
  });
  window.openPublicAccessGate = function () { launch(true); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
}());
