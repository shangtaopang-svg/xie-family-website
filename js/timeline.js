/* 世代时间轴 v1 */
(function() {
  function renderTimeline() {
    var canvas = document.getElementById('timeline-canvas');
    if (!canvas) return;
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : null;
    if (!data || data.length === 0) return;

    var genPop = {}, genChars = {};
    data.forEach(function(p) {
      var g = parseInt(p.generation_num) || 0;
      genPop[g] = (genPop[g] || 0) + 1;
      if (p.generation && p.generation !== '—') genChars[g] = p.generation;
    });
    var genNums = Object.keys(genPop).map(Number).sort(function(a,b){return a-b});
    var maxPop = 1;
    genNums.forEach(function(g) { if (genPop[g] > maxPop) maxPop = genPop[g]; });

    var keyAncestors = {};
    data.forEach(function(p) {
      var gn = parseInt(p.generation_num) || 0;
      if (!keyAncestors[gn] && /^(炎帝|申伯|小四|文柲|攒|撰|彬|乾|深甫|云先)/.test(p.name)) {
        keyAncestors[gn] = p.name.replace(/[（(].*[）)]/g,'').substring(0,4);
      }
    });

    var dynasties = [
      {start:0,end:60,label:'上古',color:'rgba(180,100,80,0.12)'},
      {start:61,end:80,label:'周',color:'rgba(200,150,80,0.12)'},
      {start:81,end:100,label:'秦汉',color:'rgba(80,130,180,0.12)'},
      {start:101,end:120,label:'魏晋南北朝',color:'rgba(150,100,180,0.12)'},
      {start:121,end:130,label:'隋唐',color:'rgba(180,120,80,0.12)'},
      {start:131,end:140,label:'宋',color:'rgba(80,160,120,0.12)'},
      {start:141,end:150,label:'元明',color:'rgba(160,80,80,0.12)'},
      {start:151,end:165,label:'清·近代',color:'rgba(80,80,160,0.12)'},
    ];

    var container = canvas.parentElement;
    var cw = container.clientWidth || 900;
    var ch = 320;
    var dpr = window.devicePixelRatio || 1;
    var totalW = Math.max(cw, genNums.length * 22 + 100);
    canvas.width = totalW * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = totalW + 'px';
    canvas.style.height = ch + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var margin = {top:30,bottom:40,left:50,right:20};
    var plotW = totalW - margin.left - margin.right;
    var plotH = ch - margin.top - margin.bottom;

    function genX(g) {
      var idx = genNums.indexOf(g);
      return idx < 0 ? margin.left : margin.left + (idx / (genNums.length - 1 || 1)) * plotW;
    }

    dynasties.forEach(function(dy) {
      var x1=genX(dy.start), x2=genX(dy.end);
      ctx.fillStyle=dy.color; ctx.fillRect(x1,margin.top,x2-x1,plotH);
      ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(dy.label,(x1+x2)/2,margin.top+14);
    });

    var blY = margin.top + plotH * 0.85;
    ctx.strokeStyle='rgba(251,146,60,0.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(margin.left,blY); ctx.lineTo(totalW-margin.right,blY); ctx.stroke();

    genNums.forEach(function(g) {
      var x=genX(g)-8, barH=(genPop[g]/maxPop)*plotH*0.7, y=blY-barH;
      ctx.fillStyle='rgba(251,146,60,'+(0.4+(genPop[g]/maxPop)*0.5)+')';
      ctx.fillRect(x,y,16,barH);
      ctx.strokeStyle='rgba(251,146,60,0.3)'; ctx.lineWidth=0.5; ctx.strokeRect(x,y,16,barH);
    });

    var ls = Math.max(1, Math.floor(genNums.length / 40));
    genNums.forEach(function(g,i) {
      if (i%ls!==0 && g!==1 && g!==genNums[genNums.length-1]) return;
      ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(g+'世', genX(g), blY+18);
    });

    genNums.forEach(function(g) {
      if (!keyAncestors[g]) return;
      var x=genX(g), barH=(genPop[g]/maxPop)*plotH*0.7, y=blY-barH-5;
      ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
      ctx.fillStyle='#ff6b00'; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.fillStyle='rgba(255,200,150,0.9)'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(keyAncestors[g], x, y-10);
    });

    canvas._tData = {genPop:genPop, genNums:genNums, genChars:genChars, genXfn:genX, blY:blY};
  }

  window.renderTimeline = renderTimeline;

  document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('timeline-canvas');
    if (!canvas) return;
    var tip = document.getElementById('timeline-tooltip');
    if (!tip) return;

    canvas.addEventListener('mousemove', function(e) {
      if (!canvas._tData) return;
      var d=canvas._tData, rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(canvas.width/rect.width);
      var best=null, bd=Infinity;
      d.genNums.forEach(function(g){var a=Math.abs(d.genXfn(g)-mx); if(a<bd){bd=a;best=g;}});
      if (best!==null && bd<30) {
        var pop=d.genPop[best]||0, ch=d.genChars[best]||'';
        ch = (ch && ch!=='—') ? '「'+ch+'」字辈· ' : '';
        tip.innerHTML = ch+'第'+best+'世·'+pop+'人';
        tip.style.display='block'; tip.style.left=(e.clientX-rect.left+14)+'px';
        tip.style.top=(e.clientY-rect.top-40)+'px';
        canvas.style.cursor='pointer';
      } else { tip.style.display='none'; canvas.style.cursor='crosshair'; }
    });

    canvas.addEventListener('mouseleave', function() { tip.style.display='none'; });

    canvas.addEventListener('click', function(e) {
      if (!canvas._tData) return;
      var d=canvas._tData, rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(canvas.width/rect.width);
      var best=null, bd=Infinity;
      d.genNums.forEach(function(g){var a=Math.abs(d.genXfn(g)-mx); if(a<bd){bd=a;best=g;}});
      if (best===null || bd>=30) return;
      var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : [];
      var people = data.filter(function(p){return parseInt(p.generation_num)===best;});
      if (!people.length) return;
      var ch = people[0] && people[0].generation;
      var gl = (ch && ch!=='—') ? '「'+ch+'」字辈· ' : '';
      var title = gl+'第'+best+'世 共'+people.length+'人';
      var htm = '<div style="padding:20px;max-height:70vh;overflow-y:auto;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
        + '<h3 style="margin:0;font-family:var(--font-title);color:var(--accent-orange);font-size:18px;font-weight:600;">'+title+'</h3>'
        + '<button onclick="this.closest(\'.person-detail-modal\').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);">&times;</button></div>'
        + '<div style="display:grid;gap:8px;">';
      people.sort(function(a,b){return(a.name||'').localeCompare(b.name||'');});
      people.forEach(function(p) {
        htm += '<div onclick="showPersonDetail('+p.id+',getGenealogyData())" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;">'
          + '<div><span style="font-weight:600;color:var(--text-primary);">'+escapeHtml(p.name)+'</span>'
          + '<span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">'+(p.gender||'')+'</span></div>'
          + '<div style="font-size:12px;">'+(p.is_alive==='是'?'在世':'已故')
          + '<span style="margin-left:12px;color:var(--accent-orange);">→ 详情</span></div></div>';
      });
      htm += '</div></div>';
      var overlay=document.createElement('div');
      overlay.className='person-detail-modal';
      overlay.onclick=function(ev){if(ev.target===overlay)overlay.remove();};
      var box=document.createElement('div');
      box.className='person-detail-box';
      box.style.maxWidth='550px';
      box.innerHTML=htm;
      overlay.appendChild(box);
      document.body.appendChild(overlay);
    });
  });
})();
