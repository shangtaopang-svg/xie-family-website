const fs = require('fs');
let content = fs.readFileSync('pages/history.html', 'utf8');

// Verify original structure
function verify(tag) { return content.indexOf(tag); }
console.log('Original html:', verify('<html'));
console.log('Original /html:', verify('</html>'));
console.log('Original body:', verify('<body'));
console.log('Original /body:', verify('</body>'));

// 1. Replace the shenbo function - find its exact boundaries
const s2Marker = '// ===== Section 2:';
const s2CommentEnd = content.indexOf('function renderShenboTree', s2Marker);
const s2FnStart = content.indexOf('{', s2CommentEnd);
const s2FnEnd = content.indexOf('function renderDongshanTree', s2CommentEnd);

// Find the CLOSING BRACE of renderShenboTree - it's a single } before renderDongshanTree
const preDS = content.substring(s2CommentEnd, s2FnEnd);
const lastBrace = preDS.lastIndexOf('\n      }');
const actualEnd = s2CommentEnd + lastBrace + 1; // include }

console.log('s2Marker:', s2Marker, s2CommentEnd);
console.log('s2FnStart:', s2FnStart);
console.log('s2FnEnd (dongshan):', s2FnEnd);
console.log('actualEnd:', actualEnd);

// Extract what we're replacing
const s2Full = content.substring(s2CommentEnd, actualEnd);
console.log('s2Full length:', s2Full.length);

const s2New = `      // ===== Section 2: 申伯世系（完整表格链） =====
      function renderShenboTree() {
        if (!DATA) { document.getElementById('tree-shenbo').innerHTML = '<div style="padding:20px;color:var(--text-tertiary);">暂无数据</div>'; return; }
        var gYD = [65,66,66,67,67,68,68,69,70,71,72,72,73,74,75,76,77,78,79,80,81,82,83,84,84,84,85,85,85,86,87,88,89,90,90,91,91,91,92,92,93,94,95,96,97,98,98,99,99,99];
        var gSB = [1,2,2,3,3,4,4,5,6,7,8,8,9,10,11,12,13,14,15,16,17,18,19,20,20,20,21,21,21,22,23,24,25,26,26,27,27,27,28,28,29,30,31,32,33,34,34,35,35,35];
        var nms = ['申伯','弘','猛','广','协','列宗','穆宗','骘','预','昌后','达','守礼','子民','秩','雍','林','涣','旺','珽','国辉','宁','福','杨贞','平利','平和','平祖','翠','利','文','武','秉槐','堂','瑛','文轩','文昂','福郎','丙郎','应郎','宜礼','宜乐','逵','简','瑰','懿','鳅','当','景秀','缵','显','顼'];
        var nts = ['谢氏鼻祖','申伯之子','申伯之子','弘之子','弘之子','广之子','广之子','列宗之子','骘之子','预之子','昌后之子','昌后之子','达之子','子民之子','秩之子','雍之子','林之子','涣之子','旺之子','珽之子','国辉之子','宁之子','福之子','杨贞之子','杨贞之子','杨贞之子','平利之子','平利之子','平和之子','文之子','武之子','秉槐之子','堂之子','瑛之子','瑛之子','文轩之子','文轩之子','文轩之子','福郎之子','福郎之子','宜礼之子','逵之子','简之子','瑰之子','懿之子','鳅之后','鳅之后','景秀之后','景秀之后','景秀之后'];
        var html = renderChainTable(gYD, gSB, nms, nts);
        document.getElementById('tree-shenbo').innerHTML = html;
      }`;

// Do the replacement at the exact position
content = content.substring(0, s2CommentEnd) + s2New + '\n\n' + content.substring(actualEnd);

// 2. Replace the dongshan function
const d2Marker = '// ===== Section 3:';
const d2FnStart = content.indexOf('function renderDongshanTree', d2Marker);
const d2FnBody = content.indexOf('{', d2FnStart);
const d2FnEnd = content.indexOf('// Re-export render', d2FnStart);
const preOther = content.substring(d2FnStart, d2FnEnd);
const d2LastBrace = preOther.lastIndexOf('\n      }');
const d2ActualEnd = d2FnStart + d2LastBrace + 1;

const d2Full = content.substring(d2Marker, d2ActualEnd);
console.log('d2Full length:', d2Full.length);

const d2New = `      // ===== Section 3: 始宁东山世系（完整表格链） =====
      function renderDongshanTree() {
        if (!DATA) { document.getElementById('tree-dongshan').innerHTML = '<div style="padding:20px;color:var(--text-tertiary);">暂无数据</div>'; return; }
        var gYD = [99,100,101,101,101,102,102,102,102,102,102,102,103,103,104,104,104,105,106,107,107,107,107,107,108,109,109,110,110,110,111,111,112,112,113,113,114,115,115,115,116,117,117,118,119,120,121,121,122];
        var gSB = [1,2,3,3,3,4,4,4,4,4,4,4,5,5,6,6,6,7,8,9,9,9,9,9,10,11,11,12,12,12,13,13,14,14,15,15,16,17,17,17,18,19,19,20,21,22,23,23,24];
        var nms = ['缵','衡','鲲','裒','广','奕','据','安','万','淮','石','铁','瑶','琰','肇','峻','混','密','庄','飏','胜','灏','丛','沦','览','琢','侨','琂','琬','琉','峤','植','钝','缪','修','豹','恺','骢','驼','绰','式','革','造','直','是温','翳','静','观','闓'];
        var nts = ['东山第一世','会稽东山始祖','衡之子','衡之子，谢安之父','衡之子','裒之子','裒之子','淝水之战名相','裒之子','裒之子','裒之子','裒之子','安之子','安之子','琰之子','琰之子','琰之子','混之子','密之子','庄之子','庄之子','庄之子','庄之子','庄之子','飏之子','览之子','览之子','琢之子','琢之子','琢之子','琂之子','琂之子','植之子','植之子','钝之子','钝之子','修之子','恺之子','恺之子','恺之子','绰之子','式之子','式之子','造之子','直之子','是温之子','翳之子','翳之子','观之子/临海下渡第一世'];
        var html = renderChainTable(gYD, gSB, nms, nts);
        document.getElementById('tree-dongshan').innerHTML = html;
      }`;

