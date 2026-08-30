  // ===== Load data =====
  function getFullSeedData() {
    return [
      {id:1,name:'谢小四',gender:'男',generation:'—',generation_num:0,branch:'石马(下谢)',birth_date:'宋靖康年间',is_alive:'否',highlight:true,biography:'会稽人，宋靖康年间迁居石马，入浙东之近祖。下枫槎谢氏之直系渊源。'},
      {id:2,name:'文杲公',gender:'男',generation:'—',generation_num:1,branch:'枫槎始祖',father_id:1,birth_date:'北宋宣和(约1125)',is_alive:'否',highlight:true,biography:'字克源，宋登仕郎，越溪司巡检。英敏卓荦，文武兼备，始居岩下，为枫槎谢氏之始迁祖。至今近九百载，传三十六世。'},
      {id:3,name:'攒公',gender:'男',generation:'—',generation_num:2,branch:'后枫槎派',father_id:2,is_alive:'否',highlight:true,biography:'文杲公长子，分居后枫槎，开一派之先河。'},
      {id:4,name:'撰公',gender:'男',generation:'—',generation_num:2,branch:'前枫槎派',father_id:2,is_alive:'否',highlight:true,biography:'文杲公次子，分居前枫槎，与前枫槎派并立。'},
      {id:5,name:'彬公',gender:'男',generation:'—',generation_num:16,branch:'后枫槎东房',birth_date:'明隆庆壬申(1572)',is_alive:'否',highlight:true,biography:'字叔仅，十六世祖。明隆庆六年壬申（1572年），时遭洪水之患，岁季始迁枫槎，为下枫槎开基之祖。'},
      {id:6,name:'乾公',gender:'男',generation:'—',generation_num:16,branch:'后枫槎东房',birth_date:'明隆庆壬申(1572)',is_alive:'否',highlight:true,biography:'与彬公昆仲，明隆庆六年壬申（1572年），山洪暴发，庐舍为墟。与彬公相度地势，遂迁于双枫古槎之下，因名其地曰下枫槎。'},
      {id:7,name:'云先公',gender:'男',generation:'之',generation_num:21,branch:'西大房二份',birth_date:'清乾隆间',is_alive:'否',biography:'名大性，西大房二份之祖。乾隆二十七年（1762年）首倡并主持修建下枫槎谢氏宗祠，敦睦堂由此而立。'},
      {id:8,name:'文对',gender:'男',generation:'—',generation_num:1,branch:'枫槎分支',father_id:2,is_alive:'否',highlight:true,biography:'文杲公之子，枫槎谢氏分支祖。'}
    ];
  }
  // 古世系数据（炎帝→秀驹）
  function getAncientGenealogyData() {
    var raw = [[1,'炎帝神农氏','中华民族人文始祖',null],[2,'临魁','炎帝之子','炎帝神农氏'],[10,'榆罔','临魁之后','临魁'],[11,'帝柱','榆罔之后','榆罔'],[15,'祝融','帝柱之后','帝柱'],[54,'吕尚','姜太公，周朝开国功臣','祝融'],[55,'佐','吕尚之子，申伯之父','吕尚'],[65,'申伯','谢氏鼻祖','佐'],[65,'申甫','申伯之弟，仍姓姜氏','佐'],[66,'弘','申伯之子','申伯'],[66,'猛','申伯之子','申伯'],[67,'广','弘之子','弘'],[67,'协','弘之子','弘'],[68,'列宗','广之子','广'],[68,'穆宗','广之子','广'],[69,'骘','列宗之子','列宗'],[70,'预','骘之子','骘'],[71,'昌后','预之子','预'],[72,'达','昌后之子','昌后'],[72,'守礼','昌后之子','昌后'],[73,'子民','达之子','达'],[74,'秩','子民之子','子民'],[75,'雍','秩之子','秩'],[76,'林','雍之子','雍'],[77,'涣','林之子','林'],[78,'旺','涣之子','涣'],[79,'珽','旺之子','旺'],[80,'国辉','珽之子','珽'],[81,'宁','国辉之子','国辉'],[82,'福','宁之子','宁'],[83,'杨贞','福之子','福'],[84,'平利','杨贞之子','杨贞'],[84,'平和','杨贞之子','杨贞'],[84,'平祖','杨贞之子','杨贞'],[85,'翠','平和之子','平和'],[85,'利','平和之子','平和'],[85,'文','平和之子','平和'],[86,'武','文之子','文'],[87,'秉槐','武之子','武'],[88,'堂','秉槐之子','秉槐'],[89,'瑛','堂之子','堂'],[90,'文轩','瑛之子','瑛'],[90,'文昂','瑛之子','瑛'],[91,'福郎','文轩之子','文轩'],[91,'丙郎','文轩之子','文轩'],[91,'应郎','文轩之子','文轩'],[92,'宜礼','福郎之子','福郎'],[92,'宜乐','福郎之子','福郎'],[93,'逵','宜礼之子','宜礼'],[94,'简','逵之子','逵'],[95,'瑰','简之子','简'],[96,'懿','瑰之子','瑰'],[97,'鳅','懿之子','懿'],[98,'当','鳅之后','鳅'],[98,'景秀','鳅之后','鳅'],[99,'缵','景秀之后/东山第一世','景秀'],[99,'显','景秀之后','景秀'],[99,'顼','景秀之后','景秀'],[100,'衡','会稽东山始祖','缵'],[101,'鲲','衡之子','衡'],[101,'裒','衡之子，谢安之父','衡'],[101,'广','衡之子','衡'],[102,'奕','裒之子','裒'],[102,'据','裒之子','裒'],[102,'安','字安石，东晋名相','裒'],[102,'万','裒之子','裒'],[102,'淮','裒之子','裒'],[102,'石','裒之子','裒'],[102,'铁','裒之子','裒'],[103,'瑶','安之子','安'],[103,'琰·东山','安之子','安'],[104,'肇','琰之子','琰·东山'],[104,'峻','琰之子','琰·东山'],[104,'混','琰之子','琰·东山'],[105,'密','混之子','混'],[106,'庄','密之子','密'],[107,'飏','庄之子','庄'],[107,'胜','庄之子','庄'],[107,'灏','庄之子','庄'],[107,'丛','庄之子','庄'],[107,'沦','庄之子','庄'],[108,'览','飏之子','飏'],[109,'琢','览之子','览'],[109,'侨','览之子','览'],[110,'琂','琢之子','琢'],[110,'琬','琢之子','琢'],[110,'琉','琢之子','琢'],[111,'峤','琂之子','琂'],[111,'植','琂之子','琂'],[112,'钝','植之子','植'],[112,'缪','植之子','植'],[113,'修','钝之子','钝'],[113,'豹','钝之子','钝'],[114,'恺','修之子','修'],[115,'骢','恺之子','恺'],[115,'驼','恺之子','恺'],[115,'绰','恺之子','恺'],[116,'式','绰之子','绰'],[117,'革','式之子','式'],[117,'造','式之子','式'],[118,'直','造之子','造'],[119,'是温','直之子','直'],[120,'翳','是温之子','是温'],[121,'静','翳之子','翳'],[121,'观','翳之子','翳'],[122,'闓','观之子/临海下渡第一世','观'],[123,'俨','闓之子','闓'],[124,'诜','俨之子','俨'],[125,'景之','诜之子','诜'],[125,'考之','诜之子','诜'],[126,'润甫','景之之后','景之'],[126,'深甫','景之之后','景之'],[127,'采伯','深甫之后','深甫'],[127,'渠伯','深甫之后','深甫'],[127,'棐伯','深甫之后','深甫'],[127,'彚伯','深甫之后','深甫'],[128,'奕修','采伯之后','采伯'],[128,'奕懋','采伯之后','采伯'],[128,'奕恭','采伯之后','采伯'],[128,'奕容','采伯之后','采伯'],[128,'奕信','采伯之后','采伯'],[129,'在鉴','奕信之后','奕信'],[129,'在勋','奕信之后','奕信'],[129,'在纲','奕信之后','奕信'],[129,'在机','奕信之后','奕信'],[130,'大四','在纲之后','在纲'],[130,'小四','在纲之后','在纲'],[131,'丹一','小四之子','小四'],[131,'丹二','小四之子','小四'],[131,'丹三','小四之子','小四'],[132,'文杲','丹一之后，枫槎谢氏始迁祖','丹一'],[132,'文榘','丹一之后，东门桃源陈氏之祖','丹一'],[132,'丹九','丹三之后','丹三'],[133,'廿一','丹九之后','丹九'],[133,'廿二','丹九之后','丹九'],[133,'廿四','丹九之后','丹九'],[133,'十三','文榘之后','文榘'],[133,'十七','文榘之后','文榘'],[133,'二一','文榘之后','文榘'],[134,'廿七','十三之后','十三'],[134,'廿九','十三之后','十三'],[134,'三十一','十三之后','十三'],[134,'四十','廿二之后','廿二'],[135,'百十','廿七之后','廿七'],[135,'庆三','廿七之后','廿七'],[135,'千九','四十之后','四十'],[135,'千十','四十之后','四十'],[135,'千十一','四十之后','四十'],[135,'千十三','四十之后','四十'],[136,'敬乙','庆三之后','庆三'],[136,'一廷','千十一之后','千十一'],[136,'隆','千十一之后','千十一'],[137,'琰','隆之后','隆'],[137,'琇','隆之后','隆'],[138,'位','琰之后','琰'],[138,'倍','琰之后','琰'],[138,'侍','琰之后','琰'],[138,'体','琰之后','琰'],[138,'旦','琰之后','琰'],[138,'俱生','琇之后','琇'],[139,'礼','位之后','位'],[139,'管','位之后','位'],[139,'罗','位之后','位'],[140,'泰鹏','管之后','管'],[140,'泰颚','管之后','管'],[141,'秀廉','泰颚之后','泰颚'],[141,'秀洁','泰颚之后','泰颚'],[141,'秀驹','泰颚之后','泰颚']];
    var nameIds = {}, result = [];
    for (var i = 0; i < raw.length; i++) {
      var nm = raw[i][1];
      if (!nameIds[nm]) nameIds[nm] = [];
      nameIds[nm].push(50000 + i);
    }
    for (var i = 0; i < raw.length; i++) {
      var r = raw[i], pid = 50000 + i;
      var gen = r[0], br = '古世系';
      if (gen <= 65) br = '远古世系';
      else if (gen <= 99) br = '申伯世系';
      else if (gen <= 121) br = '始宁东山世系';
      else if (gen <= 130 && gen >= 122) br = '临海下渡世系';
      else br = '石马下谢分房';
      // 父名解析：同名多记录时取世代严格小于自己且最接近的一位（父辈世代 < 子辈世代）。
      // 古世系里「广」出现两次（67世弘之子、101世衡之子），旧代码 nameToId 后者覆盖前者，
      // 致 列宗68世 的父被错误连到 衡之子广101世，东山/临海/石马/后枫槎 整条线与炎帝断开。
      var fatherId = null;
      if (r[3]) {
        var cands = nameIds[r[3]] || [];
        if (cands.length === 1) { fatherId = cands[0]; }
        else if (cands.length > 1) {
          var best = null, bestGen = -1;
          for (var ci = 0; ci < cands.length; ci++) {
            var cg = raw[cands[ci] - 50000][0];
            if (cg < gen && cg > bestGen) { bestGen = cg; best = cands[ci]; }
          }
          fatherId = best;
        }
      }
      result.push({ id: pid, name: r[1], gender: '男', generation: gen.toString(), generation_num: gen, branch: br, father_id: fatherId, birth_date: '', is_alive: '否', highlight: i === 0, biography: r[2] });
    }
    return result;
  }

  // ★现代人父链重连：data 文件里的远古名记录在渲染前被过滤（换成 168 权威古世系 50000+ id），
  // 其现代子孙的 father_id 仍指向被删的数据 id → 按「同名 + 同世次」重映射到古世系 id；
  // 同名不同世次（如 广 67世/101世）精确命中正确那位。名字+世次都对不上时取同名且世次最近的上代。
  function reconnectModernToAncient(d, ancient) {
    var ancByNameGen = {}, ancientNames = {};
    for (var ii = 0; ii < ancient.length; ii++) {
      var an = ancient[ii];
      ancientNames[an.name] = true;
      if (!ancByNameGen[an.name]) ancByNameGen[an.name] = {};
      ancByNameGen[an.name][an.generation_num] = an.id;
    }
    var removedById = {};
    for (var ii = 0; ii < d.length; ii++) {
      if (ancientNames[d[ii].name]) removedById[d[ii].id] = d[ii];
    }
    var remapped = 0;
    for (var ii = 0; ii < d.length; ii++) {
      var pr = d[ii];
      if (ancientNames[pr.name] || !pr.father_id) continue;
      var oldF = removedById[pr.father_id];
      if (!oldF) continue;
      var g = parseInt(oldF.generation_num, 10) || 0;
      var ancId = (ancByNameGen[oldF.name] || {})[g];
      if (ancId === undefined) {
        // 回退：同名且世次严格小于该父、最接近的一位
        var best = null, bestG = -1;
        var gl = ancByNameGen[oldF.name] || {};
        for (var kg in gl) {
          var kgn = parseInt(kg, 10);
          if (kgn < g && kgn > bestG) { bestG = kgn; best = gl[kg]; }
        }
        ancId = best;
      }
      if (ancId !== undefined && ancId !== null && ancId !== pr.father_id) {
        pr.father_id = ancId;
        remapped++;
      }
    }
    return remapped;
  }

  // 运行时唯一结构化族谱来源：族谱管理后台的 canonical API。
  // 旧 JSON、静态 seed、localStorage 与 Supabase 仅作历史备份，不得进入前台渲染。
  var _genealogyData = null;
  var _canonicalGenealogyData = null;

  function getGenealogyData() {
    return Array.isArray(_canonicalGenealogyData) ? _canonicalGenealogyData : [];
  }

  // 连续完整世系：古世系168 + 后枫槎精选树80，去重头部重叠，从炎帝(1世)一路贯通到彬公/乾公。
  // 两个数据源均为现有权威数据（getAncientGenealogyData / getHoufengchaTreeData），不编造世系。
  // 古世系本身就是一条完整父链：炎帝1→…→申伯65→…→缵99→…→闓122→…→小四130→丹一131→文杲132→…→秀驹141
  // 后枫槎精选树头部（小四/丹一/文杲/文榘）与古世系完全重复→跳过，攒/撰改接到古世系文杲名下；
  // 其世代 +129 统一为炎帝全局世次（攒=133、伯能=134、叔仅=146、彬乾=147、云先=153，已逐人对验主数据）。
  var _continuousData = null;
  function getContinuousLineageData() {
    // 连续世系也必须使用同一份后台数据，不能重新拼接旧 hard-coded seed。
    return getGenealogyData();
  }

  // 旧世系页面也只能读取族谱管理后台的 canonical 接口。
  // genealogy_full.json 是历史快照，保留在磁盘备查，但不能再进入前台渲染或统计。
  fetch('../api/data/genealogy?ts=' + Date.now(), { cache: 'no-store' }).then(function(r){
    if (!r.ok) throw new Error('canonical genealogy request failed');
    return r.json();
  }).then(function(d){
    if (d && d.length > 100) {
      _canonicalGenealogyData = d;
      _genealogyData = d;
      // Re-render everything
      if (typeof renderGenealogyPageSVG === 'function') {
        renderGenealogyPageSVG();
        // Also force re-render tree SVG
        setTimeout(function() {
          if (typeof renderTreeSVG === 'function') {
            var treeData = getGenealogyData();
            if (treeData && treeData.length > 100) renderTreeSVG(treeData);
          }
          if (window.renderTimeline) { renderTimeline(); }
        }, 300);
      }
    }
  }).catch(function(e){ console.log('genealogy JSON load failed:', e); });

function getPersonNameById(id, data) {
    if (!id && id !== 0) return null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) return data[i].name;
    }
    return null;
  }
  function calcAge(birth, death) {
    if (!birth || !death) return '';
    var by = parseInt(birth); if (isNaN(by)) { var m = birth.match(/(\d{3,4})年/); if (m) by = parseInt(m[1]); }
    var dy = parseInt(death); if (isNaN(dy)) { var m = death.match(/(\d{3,4})年/); if (m) dy = parseInt(m[1]); }
    if (isNaN(by) || isNaN(dy)) return '';
    var age = dy - by;
    if (age > 0 && age < 150) return '，享年' + age + '岁';
    return '';
  }

  function getChildren(personId, data) {
    return data.filter(function(p) {
      return parseInt(p.father_id) === personId || parseInt(p.mother_id) === personId;
    });
  }

  function getSpouses(personId, data) {
    var p = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === personId) { p = data[i]; break; }
    }
    if (!p || !p.spouse_ids) return [];
    // spouse_ids stores names as plain text (e.g. "王氏,李氏")
    var names = p.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
    return names.map(function(name) {
      for (var j = 0; j < data.length; j++) {
        if (data[j].name === name) return data[j];
      }
      return null;
    }).filter(function(s) { return s; });
  }

  // ===== SVG Tree rendering =====
var CARD_W = 150, CARD_H = 85, H_GAP = 50, V_GAP = 110;
var treeScale = 1, treePanX = 0, treePanY = 0;
var treeLayout = {}; // { personId: {x, y} }
var allNodes = [];
var allConnectors = [];

function getFilteredChildren(person, data) {
  var children = getChildren(person.id, data);
  var result = [];
  children.forEach(function(child) {
    var fatherId = parseInt(child.father_id);
    var motherId = parseInt(child.mother_id);
    if (fatherId === person.id || motherId === person.id) result.push(child);
  });
  return result;
}

function getDescendantCount(personId, data) {
  var count = 0;
  var direct = getChildren(personId, data);
  for (var i = 0; i < direct.length; i++) {
    count += 1 + getDescendantCount(direct[i].id, data);
  }
  return count;
}

function calcSubtreeWidth(personId, data, collapsed) {
  var person = null;
  for (var i = 0; i < data.length; i++) { if (data[i].id === personId) { person = data[i]; break; } }
  if (!person) return CARD_W;
  if (collapsed) return CARD_W;
  var children = getFilteredChildren(person, data);
  if (children.length === 0) return CARD_W;
  var total = 0;
  for (var i = 0; i < children.length; i++) {
    total += calcSubtreeWidth(children[i].id, data, collapsed) + (i < children.length - 1 ? H_GAP : 0);
  }
  return Math.max(CARD_W, total);
}

function layoutTree(personId, x, y, data, collapsed, visited) {
  if (!visited) visited = {};
  if (visited[personId]) return;
  visited[personId] = true;
  treeLayout[personId] = {x: x, y: y};
  var person = null;
  for (var i = 0; i < data.length; i++) { if (data[i].id === personId) { person = data[i]; break; } }
  if (!person || collapsed) return;
  var children = getFilteredChildren(person, data);
  if (children.length === 0) return;
  var childWidths = [];
  for (var i = 0; i < children.length; i++) {
    childWidths.push(calcSubtreeWidth(children[i].id, data, collapsed));
  }
  var totalW = 0;
  for (var i = 0; i < childWidths.length; i++) totalW += childWidths[i] + (i < childWidths.length - 1 ? H_GAP : 0);
  var cx = x - totalW / 2 + childWidths[0] / 2;
  for (var i = 0; i < children.length; i++) {
    layoutTree(children[i].id, cx, y + V_GAP, data, collapsed, visited);
    cx += childWidths[i] / 2 + H_GAP + (i < childWidths.length - 1 ? (childWidths[i+1] || 0) / 2 : 0);
  }
}

function buildCardSvg(person, data, hasChildren, descendantCount, childCount) {
  var id = person.id;
  var isHighlight = person.highlight === true ||
    /^(小四|文杲|攒|撰|彬|乾|文对)(（|【|$)/.test(person.name) ||
    /^小四（石马/.test(person.name) ||
    /^文杲（司检/.test(person.name) ||
    /^攒（后枫槎|^攒【后枫槎】/.test(person.name) ||
    /^撰（前枫槎|^撰【前枫槎】/.test(person.name) ||
    /^彬（东房/.test(person.name) ||
    /^乾（西房/.test(person.name) ||
    person.name === '文对';
  var card = '<g class="tree-svg-card' + (isHighlight ? ' tree-svg-highlight' : '') + '" data-id="' + id + '" onclick="onCardClick(' + id + ', event)">';
  card += '<rect class="card-bg ' + (person.gender === '男' ? 'male' : 'female') + '" x="-' + (CARD_W/2) + '" y="-' + (CARD_H/2) + '" width="' + CARD_W + '" height="' + CARD_H + '"/>';
  if (isHighlight) {
    card += '<text x="' + (CARD_W/2 - 8) + '" y="-' + (CARD_H/2 + 6) + '" fill="#ff6b00" font-size="14">⭐</text>';
  }
  var nameText = escapeHtml(person.name || '未知');
  if (person.adopted && person.adopted !== '否') {
    var label = person.adopted === '出继' ? '出' : '嗣';
    card += '<text class="card-adopted-badge" x="-' + (CARD_W/2-12) + '" y="-' + (CARD_H/2+4) + '" text-anchor="middle">' + label + '</text>';
  }
  card += '<text class="card-name" x="0" y="0">' + nameText + '</text>';
  var metaParts = [];
  if (person.generation && person.generation !== '—') metaParts.push(person.generation + '字辈');
  if (person.generation_num) metaParts.push('第' + person.generation_num + '世');
  if (metaParts.length) card += '<text class="card-meta" x="0" y="0">' + metaParts.join(' · ') + '</text>';
  if (person.branch && person.branch !== '—') card += '<text class="card-branch" x="0" y="0">' + escapeHtml(person.branch) + '</text>';
  var spouses = getSpouses(person.id, data);
  if (spouses.length > 0) {
    card += '<text class="card-spouse" x="0" y="0">配: ' + spouses.map(function(s){return s.name||'';}).join('、') + '</text>';
  }
  if (person.mother_id) {
    var mn = getPersonNameById(parseInt(person.mother_id), data) || '';
    if (mn) card += '<text class="card-mother" x="0" y="0">母: ' + escapeHtml(mn) + '</text>';
  }
  if (hasChildren) {
    card += '<text class="card-expand card-expand-text" x="0" y="0" onclick="event.stopPropagation();toggleTreeSVG(' + id + ');">▶</text>';
    card += '<text class="card-expand card-collapse-text" x="0" y="0" onclick="event.stopPropagation();toggleTreeSVG(' + id + ');">▼</text>';
    card += '<text class="card-count" x="0" y="0">' + childCount + '子女, ' + descendantCount + '后代</text>';
  }
  card += '</g>';
  return card;
}

function buildConnectorPath(parentId, childIds, layout, br) {
  if (!layout[parentId] || childIds.length === 0) return '';
  var px = layout[parentId].x, py = layout[parentId].y;
  var paths = '';
  // br：父节点分房 key（全屏精准隐藏远古单链竖线用）。桌面/无 tag 调用不附加属性，完全不变。
  var attr = br ? ' data-branch="' + br + '"' : '';
  // Vertical from parent bottom to mid-point
  var midY = py + CARD_H/2 + V_GAP/2;
  if (childIds.length === 1) {
    var cx = layout[childIds[0]].x, cy = layout[childIds[0]].y;
    // tree-connector-single：独子直连（父底→子顶整段竖线）。远古世系连续单传段就靠它形成「竖向线」，
    // 全屏按 branch tag 精准隐藏（见 CSS）；多子分叉的竖线是短段（半距）不属于单链。桌面类名无副作用。
    paths += '<line class="tree-connector tree-connector-single"' + attr + ' x1="' + px + '" y1="' + (py + CARD_H/2) + '" x2="' + cx + '" y2="' + (cy - CARD_H/2) + '"/>';
  } else {
    // Vertical from parent
    paths += '<line class="tree-connector"' + attr + ' x1="' + px + '" y1="' + (py + CARD_H/2) + '" x2="' + px + '" y2="' + midY + '"/>';
    // Horizontal bar
    var firstX = layout[childIds[0]].x;
    var lastX = layout[childIds[childIds.length-1]].x;
    paths += '<line class="tree-connector-h"' + attr + ' x1="' + firstX + '" y1="' + midY + '" x2="' + lastX + '" y2="' + midY + '"/>';
    // Vertical to each child
    for (var i = 0; i < childIds.length; i++) {
      var cx = layout[childIds[i]].x;
      paths += '<line class="tree-connector"' + attr + ' x1="' + cx + '" y1="' + midY + '" x2="' + cx + '" y2="' + (layout[childIds[i]].y - CARD_H/2) + '"/>';
    }
  }
  return paths;
}

