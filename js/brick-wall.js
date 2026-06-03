/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Brick flip photo wall
   Extracted from index.html
   ============================================ */

(function() {
// ===== Brick Flip Reveal Wall =====
var brickPhotos = [
  { src:'images/carousel/11.jpg', label:'村景 01' },
  { src:'images/carousel/23.jpg', label:'村景 02' },
  { src:'images/carousel/36.jpg', label:'村景 03' },
  { src:'images/carousel/37.jpg', label:'村景 04' },
  { src:'images/carousel/38.jpg', label:'村景 05' },
  { src:'images/carousel/40.jpg', label:'村景 06' },
  { src:'images/carousel/42.jpg', label:'村景 07' },
  { src:'images/carousel/51.jpg', label:'村景 08' },
  { src:'images/carousel/52.jpg', label:'村景 09' },
  { src:'images/carousel/121.jpg', label:'村景 10' },
  { src:'images/carousel/123.jpg', label:'村景 11' },
  { src:'images/carousel/W020230307562232959074.jpg', label:'宗祠全景' },
  { src:'images/carousel/W020230307562236561236.jpg', label:'宗祠内景' },
  { src:'images/carousel/W020230307562239043622.jpg', label:'古树' },
  { src:'images/carousel/W020230307562241110405.jpg', label:'活动留影' },
];

function buildBrickGrid() {
  var grid = document.getElementById('brick-grid');
  if (!grid) return;
  grid.innerHTML = '';
  grid.style.cssText = 'position:relative;width:100%;max-width:700px;height:600px;margin:0 auto;';
  var cx = 350, cy = 280, radius = 220;
  var shuffled = brickPhotos.slice().sort(function(){return 0.5-Math.random();});
  shuffled.forEach(function(photo, idx) {
    var angle = (idx / shuffled.length) * Math.PI * 2 - Math.PI / 2;
    var bx = cx + Math.cos(angle) * radius - 30;
    var by = cy + Math.sin(angle) * radius - 30;
    if (idx >= 12) { bx = cx + Math.cos(angle) * (radius - 70) - 30; by = cy + Math.sin(angle) * (radius - 70) - 30; }
    if (idx >= 14) { bx = cx + Math.cos(angle) * (radius - 130) - 30; by = cy + Math.sin(angle) * (radius - 130) - 30; }
    var brick = document.createElement('div');
    brick.style.cssText = 'position:absolute;left:'+bx+'px;top:'+by+'px;width:60px;height:60px;cursor:pointer;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transition:transform 0.6s cubic-bezier(0.34,1.56,0.64,1);border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);overflow:hidden;';
    brick.setAttribute('data-flipped','false');
    // Back face
    var back = document.createElement('div');
    var tc = ['#c4956a','#b8895e','#d4a97a','#a67c52','#c49a6e'][idx % 5];
    back.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;border-radius:8px;background:linear-gradient(145deg,'+tc+','+(idx%2===0?'#8b6d4a':'#a67c52')+');display:flex;align-items:center;justify-content:center;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1;';
    back.innerHTML = '<span style="font-size:18px;color:rgba(255,255,255,0.15);font-family:serif;">谢</span>';
    // Front face
    var front = document.createElement('div');
    front.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;border-radius:8px;overflow:hidden;-webkit-backface-visibility:hidden;backface-visibility:hidden;transform:rotateY(180deg);z-index:2;';
    front.innerHTML = '<img src="'+photo.src+'" alt="'+photo.label+'" style="width:100%;height:100%;object-fit:cover;display:block;">';
    brick.appendChild(back);
    brick.appendChild(front);
    grid.appendChild(brick);
  });
  document.getElementById('brick-status').textContent = '共 '+brickPhotos.length+' 块';
}

function brickStart() {
  var all = document.querySelectorAll('#brick-grid > div');
  if (all.length === 0) { buildBrickGrid(); all = document.querySelectorAll('#brick-grid > div'); }
  document.getElementById('brick-go-btn').disabled = true;
  document.getElementById('brick-go-btn').textContent = '⏳ 翻转中...';
  var order = []; for(var i=0;i<all.length;i++) order.push(i);
  order.sort(function(){return 0.5-Math.random();});
  var flipped = 0;
  order.forEach(function(idx, step) {
    setTimeout(function() {
      var b = all[idx]; if (!b || b.getAttribute('data-flipped')==='true') return;
      var rx = (Math.random()-0.5)*15;
      var ry = 180 + (Math.random()-0.5)*10;
      var rz = (Math.random()-0.5)*12;
      b.style.transform = 'rotateX('+rx+'deg) rotateY('+ry+'deg) rotateZ('+rz+'deg) scale(1.08)';
      b.setAttribute('data-flipped','true');
      flipped++;
      document.getElementById('brick-status').textContent = '共 '+brickPhotos.length+' 块 · 已翻转 '+flipped;
      setTimeout(function(){b.style.transform='rotateX('+(rx*0.3)+'deg) rotateY(180deg) rotateZ('+(rz*0.3)+'deg) scale(1)';},400);
      if(flipped>=all.length){
        document.getElementById('brick-go-btn').disabled=false;
        document.getElementById('brick-go-btn').textContent='▶ 再来一次';
        document.getElementById('brick-status').textContent='✨ 全部翻转完成！点击照片查看大图';
      }
    }, step * (70 + Math.random() * 120));
  });
}

function brickReset() {
  document.querySelectorAll('#brick-grid > div').forEach(function(b){
    b.style.transform = 'rotateY(0deg) scale(1)';
    b.setAttribute('data-flipped','false');
  });
  document.getElementById('brick-go-btn').disabled = false;
  document.getElementById('brick-go-btn').textContent = '▶ 开始翻转';
  document.getElementById('brick-status').textContent = '共 '+brickPhotos.length+' 块 · 已翻转 0';
}

document.addEventListener('DOMContentLoaded', buildBrickGrid);
})();