content = content.substring(0, d2Marker) + d2New + '\n\n' + content.substring(d2ActualEnd);

// 3. Add renderChainTable function before renderChain
const fnName = 'function renderChainTable';
if (content.indexOf(fnName) >= 0) {
  // Already exists from earlier attempt - skip
  console.log('renderChainTable already exists');
} else {
  const rcStart = content.indexOf('function renderChain');
  const tableFn = `
      // ===== 表格链渲染器（同远古世系风格） =====
      function renderChainTable(gYD, gSB, nms, nts) {
        var html = '<div style="padding:8px 0;">';
        var prevYD = -1;
        for (var i=0; i<nms.length; i++) {
          var isNewGen = (gYD[i] !== prevYD);
          if (isNewGen && i > 0) {
            html += '<div style="padding-left:20px;"><div style="width:2px;height:12px;background:var(--accent-orange);opacity:0.15;margin:0 auto;"></div></div>';
          }
          if (i === 0) {
            html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 12px;border-radius:8px;border:1.5px solid var(--accent-orange);background:rgba(251,146,60,0.1);cursor:pointer;" onclick="lineageDetail('+(findPId(nms[i])||0)+')">';
            html += '<div style="display:flex;flex-direction:column;align-items:center;gap:1px;min-width:36px;">';
            html += '<span style="font-size:10px;font-weight:600;color:var(--accent-orange);">炎' + gYD[i] + '世</span>';
            html += '<span style="font-size:10px;color:var(--text-tertiary);">申' + gSB[i] + '世</span>';
            html += '</div>';
            html += '<div style="flex:1;"><div style="font-weight:700;font-size:14px;color:var(--text-primary);">' + esc(nms[i]) + '</div>';
            if (nts[i]) html += '<div style="font-size:11px;color:var(--text-muted);margin-top:1px;">' + esc(nts[i]) + '</div>';
            html += '</div></div>';
          } else if (isNewGen) {
            html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:4px 12px;border-radius:6px;border:1.5px solid var(--accent-orange);background:rgba(251,146,60,0.06);cursor:pointer;margin-top:2px;" onclick="lineageDetail('+(findPId(nms[i])||0)+')">';
            html += '<div style="display:flex;flex-direction:column;align-items:center;gap:1px;min-width:36px;">';
            html += '<span style="font-size:10px;font-weight:600;color:var(--accent-orange);">炎' + gYD[i] + '世</span>';
            html += '<span style="font-size:10px;color:var(--text-tertiary);">申' + gSB[i] + '世</span>';
            html += '</div>';
            html += '<div style="flex:1;"><div style="font-weight:600;font-size:13px;color:var(--text-primary);">' + esc(nms[i]) + ' <span style="font-size:9px;color:var(--accent-orange);font-weight:400;">✧直系</span></div>';
            if (nts[i]) html += '<div style="font-size:10px;color:var(--text-muted);">' + esc(nts[i]) + '</div>';
            html += '</div></div>';
          } else {
            html += '<div style="display:flex;align-items:flex-start;gap:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--glass-border);background:var(--bg-card);cursor:pointer;margin-left:28px;margin-top:1px;" onclick="lineageDetail('+(findPId(nms[i])||0)+')">';
            html += '<div style="font-weight:500;font-size:13px;color:var(--text-secondary);">' + esc(nms[i]) + '</div>';
            if (nts[i]) html += '<div style="font-size:10px;color:var(--text-muted);margin-left:4px;">' + esc(nts[i]) + '</div>';
            html += '</div>';
          }
          prevYD = gYD[i];
        }
        html += '</div>';
        return html;
      }

      function findPId(name) {
        if (!DATA) return 0;
        for (var i=0;i<DATA.length;i++) { if (DATA[i].name === name) return DATA[i].id; }
        return 0;
      }

`;
  content = content.substring(0, rcStart) + tableFn + content.substring(rcStart);
}

// Final verification
console.log('DOCTYPE count:', (content.match(/<!DOCTYPE/g)||[]).length);
console.log('html count:', (content.match(/<html[ >]/g)||[]).length);
console.log('/html count:', (content.match(/<\/html>/g)||[]).length);
console.log('body count:', (content.match(/<body[ >]/g)||[]).length);
console.log('/body count:', (content.match(/<\/body>/g)||[]).length);

if ((content.match(/<!DOCTYPE/g)||[]).length !== 1) {
  console.log('ERROR: Multiple DOCTYPE! Not writing.');
  process.exit(1);
}

fs.writeFileSync('pages/history.html', content, 'utf8');
console.log('Written OK. Size:', content.length);