// Branch filter: return only matching people (plus transition person from previous branch)
function getBranchData(data, rootNamePattern) {
  var isBranchFilter = ['远古世系','申伯世系','始宁东山世系','临海下渡世系','石马下谢分房','前枫槎'].indexOf(rootNamePattern) >= 0;
  if (isBranchFilter) {
    var result = data.filter(function(p) { return p.branch === rootNamePattern; });
    // Include the starting person of this branch (from previous branch)
    var transitionNames = {'申伯世系':'申伯','始宁东山世系':'缵','临海下渡世系':'闓','石马下谢分房':'小四'};
    // Also include the ending person from next branch (for current branch)
    var endTransitionNames = {'始宁东山世系':'闓'};

    var tName = transitionNames[rootNamePattern];
    if (tName) {
      for (var ti = 0; ti < data.length; ti++) {
        if (data[ti].name === tName && result.indexOf(data[ti]) < 0) {
          result.push(data[ti]);
          break;
        }
      }
    }
    var etName = endTransitionNames[rootNamePattern];
    if (etName) {
      for (var ti = 0; ti < data.length; ti++) {
        if (data[ti].name === etName && result.indexOf(data[ti]) < 0) {
          result.push(data[ti]);
          break;
        }
      }
    }
    return result;
  }
  // For name-based filters (后枫槎, 前枫槎), use original descendant collection
  var candidates = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].name.indexOf(rootNamePattern) >= 0) {
      var cIds = [data[i].id];
      function cCollect(pid) {
        for (var j = 0; j < data.length; j++) {
          if ((parseInt(data[j].father_id) === pid || parseInt(data[j].mother_id) === pid) && cIds.indexOf(data[j].id) === -1) {
            cIds.push(data[j].id);
            cCollect(data[j].id);
          }
        }
      }
      cCollect(data[i].id);
      candidates.push({ person: data[i], descendantCount: cIds.length - 1 });
    }
  }
  if (candidates.length === 0) return data;
  candidates.sort(function(a, b) {
    if (b.descendantCount !== a.descendantCount) return b.descendantCount - a.descendantCount;
    return (parseInt(b.person.generation_num)||0) - (parseInt(a.person.generation_num)||0);
  });
  var root = candidates[0].person;
  var ids = [root.id];
  function collect(pid) {
    for (var i = 0; i < data.length; i++) {
      if ((parseInt(data[i].father_id) === pid || parseInt(data[i].mother_id) === pid) && ids.indexOf(data[i].id) === -1) {
        ids.push(data[i].id);
        collect(data[i].id);
      }
    }
  }
  collect(root.id);
  // If the root has no descendants in the data, just return the root itself
  // (the tree will show the root with a note that branch data is incomplete)
  return data.filter(function(p) { return ids.indexOf(p.id) >= 0; });
}

// 本宗世系图现在直接按后台 canonical 数据筛选，不再拼接旧精选树或静态 ID。
function getHoufengchaEnhancedData() {
  return getGenealogyData();
}

var _currentBranch = 'all';

function filterBranch(branch) {
  _currentBranch = branch;
  var btnMap = {'all':'filter-all','全世系总览':'filter-allsystem','连续完整世系':'filter-continuous','远古世系':'filter-yuangud','申伯世系':'filter-shenbo','始宁东山世系':'filter-dongshan','临海下渡世系':'filter-linhai','石马下谢分房':'filter-shima'};
  var btnId = btnMap[branch] || 'filter-all';
  if (branch.indexOf('后枫槎') >= 0) btnId = 'filter-houfengcha';
  else if (branch.indexOf('前枫槎') >= 0) btnId = 'filter-qianfengcha';
  document.querySelectorAll('[id^="filter-"]').forEach(function(b) { b.style.background = ''; b.style.color = ''; b.style.border = '1px solid var(--glass-border)'; });
  var btn = document.getElementById(btnId);
  if (btn) { btn.style.background = 'var(--accent-orange)'; btn.style.color = '#fff'; btn.style.border = 'none'; }
  // Get and filter data
  // 连续世系、本宗世系图和总览均由后台 canonical 数据筛选。
  var data;
  if (branch === '连续完整世系') { data = getContinuousLineageData(); }
  else if (branch === '本宗世系图（后枫槎）') { data = getGenealogyData(); }
  // 全世系总览：真实 1249 人，数据修正后天然是从炎帝→现在的贯通树（与「全部世系」同源，入口语义更清晰）
  else if (branch === '全世系总览') { data = getGenealogyData(); }
  else { data = getGenealogyData(); }
  var branchLabel = '全部';
  if (branch !== 'all' && branch !== '连续完整世系' && branch !== '全世系总览') {
    data = getBranchData(data, branch);
    // Get a human-readable label for this branch
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.indexOf(branch) >= 0) { branchLabel = data[i].name; break; }
    }
  }
  // Render tree with filter — defer layout so UI stays responsive
  localStorage.setItem('xie_tree_collapsed', '[]');
  var el1 = document.getElementById('tree-scroll-container');
  if (el1) el1.style.display = 'block';
  // Show loading state immediately
  var tc = document.getElementById('tree-container');
  if (tc) tc.innerHTML = '<div class="tree-loading"><span class="tree-loading-spinner"></span> 加载世系图中…</div>';
  setTimeout(function() { renderTreeSVG(data); }, 30);
  // If viewing a specific branch, auto-locate to the root person
  if (branch !== 'all') {
    setTimeout(function() {
      var rootId = null;
      if (branch === '连续完整世系' || branch === '全世系总览') {
        rootId = 50000; // 炎帝神农氏：整条连续世系的起点
      } else if (branch === '本宗世系图（后枫槎）') {
        for (var hi = 0; hi < data.length; hi++) {
          if (String(data[hi].name || '').replace(/\(.*\)$/, '') === '文杲') { rootId = data[hi].id; break; }
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          if (data[i].name.indexOf(branch) >= 0) { rootId = data[i].id; break; }
        }
      }
      if (rootId) { treeAutoLocate(rootId); return; }
      // 手机端「筛选+定位」：分支按钮的 branch 名（如「远古世系」）不出现在任何 name 里，
      // 上面 name 查找必然落空；按分支锚点姓名解析该分支根节点，fit 全貌后飞入定位。
      // 桌面端保持原样（isMobileTree() 守卫，桌面不触发任何定位）。
      if (isMobileTree()) {
        var bRoot = {'远古世系':'炎帝神农氏','申伯世系':'申伯','始宁东山世系':'缵','临海下渡世系':'闓','石马下谢分房':'小四','前枫槎':'撰'}[branch];
        if (bRoot) {
          for (var ri = 0; ri < data.length; ri++) {
            var rn = data[ri].name;
            if (rn === bRoot || String(rn).replace(/\(.*\)$/, '') === bRoot) { rootId = data[ri].id; break; }
          }
          if (rootId) treeAutoLocate(rootId);
        }
      }
    }, 200);
  }
  // Auto-scroll to tree section
  setTimeout(function() {
    var treeSection = document.getElementById('genealogy-tree-section');
    if (treeSection) treeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function renderSimpleTree(data) {
  var c = document.getElementById("tree-container");
  if (!c || !data) return;
  function esc(t) { if(!t)return""; var d=document.createElement("div"); d.textContent=t; return d.innerHTML; }
  var gens = {};
  data.forEach(function(p) {
    var g = p.generation_num || 0;
    if (!gens[g]) gens[g] = [];
    gens[g].push(p);
  });
  var nums = Object.keys(gens).sort(function(a,b){return a-b});
  var h = "<div style=\"padding:8px;\">";
  nums.forEach(function(g) {
    h += "<div style=\"margin-bottom:12px;\"><div style=\"font-size:12px;color:var(--accent-orange);font-weight:600;margin-bottom:6px;padding:4px 8px;background:rgba(251,146,60,0.08);border-radius:4px;\">第" + g + "世 (" + gens[g].length + "人)</div><div style=\"display:flex;flex-wrap:wrap;gap:4px;\">";
    gens[g].forEach(function(p) {
      var hl = p.highlight === true || /^(炎帝|小四|文杲|攒|撰|彬|乾|文对|申伯|临魁)/.test(p.name);
      h += "<span onclick=\"showPersonDetail(" + p.id + ", getGenealogyData())\" style=\"cursor:pointer;padding:4px 10px;border-radius:4px;font-size:12px;background:" + (hl ? "rgba(251,146,60,0.12)" : "var(--glass-bg)") + ";border:1px solid var(--glass-border);\">" + (hl ? "⭐" : "") + esc(p.name) + "</span>";
    });
    h += "</div></div>";
  });
  h += "</div>";
  c.innerHTML = h;
}

/* ===== 手机端（≤900px）：地图式全景世系图 =====
   Step1 基线 = 原生滚动·可读树（卡片紧凑、双轴原生滚动、兴旺徽章、☗全貌⇄可读）。
   后续 Step3 加 Canvas 全貌层、Step4 加虚拟化卡片池，本区逐步增强。 */
var _MBL_DEFAULT_SCALE = 0.75; // 默认可读缩放：卡片 104px→78px 渲染，清晰可读
var _mblPC = null;             // 手机端环安全预计算 {childOf, descCount}

function isMobileTree() {
  if (window.matchMedia ? window.matchMedia('(max-width:900px)').matches : (window.innerWidth <= 900)) return true;
  // 真全屏横屏下仍按手机端地图处理：手机转横屏宽度可能>900px（如 iPhone Pro Max 932px），
  // 若不判会掉回桌面 gz 布局、fullscreenchange 兜底失效。用短边高度区分手机横屏（~390-450px）
  // 与桌面/平板全屏（高度≥650px，维持 900px 断点原样）。
  var fs = document.fullscreenElement || document.webkitFullscreenElement;
  if (fs && window.innerHeight < 650) return true;
  return false;
}

function mblPrecompute(data) {
  var byId = {}, childOf = {};
  data.forEach(function(p){ byId[p.id] = p; });
  data.forEach(function(p){
    var fid = parseInt(p.father_id);
    // 跳过自环引用（如古世系占位符 father_id 指向自己）——否则会形成自身子环
    if (fid && byId[fid] && fid !== parseInt(p.id)) { (childOf[fid] = childOf[fid] || []).push(p); }
  });
  for (var k in childOf) childOf[k].sort(function(a,b){
    return (parseInt(a.generation_num)||0) - (parseInt(b.generation_num)||0) ||
      String(a.name||'').localeCompare(String(b.name||''),'zh');
  });
  var descCount = {}, gray = {};
  function dc(id) {
    if (descCount[id] !== undefined) return descCount[id];
    if (gray[id]) return 0; // 环兜底：当前路径已含此节点 → 该枝后代按 0 计
    gray[id] = true;
    var c = childOf[id] || [], n = 0;
    c.forEach(function(x){ n += 1 + dc(x.id); });
    delete gray[id];
    descCount[id] = n; return n;
  }
  data.forEach(function(p){ dc(p.id); });
  return { byId: byId, childOf: childOf, descCount: descCount };
}

function mblIsKey(p) {
  return !!(p && (p.highlight === true ||
    /^(小四|文杲|攒|撰|彬|乾|文对|炎帝|临魁|申伯|缵|衡|闓|文榘)/.test(p.name || '')));
}

function mblHxTier(desc) {
  // 兴旺分档：0=灰(无后) 1-3=蓝(初兴) 4-9=绿(发展) 10-24=橙(兴旺) 25+=红(鼎盛)
  desc = desc || 0;
  if (desc === 0) return 0;
  if (desc <= 3) return 1;
  if (desc <= 9) return 2;
  if (desc <= 24) return 3;
  return 4;
}

/* 分房配色（「整个后台世系」可视化）：远古/申伯/东山/临海/石马/前枫槎/后枫槎 7 房 + other 灰。
   白底 #ffffff 上分离（2026-08-14 用户要求底色改纯白）。branch 字段 1026/1249 人为空不可靠，
   故沿父链上溯到「世代区间 + 名字锚点」派生。 */
var _MBL_BRANCH_COLORS = {
  '远古': '#0f766e', '申伯': '#4f46e5', '东山': '#7c3aed',
  '临海': '#0ea5e9', '石马': '#d97706', '前枫槎': '#e11d48',
  '后枫槎': '#15803d', 'other': '#8a8272'
};

// 名字锚点：131 世以上本地房派无法用世代区间区分，用核心先祖名判定
// （数据已核实：攒/伯能/叔仅/彬/乾 = 后枫槎，撰 = 前枫槎，小四(石马)/丹一 = 石马）
function mblAnchorBranch(name) {
  if (!name) return null;
  if (/攒|伯能|叔仅|彬|乾|后枫槎/.test(name)) return '后枫槎';
  if (/撰|前枫槎/.test(name)) return '前枫槎';
  if (/小四|丹一/.test(name)) return '石马';
  if (/炎帝|临魁|榆罔|帝柱|祝融/.test(name)) return '远古';
  if (/申伯|吕尚/.test(name)) return '申伯';
  if (/缵|衡|裒|安石/.test(name)) return '东山';
  if (/闓|临海/.test(name)) return '临海';
  return null;
}

// 后台 branch 字段显式映射：管理后台录入的房派标签最权威
// （已核实：石马(下谢)42人、申伯世系47、始宁东山48、前枫槎23、临海下渡21、
//   后枫槎系15+西房5+东房5+枫槎分支10+枫槎始祖1+分称后西/东房+后东房+大房等）
function mblFieldBranch(b) {
  if (!b) return null;
  var s = String(b).trim();
  if (/炎帝世系|仍姓姜/.test(s)) return '远古';
  if (/谢氏得姓|申伯世系/.test(s)) return '申伯';
  if (/始宁东山|东山第一世/.test(s)) return '东山';
  if (/临海下渡/.test(s)) return '临海';
  if (/石马/.test(s)) return '石马';
  if (/前枫槎/.test(s)) return '前枫槎';
  if (/后枫槎|枫槎分支|枫槎始祖|分称后|后东房|大房/.test(s)) return '后枫槎';
  return null;
}

// 沿父链上溯到分支：branch 字段 > 世代区间 > 名字锚点；
// 兜底后枫槎——下枫槎村本地 131+ 且父链断裂者归本宗（后枫槎宗族），不归石马
function mblDeriveBranchKey(p) {
  if (!p) return 'other';
  var byId = _mblPC ? _mblPC.byId : null;
  var cur = p, guard = 0;
  while (cur && guard++ < 100) {
    var fb = mblFieldBranch(cur.branch);
    if (fb) return fb;
    var g = parseInt(cur.generation_num, 10) || 0;
    if (g > 0 && g <= 130) {
      if (g <= 65) return '远古';
      if (g <= 99) return '申伯';
      if (g <= 121) return '东山';
      return '临海';
    }
    var k = mblAnchorBranch(cur.name);
    if (k) return k;
    var fid = parseInt(cur.father_id);
    if (!fid || !byId) break;
    cur = byId[fid];
  }
  return '后枫槎';
}

function renderMobileMap(data) {
  var container = document.getElementById('tree-container');
  if (!container) return;
  // 手机紧凑卡片：更小卡片与间距，更多代一屏可见（桌面端常量保持原值）
  CARD_W = 104; CARD_H = 60; H_GAP = 34; V_GAP = 64;
  // Apply branch filter FIRST
  var oldMsg = document.getElementById('branch-empty-msg');
  if (oldMsg) oldMsg.remove();
  var oldStats = document.getElementById('branch-stats-overlay');
  if (oldStats) oldStats.remove();
  if (_currentBranch && _currentBranch !== 'all' && _currentBranch !== '连续完整世系') {
    var filteredData = getBranchData(data, _currentBranch);
    if (filteredData && filteredData.length > 0) data = filteredData;
  }
  // ★存当前渲染数据源：本宗世系图 getHoufengchaTreeData(id60000+)、连续完整世系(id50000/80001+) 都不在
  // getGenealogyData() 里，卡片点击 onCardClick 必须用这份数据才能查中弹详情（用户：本宗世系图点人弹不出详情）
  window._mblTreeData = data;
  if (!data || data.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-tertiary);font-size:14px;">暂无族谱数据，请在管理后台添加</div>';
    return;
  }
  // Find root nodes
  var existingIds = {};
  data.forEach(function(p) { existingIds[p.id] = true; });
  var roots = data.filter(function(p) { return !p.father_id || !existingIds[parseInt(p.father_id)]; });
  var spouseIds = {};
  data.forEach(function(p) {
    if (p.spouse_ids) {
      var names = p.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
      data.forEach(function(other) {
        if (other.id !== p.id && names.indexOf(other.name) !== -1) spouseIds[other.id] = p.id;
      });
    }
  });
  roots = roots.filter(function(p) { return !spouseIds[p.id] || spouseIds[p.id] > p.id; });
  if (roots.length === 0 && data.length > 0) roots = [data[0]];
  // 根按世代排序（古→今从左到右）：炎帝1 → 申伯65 → 东山 → 临海 → 本地131+（未知世代排最后）
  roots.sort(function(a, b) {
    return (parseInt(a.generation_num, 10) || 99999) - (parseInt(b.generation_num, 10) || 99999);
  });

  // Layout all roots side by side（手机端始终整树显示，无折叠）
  treeLayout = {};
  var rootOffsets = [], totalRW = 0;
  for (var i = 0; i < roots.length; i++) {
    var rw = calcSubtreeWidth(roots[i].id, data, false);
    rootOffsets.push({ id: roots[i].id, w: rw });
    totalRW += rw + (i < roots.length - 1 ? H_GAP * 2 : 0);
  }
  var offsetX = 100;
  for (var i = 0; i < roots.length; i++) {
    layoutTree(rootOffsets[i].id, offsetX + rootOffsets[i].w / 2, 100, data, false, null);
    offsetX += rootOffsets[i].w + H_GAP * 2;
  }

  // Bounds
  var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  var cardIds = Object.keys(treeLayout);
  if (cardIds.length === 0) { container.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-tertiary);">暂无显示数据</div>'; return; }
  cardIds.forEach(function(id) {
    var p = treeLayout[parseInt(id)];
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
  });
  var svgW = Math.max(400, maxX - minX + CARD_W + 80);
  var svgH = Math.max(400, maxY - minY + CARD_H + 80);
  // 内容宽高必须保证包含最右/最下卡片（svgW 公式在 minX 较大时右缘会少算，被 overflow:hidden 裁掉）
  window._mblContent = { w: Math.max(svgW, maxX + CARD_W / 2 + 10), h: Math.max(svgH, maxY + CARD_H / 2 + 10) };

  // === Fast rendering: connectors (SVG) + all cards (HTML, single batch) ===
  // 手机端预计算（放连线构建前）：环安全 子女数/后代总数 + id→分房 key（连线按父节点 tag，供全屏精准隐藏远古单链竖线）
  _mblPC = mblPrecompute(data);
  var _mblBranch = {};
  for (var bi = 0; bi < data.length; bi++) _mblBranch[data[bi].id] = mblDeriveBranchKey(data[bi]);
  window._mblBranch = _mblBranch;
  var cardIdsNum = cardIds.map(function(id) { return parseInt(id); });
  var html = '<div class="tree-viewport" style="transform-origin:0 0;transform:scale(' + treeScale + ');">';
  // SVG layer for connectors only
  html += '<svg class="tree-connector-layer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + svgW + ' ' + svgH + '" width="' + svgW + '" height="' + svgH + '" style="display:block;position:absolute;top:0;left:0;pointer-events:none;">';
  for (var i = 0; i < cardIdsNum.length; i++) {
    var pid = cardIdsNum[i];
    var person = null;
    for (var j = 0; j < data.length; j++) { if (data[j].id === pid) { person = data[j]; break; } }
    if (!person) continue;
    var children = getFilteredChildren(person, data);
    if (children.length > 0) {
      var childIds = [];
      for (var k = 0; k < children.length; k++) { if (treeLayout[children[k].id]) childIds.push(children[k].id); }
      if (childIds.length > 0) html += buildConnectorPath(pid, childIds, treeLayout, _mblBranch[pid]);
    }
  }
  html += '</svg>';
  // HTML cards（positioned absolutely）——虚拟化：只建空卡片层，可见区卡片由卡片池动态增删（不重建）
  html += '<div class="tree-cards-layer" style="position:relative;width:' + svgW + 'px;height:' + svgH + 'px;"></div></div>';
  // Single innerHTML（只建 svg 连线层 + 空卡片层，卡片按可见区虚拟化）
  container.innerHTML = html;
  // 重置卡片池（重渲染/分支切换/live 更新后旧卡失效）→ 立即按当前可见区填充
  _mblPool = null;
  mblVirtualize();

  // 显示分支无详情提示
  showBranchEmptyMsg(container);

  // Store node refs (for search)
  allNodes = [];
  var cards2 = container.querySelectorAll('.tree-html-card');
  for (var i = 0; i < cards2.length; i++) {
    allNodes.push({ id: parseInt(cards2[i].getAttribute('data-id')), el: cards2[i] });
  }
  // 手机端：渲染后进全貌地图（canvas）+ 绑定双指捏合缩放 + 鼠标滚轮缩放/拖拽平移
  afterMobileTreeRender();
  mblInitPinch();
  mblInitMouse();
  if (!window.__mblResizeBound) {
    window.__mblResizeBound = true;
    window.addEventListener('resize', function() {
      if (!isMobileTree()) return;
      if (_mblMode === 'overview') mblMapDraw();
      else mblVizThrottled();
    });
  }
}

/* ===== 手机端交互辅助（仅 ≤900px 生效） ===== */
function afterMobileTreeRender() {
  // 初始进入 = Canvas 全貌地图：整树入屏、分房配色、点选放大进入可读（原生滚动卡片）
  var sc = document.getElementById('tree-scroll-container');
  if (!sc) return;
  mblMapPrep();
  enterMblOverview();
}

function _mblTreeBounds() {
  var keys = Object.keys(treeLayout);
  if (!keys.length) return null;
  var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  keys.forEach(function(id) {
    var p = treeLayout[id];
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
  });
  return { left: minX - CARD_W/2, top: minY - CARD_H/2, width: (maxX - minX) + CARD_W, height: (maxY - minY) + CARD_H };
}

function _mblContentPoint() {
  // 当前视口中心对应的内容坐标（未缩放 CSS px）
  var sc = document.getElementById('tree-scroll-container');
  if (!sc) return { x: 0, y: 0 };
  return { x: (sc.scrollLeft + sc.clientWidth / 2) / treeScale, y: (sc.scrollTop + sc.clientHeight / 2) / treeScale };
}

function _mblScrollToContentPoint(pt) {
  var sc = document.getElementById('tree-scroll-container');
  if (!sc) return;
  var maxL = sc.scrollWidth - sc.clientWidth, maxT = sc.scrollHeight - sc.clientHeight;
  var l = Math.max(0, Math.min(maxL, pt.x * treeScale - sc.clientWidth / 2));
  var t = Math.max(0, Math.min(maxT, pt.y * treeScale - sc.clientHeight / 2));
  try { sc.scrollTo({left: l, top: t, behavior: 'smooth'}); } catch(e) { sc.scrollLeft = l; sc.scrollTop = t; }
}

function focusMobileNode(id) {
  // 点卡聚焦：可读尺度（若在全貌态先回退）+ 原生平滑滚动到该卡。零自绘手势=零卡顿
  var sc = document.getElementById('tree-scroll-container');
  if (!sc || !treeLayout[id]) return;
  if (treeScale !== _MBL_DEFAULT_SCALE) { treeScale = _MBL_DEFAULT_SCALE; applyTreeTransformSVG(); }
  mblVizThrottled(); // 缩放变化后可见区立即改变 → 虚拟化刷新
  var x = treeLayout[id].x * treeScale;
  var y = treeLayout[id].y * treeScale;
  var maxL = sc.scrollWidth - sc.clientWidth, maxT = sc.scrollHeight - sc.clientHeight;
  var l = Math.max(0, Math.min(maxL, x - sc.clientWidth / 2));
  var t = Math.max(0, Math.min(maxT, y - sc.clientHeight * 0.2)); // 底部详情卡遮下半屏 → 卡放偏上
  try { sc.scrollTo({left: l, top: t, behavior: 'smooth'}); } catch(e) { sc.scrollLeft = l; sc.scrollTop = t; }
}

function fitMobileTree() {
  // 一键全貌（☗）：进入 Canvas 全貌地图
  enterMblOverview();
}

function toggleMobileGlobal() {
  // ☗ 全局 按钮：全貌（canvas 整树地图）⇄ 可读（原生滚动卡片），返回可读时恢复原滚动位置
  if (!isMobileTree()) return;
  if (mblInFs()) return; // 全屏横屏强制可读：禁用切全貌，避免出现蓝色圆点连线（用户明确不要）
  if (_mblMode === 'overview') {
    cancelMblFly();
    // 先取全貌视口中心的世界坐标（treeScale 仍为全貌尺度），用作可读回落的兜底锚点
    var ovCenter = _mblContentPoint();
    treeScale = _MBL_DEFAULT_SCALE;
    applyTreeTransformSVG();
    setMblMode('readable');
    var sc = document.getElementById('tree-scroll-container');
    if (sc) {
      var maxL = sc.scrollWidth - sc.clientWidth, maxT = sc.scrollHeight - sc.clientHeight;
      if (_mblReadableScroll) {
        sc.scrollLeft = Math.max(0, Math.min(maxL, _mblReadableScroll.l));
        sc.scrollTop = Math.max(0, Math.min(maxT, _mblReadableScroll.t));
      }
      mblEnsureCardsNear(ovCenter); // 兜底：恢复位在稀疏区（可见 0 卡）时贴到离全貌视口中心最近的节点
      mblVirtualize(); // 直接按最终滚动位渲染（不依赖节流 rAF，与飞入收尾同因）
    }
  } else {
    enterMblOverview();
  }
}

function updateGlobalBtnLabel() {
  var btn = document.getElementById('mbl-global-btn');
  if (!btn) return;
  btn.textContent = (_mblMode === 'overview') ? '✕ 可读' : '☗ 全貌';
}

/* ===== 手机 Canvas 全貌层（地图式全景）=====
   全貌模式：整树按分房配色画到「视口尺寸」的 canvas（sticky 钉住视口），点选最近节点→飞入可读；
   可读模式：原生滚动卡片树（.tree-viewport），canvas 隐藏。treeScale≥0.5=可读，<0.5=全貌。 */
var _mblMode = 'readable';
var _mblMapEdges = null;
var _mblMapFit = null;          // 最近一次全貌绘制的 content→canvas 屏幕px 变换 {s,ox,oy,sl,st}
var _mblDragMoved = false;      // 鼠标拖拽后拦截 click（避免误触卡片/地图点选）
var _mblPinch = null;
var _mblReadableScroll = null;  // 进入全貌前的可读滚动位置，用于返回
var _mblFlyId = 0;
var _mblFsAnchorPending = false; // 全屏进入可读：布局落定后先锚到卡片密集区（空角白屏兜底）
var _mblFsAnchor = null;         // 兜底锚点世界坐标（全貌视口中心）

function mblMapEnsureCanvas() {
  var sc = document.getElementById('tree-scroll-container');
  if (!sc) return null;
  var cv = document.getElementById('gz-map-canvas');
  if (!cv) {
    cv = document.createElement('canvas');
    cv.id = 'gz-map-canvas';
    sc.insertBefore(cv, sc.firstChild);
    cv.addEventListener('click', function(ev) { mblMapOnTap(ev); });
  }
  var dpr = window.devicePixelRatio || 1;
  var w = sc.clientWidth, h = sc.clientHeight;
  var bw = Math.round(w * dpr), bh = Math.round(h * dpr);
  if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; cv.style.width = w + 'px'; cv.style.height = h + 'px'; }
  return cv;
}

