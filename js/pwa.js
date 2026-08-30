/* PWA 安装入口与更新提示：不打扰浏览，用户点击后才执行安装或刷新。 */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  var deferredInstall = null;
  var updateRegistration = null;
  var reloading = false;
  var style = document.createElement('style');
  style.textContent =
    '.pwa-toast{position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid rgba(251,146,60,.35);border-radius:15px;background:rgba(25,20,18,.96);box-shadow:0 12px 34px rgba(0,0,0,.35);color:#f6ead8;font:13px/1.5 system-ui,-apple-system,"Microsoft YaHei",sans-serif}' +
    '.pwa-toast-copy{flex:1;min-width:0}.pwa-toast-copy strong{display:block;margin-bottom:2px;color:#ffd18e;font-size:14px}.pwa-toast-copy span{display:block;color:#c9b9a7}.pwa-toast-actions{display:flex;align-items:center;gap:6px;flex:0 0 auto}.pwa-toast button{min-height:36px;padding:0 11px;border:1px solid rgba(255,255,255,.18);border-radius:9px;background:transparent;color:#eadcca;font:600 12px system-ui,-apple-system,"Microsoft YaHei",sans-serif}.pwa-toast button[data-pwa-primary]{border-color:#fb923c;background:#fb923c;color:#1c120c}.pwa-toast button:active{transform:translateY(1px)}@media(max-width:360px){.pwa-toast{gap:7px;padding:10px}.pwa-toast-actions{flex-direction:column;align-items:stretch}.pwa-toast button{min-width:64px;padding:0 8px}}';
  document.head.appendChild(style);

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function removeToast() {
    var node = document.querySelector('.pwa-toast');
    if (node) node.remove();
  }

  function showToast(title, copy, primaryText, onPrimary, secondaryText, onSecondary) {
    removeToast();
    var toast = document.createElement('aside');
    toast.className = 'pwa-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<div class="pwa-toast-copy"><strong>' + title + '</strong><span>' + copy + '</span></div>' +
      '<div class="pwa-toast-actions"><button type="button" data-pwa-secondary>' + secondaryText + '</button><button type="button" data-pwa-primary>' + primaryText + '</button></div>';
    document.body.appendChild(toast);
    toast.querySelector('[data-pwa-primary]').addEventListener('click', function () { onPrimary(toast); });
    toast.querySelector('[data-pwa-secondary]').addEventListener('click', function () { onSecondary(toast); });
  }

  function showInstallPrompt() {
    if (!deferredInstall || isStandalone()) return;
    var dismissedUntil = 0;
    try { dismissedUntil = Number(localStorage.getItem('xie-pwa-install-dismissed-until') || 0); } catch (e) {}
    if (dismissedUntil > Date.now()) return;
    showToast('安装到手机桌面', '下次打开数字宗祠更方便。', '安装', function () {
      var event = deferredInstall;
      deferredInstall = null;
      removeToast();
      event.prompt();
      event.userChoice.finally(function () {});
    }, '稍后', function (toast) {
      try { localStorage.setItem('xie-pwa-install-dismissed-until', String(Date.now() + 14 * 864e5)); } catch (e) {}
      toast.remove();
    });
  }

  function showUpdatePrompt(registration) {
    if (!registration || !registration.waiting) return;
    updateRegistration = registration;
    showToast('发现新版本', '点击更新即可使用最新优化。', '立即更新', function (toast) {
      if (updateRegistration && updateRegistration.waiting) {
        updateRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      toast.remove();
    }, '暂不', function (toast) { toast.remove(); });
  }

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(function (registration) {
    if (registration.waiting && navigator.serviceWorker.controller) showUpdatePrompt(registration);
    registration.addEventListener('updatefound', function () {
      var next = registration.installing;
      if (!next) return;
      next.addEventListener('statechange', function () {
        if (next.state === 'installed' && navigator.serviceWorker.controller) showUpdatePrompt(registration);
      });
    });
  }).catch(function () {});

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstall = event;
    window.setTimeout(showInstallPrompt, 2200);
  });

  window.addEventListener('appinstalled', function () {
    deferredInstall = null;
    removeToast();
  });
})();
