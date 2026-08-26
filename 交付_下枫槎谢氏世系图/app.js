(function () {
  'use strict';

  const STORAGE_KEY = 'xiafengcha_genealogy_standalone_v1';
  const BACKUP_KEY = 'xiafengcha_genealogy_backup_v1';
  const VERIFIED_KEY = 'xiafengcha_genealogy_verified_v1';
  const VERIFIED_PRESET_KEY = 'xiafengcha_genealogy_verified_preset_v1';
  const SESSION_VIEW_KEY = 'xiafengcha_genealogy_session_view_v1';
  const LAYOUT_KEY = 'xiafengcha_genealogy_layout_v1';
  const QUERY_STATE_KEY = 'xiafengcha_genealogy_query_v1';
  const IS_ADMIN = document.body.dataset.appMode === 'admin';
  const ADMIN_TOKEN_KEY = 'xie_admin_token';
  const initialData = Array.isArray(window.GENEALOGY_DATA) ? window.GENEALOGY_DATA : [];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const state = {
    data: clone(initialData),
    original: clone(initialData),
    selectedId: null,
    verified: new Set(),
    view: 'overview',
    compact: true,
    overviewMode: false,
    immersive: false,
    detailOnly: false,
    detailOrigin: null,
    // 从世系卡片进入移动端详情前保存的完整视图快照。
    // 返回世系图时必须恢复原来的树面，不能把详情用的局部窗口当成新树面。
    detailReturnSnapshot: null,
    expanded: new Set(),
    zoom: 1,
    mapPan: {
      x: 0,
      y: 0
    },
    overviewMetrics: {
      width: 0,
      height: 0
    },
    overviewCanvas: null,
    branch: '',
    generation: '',
    searchQuery: '',
    query: {
      open: false,
      mobileMode: 'people',
      keyword: '',
      genFrom: '',
      genTo: '',
      gender: '',
      alive: '',
      relationA: '',
      relationB: '',
      relationAId: null,
      relationBId: null,
      lineage7Id: null,
      lineage7Map: {
        zoom: 1,
        x: 0,
        y: 0
      }
    },
    mode: 'view',
    draftId: null,
    draftParentId: null,
    mainFocusId: null,
    // 本宗世系的移动端子入口：保留独立起点与目标支脉，避免把三条支脉混成一个本宗图。
    mainSublineage: null,
    mainLineageRootId: null,
    mainLineageTargetId: null,
    mobileFocusRootId: null,
    layout: {
      leftWidth: 230,
      detailWidth: 365,
      leftHidden: false,
      detailHidden: false,
      resizing: false,
      resizeSide: null,
      resizePointerId: null
    },
    pan: {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      dragged: false,
      suppressClick: false
    },
    branchOffsets: {
      qian: { x: 0, y: 0 },
      hou: { x: 0, y: 0 }
    },
    branchDrag: {
      active: false,
      key: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      dragged: false
    },
    adoption: {
      outById: new Map(),
      inById: new Map(),
      hiddenIds: new Set(),
      displayParentById: new Map(),
      receivingByParent: new Map()
    },
    childrenByParent: new Map(),
    personById: new Map(),
    peopleByName: new Map(),
    rawChildrenByParent: new Map(),
    dataIndexReady: false,
    sourceAuthority: 'static-fallback',
    viewIncludeCache: new Map(),
    viewIncludeCacheKey: ''
  };
  let draftAutoSaveTimer = null;
  let serverSaveTimer = null;
  let serverSaveBusy = false;
  let serverSaveQueued = false;
  let searchLocateTimer = null;
  let searchComposing = false;
  let disambiguationCallback = null;
  let fullExpandBusy = false;
  let domSelectedId = null;

  const VIEW_DEFS = {
    overview: { label: '总览世系图', rootId: 1 },
    ancient: { label: '远古世系图', rootId: 1, generations: [1, 65], branches: ['炎帝世系', '谢氏得姓', '仍姓姜'] },
    shenbo: { label: '申伯世系图', rootId: 6, generations: [65, 101], branches: ['谢氏得姓', '申伯世系', '始宁东山', '东山第一世'] },
    dongshan: { label: '始宁东山世系图', rootId: 1126, generations: [99, 122], branches: ['东山第一世', '始宁东山'] },
    linhai: { label: '临海下渡世系图', rootId: 1183, generations: [122, 130], branches: ['始宁东山', '临海下渡'] },
    shima: { label: '石马（下谢）世系图', rootId: 1206, generations: [130, 141], branches: ['临海下渡', '石马(下谢)'] },
    main: { label: '本宗世系图（下枫槎）', rootId: 10, generations: [132, 165], branches: ['枫槎始祖', '前枫槎', '后枫槎', '后枫槎东房', '后枫槎西房', '分称后东房', '分称后西房', '大房', '连溪之子', '朝乐之子', '后东房', '入继'], includeBlank: true }
  };

  const VIEW_ORDER = ['overview', 'ancient', 'shenbo', 'dongshan', 'linhai', 'shima', 'main'];

  // ID 来自族谱管理后台唯一主数据源：文杲(10)→撰(12)/攒(13)，撰(12)→文对(61)，攒(13)→乾(59)/彬(60)。
  const MAIN_SUBLINEAGES = {
    // 6-0 是文杲至文对、彬、乾的完整路径图，终点以下不再展开。
    wengao: { label: '文杲至文对/彬/乾世系图', rootId: 10, targetIds: [61, 60, 59] },
    wendui: { label: '撰公派下文对世系', rootId: 12, targetId: 61 },
    qian: { label: '攒公派下乾公世系', rootId: 13, targetId: 59 },
    bin: { label: '攒公派下彬公世系', rootId: 13, targetId: 60 }
  };

  function toId(value) {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : String(value);
  }

  function personId(person) {
    return toId(person && person.id);
  }

  function rebuildDataIndexes() {
    const personById = new Map();
    const peopleByName = new Map();
    const rawChildrenByParent = new Map();
    state.data.forEach((person) => {
      const id = personId(person);
      if (id !== null) personById.set(String(id), person);
      const name = text(person.name).trim();
      if (name) {
        if (!peopleByName.has(name)) peopleByName.set(name, []);
        peopleByName.get(name).push(person);
      }
    });
    state.data.forEach((child) => {
      const parentRefs = [child.father_id ?? child.fatherId ?? child.father, child.mother_id ?? child.motherId ?? child.mother]
        .map((value) => toId(value))
        .filter((value) => value !== null);
      new Set(parentRefs.map((value) => String(value))).forEach((parentKey) => {
        if (!rawChildrenByParent.has(parentKey)) rawChildrenByParent.set(parentKey, []);
        rawChildrenByParent.get(parentKey).push(child);
      });
    });
    rawChildrenByParent.forEach((children) => {
      children.sort((a, b) => (generationOf(a) || 9999) - (generationOf(b) || 9999) || Number(personId(a)) - Number(personId(b)));
    });
    state.personById = personById;
    state.peopleByName = peopleByName;
    state.rawChildrenByParent = rawChildrenByParent;
    state.dataIndexReady = true;
    state.viewIncludeCache.clear();
    state.viewIncludeCacheKey = '';
  }

  function getPerson(id) {
    const target = toId(id);
    const key = String(target);
    const cached = state.personById.get(key);
    if (cached) return cached;
    const fallback = state.data.find((person) => String(personId(person)) === key) || null;
    if (fallback) state.personById.set(key, fallback);
    return fallback;
  }

  function currentView() {
    return VIEW_DEFS[state.view] || VIEW_DEFS.overview;
  }

  function belongsToViewRoot(person, rootId) {
    const target = String(toId(rootId));
    const visited = new Set();
    let current = person;
    while (current && !visited.has(String(personId(current)))) {
      const key = String(personId(current));
      if (key === target) return true;
      visited.add(key);
      current = state.adoption.displayParentById.get(key) || rawFatherOf(current);
    }
    return false;
  }

  function isStrictDescendantOf(person, ancestorId) {
    const target = String(toId(ancestorId));
    const visited = new Set();
    let current = state.adoption.displayParentById.get(String(personId(person))) || rawFatherOf(person);
    while (current && !visited.has(String(personId(current)))) {
      const key = String(personId(current));
      if (key === target) return true;
      visited.add(key);
      current = state.adoption.displayParentById.get(key) || rawFatherOf(current);
    }
    return false;
  }

  function isOnPathToTarget(person, targetId) {
    const personKey = String(personId(person));
    const visited = new Set();
    let current = getPerson(targetId);
    while (current && !visited.has(String(personId(current)))) {
      const currentKey = String(personId(current));
      if (currentKey === personKey) return true;
      visited.add(currentKey);
      current = state.adoption.displayParentById.get(currentKey) || rawFatherOf(current);
    }
    return false;
  }

  function isChengzhiMainLine(person) {
    const key = String(personId(person));
    return key === '69' || isStrictDescendantOf(person, '69');
  }

  function isDaenMainLine(person) {
    const key = String(personId(person));
    return key === '146' || isStrictDescendantOf(person, '146');
  }

  const DAER_ROOT_IDS = new Set(['128', '138', '144', '145', '148', '149', '150', '151', '153']);

  function isDaerMainLine(person) {
    const key = String(personId(person));
    if (DAER_ROOT_IDS.has(key)) return true;
    return [...DAER_ROOT_IDS].some((rootId) => isStrictDescendantOf(person, rootId));
  }

  const DENG_ROOT_IDS = new Set(['135', '143', '155']);

  // 性别统计只读取 canonical 后台数据中的 gender 字段；旧版谱页推断 ID 不再覆盖主数据。

  // 这是 2026-08-23 的只读源数据对照快照。它不覆盖交付数据，
  // 只用于在查询面板中明确提示“后台旧快照”和“交付版核定数据”的差异。
  const SOURCE_AUDIT_SNAPSHOT = {
    deliveryDisk: 1254,
    backendApi: 1253,
    commonById: 1247,
    fieldDiffRecords: 101,
    fatherDiffRecords: 96,
    genderDiffRecords: 15,
    deliveryOnly: 7,
    backendOnly: 6,
    upperTerms: { out: 69, in: 64, inLaw: 3 },
    lowerTerms: { out: 37, in: 30, inLaw: 9 }
  };

  function isDengMainLine(person) {
    const key = String(personId(person));
    if (DENG_ROOT_IDS.has(key)) return true;
    return [...DENG_ROOT_IDS].some((rootId) => isStrictDescendantOf(person, rootId));
  }

  // 前枫槎子达公派下。族谱现有记录中的“大辂”“大喜”对应用户所列“大珞”“大喜欢”。
  const QIANZI_ROOT_IDS = new Set(['127', '129', '131', '134', '137', '140', '142', '152', '154', '156', '158', '159', '161', '162', '163', '164', '166', '167', '168']);

  function isQianziMainLine(person) {
    const key = String(personId(person));
    if (QIANZI_ROOT_IDS.has(key)) return true;
    return [...QIANZI_ROOT_IDS].some((rootId) => isStrictDescendantOf(person, rootId));
  }

  function isWithinMainFocus(person, focusId) {
    const focus = getPerson(focusId);
    if (!focus) return true;
    const personKey = String(personId(person));
    const focusKey = String(personId(focus));
    if (personKey === focusKey || isStrictDescendantOf(person, focusKey)) return true;
    let current = focus;
    const visited = new Set();
    while (current && !visited.has(String(personId(current)))) {
      const key = String(personId(current));
      if (key === personKey) return true;
      visited.add(key);
      current = state.adoption.displayParentById.get(key) || rawFatherOf(current);
    }
    return false;
  }

  function viewIncludes(person) {
    if (!person) return false;
    const cacheKey = `${state.view}|${state.mainFocusId || ''}|${state.mainSublineage || ''}|${state.mainLineageRootId || ''}|${state.mainLineageTargetId || ''}|${state.data.length}`;
    if (state.viewIncludeCacheKey !== cacheKey) {
      state.viewIncludeCache.clear();
      state.viewIncludeCacheKey = cacheKey;
    }
    const personKey = String(personId(person));
    if (state.viewIncludeCache.has(personKey)) return state.viewIncludeCache.get(personKey);
    const view = currentView();
    const sublineage = state.view === 'main' && state.mainSublineage
      ? MAIN_SUBLINEAGES[state.mainSublineage]
      : null;
    let included = true;
    if (state.view !== 'overview') {
      const effectiveRootId = state.view === 'main' && state.mainLineageRootId
        ? state.mainLineageRootId
        : view.rootId;
      if (personKey === String(toId(effectiveRootId))) included = true;
      else {
        const generation = generationOf(person);
        included = !(view.generations && (generation === null || generation < view.generations[0] || generation > view.generations[1]));
        if (included && state.view === 'main') {
          if (state.mainSublineage && state.mainLineageRootId) {
            const rootId = String(toId(state.mainLineageRootId));
            const targetId = state.mainLineageTargetId ? String(toId(state.mainLineageTargetId)) : '';
            const inRootBranch = personKey === rootId || isStrictDescendantOf(person, rootId);
            included = inRootBranch && (!targetId || isWithinMainFocus(person, targetId));
          } else if (state.mainFocusId) {
            included = isWithinMainFocus(person, state.mainFocusId);
          } else {
            // 本宗世系的 branch 字段并不是完整的树结构：大量真实主宗成员
            // 在管理后台中使用“—”作为暂未细分支系的占位值。不能再用
            // branch 白名单裁切本宗，否则“展开全部”只会显示很少一部分。
            // 以本宗根节点的真实父子链为准，保留所有后代及其承嗣归属。
            included = personKey === String(toId(effectiveRootId)) || isStrictDescendantOf(person, effectiveRootId);
          }
          if (included && sublineage?.targetIds) {
            included = sublineage.targetIds.some((targetId) => isOnPathToTarget(person, targetId));
          }
        }
        // 丹一一支接入枫槎始祖及前、后枫槎等支系，按真实父系回溯到小四，不能按支系名称过滤。
        if (included && state.view === 'shima') {
          if (isStrictDescendantOf(person, 10)) included = false;
          else included = belongsToViewRoot(person, view.rootId);
        }
        // 本宗世系按根节点父子链筛选；不能再用旧的 branch 白名单二次裁切。
        if (included && state.view !== 'shima' && state.view !== 'main' && view.branches) {
          const branch = text(person.branch).trim();
          included = view.branches.includes(branch) || Boolean(view.includeBlank && !branch);
        }
      }
    }
    state.viewIncludeCache.set(personKey, included);
    return included;
  }

  function isHiddenAdoptionRecord(person) {
    return Boolean(person && state.adoption.hiddenIds.has(String(personId(person))));
  }

  function treeChildren(person) {
    const personKey = String(personId(person));
    // 明土（ID 248）为出继记录；保留本人，但不在其下展开后代。
    if (personKey === '248') return [];
    // 昌谊名下的入继水财是这条支系的唯一展示节点，固定承接世和、世安。
    // 即使旧本地数据仍把世安/世和留在亲生记录下，也要在树上显示为水财的子女。
    if (personKey === '502') {
      const waterCaiChildren = [592, 600].map((id) => getPerson(id)).filter(Boolean);
      if (waterCaiChildren.length) return waterCaiChildren.filter(viewIncludes);
    }
    // 昌木（东水公之子，ID 424）明确有两个儿子：绍根、绍富。
    // 固定展示这两个孩子，避免旧本地树索引只留下绍根。
    if (personKey === '424') {
      const changMuChildren = [544, 529].map((id) => getPerson(id)).filter(Boolean);
      if (changMuChildren.length) return changMuChildren;
    }
    // 明旺（ID 264）明确有一子复生；即使旧缓存的子女索引未及时更新，也固定显示该卡片。
    if (personKey === '264') {
      const fuSheng = getPerson(1272);
      const otherChildren = displayChildrenOf(person).filter((child) => String(personId(child)) !== '1272');
      if (fuSheng) return [fuSheng, ...otherChildren].filter(viewIncludes);
    }
    // 用户最新核对确认：行安（ID 879）只有一个儿子孝通；不能再把重复的开通卡挂到行安下面。
    if (personKey === '879') {
      const xiaoTong = getPerson(1284);
      if (xiaoTong) return [xiaoTong].filter(viewIncludes);
    }
    return displayChildrenOf(person).filter(viewIncludes);
  }

  function text(value) {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join('、');
    if (typeof value === 'object') return Object.values(value).join('、');
    return String(value);
  }

  const ERA_YEAR_RANGES = {
    宣和: [1119, 1125], 建文: [1399, 1402], 正德: [1506, 1521], 隆庆: [1567, 1572],
    万历: [1573, 1620], 泰昌: [1620, 1620], 天启: [1621, 1627], 崇祯: [1628, 1644],
    顺治: [1644, 1661], 康熙: [1662, 1722], 雍正: [1723, 1735], 乾隆: [1736, 1795],
    嘉庆: [1796, 1820], 道光: [1821, 1850], 咸丰: [1851, 1861], 同治: [1862, 1874],
    光绪: [1875, 1908], 宣统: [1909, 1911]
  };
  const ERA_NAMES = Object.keys(ERA_YEAR_RANGES).join('|');
  const HEAVENLY_STEMS = '甲乙丙丁戊己庚辛壬癸';
  const EARTHLY_BRANCHES = '子丑寅卯辰巳午未申酉戌亥';

  function chineseYearNumber(value) {
    const source = text(value).trim();
    if (source === '元') return 1;
    const digit = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
    if (/^廿[一二三四五六七八九]?$/.test(source)) return 20 + (digit[source[1]] || 0);
    if (/^卅[一二三四五六七八九]?$/.test(source)) return 30 + (digit[source[1]] || 0);
    if (/^十[一二三四五六七八九]?$/.test(source)) return 10 + (digit[source[1]] || 0);
    if (/^[一二三四五六七八九]十[一二三四五六七八九]?$/.test(source)) return digit[source[0]] * 10 + (digit[source[2]] || 0);
    if (/^[一二三四五六七八九]$/.test(source)) return digit[source];
    return null;
  }

  function ganzhiOfYear(year) {
    const index = ((Number(year) - 4) % 60 + 60) % 60;
    return `${HEAVENLY_STEMS[index % 10]}${EARTHLY_BRANCHES[index % 12]}`;
  }

  function annotateGregorianYears(value) {
    let result = text(value).trim();
    if (!result) return result;
    const numericEraPattern = new RegExp(`(${ERA_NAMES})(元|[一二三四五六七八九十廿卅]{1,4})年(?!（公元)`, 'g');
    result = result.replace(numericEraPattern, (original, era, eraYearText) => {
      const eraYear = chineseYearNumber(eraYearText);
      const range = ERA_YEAR_RANGES[era];
      if (!eraYear || !range) return original;
      const gregorian = range[0] + eraYear - 1;
      return gregorian <= range[1] ? `${original}（公元${gregorian}年）` : original;
    });
    const ganzhiEraPattern = new RegExp(`(${ERA_NAMES})([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])年(?!（公元)`, 'g');
    result = result.replace(ganzhiEraPattern, (original, era, ganzhi) => {
      const range = ERA_YEAR_RANGES[era];
      if (!range) return original;
      const matches = [];
      for (let year = range[0]; year <= range[1]; year += 1) if (ganzhiOfYear(year) === ganzhi) matches.push(year);
      return matches.length === 1 ? `${original}（公元${matches[0]}年）` : original;
    });
    const chineseDigits = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 〇: '0', 零: '0', '○': '0' };
    result = result.replace(/([一二][一二三四五六七八九〇零○]{3})年(?!（公元)/g, (original, yearText) => {
      const year = Number(Array.from(yearText).map((char) => chineseDigits[char]).join(''));
      return year >= 1000 && year <= 2099 ? `${original}（公元${year}年）` : original;
    });
    return result;
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function numberValue(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function generationOf(person) {
    return numberValue(person && (person.generation_num ?? person.generation));
  }

  function genderOf(person) {
    if (!person) return '';
    const value = text(person.gender).trim();
    return value === '男' || value === '女' ? value : '';
  }

  function genderLabel(person) {
    return genderOf(person) || '未知';
  }

  function viewGenerationText(globalGeneration) {
    if (globalGeneration === null || globalGeneration === undefined) return '世次未详';
    const localViews = { shenbo: ['申伯', 64], dongshan: ['东山', 99], linhai: ['下渡', 121], shima: ['石马', 129] };
    if (state.view === 'dongshan' && globalGeneration >= 99) return `炎帝${globalGeneration}世/申伯${globalGeneration - 64}世/始宁东山${globalGeneration - 98}世`;
    if (state.view === 'shenbo' && globalGeneration >= 65) return `炎帝${globalGeneration}世/申伯${globalGeneration - 64}世`;
    if (state.view === 'linhai' && globalGeneration >= 122) return `炎帝${globalGeneration}世/申伯${globalGeneration - 64}世/始宁东山${globalGeneration - 98}世/临海下渡${globalGeneration - 121}世`;
    if (state.view === 'shima' && globalGeneration >= 130) return `炎帝${globalGeneration}世/申伯${globalGeneration - 64}世/始宁东山${globalGeneration - 98}世/临海下渡${globalGeneration - 121}世/石门下谢${globalGeneration - 129}世`;
    if (state.view === 'main' && globalGeneration >= 132) return `炎帝${globalGeneration}世/申伯${globalGeneration - 64}世/始宁东山${globalGeneration - 98}世/临海下渡${globalGeneration - 121}世/石门下谢${globalGeneration - 129}世/枫槎${globalGeneration - 131}世`;
    const local = localViews[state.view];
    if (local && globalGeneration >= local[1] + 1) return `${local[0]}第${globalGeneration - local[1]}世`;
    return `第${globalGeneration}世`;
  }

  function viewGenerationLabel(person) {
    return viewGenerationText(generationOf(person));
  }

  function childrenOf(person) {
    if (!person) return [];
    const id = personId(person);
    if (state.dataIndexReady) return state.rawChildrenByParent.get(String(id)) || [];
    return state.data.filter((child) => {
      const father = child.father_id ?? child.fatherId;
      const mother = child.mother_id ?? child.motherId;
      return String(toId(father)) === String(id) || String(toId(mother)) === String(id);
    }).sort((a, b) => (generationOf(a) || 9999) - (generationOf(b) || 9999) || Number(personId(a)) - Number(personId(b)));
  }

  function rawFatherOf(person) {
    return resolveRef(person && (person.father_id ?? person.fatherId ?? person.father));
  }

  function adoptionText(person) {
    if (!person) return '';
    return [person.biography, person.adopt_note, person.notes].map(text).filter(Boolean).join(' ');
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function mentionsAdoption(parent, child, type) {
    if (!parent || !child || !text(child.name).trim()) return false;
    const source = adoptionText(parent);
    const keyword = type === 'out' ? '(?:出继|出祧|出嗣)' : '(?:入继|入祧|继子|祀子)';
    const names = Array.from(new Set(childrenOf(parent).map((item) => text(item.name).trim()).filter(Boolean)))
      .sort((a, b) => b.length - a.length);
    const target = text(child.name).trim();
    const nearest = (segment, direction) => {
      const hits = names.map((name) => ({ name, index: direction === 'before' ? segment.lastIndexOf(name) : segment.indexOf(name) }))
        .filter((item) => item.index >= 0)
        .sort((a, b) => direction === 'before' ? b.index - a.index : a.index - b.index);
      return hits[0] && hits[0].name;
    };
    const matcher = new RegExp(keyword, 'g');
    let match;
    while ((match = matcher.exec(source))) {
      const before = source.slice(Math.max(0, match.index - 28), match.index);
      const afterStart = match.index + match[0].length;
      const after = source.slice(afterStart, afterStart + 28);
      const beforeName = nearest(before, 'before');
      // 族谱常见语序是“某子出继 / 某子入继”，先以关键词前最近的子名为准。
      // 只有关键词前完全没有子名时，才兼容“入继某人”的反向语序。
      if (beforeName) {
        if (beforeName === target) return true;
        continue;
      }
      if (nearest(after, 'after') === target) return true;
    }
    return false;
  }

  function recordHasAdoption(person, type) {
    const source = adoptionText(person);
    if (type === 'out') return /出继|出祧|出嗣/.test(source);
    return /入继|入祧|继子/.test(source) || text(person && person.branch).trim() === '入继';
  }

  function recordHasCollateral(person) {
    return /兼祧|兼顶|祀子/.test(adoptionText(person));
  }

  function findNamedAdoptiveParent(source, child, excludeIds) {
    const excluded = new Set((excludeIds || []).map((id) => String(toId(id))));
    const tail = String(source || '').split(/出继|出祧|出嗣|入继|入祧/).slice(1).join(' ');
    if (!tail) return null;
    return state.data
      .filter((candidate) => candidate && text(candidate.name).trim() && !excluded.has(String(personId(candidate))))
      .sort((a, b) => text(b.name).trim().length - text(a.name).trim().length)
      .find((candidate) => tail.includes(text(candidate.name).trim())) || null;
  }

  function buildAdoptionIndex() {
    // 所有父子查询先走内存索引；编辑、导入、修正关系后会在这里重新建立一次。
    rebuildDataIndexes();
    const index = {
      outById: new Map(),
      inById: new Map(),
      hiddenIds: new Set(),
      displayParentById: new Map(),
      receivingByParent: new Map()
    };
    const groups = new Map();
    state.data.forEach((person) => {
      const name = text(person.name).trim();
      const generation = generationOf(person);
      if (!name || generation === null) return;
      const key = `${name}|${generation}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(person);
    });

    const register = (outPerson, adoptiveRecord, adoptiveParent, source, keepAdoptiveRecord = false) => {
      if (!outPerson || !adoptiveParent) return;
      const biologicalParent = rawFatherOf(outPerson);
      if (!biologicalParent || String(personId(biologicalParent)) === String(personId(adoptiveParent))) return;
      const relation = {
        outPerson,
        biologicalParent,
        adoptiveParent,
        adoptiveRecord: adoptiveRecord || null,
        source: source || adoptionText(outPerson) || adoptionText(biologicalParent)
      };
      index.outById.set(String(personId(outPerson)), relation);
      if (adoptiveRecord && String(personId(adoptiveRecord)) !== String(personId(outPerson))) {
        index.inById.set(String(personId(adoptiveRecord)), relation);
      }
      if (!keepAdoptiveRecord && adoptiveRecord && String(personId(adoptiveRecord)) !== String(personId(outPerson))) {
        index.hiddenIds.add(String(personId(adoptiveRecord)));
      }
      const receivingKey = String(personId(adoptiveParent));
      if (!index.receivingByParent.has(receivingKey)) index.receivingByParent.set(receivingKey, []);
      index.receivingByParent.get(receivingKey).push(relation);

      const recordsToMove = [outPerson, adoptiveRecord].filter(Boolean);
      recordsToMove.forEach((record) => {
        childrenOf(record).forEach((child) => {
          if (String(personId(child)) === String(personId(outPerson))) return;
          // 出继人的后代接到“入继本人”卡片下面，不能与入继本人并列挂在承嗣父名下。
          // 例如：序线 → 善美（入继） → 道贤（入继）。
          index.displayParentById.set(String(personId(child)), personId(adoptiveRecord || adoptiveParent));
        });
      });
    };

    // PDF 中这些记录是“亲生记录 + 入继记录”的明确写法：
    // 寅卿、大顺、大文三组两张卡片都保留；大文的后代归入“云美名下的大文入继记录”。
    // 分别在亲生父亲和入继父亲名下标注“出继 / 入继”，同时保持后代链条连续。
    // 若交给通用推断，父亲条目里的“某子出继”会把两张记录的方向判断反。
    const explicitAdoptionGroups = new Set();
    const registerExplicitPair = (outId, adoptiveId, adoptiveParentId, source, keepAdoptiveRecord = false) => {
      const outPerson = getPerson(outId);
      const adoptiveRecord = getPerson(adoptiveId);
      const adoptiveParent = getPerson(adoptiveParentId);
      if (!outPerson || !adoptiveRecord || !adoptiveParent) return;
      explicitAdoptionGroups.add(`${text(outPerson.name).trim()}|${generationOf(outPerson)}`);
      register(outPerson, adoptiveRecord, adoptiveParent, source, keepAdoptiveRecord);
    };
    registerExplicitPair(100, 101, 88, '延省之子寅卿，出继给延荐为嗣', true);
    registerExplicitPair(169, 170, 107, '大顺由云良房出继，入继云奇为嗣', true);
    registerExplicitPair(248, 249, 211, '锡高公之子明土，出继锡疏公为嗣', true);
    // 大文的入继记录必须保留在云美名下；锡昂是大文之子，不能直接跳挂到云美。
    registerExplicitPair(150, 151, 113, '大文由云良房出继，入继云美为嗣', true);
    // 善富的亲生记录在序赖名下，入继记录在序松名下；两张同名卡片都保留。
    registerExplicitPair(1260, 728, 671, '序赖之子善富，出继给序松为嗣', true);
    // 世缎由令华出继给令水，保留亲生 / 入继两张同名记录，后代归入令水支系。
    registerExplicitPair(677, 678, 484, '世缎由令华出继，入继令水为嗣', true);
    // 绍尧长子世墙入继绍辉；绍岳次子世彬入继绍印；两组都保留亲生记录与入继记录。
    registerExplicitPair(598, 597, 573, '绍尧之子世墙，入继绍辉为嗣', true);
    registerExplicitPair(607, 606, 518, '绍岳之子世彬，出继绍印为嗣', true);
    // 序绸之子善美出继序线；绍尧之子世铨出继绍虞。
    registerExplicitPair(731, 732, 675, '序绸之子善美，入继序线为嗣', true);
    registerExplicitPair(653, 652, 568, '绍尧之子世铨，出继绍虞为嗣', true);
    // 下册逐页核对出的其他出继 / 入继双记录。
    registerExplicitPair(478, 479, 456, '昌立之子丙进，出祧昌道为嗣', true);
    registerExplicitPair(488, 489, 411, '昌有之子仲才，出继昌庆为嗣', true);
    registerExplicitPair(505, 506, 1263, '昌申之子绍乡，出继昌鳌为嗣', true);
    registerExplicitPair(549, 548, 421, '昌宗之子绍椿，入继昌时为嗣', true);
    registerExplicitPair(627, 626, 548, '绍则之子世炉，出继绍椿为嗣', true);
    registerExplicitPair(604, 603, 569, '绍进之子世常，出继绍让为嗣', true);
    registerExplicitPair(741, 742, 664, '谢平之女宁涵，入继华标为嗣', true);
    registerExplicitPair(760, 759, 654, '世麓之子德崇，出继世锈为嗣', true);
    registerExplicitPair(921, 922, 732, '善尊之子道贤，出继善美为嗣', true);
    registerExplicitPair(501, 502, 449, '昌发之子水财，出继昌谊为嗣', true);
    // 水财有亲生 / 入继两张同名卡片；世安、世和统一显示在入继水财卡片下，避免分散或找不到。
    const shuiCaiDisplayRecord = getPerson(502) || getPerson(501);
    if (shuiCaiDisplayRecord && text(shuiCaiDisplayRecord.name).trim() === '水财') {
      [592, 600].forEach((childId) => {
        const child = getPerson(childId);
        if (child && ['世和', '世安'].includes(text(child.name).trim())) {
          index.displayParentById.set(String(childId), personId(shuiCaiDisplayRecord));
        }
      });
    }
    registerExplicitPair(673, 674, 481, '绍基之子世禄，出继绍享为嗣', true);
    // 上册第101页：明才、学护各保留亲生记录与入继记录；补齐两张亲生侧出继卡，
    // 使“明才（出继）→明才（入继）”和“学护（出继）→学护（入继）”都能闭合统计。
    registerExplicitPair(260, 261, 230, '锡铨之子明才，出继锡龄为嗣', true);
    registerExplicitPair(333, 332, 261, '明秀之子学护，出继明才为嗣', true);
    // 善鸿是序缎之子：序缎的入继记录仍显示在令水名下，但善鸿应接在入继序缎卡片之后，不能直接跳到令水下面。
    const adoptedXuDuanRecord = getPerson(678);
    if (adoptedXuDuanRecord && text(adoptedXuDuanRecord.name).trim() === '序缎') {
      [getPerson(677), adoptedXuDuanRecord].filter(Boolean).forEach((record) => {
        childrenOf(record).forEach((child) => {
          index.displayParentById.set(String(personId(child)), personId(adoptedXuDuanRecord));
        });
      });
    }
    const adoptedDaWenRecord = getPerson(151);
    if (adoptedDaWenRecord && text(adoptedDaWenRecord.name).trim() === '大文') {
      [getPerson(150), adoptedDaWenRecord].filter(Boolean).forEach((record) => {
        childrenOf(record).forEach((child) => {
          index.displayParentById.set(String(personId(child)), personId(adoptedDaWenRecord));
        });
      });
    }
    // 锡森是大顺的儿子，显示在云奇名下的大顺记录（ID 170）下面，而不是直接显示在云奇下面。
    const bigShunRecord = getPerson(170);
    if (bigShunRecord && text(bigShunRecord.name).trim() === '大顺') {
      [getPerson(169), bigShunRecord].filter(Boolean).forEach((record) => {
        childrenOf(record).forEach((child) => {
          index.displayParentById.set(String(personId(child)), personId(bigShunRecord));
        });
      });
    }
    // 对所有已明确的“亲生记录—入继记录”统一处理后代落点：亲生卡保留在生父支系，
    // 但其后代在树上接到入继卡片下，避免出现生父—入继本人—后代断链或跳代。
    [
      [501, 502], [549, 548], [598, 597], [607, 606],
      [731, 732], [653, 652], [478, 479], [488, 489],
      [505, 506], [760, 759], [921, 922]
    ].forEach(([outId, adoptiveId]) => {
      const outRecord = getPerson(outId);
      const adoptiveRecord = getPerson(adoptiveId);
      if (!outRecord || !adoptiveRecord) return;
      childrenOf(outRecord).forEach((child) => {
        if (String(personId(child)) === String(personId(adoptiveRecord))) return;
        index.displayParentById.set(String(personId(child)), personId(adoptiveRecord));
      });
    });

    groups.forEach((records, groupKey) => {
      if (explicitAdoptionGroups.has(groupKey)) return;
      const outRecord = records.find((record) => mentionsAdoption(rawFatherOf(record), record, 'out'))
        || (records.length === 1 ? records.find((record) => recordHasAdoption(record, 'out') && !childrenOf(record).length && !mentionsAdoption(rawFatherOf(record), record, 'in')) : null);
      if (!outRecord) return;
      const biologicalParent = rawFatherOf(outRecord);
      let adoptiveRecord = records.find((record) => String(personId(record)) !== String(personId(outRecord)) && mentionsAdoption(rawFatherOf(record), record, 'in'));
      if (!adoptiveRecord) adoptiveRecord = records.find((record) => String(personId(record)) !== String(personId(outRecord)));
      let adoptiveParent = rawFatherOf(adoptiveRecord);
      const source = [adoptionText(biologicalParent), adoptionText(outRecord), adoptionText(adoptiveRecord)].filter(Boolean).join(' ');
      if (!adoptiveParent) adoptiveParent = findNamedAdoptiveParent(source, outRecord, [personId(outRecord), personId(biologicalParent)]);
      register(outRecord, adoptiveRecord, adoptiveParent, source);
    });

    state.data.forEach((person) => {
      const key = String(personId(person));
      if (index.outById.has(key) || index.hiddenIds.has(key)) return;
      if (!recordHasAdoption(person, 'out')) return;
      // 多数族谱条目是在父亲条目里记载“某子出继”，不能把这位父亲误判成出继本人。
      // 有子女的条目优先按“子女出继”处理；真正的单人出继条目再走文本解析。
      if (childrenOf(person).length) return;
      const parent = rawFatherOf(person);
      const source = adoptionText(person);
      const adoptiveParent = findNamedAdoptiveParent(source, person, [personId(person), personId(parent)]);
      if (adoptiveParent) register(person, null, adoptiveParent, source);
    });
    state.adoption = index;
    rebuildChildrenIndex();
  }

  function rebuildChildrenIndex() {
    const index = new Map();
    const addChild = (parentRef, child) => {
      if (parentRef === null || parentRef === undefined || parentRef === '') return;
      const parentKey = String(toId(parentRef));
      if (!index.has(parentKey)) index.set(parentKey, []);
      index.get(parentKey).push(child);
    };
    state.data.forEach((child) => {
      const childKey = String(personId(child));
      if (state.adoption.hiddenIds.has(childKey)) return;
      const mappedParent = state.adoption.displayParentById.get(childKey);
      if (mappedParent !== undefined) {
        addChild(mappedParent, child);
        return;
      }
      const father = child.father_id ?? child.fatherId ?? child.father;
      const mother = child.mother_id ?? child.motherId ?? child.mother;
      new Set([father, mother].filter((parentRef) => parentRef !== null && parentRef !== undefined && parentRef !== ''))
        .forEach((parentRef) => addChild(parentRef, child));
    });
    index.forEach((children) => children.sort((a, b) => (generationOf(a) || 9999) - (generationOf(b) || 9999) || Number(personId(a)) - Number(personId(b))));
    state.childrenByParent = index;
  }

  function displayChildrenOf(person) {
    if (!person) return [];
    return state.childrenByParent.get(String(personId(person))) || [];
  }

  function adoptionRelation(person) {
    if (!person) return null;
    return state.adoption.outById.get(String(personId(person))) || null;
  }

  function adoptionTags(person) {
    if (!person) return [];
    const tags = [];
    const manualStatus = text(person.adoption_status).trim();
    const directAdoptionNote = text(person.adopt_note).trim();
    const directOut = /出继|出祧|出嗣/.test(directAdoptionNote);
    const directIn = /入继|入祧|继子/.test(directAdoptionNote);
    // 只给实际的出继人 / 入继记录打标；亲生父亲、入继父亲只在详情关系区说明，卡片不打标。
    const relation = adoptionRelation(person);
    const receivingRelation = state.adoption.inById.get(String(personId(person))) || null;
    // 详情编辑中的明确标记优先于自动推断，适合逐张核对时直接修正卡片显示。
    if (manualStatus === 'out') {
      tags.push({ label: '出继', className: 'adoption-out' });
    } else if (manualStatus === 'in') {
      tags.push({ label: '入继', className: 'adoption-in' });
    } else if (directOut) {
      tags.push({ label: '出继', className: 'adoption-out' });
    } else if (directIn) {
      tags.push({ label: '入继', className: 'adoption-in' });
    } else if (relation) {
      tags.push({ label: '出继', className: 'adoption-out' });
    } else if (receivingRelation) {
      tags.push({ label: '入继', className: 'adoption-in' });
    }
    if (manualStatus === 'collateral' || recordHasCollateral(person)) tags.push({ label: '兼祧', className: 'adoption-collateral' });
    return tags;
  }

  function adoptionBadgeHtml(person) {
    return adoptionTags(person).length
      ? `<span class="card-tags">${adoptionTags(person).map((tag) => `<span class="adoption-badge ${tag.className}">${escapeHtml(tag.label)}</span>`).join('')}</span>`
      : '';
  }

  // 亲生记录与入继记录可能同名。出继卡片本身不再重复挂后代，
  // 但必须明确告诉核对者：后代应该到哪一张“入继卡”下面查看。
  function cardRouteHtml(person) {
    if (!person) return '';
    const personKey = String(personId(person));
    const outRelation = state.adoption.outById.get(personKey) || null;
    if (outRelation) {
      const target = outRelation.adoptiveRecord || outRelation.adoptiveParent;
      if (target) {
        const targetId = personId(target);
        const targetName = text(target.name).trim() || '承嗣父';
        const targetLabel = outRelation.adoptiveRecord ? `${targetName}（入继卡）` : `${targetName}名下`;
        return `<span class="card-route card-route-out card-route-link" data-action="select-person" data-id="${escapeHtml(targetId)}" role="link" tabindex="0" title="点击定位到后代归属卡片">后代归入：${escapeHtml(targetLabel)} ↗</span>`;
      }
    }
    const inRelation = state.adoption.inById.get(personKey) || null;
    if (inRelation) {
      const childNames = displayChildrenOf(person).map((child) => text(child.name).trim()).filter(Boolean);
      const preview = childNames.length ? `${childNames.slice(0, 2).join('、')}${childNames.length > 2 ? '等' : ''}` : '后代';
      return `<span class="card-route card-route-in" title="出继记录及其后代统一归入此入继卡片">入继卡：${escapeHtml(preview)}在此展开</span>`;
    }
    return '';
  }

  function waterCaiChildrenToggleHtml(person) {
    if (String(personId(person)) !== '502') return '';
    const children = treeChildren(person);
    if (!children.length) return '';
    const expanded = state.expanded.has('502');
    return `<span class="card-child-trigger" data-action="toggle-node" data-id="502" role="button" tabindex="0" title="展开或收起世和、世安">${expanded ? '−' : '＋'}${children.length}子女</span>`;
  }

  function openWaterCaiTree() {
    const waterCai = getPerson(502) || state.data.find((person) => text(person.name).trim() === '水财');
    if (!waterCai) return;
    state.selectedId = personId(waterCai);
    state.mode = 'view';
    setAncestorsExpanded(waterCai);
    state.expanded.add(String(personId(waterCai)));
    renderTree();
    renderDetail();
    updateSelectedCardUI();
    const card = document.querySelector(`.person-card[data-id="${CSS.escape(String(personId(waterCai)))}"]`);
    if (card) card.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    showToast('已展开：昌谊 → 水财 → 世安、世和');
  }

  function resolveRef(value) {
    if (value === null || value === undefined || value === '') return null;
    const asId = getPerson(value);
    if (asId) return asId;
    const raw = text(value).trim();
    if (!raw) return null;
    const named = state.peopleByName.get(raw);
    return (named && named[0]) || state.data.find((person) => text(person.name).trim() === raw) || null;
  }

  function resolveRefs(value) {
    if (Array.isArray(value)) return value.map(resolveRef).filter(Boolean);
    return text(value)
      .split(/[、，,;；\s]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map(resolveRef)
      .filter(Boolean);
  }

  function spousesOf(person) {
    if (!person) return [];
    const values = person.spouse_ids ?? person.spouseIds ?? person.spouses ?? '';
    return resolveRefs(values);
  }

  function parentsOf(person) {
    if (!person) return [];
    const result = [];
    const father = resolveRef(person.father_id ?? person.fatherId ?? person.father);
    const mother = resolveRef(person.mother_id ?? person.motherId ?? person.mother);
    if (father) result.push(father);
    if (mother && !result.some((item) => String(personId(item)) === String(personId(mother)))) result.push(mother);
    return result;
  }

  function ancestorsOf(person) {
    const result = [];
    const visited = new Set();
    let current = person;
    while (current && !visited.has(String(personId(current)))) {
      visited.add(String(personId(current)));
      result.unshift(current);
      current = parentsOf(current)[0] || null;
    }
    return result;
  }

  function descendantCount(id, visited, memo) {
    const seen = visited || new Set();
    const key = String(toId(id));
    if (memo && memo.has(key)) return memo.get(key);
    if (seen.has(key)) return 0;
    seen.add(key);
    const person = getPerson(id);
    if (!person) return 0;
    const result = treeChildren(person).reduce((sum, child) => sum + 1 + descendantCount(personId(child), new Set(seen), memo), 0);
    if (memo) memo.set(key, result);
    return result;
  }

  function branchClass(branch) {
    const value = text(branch);
    if (/远古|炎帝|申伯|东山|临海|石马/.test(value)) return 'branch-ancient';
    if (/枫槎|前枫槎|后枫槎|本宗/.test(value)) return 'branch-modern';
    return 'branch-branch';
  }

  function matchesSearch(person) {
    const query = state.searchQuery.trim().toLowerCase();
    if (!query) return false;
    const haystack = [
      person.name, person.branch, person.biography, person.generation,
      person.courtesy_name, person.title, person.native_place, person.notes
    ].map(text).join(' ').toLowerCase();
    return haystack.includes(query);
  }

  function matchesFilters(person) {
    const branchMatch = !state.branch || text(person.branch) === state.branch;
    const generationMatch = !state.generation || String(generationOf(person) ?? text(person.generation)) === String(state.generation);
    return branchMatch && generationMatch;
  }

  function hasActiveFilter() {
    return Boolean(state.branch || state.generation);
  }

  function hasVisibleDescendant(person, memo) {
    if (!hasActiveFilter()) return true;
    const key = String(personId(person));
    if (memo.has(key)) return memo.get(key);
    const value = treeChildren(person).some((child) => matchesFilters(child) || hasVisibleDescendant(child, memo));
    memo.set(key, value);
    return value;
  }

  function visibleChildren(person, memo) {
    const children = treeChildren(person);
    if (!hasActiveFilter()) return children;
    return children.filter((child) => matchesFilters(child) || hasVisibleDescendant(child, memo));
  }

  function findRoot() {
    const rootId = state.view === 'main' && state.mainLineageRootId ? state.mainLineageRootId : currentView().rootId;
    const viewRoot = getPerson(rootId);
    return viewRoot || getPerson(1) || state.data.find((person) => !resolveRef(person.father_id ?? person.fatherId ?? person.father)) || state.data[0] || null;
  }

  function seedMainExpansion() {
    state.overviewMode = false;
    state.expanded = new Set();
    let current = findRoot();
    const visited = new Set();
    while (current && !visited.has(String(personId(current)))) {
      const key = String(personId(current));
      visited.add(key);
      state.expanded.add(key);
      const children = treeChildren(current);
      if (children.length !== 1) break;
      current = children[0];
    }
  }

  function buildFilters() {
    const branchSelect = $('#branch-filter');
    const generationSelect = $('#generation-filter');
    if (!branchSelect || !generationSelect) return;
    const viewPeople = state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person));
    const branches = Array.from(new Set(viewPeople.map((person) => text(person.branch).trim()).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, 'zh-CN'));
    const generations = Array.from(new Set(viewPeople.map(generationOf).filter((value) => value !== null)))
      .sort((a, b) => a - b);
    branchSelect.innerHTML = '<option value="">全部支系</option>' + branches.map((branch) => `<option value="${escapeHtml(branch)}">${escapeHtml(branch)}</option>`).join('');
    generationSelect.innerHTML = '<option value="">全部世代</option>' + generations.map((generation) => `<option value="${generation}">${escapeHtml(viewGenerationText(generation))}</option>`).join('');
    branchSelect.value = state.branch;
    generationSelect.value = state.generation;
  }

  function setAncestorsExpanded(person) {
    const visited = new Set();
    let current = person;
    while (current && !visited.has(String(personId(current)))) {
      const key = String(personId(current));
      visited.add(key);
      state.expanded.add(key);
      // 搜索 / 点击入继后代时，沿世系图的展示父系回溯，不能回到亲生记录导致卡片断在半路。
      const displayParentId = state.adoption.displayParentById.get(key);
      current = displayParentId ? getPerson(displayParentId) : parentsOf(current)[0] || null;
    }
  }

  function expandSublineagePaths(sublineage) {
    if (!sublineage) return false;
    const targetIds = Array.isArray(sublineage.targetIds)
      ? sublineage.targetIds
      : sublineage.targetId !== undefined && sublineage.targetId !== null
        ? [sublineage.targetId]
        : [];
    const targets = targetIds.map((id) => getPerson(id)).filter(Boolean);
    if (!targets.length) return false;
    state.expanded.clear();
    targets.forEach((target) => setAncestorsExpanded(target));
    return true;
  }

  function renderViewTabs() {
    const container = $('#view-tabs');
    if (!container) return;
    container.innerHTML = VIEW_ORDER.map((key) => {
      const view = VIEW_DEFS[key];
      const active = key === state.view;
      return `<button class="view-tab${active ? ' is-active' : ''}" role="tab" aria-selected="${active}" data-action="switch-view" data-view="${key}">${escapeHtml(view.label)}</button>`;
    }).join('');
    const title = $('#tree-title');
    if (title) title.textContent = state.mainSublineage ? MAIN_SUBLINEAGES[state.mainSublineage]?.label || currentView().label : currentView().label;
  }

  function renderMainBranchNav() {
    const container = $('#main-branch-nav');
    if (!container) return;
    if (state.view !== 'main') {
      container.hidden = true;
      container.innerHTML = '';
      return;
    }
    const options = [
      { id: '', label: '全本宗', className: '' },
      { id: 12, label: '撰 · 前枫槎', className: 'nav-qian' },
      { id: 13, label: '攒 · 后枫槎', className: 'nav-hou' },
      { id: 60, label: '后枫槎东房', className: '' },
      { id: 59, label: '后枫槎西房', className: '' }
    ];
    container.hidden = false;
    const branchHref = (id) => id ? `?view=main&focus=${encodeURIComponent(id)}` : '?view=main';
    container.innerHTML = `<span class="main-branch-title">本宗快速查看</span>${options.map((option) => `<a class="main-branch-btn ${option.className}${String(state.mainFocusId || '') === String(option.id) ? ' is-active' : ''}" href="${branchHref(option.id)}" aria-current="${String(state.mainFocusId || '') === String(option.id) ? 'page' : 'false'}">${escapeHtml(option.label)}</a>`).join('')}<span class="main-branch-divider"></span><span class="main-branch-title">渐进展开</span><a class="main-branch-btn" href="?view=main&depth=1">1代</a><a class="main-branch-btn" href="?view=main&depth=3">3代</a><a class="main-branch-btn" href="?view=main&depth=5">5代</a><a class="main-branch-btn main-branch-all" href="?view=main&safe=1" title="人物较多时采用安全分级展开，避免页面卡顿">安全展开</a>`;
  }

  function readMainRoute() {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get('view');
    const focusId = params.get('focus');
    const depth = Number(params.get('depth'));
    const rootSearch = text(params.get('rootSearch')).trim();
    const sublineage = MAIN_SUBLINEAGES[params.get('sublineage')] ? params.get('sublineage') : null;
    const lineageRootId = sublineage ? personId(getPerson(params.get('lineageRoot'))) : null;
    const lineageTargetId = sublineage ? personId(getPerson(params.get('lineageTarget'))) : null;
    return {
      view: VIEW_DEFS[requestedView] ? requestedView : null,
      focusId: focusId ? personId(getPerson(focusId)) : null,
      sublineage,
      lineageRootId,
      lineageTargetId,
      depth: [1, 3, 5].includes(depth) ? depth : null,
      safe: params.get('safe') === '1',
      rootSearch
    };
  }

  function prepareDepthExpansion(depth) {
    state.overviewMode = false;
    state.expanded.clear();
    const root = findRoot();
    const baseGeneration = generationOf(root);
    state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person)).forEach((person) => {
      const generation = generationOf(person);
      if (generation !== null && baseGeneration !== null && generation - baseGeneration < Number(depth) && treeChildren(person).length) state.expanded.add(String(personId(person)));
    });
    if (root) state.expanded.add(String(personId(root)));
    const focus = getPerson(state.mainFocusId);
    if (focus) setAncestorsExpanded(focus);
  }

  function prepareSafeExpansion() {
    state.overviewMode = false;
    state.compact = true;
    const people = state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person));
    const root = findRoot();
    const baseGeneration = generationOf(root);
    state.expanded.clear();
    people.forEach((person) => {
      const generation = generationOf(person);
      if (generation !== null && baseGeneration !== null && generation - baseGeneration < 5 && treeChildren(person).length) state.expanded.add(String(personId(person)));
    });
    if (root) state.expanded.add(String(personId(root)));
    const focus = getPerson(state.mainFocusId);
    if (focus) setAncestorsExpanded(focus);
  }

  function prepareFullExpansion() {
    state.overviewMode = true;
    state.compact = true;
    // 从分支聚焦或带 focus 的地址进入后，点“展开全部”必须回到完整本宗，
    // 否则 viewIncludes 会继续把整棵树限制在当前聚焦分支内。
    if (state.view === 'main' && !state.mainSublineage) {
      state.mainFocusId = null;
      state.mobileFocusRootId = null;
      state.viewIncludeCache.clear();
      state.viewIncludeCacheKey = '';
    }
    state.expanded.clear();
    const people = state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person));
    people.forEach((person) => {
      if (treeChildren(person).length) state.expanded.add(String(personId(person)));
    });
    const root = findRoot();
    if (root) state.expanded.add(String(personId(root)));
  }

  // 兼容旧版调用：现在“全部展开”统一由 fitOverview({ whole: true })
  // 计算整张图的适配比例，这个函数只保留给旧状态恢复等场景使用。
  function fitExpandedTreeForMobile() {
    const viewport = $('#tree-viewport');
    const stage = $('#tree-stage');
    if (!viewport || !stage || !stage.innerHTML.trim()) return;
    state.overviewMetrics = { width: 0, height: 0 };
    stage.style.zoom = 1;
    stage.style.transform = 'none';
    const contentWidth = Math.max(1, stage.scrollWidth);
    const contentHeight = Math.max(1, stage.scrollHeight);
    const availableWidth = Math.max(1, viewport.clientWidth - 24);
    const availableHeight = Math.max(1, viewport.clientHeight - 24);
    const naturalFit = Math.min(availableWidth / contentWidth, availableHeight / contentHeight) * .96;
    // 0.16—0.42 是手机端可辨认且不会一次铺满屏幕的起始范围。
    // 图越宽，仍保持最低可读比例，用户可以用手势继续缩小或放大。
    state.zoom = Math.max(.16, Math.min(.42, naturalFit));
    state.mapPan = { x: 12, y: 12 };
    applyZoom();
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
    renderMiniMap();
  }

  function isMobileViewport() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 760px)').matches;
  }

  // 手机端默认只展开目标人物附近的有限窗口，避免把上千张卡片一次性塞进小屏。
  // 祖先链必须完整展开，后代按层级和数量限制展开；用户仍可通过“显示全图（高级）”主动查看全量。
  function prepareMobileFocusWindow(person, radius = 4) {
    state.overviewMode = false;
    state.compact = true;
    state.expanded.clear();
    const focus = person || getPerson(state.selectedId) || getPerson(state.mainFocusId) || findRoot();
    if (!focus) return;
    const lineage = [];
    const seen = new Set();
    let current = focus;
    while (current && !seen.has(String(personId(current))) && lineage.length <= radius) {
      seen.add(String(personId(current)));
      lineage.push(current);
      const key = String(personId(current));
      const displayParentId = state.adoption.displayParentById.get(key);
      current = displayParentId ? getPerson(displayParentId) : parentsOf(current)[0] || null;
    }
    const windowRoot = lineage[lineage.length - 1] || focus;
    state.mobileFocusRootId = personId(windowRoot);
    lineage.forEach((item) => state.expanded.add(String(personId(item))));
    let budget = 180;
    const walk = (current, distance) => {
      if (!current || distance >= radius || budget <= 0) return;
      const children = treeChildren(current);
      if (!children.length) return;
      state.expanded.add(String(personId(current)));
      budget -= children.length;
      children.forEach((child) => walk(child, distance + 1));
    };
    walk(focus, 0);
    state.expanded.add(String(personId(focus)));
  }

  function focusMainBranch(id) {
    state.overviewMode = false;
    state.immersive = false;
    state.mainFocusId = id ? personId(getPerson(id)) : null;
    state.selectedId = state.mainFocusId;
    state.branch = '';
    state.generation = '';
    state.searchQuery = '';
    const search = $('#search-input');
    if (search) search.value = '';
    state.expanded.clear();
    const focus = getPerson(state.mainFocusId);
    if (focus) setAncestorsExpanded(focus);
    else seedMainExpansion();
    buildFilters();
    renderAll();
    fitOverview();
    showToast(focus ? `已聚焦“${text(focus.name)}”所在支系` : '已恢复全本宗视图');
  }

  function expandToDepth(depth) {
    state.compact = true;
    prepareDepthExpansion(depth);
    renderTree();
    fitOverview();
    showToast(`已展开当前${depth}代；可继续选择更深层级或“当前支系全部”`);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || min));
  }

  function loadLayout() {
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return;
      state.layout.leftWidth = clamp(saved.leftWidth, 150, 520);
      state.layout.detailWidth = clamp(saved.detailWidth, 240, 680);
      state.layout.leftHidden = Boolean(saved.leftHidden);
      state.layout.detailHidden = Boolean(saved.detailHidden);
    } catch (error) {
      // 布局偏好读取失败时使用默认宽度，不影响族谱数据。
    }
  }

  function persistLayout() {
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify({
        leftWidth: state.layout.leftWidth,
        detailWidth: state.layout.detailWidth,
        leftHidden: state.layout.leftHidden,
        detailHidden: state.layout.detailHidden
      }));
    } catch (error) {
      // 布局偏好无法保存时仍保持当前会话可用。
    }
  }

  function applyLayout(save) {
    const shell = $('#app');
    const workspace = document.querySelector('.workspace');
    if (!shell || !workspace) return;
    workspace.style.setProperty('--left-rail-w', `${state.layout.leftWidth}px`);
    workspace.style.setProperty('--detail-panel-w', `${state.layout.detailWidth}px`);
    shell.classList.toggle('is-left-hidden', state.layout.leftHidden);
    shell.classList.toggle('is-detail-hidden', state.layout.detailHidden);
    const leftToggle = $('#left-rail-toggle');
    const detailToggle = $('#detail-toggle');
    if (leftToggle) {
      leftToggle.textContent = state.layout.leftHidden ? '显示左栏' : '隐藏左栏';
      leftToggle.title = state.layout.leftHidden ? '显示左侧控制栏' : '隐藏左侧控制栏';
      leftToggle.setAttribute('aria-pressed', String(state.layout.leftHidden));
    }
    if (detailToggle) {
      detailToggle.textContent = state.layout.detailHidden ? '显示详情' : '隐藏详情';
      detailToggle.title = state.layout.detailHidden ? '显示右侧人物详情栏' : '隐藏右侧人物详情栏';
      detailToggle.setAttribute('aria-pressed', String(state.layout.detailHidden));
    }
    if (save) persistLayout();
  }

  function applyImmersiveMode(save) {
    const shell = $('#app');
    if (!shell) return;
    shell.classList.toggle('is-immersive', state.immersive);
    const toggle = $('#immersive-toggle');
    if (toggle) {
      toggle.textContent = state.immersive ? '退出全屏' : '全屏浏览';
      toggle.title = state.immersive ? '恢复顶部工具和说明区域' : '全屏查看世系图；可用浮动按钮恢复界面';
      toggle.setAttribute('aria-pressed', String(state.immersive));
    }
    const hud = $('#immersive-hud');
    if (hud) {
      hud.hidden = !state.immersive;
      hud.setAttribute('aria-hidden', String(!state.immersive));
    }
    if (save) persistSessionView();
  }

  function toggleImmersive() {
    state.immersive = !state.immersive;
    applyImmersiveMode(true);
    if (state.immersive) {
      const app = $('#app');
      if (app && app.requestFullscreen) app.requestFullscreen().catch(() => { /* 浏览器不支持时使用页面沉浸模式 */ });
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    if (state.immersive && state.overviewMode) {
      // 隐藏顶部区域后视口变高，重新适配一次全景图，避免图面仍按旧高度缩放。
      const run = () => {
        fitOverview();
        persistSessionView();
      };
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
      else setTimeout(run, 0);
    }
    showToast(state.immersive
      ? '已进入全屏浏览；滚轮缩放、拖拽平移，按 Esc 显示界面'
      : '已显示完整界面');
  }

  function togglePanel(panel) {
    if (panel === 'left') state.layout.leftHidden = !state.layout.leftHidden;
    if (panel === 'right') state.layout.detailHidden = !state.layout.detailHidden;
    applyLayout(true);
    setTimeout(() => fitOverview(), 220);
    showToast(panel === 'left'
      ? (state.layout.leftHidden ? '已隐藏左侧控制栏，中央世系图空间已扩大' : '已显示左侧控制栏')
      : (state.layout.detailHidden ? '已隐藏右侧详情栏，中央世系图空间已扩大' : '已显示右侧详情栏'));
  }

  function setGlobalNav(open) {
    const overlay = $('#global-nav-overlay');
    const toggles = $$('#global-nav-toggle, #admin-global-nav-toggle');
    if (!overlay) return;
    if (open && document.activeElement && document.activeElement.id) overlay.dataset.returnFocusId = document.activeElement.id;
    overlay.hidden = !open;
    document.body.classList.toggle('is-global-nav-open', open);
    toggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.classList.toggle('is-active', open);
    });
    if (open) {
      const close = overlay.querySelector('.global-nav-close');
      if (close) setTimeout(() => close.focus(), 0);
    } else {
      const returnTarget = overlay.dataset.returnFocusId ? document.getElementById(overlay.dataset.returnFocusId) : toggles[0];
      if (returnTarget) returnTarget.focus();
    }
  }

  function toggleGlobalNav() {
    const overlay = $('#global-nav-overlay');
    if (overlay) setGlobalNav(overlay.hidden);
  }

  function renderStats() {
    const viewPeople = state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person));
    const generations = viewPeople.map(generationOf).filter((value) => value !== null);
    const branches = new Set(viewPeople.map((person) => text(person.branch).trim()).filter(Boolean));
    $('#stat-people').textContent = viewPeople.length.toLocaleString('zh-CN');
    $('#stat-generation').textContent = generations.length ? `第${Math.max(...generations)}世` : '-';
    $('#stat-branches').textContent = branches.size.toLocaleString('zh-CN');
    const verifiedCount = viewPeople.filter((person) => state.verified.has(String(personId(person)))).length;
    const verifiedStat = $('#stat-verified');
    if (verifiedStat) verifiedStat.textContent = verifiedCount.toLocaleString('zh-CN');
    $('#data-count-badge').textContent = `${state.data.length.toLocaleString('zh-CN')} 条`;
    updateZoomReadouts();
    const compactToggle = $('#compact-toggle');
    if (compactToggle) {
      compactToggle.textContent = state.compact ? '标准' : '紧凑';
      compactToggle.setAttribute('aria-pressed', String(state.compact));
      compactToggle.title = state.compact ? '切换为标准卡片' : '切换为紧凑卡片';
    }
    applyLayout(false);
  }

  function queryPeople() {
    return state.data.filter((person) => person && person.name !== undefined);
  }

  function querySearchMatches() {
    const q = text(state.query.keyword).trim().toLowerCase();
    const from = Number(state.query.genFrom) || 0;
    const to = Number(state.query.genTo) || 9999;
    const gender = text(state.query.gender).trim();
    const alive = text(state.query.alive).trim();
    return queryPeople().filter((person) => {
      const haystack = [person.name, person.branch, person.biography, person.adopt_note, person.notes, person.courtesy_name, person.title]
        .map(text).join(' ').toLowerCase();
      const generation = generationOf(person) || 0;
      const normalizedGender = genderLabel(person);
      const normalizedAlive = lifeStatusLabel(person) === '在世' ? '是' : lifeStatusLabel(person) === '已故' ? '否' : lifeStatusLabel(person) === '状态冲突' ? '冲突' : '未知';
      if (q && !haystack.includes(q)) return false;
      if (from && generation < from) return false;
      if (to < 9999 && generation > to) return false;
      if (gender && normalizedGender !== gender) return false;
      if (alive && normalizedAlive !== alive) return false;
      return true;
    }).sort((a, b) => (generationOf(a) || 9999) - (generationOf(b) || 9999) || text(a.name).localeCompare(text(b.name), 'zh-CN') || Number(personId(a)) - Number(personId(b)));
  }

  function queryStatHtml(value, label, className) {
    return `<div class="query-stat${className ? ` ${className}` : ''}"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
  }

  // 统计必须以管理后台 canonical 数据中的结构化字段为准，不能再依赖
  // 卡片标签的推断结果。这样同一组出继/入继记录始终按一对一对应统计。
  function adoptionSummary(people) {
    const outIds = new Set();
    const inIds = new Set();
    const pairIds = new Set();
    (people || []).forEach((person) => {
      const id = String(personId(person));
      const status = text(person.adoption_status).trim();
      const pairId = text(person.adoption_pair_id).trim();
      if (pairId) pairIds.add(pairId);
      if (status === 'out') outIds.add(id);
      else if (status === 'in') inIds.add(id);
      else {
        // 兼容后台尚未补结构化字段的旧记录，但只作为兜底。
        if (adoptionTags(person).some((tag) => tag.className === 'adoption-out')) outIds.add(id);
        if (adoptionTags(person).some((tag) => tag.className === 'adoption-in')) inIds.add(id);
      }
    });
    return { out: outIds.size, incoming: inIds.size, pairs: pairIds.size };
  }

  function inLawRecords(people) {
    return (people || []).filter((person) => /入赘|入贅|赘婿|贅婿|招赘|招贅/.test([
      person.marriage_type, person.in_law_origin, person.in_law_spouse, person.in_law_note,
      person.name, person.biography, person.adopt_note, person.notes,
      person.spouse_record, person.book_record
    ].map(text).join(' ')));
  }

  function adoptionRows(people) {
    const rows = new Map();
    (people || []).forEach((person) => {
      const pairId = text(person.adoption_pair_id).trim();
      const status = text(person.adoption_status).trim();
      if (!pairId || (status !== 'out' && status !== 'in')) return;
      if (!rows.has(pairId)) rows.set(pairId, { pairId, out: null, incoming: null });
      const row = rows.get(pairId);
      if (status === 'out') row.out = person;
      if (status === 'in') row.incoming = person;
    });
    return Array.from(rows.values())
      .sort((a, b) => (generationOf(a.out || a.incoming) || 9999) - (generationOf(b.out || b.incoming) || 9999) || Number(personId(a.out || a.incoming)) - Number(personId(b.out || b.incoming)));
  }

  function adoptionPersonLink(person, role) {
    if (!person) return '<span class="adoption-table-muted">未找到记录</span>';
    return `<button class="adoption-table-person" data-action="query-locate" data-id="${escapeHtml(personId(person))}" title="定位${escapeHtml(text(person.name))}"><strong>${escapeHtml(text(person.name) || '未命名')}</strong><small>ID ${escapeHtml(personId(person))} · 第${escapeHtml(generationOf(person) || '—')}世</small></button><span class="adoption-table-role ${role}">${role === 'out' ? '出继记录' : '入继记录'}</span>`;
  }

  function adoptionParentLink(person, label) {
    if (!person) return `<span class="adoption-table-muted">${escapeHtml(label)}未详</span>`;
    return `<button class="adoption-table-parent" data-action="query-locate" data-id="${escapeHtml(personId(person))}">${escapeHtml(text(person.name) || '未命名')} <small>ID ${escapeHtml(personId(person))}</small></button>`;
  }

  function renderAdoptionTable() {
    const container = $('#query-adoption-table');
    const toggle = document.querySelector('[data-action="toggle-adoption-table"]');
    if (!container) return;
    const rows = adoptionRows(state.data);
    const opened = Boolean(state.query.adoptionTableOpen);
    container.hidden = !opened;
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(opened));
      toggle.textContent = opened ? '收起出继入继一览表' : '出继入继一览表';
    }
    if (!opened) return;
    const complete = rows.filter((row) => row.out && row.incoming);
    const incomplete = rows.length - complete.length;
    const tableRows = rows.map((row, index) => {
      const out = row.out;
      const incoming = row.incoming;
      const adoptiveFatherId = (incoming && (incoming.adoption_adoptive_parent_id || incoming.adoptive_parent_id)) || null;
      const biologicalFather = out ? getPerson(out.father_id) : null;
      const adoptiveFather = getPerson(adoptiveFatherId) || (incoming ? getPerson(incoming.father_id) : null);
      const source = text((out && (out.adoption_relation_source || out.adopt_note)) || (incoming && (incoming.adoption_relation_source || incoming.adopt_note))).trim();
      const generation = generationOf(out || incoming);
      return `<tr><td class="adoption-table-index" data-label="#">${index + 1}</td><td class="adoption-table-generation" data-label="世次">第${escapeHtml(generation || '—')}世</td><td class="adoption-table-pair" data-label="出继 / 入继"><div class="adoption-table-pair-line"><span class="adoption-table-cell-label">出继</span>${adoptionPersonLink(out, 'out')}<span class="adoption-table-arrow" aria-hidden="true">→</span><span class="adoption-table-cell-label">入继</span>${adoptionPersonLink(incoming, 'in')}</div></td><td class="adoption-table-parents" data-label="父亲关系"><div><span class="adoption-table-cell-label">亲生父亲</span>${adoptionParentLink(biologicalFather, '亲生父亲')}<span class="adoption-table-arrow" aria-hidden="true">→</span><span class="adoption-table-cell-label">承嗣父</span>${adoptionParentLink(adoptiveFather, '承嗣父')}</div></td><td class="adoption-table-source" data-label="谱载说明">${escapeHtml(source || '原始谱载未详')}</td></tr>`;
    }).join('');
    container.innerHTML = `<div class="adoption-table-summary"><strong>共 ${complete.length} 组完整对应关系</strong><span>出继 ${complete.length} 人 · 入继 ${complete.length} 人 · 数据源：族谱管理后台</span>${incomplete ? `<em>另有 ${incomplete} 组资料未能成对，需复核</em>` : '<em class="is-ok">出继数量与入继数量相等</em>'}</div><div class="adoption-table-scroll"><table><thead><tr><th>#</th><th>世次</th><th>出继 → 入继</th><th>亲生父亲 → 承嗣父</th><th>谱载说明</th></tr></thead><tbody>${tableRows || '<tr><td colspan="5" class="adoption-table-empty">当前主数据暂无结构化出继／入继记录。</td></tr>'}</tbody></table></div>`;
  }

  function renderQueryStats() {
    const container = $('#query-stats');
    if (!container) return;
    const people = queryPeople();
    const generations = people.map(generationOf).filter((value) => value !== null);
    const branches = new Set(people.map((person) => text(person.branch).trim()).filter(Boolean));
    const male = people.filter((person) => genderOf(person) === '男').length;
    const female = people.filter((person) => genderOf(person) === '女').length;
    const unknown = people.length - male - female;
    const adoption = adoptionSummary(people);
    const inLaw = inLawRecords(people).length;
    container.innerHTML = [
      queryStatHtml(people.length.toLocaleString('zh-CN'), '现有记录', ''),
      queryStatHtml(generations.length ? `第${Math.max(...generations)}世` : '—', '最高世代', ''),
      queryStatHtml(branches.size.toLocaleString('zh-CN'), '已标注支系', ''),
      queryStatHtml(male.toLocaleString('zh-CN'), '男', ''),
      queryStatHtml(female.toLocaleString('zh-CN'), '女（已校正）', 'is-female'),
      queryStatHtml(unknown.toLocaleString('zh-CN'), '性别未标注', 'is-audit'),
      queryStatHtml(`${adoption.out}/${adoption.incoming}`, '出继 / 入继记录', 'is-audit'),
      queryStatHtml(inLaw.toLocaleString('zh-CN'), '入赘记录', 'is-audit')
    ].join('');
  }

  function renderQueryAudit() {
    const container = $('#query-audit');
    if (!container) return;
    const people = queryPeople();
    const unknownGender = people.filter((person) => !genderOf(person)).length;
    const directFatherRefs = people.filter((person) => person.father_id !== null && person.father_id !== undefined && person.father_id !== '').length;
    const orphanRefs = people.filter((person) => {
      const father = person.father_id ?? person.fatherId ?? person.father;
      return father !== null && father !== undefined && father !== '' && !getPerson(father);
    }).length;
    const adoption = adoptionSummary(people);
    const inLawPeople = inLawRecords(people);
    const inLaw = inLawPeople.length;
    const item = (value, label, detail, kind) => `<div class="query-audit-item ${kind || ''}"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)} · ${escapeHtml(detail)}</span></div>`;
    container.innerHTML = [
      item(`${SOURCE_AUDIT_SNAPSHOT.fieldDiffRecords}`, '两源字段差异', `后台${SOURCE_AUDIT_SNAPSHOT.backendApi} / 交付磁盘${SOURCE_AUDIT_SNAPSHOT.deliveryDisk}，仅作对照`, 'warn'),
      item(`${SOURCE_AUDIT_SNAPSHOT.fatherDiffRecords}`, '父系字段差异', '已按谱页与人工核定优先，不直接覆盖', 'warn'),
      item(`${unknownGender}`, '当前性别未标注', `父子关联${directFatherRefs}条${orphanRefs ? `，孤立父 ID ${orphanRefs} 条` : '，父 ID 可解析'}`, unknownGender ? 'warn' : 'ok'),
      item(`${adoption.out} / ${adoption.incoming}`, '出继 / 入继核对', `${adoption.out === adoption.incoming ? `数量相等，共${adoption.pairs || adoption.out}组` : '存在数量差异，需按谱页逐项复核'}`, adoption.out === adoption.incoming ? 'ok' : 'warn'),
      item(`${inLaw}`, '入赘单独记录', `${inLaw ? inLawPeople.map((person) => text(person.name)).join('、') : '后台当前未记录'}；不并入出继 / 入继统计`, 'ok'),
      item(`${SOURCE_AUDIT_SNAPSHOT.upperTerms.out + SOURCE_AUDIT_SNAPSHOT.lowerTerms.out}`, '谱页“出继”词项', `上册${SOURCE_AUDIT_SNAPSHOT.upperTerms.out} / 下册${SOURCE_AUDIT_SNAPSHOT.lowerTerms.out}`, 'ok')
    ].join('');
  }

  function renderQueryTimeline() {
    const container = $('#query-timeline-bars');
    if (!container) return;
    const counts = new Map();
    queryPeople().forEach((person) => {
      const generation = generationOf(person);
      if (generation !== null) counts.set(generation, (counts.get(generation) || 0) + 1);
    });
    const generations = Array.from(counts.keys()).sort((a, b) => a - b);
    const max = Math.max(1, ...Array.from(counts.values()));
    const from = Number(state.query.genFrom) || 0;
    const to = Number(state.query.genTo) || 9999;
    const eraDefinitions = [
      { from: 1, to: 65, label: '炎帝远古世系', startLabel: '炎帝（炎帝第1代）', endLabel: '申伯（炎帝第65代）', className: 'is-ancient' },
      { from: 65, to: 99, label: '申伯世系', startLabel: '申伯（炎帝第65代）', endLabel: '缵（炎帝第99代）', className: 'is-shenbo' },
      { from: 99, to: 122, label: '始宁东山世系', startLabel: '缵（炎帝第99代）', endLabel: '闓（炎帝第122代）', className: 'is-dongshan' },
      { from: 122, to: 130, label: '临海下渡世系', startLabel: '闓（炎帝第122代）', endLabel: '小四（炎帝第130代）', className: 'is-linhai' }
    ];
    const eraBracket = eraDefinitions.map((era, index) => {
      const eraGenerations = generations.filter((generation) => generation >= era.from && generation <= era.to);
      if (!eraGenerations.length) return '';
      const firstIndex = generations.indexOf(eraGenerations[0]);
      const lastIndex = generations.indexOf(eraGenerations[eraGenerations.length - 1]);
      const left = 8 + firstIndex * 26;
      const width = (lastIndex - firstIndex) * 26 + 24;
      const bracketTop = 12 + index * 34;
      const timelineBarTop = 148;
      const guideHeight = Math.max(12, timelineBarTop - bracketTop - 24);
      return `<div class="query-era-bracket ${era.className}" style="top:${bracketTop}px;left:${left}px;width:${width}px;--era-guide-height:${guideHeight}px" aria-label="${era.label}，闭区间[${era.from},${era.to}]"><i class="era-bracket-line"></i><b class="era-bracket-arrow">▶</b><strong>${era.label}</strong><b class="era-bracket-arrow">◀</b><i class="era-bracket-line"></i><span class="era-bracket-guide era-bracket-guide-start"></span><span class="era-bracket-guide era-bracket-guide-end"></span><span class="era-bracket-endpoint era-bracket-endpoint-start">${era.startLabel}</span><span class="era-bracket-endpoint era-bracket-endpoint-end">${era.endLabel}</span></div>`;
    }).join('');
    container.innerHTML = eraBracket + generations.map((generation) => {
      const count = counts.get(generation) || 0;
      const active = generation >= from && generation <= to && (from || to < 9999);
      const height = Math.max(8, Math.round((count / max) * 92));
      const ancient = generation >= 1 && generation <= 65;
      return `<button class="query-generation-bar${active ? ' is-active' : ''}${ancient ? ' is-ancient' : ''}" data-action="query-generation" data-generation="${generation}" title="第${generation}世 · ${count}人${ancient ? ' · 炎帝远古世系' : ''}"><i style="height:${height}px"></i><b>${generation}</b><small>${count}</small></button>`;
    }).join('');
    renderQueryGenerationDetail();
  }

  function firstGregorianYear(value) {
    const match = text(value).match(/(?:公元)?([一二][一二三四五六七八九〇零○]{3}|\d{4})年/);
    if (!match) return null;
    const raw = match[1];
    if (/^\d{4}$/.test(raw)) return Number(raw);
    const digits = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 〇: '0', 零: '0', '○': '0' };
    const year = Number(Array.from(raw).map((char) => digits[char] || '').join(''));
    return year >= 1000 && year <= 2099 ? year : null;
  }

  function lifespanLabel(person) {
    const birth = firstGregorianYear(person && person.birth_date);
    const death = firstGregorianYear(person && person.death_date);
    if (birth !== null && death !== null && death >= birth) return `约${death - birth}岁`;
    return '未详';
  }

  function generationDetailValue(label, value, className) {
    return `<div class="generation-detail-field${className ? ` ${className}` : ''}"><span>${escapeHtml(label)}</span><strong>${displayValue(annotateGregorianYears(value))}</strong></div>`;
  }

  function generationSpouseHtml(person) {
    const raw = formValue(person, 'spouse_ids').trim();
    const spouses = spousesOf(person);
    const linked = spouses.map((spouse) => `<article class="generation-spouse-card"><h5>${escapeHtml(text(spouse.name) || '未命名配偶')}</h5><div class="generation-spouse-meta">${escapeHtml(genderLabel(spouse))} · ${escapeHtml(lifeStatusLabel(spouse))}</div><p>出生：${displayValue(annotateGregorianYears(spouse.birth_date))}；卒年 / 卒葬：${displayValue(annotateGregorianYears(spouse.death_date))}；寿命：${escapeHtml(lifespanLabel(spouse))}</p><p>葬地：${displayValue(spouse.burial_place)}；字 / 号：${displayValue(spouse.courtesy_name)}</p>${spouse.biography ? `<p>谱载：${displayValue(spouse.biography)}</p>` : ''}</article>`).join('');
    const source = raw ? `<div class="generation-spouse-source"><span>配偶原始谱载</span><strong>${displayValue(annotateGregorianYears(raw))}</strong>${person.spouse_record ? `<p>${displayValue(annotateGregorianYears(person.spouse_record))}</p>` : ''}</div>` : '';
    return linked || source || '<span class="query-muted">配偶信息未详</span>';
  }

  function generationPersonCard(person) {
    const adoption = queryAdoptionLabel(person);
    const special = [person.title, person.adopt_note, person.notes].filter((value) => text(value).trim()).join('；');
    const spouseSummary = spousesOf(person).map((spouse) => text(spouse.name) || '未命名配偶').join('、') || formValue(person, 'spouse_ids').trim() || '未详';
    const birthSummary = displayValue(annotateGregorianYears(person.birth_date));
    const deathSummary = displayValue(annotateGregorianYears(person.death_date));
    const detailGrid = `${generationDetailValue('出生信息', person.birth_date)}${generationDetailValue('卒年 / 卒葬', person.death_date)}${generationDetailValue('寿命', lifespanLabel(person))}${generationDetailValue('葬地', person.burial_place)}${generationDetailValue('籍贯 / 居住地', [person.native_place, person.residence].filter((value) => text(value).trim()).join('；'))}${generationDetailValue('字 / 号', person.courtesy_name)}${generationDetailValue('支系', person.branch)}${generationDetailValue('出处', [person.source_pages, person.vital_source].filter((value) => text(value).trim()).join('；'))}`;
    const details = `<details class="generation-row-details"><summary>查看完整资料</summary><div class="generation-person-grid">${detailGrid}</div><section class="generation-spouse-section"><h4>配偶 / 老婆信息</h4><div class="generation-spouse-list">${generationSpouseHtml(person)}</div></section>${special ? `<section class="generation-special"><h4>特殊说明</h4><p>${displayValue(special)}</p></section>` : ''}${person.biography ? `<section class="generation-book-note"><h4>族谱记载</h4><p>${displayValue(person.biography)}</p></section>` : ''}${person.book_record ? `<section class="generation-book-note"><h4>原始谱载</h4><p>${displayValue(person.book_record)}</p></section>` : ''}</details>`;
    return `<article class="generation-person-card generation-person-row"><div class="generation-row-primary"><span class="generation-person-gen">第${escapeHtml(generationOf(person) || '—')}世</span><button class="generation-person-name" data-action="query-locate" data-id="${escapeHtml(personId(person))}">${escapeHtml(text(person.name) || '未命名')}</button><span class="generation-row-branch">${escapeHtml(text(person.branch) || '未标注支系')}</span></div><div class="generation-row-status"><span class="generation-tag ${genderLabel(person) === '女' ? 'is-female' : ''}">${escapeHtml(genderLabel(person))}</span><span class="generation-tag ${lifeStatusLabel(person) === '状态冲突' ? 'is-conflict' : lifeStatusLabel(person) === '已故' ? 'is-deceased' : lifeStatusLabel(person) === '在世' ? 'is-alive' : 'is-unknown'}">${escapeHtml(lifeStatusLabel(person))}</span>${adoption ? `<span class="generation-tag is-adoption">${escapeHtml(adoption)}</span>` : ''}</div><div class="generation-row-summary"><span><b>生卒</b>${birthSummary} → ${deathSummary}</span><span><b>配偶</b>${escapeHtml(spouseSummary)}</span><span><b>墓地</b>${displayValue(person.burial_place)}</span></div>${details}</article>`;
  }

  function renderQueryGenerationDetail() {
    const container = $('#query-generation-detail');
    if (!container) return;
    const generation = Number(state.query.genFrom) || 0;
    const to = Number(state.query.genTo) || 0;
    if (!generation || !to || generation > to) {
      container.hidden = true;
      container.innerHTML = '';
      return;
    }
    const people = queryPeople().filter((person) => { const personGeneration = generationOf(person); return personGeneration >= generation && personGeneration <= to; }).sort((a, b) => Number(personId(a)) - Number(personId(b)));
    const heading = generation === to ? `第${generation}世族人完整信息` : `第${generation}—${to}世族人完整信息`;
    container.hidden = false;
    container.innerHTML = `<div class="generation-detail-head"><div><span class="query-kicker">GENERATION RECORDS</span><h4>${heading}</h4><p>共 ${people.length} 人；配偶资料优先显示独立人物记录，同时保留上册 / 下册原始谱载。</p></div><button class="query-secondary" type="button" data-action="query-generation-close">收起查询</button></div><div class="generation-detail-list">${people.length ? people.map(generationPersonCard).join('') : '<p class="query-muted">本范围暂无记录。</p>'}</div>`;
  }

  function queryAdoptionLabel(person) {
    const labels = adoptionTags(person).map((tag) => tag.label);
    return labels.length ? labels.join(' / ') : '';
  }

  function renderQuerySearchResults() {
    const container = $('#query-search-results');
    const summary = $('#query-search-summary');
    if (!container) return;
    const results = querySearchMatches();
    const visible = results.slice(0, 200);
    if (summary) summary.textContent = results.length ? `共 ${results.length} 条${results.length > visible.length ? `，当前展示 ${visible.length} 条` : ''}` : '未找到匹配记录';
    if (!results.length) {
      container.innerHTML = '<div class="query-muted" style="padding:16px 4px">未找到匹配记录。可放宽姓名、世代或性别条件。</div>';
      return;
    }
    const head = '<div class="query-result-row query-result-head"><span>世代</span><span>姓名</span><span>性别</span><span>支系</span><span>状态</span><span>操作</span></div>';
    const rows = visible.map((person) => {
      const gender = genderLabel(person);
      const adoption = queryAdoptionLabel(person);
      return `<div class="query-result-row"><span>${escapeHtml(generationOf(person) || '—')}</span><button type="button" data-action="query-locate" data-id="${escapeHtml(personId(person))}">${escapeHtml(text(person.name) || '未命名')}${adoption ? ` <em class="query-result-tag adopt">${escapeHtml(adoption)}</em>` : ''}</button><span class="query-result-tag${gender === '女' ? ' female' : ''}">${escapeHtml(gender)}</span><span>${escapeHtml(text(person.branch) || '未标注')}</span><span>${escapeHtml(lifeStatusLabel(person))}</span><span class="query-result-actions"><button type="button" data-action="query-detail" data-id="${escapeHtml(personId(person))}">详情</button><button type="button" data-action="query-lineage7" data-id="${escapeHtml(personId(person))}">7代人</button><button type="button" class="root-trace-trigger" data-action="root-trace" data-id="${escapeHtml(personId(person))}">寻根</button></span></div>`;
    }).join('');
    container.innerHTML = head + rows;
  }

  function queryLineage7Parent(person) {
    if (!person) return null;
    const displayParentId = state.adoption.displayParentById.get(String(personId(person)));
    return displayParentId ? getPerson(displayParentId) : rawFatherOf(person);
  }

  function queryLineage7Children(person) {
    if (!person) return [];
    // 这里使用“展示父子关系”索引，而不是当前世系图的支系筛选，
    // 避免用户在某个分房图中查询时把上下代误判为不存在。
    return displayChildrenOf(person).filter((child, index, list) => list.findIndex((item) => String(personId(item)) === String(personId(child))) === index);
  }

  function queryLineage7Card(person, role, level) {
    const key = String(personId(person));
    const relation = state.adoption.outById.get(key) || state.adoption.inById.get(key);
    const biological = rawFatherOf(person);
    const displayParent = state.adoption.displayParentById.get(key) ? getPerson(state.adoption.displayParentById.get(key)) : null;
    const adoption = queryAdoptionLabel(person);
    const relationship = displayParent && biological && String(personId(displayParent)) !== String(personId(biological))
      ? `亲生父亲：${text(biological.name)} · 承嗣父：${text(displayParent.name)}`
      : relation && relation.biologicalParent && relation.adoptiveParent
        ? `亲生父亲：${text(relation.biologicalParent.name)} · 承嗣父：${text(relation.adoptiveParent.name)}`
        : '';
    const status = lifeStatusLabel(person);
    return `<article class="query-lineage7-card is-${role}"><div class="query-lineage7-card-top"><span class="query-lineage7-level">${escapeHtml(level)}</span><span class="query-lineage7-status">${escapeHtml(status)}</span></div><button class="query-lineage7-name" data-action="query-locate" data-id="${escapeHtml(personId(person))}">${escapeHtml(text(person.name) || '未命名')}</button><div class="query-lineage7-meta"><span>第${escapeHtml(generationOf(person) || '—')}世</span><span>${escapeHtml(text(person.branch) || '未标注支系')}</span>${genderLabel(person) !== '未知' ? `<span>${escapeHtml(genderLabel(person))}</span>` : ''}</div>${adoption ? `<div class="query-lineage7-badge">${escapeHtml(adoption)}</div>` : ''}${relationship ? queryLineage7AdoptionInlineHtml(person) : ''}</article>`;
  }

  // 出继/入继关系嵌入发生关系的人物卡片，明确区分亲生父亲、出继人和承嗣父。
  function queryLineage7AdoptionInlineHtml(person) {
    const relation = state.adoption.outById.get(String(personId(person)))
      || state.adoption.inById.get(String(personId(person)));
    if (!relation || !relation.biologicalParent || !relation.adoptiveParent) return '';
    const outPerson = relation.outPerson || person;
    const node = (item, label, className) => `<button class="query-lineage7-adoption-inline-node ${className}" type="button" data-action="query-locate" data-id="${escapeHtml(personId(item))}"><strong>${escapeHtml(text(item.name) || '未命名')}</strong><small>${escapeHtml(label)}</small></button>`;
    return `<div class="query-lineage7-adoption-inline" aria-label="${escapeHtml(text(outPerson.name))}的出继入继关系"><div class="query-lineage7-adoption-inline-title">出继／入继关系</div><div class="query-lineage7-adoption-inline-flow">${node(relation.biologicalParent, '亲生父亲', 'is-biological')}<span class="query-lineage7-adoption-inline-arrow is-biological" aria-hidden="true">→<small>亲生</small></span>${node(outPerson, '出继人', 'is-out')}<span class="query-lineage7-adoption-inline-arrow is-adoption" aria-hidden="true">→<small>入继给</small></span>${node(relation.adoptiveParent, '承嗣父', 'is-adoptive')}</div></div>`;
  }

  // 上下七代查询中的出继/入继必须是树上的真实分支：
  // 共同父亲下面保留所有亲生子女，再从亲生父亲和承嗣父分别引线到出继人。
  function queryLineage7FamilyCard(person, label, className) {
    if (!person) return '';
    const status = lifeStatusLabel(person);
    const adoption = queryAdoptionLabel(person);
    return `<article class="query-lineage7-family-card ${className || ''}"><div class="query-lineage7-card-top"><span>${escapeHtml(label || '')}</span><span class="query-lineage7-status">${escapeHtml(status)}</span></div><button class="query-lineage7-name" data-action="query-locate" data-id="${escapeHtml(personId(person))}">${escapeHtml(text(person.name) || '未命名')}</button><div class="query-lineage7-meta"><span>第${escapeHtml(generationOf(person) || '—')}世</span><span>${escapeHtml(text(person.branch) || '未标注支系')}</span>${genderLabel(person) !== '未知' ? `<span>${escapeHtml(genderLabel(person))}</span>` : ''}</div>${adoption ? `<div class="query-lineage7-badge">${escapeHtml(adoption)}</div>` : ''}</article>`;
  }

  function queryLineage7AdoptionTreeHtml(context) {
    if (!context || !context.commonParent || !context.relation || !context.adoptedPerson) return '';
    const biological = context.relation.biologicalParent;
    const adoptive = context.relation.adoptiveParent;
    if (!biological || !adoptive) return '';

    const people = [];
    const add = (person) => {
      if (!person) return;
      const key = String(personId(person));
      if (!people.some((item) => String(personId(item)) === key)) people.push(person);
    };
    queryLineage7Children(context.commonParent).forEach(add);
    // 出继记录有时会从展示父子索引中移出，强制把亲生父亲和承嗣父补回同胞行。
    add(biological);
    add(adoptive);
    const columns = Math.max(2, people.length);
    const cardWidth = 178;
    const gap = 12;
    const familyWidth = Math.max(620, columns * cardWidth + (columns - 1) * gap + 30);
    const rowWidth = columns * cardWidth + (columns - 1) * gap;
    const left = (familyWidth - rowWidth) / 2;
    const childX = (person) => left + people.findIndex((item) => String(personId(item)) === String(personId(person))) * (cardWidth + gap) + cardWidth / 2;
    const rootX = familyWidth / 2;
    const adoptedWidth = 230;
    const adoptedX = (familyWidth - adoptedWidth) / 2;
    const biologicalX = childX(biological);
    const adoptiveX = childX(adoptive);
    const childCards = people.map((person) => {
      const key = String(personId(person));
      const isBiological = key === String(personId(biological));
      const isAdoptive = key === String(personId(adoptive));
      const label = isBiological ? '亲生父亲' : isAdoptive ? '承嗣父' : '昌申之子';
      const className = isBiological ? 'is-biological-parent' : isAdoptive ? 'is-adoptive-parent' : 'is-sibling';
      return `<div class="query-lineage7-family-child" style="left:${Math.round(childX(person) - cardWidth / 2)}px">${queryLineage7FamilyCard(person, label, className)}</div>`;
    }).join('');
    const source = context.relation.source || `谱载：${text(biological.name)}之子${text(context.adoptedPerson.name)}，出继给${text(adoptive.name)}为嗣`;
    const lineSvg = `<svg class="query-lineage7-family-lines" viewBox="0 0 ${familyWidth} 410" preserveAspectRatio="none" aria-hidden="true"><path class="is-blood" d="M ${rootX} 108 V 126 H ${biologicalX} M ${biologicalX} 126 V 140"/><path class="is-blood" d="M ${rootX} 126 H ${childX(people[0])} M ${rootX} 126 H ${childX(people[people.length - 1])}"/><path class="is-blood" d="M ${people.map((person) => `M ${childX(person)} 126 V 140`).join(' ') }"/><path class="is-blood is-dashed" d="M ${biologicalX} 230 C ${biologicalX} 270 ${adoptedX + adoptedWidth * .34} 255 ${adoptedX + adoptedWidth * .34} 310"/><path class="is-adoption" d="M ${adoptiveX} 230 V 268 H ${adoptedX + adoptedWidth * .68} V 310"/></svg>`;
    const labels = `<span class="query-lineage7-family-line-label is-blood-label" style="left:${Math.round((biologicalX + adoptedX + adoptedWidth * .34) / 2)}px;top:252px">亲生父子</span><span class="query-lineage7-family-line-label is-adoption-label" style="left:${Math.round((adoptiveX + adoptedX + adoptedWidth * .68) / 2)}px;top:268px">出继给${escapeHtml(text(adoptive.name))}为嗣</span>`;
    return `<section class="query-lineage7-adoption-tree" aria-label="${escapeHtml(text(context.adoptedPerson.name))}的出继入继树状关系"><div class="query-lineage7-adoption-tree-title">出继／入继关系</div><div class="query-lineage7-adoption-tree-subtitle">昌申下面同时保留亲生父亲与承嗣父的真实关系</div><div class="query-lineage7-family-canvas" style="width:${familyWidth}px"><div class="query-lineage7-family-root">${queryLineage7FamilyCard(context.commonParent, '共同父亲', 'is-common-parent')}</div><div class="query-lineage7-family-children">${childCards}</div><div class="query-lineage7-family-adopted" style="left:${Math.round(adoptedX)}px">${queryLineage7FamilyCard(context.adoptedPerson, '出继／入继', 'is-adopted-person')}</div>${lineSvg}${labels}</div><p class="query-lineage7-family-source">${escapeHtml(source)}</p></section>`;
  }

  function queryLineage7AdoptionLinks(people) {
    const visibleIds = new Set(people.map((person) => String(personId(person))));
    const links = [];
    const seen = new Set();
    state.adoption.outById.forEach((relation) => {
      const records = [relation.biologicalParent, relation.outPerson, relation.adoptiveRecord, relation.adoptiveParent].filter(Boolean);
      if (!records.some((person) => visibleIds.has(String(personId(person))))) return;
      const key = [relation.outPerson, relation.adoptiveRecord, relation.adoptiveParent]
        .map((person) => person ? String(personId(person)) : '—').join('|');
      if (seen.has(key)) return;
      seen.add(key);
      links.push(relation);
    });
    return links;
  }

  function queryLineage7AdoptionHtml(relation) {
    const biological = relation.biologicalParent;
    const outPerson = relation.outPerson;
    const adoptiveRecord = relation.adoptiveRecord || relation.outPerson;
    const adoptiveParent = relation.adoptiveParent;
    const outLabel = adoptiveRecord && String(personId(adoptiveRecord)) !== String(personId(outPerson))
      ? `${text(outPerson.name)}（出继记录）`
      : `${text(outPerson.name)}（出继 / 入继）`;
    return `<article class="query-lineage7-adoption-card">
      <div class="query-lineage7-adoption-title">出继 / 入继关系</div>
      <div class="query-lineage7-adoption-flow">
        <div class="query-lineage7-adoption-node"><span>亲生父亲</span><button data-action="query-locate" data-id="${escapeHtml(personId(biological))}">${escapeHtml(text(biological.name))}</button><small>血缘父系</small></div>
        <div class="query-lineage7-adoption-edge is-biological" aria-hidden="true"><i></i><b>亲生</b><i></i></div>
        <div class="query-lineage7-adoption-node is-child"><span>出继人</span><button data-action="query-locate" data-id="${escapeHtml(personId(outPerson))}">${escapeHtml(outLabel)}</button><small>${escapeHtml(queryAdoptionLabel(outPerson) || '出继记录')}</small></div>
        <div class="query-lineage7-adoption-edge is-adoption" aria-hidden="true"><i></i><b>入继给</b><i></i></div>
        <div class="query-lineage7-adoption-node is-adoptive"><span>承嗣父</span><button data-action="query-locate" data-id="${escapeHtml(personId(adoptiveParent))}">${escapeHtml(text(adoptiveParent.name))}</button><small>入继 / 承嗣父</small></div>
      </div>
      <p>${escapeHtml(relation.source || '族谱载有出继、入继关系；亲生父系与承嗣父系同时保留。')}</p>
    </article>`;
  }

  const LINEAGE7_ZOOM_MIN = 0.28;
  const LINEAGE7_ZOOM_MAX = 2.4;

  function lineage7MapState() {
    if (!state.query.lineage7Map) state.query.lineage7Map = { zoom: 1, x: 0, y: 0 };
    return state.query.lineage7Map;
  }

  function lineage7MapElements() {
    const viewport = $('[data-lineage7-viewport]');
    const canvas = $('[data-lineage7-canvas]');
    return viewport && canvas ? { viewport, canvas } : null;
  }

  function clampLineage7MapPosition(x, y, zoom, viewport, canvas) {
    const width = Math.max(1, canvas.offsetWidth || canvas.scrollWidth || 1) * zoom;
    const height = Math.max(1, canvas.offsetHeight || canvas.scrollHeight || 1) * zoom;
    const viewportWidth = Math.max(1, viewport.clientWidth);
    const viewportHeight = Math.max(1, viewport.clientHeight);
    const nextX = width <= viewportWidth
      ? (viewportWidth - width) / 2
      : clamp(x, viewportWidth - width - 40, 40);
    const nextY = height <= viewportHeight
      ? (viewportHeight - height) / 2
      : clamp(y, viewportHeight - height - 40, 40);
    return { x: nextX, y: nextY };
  }

  function applyLineage7MapTransform() {
    const elements = lineage7MapElements();
    if (!elements) return;
    const { viewport, canvas } = elements;
    const map = lineage7MapState();
    map.zoom = clamp(Number(map.zoom) || 1, LINEAGE7_ZOOM_MIN, LINEAGE7_ZOOM_MAX);
    const position = clampLineage7MapPosition(Number(map.x) || 0, Number(map.y) || 0, map.zoom, viewport, canvas);
    map.x = position.x;
    map.y = position.y;
    canvas.style.transform = `translate3d(${map.x}px, ${map.y}px, 0) scale(${map.zoom})`;
    const label = $('[data-lineage7-zoom]');
    if (label) label.textContent = `${Math.round(map.zoom * 100)}%`;
  }

  function fitLineage7Map() {
    const elements = lineage7MapElements();
    if (!elements) return;
    const { viewport, canvas } = elements;
    const map = lineage7MapState();
    const canvasWidth = Math.max(1, canvas.offsetWidth || canvas.scrollWidth || 1);
    const canvasHeight = Math.max(1, canvas.offsetHeight || canvas.scrollHeight || 1);
    const availableWidth = Math.max(120, viewport.clientWidth - 28);
    const availableHeight = Math.max(120, viewport.clientHeight - 28);
    map.zoom = clamp(Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight, 1), LINEAGE7_ZOOM_MIN, 1);
    map.x = (viewport.clientWidth - canvasWidth * map.zoom) / 2;
    map.y = (viewport.clientHeight - canvasHeight * map.zoom) / 2;
    applyLineage7MapTransform();
  }

  function resetLineage7Map() {
    const elements = lineage7MapElements();
    if (!elements) return;
    const { viewport, canvas } = elements;
    const map = lineage7MapState();
    map.zoom = 1;
    map.x = (viewport.clientWidth - (canvas.offsetWidth || canvas.scrollWidth || 1)) / 2;
    map.y = (viewport.clientHeight - (canvas.offsetHeight || canvas.scrollHeight || 1)) / 2;
    applyLineage7MapTransform();
  }

  function zoomLineage7Map(factor, clientX, clientY) {
    const elements = lineage7MapElements();
    if (!elements) return;
    const { viewport } = elements;
    const map = lineage7MapState();
    const oldZoom = clamp(Number(map.zoom) || 1, LINEAGE7_ZOOM_MIN, LINEAGE7_ZOOM_MAX);
    const nextZoom = clamp(oldZoom * factor, LINEAGE7_ZOOM_MIN, LINEAGE7_ZOOM_MAX);
    if (Math.abs(nextZoom - oldZoom) < .001) return;
    const rect = viewport.getBoundingClientRect();
    const pointX = Number.isFinite(clientX) ? clientX - rect.left : viewport.clientWidth / 2;
    const pointY = Number.isFinite(clientY) ? clientY - rect.top : viewport.clientHeight / 2;
    const contentX = (pointX - map.x) / oldZoom;
    const contentY = (pointY - map.y) / oldZoom;
    map.zoom = nextZoom;
    map.x = pointX - contentX * nextZoom;
    map.y = pointY - contentY * nextZoom;
    applyLineage7MapTransform();
  }

  function wireLineage7Map() {
    const elements = lineage7MapElements();
    if (!elements || elements.viewport.dataset.lineage7Wired === 'true') return;
    const { viewport } = elements;
    viewport.dataset.lineage7Wired = 'true';
    const pointers = new Map();
    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOriginX = 0;
    let dragOriginY = 0;
    let dragged = false;
    let pinchDistance = 0;
    const pairMetrics = () => {
      const pair = Array.from(pointers.values()).slice(0, 2);
      if (pair.length < 2) return null;
      const dx = pair[1].x - pair[0].x;
      const dy = pair[1].y - pair[0].y;
      return { distance: Math.max(1, Math.hypot(dx, dy)), x: (pair[0].x + pair[1].x) / 2, y: (pair[0].y + pair[1].y) / 2 };
    };
    viewport.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size >= 2) {
        const metrics = pairMetrics();
        pinchDistance = metrics ? metrics.distance : 1;
        dragPointerId = null;
        dragged = true;
        viewport.classList.add('is-pinching');
        event.preventDefault();
        return;
      }
      const map = lineage7MapState();
      dragPointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragOriginX = map.x;
      dragOriginY = map.y;
      dragged = false;
      viewport.classList.add('is-panning');
    });
    viewport.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' && pointers.has(event.pointerId)) pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size >= 2 && pinchDistance) {
        const metrics = pairMetrics();
        if (!metrics) return;
        event.preventDefault();
        const factor = metrics.distance / Math.max(1, pinchDistance);
        pinchDistance = metrics.distance;
        zoomLineage7Map(factor, metrics.x, metrics.y);
        return;
      }
      if (dragPointerId !== event.pointerId) return;
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) dragged = true;
      if (!dragged) return;
      if (viewport.setPointerCapture && !viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
      const map = lineage7MapState();
      map.x = dragOriginX + deltaX;
      map.y = dragOriginY + deltaY;
      event.preventDefault();
      applyLineage7MapTransform();
    }, { passive: false });
    const end = (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) {
        pinchDistance = 0;
        viewport.classList.remove('is-pinching');
      }
      if (dragPointerId !== event.pointerId) return;
      const wasDragged = dragged;
      dragPointerId = null;
      dragged = false;
      viewport.classList.remove('is-panning');
      if (event.pointerId !== undefined && viewport.hasPointerCapture && viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (wasDragged) {
        state.pan.suppressClick = true;
        clearTimeout(state.pan.suppressTimer);
        state.pan.suppressTimer = setTimeout(() => { state.pan.suppressClick = false; }, 350);
      }
    };
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
    viewport.addEventListener('wheel', (event) => {
      event.preventDefault();
      zoomLineage7Map(Math.exp(-event.deltaY * .0014), event.clientX, event.clientY);
    }, { passive: false });
  }

  function renderQueryLineage7() {
    const container = $('#query-lineage7-result');
    if (!container) return;
    const focus = state.query.lineage7Id === null ? null : getPerson(state.query.lineage7Id);
    if (!focus) {
      container.hidden = true;
      container.innerHTML = '';
      return;
    }

    const ancestors = [];
    let current = focus;
    for (let distance = 1; distance <= 3; distance += 1) {
      current = queryLineage7Parent(current);
      if (!current) break;
      ancestors.unshift({ person: current, role: 'ancestor', level: `上${distance}代` });
    }

    const descendantRows = [];
    let frontier = [focus];
    for (let distance = 1; distance <= 3; distance += 1) {
      const next = [];
      frontier.forEach((person) => queryLineage7Children(person).forEach((child) => {
        if (!next.some((item) => String(personId(item)) === String(personId(child)))) next.push(child);
      }));
      if (!next.length) break;
      descendantRows.push({ people: next, distance });
      frontier = next;
    }

    // 上下七代必须按“父在上、子在下”的真正树状结构展示，不能再使用
    // 带世代标签的横向列表，否则多子女和跨继关系会看起来像同级并列。
    const graphLevels = [];
    const samePerson = (a, b) => a && b && String(personId(a)) === String(personId(b));
    let adoptionTreeContext = null;
    ancestors.forEach((item) => {
      const key = String(personId(item.person));
      const relation = state.adoption.outById.get(key) || state.adoption.inById.get(key);
      if (!relation || !relation.biologicalParent || !relation.adoptiveParent) return;
      const biologicalParent = relation.biologicalParent;
      const adoptiveParent = relation.adoptiveParent;
      const commonParent = rawFatherOf(biologicalParent);
      const adoptiveCommonParent = rawFatherOf(adoptiveParent);
      if (commonParent && adoptiveCommonParent && samePerson(commonParent, adoptiveCommonParent) && ancestors.some((ancestor) => samePerson(ancestor.person, commonParent))) {
        adoptionTreeContext = { commonParent, relation, adoptedPerson: item.person };
      }
    });
    const adoptionTreeIds = adoptionTreeContext ? new Set([
      String(personId(adoptionTreeContext.commonParent)),
      String(personId(adoptionTreeContext.relation.biologicalParent)),
      String(personId(adoptionTreeContext.relation.adoptiveParent)),
      String(personId(adoptionTreeContext.adoptedPerson)),
    ]) : new Set();
    ancestors.forEach((item) => {
      const key = String(personId(item.person));
      if (adoptionTreeContext && samePerson(item.person, adoptionTreeContext.commonParent)) {
        graphLevels.push(queryLineage7AdoptionTreeHtml(adoptionTreeContext));
        graphLevels.push('<i class="query-lineage7-graph-connector" aria-hidden="true"></i>');
        return;
      }
      if (adoptionTreeIds.has(key)) return;
      graphLevels.push(`<div class="query-lineage7-graph-level is-single is-ancestor"><div class="query-lineage7-graph-label">${escapeHtml(item.level)}</div><div class="query-lineage7-graph-cards">${queryLineage7Card(item.person, item.role, item.level)}</div></div>`);
      graphLevels.push('<i class="query-lineage7-graph-connector" aria-hidden="true"></i>');
    });
    graphLevels.push(`<div class="query-lineage7-graph-level is-single is-focus"><div class="query-lineage7-graph-label">本人</div><div class="query-lineage7-graph-cards">${queryLineage7Card(focus, 'focus', '本人')}</div></div>`);
    descendantRows.forEach((row) => {
      graphLevels.push('<i class="query-lineage7-graph-connector" aria-hidden="true"></i>');
      graphLevels.push(`<div class="query-lineage7-graph-level ${row.people.length > 1 ? 'is-branch' : 'is-single'} is-descendant"><div class="query-lineage7-graph-label">下${row.distance}代</div><div class="query-lineage7-graph-cards">${row.people.map((person) => queryLineage7Card(person, 'descendant', `下${row.distance}代`)).join('')}</div></div>`);
    });

    const allPeople = [focus, ...ancestors.map((item) => item.person), ...descendantRows.flatMap((row) => row.people)];
    const total = ancestors.length + 1 + descendantRows.reduce((sum, row) => sum + row.people.length, 0);
    container.hidden = false;
    // “上下7代”只呈现上下七代树状世系；出继/入继关系单独在族人详情和
    // 族人信息页面查看，避免在树状结果中重复插入一整块关系卡片。
    container.innerHTML = `<div class="query-lineage7-result-head"><div><strong>${escapeHtml(text(focus.name))} · 上下7代树状世系</strong><span>上三代 ${ancestors.length} 人 · 本人 1 人 · 下三代 ${total - ancestors.length - 1} 人</span></div><button type="button" class="query-secondary" data-action="query-lineage7-clear">重新查询</button></div><div class="query-lineage7-map-shell"><div class="query-lineage7-map-toolbar" role="toolbar" aria-label="上下7代世系图工具"><span>世系图</span><button type="button" data-action="query-lineage7-fit" title="适应可视区域">适应</button><button type="button" data-action="query-lineage7-zoom-out" title="缩小">−</button><output data-lineage7-zoom>100%</output><button type="button" data-action="query-lineage7-zoom-in" title="放大">＋</button><button type="button" data-action="query-lineage7-reset" title="复位到100%">复位</button></div><div class="query-lineage7-map-viewport" data-lineage7-viewport tabindex="0" aria-label="上下7代树状世系图，可缩放和平移"><div class="query-lineage7-map-canvas" data-lineage7-canvas><div class="query-lineage7-tree"><div class="query-lineage7-graph">${graphLevels.join('')}</div></div></div></div><p class="query-lineage7-map-tip">滚轮缩放，拖动平移；手机可单指拖动、双指缩放</p></div>`;
    window.requestAnimationFrame(() => {
      wireLineage7Map();
      fitLineage7Map();
    });
  }

  function runLineage7Query(requestedId = null) {
    const result = $('#query-lineage7-result');
    const requestedPerson = requestedId ? getPerson(requestedId) : null;
    if (requestedPerson) {
      state.query.lineage7Id = personId(requestedPerson);
      renderQueryLineage7();
      return;
    }
    const input = $('#query-search');
    const keyword = text(input && input.value || state.query.keyword).trim();
    if (!keyword) {
      state.query.lineage7Id = null;
      if (result) { result.hidden = false; result.innerHTML = '<p class="query-muted query-lineage7-empty">请输入要查询的族人姓名。</p>'; }
      return;
    }
    const exact = state.peopleByName.get(keyword) || [];
    const candidates = exact.length ? exact : state.data.filter((person) => text(person.name).trim().toLowerCase().includes(keyword.toLowerCase()));
    if (candidates.length > 1) {
      showPersonDisambiguation(keyword, candidates, (person) => {
        state.query.lineage7Id = personId(person);
        renderQueryLineage7();
      });
      return;
    }
    if (candidates.length === 1) {
      state.query.lineage7Id = personId(candidates[0]);
      renderQueryLineage7();
      return;
    }
    state.query.lineage7Id = null;
    if (result) { result.hidden = false; result.innerHTML = `<p class="query-muted query-lineage7-empty">没有找到“${escapeHtml(keyword)}”。请按族谱中的姓名重新输入。</p>`; }
  }

  function personChoiceDescription(person) {
    const father = rawFatherOf(person);
    const adoption = queryAdoptionLabel(person);
    return [
      viewGenerationLabel(person),
      text(person.branch) || '未标注支系',
      father ? `父亲：${text(father.name)}` : '父亲未详',
      adoption || '',
      `ID ${personId(person)}`
    ].filter(Boolean).join(' · ');
  }

  function ensureDisambiguationModal() {
    if ($('#person-disambiguation-modal')) return;
    const modal = document.createElement('section');
    modal.id = 'person-disambiguation-modal';
    modal.className = 'person-disambiguation-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'person-disambiguation-title');
    modal.innerHTML = `<div class="person-disambiguation-shell"><header><div><span class="eyebrow">SAME NAME CHECK</span><h3 id="person-disambiguation-title">请选择具体族人</h3><p id="person-disambiguation-summary"></p></div><button data-action="close-person-disambiguation" aria-label="关闭">×</button></header><div id="person-disambiguation-list" class="person-disambiguation-list"></div></div>`;
    document.body.appendChild(modal);
  }

  function closePersonDisambiguation() {
    const modal = $('#person-disambiguation-modal');
    if (modal) modal.hidden = true;
    disambiguationCallback = null;
    document.documentElement.classList.remove('is-person-disambiguation-open');
  }

  function showPersonDisambiguation(name, candidates, callback) {
    ensureDisambiguationModal();
    const modal = $('#person-disambiguation-modal');
    const list = $('#person-disambiguation-list');
    const summary = $('#person-disambiguation-summary');
    if (!modal || !list || !candidates || candidates.length < 2) return false;
    disambiguationCallback = callback;
    summary.textContent = `族谱中有 ${candidates.length} 位“${name}”。系统不会自动猜测，请根据父亲、世次和支系选择。`;
    list.innerHTML = candidates.map((person) => `<button data-action="pick-person-disambiguation" data-id="${escapeHtml(personId(person))}"><strong>${escapeHtml(text(person.name))}</strong><span>${escapeHtml(personChoiceDescription(person))}</span></button>`).join('');
    modal.hidden = false;
    document.documentElement.classList.add('is-person-disambiguation-open');
    const first = list.querySelector('button');
    if (first) first.focus();
    return true;
  }

  function choosePersonDisambiguation(id) {
    const callback = disambiguationCallback;
    const person = getPerson(id);
    closePersonDisambiguation();
    if (callback && person) callback(person);
  }

  function runQuerySearch() {
    renderQuerySearchResults();
    const keyword = text(state.query.keyword).trim();
    if (!keyword) return;
    const exact = queryPeople().filter((person) => text(person.name).trim() === keyword);
    if (exact.length > 1) {
      showPersonDisambiguation(keyword, exact, (person) => selectPerson(personId(person), { forceRender: true }));
    }
  }

  function queryCandidates(value) {
    const raw = text(value).trim();
    if (!raw) return [];
    const exact = state.peopleByName.get(raw) || [];
    if (exact.length) return exact;
    const lowered = raw.toLowerCase();
    return queryPeople().filter((person) => text(person.name).toLowerCase().includes(lowered)).slice(0, 16);
  }

  function renderQueryRelationCandidates() {
    const container = $('#query-relation-candidates');
    if (!container) return;
    const renderSide = (side, value, chosenId) => {
      const candidates = queryCandidates(value);
      if (!candidates.length || chosenId) return '';
      return `<div class="query-candidate-group"><span class="query-muted">${side === 'a' ? '请选择第一个人' : '请选择第二个人'}：</span>${candidates.map((person) => `<button class="query-candidate" data-action="query-pick-relation" data-side="${side}" data-id="${escapeHtml(personId(person))}">${escapeHtml(text(person.name))} · ID ${escapeHtml(personId(person))}</button>`).join('')}</div>`;
    };
    container.innerHTML = renderSide('a', state.query.relationA, state.query.relationAId) + renderSide('b', state.query.relationB, state.query.relationBId);
  }

  function queryAncestorChain(person) {
    const chain = [];
    const visited = new Set();
    let current = person;
    while (current && !visited.has(String(personId(current))) && chain.length < 300) {
      chain.push(current);
      const key = String(personId(current));
      visited.add(key);
      const displayParent = state.adoption.displayParentById.get(key);
      current = displayParent ? getPerson(displayParent) : rawFatherOf(current);
    }
    return chain;
  }

  function ensureRootTraceModal() {
    if ($('#root-trace-modal')) return;
    const modal = document.createElement('section');
    modal.id = 'root-trace-modal';
    modal.className = 'root-trace-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'root-trace-title');
    modal.innerHTML = `<div class="root-trace-shell"><header class="root-trace-head"><div><span class="eyebrow">ROOT LINEAGE</span><h3 id="root-trace-title">寻根直线世系</h3><p id="root-trace-summary"></p></div><div class="root-trace-head-actions"><button id="root-trace-fullscreen" class="root-trace-fullscreen" data-action="toggle-root-trace-fullscreen" aria-label="全屏查看寻根世系">⛶ 全屏</button><button class="root-trace-close" data-action="close-root-trace" aria-label="关闭寻根世系">×</button></div></header><div id="root-trace-content" class="root-trace-content"></div></div>`;
    document.body.appendChild(modal);
    if (!window._rootTraceFullscreenBound) {
      document.addEventListener('fullscreenchange', updateRootTraceFullscreenButton);
      window._rootTraceFullscreenBound = true;
    }
  }

  function updateRootTraceFullscreenButton() {
    const button = $('#root-trace-fullscreen');
    const modal = $('#root-trace-modal');
    if (!button || !modal) return;
    const active = document.fullscreenElement === modal || modal.classList.contains('is-browser-fullscreen');
    button.textContent = active ? '⛶ 退出全屏' : '⛶ 全屏';
    button.setAttribute('aria-label', active ? '退出全屏查看寻根世系' : '全屏查看寻根世系');
  }

  async function toggleRootTraceFullscreen() {
    const modal = $('#root-trace-modal');
    if (!modal) return;
    try {
      if (document.fullscreenElement === modal) {
        await document.exitFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        if (modal.requestFullscreen) await modal.requestFullscreen();
      } else if (modal.requestFullscreen) {
        await modal.requestFullscreen();
      } else {
        modal.classList.toggle('is-browser-fullscreen');
      }
    } catch (error) {
      // 部分手机浏览器不允许脚本调用原生全屏，使用铺满视口的兼容模式。
      modal.classList.toggle('is-browser-fullscreen');
    }
    updateRootTraceFullscreenButton();
  }

  function closeRootTrace() {
    const modal = $('#root-trace-modal');
    if (!modal) return;
    const rootOrigin = new URLSearchParams(window.location.search).get('rootOrigin');
    if (rootOrigin === 'home-search') {
      // 首页搜索是一个独立的直达流程；关闭寻根结果时回到首页，而不是回到中间世系图页。
      window.location.replace('../index.html');
      return;
    }
    if (document.fullscreenElement === modal && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    modal.classList.remove('is-browser-fullscreen');
    modal.hidden = true;
    document.body.classList.remove('is-root-trace-open');
  }

  function rootTraceRelationHtml(person, mainChain) {
    const key = String(personId(person));
    const relation = state.adoption.outById.get(key) || state.adoption.inById.get(key) || null;
    const rawFather = rawFatherOf(person);
    const displayParentId = state.adoption.displayParentById.get(key);
    const displayParent = displayParentId !== undefined ? getPerson(displayParentId) : rawFather;
    if (!relation && (!rawFather || !displayParent || String(personId(rawFather)) === String(personId(displayParent)))) return '';
    const biological = relation ? relation.biologicalParent : rawFather;
    const adoptive = relation ? relation.adoptiveParent : displayParent;
    let biologicalBranch = '';
    if (biological) {
      const mainIds = new Set((mainChain || []).map((member) => String(personId(member))));
      const biologicalChain = queryAncestorChain(biological).reverse();
      let commonIndex = -1;
      biologicalChain.forEach((member, index) => {
        if (mainIds.has(String(personId(member)))) commonIndex = index;
      });
      const branch = biologicalChain.slice(commonIndex >= 0 ? commonIndex : 0);
      if (branch.length) {
        const common = commonIndex >= 0 ? branch[0] : null;
        biologicalBranch = `<div class="root-trace-bio-branch"><b>亲生父系支线${common ? `（由共同祖先“${escapeHtml(text(common.name))}”分出）` : ''}</b><div class="root-trace-bio-chain">${branch.map((member, index) => `<span class="root-trace-bio-node${index === 0 && common ? ' is-common' : ''}${index === branch.length - 1 ? ' is-biological-father' : ''}"><small>第${escapeHtml(generationOf(member) || '—')}世</small><strong>${escapeHtml(text(member.name) || '未命名')}</strong></span>`).join('<i aria-hidden="true">→</i>')}<i aria-hidden="true">→</i><span class="root-trace-bio-node is-adopted-person"><small>第${escapeHtml(generationOf(person) || '—')}世</small><strong>${escapeHtml(text(person.name))}</strong><em>出继</em></span></div></div>`;
      }
    }
    return `<aside class="root-trace-adoption"><strong>出继 / 入继关系</strong><span>亲生父亲：${escapeHtml(biological ? text(biological.name) : '未详')}${biological ? `（ID ${escapeHtml(personId(biological))}）` : ''}</span><span>继父（承嗣父）：${escapeHtml(adoptive ? text(adoptive.name) : '未详')}${adoptive ? `（ID ${escapeHtml(personId(adoptive))}）` : ''}</span>${relation && relation.source ? `<small>谱载：${escapeHtml(relation.source)}</small>` : ''}${biologicalBranch}</aside>`;
  }

  function rootTracePersonBox(person, extraClass = '', badge = '') {
    return `<div class="root-trace-family-card ${extraClass}"><small>第${escapeHtml(generationOf(person) || '—')}世</small><strong>${escapeHtml(text(person.name) || '未命名')}</strong>${badge ? `<em>${escapeHtml(badge)}</em>` : ''}</div>`;
  }

  function rootTraceAdoptionTreeHtml(ancestor, relation, adoptedPerson) {
    const biological = relation.biologicalParent;
    const adoptive = relation.adoptiveParent;
    const children = childrenOf(ancestor).filter((child) => generationOf(child) === generationOf(biological));
    const ordered = children.length ? children : [biological, adoptive].filter(Boolean);
    const columns = Math.max(2, ordered.length);
    const childCards = ordered.map((child) => {
      const isBiological = biological && String(personId(child)) === String(personId(biological));
      const isAdoptive = adoptive && String(personId(child)) === String(personId(adoptive));
      return rootTracePersonBox(child, `${isBiological ? 'is-biological-father' : ''}${isAdoptive ? ' is-adoptive-father' : ''}`, isBiological ? '亲生父亲' : isAdoptive ? '继父（承嗣父）' : '昌申之子');
    }).join('');
    const biologicalIndex = Math.max(0, ordered.findIndex((child) => biological && String(personId(child)) === String(personId(biological))));
    const adoptiveIndex = Math.max(0, ordered.findIndex((child) => adoptive && String(personId(child)) === String(personId(adoptive))));
    const childX = (index) => ((index + .5) / columns) * 100;
    return `<article class="root-trace-family-tree" style="--family-columns:${columns}">
      <div class="root-trace-family-ancestor">${rootTracePersonBox(ancestor, 'is-family-root', '父')}</div>
      <div class="root-trace-family-children">${childCards}</div>
      <div class="root-trace-family-descendant">${rootTracePersonBox(adoptedPerson, 'is-adopted-child', '出继 / 入继')}</div>
      <svg class="root-trace-family-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="family-sibling-line" d="M50 5 V20 M${childX(0)} 20 H${childX(columns - 1)} M${ordered.map((child, index) => `${childX(index)} 20 V38`).join(' M')}" />
        <path class="family-birth-line" d="M${childX(biologicalIndex)} 56 V76 H50 V91" />
        <path class="family-adoption-line" d="M${childX(adoptiveIndex)} 56 C${childX(adoptiveIndex)} 72, 64 75, 52 88" />
      </svg>
      <span class="family-birth-label">亲生父子</span><span class="family-adoption-label">出继给${escapeHtml(text(adoptive.name) || '承嗣父')}为嗣</span>
      ${relation.source ? `<p class="root-trace-family-source">谱载：${escapeHtml(relation.source)}</p>` : ''}
    </article>`;
  }

  function rootTraceChildren(person) {
    if (!person) return [];
    const candidates = new Map();
    const addCandidate = (child) => {
      if (!child) return;
      const key = String(personId(child));
      if (key !== String(personId(person)) && !isHiddenAdoptionRecord(child)) candidates.set(key, child);
    };
    const addChildrenOf = (record) => {
      if (!record) return;
      treeChildren(record).forEach(addCandidate);
      // 直达寻根必须以统一主数据中的 father_id 为最终兜底。
      // 同名的出继/入继记录可能被展示树映射到承嗣父，不能因此漏掉亲生子女。
      state.data.filter((child) => {
        const father = rawFatherOf(child);
        return father && String(personId(father)) === String(personId(record));
      }).forEach(addCandidate);
    };
    // 首页直达寻根既要保留正常子女，也要兼容同一人物的亲生记录与入继记录。
    // 这样目标人物是出继/入继记录时，子女不会因为记录 ID 不同而消失。
    addChildrenOf(person);
    const outgoing = state.adoption.outById.get(String(personId(person)));
    if (outgoing) addChildrenOf(outgoing.adoptiveRecord || outgoing.outPerson);
    const incoming = state.adoption.inById.get(String(personId(person)));
    if (incoming) addChildrenOf(incoming.outPerson || incoming.adoptiveRecord);
    return Array.from(candidates.values()).sort((a, b) =>
      (generationOf(a) || 9999) - (generationOf(b) || 9999) ||
      text(a.name).localeCompare(text(b.name), 'zh-CN') || Number(personId(a)) - Number(personId(b))
    );
  }

  function rootTraceChildrenHtml(person, mainChain) {
    const children = rootTraceChildren(person);
    const childCards = children.map((child) => {
      const relation = state.adoption.outById.get(String(personId(child))) || state.adoption.inById.get(String(personId(child))) || null;
      const tags = adoptionTags(child).map((tag) => tag.label).join(' / ');
      const cardClass = relation ? 'is-adopted-child' : '';
      return rootTracePersonBox(child, cardClass, tags || '子女');
    }).join('');
    const adoptionDetails = children.map((child) => {
      const relation = state.adoption.outById.get(String(personId(child))) || state.adoption.inById.get(String(personId(child))) || null;
      const biological = rawFatherOf(child);
      const displayParentId = state.adoption.displayParentById.get(String(personId(child)));
      const displayParent = displayParentId !== undefined ? getPerson(displayParentId) : biological;
      const hasDifferentParent = biological && displayParent && String(personId(biological)) !== String(personId(displayParent));
      return relation || hasDifferentParent ? rootTraceRelationHtml(child, mainChain) : '';
    }).join('');
    return `<section class="root-trace-children" aria-labelledby="root-trace-children-title">
      <header class="root-trace-children-head"><div><span class="eyebrow">NEXT GENERATION</span><h4 id="root-trace-children-title">${escapeHtml(text(person.name) || '目标人物')}的直系子女</h4></div><span class="root-trace-children-count">${children.length} 人</span></header>
      ${children.length ? `<div class="root-trace-children-connector" aria-hidden="true"></div><div class="root-trace-children-grid">${childCards}</div>${adoptionDetails}` : '<p class="root-trace-children-empty">当前统一族谱数据未记录该人物的直系下一代。</p>'}
    </section>`;
  }

  function openRootTraceSearch(keyword) {
    const query = text(keyword).trim();
    if (!query) return;
    const exact = state.data.filter((person) => text(person.name).trim() === query);
    const candidates = exact.length ? exact : state.data.filter((person) => text(person.name).toLowerCase().includes(query.toLowerCase()));
    if (candidates.length > 1) {
      showPersonDisambiguation(query, candidates, (person) => {
        state.selectedId = personId(person);
        openRootTrace(personId(person));
      });
      return;
    }
    if (candidates.length === 1) {
      state.selectedId = personId(candidates[0]);
      openRootTrace(personId(candidates[0]));
      return;
    }
    showToast(`没有找到“${query}”，请按族谱中的姓名重新输入`);
  }

  function openRootTrace(id) {
    ensureRootTraceModal();
    const person = getPerson(id);
    const modal = $('#root-trace-modal');
    const content = $('#root-trace-content');
    const summary = $('#root-trace-summary');
    if (!person || !modal || !content) return;
    const chain = queryAncestorChain(person).reverse();
    const adoptionTrees = new Map();
    const skipTreeNodes = new Set();
    chain.forEach((member) => {
      const relation = state.adoption.inById.get(String(personId(member))) || state.adoption.outById.get(String(personId(member))) || null;
      if (!relation || !relation.biologicalParent || !relation.adoptiveParent) return;
      const biologicalFather = rawFatherOf(relation.biologicalParent);
      const adoptiveFather = rawFatherOf(relation.adoptiveParent);
      if (!biologicalFather || !adoptiveFather || String(personId(biologicalFather)) !== String(personId(adoptiveFather))) return;
      adoptionTrees.set(String(personId(biologicalFather)), { ancestor: biologicalFather, relation, person: member });
      skipTreeNodes.add(String(personId(relation.biologicalParent)));
      skipTreeNodes.add(String(personId(relation.adoptiveParent)));
      skipTreeNodes.add(String(personId(member)));
    });
    const startsAtYandi = chain.length && text(chain[0].name).trim().includes('炎帝');
    if (summary) summary.textContent = `${startsAtYandi ? '炎帝始祖' : '当前数据可追溯始祖'} → ${text(person.name)} · 共 ${chain.length} 代节点`;
    content.innerHTML = `${!startsAtYandi ? '<div class="root-trace-warning">当前数据链未直接抵达“炎帝”记录，以下展示现有数据能够完整追溯的最早世系。</div>' : ''}<div class="root-trace-line">${chain.map((member, index) => {
      const tree = adoptionTrees.get(String(personId(member)));
      if (tree) return rootTraceAdoptionTreeHtml(tree.ancestor, tree.relation, tree.person);
      if (skipTreeNodes.has(String(personId(member)))) return '';
      const tags = adoptionTags(member).map((tag) => tag.label).join(' / ');
      return `<article class="root-trace-node${index === 0 ? ' is-root' : ''}${index === chain.length - 1 ? ' is-target' : ''}"><div class="root-trace-card"><span>第${escapeHtml(generationOf(member) || '—')}世</span><strong>${escapeHtml(text(member.name) || '未命名')}</strong>${tags ? `<em>${escapeHtml(tags)}</em>` : ''}<small>${escapeHtml(text(member.branch) || '')}</small></div>${rootTraceRelationHtml(member, chain)}</article>`;
    }).join('')}</div>${rootTraceChildrenHtml(person, chain)}`;
    modal.hidden = false;
    document.body.classList.add('is-root-trace-open');
    modal.scrollTop = 0;
  }

  function directAncestorTerm(person, distance) {
    const sex = genderLabel(person) === '女' ? '母' : '父';
    if (distance === 1) return sex === '母' ? '母亲' : '父亲';
    if (distance === 2) return sex === '母' ? '外祖母/祖母' : '祖父';
    if (distance === 3) return sex === '母' ? '曾祖母' : '曾祖父';
    if (distance === 4) return sex === '母' ? '高祖母' : '高祖父';
    return '第' + distance + '代祖先';
  }

  function collateralTerm(person, distanceFromCommon, direction) {
    const sex = genderLabel(person) === '女' ? '女' : '男';
    if (distanceFromCommon === 1 && direction === 'senior') return sex === '女' ? '姑母' : '叔伯';
    if (distanceFromCommon === 2 && direction === 'junior') return sex === '女' ? '侄女/外甥女' : '侄子/外甥';
    if (distanceFromCommon === 2 && direction === 'senior') return sex === '女' ? '姑祖母' : '叔祖父';
    return '';
  }

  function queryRelationText(p1, p2, path1, path2, common, d1, d2) {
    // 所有距离均按实际 father_id / 承嗣归属链计数，不按“第几世”数字或列表相邻项推断父子。
    if (path1.some((person) => String(personId(person)) === String(personId(p2)))) {
      const distance = path1.findIndex((person) => String(personId(person)) === String(personId(p2)));
      return `${text(p1.name)}称${text(p2.name)}为${directAncestorTerm(p2, distance)}（实际父系链相隔${distance}层）`;
    }
    if (path2.some((person) => String(personId(person)) === String(personId(p1)))) {
      const distance = path2.findIndex((person) => String(personId(person)) === String(personId(p1)));
      return `${text(p2.name)}称${text(p1.name)}为${directAncestorTerm(p1, distance)}（实际父系链相隔${distance}层）`;
    }
    if (common && d1 === 1 && d2 === 1) {
      return `${text(p1.name)}与${text(p2.name)}为同父兄弟/姐妹，彼此称兄弟或姐妹`;
    }
    if (common && d1 === 1 && d2 > 1) {
      const term = collateralTerm(p1, d1, 'senior') || '叔伯/姑母辈';
      return `${text(p2.name)}称${text(p1.name)}为${term}（实际父系链相隔${d2 - d1}层）`;
    }
    if (common && d2 === 1 && d1 > 1) {
      const term = collateralTerm(p2, d2, 'senior') || '叔伯/姑母辈';
      return `${text(p1.name)}称${text(p2.name)}为${term}（实际父系链相隔${d1 - d2}层）`;
    }
    if (common && d1 === d2) {
      return `${text(p1.name)}与${text(p2.name)}为同辈旁系亲属，彼此称堂兄弟/堂姐妹`;
    }
    if (common) {
      return `${text(p1.name)}与${text(p2.name)}为旁系亲属，称谓需按实际房次核定（共同父系：${text(common.name)}）`;
    }
    return '未找到共同父系路径，不能仅凭世次数字推断称谓';
  }

  function renderQueryRelation() {
    const result = $('#query-relation-result');
    if (!result) return;
    const resolve = (value, id) => {
      if (id) return getPerson(id);
      const candidates = queryCandidates(value);
      return candidates.length === 1 ? candidates[0] : null;
    };
    const p1 = resolve(state.query.relationA, state.query.relationAId);
    const p2 = resolve(state.query.relationB, state.query.relationBId);
    renderQueryRelationCandidates();
    result.hidden = false;
    if (!p1 || !p2) {
      result.innerHTML = '<strong>请先选择人物</strong><span>同名人物需要在下方按 ID 选择，避免把两个同名锡圭、学考或水财混为一人。</span>';
      return;
    }
    if (String(personId(p1)) === String(personId(p2))) {
      result.innerHTML = `<strong>同一人物记录</strong><span>${escapeHtml(text(p1.name))} · ID ${escapeHtml(personId(p1))}</span>`;
      return;
    }
    const spouse1 = text(p1.spouse_ids).split(/[、，,;；\s]+/).filter(Boolean);
    const spouse2 = text(p2.spouse_ids).split(/[、，,;；\s]+/).filter(Boolean);
    if (spouse1.includes(text(p2.name)) || spouse1.includes(String(personId(p2))) || spouse2.includes(text(p1.name)) || spouse2.includes(String(personId(p1)))) {
      result.innerHTML = `<strong>夫妻 / 配偶关系</strong><span>${escapeHtml(text(p1.name))} ↔ ${escapeHtml(text(p2.name))}</span>`;
      return;
    }
    const path1 = queryAncestorChain(p1);
    const path2 = queryAncestorChain(p2);
    const index2 = new Map(path2.map((person, index) => [String(personId(person)), { person, index }]));
    let common = null; let d1 = -1; let d2 = -1;
    path1.some((person, index) => {
      const hit = index2.get(String(personId(person)));
      if (!hit) return false;
      common = person; d1 = index; d2 = hit.index; return true;
    });
    const relation = queryRelationText(p1, p2, path1, path2, common, d1, d2);
    const pathText = `<span class="query-path">${path1.map((person) => escapeHtml(text(person.name))).join(' ← ')}</span><br><span class="query-path">${path2.map((person) => escapeHtml(text(person.name))).join(' ← ')}</span>`;
    result.innerHTML = `<strong>${escapeHtml(relation)}</strong><span>查询人物：${escapeHtml(text(p1.name))}（ID ${escapeHtml(personId(p1))}）与 ${escapeHtml(text(p2.name))}（ID ${escapeHtml(personId(p2))}）${common ? ` · 共同父系：${escapeHtml(text(common.name))}` : ''}</span><div class="query-path" style="margin-top:7px">${pathText}</div>`;
  }

  function renderQueryDashboard() {
    if (!$('#query-drawer')) return;
    renderQueryStats();
    renderQueryAudit();
    renderAdoptionTable();
    renderQueryTimeline();
    renderQuerySearchResults();
    renderQueryRelationCandidates();
    renderQueryLineage7();
  }

  function toggleQueryDrawer() {
    // 从人物详情返回查询时，恢复完整查询界面；详情专用模式只服务于手机端的“详情”结果。
    setDetailOnlyMode(false);
    state.query.open = !state.query.open;
    const drawer = $('#query-drawer');
    const shell = $('#app');
    if (drawer) drawer.hidden = !state.query.open;
    if (shell) shell.classList.toggle('is-query-open', state.query.open);
    $$('.query-toggle').forEach((button) => {
      button.setAttribute('aria-expanded', String(state.query.open));
      if (button.dataset.action === 'toggle-query-drawer' && button.classList.contains('query-toggle')) button.textContent = state.query.open ? '关闭查询' : '族谱查询';
    });
    if (state.query.open) renderQueryDashboard();
    updateMobileLineageSelectionBackButton();
  }

  function setDetailOnlyMode(open) {
    const shell = $('#app');
    state.detailOnly = Boolean(open) && isMobileViewport() && !IS_ADMIN;
    if (shell) shell.classList.toggle('is-detail-only', state.detailOnly);
  }

  function restoreMobilePeopleQuery() {
    if (IS_ADMIN || !isMobileViewport()) return;
    const shell = $('#app');
    const drawer = $('#query-drawer');
    state.query.open = true;
    if (drawer) drawer.hidden = false;
    if (shell) shell.classList.add('is-query-open');
    setMobileQueryMode('people');
  }

  function returnToPeopleQuery() {
    if (IS_ADMIN) return;
    flushDraftAutoSave();
    closeMobileQueryMenu();
    setDetailOnlyMode(false);
    state.selectedId = null;
    state.mode = 'view';
    renderDetail();
    updateSelectedCardUI();
    const shell = $('#app');
    const drawer = $('#query-drawer');
    state.query.open = true;
    if (drawer) drawer.hidden = false;
    if (shell) shell.classList.add('is-query-open');
    setMobileQueryMode('people');
  }

  function closeMobileQueryMenu() {
    const menu = $('#mobile-query-menu');
    if (menu) menu.hidden = true;
    document.documentElement.classList.remove('is-mobile-query-menu-open');
  }

  function updateMobileLineageSelectionBackButton() {
    const button = $('#mobile-lineage-selection-back');
    if (!button) return;
    const visible = !IS_ADMIN
      && isMobileViewport()
      && state.view !== 'overview'
      && !state.query.open
      && !state.detailOnly;
    button.hidden = !visible;
  }

  function returnToMobileLineageSelection() {
    if (IS_ADMIN || !isMobileViewport()) return;
    flushDraftAutoSave();
    closeMobileQueryMenu();
    setDetailOnlyMode(false);
    state.selectedId = null;
    state.mode = 'view';
    renderDetail();
    updateSelectedCardUI();
    const drawer = $('#query-drawer');
    const shell = $('#app');
    state.query.open = true;
    if (drawer) drawer.hidden = false;
    if (shell) shell.classList.add('is-query-open');
    setMobileQueryMode('lineage');
    updateMobileLineageSelectionBackButton();
  }

  function openMobileQueryMenu() {
    const menu = $('#mobile-query-menu');
    if (!menu) return;
    menu.hidden = false;
    document.documentElement.classList.add('is-mobile-query-menu-open');
    document.documentElement.classList.remove('is-chooser-pending');
  }

  function focusQueryField(id) {
    window.setTimeout(() => {
      const input = $(`#${id}`);
      if (!input) return;
      input.focus({ preventScroll: true });
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  function setMobileQueryMode(mode) {
    if (!['people', 'generation', 'relation', 'lineage', 'info'].includes(mode)) return;
    state.query.mobileMode = mode;
    const drawer = $('#query-drawer');
    if (drawer) drawer.dataset.mobileMode = mode;
    const title = drawer && drawer.querySelector('.query-drawer-head h3');
    if (title) title.textContent = mode === 'people' ? '查族人' : mode === 'generation' ? '查世代' : mode === 'lineage' ? '查世系图' : mode === 'info' ? '族人信息' : '查关系';
    const switcher = $('.mobile-query-switcher');
    if (switcher) switcher.hidden = mode === 'info';
    const peopleTitle = $('.query-people-section h4');
    if (peopleTitle) peopleTitle.textContent = mode === 'generation' ? '按世次查看族人' : '';
    $$('.mobile-query-switcher [data-route]').forEach((button) => {
      const active = button.dataset.route === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    const people = $('.query-people-section');
    const generation = $('.query-timeline-section');
    const relation = $('.query-relation-section');
    const adoption = $('.query-adoption-section');
    const lineage = $('.query-lineage-section');
    const lineage7 = $('.query-lineage7-section');
    const generationActions = $('#query-generation-actions');
    if (people) people.hidden = mode !== 'people';
    if (generation) generation.hidden = mode !== 'generation';
    if (relation) relation.hidden = mode !== 'relation';
    if (adoption) adoption.hidden = mode !== 'info';
    if (lineage) lineage.hidden = mode !== 'lineage';
    // “上下7代”属于查族人的延伸查询，不再放在查世系图入口中。
    if (lineage7) lineage7.hidden = mode !== 'people';
    if (generationActions) generationActions.hidden = mode !== 'generation';
    renderQueryDashboard();
    if (mode === 'people') focusQueryField('query-search');
    if (mode === 'generation') focusQueryField('query-generation-single');
    if (mode === 'relation') focusQueryField('query-relation-a');
  }

  function openMobileQueryRoute(route) {
    closeMobileQueryMenu();
    if (route === 'lineage') {
      if (!state.query.open) toggleQueryDrawer();
      setMobileQueryMode('lineage');
      return;
    }
    if (!state.query.open) toggleQueryDrawer();
    setMobileQueryMode(route);
  }

  function openLineageViewFromQuery(element) {
    const view = element?.dataset?.view;
    if (!VIEW_DEFS[view]) return;
    // 选择世系图后必须回到图面本身。此前这里先切图、再保留查询抽屉，
    // 抽屉会盖住树图区，用户看起来就像“点击后没有世系图”。
    closeMobileQueryMenu();
    if (state.query.open) toggleQueryDrawer();
    const sublineage = view === 'main' && MAIN_SUBLINEAGES[element.dataset.sublineage]
      ? element.dataset.sublineage
      : null;
    switchView(view, sublineage ? {
      sublineage,
      lineageRootId: element.dataset.lineageRoot,
      lineageTargetId: element.dataset.lineageTarget,
      focusId: element.dataset.lineageTarget
    } : undefined);
  }

  function chooseGenerationQuery(kind) {
    setMobileQueryMode('generation');
    const from = $('#query-gen-from');
    const to = $('#query-gen-to');
    if (kind === 'single') {
      if (from) from.placeholder = '输入世次，例如 160';
      if (to) { to.value = ''; to.placeholder = '单世查询时留空'; }
      focusQueryField('query-gen-from');
    } else {
      if (from) from.placeholder = '起始世次，例如 150';
      if (to) to.placeholder = '结束世次，例如 160';
      focusQueryField('query-gen-from');
    }
  }

  function mobileBackOneLevel() {
    const rootTrace = $('#root-trace-modal');
    if (rootTrace && !rootTrace.hidden) {
      closeRootTrace();
      return;
    }
    const mobileQueryMenu = $('#mobile-query-menu');
    if (mobileQueryMenu && !mobileQueryMenu.hidden) {
      closeMobileQueryMenu();
      return;
    }
    const globalNav = $('#global-nav-overlay');
    if (globalNav && !globalNav.hidden) {
      setGlobalNav(false);
      return;
    }
    if (state.query.open) {
      toggleQueryDrawer();
      return;
    }
    if (state.immersive) {
      toggleImmersive();
      return;
    }
    if (state.selectedId !== null || state.mode !== 'view') {
      flushDraftAutoSave();
      state.selectedId = null;
      state.mode = 'view';
      state.draftId = null;
      state.draftParentId = null;
      renderDetail();
      updateSelectedCardUI();
      showToast('已返回当前世系图');
      return;
    }
    if (state.view === 'main' && state.mainFocusId) {
      focusMainBranch(null);
      return;
    }
    if (state.view !== 'overview') {
      switchView('overview');
      return;
    }
    if (window.history.length > 1 && document.referrer && new URL(document.referrer, window.location.href).origin === window.location.origin) {
      window.history.back();
      return;
    }
    window.location.href = '../index.html';
  }

  function clearQuery() {
    state.query.keyword = '';
    state.query.genFrom = '';
    state.query.genTo = '';
    state.query.gender = '';
    state.query.alive = '';
    state.query.lineage7Id = null;
    ['query-search', 'query-gen-from', 'query-gen-to', 'query-gender', 'query-alive'].forEach((id) => { const input = $(`#${id}`); if (input) input.value = ''; });
    renderQueryDashboard();
  }

  function pickQueryRelation(side, id) {
    const person = getPerson(id);
    if (!person) return;
    if (side === 'a') { state.query.relationAId = personId(person); state.query.relationA = text(person.name); }
    else { state.query.relationBId = personId(person); state.query.relationB = text(person.name); }
    const input = $(`#query-relation-${side}`);
    if (input) input.value = text(person.name);
    renderQueryRelationCandidates();
    showToast(`已选择${text(person.name)} · ID ${personId(person)}`);
  }

  function selectQueryGeneration(generation) {
    state.query.genFrom = String(generation);
    state.query.genTo = String(generation);
    const from = $('#query-gen-from'); const to = $('#query-gen-to');
    if (from) from.value = String(generation); if (to) to.value = String(generation);
    const single = $('#query-generation-single'); const rangeFrom = $('#query-generation-from'); const rangeTo = $('#query-generation-to');
    if (single) single.value = String(generation); if (rangeFrom) rangeFrom.value = String(generation); if (rangeTo) rangeTo.value = String(generation);
    renderQueryTimeline();
    renderQuerySearchResults();
    showToast(`已筛选第${generation}世，点击结果即可定位人物`);
  }

  function runGenerationQuery(kind) {
    const single = $('#query-generation-single');
    const rangeFrom = $('#query-generation-from');
    const rangeTo = $('#query-generation-to');
    let from = kind === 'single' ? Number(single && single.value) : Number(rangeFrom && rangeFrom.value);
    let to = kind === 'single' ? from : Number(rangeTo && rangeTo.value);
    if (!Number.isInteger(from) || from < 1 || from > 165 || !Number.isInteger(to) || to < 1 || to > 165) {
      showToast('请输入有效的世次数字（1—165）');
      return;
    }
    if (from > to) [from, to] = [to, from];
    state.query.genFrom = String(from);
    state.query.genTo = String(to);
    const oldFrom = $('#query-gen-from'); const oldTo = $('#query-gen-to');
    if (oldFrom) oldFrom.value = String(from); if (oldTo) oldTo.value = String(to);
    if (single) single.value = kind === 'single' ? String(from) : '';
    if (rangeFrom) rangeFrom.value = String(from); if (rangeTo) rangeTo.value = String(to);
    renderQueryTimeline();
    renderQuerySearchResults();
    const people = queryPeople().filter((person) => { const generation = generationOf(person); return generation >= from && generation <= to; });
    showToast(kind === 'single' ? `已查询第${from}世，共${people.length}人` : `已查询第${from}—${to}世，共${people.length}人`);
  }

  function formatZoom() {
    const percentage = state.zoom * 100;
    return percentage < 10 ? `${percentage.toFixed(1)}%` : `${Math.round(percentage)}%`;
  }

  function updateZoomReadouts() {
    const label = $('#zoom-label');
    const readout = $('#zoom-readout');
    if (label) label.textContent = formatZoom();
    if (readout) readout.textContent = formatZoom();
  }

  function applyZoom() {
    const stage = $('#tree-stage');
    if (!stage) return;
    const viewport = $('#tree-viewport');
    const canvas = $('#tree-canvas');
    const overviewCanvas = state.overviewCanvas && state.overviewCanvas.active ? state.overviewCanvas : null;
    if (overviewCanvas) {
      canvas.style.width = `${Math.ceil(overviewCanvas.baseWidth)}px`;
      canvas.style.height = `${Math.ceil(overviewCanvas.baseHeight)}px`;
      applyMapPan();
      updateZoomReadouts();
      return;
    }
    const overviewFastPath = state.overviewMode;
    let baseWidth;
    let baseHeight;
    if (overviewFastPath) {
      // 全部展开时尺寸在内容不变期间保持不变，避免每一帧切换 CSS zoom 触发整棵树重排。
      if (!state.overviewMetrics.width || !state.overviewMetrics.height) {
        stage.style.zoom = 1;
        stage.style.transform = 'none';
        state.overviewMetrics = {
          width: Math.max(1, stage.scrollWidth, viewport ? viewport.clientWidth : 0),
          height: Math.max(1, stage.scrollHeight, viewport ? viewport.clientHeight : 0)
        };
      }
      baseWidth = state.overviewMetrics.width;
      baseHeight = state.overviewMetrics.height;
      stage.style.zoom = 1;
    } else {
      // 普通查看模式继续使用 CSS zoom，保证放大阅读时文字清晰。
      stage.style.zoom = 1;
      baseWidth = Math.max(1, stage.scrollWidth, viewport ? viewport.clientWidth : 0);
      baseHeight = Math.max(1, stage.scrollHeight, viewport ? viewport.clientHeight : 0);
      stage.style.zoom = state.zoom;
    }
    applyMapPan();
    if (canvas) {
      canvas.style.width = `${Math.ceil(baseWidth * state.zoom)}px`;
      canvas.style.height = `${Math.ceil(baseHeight * state.zoom)}px`;
    }
    // 滚轮缩放时只更新读数，避免每一帧重复计算侧栏布局。
    updateZoomReadouts();
  }

  // 全部展开后的“全景图”通常被缩放到刚好塞进视口，单纯修改 scrollLeft / scrollTop 没有可滚动空间。
  // 因此在没有滚动余量时，允许拖拽直接移动树面本身；放大后仍沿用原生滚动，兼顾全景与局部查看。
  function applyMapPan() {
    const stage = $('#tree-stage');
    if (!stage) return;
    const pan = state.mapPan || { x: 0, y: 0 };
    const x = Number(pan.x) || 0;
    const y = Number(pan.y) || 0;
    const zoom = Math.max(.001, Number(state.zoom) || 1);
    const overviewCanvas = state.overviewCanvas && state.overviewCanvas.active ? state.overviewCanvas : null;
    if (overviewCanvas && overviewCanvas.layer) {
      overviewCanvas.layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale3d(${zoom}, ${zoom}, 1)`;
      return;
    }
    if (state.overviewMode) {
      // 全景模式只更新合成层，平移和缩放不再触发布局计算。
      stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale3d(${zoom}, ${zoom}, 1)`;
      return;
    }
    // CSS zoom 已负责放大，平移量换算回 stage 坐标，保持拖拽距离与视口像素一致。
    stage.style.transform = `translate3d(${x / zoom}px, ${y / zoom}px, 0)`;
  }

  function resetMapPosition() {
    state.mapPan = { x: 0, y: 0 };
    applyMapPan();
    showToast('世系图已复位，可拖动空白区域四向平移');
  }

  // 保存人物资料时只重绘内容，不重置用户当前的观看位置。
  // 需要同时记住树图区滚动位置和右侧详情滚动位置，避免保存后“跳回去”。
  function captureViewPosition() {
    const viewport = $('#tree-viewport');
    const detail = $('#detail-panel');
    return {
      treeLeft: viewport ? viewport.scrollLeft : 0,
      treeTop: viewport ? viewport.scrollTop : 0,
      detailTop: detail ? detail.scrollTop : 0,
      zoom: state.zoom,
      mapPan: clone(state.mapPan || { x: 0, y: 0 }),
      compact: state.compact,
      overviewMode: state.overviewMode,
      branchOffsets: clone(state.branchOffsets),
      expanded: new Set(state.expanded)
    };
  }

  function captureDetailReturnSnapshot() {
    return Object.assign(captureViewPosition(), {
      selectedId: state.selectedId,
      mode: state.mode,
      view: state.view,
      mainFocusId: state.mainFocusId,
      mobileFocusRootId: state.mobileFocusRootId,
      branch: state.branch,
      generation: state.generation,
      searchQuery: state.searchQuery,
      immersive: state.immersive
    });
  }

  // 刷新页面时保留当前工作区；使用 sessionStorage 使每个浏览器标签页各自记住自己的观看位置。
  function persistActiveDraftBeforeUnload() {
    if (state.mode !== 'edit' || !$('#person-form')) return;
    const nameField = $('#person-form [data-field="name"]');
    if (!nameField || !nameField.value.trim()) return;
    const person = readPersonForm();
    if (!person) return;
    const index = state.data.findIndex((item) => String(personId(item)) === String(person.id));
    if (index >= 0) state.data[index] = person;
    else state.data.push(person);
    persist();
    buildAdoptionIndex();
  }

  function persistSessionView() {
    try {
      persistActiveDraftBeforeUnload();
      const viewport = $('#tree-viewport');
      const detail = $('#detail-panel');
      sessionStorage.setItem(SESSION_VIEW_KEY, JSON.stringify({
        view: state.view,
        mainFocusId: state.mainFocusId,
        mainSublineage: state.mainSublineage,
        mainLineageRootId: state.mainLineageRootId,
        mainLineageTargetId: state.mainLineageTargetId,
        selectedId: state.selectedId,
        branch: state.branch,
        generation: state.generation,
        searchQuery: state.searchQuery,
        compact: state.compact,
        overviewMode: state.overviewMode,
        immersive: state.immersive,
        zoom: state.zoom,
        mapPan: clone(state.mapPan || { x: 0, y: 0 }),
        branchOffsets: clone(state.branchOffsets || { qian: { x: 0, y: 0 }, hou: { x: 0, y: 0 } }),
        expanded: Array.from(state.expanded),
        treeLeft: viewport ? viewport.scrollLeft : 0,
        treeTop: viewport ? viewport.scrollTop : 0,
        detailTop: detail ? detail.scrollTop : 0
      }));
    } catch (error) {
      // 当前浏览器不支持会话存储时，仍可正常使用页面和本地数据保存。
    }
  }

  function loadSessionView() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_VIEW_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return null;
      if (!VIEW_DEFS[saved.view]) return null;
      return saved;
    } catch (error) {
      return null;
    }
  }

  function restoreSessionViewport(saved) {
    if (!saved) return;
    const restore = () => {
      const viewport = $('#tree-viewport');
      const detail = $('#detail-panel');
      if (viewport) {
        viewport.scrollLeft = Number(saved.treeLeft) || 0;
        viewport.scrollTop = Number(saved.treeTop) || 0;
      }
      if (detail) detail.scrollTop = Number(saved.detailTop) || 0;
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(restore);
    else setTimeout(restore, 0);
  }

  function renderInPlace(snapshot) {
    if (!snapshot) {
      renderAll();
      return;
    }
    state.zoom = snapshot.zoom;
    state.mapPan = clone(snapshot.mapPan || { x: 0, y: 0 });
    state.compact = snapshot.compact;
    state.overviewMode = Boolean(snapshot.overviewMode);
    state.branchOffsets = clone(snapshot.branchOffsets || { qian: { x: 0, y: 0 }, hou: { x: 0, y: 0 } });
    state.expanded = new Set(snapshot.expanded);
    renderAll();

    const restore = () => {
      const viewport = $('#tree-viewport');
      const detail = $('#detail-panel');
      if (viewport) {
        viewport.scrollLeft = snapshot.treeLeft;
        viewport.scrollTop = snapshot.treeTop;
      }
      if (detail) detail.scrollTop = snapshot.detailTop;
    };
    // DOM 重绘后浏览器才会重新计算尺寸，下一帧再恢复位置最稳定。
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(restore);
    else setTimeout(restore, 0);
  }

  // 自动保存时保留编辑表单本身，只更新世系图卡片和统计信息，避免输入框失焦、光标跳动。
  function renderTreeInPlace(snapshot) {
    if (!snapshot) {
      renderTree();
      return;
    }
    state.zoom = snapshot.zoom;
    state.mapPan = clone(snapshot.mapPan || { x: 0, y: 0 });
    state.compact = snapshot.compact;
    state.overviewMode = Boolean(snapshot.overviewMode);
    state.branchOffsets = clone(snapshot.branchOffsets || { qian: { x: 0, y: 0 }, hou: { x: 0, y: 0 } });
    state.expanded = new Set(snapshot.expanded);
    renderTree();
    const restore = () => {
      const viewport = $('#tree-viewport');
      if (!viewport) return;
      viewport.scrollLeft = snapshot.treeLeft;
      viewport.scrollTop = snapshot.treeTop;
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(restore);
    else setTimeout(restore, 0);
  }

  function fitOverview(options = {}) {
    const viewport = $('#tree-viewport');
    const stage = $('#tree-stage');
    if (!viewport || !stage || !stage.innerHTML.trim()) return;
    const canvasMap = state.overviewCanvas && state.overviewCanvas.active ? state.overviewCanvas : null;
    if (!canvasMap) {
      state.overviewMetrics = { width: 0, height: 0 };
      stage.style.zoom = 1;
      stage.style.transform = 'none';
    }
    const contentWidth = Math.max(1, canvasMap?.baseWidth || state.overviewMetrics.width || stage.scrollWidth);
    const contentHeight = Math.max(1, canvasMap?.baseHeight || state.overviewMetrics.height || stage.scrollHeight);
    const viewportStyle = typeof getComputedStyle === 'function' ? getComputedStyle(viewport) : null;
    const horizontalPadding = (parseFloat(viewportStyle?.paddingLeft) || 0) + (parseFloat(viewportStyle?.paddingRight) || 0);
    const verticalPadding = (parseFloat(viewportStyle?.paddingTop) || 0) + (parseFloat(viewportStyle?.paddingBottom) || 0);
    const availableWidth = Math.max(1, viewport.clientWidth - horizontalPadding - 12);
    const availableHeight = Math.max(1, viewport.clientHeight - verticalPadding - 12);
    const fit = Math.min(availableWidth / contentWidth, availableHeight / contentHeight) * .96;
    const whole = Boolean(options && options.whole);
    const readable = !whole && Boolean(options && options.readable && canvasMap);
    // 公共手机端进入某一段世系时，不按“整棵树的高度”压成缩略图。
    // 这里保留可滚动的展示窗，让卡片先达到可读尺寸；“全景/全部展开”仍走 whole 分支。
    const mobileLineageReadable = !IS_ADMIN && isMobileViewport() && !whole && !state.overviewMode;
    if (readable) {
      // 全展开时不再把 1,253 张卡片压成一张“看不清的缩略图”。
      // 先以可读比例聚焦当前人物，用户仍可点击“全景”回到完整缩略图。
      state.zoom = Math.max(.55, Math.min(.9, fit * 45));
    } else if (mobileLineageReadable) {
      state.zoom = Math.max(.55, Math.min(1.25, fit));
    } else {
      state.zoom = Math.max(.005, Math.min(1.8, fit));
    }
    // 全景图可能因为横向跨度很大而缩到很小；把实际图面居中，避免它贴在左上角看起来像“消失”。
    const fittedWidth = contentWidth * state.zoom;
    const fittedHeight = contentHeight * state.zoom;
    if (readable && canvasMap.nodes.length) {
      const focusId = state.selectedId || canvasMap.nodes[0].id;
      const focusNode = canvasMap.nodeById.get(String(focusId)) || canvasMap.nodes[0];
      state.mapPan = {
        x: Math.round(availableWidth / 2 - (focusNode.x + focusNode.width / 2) * state.zoom),
        y: Math.round(Math.max(24, availableHeight * .22) - (focusNode.y + focusNode.height / 2) * state.zoom)
      };
    } else {
      state.mapPan = {
        x: Math.max(0, (availableWidth - fittedWidth) / 2),
        y: Math.max(0, (availableHeight - fittedHeight) / 2)
      };
    }
    applyZoom();
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
    renderMiniMap();
    showToast(readable
      ? `已进入可读浏览 · ${formatZoom()}，可拖拽查看各分支；“全景”可看整图`
      : whole
        ? `全部展开 · ${formatZoom()}，整张世系图已完整适配窗口，可缩放、平移查看`
        : `已适应屏幕 · ${formatZoom()}，拖拽图面可四向平移`);
  }

  // 收起后不保留“全部展开”时的缩小比例和偏移，
  // 将当前世系的根节点重新放到展示窗口中央，避免图面贴边或停留在角落。
  function centerCollapsedTree() {
    const viewport = $('#tree-viewport');
    const stage = $('#tree-stage');
    if (!viewport || !stage || !stage.innerHTML.trim()) return;
    state.zoom = 1;
    state.mapPan = { x: 0, y: 0 };
    state.overviewMetrics = { width: 0, height: 0 };
    stage.style.zoom = 1;
    stage.style.transform = 'none';
    // 以根人物卡片为视觉中心，而不是以 stage 外框为中心。
    // stage 可能因树枝布局保留额外空白，按外框居中会让主卡片在手机端偏左/偏上。
    const viewportRect = viewport.getBoundingClientRect();
    const rootCard = stage.querySelector('.tree-root .person-card');
    const rootRect = rootCard?.getBoundingClientRect();
    const rootCenterX = rootRect
      ? rootRect.left + rootRect.width / 2 - viewportRect.left
      : stage.getBoundingClientRect().left + stage.getBoundingClientRect().width / 2 - viewportRect.left;
    const rootCenterY = rootRect
      ? rootRect.top + rootRect.height / 2 - viewportRect.top
      : stage.getBoundingClientRect().top + stage.getBoundingClientRect().height / 2 - viewportRect.top;
    state.mapPan = {
      x: Math.round(viewport.clientWidth / 2 - rootCenterX),
      y: Math.round(viewport.clientHeight / 2 - rootCenterY)
    };
    applyZoom();
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
    renderMiniMap();
  }

  // 总览图浏览层：保留一次 DOM 排版作为“几何真值”，之后用 SVG
  // 承担全量卡片的绘制、缩放和平移。SVG 保证文字和线条在放大时不糊。
  function deactivateOverviewCanvas() {
    const stage = $('#tree-stage');
    const canvasWrap = $('#tree-canvas');
    const viewport = $('#tree-viewport');
    const map = state.overviewCanvas;
    if (map && map.layer && map.layer.parentNode) map.layer.parentNode.removeChild(map.layer);
    if (stage && map) stage.style.display = map.stageDisplay || '';
    canvasWrap?.classList.remove('overview-canvas-active');
    viewport?.classList.remove('overview-canvas-viewport');
    state.overviewCanvas = null;
  }

  function canvasRoundRect(ctx, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, r);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function overviewCanvasColors(node) {
    const classes = new Set(node.classes || []);
    if (classes.has('is-female-card')) return { fill: '#f2d8dd', stroke: '#a43f4f', text: '#632a35' };
    if (classes.has('special-bin-card') || classes.has('special-bin-zone')) return { fill: '#e0e4e5', stroke: '#7a858b', text: '#35434b' };
    if (classes.has('special-qian-card') || classes.has('special-qian-zone')) return { fill: '#f6e0d7', stroke: '#b45b45', text: '#74392c' };
    if (classes.has('is-adoption-out')) return { fill: '#f8e8e3', stroke: '#b85d4c', text: '#6f3027' };
    if (classes.has('is-adoption-in')) return { fill: '#e8f2ea', stroke: '#5b8c72', text: '#294f3e' };
    if (classes.has('is-deceased-card')) return { fill: '#dce2df', stroke: '#8a9891', text: '#46534d' };
    if (classes.has('is-living-card')) return { fill: '#e5f2e8', stroke: '#57956e', text: '#25573a' };
    return { fill: '#f6f7f2', stroke: '#7b9c8b', text: '#243d34' };
  }

  function drawOverviewCanvas() {
    const map = state.overviewCanvas;
    if (!map || !map.active || !map.svgNodeById) return;
    map.nodes.forEach((node) => {
      const group = map.svgNodeById.get(String(node.id));
      if (!group) return;
      const selected = String(node.id) === String(state.selectedId);
      const colors = overviewCanvasColors(node);
      const card = group.querySelector('.overview-svg-card');
      group.classList.toggle('is-selected', selected);
      if (card) {
        card.setAttribute('stroke', selected ? '#c47743' : colors.stroke);
        card.setAttribute('stroke-width', selected ? '3' : '1.25');
      }
    });
  }

  function activateOverviewCanvas(stage) {
    const canvasWrap = $('#tree-canvas');
    const viewport = $('#tree-viewport');
    if (!stage || !canvasWrap || !viewport || !state.overviewMode) return;
    deactivateOverviewCanvas();
    stage.style.zoom = 1;
    stage.style.transform = 'none';
    stage.style.display = '';
    const stageRect = stage.getBoundingClientRect();
    const cardElements = Array.from(stage.querySelectorAll('.person-card'));
    const nodes = [];
    const nodeById = new Map();
    cardElements.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const id = String(card.dataset.id || '');
      if (!id || !rect.width || !rect.height) return;
      const node = {
        id,
        x: rect.left - stageRect.left,
        y: rect.top - stageRect.top,
        width: rect.width,
        height: rect.height,
        name: card.querySelector('strong')?.textContent?.trim() || '未命名',
        generation: card.querySelector('.card-generation')?.textContent?.trim() || '',
        route: card.querySelector('.card-route')?.textContent?.trim() || card.querySelector('.card-branch')?.textContent?.trim() || '',
        classes: Array.from(card.classList),
        isFemale: card.classList.contains('is-female-card'),
        isVerified: card.classList.contains('is-verified')
      };
      nodes.push(node);
      nodeById.set(id, node);
    });
    const edges = [];
    stage.querySelectorAll('.tree-node').forEach((nodeElement) => {
      const card = Array.from(nodeElement.children).find((child) => child.classList?.contains('person-card'));
      if (!card) return;
      const childRow = Array.from(nodeElement.children).find((child) => child.classList?.contains('children-row'));
      if (!childRow) return;
      const parent = nodeById.get(String(card.dataset.id || ''));
      if (!parent) return;
      Array.from(childRow.children).forEach((childElement) => {
        const childCard = Array.from(childElement.children).find((child) => child.classList?.contains('person-card'));
        const child = childCard ? nodeById.get(String(childCard.dataset.id || '')) : null;
        if (child) edges.push({ parent, child });
      });
    });
    const adoptionEdges = [];
    state.adoption.outById.forEach((relation) => {
      const from = nodeById.get(String(personId(relation.outPerson)));
      const target = nodeById.get(String(personId(relation.adoptiveRecord || relation.adoptiveParent)));
      if (from && target && from !== target) adoptionEdges.push({ from, to: target });
    });
    const right = nodes.reduce((max, node) => Math.max(max, node.x + node.width), 0);
    const bottom = nodes.reduce((max, node) => Math.max(max, node.y + node.height), 0);
    const baseWidth = Math.max(1, stage.scrollWidth, right + 44);
    const baseHeight = Math.max(1, stage.scrollHeight, bottom + 44);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('overview-svg-layer');
    if (isMobileViewport()) svg.classList.add('is-mobile-overview');
    svg.setAttribute('viewBox', `0 0 ${baseWidth} ${baseHeight}`);
    svg.setAttribute('width', String(Math.ceil(baseWidth)));
    svg.setAttribute('height', String(Math.ceil(baseHeight)));
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', '总世系图全景图，点击人物查看详情');
    svg.setAttribute('focusable', 'false');
    const makeSvg = (tag, attrs = {}) => {
      const element = document.createElementNS(svgNS, tag);
      Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, String(value)));
      return element;
    };
    const edgeLayer = makeSvg('g', { class: 'overview-svg-edges' });
    const zoneFrameLayer = makeSvg('g', { class: 'overview-svg-zone-frames' });
    const nodeLayer = makeSvg('g', { class: 'overview-svg-nodes' });
    svg.append(edgeLayer, zoneFrameLayer, nodeLayer);
    edges.forEach(({ parent, child }) => {
      const startX = parent.x + parent.width / 2;
      const startY = parent.y + parent.height;
      const endX = child.x + child.width / 2;
      const endY = child.y;
      const middleY = startY + Math.max(8, (endY - startY) / 2);
      edgeLayer.append(makeSvg('path', { d: `M ${startX} ${startY} V ${middleY} H ${endX} V ${endY}`, class: 'overview-svg-parent-edge' }));
    });
    adoptionEdges.forEach(({ from, to }) => {
      const startX = from.x + from.width / 2;
      const startY = from.y + from.height;
      const endX = to.x + to.width / 2;
      const endY = to.y + to.height / 2;
      const bend = Math.max(20, Math.abs(endX - startX) * .25);
      edgeLayer.append(makeSvg('path', { d: `M ${startX} ${startY} C ${startX + bend} ${startY + 14}, ${endX - bend} ${endY - 14}, ${endX} ${endY}`, class: 'overview-svg-adoption-edge' }));
    });
    // 全展开地图中也保留三大房派的视觉分区，避免只在普通树面上显示外框。
    const overviewZones = [
      { rootId: '61', label: '文对', fill: '#eef1fb', stroke: '#7d83b1', text: '#555d91' },
      { rootId: '60', label: '彬', fill: '#ecf3ee', stroke: '#718b7c', text: '#466454' },
      { rootId: '59', label: '乾', fill: '#fdf1e9', stroke: '#bd7958', text: '#914f39' }
    ];
    const childrenById = new Map();
    edges.forEach(({ parent, child }) => {
      const key = String(parent.id);
      if (!childrenById.has(key)) childrenById.set(key, []);
      childrenById.get(key).push(child);
    });
    overviewZones.forEach((zone) => {
      const root = nodeById.get(zone.rootId);
      if (!root) return;
      const included = new Set([zone.rootId]);
      const queue = [root];
      while (queue.length) {
        const current = queue.shift();
        (childrenById.get(String(current.id)) || []).forEach((child) => {
          const childKey = String(child.id);
          if (included.has(childKey)) return;
          included.add(childKey);
          queue.push(child);
        });
      }
      const zoneNodes = nodes.filter((node) => included.has(String(node.id)));
      if (!zoneNodes.length) return;
      const padX = 18;
      const padTop = 28;
      const padBottom = 18;
      const left = Math.max(4, Math.min(...zoneNodes.map((node) => node.x)) - padX);
      const top = Math.max(4, Math.min(...zoneNodes.map((node) => node.y)) - padTop);
      const right = Math.min(baseWidth - 4, Math.max(...zoneNodes.map((node) => node.x + node.width)) + padX);
      const bottom = Math.min(baseHeight - 4, Math.max(...zoneNodes.map((node) => node.y + node.height)) + padBottom);
      const frame = makeSvg('rect', { class: 'overview-svg-zone-frame-box', x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top), rx: 12, fill: zone.fill, stroke: zone.stroke, 'stroke-width': 2.2, 'fill-opacity': .18 });
      const label = makeSvg('text', { class: 'overview-svg-zone-frame-label', x: left + 10, y: top + 17, fill: zone.text });
      label.textContent = zone.label;
      zoneFrameLayer.append(frame, label);
    });
    const svgNodeById = new Map();
    nodes.forEach((node) => {
      const colors = overviewCanvasColors(node);
      const group = makeSvg('g', { class: 'overview-svg-node', 'data-overview-id': node.id, tabindex: '-1' });
      const card = makeSvg('rect', { x: node.x, y: node.y, width: node.width, height: node.height, rx: Math.min(8, node.height * .16), class: 'overview-svg-card', fill: colors.fill, stroke: colors.stroke, 'stroke-width': 1.25 });
      group.append(card);
      if (node.isVerified) {
        const star = makeSvg('text', { x: node.x + node.width - 5, y: node.y + 15, class: 'overview-svg-star', 'text-anchor': 'end' });
        star.textContent = '★';
        group.append(star);
      }
      const generation = makeSvg('text', { x: node.x + 6, y: node.y + 13, class: 'overview-svg-generation' });
      generation.textContent = node.generation;
      group.append(generation);
      const name = makeSvg('text', { x: node.x + 6, y: node.y + Math.min(node.height - 7, Math.max(27, node.height * .58)), class: 'overview-svg-name' });
      name.textContent = node.name;
      group.append(name);
      if (node.route && node.height > 34) {
        const route = makeSvg('text', { x: node.x + 6, y: node.y + node.height - 7, class: 'overview-svg-route' });
        route.textContent = node.route;
        group.append(route);
      }
      nodeLayer.append(group);
      svgNodeById.set(String(node.id), group);
    });
    canvasWrap.appendChild(svg);
    canvasWrap.classList.add('overview-canvas-active');
    viewport.classList.add('overview-canvas-viewport');
    const map = { active: true, layer: svg, svgNodeById, nodes, nodeById, edges, adoptionEdges, baseWidth, baseHeight, stageDisplay: stage.style.display || '' };
    state.overviewCanvas = map;
    state.overviewMetrics = { width: baseWidth, height: baseHeight };
    stage.style.display = 'none';
    svg.addEventListener('click', (event) => {
      if (state.pan.suppressClick) return;
      const group = event.target.closest?.('[data-overview-id]');
      const node = group ? nodeById.get(String(group.dataset.overviewId)) : null;
      if (node) selectPerson(node.id);
    });
    drawOverviewCanvas();
  }

  function renderMiniMap() {
    const panel = $('#tree-minimap-panel');
    const plot = $('#tree-minimap-plot');
    const stage = $('#tree-stage');
    const viewport = $('#tree-viewport');
    if (!panel || !plot || !stage || !viewport || panel.hidden || !stage.innerHTML.trim()) return;
    const canvasMap = state.overviewCanvas && state.overviewCanvas.active ? state.overviewCanvas : null;
    const cards = canvasMap ? canvasMap.nodes : Array.from(stage.querySelectorAll('.person-card'));
    if (!cards.length) {
      plot.innerHTML = '<span class="minimap-empty">暂无图面</span>';
      return;
    }
    const zoom = Math.max(.001, Number(state.zoom) || 1);
    const contentWidth = Math.max(1, canvasMap?.baseWidth || stage.scrollWidth);
    const contentHeight = Math.max(1, canvasMap?.baseHeight || stage.scrollHeight);
    const mapWidth = 184;
    const mapHeight = 112;
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => {
      let left;
      let top;
      let width;
      let height;
      let selected;
      let female;
      let title;
      if (canvasMap) {
        left = card.x;
        top = card.y;
        width = Math.max(2, card.width);
        height = Math.max(2, card.height);
        selected = String(card.id) === String(state.selectedId);
        female = card.isFemale;
        title = card.name;
      } else {
        const stageRect = stage.getBoundingClientRect();
        const rect = card.getBoundingClientRect();
        left = (rect.left - stageRect.left) / zoom;
        top = (rect.top - stageRect.top) / zoom;
        width = Math.max(2, rect.width / zoom);
        height = Math.max(2, rect.height / zoom);
        selected = card.classList.contains('is-selected');
        female = card.classList.contains('is-female-card');
        title = card.querySelector('strong')?.textContent || '定位人物';
      }
      const node = document.createElement('span');
      node.className = `minimap-node${selected ? ' is-selected' : ''}${female ? ' is-female' : ''}`;
      node.style.left = `${Math.max(0, Math.min(99.5, left / contentWidth * 100))}%`;
      node.style.top = `${Math.max(0, Math.min(99.5, top / contentHeight * 100))}%`;
      node.style.width = `${Math.max(1, Math.min(100, width / contentWidth * 100))}%`;
      node.style.height = `${Math.max(1.5, Math.min(100, height / contentHeight * 100))}%`;
      node.dataset.minimapX = String(left + width / 2);
      node.dataset.minimapY = String(top + height / 2);
      node.title = title;
      fragment.appendChild(node);
    });
    plot.innerHTML = '';
    plot.style.setProperty('--minimap-width', `${mapWidth}px`);
    plot.style.setProperty('--minimap-height', `${mapHeight}px`);
    plot.appendChild(fragment);
    const visibleRect = document.createElement('span');
    visibleRect.className = 'minimap-viewport';
    const viewWidth = Math.min(100, viewport.clientWidth / Math.max(1, contentWidth * zoom) * 100);
    const viewHeight = Math.min(100, viewport.clientHeight / Math.max(1, contentHeight * zoom) * 100);
    const viewLeft = state.overviewMode
      ? Math.max(0, Math.min(100 - viewWidth, (-Number(state.mapPan?.x || 0) / zoom) / contentWidth * 100))
      : Math.max(0, Math.min(100 - viewWidth, viewport.scrollLeft / zoom / contentWidth * 100));
    const viewTop = state.overviewMode
      ? Math.max(0, Math.min(100 - viewHeight, (-Number(state.mapPan?.y || 0) / zoom) / contentHeight * 100))
      : Math.max(0, Math.min(100 - viewHeight, viewport.scrollTop / zoom / contentHeight * 100));
    visibleRect.style.left = `${viewLeft}%`;
    visibleRect.style.top = `${viewTop}%`;
    visibleRect.style.width = `${Math.max(3, viewWidth)}%`;
    visibleRect.style.height = `${Math.max(5, viewHeight)}%`;
    plot.appendChild(visibleRect);
  }

  function focusMiniMapPoint(x, y) {
    const viewport = $('#tree-viewport');
    if (!viewport) return;
    const contentX = Number(x) || 0;
    const contentY = Number(y) || 0;
    const zoom = Math.max(.001, Number(state.zoom) || 1);
    if (state.overviewMode) {
      state.mapPan = {
        x: viewport.clientWidth / 2 - contentX * zoom,
        y: viewport.clientHeight / 2 - contentY * zoom
      };
      applyMapPan();
    } else {
      state.mapPan = { x: 0, y: 0 };
      applyMapPan();
      viewport.scrollLeft = Math.max(0, contentX * zoom - viewport.clientWidth / 2);
      viewport.scrollTop = Math.max(0, contentY * zoom - viewport.clientHeight / 2);
    }
    renderMiniMap();
    persistSessionView();
  }

  function toggleMinimap() {
    const panel = $('#tree-minimap-panel');
    const toggle = document.querySelector('.minimap-toggle');
    if (!panel) return;
    panel.hidden = !panel.hidden;
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      toggle.textContent = panel.hidden ? '缩略图' : '收起缩略图';
    }
    if (!panel.hidden) renderMiniMap();
  }

  function backToPerson() {
    const target = getPerson(state.selectedId) || getPerson(state.mainFocusId) || findRoot();
    if (!target) {
      showToast('当前没有可返回的人物');
      return;
    }
    state.selectedId = personId(target);
    state.mode = 'view';
    if (isMobileViewport() && !state.overviewMode) prepareMobileFocusWindow(target, 4);
    else {
      setAncestorsExpanded(target);
      if (treeChildren(target).length) state.expanded.add(String(personId(target)));
    }
    renderTree();
    renderDetail();
    updateSelectedCardUI();
    const card = document.querySelector(`.person-card[data-id="${CSS.escape(String(personId(target)))}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      card.classList.add('is-search-target-pulse');
    }
    renderMiniMap();
    showToast(`已回到“${text(target.name)}”`);
  }

  function stepZoom(direction) {
    const factor = direction > 0 ? 1.22 : 1 / 1.22;
    const viewport = $('#tree-viewport');
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    zoomAroundPoint(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function updateSelectedCardUI() {
    const selectedKey = String(state.selectedId ?? '');
    if (domSelectedId !== null && domSelectedId !== selectedKey) {
      const previousCard = document.querySelector(`.person-card[data-id="${CSS.escape(domSelectedId)}"]`);
      if (previousCard) previousCard.classList.remove('is-selected');
    }
    const selectedCard = selectedKey
      ? document.querySelector(`.person-card[data-id="${CSS.escape(selectedKey)}"]`)
      : null;
    if (selectedCard) selectedCard.classList.add('is-selected');
    domSelectedId = selectedKey || null;
    const canvasMap = state.overviewCanvas && state.overviewCanvas.active ? state.overviewCanvas : null;
    if (canvasMap) drawOverviewCanvas();
    const status = $('#tree-status');
    const selected = getPerson(state.selectedId);
    if (status && selected) status.textContent = `${currentView().label} · 当前树面卡片 ${$$('.person-card').length} 张 · 已选：${text(selected.name)}`;
  }

  function zoomAroundPoint(factor, clientX, clientY, useClientAnchor = false) {
    const viewport = $('#tree-viewport');
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    // 鼠标滚轮固定以视口中心缩放；手机双指缩放则以两指中心为锚点，手感更自然。
    const offsetX = useClientAnchor ? Math.max(0, Math.min(rect.width, clientX - rect.left)) : rect.width / 2;
    const offsetY = useClientAnchor ? Math.max(0, Math.min(rect.height, clientY - rect.top)) : rect.height / 2;
    const oldZoom = state.zoom;
    const mapPan = state.mapPan || { x: 0, y: 0 };
    const canvasMap = state.overviewCanvas && state.overviewCanvas.active ? state.overviewCanvas : null;
    if (canvasMap) {
      const focusX = (offsetX - (Number(mapPan.x) || 0)) / oldZoom;
      const focusY = (offsetY - (Number(mapPan.y) || 0)) / oldZoom;
      state.zoom = Math.max(.005, Math.min(1.8, +(state.zoom * factor).toFixed(4)));
      if (state.zoom === oldZoom) return;
      state.mapPan = {
        x: offsetX - focusX * state.zoom,
        y: offsetY - focusY * state.zoom
      };
      applyZoom();
      renderMiniMap();
      return;
    }
    // 计算时扣除全景平移量，缩放后鼠标指向的卡片保持在原位置，不再出现跳图。
    const focusX = (viewport.scrollLeft + offsetX - (Number(mapPan.x) || 0)) / oldZoom;
    const focusY = (viewport.scrollTop + offsetY - (Number(mapPan.y) || 0)) / oldZoom;
    state.zoom = Math.max(.005, Math.min(1.8, +(state.zoom * factor).toFixed(4)));
    if (state.zoom === oldZoom) return;
    applyZoom();
    viewport.scrollLeft = Math.max(0, (Number(mapPan.x) || 0) + focusX * state.zoom - offsetX);
    viewport.scrollTop = Math.max(0, (Number(mapPan.y) || 0) + focusY * state.zoom - offsetY);
  }

  function resetZoom() {
    const viewport = $('#tree-viewport');
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const targetZoom = 1;
    const factor = targetZoom / Math.max(.001, state.zoom);
    zoomAroundPoint(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function toggleCompact() {
    state.overviewMode = false;
    state.compact = !state.compact;
    renderTree();
    fitOverview();
    showToast(state.compact ? '已切换为紧凑卡片，横向更易浏览' : '已切换为标准卡片，适合阅读文字');
  }

  function updateVerifiedCardUI() {
    $$('.verify-toggle').forEach((toggle) => {
      const verified = state.verified.has(String(toggle.dataset.id));
      toggle.classList.toggle('is-verified', verified);
      toggle.textContent = verified ? '★' : '☆';
      toggle.setAttribute('aria-pressed', String(verified));
      toggle.setAttribute('title', verified ? '已核对无误 · 点击取消标记' : '点击标记为已核对');
      toggle.setAttribute('aria-label', verified ? '已核对无误，点击取消' : '标记为已核对无误');
    });
  }

  function persistVerified() {
    try {
      localStorage.setItem(VERIFIED_KEY, JSON.stringify(Array.from(state.verified)));
    } catch (error) {
      showToast('核对标记暂时无法保存，请检查浏览器存储权限');
    }
  }

  function markVerifiedLineageViewsOnce() {
    let alreadySeeded = false;
    try { alreadySeeded = localStorage.getItem(VERIFIED_PRESET_KEY) === 'done'; } catch (error) { /* ignore */ }
    if (alreadySeeded) return;
    const snapshot = {
      view: state.view,
      branch: state.branch,
      generation: state.generation,
      mainFocusId: state.mainFocusId
    };
    ['dongshan', 'linhai', 'shima'].forEach((viewKey) => {
      state.view = viewKey;
      state.branch = '';
      state.generation = '';
      state.mainFocusId = null;
      state.data
        .filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person))
        .forEach((person) => state.verified.add(String(personId(person))));
    });
    state.view = snapshot.view;
    state.branch = snapshot.branch;
    state.generation = snapshot.generation;
    state.mainFocusId = snapshot.mainFocusId;
    persistVerified();
    try { localStorage.setItem(VERIFIED_PRESET_KEY, 'done'); } catch (error) { /* ignore */ }
  }

  function toggleVerified(id) {
    const key = String(toId(id));
    if (!key || key === 'null') return;
    if (state.verified.has(key)) {
      state.verified.delete(key);
      showToast('已取消该人物的核对标记');
    } else {
      state.verified.add(key);
      showToast('已标记为核对无误');
    }
    persistVerified();
    updateVerifiedCardUI();
    renderStats();
  }

  function cardHtml(person, depth, context, descendantMemo) {
    const childCount = treeChildren(person).length;
    const descendants = descendantCount(personId(person), undefined, descendantMemo);
    const selected = String(state.selectedId) === String(personId(person));
    const hit = matchesSearch(person);
    const branch = text(person.branch) || '未标注支系';
    const generation = viewGenerationLabel(person);
    const tags = adoptionTags(person);
    const lifeStatus = lifeStatusInfo(person);
    const verified = state.verified.has(String(personId(person)));
    const classes = ['person-card', branchClass(branch)];
    if (genderOf(person) === '女') classes.push('is-female-card');
    if (lifeStatus.status === '是') classes.push('is-living-card');
    else if (lifeStatus.status === '否') classes.push('is-deceased-card');
    else if (lifeStatus.status === '冲突') classes.push('is-status-conflict-card');
    else classes.push('is-status-unknown-card');
    const specialId = String(personId(person));
    const isCurrentClanLeader = specialId === '445';
    if (isCurrentClanLeader) classes.push('current-clan-leader');
    if (specialId === '61') classes.push('special-wendui-card');
    if (specialId === '60') classes.push('special-bin-card');
    if (specialId === '59') classes.push('special-qian-card');
    if (isChengzhiMainLine(person)) classes.push('chengzhi-card');
    if (isDaenMainLine(person)) classes.push('daen-card');
    if (isDaerMainLine(person)) classes.push('daer-card');
    if (isDengMainLine(person)) classes.push('deng-card');
    if (isQianziMainLine(person)) classes.push('qianzi-card');
    if (tags.length) classes.push('has-adoption-tags');
    if (selected) classes.push('is-selected');
    if (hit) classes.push('is-hit');
    if (hit && selected) classes.push('is-search-target');
    if (context) classes.push('is-context');
    if (verified) classes.push('is-verified');
    if (tags.some((tag) => tag.className === 'adoption-out')) classes.push('is-adoption-out');
    if (tags.some((tag) => tag.className === 'adoption-in' || tag.className === 'adoption-receive')) classes.push('is-adoption-in');
    if (state.view === 'main' && String(personId(person)) === '12') classes.push('main-qian-card');
    if (state.view === 'main' && String(personId(person)) === '13') classes.push('main-hou-card');
    const adoptionTarget = adoptionRelation(person)?.adoptiveRecord || null;
    const clickTargetAttr = adoptionTarget ? ` data-open-id="${escapeHtml(personId(adoptionTarget))}"` : '';
    const cardAriaLabel = adoptionTarget ? `查看${escapeHtml(person.name)}入继卡及下一代` : `查看${escapeHtml(person.name)}详情`;
    const mainGeneration = state.view === 'main' ? `<span class="main-card-generation">${escapeHtml(generation)}</span>` : '';
    return `<div class="${classes.join(' ')}" data-action="select-person" data-id="${escapeHtml(personId(person))}"${clickTargetAttr} role="button" tabindex="0" aria-label="${cardAriaLabel}">
      <span class="verify-toggle${verified ? ' is-verified' : ''}${IS_ADMIN ? '' : ' is-readonly'}"${IS_ADMIN ? ` data-action="toggle-verified" data-id="${escapeHtml(personId(person))}" role="button" tabindex="0" aria-pressed="${verified}" aria-label="${verified ? '已核对无误，点击取消' : '标记为已核对无误'}" title="${verified ? '已核对无误 · 点击取消标记' : '点击标记为已核对'}"` : ` aria-label="${verified ? '已核对无误' : '尚未核对'}"`}>${verified ? '★' : '☆'}</span>
      ${mainGeneration}
      <span class="card-top"><span class="card-generation">${escapeHtml(generation)}</span><span class="card-top-right"><span class="card-branch">${escapeHtml(branch)}</span><span class="card-gender ${genderOf(person) === '女' ? 'is-female' : genderOf(person) === '男' ? 'is-male' : 'is-unknown'}">${genderOf(person) === '女' ? '女' : genderOf(person) === '男' ? '男' : '性别待核'}</span></span></span>
      <strong>${escapeHtml(person.name || '未命名人物')}</strong>
      ${isCurrentClanLeader ? '<span class="leader-badge">2026届族长</span>' : ''}
      ${adoptionBadgeHtml(person)}
      <span class="card-bio">${escapeHtml(text(person.biography) || '暂无族谱记载')}</span>
      ${cardRouteHtml(person)}
      ${waterCaiChildrenToggleHtml(person)}
      <span class="card-bottom"><span>${childCount} 子女 · ${descendants} 后代</span>${person.highlight ? '<span class="key-mark">✦</span>' : ''}</span>
    </div>`;
  }

  function renderNode(person, depth, visited, memo) {
    const key = String(personId(person));
    if (visited.has(key)) return '';
    visited.add(key);
    const children = visibleChildren(person, memo);
    const context = hasActiveFilter() && !matchesFilters(person);
    const isExpanded = state.expanded.has(key);
    let descendants = '';
    if (children.length && isExpanded) {
      descendants = `<div class="children-row">${children.map((child) => renderNode(child, depth + 1, new Set(visited), memo)).join('')}</div>`;
    } else if (children.length) {
      descendants = `<button class="expand-button" data-action="toggle-node" data-id="${escapeHtml(personId(person))}">＋${children.length}子女</button>`;
    }
    const nodeClasses = ['tree-node', depth === 0 ? 'is-root' : '', children.length && isExpanded ? 'has-open-children' : ''];
    if (String(personId(person)) === '61') nodeClasses.push('special-wendui-zone');
    if (String(personId(person)) === '59') nodeClasses.push('special-qian-zone');
    if (String(personId(person)) === '60') nodeClasses.push('special-bin-zone');
    if (String(personId(person)) === '69') nodeClasses.push('chengzhi-zone');
    if (String(personId(person)) === '146') nodeClasses.push('daen-zone');
    if (DAER_ROOT_IDS.has(String(personId(person)))) nodeClasses.push('daer-zone');
    if (DENG_ROOT_IDS.has(String(personId(person)))) nodeClasses.push('deng-zone');
    if (QIANZI_ROOT_IDS.has(String(personId(person)))) nodeClasses.push('qianzi-zone');
    if (state.view === 'main' && String(personId(person)) === '12') nodeClasses.push('main-qian-zone');
    if (state.view === 'main' && String(personId(person)) === '13') nodeClasses.push('main-hou-zone');
    const nodeClass = nodeClasses.filter(Boolean).join(' ');
    return `<div class="${nodeClass}" data-node-id="${escapeHtml(personId(person))}">${cardHtml(person, depth, context, memo)}${descendants}</div>`;
  }

  function applyBranchOffsets() {
    const zones = [
      ['qian', '.tree-node.main-qian-zone'],
      ['hou', '.tree-node.main-hou-zone']
    ];
    zones.forEach(([key, selector]) => {
      const zone = $(selector);
      if (!zone) return;
      // 撰、攒外框固定在树面布局中，不再读取旧版本保存的鼠标拖动偏移。
      state.branchOffsets[key] = { x: 0, y: 0 };
      zone.style.setProperty('--zone-x', '0px');
      zone.style.setProperty('--zone-y', '0px');
    });
  }

  function renderDaerGroupFrame() {
    const stage = $('#tree-stage');
    const root = stage && stage.querySelector('.tree-root');
    if (!root) return;
    root.querySelector('.daer-group-frame')?.remove();
    const zones = Array.from(root.querySelectorAll('.tree-node.daer-zone'));
    if (!zones.length) return;
    const rootRect = root.getBoundingClientRect();
    const scale = Math.max(0.01, Number(state.zoom) || 1);
    const rects = zones.map((zone) => zone.getBoundingClientRect());
    const left = Math.min(...rects.map((rect) => (rect.left - rootRect.left) / scale)) - 24;
    const top = Math.min(...rects.map((rect) => (rect.top - rootRect.top) / scale)) - 24;
    const right = Math.max(...rects.map((rect) => (rect.right - rootRect.left) / scale)) + 24;
    const bottom = Math.max(...rects.map((rect) => (rect.bottom - rootRect.top) / scale)) + 24;
    const frame = document.createElement('div');
    frame.className = 'daer-group-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.style.left = `${left}px`;
    frame.style.top = `${top}px`;
    frame.style.width = `${Math.max(0, right - left)}px`;
    frame.style.height = `${Math.max(0, bottom - top)}px`;
    const label = document.createElement('div');
    label.className = 'qianzi-group-label';
    label.innerHTML = '<span>前枫槎</span><strong>子𨓦</strong><span>公派下世系图</span>';
    frame.appendChild(label);
    root.appendChild(frame);
  }

  function renderDengGroupFrame() {
    const stage = $('#tree-stage');
    const root = stage && stage.querySelector('.tree-root');
    if (!root) return;
    root.querySelector('.deng-group-frame')?.remove();
    const zones = Array.from(root.querySelectorAll('.tree-node.deng-zone'));
    if (!zones.length) return;
    const rootRect = root.getBoundingClientRect();
    const scale = Math.max(0.01, Number(state.zoom) || 1);
    const rects = zones.map((zone) => zone.getBoundingClientRect());
    const left = Math.min(...rects.map((rect) => (rect.left - rootRect.left) / scale)) - 24;
    const top = Math.min(...rects.map((rect) => (rect.top - rootRect.top) / scale)) - 24;
    const right = Math.max(...rects.map((rect) => (rect.right - rootRect.left) / scale)) + 24;
    const bottom = Math.max(...rects.map((rect) => (rect.bottom - rootRect.top) / scale)) + 24;
    const frame = document.createElement('div');
    frame.className = 'deng-group-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.style.left = `${left}px`;
    frame.style.top = `${top}px`;
    frame.style.width = `${Math.max(0, right - left)}px`;
    frame.style.height = `${Math.max(0, bottom - top)}px`;
    const label = document.createElement('div');
    label.className = 'deng-group-label';
    label.textContent = '后枫槎西房二分（承恩公派下）';
    frame.appendChild(label);
    root.appendChild(frame);
  }

  function renderQianziGroupFrame() {
    const stage = $('#tree-stage');
    const root = stage && stage.querySelector('.tree-root');
    if (!root) return;
    root.querySelector('.qianzi-group-frame')?.remove();
    const zones = Array.from(root.querySelectorAll('.tree-node.qianzi-zone'));
    if (!zones.length) return;
    const rootRect = root.getBoundingClientRect();
    const scale = Math.max(0.01, Number(state.zoom) || 1);
    const rects = zones.map((zone) => zone.getBoundingClientRect());
    const left = Math.min(...rects.map((rect) => (rect.left - rootRect.left) / scale)) - 24;
    const top = Math.min(...rects.map((rect) => (rect.top - rootRect.top) / scale)) - 24;
    const right = Math.max(...rects.map((rect) => (rect.right - rootRect.left) / scale)) + 24;
    const bottom = Math.max(...rects.map((rect) => (rect.bottom - rootRect.top) / scale)) + 24;
    const frame = document.createElement('div');
    frame.className = 'qianzi-group-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.style.left = `${left}px`;
    frame.style.top = `${top}px`;
    frame.style.width = `${Math.max(0, right - left)}px`;
    frame.style.height = `${Math.max(0, bottom - top)}px`;
    root.appendChild(frame);
  }

  function renderGroupFrames() {
    if (state.overviewCanvas && state.overviewCanvas.active) return;
    renderDaerGroupFrame();
    renderDengGroupFrame();
    renderQianziGroupFrame();
  }

  // 手机端总览采用“分区索引 → 分段世系图”，避免把上千张卡片压缩到一张不可读的超宽画布。
  const MOBILE_OVERVIEW_VIEWS = ['ancient', 'shenbo', 'dongshan', 'linhai', 'shima', 'main'];

  function personBelongsToView(person, viewKey) {
    if (!person) return false;
    if (viewKey === 'overview') return true;
    const view = VIEW_DEFS[viewKey];
    if (!view) return false;
    if (String(personId(person)) === String(toId(view.rootId))) return true;
    const generation = generationOf(person);
    if (view.generations && (generation === null || generation < view.generations[0] || generation > view.generations[1])) return false;
    return viewKey === 'main' ? isStrictDescendantOf(person, view.rootId) : true;
  }

  function mobileOverviewSectionStats(viewKey) {
    const view = VIEW_DEFS[viewKey];
    const people = state.data.filter((person) => personBelongsToView(person, viewKey) && !isHiddenAdoptionRecord(person));
    const generations = people.map(generationOf).filter((value) => value !== null);
    const minGeneration = generations.length ? Math.min(...generations) : (view.generations ? view.generations[0] : null);
    const maxGeneration = generations.length ? Math.max(...generations) : (view.generations ? view.generations[1] : null);
    const generationText = minGeneration !== null && maxGeneration !== null ? `第${minGeneration}—${maxGeneration}世` : '世次待核';
    return {
      count: people.length,
      rootName: text(getPerson(view.rootId)?.name) || '起点待核',
      generationText
    };
  }

  function renderMobileOverviewIndex() {
    const total = state.data.filter((person) => !isHiddenAdoptionRecord(person)).length;
    const cards = MOBILE_OVERVIEW_VIEWS.map((viewKey, index) => {
      const view = VIEW_DEFS[viewKey];
      const stats = mobileOverviewSectionStats(viewKey);
      return `<button class="mobile-overview-section-card section-${escapeHtml(viewKey)}" data-action="mobile-overview-section" data-view="${escapeHtml(viewKey)}" aria-label="查看${escapeHtml(view.label)}">
        <span class="mobile-overview-section-number">${index + 1}</span>
        <span class="mobile-overview-section-copy"><strong>${escapeHtml(view.label)}</strong><small>${escapeHtml(stats.generationText)} · ${stats.count}人</small><em>起点：${escapeHtml(stats.rootName)} · 点击查看本段世系</em></span>
        <span class="mobile-overview-section-arrow" aria-hidden="true">›</span>
      </button>`;
    }).join('');
    return `<section class="mobile-overview-index" aria-label="总览世系分区">
      <div class="mobile-overview-index-head"><span class="mobile-overview-kicker">LINEAGE ATLAS</span><span class="mobile-overview-total">${total} 位已录入族人</span><h3>总览世系分区</h3><p>先选择一段世系，再查看清晰、可缩放的连续树图。</p></div>
      <div class="mobile-overview-section-list">${cards}</div>
      <p class="mobile-overview-index-note">总览已按世系分区整理。进入分区后可展开主脉、展开全部、收起，并用双指缩放或拖动查看。</p>
    </section>`;
  }

  function openMobileOverviewSection(viewKey) {
    if (!MOBILE_OVERVIEW_VIEWS.includes(viewKey)) return;
    switchView(viewKey);
    showToast(`已进入${text(VIEW_DEFS[viewKey]?.label)}，可展开查看本段世系`);
  }

  function renderTree() {
    const stage = $('#tree-stage');
    const viewport = $('#tree-viewport');
    const canvas = $('#tree-canvas');
    const mobileOverviewIndex = isMobileViewport() && state.overviewMode && state.view === 'overview';
    if (!stage) return;
    if (state.overviewCanvas && state.overviewCanvas.active) deactivateOverviewCanvas();
    state.overviewMetrics = { width: 0, height: 0 };
    stage.classList.toggle('is-compact', state.compact);
    stage.classList.toggle('is-overview-map', state.overviewMode);
    stage.classList.toggle('is-mobile-overview-index', mobileOverviewIndex);
    stage.dataset.view = state.view;
    viewport?.classList.toggle('mobile-overview-index-viewport', mobileOverviewIndex);
    canvas?.classList.toggle('mobile-overview-index-canvas', mobileOverviewIndex);
    if (mobileOverviewIndex) {
      stage.style.zoom = '1';
      stage.style.transform = 'none';
      stage.style.left = '';
      stage.style.top = '';
      if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.minWidth = '0';
        canvas.style.minHeight = '0';
      }
      state.zoom = 1;
      state.mapPan = { x: 0, y: 0 };
      stage.innerHTML = renderMobileOverviewIndex();
      const minimap = $('#tree-minimap-panel');
      if (minimap) minimap.hidden = true;
      updateZoomReadouts();
      const overviewStatus = $('#tree-status');
      if (overviewStatus) {
        overviewStatus.textContent = '总览世系分区 · 选择一段进入连续世系图';
        overviewStatus.hidden = !IS_ADMIN && isMobileViewport();
      }
      return;
    }
    stage.style.zoom = '';
    stage.style.transform = '';
    stage.style.left = '';
    stage.style.top = '';
    if (canvas) {
      canvas.style.removeProperty('width');
      canvas.style.removeProperty('height');
      canvas.style.removeProperty('min-width');
      canvas.style.removeProperty('min-height');
    }
    const root = isMobileViewport() && !state.overviewMode && state.mobileFocusRootId
      ? (getPerson(state.mobileFocusRootId) || findRoot())
      : findRoot();
    if (!root) {
      stage.innerHTML = '<div class="tree-placeholder">暂无可展示的族谱数据。</div>';
    } else {
      const memo = new Map();
      stage.innerHTML = `<div class="tree-root">${renderNode(root, 0, new Set(), memo)}</div>`;
    }
    applyBranchOffsets();
    if (state.overviewMode) activateOverviewCanvas(stage);
    applyZoom();
    renderGroupFrames();
    renderMiniMap();
    animateTreeEntrance(stage);
    const activeFilters = [state.branch && `支系：${state.branch}`, state.generation && `世代：${viewGenerationText(Number(state.generation))}`].filter(Boolean).join(' · ');
    const selected = getPerson(state.selectedId);
    const visible = $$('.person-card').length;
    const treeStatus = $('#tree-status');
    if (treeStatus) {
      treeStatus.textContent = `${currentView().label} · ${activeFilters ? `当前筛选：${activeFilters} · ` : ''}当前树面卡片 ${visible} 张${selected ? ` · 已选：${text(selected.name)}` : ' · 点击卡片查看详情'}`;
      // 未点击人物前不显示说明性占位条，把展示高度完整留给世系图。
      // 选中人物后恢复状态提示，详情面板由 renderDetail() 独立控制。
      treeStatus.hidden = !IS_ADMIN && isMobileViewport() && !selected;
    }
  }

  // 卡片点击展开只增量插入当前节点的下一代，避免为一张卡片重新生成整棵大树。
  // 如果当前卡片已不在 DOM（例如切换视图、筛选或入继路由），由调用方回退到完整 renderTree。
  function expandPersonNodeInPlace(person) {
    if (!person) return false;
    const key = String(personId(person));
    const node = document.querySelector(`.tree-node[data-node-id="${CSS.escape(key)}"]`);
    if (!node) return false;
    const children = visibleChildren(person, new Map());
    if (!children.length) return false;
    const currentRow = Array.from(node.children).find((child) => child.classList.contains('children-row'));
    if (currentRow) return true;
    const trigger = Array.from(node.children).find((child) => child.classList.contains('expand-button'));
    if (!trigger) return false;
    const row = document.createElement('div');
    row.className = 'children-row';
    const memo = new Map();
    row.innerHTML = children.map((child) => renderNode(child, 1, new Set([key]), memo)).join('');
    if (!row.innerHTML) return false;
    trigger.replaceWith(row);
    node.classList.add('has-open-children');
    state.overviewMetrics = { width: 0, height: 0 };
    applyZoom();
    renderGroupFrames();
    return true;
  }

  function animateTreeEntrance(stage) {
    if (!stage) return;
    const cards = Array.from(stage.querySelectorAll('.person-card'));
    // 全景或大于 220 张卡片时完全跳过逐卡片动画和样式写入，避免全量展开后再次触发上千次重排。
    if (state.overviewMode || cards.length > 220 || !cards.length) return;
    cards.slice(0, 72).forEach((card, index) => {
      card.style.setProperty('--card-index', Math.min(index, 64));
      card.classList.remove('is-entering');
    });
    requestAnimationFrame(() => {
      cards.slice(0, 72).forEach((card) => card.classList.add('is-entering'));
    });
  }

  function renderSearchResults() {
    const container = $('#search-results');
    if (!container) return;
    const query = state.searchQuery.trim();
    if (!query) {
      container.hidden = true;
      container.innerHTML = '';
      return;
    }
    const results = state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person) && matchesSearch(person)).slice(0, 16);
    container.hidden = false;
    container.innerHTML = results.length ? results.map((person) => `<button class="search-result" data-action="select-person" data-id="${escapeHtml(personId(person))}">${escapeHtml(person.name)}<small>${escapeHtml(viewGenerationLabel(person))} · ${escapeHtml(text(person.branch) || '未标注支系')}</small></button>`).join('') : '<div class="search-result">未找到匹配人物</div>';
  }

  function clearSearchCardUI() {
    document.querySelectorAll('.person-card.is-hit, .person-card.is-search-target, .person-card.is-search-target-pulse').forEach((card) => {
      card.classList.remove('is-hit', 'is-search-target', 'is-search-target-pulse');
    });
  }

  function scheduleSearchLocate() {
    clearTimeout(searchLocateTimer);
    const query = state.searchQuery.trim();
    if (!query || searchComposing) return;
    // 输入过程中只更新候选列表；停止输入约 360ms 后才定位和重绘，避免中文输入法或连续打字被整棵树卡住。
    searchLocateTimer = setTimeout(() => {
      searchLocateTimer = null;
      autoLocateSearchMatch();
    }, 360);
  }

  function relationChip(person, fallback) {
    if (!person) return `<span class="relation-chip muted-chip">${escapeHtml(fallback || '未详')}</span>`;
    return `<button class="relation-chip" data-action="select-person" data-id="${escapeHtml(personId(person))}">${escapeHtml(person.name || '未命名')}</button>`;
  }

  function relationChipList(people, emptyText) {
    return people.length ? people.map((person) => relationChip(person)).join('') : `<span class="relation-chip muted-chip">${escapeHtml(emptyText || '暂无')}</span>`;
  }

  // spouse_ids 中保留了谱册原文（例如“配石舌章章氏”），不一定能解析成本站人物卡片。
  // 未解析时不能用“配偶未详”覆盖原始记录，必须原样呈现并注明来源类型。
  function sourceRelationList(people, rawValue, emptyText) {
    const raw = text(rawValue).trim();
    if (!people.length && raw) return `<span class="relation-chip muted-chip source-relation-chip">谱载：${escapeHtml(raw)}</span>`;
    return relationChipList(people, raw || emptyText || '暂无');
  }

  function spouseFullInfoHtml(spouses, rawValue, owner) {
    const raw = text(rawValue).trim();
    const linked = spouses.map((spouse) => `<article class="detail-spouse-card"><div class="detail-spouse-head"><button class="relation-chip" data-action="select-person" data-id="${escapeHtml(personId(spouse))}">${escapeHtml(text(spouse.name) || '未命名配偶')}</button><span>${escapeHtml(genderLabel(spouse))} · ${escapeHtml(lifeStatusLabel(spouse))}</span></div><dl class="detail-spouse-grid">${detailField('出生信息', spouse.birth_date)}${detailField('卒年 / 卒葬', spouse.death_date)}${detailField('寿命', lifespanLabel(spouse))}${detailField('葬地', spouse.burial_place)}${detailField('籍贯 / 居住地', [spouse.native_place, spouse.residence].filter((value) => text(value).trim()).join('；'))}${detailField('字 / 号', spouse.courtesy_name)}${detailField('支系', spouse.branch)}${detailField('出处', [spouse.source_pages, spouse.vital_source].filter((value) => text(value).trim()).join('；'))}</dl>${spouse.biography ? `<div class="detail-spouse-note"><span>配偶谱载</span>${displayValue(spouse.biography)}</div>` : ''}${spouse.book_record ? `<div class="detail-spouse-note"><span>配偶原始谱载</span>${displayValue(spouse.book_record)}</div>` : ''}</article>`).join('');
    const source = raw ? `<div class="detail-spouse-source"><span>配偶原始谱载（${escapeHtml(text(owner && owner.name))}条目）</span><p>${displayValue(annotateGregorianYears(raw))}</p>${owner && owner.spouse_record ? `<p>${displayValue(annotateGregorianYears(owner.spouse_record))}</p>` : ''}</div>` : '';
    return linked || source || '<div class="detail-muted">配偶没有可显示的独立人物卡或原始谱载。</div>';
  }

  function displayValue(value, empty) {
    const valueText = text(value).trim();
    return escapeHtml(valueText || empty || '未详');
  }

  function boolLabel(value) {
    const normalized = text(value).trim().toLowerCase();
    if (value === true || value === 1 || normalized === 'true' || normalized === '是' || normalized === '在世') return '在世';
    if (value === false || value === 0 || normalized === 'false' || normalized === '否' || normalized === '已故') return '已故';
    return '未标注';
  }

  const LIFE_PLACEHOLDER_RE = /^(?:未详|未定|未知|未标注|不详|无|暂无|待核验|待确认|—|-|空|null|undefined)$/i;
  const LIFE_DEATH_RE = /(?:生娶卒葬俱失|生卒(?:俱失|均失|失考)|(?:^|[\s，,。；;：:、])卒(?:年|日|失|俱失|均失|无考|失考|于|后|时)|殁|早逝|夭折|亡故|享年|墓葬|葬于|葬在|墓在|合葬)/;
  const LIFE_ALIVE_RE = /(?:现年|在世|健在|尚健|尚在|仍健|生存|未卒|存世)/;

  function lifeStatusInfo(person) {
    const record = person || {};
    const meaningful = (value) => {
      const valueText = text(value).trim();
      return Boolean(valueText) && !LIFE_PLACEHOLDER_RE.test(valueText);
    };
    const sourceText = ['death_date', 'biography', 'vital_source', 'book_record', 'notes', 'adopt_note', 'status_source']
      .map((key) => text(record[key]).trim()).filter(Boolean).join(' ');
    const deathField = meaningful(record.death_date);
    const deathEvidence = deathField || LIFE_DEATH_RE.test(sourceText);
    const aliveEvidence = LIFE_ALIVE_RE.test(sourceText);
    const raw = text(record.is_alive).trim().toLowerCase();
    const manualAlive = record.is_alive === true || record.is_alive === 1 || raw === 'true' || raw === '是' || raw === '在世';
    const conflict = record.life_status_conflict === true || (deathEvidence && (aliveEvidence || manualAlive));
    if (conflict) return { status: '冲突', label: '状态冲突', conflict: true };
    if (deathEvidence) return { status: '否', label: '已故', conflict: false };
    if (aliveEvidence || manualAlive) return { status: '是', label: '在世', conflict: false };
    return { status: '', label: '待核验', conflict: false };
  }

  function lifeStatusLabel(person) {
    return lifeStatusInfo(person).label;
  }

  function detailField(label, value, full) {
    return `<div class="detail-field${full ? ' full' : ''}"><dt>${escapeHtml(label)}</dt><dd>${displayValue(value)}</dd></div>`;
  }

  function adoptionDetailHtml(person) {
    const relation = adoptionRelation(person);
    const receiving = state.adoption.receivingByParent.get(String(personId(person))) || [];
    const inRecord = !relation && !receiving.length && recordHasAdoption(person, 'in');
    const collateral = recordHasCollateral(person);
    if (!relation && !receiving.length && !inRecord && !collateral) return '';
    const rows = [];
    if (relation) {
      rows.push(detailField('本图承嗣标记', '出继：卡片保留在亲生父亲支系', true));
      rows.push(`<div class="detail-field"><dt>亲生父亲</dt><dd class="relation-list">${relationChip(relation.biologicalParent)}</dd></div>`);
      rows.push(`<div class="detail-field"><dt>入继 / 承嗣父</dt><dd class="relation-list">${relationChip(relation.adoptiveParent)}</dd></div>`);
      rows.push(detailField('后代归属', `${text(relation.adoptiveParent.name)}名下（本图已将其后代归入该支系）`, true));
      rows.push(detailField('族谱依据', relation.source, true));
    }
    if (receiving.length) {
      rows.push(`<div class="detail-field full"><dt>入继人物</dt><dd class="relation-list">${receiving.map((item) => relationChip(item.outPerson)).join('')}</dd></div>`);
      rows.push(detailField('承嗣说明', '出继人物的后代在本图归入此承嗣父名下', true));
    }
    if (inRecord) rows.push(detailField('本谱标记', '入继 / 继子', true));
    if (collateral) rows.push(detailField('本谱标记', '兼祧 / 祀子', true));
    return `<section class="detail-section adoption-detail"><h4>出继 / 入继关系</h4><dl class="detail-grid">${rows.join('')}</dl></section>`;
  }

  function renderDetail() {
    const panel = $('#detail-panel');
    if (!panel) return;
    if (state.mode === 'edit') {
      panel.innerHTML = editFormHtml();
      refreshDetailMotion(panel, true, true);
      return;
    }
    const person = getPerson(state.selectedId);
    if (!person) {
      panel.innerHTML = `<div class="detail-empty"><div class="empty-seal">谱</div><h3>点击人物卡片</h3><p>这里会显示人物的完整资料、父母、配偶、子女、祖先路径和族谱记载。</p></div>`;
      refreshDetailMotion(panel, false, false);
      return;
    }
    const parents = parentsOf(person);
    const spouses = spousesOf(person);
    const spouseRaw = formValue(person, 'spouse_ids');
    const children = childrenOf(person);
    const displayChildren = displayChildrenOf(person);
    const ancestors = ancestorsOf(person);
    const raw = escapeHtml(JSON.stringify(person, null, 2));
    panel.innerHTML = `<div class="detail-head"><div><h3>${escapeHtml(person.name || '未命名人物')}</h3><p>${escapeHtml(viewGenerationLabel(person))} · 总谱第${generationOf(person) || '未详'}世 · ${escapeHtml(text(person.branch) || '未标注支系')} · ID ${escapeHtml(personId(person))}</p></div><div class="detail-head-actions">${!IS_ADMIN ? (state.detailOrigin === 'query' ? '<button class="detail-return-query" data-action="back-to-people-query">返回查族人</button>' : '<button class="detail-return-query" data-action="close-detail">返回世系图</button>') : ''}<button class="detail-close" data-action="close-detail" aria-label="关闭详情">×</button></div></div>
      ${IS_ADMIN ? '<div class="detail-actions"><button class="detail-btn primary" data-action="edit-person">直接编辑（实时保存）</button><button class="detail-btn" data-action="new-child">新增子女</button><button class="detail-btn" data-action="export-person">导出人物</button><button class="detail-btn danger" data-action="delete-person">删除</button></div>' : ''}
      <section class="detail-section"><h4>基本资料</h4><dl class="detail-grid">${detailField('姓名', person.name)}${detailField('性别', person.gender)}${detailField('本图世次', viewGenerationLabel(person))}${detailField('总谱世代', generationOf(person) ? `第${generationOf(person)}世` : person.generation)}${detailField('支系', person.branch)}${detailField('状态', lifeStatusLabel(person))}${detailField('状态依据', person.life_status_source || '待核验')}${detailField('重点标记', person.highlight ? '是' : '否')}</dl></section>
      <section class="detail-section"><h4>时间与地点</h4><dl class="detail-grid">${detailField('出生信息', person.birth_date)}${detailField('卒年 / 卒葬', person.death_date)}${detailField('籍贯', person.native_place)}${detailField('居住地', person.residence)}${detailField('葬地', person.burial_place)}${detailField('资料依据', person.vital_source)}</dl></section>
      <section class="detail-section"><h4>亲属关系</h4><dl class="detail-grid"><div class="detail-field full"><dt>父母（原始谱系）</dt><dd class="relation-list">${relationChipList(parents, '父母未详')}</dd></div><div class="detail-field full"><dt>配偶</dt><dd class="relation-list">${sourceRelationList(spouses, spouseRaw, '配偶未详')}</dd></div><div class="detail-field full"><dt>子女（原始关联 ${children.length}）</dt><dd class="relation-list">${relationChipList(children, '暂无已关联子女')}</dd></div><div class="detail-field full"><dt>子女（本图归属 ${displayChildren.length}）</dt><dd class="relation-list">${relationChipList(displayChildren, '暂无本图归属子女')}</dd></div></dl></section>
      <section class="detail-section detail-spouses-section"><h4>配偶完整信息</h4><div class="detail-spouses-list">${spouseFullInfoHtml(spouses, spouseRaw, person)}</div></section>
      ${adoptionDetailHtml(person)}
      <section class="detail-section"><h4>祖先路径</h4><div class="path-line">${ancestors.map((item, index) => `${index ? '<span class="path-arrow">›</span>' : ''}<span>${escapeHtml(item.name)}</span>`).join('')}</div></section>
      <section class="detail-section"><h4>族谱记载</h4><div class="detail-copy">${displayValue(person.biography, '暂无族谱记载')}</div></section>
      <section class="detail-section"><h4>补充资料</h4><dl class="detail-grid">${detailField('字 / 号', person.courtesy_name)}${detailField('身份 / 官职', person.title)}${detailField('过继 / 收养说明', person.adopt_note, true)}${detailField('出处页码', person.source_pages)}${detailField('资料依据', person.vital_source, true)}${detailField('配偶原始谱载', spouseRaw, true)}${detailField('配偶完整信息', person.spouse_record, true)}${detailField('备注', person.notes, true)}</dl></section>
      ${person.book_record ? `<section class="detail-section book-record-section"><h4>本人上册 / 下册原始谱载</h4><div class="detail-copy">${displayValue(person.book_record)}</div></section>` : ''}
      ${person.pdf_source_excerpt ? `<section class="detail-section pdf-source-section"><h4>PDF 原页逐条核对</h4><dl class="detail-grid">${detailField('核对页码', person.pdf_source_page)}${detailField('核对状态', person.pdf_source_review_status || '待复核')}${detailField('核对置信度', person.pdf_source_confidence, true)}${detailField('批次', person.pdf_review_batch)}</dl><div class="detail-copy pdf-source-excerpt"><strong>原页摘录（仅作证据，不替代结构化字段）</strong><p>${displayValue(person.pdf_source_excerpt)}</p></div></section>` : ''}
      <details class="raw-data" open><summary>查看全部原始数据字段（含未在表单展示的字段）</summary><pre>${raw}</pre></details>`;
    refreshDetailMotion(panel, true, false);
  }

  function refreshDetailMotion(panel, hasPerson, editing) {
    // 公共查询页未选中人物时不保留空白详情栏；点击卡片后再恢复详情栏。
    // 管理后台仍保留原有详情/编辑布局，避免影响后台操作。
    const shell = $('#app');
    const hideEmptyDetail = !IS_ADMIN && !hasPerson;
    panel.hidden = hideEmptyDetail;
    if (shell) shell.classList.toggle('is-detail-empty', hideEmptyDetail);
    panel.classList.toggle('has-person', hasPerson);
    panel.classList.toggle('is-editing', editing);
    panel.classList.remove('is-refreshing');
    panel.querySelectorAll('.detail-section').forEach((section, index) => {
      section.style.setProperty('--detail-index', Math.min(index, 8));
    });
    // 强制一次轻量重启动画，让实时保存后的详情变化立即可见，不改变滚动位置。
    void panel.offsetWidth;
    panel.classList.add('is-refreshing');
  }

  function formValue(person, key) {
    if (!person) return '';
    const aliases = {
      father_ref: ['father_id', 'fatherId', 'father'],
      mother_ref: ['mother_id', 'motherId', 'mother'],
      spouse_ids: ['spouse_ids', 'spouseIds', 'spouses']
    };
    const keys = aliases[key] || [key];
    for (const alias of keys) {
      if (person[alias] !== undefined && person[alias] !== null) return text(person[alias]);
    }
    return '';
  }

  function optionSelected(value, expected) {
    return String(value) === String(expected) ? ' selected' : '';
  }

  function editFormHtml() {
    const person = state.draftId ? getPerson(state.draftId) : null;
    const parent = state.draftParentId ? getPerson(state.draftParentId) : null;
    const current = person || {};
    const generation = generationOf(current) || (parent && generationOf(parent) ? generationOf(parent) + 1 : '');
    const father = formValue(current, 'father_ref') || (parent ? text(parent.name) : '');
    const options = state.data.slice().sort((a, b) => text(a.name).localeCompare(text(b.name), 'zh-CN')).map((item) => `<option value="${escapeHtml(item.name)}">`).join('');
    return `<div class="edit-head"><div><h3>${person ? '编辑人物资料' : '新增人物资料'}</h3><p>修改任意字段后会自动保存并立即更新世系图，不需要刷新或重新进入。</p></div><button class="detail-close" data-action="cancel-edit" aria-label="退出编辑">×</button></div>
      <form id="person-form" class="edit-form"><datalist id="person-options">${options}</datalist>
        <section class="form-section"><h4>基本资料</h4><div class="form-grid">${formInput('姓名', 'name', current.name, true)}${formSelect('性别', 'gender', current.gender, ['', '男', '女', '不详'])}${formInput('世代数字', 'generation_num', generation, false, 'number')}${formInput('世代标注', 'generation', current.generation)}${formInput('支系', 'branch', current.branch)}${formSelect('在世状态', 'is_alive', current.is_alive, ['', 'true', 'false', 'unknown'], ['未标注', '在世', '已故', '未知'])}${formInput('重点标记', 'highlight', current.highlight, false, 'checkbox')}</div></section>
        <section class="form-section"><h4>时间与地点</h4><div class="form-grid">${formInput('出生信息', 'birth_date', current.birth_date)}${formInput('卒年 / 卒葬', 'death_date', current.death_date)}${formInput('籍贯', 'native_place', current.native_place)}${formInput('居住地', 'residence', current.residence)}${formInput('葬地', 'burial_place', current.burial_place)}</div></section>
        <section class="form-section"><h4>亲属关系</h4><div class="form-grid">${formInput('父亲（可填姓名或 ID）', 'father_ref', father, false, 'text', 'person-options')}${formInput('母亲（可填姓名或 ID）', 'mother_ref', formValue(current, 'mother_ref'), false, 'text', 'person-options')}${formInput('配偶（姓名或 ID，可多个）', 'spouse_ids', formValue(current, 'spouse_ids'), false, 'text')}</div><p class="form-hint">父母填写后，树状图会按父亲或母亲关联展示子女；配偶支持用“、”分隔多个姓名。</p></section>
        <section class="form-section"><h4>族谱与补充资料</h4><div class="form-grid">${formTextarea('族谱记载', 'biography', current.biography, true)}${formInput('字 / 号', 'courtesy_name', current.courtesy_name)}${formInput('身份 / 官职', 'title', current.title)}${formSelect('卡片关系标记', 'adoption_status', current.adoption_status, ['', 'out', 'in', 'collateral'], ['不标记', '出继', '入继', '兼祧'])}${formTextarea('过继 / 收养说明', 'adopt_note', current.adopt_note, true)}${formInput('出处页码', 'source_pages', current.source_pages)}${formTextarea('备注', 'notes', current.notes, true)}</div><p class="form-hint">“卡片关系标记”会直接显示在人物卡片上；族谱记载和过继说明仍会保留并参与关系核对。</p></section>
        <div class="form-footer"><span id="autosave-status" class="autosave-status" aria-live="polite">修改后自动保存</span><button type="button" class="detail-btn" data-action="cancel-edit">完成编辑</button><button type="submit" class="detail-btn primary">立即保存并退出</button></div>
      </form>`;
  }

  function formInput(label, key, value, required, type, list) {
    const inputType = type || 'text';
    if (inputType === 'checkbox') return `<div class="form-field"><label><input type="checkbox" data-field="${key}"${value ? ' checked' : ''}> ${escapeHtml(label)}</label></div>`;
    return `<div class="form-field"><label for="field-${key}">${escapeHtml(label)}${required ? ' *' : ''}</label><input id="field-${key}" data-field="${key}" type="${inputType}" value="${escapeHtml(value)}"${required ? ' required' : ''}${list ? ` list="${list}"` : ''}></div>`;
  }

  function formSelect(label, key, value, values, labels) {
    const current = value === true ? 'true' : value === false ? 'false' : value;
    return `<div class="form-field"><label for="field-${key}">${escapeHtml(label)}</label><select id="field-${key}" data-field="${key}">${values.map((item, index) => `<option value="${escapeHtml(item)}"${optionSelected(current, item)}>${escapeHtml(labels ? labels[index] : item || '未标注')}</option>`).join('')}</select></div>`;
  }

  function formTextarea(label, key, value, full) {
    return `<div class="form-field${full ? ' full' : ''}"><label for="field-${key}">${escapeHtml(label)}</label><textarea id="field-${key}" data-field="${key}">${escapeHtml(value)}</textarea></div>`;
  }

  function getAdminToken() {
    try { return localStorage.getItem(ADMIN_TOKEN_KEY) || ''; } catch (error) { return ''; }
  }

  function queueServerSave() {
    if (!IS_ADMIN || typeof fetch !== 'function' || !getAdminToken()) return;
    serverSaveQueued = true;
    if (serverSaveTimer) clearTimeout(serverSaveTimer);
    serverSaveTimer = setTimeout(flushServerSave, 350);
  }

  async function flushServerSave() {
    if (!IS_ADMIN || typeof fetch !== 'function' || !getAdminToken()) return;
    if (serverSaveBusy) return;
    serverSaveBusy = true;
    serverSaveQueued = false;
    try {
      const response = await fetch('/api/data/genealogy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + getAdminToken()
        },
        body: JSON.stringify(state.data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const status = $('#autosave-status');
      if (status && state.mode === 'edit') {
        status.textContent = '已同步到服务器';
        status.classList.add('is-saved');
      }
    } catch (error) {
      showToast('服务器保存失败，当前修改仍暂存于本机；请检查管理员登录状态');
    } finally {
      serverSaveBusy = false;
      if (serverSaveQueued) serverSaveTimer = setTimeout(flushServerSave, 120);
    }
  }

  function persist() {
    // 公开查询页只读，不能让旧的浏览器本地编辑缓存覆盖当前交付数据。
    // 人物编辑、导入和自动备份只在独立管理后台执行。
    if (!IS_ADMIN) return;
    try {
      const serialized = JSON.stringify(state.data);
      localStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem(BACKUP_KEY, JSON.stringify({
        version: 1,
        savedAt: new Date().toISOString(),
        data: JSON.parse(serialized),
        verified: Array.from(state.verified)
      }));
    } catch (error) {
      showToast('本地保存或自动备份失败，请立即导出 JSON 备份');
    }
    queueServerSave();
  }

  function applyKnownPdfCorrections() {
    let changed = false;
    const ensureRecord = (record) => {
      const existing = getPerson(record.id);
      if (existing) return existing;
      state.data.push(clone(record));
      state.dataIndexReady = false;
      changed = true;
      return getPerson(record.id);
    };
    const setFatherOf = (id, fatherId, biography) => {
      const person = getPerson(id);
      if (!person) return;
      if (String(toId(person.father_id)) !== String(toId(fatherId))) {
        person.father_id = fatherId;
        state.dataIndexReady = false;
        changed = true;
      }
      if (biography && text(person.biography).trim() !== biography) {
        person.biography = biography;
        changed = true;
      }
    };
    const clearFatherOf = (id) => {
      const person = getPerson(id);
      if (!person) return;
      if (person.father_id !== null && person.father_id !== undefined && person.father_id !== '') {
        person.father_id = null;
        state.dataIndexReady = false;
        changed = true;
      }
      if (text(person.biography).trim() === '昌槐之子绍榴') {
        person.biography = '';
        changed = true;
      }
    };
    // 管理后台可能保留着旧版浏览器数据；服务器交付源新增人物时，
    // 将新增的源记录迁入旧缓存，避免“源数据已有、后台树图却看不到”。
    const syncNewDeliveryRecord = (id) => {
      const source = state.original.find((item) => String(personId(item)) === String(id));
      if (!source || getPerson(id)) return;
      ensureRecord(source);
      changed = true;
    };
    syncNewDeliveryRecord(1285); // 四十之子千十二
    // 小四（石马）是石马分房的第130世节点，与临海下渡的小四处于同一世次。
    // 旧版本地缓存曾把这张卡片保留为132世，必须在启动时自动纠正，避免查询页继续显示旧值。
    const stoneHorseXiaoSi = getPerson(1207);
    if (stoneHorseXiaoSi && text(stoneHorseXiaoSi.name).trim() === '小四(石马)' && Number(stoneHorseXiaoSi.generation_num) !== 130) {
      stoneHorseXiaoSi.generation_num = 130;
      changed = true;
    }
    // 上册明确记载：文杲子二，攒、撰。攒必须直接挂在文杲（ID 10）下面。
    setFatherOf(13, 10);
    // 上册后枫槎西房二房仅记大智之子为锡麟、锡凤；同名锡奎（ID 186）不是大智之子。
    clearFatherOf(186);
    // 大全公谱文记载的儿子是锡圭、锡璋；另一张同名锡奎（ID 185）也不是大全之子。
    clearFatherOf(185);
    // 绍法是学士公昌信（ID 394）之子，兼祧昌回、彦昌；不能挂在昌满（ID 433）下面。
    setFatherOf(553, 394);
    // 用户核对确认：昌信（出继）下面的重复“绍法”（ID 553）不再展示；保留昌回下面的绍法（ID 552）。
    const wrongShaoFa = getPerson(553);
    if (wrongShaoFa && text(wrongShaoFa.name).trim() === '绍法') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '553') person.father_id = 394;
        if (String(toId(person.mother_id)) === '553') person.mother_id = 394;
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '553');
      state.verified.delete('553');
      state.expanded.delete('553');
      if (String(state.selectedId) === '553') state.selectedId = 394;
      if (String(state.draftId) === '553') {
        state.mode = 'view';
        state.draftId = null;
        state.draftParentId = null;
      }
      state.dataIndexReady = false;
      changed = true;
    }
    // 用户最新核对：锡龄下的明才为入继记录，其后为学护（入继）。
    const adoptedMingCai = getPerson(261);
    if (adoptedMingCai && text(adoptedMingCai.name).trim() === '明才') {
      if (String(toId(adoptedMingCai.father_id)) !== '230') {
        adoptedMingCai.father_id = 230;
        state.dataIndexReady = false;
        changed = true;
      }
      if (text(adoptedMingCai.adoption_status).trim() !== 'in') {
        adoptedMingCai.adoption_status = 'in';
        changed = true;
      }
      if (text(adoptedMingCai.adopt_note).trim() !== '入继') {
        adoptedMingCai.adopt_note = '入继';
        changed = true;
      }
    }
    const adoptedXueHu = getPerson(332);
    if (adoptedXueHu && text(adoptedXueHu.name).trim() === '学护') {
      setFatherOf(332, 261, '明才之子学护，入继');
      if (text(adoptedXueHu.adoption_status).trim() !== 'in') {
        adoptedXueHu.adoption_status = 'in';
        changed = true;
      }
      if (text(adoptedXueHu.adopt_note).trim() !== '入继') {
        adoptedXueHu.adopt_note = '入继';
        changed = true;
      }
    }
    // 上册第101页明确记载：明秀次子学护出继明才为嗣；ID 333 是亲生侧出继记录，
    // 不能按同名重复卡片删除，需与 ID 332 的入继记录配对保留。
    // 用户最新核对确认：行安只有一个儿子孝通；清理旧版本误生成的“行安之子开通”（ID 991）。
    const wrongXingAnKaiTong = getPerson(991);
    if (wrongXingAnKaiTong && text(wrongXingAnKaiTong.name).trim() === '开通') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '991') person.father_id = 990;
        if (String(toId(person.mother_id)) === '991') person.mother_id = 990;
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '991');
      state.verified.delete('991');
      state.expanded.delete('991');
      if (String(state.selectedId) === '991') state.selectedId = 990;
      if (String(state.draftId) === '991') {
        state.mode = 'view';
        state.draftId = null;
        state.draftParentId = null;
      }
      state.dataIndexReady = false;
      changed = true;
    }
    // 下册明确记载：行安之子为孝通，女为莎莎；补建孝通卡片。
    ensureRecord({
      id: 1284,
      name: '孝通',
      generation: '163',
      generation_num: 163,
      gender: '男',
      branch: '',
      birth_date: '',
      spouse_ids: '',
      biography: '行安之子孝通',
      is_alive: '否',
      father_id: 879,
      highlight: false
    });
    setFatherOf(1284, 879, '行安之子孝通');
    // 用户核对确认：右侧重复的“天辰”（ID 1115）不再展示；保留左侧 ID 1114。
    const duplicateTianChen = getPerson(1115);
    if (duplicateTianChen && text(duplicateTianChen.name).trim() === '天辰') {
      const replacementFatherId = toId(duplicateTianChen.father_id);
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '1115') person.father_id = replacementFatherId || null;
        if (String(toId(person.mother_id)) === '1115') person.mother_id = replacementFatherId || null;
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '1115');
      state.verified.delete('1115');
      state.expanded.delete('1115');
      if (String(state.selectedId) === '1115') state.selectedId = replacementFatherId || null;
      if (String(state.draftId) === '1115') {
        state.mode = 'view';
        state.draftId = null;
        state.draftParentId = null;
      }
      state.dataIndexReady = false;
      changed = true;
    }
    // 用户核对确认：学富（ID 328）不是锡黼（ID 229）之子；在确认正确父亲前先解除错误父子线。
    clearFatherOf(328);
    // 明土（ID 248）是出继记录，明土（ID 249）是截图中显示“学知”的入继记录。
    const adoptedOutMingTu = getPerson(248);
    if (adoptedOutMingTu && text(adoptedOutMingTu.name).trim() === '明土') {
      setFatherOf(248, 226, '锡高之子明土，出继');
      if (text(adoptedOutMingTu.adoption_status).trim() !== 'out') {
        adoptedOutMingTu.adoption_status = 'out';
        changed = true;
      }
      if (text(adoptedOutMingTu.adopt_note).trim() !== '出继') {
        adoptedOutMingTu.adopt_note = '出继';
        changed = true;
      }
    }
    const adoptedInMingTu = getPerson(249);
    if (adoptedInMingTu && text(adoptedInMingTu.name).trim() === '明土') {
      setFatherOf(249, 211, '锡疏之子明土，入继');
      if (text(adoptedInMingTu.adoption_status).trim() !== 'in') {
        adoptedInMingTu.adoption_status = 'in';
        changed = true;
      }
      if (text(adoptedInMingTu.adopt_note).trim() !== '入继') {
        adoptedInMingTu.adopt_note = '入继';
        changed = true;
      }
    }
    const xueShi = ensureRecord({
      id: 325,
      name: '学士',
      generation: '157',
      generation_num: 157,
      gender: '男',
      branch: '',
      biography: '明土之子学士',
      father_id: 249,
      highlight: false
    });
    if (xueShi && text(xueShi.name).trim() === '学士') {
      setFatherOf(325, 249, '明土之子学士');
      // 之前删除学士时暂时上挂的三位后代，随学士恢复到原链条。
      setFatherOf(388, 325, '学士之子彦昌');
      setFatherOf(394, 325, '学士之子昌信');
      setFatherOf(401, 325, '学士之子昌回');
    }
    // 谱文明确记载：绍进公子二文军、永军。永军（ID 690）不是昌贵（ID 453）之子。
    setFatherOf(690, 575);
    // 谱文明确记载：昌木公子二绍根、绍富。绍富（ID 529）应与绍根同挂东水公之子昌木（ID 424）名下。
    setFatherOf(529, 424);
    // 谱文记载：世华之子谢林（数据卡名为谢琳，别名松楠），不是培松之子。
    setFatherOf(813, 588);
    // 绍榴只保留一张卡片。用户已明确否定“昌魁之子”和“昌槐之子”，
    // 在确认正确父亲前先撤掉错误父系，不能继续把错误关系写回本地数据。
    const shaoLiuRecords = state.data.filter((person) => text(person.name).trim() === '绍榴');
    if (shaoLiuRecords.length) {
      const canonicalShaoLiu = shaoLiuRecords.find((person) => String(personId(person)) === '550') || shaoLiuRecords[0];
      const canonicalShaoLiuId = personId(canonicalShaoLiu);
      const duplicateShaoLiuIds = new Set(
        shaoLiuRecords
          .filter((person) => String(personId(person)) !== String(canonicalShaoLiuId))
          .map((person) => String(personId(person)))
      );
      clearFatherOf(canonicalShaoLiuId);
      if (duplicateShaoLiuIds.size) {
        state.data.forEach((person) => {
          if (duplicateShaoLiuIds.has(String(toId(person.father_id)))) {
            person.father_id = canonicalShaoLiuId;
            changed = true;
          }
          if (duplicateShaoLiuIds.has(String(toId(person.mother_id)))) {
            person.mother_id = canonicalShaoLiuId;
            changed = true;
          }
          const spouseIds = text(person.spouse_ids)
            .split(/[、，,;；\s]+/)
            .filter(Boolean)
            .map((id) => duplicateShaoLiuIds.has(String(toId(id))) ? String(canonicalShaoLiuId) : id);
          if (text(person.spouse_ids) && spouseIds.join('、') !== text(person.spouse_ids)) {
            person.spouse_ids = spouseIds.join('、');
            changed = true;
          }
        });
        state.data = state.data.filter((person) => !duplicateShaoLiuIds.has(String(personId(person))));
        duplicateShaoLiuIds.forEach((id) => {
          if (state.verified.has(id)) {
            state.verified.delete(id);
            state.verified.add(String(canonicalShaoLiuId));
          }
          if (state.expanded.has(id)) {
            state.expanded.delete(id);
            state.expanded.add(String(canonicalShaoLiuId));
          }
        });
        if (duplicateShaoLiuIds.has(String(state.selectedId))) state.selectedId = canonicalShaoLiuId;
        changed = true;
      }
    }
    // “广”在上册中出现两次：申伯三世为弘之子，始宁东山三世为衡之子，不能共用同一条记录。
    const ancientGuang = ensureRecord({
      id: 1256,
      name: '广',
      generation_num: 67,
      generation: '3',
      gender: '男',
      branch: '申伯世系',
      biography: '弘之子，与协同为申伯三世。',
      father_id: 8,
      highlight: false
    });
    const repairs = [
      [14, ancientGuang && 1256],
      [17, ancientGuang && 1256],
      [1130, 1126],
      [1132, 1130],
      [1133, 1130],
      [1134, 1130]
    ];
    repairs.forEach(([id, fatherId]) => {
      const person = getPerson(id);
      if (!person || fatherId === false || fatherId === null) return;
      if (String(toId(person.father_id)) !== String(fatherId)) {
        person.father_id = fatherId;
        changed = true;
      }
    });
    const lateGuang = getPerson(1134);
    if (lateGuang && text(lateGuang.name).trim() === '广') {
      if (generationOf(lateGuang) !== 101) { lateGuang.generation_num = 101; changed = true; }
      if (text(lateGuang.generation).trim() !== '37') { lateGuang.generation = '37'; changed = true; }
      if (text(lateGuang.branch).trim() !== '始宁东山') { lateGuang.branch = '始宁东山'; changed = true; }
      if (text(lateGuang.biography).trim() !== '衡之子') { lateGuang.biography = '衡之子'; changed = true; }
    }
    // 孟献的亲生父亲为文用；宏基为其兼祧 / 祀承关系，不作为树状亲生父系。
    const mengXian = getPerson(47);
    if (mengXian && text(mengXian.name).trim() === '孟献' && String(toId(mengXian.father_id)) !== '44') {
      mengXian.father_id = 44;
      changed = true;
    }
    // 上册同一横列的“万、淮”为一人，应合并为“万淮”，只保留一张卡片。
    const wanHuai = getPerson(1139);
    if (wanHuai && ['万', '淮', '万淮'].includes(text(wanHuai.name).trim()) && text(wanHuai.name).trim() !== '万淮') {
      wanHuai.name = '万淮';
      changed = true;
    }
    const duplicateHuai = getPerson(1140);
    if (duplicateHuai) {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '1140') person.father_id = 1139;
        if (String(toId(person.mother_id)) === '1140') person.mother_id = 1139;
        if (text(person.spouse_ids).split(/[、，,;；\s]+/).includes('1140')) {
          person.spouse_ids = text(person.spouse_ids).split(/[、，,;；\s]+/).map((item) => item === '1140' ? '1139' : item).filter(Boolean).join('、');
        }
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '1140');
      changed = true;
    }
    // 云鸿、云英各有一位“大德”。两位同名同世代，但父系不同，必须保留为两张卡片。
    // 旧版本曾把 ID 141 合并到 ID 142，并把 ID 142 错改到云英名下；这里兼容已有本地保存数据并恢复两条父子关系。
    const yunhongDade = getPerson(142);
    const yunyingDade = ensureRecord({
      id: 141,
      name: '大德',
      generation_num: 154,
      generation: '154',
      gender: '男',
      branch: '',
      biography: '云英之子',
      father_id: 115,
      highlight: false
    });
    if (yunhongDade && text(yunhongDade.name).trim() === '大德' && String(toId(yunhongDade.father_id)) !== '122') {
      yunhongDade.father_id = 122;
      changed = true;
    }
    if (yunyingDade && text(yunyingDade.name).trim() === '大德' && String(toId(yunyingDade.father_id)) !== '115') {
      yunyingDade.father_id = 115;
      changed = true;
    }
    const xiaomeiOfYunying = getPerson(171);
    if (xiaomeiOfYunying && text(xiaomeiOfYunying.name).trim() === '小妹' && String(toId(xiaomeiOfYunying.father_id)) !== '115') {
      xiaomeiOfYunying.father_id = 115;
      changed = true;
    }
    // 台培的两个孩子为邦赋、邦源；邦源原始记录误挂到明跃名下。
    const bangYuan = getPerson(474);
    if (bangYuan && text(bangYuan.name).trim() === '邦源' && String(toId(bangYuan.father_id)) !== '310') {
      bangYuan.father_id = 310;
      changed = true;
    }
    // 序赖之子善富过继给序松：补回序赖名下的亲生 / 出继记录，保留序松名下的入继记录。
    const shanFuOut = ensureRecord({
      id: 1260,
      name: '善富',
      generation_num: 161,
      generation: '161',
      gender: '男',
      branch: '',
      biography: '序赖之子，过继给序松为嗣',
      adopt_note: '出继给序松为嗣',
      father_id: 679,
      highlight: false
    });
    const shanFuIn = getPerson(728);
    if (shanFuIn && text(shanFuIn.name).trim() === '善富') {
      if (String(toId(shanFuIn.father_id)) !== '671') {
        shanFuIn.father_id = 671;
        changed = true;
      }
      if (!text(shanFuIn.adopt_note).trim()) {
        shanFuIn.adopt_note = '入继序松为嗣';
        changed = true;
      }
    }
    // 删除误录的“世义之子善富”重复卡片；正确的善富为序赖之子、出继序松。
    const wrongShiYiShanFu = getPerson(729);
    if (wrongShiYiShanFu && text(wrongShiYiShanFu.name).trim() === '善富') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '729') {
          person.father_id = 728;
          changed = true;
        }
        if (String(toId(person.mother_id)) === '729') {
          person.mother_id = 728;
          changed = true;
        }
        const spouseIds = text(person.spouse_ids)
          .split(/[、，,;；\s]+/)
          .filter(Boolean)
          .map((id) => String(toId(id)) === '729' ? '728' : id);
        if (text(person.spouse_ids) && spouseIds.join('、') !== text(person.spouse_ids)) {
          person.spouse_ids = spouseIds.join('、');
          changed = true;
        }
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '729');
      if (state.verified.has('729')) {
        state.verified.delete('729');
        state.verified.add('728');
      }
      if (state.expanded.has('729')) {
        state.expanded.delete('729');
        state.expanded.add('728');
      }
      if (String(state.selectedId) === '729') state.selectedId = 728;
      changed = true;
    }
    const yongWei = getPerson(834);
    // 勇伟并非善富之子；下册第59页明确记载“世蛟公三子和淼……子二剑勇、勇伟”。
    if (yongWei && text(yongWei.name).trim() === '勇伟' && String(toId(yongWei.father_id)) !== '724') {
      yongWei.father_id = 724;
      changed = true;
    }
    const xingTing = getPerson(883);
    // 行庭属于世祥公长子德恩，不属于善富支系；下册第59页、第79页均有对应记载。
    if (xingTing && text(xingTing.name).trim() === '行庭' && String(toId(xingTing.father_id)) !== '762') {
      xingTing.father_id = 762;
      changed = true;
    }
    // 邦源的三个孩子为令八、令华、令水；其中令华、令水原始记录误挂到其他房系。
    const lingHua = getPerson(483);
    if (lingHua && text(lingHua.name).trim() === '令华' && String(toId(lingHua.father_id)) !== '474') {
      lingHua.father_id = 474;
      changed = true;
    }
    const lingShui = getPerson(484);
    if (lingShui && text(lingShui.name).trim() === '令水' && String(toId(lingShui.father_id)) !== '474') {
      lingShui.father_id = 474;
      changed = true;
    }
    // 令水、令华两支的下一代在上册世系图中分别为序广、序线；原始数据曾误挂到旁支。
    const xuGuang = getPerson(670);
    if (xuGuang && text(xuGuang.name).trim() === '序广' && String(toId(xuGuang.father_id)) !== '484') {
      xuGuang.father_id = 484;
      changed = true;
    }
    const xuXian = getPerson(675);
    if (xuXian && text(xuXian.name).trim() === '序线' && String(toId(xuXian.father_id)) !== '483') {
      xuXian.father_id = 483;
      changed = true;
    }
    const xuZuo = getPerson(672);
    if (xuZuo && text(xuZuo.name).trim() === '序祚' && String(toId(xuZuo.father_id)) !== '483') {
      xuZuo.father_id = 483;
      changed = true;
    }
    const xuChou = getPerson(676);
    if (xuChou && text(xuChou.name).trim() === '序绸' && String(toId(xuChou.father_id)) !== '483') {
      xuChou.father_id = 483;
      changed = true;
    }
    const xuDuanOut = getPerson(677);
    if (xuDuanOut && text(xuDuanOut.name).trim() === '序缎' && String(toId(xuDuanOut.father_id)) !== '483') {
      xuDuanOut.father_id = 483;
      changed = true;
    }
    const xuDuanIn = getPerson(678);
    if (xuDuanIn && text(xuDuanIn.name).trim() === '序缎' && String(toId(xuDuanIn.father_id)) !== '484') {
      xuDuanIn.father_id = 484;
      changed = true;
    }
    // 善鸿为序缎（ID 677）之子；避免本地旧数据把他误挂到另一条同名序缎记录下。
    const shanHong = getPerson(734);
    if (shanHong && text(shanHong.name).trim() === '善鸿' && String(toId(shanHong.father_id)) !== '677') {
      shanHong.father_id = 677;
      changed = true;
    }
    // 下册第54页：序绸公的三个儿子为善美、善全、善尊；序线公的善美为入继记录。
    // 原始导入把同名善美、善尊分别挂到了世光、世凌、世伟名下，必须按谱页恢复。
    const shanQuan = getPerson(727);
    if (shanQuan && text(shanQuan.name).trim() === '善全' && String(toId(shanQuan.father_id)) !== '676') {
      shanQuan.father_id = 676;
      changed = true;
    }
    const shanZun = getPerson(730);
    if (shanZun && text(shanZun.name).trim() === '善尊') {
      if (String(toId(shanZun.father_id)) !== '676') { shanZun.father_id = 676; changed = true; }
      if (text(shanZun.biography).trim() !== '序绸之子') { shanZun.biography = '序绸之子'; changed = true; }
    }
    const shanMeiBiological = getPerson(731);
    if (shanMeiBiological && text(shanMeiBiological.name).trim() === '善美') {
      if (String(toId(shanMeiBiological.father_id)) !== '676') { shanMeiBiological.father_id = 676; changed = true; }
      if (text(shanMeiBiological.biography).trim() !== '序绸之子，后出继序线为嗣') {
        shanMeiBiological.biography = '序绸之子，后出继序线为嗣';
        changed = true;
      }
      if (text(shanMeiBiological.adopt_note).trim() !== '出继序线为嗣') {
        shanMeiBiological.adopt_note = '出继序线为嗣';
        changed = true;
      }
    }
    const shanMeiAdopted = getPerson(732);
    if (shanMeiAdopted && text(shanMeiAdopted.name).trim() === '善美') {
      if (String(toId(shanMeiAdopted.father_id)) !== '675') { shanMeiAdopted.father_id = 675; changed = true; }
      if (text(shanMeiAdopted.biography).trim() !== '序绸之子，入继序线为嗣') {
        shanMeiAdopted.biography = '序绸之子，入继序线为嗣';
        changed = true;
      }
      if (text(shanMeiAdopted.adopt_note).trim() !== '入继序线为嗣') {
        shanMeiAdopted.adopt_note = '入继序线为嗣';
        changed = true;
      }
    }
    // 下册第58页：世麓公子和发，子四行星、行根、行兴、行敏；行根不是善鸿之子。
    const xingGen = getPerson(889);
    if (xingGen && text(xingGen.name).trim() === '行根') {
      if (String(toId(xingGen.father_id)) !== '766') { xingGen.father_id = 766; changed = true; }
      if (text(xingGen.biography).trim() !== '德新之子') { xingGen.biography = '德新之子'; changed = true; }
    }
    // 下册第23页、第40页：绍尧之子世铨出继绍虞为嗣；原始数据误挂到绍圣。
    const shiQuanBiological = getPerson(653);
    if (shiQuanBiological && text(shiQuanBiological.name).trim() === '世铨') {
      if (String(toId(shiQuanBiological.father_id)) !== '530') { shiQuanBiological.father_id = 530; changed = true; }
      if (text(shiQuanBiological.biography).trim() !== '绍尧之子，出继绍虞为嗣') {
        shiQuanBiological.biography = '绍尧之子，出继绍虞为嗣';
        changed = true;
      }
      if (text(shiQuanBiological.adopt_note).trim() !== '出继绍虞为嗣') {
        shiQuanBiological.adopt_note = '出继绍虞为嗣';
        changed = true;
      }
    }
    const shiQuanAdopted = getPerson(652);
    if (shiQuanAdopted && text(shiQuanAdopted.name).trim() === '世铨') {
      if (String(toId(shiQuanAdopted.father_id)) !== '568') { shiQuanAdopted.father_id = 568; changed = true; }
      if (text(shiQuanAdopted.biography).trim() !== '入继绍虞为嗣') {
        shiQuanAdopted.biography = '入继绍虞为嗣';
        changed = true;
      }
      if (text(shiQuanAdopted.adopt_note).trim() !== '入继绍虞为嗣') {
        shiQuanAdopted.adopt_note = '入继绍虞为嗣';
        changed = true;
      }
    }
    // 下册第62页、第82页：伟中子信科、女佶明；佶明不是序祚之子。
    const jiMing = getPerson(827);
    if (jiMing && text(jiMing.name).trim() === '佶明') {
      if (String(toId(jiMing.father_id)) !== '707') { jiMing.father_id = 707; changed = true; }
      if (text(jiMing.gender).trim() !== '女') { jiMing.gender = '女'; changed = true; }
      if (text(jiMing.biography).trim() !== '伟中之女') { jiMing.biography = '伟中之女'; changed = true; }
    }
    // 下册第5、6、10、23、24、35—40、58—62页及上册第42—46页复核：
    // 这些是“本名/字名”错位或同名分支导致的父子关系，不能按相邻 ID 推断。
    // 昌贵有两人：学佐之子为“邦贵”记录，学业之子为迁舟山的“昌贵”记录。
    setFatherOf(473, 308, '台佐（学佐）之子邦渠（昌渠）');
    setFatherOf(453, 313, '学业之子昌贵（迁舟山）');
    setFatherOf(475, 308, '台佐（学佐）之子邦贵（昌贵）');
    setFatherOf(518, 475, '邦贵（昌贵）之子绍印');
    setFatherOf(481, 473, '邦渠（昌渠）之子令享（绍享）');
    setFatherOf(522, 473, '邦渠（昌渠）之子绍基');
    setFatherOf(494, 453, '昌贵（迁舟山）之子宝根');
    setFatherOf(605, 494, '宝根之子世康');
    setFatherOf(610, 531, '绍岳之子世成');
    setFatherOf(611, 494, '宝根之子世成');
    setFatherOf(534, 432, '昌泉之子绍庭');
    // 下册第21页明确记载昌泉公二子：绍庭、绍有；修正绍有的父子关系。
    setFatherOf(538, 432, '昌泉之子绍有');
    // 下册第38页明确记载绍立公二子：世金、世玉；原始数据漏录世玉。
    const shiYu = ensureRecord({
      id: 1267,
      name: '世玉',
      generation_num: 160,
      generation: '160',
      gender: '男',
      branch: '',
      biography: '绍立之子世玉，又名小玉，迁大林',
      father_id: 561,
      highlight: false
    });
    if (shiYu && String(toId(shiYu.father_id)) !== '561') {
      shiYu.father_id = 561;
      changed = true;
    }
    // 藏金属于明旺之子“学诗”一支，应与富金并列；不能挂到另一张同名学诗卡片下。
    setFatherOf(471, 371, '明旺之子学诗之子藏金');
    // 下册明确记载：藏金公子四——绍进、绍宝、绍会、绍兴。
    // 其中绍进有两张同名卡片，只有 ID 575 属于藏金；ID 574 仍保留在昌申支。
    setFatherOf(575, 471, '藏金之子绍进');
    setFatherOf(525, 471, '藏金之子绍宝');
    setFatherOf(511, 471, '藏金之子绍会');
    setFatherOf(514, 471, '藏金之子绍兴');
    // 下册明确记载：景庆公子二绍一、绍二；绍二（ID 508）应挂在景庆（ID 469）下。
    setFatherOf(508, 469, '景庆之子绍二');
    setFatherOf(540, 406, '昌宏之子绍杭');
    setFatherOf(527, 447, '昌言之子绍宽');
    setFatherOf(568, 468, '昌龙之子绍虞');
    // 绍尧的五个儿子中，世墙入继绍辉；世铨入继绍虞。保留亲生卡与入继卡。
    setFatherOf(598, 530, '绍尧之子世墙，入继绍辉为嗣');
    setFatherOf(628, 530, '绍尧之子世烘');
    setFatherOf(624, 530, '绍尧之子世漘');
    setFatherOf(619, 530, '绍尧之子世森');
    setFatherOf(653, 530, '绍尧之子世铨，出继绍虞为嗣');
    // 海水不是世铨之子；正确父亲待按族谱原文确认，先撤销错误父系。
    clearFatherOf(798);
    // 会达另有一位女儿“超敏”；与德宽之子超敏不是同一人，必须保留两张同名卡片。
    const huiDaChaoMin = ensureRecord({
      id: 1268,
      name: '超敏',
      generation_num: 162,
      generation: '162',
      gender: '女',
      branch: '',
      biography: '会达之女超敏',
      father_id: 706,
      highlight: false
    });
    if (huiDaChaoMin && text(huiDaChaoMin.name).trim() === '超敏') {
      setFatherOf(1268, 706, '会达之女超敏');
      if (text(huiDaChaoMin.gender).trim() !== '女') {
        huiDaChaoMin.gender = '女';
        changed = true;
      }
    }
    // 删除误录的“德宽之子超敏”卡片；若旧卡片已有后代，全部转接到会达之女超敏。
    const wrongDeKuanChaoMin = getPerson(912);
    if (wrongDeKuanChaoMin && text(wrongDeKuanChaoMin.name).trim() === '超敏') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '912') {
          person.father_id = 1268;
          changed = true;
        }
        if (String(toId(person.mother_id)) === '912') {
          person.mother_id = 1268;
          changed = true;
        }
        const spouseIds = text(person.spouse_ids)
          .split(/[、，,;；\s]+/)
          .filter(Boolean)
          .map((id) => String(toId(id)) === '912' ? '1268' : id);
        if (text(person.spouse_ids) && spouseIds.join('、') !== text(person.spouse_ids)) {
          person.spouse_ids = spouseIds.join('、');
          changed = true;
        }
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '912');
      if (state.verified.has('912')) {
        state.verified.delete('912');
        state.verified.add('1268');
      }
      if (state.expanded.has('912')) {
        state.expanded.delete('912');
        state.expanded.add('1268');
      }
      if (String(state.selectedId) === '912') state.selectedId = 1268;
      changed = true;
    }
    // 锡圭为大岳之子；原始数据中缺少这张人物卡片，补入本宗世系。
    const xiGui = ensureRecord({
      id: 1269,
      name: '锡圭',
      generation_num: 155,
      generation: '155',
      gender: '男',
      branch: '',
      biography: '大岳之子锡圭',
      father_id: 138,
      highlight: false
    });
    if (xiGui && text(xiGui.name).trim() === '锡圭') {
      setFatherOf(1269, 138, '大岳之子锡圭');
      if (text(xiGui.gender).trim() !== '男') {
        xiGui.gender = '男';
        changed = true;
      }
    }
    // “锡圭”有两位：大岳之子与大全之子，不能合并；分别承接各自后代。
    const xiGuiOfDaQuan = ensureRecord({
      id: 1270,
      name: '锡圭',
      generation_num: 155,
      generation: '155',
      gender: '男',
      branch: '',
      biography: '大全之子锡圭',
      father_id: 129,
      highlight: false
    });
    if (xiGuiOfDaQuan && text(xiGuiOfDaQuan.name).trim() === '锡圭') {
      setFatherOf(1270, 129, '大全之子锡圭');
      if (text(xiGuiOfDaQuan.gender).trim() !== '男') {
        xiGuiOfDaQuan.gender = '男';
        changed = true;
      }
    }
    setFatherOf(240, 1269, '大岳之子锡圭之子明伦');
    setFatherOf(283, 1269, '大岳之子锡圭之子明燮');
    setFatherOf(241, 1270, '大全之子锡圭之子明光');
    setFatherOf(264, 1270, '大全之子锡圭之子明旺');
    setFatherOf(268, 1270, '大全之子锡圭之子明柜');
    // 明旺还有一子复生；补入独立人物卡，并固定挂在大全之子锡圭支下的明旺名下。
    const fuSheng = ensureRecord({
      id: 1272,
      name: '复生',
      generation_num: 157,
      generation: '157',
      gender: '男',
      branch: '',
      biography: '明旺之子复生',
      father_id: 264,
      highlight: false
    });
    if (fuSheng) setFatherOf(1272, 264, '明旺之子复生');
    setFatherOf(607, 531, '绍岳之子世彬，出继绍印为嗣');
    // 绍源之子为世鹿（谱文作世麓）；其下德新、和发、和财、和政均归此支。
    setFatherOf(515, 419, '昌才之子绍凤');
    setFatherOf(555, 419, '昌才之子绍源');
    setFatherOf(580, 419, '昌才之子绍鸾');
    setFatherOf(579, 419, '昌才之子绍鸣');
    setFatherOf(657, 555, '绍源之子世鹿（世麓）');
    setFatherOf(766, 657, '世鹿（世麓）之子德新');
    setFatherOf(719, 657, '世鹿（世麓）之子和发');
    setFatherOf(725, 657, '世鹿（世麓）之子和财');
    setFatherOf(721, 657, '世鹿（世麓）之子和政');
    setFatherOf(875, 766, '德新之子行兴');
    setFatherOf(889, 766, '德新之子行根');
    // 绍印入继世彬记录后的四个儿子，以及世漘、世森支下的后代。
    setFatherOf(770, 606, '世彬（入继绍印）之子德盛');
    setFatherOf(744, 606, '世彬（入继绍印）之子宏明');
    setFatherOf(735, 606, '世彬（入继绍印）之子四德');
    setFatherOf(767, 624, '世漘之子德武');
    setFatherOf(825, 773, '德道之子仁安');
    // 世墙（入继绍辉）为德恩、德宽、德会之父；德恩的五个孩子必须完整归在德恩下。
    setFatherOf(757, 597, '世墙（入继绍辉）之子德宽');
    setFatherOf(749, 597, '世墙（入继绍辉）之子德会');
    setFatherOf(877, 762, '德恩之子行善');
    setFatherOf(891, 762, '德恩之子行海');
    setFatherOf(883, 762, '德恩之子行庭');
    setFatherOf(879, 762, '德恩之子行安；子一：孝通');
    // 第二轮逐页复核：以下关系来自下册第5—42、51—82页的“某公子/女”原文，
    // 专门修正导入时发生的横列错位。这里不按 ID 邻近关系猜测，均按人物卡和谱页名称落点。
    const changAo = ensureRecord({
      id: 1263,
      name: '昌鳌',
      generation_num: 158,
      generation: '158',
      gender: '男',
      branch: '',
      biography: '学齐之子，后枫槎西房大房二分',
      father_id: 377,
      highlight: false
    });
    if (changAo && String(toId(changAo.father_id)) !== '377') {
      changAo.father_id = 377;
      changed = true;
    }
    // 绍乡、世炉、世常、丙进均存在亲生记录与入继记录，先恢复两端的亲生父亲。
    setFatherOf(478, 443, '昌立之子丙进，出祧昌道为嗣');
    setFatherOf(479, 456, '昌道之嗣丙进');
    setFatherOf(488, 422, '昌有之子仲才，出继昌庆为嗣');
    setFatherOf(489, 411, '昌庆之嗣仲才');
    setFatherOf(686, 488, '仲才之子方国');
    setFatherOf(776, 686, '方国之子志豪');
    setFatherOf(505, 436, '昌申之子绍乡，出继昌鳌为嗣');
    setFatherOf(506, 1263, '昌鳌之嗣绍乡');
    setFatherOf(549, 407, '昌宗之子绍椿');
    // 下册第5页明确记载昌宗公子三：绍则、绍椿、绍忠；补正绍忠的父子关系。
    setFatherOf(536, 407, '昌宗之子绍忠');
    setFatherOf(627, 516, '绍则之子世炉，出继绍椿为嗣');
    // 下册第30页明确记载仲启公子二：彩国、彩忠；彩忠不是世炉之子。
    setFatherOf(682, 487, '仲启之子彩忠');
    // 上册谱传与下册第8页均记载学治公子二：昌梧、昌窗；补入原始数据漏掉的昌梧。
    const changWu = ensureRecord({
      id: 1266,
      name: '昌梧',
      generation_num: 158,
      generation: '158',
      gender: '男',
      branch: '',
      biography: '学治之子昌梧',
      father_id: 347,
      highlight: false
    });
    if (changWu && String(toId(changWu.father_id)) !== '347') {
      changWu.father_id = 347;
      changed = true;
    }
    setFatherOf(604, 574, '绍进之子世常，出继绍让为嗣');
    setFatherOf(741, 696, '谢平之女宁涵，入继华标为嗣');
    setFatherOf(742, 664, '华标之嗣宁涵');
    setFatherOf(760, 657, '世麓之子德崇，出继世锈为嗣');
    setFatherOf(921, 730, '善尊之子道贤，出继善美为嗣');
    setFatherOf(922, 732, '善美之嗣道贤');
    // 道贤的入继记录明确挂在善美名下；保留善尊名下的亲生记录，同时让详情和卡片都直观显示“入继”。
    const daoXianOut = getPerson(921);
    const daoXianIn = getPerson(922);
    if (daoXianOut && text(daoXianOut.name).trim() === '道贤' && text(daoXianOut.adopt_note).trim() !== '出继善美为嗣') {
      daoXianOut.adopt_note = '出继善美为嗣';
      daoXianOut.adoption_status = 'out';
      changed = true;
    }
    if (daoXianIn && text(daoXianIn.name).trim() === '道贤') {
      if (String(toId(daoXianIn.father_id)) !== '732') { daoXianIn.father_id = 732; changed = true; }
      if (text(daoXianIn.biography).trim() !== '善美之嗣道贤') { daoXianIn.biography = '善美之嗣道贤'; changed = true; }
      if (text(daoXianIn.adopt_note).trim() !== '入继善美为嗣') { daoXianIn.adopt_note = '入继善美为嗣'; changed = true; }
      if (text(daoXianIn.adoption_status).trim() !== 'in') { daoXianIn.adoption_status = 'in'; changed = true; }
    }
    // 邦字辈及其下的明确父子关系。
    setFatherOf(420, 319, '学兰之子昌拓');
    setFatherOf(537, 420, '昌拓之子绍意');
    setFatherOf(856, 792, '晶晶之子梓颜');
    // 昌鳖不是学廉之子；正确父亲待按族谱原文确认，先撤销错误父系。
    clearFatherOf(466);
    // 下册明确记载：仲兴公子二世帮、吉江；吉江不是绍崇之子。
    setFatherOf(665, 486, '仲兴之子吉江');
    // 锡周名下两张“明德”是重复卡片，保留 ID 258，清理 ID 259。
    const duplicateMingDe = getPerson(259);
    if (duplicateMingDe && text(duplicateMingDe.name).trim() === '明德' && getPerson(258) && text(getPerson(258).name).trim() === '明德') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '259') {
          person.father_id = 258;
          changed = true;
        }
        if (String(toId(person.mother_id)) === '259') {
          person.mother_id = 258;
          changed = true;
        }
        const spouseIds = text(person.spouse_ids)
          .split(/[、，,;；\s]+/)
          .filter(Boolean)
          .map((id) => String(toId(id)) === '259' ? '258' : id);
        if (text(person.spouse_ids) && spouseIds.join('、') !== text(person.spouse_ids)) {
          person.spouse_ids = spouseIds.join('、');
          changed = true;
        }
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '259');
      if (state.verified.has('259')) {
        state.verified.delete('259');
        state.verified.add('258');
      }
      if (state.expanded.has('259')) {
        state.expanded.delete('259');
        state.expanded.add('258');
      }
    if (String(state.selectedId) === '259') state.selectedId = 258;
      changed = true;
    }
    // 锡公名下的“明杨”只保留一张；若本地编辑数据中出现重复卡片，后代和标记统一迁回原始记录 ID 267。
    const mingYangRecords = state.data.filter((person) => {
      if (text(person.name).trim() !== '明杨') return false;
      const father = rawFatherOf(person);
      return father && (String(personId(father)) === '181' || text(father.name).trim() === '锡公');
    });
    if (mingYangRecords.length > 1) {
      const canonicalMingYang = mingYangRecords.find((person) => String(personId(person)) === '267')
        || mingYangRecords.slice().sort((a, b) => Number(personId(a)) - Number(personId(b)))[0];
      const duplicateMingYangIds = new Set(mingYangRecords
        .filter((person) => String(personId(person)) !== String(personId(canonicalMingYang)))
        .map((person) => String(personId(person))));
      state.data.forEach((person) => {
        if (duplicateMingYangIds.has(String(toId(person.father_id)))) {
          person.father_id = personId(canonicalMingYang);
          changed = true;
        }
        if (duplicateMingYangIds.has(String(toId(person.mother_id)))) {
          person.mother_id = personId(canonicalMingYang);
          changed = true;
        }
        const spouseIds = text(person.spouse_ids)
          .split(/[、，,;；\s]+/)
          .filter(Boolean)
          .map((id) => duplicateMingYangIds.has(String(toId(id))) ? String(personId(canonicalMingYang)) : id);
        if (text(person.spouse_ids) && spouseIds.join('、') !== text(person.spouse_ids)) {
          person.spouse_ids = spouseIds.join('、');
          changed = true;
        }
      });
      state.data = state.data.filter((person) => !duplicateMingYangIds.has(String(personId(person))));
      duplicateMingYangIds.forEach((id) => {
        state.verified.delete(id);
        state.expanded.delete(id);
      });
      if (duplicateMingYangIds.has(String(state.selectedId))) state.selectedId = personId(canonicalMingYang);
      changed = true;
    }
    // 明扬（ID 1250）与明杨（ID 267）为同音异名的不同记录；父系以 canonical genealogy.json 原页复核结果为准。
    // 上册逐条核定：明扬、明聪、学幹的性别及生卒信息；年号同时保留原载写法。
    const mingYang1250 = getPerson(1250);
    if (mingYang1250) {
      mingYang1250.gender = '男';
      mingYang1250.birth_date = '乾隆五十二年丁未八月十八日亥时（公元1787年）';
      mingYang1250.death_date = '嘉庆二十五年七月初一日酉时（公元1820年）';
      mingYang1250.is_alive = '否';
      mingYang1250.vital_source = '上册谱文：明扬字永畅，生乾隆丁未年，卒嘉庆廿五年';
    }
    const mingCong1251 = getPerson(1251);
    if (mingCong1251) {
      mingCong1251.gender = '男';
      mingCong1251.birth_date = '嘉庆二十四年己卯五月二十四日申时（公元1799年）';
      mingCong1251.death_date = '卒失（谱载）';
      mingCong1251.is_alive = '否';
      mingCong1251.vital_source = '上册谱文：锡巧公明聪字永慧，生嘉庆廿四年，卒失';
    }
    const xueGan1253 = getPerson(1253);
    if (xueGan1253) {
      xueGan1253.gender = '男';
      xueGan1253.birth_date = '乾隆三十四年己丑九月十六日午时（公元1769年）';
      xueGan1253.death_date = '卒俱失（谱载）';
      xueGan1253.is_alive = '否';
      xueGan1253.vital_source = '上册谱文：明灼公学幹字嘉茂，生乾隆己丑年，生卒俱失';
    }
    // 下册明确载“生娶卒葬俱失/卒失”者，只标已故，不虚构具体卒日。
    const confirmedDeadRecords = {
      141: '云英公大德公生娶卒俱失，墓在大岭脚',
      1260: '善富公生光绪十三年，卒失',
      1263: '昌鳌公卒失',
      1266: '昌梧公卒道光廿八年八月初八日戌时',
      1269: '大岳之子锡圭生乾隆四十二年，卒道光元年八月十六日酉时',
      1270: '大全之子锡圭生嘉庆八年，卒咸丰五年三月廿八日申时',
      1271: '昌美之子绍红生光绪十八年，卒失，葬虎头山'
    };
    for (const [id, source] of Object.entries(confirmedDeadRecords)) {
      const person = getPerson(Number(id));
      if (person) {
        person.is_alive = '否';
        person.death_date = /卒[^，。；]*/.exec(source)?.[0] || '卒失（谱载）';
        person.vital_source = `下册/上册谱文：${source}`;
      }
    }
    // 以上确认结果用静态变量再写一遍，供服务端安全解析器同步到 AI 读取层。
    const dead141 = getPerson(141); if (dead141) { dead141.is_alive = '否'; dead141.death_date = '卒俱失（谱载）'; dead141.vital_source = '上册谱文：生娶卒俱失，墓在大岭脚'; }
    const dead1260 = getPerson(1260); if (dead1260) { dead1260.is_alive = '否'; dead1260.death_date = '卒失（谱载）'; dead1260.vital_source = '下册谱文：生光绪十三年，卒失'; }
    const dead1263 = getPerson(1263); if (dead1263) { dead1263.is_alive = '否'; dead1263.death_date = '卒失（谱载）'; dead1263.vital_source = '下册谱文：昌鳌公卒失'; }
    const dead1266 = getPerson(1266); if (dead1266) { dead1266.is_alive = '否'; dead1266.death_date = '道光二十八年八月初八日戌时'; dead1266.vital_source = '上册谱文：昌梧公卒道光廿八年八月初八日戌时'; }
    const dead1269 = getPerson(1269); if (dead1269) { dead1269.is_alive = '否'; dead1269.death_date = '道光元年八月十六日酉时'; dead1269.vital_source = '上册谱文：大岳之子锡圭卒道光元年'; }
    const dead1270 = getPerson(1270); if (dead1270) { dead1270.is_alive = '否'; dead1270.death_date = '咸丰五年三月二十八日申时'; dead1270.vital_source = '上册谱文：大全之子锡圭卒咸丰五年'; }
    // 昌美之子绍红：原始数据缺少该人物，补入昌美支系。
    const shaoHong = ensureRecord({
      id: 1271,
      name: '绍红',
      generation_num: 159,
      generation: '159',
      gender: '男',
      branch: '',
      biography: '昌美之子绍红',
      father_id: 444,
      highlight: false
    });
    if (shaoHong) {
      if (text(shaoHong.name).trim() !== '绍红') {
        shaoHong.name = '绍红';
        changed = true;
      }
      setFatherOf(1271, 444, '昌美之子绍红');
      if (text(shaoHong.gender).trim() !== '男') {
        shaoHong.gender = '男';
        changed = true;
      }
      shaoHong.is_alive = '否';
      shaoHong.death_date = '卒失（谱载）';
      shaoHong.vital_source = '下册谱文：生光绪十八年，卒失，葬虎头山';
    }
    // 上册世系图“明炜—学礼—昌弟”明确相承；昌弟不是台佐之子。
    setFatherOf(413, 357, '学礼之子昌弟');
    setFatherOf(453, 313, '学业之子昌贵（迁舟山）');
    setFatherOf(473, 308, '台佐（学佐）之子邦渠（昌渠）');
    setFatherOf(474, 310, '台培（学培）之子邦源（昌源）');
    setFatherOf(519, 406, '昌宏之子绍和');
    setFatherOf(540, 406, '昌宏之子绍杭');
    setFatherOf(570, 436, '昌申之子绍谦');
    setFatherOf(569, 436, '昌申之子绍让');
    setFatherOf(556, 1263, '昌鳌之子绍玉');
    setFatherOf(559, 1263, '昌鳌之子绍礼');
    setFatherOf(547, 446, '昌茂之子绍梦');
    setFatherOf(528, 446, '昌茂之子绍寅');
    setFatherOf(558, 446, '昌茂之子绍睦');
    setFatherOf(543, 412, '昌延之子绍柳');
    setFatherOf(542, 467, '昌龄之子绍柏');
    setFatherOf(546, 467, '昌龄之子绍梅');
    // 前枫槎、昌立、昌信和期江一支。
    setFatherOf(499, 428, '昌桂之子期江');
    setFatherOf(480, 465, '昌魁之子云苗');
    setFatherOf(509, 465, '昌魁之子绍云');
    setFatherOf(533, 405, '昌夫之子绍平');
    setFatherOf(493, 443, '昌立之子大启');
    setFatherOf(495, 443, '昌立之子小启');
    setFatherOf(500, 443, '昌立之子水官');
    setFatherOf(691, 500, '水官之子爱中');
    setFatherOf(692, 500, '水官之子爱民');
    setFatherOf(666, 480, '云苗之子国威');
    setFatherOf(697, 533, '绍平之女静怡');
    setFatherOf(789, 658, '伟国之子晨东');
    setFatherOf(478, 443, '昌立之子丙进，出祧昌道为嗣');
    setFatherOf(614, 478, '丙进之子世曹');
    setFatherOf(634, 478, '丙进之子世省');
    // 用户核对确认：国威的两个儿子为凯杰、松泽；松泽不是世郎之子。
    setFatherOf(715, 666, '国威之子凯杰');
    setFatherOf(794, 666, '国威之子松泽');
    // 用户核对确认：世能（ID 641）还有一个儿子海永。
    const haiYong = ensureRecord({
      id: 1277,
      name: '海永',
      generation: '161',
      generation_num: 161,
      gender: '男',
      branch: '',
      biography: '世能之子海永',
      father_id: 641,
      highlight: false
    });
    if (haiYong && text(haiYong.name).trim() === '海永') setFatherOf(1277, 641, '世能之子海永');
    // 谱文明确记载：琛凯有女二谢祎、一宁；海永长子行牧、次女行书。
    // 原始导入曾把“行牧”“行书”挂到其他支系，现按用户核对结果统一归回海永名下。
    const chenKaiDaughter1 = ensureRecord({
      id: 1278,
      name: '谢祎',
      generation: '162',
      generation_num: 162,
      gender: '女',
      branch: '',
      biography: '琛凯之女谢祎',
      father_id: 802,
      highlight: false
    });
    const chenKaiDaughter2 = ensureRecord({
      id: 1279,
      name: '一宁',
      generation: '162',
      generation_num: 162,
      gender: '女',
      branch: '',
      biography: '琛凯之女一宁',
      father_id: 802,
      highlight: false
    });
    if (chenKaiDaughter1) {
      setFatherOf(1278, 802, '琛凯之女谢祎');
      if (text(chenKaiDaughter1.gender).trim() !== '女') {
        chenKaiDaughter1.gender = '女';
        changed = true;
      }
    }
    if (chenKaiDaughter2) {
      setFatherOf(1279, 802, '琛凯之女一宁');
      if (text(chenKaiDaughter2.gender).trim() !== '女') {
        chenKaiDaughter2.gender = '女';
        changed = true;
      }
    }
    const haiYongSon = getPerson(892);
    if (haiYongSon && text(haiYongSon.name).trim() === '行牧') {
      setFatherOf(892, 1277, '海永长子行牧');
      if (text(haiYongSon.gender).trim() !== '男') {
        haiYongSon.gender = '男';
        changed = true;
      }
    }
    const haiYongDaughter = getPerson(873);
    if (haiYongDaughter && text(haiYongDaughter.name).trim() === '行书') {
      setFatherOf(873, 1277, '海永次女行书');
      if (text(haiYongDaughter.gender).trim() !== '女') {
        haiYongDaughter.gender = '女';
        changed = true;
      }
    }
    // 删除用户指出的国威名下错误卡片“衫娜”（ID 811）；其建党、建品后代上挂回国威。
    const wrongShanNa = getPerson(811);
    if (wrongShanNa && text(wrongShanNa.name).trim() === '衫娜') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '811') person.father_id = 666;
        if (String(toId(person.mother_id)) === '811') person.mother_id = 666;
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '811');
      state.verified.delete('811');
      state.expanded.delete('811');
      if (String(state.selectedId) === '811') state.selectedId = 666;
      if (String(state.draftId) === '811') {
        state.mode = 'view';
        state.draftId = null;
        state.draftParentId = null;
      }
      state.dataIndexReady = false;
      changed = true;
    }
    setFatherOf(800, 649, '世郎之子海港');
    setFatherOf(804, 634, '世省之子盛杰');
    setFatherOf(736, 634, '世省之子大林');
    setFatherOf(650, 493, '大启之子世采');
    setFatherOf(778, 660, '保岳之子敏杰');
    setFatherOf(584, 499, '期江之子世义');
    setFatherOf(583, 499, '期江之子世科');
    setFatherOf(613, 499, '期江之子世方');
    setFatherOf(638, 499, '期江之子世统');
    setFatherOf(645, 499, '期江之子世裕');
    setFatherOf(621, 499, '期江之子世永');
    // 绍虎、绍则和重复字名支系。
    setFatherOf(586, 567, '绍虎之子世光');
    setFatherOf(589, 567, '绍虎之子世吉');
    setFatherOf(612, 567, '绍虎之子世振');
    setFatherOf(617, 567, '绍虎之子世标');
    setFatherOf(633, 567, '绍虎之子世田');
    setFatherOf(587, 516, '绍则之子世凌');
    setFatherOf(622, 516, '绍则之子世永');
    setFatherOf(655, 516, '绍则之子世锡');
    setFatherOf(625, 519, '绍和之子世火');
    setFatherOf(708, 615, '世木之子传法');
    setFatherOf(601, 496, '已珍之子世富');
    setFatherOf(608, 526, '绍家之子世忠');
    setFatherOf(609, 496, '已珍之子世忠');
    setFatherOf(635, 522, '绍基之子世福');
    setFatherOf(600, 501, '水财之子世安');
    setFatherOf(592, 501, '水财之子世和');
    setFatherOf(784, 600, '世安之女春娅');
    const chunYa = getPerson(784);
    if (chunYa && text(chunYa.name).trim() === '春娅' && text(chunYa.gender).trim() !== '女') {
      chunYa.gender = '女';
      changed = true;
    }
    setFatherOf(905, 793, '松全之子谢勇');
    setFatherOf(840, 806, '祖全之子小康');
    // 谱面复核：两张“学考”是两个不同的人，不合并，也不互作出继/入继标记。
    // 明辉—学考—昌财（早逝）；友松—学考—昌苗、昌水、昌根。
    // 旧版本曾临时生成“明金”卡片，现删除该临时卡，保留用户核对使用的“友松”卡片。
    const obsoleteMingJin = getPerson(1280);
    if (obsoleteMingJin && text(obsoleteMingJin.name).trim() === '明金') {
      state.data = state.data.filter((person) => String(personId(person)) !== '1280');
      state.verified.delete('1280');
      state.expanded.delete('1280');
      if (String(state.selectedId) === '1280') state.selectedId = 232;
      if (String(state.draftId) === '1280') {
        state.mode = 'view';
        state.draftId = null;
        state.draftParentId = null;
      }
      state.dataIndexReady = false;
      changed = true;
    }
    setFatherOf(363, 293, '明辉继子学考');
    setFatherOf(364, 232, '友松之子学考');
    setFatherOf(328, 232, '友松之子学富');
    setFatherOf(452, 363, '明辉之子学考之子昌财（早逝）');
    setFatherOf(445, 364, '友松之子学考之子昌苗');
    setFatherOf(431, 364, '友松之子学考之子昌水');
    setFatherOf(426, 364, '友松之子学考之子昌根');
    const currentClanLeader = getPerson(445);
    if (currentClanLeader && text(currentClanLeader.name).trim() === '昌苗'
      && text(currentClanLeader.title).trim() !== '2026年本届族长') {
      currentClanLeader.title = '2026年本届族长';
      changed = true;
    }
    [363, 364].forEach((id) => {
      const record = getPerson(id);
      if (!record) return;
      if (text(record.adoption_status).trim() || text(record.adopt_note).trim()) {
        record.adoption_status = '';
        record.adopt_note = '';
        changed = true;
      }
    });
    const earlyChangCai = getPerson(452);
    if (earlyChangCai && text(earlyChangCai.name).trim() === '昌财') {
      if (text(earlyChangCai.biography).trim() !== '明辉之子学考之子昌财（早逝）') {
        earlyChangCai.biography = '明辉之子学考之子昌财（早逝）';
        changed = true;
      }
      if (text(earlyChangCai.is_alive).trim() !== '否') {
        earlyChangCai.is_alive = '否';
        changed = true;
      }
    }
    // 用户核对确认：绍江不是昌水之子；在正确生父得到确认前撤销错误父子线。
    clearFatherOf(551);
    // 绍榴的父亲在最后核对中确认为昌寿；绍富不属于昌寿支系。
    clearFatherOf(550);
    setFatherOf(689, 550, '绍榴之子根土');
    setFatherOf(594, 577, '绍银之子世园');
    setFatherOf(595, 577, '绍银之子世国');
    setFatherOf(821, 595, '世国之女露媱');
    setFatherOf(656, 544, '绍根之子世高');
    setFatherOf(588, 544, '绍根之子世华');
    setFatherOf(787, 647, '世贤之子晓斌');
    // 绍龙、绍尧、绍岳及前后枫槎交接处。
    setFatherOf(643, 579, '绍鸣之子世虬');
    setFatherOf(687, 579, '绍鸣之子景常');
    setFatherOf(688, 579, '绍鸣之子景星');
    // 行宁不是和木之子；在确认谱面记载的正确父亲前先撤销错误父系。
    clearFatherOf(878);
    setFatherOf(817, 644, '世蛟之子金和');
    setFatherOf(770, 606, '世彬（入继绍印）之子德盛');
    setFatherOf(744, 606, '世彬（入继绍印）之子宏明');
    setFatherOf(735, 606, '世彬（入继绍印）之子四德');
    setFatherOf(771, 619, '世森之子德继');
    setFatherOf(849, 807, '祥旺之子景浩');
    setFatherOf(896, 763, '德成之子行尉（行蔚）');
    // 用户最新核对确认：开刚是行尉之子，不是原始数据中错误挂接的露媱之子。
    setFatherOf(962, 896, '行尉之子开刚');
    setFatherOf(769, 646, '世谷之子德润');
    setFatherOf(772, 646, '世谷之子德观');
    // 下册第64、83页明确记载显祥公女二：如清、金祯；金祯不是德观之子。
    setFatherOf(927, 786, '显祥之女金祯');
    const jinZhen = getPerson(927);
    if (jinZhen && text(jinZhen.name).trim() === '金祯' && text(jinZhen.gender).trim() !== '女') {
      jinZhen.gender = '女';
      changed = true;
    }
    setFatherOf(753, 620, '世椿之子德华');
    setFatherOf(710, 609, '世忠之子俊晔');
    setFatherOf(739, 609, '世忠之子子涵');
    setFatherOf(714, 691, '爱中之子军');
    setFatherOf(730, 676, '序绸之子善尊');
    setFatherOf(736, 634, '世省之子大林');
    setFatherOf(747, 591, '世周之子展平');
    setFatherOf(820, 689, '根土之子长茂');
    // 道字辈：父子关系应与下册第58—82页逐条对应。
    setFatherOf(719, 657, '世麓之子和发');
    setFatherOf(720, 644, '世蛟之子和庆');
    setFatherOf(721, 657, '世麓之子和政');
    setFatherOf(723, 643, '世虬之子和木');
    setFatherOf(724, 644, '世蛟之子和淼');
    setFatherOf(725, 657, '世麓之子和财');
    setFatherOf(762, 597, '世墙（入继绍辉）之子德恩');
    setFatherOf(757, 597, '世墙（入继绍辉）之子德宽');
    setFatherOf(749, 597, '世墙（入继绍辉）之子德会');
    setFatherOf(758, 630, '世琅之子德崇');
    setFatherOf(759, 654, '世锈之子德崇，入继世锈为嗣');
    setFatherOf(760, 657, '世麓之子德崇，出继世锈为嗣');
    setFatherOf(761, 620, '世椿之子德忠');
    setFatherOf(766, 657, '世麓之子德新');
    setFatherOf(767, 624, '世漘之子德武');
    setFatherOf(773, 619, '世森之子德道');
    setFatherOf(774, 606, '世彬（入继绍印）之子德隆');
    setFatherOf(775, 646, '世谷之子德风');
    setFatherOf(825, 773, '德道之子仁安');
    setFatherOf(826, 735, '四德之子会兴');
    setFatherOf(827, 707, '伟中之女佶明');
    setFatherOf(834, 724, '和淼之子勇伟');
    setFatherOf(838, 800, '海港之子子墨');
    setFatherOf(839, 720, '和庆之子富强');
    // 用户核对确认：开满不是富强之子；准确父亲未确认前撤销错误父子线。
    clearFatherOf(980);
    setFatherOf(841, 720, '和庆之子幸福');
    // 用户核对确认：开第（用户称开弟）不是幸福之子；准确父亲未确认前撤销错误父子线。
    clearFatherOf(982);
    setFatherOf(842, 714, '军之女心怡');
    setFatherOf(852, 777, '才富之子根新');
    // 下册明确记载：大启之子世罗，世罗子二宝杰、旭杰；旭杰不是世福之子。
    setFatherOf(781, 639, '世罗之子旭杰');
    // 下册第86页明确记载旭杰子昕磊、女露萱；露萱不是才富之女。
    setFatherOf(932, 781, '旭杰之女露萱');
    const luXuan = getPerson(932);
    if (luXuan && text(luXuan.name).trim() === '露萱' && text(luXuan.gender).trim() !== '女') {
      luXuan.gender = '女';
      changed = true;
    }
    setFatherOf(855, 748, '建强之女梓汐');
    setFatherOf(860, 845, '施鹏之子玮');
    setFatherOf(861, 804, '盛杰之子珂瑞');
    setFatherOf(863, 720, '和庆之子万荣（即繁荣）');
    setFatherOf(864, 809, '美夫之女聪林');
    setFatherOf(875, 766, '德新之子行兴');
    setFatherOf(877, 762, '德恩之子行善');
    setFatherOf(879, 762, '德恩之子行安；子一：孝通');
    setFatherOf(883, 762, '德恩之子行庭');
    setFatherOf(884, 723, '和木之子行建');
    setFatherOf(885, 766, '德新之子行敏');
    setFatherOf(889, 766, '德新之子行根');
    setFatherOf(891, 762, '德恩之子行海');
    setFatherOf(895, 759, '德崇（入继世锈）之子行荣');
    setFatherOf(899, 730, '善尊之子行远');
    setFatherOf(900, 730, '善尊之子行连');
    setFatherOf(887, 730, '善尊之子行春');
    setFatherOf(901, 774, '德隆之子行青');
    setFatherOf(902, 723, '和木之子行龙');
    // 下册明确记载：行龙之子为志超、泽宇；现有泽宇卡片改挂到行龙名下。
    setFatherOf(1009, 902, '行龙之子泽宇');
    // 用户最新核对确认：忠杰是行勇（ID 876）之子，不是行龙之子。
    setFatherOf(998, 876, '行勇之子忠杰');
    // 下册明确记载：忠杰之子为谢源；现有谢源卡片改挂到忠杰名下。
    setFatherOf(1083, 998, '忠杰之子谢源');
    setFatherOf(921, 730, '善尊之子道贤，出继善美为嗣');
    setFatherOf(922, 732, '善美之嗣道贤');
    // 下册第83—95页：把上一轮校正后的父支继续传到后代，避免后代仍留在导入时的相邻卡片下。
    setFatherOf(939, 834, '勇伟之子凌轩');
    setFatherOf(950, 897, '行虎之子平彪');
    setFatherOf(955, 875, '行兴之子建奇');
    setFatherOf(956, 889, '行根之子建府');
    setFatherOf(964, 863, '万荣（即繁荣）之子开品');
    // 下册明确记载：德忠之子京翰的女儿为谢羽；这里的谢羽为女性，不能挂在另一位同名京翰下。
    setFatherOf(1021, 824, '京翰之女谢羽');
    const xieYu = getPerson(1021);
    if (xieYu && text(xieYu.name).trim() === '谢羽' && text(xieYu.gender).trim() !== '女') {
      xieYu.gender = '女';
      changed = true;
    }
    // 下册第76页明确写作“万荣即繁荣”，不是父子两代；合并重复卡片，避免出现和庆—繁荣—万荣的假三代。
    const wanRongAlias = getPerson(1254);
    const fanRong = getPerson(863);
    if (wanRongAlias && fanRong && text(wanRongAlias.name).trim() === '万荣' && text(fanRong.name).trim() === '繁荣') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '1254') person.father_id = 863;
        if (String(toId(person.mother_id)) === '1254') person.mother_id = 863;
        if (text(person.spouse_ids).split(/[、，,;；\s]+/).includes('1254')) {
          person.spouse_ids = text(person.spouse_ids).split(/[、，,;；\s]+/).map((item) => item === '1254' ? '863' : item).filter(Boolean).join('、');
        }
      });
      if (text(fanRong.biography).trim() !== '和庆之子，万荣即繁荣') {
        fanRong.biography = '和庆之子，万荣即繁荣';
      }
      state.data = state.data.filter((person) => String(personId(person)) !== '1254');
      changed = true;
    }
    // 下册明确记载：绍苔公次子世木；另有一位世木为绍和公之子，保留两张同名卡片。
    const shimuFromShaotai = getPerson(616);
    if (shimuFromShaotai && text(shimuFromShaotai.name).trim() === '世木' && String(toId(shimuFromShaotai.father_id)) !== '563') {
      shimuFromShaotai.father_id = 563;
      changed = true;
    }
    // 下册第52页明确记载：绍虎公四子世标。
    const shiBiao = getPerson(617);
    if (shiBiao && text(shiBiao.name).trim() === '世标' && String(toId(shiBiao.father_id)) !== '567') {
      shiBiao.father_id = 567;
      changed = true;
    }
    // 上册图表与下册第34页明确出现的后代，原始表格漏录，补入以便世系链不断裂。
    ensureRecord({
      id: 1261,
      name: '世广',
      generation_num: 161,
      generation: '161',
      gender: '男',
      branch: '',
      biography: '绍水公世广无传',
      father_id: 670,
      highlight: false
    });
    // “世线”就是“序线”的同一人，不应另立一张世线卡片；清理旧版本曾生成的重复记录，
    // 并把其可能遗留的后代接回序线。序线的善美记录由上面的入继关系负责展示。
    const duplicateShiXian = getPerson(1262);
    if (duplicateShiXian) {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '1262') {
          person.father_id = 675;
          changed = true;
        }
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '1262');
      changed = true;
    }
    // 序赖为令八之子；原始记录误挂到绍梅名下。
    const xuLai = getPerson(679);
    if (xuLai && text(xuLai.name).trim() === '序赖' && String(toId(xuLai.father_id)) !== '482') {
      xuLai.father_id = 482;
      changed = true;
    }
    // 绍贤为昌勋之子；原始记录误挂到明跃之子名下。
    const shaoXian = getPerson(571);
    if (shaoXian && text(shaoXian.name).trim() === '绍贤' && String(toId(shaoXian.father_id)) !== '396') {
      shaoXian.father_id = 396;
      changed = true;
    }
    const mi = getPerson(1151);
    if (mi && text(mi.name).trim() === '密') {
      if (String(toId(mi.father_id)) !== '1148') { mi.father_id = 1148; changed = true; }
      if (text(mi.biography).trim() !== '峻之子') { mi.biography = '峻之子'; changed = true; }
    }
    const lan = getPerson(1159);
    if (lan && text(lan.name).trim() === '览') {
      if (String(toId(lan.father_id)) !== '1158') { lan.father_id = 1158; changed = true; }
      if (text(lan.biography).trim() !== '沦之子') { lan.biography = '沦之子'; changed = true; }
    }
    // 寅卿的方向以族谱父子关系为准：延省为亲生父，出继给延荐；延荐名下记录为入继。
    const yinqingOut = getPerson(100);
    if (yinqingOut && text(yinqingOut.name).trim() === '寅卿' && String(toId(yinqingOut.father_id)) === '87') {
      if (text(yinqingOut.biography).trim() !== '出继延荐为嗣，墓葬假山脚，以下不传') {
        yinqingOut.biography = '出继延荐为嗣，墓葬假山脚，以下不传';
        changed = true;
      }
    }
    const yinqingIn = getPerson(101);
    if (yinqingIn && text(yinqingIn.name).trim() === '寅卿' && String(toId(yinqingIn.father_id)) === '88') {
      if (text(yinqingIn.biography).trim() !== '（入继）') {
        yinqingIn.biography = '（入继）';
        changed = true;
      }
    }
    // 大顺：云良房出继，入继给云奇。
    // 两组都保留亲生记录与入继记录，避免入继父名下看不到本人；后代归属由世系索引统一处理。
    const adoptedBigShun = getPerson(170);
    if (adoptedBigShun && text(adoptedBigShun.name).trim() === '大顺' && text(adoptedBigShun.adopt_note).trim() !== '入继给云奇为嗣') {
      adoptedBigShun.adopt_note = '入继给云奇为嗣';
      changed = true;
    }
    const outBigShun = getPerson(169);
    if (outBigShun && text(outBigShun.name).trim() === '大顺' && text(outBigShun.branch).trim() === '入继') {
      outBigShun.branch = '';
      outBigShun.adopt_note = '出继给云奇为嗣';
      changed = true;
    }
    const xisen = getPerson(202);
    if (xisen && text(xisen.name).trim() === '锡森' && String(toId(xisen.father_id)) !== '170') {
      xisen.father_id = 170;
      changed = true;
    }
    // 最后一轮逐条回到下册正文核对父子落点。前面的兼祧/入继修正会改变显示支系，
    // 这里再覆盖一遍容易被横列导入带偏的同名卡和后代卡，确保保存后的原始父亲边一致。
    setFatherOf(496, 429, '昌楹之子已珍（旧谱名奕尊）');
    setFatherOf(535, 409, '昌寿之子绍彩');
    setFatherOf(562, 390, '昌享之子绍组');
    setFatherOf(563, 464, '昌马之子绍苔，随父入继学涌为嗣');
    setFatherOf(673, 522, '绍基之子世禄，出继绍享为嗣');
    setFatherOf(674, 481, '绍享之嗣世禄');
    // 德元为世禄（用户所称“序禄”）之子，不属于世彬支系；接到入继世禄卡片下面。
    setFatherOf(751, 674, '世禄之子德元');
    // 善魁同样是世禄（用户所称“序禄”）之子；其下道金等后代随之保留在该支系。
    setFatherOf(733, 674, '世禄之子善魁');
    setFatherOf(581, 429, '昌楹之子良苗');
    setFatherOf(590, 558, '绍睦之子世周');
    // 昌寿（用户所称“昌手”）之子是绍榴，不是绍富。
    setFatherOf(529, null, '');
    setFatherOf(550, 409, '昌寿之子绍榴');
    setFatherOf(501, 399, '昌发之子水财，出继昌谊为嗣');
    setFatherOf(502, 449, '昌谊之嗣水财');
    setFatherOf(667, 495, '小启之女国芬');
    setFatherOf(700, 661, '全木之子云国');
    setFatherOf(701, 661, '全木之子云夫');
    setFatherOf(702, 661, '全木之子云道');
    setFatherOf(837, 702, '云道之子嫣迂');
    setFatherOf(704, 640, '世考之子会标');
    setFatherOf(706, 640, '世考之子会达');
    setFatherOf(709, 584, '世义之女佩玲');
    setFatherOf(738, 690, '永军之子宜');
    setFatherOf(785, 583, '世科之子春旭');
    setFatherOf(806, 631, '世琛之子祖全');
    setFatherOf(827, 707, '伟中之女佶明');
    setFatherOf(860, 801, '海飞之女玮');
    // 银如是海飞的次女，不是玮的女儿，也不是德隆之女；下册第86页明确记载“海飞次女银如”。
    setFatherOf(929, 801, '海飞之女银如');
    const yinRu = getPerson(929);
    if (yinRu && text(yinRu.gender).trim() !== '女') { yinRu.gender = '女'; changed = true; }
    setFatherOf(941, 917, '道官之子卫东');
    setFatherOf(943, 896, '行尉之子嘉文');
    setFatherOf(944, 881, '行富之子垚达');
    setFatherOf(945, 872, '行东之女倩婧');
    setFatherOf(947, 833, '剑波之子宇哲');
    setFatherOf(963, 919, '道标之子开华');
    setFatherOf(961, 917, '道官之子开军');
    setFatherOf(967, 923, '道进之子开强');
    setFatherOf(969, 915, '道发之子开志');
    // 谱文明确记载：建福子二铭奕、奕澍；奕澍不是道发之子。
    setFatherOf(1039, 960, '建福之子奕澍');
    // 谱文明确记载：兵权之女一菡；一菡不是时福之女。
    setFatherOf(1099, 1036, '兵权之女一菡');
    const yiHan = getPerson(1099);
    if (yiHan && text(yiHan.name).trim() === '一菡' && text(yiHan.gender).trim() !== '女') {
      yiHan.gender = '女';
      changed = true;
    }
    // 谱文明确记载：时福子一天乾、女一欣悦。
    setFatherOf(1121, 1059, '时福之女欣悦');
    const xinYue = getPerson(1121);
    if (xinYue && text(xinYue.name).trim() === '欣悦' && text(xinYue.gender).trim() !== '女') {
      xinYue.gender = '女';
      changed = true;
    }
    // 谱文明确记载：伟东女二楠楠、栖栖。
    setFatherOf(1119, 1031, '伟东之女栖栖');
    const qiQi = getPerson(1119);
    if (qiQi && text(qiQi.name).trim() === '栖栖' && text(qiQi.gender).trim() !== '女') {
      qiQi.gender = '女';
      changed = true;
    }
    // 用户核对确认：震宁不是开忠之子；正确生父未确认前撤销错误父子线。
    clearFatherOf(1094);
    // 谱中只有一条“善富公次子道发”记录；清理旧数据中误挂在德忠名下的重复道发卡片。
    const duplicateDaoFa = getPerson(916);
    if (duplicateDaoFa && text(duplicateDaoFa.name).trim() === '道发') {
      state.data.forEach((person) => {
        if (String(toId(person.father_id)) === '916') {
          person.father_id = 915;
          changed = true;
        }
      });
      state.data = state.data.filter((person) => String(personId(person)) !== '916');
      changed = true;
    }
    setFatherOf(984, 923, '道进之子开虎');
    setFatherOf(994, null, '开蕾之赘婿张小兵');
    setFatherOf(1003, 860, '玮之子文琪');
    setFatherOf(1004, 864, '聪林之女昕洳');
    setFatherOf(1012, 897, '行虎之子洁武');
    setFatherOf(1016, null, '孝静之赘婿王邦旭');
    setFatherOf(1017, 832, '剑峰之女玺言');
    setFatherOf(1018, 865, '聪芳之子瑞晞');
    setFatherOf(1019, 864, '聪林之子胤钢');
    setFatherOf(1030, 961, '开军之女书野');
    const daoQing = getPerson(925);
    if (daoQing && text(daoQing.name).trim() === '道青') {
      daoQing.name = '道清';
      daoQing.biography = '善富之子道清';
      changed = true;
    }
    setFatherOf(925, 728, '善富之子道清');
    setFatherOf(923, 728, '善富之子道进（谱页作道尊）');
    setFatherOf(924, 733, '善魁之子道金');
    setFatherOf(952, 925, '道清之子建党');
    // 用户核对确认：熠凤不是建党后代；准确生父未确认前撤销错误父子线，暂不乱挂。
    clearFatherOf(1076);
    setFatherOf(954, 925, '道清之子建国');
    setFatherOf(970, 925, '道清之子孝忠（谱名开忠）');
    setFatherOf(971, 924, '道金之子开忠');
    const xiaopin = getPerson(964);
    if (xiaopin && text(xiaopin.name).trim() === '开品') {
      xiaopin.name = '孝品';
      xiaopin.generation_num = 163;
      xiaopin.generation = '163';
      xiaopin.biography = '繁荣之子孝品';
      changed = true;
    }
    const yuanHong = getPerson(1071);
    if (yuanHong && text(yuanHong.name).trim() === '沅宏') {
      yuanHong.generation_num = 164;
      yuanHong.generation = '164';
      changed = true;
    }
    const renamePdfCard = (id, name, biography) => {
      const person = getPerson(id);
      if (!person) return;
      if (text(person.name).trim() !== name) { person.name = name; changed = true; }
      if (biography && text(person.biography).trim() !== biography) { person.biography = biography; changed = true; }
    };
    // 下册明确记载：仲兴公次子吉江，女二谢霞、谢娜；原始整理曾把女儿与其女合并在卡片名称中。
    renamePdfCard(812, '谢娜', '吉江之女谢娜，生欣蓝');
    renamePdfCard(814, '谢霞', '吉江之女谢霞，生艺飞');
    setFatherOf(812, 665, '吉江之女谢娜，生欣蓝');
    setFatherOf(814, 665, '吉江之女谢霞，生艺飞');
    [getPerson(812), getPerson(814)].forEach((person) => {
      if (person && text(person.gender).trim() !== '女') { person.gender = '女'; changed = true; }
    });
    // 下册第67、86页明确记载：谢霞之女艺飞、谢娜之女欣蓝；补回两张下一代人物卡片。
    ensureRecord({
      id: 1273,
      name: '艺飞',
      generation_num: 162,
      generation: '162',
      gender: '女',
      branch: '',
      biography: '谢霞之女艺飞',
      father_id: 814,
      highlight: false
    });
    ensureRecord({
      id: 1274,
      name: '欣蓝',
      generation_num: 162,
      generation: '162',
      gender: '女',
      branch: '',
      biography: '谢娜之女欣蓝',
      father_id: 812,
      highlight: false
    });
    // 下册载“国芬女敏华”，明确为女性；并载敏华生一九九四年甲戌十月初五日。
    const minHua = ensureRecord({
      id: 1275,
      name: '敏华',
      generation_num: 161,
      generation: '161',
      gender: '女',
      branch: '',
      birth_date: '一九九四年甲戌十月初五日（公元1994年）',
      biography: '国芬之女敏华；配贵州务川县丹沙街道银杏社区刘美琳，生一九九九年己卯年',
      father_id: 667,
      highlight: false
    });
    if (minHua) {
      minHua.gender = '女';
      minHua.birth_date = '一九九四年甲戌十月初五日（公元1994年）';
      minHua.biography = '国芬之女敏华；配贵州务川县丹沙街道银杏社区刘美琳，生一九九九年己卯年';
      setFatherOf(1275, 667, '国芬之女敏华');
    }
    // 关系更正：沐阳是敏杰之子；敏华之子为道贝。
    setFatherOf(858, 778, '敏杰之子沐阳');
    const daoBei = ensureRecord({
      id: 1276,
      name: '道贝',
      generation_num: 162,
      generation: '162',
      gender: '男',
      branch: '',
      biography: '敏华之子道贝',
      father_id: 1275,
      highlight: false
    });
    if (daoBei) setFatherOf(1276, 1275, '敏华之子道贝');
    setFatherOf(1273, 814, '谢霞之女艺飞');
    setFatherOf(1274, 812, '谢娜之女欣蓝');
    renamePdfCard(966, '孝建', '行星之子孝建');
    renamePdfCard(968, '孝强', '行星之子孝强');
    renamePdfCard(972, '孝总', '行远之子孝总');
    renamePdfCard(973, '孝斌', '根新之子孝斌');
    // 下册明确记载：根新之子为孝斌、文斌；现有文斌卡片改挂到根新名下。
    setFatherOf(1002, 852, '根新之子文斌');
    renamePdfCard(976, '孝智', '幸福之子孝智');
    // 用户最新核对确认：孝智之女为熠凤；补回熠凤的正确父女关系。
    setFatherOf(1076, 976, '孝智之女熠凤');
    const yiFeng = getPerson(1076);
    if (yiFeng && text(yiFeng.name).trim() === '熠凤' && text(yiFeng.gender).trim() !== '女') {
      yiFeng.gender = '女';
      changed = true;
    }
    renamePdfCard(977, '孝杰', '行星之子孝杰');
    renamePdfCard(978, '孝松', '会兴之子孝松');
    renamePdfCard(981, '孝福', '行积之子孝福');
    renamePdfCard(987, '孝辰', '行东之子孝辰');
    renamePdfCard(988, '孝达', '行青之子孝达');
    renamePdfCard(992, '孝静', '富强之女孝静');
    renamePdfCard(965, '孝国', '行根之子孝国');
    renamePdfCard(673, '世禄', '绍基之子世禄，出继绍享为嗣');
    renamePdfCard(674, '世禄', '绍享之嗣世禄');
    renamePdfCard(583, '世科', '期江之子世科');
    renamePdfCard(657, '世麓', '绍源之子世麓');
    renamePdfCard(896, '行尉', '德成之子行尉');
    renamePdfCard(1095, '韵霖', '建奇之女韵霖');
    setFatherOf(966, 886, '行星之子孝建');
    setFatherOf(968, 886, '行星之子孝强');
    setFatherOf(977, 886, '行星之子孝杰');
    setFatherOf(988, 901, '行青之子孝达');
    setFatherOf(989, 924, '道金之子开达');
    setFatherOf(990, 924, '道金之子开通');
    setFatherOf(849, 807, '祥旺之子景浩');
    setFatherOf(888, 756, '德宝之子行权');
    const xiaoDi = ensureRecord({
      id: 1264,
      name: '孝弟',
      generation_num: 163,
      generation: '163',
      gender: '男',
      branch: '后枫槎',
      biography: '行星之子孝弟',
      father_id: 886,
      highlight: false
    });
    if (xiaoDi && String(toId(xiaoDi.father_id)) !== '886') { xiaoDi.father_id = 886; changed = true; }
    const xiaoMan = ensureRecord({
      id: 1265,
      name: '孝满',
      generation_num: 163,
      generation: '163',
      gender: '男',
      branch: '后枫槎',
      biography: '行远之子孝满',
      father_id: 899,
      highlight: false
    });
    if (xiaoMan && String(toId(xiaoMan.father_id)) !== '899') { xiaoMan.father_id = 899; changed = true; }
    setFatherOf(1032, 1264, '孝弟之女佳颖');
    const jiaYing = getPerson(1032);
    if (jiaYing && text(jiaYing.name).trim() === '佳颖' && text(jiaYing.gender).trim() !== '女') {
      jiaYing.gender = '女';
      changed = true;
    }
    // 用户核对确认：佳颖有两个女儿，天宸、颜熙；补齐两张下一代卡片并统一标为女性。
    const tianChenOfJiaYing = ensureRecord({
      id: 1282,
      name: '天宸',
      generation: '165',
      generation_num: 165,
      gender: '女',
      branch: '',
      birth_date: '',
      spouse_ids: '',
      biography: '佳颖之女天宸',
      is_alive: '否',
      father_id: 1032,
      highlight: false
    });
    const yanXiOfJiaYing = ensureRecord({
      id: 1283,
      name: '颜熙',
      generation: '165',
      generation_num: 165,
      gender: '女',
      branch: '',
      birth_date: '',
      spouse_ids: '',
      biography: '佳颖之女颜熙，归宗赵姓',
      is_alive: '否',
      father_id: 1032,
      highlight: false
    });
    setFatherOf(1282, 1032, '佳颖之女天宸');
    setFatherOf(1283, 1032, '佳颖之女颜熙，归宗赵姓');
    [tianChenOfJiaYing, yanXiOfJiaYing].forEach((person) => {
      if (person && text(person.gender).trim() !== '女') {
        person.gender = '女';
        changed = true;
      }
    });
    setFatherOf(1036, 967, '开强之子兵权');
    setFatherOf(1040, 988, '孝达之女妍洁');
    setFatherOf(1049, 973, '孝斌之子惠开');
    setFatherOf(1054, 984, '开虎之子时吉');
    setFatherOf(1061, 963, '开华之女时雨');
    setFatherOf(1063, 972, '孝总之子星翰');
    setFatherOf(1070, 1265, '孝满之女欣仪');
    setFatherOf(1091, 935, '亚达之女雨佳');
    setFatherOf(1095, 955, '建奇之女韵霖');
    // 下册明确记载：开蕾长女懿菲、次女若妍；两人均为开蕾之女。
    setFatherOf(1050, 983, '开蕾之女懿菲');
    const yiFei = getPerson(1050);
    if (yiFei && text(yiFei.name).trim() === '懿菲' && text(yiFei.gender).trim() !== '女') {
      yiFei.gender = '女';
      changed = true;
    }
    setFatherOf(1081, 983, '开蕾之女若妍');
    const ruoYan = getPerson(1081);
    if (ruoYan && text(ruoYan.name).trim() === '若妍' && text(ruoYan.gender).trim() !== '女') {
      ruoYan.gender = '女';
      changed = true;
    }
    setFatherOf(1097, 1265, '孝满之子骐阳');
    setFatherOf(1101, 1054, '时吉之子优乐');
    setFatherOf(1102, 1038, '品权之子博涛');
    setFatherOf(1118, 1038, '品权之女郑晗蓁');
    // 下册明确记载：时品长子天宇、次子天彦；现有天彦卡片改挂到时品名下。
    setFatherOf(1109, 1055, '时品之子天彦');
    // 下册明确记载：才富之子根木，根木次子孝春（谱页同时列“开春”支系名）；开春改挂根木名下。
    setFatherOf(975, 853, '根木之子开春');
    // 用户核对确认：震宁为“丁迂”（现有卡片名为丁迁）之子，改挂到丁迁卡片下。
    setFatherOf(1094, 934, '丁迁（用户称丁迂）之子震宁');
    // 下册第92、105页明确记载孝松女谢楠；谢楠不是德华之子。
    setFatherOf(1082, 978, '孝松之女谢楠');
    const xieNan = getPerson(1082);
    if (xieNan && text(xieNan.name).trim() === '谢楠' && text(xieNan.gender).trim() !== '女') {
      xieNan.gender = '女';
      changed = true;
    }
    // 卡片与统计只依据 canonical gender 字段，避免前台另行推断造成数据分叉。
    // 谱文生卒审校：旧转换数据把绝大多数人物默认写成“否”。只有谱文存在明确
    // 卒、殁、早逝、享年或葬载时才确认已故；无证据的字符串默认值恢复为未标注。
    // 后台人工保存的布尔值不覆盖，避免冲掉后续人工核定结论。
    state.data.forEach((person) => {
      const vital = window.GENEALOGY_VITALS && window.GENEALOGY_VITALS[String(personId(person))];
      if (vital && text(vital.name).trim() === text(person.name).trim() &&
          (!vital.father_id || String(toId(vital.father_id)) === String(toId(person.father_id)))) {
        if (!text(person.birth_date).trim() && text(vital.birth_date).trim()) {
          person.birth_date = vital.birth_date;
          changed = true;
        }
        if (!text(person.death_date).trim() && text(vital.death_date).trim()) {
          person.death_date = vital.death_date;
          changed = true;
        }
      }
      const birthText = text(person.birth_date).trim();
      const bioText = text(person.biography).trim();
      const sourceText = [person.death_date, person.biography, person.vital_source, person.book_record, person.notes, person.adopt_note, person.status_source]
        .map((value) => text(value).trim()).filter(Boolean).join(' ');
      const lostVitalMatch = sourceText.match(/生(?:娶)?卒(?:葬)?(?:均|俱|均俱)?(?:失考|失|不详)/);
      // 生命状态只能由明确的卒年/卒日、卒失/卒俱失、葬载或“在世/健在”证据决定。
      // 世次、古今、出生日期本身都不能作为已故或在世的推断依据。
      const statusEvidence = lifeStatusInfo(person);
      const hasExplicitDeath = statusEvidence.deathEvidence;
      const currentAlive = person.is_alive;
      const nextAlive = statusEvidence.status === '是' ? true : statusEvidence.status === '否' ? false : null;
      if (currentAlive !== nextAlive) {
        person.is_alive = nextAlive;
        changed = true;
      }
      if (Boolean(person.life_status_conflict) !== Boolean(statusEvidence.conflict)) {
        person.life_status_conflict = statusEvidence.conflict;
        changed = true;
      }
      if (text(person.life_status_source).trim() !== statusEvidence.label) {
        person.life_status_source = statusEvidence.label;
        changed = true;
      }
      if (!text(person.death_date).trim()) {
        let deathRecord = '';
        if (lostVitalMatch) {
          deathRecord = `${lostVitalMatch[0]}（谱载，明确已故）`;
        } else {
          const deathMatch = sourceText.match(/(?:公)?卒.{0,86}|(?:早逝|夭折|亡故).{0,28}/);
          if (deathMatch) {
            deathRecord = deathMatch[0]
              .split(/(?:合葬|墓葬|葬于|葬在|公葬|子[一二三四五六七八九十]|女[一二三四五六七八九十]|配)/)[0]
              .trim();
          }
        }
        if (deathRecord) {
          person.death_date = deathRecord;
          changed = true;
        }
      }
      if (!text(person.burial_place).trim()) {
        const burialMatch = bioText.match(/((?:合葬|(?:公)?墓葬|葬于|葬在|公葬|葬)[^子女继]{1,58})/);
        if (burialMatch) {
          person.burial_place = burialMatch[1].trim();
          changed = true;
        }
      }
      if (!text(person.residence).trim()) {
        const residenceMatch = bioText.match(/(?:迁居|卜宅而居于|居于)([^子女配墓葬]{1,28})/);
        if (residenceMatch) {
          person.residence = residenceMatch[1].trim();
          changed = true;
        }
      }
      const annotatedBirth = annotateGregorianYears(person.birth_date);
      if (annotatedBirth && annotatedBirth !== text(person.birth_date).trim()) {
        person.birth_date = annotatedBirth;
        changed = true;
      }
      const annotatedDeath = annotateGregorianYears(person.death_date);
      if (annotatedDeath && annotatedDeath !== text(person.death_date).trim()) {
        person.death_date = annotatedDeath;
        changed = true;
      }
      if (hasExplicitDeath || birthText || bioText) {
        const vitalSource = '枫槎谢氏宗谱上册/下册谱文';
        if (text(person.vital_source).trim() !== vitalSource) {
          person.vital_source = vitalSource;
          changed = true;
        }
      }
    });
    return changed;
  }

  function loadSaved() {
    try {
      const verified = JSON.parse(localStorage.getItem(VERIFIED_KEY) || '[]');
      state.verified = new Set(Array.isArray(verified) ? verified.map((id) => String(id)) : []);
    } catch (error) {
      state.verified = new Set();
    }
    // 管理后台成功读取服务器 canonical 后，不再用旧浏览器缓存覆盖服务器数据。
    if (IS_ADMIN && state.sourceAuthority === 'management-canonical-admin') {
      state.data = clone(state.original);
      rebuildDataIndexes();
      return;
    }
    // 族谱查询页是公开只读页面：管理后台 API 成功时只使用 canonical 数据，
    // 不读取历史浏览器 localStorage，也不让交付版静态校勘覆盖后台最新输入。
    if (!IS_ADMIN) {
      state.data = clone(state.original);
      rebuildDataIndexes();
      if (state.sourceAuthority !== 'management-canonical') applyKnownPdfCorrections();
      return;
    }
    let loaded = false;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.every((item) => item && item.name !== undefined)) {
        // 本地缓存优先保留人工修订，但不能把服务器后来补入的谱载字段吞掉。
        // 只对“旧缓存中完全没有该字段”的情况从交付源补齐；用户主动清空的字段仍保持为空。
        const sourceById = new Map(state.original.map((item) => [String(personId(item)), item]));
        const sourceEnrichmentKeys = new Set(['birth_date', 'death_date', 'courtesy_name', 'title', 'source_pages', 'vital_source', 'spouse_record', 'book_record']);
        state.data = saved.map((item) => {
          const source = sourceById.get(String(personId(item)));
          if (!source) return item;
          const merged = { ...item };
          Object.keys(source).forEach((key) => {
            const missing = !Object.prototype.hasOwnProperty.call(item, key);
            const sourceEnrichment = sourceEnrichmentKeys.has(key) && text(source[key]).trim() && !text(item[key]).trim();
            if (missing || sourceEnrichment) merged[key] = clone(source[key]);
          });
          return merged;
        });
        loaded = true;
      }
    } catch (error) { /* 主数据损坏时尝试自动备份 */ }
    if (!loaded) {
      try {
        const backup = JSON.parse(localStorage.getItem(BACKUP_KEY) || 'null');
        if (backup && Array.isArray(backup.data) && backup.data.every((item) => item && item.name !== undefined)) {
          state.data = backup.data;
          loaded = true;
        }
      } catch (error) { /* 自动备份也不可用时回到交付包原始数据 */ }
    }
    if (!loaded) state.data = clone(state.original);
    rebuildDataIndexes();
    if (applyKnownPdfCorrections()) persist();
  }

  function downloadJson(filename, value) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function dateStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  function exportAll() {
    flushDraftAutoSave();
    downloadJson(`枫槎谢氏世系图-备份-${dateStamp()}.json`, state.data);
    showToast('已导出当前人物数据');
  }

  function exportPerson() {
    flushDraftAutoSave();
    const person = getPerson(state.selectedId);
    if (!person) return;
    downloadJson(`人物-${text(person.name) || '未命名'}-${dateStamp()}.json`, {
      person,
      parents: parentsOf(person),
      spouses: spousesOf(person),
      children: childrenOf(person),
      ancestors: ancestorsOf(person)
    });
    showToast('已导出人物详情');
  }

  function switchView(key, options = {}) {
    if (!VIEW_DEFS[key]) return;
    flushDraftAutoSave();
    state.overviewMode = false;
    state.immersive = false;
    state.view = key;
    state.mainFocusId = null;
    state.mainSublineage = key === 'main' ? options.sublineage || null : null;
    state.mainLineageRootId = state.mainSublineage ? personId(getPerson(options.lineageRootId)) : null;
    state.mainLineageTargetId = state.mainSublineage ? personId(getPerson(options.lineageTargetId)) : null;
    if (state.mainSublineage && options.focusId) state.mainFocusId = personId(getPerson(options.focusId));
    state.mobileFocusRootId = null;
    state.selectedId = null;
    state.mode = 'view';
    state.branch = '';
    state.generation = '';
    state.searchQuery = '';
    const search = $('#search-input');
    if (search) search.value = '';
    buildFilters();
    seedMainExpansion();
    // 子世系入口直接展开从起点到终点的完整路径；6-0 有三个终点，需同时展开三条路径。
    // viewIncludes 已限制终点以下不再进入当前图面。
    if (state.mainSublineage) expandSublineagePaths(MAIN_SUBLINEAGES[state.mainSublineage]);
    renderAll();
    fitOverview();
    showToast(`已切换到${currentView().label}`);
  }

  function resolveFormRef(value) {
    const raw = text(value).trim();
    if (!raw) return null;
    const person = resolveRef(raw);
    if (person) return personId(person);
    const numeric = numberValue(raw);
    return numeric === null ? raw : numeric;
  }

  function readPersonForm() {
    const form = $('#person-form');
    if (!form) return null;
    const values = {};
    $$('[data-field]').forEach((field) => {
      const key = field.dataset.field;
      if (field.type === 'checkbox') values[key] = field.checked;
      else values[key] = field.value.trim();
    });
    if (!values.name) {
      showToast('请先填写人物姓名');
      const nameField = form.querySelector('[data-field="name"]');
      if (nameField) nameField.focus();
      return null;
    }
    const current = state.draftId ? getPerson(state.draftId) : null;
    const result = Object.assign({}, current || {}, values);
    result.id = current ? current.id : Math.max(0, ...state.data.map((item) => Number(item.id) || 0)) + 1;
    result.generation_num = values.generation_num ? Number(values.generation_num) : null;
    result.father_id = resolveFormRef(values.father_ref);
    result.mother_id = resolveFormRef(values.mother_ref);
    result.spouse_ids = values.spouse_ids || null;
    if (values.is_alive === 'true') result.is_alive = true;
    else if (values.is_alive === 'false') result.is_alive = false;
    else result.is_alive = null;
    delete result.father_ref;
    delete result.mother_ref;
    return result;
  }

  function savePerson() {
    clearTimeout(draftAutoSaveTimer);
    draftAutoSaveTimer = null;
    const person = readPersonForm();
    if (!person) return;
    const index = state.data.findIndex((item) => String(personId(item)) === String(person.id));
    if (index >= 0) state.data[index] = person;
    else state.data.push(person);
    state.selectedId = person.id;
    state.mode = 'view';
    state.draftId = null;
    state.draftParentId = null;
    setAncestorsExpanded(person);
    const viewPosition = captureViewPosition();
    persist();
    buildAdoptionIndex();
    buildFilters();
    renderInPlace(viewPosition);
    showToast('人物资料已保存到当前浏览器');
  }

  function autoSaveDraft() {
    if (state.mode !== 'edit' || !$('#person-form')) return;
    const nameField = $('#person-form [data-field="name"]');
    const status = $('#autosave-status');
    if (!nameField || !nameField.value.trim()) {
      if (status) {
        status.textContent = '请先填写姓名，其他修改暂存中';
        status.classList.remove('is-saved');
      }
      return;
    }
    const person = readPersonForm();
    if (!person) return;
    const index = state.data.findIndex((item) => String(personId(item)) === String(person.id));
    if (index >= 0) state.data[index] = person;
    else state.data.push(person);
    state.selectedId = person.id;
    state.draftId = person.id;
    state.draftParentId = null;
    setAncestorsExpanded(person);
    const viewPosition = captureViewPosition();
    persist();
    buildAdoptionIndex();
    buildFilters();
    renderTreeInPlace(viewPosition);
    // 修改后立即记住当前图面，刷新时恢复到同一视图、缩放和平移位置。
    persistSessionView();
    if (status) {
      status.textContent = `已实时保存 · ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
      status.classList.add('is-saved');
    }
  }

  function scheduleDraftAutoSave() {
    if (state.mode !== 'edit') return;
    const status = $('#autosave-status');
    if (status) {
      status.textContent = '正在保存…';
      status.classList.remove('is-saved');
    }
    clearTimeout(draftAutoSaveTimer);
    draftAutoSaveTimer = setTimeout(() => {
      draftAutoSaveTimer = null;
      autoSaveDraft();
    }, 180);
  }

  function flushDraftAutoSave() {
    if (state.mode !== 'edit') return;
    clearTimeout(draftAutoSaveTimer);
    draftAutoSaveTimer = null;
    autoSaveDraft();
  }

  function beginEdit(id, parentId) {
    if (state.mode === 'edit') flushDraftAutoSave();
    state.mode = 'edit';
    state.draftId = id ? personId(getPerson(id)) : null;
    state.draftParentId = parentId ? personId(getPerson(parentId)) : null;
    renderDetail();
    const panel = $('#detail-panel');
    if (panel) panel.scrollTop = 0;
  }

  function deleteSelected(targetId = state.selectedId) {
    const person = getPerson(targetId);
    if (!person) return;
    const children = childrenOf(person);
    const confirmText = children.length ? `“${text(person.name)}”有 ${children.length} 位直接关联子女。删除后将把他们挂回上一层父系，是否继续？` : `确认删除“${text(person.name)}”吗？此操作可通过重新导入备份恢复。`;
    if (!window.confirm(confirmText)) return;
    const replacement = resolveRef(person.father_id ?? person.fatherId ?? person.father);
    children.forEach((child) => {
      if (String(toId(child.father_id ?? child.fatherId)) === String(personId(person))) child.father_id = replacement ? personId(replacement) : null;
      if (String(toId(child.mother_id ?? child.motherId)) === String(personId(person))) child.mother_id = replacement ? personId(replacement) : null;
    });
    state.data = state.data.filter((item) => String(personId(item)) !== String(personId(person)));
    state.selectedId = null;
    const viewPosition = captureViewPosition();
    persist();
    buildAdoptionIndex();
    buildFilters();
    renderInPlace(viewPosition);
    showToast('人物已从当前交付数据中删除');
  }

  function deleteNextGeneration(parentId) {
    const parent = getPerson(parentId);
    if (!parent) return;
    const directChildren = childrenOf(parent);
    if (!directChildren.length) {
      showToast(`“${text(parent.name)}”目前没有已关联的下一代`);
      return;
    }
    const removedIds = new Set(directChildren.map((person) => String(personId(person))));
    const promotedGrandchildren = directChildren.flatMap((child) => childrenOf(child));
    const confirmText = `确认删除“${text(parent.name)}”的 ${directChildren.length} 位直接下一代吗？更下层后代将上挂到“${text(parent.name)}”名下。删除后可通过备份恢复。`;
    if (!window.confirm(confirmText)) return;
    state.data.forEach((person) => {
      if (String(toId(person.father_id)) && removedIds.has(String(toId(person.father_id)))) {
        person.father_id = personId(parent);
      }
      if (String(toId(person.mother_id)) && removedIds.has(String(toId(person.mother_id)))) {
        person.mother_id = personId(parent);
      }
    });
    state.data = state.data.filter((person) => !removedIds.has(String(personId(person))));
    removedIds.forEach((key) => {
      state.verified.delete(key);
      state.expanded.delete(key);
    });
    if (removedIds.has(String(state.selectedId))) state.selectedId = personId(parent);
    if (removedIds.has(String(state.draftId))) {
      state.mode = 'view';
      state.draftId = null;
      state.draftParentId = null;
    }
    state.dataIndexReady = false;
    const viewPosition = captureViewPosition();
    persist();
    buildAdoptionIndex();
    buildFilters();
    renderInPlace(viewPosition);
    showToast(`已删除“${text(parent.name)}”的直接下一代，并保留更下层后代 ${promotedGrandchildren.length} 人`);
  }

  function selectPerson(id, options = {}) {
    if (state.mode === 'edit') flushDraftAutoSave();
    const person = getPerson(id);
    if (!person) return;
    // 手机端只读世系图的详情栏位于树图区之后；如果仍保持三段式布局，
    // 点击卡片虽然会更新详情，但用户当前视口看不到任何变化。
    // 直接切换为资料模式，让点击卡片有明确、可见的反馈。查询页自己的
    // “详情”动作已有专用流程，因此不在 query.open 时重复切换。
    const enterMobileCardDetail = !IS_ADMIN
      && isMobileViewport()
      && !state.query.open
      && !state.overviewMode
      && !state.detailOnly;
    if (enterMobileCardDetail) {
      state.detailReturnSnapshot = captureDetailReturnSnapshot();
      state.detailOrigin = 'tree';
      setDetailOnlyMode(true);
    }
    // 同名的亲生 / 入继记录点击时统一落到承嗣卡片：
    // 点击“水财（出继）”也要直接看到“水财（入继）”下面的世和、世安。
    const outRelation = adoptionRelation(person);
    const inRelation = state.adoption.inById.get(String(personId(person))) || null;
    const routedPerson = outRelation && outRelation.adoptiveRecord ? outRelation.adoptiveRecord : person;
    const selection = (outRelation && outRelation.adoptiveRecord) || inRelation ? routedPerson : person;
    const previousExpanded = new Set(state.expanded);
    state.selectedId = personId(selection);
    state.mode = 'view';
    if (isMobileViewport() && !state.overviewMode) prepareMobileFocusWindow(selection, 4);
    else setAncestorsExpanded(selection);
    const selectionKey = String(personId(selection));
    const selectionChildren = treeChildren(selection);
    if (selectionChildren.length) state.expanded.add(selectionKey);
    const isWaterCai = ['501', '502'].includes(String(personId(selection)));
    if ((outRelation || inRelation) && displayChildrenOf(selection).length) {
      state.expanded.add(selectionKey);
    }
    if (selection !== person) {
      showToast(isWaterCai ? '已定位到昌谊名下水财，世安、世和已展开' : `已定位到入继${text(selection.name)}，下一代已展开`);
    }
    const expansionChanged = state.expanded.size !== previousExpanded.size
      || Array.from(state.expanded).some((key) => !previousExpanded.has(key));
    const addedKeys = Array.from(state.expanded).filter((key) => !previousExpanded.has(key));
    const onlySelectedNodeExpanded = addedKeys.length === 1 && addedKeys[0] === selectionKey;
    // 只展开当前卡片时就地补入后代；仅在路由、筛选或祖先链发生变化时重绘整棵树。
    if (options.forceRender || (!onlySelectedNodeExpanded && expansionChanged)) {
      renderTree();
    } else if (onlySelectedNodeExpanded && !expandPersonNodeInPlace(selection)) {
      renderTree();
    }
    renderDetail();
    updateSelectedCardUI();
    const card = document.querySelector(`.person-card[data-id="${CSS.escape(String(personId(selection)))}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      card.classList.remove('is-search-target-pulse');
      void card.offsetWidth;
      card.classList.add('is-search-target-pulse');
    }
    if (enterMobileCardDetail) {
      window.setTimeout(() => {
        const panel = $('#detail-panel');
        if (!panel || !panel.classList.contains('has-person')) return;
        panel.hidden = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        const heading = panel.querySelector('.detail-head h3');
        if (heading) heading.setAttribute('tabindex', '-1');
        heading?.focus({ preventScroll: true });
      }, 0);
    }
  }

  function autoLocateSearchMatch() {
    const query = state.searchQuery.trim();
    if (!query) {
      state.selectedId = null;
      state.mode = 'view';
      clearSearchCardUI();
      updateSelectedCardUI();
      renderDetail();
      return;
    }
    const exact = state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person) && text(person.name).trim() === query);
    if (exact.length > 1) {
      showPersonDisambiguation(query, exact, (person) => {
        selectPerson(personId(person), { forceRender: true });
        showToast(`已选择并定位：${text(person.name)} · ${personChoiceDescription(person)}`);
      });
      return;
    }
    const match = exact[0] || state.data.find((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person) && matchesSearch(person));
    if (match) {
      selectPerson(personId(match), { forceRender: true });
      showToast(`已定位并高亮：${text(match.name)}`);
      return;
    }
    state.selectedId = null;
    state.mode = 'view';
    clearSearchCardUI();
    updateSelectedCardUI();
    renderDetail();
  }

  function expandMain() {
    state.overviewMode = false;
    state.immersive = false;
    state.mobileFocusRootId = null;
    seedMainExpansion();
    renderTree();
  }

  function expandAll(trigger) {
    if (fullExpandBusy) return;
    fullExpandBusy = true;
    const previousLabel = trigger ? trigger.textContent : '';
    if (trigger) {
      trigger.disabled = true;
      trigger.textContent = '展开中…';
    }
    showToast('正在展开本宗全部世系，请稍候…');
    const run = () => {
      try {
        prepareFullExpansion();
        renderAll();
        if (isMobileViewport() && state.view === 'overview' && state.overviewMode) {
          state.zoom = 1;
          state.mapPan = { x: 0, y: 0 };
          updateZoomReadouts();
          showToast('总览已按六段世系整理，请选择一段查看连续树图');
        } else {
          // 全部展开的结果必须在当前世系展示窗口内完整出现。
          // SVG 图层保持矢量清晰，用户仍可继续放大或平移查看细节。
          fitOverview({ whole: true });
        }
        if (!(isMobileViewport() && state.view === 'overview' && state.overviewMode)) showToast('本宗世系图已全部展开，可缩放、平移查看全图');
      } catch (error) {
        showToast('展开全部时遇到异常，请先使用“展开主脉”或按支系查看');
      } finally {
        fullExpandBusy = false;
        if (trigger) {
          trigger.disabled = false;
          trigger.textContent = previousLabel || '全部展开（高级）';
        }
      }
    };
    // 先让按钮显示“展开中…”，再进行大图计算，避免用户误以为按钮没有反应。
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else setTimeout(run, 0);
  }

  function collapseAll() {
    state.overviewMode = false;
    state.immersive = false;
    state.mobileFocusRootId = null;
    state.zoom = 1;
    state.mapPan = { x: 0, y: 0 };
    state.expanded.clear();
    const root = findRoot();
    if (root) state.expanded.add(String(personId(root)));
    renderTree();
    const center = () => centerCollapsedTree();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => requestAnimationFrame(center));
    } else {
      setTimeout(center, 0);
    }
  }

  function printTree() {
    if (isMobileViewport()) return;

    flushDraftAutoSave();
    const sourceStage = $('#tree-stage');
    if (!sourceStage) return;
    const printWindow = window.open('', 'xiafengcha-genealogy-print', 'width=1400,height=900,scrollbars=yes');
    if (!printWindow) {
      showToast('打印窗口被浏览器拦截，请允许此页面打开弹出窗口');
      return;
    }
    const snapshot = {
      compact: state.compact,
      overviewMode: state.overviewMode,
      branch: state.branch,
      generation: state.generation,
      searchQuery: state.searchQuery,
      expanded: new Set(state.expanded)
    };
    state.compact = true;
    state.branch = '';
    state.generation = '';
    state.searchQuery = '';
    state.expanded = new Set(snapshot.expanded);
    state.data.filter((person) => viewIncludes(person) && !isHiddenAdoptionRecord(person)).forEach((person) => {
      if (treeChildren(person).length) state.expanded.add(String(personId(person)));
    });
    renderTree();
    const printableStage = sourceStage.cloneNode(true);
    printableStage.removeAttribute('id');
    printableStage.removeAttribute('style');
    printableStage.classList.add('print-tree-stage');
    const cardCount = printableStage.querySelectorAll('.person-card').length;
    const title = escapeHtml(currentView().label);
    const date = new Date().toLocaleDateString('zh-CN');
      const stylesheet = new URL('styles.css?v=20260823-01', window.location.href).href;
    const printMarkup = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${title} · 打印版</title><link rel="stylesheet" href="${stylesheet}"><style>
      @page { size: A0 landscape; margin: 0; }
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      html, body { width: 1189mm; height: 841mm; margin: 0; background: #fff; }
      body { overflow: hidden; color: #17384f; font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans SC", Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-sheet { position: relative; width: 1189mm; height: 841mm; padding: 14mm; overflow: hidden; background: #fff; }
      .print-header { height: 25mm; display: flex; align-items: flex-start; justify-content: space-between; border-bottom: .35mm solid #7894a6; }
      .print-header h1 { margin: 0; color: #123b57; font-size: 22pt; font-weight: 700; letter-spacing: .08em; }
      .print-header p { margin: 3mm 0 0; color: #607c8d; font-size: 10pt; }
      .print-header .print-meta { text-align: right; color: #607c8d; font-size: 9pt; line-height: 1.7; }
      .print-canvas { position: relative; width: 100%; height: calc(100% - 38mm); margin-top: 7mm; overflow: hidden; border: .35mm solid #9bb0be; background-color: #fbfcfd; background-image: radial-gradient(#d5e0e7 .45mm, transparent .45mm); background-size: 6mm 6mm; }
      .print-tree-stage { position: absolute; left: 0; top: 0; width: max-content !important; min-width: 0 !important; padding: 16px 24px !important; transform-origin: top left; transition: none !important; }
      .print-tree-stage .person-card { box-shadow: none; }
      .print-footer { position: absolute; left: 14mm; right: 14mm; bottom: 7mm; display: flex; justify-content: space-between; color: #718997; font-size: 8pt; }
      @media print { .print-sheet { break-after: avoid-page; page-break-after: avoid; } }
    </style></head><body><main class="print-sheet"><header class="print-header"><div><h1>${title}</h1><p>枫槎谢氏宗谱 · 独立世系图打印版</p></div><div class="print-meta">${date}<br>当前图面卡片：${cardCount} 张<br>A0 横向蓝图式排版</div></header><section class="print-canvas">${printableStage.outerHTML}</section><footer class="print-footer"><span>数据来源：上册 PDF + 下册 PDF</span><span>建议打印设置：A0 / 横向 / 缩放 100%</span></footer></main></body></html>`;
    printWindow.document.open();
    printWindow.document.write(printMarkup);
    printWindow.document.close();

    // 恢复主界面原来的筛选、缩放和展开状态；打印窗口保留刚才生成的完整图面。
    state.compact = snapshot.compact;
    state.overviewMode = Boolean(snapshot.overviewMode);
    state.branch = snapshot.branch;
    state.generation = snapshot.generation;
    state.searchQuery = snapshot.searchQuery;
    state.expanded = snapshot.expanded;
    const search = $('#search-input');
    if (search) search.value = snapshot.searchQuery;
    buildFilters();
    renderAll();
    showToast('已生成 A0 横向打印版；请在打印设置中选择 A0、横向、缩放 100%');

    let started = false;
    const startPrint = () => {
      if (started || printWindow.closed) return;
      started = true;
      const canvas = printWindow.document.querySelector('.print-canvas');
      const stage = printWindow.document.querySelector('.print-tree-stage');
      if (canvas && stage) {
        const contentWidth = Math.max(1, stage.scrollWidth);
        const contentHeight = Math.max(1, stage.scrollHeight);
        const scale = Math.min((canvas.clientWidth - 16) / contentWidth, (canvas.clientHeight - 16) / contentHeight, 1);
        stage.style.transform = `scale(${scale})`;
        stage.style.left = `${Math.max(8, (canvas.clientWidth - contentWidth * scale) / 2)}px`;
        stage.style.top = `${Math.max(8, (canvas.clientHeight - contentHeight * scale) / 2)}px`;
      }
      printWindow.focus();
      printWindow.print();
    };
    printWindow.addEventListener('load', () => setTimeout(startPrint, 350), { once: true });
    setTimeout(startPrint, 1400);
  }

  function resetData() {
    if (!window.confirm('恢复原始数据会清除当前浏览器中的编辑内容，建议先导出 JSON 备份。是否继续？')) return;
    const viewPosition = captureViewPosition();
    state.data = clone(state.original);
    state.selectedId = null;
    state.mode = 'view';
    state.branch = '';
    state.generation = '';
    state.searchQuery = '';
    $('#search-input').value = '';
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* ignore */ }
    buildAdoptionIndex();
    buildFilters();
    seedMainExpansion();
    renderInPlace(viewPosition);
    showToast('已恢复 PDF 整理后的原始数据');
  }

  function renderAll() {
    renderViewTabs();
    renderMainBranchNav();
    renderStats();
    renderSearchResults();
    renderTree();
    renderDetail();
    applyImmersiveMode(false);
    if (state.query.open) renderQueryDashboard();
    updateMobileLineageSelectionBackButton();
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function openQueryPersonDetail(id) {
    // “详情”是查询结果的确定动作：关闭查询层、恢复详情栏，再直接打开完整人物资料。
    // 详情栏可能被用户此前手动隐藏；若不强制恢复，移动端点击后只会更新隐藏区域，
    // 看起来就像按钮没有反应。
    closeMobileQueryMenu();
    if (state.query.open) toggleQueryDrawer();
    const drawer = $('#query-drawer');
    if (drawer) drawer.hidden = true;
    const shell = $('#app');
    if (shell) shell.classList.remove('is-query-open');
    if (state.layout.detailHidden) {
      state.layout.detailHidden = false;
      applyLayout(true);
    }
    const person = getPerson(id);
    if (!person) {
      showToast('未找到该族人，无法打开详情');
      return;
    }
    // 手机端详情必须停留在当前查询页，只显示完整人物资料；不再把树图区带到视口中。
    state.detailOrigin = 'query';
    state.detailReturnSnapshot = null;
    setDetailOnlyMode(true);
    selectPerson(id, { forceRender: true });
    window.setTimeout(() => {
      const panel = $('#detail-panel');
      if (!panel || !panel.classList.contains('has-person')) return;
      panel.hidden = false;
      if (isMobileViewport()) panel.scrollIntoView({ behavior: 'auto', block: 'start' });
      const heading = panel.querySelector('.detail-head h3');
      if (heading) heading.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    }, 180);
  }

  function handleAction(action, element) {
    const id = element && element.dataset ? element.dataset.id : null;
    const adminOnlyActions = new Set(['import', 'export', 'new-person', 'reset-data', 'toggle-verified', 'edit-person', 'new-child', 'export-person', 'delete-person', 'cancel-edit']);
    if (!IS_ADMIN && adminOnlyActions.has(action)) {
      showToast('族谱前台仅供查询，修改请进入管理后台');
      return;
    }
    switch (action) {
      case 'import': $('#import-file').click(); break;
      case 'export': exportAll(); break;
      case 'new-person': beginEdit(null, null); break;
      case 'dismiss-notice': element.closest('.notice-bar').remove(); break;
      case 'expand-main': expandMain(); break;
      case 'expand-all': expandAll(element); break;
      case 'collapse-all': collapseAll(); break;
      case 'print-tree': printTree(); break;
      case 'reset-data': resetData(); break;
      case 'switch-view': switchView(element.dataset.view); break;
      case 'mobile-overview-section': openMobileOverviewSection(element.dataset.view); break;
      case 'focus-main-branch': focusMainBranch(element.dataset.focusId); break;
      case 'expand-depth': expandToDepth(element.dataset.depth); break;
      case 'toggle-global-nav': toggleGlobalNav(); break;
      case 'close-global-nav': setGlobalNav(false); break;
      case 'toggle-left-rail': togglePanel('left'); break;
      case 'toggle-detail-panel': togglePanel('right'); break;
      case 'toggle-immersive': toggleImmersive(); break;
      case 'fit-overview': fitOverview(); break;
      case 'fit-screen': fitOverview(); break;
      case 'show-full-map': expandAll(); break;
      case 'back-to-person': backToPerson(); break;
      case 'toggle-minimap': toggleMinimap(); break;
      case 'reset-map-position': resetMapPosition(); break;
      case 'toggle-compact': toggleCompact(); break;
      case 'toggle-query-drawer':
        if (!IS_ADMIN && isMobileViewport() && !element.classList.contains('query-close')) openMobileQueryMenu();
        else toggleQueryDrawer();
        break;
      case 'close-mobile-query-menu': closeMobileQueryMenu(); break;
      case 'mobile-query-route': openMobileQueryRoute(element.dataset.route); break;
      case 'query-lineage-view': openLineageViewFromQuery(element); break;
      case 'return-lineage-selection': returnToMobileLineageSelection(); break;
      case 'mobile-generation-single': chooseGenerationQuery('single'); break;
      case 'mobile-generation-range': chooseGenerationQuery('range'); break;
      case 'query-generation-single': runGenerationQuery('single'); break;
      case 'query-generation-range': runGenerationQuery('range'); break;
      case 'query-lineage7':
        setMobileQueryMode('people');
        runLineage7Query(id);
        break;
      case 'query-lineage7-clear': {
        state.query.lineage7Id = null;
        renderQueryLineage7();
        focusQueryField('query-search');
        break;
      }
      case 'query-lineage7-fit': fitLineage7Map(); break;
      case 'query-lineage7-zoom-in': zoomLineage7Map(1.18); break;
      case 'query-lineage7-zoom-out': zoomLineage7Map(1 / 1.18); break;
      case 'query-lineage7-reset': resetLineage7Map(); break;
      case 'query-run': runQuerySearch(); break;
      case 'query-clear': clearQuery(); break;
      case 'query-relation': renderQueryRelation(); break;
      case 'query-detail': openQueryPersonDetail(id); break;
      case 'toggle-adoption-table':
        state.query.adoptionTableOpen = !state.query.adoptionTableOpen;
        renderAdoptionTable();
        break;
      case 'query-locate': {
        const openDetails = element.dataset.queryDetail === 'true' || text(element.textContent).trim() === '详情';
        // 查询抽屉位于主内容层之上；打开详情时先收起它，避免详情已渲染但被抽屉遮住。
        if (openDetails && state.query.open) toggleQueryDrawer();
        selectPerson(id, { forceRender: true });
        if (openDetails && isMobileViewport()) {
          window.setTimeout(() => {
            const panel = $('#detail-panel');
            if (panel) panel.scrollIntoView({ behavior: 'auto', block: 'start' });
          }, 120);
        }
        break;
      }
      case 'root-trace': openRootTrace(id); break;
      case 'toggle-root-trace-fullscreen': toggleRootTraceFullscreen(); break;
      case 'close-root-trace': closeRootTrace(); break;
      case 'close-person-disambiguation': closePersonDisambiguation(); break;
      case 'pick-person-disambiguation': choosePersonDisambiguation(id); break;
      case 'query-generation': selectQueryGeneration(element.dataset.generation); break;
      case 'query-generation-close': {
        const detail = $('#query-generation-detail');
        if (detail) { detail.hidden = true; detail.innerHTML = ''; }
        break;
      }
      case 'query-pick-relation': pickQueryRelation(element.dataset.side, id); break;
      case 'zoom-in': stepZoom(1); break;
      case 'zoom-out': stepZoom(-1); break;
      case 'zoom-reset': resetZoom(); break;
      case 'toggle-verified': toggleVerified(id); break;
      case 'open-water-cai': openWaterCaiTree(); break;
      case 'select-person': selectPerson(element.dataset.openId || id); break;
      case 'toggle-node': {
        const key = String(toId(id));
        if (state.expanded.has(key)) {
          state.expanded.delete(key);
          renderTree();
        } else {
          state.expanded.add(key);
          const person = getPerson(id);
          if (!expandPersonNodeInPlace(person)) renderTree();
        }
        break;
      }
      case 'edit-person': beginEdit(state.selectedId, null); break;
      case 'new-child': beginEdit(null, state.selectedId); break;
      case 'export-person': exportPerson(); break;
      case 'delete-person': deleteSelected(); break;
      case 'cancel-edit': flushDraftAutoSave(); state.mode = 'view'; state.draftId = null; state.draftParentId = null; renderDetail(); break;
      case 'close-detail': {
        const restorePeopleQuery = !IS_ADMIN && isMobileViewport() && state.detailOrigin === 'query';
        const restoreTree = !IS_ADMIN && state.detailOrigin === 'tree' && state.detailReturnSnapshot;
        const treeSnapshot = restoreTree ? state.detailReturnSnapshot : null;
        flushDraftAutoSave();
        setDetailOnlyMode(false);
        state.detailOrigin = null;
        state.detailReturnSnapshot = null;
        if (treeSnapshot) {
          state.selectedId = treeSnapshot.selectedId ?? null;
          state.mode = treeSnapshot.mode || 'view';
          state.view = treeSnapshot.view || state.view;
          state.mainFocusId = treeSnapshot.mainFocusId ?? null;
          state.mobileFocusRootId = treeSnapshot.mobileFocusRootId ?? null;
          state.branch = treeSnapshot.branch || '';
          state.generation = treeSnapshot.generation || '';
          state.searchQuery = treeSnapshot.searchQuery || '';
          state.immersive = Boolean(treeSnapshot.immersive);
          renderInPlace(treeSnapshot);
          updateSelectedCardUI();
          break;
        }
        state.selectedId = null;
        state.mode = 'view';
        renderDetail();
        updateSelectedCardUI();
        if (restorePeopleQuery) restoreMobilePeopleQuery();
        else if (!IS_ADMIN && isMobileViewport()) window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      }
      case 'back-to-people-query': returnToPeopleQuery(); break;
      default: break;
    }
  }

  function wireCanvasPan() {
    const viewport = $('#tree-viewport');
    if (!viewport) return;
    let panFrame = 0;
    let branchFrame = 0;
    let pendingBranchX = 0;
    let pendingBranchY = 0;
    let pendingLeft = 0;
    let pendingTop = 0;
    let pendingMapX = 0;
    let pendingMapY = 0;
    let panCanScrollX = false;
    let panCanScrollY = false;
    let wheelFrame = 0;
    let pendingWheelFactor = 1;
    let pendingWheelX = 0;
    let pendingWheelY = 0;
    const touchPointers = new Map();
    let pinchActive = false;
    let pinchDistance = 0;
    let pinchFrame = 0;
    let pendingPinchFactor = 1;
    let pendingPinchX = 0;
    let pendingPinchY = 0;
    const touchPair = () => Array.from(touchPointers.values()).slice(0, 2);
    const pairMetrics = () => {
      const pair = touchPair();
      if (pair.length < 2) return null;
      const dx = pair[1].x - pair[0].x;
      const dy = pair[1].y - pair[0].y;
      return {
        distance: Math.max(1, Math.hypot(dx, dy)),
        x: (pair[0].x + pair[1].x) / 2,
        y: (pair[0].y + pair[1].y) / 2
      };
    };
    viewport.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      if (event.pointerType === 'touch') {
        touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (touchPointers.size >= 2) {
          const metrics = pairMetrics();
          pinchActive = true;
          pinchDistance = metrics ? metrics.distance : 1;
          pendingPinchFactor = 1;
          state.pan.active = false;
          state.pan.pointerId = null;
          state.pan.dragged = true;
          viewport.classList.remove('is-panning');
          viewport.classList.add('is-pinching');
          event.preventDefault();
          return;
        }
      }
      state.pan.active = true;
      state.pan.pointerId = event.pointerId;
      state.pan.startX = event.clientX;
      state.pan.startY = event.clientY;
      state.pan.scrollLeft = viewport.scrollLeft;
      state.pan.scrollTop = viewport.scrollTop;
      const cameraMode = Boolean(state.overviewCanvas?.active);
      panCanScrollX = !cameraMode && viewport.scrollWidth - viewport.clientWidth > 2;
      panCanScrollY = !cameraMode && viewport.scrollHeight - viewport.clientHeight > 2;
      state.pan.originMapX = Number(state.mapPan && state.mapPan.x) || 0;
      state.pan.originMapY = Number(state.mapPan && state.mapPan.y) || 0;
      state.pan.dragged = false;
      viewport.classList.add('is-panning');
    });
    const movePan = (event) => {
      if (event.pointerType === 'touch' && touchPointers.has(event.pointerId)) {
        touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
      if (pinchActive && touchPointers.size >= 2) {
        const metrics = pairMetrics();
        if (!metrics) return;
        event.preventDefault();
        pendingPinchFactor *= metrics.distance / Math.max(1, pinchDistance);
        pinchDistance = metrics.distance;
        pendingPinchX = metrics.x;
        pendingPinchY = metrics.y;
        if (!pinchFrame) {
          const commitPinch = () => {
            pinchFrame = 0;
            const factor = pendingPinchFactor;
            pendingPinchFactor = 1;
            if (Number.isFinite(factor) && Math.abs(factor - 1) > .0005) {
              zoomAroundPoint(factor, pendingPinchX, pendingPinchY, true);
            }
          };
          if (typeof requestAnimationFrame === 'function') pinchFrame = requestAnimationFrame(commitPinch);
          else commitPinch();
        }
        return;
      }
      if (!state.pan.active || event.pointerId !== state.pan.pointerId) return;
      const deltaX = event.clientX - state.pan.startX;
      const deltaY = event.clientY - state.pan.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) state.pan.dragged = true;
      if (!state.pan.dragged) return;
      // 超过拖动阈值后再捕获指针，普通点击人物卡片仍会正常触发详情。
      if (viewport.setPointerCapture && !viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
      event.preventDefault();
      pendingLeft = panCanScrollX ? state.pan.scrollLeft - deltaX : state.pan.scrollLeft;
      pendingTop = panCanScrollY ? state.pan.scrollTop - deltaY : state.pan.scrollTop;
      pendingMapX = panCanScrollX ? state.pan.originMapX : state.pan.originMapX + deltaX;
      pendingMapY = panCanScrollY ? state.pan.originMapY : state.pan.originMapY + deltaY;
      if (!panFrame) {
        const commitPan = () => {
          panFrame = 0;
          viewport.scrollLeft = pendingLeft;
          viewport.scrollTop = pendingTop;
          const mapChanged = pendingMapX !== (Number(state.mapPan && state.mapPan.x) || 0) || pendingMapY !== (Number(state.mapPan && state.mapPan.y) || 0);
          if (mapChanged) {
            state.mapPan = { x: pendingMapX, y: pendingMapY };
            applyMapPan();
          }
        };
        if (typeof requestAnimationFrame === 'function') panFrame = requestAnimationFrame(commitPan);
        else commitPan();
      }
    };
    const endPan = (event) => {
      if (event.pointerType === 'touch') touchPointers.delete(event.pointerId);
      if (pinchActive && touchPointers.size < 2) {
        pinchActive = false;
        pinchDistance = 0;
        pendingPinchFactor = 1;
        viewport.classList.remove('is-pinching');
        state.pan.active = false;
        state.pan.pointerId = null;
        state.pan.suppressClick = true;
        clearTimeout(state.pan.suppressTimer);
        state.pan.suppressTimer = setTimeout(() => { state.pan.suppressClick = false; }, 350);
        return;
      }
      if (!state.pan.active || (event.pointerId !== undefined && event.pointerId !== state.pan.pointerId)) return;
      const dragged = state.pan.dragged;
      state.pan.active = false;
      state.pan.pointerId = null;
      viewport.classList.remove('is-panning');
      if (event.pointerId !== undefined && viewport.hasPointerCapture && viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (dragged) {
        state.pan.suppressClick = true;
        clearTimeout(state.pan.suppressTimer);
        state.pan.suppressTimer = setTimeout(() => { state.pan.suppressClick = false; }, 350);
      }
    };
    // 监听 document，避免展开全部后拖到树节点、边缘或滚动条附近时丢失平移事件。
    document.addEventListener('pointermove', movePan, { passive: false });
    document.addEventListener('pointerup', endPan);
    document.addEventListener('pointercancel', endPan);
    viewport.addEventListener('wheel', (event) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * .0014);
      pendingWheelFactor *= factor;
      pendingWheelX = event.clientX;
      pendingWheelY = event.clientY;
      if (!wheelFrame) {
        const commitWheel = () => {
          wheelFrame = 0;
          const nextFactor = pendingWheelFactor;
          pendingWheelFactor = 1;
          const wheelRect = viewport.getBoundingClientRect();
          zoomAroundPoint(nextFactor, wheelRect.left + wheelRect.width / 2, wheelRect.top + wheelRect.height / 2);
        };
        if (typeof requestAnimationFrame === 'function') wheelFrame = requestAnimationFrame(commitWheel);
        else commitWheel();
      }
    }, { passive: false });
  }

  function wirePanelResize() {
    const workspace = document.querySelector('.workspace');
    if (!workspace) return;
    $$('.panel-resizer').forEach((handle) => {
      handle.title = handle.dataset.resizePanel === 'left'
        ? '左右拖动调整左栏宽度；双击恢复默认宽度'
        : '左右拖动调整详情栏宽度；双击恢复默认宽度';
      handle.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        state.layout.resizing = true;
        state.layout.resizeSide = handle.dataset.resizePanel;
        state.layout.resizePointerId = event.pointerId;
        workspace.classList.add('is-resizing');
        if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
        event.preventDefault();
      });
      handle.addEventListener('dblclick', (event) => {
        if (handle.dataset.resizePanel === 'left') state.layout.leftWidth = 230;
        if (handle.dataset.resizePanel === 'right') state.layout.detailWidth = 365;
        applyLayout(true);
        event.preventDefault();
      });
      handle.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        const step = event.shiftKey ? 30 : 10;
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        if (handle.dataset.resizePanel === 'left') state.layout.leftWidth = clamp(state.layout.leftWidth + direction * step, 150, 520);
        if (handle.dataset.resizePanel === 'right') state.layout.detailWidth = clamp(state.layout.detailWidth - direction * step, 240, 680);
        applyLayout(true);
        event.preventDefault();
      });
    });
    const endResize = (event) => {
      if (!state.layout.resizing || (event.pointerId !== undefined && event.pointerId !== state.layout.resizePointerId)) return;
      state.layout.resizing = false;
      state.layout.resizeSide = null;
      state.layout.resizePointerId = null;
      workspace.classList.remove('is-resizing');
      persistLayout();
    };
    document.addEventListener('pointermove', (event) => {
      if (!state.layout.resizing || event.pointerId !== state.layout.resizePointerId) return;
      const rect = workspace.getBoundingClientRect();
      if (state.layout.resizeSide === 'left') state.layout.leftWidth = clamp(event.clientX - rect.left, 150, 520);
      if (state.layout.resizeSide === 'right') state.layout.detailWidth = clamp(rect.right - event.clientX, 240, 680);
      applyLayout(false);
      event.preventDefault();
    }, { passive: false });
    document.addEventListener('pointerup', endResize);
    document.addEventListener('pointercancel', endResize);
  }

  function wireEvents() {
    wirePanelResize();
    wireCanvasPan();
    const treeViewport = $('#tree-viewport');
    if (treeViewport) treeViewport.addEventListener('scroll', () => renderMiniMap(), { passive: true });
    const minimapPlot = $('#tree-minimap-plot');
    if (minimapPlot) minimapPlot.addEventListener('click', (event) => {
      const node = event.target.closest('.minimap-node');
      const plotRect = minimapPlot.getBoundingClientRect();
      if (node) {
        focusMiniMapPoint(node.dataset.minimapX, node.dataset.minimapY);
        return;
      }
      if (event.target === minimapPlot && plotRect.width && plotRect.height) {
        const stage = $('#tree-stage');
        const x = ((event.clientX - plotRect.left) / plotRect.width) * Math.max(1, stage?.scrollWidth || 1);
        const y = ((event.clientY - plotRect.top) / plotRect.height) * Math.max(1, stage?.scrollHeight || 1);
        focusMiniMapPoint(x, y);
      }
    });
    document.addEventListener('fullscreenchange', () => {
      // 用户按 Esc 退出浏览器原生全屏时，同步恢复页面工具栏，避免留下“只剩图面”的假死状态。
      if (state.immersive && !document.fullscreenElement) {
        state.immersive = false;
        applyImmersiveMode(true);
      }
    });
    window.addEventListener('pagehide', persistSessionView);
    window.addEventListener('beforeunload', persistSessionView);
    document.addEventListener('click', (event) => {
      if (state.pan.suppressClick) {
        const pendingTarget = event.target.closest && event.target.closest('[data-action]');
        // 拖拽结束后，卡片仍应允许明确点击打开详情；其他操作继续避免误触。
        if (pendingTarget && pendingTarget.dataset.action === 'select-person') {
          state.pan.suppressClick = false;
          clearTimeout(state.pan.suppressTimer);
        } else {
          state.pan.suppressClick = false;
          clearTimeout(state.pan.suppressTimer);
          event.preventDefault();
          return;
        }
      }
      const target = event.target.closest('[data-action]');
      if (!target) return;
      if (target.tagName === 'BUTTON' && target.type === 'submit' && target.closest('form')) return;
      event.preventDefault();
      handleAction(target.dataset.action, target);
    });
    document.addEventListener('keydown', (event) => {
      const rootTrace = $('#root-trace-modal');
      if (event.key === 'Escape' && rootTrace && !rootTrace.hidden) {
        event.preventDefault();
        closeRootTrace();
        return;
      }
      const globalNav = $('#global-nav-overlay');
      if (event.key === 'Escape' && globalNav && !globalNav.hidden) {
        event.preventDefault();
        setGlobalNav(false);
        return;
      }
      if (event.key === 'Escape' && state.immersive) {
        event.preventDefault();
        toggleImmersive();
        return;
      }
      const target = event.target.closest && event.target.closest('.verify-toggle, .person-card[data-action="select-person"]');
      if (!target || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      target.click();
    });
    document.addEventListener('submit', (event) => {
      if (event.target.id !== 'person-form') return;
      event.preventDefault();
      savePerson();
    });
    document.addEventListener('input', (event) => {
      if (state.mode !== 'edit' || !event.target.closest('#person-form') || !event.target.matches('[data-field]')) return;
      scheduleDraftAutoSave();
    });
    document.addEventListener('change', (event) => {
      if (state.mode !== 'edit' || !event.target.closest('#person-form') || !event.target.matches('[data-field]')) return;
      scheduleDraftAutoSave();
    });
    document.addEventListener('input', (event) => {
      const field = event.target.closest && event.target.closest('[data-query-field]');
      if (!field) return;
      const key = field.dataset.queryField;
      if (key === 'relationA' || key === 'relationB') {
        state.query[key] = field.value;
        state.query[key === 'relationA' ? 'relationAId' : 'relationBId'] = null;
        renderQueryRelationCandidates();
        return;
      }
      state.query[key] = field.value;
      if (key === 'keyword' || key === 'genFrom' || key === 'genTo') renderQuerySearchResults();
    });
    document.addEventListener('change', (event) => {
      const field = event.target.closest && event.target.closest('[data-query-field]');
      if (!field) return;
      const key = field.dataset.queryField;
      state.query[key] = field.value;
      renderQuerySearchResults();
    });
    $('#search-input').addEventListener('compositionstart', () => {
      searchComposing = true;
      clearTimeout(searchLocateTimer);
    });
    $('#search-input').addEventListener('compositionend', (event) => {
      searchComposing = false;
      state.searchQuery = event.target.value;
      renderSearchResults();
      scheduleSearchLocate();
    });
    $('#search-input').addEventListener('input', (event) => {
      state.searchQuery = event.target.value;
      renderSearchResults();
      clearSearchCardUI();
      scheduleSearchLocate();
    });
    $('#search-input').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        clearTimeout(searchLocateTimer);
        searchLocateTimer = null;
        autoLocateSearchMatch();
        return;
      }
      if (event.key === 'Escape') {
        clearTimeout(searchLocateTimer);
        searchLocateTimer = null;
        event.target.value = '';
        state.searchQuery = '';
        clearSearchCardUI();
        state.selectedId = null;
        state.mode = 'view';
        renderSearchResults();
        updateSelectedCardUI();
        renderDetail();
      }
    });
    $('#branch-filter').addEventListener('change', (event) => {
      state.branch = event.target.value;
      const match = state.data.find(matchesFilters);
      if (match) setAncestorsExpanded(match);
      renderAll();
    });
    $('#generation-filter').addEventListener('change', (event) => {
      state.generation = event.target.value;
      const match = state.data.find(matchesFilters);
      if (match) setAncestorsExpanded(match);
      renderAll();
    });
    const importFile = $('#import-file');
    if (importFile) importFile.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!Array.isArray(imported) || !imported.every((item) => item && item.name !== undefined)) throw new Error('格式');
        const viewPosition = captureViewPosition();
        state.data = imported;
        rebuildDataIndexes();
        applyKnownPdfCorrections();
        state.selectedId = null;
        state.mode = 'view';
        state.branch = '';
        state.generation = '';
        persist();
        buildAdoptionIndex();
        buildFilters();
        seedMainExpansion();
        renderInPlace(viewPosition);
        showToast(`已导入 ${imported.length.toLocaleString('zh-CN')} 条人物数据`);
        } catch (error) {
          showToast('导入失败：请选择人物数组格式的 JSON 文件');
        } finally {
          event.target.value = '';
        }
      };
      reader.readAsText(file, 'utf-8');
    });
  }

  async function loadCanonicalData() {
    if (typeof fetch !== 'function') return false;
    const token = IS_ADMIN ? getAdminToken() : '';
    if (IS_ADMIN && !token) return false;
    try {
      const response = await fetch('/api/data/genealogy?source=management&ts=' + Date.now(), {
        cache: 'no-store',
        headers: token ? { Authorization: 'Bearer ' + token } : {}
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const remoteData = await response.json();
      if (!Array.isArray(remoteData) || !remoteData.every((item) => item && item.name !== undefined)) throw new Error('族谱管理后台返回格式错误');
      state.data = clone(remoteData);
      state.original = clone(remoteData);
      state.sourceAuthority = IS_ADMIN ? 'management-canonical-admin' : 'management-canonical';
      return true;
    } catch (error) {
      // 独立交付包可脱离服务器打开；服务器正常时，前台永远以管理后台 API 为准。
      console.warn('[genealogy] 读取族谱管理后台数据失败，使用内置只读副本:', error.message);
      return false;
    }
  }

  async function reloadAdminCanonicalData() {
    if (!IS_ADMIN || !getAdminToken()) return;
    const viewPosition = captureViewPosition();
    const loaded = await loadCanonicalData();
    if (!loaded) return;
    loadSaved();
    buildAdoptionIndex();
    buildFilters();
    renderInPlace(viewPosition);
    showToast('已载入服务器最新族谱数据');
  }

  window.addEventListener('xie-admin-authenticated', reloadAdminCanonicalData);

  async function init() {
    ensureRootTraceModal();
    await loadCanonicalData();
    loadSaved();
    loadLayout();
    buildAdoptionIndex();
    markVerifiedLineageViewsOnce();
    const sessionView = loadSessionView();
    const route = readMainRoute();
    const hasExplicitRoute = Boolean(route.view || route.focusId || route.sublineage || route.depth || route.safe || route.rootSearch);
    if (route.view) state.view = route.view;
    else if (sessionView && VIEW_DEFS[sessionView.view]) state.view = sessionView.view;
    state.mainFocusId = state.view === 'main'
      ? (route.focusId || (sessionView && sessionView.mainFocusId ? personId(getPerson(sessionView.mainFocusId)) : null))
      : null;
    state.mainSublineage = state.view === 'main'
      ? (route.sublineage || (!hasExplicitRoute && sessionView ? sessionView.mainSublineage || null : null))
      : null;
    const sublineage = state.mainSublineage ? MAIN_SUBLINEAGES[state.mainSublineage] : null;
    state.mainLineageRootId = state.mainSublineage
      ? personId(getPerson(route.lineageRootId || (sessionView && sessionView.mainLineageRootId) || sublineage?.rootId))
      : null;
    state.mainLineageTargetId = state.mainSublineage
      ? personId(getPerson(route.lineageTargetId || (sessionView && sessionView.mainLineageTargetId) || sublineage?.targetId))
      : null;
    if (state.mainSublineage && state.mainLineageTargetId) state.mainFocusId = state.mainLineageTargetId;
    if (sessionView && !hasExplicitRoute) {
      state.branch = text(sessionView.branch);
      state.generation = text(sessionView.generation);
      state.searchQuery = text(sessionView.searchQuery);
      state.compact = sessionView.compact !== false;
      state.overviewMode = Boolean(sessionView.overviewMode);
      state.immersive = Boolean(sessionView.immersive);
      const restoredZoom = clamp(sessionView.zoom, .005, 1.8);
      // 完整保留刷新前的缩放和平移；不再自动改成全景比例或重新居中。
      state.zoom = restoredZoom;
      state.mapPan = clone(sessionView.mapPan || { x: 0, y: 0 });
      state.branchOffsets = clone(sessionView.branchOffsets || { qian: { x: 0, y: 0 }, hou: { x: 0, y: 0 } });
      state.expanded = new Set(Array.isArray(sessionView.expanded) ? sessionView.expanded.map((id) => String(id)) : []);
      state.selectedId = sessionView.selectedId !== null && sessionView.selectedId !== undefined
        ? personId(getPerson(sessionView.selectedId))
        : null;
    }
    buildFilters();
    const search = $('#search-input');
    if (search) search.value = state.searchQuery;
    if (!sessionView || hasExplicitRoute) seedMainExpansion();
    if (state.view === 'main' && state.mainFocusId) {
      state.expanded.clear();
      setAncestorsExpanded(getPerson(state.mainFocusId));
    }
    if (state.view === 'main' && route.depth) prepareDepthExpansion(route.depth);
    if (state.view === 'main' && route.safe) prepareSafeExpansion();
    // 手机默认保持局部窗口；只有明确点击“显示全图（高级）”或通过深度路由时才加载全量视图。
    if (isMobileViewport() && !route.depth && !route.safe && !state.mainSublineage) {
      const mobileTarget = getPerson(state.selectedId) || getPerson(state.mainFocusId) || findRoot();
      prepareMobileFocusWindow(mobileTarget, 4);
      state.zoom = 1;
      state.mapPan = { x: 0, y: 0 };
    }
    wireEvents();
    renderAll();
    // 从网站主导航点击“族谱查询”时，直接打开四项查询选择；直接打开页面则保持安静。
    const chooserRequested = new URLSearchParams(window.location.search).get('chooser') === '1';
    if (!IS_ADMIN && isMobileViewport() && chooserRequested) openMobileQueryMenu();
    if (sessionView && !hasExplicitRoute) restoreSessionViewport(sessionView);
    // 只有明确要求深度/安全展开时才自动全景；已有会话视图必须保持原位置和缩放。
    if (route.depth || route.safe || (state.mainFocusId && (!sessionView || hasExplicitRoute))) setTimeout(fitOverview, 0);
    if (route.rootSearch) setTimeout(() => openRootTraceSearch(route.rootSearch), 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