function mblMapPrep() {
  _mblMapEdges = [];
  if (!window._mblContent || !_mblPC) return;
  var childOf = _mblPC.childOf || {};
  var bm = window._mblBranch || {};
  for (var id in treeLayout) {
    var p = treeLayout[id]; if (!p) continue;
    var kids = childOf[id] || [];
    // 远古单链：独子直连 + 非现代两房 → 全貌 canvas 也跳过这条边（与可读模式 .tree-connector-single
    // CSS 隐藏同规则；否则「全部世系」overview 位图仍把远古单传链画成竖向贯穿线，用户反馈仍在）
    if (kids.length === 1) {
      var bkey = bm[id];
      if (bkey && bkey !== '后枫槎' && bkey !== '前枫槎') continue;
    }
    for (var i = 0; i < kids.length; i++) {
      var kp = treeLayout[kids[i].id]; if (!kp) continue;
      _mblMapEdges.push([p.x, p.y, kp.x, kp.y]);
    }
  }
}

function mblMapDraw() {
  var cv = mblMapEnsureCanvas();
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var W = cv.width, H = cv.height, cw = W / dpr, ch = H / dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cw, ch);
  var content = window._mblContent;
  if (!content) return;
  // 最小缩放 = 整树入屏（fit）；放大后跟随 treeScale（滚轮/双指缩放，地图变大）。
  // 位图恒=视口×dpr，不随放大爆炸。canvas 元素已 translate(scrollLeft,scrollTop) 钉住视口，
  // 这里在世界坐标×s 基础上减滚动位 → 原生滚动/拖拽即平移地图（与可读卡片同坐标系）。
  var sc = document.getElementById('tree-scroll-container');
  var pad = 10;
  var fit = Math.min((cw - pad * 2) / content.w, (ch - pad * 2) / content.h);
  fit = Math.max(0.02, Math.min(1, fit));
  var s = (treeScale && treeScale > fit) ? treeScale : fit;
  // 居中偏移：整树小于视口时居中（fit 时同原效果）；放大后钳 0，保证原点(x=0,y=0)可滚动到、不丢左上
  var ox = Math.max(0, (cw - content.w * s) / 2);
  var oy = Math.max(0, (ch - content.h * s) / 2);
  var sl = sc ? sc.scrollLeft : 0, st = sc ? sc.scrollTop : 0;
  _mblMapFit = { s: s, ox: ox, oy: oy, sl: sl, st: st };
  function X(x) { return ox + x * s - sl; }
  function Y(y) { return oy + y * s - st; }
  // 边：浅棕细线（先画，垫底）
  if (_mblMapEdges && _mblMapEdges.length) {
    ctx.strokeStyle = 'rgba(120,110,88,0.42)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < _mblMapEdges.length; i++) {
      var e = _mblMapEdges[i];
      ctx.moveTo(X(e[0]), Y(e[1])); ctx.lineTo(X(e[2]), Y(e[3]));
    }
    ctx.stroke();
  }
  // 节点圆点：分房配色（全貌画全部 1250，单帧 <2ms）
  var colors = _MBL_BRANCH_COLORS, bm = window._mblBranch || {};
  var r = Math.max(1, Math.min(2.6, s * 44));
  for (var id in treeLayout) {
    var p = treeLayout[id]; if (!p) continue;
    ctx.fillStyle = colors[bm[id]] || colors['other'];
    ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), r, 0, Math.PI * 2); ctx.fill();
  }
  // 锚点人物标签：按内容 x 排序、≥30px 才画（白晕底防重叠成糊）
  var byId = _mblPC.byId || {};
  var ks = [];
  for (var kk in byId) {
    var p0 = byId[kk];
    if (mblIsKey(p0) && treeLayout[p0.id]) ks.push(p0);
  }
  ks.sort(function(a, b) { return treeLayout[a.id].x - treeLayout[b.id].x; });
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  var lastSX = -40;
  for (var i2 = 0; i2 < ks.length; i2++) {
    var tp = treeLayout[ks[i2].id];
    var sx = X(tp.x), sy = Y(tp.y);
    if (sx - lastSX < 30) continue;
    lastSX = sx;
    var tw = ctx.measureText(ks[i2].name || '').width;
    ctx.fillStyle = 'rgba(255,252,245,0.85)';
    ctx.fillRect(sx - tw / 2 - 3, sy - 8, tw + 6, 15);
    ctx.fillStyle = '#3a3226';
    ctx.fillText(ks[i2].name || '', sx, sy + 1);
  }
}

function mblMapOnTap(ev) {
  if (_mblMode !== 'overview') return;
  var cv = document.getElementById('gz-map-canvas');
  if (!cv || !_mblMapFit) return;
  var rect = cv.getBoundingClientRect();
  var f = _mblMapFit;
  // 反向换算：screen = world*s + ox - scroll → world = (screen + scroll - ox)/s
  var cx = (ev.clientX - rect.left + (f.sl || 0) - f.ox) / f.s;
  var cy = (ev.clientY - rect.top + (f.st || 0) - f.oy) / f.s;
  var best = null, bestD = Infinity;
  for (var id in treeLayout) {
    var p = treeLayout[id];
    var dx = p.x - cx, dy = p.y - cy, d = dx * dx + dy * dy;
    if (d < bestD) { bestD = d; best = parseInt(id, 10); }
  }
  if (best === null) return;
  var thr = 22 / f.s; // 屏幕 22px 容差（全貌下内容距离）
  if (Math.sqrt(bestD) > thr) return; // 点到空白区
  mblMapFlyTo(best);
}

function cancelMblFly() {
  if (_mblFlyId) { cancelAnimationFrame(_mblFlyId); _mblFlyId = 0; }
}

function mblMapFlyTo(id) {
  var t = treeLayout[id], sc = document.getElementById('tree-scroll-container');
  if (!t || !sc) return;
  cancelMblFly();
  setMblMode('readable'); // 显示卡片，canvas 隐藏
  var s0 = treeScale, s1 = _MBL_DEFAULT_SCALE;
  var vw = sc.clientWidth, vh = sc.clientHeight, x = t.x, y = t.y;
  var t0 = performance.now(), DUR = 340;
  function step(now) {
    var p = Math.min(1, (now - t0) / DUR);
    var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    treeScale = s0 + (s1 - s0) * e;
    applyTreeTransformSVG();
    var maxL = sc.scrollWidth - sc.clientWidth, maxT = sc.scrollHeight - sc.clientHeight;
    sc.scrollLeft = Math.max(0, Math.min(maxL, x * treeScale - vw / 2));
    sc.scrollTop = Math.max(0, Math.min(maxT, y * treeScale - vh * 0.2));
    if (p < 1) { _mblFlyId = requestAnimationFrame(step); }
    else {
      _mblFlyId = 0;
      updateGlobalBtnLabel();
      _mblReadableScroll = { l: sc.scrollLeft, t: sc.scrollTop };
      // 动画收尾必须直接按最终滚动位渲染卡片：若只走 mblVizThrottled 的节流 rAF，
      // 掉帧/后台节流下该 rAF 可能不再触发 → 可读态空白屏（实测 intermittent）。
      mblVirtualize();
      return;
    }
    mblVizThrottled(); // 动画中可见区持续变化 → 虚拟化跟手
  }
  _mblFlyId = requestAnimationFrame(step);
}

function mblEnsureLegend() {
  var sc = document.getElementById('tree-scroll-container');
  var lg = document.getElementById('mbl-map-legend');
  if (lg || !sc) return;
  lg = document.createElement('div');
  lg.id = 'mbl-map-legend';
  var order = ['远古', '申伯', '东山', '临海', '石马', '前枫槎', '后枫槎'];
  var html = '';
  for (var i = 0; i < order.length; i++) {
    var b = order[i];
    html += '<span class="mbl-lg" data-br="' + b + '" title="查看' + b + '世系"><i style="background:' + _MBL_BRANCH_COLORS[b] + '"></i>' + b + '</span>';
  }
  lg.innerHTML = html;
  // 图例点击：筛选该分房并定位到根节点（事件委托，避免逐项绑定）
  lg.onclick = function(e) {
    var t = e.target;
    while (t && t !== lg && !(t.classList && t.classList.contains('mbl-lg'))) t = t.parentNode;
    if (!t || t === lg) return;
    var k = t.getAttribute('data-br');
    if (k) mblLegendFilter(k);
  };
  lg.style.display = 'none';
  sc.appendChild(lg);
}

function mblLegendFilter(key) {
  // 图例项点击：按分房色筛选（与分支按钮同一数据源），fit 全貌后飞入该分支根节点
  if (!isMobileTree()) return;
  var map = {'远古':'远古世系','申伯':'申伯世系','东山':'始宁东山世系','临海':'临海下渡世系','石马':'石马下谢分房','前枫槎':'前枫槎','后枫槎':'本宗世系图（后枫槎）'};
  var arg = map[key];
  if (!arg) return;
  cancelMblFly();
  filterBranch(arg);
}

function setMblMode(mode) {
  _mblMode = mode;
  var cv = document.getElementById('gz-map-canvas');
  var vp = document.querySelector('#tree-container .tree-viewport');
  var lg = document.getElementById('mbl-map-legend');
  if (cv) cv.style.visibility = (mode === 'overview') ? 'visible' : 'hidden';
  if (vp) vp.style.visibility = (mode === 'overview') ? 'hidden' : 'visible';
  if (lg) lg.style.display = (mode === 'overview') ? 'flex' : 'none';
  if (mode === 'overview') mblMapDraw();
  else mblVirtualize();
  updateGlobalBtnLabel();
}

function mblInFs() {
  // 手机端「全屏态」判断：真全屏（浏览器 Top Layer）或假全屏 class（iOS/微信无 API 时仅假全屏）
  var sec = document.getElementById('genealogy-tree-section');
  return !!(document.fullscreenElement || (sec && sec.classList.contains('genealogy-tree-section-fullscreen')));
}

function mblAutoMode() {
  // 手势缩放过程中按 treeScale 阈值自动切换模式（≥0.5 可读卡片 / <0.5 全貌地图）。
  // 全屏态强制保持可读卡片（用户：全屏横屏不要 canvas 蓝点+线条的全貌图，要可缩放平移的卡片树）
  var overview = !mblInFs() && treeScale < 0.5;
  _mblMode = overview ? 'overview' : 'readable';
  var cv = document.getElementById('gz-map-canvas');
  var vp = document.querySelector('#tree-container .tree-viewport');
  var lg = document.getElementById('mbl-map-legend');
  if (cv) cv.style.visibility = overview ? 'visible' : 'hidden';
  if (vp) vp.style.visibility = overview ? 'hidden' : 'visible';
  if (lg) lg.style.display = overview ? 'flex' : 'none';
  if (overview) mblMapDraw();
  else mblVirtualize();
  updateGlobalBtnLabel();
}

function enterMblOverview(savedScroll) {
  if (!isMobileTree()) return;
  var sc = document.getElementById('tree-scroll-container');
  var content = window._mblContent;
  if (!sc || !content) return;
  cancelMblFly();
  // savedScroll 可选：捏合收拢进全貌时，捏合起点滚动位才是有意义的「返回位」
  //（捏合 move 已把 scroll 置 0，此刻再取只会存到空角）；其他路径传 undefined → 取当前位
  _mblReadableScroll = savedScroll || { l: sc.scrollLeft, t: sc.scrollTop };
  // 整树适配入屏（滚动范围≈0），canvas 钉住视口画全貌
  treeScale = Math.max(0.02, Math.min(2.5, Math.min((sc.clientWidth - 20) / content.w, (sc.clientHeight - 20) / content.h)));
  applyTreeTransformSVG();
  sc.scrollLeft = 0; sc.scrollTop = 0;
  mblEnsureLegend();
  setMblMode('overview');
}

function mblFsLayoutOffset(sc, vx, vy) {
  // 旋转态「绝对位置」换算：视觉坐标 (vx,vy)（相对 scroll 容器视觉 rect 的偏移）→ 布局轴坐标（滚动位单位）。
  // CSS 强制横屏 rotate(90°) 下视觉↔布局轴：视觉水平 = 布局垂直（世界 y 堆叠）、视觉垂直 = 布局水平（世界 x 世代）。
  // 实测映射（变换矩阵 + 居中推导，非按比例缩放）：布局x = 视觉垂直 vy、布局y = 视觉宽 − 视觉水平 vx。
  // 非旋转态恒等（vx→布局x、vy→布局y）。仅用于绝对位置（捏合中点、滚轮光标）；增量平移用 mblFsLayoutDelta。
  if (sc.classList.contains('mbl-fs-landscape')) {
    var r = sc.getBoundingClientRect();
    if (!r.width || !r.height) return { ox: vx, oy: vy };
    return { ox: vy, oy: r.width - vx };
  }
  return { ox: vx, oy: vy };
}

function mblFsLayoutDelta(sc, dx, dy) {
  // 旋转态「增量」换算：视觉拖动/横滑增量 (dx,dy) → 布局轴滚动增量（内容跟随光标）。
  // rotate90° 后：视觉水平 dx → 布局垂直 scrollTop(+dx)、视觉垂直 dy → 布局水平 scrollLeft(−dy)。
  // 非旋转态恒等（scrollLeft+=dx、scrollTop+=dy）。与 mblFsLayoutOffset 的绝对位置公式不同，不可混用。
  if (sc.classList.contains('mbl-fs-landscape')) {
    return { ox: -dy, oy: -dx };
  }
  return { ox: dx, oy: dy };
}

function mblScrollToWorld(x, y) {
  // 把世界点 (x,y) 居中到视口中心（带钳制）。旋转态（CSS rotate90 假横屏）视觉↔布局轴映射
  // 实测 cvx=VW-(wy*s-st)、cvy=(wx*s-sl) → 居中公式取屏幕中心（VW/VH 视觉尺寸，layout 轴 1:1）；
  // 非旋转态用容器布局尺寸。内容小于视口的轴钳到 0（自然贴齐），另一轴精确居中。
  var sc = document.getElementById('tree-scroll-container');
  if (!sc || !treeScale) return;
  var maxL = sc.scrollWidth - sc.clientWidth, maxT = sc.scrollHeight - sc.clientHeight;
  if (sc.classList.contains('mbl-fs-landscape')) {
    var VW = window.innerWidth, VH = window.innerHeight;
    sc.scrollLeft = Math.max(0, Math.min(maxL, x * treeScale - VH / 2));
    sc.scrollTop = Math.max(0, Math.min(maxT, y * treeScale - VW / 2));
  } else {
    sc.scrollLeft = Math.max(0, Math.min(maxL, x * treeScale - sc.clientWidth / 2));
    sc.scrollTop = Math.max(0, Math.min(maxT, y * treeScale - sc.clientHeight / 2));
  }
}

function mblLayoutCenter() {
  // 当前筛选内容几何中心（treeLayout 已按分支筛过，远古等小分支=分支自身 bbox 中心）
  var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, any = false;
  for (var id in treeLayout) {
    var p = treeLayout[id]; if (!p) continue;
    any = true;
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
  }
  if (!any) return null;
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

function mblEnsureCardsNear(anchor, force) {
  // 可读态当前可见区若无卡片（布局空角/稀疏区）→ 滚动位贴到离 anchor 最近的节点，避免白屏。
  // anchor 通常传全貌视口中心（内容中心）；缺省用当前视口中心。可见区有卡则不动，不打断平移。
  // force=true（全屏进入强制居中）：直接以 anchor（筛选内容中心）居中，不要求可见区无卡。
  var sc = document.getElementById('tree-scroll-container');
  if (!sc || !treeLayout || !treeScale) return;
  if (force && anchor) {
    mblScrollToWorld(anchor.x, anchor.y);
    // 全屏强制居中后兜底：锚点若落在跨分支空带（布局 bbox 中心恰好无卡，如自动进入全屏的 lineage-tree 页）
    // → 可见区 0 卡白屏。此处与下方非 force 空带判定同逻辑：居中后可见区有卡则不动（密集/稀疏锚点行为不变），
    // 0 卡则贴到离 anchor 最近节点。只改全屏进入的移动路径，不影响已有可读态平移。
    var rect = mblVisibleRect();
    var hasAny = false;
    if (rect) {
      for (var idf in treeLayout) {
        var pf = treeLayout[idf];
        if (pf && pf.x >= rect.x0 && pf.x <= rect.x1 && pf.y >= rect.y0 && pf.y <= rect.y1) { hasAny = true; break; }
      }
    }
    if (!hasAny) {
      var bestId = null, bestD = Infinity;
      for (var id2 in treeLayout) {
        var q = treeLayout[id2]; if (!q) continue;
        var d = (q.x - anchor.x) * (q.x - anchor.x) + (q.y - anchor.y) * (q.y - anchor.y);
        if (d < bestD) { bestD = d; bestId = id2; }
      }
      if (bestId) mblScrollToWorld(treeLayout[bestId].x, treeLayout[bestId].y);
    }
    return;
  }
  var rect = mblVisibleRect();
  if (!rect) return;
  var hasAny = false;
  for (var id in treeLayout) {
    var p = treeLayout[id];
    if (p && p.x >= rect.x0 && p.x <= rect.x1 && p.y >= rect.y0 && p.y <= rect.y1) { hasAny = true; break; }
  }
  if (hasAny) return;
  var ax = anchor ? anchor.x : (sc.scrollLeft + sc.clientWidth / 2) / treeScale;
  var ay = anchor ? anchor.y : (sc.scrollTop + sc.clientHeight / 2) / treeScale;
  var bestId = null, bestD = Infinity;
  for (var id2 in treeLayout) {
    var q = treeLayout[id2];
    if (!q) continue;
    var d = (q.x - ax) * (q.x - ax) + (q.y - ay) * (q.y - ay);
    if (d < bestD) { bestD = d; bestId = id2; }
  }
  if (!bestId) return;
  mblScrollToWorld(treeLayout[bestId].x, treeLayout[bestId].y);
}

function mblInitPinch() {
  var sc = document.getElementById('tree-scroll-container');
  if (!sc || sc.dataset.mblPinch) return;
  sc.dataset.mblPinch = '1';
  sc.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY;
      var rect = sc.getBoundingClientRect();
      var midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      var midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
      var lo = mblFsLayoutOffset(sc, midX, midY); // 旋转态：视觉坐标 → 布局轴偏移（布局坐标才是滚动位单位）
      _mblPinch = {
        d: Math.sqrt(dx * dx + dy * dy) || 1, s0: treeScale,
        sl: sc.scrollLeft, st: sc.scrollTop,
        midOx: lo.ox, midOy: lo.oy
      };
    }
  }, { passive: true });
  sc.addEventListener('touchmove', function(e) {
    if (!_mblPinch || e.touches.length !== 2) return;
    e.preventDefault();
    var dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY;
    var d = Math.sqrt(dx * dx + dy * dy); if (!d) return;
    // 全屏（强制可读）缩放下限 0.08：允许缩小看整体（用户：左右世系链跨度大，要能缩小看整体；卡片变小但仍是卡片不切 canvas 全貌）。
    // 实测：0.08 时可见世界宽 9888px≈世系链 27.5%、密集区可见卡 331 < 密度阈值 1000（mblVirtualize 全屏内放宽），不白屏。
    var nsMin = mblInFs() ? 0.08 : 0.02;
    var ns = Math.max(nsMin, Math.min(2.5, _mblPinch.s0 * (d / _mblPinch.d)));
    var vw = sc.clientWidth, vh = sc.clientHeight;
    treeScale = ns;
    applyTreeTransformSVG();
    var cAX = (_mblPinch.sl + _mblPinch.midOx) / _mblPinch.s0; // 捏合中点下的世界坐标（布局轴换算，旋转态已由 touchstart 处理）
    var cAY = (_mblPinch.st + _mblPinch.midOy) / _mblPinch.s0;
    var maxL = sc.scrollWidth - vw, maxT = sc.scrollHeight - vh;
    if (ns >= 0.5 || mblInFs()) {
      // 可读态 / 全屏态（强制可读卡片，不切 canvas 全貌）：保持捏合中点下的内容点不动
      sc.scrollLeft = Math.max(0, Math.min(maxL, cAX * ns - _mblPinch.midOx));
      sc.scrollTop = Math.max(0, Math.min(maxT, cAY * ns - _mblPinch.midOy));
    } else {
      sc.scrollLeft = 0; sc.scrollTop = 0; // 非全屏全貌态：canvas 整树入屏，无需锚点
    }
    mblAutoMode();
  }, { passive: false });
  sc.addEventListener('touchend', function(e) {
    if (!_mblPinch) return;
    if (e.touches.length < 2) {
      var pinchStart = { l: _mblPinch.sl, t: _mblPinch.st }; // 捏合起点滚动位（返回可读时恢复）
      _mblPinch = null;
      if (treeScale < 0.5 && !mblInFs()) enterMblOverview(pinchStart); // 非全屏：全貌吸附整树 + 画 canvas
      else if (treeScale < 0.5) {
        // 全屏允许缩小看整体（下限 0.08）：松手保持当前尺度不弹回，仅确保可见区有卡（防稀疏区白屏）
        setMblMode('readable');
        mblEnsureCardsNear();
      }
      else setMblMode('readable');
    }
  }, { passive: true });
  // 原生滚动 → 可见区变化 → 虚拟化卡片池（rAF 节流，滚动跟手不阻塞主线程）
  sc.addEventListener('scroll', mblVizThrottled, { passive: true });
}

