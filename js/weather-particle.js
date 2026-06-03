/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Weather particle engine (canvas: rain/sunny/snow/meteor)
   Extracted from index.html
   ============================================ */

(function() {
    var canvas = document.getElementById('weather-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    var currentEffect = localStorage.getItem('xie_weather_effect') || 'off';
    var particles = [];
    var animId = null;

    // --- 雨 ---
    function makeRain(count) {
      var arr = [];
      for (var i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * W, y: Math.random() * H * -1,
          len: Math.random() * 15 + 10,
          speed: Math.random() * 6 + 4,
          opacity: Math.random() * 0.4 + 0.2
        });
      }
      return arr;
    }
    function drawRain(ctx, arr) {
      ctx.strokeStyle = 'rgba(174,194,224,0.6)';
      ctx.lineWidth = 1.2;
      for (var i = 0; i < arr.length; i++) {
        var p = arr[i];
        p.y += p.speed;
        p.x += 1.5;
        if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        if (p.x > W + 20) p.x = -20;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 4, p.y - p.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // --- 晴 ---
    function makeSunny(count) {
      var arr = [];
      for (var i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 2.5 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI * 2,
          drift: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.3 + 0.05
        });
      }
      return arr;
    }
    function drawSunny(ctx, arr) {
      for (var i = 0; i < arr.length; i++) {
        var p = arr[i];
        p.y -= p.speed;
        p.x += Math.sin(p.angle) * p.drift;
        p.angle += 0.005;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,200,120,' + p.opacity + ')';
        ctx.fill();
        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,200,120,' + (p.opacity * 0.2) + ')';
        ctx.fill();
      }
    }

    // --- 雪 ---
    function makeSnow(count) {
      var arr = [];
      for (var i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * W, y: Math.random() * H * -1,
          r: Math.random() * 3 + 1,
          speed: Math.random() * 1.2 + 0.4,
          sway: Math.random() * 2 + 0.5,
          phase: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      return arr;
    }
    function drawSnow(ctx, arr) {
      for (var i = 0; i < arr.length; i++) {
        var p = arr[i];
        p.y += p.speed;
        p.x += Math.sin(p.phase) * 0.3;
        p.phase += 0.02;
        if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
        ctx.fill();
      }
    }

    // --- 流星 ---
    function makeMeteors(max) {
      var arr = [];
      for (var i = 0; i < max; i++) {
        arr.push(spawnMeteor(true));
      }
      return arr;
    }
    function spawnMeteor(randomY) {
      return {
        x: Math.random() * W,
        y: randomY ? Math.random() * H * 0.4 : -20,
        vx: Math.random() * -8 - 4,
        vy: Math.random() * 4 + 3,
        len: Math.random() * 40 + 30,
        opacity: Math.random() * 0.6 + 0.4,
        life: 1
      };
    }
    function drawMeteors(ctx, arr) {
      var meteorTimer = arr._timer || 0;
      meteorTimer++;
      // spawn new
      if (meteorTimer > 80 + Math.random() * 120) {
        var active = arr.filter(function(m) { return m.life > 0; }).length;
        if (active < 4) {
          arr.push(spawnMeteor(false));
        }
        meteorTimer = 0;
      }
      arr._timer = meteorTimer;

      for (var i = arr.length - 1; i >= 0; i--) {
        var m = arr[i];
        if (m.life <= 0) { arr.splice(i, 1); continue; }
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.008;
        if (m.life < 0) m.life = 0;
        if (m.x < -100 || m.y > H + 50) { arr.splice(i, 1); continue; }

        var grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 2, m.y - m.vy * 2);
        grad.addColorStop(0, 'rgba(255,255,255,' + (m.life * m.opacity) + ')');
        grad.addColorStop(0.5, 'rgba(200,220,255,' + (m.life * m.opacity * 0.4) + ')');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 3, m.y - m.vy * 3);
        ctx.stroke();

        // head glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (m.life * 0.8) + ')';
        ctx.fill();
      }
    }

    // --- 引擎循环 ---
    function startEffect(type) {
      stopEffect();
      currentEffect = type;
      localStorage.setItem('xie_weather_effect', type);
      updateActiveBtn(type);

      switch (type) {
        case 'rain':  particles = makeRain(300); break;
        case 'sunny': particles = makeSunny(80); break;
        case 'snow':  particles = makeSnow(180); break;
        case 'meteor': particles = makeMeteors(2); break;
        default: return;
      }
      loop();
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      switch (currentEffect) {
        case 'rain':  drawRain(ctx, particles); break;
        case 'sunny': drawSunny(ctx, particles); break;
        case 'snow':  drawSnow(ctx, particles); break;
        case 'meteor': drawMeteors(ctx, particles); break;
      }
      animId = requestAnimationFrame(loop);
    }

    function stopEffect() {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      ctx.clearRect(0, 0, W, H);
      particles = [];
    }

    // --- 按钮控制 ---
    function updateActiveBtn(type) {
      var btns = document.querySelectorAll('.weather-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('active', btns[i].getAttribute('data-weather') === type);
      }
    }

    // --- 初始化 ---
    // 恢复上次效果
    localStorage.removeItem('xie_weather_effect');
    var saved = 'off';
    if (saved && saved !== 'off') startEffect(saved);
    else updateActiveBtn('off');

    // 绑定按钮
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.weather-btn');
      if (!btn) return;
      var type = btn.getAttribute('data-weather');
      if (type === currentEffect && type === 'off') return;
      if (type === 'off') { stopEffect(); currentEffect = 'off'; localStorage.setItem('xie_weather_effect', 'off'); updateActiveBtn('off'); return; }
      if (type === currentEffect) { stopEffect(); currentEffect = 'off'; localStorage.setItem('xie_weather_effect', 'off'); updateActiveBtn('off'); return; }
      startEffect(type);
    });
  })();
