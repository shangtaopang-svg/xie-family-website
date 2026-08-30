/* 统一媒体加载策略：首屏保持即时可见，长页面中的图片和视频交给浏览器按需加载。 */
(function () {
  'use strict';

  function prepareMedia(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll('img:not([data-media-optimized])').forEach(function (img) {
      img.setAttribute('data-media-optimized', '1');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });

    root.querySelectorAll('video:not([data-media-optimized])').forEach(function (video) {
      video.setAttribute('data-media-optimized', '1');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      if (!video.hasAttribute('preload') && !video.hasAttribute('autoplay')) {
        video.setAttribute('preload', 'none');
      }
    });
  }

  function init() {
    prepareMedia(document);
    if (!('MutationObserver' in window)) return;
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        record.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) prepareMedia(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