function mblInitMouse() {
  // 鼠标平移 + 滚轮缩放（≤900px 窗口用鼠标/触控板操控地图）。触屏仍走 mblInitPinch，两套不冲突：
  // mouse 事件在触屏上不触发；touch 事件在有鼠标的窄窗口上不触发。
  var sc = document.getElementById('tree-scroll-container');
  if (!sc || sc.dataset.mblMouse) return;
  sc.dataset.mblMouse = '1';
  var dragging = false, mx0 = 0, my0 = 0, sl0 = 0, st0 = 0, moved = false;

  // 滚轮缩放：光标锚定；overview（canvas 地图）/ readable（卡片）统一。触控板捏合（ctrl+wheel）平滑。
  sc.addEventListener('wheel', function(e) {
    if (!isMobileTree()) return;
    e.preventDefault();
    var content = window._mblContent;
    if (!content || !treeScale) return;
    // 触控板横向滑动（|deltaX|>|deltaY|）→ 平移不缩放（旋转态：增量换算 mblFsLayoutDelta）
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      var dlo = mblFsLayoutDelta(sc, e.deltaX, e.deltaY);
      sc.scrollLeft += dlo.ox; sc.scrollTop += dlo.oy;
      return;
    }
    var f;
    if (e.ctrlKey) f = Math.exp(-e.deltaY * 0.01);          // trackpad 捏合手势
    else f = e.deltaY < 0 ? 1.2 : 1 / 1.2;
    var rect = sc.getBoundingClientRect();
    var lo = mblFsLayoutOffset(sc, e.clientX - rect.left, e.clientY - rect.top); // 旋转态：视觉坐标 → 布局轴偏移
    var s0 = treeScale;
    var fit = Math.max(0.02, Math.min(1, Math.min((sc.clientWidth - 20) / content.w, (sc.clientHeight - 20) / content.h)));
    var nsMin = mblInFs() ? 0.08 : fit; // 全屏强制可读但允许缩小看整体：下限 0.08（卡片 8px 色块可辨，密度守卫全屏内放宽到 1000）
    var ns = Math.max(nsMin, Math.min(2.5, s0 * f));
    if (Math.abs(ns - s0) < 1e-4) return;
    // 光标下的内容点（考虑居中偏移 ox/oy）：screen = world*s + ox - scroll
    var ox0 = Math.max(0, (sc.clientWidth - content.w * s0) / 2);
    var oy0 = Math.max(0, (sc.clientHeight - content.h * s0) / 2);
    var wx = (sc.scrollLeft + lo.ox - ox0) / s0;
    var wy = (sc.scrollTop + lo.oy - oy0) / s0;
    treeScale = ns;
    applyTreeTransformSVG();
    var ox1 = Math.max(0, (sc.clientWidth - content.w * ns) / 2);
    var oy1 = Math.max(0, (sc.clientHeight - content.h * ns) / 2);
    var maxL = sc.scrollWidth - sc.clientWidth, maxT = sc.scrollHeight - sc.clientHeight;
    sc.scrollLeft = Math.max(0, Math.min(maxL, wx * ns + ox1 - lo.ox));
    sc.scrollTop = Math.max(0, Math.min(maxT, wy * ns + oy1 - lo.oy));
    mblAutoMode();
  }, { passive: false });

  // 鼠标拖拽平移（原生滚动 = 平移）。拖拽结束后的 click 在 capture 阶段拦截，避免误触卡片/地图点选。
  sc.addEventListener('mousedown', function(e) {
    if (!isMobileTree() || e.button !== 0) return;
    if (e.target.closest('.tree-html-card,.apt-card,.mbl-lg,#mbl-map-legend,.apt-zoom-btn,button,a')) return;
    dragging = true; moved = false;
    mx0 = e.clientX; my0 = e.clientY; sl0 = sc.scrollLeft; st0 = sc.scrollTop;
    sc.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var dx = e.clientX - mx0, dy = e.clientY - my0;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    var lo = mblFsLayoutDelta(sc, dx, dy); // 旋转态：视觉拖动增量 → 布局轴增量（mblFsLayoutDelta，非绝对位置公式）
    var maxL = sc.scrollWidth - sc.clientWidth, maxT = sc.scrollHeight - sc.clientHeight;
    sc.scrollLeft = Math.max(0, Math.min(maxL, sl0 - lo.ox));
    sc.scrollTop = Math.max(0, Math.min(maxT, st0 - lo.oy));
  });
  window.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    sc.style.cursor = '';
    if (moved) { _mblDragMoved = true; setTimeout(function() { _mblDragMoved = false; }, 80); }
  });
  sc.addEventListener('click', function(e) {
    if (_mblDragMoved) { _mblDragMoved = false; e.preventDefault(); e.stopPropagation(); }
  }, true);
}

/* ===== 手机可读层虚拟化：卡片池 Map<id,el> 只增删不重建，按可见世界矩形筛选 ===== */
var _mblPool = null;           // Map<id,el> 当前已渲染卡片
var _mblVizRaf = 0;            // rAF 节流 id
var _mblVizBleed = 80;         // 可见区外出血边（内容 px），滚动方向预渲染避免白屏
var _mblDensityMax = 220;      // 密度守卫：可见卡超阈值 → 跳过卡片层（极端放缩兜底）

function mblVisibleRect() {
  // 当前视口对应的「内容世界」矩形（未缩放 CSS px），含出血边
  var sc = document.getElementById('tree-scroll-container');
  if (!sc || !treeScale) return null;
  var s = treeScale, bleed = _mblVizBleed / s;
  return {
    x0: sc.scrollLeft / s - bleed,
    y0: sc.scrollTop / s - bleed,
    x1: (sc.scrollLeft + sc.clientWidth) / s + bleed,
    y1: (sc.scrollTop + sc.clientHeight) / s + bleed
  };
}

function mblCreateCard(id) {
  var person = _mblPC && _mblPC.byId ? _mblPC.byId[id] : null;
  var p = treeLayout[id];
  var layer = document.querySelector('#tree-container .tree-cards-layer');
  if (!person || !p || !layer) return null;
  var isHighlight = mblIsKey(person);
  var el = document.createElement('div');
  el.className = 'tree-html-card' + (isHighlight ? ' highlight' : '');
  el.setAttribute('data-id', id);
  el.style.cssText = 'left:' + (p.x - CARD_W / 2) + 'px;top:' + (p.y - CARD_H / 2) + 'px;width:' + CARD_W + 'px;height:' + CARD_H + 'px;';
  if (isHighlight) {
    var star = document.createElement('span');
    star.className = 'star';
    star.textContent = '⭐';
    el.appendChild(star);
  }
  var nm = document.createElement('div');
  nm.className = 'card-name';
  nm.textContent = person.name || '未知';
  el.appendChild(nm);
  var meta = [];
  if (person.generation && person.generation !== '—') meta.push(person.generation + '字辈');
  if (person.branch && person.branch !== '—') meta.push(person.branch);
  if (meta.length) {
    var mm = document.createElement('div');
    mm.className = 'card-meta';
    mm.textContent = meta.join(' · ');
    el.appendChild(mm);
  }
  // 世代徽章：写「从炎帝属下的第几代」（用户要求：不写"N子·M后"兴旺计数，世次只在徽章出现一次）。
  // generation_num 已是炎帝全局世次（炎帝=1代、申伯=65代、小四=130代、文杲=132代…）。
  // 保留兴旺分档边框色（mb-t0..4），仅徽章文字改为世代。
  var mbDsc = _mblPC.descCount[id] || 0;
  el.classList.add('mb-t' + mblHxTier(mbDsc));
  var gen = parseInt(person.generation_num, 10);
  if (gen > 0) {
    var hx = document.createElement('div');
    hx.className = 'mb-hx';
    var badge = document.createElement('span');
    badge.className = 'mb-hx-badge';
    badge.textContent = '第' + gen + '代';
    hx.appendChild(badge);
    el.appendChild(hx);
  }
  el.onclick = function(ev) { onCardClick(id, ev); };
  layer.appendChild(el);
  return el;
}

function mblVirtualize() {
  if (!isMobileTree() || _mblMode !== 'readable') return;
  if (!treeLayout) return;
  if (!_mblPool) _mblPool = new Map();
  var rect = mblVisibleRect();
  if (!rect) return;
  var layer = document.querySelector('#tree-container .tree-cards-layer');
  if (!layer) return;
  // 单次遍历统计可见集（treeLayout ≈1250，全扫 <0.5ms）
  // 密度阈值：全屏内放宽到 1000（允许缩小看整体，用户选「缩小后卡片变小但仍是卡片」；
  // 实测 0.08 下限时密集区可见卡 ~331，留 3 倍余量绝不白屏）；非全屏保持 220（极端放缩兜底，保滚动流畅）。
  var dMax = mblInFs() ? 1000 : _mblDensityMax;
  var visible = {}, n = 0;
  for (var id in treeLayout) {
    var p = treeLayout[id]; if (!p) continue;
    if (p.x < rect.x0 || p.x > rect.x1 || p.y < rect.y0 || p.y > rect.y1) continue;
    visible[id] = true;
    if (++n > dMax) break;
  }
  // 密度守卫：可见卡超阈值 → 清空卡片层跳过（极端放缩兜底，保滚动流畅）
  if (n > dMax) {
    if (_mblPool.size) { _mblPool.forEach(function(e) { if (e.parentNode) e.parentNode.removeChild(e); }); _mblPool.clear(); }
    return;
  }
  // 增：可见但池中无 → 创建并入池（只创建新元素，旧元素不复用）
  for (var vid in visible) {
    var iv = parseInt(vid, 10);
    if (!_mblPool.has(iv)) {
      var el = mblCreateCard(iv);
      if (el) _mblPool.set(iv, el);
    }
  }
  // 删：池中有但不可见 → 移除
  var pool = _mblPool;
  pool.forEach(function(el, pid) {
    if (!visible[pid]) { el.parentNode && el.parentNode.removeChild(el); pool.delete(pid); }
  });
  // 维护 allNodes（搜索定位用，仅含当前 DOM 卡片）
  allNodes = [];
  pool.forEach(function(el, pid) { allNodes.push({ id: pid, el: el }); });
}

function mblVizThrottled() {
  if (_mblVizRaf) return;
  _mblVizRaf = requestAnimationFrame(function() {
    _mblVizRaf = 0;
    // 全貌态 canvas 钉住视口：absolute 顶置 + translate(scrollLeft,scrollTop)（滚动时跟随视口不脱离）
    var cv = document.getElementById('gz-map-canvas');
    if (cv) {
      if (_mblMode === 'overview') {
        var sc = document.getElementById('tree-scroll-container');
        cv.style.transform = 'translate(' + (sc ? sc.scrollLeft : 0) + 'px,' + (sc ? sc.scrollTop : 0) + 'px)';
        mblMapDraw(); // 滚动/拖拽平移：按新滚动位重画地图（rAF 节流）
      } else {
        cv.style.transform = '';
      }
    }
    mblVirtualize();
  });
}

function renderTreeSVG(data) {
  var container = document.getElementById('tree-container');
  if (!container) return;
  if (isMobileTree()) { renderMobileMap(data); return; }
  // Apply branch filter FIRST
  var oldMsg = document.getElementById('branch-empty-msg');
  if (oldMsg) oldMsg.remove();
  var oldStats = document.getElementById('branch-stats-overlay');
  if (oldStats) oldStats.remove();
  if (_currentBranch && _currentBranch !== 'all' && _currentBranch !== '连续完整世系') {
    var filteredData = getBranchData(data, _currentBranch);
    if (filteredData && filteredData.length > 0) data = filteredData;
  }
  // Use admin-style card tree if available
  if (typeof buildAdminTreeHtml === 'function' && data && data.length > 0) {
    container.innerHTML = '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
      '<span style="font-size:10px;color:var(--text-tertiary);">🖱️ 滚轮缩放 · 拖拽平移</span><span style="flex:1;"></span>' +
      '<button class="apt-zoom-btn" onclick="zoomGenealogyTree(1.3)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">+</button>' +
      '<button class="apt-zoom-btn" onclick="zoomGenealogyTree(0.77)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">−</button>' +
      '<button class="apt-zoom-btn" onclick="zoomGenealogyTree(1)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:12px;line-height:1;">⟳</button>' +
      '<span id="gz-zoom-level" style="font-size:10px;color:var(--text-tertiary);min-width:32px;text-align:center;">100%</span>' +
    '</div><div class="gz-tree-viewport" id="gz-tree-viewport" style="overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--gz-bg, #1a1a2e);min-height:350px;">' +
    buildAdminTreeHtml(data, {hideGen: false}) + '</div>';
    initGenealogyTreePanZoom();
    return;
  }
  // Check cache for current branch filter (instant re-render)
  var _treeCache = window._treeCache || {};
  window._treeCache = _treeCache;
  var cacheKey = _currentBranch || 'all';
  if (_treeCache[cacheKey]) {
    container.innerHTML = _treeCache[cacheKey];
    // Re-bind card events (innerHTML loses event listeners)
    var viewport = container.querySelector('.tree-viewport');
    if (viewport) {
      viewport.style.transform = 'translate(' + treePanX + 'px,' + treePanY + 'px) scale(' + treeScale + ')';
    }
    var oldMsg = document.getElementById('branch-empty-msg');
    if (oldMsg) oldMsg.remove();
    var oldStats = document.getElementById('branch-stats-overlay');
    if (oldStats) oldStats.remove();
    // Show empty message if needed
    if (_currentBranch && _currentBranch !== 'all') {
      var cardCount = container.querySelectorAll('.tree-html-card').length;
      if (cardCount <= 1) { showBranchEmptyMsg(container); }
    }
    return;
  }
  // Remove stale overlays from previous filter renders
  var oldMsg = document.getElementById('branch-empty-msg');
  if (oldMsg) oldMsg.remove();
  var oldStats = document.getElementById('branch-stats-overlay');
  if (oldStats) oldStats.remove();
  // Apply branch filter
  if (_currentBranch && _currentBranch !== 'all' && _currentBranch !== '连续完整世系') {
    var filteredData = getBranchData(data, _currentBranch);
    if (filteredData && filteredData.length > 0) data = filteredData;
  }
  if (!data || data.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-tertiary);font-size:14px;">暂无族谱数据，请在管理后台添加</div>';
    return;
  }
  // Find root nodes
  var existingIds = {};
  data.forEach(function(p) { existingIds[p.id] = true; });
  var roots = data.filter(function(p) { return !p.father_id || !existingIds[parseInt(p.father_id)]; });
  var spouseIds = {};
  data.forEach(function(p) {
    if (p.spouse_ids) {
      var names = p.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
      data.forEach(function(other) {
        if (other.id !== p.id && names.indexOf(other.name) !== -1) spouseIds[other.id] = p.id;
      });
    }
  });
  roots = roots.filter(function(p) { return !spouseIds[p.id] || spouseIds[p.id] > p.id; });
  if (roots.length === 0 && data.length > 0) roots = [data[0]];

  // Calculate layout for all roots
  treeLayout = {};
  var collapsedNodes = {};
  // Load saved collapse state
  try {
    var saved = JSON.parse(localStorage.getItem('xie_tree_collapsed') || '[]');
    saved.forEach(function(id) { collapsedNodes[id] = true; });
  } catch(e) {}

  for (var i = 0; i < roots.length; i++) {
    layoutTree(roots[i].id, 0, 100, data, collapsedNodes[roots[i].id], null);
  }
  // Reposition roots side by side
  var rootOffsets = [];
  var totalRW = 0;
  for (var i = 0; i < roots.length; i++) {
    var rw = calcSubtreeWidth(roots[i].id, data, collapsedNodes[roots[i].id]);
    rootOffsets.push({id: roots[i].id, w: rw});
    totalRW += rw + (i < roots.length - 1 ? H_GAP * 2 : 0);
  }
  treeLayout = {};
  var offsetX = 100;
  for (var i = 0; i < roots.length; i++) {
    layoutTree(rootOffsets[i].id, offsetX + rootOffsets[i].w/2, 100, data, collapsedNodes[rootOffsets[i].id], null);
    offsetX += rootOffsets[i].w + H_GAP * 2;
  }

  // Calculate SVG dimensions
  var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  var cardIds = Object.keys(treeLayout);
  if (cardIds.length === 0) { container.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-tertiary);">暂无显示数据</div>'; return; }
  cardIds.forEach(function(id) {
    var p = treeLayout[parseInt(id)];
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
  });
  var svgW = Math.max(400, maxX - minX + CARD_W + 80);
  var svgH = Math.max(400, maxY - minY + CARD_H + 80);

  // === Fast rendering: connectors (SVG) + all cards (HTML, single batch) ===
  var cardIdsNum = cardIds.map(function(id) { return parseInt(id); });
  var html = '<div class="tree-viewport" style="transform-origin:0 0;transform:translate(' + treePanX + 'px,' + treePanY + 'px) scale(' + treeScale + ');">';
  // SVG layer for connectors only
  html += '<svg class="tree-connector-layer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + svgW + ' ' + svgH + '" width="' + svgW + '" height="' + svgH + '" style="display:block;position:absolute;top:0;left:0;pointer-events:none;">';
  for (var i = 0; i < cardIdsNum.length; i++) {
    var pid = cardIdsNum[i];
    var person = null;
    for (var j = 0; j < data.length; j++) { if (data[j].id === pid) { person = data[j]; break; } }
    if (!person) continue;
    var children = getFilteredChildren(person, data);
    if (children.length > 0) {
      var childIds = [];
      for (var k = 0; k < children.length; k++) { if (treeLayout[children[k].id]) childIds.push(children[k].id); }
      if (childIds.length > 0) html += buildConnectorPath(pid, childIds, treeLayout);
    }
  }
  // Draw branch group boxes
  var groups = [['攒【后枫槎】','#22c55e',3,'rgba(34,197,94,0.06)'],['撰【前枫槎】','#6366f1',3,'rgba(99,102,241,0.06)'],['彬（东房祖）','#ef4444',3,'rgba(239,68,68,0.06)'],['乾（西房祖）','#f97316',3,'rgba(249,115,22,0.06)']];
  for (var g = 0; g < groups.length; g++) {
    var rootPerson = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.indexOf(groups[g][0].substring(0,1)) === 0 && data[i].name.indexOf(groups[g][0].substring(1)) > 0) { rootPerson = data[i]; break; }
    }
    if (!rootPerson) continue;
    var descendantIds = [rootPerson.id];
    (function cp(pid){for(var i=0;i<data.length;i++){if((parseInt(data[i].father_id)===pid||parseInt(data[i].mother_id)===pid)&&descendantIds.indexOf(data[i].id)===-1){descendantIds.push(data[i].id);cp(data[i].id);}}})(rootPerson.id);
    var mnX=Infinity,mxX=-Infinity,mnY=Infinity,mxY=-Infinity,ha=false;
    for(var i=0;i<descendantIds.length;i++){var pos=treeLayout[descendantIds[i]];if(pos){if(pos.x<mnX)mnX=pos.x;if(pos.x>mxX)mxX=pos.x;if(pos.y<mnY)mnY=pos.y;if(pos.y>mxY)mxY=pos.y;ha=true;}}
    if(!ha)continue;
    var pd=25,bx=mnX-CARD_W/2-pd,by=mnY-CARD_H/2-pd,bw=(mxX-mnX)+CARD_W+pd*2,bh=(mxY-mnY)+CARD_H+pd*2;
    html+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" fill="'+groups[g][3]+'" stroke="'+groups[g][1]+'" stroke-width="'+groups[g][2]+'" stroke-dasharray="10,5" rx="14" opacity="0.85"/>';
    html+='<text x="'+(bx+14)+'" y="'+(by+20)+'" fill="'+groups[g][1]+'" font-size="13" font-weight="700" opacity="0.85">'+groups[g][0]+'</text>';
  }
  html += '</svg>';
  // HTML cards (positioned absolutely) — fast single innerHTML
  html += '<div class="tree-cards-layer" style="position:relative;width:' + svgW + 'px;height:' + svgH + 'px;">';
  for (var i = 0; i < cardIdsNum.length; i++) {
    var pid = cardIdsNum[i];
    var p = treeLayout[pid];
    var person = null;
    for (var j = 0; j < data.length; j++) { if (data[j].id === pid) { person = data[j]; break; } }
    if (!person) continue;
    var isHighlight = person.highlight === true ||
      /^(小四|文杲|攒|撰|彬|乾|文对|炎帝|临魁|申伯)(（|【|$)/.test(person.name);
    var isHidden = collapsedNodes[pid] && getFilteredChildren(person, data).length > 0;
    var style = 'left:' + (p.x - CARD_W/2) + 'px;top:' + (p.y - CARD_H/2) + 'px;width:' + CARD_W + 'px;height:' + CARD_H + 'px;';
    if (isHidden) style += 'display:none;';
    html += '<div class="tree-html-card' + (isHighlight ? ' highlight' : '') + '" data-id="' + pid + '" onclick="onCardClick(' + pid + ', event)" style="' + style + '">';
    if (isHighlight) html += '<span class="star">⭐</span>';
    html += '<div class="card-name">' + escapeHtml(person.name || '未知') + '</div>';
    var meta = [];
    if (person.generation && person.generation !== '—') meta.push(person.generation + '字辈');
    if (person.generation_num) meta.push('第' + person.generation_num + '世');
    if (person.branch && person.branch !== '—') meta.push(escapeHtml(person.branch));
    if (meta.length) html += '<div class="card-meta">' + meta.join(' · ') + '</div>';
    if (getFilteredChildren(person, data).length > 0) {
      var dc = getDescendantCount(pid, data);
      html += '<div class="card-expand" onclick="event.stopPropagation();toggleTreeSVG(' + pid + ');">' + (isHidden ? '▶' : '▼') + ' ' + getFilteredChildren(person, data).length + '子女, ' + dc + '后代</div>';
    }
    html += '</div>';
  }
  html += '</div></div>';
  // Single innerHTML — HTML divs are orders of magnitude faster than SVG
  container.innerHTML = html;
  // Save to cache for instant re-render on filter switch
  _treeCache[cacheKey] = container.innerHTML;

  // Show message when branch filter has no connected descendants
  showBranchEmptyMsg(container);

  // Add branch stats overlay (HTML, not SVG - stays in place during zoom)
  var existingStats = document.getElementById('branch-stats-overlay');
  if (existingStats) existingStats.remove();
  if (_currentBranch && _currentBranch !== 'all') {
    if (_currentBranch.indexOf('枫槎') >= 0) {
      // Skip stats for 前枫槎/后枫槎
    } else {
    var totalPeople = cardIds.length;
    var aliveNames = {}, deceasedNames = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i].is_alive === '是') aliveNames[data[i].name + '_' + (data[i].generation_num||'0')] = true;
      else if (data[i].is_alive === '否') deceasedNames[data[i].name] = true;
    }
    var alive = Object.keys(aliveNames).length;
    var deceased = Object.keys(deceasedNames).length;
    var statsDiv = document.createElement('div');
    statsDiv.id = 'branch-stats-overlay';
    statsDiv.style.cssText = 'position:absolute;top:16px;right:16px;z-index:100;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-radius:10px;padding:6px 14px;border:1px solid rgba(255,255,255,0.08);font-size:12px;';
    statsDiv.innerHTML = '<div style="color:#fb923c;font-size:13px;font-weight:700;">支系总人口: ' + totalPeople + '人</div>' +
      '<div style="color:rgba(255,255,255,0.55);font-size:11px;">在世 ' + alive + ' · 已故 ' + deceased + '</div>';
    var scrollContainer = document.getElementById('tree-scroll-container');
    scrollContainer.appendChild(statsDiv);
    }
  }

  // Store node refs (for search)
  allNodes = [];
  var cards2 = container.querySelectorAll('.tree-html-card');
  for (var i = 0; i < cards2.length; i++) {
    allNodes.push({id: parseInt(cards2[i].getAttribute('data-id')), el: cards2[i]});
  }
}

