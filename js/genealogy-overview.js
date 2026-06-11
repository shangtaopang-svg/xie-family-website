/* ============================================
   家族世代全景图 v3
   纵向展示谢氏世系 · 拖拽缩放
   ============================================ */
(function () {
  'use strict';

  var canvas, ctx, container, tipEl;
  var data = [], gens = [], posMap = {};
  var ready = false;

  var ox = 0, oy = 0, sc = 1;
  var dragging = false, dsx, dsy, dox, doy;
  var ROW = 72, LEFT = 60;

  var COLORS = ['#ef4444','#f97316','#f59e0b','#22c55e','#14b8a6','#06b6d4','#3b82f6','#6366f1','#8b5cf6','#a855f7','#d946ef','#ec4899'];

  function init() {
    container = document.getElementById('genealogy-overview-container');
    if (!container) return;
    container.style.cssText = 'position:relative;overflow:hidden;cursor:grab;background:var(--bg-primary);border-radius:8px;';

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    tipEl = document.createElement('div');
    tipEl.style.cssText = 'position:absolute;pointer-events:none;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);color:#fff;padding:6px 12px;border-radius:6px;font-size:12px;line-height:1.6;border:1px solid rgba(255,255,255,0.12);opacity:0;z-index:10;white-space:nowrap;';
    container.appendChild(tipEl);

    // Controls
    var z = document.createElement('div');
    z.style.cssText = 'position:absolute;bottom:12px;right:12px;display:flex;gap:3px;z-index:5;';
    z.innerHTML = '<button style="width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.55);color:#fff;font-size:16px;cursor:pointer;">+</button><button style="width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.55);color:#fff;font-size:16px;cursor:pointer;">−</button><button style="width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.55);color:#fff;font-size:12px;cursor:pointer;">⟳</button>';
    container.appendChild(z);
    z.children[0].onclick=function(){zm(sc*1.5,container.clientWidth/2,container.clientHeight/2);};
    z.children[1].onclick=function(){zm(sc/1.5,container.clientWidth/2,container.clientHeight/2);};
    z.children[2].onclick=function(){sc=1;ox=0;oy=0;draw();};
    z.querySelectorAll('button').forEach(function(b){b.onmouseenter=function(){this.style.background='rgba(255,255,255,0.15)';}; b.onmouseleave=function(){this.style.background='rgba(0,0,0,0.55)';};});

    // Events
    canvas.onmousedown=function(e){dragging=true;dsx=e.clientX;dsy=e.clientY;dox=ox;doy=oy;container.style.cursor='grabbing';};
    canvas.onmousemove=function(e){
      if(dragging){ox=dox+(e.clientX-dsx);oy=doy+(e.clientY-dsy);draw();return;}
      // hover tip
      var r=container.getBoundingClientRect();
      var mx=(e.clientX-r.left-ox)/sc, my=(e.clientY-r.top-oy)/sc;
      var hit=null;
      for(var k in posMap){var p=posMap[k]; if(Math.abs(mx-p.x)<20&&Math.abs(my-p.y)<20){hit=p;break;}}
      if(hit){tipEl.textContent=hit.name+' · 第'+hit.gen+'世'+(hit.branch?' · '+hit.branch:'');tipEl.style.opacity='1';tipEl.style.left=(e.clientX-r.left+12)+'px';tipEl.style.top=(e.clientY-r.top-12)+'px';canvas.style.cursor='pointer';}
      else{tipEl.style.opacity='0';canvas.style.cursor='grab';}
    };
    canvas.onmouseup=canvas.onmouseleave=function(){dragging=false;container.style.cursor='grab';tipEl.style.opacity='0';};
    canvas.onwheel=function(e){e.preventDefault();zm(sc*(e.deltaY>0?0.9:1.1),e.clientX-container.getBoundingClientRect().left,e.clientY-container.getBoundingClientRect().top);};

    load();
    window.addEventListener('resize',function(){if(ready)draw();});
  }

  function load() {
    data = (typeof getGenealogyData==='function')?getGenealogyData():[];
    if(!data||!data.length){container.innerHTML='<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:14px;">暂无数据</div>';return;}

    var gmap={};
    data.forEach(function(p){var g=parseInt(p.generation_num)||0;if(!gmap[g])gmap[g]=[];gmap[g].push(p);});
    gens=Object.keys(gmap).map(Number).sort(function(a,b){return a-b;});

    var MIN=Math.min.apply(null,gens);
    var MAX=Math.max.apply(null,gens);
    // Show ALL generations from min to max as rows
    var allGens=[];
    for(var g=MIN;g<=MAX;g++) allGens.push(g);
    gens = allGens;

    posMap={};
    gens.forEach(function(g){
      var list=gmap[g]||[];
      var y=gens.indexOf(g)*ROW+ROW/2;
      list.forEach(function(p,i){
        var n=list.length;
        var x=LEFT+(n>1?i/(n-1):0.5)*Math.max(500,n*40);
        posMap[p.id]={x:x,y:y,gen:g,name:p.name,branch:p.branch||'',hl:!!(p.highlight||/^(申伯|小四公|文杲公|攒公|撰公|彬公|乾公|谢安|谢玄|谢灵运|谢尚公|谢枋得|谢深甫)$/.test(p.name))};
      });
    });
    ready=true;
    draw();
  }

  function draw() {
    var dpr=window.devicePixelRatio||1;
    var w=container.clientWidth||800, h=Math.max(container.clientHeight||400, gens.length*ROW+60);
    canvas.width=Math.max(w,960)*dpr; canvas.height=h*dpr;
    canvas.style.width=(canvas.width/dpr)+'px'; canvas.style.height=(canvas.height/dpr)+'px';
    ctx.scale(dpr,dpr);

    var W=canvas.width/dpr, H=canvas.height/dpr;
    ctx.clearRect(0,0,W,H);
    ctx.save();
    ctx.translate(ox,oy); ctx.scale(sc,sc);

    // Draw generation rows
    gens.forEach(function(g,i){
      var y=i*ROW;
      ctx.fillStyle=i%2===0?'rgba(255,255,255,0.02)':'transparent';
      ctx.fillRect(0,y,W/sc+200,ROW);
      // Gen number
      ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.font='bold 13px sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(g+'世', LEFT-8, y+ROW/2-4);
    });

    // Draw lines (parent->child)
    ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=0.6;
    data.forEach(function(p){
      if(p.father_id==null) return;
      var c=posMap[p.id], f=posMap[p.father_id];
      if(!c||!f) return;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y+ROW*0.3);
      var mx=(f.x+c.x)/2;
      ctx.bezierCurveTo(mx, f.y+ROW*0.3, mx, c.y-ROW*0.3, c.x, c.y-ROW*0.3);
      ctx.stroke();
    });

    // Draw people
    gens.forEach(function(g){
      var list=data.filter(function(p){return (parseInt(p.generation_num)||0)===g;});
      list.forEach(function(p){
        var pp=posMap[p.id]; if(!pp) return;
        var x=pp.x, y=pp.y;
        var col='#666';
        if(p.branch&&p.branch.indexOf('后枫槎')>=0) col='#22c55e';
        else if(p.branch&&p.branch.indexOf('前枫槎')>=0) col='#6366f1';
        else if(p.branch&&p.branch.indexOf('石马')>=0) col='#f59e0b';

        if(pp.hl){
          // Named circle
          var r=18;
          ctx.shadowColor=col; ctx.shadowBlur=15;
          ctx.beginPath(); ctx.arc(x,y,r,0,2*Math.PI); ctx.fillStyle=col; ctx.fill();
          ctx.shadowBlur=0;
          ctx.beginPath(); ctx.arc(x,y,r-2,0,2*Math.PI); ctx.fillStyle='#fff'; ctx.fill();
          ctx.fillStyle=col; ctx.font='bold 14px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText(p.name.charAt(0),x,y+1);
          ctx.fillStyle='#fff'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
          ctx.fillText(p.name,x,y+r+4);
        } else {
          var r2=Math.max(5,Math.min(12,30/(list.length||1)));
          ctx.beginPath(); ctx.arc(x,y,r2,0,2*Math.PI);
          ctx.fillStyle=col; ctx.globalAlpha=0.5; ctx.fill(); ctx.globalAlpha=1;
          if(r2>8){
            ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='9px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(p.name.charAt(0),x,y+1);
          }
        }
      });
    });

    ctx.restore();
  }

  function zm(ns,cx,cy){
    ns=Math.max(0.2,Math.min(4,ns));
    if(ns===sc) return;
    ox=cx-(cx-ox)*ns/sc; oy=cy-(cy-oy)*ns/sc; sc=ns; draw();
  }

  setTimeout(function t(){
    if(typeof getGenealogyData==='function'){init();}
    else setTimeout(t,500);
  },800);
})();
