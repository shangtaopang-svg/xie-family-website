/* ============================================
   家族世代全景图 v2
   纵向展示36世 · 拖拽缩放 · 父子连线
   ============================================ */
(function () {
  'use strict';

  var canvas, ctx, container, infoEl;
  var allData = [];
  var isReady = false;
  var offsetX = 0, offsetY = 0, scale = 1;
  var MIN_SCALE = 0.2, MAX_SCALE = 4;
  var isDrag = false, dsx, dsy, dox, doy;
  var genMap = {}, genList = [], nodePos = {};

  var ROW_H = 64, PAD_L = 70, COL_MIN = 30;

  function init() {
    container = document.getElementById('genealogy-overview-container');
    if (!container) return;
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    infoEl = document.createElement('div');
    infoEl.style.cssText = 'position:absolute;pointer-events:none;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;line-height:1.7;border:1px solid rgba(255,255,255,0.12);opacity:0;transition:opacity 0.15s;z-index:10;max-width:200px;';
    container.appendChild(infoEl);

    // Zoom controls
    var zdiv = document.createElement('div');
    zdiv.style.cssText = 'position:absolute;bottom:12px;right:12px;display:flex;gap:4px;z-index:5;';
    zdiv.innerHTML = '<button style="width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.6);color:#fff;font-size:18px;cursor:pointer;">+</button><button style="width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.6);color:#fff;font-size:18px;cursor:pointer;">−</button><button style="width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.6);color:#fff;font-size:14px;cursor:pointer;">⟳</button>';
    container.appendChild(zdiv);
    zdiv.children[0].onclick = function(){ zoomAt(scale*1.5,container.clientWidth/2,container.clientHeight/2); };
    zdiv.children[1].onclick = function(){ zoomAt(scale/1.5,container.clientWidth/2,container.clientHeight/2); };
    zdiv.children[2].onclick = function(){ scale=1;offsetX=0;offsetY=0;resize(); };

    // Events
    canvas.onmousedown = function(e){ isDrag=true;dsx=e.clientX;dsy=e.clientY;dox=offsetX;doy=offsetY;container.style.cursor='grabbing'; };
    canvas.onmousemove = function(e){ if(!isDrag)return;offsetX=dox+(e.clientX-dsx);offsetY=doy+(e.clientY-dsy);draw(); };
    canvas.onmouseup = canvas.onmouseleave = function(){ isDrag=false;container.style.cursor='grab'; };
    canvas.onwheel = function(e){ e.preventDefault(); zoomAt(scale*(e.deltaY>0?0.88:1.12), e.clientX-container.getBoundingClientRect().left, e.clientY-container.getBoundingClientRect().top); };

    loadData();
    window.addEventListener('resize', function(){if(isReady)resize();});
  }

  function loadData() {
    allData = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
    if (!allData || allData.length === 0) {
      container.innerHTML = '<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:14px;">暂无数据，请先录入族谱</div>';
      return;
    }
    // Group by generation
    genMap = {}; genList = [];
    allData.forEach(function(p){
      var g = parseInt(p.generation_num) || 0;
      if(!genMap[g]){ genMap[g]=[]; genList.push(g); }
      genMap[g].push(p);
    });
    genList.sort(function(a,b){return a-b;});

    // Compute positions
    nodePos = {};
    genList.forEach(function(g){
      var list = genMap[g];
      list.sort(function(a,b){return (a.name||'').localeCompare(b.name||'');});
      var y = genList.indexOf(g) * ROW_H + ROW_H/2;
      list.forEach(function(p,i){
        var cnt = list.length;
        var x = PAD_L + (cnt>1 ? i/(cnt-1) : 0.5) * Math.max(400, cnt*COL_MIN);
        nodePos[p.id] = {x:x, y:y, gen:g, name:p.name, branch:p.branch||'', highlight:p.highlight||false};
      });
    });
    isReady = true;
    resize();
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    var w = container.clientWidth || 800;
    var h = Math.max(container.clientHeight || 400, genList.length * ROW_H + 60);
    canvas.width = Math.max(w, 900) * dpr;
    canvas.height = h * dpr;
    canvas.style.width = (canvas.width/dpr) + 'px';
    canvas.style.height = (canvas.height/dpr) + 'px';
    ctx.scale(dpr, dpr);
    draw();
  }

  function draw() {
    var W = canvas.width / (window.devicePixelRatio || 1);
    var H = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0,0,W,H);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    var totalH = genList.length * ROW_H;

    // Background stripes
    genList.forEach(function(g,i){
      var y = i*ROW_H;
      if(i%2===0){ ctx.fillStyle='rgba(255,255,255,0.03)'; ctx.fillRect(0,y,W/scale+200,ROW_H); }
      // Gen label
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='bold 12px sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(g+'世', PAD_L-10, y+ROW_H/2);
      ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.font='9px sans-serif';
      ctx.fillText('('+genMap[g].length+')', PAD_L-10, y+ROW_H/2+14);
    });

    // Draw connections (lines first)
    ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=0.7;
    allData.forEach(function(p){
      if(p.father_id==null) return;
      var c = nodePos[p.id], f = nodePos[p.father_id];
      if(!c||!f) return;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y+ROW_H*0.35);
      var mx = (f.x+c.x)/2;
      ctx.bezierCurveTo(mx, f.y+ROW_H*0.35, mx, c.y-ROW_H*0.35, c.x, c.y-ROW_H*0.35);
      ctx.stroke();
    });

    // Draw people
    genList.forEach(function(g){
      genMap[g].forEach(function(p){
        var pos = nodePos[p.id];
        if(!pos) return;
        var x=pos.x, y=pos.y;

        // Color by branch
        var col = '#666';
        if(p.branch && p.branch.indexOf('后枫槎')>=0) col='#22c55e';
        else if(p.branch && p.branch.indexOf('前枫槎')>=0) col='#6366f1';
        else if(p.branch && p.branch.indexOf('石马')>=0) col='#f59e0b';

        var hl = !!(p.highlight || (p.name && /^谢(安|玄|灵运|尚公|枋得)|申伯|小四公|文杲公|攒公|撰公|彬公|乾公|深甫$/.test(p.name)));

        if(hl){
          // Highlighted person with name
          ctx.shadowColor=col; ctx.shadowBlur=10;
          ctx.beginPath(); ctx.arc(x,y,16,0,2*Math.PI); ctx.fillStyle=col; ctx.fill();
          ctx.shadowBlur=0;
          ctx.beginPath(); ctx.arc(x,y,14,0,2*Math.PI); ctx.fillStyle='#fff'; ctx.fill();
          ctx.fillStyle=col; ctx.font='bold 12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText(p.name.charAt(0), x, y+1);
          ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
          ctx.fillText(p.name, x, y+19);
        } else {
          var r = Math.max(4, Math.min(10, 20/genMap[g].length));
          ctx.beginPath(); ctx.arc(x,y,r,0,2*Math.PI);
          ctx.fillStyle=col; ctx.globalAlpha=0.5; ctx.fill(); ctx.globalAlpha=1;
        }
      });
    });

    ctx.restore();
  }

  function zoomAt(ns, cx, cy){
    ns = Math.max(MIN_SCALE, Math.min(MAX_SCALE, ns));
    if(ns===scale) return;
    offsetX = cx - (cx-offsetX)*ns/scale;
    offsetY = cy - (cy-offsetY)*ns/scale;
    scale = ns;
    draw();
  }

  // Init
  if(document.readyState==='complete'||document.readyState==='interactive') setTimeout(function(){
    // Wait for getGenealogyData to be available
    var tries=0;
    function check(){ tries++; if(typeof getGenealogyData==='function'){init();} else if(tries<30){setTimeout(check,300);} }
    check();
  }, 500);
  else document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){
    var tries=0;
    function check(){ tries++; if(typeof getGenealogyData==='function'){init();} else if(tries<30){setTimeout(check,300);} }
    check();
  },500);});
})();