function showBranchEmptyMsg(container) {
  if (_currentBranch && _currentBranch !== 'all' && container) {
    var existing = document.getElementById('branch-empty-msg');
    if (existing) existing.remove();
    // 手机端：分支用 canvas 全貌渲染、卡片按可见区虚拟化，渲染瞬间 DOM 卡数=0/1 是常态，
    // 不能靠卡数判断「支系空」，否则误报「该支系暂无详细的世代连接数据」且浮层滞留挡视图。
    // 分支按钮/图例本身有数据才会列出，无需此提示。
    if (isMobileTree()) return;
    var cardCount = container.querySelectorAll('.tree-html-card').length;
    if (cardCount <= 1) {
      var msgDiv = document.createElement('div');
      msgDiv.id = 'branch-empty-msg';
      msgDiv.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:50;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);border-radius:12px;padding:20px 28px;border:1px solid rgba(251,146,60,0.2);text-align:center;pointer-events:none;';
      msgDiv.innerHTML = '<div style="font-size:28px;margin-bottom:8px;">📋</div><div style="color:#fb923c;font-size:14px;font-weight:600;">该支系暂无详细的世代连接数据</div><div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:6px;">请在管理后台补充父ID关联后，即可查看完整世系图</div>';
      var sc = document.getElementById('tree-scroll-container');
      if (sc) sc.appendChild(msgDiv);
    }
  }
}

// 当前世系图数据源（★修复：本宗世系图 getHoufengchaTreeData id60000+、连续完整世系 id50000/80001+ 都不在
// getGenealogyData() 里——卡片点击若用 getGenealogyData() 查无此人 → showPersonDetail line 3104 直接 return 弹不出详情）。
// renderMobileMap 每次渲染存 _mblTreeData；showPersonDetail 存 _detailData 供弹窗内父亲/配偶/子女/祖先按钮复用同一份数据。
// 桌面端 _mblTreeData 未定义 → 兜底 getGenealogyData()，行为与原来完全一致（红线零影响）。
function curDetailData() { return window._mblTreeData || window._detailData || getGenealogyData(); }

function onCardClick(personId, event) {
  var data = window._mblTreeData || getGenealogyData();
  if (isMobileTree()) focusMobileNode(personId);
  showPersonDetail(personId, data);
}

function toggleTreeSVG(personId) {
  var data = getGenealogyData();
  var collapsed = {};
  try {
    var saved = JSON.parse(localStorage.getItem('xie_tree_collapsed') || '[]');
    saved.forEach(function(id) { collapsed[id] = true; });
  } catch(e) {}
  if (collapsed[personId]) delete collapsed[personId];
  else collapsed[personId] = true;
  localStorage.setItem('xie_tree_collapsed', JSON.stringify(Object.keys(collapsed).map(Number)));
  renderTreeSVG(data);
}

function expandAllTree() {
  _currentBranch = 'all';
  document.querySelectorAll('[id^="filter-"]').forEach(function(b) {
    b.style.background = ''; b.style.color = ''; b.style.border = '1px solid var(--glass-border)';
  });
  var allBtn = document.getElementById('filter-all');
  if (allBtn) { allBtn.style.background = 'var(--accent-orange)'; allBtn.style.color = '#fff'; allBtn.style.border = 'none'; }
  localStorage.setItem('xie_tree_collapsed', '[]');
  renderTreeSVG(getGenealogyData());
}

function collapseAllTree() {
  _currentBranch = 'all';
  document.querySelectorAll('[id^="filter-"]').forEach(function(b) {
    b.style.background = ''; b.style.color = ''; b.style.border = '1px solid var(--glass-border)';
  });
  var allBtn = document.getElementById('filter-all');
  if (allBtn) { allBtn.style.background = 'var(--accent-orange)'; allBtn.style.color = '#fff'; allBtn.style.border = 'none'; }
  var data = getGenealogyData();
  var allIds = [];
  data.forEach(function(p) {
    var children = getFilteredChildren(p, data);
    if (children.length > 0) allIds.push(p.id);
  });
  localStorage.setItem('xie_tree_collapsed', JSON.stringify(allIds));
  renderTreeSVG(data);
}

// ===== SVG Zoom & Pan =====
function treeZoomIn() { if (treeScale < 30) { treeScale = Math.min(30, treeScale * 1.4); applyTreeTransformSVG(); } }
function treeZoomOut() { if (treeScale > 0.02) { treeScale = Math.max(0.02, treeScale * 0.7); applyTreeTransformSVG(); } }
function treeZoomReset() { treeScale = 1; treePanX = 0; treePanY = 0; applyTreeTransformSVG(); }

function applyTreeTransformSVG() {
  var vp = document.querySelector('.tree-viewport');
  if (!vp) return;
  if (isMobileTree()) {
    // 原生滚动：容器尺寸 = 内容尺寸 × 缩放（决定双轴滚动范围），视口仅 scale，不 translate。
    // 用 !important 内联，压过全屏基础规则 `.genealogy-tree-section-fullscreen #tree-container{width:100%!important}`
    var tc = document.getElementById('tree-container');
    var mbc = window._mblContent;
    if (tc && mbc) {
      tc.style.setProperty('width', (mbc.w * treeScale) + 'px', 'important');
      tc.style.setProperty('height', (mbc.h * treeScale) + 'px', 'important');
    }
    vp.style.transform = 'scale(' + treeScale + ')';
  } else {
    vp.style.transform = 'translate(' + treePanX + 'px,' + treePanY + 'px) scale(' + treeScale + ')';
  }
  var el = document.getElementById('tree-zoom-level');
  if (el) el.textContent = Math.round(treeScale * 100) + '%';
}

// ===== Locate person in SVG tree =====
function doTreeSearch() {
  document.getElementById('tree-search-status').textContent = '搜索中...';
  document.getElementById('tree-search-status').style.color = 'var(--text-tertiary)';
  searchInTree();
}

function searchInTree() {
  var q = document.getElementById('tree-search-input').value.trim();
  var status = document.getElementById('tree-search-status');
  if (!q) return;
  var data = getGenealogyData();
  var found = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === q) { found = data[i]; break; }
  }
  if (!found) {
    // Partial match
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.indexOf(q) >= 0) { found = data[i]; break; }
    }
  }
  if (found) {
    treeAutoLocate(found.id);
    document.getElementById('tree-search-input').value = found.name;
    status.textContent = '✓ ' + found.name;
    status.style.color = '#22c55e';
    setTimeout(function() { status.textContent = ''; }, 3000);
  } else {
    status.textContent = '未找到';
    status.style.color = 'var(--accent-red)';
    setTimeout(function() { status.textContent = ''; }, 2000);
  }
}

function findById(id, data) {
  for (var i = 0; i < data.length; i++) { if (data[i].id === id) return data[i]; }
  return null;
}

function buildAncestorChain(person, data) {
  var chain = [];
  var cur = person;
  for (var loop = 0; loop < 300 && cur; loop++) {
    chain.push(cur);
    var fid = cur.father_id ? parseInt(cur.father_id) : null;
    cur = fid ? findById(fid, data) : null;
  }
  return chain;
}

function compareGeneration() {
  var data = getGenealogyData();
  var nameA = document.getElementById('gen-compare-a').value.trim();
  var nameB = document.getElementById('gen-compare-b').value.trim();
  var resultEl = document.getElementById('gen-compare-result');
  if (!nameA || !nameB) { resultEl.textContent = '请输入两人姓名'; resultEl.style.color = 'var(--accent-red)'; return; }
  var pA = null, pB = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === nameA) pA = data[i];
    if (data[i].name === nameB) pB = data[i];
  }
  if (!pA || !pB) { resultEl.textContent = '未找到「' + (!pA ? nameA : nameB) + '」'; resultEl.style.color = 'var(--accent-red)'; return; }
  var genA = parseInt(pA.generation_num) || 0;
  var genB = parseInt(pB.generation_num) || 0;
  var diff = Math.abs(genA - genB);
  var elder = genA < genB ? pA.name : pB.name;
  var younger = genA < genB ? pB.name : pA.name;
  var genDiff = genA < genB ? genB - genA : genA - genB;
  var relation = '';
  if (diff === 0) relation = '同辈（兄弟/姐妹）';
  else if (diff === 1) relation = elder + ' 是 ' + younger + ' 的父/母辈';
  else if (diff === 2) relation = elder + ' 是 ' + younger + ' 的祖父母辈';
  else relation = elder + ' 是 ' + younger + ' 的上' + diff + '世祖辈';
  resultEl.innerHTML = '<span style="color:var(--accent-orange);font-weight:600;">' + escapeHtml(pA.name) + '</span>（第' + genA + '世） vs <span style="color:var(--accent-orange);font-weight:600;">' + escapeHtml(pB.name) + '</span>（第' + genB + '世）<br><span style="font-weight:600;">相差 ' + diff + ' 代 · ' + relation + '</span>';
  resultEl.style.color = 'var(--text-primary)';
  // Also locate both in tree
  var cardA = document.querySelector('.tree-html-card[data-id="' + pA.id + '"]');
  var cardB = document.querySelector('.tree-html-card[data-id="' + pB.id + '"]');
  if (cardA) cardA.classList.add('highlight-name');
  if (cardB) cardB.classList.add('highlight-name');
}

function treeAutoLocate(personId) {
  var data = getGenealogyData();
  var person = null;
  for (var i = 0; i < data.length; i++) { if (data[i].id === personId) { person = data[i]; break; } }
  if (!person) return;
  var statusEl = document.getElementById('tree-search-status');

  // Expand tree (clear collapse state, but DON'T reset the current branch filter)
  localStorage.setItem('xie_tree_collapsed', '[]');
  if (isMobileTree()) {
    // 手机端：全貌/可读 → 平滑飞入可读并聚焦目标（flyTo 每帧 applyTreeTransformSVG + 虚拟化把目标卡拉进视口）
    // 全屏内跳过飞入动画：filterBranch 的 treeAutoLocate 延迟 200ms 才启动，常在全屏锚定之后才到，
    // 其 fly 每帧重写 scrollTop 会把全屏锚定居中滚动位覆盖回 0（远古全屏"靠左"根因）→ 改直接居中。
    if (mblInFs()) {
      // 用内容几何中心而非根节点坐标：远古分支根在布局顶端，以根居中会贴边(0)而非居中；
      // 与全屏进入锚点同款 mblLayoutCenter → 分支内容真正居中。
      mblEnsureCardsNear(mblLayoutCenter(), true);
    } else if (treeLayout[personId]) { mblMapFlyTo(personId); }
    else { treeScale = _MBL_DEFAULT_SCALE; applyTreeTransformSVG(); mblVizThrottled(); }
  } else {
    treeScale = 0.7;
    treePanX = 0;
    treePanY = 0;
    applyTreeTransformSVG();
  }

  setTimeout(function() {
    // Dim ALL cards first
    var allCards = document.querySelectorAll('.tree-html-card');
    for (var i = 0; i < allCards.length; i++) {
      allCards[i].style.opacity = '0.15';
      allCards[i].style.transition = 'opacity 0.5s';
    }
    // Brighten the target card
    var card = document.querySelector('.tree-html-card[data-id="' + personId + '"]');
    if (card) {
      // 手机端已由 flyTo 居中定位，无需 scrollToCardSVG（其用 panX/panY，手机原生滚动不适用）
      if (!isMobileTree()) scrollToCardSVG(card);
      card.style.opacity = '1';
      card.style.transform = 'scale(1.3)';
      card.style.transformOrigin = 'center center';
      card.style.transition = 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      card.classList.add('highlight-name');
      var inner = card.querySelector('.card-name');
      if (inner) {
        inner.style.animation = 'hlFlash 0.6s ease-in-out 8';
      }
    }
    // Auto restore after 6 seconds
    setTimeout(function() {
      for (var i = 0; i < allCards.length; i++) {
        allCards[i].style.opacity = '';
        allCards[i].style.transition = '';
      }
      if (card) { card.style.transform = ''; card.style.transition = ''; }
    }, 6000);
    if (statusEl) { statusEl.textContent = person.name; statusEl.style.background = '#cc0000'; statusEl.style.color = '#fff'; statusEl.style.padding = '2px 8px'; statusEl.style.borderRadius = '4px'; statusEl.style.fontWeight = '700'; setTimeout(function() { statusEl.textContent = ''; statusEl.style.background = ''; }, 4000); }
  }, 400);
}

function locateInTree(personId) {
  var overlay = document.querySelector('.person-overlay');
  if (overlay) overlay.remove();

  // Find the card
  var card = document.querySelector('.tree-html-card[data-id="' + personId + '"]');
  if (!card) {
    expandAllTree();
    setTimeout(function() {
      var card2 = document.querySelector('.tree-html-card[data-id="' + personId + '"]');
      if (card2) scrollToCardSVG(card2);
    }, 200);
    return;
  }
  scrollToCardSVG(card);
}

function exportTreePNG() {
  // Show export options menu
  var menu = document.createElement('div');
  menu.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg-primary);border:1px solid var(--glass-border);border-radius:14px;padding:24px;z-index:99999;box-shadow:0 20px 60px rgba(0,0,0,0.2);min-width:280px;text-align:center;';
  menu.innerHTML = '<h3 style="margin-bottom:12px;font-family:var(--font-title);">📥 导出族谱</h3>' +
    '<button class="btn btn-primary ripple-btn" onclick="this.parentElement.remove();exportTreeSVG()" style="display:block;width:100%;margin-bottom:8px;">导出世系图 (SVG)</button>' +
    '<button class="btn btn-primary ripple-btn" onclick="this.parentElement.remove();exportFullData()" style="display:block;width:100%;margin-bottom:8px;">导出全部数据 (JSON)</button>' +
    '<button class="btn btn-outline ripple-btn" onclick="this.parentElement.remove()" style="display:block;width:100%;">取消</button>' +
    '<div style="font-size:11px;color:var(--text-tertiary);margin-top:8px;">SVG：世系树状图<br>JSON：全部族谱数据</div>';
  document.body.appendChild(menu);
}

function exportTreeSVG() {
  var container = document.getElementById('tree-container');
  var svg = container.querySelector('svg');
  if (!svg) { alert('世系图尚未加载'); return; }
  var clone = svg.cloneNode(true);
  // Inline all CSS
  var cssText = '';
  for (var si = 0; si < document.styleSheets.length; si++) {
    try {
      var rules = document.styleSheets[si].cssRules || document.styleSheets[si].rules;
      for (var ri = 0; ri < rules.length; ri++) {
        var css = rules[ri].cssText;
        if (css.indexOf('.card-') >= 0 || css.indexOf('.tree-') >= 0 || css.indexOf('.ancestor-') >= 0 || css.indexOf('.tree-svg') >= 0) cssText += css + '\n';
      }
    } catch(e) {}
  }
  var styles = document.querySelectorAll('style');
  for (var si2 = 0; si2 < styles.length; si2++) {
    var txt = styles[si2].textContent;
    if (txt.indexOf('.card-') >= 0 || txt.indexOf('.tree-') >= 0) cssText += txt + '\n';
  }
  var defs = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  defs.textContent = cssText;
  clone.insertBefore(defs, clone.firstChild);
  // White background
  var bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', '100%'); bgRect.setAttribute('height', '100%');
  bgRect.setAttribute('fill', '#ffffff'); bgRect.setAttribute('x', '0'); bgRect.setAttribute('y', '0');
  clone.insertBefore(bgRect, clone.firstChild);
  // Export as SVG
  var svgData = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(clone);
  var blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'xie-family-tree-' + new Date().toISOString().slice(0,10) + '.svg';
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportFullData() {
  var data = getGenealogyData();
  if (!data || !data.length) { alert('无数据可导出'); return; }
  // Create a readable text report
  var text = '===== 下枫槎谢氏族谱数据 =====\n';
  text += '导出时间: ' + new Date().toLocaleString() + '\n';
  text += '总人数: ' + data.length + '\n\n';
  data.sort(function(a,b){return (a.generation_num||0)-(b.generation_num||0)||(a.name||'').localeCompare(b.name||'');});
  data.forEach(function(p) {
    var gen = p.generation_num ? '第' + p.generation_num + '世' : '?';
    var status = p.is_alive === '是' ? '在世' : '已故';
    var branch = (p.branch && p.branch !== '—') ? ' [' + p.branch + ']' : '';
    text += gen + ' ' + p.name + branch + ' ' + status + '\n';
    if (p.spouse_ids) text += '  配: ' + p.spouse_ids + '\n';
    if (p.biography) text += '  简介: ' + p.biography.replace(/<[^>]+>/g,'') + '\n';
  });
  var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'xie-genealogy-data-' + new Date().toISOString().slice(0,10) + '.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}

function scrollToCardSVG(card) {
  document.querySelectorAll('.tree-html-card.highlight-name').forEach(function(c) { c.classList.remove('highlight-name'); });
  if (card) card.classList.add('highlight-name');

  var scrollContainer = document.getElementById('tree-scroll-container');
  if (!scrollContainer) return;

  // Find card position using getBoundingClientRect in CSS pixel space
  var cardRect = card.getBoundingClientRect();
  var containerRect = scrollContainer.getBoundingClientRect();
  var cx = cardRect.left + cardRect.width/2 - containerRect.left;
  var cy = cardRect.top + cardRect.height/2 - containerRect.top;
  var containerCX = containerRect.width / 2;
  var containerCY = containerRect.height / 2;
  // Debug info
  window._treeDebug = { cardRect: {l:cardRect.left,t:cardRect.top,w:cardRect.width,h:cardRect.height}, cx:cx, cy:cy, panX:treePanX, panY:treePanY, scale:treeScale, adjX:(containerCX-cx)/treeScale, adjY:(containerCY-cy)/treeScale };
  treePanX += (containerCX - cx) / treeScale;
  treePanY += (containerCY - cy) / treeScale;
  applyTreeTransformSVG();

  // Fallback: try scrollIntoView on the SVG element directly
  try { card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }); } catch(e) {}

  setTimeout(function() { if (bg) bg.classList.remove('highlight'); }, 3500);
}

function scrollToCardSVG(card) {
  document.querySelectorAll('.tree-html-card.highlight-name').forEach(function(c) { c.classList.remove('highlight-name'); });
  if (card) card.classList.add('highlight-name');

  var scrollContainer = document.getElementById('tree-scroll-container');
  if (!scrollContainer) return;

  // Find card position using getBoundingClientRect in CSS pixel space
  var cardRect = card.getBoundingClientRect();
  var containerRect = scrollContainer.getBoundingClientRect();
  var cx = cardRect.left + cardRect.width/2 - containerRect.left;
  var cy = cardRect.top + cardRect.height/2 - containerRect.top;
  var containerCX = containerRect.width / 2;
  var containerCY = containerRect.height / 2;
  // Debug info
  window._treeDebug = { cardRect: {l:cardRect.left,t:cardRect.top,w:cardRect.width,h:cardRect.height}, cx:cx, cy:cy, panX:treePanX, panY:treePanY, scale:treeScale, adjX:(containerCX-cx)/treeScale, adjY:(containerCY-cy)/treeScale };
  treePanX += (containerCX - cx) / treeScale;
  treePanY += (containerCY - cy) / treeScale;
  applyTreeTransformSVG();

  // Fallback: try scrollIntoView on the SVG element directly
  try { card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }); } catch(e) {}

  setTimeout(function() { if (card) card.classList.remove('highlight-name'); }, 3500);
}

// ===== Horizontal tree layout toggle =====
var _treeLayoutMode = 'vertical';
var _hScale = 1, _hPanX = 0, _hPanY = 0;

function applyHTransform() {
  var vp = document.querySelector('#tree-scroll-container-h .tree-viewport');
  if (!vp) return;
  vp.style.transform = 'translate(' + _hPanX + 'px,' + _hPanY + 'px) scale(' + _hScale + ')';
}

var _hDragHandlers = null;
function setupHScroll() {
  cleanupHScroll();
  var sc = document.getElementById('tree-scroll-container-h');
  if (!sc) return;
  var drag = false, sx, sy;
  var wheelFn = function(e) {
    e.preventDefault();
    var r = sc.getBoundingClientRect();
    var mx = e.clientX - r.left, my = e.clientY - r.top;
    var f = e.deltaY < 0 ? 1.10 : 0.90;
    var ns = Math.max(0.02, Math.min(30, _hScale * f));
    _hPanX = mx - (mx - _hPanX) * (ns / _hScale);
    _hPanY = my - (my - _hPanY) * (ns / _hScale);
    _hScale = ns;
    applyHTransform();
    var el = document.getElementById('tree-zoom-level');
    if (el) el.textContent = Math.round(_hScale * 100) + '%';
  };
  var mdFn = function(e) {
    if (e.target.closest('.h-tree-card,button,text')) return;
    drag = true; sx = e.clientX - _hPanX; sy = e.clientY - _hPanY;
    sc.style.cursor = 'grabbing';
  };
  var mmFn = function(e) {
    if (!drag) return;
    _hPanX = e.clientX - sx; _hPanY = e.clientY - sy;
    applyHTransform();
  };
  var muFn = function() { drag = false; sc.style.cursor = 'grab'; };
  sc.addEventListener('wheel', wheelFn, { passive: false });
  sc.addEventListener('mousedown', mdFn);
  document.addEventListener('mousemove', mmFn);
  document.addEventListener('mouseup', muFn);
  sc.style.cursor = 'grab';
  _hDragHandlers = { sc: sc, wheel: wheelFn, md: mdFn, mm: mmFn, mu: muFn };
}
function cleanupHScroll() {
  if (_hDragHandlers) {
    _hDragHandlers.sc.removeEventListener('wheel', _hDragHandlers.wheel);
    _hDragHandlers.sc.removeEventListener('mousedown', _hDragHandlers.md);
    document.removeEventListener('mousemove', _hDragHandlers.mm);
    document.removeEventListener('mouseup', _hDragHandlers.mu);
    _hDragHandlers = null;
  }
}

// Override zoom buttons for horizontal mode
(function() {
  var _zi = treeZoomIn, _zo = treeZoomOut, _zr = treeZoomReset;
  treeZoomIn = function() {
    if (_treeLayoutMode === 'horizontal') {
      _hScale = Math.min(30, _hScale + 0.3); applyHTransform();
      document.getElementById('tree-zoom-level').textContent = Math.round(_hScale * 100) + '%';
    } else _zi();
  };
  treeZoomOut = function() {
    if (_treeLayoutMode === 'horizontal') {
      _hScale = Math.max(0.3, _hScale - 0.2); applyHTransform();
      document.getElementById('tree-zoom-level').textContent = Math.round(_hScale * 100) + '%';
    } else _zo();
  };
  treeZoomReset = function() {
    if (_treeLayoutMode === 'horizontal') {
      _hScale = 1; _hPanX = 0; _hPanY = 0; applyHTransform();
      document.getElementById('tree-zoom-level').textContent = '100%';
    } else _zr();
  };
})();

