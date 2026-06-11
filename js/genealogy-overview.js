/* ============================================
   家族世代全景图 v4 — 姓名卡片 + 关系连线
   每人都显示姓名 · 父子关系清晰 · 拖拽缩放
   ============================================ */
(function () {
  'use strict';

  var cv, ctx, container, tip;
  var data = [], gens = [], pos = {};
  var ox=0, oy=0, sc=1, needW=1200;
  var drag=false, dsx,dsy,dox,doy;
  var ROW=100, LEFT=80;

  function init() {
    container = document.getElementById('genealogy-overview-container');
    if(!container) return;
    container.style.cssText='position:relative;overflow:auto;cursor:grab;background:var(--bg-primary);border-radius:8px;';

    cv = document.createElement('canvas');
    cv.style.cssText='width:100%;height:100%;display:block;';
    container.appendChild(cv);
    ctx = cv.getContext('2d');

    tip = document.createElement('div');
    tip.style.cssText='position:absolute;pointer-events:none;background:rgba(0,0,0,0.88);color:#fff;padding:6px 12px;border-radius:6px;font-size:12px;border:1px solid rgba(255,255,255,0.12);opacity:0;z-index:10;white-space:nowrap;';
    container.appendChild(tip);

    // Controls
    var z=document.createElement('div');
    z.style.cssText='position:absolute;bottom:12px;right:12px;display:flex;gap:3px;z-index:5;';
    z.innerHTML='<button title="放大">+</button><button title="缩小">−</button><button title="重置">⟳</button>';
    container.appendChild(z);
    z.querySelectorAll('button').forEach(function(b){b.style.cssText='width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.55);color:#fff;font-size:16px;cursor:pointer;';});
    z.children[0].onclick=function(){zm(sc*1.5,container.clientWidth/2,container.clientHeight/2);};
    z.children[1].onclick=function(){zm(sc/1.5,container.clientWidth/2,container.clientHeight/2);};
    z.children[2].onclick=function(){sc=1;ox=0;oy=0;draw();};

    // Events
    cv.onmousedown=function(e){drag=true;dsx=e.clientX;dsy=e.clientY;dox=ox;doy=oy;container.style.cursor='grabbing';};
    cv.onmousemove=function(e){
      if(drag){ox=dox+(e.clientX-dsx);oy=doy+(e.clientY-dsy);draw();return;}
      // Hover
      var r=container.getBoundingClientRect();
      var mx=(e.clientX-r.left-ox)/sc,my=(e.clientY-r.top-oy)/sc;
      var hit=null;
      for(var k in pos){var p=pos[k];if(Math.abs(mx-p.x)<(p.w/2+5)&&Math.abs(my-p.y)<25){hit=p;break;}}
      if(hit){tip.textContent=hit.name+(hit.gen?' · 第'+hit.gen+'世':'')+(hit.branch?' · '+hit.branch:'');tip.style.opacity='1';tip.style.left=(e.clientX-r.left+12)+'px';tip.style.top=(e.clientY-r.top-12)+'px';}
      else{tip.style.opacity='0';}
    };
    cv.onmouseup=cv.onmouseleave=function(){drag=false;container.style.cursor='grab';tip.style.opacity='0';};
    cv.onwheel=function(e){e.preventDefault();zm(sc*(e.deltaY>0?0.88:1.12),e.clientX-container.getBoundingClientRect().left,e.clientY-container.getBoundingClientRect().top);};
    cv.onclick=function(e){
      var r=container.getBoundingClientRect();
      var mx=(e.clientX-r.left-ox)/sc,my=(e.clientY-r.top-oy)/sc;
      for(var k in pos){var p=pos[k];if(Math.abs(mx-p.x)<(p.w/2+5)&&Math.abs(my-p.y)<25&&typeof showPersonDetail==='function'){showPersonDetail(p.id,data);return;}}
    };

    load();
    window.addEventListener('resize',function(){if(data.length)draw();});
  }

  function load() {
    data = (typeof getGenealogyData==='function')?getGenealogyData():[];
    if(!data||!data.length){container.innerHTML='<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:14px;">暂无数据</div>';return;}

    var gmap={};
    data.forEach(function(p){var g=parseInt(p.generation_num)||0;if(!gmap[g])gmap[g]=[];gmap[g].push(p);});
    gens=Object.keys(gmap).map(Number).sort(function(a,b){return a-b;});

    // Show all generations from min to max
    var min=Math.min.apply(null,gens), max=Math.max.apply(null,gens);
    var all=[];
    for(var g=min;g<=max;g++) all.push(g);
    gens = all;

    // Calculate canvas dimensions based on densest generation
    var maxN=1;
    gens.forEach(function(g){var list=gmap[g]||[];if(list.length>maxN)maxN=list.length;});
    var CARD_W=Math.min(140,Math.max(60,1200/maxN));
    needW=LEFT+maxN*CARD_W*1.2+200; // Total content width

    pos={};
    gens.forEach(function(g){
      var list=gmap[g]||[];
      var y=gens.indexOf(g)*ROW+ROW/2;
      list.forEach(function(p,i){
        var n=list.length>1?list.length:1;
        var x=LEFT+(n>1?i/(n-1):0.5)*(n*CARD_W);
        var w=CARD_W;
        if(n<10) w=Math.min(160,Math.max(80,600/n)); // Few people = wider cards
        pos[p.id]={x:x,y:y,w:w,gen:g,name:p.name,branch:p.branch||'',hl:!!(p.highlight||/^(申伯|小四公|文杲公|攒公|撰公|彬公|乾公|谢安|谢玄|谢灵运|谢尚公|谢枋得|谢深甫)$/.test(p.name)),id:p.id};
      });
    });

    draw();
  }

  function draw() {
    var dpr=window.devicePixelRatio||1;
    var cw=container.clientWidth||1000;
    var w=Math.max(cw, needW);
    var h=Math.max(container.clientHeight||500, gens.length*ROW+80);
    cv.width=w*dpr; cv.height=h*dpr;
    cv.style.width=(cv.width/dpr)+'px'; cv.style.height=(cv.height/dpr)+'px';
    ctx.scale(dpr,dpr);
    var W=cv.width/dpr, H=cv.height/dpr;
    ctx.clearRect(0,0,W,H);
    ctx.save();
    ctx.translate(ox,oy); ctx.scale(sc,sc);

    // Draw rows and gen labels
    gens.forEach(function(g,i){
      var y=i*ROW;
      ctx.fillStyle=i%2===0?'rgba(255,255,255,0.02)':'transparent';
      ctx.fillRect(0,y,W/sc+400,ROW);
      ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.font='bold 13px sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(g+'世', LEFT-10, y+ROW/2-4);
    });

    // Connection lines (parent -> child) - DRAW FIRST
    ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1;
    data.forEach(function(p){
      if(p.father_id==null) return;
      var c=pos[p.id], f=pos[p.father_id];
      if(!c||!f) return;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y+ROW*0.35);
      var mx=(f.x+c.x)/2;
      ctx.bezierCurveTo(mx, f.y+ROW*0.35, mx, c.y-ROW*0.35, c.x, c.y-ROW*0.35);
      ctx.stroke();
      // Small arrow dot at child end
      ctx.beginPath(); ctx.arc(c.x, c.y-ROW*0.35+3, 2, 0, 2*Math.PI); ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fill();
    });

    // Draw people as named cards
    gens.forEach(function(g){
      var list=(data.filter?data.filter(function(p){return(parseInt(p.generation_num)||0)===g;}):[]);
      // Sort by branch then name
      list.sort(function(a,b){
        var ba=a.branch||'', bb=b.branch||'';
        if(ba.indexOf('后枫槎')>=0&&bb.indexOf('后枫槎')<0) return -1;
        if(ba.indexOf('后枫槎')<0&&bb.indexOf('后枫槎')>=0) return 1;
        return (a.name||'').localeCompare(b.name||'');
      });
      list.forEach(function(p){
        var pp=pos[p.id]; if(!pp) return;
        var x=pp.x, y=pp.y, w=pp.w;

        // Color by branch
        var col='#666';
        if(p.branch&&p.branch.indexOf('后枫槎')>=0) col='#22c55e';
        else if(p.branch&&p.branch.indexOf('前枫槎')>=0) col='#6366f1';
        else if(p.branch&&p.branch.indexOf('石马')>=0) col='#f59e0b';

        var h2=30;
        if(pp.hl){
          // Highlighted: larger card with bold name
          w=Math.max(w,80);
          ctx.shadowColor=col; ctx.shadowBlur=8;
          ctx.beginPath(); ctx.roundRect(x-w/2,y-h2/2,w,h2,6); ctx.fillStyle=col; ctx.fill();
          ctx.shadowBlur=0;
          ctx.fillStyle='#fff'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
          var displayName=p.name.length>8?p.name.substring(0,7)+'..':p.name;
          ctx.fillText(displayName,x,y+1);
        } else {
          // Normal: smaller translucent card
          ctx.globalAlpha=0.6;
          ctx.beginPath(); ctx.roundRect(x-w/2,y-h2/2,w,h2,4); ctx.fillStyle=col; ctx.fill();
          ctx.globalAlpha=1;
          if(w>50){
            ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
            var dn=p.name.length>10?p.name.substring(0,9)+'..':p.name;
            ctx.fillText(dn,x,y+1);
          }
        }
      });
    });

    ctx.restore();
  }

  function zm(ns,cx,cy){
    ns=Math.max(0.15,Math.min(5,ns));
    if(ns===sc)return;
    ox=cx-(cx-ox)*ns/sc; oy=cy-(cy-oy)*ns/sc; sc=ns; draw();
  }

  // roundRect polyfill for older browsers
  if(!CanvasRenderingContext2D.prototype.roundRect){
    CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
      if(r>w/2)r=w/2;if(r>h/2)r=h/2;
      this.moveTo(x+r,y);this.lineTo(x+w-r,y);this.quadraticCurveTo(x+w,y,x+w,y+r);
      this.lineTo(x+w,y+h-r);this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      this.lineTo(x+r,y+h);this.quadraticCurveTo(x,y+h,x,y+h-r);
      this.lineTo(x,y+r);this.quadraticCurveTo(x,y,x+r,y);this.closePath();
      return this;
    };
  }

  // Boot
  function boot(){
    try{
      if(document.getElementById('genealogy-overview-container')&&typeof getGenealogyData==='function')init();
      else setTimeout(boot,200);
    }catch(e){setTimeout(boot,500);}
  }
  if(document.readyState==='complete'||document.readyState==='interactive')setTimeout(boot,100);
  else document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,100);});
})();
