/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Hero stats counter
   Extracted from index.html
   ============================================ */

(function() {
      // Load hero stats counts
      function loadHeroStats() {
        // 族人 — 总人数，从 /api/data/genealogy 实时读取（与族谱页/成员页同源，保证统计数据一致）
        fetch('/api/data/genealogy').then(function(r){return r.json()}).then(function(d){
          var el = document.getElementById('stat-members');
          if (el && Array.isArray(d)) el.textContent = d.length;
        }).catch(function(){});

        // 视频
        fetch('/api/data/videos').then(function(r){return r.json()}).then(function(d){
          var el = document.getElementById('stat-videos');
          if (el && Array.isArray(d)) el.textContent = d.length;
        }).catch(function(){});

        // 摄影
        fetch('/api/data/photos').then(function(r){return r.json()}).then(function(d){
          var el = document.getElementById('stat-photos');
          if (el && Array.isArray(d)) el.textContent = d.length;
        }).catch(function(){});

        // 荣誉
        fetch('/api/data/honors').then(function(r){return r.json()}).then(function(d){
          var el = document.getElementById('stat-honors');
          if (el && Array.isArray(d)) el.textContent = d.length;
        }).catch(function(){});

        // 新闻 = 消息发布(news) + 新闻报道(reports)
        Promise.all([
          fetch('/api/data/news').then(function(r){return r.json()}),
          fetch('/api/data/reports').then(function(r){return r.json()})
        ]).then(function(results) {
          var el = document.getElementById('stat-news');
          if (!el) return;
          var total = 0;
          results.forEach(function(d) { if (Array.isArray(d)) total += d.length; });
          el.textContent = total;
        }).catch(function(){});
      }
      loadHeroStats();
    })();