function toggleTreeLayout() {
  var v = document.getElementById('tree-scroll-container');
  var h = document.getElementById('tree-scroll-container-h');
  var btn = document.getElementById('tree-layout-toggle');
  if (!v || !h || !btn) return;
  if (_treeLayoutMode === 'vertical') {
    _treeLayoutMode = 'horizontal';
    v.style.display = 'none';
    h.style.display = 'block';
    btn.textContent = '↕ 纵向';
    _hScale = 1; _hPanX = 0; _hPanY = 0;
    document.getElementById('tree-container-h').innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-tertiary);font-size:14px;">⏳ 渲染世系图中...</div>';
    setTimeout(function() { renderHorizontalTree(getGenealogyData()); setupHScroll(); }, 50);
  } else {
    _treeLayoutMode = 'vertical';
    v.style.display = 'block';
    h.style.display = 'none';
    btn.textContent = '↔ 横向';
    cleanupHScroll();
    renderTreeSVG(getGenealogyData());
  }
}

// ===== Horizontal tree (left-to-right) =====
function renderHorizontalTree(data) {
  var container = document.getElementById('tree-container-h');
  if (!container || !data || data.length === 0) {
    if (container) container.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-tertiary);">暂无数据</div>';
    return;
  }

  // Build parent-child map
  var childMap = {};
  var nodeMap = {};
  data.forEach(function(p) {
    nodeMap[p.id] = p;
    var fid = parseInt(p.father_id);
    if (fid) {
      if (!childMap[fid]) childMap[fid] = [];
      childMap[fid].push(p);
    }
  });

  // Find roots (no father in data)
  var existingIds = {};
  data.forEach(function(p) { existingIds[p.id] = true; });
  var roots = data.filter(function(p) { return !p.father_id || !existingIds[parseInt(p.father_id)]; });
  if (roots.length === 0 && data.length > 0) roots = [data[0]];

  // Collapsed state: default collapse only branching points
  if (!window._hTreeCollapsed) window._hTreeCollapsed = {};
  // Auto-collapse multi-child nodes (branches hidden, main line visible)
  data.forEach(function(p) {
    var kids = childMap[p.id];
    if (kids && kids.length > 1) {
      kids.forEach(function(k, idx) { if (idx > 0) window._hTreeCollapsed[k.id] = true; });
    }
  });

  // Layout: assign (x, y) for each node
  // x = generation depth, y = vertical stacking
  var layout = {};
  var CARD_W = 120, CARD_H = 36, H_GAP = 20, V_GAP = 12;

  function countDescendants(id) {
    var kids = childMap[id] || [];
    var total = 0;
    kids.forEach(function(k) { total += 1 + countDescendants(k.id); });
    return total;
  }

  function verticalSpan(id) {
    if (window._hTreeCollapsed[id]) return 1;
    var kids = childMap[id] || [];
    if (kids.length === 0) return 1;
    var total = 0;
    kids.forEach(function(k) { total += verticalSpan(k.id); });
    return total;
  }

  function layoutNode(id, x, yStart, ySpanTotal) {
    var node = nodeMap[id];
    if (!node) return;
    var mySpan = window._hTreeCollapsed[id] ? 1 : verticalSpan(id);
    var myCenter = yStart + (mySpan / 2 - 0.5) * (CARD_H + V_GAP);
    layout[id] = { x: x, y: myCenter, span: mySpan };
    if (window._hTreeCollapsed[id]) return;
    var kids = childMap[id] || [];
    if (kids.length === 0) return;
    var totalChildSpan = 0;
    kids.forEach(function(k) { totalChildSpan += verticalSpan(k.id); });
    var childY = yStart;
    kids.forEach(function(k) {
      var ks = verticalSpan(k.id);
      var kSpan = (ks / totalChildSpan) * ySpanTotal;
      layoutNode(k.id, x + 1, childY, kSpan);
      childY += ks * (CARD_H + V_GAP);
    });
  }

  var rootY = 0;
  roots.forEach(function(root) {
    var totalSpan = verticalSpan(root.id);
    layoutNode(root.id, 0, rootY, totalSpan);
    rootY += totalSpan * (CARD_H + V_GAP) + V_GAP + 20;
  });

  // Calculate SVG dimensions
  var maxX = 0, maxY = 0;
  Object.keys(layout).forEach(function(id) {
    var l = layout[parseInt(id)];
    if (l.x > maxX) maxX = l.x;
    if (l.y > maxY) maxY = l.y;
  });
  var svgW = (maxX + 2) * (CARD_W + H_GAP) + 60;
  var svgH = (maxY + 2) * (CARD_H + V_GAP) + 60;

  var svg = '<div class="tree-viewport" style="transform-origin:0 0;transform:translate(' + (_hPanX||0) + 'px,' + (_hPanY||0) + 'px) scale(' + (_hScale||1) + ');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + svgW + ' ' + svgH + '" style="display:block;">';

  // Draw connectors
  data.forEach(function(p) {
    var pl = layout[p.id];
    if (!pl) return;
    var kids = childMap[p.id] || [];
    kids.forEach(function(k) {
      var kl = layout[k.id];
      if (!kl) return;
      var px1 = pl.x * (CARD_W + H_GAP) + CARD_W + 30;
      var py1 = pl.y;
      var px2 = kl.x * (CARD_W + H_GAP) + 30;
      var py2 = kl.y;
      svg += '<path class="h-connector" d="M' + px1 + ',' + py1 + ' L' + (px1 + (px2-px1)/2) + ',' + py1 + ' L' + (px1 + (px2-px1)/2) + ',' + py2 + ' L' + px2 + ',' + py2 + '"/>';
    });
  });

  // Draw cards
  data.forEach(function(p) {
    var l = layout[p.id];
    if (!l) return;
    var x = l.x * (CARD_W + H_GAP) + 30;
    var y = l.y;
    var isHighlight = /^(炎帝|小四|文杲|攒|撰|彬|乾|文对|申伯)/.test(p.name);
    var hasKids = childMap[p.id] && childMap[p.id].length > 0;
    var isCollapsed = window._hTreeCollapsed[p.id];

    svg += '<g class="h-tree-card" onclick="onHCardClick(' + p.id + ', event)" style="cursor:pointer;">';
    svg += '<rect class="h-card-bg' + (isHighlight ? ' highlight' : '') + '" x="' + x + '" y="' + (y - CARD_H/2) + '" width="' + CARD_W + '" height="' + CARD_H + '"/>';
    svg += '<text class="h-card-name" x="' + (x + CARD_W/2) + '" y="' + (y + 4) + '">' + escapeHtml(p.name.length > 8 ? p.name.substring(0,8) : p.name) + '</text>';
    svg += '<text class="h-card-gen" x="' + (x + CARD_W/2) + '" y="' + (y + CARD_H/2 - 4) + '">' + (p.generation_num ? '第' + p.generation_num + '世' : '') + '</text>';

    if (hasKids) {
      svg += '<text class="h-btn-expand" x="' + (x + CARD_W + 4) + '" y="' + (y + 4) + '" onclick="event.stopPropagation();toggleHCollapse(' + p.id + ')">' + (isCollapsed ? '⊕' : '⊖') + '</text>';
    }
    svg += '</g>';
  });

  svg += '</svg></div>';
  container.innerHTML = svg;
}

// Horizontal tree node click → show detail
function onHCardClick(id, event) {
  showPersonDetail(id, getGenealogyData());
}

// Horizontal tree collapse/expand toggle
function toggleHCollapse(id) {
  if (window._hTreeCollapsed[id]) {
    delete window._hTreeCollapsed[id];
  } else {
    window._hTreeCollapsed[id] = true;
  }
  renderHorizontalTree(getGenealogyData());
}

