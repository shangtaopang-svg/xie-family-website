/* 世代时间轴 v2 - 带年代映射和人名标注 */
(function() {
  function estimateYear(genNum) {
    // Approximate: gen 1 (炎帝) ~ -2800, gen 162 ~ 2026
    // Roughly 28.6 years per generation
    return Math.round(-2800 + genNum * 28.6);
  }

  function renderTimeline() {
    var canvas = document.getElementById('timeline-canvas');
    if (!canvas) return;
    var data = (typeof getGenealogyData === 'function') ? getGenealogyData() : null;
    if (!data || data.length === 0) return;

    // Group by generation
    var genPop = {}, genChars = {}, genNames = {};
    data.forEach(function(p) {
      var g = parseInt(p.generation_num) || 0;
      if (!genPop[g]) { genPop[g] = 0; genNames[g] = []; }
      genPop[g]++;
      if (p.generation && p.generation !== '—') genChars[g] = p.generation;
      genNames[g].push(p.name.replace(/[（(].*[）)]/g,'').substring(0,6));
    });
    var genNums = Object.keys(genPop).map(Number).sort(function(a,b){return a-b});
    var maxPop = 1;
    genNums.forEach(function(g) { if (genPop[g] > maxPop) maxPop = genPop[g]; });

    // Key ancestors with year
    var keyAncestors = {};
    data.forEach(function(p) {
      var gn = parseInt(p.generation_num) || 0;
      if (!keyAncestors[gn] && /^(炎帝|申伯|小四|文杲|攒|撰|彬|乾|深甫|云先|临魁|谢安|谢玄)/.test(p.name)) {
        var name = p.name.replace(/[（(].*[）)]/g,'').substring(0,5);
        keyAncestors[gn] = {name: name, year: estimateYear(gn)};
      }
    });

    // Dynasties with year range
    var dynasties = [
      {start:0,end:60,label:'上古·传说', yearStart:-2800, yearEnd:-1000, color:'rgba(180,100,80,0.12)'},
      {start:61,end:80,label:'周', yearStart:-1000, yearEnd:-200, color:'rgba(200,150,80,0.12)'},
      {start:81,end:100,label:'秦汉', yearStart:-200, yearEnd:200, color:'rgba(80,130,180,0.12)'},
      {start:101,end:120,label:'魏晋南北朝', yearStart:200, yearEnd:600, color:'rgba(150,100,180,0.12)'},
      {start:121,end:130,label:'隋唐', yearStart:600, yearEnd:900, color:'rgba(180,120,80,0.12)'},
      {start:131,end:140,label:'宋', yearStart:900, yearEnd:1300, color:'rgba(80,160,120,0.12)'},
      {start:141,end:150,label:'元明', yearStart:1300, yearEnd:1650, color:'rgba(160,80,80,0.12)'},
      {start:151,end:165,label:'清·近代', yearStart:1650, yearEnd:2026, color:'rgba(80,80,160,0.12)'},
    ];

    var container = canvas.parentElement;
    var cw = container.clientWidth || 900;
    var ch = 340;
    var dpr = window.devicePixelRatio || 1;
    var totalW = Math.max(cw, genNums.length * 24 + 120);
    canvas.width = totalW * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = totalW + 'px';
    canvas.style.height = ch + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var margin = {top:34,bottom:50,left:60,right:20};
    var plotW = totalW - margin.left - margin.right;
    var plotH = ch - margin.top - margin.bottom;

    function genX(g) {
      var idx = genNums.indexOf(g);
      return idx < 0 ? margin.left : margin.left + (idx / (genNums.length - 1 || 1)) * plotW;
    }

    // Dynasty bands with year labels
    dynasties.forEach(function(dy) {
      var x1=genX(dy.start), x2=genX(dy.end);
      ctx.fillStyle=dy.color; ctx.fillRect(x1,margin.top,x2-x1,plotH);
      // Dynasty label
      ctx.shadowColor='rgba(0,0,0,0.8)'; ctx.shadowBlur=4;
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(dy.label,(x1+x2)/2,margin.top+13);
      ctx.shadowBlur=0;
      // Year label
      var yearLabel = (dy.yearStart < 0 ? (-dy.yearStart)+'BC' : dy.yearStart) + ' - ' + dy.yearEnd;
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='9px sans-serif';
      ctx.fillText(yearLabel,(x1+x2)/2,margin.top+25);
    });

    // Baseline
    var blY = margin.top + plotH * 0.82;
    ctx.strokeStyle='rgba(251,146,60,0.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(margin.left,blY); ctx.lineTo(totalW-margin.right,blY); ctx.stroke();

    // Draw bars with person count and names
    genNums.forEach(function(g) {
      var x=genX(g)-10;
      var barH=Math.max(3, (genPop[g]/maxPop)*plotH*0.68);
      var y=blY-barH;
      // Bar fill
      ctx.fillStyle='rgba(251,146,60,'+(0.35+(genPop[g]/maxPop)*0.55)+')';
      ctx.fillRect(x,y,20,barH);
      ctx.strokeStyle='rgba(251,146,60,0.25)'; ctx.lineWidth=0.5; ctx.strokeRect(x,y,20,barH);
      // Person count above bar
      if (genPop[g] > 1 || keyAncestors[g]) {
        ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=3;
        ctx.fillStyle='rgba(255,200,150,0.9)'; ctx.font='9px sans-serif'; ctx.textAlign='center';
        ctx.fillText(genPop[g]+'人', genX(g), y-4);
        ctx.shadowBlur=0;
      }
      // Name label on bar for small-population generations
      if (genPop[g] <= 3 && genNames[g].length > 0) {
        ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=3;
        ctx.fillStyle='rgba(255,220,200,0.85)'; ctx.font='9px sans-serif'; ctx.textAlign='center';
        ctx.fillText(genNames[g][0], genX(g), y + barH/2 + 3);
        ctx.shadowBlur=0;
      }
    });

    // Generation & year labels
    var ls = Math.max(1, Math.floor(genNums.length / 35));
    genNums.forEach(function(g,i) {
      if(i%ls!==0 && g!==1 && g!==genNums[genNums.length-1]) return;
      var x=genX(g);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(g+'世', x, blY+16);
      ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='9px sans-serif';
      var y = estimateYear(g);
      ctx.fillText((y<0?(-y)+'BC':y), x, blY+30);
    });

    // Key ancestor markers
    genNums.forEach(function(g) {
      if(!keyAncestors[g]) return;
      var x=genX(g), barH=Math.max(3,(genPop[g]/maxPop)*plotH*0.68), y=blY-barH-8;
      ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
      ctx.fillStyle='#ff6b00'; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.fillStyle='rgba(255,200,150,0.95)'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(keyAncestors[g].name, x, y-10);
    });

    // Store for interaction
    canvas._tData = {genPop:genPop, genNums:genNums, genChars:genChars, genNames:genNames, genXfn:genX, blY:blY, estimateYear:estimateYear};
  }

  window.renderTimeline = renderTimeline;

  document.addEventListener('DOMContentLoaded', function() {
    renderTimeline();
  });

  // Tooltip + click interaction
  document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('timeline-canvas');
    if (!canvas) return;
    var tip = document.getElementById('timeline-tooltip');
    if (!tip) return;

    canvas.addEventListener('mousemove', function(e) {
      if (!canvas._tData) return;
      var d=canvas._tData, rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(canvas.width/rect.width);
      var best=null,bd=Infinity;
      d.genNums.forEach(function(g){var a=Math.abs(d.genXfn(g)-mx);if(a<bd){bd=a;best=g;}});
      if(best!==null&&bd<30){
        var pop=d.genPop[best]||0,ch=d.genChars[best]||'', yr=d.estimateYear(best);
        var yrStr=(yr<0?(-yr)+' BC':yr+' AD');
        ch=(ch&&ch!=='—')?'「'+ch+'」字辈 ':'';
        var names = (d.genNames[best]||[]).slice(0,4).join('、');
        tip.innerHTML='<b>第'+best+'世</b> ('+yrStr+')<br>'+ch+'<b>'+pop+'人</b><br><span style="font-size:11px;opacity:0.7;">'+names+'</span>';
        tip.style.display='block'; tip.style.left=Math.min((e.clientX-rect.left+14),rect.width-200)+'px';
        tip.style.top=(e.clientY-rect.top-50)+'px';
        canvas.style.cursor='pointer';
      }else{tip.style.display='none';canvas.style.cursor='crosshair';}
    });
    canvas.addEventListener('mouseleave',function(){tip.style.display='none';});
    canvas.addEventListener('click',function(e){
      if(!canvas._tData)return;
      var d=canvas._tData,rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(canvas.width/rect.width);
      var best=null,bd=Infinity;
      d.genNums.forEach(function(g){var a=Math.abs(d.genXfn(g)-mx);if(a<bd){bd=a;best=g;}});
      if(best===null||bd>=30)return;
      var data=(typeof getGenealogyData==='function')?getGenealogyData():[];
      var people=data.filter(function(p){return parseInt(p.generation_num)===best;});
      if(!people.length)return;
      var ch=people[0]&&people[0].generation;
      var gl=(ch&&ch!=='—')?'「'+ch+'」字辈 ':'';
      var title=gl+'第'+best+'世 共'+people.length+'人';
      var htm='<div style="padding:20px;max-height:70vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h3 style="margin:0;font-family:var(--font-title);color:var(--accent-orange);font-size:18px;font-weight:600;">'+title+'</h3><button onclick="this.closest(\'.person-detail-modal\').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);">&times;</button></div><div style="display:grid;gap:8px;">';
      people.sort(function(a,b){return(a.name||'').localeCompare(b.name||'');});
      people.forEach(function(p){
        htm+='<div onclick="showPersonDetail('+p.id+',getGenealogyData())" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;"><div><span style="font-weight:600;color:var(--text-primary);">'+escapeHtml(p.name)+'</span><span style="font-size:12px;color:var(--text-tertiary);margin-left:8px;">'+(p.gender||'')+'</span></div><div style="font-size:12px;">'+(p.is_alive==='是'?'在世':'已故')+'<span style="margin-left:12px;color:var(--accent-orange);">→ 详情</span></div></div>';
      });
      htm+='</div></div>';
      var overlay=document.createElement('div');overlay.className='person-detail-modal';overlay.onclick=function(ev){if(ev.target===overlay)overlay.remove();};
      var box=document.createElement('div');box.className='person-detail-box';box.style.maxWidth='550px';box.innerHTML=htm;overlay.appendChild(box);document.body.appendChild(overlay);
    });
  });
})();
