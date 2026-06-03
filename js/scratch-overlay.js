/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   Scratch overlay — reveal Xie character
   Extracted from index.html
   ============================================ */

(function() {
var _p=[];_a=null;_r=0;_t=0;_startTime=0;
function initS(){
var o=document.getElementById('scratch-overlay'),v=document.getElementById('scratch-cv');if(!v)return;
o.style.display='block';document.body.style.overflow='hidden';
document.getElementById('scratch-char').style.opacity='0';
var btn=document.getElementById('scratch-btn');if(btn)btn.style.display='none';
var tip=document.querySelector('#scratch-btn + div');if(tip)tip.style.display='none';
var x=v.getContext('2d'),r=o.getBoundingClientRect();
v.width=r.width*2;v.height=r.height*2;v.style.width=r.width+'px';v.style.height=r.height+'px';x.scale(2,2);
var W=r.width,H=r.height;_p=[];_r=0;_startTime=Date.now();
var n=1200;_t=n;
for(var i=0;i<n;i++)_p.push({
x:Math.random()*W,y:Math.random()*H,r:3+Math.random()*12,
a:0.4+Math.random()*0.5,d:Math.random()*2000,
c:[55+Math.random()*45,40+Math.random()*30,30+Math.random()*25],
p:false,pt:[]
});
drawS(x,W,H);
v.onmousemove=function(e){popS(e,v);};v.onclick=function(e){popS(e,v);};
v.ontouchmove=function(e){popS(e,v);};v.ontouchstart=function(e){popS(e,v);};
if(_a)cancelAnimationFrame(_a);anS(x,W,H);
}
function popS(e,v){
var r=v.getBoundingClientRect(),mx=e.touches?e.touches[0].clientX-r.left:e.clientX-r.left;
var my=e.touches?e.touches[0].clientY-r.top:e.clientY-r.top;
for(var i=0;i<_p.length;i++){var b=_p[i];if(b.p)continue;
var dx=mx-b.x,dy=my-b.y;
if(dx*dx+dy*dy<60*60){b.p=true;_r++;b.pt=[];for(var j=0;j<4;j++){var a=Math.random()*6.28,s=1+Math.random()*2;b.pt.push({x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,r:1+Math.random()*3});}}}
upMsg();}
function autoReveal(){var elapsed=Date.now()-_startTime;
var autoPct=Math.min(100,elapsed/4500*100);
var target=Math.round(autoPct/100*_t);
for(var i=0;i<_p.length&&_r<target;i++){if(!_p[i].p){_p[i].p=true;_r++;_p[i].pt=[];}}
upMsg();}
function upMsg(){var h=document.getElementById('scratch-msg');if(!h)return;
var p=Math.round(_r/_t*100);
document.getElementById('scratch-char').style.opacity=Math.min(1,p/85).toFixed(2);
if(p<30)h.innerHTML='<span style="font-size:14px;">沙尘渐渐散去...</span>';
else if(p<60)h.innerHTML='<span style="font-size:15px;">「<b>谢</b>」字逐渐显现</span>';
else if(p<90)h.innerHTML='<span style="font-size:16px;">✨ 就快看到了...</span>';
else if(p<100)h.innerHTML='<span style="font-size:18px;">🌟 「谢」字即将呈现！</span>';
else{h.innerHTML='<span style="font-size:22px;">✨ 「谢」字 ✨</span>';h.style.color='#7B4A2A';
document.getElementById('scratch-char').style.textShadow='0 0 30px rgba(123,74,42,0.15)';}}
function drawS(x,W,H){x.clearRect(0,0,W,H);
for(var i=0;i<_p.length;i++){var b=_p[i];
if(b.p){for(var j=0;j<b.pt.length;j++){var pt=b.pt[j];if(pt.l>0){x.beginPath();x.arc(pt.x,pt.y,pt.r*pt.l,0,7);x.fillStyle='rgba(100,70,45,'+(pt.l*0.5)+')';x.fill();}}continue;}
x.beginPath();x.arc(b.x,b.y,b.r,0,7);
x.fillStyle='rgba('+b.c[0]+','+b.c[1]+','+b.c[2]+','+b.a+')';x.fill();}}
function anS(x,W,H){autoReveal();
for(var i=0;i<_p.length;i++){var b=_p[i];
if(b.p&&b.pt)for(var j=0;j<b.pt.length;j++){var pt=b.pt[j];pt.x+=pt.vx;pt.y+=pt.vy;pt.vy+=0.03;pt.l-=0.015;}
if(!b.p){b.x+=Math.cos(Date.now()/2500+i)*0.03;b.y+=Math.sin(Date.now()/2000+i)*0.05;}}
drawS(x,W,H);_a=requestAnimationFrame(function(){anS(x,W,H);});}
function closeS(){document.getElementById('scratch-overlay').style.display='none';document.body.style.overflow='';
var btn=document.getElementById('scratch-btn');if(btn)btn.style.display='flex';
var tip=document.querySelector('#scratch-btn + div');if(tip)tip.style.display='block';
if(_a){cancelAnimationFrame(_a);_a=null;}}
document.addEventListener('DOMContentLoaded',function(){
// Add floating scratch button
var sb=document.createElement('div');
sb.id='scratch-btn';
sb.innerHTML='🎉';
sb.style.cssText='position:fixed;bottom:80px;right:80px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#ff6b00,#e8590c);color:#fff;font-size:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;box-shadow:0 4px 20px rgba(232,89,12,0.4);border:none;transition:transform 0.2s;';
sb.onmouseover=function(){this.style.transform='scale(1.1)';};
sb.onmouseout=function(){this.style.transform='scale(1)';};
sb.onclick=initS;
document.body.appendChild(sb);
// Tooltip
var st=document.createElement('div');
st.textContent='揭谢字';
st.style.cssText='position:fixed;bottom:148px;right:80px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 12px;border-radius:4px;font-size:12px;z-index:9998;pointer-events:none;';
document.body.appendChild(st);
});
})();