// ===== Setup SVG tree interactions =====
document.addEventListener('DOMContentLoaded', function() {
  // Tree search Enter key handler
  var tsInput = document.getElementById('tree-search-input');
  if (tsInput) tsInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') doTreeSearch(); });
  var scrollContainer = document.getElementById('tree-scroll-container');
  if (!scrollContainer) return;
  // 手机端：原生滚动 + 地图式全景（renderMobileMap 自带交互），不绑桌面 wheel/拖拽/捏合
  if (isMobileTree()) return;

  // Wheel zoom
  scrollContainer.addEventListener('wheel', function(e) {
    e.preventDefault();
    var rect = scrollContainer.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var factor = e.deltaY < 0 ? 1.10 : 0.90;
    var newScale = Math.max(0.02, Math.min(30, treeScale * factor));
    // Zoom towards mouse position using CSS pixel coordinates
    treePanX = mx - (mx - treePanX) * (newScale / treeScale);
    treePanY = my - (my - treePanY) * (newScale / treeScale);
    treeScale = newScale;
    applyTreeTransformSVG();
  }, { passive: false });

  // Drag to pan
  var isDragging = false, startX, startY;
  scrollContainer.addEventListener('mousedown', function(e) {
    if (e.target.closest('.tree-html-card') || e.target.closest('button') || e.target.tagName === 'text') return;
    isDragging = true;
    startX = e.clientX - treePanX;
    startY = e.clientY - treePanY;
    scrollContainer.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    treePanX = e.clientX - startX;
    treePanY = e.clientY - startY;
    applyTreeTransformSVG();
  });
  document.addEventListener('mouseup', function() {
    if (!isDragging) return;
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
  });
  scrollContainer.style.cursor = 'grab';

  // Touch
  var lastTouchDist = 0, lastTouchX = 0, lastTouchY = 0, tzStart = 1;
  scrollContainer.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx*dx + dy*dy); tzStart = treeScale;
    } else if (e.touches.length === 1) {
      lastTouchX = e.touches[0].clientX - treePanX;
      lastTouchY = e.touches[0].clientY - treePanY;
    }
  }, { passive: true });
  scrollContainer.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (lastTouchDist > 0) {
        treeScale = Math.max(0.02, Math.min(30, tzStart * (dist / lastTouchDist)));
        applyTreeTransformSVG();
      }
      lastTouchDist = dist;
    } else if (e.touches.length === 1) {
      treePanX = e.touches[0].clientX - lastTouchX;
      treePanY = e.touches[0].clientY - lastTouchY;
      applyTreeTransformSVG();
    }
  }, { passive: false });
});

  // ===== Person detail =====
  function showPersonDetail(id, data) {
    var person = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) { person = data[i]; break; }
    }
    if (!person) return;
    // ★存弹窗数据源：弹窗内父亲/配偶/子女/祖先按钮 curDetailData() 复用同一份（本宗世系图 id60000+ 不在 getGenealogyData）
    window._detailData = data;

    var overlay = document.createElement('div');
    overlay.className = 'person-detail-modal';
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

    var box = document.createElement('div');
    box.className = 'person-detail-box';

    var html = '<button onclick="this.closest(\'.person-detail-modal\').remove()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);">✕</button>';

    html += '<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">';
    html += '<div style="font-size:40px;">' + (person.gender === '男' ? '👤' : '👩') + '</div>';
    html += '<div><h2 style="font-family:var(--font-title);color:var(--text-primary);font-size:22px;font-weight:600;">' + escapeHtml(person.name) + '</h2>';
    html += '<div style="font-size:13px;color:var(--text-tertiary);">';
    if (person.generation && person.generation !== '—') html += person.generation + '字辈 ';
    if (person.generation_num) html += '第' + person.generation_num + '世 ';
    if (person.branch && person.branch !== '—') html += '· ' + person.branch;
    html += '</div></div></div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;font-size:14px;color:var(--text-secondary);margin-bottom:20px;padding:16px;background:var(--glass-bg);border-radius:8px;">';
    html += '<div>性别：' + (person.gender || '—') + '</div>';
    if (person.birth_date) html += '<div>出生：' + person.birth_date + '</div>';
    if (person.death_date) html += '<div>逝世：' + person.death_date + '</div>';
    html += '<div>状态：' + (person.is_alive === '是' ? '在世' : '已故' + calcAge(person.birth_date, person.death_date)) + '</div>';
    if (person.adopted && person.adopted !== '否') html += '<div>过继：' + person.adopted + '</div>';
    if (person.address) html += '<div>居住地：' + escapeHtml(person.address) + '</div>';
    if (person.father_id) {
      var fn = getPersonNameById(parseInt(person.father_id), data);
      if (fn) html += '<div>父亲：' + escapeHtml(fn) + '</div>';
    }
    if (person.mother_id) {
      var mn = getPersonNameById(parseInt(person.mother_id), data) || person.mother_id;
      if (mn) html += '<div>母亲：' + escapeHtml(mn) + '</div>';
    }
    var spNames = getSpouses(person.id, data).map(function(s) { return s.name; }).join('、');
    if (spNames) html += '<div>配偶：' + escapeHtml(spNames) + '</div>';
    html += '</div>';

    if (person.biography) {
      html += '<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;padding:16px;background:var(--glass-bg);border-radius:8px;">';
      html += '<h4 style="font-family:var(--font-title);color:var(--text-primary);font-size:14px;font-weight:500;margin-bottom:8px;">📝 生平简介</h4>';
      html += '<p style="margin:0;">' + escapeHtml(person.biography).replace(/\n/g, '<br>') + '</p></div>';
    }

    html += buildFamilyChart(person, data);
    html += '<div style="text-align:center;margin-top:16px;"><button class="btn btn-accent" onclick="this.closest(\'.person-detail-modal\').remove();showAncestors(' + person.id + ');" style="font-size:15px;padding:10px 28px;">\u2B06 \u67E5\u770B\u7956\u5148\u6811</button></div>';
    box.innerHTML = html;
    overlay.appendChild(box);
    // 全屏态（真全屏 section 在浏览器 Top Layer，盖过 body 一切 z-index）：弹层必须挂到全屏 section 内，
    // 否则被全屏层压住、只在关闭全屏后显现（用户：全屏点任何人没详情，竖屏有）。竖屏/桌面挂 body 不变。
    // ★时间轴全屏（#tl-fs 存在）优先挂 body：时间轴全屏是 documentElement 级全屏，body 内容正常渲染、
    //   z-index 层级生效（999999>200000 盖住 #tl-fs）；若走 mblInFs() 会误判世系图全屏、把弹层挂进
    //   手机端 display:none 的 genealogy-tree-section → 弹层不可见（用户：时间轴全屏横屏点某人的详情
    //   还是不出现，修了多次；旧代码此处只在世系图全屏修过，时间轴全屏没覆盖）。
    //   假横屏（#tl-fs-view.tl-fs-rotated）下弹层同步旋转横屏。
    var mount;
    var tlFs = document.getElementById('tl-fs');
    if (tlFs) {
      var tlView = tlFs.querySelector('#tl-fs-view');
      if (tlView && tlView.classList.contains('tl-fs-rotated')) overlay.classList.add('tl-fs-rotated-detail');
      mount = document.body;
    } else {
      mount = mblInFs() ? document.getElementById('genealogy-tree-section') : document.body;
    }
    mount.appendChild(overlay);
  }

  // ===== Enhanced Search =====
  function searchGenealogy() {
    var data = getGenealogyData();
    var q = document.getElementById('genealogy-search').value.trim().toLowerCase();
    var genFrom = parseInt(document.getElementById('search-gen-from').value) || 0;
    var genTo = parseInt(document.getElementById('search-gen-to').value) || 9999;
    var genderFilter = document.getElementById('search-gender').value;
    var aliveFilter = document.getElementById('search-alive').value;

    var rawResults = data.filter(function(p) {
      if (q && !(p.name && p.name.toLowerCase().indexOf(q) >= 0)) return false;
      if (genFrom > 0 || genTo < 9999) {
        var g = parseInt(p.generation_num) || 0;
        if (g < genFrom || g > genTo) return false;
      }
      if (genderFilter && p.gender !== genderFilter) return false;
      if (aliveFilter && p.is_alive !== aliveFilter) return false;
      return true;
    });

    // Deduplicate by name (出继/入继 same person = one record)
    var seenNames = {};
    var results = [];
    for (var ri = 0; ri < rawResults.length; ri++) {
      var rp = rawResults[ri];
      if (!seenNames[rp.name]) {
        seenNames[rp.name] = true;
        results.push(rp);
      }
    }

    var container = document.getElementById('search-results');
    var summary = document.getElementById('search-summary');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-tertiary);font-size:14px;">未找到匹配记录</div>';
      if (summary) summary.textContent = '共 0 条结果';
      return;
    }

    if (summary) summary.textContent = '共 ' + results.length + ' 条结果';

    results.sort(function(a, b) {
      return (parseInt(a.generation_num)||0) - (parseInt(b.generation_num)||0) || (a.name||'').localeCompare(b.name||'');
    });

    var html = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">';
    html += '<thead><tr style="border-bottom:2px solid var(--divider);">';
    html += '<th style="padding:6px 8px;text-align:left;color:var(--text-tertiary);font-weight:500;font-size:11px;">世代</th>';
    html += '<th style="padding:6px 8px;text-align:left;color:var(--text-tertiary);font-weight:500;font-size:11px;">姓名</th>';
    html += '<th style="padding:6px 8px;text-align:center;color:var(--text-tertiary);font-weight:500;font-size:11px;">性别</th>';
    html += '<th style="padding:6px 8px;text-align:left;color:var(--text-tertiary);font-weight:500;font-size:11px;">支系</th>';
    html += '<th style="padding:6px 8px;text-align:center;color:var(--text-tertiary);font-weight:500;font-size:11px;">状态</th>';
    html += '<th style="padding:6px 8px;text-align:center;color:var(--text-tertiary);font-weight:500;font-size:11px;">操作</th>';
    html += '</tr></thead><tbody>';
    results.forEach(function(p) {
      var rowBg = p.is_alive === '是' ? 'rgba(220,38,38,0.04)' : 'rgba(0,0,0,0.08)';
html += '<tr style="border-bottom:1px solid var(--divider);background:' + rowBg + ';transition:background 0.15s;" class="genealogy-hover-row">';
      html += '<td style="padding:6px 8px;color:var(--text-secondary);">' + (p.generation_num || '—') + '</td>';
      html += '<td style="padding:6px 8px;"><span style="cursor:pointer;font-weight:500;color:var(--text-primary);" onclick="showPersonDetail(' + p.id + ', getGenealogyData());locateInTree(' + p.id + ');">' + escapeHtml(p.name) + '</span>' + (p.adopted && p.adopted !== '否' ? (p.adopted === '出继' ? '<span style="font-size:10px;color:#22c55e;font-weight:600;margin-left:3px;">(出继)</span>' : '<span style="font-size:10px;color:var(--accent-orange);font-weight:600;margin-left:3px;">(入继)</span>') : '') + '</td>';
      html += '<td style="padding:6px 8px;text-align:center;">' + (p.gender === '男' ? '👤' : '👩') + '</td>';
      html += '<td style="padding:6px 8px;color:var(--text-secondary);font-size:12px;">' + (p.branch && p.branch !== '—' ? escapeHtml(p.branch) : '—') + '</td>';
      html += '<td style="padding:6px 8px;text-align:center;"><span style="font-size:10px;padding:1px 8px;border-radius:10px;background:' + (p.is_alive === '是' ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.3)') + ';color:' + (p.is_alive === '是' ? '#ef4444' : 'rgba(255,255,255,0.5)') + ';border:1px solid ' + (p.is_alive === '是' ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.08)') + ';">' + (p.is_alive === '是' ? '在世' : '已故') + '</span></td>';
      html += '<td style="padding:6px 8px;text-align:center;white-space:nowrap;">';
      html += '<button class="locate-btn" onclick="event.stopPropagation();locateInTree(' + p.id + ');" style="font-size:11px;padding:2px 8px;margin-right:4px;">🌳 定位</button>';
      html += '<button class="locate-btn" onclick="event.stopPropagation();showAncestors(' + p.id + ');" style="font-size:11px;padding:2px 8px;background:var(--accent-orange-dim);color:var(--accent-orange);">⬆ 祖先</button>';
      html += '</td></tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearSearch() {
    document.getElementById('genealogy-search').value = '';
    document.getElementById('search-gen-from').value = '';
    document.getElementById('search-gen-to').value = '';
    document.getElementById('search-gender').value = '';
    document.getElementById('search-alive').value = '';
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-summary').textContent = '';
  }

  // ===== Locate person in tree =====  // ===== Locate person in tree =====

function locateInTree(personId) {
    // 手机端（地图式全景）：走 treeAutoLocate → mblMapFlyTo 平滑飞入 + 高亮。
    // 本函数旧实现查 .pcard/scrollToCard（桌面旧卡片结构），手机原生滚动下无效。
    if (isMobileTree()) { treeAutoLocate(personId); return; }
    // Close any open detail popup
    var existingOverlay = document.querySelector('.person-overlay');
    if (existingOverlay) existingOverlay.remove();

    // Find the tree node card
    var card = document.querySelector('.pcard[data-id="' + personId + '"]');
    if (!card) {
      // Maybe tree isn't expanded enough — expand all first
      expandAllTree();
      // Try again after a brief delay
      setTimeout(function() {
        var card2 = document.querySelector('.pcard[data-id="' + personId + '"]');
        if (!card2) return;
        scrollToCard(card2);
      }, 100);
      return;
    }
    scrollToCard(card);
  }

  function scrollToCard(card) {
    // Remove previous highlight
    document.querySelectorAll('.pcard.highlight').forEach(function(c) { c.classList.remove('highlight'); });

    // Scroll the tree container to show this card
    var treeScroll = document.querySelector('.genealogy-tree-scroll');
    if (treeScroll) {
      var cardRect = card.getBoundingClientRect();
      var scrollRect = treeScroll.getBoundingClientRect();
      var offsetTop = card.offsetTop - treeScroll.offsetTop - scrollRect.height / 2 + card.offsetHeight / 2;
      treeScroll.scrollTo({ top: offsetTop, left: 0, behavior: 'smooth' });
    }

    // Highlight the card
    card.classList.add('highlight');

    // Scroll search results out of the way
    var resultsSection = document.getElementById('genealogy-search-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Remove highlight after 3.5s
    setTimeout(function() {
      card.classList.remove('highlight');
    }, 3500);
  }

  // ===== 查上代直系祖先 =====
  function showAncestors(personId) {
    // ★同数据源修复：本宗世系图 getHoufengchaTreeData(id60000+) 不在 getGenealogyData()，用弹窗/树的当前数据
    var data = curDetailData();
    var person = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === personId) { person = data[i]; break; }
    }
    if (!person) return;

    function findById(id) {
      for (var j = 0; j < data.length; j++) { if (data[j].id === id) return data[j]; }
      return null;
    }

    // Build ancestor chain using a given father field
    function buildChain(start, field) {
      var chain = [], broken = false;
      function walk(p, d) {
        if (d > 300) { broken = true; return; }
        chain.push(p);
        var fid = p[field];
        if (fid) { var f = findById(parseInt(fid)); if (f) { walk(f, d+1); return; } }
        if (p.mother_id) { var m = findById(parseInt(p.mother_id)); if (m) { walk(m, d+1); return; } }
      }
      walk(start, 0);
      return { chain: chain, broken: broken };
    }

    // Build the main (adoptive) chain
    var main = buildChain(person, 'father_id');
    var mainChain = main.chain;
    var mainBroken = main.broken;

    // Scan main chain for ANY adopted ancestor
    // Show dual lineage: main line + side branch (bio or adoptive)
    var bioBranches = {};
    for (var ci = 0; ci < mainChain.length; ci++) {
      var anc = mainChain[ci];
      var isAdopted = anc.adopted && anc.adopted !== '否';
      if (!isAdopted) continue;
      var isOut = (anc.adopted === '出继');
      // Normalize name for matching: strip common suffixes like (出继) (入继) (德全又美） etc.
      function stripSuffix(n) {
        return n.replace(/[（(].*[）)]/g,'').replace(/[【\[].*[】\]]/g,'').trim();
      }
      var ancBase = stripSuffix(anc.name);
      // Find the OTHER matching record (出继 ↔ 是(继子) pair)
      var otherRec = null;
      var otherType = isOut ? '是(继子)' : '出继';
      for (var di = 0; di < data.length; di++) {
        if (data[di].id !== anc.id && data[di].generation_num === anc.generation_num && data[di].adopted === otherType && data[di].father_id) {
          var otherBase = stripSuffix(data[di].name);
          if (otherBase === ancBase || data[di].name.indexOf(ancBase) >= 0 || ancBase.indexOf(otherBase) >= 0) {
            otherRec = data[di]; break;
          }
        }
      }
      if (!otherRec) continue;
      // For "出继" (main = bio line): side = adoptive chain from the 入继 record's father_id
      // For "是(继子)" (main = adoptive line): side = bio chain from the 出继 record's father_id
      var sideRootId = isOut ? parseInt(otherRec.father_id) : parseInt(otherRec.father_id);
      if (sideRootId && !isNaN(sideRootId) && sideRootId > 0) {
        var sideP = findById(sideRootId);
        if (sideP) {
          var sideRes = buildChain(sideP, 'father_id');
          bioBranches[anc.id] = { chain: sideRes.chain, broken: sideRes.broken, isAdoptive: isOut };
        }
      }
    }
    var hasBio = Object.keys(bioBranches).length > 0;

    // For each bio branch, find the merge point with main chain
    var mergePoints = {};
    if (hasBio) {
      for (var ancId in bioBranches) {
        var bio = bioBranches[ancId];
        var bioChain = bio.chain;
        // Find where bio chain merges with main chain (same name at same generation)
        var mergeIdx = -1;
        for (var bi = 0; bi < bioChain.length; bi++) {
          var ba = bioChain[bi];
          for (var mi = 0; mi < mainChain.length; mi++) {
            if (mainChain[mi].name === ba.name && mainChain[mi].generation_num === ba.generation_num && mainChain[mi].id !== parseInt(ancId)) {
              mergeIdx = mi;
              break;
            }
          }
          if (mergeIdx >= 0) break;
        }
        mergePoints[ancId] = mergeIdx;
      }
    }

    // Render a single chain node
    function relationTitle(genDiff) {
      var t = ['本人', '父亲', '祖父', '曾祖父', '高祖父', '天祖', '烈祖', '太祖', '远祖', '鼻祖'];
      if (genDiff < 0) return '后裔';
      return genDiff < t.length ? t[genDiff] : '上' + genDiff + '世祖';
    }

    function renderNode(a, isTarget, color, extraLabel, genDiff) {
      genDiff = genDiff || 0;
      var h = '<div class="ancestor-node' + (isTarget ? ' ancestor-self' : '') + '">';
      h += '<div class="ancestor-card" style="border-color:' + color + ';min-width:100px;" onclick="showPersonDetail(' + a.id + ', getGenealogyData());" title="点击查看详情">';
      h += '<div class="ancestor-gen" style="color:' + color + ';">第' + a.generation_num + '世</div>';
      if (!isTarget && genDiff > 0) {
        h += '<div style="font-size:10px;color:var(--accent-orange);font-weight:600;background:var(--accent-orange-dim);border-radius:3px;padding:0 6px;display:inline-block;margin-bottom:2px;">' + relationTitle(genDiff) + '</div>';
      }
      h += '<div class="ancestor-name">' + (isTarget ? '👉 ' : '') + escapeHtml(a.name) + '</div>';
      if (extraLabel) h += extraLabel;
      if (a.gender) h += '<div class="ancestor-meta">' + (a.gender === '男' ? '👤' : '👩') + (a.branch && a.branch !== '—' ? ' · ' + escapeHtml(a.branch) : '') + '</div>';
      if (a.spouse_ids) {
        var sp = a.spouse_ids.split(',').map(function(n){return n.trim();}).filter(function(n){return n;}).join('、');
        if (sp) h += '<div class="ancestor-meta">💑 ' + escapeHtml(sp) + '</div>';
      }
      h += '</div></div>';
      return h;
    }

    // Build HTML: render from oldest to youngest (ancestors at top, person at bottom)
    var html = '<div class="ancestor-tree-wrap" style="' + (hasBio ? 'max-width:650px;' : '') + '">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
    html += '<h4 style="margin:0;font-size:15px;font-weight:500;color:var(--text-primary);">⬆ ' + escapeHtml(person.name) + ' 的上代直系</h4>';
    html += '<button class="btn btn-sm" onclick="this.closest(\'.ancestor-tree-wrap\').parentElement.parentElement.remove()">✕ 关闭</button>';
    html += '</div>';

    // Identify split node (the adopted person, e.g. 世常 at splitIdx)
    var splitIdx = -1;
    for (var si = 0; si < mainChain.length; si++) {
      if (bioBranches[mainChain[si].id]) { splitIdx = si; break; }
    }
    var hasSplit = (splitIdx >= 0);
    var splitId = hasSplit ? mainChain[splitIdx].id : null;
    // Determine split direction: 出继 => main=bio(生父), side=继 | is(继子) => main=继, side=bio(生父)
    var splitPerson = splitId ? findById(splitId) : null;
    var splitIsOut = splitPerson && splitPerson.adopted === '出继';
    var mainSideLabel = splitIsOut ? '生父' : '继';
    var sideSideLabel = splitIsOut ? '继' : '生父';

    // Find where parallel region starts above split node: the youngest ancestor
    // where the main chain and bio chain share the SAME person
    var parallelTopIdx = -1;
    if (hasSplit) {
      var bio = bioBranches[splitId];
      var bioChain = bio.chain;
      for (var si = splitIdx + 1; si < mainChain.length; si++) {
        var anc = mainChain[si];
        var found = false;
        for (var bj = 0; bj < bioChain.length; bj++) {
          if (bioChain[bj].name === anc.name && bioChain[bj].generation_num === anc.generation_num) {
            found = true; break;
          }
        }
        if (found) { parallelTopIdx = si; break; }
      }
      // parallel region is from splitIdx+1 to parallelTopIdx-1
    }

    // Render from oldest (top) to youngest (bottom)
    for (var k = mainChain.length - 1; k >= 0; k--) {
      var a = mainChain[k];
      var nextA = k > 0 ? mainChain[k-1] : null;
      var isTarget = (k === 0);
      var mainColor = 'var(--accent-orange)';

      // Above parallel region: single chain
      if (hasSplit && k > parallelTopIdx && parallelTopIdx >= 0) {
        html += '<div style="display:flex;flex-direction:column;align-items:center;">';
        html += renderNode(a, false, mainColor, '', k);
        html += '<div class="ancestor-down-arrow" style="color:' + mainColor + ';">⬇</div>';
        html += '</div>';
        continue;
      }

      // Top of parallel: the shared ancestor (e.g. 昌申) - show it, then fork
      if (hasSplit && k === parallelTopIdx && parallelTopIdx >= 0) {
        html += '<div style="display:flex;flex-direction:column;align-items:center;">';
        html += renderNode(a, false, mainColor, '', k);
        html += '</div>';
        // Fork symbol
        html += '<div style="display:flex;gap:8px;align-items:center;justify-content:center;padding:2px 0;">';
        html += '<div style="flex:1;height:2px;background:' + mainColor + ';"></div>';
        html += '<div style="font-size:10px;color:var(--text-tertiary);">' + sideSideLabel + ' ↙&nbsp;&nbsp;↘ ' + mainSideLabel + '</div>';
        html += '<div style="flex:1;height:2px;background:#22d3ee;"></div>';
        html += '</div>';
        continue;
      }

      // Parallel region: show adoptive (left) and bio (right) side by side
      if (hasSplit && k > splitIdx && k < parallelTopIdx) {
        var bio = bioBranches[splitId];
        var bioChain = bio.chain;
        // Find matching bio person at same generation
        var matchedBio = null;
        for (var bj = 0; bj < bioChain.length; bj++) {
          if (bioChain[bj].generation_num === a.generation_num) {
            matchedBio = bioChain[bj]; break;
          }
        }
        html += '<div style="display:flex;gap:10px;align-items:center;justify-content:center;">';
        // Left: main line (adoptive or bio depending on direction)
        html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;">';
        var leftLabel = splitIsOut ? '生' : '继';
        html += renderNode(a, false, mainColor, '<div class="ancestor-meta" style="font-size:10px;color:' + mainColor + ';">' + leftLabel + '</div>', k);
        html += '<div class="ancestor-down-arrow" style="color:' + mainColor + ';">⬇</div>';
        html += '</div>';
        // Separator
        html += '<div style="width:1px;height:50px;background:var(--divider);"></div>';
        // Right: side branch
        html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;">';
        if (matchedBio) {
          html += '<div class="ancestor-card" style="border-color:rgba(34,211,238,0.3);min-width:100px;" onclick="showPersonDetail(' + matchedBio.id + ', getGenealogyData());">';
          html += '<div class="ancestor-gen" style="color:#22d3ee;">第' + matchedBio.generation_num + '世</div>';
          html += '<div class="ancestor-name">' + escapeHtml(matchedBio.name) + '</div>';
          html += '<div class="ancestor-meta" style="font-size:10px;color:#22d3ee;">' + sideSideLabel + '</div>';
          if (matchedBio.gender) html += '<div class="ancestor-meta">👤' + (matchedBio.branch && matchedBio.branch !== '—' ? ' · ' + escapeHtml(matchedBio.branch) : '') + '</div>';
          if (matchedBio.spouse_ids) {
            var sp = matchedBio.spouse_ids.split(',').map(function(n){return n.trim();}).filter(function(n){return n;}).join('、');
            if (sp) html += '<div class="ancestor-meta">💑 ' + escapeHtml(sp) + '</div>';
          }
          html += '</div>';
          html += '<div class="ancestor-down-arrow" style="color:#22d3ee;">⬇</div>';
        } else {
          html += '<div style="padding:10px;color:var(--text-tertiary);font-size:11px;">—</div>';
        }
        html += '</div>';
        html += '</div>';
        continue;
      }

      // Split node (世常): two lines converge here
      if (hasSplit && k === splitIdx) {
        html += '<div style="display:flex;gap:10px;align-items:center;justify-content:center;">';
        // Left connector from adoptive
        html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;">';
        html += '<div class="ancestor-connector" style="background:' + mainColor + ';height:12px;"></div>';
        html += '</div>';
        // Merge symbol
        html += '<div style="font-size:14px;color:var(--accent-orange);">⨝</div>';
        // Right connector from bio
        html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;">';
        html += '<div class="ancestor-connector" style="background:#22d3ee;height:12px;"></div>';
        html += '</div>';
        html += '</div>';
        // 世常 node
        html += '<div style="display:flex;flex-direction:column;align-items:center;">';
        if (nextA) html += '<div class="ancestor-connector" style="background:' + mainColor + ';"></div>';
        html += renderNode(a, isTarget, mainColor, '<div class="ancestor-meta" style="color:var(--accent-orange);font-size:11px;">📌 入继</div>', k);
        html += '</div>';
        continue;
      }

      // Below split: single chain (伟中)
      html += '<div style="display:flex;flex-direction:column;align-items:center;">';
      if (nextA) html += '<div class="ancestor-connector" style="background:' + mainColor + ';"></div>';
      html += renderNode(a, isTarget, mainColor, '', k);
      if (!isTarget) html += '<div class="ancestor-down-arrow" style="color:' + mainColor + ';">⬇</div>';
      html += '</div>';
    }

    html += '</div>';

    if (mainBroken) {
      html += '<div style="text-align:center;padding:8px;font-size:12px;color:var(--text-tertiary);margin-top:8px;border-top:1px dashed var(--glass-border);">⚠️ 上代数据不完整</div>';
    }
    if (hasBio) {
      html += '<div style="text-align:center;margin-top:8px;font-size:11px;color:var(--text-tertiary);">';
      html += '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--accent-orange);margin-right:4px;vertical-align:middle;"></span> 过继线 ';
      html += '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#22d3ee;margin-right:4px;vertical-align:middle;margin-left:12px;"></span> 原生线（生父系）';
      html += '</div>';
    }

    // Popup
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    var box = document.createElement('div');
    box.className = 'ancestor-tree-modal-box';   // 全屏横屏旋转/淡黄底色用（CSS 选择器锚点）
    box.style.cssText = 'background:var(--bg-primary);border:1px solid var(--glass-border);border-radius:14px;max-width:750px;width:100%;max-height:85vh;overflow-y:auto;padding:24px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.3);';
    box.innerHTML = html;
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:absolute;top:10px;right:14px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-tertiary);z-index:10;';
    closeBtn.onclick = function() { overlay.remove(); };
    box.appendChild(closeBtn);
    overlay.appendChild(box);
    // 全屏态挂 section 内（同详情弹层：真全屏 Top Layer 压住 body 弹层）。
    // ★时间轴全屏（#tl-fs 存在）优先挂 body + 假横屏同步旋转（理由同 showPersonDetail）。
    var mount;
    var tlFs = document.getElementById('tl-fs');
    if (tlFs) {
      var tlView = tlFs.querySelector('#tl-fs-view');
      if (tlView && tlView.classList.contains('tl-fs-rotated')) overlay.classList.add('tl-fs-rotated-detail');
      mount = document.body;
    } else {
      mount = mblInFs() ? document.getElementById('genealogy-tree-section') : document.body;
    }
    mount.appendChild(overlay);
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escHandler); }
    });
  }

  // Allow Enter key to search
  document.addEventListener('DOMContentLoaded', function() {
  // Tree search Enter key handler
  var tsInput = document.getElementById('tree-search-input');
  if (tsInput) tsInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') doTreeSearch(); });
    var searchInput = document.getElementById('genealogy-search');
    if (searchInput) {
      searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchGenealogy();
      });
    }
  });

  // ===== Relation Calculator =====
  function getPersonByName(name, data) {
    var n = name.trim().toLowerCase();
    // 1. Exact match
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase() === n) return data[i];
    }
    // 2. Name starts with search term (e.g. "施鹏" matches "施鹏（入赘...）")
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase().indexOf(n) === 0) return data[i];
    }
    // 3. Partial match
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase().indexOf(n) >= 0) return data[i];
    }
    return null;
  }

  function findAncestors(person, data) {
    var path = [];
    var current = person;
    var visited = {};
    while (current) {
      if (visited[current.id]) break;
      visited[current.id] = true;
      path.push(current);
      var fatherId = parseInt(current.father_id);
      var found = false;
      if (fatherId) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id === fatherId) { current = data[i]; found = true; break; }
        }
      }
      if (!found) {
        var motherId = parseInt(current.mother_id);
        if (motherId) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].id === motherId) { current = data[i]; found = true; break; }
          }
        }
      }
      if (!found) break;
    }
    return path;
  }

  function calcRelation() {
    var data = getGenealogyData();
    var name1 = document.getElementById('relation-p1').value;
    var name2 = document.getElementById('relation-p2').value;
    var resultEl = document.getElementById('relation-result');
    var pathEl = document.getElementById('relation-ancestor-path');

    if (!name1 || !name2) {
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div style="padding:12px;background:var(--glass-bg);border-radius:8px;text-align:center;color:var(--text-tertiary);">请输入两个人的姓名</div>';
      pathEl.style.display = 'none';
      return;
    }

    var p1 = getPersonByName(name1, data);
    var p2 = getPersonByName(name2, data);

    if (!p1 || !p2) {
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div style="padding:12px;background:var(--glass-bg);border-radius:8px;text-align:center;color:var(--text-tertiary);">未找到 "' + (!p1 ? name1 : name2) + '"</div>';
      pathEl.style.display = 'none';
      return;
    }

    if (p1.id === p2.id) {
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div style="padding:16px;background:var(--glass-bg);border-radius:8px;text-align:center;font-size:16px;color:var(--text-primary);">是同一个人</div>';
      pathEl.style.display = 'none';
      return;
    }

    // Check if they are spouses
    function isSpouse(a, b) {
      if (a.spouse_ids) {
        var names = a.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
        for (var i = 0; i < names.length; i++) {
          if (names[i] === b.name) return true;
        }
      }
      return false;
    }
    if (isSpouse(p1, p2) || isSpouse(p2, p1)) {
      resultEl.style.display = 'block';
      pathEl.style.display = 'none';
      resultEl.innerHTML = '<div style="padding:20px;background:var(--glass-bg);border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#ef4444;margin-bottom:8px;">💑 夫妻关系</div><div style="font-size:14px;color:var(--text-secondary);">' + escapeHtml(p1.name) + ' 与 ' + escapeHtml(p2.name) + ' 是夫妻</div></div>';
      return;
    }

    var a1 = findAncestors(p1, data);
    var a2 = findAncestors(p2, data);

    var commonAncestor = null;
    var gen1 = -1, gen2 = -1;
    for (var i = 0; i < a1.length; i++) {
      for (var j = 0; j < a2.length; j++) {
        if (a1[i].id === a2[j].id) {
          commonAncestor = a1[i];
          gen1 = i;
          gen2 = j;
          break;
        }
      }
      if (commonAncestor) break;
    }

    resultEl.style.display = 'block';
    pathEl.style.display = 'block';

    if (!commonAncestor) {
      resultEl.innerHTML = '<div style="padding:16px;background:var(--glass-bg);border-radius:8px;text-align:center;font-size:16px;color:var(--text-tertiary);">未找到共同祖先</div>';
      pathEl.innerHTML = '';
      return;
    }

    var relation = '';
    var genDiff = Math.abs(gen1 - gen2);
    var genMin = Math.min(gen1, gen2);

    if (genMin === 0) {
      if (genDiff === 1) relation = gen1 === 0 ? (escapeHtml(p1.name) + ' 是 ' + escapeHtml(p2.name) + ' 的父/母') : (escapeHtml(p2.name) + ' 是 ' + escapeHtml(p1.name) + ' 的父/母');
      else if (genDiff === 2) relation = gen1 === 0 ? (escapeHtml(p1.name) + ' 是 ' + escapeHtml(p2.name) + ' 的祖父母') : (escapeHtml(p2.name) + ' 是 ' + escapeHtml(p1.name) + ' 的祖父母');
      else relation = gen1 === 0 ? (escapeHtml(p1.name) + ' 是 ' + escapeHtml(p2.name) + ' 的上' + genDiff + '世祖') : (escapeHtml(p2.name) + ' 是 ' + escapeHtml(p1.name) + ' 的上' + genDiff + '世祖');
    } else if (genMin === 1) {
      if (genDiff === 0) relation = '兄弟/姐妹';
      else if (genDiff === 1) relation = '叔侄/姑侄';
      else relation = gen1 + '世孙 · 叔侄';
    } else {
      if (genDiff === 0) relation = '堂兄弟/堂姐妹（共祖' + commonAncestor.generation_num + '世）';
      else relation = '远房亲属';
    }

    var html = '<div style="padding:20px;background:var(--glass-bg);border-radius:12px;text-align:center;">';
    html += '<div style="font-size:28px;font-weight:700;color:var(--accent-orange);margin-bottom:8px;">' + escapeHtml(relation) + '</div>';
    html += '<div style="font-size:14px;color:var(--text-secondary);">';
    html += escapeHtml(p1.name) + ' 与 ' + escapeHtml(p2.name);
    html += '</div>';
    html += '<div style="font-size:12px;color:var(--text-tertiary);margin-top:6px;">';
    html += '共同祖先：' + escapeHtml(commonAncestor.name) + '（第' + commonAncestor.generation_num + '世）';
    html += '</div></div>';
    resultEl.innerHTML = html;

    var pathHtml = '<div style="padding:12px;background:var(--glass-bg);border-radius:8px;font-size:12px;margin-top:8px;">';
    pathHtml += '<div style="font-weight:600;color:var(--text-primary);margin-bottom:6px;">⬆ 直系路径</div>';
    pathHtml += '<div style="display:flex;flex-wrap:wrap;gap:3px;align-items:center;">';
    for (var i = 0; i < a1.length && i <= gen1; i++) {
      pathHtml += '<span style="color:var(--accent-orange);font-weight:600;">' + escapeHtml(a1[i].name) + '</span>';
      if (i < gen1) pathHtml += '<span style="color:var(--text-muted);font-size:10px;"> → </span>';
    }
    if (gen1 > 0) pathHtml += '<span style="color:var(--text-muted);font-size:12px;margin:0 6px;">|</span>';
    for (var i = 0; i < a2.length && i <= gen2; i++) {
      pathHtml += '<span style="color:var(--accent-orange);font-weight:600;">' + escapeHtml(a2[i].name) + '</span>';
      if (i < gen2) pathHtml += '<span style="color:var(--text-muted);font-size:10px;"> → </span>';
    }
    pathHtml += '</div></div>';
    pathEl.innerHTML = pathHtml;
  }

  function buildFamilyChart(person, data) {
    var h = '<div style="margin-top:16px;padding:16px;background:var(--glass-bg);border-radius:8px;">';
    h += '<h4 style="font-family:var(--font-title);color:var(--text-primary);font-size:14px;font-weight:500;margin-bottom:12px;">\uD83D\uDC6A 亲系关系</h4>';

    var father = null, mother = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === parseInt(person.father_id)) father = data[i];
      if (data[i].id === parseInt(person.mother_id)) mother = data[i];
    }
    if (father || mother) {
      h += '<div style="margin-bottom:10px;"><div style="font-size:12px;color:var(--text-tertiary);margin-bottom:4px;">\u2B06 父母</div><div style="display:flex;gap:8px;flex-wrap:wrap;">';
      if (father) h += '<span class="locate-btn" onclick="showPersonDetail(' + father.id + ', curDetailData());" style="cursor:pointer;font-size:13px;padding:4px 12px;">\uD83D\uDC68 \u7236: ' + escapeHtml(father.name) + '</span>';
      if (mother) h += '<span class="locate-btn" onclick="showPersonDetail(' + mother.id + ', curDetailData());" style="cursor:pointer;font-size:13px;padding:4px 12px;">\uD83D\uDC69 \u6BCD: ' + escapeHtml(mother.name) + '</span>';
      h += '</div></div>';
    }

    var spouses = getSpouses(person.id, data);
    if (spouses.length > 0) {
      h += '<div style="margin-bottom:10px;"><div style="font-size:12px;color:var(--text-tertiary);margin-bottom:4px;">\uD83D\uDC91 配偶</div><div style="display:flex;gap:8px;flex-wrap:wrap;">';
      spouses.forEach(function(s) {
        h += '<span class="locate-btn" onclick="showPersonDetail(' + s.id + ', curDetailData());" style="cursor:pointer;font-size:13px;padding:4px 12px;">\uD83D\uDC69 \u914D\u5076: ' + escapeHtml(s.name) + '</span>';
      });
      h += '</div></div>';
    }

    var children = [];
    for (var i = 0; i < data.length; i++) {
      if (parseInt(data[i].father_id) === person.id || parseInt(data[i].mother_id) === person.id) {
        children.push(data[i]);
      }
    }
    if (children.length > 0) {
      h += '<div><div style="font-size:12px;color:var(--text-tertiary);margin-bottom:4px;">\u2B07 子女（' + children.length + '\u4EBA\uFF09</div><div style="display:flex;gap:6px;flex-wrap:wrap;">';
      children.forEach(function(c) {
        h += '<span class="locate-btn" onclick="showPersonDetail(' + c.id + ', curDetailData());" style="cursor:pointer;font-size:13px;padding:4px 12px;">\uD83D\uDC66 ' + escapeHtml(c.name) + '</span>';
      });
      h += '</div></div>';
    }

    h += '</div>';
    return h;
  }

  function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

    // ===== Render everything =====
  function renderGenealogyPageSVG() {
    var data = getGenealogyData();
    if (!data || data.length === 0) { return; }
    // 统计、树、时间轴、检索全部使用同一份后台 canonical 数据。
    // 不读取 localStorage 快照，也不把旧 seed/远古硬编码拼入统计。
    var statsData = data;
    if (statsData) {
      statsData.forEach(function(p) {
        // canonical 数据的世次已由管理后台核定，前台不再自行平移或重算。
        p.generation_num = parseInt(p.generation_num, 10) || 0;
      });
      var total = statsData.length;
      var gens = {}, branches = {}, males = 0, females = 0, genMax = 0;
      statsData.forEach(function(p) {
        var g = p.generation_num || 0; gens[g] = (gens[g]||0)+1;
        if (p.branch && p.branch !== '—') branches[p.branch] = (branches[p.branch]||0)+1;
        if (p.gender === '男') males++; else if (p.gender === '女') females++;
        if (parseInt(g) > genMax) genMax = parseInt(g);
      });
      var statsEl = document.getElementById('stats-container');
      if (statsEl) {
        function dg(n) { var s = String(n), r = ''; for (var i = 0; i < s.length; i++) { r += '<span style="display:inline-block;animation:digitPop 0.35s cubic-bezier(0.22,1,0.36,1) ' + (i * 0.08) + 's both;">' + s[i] + '</span>'; } return r; }
        function sc(n, l) { return '<div class="stat-card-anim"><span class="border-line bl-top"></span><span class="border-line bl-right"></span><span class="border-line bl-bottom"></span><span class="border-line bl-left"></span><div class="stat-num">' + dg(n) + '</div><div class="stat-label">' + l + '</div></div>'; }
        statsEl.innerHTML = ''
          + sc(total, '总人数')
          + sc(genMax, '世代')
          + sc(Object.keys(branches).length, '支系')
          + sc(males, '男')
          + sc(females, '女');
      }
    }

    // Show loading for tree
    var tc = document.getElementById('tree-container');
    if (tc) tc.innerHTML = '<div class="tree-loading"><span class="tree-loading-spinner"></span> 世系图加载中…</div>';
    // 真实世系树（树状图）优先：admin.js 已加载（buildAdminTreeHtml 可用）时渲染卡片树，
    // 否则退化为简单世系列表。此前无条件 renderSimpleTree 会在实时数据重载（line ~2738）
    // 时把 admin.js onload 已渲染好的卡片树覆盖回简单列表，导致手机端/桌面端首屏只有简单列表，
    // 必须点「全部世系」才出现树状图。
    if (typeof window.renderTreeSVG === 'function' && typeof window.buildAdminTreeHtml === 'function') {
      renderTreeSVG(data);
    } else {
      renderSimpleTree(data);
    }
    // Fade in sections
    var sections = ['genealogy-generation-chart','genealogy-stats','genealogy-timeline','genealogy-search-section','genealogy-relation-section','genealogy-tree-section','genealogy-table-section'];
    sections.forEach(function(id) { var el = document.getElementById(id); if (el) el.style.opacity = '1'; });
  }
  
  // Wait for page ready// Wait for page ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(renderGenealogyPageSVG, 50);
  } else {
    document.addEventListener('DOMContentLoaded', renderGenealogyPageSVG);
  }
  // 已移除 Supabase/旧缓存兜底。后台 canonical API 失败时页面保持空态，
  // 防止旧数据悄悄覆盖唯一数据源。

  // ===== 开启页搜索跳转支持：?search=姓名 → 自动填入搜索框并执行搜索 =====
  (function(){
    var m = location.search.match(/[?&]search=([^&]+)/);
    if (!m) return;
    var q = decodeURIComponent(m[1]);
    var input = document.getElementById('genealogy-search');
    if (input) input.value = q;
    var tries = 0;
    var t = setInterval(function() {
      tries++;
      if (typeof searchGenealogy === 'function') {
        clearInterval(t);
        searchGenealogy();
        var sec = document.getElementById('genealogy-search-section');
        if (sec) { try { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(e) {} }
      } else if (tries > 20) { clearInterval(t); }
    }, 300);
  })();
    // bg-canvas removed

// ===== Fullscreen toggle (CSS position:fixed approach) =====
function pageTreeFullscreen(forceCss) {
  var section = document.getElementById('genealogy-tree-section');
  if (!section) return;
  var isFS = section.classList.contains('genealogy-tree-section-fullscreen');
  if (!isFS) {
    // Enter fullscreen
    section.classList.add('genealogy-tree-section-fullscreen');
    document.body.style.overflow = 'hidden';
    // 先立即启用 CSS 横屏兜底，再尝试系统方向锁。部分 HarmonyOS/微信 WebView
    // 的 screen.orientation.lock() 会一直 pending，不能等它返回后才旋转页面。
    if (isMobileTree() && window.innerWidth <= window.innerHeight) mblForceLandscape();
    // forceCss=true：自动进入（lineage-tree.html 无用户手势）。requestFullscreen / screen.orientation.lock
    // 都要求用户手势，无手势必被拒或挂起 → 手机端直接 CSS 强制横屏（任何浏览器零手势生效），
    // 保证「一进世系图谱就是横屏」。真全屏/系统锁横屏仅在有手势的按钮路径（forceCss=false）走。
    var fsP = null;
    if (!forceCss) {
      // Try native browser fullscreen for immersive view
      try { if (section.requestFullscreen) fsP = section.requestFullscreen(); } catch(e) {}
      // 真全屏就绪后锁横屏：screen.orientation.lock 需全屏态+用户手势，链在 requestFullscreen().then()
      // 比 fullscreenchange 时机可靠（后者可能已过用户激活窗口）。无真全屏 API（iOS/微信内核）fsP 为
      // null → 手机端直接走 mblLockLandscape（无锁 API 则弹旋转提示）。桌面端 isMobileTree()=false 不受影响。
      if (fsP && fsP.then) {
        fsP.then(function() { if (isMobileTree()) mblLockLandscape(); })
           .catch(function() { if (isMobileTree()) mblLockLandscape(); });  // 真全屏被拒（如快速重进）→ 仍走 CSS 假横屏
      } else if (isMobileTree()) {
        mblLockLandscape();
      }
    }
    // Show close button
    var closeBtn = document.getElementById('fs-close-btn');
    if (closeBtn) closeBtn.style.display = 'flex';
    // Re-fit tree after layout settles（仅桌面：桌面 gz 树用 .apt-card，.tree-html-card 仅手机虚拟化卡，
    // 手机端此处会读取「可见子集」卡的位置改写 treeScale 破坏手机尺度，故手机端跳过 re-fit）
    // 手机端：全屏只改变视口尺寸（section 由 position:fixed 盖满视口）→ 布局落定后按新视口
    // 刷新虚拟化/全貌重绘（与 exitPageFullscreen 对称，否则 canvas 停在旧 62vh 尺寸不随全屏缩放）。
    if (isMobileTree()) {
      // 先取消进行中的飞入动画（filterBranch→treeAutoLocate→mblMapFlyTo 的 step 循环每帧重写
      // scrollLeft/scrollTop，会覆盖下面锚定居中的滚动位——远古全屏偶发停在左上/靠左的根因）。
      // 取消后动画停、不再写 scroll；若动画停在中间尺度则回默认（可读卡片大小恒定）。
      if (_mblFlyId) {
        cancelMblFly();
        if (treeScale < _MBL_DEFAULT_SCALE) { treeScale = _MBL_DEFAULT_SCALE; applyTreeTransformSVG(); }
      }
      // 全屏直接给可读卡片树（用户：全屏横屏不要 canvas 蓝点+线条的全貌图，要可缩放平移的卡片树）。
      // 初始非全屏默认是 overview 全貌，全屏进入时强制切可读：可读尺度 + 显示卡片层。
      var fsAnchor = null;
      if (_mblMode === 'overview') {
        // 锚点取内容几何中心（主世系密集带所在，见 mblEnsureCardsNear）。不用 _mblContentPoint()：
        // overview fit 尺度下它返回 y≈8166 超内容高 5452，最近卡片落在稀疏底部只显示几张卡。
        var mbc = window._mblContent;
        if (mbc) fsAnchor = { x: mbc.w / 2, y: mbc.h / 2 };
        treeScale = _MBL_DEFAULT_SCALE;
        applyTreeTransformSVG();
        setMblMode('readable');
      }
      // 布局落定（含 CSS 强制横屏 rotate 生效）后：先锚到内容中心再渲染。
      // 远古等小分支全屏默认停在左上（用户：远古全屏要居中不要靠左边）→ 锚点=当前筛选内容几何中心
      // （treeLayout 已按分支筛选），mblFsRedraw 里 force 强制居中（非仅空角兜底）。
      var lc = mblLayoutCenter();
      if (lc) fsAnchor = lc;
      _mblFsAnchorPending = true;
      _mblFsAnchor = fsAnchor || null;
      // 自动进入（forceCss）无手势锁不了真横屏 → 直接 CSS 强制横屏（自带 mblFsRedraw），
      // 之后下面再 mblFsRedraw 一次，双 rAF 串行后者权威，可读卡片树 + 横屏几何一次到位。
      if (forceCss) mblForceLandscape();
      mblFsRedraw();
      return;
    }
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        var container = document.getElementById('tree-scroll-container');
        if (container) {
          var cards = container.querySelectorAll('.tree-html-card');
          var cw = container.clientWidth || window.innerWidth;
          var ch = container.clientHeight || window.innerHeight;
          if (cards.length > 0 && cw > 0 && ch > 0) {
            var mnX=Infinity,mxX=-Infinity,mnY=Infinity,mxY=-Infinity;
            cards.forEach(function(c) {
              var left = parseInt(c.style.left) || 0;
              var top = parseInt(c.style.top) || 0;
              if (left < mnX) mnX = left; if (left > mxX) mxX = left;
              if (top < mnY) mnY = top; if (top > mxY) mxY = top;
            });
            var treeW = (mxX - mnX) + 160, treeH = (mxY - mnY) + 100, pad = 30;
            var sx = (cw - pad) / treeW, sy = (ch - pad) / treeH;
            treeScale = Math.min(sx, sy, 5);
            if (treeScale < 0.02) treeScale = 0.02;
            treePanX = (cw - treeW * treeScale) / 2 - mnX * treeScale;
            treePanY = (ch - treeH * treeScale) / 2 - mnY * treeScale;
            applyTreeTransformSVG();
          }
        }
      });
    });
  } else {
    exitPageFullscreen();
  }
}

function exitPageFullscreen() {
  // 真全屏退出。CSS 假横屏自动进入路径（forceCss）从未进真全屏 → document.exitFullscreen() 拒绝
  // promise（Document not active），补 .catch 吞掉未处理拒绝，避免控制台报错掩盖真实问题。
  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      var ep = document.exitFullscreen();
      if (ep && ep.then) ep.catch(function(){});
    }
  } catch(e){}
  var section = document.getElementById('genealogy-tree-section');
  if (section) section.classList.remove('genealogy-tree-section-fullscreen');
  document.body.style.overflow = '';
  var closeBtn = document.getElementById('fs-close-btn');
  if (closeBtn) closeBtn.style.display = 'none';
  if (isMobileTree()) {
    // 全屏内允许缩到 0.08 看整体；退出全屏后若尺度过低（<0.5）会被非全屏的 mblAutoMode 切 canvas 全貌
    //（蓝点+线条，用户明确不要）→ 恢复默认可读尺度，退出后仍是可读卡片树。
    if (treeScale < 0.5) {
      treeScale = _MBL_DEFAULT_SCALE;
      applyTreeTransformSVG();
      setMblMode('readable');
    }
    mblUnlockOrientation(); // 解锁横屏（真全屏退出）
    mblUnrotate();          // 移除 CSS 强制横屏
    // 手机端退出全屏：保持当前尺度与模式（treeZoomReset 的 1:1 会破坏手机默认可读 0.75，
    // 且手机缩放按钮已隐藏无从恢复）。退出只改变视口尺寸 → 布局落定后按恢复后的视口刷新
    // 虚拟化/全貌重绘（需双 rAF：类移除瞬间同步读 sc.clientWidth 是回退中间值 350，落定后才是 318）。
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        if (_mblMode === 'readable') mblVizThrottled();
        else if (_mblMode === 'overview') mblMapDraw();
      });
    });
  } else {
    treeZoomReset();
  }
}

// Escape key exits fullscreen
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') exitPageFullscreen();
});

/* ===== 真全屏横屏锁 + fullscreenchange 兜底清理（手机端） =====
   ⛶ 全屏进入时 section.requestFullscreen()（真全屏，盖满整个屏幕不含浏览器栏）。
   手机端退出真全屏多靠系统手势/浏览器按钮，不会触发 keydown Escape →
   假全屏 class 残留、横屏锁未解。fullscreenchange 事件统一兜底：
   - 进入真全屏 → 锁横屏（screen.orientation.lock 需在全屏态+用户手势内调用，
     Android Chrome 支持；iOS Safari 不支持元素全屏/锁横屏 → 静默回退 CSS 假全屏竖屏）。
   - 退出真全屏 → 清假全屏 class/overflow/关闭按钮 + 解锁横屏 + 按新视口重绘。 */
var _mblOrientationLocked = false;

function mblFsRedraw() {
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      if (_mblMode === 'readable') {
        if (_mblFsAnchorPending) {   // 全屏进入：先落锚点（空角白屏兜底 + 筛选分支强制居中），再按最终滚动位渲染
          // 旋转未就绪时不消费：CSS 假横屏类未加且仍是竖屏 → 容器还是竖屏尺寸（内容<视口 → maxT=0），
          // 此刻滚动会被钳成 0 且旋转后不回滚（居中出现偶发失效的根因）。保持 pending，等旋转后 mblFsRedraw 再居中。
          var sc0 = document.getElementById('tree-scroll-container');
          var rotPending = mblInFs() && sc0 && !sc0.classList.contains('mbl-fs-landscape') && window.innerWidth < window.innerHeight;
          if (!rotPending) {
            cancelMblFly();   // 锚定前再保险：残留飞入动画一律终止，防其 step 覆盖居中滚动位
            _mblFsAnchorPending = false;
            mblEnsureCardsNear(_mblFsAnchor, true);
          }
        }
        mblVizThrottled();
      }
      else if (_mblMode === 'overview') mblMapDraw();
    });
  });
}

function mblLockLandscape() {
  // 方向锁是增强能力，不是横屏显示的前置条件；锁定等待期间也必须保持 CSS 兜底。
  if (isMobileTree() && window.innerWidth <= window.innerHeight) mblForceLandscape();
  if (_mblOrientationLocked) return;
  var so = window.screen && screen.orientation;
  if (!so || !so.lock) { mblForceLandscape(); return; }   // iOS/微信内核无 API → CSS 强制横屏
  try {
    var p = so.lock('landscape');
    if (p && p.then) {
      p.then(function() {
        _mblOrientationLocked = true;
        // 若系统已经真的切到横屏，mblForceLandscape 的轮询会移除 CSS 旋转；
        // 若仍是竖屏，则继续保留兜底，避免出现“只全屏、不横屏”。
        mblFsRedraw();                                  // 旋转落定后按横屏视口重绘 canvas/卡片
      }).catch(function() { mblForceLandscape(); });    // 锁失败（部分机型/系统禁止）→ CSS 强制横屏
    } else {
      mblForceLandscape();   // 部分 webview lock() 返回 undefined（无 promise）→ 直接 CSS 强制横屏，勿静默挂起
    }
  } catch(e) { mblForceLandscape(); }
}

function mblUnlockOrientation() {
  if (!_mblOrientationLocked) return;
  _mblOrientationLocked = false;
  var so = window.screen && screen.orientation;
  if (so && so.unlock) { try { so.unlock(); } catch(e) {} }
}

/* CSS 强制横屏：screen.orientation.lock 不可用/失败时（iOS Safari、微信内核、部分安卓，
   系统自动旋转未开时物理转动也无效）用 transform:rotate(90deg) 把树横过来展示——
   不依赖系统自动旋转，任何浏览器都生效。附带「恢复竖屏」小按钮。 */
var _mblFsRotated = false;     // CSS 强制横屏是否生效
var _mblRotateNoteEl = null;   // 横屏提示条
function mblForceLandscape() {
  var sc = document.getElementById('tree-scroll-container');
  var section = document.getElementById('genealogy-tree-section');
  if (!sc || !section || _mblFsRotated) return;
  // 设备物理已是横屏（布局视口宽>高）→ 不叠加 CSS 旋转，否则 90°+90°=倒屏。
  // ★不用 matchMedia('(orientation:landscape)')：部分安卓 WebView/微信 X5 内核在竖屏时该媒体查询
  // 误报 true → 守卫直接 return，CSS 假横屏永不生效（真机「进入世系图谱仍是竖屏」的根因；按钮路径
  // 走真 screen.orientation.lock 不依赖此守卫所以有效）。innerWidth/innerHeight 布局视口比较各引擎可靠。
  if (window.innerWidth > window.innerHeight) return;
  sc.classList.add('mbl-fs-landscape');   // 旋转 scroll 容器；不能旋转 section（:fullscreen UA 压死）
  section.classList.add('mbl-fs-section-rotated');   // 弹层同方向横屏用（详情/祖先树弹层 rotate90 成横屏）
  _mblFsRotated = true;
  if (!_mblRotateNoteEl) {
    var note = document.createElement('div');
    note.id = 'mbl-rotate-note';
    // section 未被旋转，提示条直接显示为正，无需反向
    note.style.cssText = 'position:absolute;right:10px;bottom:10px;z-index:999998;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.72);color:#fff;padding:6px 10px;border-radius:8px;font-size:12px;';
    note.innerHTML = '<span>横屏显示中</span>'
      + '<button id="mbl-rotate-back" style="padding:3px 10px;border-radius:6px;border:1px solid #888;background:#2a2a2a;color:#eee;font-size:12px;cursor:pointer;">恢复竖屏</button>';
    section.appendChild(note);
    _mblRotateNoteEl = note;
    note.querySelector('#mbl-rotate-back').addEventListener('click', function(e) { e.stopPropagation(); mblUnrotate(); });
  }
  mblFsRedraw(); // 旋转后树视口由 100vw×100vh 变为 100vh×100vw → 重绘 canvas/卡片
  // 轮询：若用户随后系统真横屏（转动手机成功）→ 移除 CSS 旋转避免双重旋转倒屏。
  // 同守卫，用 innerWidth/innerHeight 而非 matchMedia orientation（WebView 竖屏误报 true 会误撤旋转）
  (function poll() {
    if (!_mblFsRotated) return;
    if (window.innerWidth > window.innerHeight) { mblUnrotate(); return; }
    setTimeout(poll, 400);
  })();
}
function mblUnrotate() {
  var sc = document.getElementById('tree-scroll-container');
  if (sc) sc.classList.remove('mbl-fs-landscape');
  var section = document.getElementById('genealogy-tree-section');
  if (section) section.classList.remove('mbl-fs-section-rotated');   // 弹层横屏旋转态同步撤销
  _mblFsRotated = false;
  if (_mblRotateNoteEl) { _mblRotateNoteEl.remove(); _mblRotateNoteEl = null; }
  if (isMobileTree()) mblFsRedraw();
}

function mblHandleFsChange() {
  if (!isMobileTree()) return;                        // 桌面端行为保持原样（红线）
  var fs = document.fullscreenElement || document.webkitFullscreenElement;
  if (fs) {
    mblLockLandscape();
    mblFsRedraw();
  } else {
    // 退出真全屏（系统手势/浏览器退出）→ 同步清理假全屏态，避免 class 残留
    var section = document.getElementById('genealogy-tree-section');
    if (section) section.classList.remove('genealogy-tree-section-fullscreen');
    document.body.style.overflow = '';
    var closeBtn = document.getElementById('fs-close-btn');
    if (closeBtn) closeBtn.style.display = 'none';
    // 同上：退出真全屏（系统手势）时尺度过低会切 canvas 全貌（蓝点）→ 恢复默认可读
    if (treeScale < 0.5) {
      treeScale = _MBL_DEFAULT_SCALE;
      applyTreeTransformSVG();
      setMblMode('readable');
    }
    mblUnlockOrientation();
    mblUnrotate();
    mblFsRedraw();
  }
}
document.addEventListener('fullscreenchange', mblHandleFsChange);
document.addEventListener('webkitfullscreenchange', mblHandleFsChange);

function toggleGenChart() {
  var el = document.getElementById('gen-chart-content');
  var icon = document.getElementById('gen-chart-toggle');
  if (el.style.display === 'none') { el.style.display = 'block'; icon.textContent = '▼'; }
  else { el.style.display = 'none'; icon.textContent = '▶'; }
}
var _gzZoom=1,_gzPanX=0,_gzPanY=0,_gzDrag=false,_gzDx=0,_gzDy=0,_gzSx=0,_gzSy=0;
function initGenealogyTreePanZoom(){
var vp=document.getElementById("gz-tree-viewport");if(!vp||vp.dataset.gzInit)return;vp.dataset.gzInit="1";
var ga=function(){var t=vp.querySelector(".apt-tree");if(!t)return;t.style.transform="translate("+_gzPanX+"px,"+_gzPanY+"px) scale("+_gzZoom+")";var e=document.getElementById("gz-zoom-level");if(e)e.textContent=Math.round(_gzZoom*100)+"%";};
vp.onwheel=function(e){e.preventDefault();var r=vp.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,f=e.deltaY<0?1.1:0.9,nz=Math.max(0.05,Math.min(10,_gzZoom*f));_gzPanX=mx-(mx-_gzPanX)*(nz/_gzZoom);_gzPanY=my-(my-_gzPanY)*(nz/_gzZoom);_gzZoom=nz;ga();};
vp.onmousedown=function(e){if(e.target.closest(".apt-zoom-btn,.apt-btn-expand,.apt-card,button"))return;_gzDrag=true;_gzDx=e.clientX;_gzDy=e.clientY;_gzSx=_gzPanX;_gzSy=_gzPanY;e.preventDefault();};
window.addEventListener("mousemove",function(e){if(!_gzDrag)return;_gzPanX=_gzSx+(e.clientX-_gzDx);_gzPanY=_gzSy+(e.clientY-_gzDy);ga();});
window.addEventListener("mouseup",function(){if(_gzDrag){_gzDrag=false;var v=document.getElementById("gz-tree-viewport");if(v)v.style.cursor="grab";}});var gzTD=0,gzTX=0,gzTY=0,gzTZ=1;vp.addEventListener("touchstart",function(e){if(e.touches.length===2){var dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;gzTD=Math.sqrt(dx*dx+dy*dy);gzTZ=_gzZoom;}else if(e.touches.length===1){gzTX=e.touches[0].clientX-_gzPanX;gzTY=e.touches[0].clientY-_gzPanY;}},{passive:true});vp.addEventListener("touchmove",function(e){if(e.touches.length===2){e.preventDefault();var dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY,nd=Math.sqrt(dx*dx+dy*dy);if(gzTD>0){_gzZoom=Math.max(0.05,Math.min(10,gzTZ*(nd/gzTD)));ga();}}else if(e.touches.length===1){_gzPanX=e.touches[0].clientX-gzTX;_gzPanY=e.touches[0].clientY-gzTY;ga();}},{passive:false});vp.addEventListener("touchend",function(){gzTD=0;});
setTimeout(function(){var t=vp.querySelector(".apt-tree");if(!t)return;var vpr=vp.getBoundingClientRect(),tr=t.getBoundingClientRect();var s=Math.min(1,Math.min(vpr.width/(tr.width||1),vpr.height/(tr.height||1))*0.8);_gzZoom=Math.max(0.05,Math.min(1,s));_gzPanX=Math.max(0,(vpr.width-tr.width*_gzZoom)/2);_gzPanY=10;ga();},500);
}
window.zoomGenealogyTree=function(factor){var vp=document.getElementById("gz-tree-viewport");if(!vp)return;var el=vp.querySelector(".apt-tree");if(!el)return;if(factor===1){_gzZoom=1;_gzPanX=0;_gzPanY=0;}else{var r=vp.getBoundingClientRect();var mx=r.width/2,my=r.height/2,nz=Math.max(0.05,Math.min(10,_gzZoom*factor));_gzPanX=mx-(mx-_gzPanX)*(nz/_gzZoom);_gzPanY=my-(my-_gzPanY)*(nz/_gzZoom);_gzZoom=nz;}el.style.transform="translate("+_gzPanX+"px,"+_gzPanY+"px) scale("+_gzZoom+")";var zl=document.getElementById("gz-zoom-level");if(zl)zl.textContent=Math.round(_gzZoom*100)+"%";};
