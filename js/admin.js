window.onerror = function(m, u, l, c, e) {
  var el = document.getElementById('admin-content-area');
  if (el) el.innerHTML = '<div style="padding:40px;text-align:center;"><h3 style="color:#f44336;">⚠️ 出错</h3><p style="font-size:13px;">' + m + '</p><p style="font-size:11px;color:var(--text-tertiary);">' + u + ':' + l + '</p></div>';
  console.error(m, u, l, c, e);
  return true;
};

/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   管理后台 CRUD v1
   ============================================ */

// Password is managed server-side via ADMIN_PASSWORD env var

// ===== Data store =====
const MODULES = {
  genealogy: {
    label: '族谱管理',
    icon: '📖',
    isGenealogy: true,
    fields: [
      { key: 'generation_num', label: '世代数', type: 'number', required: true, help: '始祖为1，依次递增' },
      { key: 'name', label: '姓名', type: 'text', required: true },
      { key: 'gender', label: '性别', type: 'select', options: ['男', '女'], required: true },
      { key: 'generation', label: '字号', type: 'text', placeholder: '如：字成欢' },
      { key: 'father_id', label: '父亲ID', type: 'number', placeholder: '填写父亲的编号，始祖留空' },
      { key: 'mother_id', label: '母亲ID', type: 'number', placeholder: '填写母亲的编号' },
      { key: 'spouse_ids', label: '配偶', type: 'text', placeholder: '直接输入姓名，多个用逗号分隔' },
      { key: 'adopted', label: '是否过继', type: 'select', options: ['否', '是(嗣子)', '是(继子)', '是(养子)', '出继'] },
      { key: 'bio_father_id', label: '生父ID（嗣子填写，显示原生 lineage）', type: 'number', placeholder: '嗣子的亲生父亲ID' },
      { key: 'bio_mother_id', label: '生母ID', type: 'number', placeholder: '嗣子的亲生母亲ID' },
      { key: 'branch', label: '支系', type: 'select', options: ['—', '长房', '二房', '三房', '四房'] },
      { key: 'birth_date', label: '出生', type: 'text', placeholder: '如: 1950 或 1950-03-15' },
      { key: 'death_date', label: '逝世', type: 'text', placeholder: '在世则留空' },
      { key: 'is_alive', label: '是否在世', type: 'select', options: ['是', '否'] },
      { key: 'address', label: '居住地', type: 'text' },
      { key: 'biography', label: '生平简介', type: 'textarea' },
      { key: 'photo', label: '照片', type: 'file', accept: 'image/*' }
    ],
    defaultData: [
      { id: 1, generation_num: 1, name: '谢氏始祖', gender: '男', generation: '—', father_id: null, mother_id: null, spouse_ids: '始祖夫人', adopted: '否', branch: '—', birth_date: '南宋', death_date: '', is_alive: '否', address: '下枫槎', biography: '南宋迁居下枫槎，为下枫槎谢氏始祖。' },
      { id: 2, generation_num: 1, name: '始祖夫人', gender: '女', generation: '—', father_id: null, mother_id: null, spouse_ids: '谢氏始祖', adopted: '否', branch: '—', birth_date: '南宋', death_date: '', is_alive: '否', address: '下枫槎', biography: '' },
      { id: 3, generation_num: 2, name: '二世祖', gender: '男', generation: '世', father_id: '1', mother_id: '2', spouse_ids: '二世祖夫人', adopted: '否', branch: '—', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '' },
      { id: 4, generation_num: 2, name: '二世祖夫人', gender: '女', generation: '世', father_id: null, mother_id: null, spouse_ids: '二世祖', adopted: '否', branch: '—', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '' },
      { id: 5, generation_num: 3, name: '三世祖', gender: '男', generation: '代', father_id: '3', mother_id: '4', spouse_ids: '三世祖夫人', adopted: '否', branch: '—', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '' },
      { id: 6, generation_num: 3, name: '三世祖夫人', gender: '女', generation: '代', father_id: null, mother_id: null, spouse_ids: '三世祖', adopted: '否', branch: '—', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '' },
      { id: 7, generation_num: 4, name: '长房祖', gender: '男', generation: '文', father_id: '5', mother_id: '6', spouse_ids: '', adopted: '否', branch: '长房', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '长房支系始祖' },
      { id: 8, generation_num: 4, name: '二房祖', gender: '男', generation: '文', father_id: '5', mother_id: '6', spouse_ids: '', adopted: '否', branch: '二房', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '二房支系始祖' },
      { id: 9, generation_num: 4, name: '三房祖', gender: '男', generation: '文', father_id: '5', mother_id: '6', spouse_ids: '', adopted: '否', branch: '三房', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '三房支系始祖' },
      { id: 10, generation_num: 4, name: '四房祖', gender: '男', generation: '文', father_id: '5', mother_id: '6', spouse_ids: '', adopted: '否', branch: '四房', birth_date: '', death_date: '', is_alive: '否', address: '', biography: '四房支系始祖' }
    ]
  },
  members: {
    label: '成员管理',
    icon: '👥',
    fields: [
      { key: 'name', label: '姓名', type: 'text', required: true },
      { key: 'branch', label: '支系', type: 'select', options: ['长房', '二房', '三房', '四房'], required: true },
      { key: 'generation', label: '字号', type: 'select', options: ['世', '代', '文', '明', '昌', '盛'], required: true },
      { key: 'avatar', label: '头像', type: 'select', options: ['👴', '👵', '👨', '👩', '🧑', '👧'] },
      { key: 'note', label: '备注', type: 'text' }
    ],
    defaultData: [
      { id: 1, name: '谢XX', branch: '长房', generation: '世', avatar: '👴', note: '' },
      { id: 2, name: '谢XX', branch: '长房', generation: '世', avatar: '👵', note: '' },
      { id: 3, name: '谢XX', branch: '二房', generation: '代', avatar: '👨', note: '' }
    ]
  },
  activities: {
    label: '活动管理',
    icon: '🎉',
    fields: [
      { key: 'title', label: '活动名称', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'status', label: '状态', type: 'select', options: ['已举办', '即将举行', '筹备中'], required: true },
      { key: 'icon', label: '图标', type: 'select', options: ['🌿', '🎊', '📚', '🏆', '🏛️', '📸'] },
      { key: 'content', label: '描述', type: 'textarea', required: true },
      { key: 'location', label: '地点', type: 'text' },
      { key: 'photos', label: '活动照片', type: 'photos' }
    ],
    defaultData: [
      { id: 1, title: '丙午年清明祭祖大典', date: '2026-04-04', status: '已举办', icon: '🌿', content: '百余位宗亲齐聚下枫槎谢氏宗祠，依古礼举行清明祭祖仪式。', location: '下枫槎谢氏宗祠', photos: [] },
      { id: 2, title: '丙午年新春团拜会', date: '2026-02-12', status: '已举办', icon: '🎊', content: '农历正月初一，下枫槎谢氏在宗祠举行新春团拜活动。', location: '下枫槎谢氏宗祠', photos: [] },
      { id: 3, title: '丙午年冬至祭祖', date: '2026-12-21', status: '即将举行', icon: '🏛️', content: '每年冬至为下枫槎谢氏秋祭之日。', location: '下枫槎谢氏宗祠', photos: [] }
    ]
  },
  templeCarousel: {
    label: '宗祠轮播管理',
    icon: '🖼️',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'file', label: '上传图片', type: 'file', accept: 'image/*' }
    ],
    defaultData: [
      { id: 1, title: '宗祠外景', hasFile: false },
      { id: 2, title: '宗祠戏台', hasFile: false },
      { id: 3, title: '祖堂', hasFile: false },
      { id: 4, title: '横厢', hasFile: false },
      { id: 5, title: '谢氏牌匾', hasFile: false },
      { id: 6, title: '为国立功', hasFile: false }
    ]
  },
  news: {
    label: '消息发布',
    icon: '📢',
    fields: [
      { key: 'title', label: '消息标题', type: 'text', required: true },
      { key: 'category', label: '分类', type: 'select', options: ['家族事务', '家族活动', '通知公告', '网站公告', '节日祝福'], required: true },
      { key: 'date', label: '发布日期', type: 'date', required: true },
      { key: 'author', label: '发布人', type: 'text', required: true },
      { key: 'url', label: '原文链接', type: 'text', placeholder: '选填，如有外部原文可粘贴网址' },
      { key: 'content', label: '消息内容', type: 'textarea', required: true }
    ],
    defaultData: [
      { id: 1, title: '下枫槎村谢氏宗祠修缮工程启动', category: '家族事务', date: '2026-05-15', author: '家族理事会', url: '', content: '下枫槎谢氏宗祠始建于清乾隆年间，历经两百余年风雨，部分建筑出现老化。经家族理事会研究决定，正式启动宗祠修缮工程。本次修缮将严格遵循"修旧如旧"原则，尽可能保留原有建筑构件和工艺，恢复宗祠的历史风貌。工程预计工期六个月，总投资约80万元，由家族成员共同筹资。欢迎各位宗亲积极建言献策，共同守护我们的精神家园。' },
      { id: 2, title: '2026年清明祭祖大典圆满举行', category: '家族活动', date: '2026-05-01', author: '家族理事会', url: '', content: '今年清明，下枫槎谢氏在宗祠举行了隆重的祭祖大典。百余位宗亲从各地赶来参加，其中包括多位首次参与祭祖的年轻一代。本次祭祖新增了"青年主祭"环节，由家族年轻一辈代表担任主祭人，寓意家族文化薪火相传。祭祖仪式后，全体宗亲在宗祠前合影留念，共进清明宴。现场气氛庄重而热烈，充分展现了谢氏家族的凝聚力。' },
      { id: 3, title: '《下枫槎谢氏宗谱》电子版编纂启动', category: '通知公告', date: '2026-04-20', author: '家族理事会', url: '', content: '为更好地保护和传承家族文化，家族理事会决定正式启动《下枫槎谢氏宗谱》数字化工程。本次编纂将对现有纸质老谱进行高清扫描、文字识别和校对整理，最终形成可检索的电子版族谱。电子版族谱将包含世系图、人物传记、家族大事记等内容，并通过本网站向家族成员提供查询服务。请各房派积极配合资料收集工作。' },
      { id: 4, title: '谢氏家族网站"数字宗祠"正式上线', category: '网站公告', date: '2026-03-10', author: '网站管理团队', url: '', content: '经过数月的筹备和建设，下枫槎谢氏家族网站——"数字宗祠"今日正式上线。本网站旨在通过互联网平台，系统整理和展示家族历史文化，搭建家族成员交流互动的桥梁，成为家族文化传承的数字化载体。网站目前开设了家族历史、名人事迹、消息发布、家族成员、家族活动、联系我们等板块。后续还将逐步完善族谱查询、在线祭祀、活动报名等功能。欢迎各位宗亲提出宝贵意见和建议。' },
      { id: 5, title: '丙午年新春贺词', category: '节日祝福', date: '2026-02-16', author: '家族理事会', url: '', content: '值此丙午马年新春佳节，下枫槎谢氏家族理事会向全体宗亲致以最诚挚的节日问候！愿大家在新的一年里，龙马精神，阖家安康，万事如意！过去一年，在全体宗亲的共同努力下，家族事务有序推进，宗祠维护、族谱编纂等工作取得了积极进展。新的一年，让我们继续携手同心，传承家族文化，共筑美好未来！' }
    ]
  },
  honors: {
    label: '村荣誉管理',
    icon: '🏆',
    fields: [
      { key: 'title', label: '荣誉名称', type: 'text', required: true },
      { key: 'date', label: '获得日期', type: 'date', required: true },
      { key: 'awarder', label: '颁发单位', type: 'text', required: true },
      { key: 'icon', label: '图标', type: 'select', options: ['🏆', '🥇', '🎖️', '📜', '⭐', '🏅'] },
      { key: 'url', label: '相关链接', type: 'text', placeholder: '可粘贴相关报道或资料链接（选填）' },
      { key: 'content', label: '荣誉描述', type: 'textarea', required: true }
    ],
    defaultData: [
      { id: 1, title: '浙江省美丽乡村示范村', date: '2025-12-01', awarder: '浙江省农业农村厅', icon: '🏆', url: '', content: '下枫槎村荣获浙江省美丽乡村示范村称号，这是对全村环境整治、生态保护和文明建设工作的肯定。' },
      { id: 2, title: '宁海县文明村', date: '2025-03-15', awarder: '宁海县人民政府', icon: '🥇', url: '', content: '下枫槎村被评为宁海县文明村，体现了全村精神文明建设成果。' },
      { id: 3, title: '谢氏宗祠文物保护单位', date: '2024-06-20', awarder: '宁海县文物局', icon: '🎖️', url: '', content: '下枫槎谢氏宗祠被列为县级文物保护单位，宗祠建筑具有重要历史和文化价值。' }
    ]
  },
  reports: {
    label: '新闻报道管理',
    icon: '📰',
    fields: [
      { key: 'title', label: '报道标题', type: 'text', required: true },
      { key: 'date', label: '报道日期', type: 'date', required: true },
      { key: 'source', label: '来源媒体', type: 'text', required: true },
      { key: 'url', label: '原文链接', type: 'text', placeholder: '可粘贴原文网址' },
      { key: 'content', label: '报道摘要', type: 'textarea', required: true }
    ],
    defaultData: [
      { id: 1, title: '宁海下枫槎村：古村焕新颜 数字宗祠传家风', date: '2026-04-20', source: '宁海新闻网', url: '', content: '近日，宁海县下枫槎村谢氏"数字宗祠"正式上线，这是宁海首个以家族文化为主题的数字化平台，为传统宗祠文化注入了新的活力。' },
      { id: 2, title: '一座数字宗祠背后的文化传承', date: '2026-04-25', source: '宁波日报', url: '', content: '在宁海县下枫槎村，谢氏家族通过建设数字宗祠，将传统家族文化搬到互联网上，让年轻一代能够更方便地了解家族历史。' },
      { id: 3, title: '下枫槎谢氏宗祠修缮工程获多方支持', date: '2026-05-10', source: '浙江新闻', url: '', content: '下枫槎谢氏宗祠修缮工程启动以来，得到了家族成员和社会各界的广泛关注和支持，目前已筹集修缮资金超过50万元。' },
      { id: 4, title: '艺探新乡村 | 最是茶香抚人心——宁海县跃龙街道下枫槎村', date: '2026-05-25', source: '宁波文艺', url: 'https://mp.weixin.qq.com/s?__biz=MzI1NTY0MDQ0Ng==&mid=2247592668&idx=2&sn=f746455c81ccf6518134817815fa5cca', content: '宁波市文联"艺探新乡村"专栏报道下枫槎村。文章以茶文化为线索，从望府银毫、望府楼山到村庄蝶变，描绘了下枫槎村以茶为媒、艺术赋能乡村振兴的生动故事。村内仿古凉亭、小桥流水、音乐喷泉与茶廊、茶宿交相辉映，废弃房屋改造成的"蜂巢乐园"、电线杆艺术品等展现了化腐朽为神奇的乡村艺术。"四知堂""墨香斋""明德堂""清枫舍"等文化空间，让这个曾经"藏在深闺"的村子蝶变为远近闻名的后花园。' },
      { id: 5, title: '望府山下清"枫"徐来', date: '2023-03-20', source: '浙江省纪委省监委网站', url: 'http://www.zjsjw.gov.cn/zhuantizhuanlan/qinglianwenhua/qingfengzhilv/202303/t20230307_8816170.shtml', content: '浙江省纪委监委"清风之旅"专栏报道下枫槎村。文章描绘了下枫槎村依托望府楼山风景和望府茶产区优势，打造"望府茶飨 自在曲水"IP，深挖"茶廉"文化。村内兴枫亭、茶廉枫香长廊、"廉在一起"会客厅、清枫舍等场所，将茶文化与廉洁教育有机结合。从村规民约"三字经"到"监督一点通"二维码，下枫槎以清廉村居建设赋能乡村振兴，实现了从城郊乡村到城市后花园的"美丽蝶变"。' },
      { id: 6, title: '宁波宁海：农家爱艺术 废物尽"奇"用', date: '2022-12-08', source: '央广网', url: 'https://www.163.com/dy/article/HO3MLPH00514R9NP.html', content: '央广网宁波12月8日报道，"尽奇用——废物不废"行动在宁海跃龙街道下枫槎村持续开展。村民沈玉燕利用老家具、旧衣服、树桩竹梢等将自家小院改造成公共文化空间，计划带领妇女刺绣团队打响"燕姐绣坊"品牌。村民陈掌娟的"一面结缘"面馆也成了邻里共创空间，大家用废布料勾画江南水乡图。中国人民大学"小裤脚教授"丛志强团队驻村指导，将家庭私人空间转化为公共文化服务空间，探索乡村公共文化服务助力共同富裕的有效路径。' },
      { id: 7, title: '宁海下枫槎村｜"茶文化"艺术村展露风姿', date: '2022-06-16', source: '宁海新闻网', url: 'https://www.x163.com.cn/article-2129-1.html', content: '宁海跃龙街道下枫槎村依托望府楼山优美风景和望府茶主产区优势，打造"望府茶飨、自在曲水"IP，以茶廊、茶学、茶史、茶艺、茶宿、茶美"六茶"为内容，建设仿古凉亭、音乐喷泉、小桥流水等景观。村内建成"阿拉崖谷奶茶杯""巾帼茶席"等艺术节点17个，培育青枫蜜茶、"老十堂"养生姜膏等产业项目5个，总投资超千万元。前不久举办的"望府茶飨"文化节吸引大量游客，田也甜品店开张首日卖出奶茶300多杯。' },
      { id: 8, title: '宁海跃龙：以艺术激活乡村振兴的"一池春水"', date: '2022-06-27', source: '浙江日报', url: 'http://zjrb.zjol.com.cn/html/2022-06/27/content_3566527.htm', content: '浙江日报报道宁海跃龙街道以艺术激活乡村振兴。下枫槎村引入中国人民大学丛志强团队和乡建艺术家驻村，依托望府楼山千亩茶园优势打造"望府茶飨、自在曲水"IP，建成艺术节点17个、培育产业项目5个，总投资超千万元。跃龙街道出台1号文件扶持艺术振兴乡村，规划打造休闲娱乐、绿色生态、产业活力三条精品线，推动乡村振兴从"美丽颜值"向"发展产值"转变。' },
    ]
  },
  photos: {
    label: '照片管理',
    icon: '🖼️',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'file', label: '上传图片', type: 'file', accept: 'image/*' },
      { key: 'icon', label: '备用图标', type: 'select', options: ['🏛️', '🌿', '🎊', '📚', '🏆', '📸', '🌅', '🏠'] },
      { key: 'color', label: '背景色', type: 'select', options: ['#0f0f1a', '#1a1a2e', '#2d1b1b', '#1b2d1b'] }
    ],
    defaultData: [
      { id: 1, title: '宗祠全景', icon: '🏛️', color: '#0f0f1a', hasFile: false },
      { id: 2, title: '清明祭祖', icon: '🌿', color: '#1a1a2e', hasFile: false },
      { id: 3, title: '新春团拜', icon: '🎊', color: '#0f0f1a', hasFile: false }
    ]
  },
  videos: {
    label: '视频管理',
    icon: '🎬',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'file', label: '上传视频', type: 'file', accept: 'video/mp4,video/webm' },
      { key: 'url', label: '视频外链', type: 'text', placeholder: '支持 YouTube / B站 等外链' },
      { key: 'embed', label: '嵌入代码', type: 'textarea', placeholder: '粘贴 iframe 嵌入代码（如视频号、B站分享）' },
      { key: 'poster', label: '封面图片', type: 'file', accept: 'image/*' },
      { key: 'desc', label: '简介', type: 'textarea' }
    ],
    defaultData: [
      { id: 1, title: '下枫槎谢氏家族宣传片', url: '', embed: '', poster: '', desc: '下枫槎村谢氏家族数字宗祠宣传片', hasFile: true, file_url: '/video/promo.mp4' },
      { id: 2, title: '宁海滩涂边的下枫槎艺术农场', url: '', embed: '', poster: '', desc: '宁海滩涂边的下枫槎艺术农场视频记录', hasFile: true, file_url: '/video/douyin_art_farm.mp4' },
      { id: 3, title: '下枫槎谢氏圆谱庆典', url: '', embed: '', poster: '', desc: '宁海下枫槎村谢氏圆谱庆典现场壮观景象', hasFile: true, file_url: '/uploads/videos/xie_yuanpu_01.mp4' }
    ]
  },
  xieCollection: {
    label: '谢氏集萃',
    icon: '📚',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'url', label: '链接地址', type: 'text', placeholder: 'B站/视频号/网页链接', required: true },
      { key: 'source', label: '来源', type: 'select', options: ['B站', '视频号', '公众号', '其他'] },
      { key: 'cat', label: '分类', type: 'select', options: ['家族起源', '历史名人', '宗谱文化'], required: true },
      { key: 'embed', label: '嵌入代码', type: 'textarea', placeholder: '粘贴 iframe 嵌入代码（可选）' },
      { key: 'poster', label: '封面图链接', type: 'text', placeholder: '粘贴封面图片网址（B站视频封面等）' },
      { key: 'desc', label: '简介', type: 'textarea' }
    ],
    defaultData: [
      { id: 1, title: '示例：谢氏起源介绍', url: 'https://www.bilibili.com/video/example', source: 'B站', cat: '家族起源', embed: '', poster: '', desc: '点击"编辑"替换为真实链接' }
    ]
  },
  music: {
    label: '背景音乐',
    icon: '🎵',
    fields: [
      { key: 'title', label: '歌曲名称', type: 'text', required: true },
      { key: 'file', label: '上传音乐', type: 'file', accept: 'audio/mpeg,audio/ogg,audio/wav' },
      { key: 'artist', label: '艺术家', type: 'text', placeholder: '可选' }
    ],
    defaultData: []
  },
  messages: {
    label: '留言管理',
    icon: '💬',
    fields: [
      { key: 'name', label: '姓名', type: 'text', required: true },
      { key: 'contact', label: '联系方式', type: 'text' },
      { key: 'subject', label: '主题', type: 'text', required: true },
      { key: 'message', label: '留言内容', type: 'textarea', required: true },
      { key: 'date', label: '时间', type: 'text' }
    ],
    defaultData: [],
    readOnly: true
  },
  merit: {
    label: '功德管理',
    icon: '🏛️',
    fields: [
      { key: 'name', label: '姓名', type: 'text', required: true },
      { key: 'generation', label: '世代', type: 'number', required: true },
      { key: 'branch', label: '房支', type: 'text', placeholder: '如：后枫槎东房' },
      { key: 'category', label: '类别', type: 'select', options: ['修谱功德', '建祠功德', '双项功德'], required: true },
      { key: 'amount', label: '捐资金额', type: 'text', placeholder: '如：捐资XX金' },
      { key: 'date', label: '时间', type: 'text', placeholder: '年份或具体时间' },
      { key: 'highlight', label: '大功德', type: 'select', options: ['否', '是'] },
      { key: 'biography', label: '生平简介', type: 'textarea' },
      { key: 'tribute', label: '后人感言', type: 'textarea', placeholder: '对该位先贤的致敬之词' }
    ],
    defaultData: []
  },
  settings: {
    label: '系统设置',
    icon: '⚙️',
    isSettings: true,
    defaultData: []
  }
};

// ===== Helpers =====
function getData(module) {
  var key = 'xie_admin_' + module;
  var raw = localStorage.getItem(key);

  // For genealogy: use localStorage only (synced from API on page load)
  if (module === 'genealogy') {
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.length > 0) return parsed;
      } catch(e) {}
    }
    var def = [];
    localStorage.setItem(key, JSON.stringify(def));
    return def;
  }

  if (raw) {
    try { return JSON.parse(raw); } catch(e) { return []; }
  }
  var def = (MODULES[module] && MODULES[module].defaultData) || [];
  localStorage.setItem(key, JSON.stringify(def));
  return def;
}

function saveData(module, data) {
  localStorage.setItem('xie_admin_' + module, JSON.stringify(data));
  // Sync merit data to public-facing key
  if (module === 'merit') {
    localStorage.setItem('xie_merit_data', JSON.stringify(data));
  }
  // Sync to server with retry
  syncToServer(module, data);
}

// ===== 数据安全三保险 =====

// 保险1: 保存到服务器API（自动重试3次）
function syncToServer(module, data, attempt) {
  if (attempt === undefined) attempt = 1;
  if (!data || !data.length) return;

  // Show sync status
  showSyncStatus(module, '同步中…');

  // ⚠️ 服务端 POST 为整文件覆盖语义（server.js: fs.writeFile 直接覆盖整个文件），
  // 因此必须一次性发送全部数据。若分批发送，文件会被最后一批覆盖，造成数据丢失。
  fetch('/api/data/' + module, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(function(r) { return r.json(); }).then(function() {
    showSyncStatus(module, '✅ 已同步');
    // 同步成功后清除未同步标记
    localStorage.removeItem('xie_unsynced_' + module);
  }).catch(function(e) {
    if (attempt < 3) {
      setTimeout(function() { syncToServer(module, data, attempt + 1); }, 2000);
    } else {
      showSyncStatus(module, '⚠️ 同步失败，数据在本地安全');
      // Save a localStorage backup marker
      localStorage.setItem('xie_unsynced_' + module, 'true');
    }
  });
}

// 显示同步状态
function showSyncStatus(module, msg) {
  var el = document.getElementById('sync-status-' + module);
  if (el) el.textContent = msg;
}

// 保险2: 手动备份按钮渲染（每个模块顶部）
function renderBackupButton(module) {
  var hasUnsynced = localStorage.getItem('xie_unsynced_' + module) === 'true';
  var warning = hasUnsynced ? '<span style="color:#f44336;font-weight:600;"> ⚠️ 有未同步的数据</span>' : '';
  return '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;padding:10px 14px;background:rgba(33,150,243,0.06);border-radius:8px;border:1px solid rgba(33,150,243,0.12);">'
    + '<span style="font-size:12px;color:rgba(255,255,255,0.5);">💾 数据保护</span>'
    + '<button class="btn btn-xs" onclick="backupModuleData(\'' + module + '\')" style="padding:4px 12px;">📥 手动备份</button>'
    + '<button class="btn btn-xs" onclick="downloadModuleData(\'' + module + '\')" style="padding:4px 12px;">⬇️ 导出JSON</button>'
    + '<span id="sync-status-' + module + '" style="font-size:11px;color:rgba(255,255,255,0.3);"></span>'
    + warning
    + '</div>';
}

// 保险3: 手动备份到服务器
function backupModuleData(module) {
  var data = getData(module);
  if (!data || !data.length) { showToast('暂无数据'); return; }
  showSyncStatus(module, '正在备份 ' + data.length + ' 条…');
  syncToServer(module, data);
}

// 保险4: 导出JSON文件到本地
function downloadModuleData(module) {
  var data = getData(module);
  if (!data || !data.length) { showToast('暂无数据'); return; }
  var blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = module + '_backup_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  showToast('✅ 已导出 ' + data.length + ' 条');
}

// 保险5: 启动时检查未同步数据
function checkUnsyncedData() {
  var modules = ['genealogy', 'members', 'news', 'activities', 'honors', 'reports'];
  modules.forEach(function(mod) {
    if (localStorage.getItem('xie_unsynced_' + mod) === 'true') {
      var data = getData(mod);
      if (data && data.length > 0) {
        syncToServer(mod, data);
      }
    }
  });
}
setTimeout(checkUnsyncedData, 3000);


function getNextId(data) {
  var max = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id > max) max = data[i].id;
  }
  return max + 1;
}

function formatDate(d) {
  if (!d) return '';
  return d;
}

// ===== Version History =====
function getVersionHistory() {
  var settings = getData('settings');
  for (var i = 0; i < settings.length; i++) {
    if (settings[i].key === 'versions') return settings[i].value || [];
  }
  return [];
}

function saveVersionHistory(versions) {
  var settings = getData('settings');
  for (var i = 0; i < settings.length; i++) {
    if (settings[i].key === 'versions') {
      settings[i].value = versions;
      saveData('settings', settings);
      return;
    }
  }
  settings.push({ key: 'versions', value: versions });
  saveData('settings', settings);
}

function recordVersion() {
  var input = document.getElementById('version-desc-input');
  if (!input || !input.value.trim()) { showToast('请填写更新说明'); return; }
  var versions = getVersionHistory();
  var now = new Date();
  var dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  var verNum = 'v' + (versions.length + 1);
  versions.unshift({ v: verNum, date: dateStr, desc: input.value.trim() });
  saveVersionHistory(versions);
  input.value = '';
  showToast('版本 ' + verNum + ' 已记录');
  renderSettings();
}

function deleteVersion(index) {
  var versions = getVersionHistory();
  if (index < 0 || index >= versions.length) return;
  if (!confirm('确定删除此版本记录？')) return;
  versions.splice(index, 1);
  saveVersionHistory(versions);
  renderSettings();
}

function autoRecordVersion(desc) {
  var versions = getVersionHistory();
  var now = new Date();
  var dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  var verNum = 'v' + (versions.length + 1);
  versions.unshift({ v: verNum, date: dateStr, desc: desc });
  saveVersionHistory(versions);
}

// ===== Render =====
function renderModule(mod) {
  if (mod === 'visitors') {
    var area = document.getElementById('admin-content-area');
    if (!area) return;
    area.innerHTML = '<div style="padding:20px;"><h3 style="margin-bottom:16px;">📋 访客信息</h3><div id="visitor-list"><p style="color:var(--text-tertiary);">加载中...</p></div></div>';
    var token = localStorage.getItem('admin_token') || '';
    fetch('/api/visitors', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(function(r){ return r.json(); })
      .then(function(data){
        if (!data || !data.length) {
          document.getElementById('visitor-list').innerHTML = '<p style="color:var(--text-tertiary);">暂无访客记录</p>';
          return;
        }
        var html = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">';
        html += '<thead><tr style="border-bottom:2px solid var(--divider);">';
        html += '<th style="padding:6px 10px;text-align:left;">类型</th>';
        html += '<th style="padding:6px 10px;text-align:left;">时间</th>';
        html += '<th style="padding:6px 10px;text-align:left;">姓名</th>';
        html += '<th style="padding:6px 10px;text-align:left;">联系方式</th>';
        html += '<th style="padding:6px 10px;text-align:left;">父亲</th>';
        html += '<th style="padding:6px 10px;text-align:left;">祖父</th>';
        html += '<th style="padding:6px 10px;text-align:left;">目的/备注</th>';
        html += '</tr></thead><tbody>';
        data.reverse().forEach(function(v){
          var typeLabel = v.type === 'clan' ? '<span style="color:#e8c97a;">✅ 族人</span>' : '<span style="color:var(--text-tertiary);">👤 访客</span>';
          html += '<tr style="border-bottom:1px solid var(--divider);">';
          html += '<td style="padding:6px 10px;">' + typeLabel + '</td>';
          html += '<td style="padding:6px 10px;font-size:12px;color:var(--text-secondary);">' + (v.time || '') + '</td>';
          html += '<td style="padding:6px 10px;font-weight:500;">' + (v.name || '') + '</td>';
          html += '<td style="padding:6px 10px;color:var(--text-secondary);">' + (v.contact || '') + '</td>';
          html += '<td style="padding:6px 10px;color:var(--text-secondary);">' + (v.father || '') + '</td>';
          html += '<td style="padding:6px 10px;color:var(--text-secondary);">' + (v.grandpa || '') + '</td>';
          html += '<td style="padding:6px 10px;color:var(--text-secondary);font-size:12px;">' + (v.purpose || '') + '</td>';
          html += '</tr>';
        });
        html += '</tbody></table></div>';
        document.getElementById('visitor-list').innerHTML = html;
      })
      .catch(function(){
        document.getElementById('visitor-list').innerHTML = '<p style="color:#ef4444;">加载失败</p>';
      });
    return;
  }
  if (mod === 'ruzhuimarry') {
    var area = document.getElementById('admin-content-area');
    if (!area) return;
    renderRuzhuiMarriage(area);
    return;
  }
  if (mod === 'genealogyOverview') {
    var area = document.getElementById('admin-content-area');
    if (!area) return;
    renderGenealogyOverview(area);
    // 树 pan/zoom 初始化（与族谱管理共用同一套逻辑）
    var savedZoom = treeZoom, savedX = treePanX, savedY = treePanY;
    setTimeout(function() {
      initTreePanZoom();
      treeZoom = savedZoom;
      treePanX = savedX;
      treePanY = savedY;
      applyTreeTransform();
      updateZoomLevel();
    }, 100);
    return;
  }
  var m = MODULES[mod];
  if (!m) return;
  var area = document.getElementById('admin-content-area');
  if (!area) return;

  if (m.isSettings) {
    renderSettings(area);
    return;
  }

  if (m.isGenealogy) {
    var savedZoom = treeZoom, savedX = treePanX, savedY = treePanY;
    renderGenealogy(area);
    setTimeout(function() {
      initTreePanZoom();
      initShenboTreePanZoom();
      initTreeViewportPanZoom('dongshan-tree-viewport', 'ds-zoom-level', {z:_dsZoom,px:_dsPanX,py:_dsPanY,drag:false,dx:0,dy:0,sx:0,sy:0});
      initTreeViewportPanZoom('linhai-tree-viewport', 'lh-zoom-level', {z:_lhZoom,px:_lhPanX,py:_lhPanY,drag:false,dx:0,dy:0,sx:0,sy:0});
      initTreeViewportPanZoom('hfc-tree-viewport', 'hfc-zoom-level', {z:1,px:0,py:0,drag:false,dx:0,dy:0,sx:0,sy:0});
	      initTreeViewportPanZoom('shima-tree-viewport', 'sm-zoom-level', {z:_smZoom,px:_smPanX,py:_smPanY,drag:false,dx:0,dy:0,sx:0,sy:0});
      treeZoom = savedZoom;
      treePanX = savedX;
      treePanY = savedY;
      applyTreeTransform();
      updateZoomLevel();
    }, 100);
    return;
  }

  var data = getData(mod);

  // Sort by date ascending for modules with date field
  var hasDate = m.fields.some(function(f) { return f.key === 'date'; });
  if (hasDate) {
    data.sort(function(a, b) { return (a.date || '').localeCompare(b.date || ''); });
  }
  var html = '<div class="admin-module">';

  // Header
  html += '<div class="admin-module-header">';
  html += '<h3>' + m.icon + ' ' + m.label + '</h3>';
  if (!m.readOnly) {
    html += '<button class="btn btn-accent btn-sm" onclick="showAddForm(\'' + mod + '\')">+ 新增</button>';
  }
  html += '</div>';

  // Table
  if (data.length === 0) {
    html += '<div class="empty-state"><p style="text-align:center;padding:40px;color:var(--text-tertiary);">暂无数据</p></div>';
  } else {
    html += '<div class="admin-table-wrap"><table class="admin-table">';
    html += '<thead><tr>';
    m.fields.forEach(function(f) {
      if (f.key !== 'content' && f.key !== 'message') {
        html += '<th>' + f.label + '</th>';
      }
    });
    if (!m.readOnly) html += '<th style="width:120px;">操作</th>';
    html += '</tr></thead><tbody>';

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      html += '<tr>';
      m.fields.forEach(function(f) {
        if (f.key === 'content' || f.key === 'message' || f.key === 'file' || f.key === 'poster') return;
        var val = item[f.key] || '—';
        if (f.key === 'icon' || f.key === 'avatar') {
          html += '<td style="font-size:20px;">' + val + '</td>';
        } else if (f.key === 'title' && (mod === 'photos' || mod === 'templeCarousel' || mod === 'videos')) {
          // Show thumbnail for photos, carousel, and videos
          var thumbSrc = (item.poster && (item.poster.indexOf('/') >= 0 || item.poster.indexOf('http') === 0)) ? item.poster : (item.file_url || '');
          html += '<td><div style="display:flex;align-items:center;gap:8px;">';
          if (thumbSrc) {
            html += '<img src="' + thumbSrc + '" alt="" style="width:64px;height:36px;border-radius:4px;object-fit:cover;flex-shrink:0;background:var(--bg-card);">';
          } else {
            html += '<span style="width:64px;height:36px;border-radius:4px;overflow:hidden;background:var(--bg-card);display:inline-flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">🎬</span>';
          }
          html += escapeHtml(val) + '</div></td>';
        } else {
          html += '<td>' + escapeHtml(val) + '</td>';
        }
      });
      if (!m.readOnly) {
        html += '<td>';
        html += '<button class="btn-sm" onclick="showEditForm(\'' + mod + '\',' + item.id + ')">✏️</button> ';
        html += '<button class="btn-sm btn-danger" onclick="deleteItem(\'' + mod + '\',' + item.id + ')">🗑️</button>';
        html += '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table></div>';
  }

  html += '</div>';
  area.innerHTML = html;
}

function escapeHtml(text) {
  if (!text) return '—';
  var d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

// ===== Genealogy =====
function getPersonName(id, data) {
  if (!id && id !== 0) return null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) return data[i].name;
  }
  return null;
}

// Mini tree for ancient/shenbo lineages
function buildMiniTreeHtml(allData, nameList, cardBg, displayGenMap) {
  var html = '<div style="margin-top:8px;padding:8px;overflow-x:auto;white-space:nowrap;">';
  html += '<div style="display:inline-flex;align-items:center;gap:4px;padding:4px 0;">';
  // Build name->generation lookup
  var nameToGen = {};
  for (var bti = 0; bti < allData.length; bti++) {
    nameToGen[allData[bti].name] = allData[bti].generation_num;
  }
  function getDisp(n) {
    if (displayGenMap && displayGenMap[n] !== undefined) return displayGenMap[n];
    return nameToGen[n];
  }
  for (var bti = 0; bti < nameList.length; bti++) {
    var nm = nameList[bti];
    if (bti > 0) {
      var prevGen = getDisp(nameList[bti-1]);
      var curGen = getDisp(nm);
      if (prevGen !== undefined && curGen !== undefined && Math.abs(curGen - prevGen) > 2) {
        html += '<div style="display:flex;flex-direction:column;align-items:center;margin:0 2px;">';
        html += '<div style="width:1px;height:16px;background:var(--text-muted);opacity:0.15;"></div>';
        html += '<span style="font-size:8px;color:var(--text-muted);opacity:0.2;">⋯</span>';
        html += '<div style="width:1px;height:16px;background:var(--text-muted);opacity:0.15;"></div>';
        html += '</div>';
      } else {
        html += '<div style="display:flex;flex-direction:column;align-items:center;margin:0 2px;">';
        html += '<div style="width:1px;height:20px;background:var(--text-muted);opacity:0.15;"></div>';
        html += '<span style="font-size:7px;color:var(--text-muted);opacity:0.15;">│</span>';
        html += '</div>';
      }
    }
    var isShenbo = nm === '申伯';
    var isDongshan = nm === '缵' || nm === '衡';
    html += '<div style="display:inline-flex;flex-direction:column;align-items:center;margin:0 2px;min-width:40px;">';
    html += '<div style="padding:4px 10px;border-radius:8px;font-size:11px;font-weight:' + (isShenbo||isDongshan?'600':'400') + ';background:' + (cardBg || 'rgba(255,255,255,0.05)') + ';border:1px solid ' + (isShenbo?'rgba(201,168,76,0.3)':isDongshan?'rgba(100,60,160,0.25)':'rgba(255,255,255,0.08)') + ';color:var(--text-primary);cursor:default;text-align:center;">' + nm + '</div>';
    var dispGen = getDisp(nm);
    if (dispGen !== undefined) {
      html += '<span style="font-size:9px;color:var(--text-muted);opacity:0.4;margin-top:2px;">' + dispGen + '世</span>';
    }
    html += '</div>';
  }
  html += '</div></div>';
  return html;
}

// Mini genealogy tree: generations grouped, siblings side by side
function renderMiniGenealogyTree(allData, nameList, accentColor) {
  // 硬编码世系名 → 真实 id 映射（人物改名后仍能在小树图显示/点击，并显示最新姓名）
  var idForName = {}, idToPos = {}, nameIdSet = {};
  for (var miN = 0; miN < nameList.length; miN++) {
    var _mid = adminLineageIdFor(nameList[miN], null);
    if (_mid) { idForName[nameList[miN]] = _mid; idToPos[_mid] = miN + 1; nameIdSet[_mid] = true; }
  }
  // Filter：nameList 中的人（或映射到的真实人物）＋其直系子女（「佐+」等新增后代立即在小树图可见）
  var data = allData.filter(function(p) {
    if (nameList.indexOf(p.name) >= 0) return true;
    if (idToPos[p.id]) return true;
    if (p.father_id !== null && p.father_id !== '' && nameIdSet[parseInt(p.father_id)]) return true;
    return false;
  });
  if (!data || data.length === 0) return '';

  // Build name->person map
  var nameMap = {};
  for (var mi = 0; mi < data.length; mi++) nameMap[data[mi].name] = data[mi];

  // Group by generation
  var genGroups = {};
  for (var mi2 = 0; mi2 < data.length; mi2++) {
    var g = data[mi2].generation_num;
    if (!genGroups[g]) genGroups[g] = [];
    genGroups[g].push(data[mi2]);
  }
  var sortedGens = Object.keys(genGroups).sort(function(a,b){return a-b});

  var html = '<div style="text-align:center;overflow-x:auto;white-space:nowrap;">';
  var maxWidthPerGen = 0;

  for (var gi = 0; gi < sortedGens.length; gi++) {
    var gen = sortedGens[gi];
    var persons = genGroups[gen];
    var genLabel = '';

    // Calculate generation display number from nameList position
    for (var ni = 0; ni < nameList.length; ni++) {
      for (var pi = 0; pi < persons.length; pi++) {
        if (persons[pi].name === nameList[ni]) {
          genLabel = nameList.indexOf(persons[pi].name) + 1;
          if (persons[pi].name === '申伯') genLabel = '65世/1世';
          break;
        }
      }
    }

    // Draw vertical connector line from previous generation
    if (gi > 0) {
      html += '<div style="display:flex;justify-content:center;gap:0;">';
      var prevCount = genGroups[sortedGens[gi-1]].length;
      var curCount = persons.length;
      var cellW = Math.max(80, 320 / Math.max(curCount, prevCount));
      var totalPrev = prevCount * cellW;
      var totalCur = curCount * cellW;
      var offset = Math.max(0, (totalPrev - totalCur) / 2);

      // Draw connecting lines
      for (var ci = 0; ci < curCount; ci++) {
        html += '<div style="width:' + cellW + 'px;display:flex;flex-direction:column;align-items:center;">';
        if (prevCount === 1 && curCount > 1) {
          // One parent, multiple children: draw T-shape
          var childIdx = ci;
          html += '<svg width="' + cellW + '" height="24" style="display:block;">';
          // Vertical line from parent
          html += '<line x1="' + (cellW/2) + '" y1="0" x2="' + (cellW/2) + '" y2="12" stroke="' + accentColor + '" stroke-width="1.5" opacity="0.3"/>';
          // Horizontal bar
          html += '<line x1="0" y1="12" x2="' + cellW + '" y2="12" stroke="' + accentColor + '" stroke-width="1.5" opacity="0.3"/>';
          // Vertical line to this child
          html += '<line x1="' + (cellW/2) + '" y1="12" x2="' + (cellW/2) + '" y2="24" stroke="' + accentColor + '" stroke-width="1.5" opacity="0.3"/>';
          html += '</svg>';
        } else {
          html += '<svg width="' + cellW + '" height="16" style="display:block;">';
          html += '<line x1="' + (cellW/2) + '" y1="0" x2="' + (cellW/2) + '" y2="16" stroke="' + accentColor + '" stroke-width="1.5" opacity="0.3"/>';
          html += '</svg>';
        }
        html += '</div>';
      }
      html += '</div>';
    }

    // Render people boxes
    html += '<div style="display:flex;justify-content:center;gap:6px;padding:2px 0;">';
    for (var pi2 = 0; pi2 < persons.length; pi2++) {
      var p = persons[pi2];
      var isHighlight = (p.highlight || p.name === '申伯' || p.name === '缵' || p.name === '安');
      var label = '';
      var li = nameList.indexOf(p.name);
      if (li < 0 && idToPos[p.id]) li = idToPos[p.id] - 1;
      if (li >= 0) label = li + 1;
      if (p.name === '申伯' || idForName['申伯'] === p.id) label = '65';

      html += '<div style="display:inline-flex;flex-direction:column;align-items:center;min-width:70px;">';
      html += '<div class="apt-mini-hover" style="position:relative;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:' + (isHighlight ? '600' : '400') + ';background:' + accentColor + '15;border:1px solid ' + accentColor + '30;color:var(--text-primary);cursor:pointer;" title="点击编辑" onclick="showEditForm(\'genealogy\',' + p.id + ')">' + p.name +
        '<span style="position:absolute;top:1px;right:1px;display:inline-flex;gap:1px;">' +
        '<button class="apt-mini-btn apt-mini-add" title="添加下一代" onclick="event.stopPropagation();showAddChildForm(' + p.id + ')">+</button>' +
        '<button class="apt-mini-btn apt-mini-del" title="删除此人" onclick="event.stopPropagation();if(confirm(\'确定删除 ' + escapeHtml(p.name) + ' 吗？\'))deleteItem(\'genealogy\',' + p.id + ')">−</button>' +
        '</span></div>';
      if (label) {
        html += '<span style="font-size:9px;color:var(--text-muted);margin-top:2px;opacity:0.5;">' + label + '世</span>';
      }
      html += '</div>';
    }
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function buildAdminTreeHtml(data, opts) {
  if (!data || data.length === 0) return '<div style="padding:20px;text-align:center;color:var(--text-tertiary);font-size:13px;">暂无数据</div>';
  opts = opts || {};

  // —— 性能优化：一次性建立 id→person 与 id→children 索引。
  // 原实现 childrenOf/getPersonName/countDescendants 每次递归都 O(n) 全量遍历，
  // 整树递归构建 → O(n²)，1250 人时耗时十几秒（点击导航切换明显卡顿）。
  // 索引化后查子女/查名/统计后代均 O(1)/记忆化，构建降为 O(n)。
  var personById = {};
  var childrenIdx = {};
  for (var _ix = 0; _ix < data.length; _ix++) {
    personById[data[_ix].id] = data[_ix];
    childrenIdx[data[_ix].id] = [];
  }
  for (_ix = 0; _ix < data.length; _ix++) {
    var _p = data[_ix];
    var _f = parseInt(_p.father_id);
    var _m = parseInt(_p.mother_id);
    if (personById[_f] && _f !== _p.id) childrenIdx[_f].push(_p); // 跳过自引用 father_id
    if (personById[_m] && _m !== _p.id && _m !== _f) childrenIdx[_m].push(_p);
  }

  // 远古世系（炎帝→申伯/申甫）：沿 申伯/申甫 父链收集全部祖先，用于墨绿卡片 + 方框标注
  var ancIds = {};
  if (opts.ancBox) {
    function ancCollect(id) {
      if (id == null || ancIds[id]) return;
      ancIds[id] = true;
      var p = personById[id];
      if (p && p.father_id) ancCollect(parseInt(p.father_id));
    }
    ancCollect(6); // 申伯
    ancCollect(7); // 申甫
  }

  // 申伯世系（申伯/申甫→衡）：收集 申伯/申甫 全部后代，再剔除 衡(1130) 的后代（保留衡本身），
  // 用于咖啡色卡片 + 「申伯世系示意图」方框
  var shenboIds = {};
  // 始宁东山（缵/衡→闓）：缵(1126) + 衡(1130) 的后代，再剔除 闓(1183) 的后代（保留闓），
  // 用于淡蓝色卡片 + 「始宁东山世系示意图」方框
  var dongshanIds = {};
  // 临海下渡（闓→大四/小四）：闓(1183) 的后代，再剔除 小四(1206) 的后代（保留小四本身），
  // 用于橙色卡片 + 「临海下渡世系示意图」方框
  var linhaiIds = {};
  // 撰(12) 支：撰及全部后代，用于淡绿色卡片（世代总览主区域分支）
  var zhuanIds = {};
  // 攒(13) 支：攒及全部后代，用于淡蜜桃/杏色卡片（与撰淡绿同属浅彩系、冷暖互补）
  var zanIds = {};
  if (opts.ancBox) {
    function subTreeCollect(id, set, seen) {
      if (seen[id]) return;
      seen[id] = true;
      set[id] = true;
      var kids = childrenIdx[id] || [];
      for (var ki = 0; ki < kids.length; ki++) subTreeCollect(kids[ki].id, set, seen);
    }
    var sbSeen = {};
    subTreeCollect(6, shenboIds, sbSeen);
    subTreeCollect(7, shenboIds, sbSeen);
    var hengSub = {}, hengSeen = {};
    subTreeCollect(1130, hengSub, hengSeen);
    Object.keys(hengSub).forEach(function(hi) { if (parseInt(hi) !== 1130) delete shenboIds[hi]; });
    // 始宁东山世系节点集
    var dsSub = {}, dsSeen = {};
    subTreeCollect(1130, dsSub, dsSeen);
    var kaiSub = {}, kaiSeen = {};
    subTreeCollect(1183, kaiSub, kaiSeen);
    Object.keys(kaiSub).forEach(function(ki) { if (parseInt(ki) !== 1183) delete dsSub[ki]; }); // 剔除闓后代，保留闓(1183)
    Object.keys(dsSub).forEach(function(di) { dongshanIds[di] = true; });
    dongshanIds[1126] = true; // 缵
    // 临海下渡世系节点集：闓(1183) 的后代（含闓），再剔除 小四(1206) 的后代（保留小四）
    var lhSub = {}, lhSeen = {};
    subTreeCollect(1183, lhSub, lhSeen);
    var xsSub = {}, xsSeen = {};
    subTreeCollect(1206, xsSub, xsSeen);
    Object.keys(xsSub).forEach(function(xi) { if (parseInt(xi) !== 1206) delete lhSub[xi]; }); // 剔除小四后代，保留小四(1206)
    Object.keys(lhSub).forEach(function(li) { linhaiIds[li] = true; });
    // 撰(12)/攒(13) 支：两大主区域分支整支浅彩卡片（撰淡绿/攒蜜桃，浅底深字）
    var zhuanSeen = {};
    subTreeCollect(12, zhuanIds, zhuanSeen);
    var zanSeen = {};
    subTreeCollect(13, zanIds, zanSeen);
  }

  var existingIds = {};
  data.forEach(function(p) { existingIds[p.id] = true; });

  // 工具：获取某人的直接子女（索引 O(1) 查询）
  function childrenOf(person) {
    return childrenIdx[person.id] || [];
  }

  // 工具：递归统计后代总数（带访问保护，防止自引用/环形引用导致死循环；记忆化避免重复子树遍历）
  var descMemo = {};
  function countDescendants(person, visited) {
    if (descMemo[person.id] != null) return descMemo[person.id];
    if (!visited) visited = {};
    if (visited[person.id]) return 0;
    visited[person.id] = true;
    var count = 0;
    var direct = childrenIdx[person.id] || [];
    for (var i = 0; i < direct.length; i++) {
      count += 1 + countDescendants(direct[i], visited);
    }
    descMemo[person.id] = count;
    return count;
  }

  // Find spouse mappings (name -> person who lists them as spouse)
  var spouseOf = {};
  data.forEach(function(p) {
    if (p.spouse_ids) {
      var names = p.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
      names.forEach(function(nm) {
        data.forEach(function(other) {
          if (other.name === nm && other.id !== p.id) spouseOf[other.id] = p.id;
        });
      });
    }
  });

  var roots = data.filter(function(p) {
    // 防御：自引用 father_id（指向自己）视为无父亲，作为根节点显示
    var fid = parseInt(p.father_id);
    return !p.father_id || fid === p.id || !existingIds[fid];
  });
  roots = roots.filter(function(p) {
    return !spouseOf[p.id] || spouseOf[p.id] > p.id;
  });
  if (roots.length === 0 && data.length > 0) roots = [data[0]];

  // 渲染单张卡片（不含子女块，供卡片行使用）
  function renderAptCard(person) {
    var isRuzhui = person.name.indexOf('入赘') >= 0 || person.name.indexOf('女婿') >= 0;
    var ruzhuiPartner = false;
    if (person.spouse_ids) {
      var spN = person.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
      for (var si = 0; si < spN.length; si++) { if (spN[si].indexOf('入赘') >= 0 || spN[si].indexOf('女婿') >= 0) { ruzhuiPartner = true; break; } }
    }
    // 可折叠大支（攒/撰/彬/乾）＝有后代 且 ∈(collapsedIds ∪ collapsibleIds)。collapsedIds 只决定【默认折叠态】；
    // collapsibleIds 保证攒(13)即使默认展开，也仍是可折叠大支（点卡收起/展开，且手风琴互斥时能被收起）
    var isCollapsible = childrenOf(person).length > 0 && !!opts.collapsedIds && (opts.collapsedIds[person.id] || (opts.collapsibleIds && opts.collapsibleIds[person.id]));
    var cClass = 'apt-card ' + (person.gender === '男' ? 'apt-male' : 'apt-female');
    if (opts.ancBox && ancIds[person.id]) cClass += ' apt-card-anc'; // 远古世系墨绿
    if (opts.ancBox && shenboIds[person.id]) cClass += ' apt-card-shenbo'; // 申伯世系咖啡
    if (opts.ancBox && dongshanIds[person.id]) cClass += ' apt-card-dongshan'; // 始宁东山淡蓝
    if (opts.ancBox && linhaiIds[person.id]) cClass += ' apt-card-linhai'; // 临海下渡橙色
    if (opts.ancBox && zhuanIds[person.id]) cClass += ' apt-card-zhuan'; // 撰支淡绿
    if (opts.ancBox && zanIds[person.id]) cClass += ' apt-card-zan'; // 攒支淡蜜桃
    if (isRuzhui) cClass += ' apt-ruzhui';
    if (ruzhuiPartner) cClass += ' apt-ruzhui-partner';
    if (isCollapsible) cClass += ' apt-collapsible'; // 大支可点击卡片收起/展开（攒/撰/彬/乾）
    var clickAction = isCollapsible ? 'toggleTreeNodeByPid(this)' : 'adminEditOrNotice(\'genealogy\',' + person.id + ')';
    var cardTitle = isCollapsible ? '点击展开/收起此支全部族人 | 拖拽到其他人建立关系' : '点击编辑 | 拖拽到其他人建立关系';
    var html = '<div class="' + cClass + '" data-pid="' + person.id + '" draggable="true" onmouseup="if(!this.dataset.dragged){' + clickAction + '};this.dataset.dragged=\'\'" title="' + cardTitle + '" ondragstart="onCardDragStart(event, ' + person.id + ');this.dataset.dragged=\'1\'" ondrop="onCardDrop(event)" ondragover="event.preventDefault()" ondragenter="this.style.outline=\'2px solid var(--accent-orange)\'" ondragleave="this.style.outline=\'\'">';
    html += '<div class="apt-card-inner">';
    html += '<div class="apt-card-actions" onclick="event.stopPropagation();">';
    html += '<button class="apt-btn-add" onclick="adminAddChildFor(' + person.id + ',\'' + person.name + '\',\'' + (person.branch || '') + '\')" title="添加子女">+</button>';
      if (childrenOf(person).length > 0) {
        // ▶=收起（默认折叠大支）/▼=展开；初始状态与实际一致
        var _btnText = (opts.collapsedIds && opts.collapsedIds[person.id]) ? '▶' : '▼';
        html += '<button class="apt-btn-expand" onmouseup="event.stopPropagation()" onclick="toggleTreeNode(this)" title="展开/折叠">' + _btnText + '</button>';
      }
    html += '<button class="apt-btn-del" onclick="adminDeleteFor(' + person.id + ',\'' + person.name + '\',\'' + (person.branch || '') + '\')" title="删除此人">−</button>';
    html += '</div>';
    html += '<div class="apt-name">';
    if (person.adopted && person.adopted !== '否') {
      if (person.adopted === '出继') html += '<span class="apt-adopted-badge" style="background:#22c55e;" title="出继">出</span>';
      else html += '<span class="apt-adopted-badge" title="' + escapeHtml(person.adopted) + '">嗣</span>';
    }
    // 无后代标记（世代总览丹二：数据中确无后代记录，保留「无后」卡片不展开）
    if (opts.noDescIds && opts.noDescIds[person.id]) html += '<span class="apt-nodesc-badge" title="无后代记录">无后</span>';
    // 后裔收进右下角框的标记（世代总览丹三：本人保留在主区域，后裔在角落框查看）
    if (opts.cornerIds && opts.cornerIds[person.id]) html += '<span class="apt-corner-badge" title="后裔已收进右下角框，点击可缩放查看">后裔→右下角</span>';
    html += escapeHtml(person.name) + '</div>';
    if (!opts.hideGen) {
      var genText = (person.generation_num || '?') + '世';
      var genSuffix = '';
      // 申伯世系（申伯/申甫→衡）：显示双世次「炎帝65世/申伯1世」，申伯=炎帝65世，弘/猛=炎帝66世/申伯2世，衡=炎帝100世/申伯36世。
      // 始宁东山（缵/衡→闓）卡显示「炎帝N世」。
      // generation 字段为数据贯通前残留脏数据（申伯=65/弘=-1/猛=0…），对世系链卡片不显示
      if (opts.ancBox && shenboIds[person.id] && person.generation_num) {
        genText = '炎帝' + parseInt(person.generation_num) + '世/申伯' + (parseInt(person.generation_num) - 64) + '世';
      } else if (opts.ancBox && dongshanIds[person.id] && person.generation_num) {
        genText = '炎帝' + parseInt(person.generation_num) + '世';
      } else if (person.generation && person.generation !== '—') {
        genSuffix = ' · ' + escapeHtml(person.generation);
      }
      // 始宁东山世次标注（用户指定）：缵=始宁东山1世，衡=始宁东山2世；
      // 鲲/裒及以后（衡之子→闓）补全「申伯N世/始宁东山M世」，M = 申伯世次−34 = generation_num−98，衡(1130)特殊指定2世。
      if (opts.ancBox && dongshanIds[person.id] && person.generation_num) {
        var dsShenboGen = parseInt(person.generation_num) - 64; // 申伯世次
        var dsDongshanGen = (person.id === 1130) ? 2 : (parseInt(person.generation_num) - 98); // 始宁东山世次
        if (shenboIds[person.id]) {
          genText += '/始宁东山' + dsDongshanGen + '世'; // 缵/衡：申伯世次已有，只补东山
        } else {
          genText += '/申伯' + dsShenboGen + '世/始宁东山' + dsDongshanGen + '世'; // 鲲及以后：补全申伯+东山
        }
      }
      // 临海下渡世次标注（用户指定）：闓(1183)=临海下渡1世，以下以此类推（N = generation_num − 121），到小四为止
      if (opts.ancBox && linhaiIds[person.id] && person.generation_num) {
        // 儛/俨(1186) 及以后不在申伯/始宁东山集合内，genText 只有基础「N世」，补全完整世次（闓已有完整四段，不重复）
        if (genText.indexOf('/申伯') < 0 && genText.indexOf('/始宁东山') < 0) {
          var lhN = parseInt(person.generation_num);
          genText = '炎帝' + lhN + '世/申伯' + (lhN - 64) + '世/始宁东山' + (lhN - 98) + '世';
        }
        genText += '/临海下渡' + (parseInt(person.generation_num) - 121) + '世';
      }
      html += '<div class="apt-meta">' + genText + genSuffix + '</div>';
    }
    if (person.branch && person.branch !== '—' && !opts.hideBranch) {
      html += '<div class="apt-branch">' + escapeHtml(person.branch) + '</div>';
    }
    if (person.spouse_ids) {
      var sp = person.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
      if (sp.length > 0) html += '<div class="apt-spouse">配: ' + escapeHtml(sp.join('、')) + '</div>';
    }
    // 显示母亲（多妻情况下区分不同母亲所出）
    if (person.mother_id) {
      var _mo = personById[parseInt(person.mother_id)];
      var mn = _mo ? _mo.name : null;
      if (mn) html += '<div class="apt-mother">母: ' + escapeHtml(mn) + '</div>';
    }
    // 嗣子显示双 lineage：过继父 + 生父
    if (person.adopted && person.adopted !== '否' && person.adopted !== '出继') {
      if (person.bio_father_id) {
        var bfn = getPersonName(parseInt(person.bio_father_id), data) || person.bio_father_id;
        if (bfn) html += '<div class="apt-bio-father" style="font-size:11px;color:#22d3ee;margin-top:2px;">🌱 生父: ' + escapeHtml(bfn) + '</div>';
      }
      if (person.bio_mother_id) {
        var bmn = getPersonName(parseInt(person.bio_mother_id), data) || person.bio_mother_id;
        if (bmn) html += '<div class="apt-bio-mother" style="font-size:11px;color:#22d3ee;margin-top:1px;">🌱 生母: ' + escapeHtml(bmn) + '</div>';
      }
      html += '<div class="apt-dual-lineage" style="font-size:10px;color:var(--text-tertiary);margin-top:3px;padding:2px 4px;border:1px dashed rgba(34,211,238,0.2);border-radius:4px;">🔄 双 lineage：过继入本支 · 原生可查</div>';
    }
    html += '<div class="apt-children-count">' + (childrenOf(person).length > 0 ? childrenOf(person).length + ' 子女, ' + countDescendants(person) + ' 后代' : '') + '</div>';
    html += '</div>'; // apt-card-inner
    html += '</div>'; // apt-card
    return html;
  }

  // 子女块：connector + 卡片行(兄弟相邻) + 子树行(absolute 对齐各自卡片)
  // 卡片行里的每张卡片对应子树行里的一个 .apt-sub；sub 内递归渲染孙辈块（不含该卡片本身）
  function renderAptChildrenBlock(person, _path) {
    var children = childrenOf(person);
    if (children.length === 0) return '';
    var kids = [];
    for (var kc = 0; kc < children.length; kc++) {
      if (_path && _path.indexOf(children[kc].id) >= 0) continue; // 环保护
      kids.push(children[kc]);
    }
    if (kids.length === 0) return '';
    var html = '<div class="apt-children-wrap">';
    html += '<div class="apt-connector"></div>';
    html += '<div class="apt-children">';
    html += '<div class="apt-cards-row">';
    if (kids.length > 1) html += '<div class="apt-hline"></div>';
    for (var ck = 0; ck < kids.length; ck++) {
      html += '<div class="apt-child" data-pid="' + kids[ck].id + '">';
      html += '<div class="apt-vline"></div>';
      html += renderAptCard(kids[ck]);
      html += '</div>';
    }
    html += '</div>'; // apt-cards-row
    html += '<div class="apt-subs-row">';
    for (var ck2 = 0; ck2 < kids.length; ck2++) {
      // 默认折叠的大支（攒/撰/彬/乾）：sub 直接 display:none，点击卡片展开
      var _subCollapsed = opts.collapsedIds && opts.collapsedIds[kids[ck2].id];
      html += '<div class="apt-sub" data-pid="' + kids[ck2].id + '"' + (_subCollapsed ? ' style="display:none"' : '') + '>';
      html += renderAptChildrenBlock(kids[ck2], _path.concat([kids[ck2].id]));
      html += '</div>';
    }
    html += '</div>'; // apt-subs-row
    html += '</div>'; // apt-children
    html += '</div>'; // apt-children-wrap
    return html;
  }

  function renderPerson(person, _ancestors) {
    // 环保护：祖先链中出现自己则跳过（防自引用/互环导致无限递归）
    if (_ancestors && _ancestors.indexOf(person.id) >= 0) return '';
    var _path = (_ancestors ? _ancestors.concat([person.id]) : [person.id]);
    var html = '<div class="apt-person">';
    html += renderAptCard(person);
    html += renderAptChildrenBlock(person, _path);

    // Bio lineage for adopted persons: show biological ancestors as a separate branch
    if (person.adopted && person.adopted !== '否' && person.adopted !== '出继' && person.bio_father_id) {
      html += '<div class="apt-bio-lineage" style="margin:6px 0 4px 20px;padding:6px 10px;border-left:2px dashed rgba(34,211,238,0.3);border-radius:0 6px 6px 0;background:rgba(34,211,238,0.03);">';
      html += '<div style="font-size:10px;font-weight:600;color:#22d3ee;margin-bottom:4px;letter-spacing:1px;">🌱 原生 lineage（生父系）</div>';
      // Traverse bio father chain upward
      var bioChain = [];
      var curBioId = parseInt(person.bio_father_id);
      var maxGen = 20; // prevent infinite loops
      while (curBioId && maxGen > 0) {
        maxGen--;
        var bioPerson = personById[curBioId];
        if (!bioPerson) break;
        bioChain.push(bioPerson);
        curBioId = bioPerson.father_id ? parseInt(bioPerson.father_id) : null;
      }
      // Render bio chain from oldest to youngest (reverse)
      bioChain.reverse();
      for (var bci = 0; bci < bioChain.length; bci++) {
        var bp = bioChain[bci];
        var isLast = (bci === bioChain.length - 1);
        html += '<div style="display:flex;align-items:center;gap:6px;padding:2px 0;' + (isLast ? '' : '') + '">';
        html += '<div style="width:24px;height:24px;border-radius:50%;background:' + (bp.gender === '女' ? 'rgba(244,114,182,0.2)' : 'rgba(34,211,238,0.15)') + ';display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;">' + (bp.gender === '女' ? '👩' : '👤') + '</div>';
        html += '<span style="font-size:12px;">' + escapeHtml(bp.name) + '</span>';
        html += '<span style="font-size:10px;color:var(--text-tertiary);">' + (bp.generation_num || '?') + '世</span>';
        if (!isLast) html += '<span style="color:var(--text-tertiary);font-size:10px;margin-left:auto;">⬇</span>';
        else html += '<span style="color:#22d3ee;font-size:11px;margin-left:auto;font-weight:600;">→ ' + escapeHtml(person.name) + '（嗣子）</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  var out = '<div class="apt-tree' + (opts.ancBox ? ' apt-anc-box-enabled' : '') + '">';
  // 渲染主根节点
  var renderedIds = {};
  for (var r = 0; r < roots.length; r++) {
    out += renderPerson(roots[r]);
    // 收集渲染过程中覆盖到的所有人，用于兜底补渲染
    collectRendered(roots[r]);
  }
  // 兜底：父链断链/孤立的人（father_id 指向的人不在主树中）也应显示，保证录入数据不遗漏
  function collectRendered(p, _seen) {
    if (_seen && _seen.indexOf(p.id) >= 0) return; // 环保护
    _seen = (_seen || []).concat([p.id]);
    renderedIds[p.id] = true;
    childrenOf(p).forEach(function(c) { collectRendered(c, _seen); });
  }
  for (var ri = 0; ri < data.length; ri++) {
    if (!renderedIds[data[ri].id]) {
      out += renderPerson(data[ri]);
    }
  }
  // 远古世系方框 + 标注（仅世代总览启用的 ancBox 模式）
  if (opts.ancBox) out += '<div class="apt-anc-box"><span class="apt-anc-label">谢氏远古世系简图</span></div>';
  if (opts.ancBox) out += '<div class="apt-shenbo-box"><span class="apt-shenbo-label">申伯世系示意图</span></div>';
  if (opts.ancBox) out += '<div class="apt-dongshan-box"><span class="apt-dongshan-label">始宁东山世系示意图</span></div>';
  if (opts.ancBox) out += '<div class="apt-linhai-box"><span class="apt-linhai-label">临海下渡世系示意图</span></div>';
  out += '</div>';
  return out;
}

/**
 * 渲染入赘婚配列表（后台隐私数据，不公开）
 */
function renderRuzhuiMarriage(area) {
  var html = '<div class="admin-module">';
  html += '<div class="admin-module-header">';
  html += '<h3>💒 入赘婚配（隐私数据）</h3>';
  html += '</div>';
  html += '<p style="font-size:13px;color:var(--text-secondary);margin:0 0 16px 0;">以下为家族中入赘（女婿入赘）的夫妻关系</p>';

  html += '<div class="admin-table-wrap"><table class="admin-table">';
  html += '<thead><tr>';
  html += '<th style="text-align:left;">👤 入赘方</th>';
  html += '<th style="text-align:left;">原姓/籍贯</th>';
  html += '<th style="text-align:center;width:40px;">💑</th>';
  html += '<th style="text-align:left;">👩 配偶</th>';
  html += '<th style="text-align:center;">世代</th>';
  html += '</tr></thead><tbody>';

  html += '<tr><td>金瑜</td><td>本姓陈·一市下</td><td style="text-align:center;">↔</td><td>聪林（三女）</td><td style="text-align:center;">162世</td></tr>';
  html += '<tr><td>施鹏</td><td>杭州人</td><td style="text-align:center;">↔</td><td>玮</td><td style="text-align:center;">162世</td></tr>';
  html += '<tr><td>保岳</td><td>本姓葛·白岩人</td><td style="text-align:center;">↔</td><td>国芬</td><td style="text-align:center;">160世</td></tr>';
  html += '<tr><td>王邦旭</td><td>女婿入赘</td><td style="text-align:center;">↔</td><td>开静（孝静）</td><td style="text-align:center;">163世</td></tr>';
  html += '<tr><td>张小兵</td><td>女婿入赘</td><td style="text-align:center;">↔</td><td>开蕾</td><td style="text-align:center;">163世</td></tr>';
  html += '<tr><td>赵敏杰</td><td>女婿/入赘</td><td style="text-align:center;">↔</td><td>佳颖</td><td style="text-align:center;">164世</td></tr>';
  html += '<tr><td>雪水</td><td>前童人·入赘</td><td style="text-align:center;">↔</td><td>聪芳</td><td style="text-align:center;">162世</td></tr>';

  html += '</tbody></table></div>';
  html += '</div>';
  area.innerHTML = html;
}

function renderGenealogy(area) {
  var data = getData('genealogy');
  data.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0); });

  var html = '<div class="admin-module">';
  html += '<div class="admin-module-header">';
  html += '<h3>📖 族谱管理</h3>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  html += '<button class="btn btn-accent btn-sm" onclick="showAddForm(\'genealogy\')">+ 新增人员</button>';
  html += '<button class="btn btn-sm" onclick="exportGenealogyCSV()">📥 导出CSV</button>';
  html += '<button class="btn btn-sm" onclick="document.getElementById(\'csv-import-input\').click()">📤 导入CSV</button>';
  html += '<input type="file" id="csv-import-input" accept=".csv" style="display:none" onchange="importGenealogyCSV(this)">';
  html += '<button class="btn btn-sm" onclick="generateGenealogyBook()">📖 生成谱书</button>';
  html += '<button class="btn btn-sm" onclick="window.open(\'../pages/genealogy.html\', \'_blank\')" style="padding:8px 16px;">🔗 预览世系图</button>';
  html += '</div></div>';
  html += '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;padding:10px 14px;background:rgba(33,150,243,0.06);border-radius:8px;border:1px solid rgba(33,150,243,0.12);">'
    + '<span style="font-size:12px;color:rgba(255,255,255,0.5);">💾 数据保护</span>'
    + '<button class="btn btn-xs" onclick="backupModuleData(\'genealogy\')" style="padding:4px 12px;">📥 手动备份到服务器</button>'
    + '<button class="btn btn-xs" onclick="downloadModuleData(\'genealogy\')" style="padding:4px 12px;">⬇️ 导出JSON到电脑</button>'
    + '<span id="sync-status-genealogy" style="font-size:11px;color:rgba(255,255,255,0.3);"></span>'
    + (localStorage.getItem('xie_unsynced_genealogy') === 'true' ? '<span style="color:#f44336;font-weight:600;"> ⚠️ 有未同步的数据</span>' : '')
    + '</div>';

  // Ancient lineage table (炎帝→申伯)
  html += '<div style="margin:16px 0;padding:14px 18px;background:rgba(201,168,76,0.06);border-radius:10px;border:1px solid rgba(201,168,76,0.12);">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==\'none\'?\'block\':\'none\'">';
  html += '<span style="font-size:14px;">🏛️</span>';
  html += '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">远古世系（炎帝→申伯）</span>';
  html += '<span style="font-size:11px;color:var(--text-muted);">点击展开/收起</span>';
  html += '</div>';
  html += '<div class="apt-lineage-section" data-sec="ancient" style="display:none;">';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html += '<thead><tr style="background:rgba(201,168,76,0.1);">';
  html += '<th style="padding:6px 10px;border:1px solid var(--glass-border);text-align:center;width:50px;">世</th>';
  html += '<th style="padding:6px 10px;border:1px solid var(--glass-border);text-align:center;">人物</th>';
  html += '<th style="padding:6px 10px;border:1px solid var(--glass-border);text-align:center;">说明</th>';
  html += '</tr></thead><tbody>';
  var ancient_list = [
    [1, '🔥 炎帝神农氏', '姜姓始祖'],
    [2, '临魁', '继位'],
    [10, '榆罔', ''],
    [11, '帝柱', ''],
    [15, '祝融', ''],
    [54, '吕尚（号飞熊）', '封于申'],
    [55, '佐', ''],
    [65, '申伯', '谢氏鼻祖'],
    [65, '申甫', '仍姓姜'],
  ];
  for (var ai = 0; ai < ancient_list.length; ai++) {
    var row = ancient_list[ai];
    html += '<tr>';
    html += '<td style="padding:5px 10px;border:1px solid var(--glass-border);text-align:center;font-weight:600;color:var(--accent-orange);">' + row[0] + '</td>';
    var anName = row[1].replace(/^[^一-龥]+/, '').split('（')[0].trim(); // 去 emoji/号 等显示前缀后用于匹配
    html += '<td style="padding:5px 10px;border:1px solid var(--glass-border);text-align:center;' + (row[2] === '谢氏鼻祖' ? 'font-weight:700;color:var(--accent-orange);' : '') + '"><span class="apt-link" title="点击编辑" onclick="adminLineageEditByName(\'' + anName + '\',null)">' + row[1] + '</span>' + adminLineageRowActions(anName, null) + '</td>';
    html += '<td style="padding:5px 10px;border:1px solid var(--glass-border);text-align:center;color:var(--text-tertiary);">' + row[2] + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  // 简易树状图：同辈并列，父子连线
  html += '<div style="margin-top:8px;overflow-x:auto;padding:4px;">';
  html += renderMiniGenealogyTree(data, ['炎帝神农氏','临魁','榆罔','帝柱','祝融','吕尚','佐','申伯','申甫'], '#c9a84c');
  html += '</div></div></div>';

  // 申伯世系折叠表
  html += '<div style="margin:16px 0;padding:14px 18px;background:rgba(100,60,160,0.06);border-radius:10px;border:1px solid rgba(100,60,160,0.12);">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==\'none\'?\'block\':\'none\'">';
  html += '<span style="font-size:14px;">🏛️</span>';
  html += '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">申伯世系（申伯→缵→衡）</span>';
  html += '<span style="font-size:11px;color:var(--text-muted);">点击展开/收起</span>';
  html += '</div>';
  html += '<div class="apt-lineage-section" data-sec="shenbo" style="display:none;">';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html += '<thead><tr style="background:rgba(100,60,160,0.1);">';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:40px;">炎帝世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:40px;">申伯世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;">人物</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;">说明</th>';
  html += '</tr></thead><tbody>';
  var shenbo_lineage = [
    [65, 1, '申伯', '谢氏鼻祖/申伯系第1世'],
    [66, 2, '弘', '申伯之子'],
    [66, 2, '猛', '申伯之子'],
    [67, 3, '广', '弘之子'],
    [67, 3, '协', '弘之子'],
    [68, 4, '列宗', '广之子'],
    [68, 4, '穆宗', '广之子'],
    [69, 5, '骘', '列宗之子'],
    [70, 6, '预', '骘之子'],
    [71, 7, '昌后', '预之子'],
    [72, 8, '达', '昌后之子'],
    [72, 8, '守礼', '昌后之子'],
    [73, 9, '子民', '达之子'],
    [74, 10, '秩', '子民之子'],
    [75, 11, '雍', '秩之子'],
    [76, 12, '林', '雍之子'],
    [77, 13, '涣', '林之子'],
    [78, 14, '旺', '涣之子'],
    [79, 15, '珽', '旺之子'],
    [80, 16, '国辉', '珽之子'],
    [81, 17, '宁', '国辉之子'],
    [82, 18, '福', '宁之子'],
    [83, 19, '杨贞', '福之子'],
    [84, 20, '平利', '杨贞之子'],
    [84, 20, '平和', '杨贞之子'],
    [84, 20, '平祖', '杨贞之子'],
    [85, 21, '翠', '平和之子'],
    [85, 21, '利', '平和之子'],
    [85, 21, '文', '平和之子'],
    [86, 22, '武', '文之子'],
    [87, 23, '秉槐', '武之子'],
    [88, 24, '堂', '秉槐之子'],
    [89, 25, '瑛', '堂之子'],
    [90, 26, '文轩', '瑛之子'],
    [90, 26, '文昂', '瑛之子'],
    [91, 27, '福郎', '文轩之子'],
    [91, 27, '丙郎', '文轩之子'],
    [91, 27, '应郎', '文轩之子'],
    [92, 28, '宜礼', '福郎之子'],
    [92, 28, '宜乐', '福郎之子'],
    [93, 29, '逵', '宜礼之子'],
    [94, 30, '简', '逵之子'],
    [95, 31, '瑰', '简之子'],
    [96, 32, '懿', '瑰之子'],
    [97, 33, '鳅', '懿之子'],
    [98, 34, '当', '鳅之后'],
    [98, 34, '景秀', '鳅之后'],
    [99, 35, '缵', '景秀之后/东山第一世'],
    [99, 35, '显', '景秀之后'],
    [99, 35, '顼', '景秀之后'],
  ];
  // Remove 衡 from shenbo_lineage
  shenbo_lineage = shenbo_lineage.filter(function(r) { return r[2] !== '衡'; });
  for (var si = 0; si < shenbo_lineage.length; si++) {
    var row = shenbo_lineage[si];
    var yandiGen = row[0], shenboGen = row[1], person = row[2], desc = row[3];
    var isShenBo = (person === '申伯');
    var isDongshan = (desc.indexOf('东山') >= 0);
    html += '<tr>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;font-size:11px;color:' + (isShenBo ? 'var(--accent-orange)' : 'var(--text-tertiary)') + ';">' + yandiGen + '</td>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;font-weight:600;font-size:11px;color:' + (isShenBo ? 'var(--accent-orange)' : 'var(--text-primary)') + ';">' + shenboGen + '</td>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;' + (isDongshan ? 'font-weight:700;color:#643ca0;' : '') + 'font-size:12px;"><span class="apt-link" title="点击编辑" onclick="adminLineageEditByName(\'' + person + '\',\'申伯世系\')">' + person + '</span>' + adminLineageRowActions(person, '申伯世系') + '</td>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;color:var(--text-tertiary);font-size:11px;">' + desc + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  // 树状图 - 完整的申伯世系树（卡片式连接，含所有旁支）
  html += '<div style="margin-top:8px;border:1px solid rgba(100,60,160,0.08);border-radius:8px;padding:6px;">';
  html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
  html += '<span style="font-size:10px;color:var(--text-tertiary);">🖱️ 拖拽平移 · 滚轮缩放</span>';
  html += '<span style="flex:1;"></span>';
  html += '<button class="apt-zoom-btn" onclick="zoomShenboTree(1.3)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">+</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomShenboTree(0.77)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">−</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomShenboTree(1)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:12px;line-height:1;">⟳</button>';
  html += '<span id="sb-zoom-level" style="font-size:10px;color:var(--text-tertiary);min-width:32px;text-align:center;">100%</span>';
  html += '</div>';
  html += '<div class="shenbo-tree-viewport" id="shenbo-tree-viewport" style="overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-secondary);min-height:280px;">';
  html += buildAdminShenboTree();
  html += '</div></div></div>';

  // 始宁东山世系折叠表
  html += '<div style="margin:16px 0;padding:14px 18px;background:rgba(33,150,243,0.06);border-radius:10px;border:1px solid rgba(33,150,243,0.12);">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==\'none\'?\'block\':\'none\'">';
  html += '<span style="font-size:14px;">🏛️</span>';
  html += '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">始宁东山世系（缵→闓→临海下渡）</span>';
  html += '<span style="font-size:11px;color:var(--text-muted);">点击展开/收起</span>';
  html += '</div>';
  html += '<div class="apt-lineage-section" data-sec="dongshan" style="display:none;">';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html += '<thead><tr style="background:rgba(33,150,243,0.1);">';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:35px;">炎帝世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:35px;">申伯世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:35px;">东山世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;">人物</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;">说明</th>';
  html += '</tr></thead><tbody>';
  var dongshan_list = [
    [99, 35, 1, '缵', '东山第一世'],
    [100, 36, 2, '衡', '会稽东山始祖'],
    [101, 37, 3, '鲲', '衡之子'],
    [101, 37, 3, '裒', '衡之子，谢安之父'],
    [101, 37, 3, '广', '衡之子'],
    [102, 38, 4, '奕', '裒之子'],
    [102, 38, 4, '据', '裒之子'],
    [102, 38, 4, '安', '字安石，东晋名相'],
    [102, 38, 4, '万', '裒之子'],
    [102, 38, 4, '淮', '裒之子'],
    [102, 38, 4, '石', '裒之子'],
    [102, 38, 4, '铁', '裒之子'],
    [103, 39, 5, '瑶', '安之子'],
    [103, 39, 5, '琰', '安之子'],
    [104, 40, 6, '肇', '琰之子'],
    [104, 40, 6, '峻', '琰之子'],
    [104, 40, 6, '混', '琰之子'],
    [105, 41, 7, '密', '混之子'],
    [106, 42, 8, '庄', '密之子'],
    [107, 43, 9, '飏', '庄之子'],
    [107, 43, 9, '胜', '庄之子'],
    [107, 43, 9, '灏', '庄之子'],
    [107, 43, 9, '丛', '庄之子'],
    [107, 43, 9, '沦', '庄之子'],
    [108, 44, 10, '览', '飏之子'],
    [109, 45, 11, '琢', '览之子'],
    [109, 45, 11, '侨', '览之子'],
    [110, 46, 12, '琂', '琢之子'],
    [110, 46, 12, '琬', '琢之子'],
    [110, 46, 12, '琉', '琢之子'],
    [111, 47, 13, '峤', '琂之子'],
    [111, 47, 13, '植', '琂之子'],
    [112, 48, 14, '钝', '植之子'],
    [112, 48, 14, '缪', '植之子'],
    [113, 49, 15, '修', '钝之子'],
    [113, 49, 15, '豹', '钝之子'],
    [114, 50, 16, '恺', '修之子'],
    [115, 51, 17, '骢', '恺之子'],
    [115, 51, 17, '驼', '恺之子'],
    [115, 51, 17, '绰', '恺之子'],
    [116, 52, 18, '式', '绰之子'],
    [117, 53, 19, '革', '式之子'],
    [117, 53, 19, '造', '式之子'],
    [118, 54, 20, '直', '造之子'],
    [119, 55, 21, '是温', '直之子'],
    [120, 56, 22, '翳', '是温之子'],
    [121, 57, 23, '静', '翳之子'],
    [121, 57, 23, '观', '翳之子'],
    [122, 58, 24, '闓', '观之子/临海下渡第一世'],
  ];
  for (var di = 0; di < dongshan_list.length; di++) {
    var row = dongshan_list[di];
    var yandiGen = row[0], shenboGen = row[1], dongshanGen = row[2], dPerson = row[3], dDesc = row[4];
    var isRoot = (dPerson === '缵');
    var isXieAn = (dPerson === '安');
    var isLinhai = (dPerson === '闓');
    html += '<tr>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;font-size:11px;color:var(--text-tertiary);">' + yandiGen + '</td>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;font-size:11px;color:var(--text-tertiary);">' + shenboGen + '</td>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;font-weight:600;font-size:11px;color:' + (isRoot?'#2196f3':'var(--text-primary)') + ';">' + dongshanGen + '</td>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;font-weight:' + (isXieAn||isRoot||isLinhai?'700':'400') + ';color:' + (isXieAn?'#d4793a':isRoot?'#2196f3':isLinhai?'#643ca0':'') + ';font-size:12px;"><span class="apt-link" title="点击编辑" onclick="adminLineageEditByName(\'' + dPerson + '\',\'始宁东山\')">' + dPerson + '</span>' + adminLineageRowActions(dPerson, '始宁东山') + '</td>';
    html += '<td style="padding:4px 8px;border:1px solid var(--glass-border);text-align:center;color:var(--text-tertiary);font-size:11px;">' + dDesc + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  // 树状图
  html += '<div style="margin-top:8px;border:1px solid rgba(33,150,243,0.08);border-radius:8px;padding:6px;">';
  html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
  html += '<span style="font-size:10px;color:var(--text-tertiary);">🖱️ 拖拽平移 · 滚轮缩放</span><span style="flex:1;"></span>';
  html += '<button class="apt-zoom-btn" onclick="zoomDongshanTree(1.3)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">+</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomDongshanTree(0.77)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">−</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomDongshanTree(1)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:12px;line-height:1;">⟳</button>';
  html += '<span id="ds-zoom-level" style="font-size:10px;color:var(--text-tertiary);min-width:32px;text-align:center;">100%</span>';
  html += '</div>';
  html += '<div class="dongshan-tree-viewport" id="dongshan-tree-viewport" style="overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-secondary);min-height:280px;">';
  html += buildAdminDongshanTree();
  html += '</div></div>';  // close Dongshan tree viewport + controls
  html += '</div></div>';  // close Dongshan collapsible body + container

  // 临海下渡世系折叠表
  html += '<div style="margin:16px 0;padding:14px 18px;background:rgba(100,60,160,0.06);border-radius:10px;border:1px solid rgba(100,60,160,0.12);">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==\'none\'?\'block\':\'none\'">';
  html += '<span style="font-size:14px;">🏛️</span>';
  html += '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">临海下渡世系（闓→小四）</span>';
  html += '<span style="font-size:11px;color:var(--text-muted);">点击展开/收起</span>';
  html += '</div>';
  html += '<div class="apt-lineage-section" data-sec="linhai" style="display:none;">';
  html += '<p style="font-size:12px;color:var(--text-tertiary);margin-bottom:10px;line-height:1.6;">自闓公（临海下渡第一世）传至小四公（石马始祖），石马（下谢）小四公乃文杲公（枫槎始迁祖）之直系渊源。</p>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html += '<thead><tr style="background:rgba(100,60,160,0.1);">';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:40px;">炎帝世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:40px;">申伯世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:40px;">东山世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;width:40px;">临海世</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;">人物</th>';
  html += '<th style="padding:6px 8px;border:1px solid var(--glass-border);text-align:center;">说明</th>';
  html += '</tr></thead><tbody>';
  var linhai_list = [
    [122,58,24,1,'闓','观之子/临海下渡第一世'],
    [123,59,25,2,'俨','闓之子'],
    [124,60,26,3,'诜','俨之子'],
    [125,61,27,4,'景之','诜之子'],
    [125,61,27,4,'考之','诜之子'],
    [126,62,28,5,'润甫','景之之后'],
    [126,62,28,5,'深甫','景之之后'],
    [127,63,29,6,'采伯','深甫之后'],
    [127,63,29,6,'渠伯','深甫之后'],
    [127,63,29,6,'棐伯','深甫之后'],
    [127,63,29,6,'彚伯','深甫之后'],
    [128,64,30,7,'奕修','采伯之后'],
    [128,64,30,7,'奕懋','采伯之后'],
    [128,64,30,7,'奕恭','采伯之后'],
    [128,64,30,7,'奕容','采伯之后'],
    [128,64,30,7,'奕信','采伯之后'],
    [129,65,31,8,'在鉴','奕信之后'],
    [129,65,31,8,'在勋','奕信之后'],
    [129,65,31,8,'在纲','奕信之后'],
    [129,65,31,8,'在机','奕信之后'],
    [130,66,32,9,'大四','在纲之后'],
    [130,66,32,9,'小四','在纲之后'],
  ];
  for (var li = 0; li < linhai_list.length; li++) {
    var row = linhai_list[li];
    var isFirst = (li === 0);
    var isXiaosi = (row[4] === '小四');
    html += '<tr>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;font-size:10px;color:var(--text-tertiary);' + (isFirst?'font-weight:700;color:#643ca0;':'') + '">' + row[0] + '</td>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;font-size:10px;color:var(--text-tertiary);">' + row[1] + '</td>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;font-size:10px;color:var(--text-tertiary);">' + row[2] + '</td>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;font-weight:600;font-size:10px;color:#643ca0;">' + row[3] + '</td>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;font-size:11px;' + (isXiaosi?'font-weight:700;color:var(--accent-orange);':'') + '"><span class="apt-link" title="点击编辑" onclick="adminLineageEditByName(\'' + row[4] + '\',\'临海下渡\')">' + row[4] + '</span>' + adminLineageRowActions(row[4], '临海下渡') + '</td>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;color:var(--text-tertiary);font-size:10px;">' + row[5] + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  // 树状图
  html += '<div style="margin-top:8px;border:1px solid rgba(100,60,160,0.08);border-radius:8px;padding:6px;">';
  html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
  html += '<span style="font-size:10px;color:var(--text-tertiary);">🖱️ 拖拽平移 · 滚轮缩放</span><span style="flex:1;"></span>';
  html += '<button class="apt-zoom-btn" onclick="zoomLinhaiTree(1.3)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">+</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomLinhaiTree(0.77)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">−</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomLinhaiTree(1)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:12px;line-height:1;">⟳</button>';
  html += '<span id="lh-zoom-level" style="font-size:10px;color:var(--text-tertiary);min-width:32px;text-align:center;">100%</span>';
  html += '</div>';
  html += '<div class="linhai-tree-viewport" id="linhai-tree-viewport" style="overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-secondary);min-height:220px;">';
  html += buildAdminLinhaiTree();
  html += '</div></div>';
  html += '<div style="margin-top:6px;font-size:10px;color:var(--text-tertiary);text-align:right;">石马（下谢）始祖小四公 → 文杲公（枫槎谢氏始迁祖）</div>';
  html += '</div></div>';

  // 石马（下谢）分房派折叠表
  html += '<div style="margin:16px 0;padding:14px 18px;background:rgba(240,180,80,0.06);border-radius:10px;border:1px solid rgba(240,180,80,0.12);">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==\'none\'?\'block\':\'none\'">';
  html += '<span style="font-size:14px;">🏛️</span>';
  html += '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">石马（下谢）分房派示意简图</span>';
  html += '<span style="font-size:11px;color:var(--text-muted);">点击展开/收起</span>';
  html += '</div>';
  html += '<div class="apt-lineage-section" data-sec="shima" style="display:none;">';
  html += '<p style="font-size:12px;color:var(--text-tertiary);margin-bottom:10px;line-height:1.6;">小四公：炎帝第130世／申伯第66世／东山第32世／临海下渡第9世／石马（下谢）第1世。自小四公开派，衍生丹一、丹二、丹三三房，其后文杲公迁居宁海岩下为枫槎始迁祖，文榘公一派为东门桃源陈氏之祖。</p>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html += '<thead><tr style="background:rgba(240,180,80,0.1);">';
  html += '<th style="padding:4px 6px;border:1px solid var(--glass-border);text-align:center;width:35px;">炎帝世</th>';
  html += '<th style="padding:4px 6px;border:1px solid var(--glass-border);text-align:center;width:35px;">申伯世</th>';
  html += '<th style="padding:4px 6px;border:1px solid var(--glass-border);text-align:center;width:35px;">东山世</th>';
  html += '<th style="padding:4px 6px;border:1px solid var(--glass-border);text-align:center;width:35px;">临海世</th>';
  html += '<th style="padding:4px 6px;border:1px solid var(--glass-border);text-align:center;width:35px;">石马世</th>';
  html += '<th style="padding:4px 6px;border:1px solid var(--glass-border);text-align:center;">人物</th>';
  html += '<th style="padding:4px 6px;border:1px solid var(--glass-border);text-align:center;">说明</th>';
  html += '</tr></thead><tbody>';
  var shima_list = [
    [1,'小四','石马第一世'],
    [2,'丹一','小四之子'],[2,'丹二','小四之子'],[2,'丹三','小四之子'],
    [3,'文杲','丹一之后，枫槎谢氏始迁祖'],[3,'文榘','丹一之后，东门桃源陈氏之祖'],[3,'丹九','丹三之后'],
    [4,'廿一','丹九之后'],[4,'廿二','丹九之后'],[4,'廿四','丹九之后'],
    [4,'十三','文榘之后'],[4,'十七','文榘之后'],[4,'二一','文榘之后'],
    [5,'廿七','十三之后'],[5,'廿九','十三之后'],[5,'三十一','十三之后'],[5,'四十','廿二之后'],
    [6,'百十','廿七之后'],[6,'庆三','廿七之后'],[6,'千九','四十之后'],[6,'千十','四十之后'],[6,'千十一','四十之后'],[6,'千十三','四十之后'],
    [7,'敬乙','庆三之后'],[7,'一廷','千十一之后'],[7,'隆','千十一之后'],
    [8,'琰','隆之后'],[8,'琇','隆之后'],
    [9,'位','琰之后'],[9,'倍','琰之后'],[9,'侍','琰之后'],[9,'体','琰之后'],[9,'旦','琰之后'],[9,'俱生','琇之后'],
    [10,'礼','位之后'],[10,'管','位之后'],[10,'罗','位之后'],
    [11,'泰鹏','管之后'],[11,'泰颚','管之后'],
    [12,'秀廉','泰颚之后'],[12,'秀洁','泰颚之后'],[12,'秀驹','泰颚之后'],
  ];
  for (var si = 0; si < shima_list.length; si++) {
    var srow = shima_list[si];
    var isRoot = (si === 0);
    var isWenGao = (srow[1] === '文杲');
    var yd = 130 + srow[0] - 1, sb = 66 + srow[0] - 1, ds = 32 + srow[0] - 1, lx = 9 + srow[0] - 1;
    html += '<tr>';
    html += '<td style="padding:3px 5px;border:1px solid var(--glass-border);text-align:center;font-size:10px;color:var(--text-tertiary);' + (isRoot?'font-weight:700;color:#d4a037;':'') + '">' + yd + '</td>';
    html += '<td style="padding:3px 5px;border:1px solid var(--glass-border);text-align:center;font-size:10px;color:var(--text-tertiary);">' + sb + '</td>';
    html += '<td style="padding:3px 5px;border:1px solid var(--glass-border);text-align:center;font-size:10px;color:var(--text-tertiary);">' + ds + '</td>';
    html += '<td style="padding:3px 5px;border:1px solid var(--glass-border);text-align:center;font-size:10px;color:var(--text-tertiary);">' + lx + '</td>';
    html += '<td style="padding:3px 5px;border:1px solid var(--glass-border);text-align:center;font-weight:600;font-size:10px;color:#d4a037;">' + srow[0] + '</td>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;font-size:11px;' + (isWenGao?'font-weight:700;color:var(--accent-orange);':'') + '"><span class="apt-link" title="点击编辑" onclick="adminLineageEditByName(\'' + srow[1] + '\',\'石马(下谢)\')">' + srow[1] + '</span>' + adminLineageRowActions(srow[1], '石马(下谢)') + '</td>';
    html += '<td style="padding:3px 6px;border:1px solid var(--glass-border);text-align:center;color:var(--text-tertiary);font-size:10px;">' + srow[2] + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  // 树状图
  html += '<div style="margin-top:8px;border:1px solid rgba(240,180,80,0.08);border-radius:8px;padding:6px;">';
  html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
  html += '<span style="font-size:10px;color:var(--text-tertiary);">🖱️ 拖拽平移 · 滚轮缩放</span><span style="flex:1;"></span>';
  html += '<button class="apt-zoom-btn" onclick="zoomShimaTree(1.3)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">+</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomShimaTree(0.77)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:14px;line-height:1;">−</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomShimaTree(1)" style="width:26px;height:26px;border-radius:4px;border:1px solid var(--glass-border);background:var(--glass-bg);cursor:pointer;font-size:12px;line-height:1;">⟳</button>';
  html += '<span id="sm-zoom-level" style="font-size:10px;color:var(--text-tertiary);min-width:32px;text-align:center;">100%</span>';
  html += '</div>';
  html += '<div class="shima-tree-viewport" id="shima-tree-viewport" style="overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-secondary);min-height:280px;">';
  html += buildAdminShimaTree();
  html += '</div></div>';
  html += '</div></div>';

  // ===== 本宗世系图（后枫槎）=====
  html += '<div style="margin:16px 0;padding:14px 18px;background:rgba(34,197,94,0.06);border-radius:10px;border:1px solid rgba(34,197,94,0.12);">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==\'none\'?\'block\':\'none\'">';
  html += '<span style="font-size:14px;">🌳</span>';
  html += '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">本宗世系图（后枫槎）</span>';
  html += '<span style="font-size:11px;color:var(--text-muted);">点击展开/收起</span>';
  html += '</div>';
  html += '<div class="apt-lineage-section" data-sec="houfengcha" style="display:block;">';
  html += '<p style="font-size:12px;color:var(--text-tertiary);margin-bottom:10px;line-height:1.6;">小四→丹一→文杲→攒（后枫槎）/撰（前枫槎）</p>';
  html += '<div class="hfc-tree-viewport" id="hfc-tree-viewport" style="overflow:hidden;position:relative;cursor:grab;border:1px solid rgba(34,197,94,0.15);border-radius:6px;background:var(--bg-secondary);min-height:280px;">';
  html += buildAdminHoufengchaTree();
  html += '</div>';
  html += '<div style="margin-top:6px;font-size:10px;color:var(--text-tertiary);text-align:right;">下枫槎谢氏 · 后枫槎攒公派世系</div>';
  html += '</div></div>';

  html += '</div>'; // close admin-module

  html += '<style>' + getGenealogyTreeCSS() + '</style>';

  area.innerHTML = html;
}

// ===== 族谱管理各世系点击编辑 =====
// 硬编码世系名 → 真实录入数据 id（族谱管理各世系树/表点击人物即编辑）。
// name 匹配姓名；branchPref 用于同名消歧（真实数据存在重名时优先取支系匹配者，如 琰 东山/石马两个）。
// 返回真实 id；真实数据中不存在该姓名返回 0。
function adminLineageNameToId(name, branchPref) {
  if (!name) return 0;
  if (name === '廿一') name = '廿植一'; // 硬编码笔误：真实数据此人为 廿植一
  var data = getData('genealogy');
  var best = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === name) {
      if (branchPref && data[i].branch === branchPref) return data[i].id; // 支系精确匹配直接返回
      if (!best) best = data[i].id;
    }
  }
  return best;
}

// ===== 硬编码世系名 → 真实录入 id 的持久映射（localStorage） =====
// 用途：人物在录入库中改名后 adminLineageNameToId 按名匹配会失败；映射记住历史对应关系，
// 树卡片/折叠表仍能定位到已改名的真实人物（卡片显示新名字）。人物被删除导致 id 失效时自动清除重匹配。
var _lineageIdMapCache = null;
function getLineageIdMap() {
  if (_lineageIdMapCache) return _lineageIdMapCache;
  try { _lineageIdMapCache = JSON.parse(localStorage.getItem('xie_admin_lineage_id_map') || '{}'); }
  catch (e) { _lineageIdMapCache = {}; }
  return _lineageIdMapCache;
}
function adminLineageIdFor(name, branchPref) {
  var key = (branchPref || '') + '::' + (name || '');
  var map = getLineageIdMap();
  if (map[key]) {
    var data = getData('genealogy');
    for (var i = 0; i < data.length; i++) { if (data[i].id === map[key]) return map[key]; }
    delete map[key]; // id 已不存在（人物被删除），清除并重新匹配
    try { localStorage.setItem('xie_admin_lineage_id_map', JSON.stringify(map)); } catch (e) {}
  }
  var id = adminLineageNameToId(name, branchPref);
  if (id) { map[key] = id; try { localStorage.setItem('xie_admin_lineage_id_map', JSON.stringify(map)); } catch (e) {} }
  return id;
}

// 按真实 id 取录入库人物（合成 id 或无记录返回 null），树卡片显示实时姓名用
function adminLivePersonById(id) {
  if (!id) return null;
  var data = getData('genealogy');
  for (var i = 0; i < data.length; i++) { if (data[i].id === id) return data[i]; }
  return null;
}

// 族谱管理保存/删除后原地刷新：保留各世系展开/收起状态与滚动位置，
// 避免整页重建后全部收起/跳回顶部（满足「不刷新即见修改结果」）
function renderGenealogyKeepState() {
  var secs = document.querySelectorAll('.apt-lineage-section');
  var state = {};
  for (var i = 0; i < secs.length; i++) state[secs[i].getAttribute('data-sec')] = secs[i].style.display;
  var sy = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  renderModule('genealogy');
  var secs2 = document.querySelectorAll('.apt-lineage-section');
  for (var j = 0; j < secs2.length; j++) {
    var k = secs2[j].getAttribute('data-sec');
    if (k && state[k]) secs2[j].style.display = state[k];
  }
  if (typeof updateStats === 'function') updateStats();
  setTimeout(function() { window.scrollTo(0, sy); }, 60);
}

// 表格按姓名点击编辑（族谱管理各世系折叠表）
function adminLineageEditByName(name, branchPref) {
  var id = adminLineageIdFor(name, branchPref);
  if (id) showEditForm('genealogy', id);
  else showToast('⚠️ 该人物不在录入数据库中，无法编辑。请先在「世代总览」新增后重试。');
}

// 树卡片点击编辑：合成 id（硬编码世系中尚未录入数据库的人）给出提示，真实 id 打开编辑表单
function adminEditOrNotice(mod, id) {
  var data = getData(mod);
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) { showEditForm(mod, id); return; }
  }
  showToast('⚠️ 该人物不在录入数据库中，无法编辑。请先在「世代总览」新增后重试。');
}

// ===== 族谱管理各世系人物「添加下一代 / 删除此人」=====
// 折叠表人名的 +− 小按钮（样式同树卡片右上角 +−）。name 为硬编码世系名，branchPref 用于同名消歧。
function adminLineageRowActions(name, branchPref) {
  return '<span style="white-space:nowrap;margin-left:3px;">' +
    '<button class="apt-mini-btn apt-mini-add" title="添加下一代" onclick="event.stopPropagation();adminLineageAddChildByName(\'' + name + '\',\'' + (branchPref || '') + '\')">+</button>' +
    '<button class="apt-mini-btn apt-mini-del" title="删除此人" onclick="event.stopPropagation();adminLineageDeleteByName(\'' + name + '\',\'' + (branchPref || '') + '\')">−</button>' +
    '</span>';
}

// 折叠表 ＋：姓名+支系 → 真实 id，打开添加子女表单（预填父亲、自动计算下一代世代）
function adminLineageAddChildByName(name, branchPref) {
  var id = adminLineageIdFor(name, branchPref);
  if (!id) { showToast('⚠️ 该人物不在录入数据库中，无法添加下一代。请先在「世代总览」新增后重试。'); return; }
  showAddChildForm(id);
}

// 折叠表 −：姓名+支系 → 真实 id，删除此人
function adminLineageDeleteByName(name, branchPref) {
  var id = adminLineageIdFor(name, branchPref);
  if (!id) { showToast('⚠️ 该人物不在录入数据库中，无法删除。'); return; }
  if (confirm('确定删除 ' + name + ' 吗？')) deleteItem('genealogy', id);
}

// 树卡片 ＋/−：id 可能是硬编码世系的合成 id（10000+/60000+ 等，尚未录入数据库），
// 先按 id 查真实数据，查不到再按姓名+支系解析，仍无则提示（与 adminEditOrNotice 同一模式）
function adminResolvePersonId(personId, name, branch) {
  var data = getData('genealogy');
  for (var i = 0; i < data.length; i++) { if (data[i].id === personId) return personId; }
  // 精选树人名常带附注（如 宏基(孟献祧)），去后缀再按姓名匹配（同 buildAdminHoufengchaEnhancedData 的 cleanName）
  var clean = String(name || '').replace(/\(.*\)$/, '').replace(/（.*）$/, '');
  return adminLineageIdFor(clean, branch);
}
function adminAddChildFor(personId, name, branch) {
  var realId = adminResolvePersonId(personId, name, branch);
  if (!realId) { showToast('⚠️ 该人物不在录入数据库中，无法添加下一代。请先在「世代总览」新增后重试。'); return; }
  showAddChildForm(realId);
}
function adminDeleteFor(personId, name, branch) {
  var realId = adminResolvePersonId(personId, name, branch);
  if (!realId) { showToast('⚠️ 该人物不在录入数据库中，无法删除。'); return; }
  if (confirm('确定删除 ' + escapeHtml(name) + ' 吗？')) deleteItem('genealogy', realId);
}

// 后台族谱树共享 CSS（renderGenealogy 与 renderGenealogyOverview 共用）
function getGenealogyTreeCSS() {
  return '.apt-split{display:flex;gap:16px;min-height:600px;}' +
    '.apt-left{flex:2;min-width:0;position:relative;border:1px solid var(--glass-border);border-radius:12px;background:var(--bg-card);overflow:hidden;padding:24px 20px;}' +
    '.apt-right{width:320px;min-width:280px;display:flex;flex-direction:column;gap:12px;}' +
    '.apt-tree{display:flex;flex-direction:column;align-items:center;gap:0;}' +
    // 外层 #admin-genealogy-tree 只是容器（内层才是 buildAdminTreeHtml 的树）；它带 apt-tree 类
    // 会按 align-items:center 把 4168px 宽的内层树居中 → offsetLeft 变成负数，整树被推出视口外裁掉。
    // 改为 flex-start：内层树从 x=0 开始，左侧不被裁。
    '#admin-genealogy-tree{align-items:flex-start;width:max-content;}' +
    '.apt-anc-box-enabled{position:relative;padding-top:28px;align-items:flex-start;}' +
    '.apt-anc-box{position:absolute;border:2px dashed #2e7d32;border-radius:12px;pointer-events:none;opacity:0.9;}' +
    '.apt-anc-label{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--bg-secondary);padding:1px 14px;font-size:13px;font-weight:700;color:#2e7d32;letter-spacing:3px;white-space:nowrap;border:1px solid rgba(46,125,50,0.4);border-radius:7px;}' +
    '.apt-card-anc{background:linear-gradient(160deg,#1e5c43,#15402f) !important;border-color:rgba(46,125,50,0.65) !important;}' +
    '.apt-card-anc .apt-name{color:#f0fff7 !important;}' +
    '.apt-card-anc .apt-meta,.apt-card-anc .apt-spouse,.apt-card-anc .apt-children-count{color:#b7dcc8 !important;}' +
    '.apt-card-anc .apt-branch{background:rgba(255,255,255,0.12);color:#d9f2e4;}' +
    '.apt-card-anc .apt-btn-expand{background:#2e7d32;}' +
    '.apt-card-anc .apt-btn-add,.apt-card-anc .apt-btn-del{background:rgba(255,255,255,0.16);color:#eafff5;}' +
    '.apt-shenbo-box{position:absolute;border:2px dashed #9a6a35;border-radius:12px;pointer-events:none;opacity:0.9;}' +
    '.apt-shenbo-label{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--bg-secondary);padding:1px 14px;font-size:13px;font-weight:700;color:#9a6a35;letter-spacing:3px;white-space:nowrap;border:1px solid rgba(154,106,53,0.45);border-radius:7px;}' +
    '.apt-card-shenbo{background:linear-gradient(160deg,#8b5a2b,#5f3d1d) !important;border-color:rgba(139,90,43,0.7) !important;}' +
    '.apt-card-shenbo .apt-name{color:#fdf6ec !important;}' +
    '.apt-card-shenbo .apt-meta,.apt-card-shenbo .apt-spouse,.apt-card-shenbo .apt-children-count{color:#e6cfa9 !important;}' +
    '.apt-card-shenbo .apt-branch{background:rgba(255,255,255,0.12);color:#f2e2c8;}' +
    '.apt-card-shenbo .apt-btn-expand{background:#8b5a2b;}' +
    '.apt-card-shenbo .apt-btn-add,.apt-card-shenbo .apt-btn-del{background:rgba(255,255,255,0.16);color:#f5e6cd;}' +
    // 申伯/申甫 卡：一半墨绿（远古）一半咖啡（申伯世系）
    '.apt-card-anc.apt-card-shenbo{background:linear-gradient(90deg,#1e5c43 0%,#1e5c43 50%,#8b5a2b 50%,#8b5a2b 100%) !important;border-color:rgba(122,90,50,0.7) !important;}' +
    // 始宁东山世系：淡蓝色框 + 淡蓝色卡片
    '.apt-dongshan-box{position:absolute;border:2px dashed #5b8bb5;border-radius:12px;pointer-events:none;opacity:0.9;}' +
    '.apt-dongshan-label{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--bg-secondary);padding:1px 14px;font-size:13px;font-weight:700;color:#4a7ba8;letter-spacing:3px;white-space:nowrap;border:1px solid rgba(91,139,181,0.5);border-radius:7px;}' +
    '.apt-card-dongshan{background:linear-gradient(160deg,#7fb0d6,#5585ab) !important;border-color:rgba(100,155,205,0.7) !important;}' +
    '.apt-card-dongshan .apt-name{color:#f2f8ff !important;}' +
    '.apt-card-dongshan .apt-meta,.apt-card-dongshan .apt-spouse,.apt-card-dongshan .apt-children-count{color:#d5e6f5 !important;}' +
    '.apt-card-dongshan .apt-branch{background:rgba(255,255,255,0.16);color:#e8f3ff;}' +
    '.apt-card-dongshan .apt-btn-expand{background:#5585ab;}' +
    '.apt-card-dongshan .apt-btn-add,.apt-card-dongshan .apt-btn-del{background:rgba(255,255,255,0.18);color:#eef6ff;}' +
    // 缵/衡 卡：一半咖啡（申伯世系）一半淡蓝（始宁东山世系）
    '.apt-card-shenbo.apt-card-dongshan{background:linear-gradient(90deg,#8b5a2b 0%,#8b5a2b 50%,#7fb0d6 50%,#7fb0d6 100%) !important;border-color:rgba(110,140,170,0.7) !important;}' +
    // 临海下渡世系：橙色框 + 橙色卡片
    '.apt-linhai-box{position:absolute;border:2px dashed #d98a3d;border-radius:12px;pointer-events:none;opacity:0.9;}' +
    '.apt-linhai-label{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--bg-secondary);padding:1px 14px;font-size:13px;font-weight:700;color:#c06b1d;letter-spacing:3px;white-space:nowrap;border:1px solid rgba(217,138,61,0.5);border-radius:7px;}' +
    '.apt-card-linhai{background:linear-gradient(160deg,#e8a04e,#c97a2e) !important;border-color:rgba(217,138,61,0.75) !important;}' +
    '.apt-card-linhai .apt-name{color:#fff8ef !important;}' +
    '.apt-card-linhai .apt-meta,.apt-card-linhai .apt-spouse,.apt-card-linhai .apt-children-count{color:#f5e0c3 !important;}' +
    '.apt-card-linhai .apt-branch{background:rgba(255,255,255,0.16);color:#fdeeda;}' +
    '.apt-card-linhai .apt-btn-expand{background:#c97a2e;}' +
    '.apt-card-linhai .apt-btn-add,.apt-card-linhai .apt-btn-del{background:rgba(255,255,255,0.18);color:#fdeeda;}' +
    // 闓 卡：一半淡蓝（始宁东山世系）一半橙色（临海下渡世系）
    '.apt-card-dongshan.apt-card-linhai{background:linear-gradient(90deg,#7fb0d6 0%,#7fb0d6 50%,#e8a04e 50%,#e8a04e 100%) !important;border-color:rgba(170,140,80,0.7) !important;}' +
    // 撰(12) 支：淡绿色卡片（浅底深字，与上方深色祖先链区分）
    '.apt-card-zhuan{background:linear-gradient(160deg,#eaf6e4,#d3ebcb) !important;border-color:rgba(110,180,105,0.7) !important;}' +
    '.apt-card-zhuan .apt-name{color:#2f5d36 !important;}' +
    '.apt-card-zhuan .apt-meta,.apt-card-zhuan .apt-spouse,.apt-card-zhuan .apt-children-count{color:#4a7a4f !important;}' +
    '.apt-card-zhuan .apt-branch{background:rgba(70,140,80,0.14);color:#33623a;}' +
    '.apt-card-zhuan .apt-btn-expand{background:#5aa86a;}' +
    '.apt-card-zhuan .apt-btn-add,.apt-card-zhuan .apt-btn-del{background:rgba(70,140,80,0.2);color:#2f5d36;}' +
    // 攒(13) 支：淡蜜桃/杏色卡片（与撰淡绿同属浅彩系、冷暖互补，两兄弟大支统一又有区分）
    '.apt-card-zan{background:linear-gradient(160deg,#fbeed7,#f2dcb2) !important;border-color:rgba(200,150,80,0.7) !important;}' +
    '.apt-card-zan .apt-name{color:#7a5426 !important;}' +
    '.apt-card-zan .apt-meta,.apt-card-zan .apt-spouse,.apt-card-zan .apt-children-count{color:#96724a !important;}' +
    '.apt-card-zan .apt-branch{background:rgba(190,140,70,0.16);color:#7a5426;}' +
    '.apt-card-zan .apt-btn-expand{background:#d29b52;}' +
    '.apt-card-zan .apt-btn-add,.apt-card-zan .apt-btn-del{background:rgba(190,140,70,0.2);color:#7a5426;}' +
    '.apt-person{display:flex;flex-direction:column;align-items:center;}' +
    // 远古世系简图：整链左对齐到盒内 x=0，避免根人（炎帝）居中撑宽盒子
    '.apt-anc-box-enabled .apt-person{align-items:flex-start;}' +
    '.apt-card{display:inline-flex;flex-direction:column;align-items:center;padding:14px 20px 10px 20px;border-radius:10px;cursor:pointer;border:1.5px solid var(--glass-border);background:var(--glass-bg);min-width:70px;transition:all 0.15s;position:relative;}' +
    '.apt-card-inner{display:flex;flex-direction:column;align-items:center;width:100%;}' +
    '.apt-card-actions{position:absolute;top:2px;right:2px;display:flex;gap:2px;opacity:0;transition:opacity 0.15s;}' +
    '.apt-card:hover .apt-card-actions{opacity:1;}' +
    '.apt-btn-add,.apt-btn-del{width:20px;height:20px;border:none;border-radius:50%;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;padding:0;transition:transform 0.1s;}' +
    '.apt-btn-add:hover,.apt-btn-del:hover{transform:scale(1.2);}' +
    '.apt-btn-add{background:#4a9eff;color:#fff;}' +
    '.apt-btn-del{background:#e74c3c;color:#fff;}' +
    '.apt-mini-btn{display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;border:none;border-radius:4px;font-size:11px;line-height:1;cursor:pointer;font-weight:700;padding:0;margin-left:2px;vertical-align:middle;transition:transform 0.1s;}' +
    '.apt-mini-add{background:#4a9eff;color:#fff;}' +
    '.apt-mini-del{background:#e74c3c;color:#fff;}' +
    '.apt-mini-btn:hover{transform:scale(1.15);}' +
    '.apt-mini-hover .apt-mini-btn{opacity:0;}' +
    '.apt-mini-hover:hover .apt-mini-btn{opacity:1;}' +
    '@media (max-width:767px){.apt-mini-hover .apt-mini-btn,.apt-mini-hover:hover .apt-mini-btn{opacity:1;}}' +
    '.apt-card:hover{border-color:var(--accent-orange);box-shadow:0 2px 8px rgba(251,146,60,0.12);transform:translateY(-1px);}' +
    '.apt-male{border-left:3px solid #4a9eff;}.apt-female{border-left:3px solid #ff6b9d;}' +
    '.apt-ruzhui{border:2px solid #ef4444 !important;background:rgba(239,68,68,0.08) !important;}' +
    '.apt-ruzhui-partner{border:2px solid #f97316 !important;background:rgba(249,115,22,0.06) !important;}' +
    '.apt-name{font-size:15px;font-weight:600;color:var(--text-primary);white-space:nowrap;}' +
    '.apt-adopted-badge{display:inline-block;font-size:9px;font-weight:700;color:#fff;background:#e74c3c;border-radius:3px;padding:0 5px;margin-right:4px;vertical-align:middle;line-height:16px;}' +
    '.apt-meta{font-size:11px;color:var(--text-tertiary);margin-top:2px;}' +
    '.apt-branch{font-size:10px;padding:1px 6px;border-radius:3px;background:var(--accent-orange-dim);color:var(--accent-orange);margin-top:2px;}' +
    '.apt-spouse{font-size:10px;color:var(--text-tertiary);margin-top:2px;opacity:0.7;}' +
    '.apt-mother{font-size:10px;color:#8b5cf6;margin-top:2px;opacity:0.6;}' +
    '.apt-connector{width:2px;height:18px;background:var(--accent-orange);opacity:0.2;margin:0 auto;}' +
    '.apt-children{position:relative;}' +
    '.apt-cards-row{display:flex;gap:6px;position:relative;}' +
    '.apt-hline{position:absolute;top:0;left:6px;right:6px;height:2px;background:var(--accent-orange);opacity:0.15;}' +
    '.apt-child{display:flex;flex-direction:column;align-items:center;position:relative;flex:none;}' +
    '.apt-vline{width:2px;height:12px;background:var(--accent-orange);opacity:0.15;}' +
    '.apt-subs-row{display:block;}' +
    '.apt-sub{position:absolute;top:0;left:0;width:max-content;}' +
    '.apt-sub-bridge{position:absolute;height:2px;background:var(--accent-orange);opacity:0.18;pointer-events:none;}' +
    '.apt-children-wrap{display:block;}' +
    '.apt-btn-expand{width:18px;height:18px;border:none;border-radius:50%;font-size:10px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;background:var(--accent-orange);color:#fff;transition:transform 0.1s;}' +
    '.apt-btn-expand:hover{transform:scale(1.2);}' +
    '.apt-collapsible{cursor:pointer;}' + // 可折叠大支（攒/撰）：点击卡片收起/展开
    '.apt-collapsible:hover .apt-card-inner{border-color:var(--accent-orange);box-shadow:0 0 0 2px rgba(245,158,11,.22);}' +
    '.apt-collapsible .apt-btn-expand{background:#f59e0b;}' +
    '.apt-children-count{font-size:8px;color:var(--text-tertiary);margin-top:2px;opacity:0.5;}' +
    '.apt-tree-filters{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}' +
    '.apt-tree-filters select{padding:6px 10px;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-card);color:var(--text-primary);font-size:12px;}' +
    '.apt-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}' +
    '.apt-stat{background:var(--glass-bg);padding:10px 8px;border-radius:8px;text-align:center;border:1px solid var(--glass-border);}' +
    '.apt-stat-nb{font-size:20px;font-weight:600;color:var(--accent-orange);}' +
    '.apt-stat-lbl{font-size:10px;color:var(--text-tertiary);margin-top:2px;}' +
    '.apt-search{width:100%;padding:8px 14px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;}' +
    '.apt-table-wrap{flex:1;overflow-y:auto;max-height:450px;}' +
    '.apt-tree-toolbar{display:flex;gap:4px;align-items:center;margin-bottom:6px;flex-wrap:wrap;}' +
    '.apt-zoom-btn{width:28px;height:24px;border:1px solid var(--glass-border);border-radius:4px;background:var(--bg-card);color:var(--text-primary);font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;}' +
    '.apt-zoom-btn:hover{background:var(--accent-orange-dim);border-color:var(--accent-orange);}' +
    '.apt-tree-viewport{overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-secondary);min-height:400px;}' +
    '.apt-tree-viewport:active{cursor:grabbing;}' +
    '.apt-tree-viewport .apt-tree{transform-origin:0 0;transition:transform 0.05s;}' +
    '.shenbo-tree-viewport{overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-secondary);min-height:280px;}' +
    '.shenbo-tree-viewport:active{cursor:grabbing;}' +
    '.shenbo-tree-viewport .apt-tree{transform-origin:0 0;transition:transform 0.05s;}' +
    '.dongshan-tree-viewport,.linhai-tree-viewport{overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-secondary);}' +
    '.dongshan-tree-viewport:active,.linhai-tree-viewport:active{cursor:grabbing;}' +
    '.dongshan-tree-viewport .apt-tree,.linhai-tree-viewport .apt-tree,.shima-tree-viewport .apt-tree{transform-origin:0 0;transition:transform 0.05s;}' +
    '.shima-tree-viewport{overflow:hidden;position:relative;cursor:grab;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-secondary);}' +
    '.shima-tree-viewport:active{cursor:grabbing;}' +
    '.apt-tree-fullscreen .apt-right{display:none;}' +
    '.apt-tree-fullscreen .apt-left{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;padding:56px 12px 12px 12px;border-radius:0;overflow:hidden;}' +
    '.apt-tree-fullscreen .apt-tree-viewport{height:calc(100vh - 100px);min-height:0;}' +
    '.apt-tree-fullscreen #apt-fullscreen-btn{background:var(--accent-orange);color:#fff;}' +
    // 少数支系独立角落框（迷你总览 → 点击缩放查看）；position:fixed 钉在视口角落，不随超大树面板滚动消失
    '.apt-dsan-box{position:fixed;right:14px;z-index:40;width:250px;height:168px;background:var(--bg-card);border:1px solid var(--accent-orange);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.22);overflow:hidden;display:flex;flex-direction:column;transition:width .2s ease,height .2s ease;}' +
    '#apt-dsan-box{bottom:14px;}' + // 丹三支系框：右下角
    '#apt-wenju-box{bottom:192px;}' + // 文榘支系框：叠在丹三框上方（14+168+10）
    '.apt-dsan-box:hover{border-color:var(--accent-orange);}' +
    '.apt-dsan-box.dsan-expanded{width:min(820px,86%);height:min(600px,80%);z-index:60;}' +
    '.apt-dsan-box:not(.dsan-expanded){cursor:move;}' + // 迷你态整框可拖（含迷你图区域）
    '.apt-dsan-header{display:flex;align-items:center;gap:6px;padding:5px 10px;font-size:12px;font-weight:600;color:var(--text-primary);background:rgba(0,0,0,.06);border-bottom:1px solid var(--glass-border);cursor:grab;user-select:none;flex:none;touch-action:none;}' +
    '.apt-dsan-header:active{cursor:grabbing;}' +
    '.apt-dsan-header .dsan-drag-icon{color:var(--text-tertiary);font-size:12px;opacity:.75;letter-spacing:-1px;}' +
    '.apt-dsan-header .dsan-count{font-size:10px;font-weight:400;color:var(--text-tertiary);}' +
    '.apt-dsan-header .dsan-toggle-btn{margin-left:auto;font-size:14px;line-height:1;opacity:.8;}' +
    '.apt-dsan-viewport{flex:1;overflow:hidden;position:relative;background:var(--bg-secondary);}' +
    '.apt-dsan-viewport .apt-tree{width:max-content;transform-origin:0 0;}' +
    '.apt-dsan-box:not(.dsan-expanded) .apt-dsan-viewport{pointer-events:none;}' + // 迷你总览不拦截主树操作/不误开编辑；事件穿透由整框拖拽处理
    '.apt-dsan-box.dsan-expanded .apt-dsan-viewport{cursor:grab;}' +
    '.apt-dsan-box.dsan-expanded .apt-dsan-viewport:active{cursor:grabbing;}' +
    '.apt-dsan-resize{position:absolute;right:2px;bottom:2px;width:18px;height:18px;cursor:nwse-resize;z-index:5;display:flex;align-items:flex-end;justify-content:flex-end;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.5);border-radius:4px;touch-action:none;}' +
    '.apt-dsan-resize::after{content:"";width:9px;height:9px;border-right:2px solid #f59e0b;border-bottom:2px solid #f59e0b;border-bottom-right-radius:2px;margin:0 2px 2px 0;}' +
    '.apt-dsan-resize:hover{background:rgba(245,158,11,.25);}' +
    '.apt-dsan-box.cb-dragging,.apt-dsan-box.cb-resizing{transition:none!important;box-shadow:0 12px 34px rgba(0,0,0,.32);}' + // 拖拽/缩放时禁用过渡避免滞后
    '.apt-dsan-box.cb-dragging{border-color:#f59e0b;}' +
    '.apt-nodesc-badge{display:inline-block;font-size:9px;font-weight:700;color:#fff;background:#94a3b8;border-radius:3px;padding:0 5px;margin-right:4px;vertical-align:middle;line-height:16px;}' +
    '.apt-corner-badge{display:inline-block;font-size:9px;font-weight:700;color:#fff;background:#f59e0b;border-radius:3px;padding:0 5px;margin-right:4px;vertical-align:middle;line-height:16px;}' +
    '.apt-link{cursor:pointer;border-bottom:1px dashed var(--accent-orange);transition:color 0.15s;}' +
    '.apt-link:hover{color:var(--accent-orange);}' +
    '';
}

// ===== 树布局：兄弟卡片相邻、子树绝对定位对齐卡片中心（修复横线跨空/守礼左侧无人的长线） =====
function layoutAdminTreePositions() {
  var trees = document.querySelectorAll('.apt-tree');
  for (var t = 0; t < trees.length; t++) {
    // 跳过纯容器树 #admin-genealogy-tree：它带 apt-tree 类只是排版容器，内层 buildAdminTreeHtml 的树
    // 会被单独处理；容器也跑会二次布局 + 重复画 bridge（非幂等）
    if (trees[t].id === 'admin-genealogy-tree') continue;
    var treeEl = trees[t];
    var list = [];
    (function collect(el) {
      for (var i = 0; i < el.children.length; i++) collect(el.children[i]);
      if (el.classList && el.classList.contains('apt-children')) list.push(el);
    })(trees[t]);
    // ★ 修复卡片重叠（晓飞/小康/泽峰/函逸等）：折叠支（攒/撰/彬/乾）折叠时 display:none，
    // 布局会把其内部 .apt-children 写成 0/2px 固定宽；展开后残留窄宽钳制 flex 卡片行容器
    // → 卡片 108px 溢出但容器仍窄、offsetWidth 读到窄值 → 永久锁死 → 平行支重叠。
    // 先释放所有残留固定宽（含 v92 紧凑布局写的卡槽宽），让 flex 回到自然宽度，再自底向上重算。
    for (var z = 0; z < list.length; z++) {
      list[z].style.width = '';
      // v92 紧凑布局给 .apt-child 槽位写过 width=max(卡宽,子树宽)，折叠后子树消失，
      // 若槽位宽残留会撑大层宽 → 一并释放回自然卡宽。
      for (var s = 0; s < list[z].children.length; s++) {
        var _cc2 = list[z].children[s];
        if (!_cc2.classList || !_cc2.classList.contains('apt-cards-row')) continue;
        for (var s2 = 0; s2 < _cc2.children.length; s2++) {
          if (_cc2.children[s2].classList && _cc2.children[s2].classList.contains('apt-child')) _cc2.children[s2].style.width = '';
        }
      }
    }
    // 清理上一轮画出的斜线 bridge（v91 及更早版本的 drawSubBridge 产物），并恢复被它隐藏的 connector
    treeEl.querySelectorAll('.apt-sub-bridge').forEach(function(b){ b.remove(); });
    treeEl.querySelectorAll('.apt-connector').forEach(function(c){ c.style.display = ''; });
    // collect 是后序（叶子先、根最后），正序遍历 = 自底向上，保证子块宽/高已定再算父层
    // ★ v92 紧凑树布局：兄弟卡槽宽度 = max(卡宽, 子树宽)，卡片在槽内居中（.apt-child 已是
    // flex column center）→ 每张卡片居中于自己的子树列；子树垂直对齐到卡槽下方、与卡片同中心。
    // 递归后父卡自然居中于其全部子女列之上。`.apt-connector/.apt-hline/.apt-vline` 三段在卡片与
    // 子树对齐后天然构成直角折线（父卡↓竖线→横线→子卡↓竖线），不再需要 drawSubBridge 斜线。
    for (var k = 0; k < list.length; k++) {
      var ch = list[k];
      var cardsRow = null, subsRow = null;
      for (var j = 0; j < ch.children.length; j++) {
        var cc = ch.children[j];
        if (cc.classList.contains('apt-cards-row')) cardsRow = cc;
        else if (cc.classList.contains('apt-subs-row')) subsRow = cc;
      }
      if (!cardsRow || !subsRow) continue;
      var slots = cardsRow.querySelectorAll(':scope > .apt-child');
      var subs = subsRow.querySelectorAll(':scope > .apt-sub');
      if (!slots.length) continue;
      var n = Math.min(slots.length, subs.length);
      // 先测每个卡槽自然宽 + 对应子树宽（折叠 display:none 的 sub 宽=0 → 槽位保持卡宽）
      var slotW = [], subW = [];
      for (var i = 0; i < n; i++) {
        slotW.push(slots[i].offsetWidth);
        subW.push(subs[i].offsetWidth);
      }
      // 槽位扩宽到 max(卡宽, 子树宽)：卡片居中于槽位 = 居中于子树列；兄弟槽位并排不重叠
      for (var i = 0; i < n; i++) {
        var need = Math.max(slotW[i], subW[i]);
        slots[i].style.width = need + 'px';
      }
      // 子树垂直对齐到各自卡槽下方：宽子卡左对齐槽位（sub 顶满整列），窄子卡在槽内居中，
      // 使 sub 内 connector 的 margin:0 auto 与卡片中心对齐
      var maxH = 0;
      for (var i = 0; i < n; i++) {
        var left = slots[i].offsetLeft;
        var need = Math.max(slotW[i], subW[i]);
        subs[i].style.left = (left + (need - subW[i]) / 2) + 'px';
        // .apt-sub 绝对定位的包含块是 .apt-children（subsRow 非定位），top 须按 subsRow 偏移压到卡片行下方
        subs[i].style.top = subsRow.offsetTop + 'px';
        if (subs[i].offsetHeight > maxH) maxH = subs[i].offsetHeight;
      }
      ch.style.width = cardsRow.offsetWidth + 'px';
      subsRow.style.height = maxH + 'px';
      // 横线覆盖整个卡片行（槽位已并排，整行即首卡→末卡范围）
      var hline = cardsRow.querySelector(':scope > .apt-hline');
      if (hline) {
        hline.style.left = '0px';
        hline.style.width = cardsRow.offsetWidth + 'px';
      }
    }
    // 根 person（ancBox 树 CSS 是 align-items:flex-start）卡片在左缘、connector 居中于整列 → 错位；
    // 改为居中，使根卡与其子树列（及 connector）同中心，与紧凑树对齐
    var rootPersons = treeEl.querySelectorAll(':scope > .apt-person');
    for (var rp = 0; rp < rootPersons.length; rp++) {
      rootPersons[rp].style.alignItems = 'center';
    }
    // 远古世系方框：围住 炎帝→申伯/申甫 的卡片并标注「谢氏远古世系简图」
    var ancBox = treeEl.querySelector(':scope > .apt-anc-box');
    if (ancBox) {
      var ancCards = treeEl.querySelectorAll('.apt-card-anc');
      var tr = treeEl.getBoundingClientRect();
      var sc = (tr.width && treeEl.offsetWidth) ? tr.width / treeEl.offsetWidth : 1;
      var mL = 1e9, mT = 1e9, mR = -1e9, mB = -1e9;
      for (var a = 0; a < ancCards.length; a++) {
        var rr = ancCards[a].getBoundingClientRect();
        if (!rr.width && !rr.height) continue; // 折叠隐藏的卡片跳过
        if (rr.left < mL) mL = rr.left;
        if (rr.top < mT) mT = rr.top;
        if (rr.right > mR) mR = rr.right;
        if (rr.bottom > mB) mB = rr.bottom;
      }
      if (mL < 1e8) {
        ancBox.style.left = ((mL - tr.left) / sc - 12) + 'px';
        ancBox.style.top = ((mT - tr.top) / sc - 8) + 'px';
        ancBox.style.width = ((mR - mL) / sc + 24) + 'px';
        ancBox.style.height = ((mB - mT) / sc + 24) + 'px';
      }
    }
    // 申伯世系方框：围住 申伯/申甫→衡 的咖啡色卡片并标注「申伯世系示意图」
    var shenboBox = treeEl.querySelector(':scope > .apt-shenbo-box');
    if (shenboBox) {
      var sbCards = treeEl.querySelectorAll('.apt-card-shenbo');
      var sTr = treeEl.getBoundingClientRect();
      var sSc = (sTr.width && treeEl.offsetWidth) ? sTr.width / treeEl.offsetWidth : 1;
      var sML = 1e9, sMT = 1e9, sMR = -1e9, sMB = -1e9;
      for (var sb = 0; sb < sbCards.length; sb++) {
        var sbr = sbCards[sb].getBoundingClientRect();
        if (!sbr.width && !sbr.height) continue; // 折叠隐藏的卡片跳过
        if (sbr.left < sML) sML = sbr.left;
        if (sbr.top < sMT) sMT = sbr.top;
        if (sbr.right > sMR) sMR = sbr.right;
        if (sbr.bottom > sMB) sMB = sbr.bottom;
      }
      if (sML < 1e8) {
        shenboBox.style.left = ((sML - sTr.left) / sSc - 12) + 'px';
        shenboBox.style.top = ((sMT - sTr.top) / sSc - 8) + 'px';
        shenboBox.style.width = ((sMR - sML) / sSc + 24) + 'px';
        shenboBox.style.height = ((sMB - sMT) / sSc + 24) + 'px';
      }
    }
    // 始宁东山世系方框：围住 缵/衡→闓 的淡蓝色卡片并标注「始宁东山世系示意图」
    var dongshanBox = treeEl.querySelector(':scope > .apt-dongshan-box');
    if (dongshanBox) {
      var dsCards = treeEl.querySelectorAll('.apt-card-dongshan');
      var dTr = treeEl.getBoundingClientRect();
      var dSc = (dTr.width && treeEl.offsetWidth) ? dTr.width / treeEl.offsetWidth : 1;
      var dML = 1e9, dMT = 1e9, dMR = -1e9, dMB = -1e9;
      for (var db = 0; db < dsCards.length; db++) {
        var dbr = dsCards[db].getBoundingClientRect();
        if (!dbr.width && !dbr.height) continue; // 折叠隐藏的卡片跳过
        if (dbr.left < dML) dML = dbr.left;
        if (dbr.top < dMT) dMT = dbr.top;
        if (dbr.right > dMR) dMR = dbr.right;
        if (dbr.bottom > dMB) dMB = dbr.bottom;
      }
      if (dML < 1e8) {
        dongshanBox.style.left = ((dML - dTr.left) / dSc - 12) + 'px';
        dongshanBox.style.top = ((dMT - dTr.top) / dSc - 8) + 'px';
        dongshanBox.style.width = ((dMR - dML) / dSc + 24) + 'px';
        dongshanBox.style.height = ((dMB - dMT) / dSc + 24) + 'px';
      }
    }
    // 临海下渡世系方框：围住 闓→大四/小四 的橙色卡片并标注「临海下渡世系示意图」
    var linhaiBox = treeEl.querySelector(':scope > .apt-linhai-box');
    if (linhaiBox) {
      var lhCards = treeEl.querySelectorAll('.apt-card-linhai');
      var lTr = treeEl.getBoundingClientRect();
      var lSc = (lTr.width && treeEl.offsetWidth) ? lTr.width / treeEl.offsetWidth : 1;
      var lML = 1e9, lMT = 1e9, lMR = -1e9, lMB = -1e9;
      for (var lb = 0; lb < lhCards.length; lb++) {
        var lbr = lhCards[lb].getBoundingClientRect();
        if (!lbr.width && !lbr.height) continue; // 折叠隐藏的卡片跳过
        if (lbr.left < lML) lML = lbr.left;
        if (lbr.top < lMT) lMT = lbr.top;
        if (lbr.right > lMR) lMR = lbr.right;
        if (lbr.bottom > lMB) lMB = lbr.bottom;
      }
      if (lML < 1e8) {
        linhaiBox.style.left = ((lML - lTr.left) / lSc - 12) + 'px';
        linhaiBox.style.top = ((lMT - lTr.top) / lSc - 8) + 'px';
        linhaiBox.style.width = ((lMR - lML) / lSc + 24) + 'px';
        linhaiBox.style.height = ((lMB - lMT) / lSc + 24) + 'px';
      }
    }
  }
}

function scheduleAptLayout() {
  if (window._aptLayoutRaf) return;
  window._aptLayoutRaf = requestAnimationFrame(function() {
    window._aptLayoutRaf = null;
    layoutAdminTreePositions();
  });
}

// 树 HTML 渲染完成后自动触发一次布局（一次性 innerHTML 插入 → 一次 rAF）
(function initAptLayoutObserver() {
  if (window._aptLayoutObserver) return;
  function hasAptTree(n) {
    if (!n || n.nodeType !== 1) return false;
    if (n.classList && (n.classList.contains('apt-tree') || n.classList.contains('apt-children'))) return true;
    return !!(n.querySelector && n.querySelector('.apt-tree, .apt-children'));
  }
  try {
    var mo = new MutationObserver(function(muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        for (var j = 0; j < m.addedNodes.length; j++) {
          if (hasAptTree(m.addedNodes[j])) {
            scheduleAptLayout();
            return;
          }
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window._aptLayoutObserver = mo;
  } catch (e) {}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleAptLayout);
  } else {
    scheduleAptLayout();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() { scheduleAptLayout(); });
  }
})();

// ===== 全部世代总览 · 独立模块（完整族谱树 + 编辑管理） =====
function renderGenealogyOverview(area) {
  // ⚠️ 世代总览必须完全基于后台录入的数据（getData('genealogy')），
  // 用户通过族谱管理录入/编辑后，树、统计、表格实时反映，不能再用硬编码世系数据。
  var allData = getData('genealogy');
  allData.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0); });
  var data = allData;
  // —— 主区域只展示丹一后代：丹三(1210)及其全部后代收进角落小框；
  // 丹二(1209)数据中无后代，保留「无后」标记；右侧统计/表格仍用全量数据。
  // 少数支系（丹三支 1210 / 文榘支 1211）收进独立角落框，主区域只保留主干大支，减少整体结构庞大与页面宽度。
  // 两个支系本人（丹三/文榘）保留在主区域父辈名下（否则会以为小四只有两个儿子 / 丹一只有一个儿子）。
  var dsanAllIds = collectOverviewSubtree(1210, allData);
  var wenjuAllIds = collectOverviewSubtree(1211, allData);
  var boxedIds = {};
  [1210, 1211].forEach(function(root) {
    var ids = (root === 1210) ? dsanAllIds : wenjuAllIds;
    for (var dk in ids) { if (+dk !== root) boxedIds[dk] = true; }
  });
  var mainData = allData.filter(function(p) { return !boxedIds[p.id]; });
  var dsanData = allData.filter(function(p) { return dsanAllIds[p.id]; });
  var wenjuData = allData.filter(function(p) { return wenjuAllIds[p.id]; });

  var gens = {};
  var branchSet = {};
  // ⚠️ 六大录入分区（远古/申伯/始宁东山/临海下度/石马下谢/本宗世系·后枫槎）都计入支系，
  // 只排除细枝末节分支
  var skipBranches = ['长房', '二房', '三房', '四房', '后枫椿', '前枫椿', '枫椿分支', '前枫槎派', '后枫槎东房', '枫槎始祖'];
  allData.forEach(function(p) {
    var g = p.generation_num || 0;
    gens[g] = (gens[g] || 0) + 1;
    if (p.branch && p.branch !== '—' && skipBranches.indexOf(p.branch) < 0) branchSet[p.branch] = true;
  });

  var html = '<div class="admin-module">';
  html += '<div class="admin-module-header">';
  html += '<h3>🌳 世代总览</h3>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  html += '<button class="btn btn-accent btn-sm" onclick="showAddForm(\'genealogy\')">+ 新增人员</button>';
  html += '<button class="btn btn-sm" onclick="exportGenealogyCSV()">📥 导出CSV</button>';
  html += '<button class="btn btn-sm" onclick="document.getElementById(\'csv-import-input\').click()">📤 导入CSV</button>';
  html += '<input type="file" id="csv-import-input" accept=".csv" style="display:none" onchange="importGenealogyCSV(this)">';
  html += '<button class="btn btn-sm" onclick="generateGenealogyBook()">📖 生成谱书</button>';
  html += '<button class="btn btn-sm" onclick="window.open(\'../pages/genealogy.html\', \'_blank\')" style="padding:8px 16px;">🔗 预览世系图</button>';
  html += '</div></div>';

  // ===== 全部世代总览 =====
  html += '<div style="margin-top:16px;padding:16px 18px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">';
  html += '<span style="font-size:16px;">📋</span>';
  html += '<span style="font-size:14px;font-weight:600;color:var(--text-primary);">全部世代总览</span>';
  html += '<span style="font-size:11px;color:var(--text-tertiary);">— 完整族谱树 · 编辑管理</span>';
  html += '</div>';

  // Split layout: left = tree, right = table
  html += '<div class="apt-split">';

  // ===== LEFT: Tree =====
  html += '<div class="apt-left">';
  html += '<div class="apt-tree-filters">';
  html += '<select id="tree-filter-gen" onchange="renderGenealogyTree()"><option value="">世代筛选（全部）</option>';
  var genKeys = Object.keys(gens).map(Number).sort(function(a, b) { return a - b; });
  for (var gk = 0; gk < genKeys.length; gk++) {
    var g = genKeys[gk];
    if (gens[g]) html += '<option value="' + g + '">' + g + '世 (' + gens[g] + '人)</option>';
  }
  html += '</select>';
  html += '</div>';
  html += '<div class="apt-tree-toolbar">';
  html += '<button class="apt-zoom-btn" onclick="zoomTree(1.2)" title="放大">🔍+</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomTree(0.8)" title="缩小">🔍−</button>';
  html += '<button class="apt-zoom-btn" onclick="zoomTree(1)" title="重置">⟲</button>';
  html += '<button class="apt-zoom-btn" onclick="fitTree()" title="适应屏幕">⊞</button>';
  html += '<span style="font-size:11px;color:var(--text-tertiary);margin-left:4px;" id="apt-zoom-level">100%</span>';
  html += '<span style="flex:1;"></span>';
  html += '<button class="apt-zoom-btn" onclick="toggleTreeFullscreen()" title="全屏编辑" id="apt-fullscreen-btn" style="font-size:13px;">⛶</button>';
  html += '</div>';
  html += '<div class="apt-tree-viewport" id="apt-tree-viewport">';
  html += '<div class="apt-tree" id="admin-genealogy-tree">';
  html += buildAdminTreeHtml(mainData, {ancBox: true, hideBranch: true, noDescIds: {1209: true}, cornerIds: {1210: true, 1211: true}, collapsedIds: {12: true, 59: true, 60: true}, collapsibleIds: {12: true, 13: true, 59: true, 60: true}});
  html += '</div>';
  html += '</div>';
  // 少数支系独立角落框（迷你总览 → 点击缩放查看）：丹三支 + 文榘支
  html += buildCornerBoxHtml('apt-dsan-box', '丹三支系', dsanData);
  html += buildCornerBoxHtml('apt-wenju-box', '文榘支系', wenjuData);
  html += '</div>';

  // ===== RIGHT: Stats + search + table =====
  html += '<div class="apt-right">';

  // Stats
  html += '<div class="apt-stats">';
  html += '<div class="apt-stat"><div class="apt-stat-nb">' + data.length + '</div><div class="apt-stat-lbl">总人数</div></div>';
  html += '<div class="apt-stat"><div class="apt-stat-nb">' + Object.keys(gens).length + '</div><div class="apt-stat-lbl">世代</div></div>';
  html += '<div class="apt-stat"><div class="apt-stat-nb">' + Object.keys(branchSet).length + '</div><div class="apt-stat-lbl">支系</div></div>';
  html += '</div>';

  // Search
  html += '<input type="text" id="genealogy-admin-search" class="apt-search" placeholder="搜索姓名、字辈..." oninput="filterGenealogyTable()">';

  // Table
  html += '<div class="apt-table-wrap"><table class="admin-table">';
  html += '<thead><tr><th>姓名</th><th>性别</th><th>世代</th><th>支系</th><th>配偶</th><th style="width:90px;">操作</th></tr></thead><tbody>';

  for (var i = 0; i < data.length; i++) {
    var p = data[i];
    var spouseTxt = p.spouse_ids ? p.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; }).join('、') : '—';
    if (!spouseTxt) spouseTxt = '—';

    html += '<tr data-search="' + escapeHtml((p.name||'') + (p.generation||'') + (p.branch||'')) + '">';
    html += '<td><strong>' + escapeHtml(p.name) + '</strong></td>';
    html += '<td>' + (p.gender || '—') + '</td>';
    html += '<td>' + (p.generation_num || '—') + '</td>';
    html += '<td>' + (p.branch || '—') + '</td>';
    html += '<td style="font-size:12px;">' + escapeHtml(spouseTxt) + '</td>';
    html += '<td style="white-space:nowrap;">';
    html += '<button class="btn-sm" onclick="showEditForm(\'genealogy\',' + p.id + ')" title="编辑">✏️</button> ';
    html += '<button class="btn-sm btn-danger" onclick="deleteItem(\'genealogy\',' + p.id + ')" title="删除">🗑️</button> ';
    html += '<button class="btn-sm" onclick="showAddChildForm(' + p.id + ')" title="添加子女" style="font-size:11px;">👶</button> ';
    html += '<button class="btn-sm" onclick="showAddSiblingForm(' + p.id + ')" title="添加兄弟" style="font-size:11px;">👥</button>';
    html += '</td></tr>';
  }

  html += '</tbody></table></div>'; // close table, table-wrap
  html += '</div>'; // close apt-right
  html += '</div>'; // close apt-split
  html += '</div>'; // close 全部世代总览 container
  html += '</div>'; // close admin-module

  html += '<style>' + getGenealogyTreeCSS() + '</style>';

  area.innerHTML = html;
  // 各角落框：等布局算完自然尺寸后缩成迷你图；绑定缩放/平移
  setTimeout(function() { initCornerBoxControls('apt-dsan-box'); initCornerPanZoom('apt-dsan-box'); fitCornerMini('apt-dsan-box'); initCornerBoxControls('apt-wenju-box'); initCornerPanZoom('apt-wenju-box'); fitCornerMini('apt-wenju-box'); }, 150);
}

function filterGenealogyTable() {
  var q = document.getElementById('genealogy-admin-search').value.trim().toLowerCase();
  var rows = document.querySelectorAll('.admin-table tbody tr');
  var match = [], hide = [];
  rows.forEach(function(r) {
    if (!q || r.getAttribute('data-search').toLowerCase().indexOf(q) !== -1) {
      match.push(r);
    } else {
      hide.push(r);
    }
  });
  if (!window.anime) {
    rows.forEach(function(r) { r.style.display = match.indexOf(r) !== -1 ? '' : 'none'; });
    return;
  }
  // Hide non-matching: slide out + fade
  if (hide.length) {
    anime({
      targets: hide,
      opacity: [1, 0],
      translateX: [0, 20],
      duration: 150,
      easing: 'easeIn',
      complete: function () {
        hide.forEach(function(r) { r.style.display = 'none'; anime.set(r, { opacity: 1, translateX: 0 }); });
      }
    });
  }
  // Show matching: slide in + fade (staggered)
  if (match.length) {
    match.forEach(function(r) { r.style.display = ''; });
    anime.set(match, { opacity: 0, translateX: -16 });
    anime({
      targets: match,
      opacity: [0, 1],
      translateX: [-16, 0],
      duration: 250,
      delay: anime.stagger(30),
      easing: 'easeOut'
    });
  }
}

// ===== CSV Export/Import =====
function exportGenealogyCSV() {
  var data = getData('genealogy');
  if (!data || data.length === 0) {
    showToast('没有数据可导出');
    return;
  }
  // Fields to export (skip id, keep the rest)
  var fields = ['name','gender','generation_num','generation','father_id','mother_id','spouse_ids','branch','birth_date','death_date','is_alive','adopted','address','biography'];
  var headers = ['姓名','性别','世代数','字辈','父亲ID','母亲ID','配偶','支系','出生','逝世','是否在世','过继','居住地','生平简介'];

  var csv = '﻿'; // BOM for Excel UTF-8
  csv += headers.join(',') + '\n';
  data.forEach(function(p) {
    var row = fields.map(function(key) {
      var val = (p[key] !== undefined && p[key] !== null) ? String(p[key]) : '';
      // Escape quotes and wrap in quotes if contains comma or quote
      if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    csv += row.join(',') + '\n';
  });

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = '下枫槎谢氏族谱_' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('导出成功');
}

function importGenealogyCSV(input) {
  var file = input.files[0];
  if (!file) { showToast('请选择文件'); return; }

  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var text = e.target.result;
      // Remove BOM if present
      if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

      var lines = text.split(/\r?\n/).filter(function(l) { return l.trim(); });
      if (lines.length < 2) { showToast('CSV文件格式错误：至少需要标题行+1行数据'); return; }

      // Parse header
      var headerLine = lines[0];
      var headers = parseCSVLine(headerLine);
      var fieldMap = {
        '姓名':'name','性别':'gender','世代数':'generation_num','字辈':'generation',
        '父亲ID':'father_id','母亲ID':'mother_id','配偶':'spouse_ids','支系':'branch',
        '出生':'birth_date','逝世':'death_date','是否在世':'is_alive','过继':'adopted',
        '居住地':'address','生平简介':'biography',
        'name':'name','gender':'gender','generation_num':'generation_num','generation':'generation',
        'father_id':'father_id','mother_id':'mother_id','spouse_ids':'spouse_ids','branch':'branch',
        'birth_date':'birth_date','death_date':'death_date','is_alive':'is_alive','adopted':'adopted',
        'address':'address','biography':'biography'
      };

      // Map headers to fields
      var fieldIdx = headers.map(function(h) { return fieldMap[h.trim()] || null; });

      var existingData = getData('genealogy');
      var maxId = existingData.reduce(function(m, p) { return Math.max(m, p.id || 0); }, 0);
      var imported = 0;

      for (var i = 1; i < lines.length; i++) {
        var vals = parseCSVLine(lines[i]);
        var person = {};
        var hasData = false;
        fieldIdx.forEach(function(field, idx) {
          if (field && idx < vals.length) {
            var v = vals[idx].trim();
            if (v) {
              if (field === 'generation_num' || field === 'father_id' || field === 'mother_id') {
                person[field] = v === '' ? null : parseInt(v);
              } else {
                person[field] = v;
              }
              hasData = true;
            }
          }
        });
        if (!hasData || !person.name) continue;
        maxId++;
        person.id = maxId;
        existingData.push(person);
        imported++;
      }

      if (imported > 0) {
        saveData('genealogy', existingData);
        renderModule('genealogy');
        showToast('成功导入 ' + imported + ' 条记录');
      } else {
        showToast('没有找到可导入的数据（请确保有"姓名"列）');
      }
    } catch(err) {
      showToast('导入失败: ' + err.message);
    }
    input.value = '';
  };
  reader.readAsText(file);
}

function parseCSVLine(line) {
  var result = [];
  var current = '';
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i+1] === '"') {
        current += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        current += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        result.push(current);
        current = '';
      } else {
        current += c;
      }
    }
  }
  result.push(current);
  return result;
}

// ===== Toast notification =====
function showToast(msg) {
  var existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:40px;left:50%;transform:translateX(-50%);background:var(--accent-orange);color:#000;padding:10px 28px;border-radius:8px;font-size:14px;font-weight:500;z-index:10000;box-shadow:0 4px 20px rgba(0,0,0,0.3);opacity:0;transition:opacity 0.3s;';
  document.body.appendChild(toast);
  requestAnimationFrame(function() { toast.style.opacity = '1'; });
  setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 2000);
}

// ===== Forms =====
function showAddForm(mod) {
  var m = MODULES[mod];
  if (!m) return;
  showForm(mod, m, null);
}

// 从族谱树直接添加子女，预填父亲并自动计算世代数
function showAddChildForm(fatherId) {
  showForm('genealogy', MODULES['genealogy'], null);
  if (!fatherId) return;

  var fatherSelect = document.getElementById('field-father_id');
  if (fatherSelect) {
    fatherSelect.value = fatherId;
    // 父亲不在下拉前500选项里（按世代排序超上限）时手动补一个选项，
    // 否则 value 设置静默失败，子女无法挂到父亲名下（各世系远代人物多超此上限）
    if (String(fatherSelect.value) !== String(fatherId)) {
      var d2 = getData('genealogy');
      for (var j = 0; j < d2.length; j++) {
        if (d2[j].id === fatherId) {
          var sep = document.createElement('option');
          sep.disabled = true; sep.text = '─ 当前选择 ─';
          sep.style.fontSize = '11px'; sep.style.color = 'var(--text-tertiary)';
          var opt = document.createElement('option');
          opt.value = fatherId;
          opt.text = '[' + (d2[j].generation_num || '?') + '世] ' + d2[j].name;
          opt.selected = true;
          fatherSelect.insertBefore(sep, fatherSelect.options[1] || null);
          fatherSelect.insertBefore(opt, sep);
          fatherSelect.value = fatherId;
          break;
        }
      }
    }
    if (typeof genealogyUpdateMother === 'function') genealogyUpdateMother();
  }

  // 自动填写世代数 = 父亲世代 + 1
  var data = getData('genealogy');
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === fatherId) {
      var genInput = document.getElementById('field-generation_num');
      if (genInput) {
        genInput.value = (parseInt(data[i].generation_num) || 0) + 1;
        genInput.setAttribute('readonly', true);
        genInput.style.background = 'var(--glass-bg)';
        genInput.style.opacity = '0.7';
        genInput.title = '自动计算（父 ' + data[i].generation_num + '世 + 1）';
      }
      break;
    }
  }
}

function showEditForm(mod, id) {
  var m = MODULES[mod];
  if (!m) return;
  var data = getData(mod);
  var item = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) { item = data[i]; break; }
  }
  if (!item) return;
  showForm(mod, m, item);
}

// 快速添加兄弟：预填父亲ID和世代
function showAddSiblingForm(siblingId) {
  var data = getData('genealogy');
  var sibling = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === siblingId) { sibling = data[i]; break; }
  }
  if (!sibling) return;

  showForm('genealogy', MODULES['genealogy'], null);
  setTimeout(function() {
    if (sibling.father_id) {
      var fatherSelect = document.getElementById('field-father_id');
      if (fatherSelect) fatherSelect.value = sibling.father_id;
    }
    var genInput = document.getElementById('field-generation_num');
    if (genInput && sibling.generation_num) {
      genInput.value = sibling.generation_num;
    }
    var branchSelect = document.getElementById('field-branch');
    if (branchSelect && sibling.branch) branchSelect.value = sibling.branch;
  }, 100);
}

// 快速添加配偶
function showAddSpouseForm(personId) {
  var data = getData('genealogy');
  var person = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === personId) { person = data[i]; break; }
  }
  if (!person) return;

  showForm('genealogy', MODULES['genealogy'], null);
  setTimeout(function() {
    var genInput = document.getElementById('field-generation_num');
    if (genInput && person.generation_num) genInput.value = person.generation_num;
    var genderSelect = document.getElementById('field-gender');
    if (genderSelect) genderSelect.value = '女';
    // Fill spouse back-reference
    var nameInput = document.getElementById('field-name');
    if (nameInput) nameInput.placeholder = person.name + '之配偶';
  }, 100);
}

// ===== Genealogy form helpers (分组表单) =====
function getFieldDef(moduleDef, key) {
  for (var i = 0; i < moduleDef.fields.length; i++) {
    if (moduleDef.fields[i].key === key) return moduleDef.fields[i];
  }
  return null;
}

function renderGenealogyFieldHtml(mod, m, key, item) {
  var f = getFieldDef(m, key);
  if (!f) return '';
  var isEdit = item !== null;
  var val = isEdit ? (item[f.key] || '') : '';
  var html = '<div class="form-group">';
  html += '<label>' + f.label + (f.required ? ' *' : '') + '</label>';

  if (mod === 'genealogy' && f.key === 'father_id') {
    var allPeople = getData('genealogy');
    var currentId = parseInt(val);
    html += '<select id="field-father_id" onchange="genealogyUpdateMother()" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;">';
    html += '<option value="">— 请选择 —</option>';
    var males = [];
    for (var gi = 0; gi < allPeople.length; gi++) {
      if (isEdit && allPeople[gi].id === item.id) continue;
      if (allPeople[gi].gender === '男') males.push(allPeople[gi]);
    }
    males.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0) || (a.name || '').localeCompare(b.name || ''); });
    var maxOpt = Math.min(males.length, 500);
    for (var gi2 = 0; gi2 < maxOpt; gi2++) {
      var sel = currentId === males[gi2].id;
      html += '<option value="' + males[gi2].id + '"' + (sel ? ' selected' : '') + '>[' + (males[gi2].generation_num || '?') + '世] ' + escapeHtml(males[gi2].name) + '</option>';
    }
    if (males.length > 500) {
      html += '<option disabled style="font-size:11px;color:var(--text-tertiary);">⋯ 共' + males.length + '人，仅显示前500人 ⋯</option>';
    }
    if (currentId && !males.slice(0,500).some(function(m){return m.id===currentId;})) {
      for (var ci2 = 0; ci2 < allPeople.length; ci2++) {
        if (allPeople[ci2].id === currentId) {
          html += '<option disabled style="font-size:11px;color:var(--text-tertiary);border-top:1px solid var(--divider);">─ 当前选择 ─</option>';
          html += '<option value="' + currentId + '" selected>[' + (allPeople[ci2].generation_num || '?') + '世] ' + escapeHtml(allPeople[ci2].name) + '</option>';
          break;
        }
      }
    }
    if (currentId) {
      var inList = males.some(function(m) { return m.id === currentId; });
      if (!inList) {
        for (var ci2 = 0; ci2 < allPeople.length; ci2++) {
          if (allPeople[ci2].id === currentId) {
            html += '<option disabled style="font-size:11px;color:var(--text-tertiary);border-top:1px solid var(--divider);">─ 其他（过继/特殊） ─</option>';
            html += '<option value="' + currentId + '" selected>[' + (allPeople[ci2].generation_num || '?') + '世] ' + escapeHtml(allPeople[ci2].name) + ' ⚠️</option>';
            break;
          }
        }
      }
    }
    html += '</select>';
  } else if (mod === 'genealogy' && f.key === 'mother_id') {
    var allPeople = getData('genealogy');
    var currentMotherVal = val;
    var currentMotherId = parseInt(val);
    var fatherId = isEdit ? parseInt(item.father_id) : 0;
    var fatherPerson = null;
    var recommendedMothers = [];
    if (fatherId) {
      for (var fi = 0; fi < allPeople.length; fi++) {
        if (allPeople[fi].id === fatherId) { fatherPerson = allPeople[fi]; break; }
      }
      if (fatherPerson && fatherPerson.spouse_ids) {
        var spouseNames = fatherPerson.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
        spouseNames.forEach(function(nm) {
          for (var fi2 = 0; fi2 < allPeople.length; fi2++) {
            if (allPeople[fi2].name === nm && allPeople[fi2].gender === '女') {
              recommendedMothers.push(allPeople[fi2]);
            }
          }
        });
      }
    }
    var unmatchedSpouseNames = [];
    if (fatherPerson && fatherPerson.spouse_ids) {
      var allSpos = fatherPerson.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
      allSpos.forEach(function(nm) {
        var found = false;
        for (var ri = 0; ri < recommendedMothers.length; ri++) {
          if (recommendedMothers[ri].name === nm) { found = true; break; }
        }
        if (!found) unmatchedSpouseNames.push(nm);
      });
    }

    html += '<select id="field-mother_id" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;">';
    html += '<option value="">— 请选择 —</option>';
    if (recommendedMothers.length > 0 || unmatchedSpouseNames.length > 0) {
      html += '<optgroup label="▼ 父亲配偶">';
      recommendedMothers.forEach(function(m) {
        html += '<option value="' + m.id + '"' + (currentMotherId === m.id ? ' selected' : '') + '>[' + (m.generation_num || '?') + '世] ' + escapeHtml(m.name) + '</option>';
      });
      unmatchedSpouseNames.forEach(function(nm) {
        html += '<option value="" disabled style="color:var(--text-tertiary);font-style:italic;">⚠️ ' + escapeHtml(nm) + '（尚未建档，请先添加此人）</option>';
      });
      html += '</optgroup>';
    }
    html += '<optgroup label="▼ 所有女性">';
    var females = [];
    for (var fi3 = 0; fi3 < allPeople.length; fi3++) {
      if (allPeople[fi3].gender === '女') females.push(allPeople[fi3]);
    }
    females.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0) || (a.name || '').localeCompare(b.name || ''); });
    females.forEach(function(m) {
      html += '<option value="' + m.id + '"' + (currentMotherId === m.id ? ' selected' : '') + '>[' + (m.generation_num || '?') + '世] ' + escapeHtml(m.name) + (m.spouse_ids ? ' 配:' + escapeHtml(m.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;}).join('/')) : '') + '</option>';
    });
    html += '</optgroup></select>';
  } else if (mod === 'genealogy' && f.key === 'spouse_ids') {
    var spVal = val;
    var spParts = spVal ? spVal.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s; }) : [];
    var spPrimary = spParts[0] || '';
    var spSecondary = spParts.slice(1).join('、') || '';
    html += '<div style="display:flex;flex-direction:column;gap:8px;">';
    html += '<input type="text" id="sp-field-primary" value="' + escapeHtml(spPrimary) + '" placeholder="原配（第一配偶）姓名" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;">';
    html += '<input type="text" id="sp-field-secondary" value="' + escapeHtml(spSecondary) + '" placeholder="非原配姓名（多位用顿号分隔）" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;">';
    html += '<p style="font-size:11px;color:var(--text-tertiary);margin:0;">原配为第一配偶，非原配可填多位用顿号分隔</p>';
    html += '</div>';
  } else if (f.type === 'select') {
    html += '<select id="field-' + f.key + '"' + (f.required ? ' required' : '') + '>';
    for (var j = 0; j < f.options.length; j++) {
      var selected = val === f.options[j] ? ' selected' : '';
      html += '<option' + selected + '>' + f.options[j] + '</option>';
    }
    html += '</select>';
  } else if (f.type === 'textarea') {
    html += '<textarea id="field-' + f.key + '"' + (f.required ? ' required' : '') + ' placeholder="请输入' + f.label + '" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;min-height:80px;">' + escapeHtml(val) + '</textarea>';
  } else if (f.type === 'number') {
    html += '<input type="number" id="field-' + f.key + '" value="' + escapeHtml(val) + '" placeholder="' + (f.placeholder || '请输入' + f.label) + '"' + (f.required ? ' required' : '') + ' style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;">';
  } else if (f.type === 'file') {
    html += '<input type="file" id="field-' + f.key + '" accept="' + (f.accept || '*') + '" style="padding:8px;background:var(--bg-card);border:1px solid var(--glass-border);border-radius:8px;width:100%;font-size:13px;">';
  } else {
    html += '<input type="text" id="field-' + f.key + '" value="' + escapeHtml(val) + '" placeholder="' + (f.placeholder || '请输入' + f.label) + '"' + (f.required ? ' required' : '') + ' style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;">';
  }

  if (f.help) html += '<p style="font-size:11px;color:var(--text-tertiary);margin:4px 0 0;">' + f.help + '</p>';
  html += '</div>';
  return html;
}

function toggleAdvancedFields(btn) {
  var div = document.getElementById('genealogy-advanced-fields');
  if (!div) return;
  var isHidden = div.style.display === 'none';
  div.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? '📂 收起高级信息' : '📂 高级信息（生卒、支系、简介等）';
}

function showForm(mod, m, item) {
  var isEdit = item !== null;
  var overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.style.display = 'flex';

  var box = document.createElement('div');
  box.className = 'admin-modal';
  box.style.maxWidth = '600px';

  var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
  html += '<h3 style="font-size:18px;font-weight:500;">' + (isEdit ? '编辑' : '新增') + ' ' + m.label + '</h3>';
  html += '<button class="btn-sm" onclick="this.closest(\'.admin-modal-overlay\').remove()" style="font-size:20px;background:none;border:none;cursor:pointer;">✕</button>';
  html += '</div>';

  html += '<form id="admin-form" onsubmit="return false;">';

  // 族谱表单：分组显示，基本资料 + 高级信息
  if (mod === 'genealogy') {
    var basicKeys = ['generation_num', 'name', 'gender', 'generation', 'branch', 'father_id', 'mother_id', 'spouse_ids'];
    var advancedKeys = ['birth_date', 'death_date', 'is_alive', 'adopted', 'bio_father_id', 'bio_mother_id', 'address', 'biography', 'photo'];

    html += '<div style="background:var(--accent-orange-dim);border-radius:8px;padding:10px 14px;margin-bottom:16px;">';
    html += '<div style="font-size:12px;font-weight:500;color:var(--accent-orange);margin-bottom:4px;">📋 基本资料</div>';
    html += '<div style="font-size:11px;color:#333;">填写姓名、世代、父母配偶等核心信息</div>';
    html += '</div>';

    for (var bi = 0; bi < basicKeys.length; bi++) {
      html += renderGenealogyFieldHtml(mod, m, basicKeys[bi], isEdit ? item : null);
    }

    html += '<div style="margin:12px 0;">';
    html += '<button type="button" class="btn btn-sm" id="btn-advanced-toggle" style="width:100%;padding:8px;font-size:12px;color:#333;background:var(--glass-bg);border:1px dashed var(--glass-border);border-radius:8px;cursor:pointer;">📂 高级信息（生卒、支系、简介等）</button>';
    html += '</div>';

    html += '<div id="genealogy-advanced-fields" style="display:none;">';
    for (var ai = 0; ai < advancedKeys.length; ai++) {
      html += renderGenealogyFieldHtml(mod, m, advancedKeys[ai], isEdit ? item : null);
    }
    html += '</div>';

    html += '</form>';
    html += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:24px;">';
    html += '<button type="button" class="btn btn-secondary" onclick="this.closest(\'.admin-modal-overlay\').remove()">取消</button>';
    html += '<button type="submit" class="btn btn-accent" onclick="saveForm(\'' + mod + '\',' + (isEdit ? item.id : 'null') + ')">' + (isEdit ? '保存修改' : '添加') + '</button>';
    if (!isEdit) {
      html += '<button type="button" class="btn btn-accent" onclick="saveForm(\'' + mod + '\',null,true)" style="background:var(--accent-orange);" title="保存后继续添加同代人">保存并继续 ➕</button>';
    }
    html += '</div>';

    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    var advBtn = document.getElementById('btn-advanced-toggle');
    if (advBtn) advBtn.onclick = function() {
      var div = document.getElementById('genealogy-advanced-fields');
      if (!div) return;
      var isHidden = div.style.display === 'none';
      div.style.display = isHidden ? 'block' : 'none';
      advBtn.textContent = isHidden ? '📂 收起高级信息' : '📂 高级信息（生卒、支系、简介等）';
    };
    // Trigger mother field update on next tick
    setTimeout(function() { if (typeof genealogyUpdateMother === 'function') genealogyUpdateMother(); }, 50);
    return;
  }

  for (var i = 0; i < m.fields.length; i++) {
    var f = m.fields[i];
    var val = isEdit ? (item[f.key] || '') : '';
    html += '<div class="form-group">';
    html += '<label>' + f.label + (f.required ? ' *' : '') + '</label>';

    // 族谱父亲 → 显示所有男性，切换时自动更新母亲选项
    if (mod === 'genealogy' && f.key === 'father_id') {
      var allPeople = getData('genealogy');
      var currentId = parseInt(val);
      html += '<select id="field-father_id" onchange="genealogyUpdateMother()" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;">';
      html += '<option value="">— 请选择 —</option>';
      var males = [];
      for (var gi = 0; gi < allPeople.length; gi++) {
        if (isEdit && allPeople[gi].id === item.id) continue;
        if (allPeople[gi].gender === '男') males.push(allPeople[gi]);
      }
      males.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0) || (a.name || '').localeCompare(b.name || ''); });
      for (var gi2 = 0; gi2 < males.length; gi2++) {
        var sel = currentId === males[gi2].id;
        html += '<option value="' + males[gi2].id + '"' + (sel ? ' selected' : '') + '>[' + (males[gi2].generation_num || '?') + '世] ' + escapeHtml(males[gi2].name) + (males[gi2].spouse_ids ? ' 配:' + escapeHtml(males[gi2].spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;}).join('/')) : '') + '</option>';
      }
      if (currentId) {
        var inList = males.some(function(m) { return m.id === currentId; });
        if (!inList) {
          for (var ci2 = 0; ci2 < allPeople.length; ci2++) {
            if (allPeople[ci2].id === currentId) {
              html += '<option disabled style="font-size:11px;color:var(--text-tertiary);border-top:1px solid var(--divider);">─ 其他（过继/特殊） ─</option>';
              html += '<option value="' + currentId + '" selected>[' + (allPeople[ci2].generation_num || '?') + '世] ' + escapeHtml(allPeople[ci2].name) + ' ⚠️</option>';
              break;
            }
          }
        }
      }
      html += '</select>';
    } else if (mod === 'genealogy' && f.key === 'mother_id') {
      // 母亲 → 优先显示当前父亲的配偶（含尚未建档的配偶姓名），再列其他女性
      var allPeople = getData('genealogy');
      var currentMotherVal = val;
      var currentMotherId = parseInt(val);
      var fatherId = isEdit ? parseInt(item.father_id) : 0;

      // 找当前父亲的配偶
      var fatherPerson = null;
      var recommendedMothers = [];
      if (fatherId) {
        for (var fi = 0; fi < allPeople.length; fi++) {
          if (allPeople[fi].id === fatherId) { fatherPerson = allPeople[fi]; break; }
        }
        if (fatherPerson && fatherPerson.spouse_ids) {
          var spouseNames = fatherPerson.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
          spouseNames.forEach(function(nm) {
            for (var fi2 = 0; fi2 < allPeople.length; fi2++) {
              if (allPeople[fi2].name === nm && allPeople[fi2].gender === '女') {
                recommendedMothers.push(allPeople[fi2]);
              }
            }
          });
        }
      }

      // 找出尚未建档的配偶姓名（有名字但无对应人员记录）
      var unmatchedSpouseNames = [];
      if (fatherPerson && fatherPerson.spouse_ids) {
        var allSpos = fatherPerson.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
        allSpos.forEach(function(nm) {
          var found = false;
          for (var ri = 0; ri < recommendedMothers.length; ri++) {
            if (recommendedMothers[ri].name === nm) { found = true; break; }
          }
          if (!found) unmatchedSpouseNames.push(nm);
        });
      }

      html += '<select id="field-mother_id" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;">';
      html += '<option value="">— 请选择 —</option>';

      // 推荐母亲（父亲的配偶）
      var addedIds = {};
      if (fatherPerson) {
        for (var ri = 0; ri < recommendedMothers.length; ri++) {
          var m = recommendedMothers[ri];
          if (isEdit && m.id === item.id) continue;
          var sel = currentMotherId === m.id ? ' selected' : '';
          html += '<option value="' + m.id + '"' + sel + ' style="font-weight:600;color:var(--accent-orange);">★ ' + escapeHtml(m.name) + '（' + escapeHtml(fatherPerson.name) + '之配）</option>';
          addedIds[m.id] = true;
        }
        // 尚未建档的配偶（直接以姓名为值）
        for (var ui = 0; ui < unmatchedSpouseNames.length; ui++) {
          var nm = unmatchedSpouseNames[ui];
          var sel = currentMotherVal === nm ? ' selected' : '';
          html += '<option value="' + escapeHtml(nm) + '"' + sel + ' style="font-weight:600;color:var(--accent-orange);">★ ' + escapeHtml(nm) + '（' + escapeHtml(fatherPerson.name) + '之配，待建档）</option>';
          addedIds[nm] = true;
        }
      }

      var hasAnyRecommended = recommendedMothers.length > 0 || unmatchedSpouseNames.length > 0;
      if (fatherPerson && hasAnyRecommended) {
        html += '<option disabled style="font-size:11px;color:var(--text-tertiary);">─ 其他女性 ─</option>';
      }

      // 所有其他女性
      var otherWomen = [];
      for (var wi = 0; wi < allPeople.length; wi++) {
        if (allPeople[wi].gender !== '女' || addedIds[allPeople[wi].id]) continue;
        if (isEdit && allPeople[wi].id === item.id) continue;
        otherWomen.push(allPeople[wi]);
      }
      otherWomen.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0) || (a.name || '').localeCompare(b.name || ''); });
      for (var wi2 = 0; wi2 < otherWomen.length; wi2++) {
        var sel2 = currentMotherId === otherWomen[wi2].id ? ' selected' : '';
        html += '<option value="' + otherWomen[wi2].id + '"' + sel2 + '>[' + (otherWomen[wi2].generation_num || '?') + '世] ' + escapeHtml(otherWomen[wi2].name) + '</option>';
      }

      html += '</select>';
    } else if (mod === 'genealogy' && f.key === 'spouse_ids') {
      // 配偶拆为 原配 + 非原配 两个输入框
      var spVal = isEdit ? (item[f.key] || '') : '';
      var spParts = spVal ? spVal.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s; }) : [];
      var spPrimary = spParts[0] || '';
      var spSecondary = spParts.slice(1).join('、') || '';
      html += '<div style="display:flex;flex-direction:column;gap:8px;">';
      html += '<input type="text" id="sp-field-primary" value="' + escapeHtml(spPrimary) + '" placeholder="原配（第一配偶）姓名" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;">';
      html += '<input type="text" id="sp-field-secondary" value="' + escapeHtml(spSecondary) + '" placeholder="非原配姓名（多位用顿号分隔）" style="width:100%;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:13px;box-sizing:border-box;">';
      html += '<p style="font-size:11px;color:var(--text-tertiary);margin:0;">原配为第一配偶，非原配可填多位用顿号分隔</p>';
      html += '</div>';
    } else if (f.type === 'file') {
      html += '<input type="file" id="field-' + f.key + '" accept="' + (f.accept || '*') + '"';
      if (f.required && !isEdit) html += ' required';
      html += ' style="padding:8px;background:var(--bg-card);border:1px solid var(--glass-border);border-radius:8px;width:100%;font-size:13px;">';
      // Show image preview for poster, or file uploaded indicator for other file types
      if (isEdit) {
        var posterVal = item.poster || '';
        if (f.key === 'poster' && posterVal) {
          html += '<div style="margin-top:6px;display:flex;align-items:center;gap:8px;">';
          html += '<img src="' + posterVal + '" alt="封面预览" style="width:80px;height:45px;border-radius:4px;object-fit:cover;border:1px solid var(--glass-border);">';
          html += '<span style="font-size:12px;color:var(--text-tertiary);">当前封面，重新选择可替换</span></div>';
        } else if (item.hasFile || item.file_url) {
          html += '<p style="font-size:12px;color:var(--text-tertiary);margin-top:4px;">✅ 已上传文件，重新选择可替换</p>';
        }
      }
    } else if (f.type === 'photos') {
      // Multi-photo upload zone for activities
      var photos = [];
      if (isEdit && item.photos) {
        try { photos = typeof item.photos === 'string' ? JSON.parse(item.photos) : item.photos; } catch(e) {}
      }
      html += '<div class="photos-upload-zone" style="border:2px dashed var(--glass-border);border-radius:8px;padding:16px;text-align:center;">';
      html += '<label style="display:block;font-size:13px;color:var(--text-secondary);margin-bottom:8px;">📷 活动照片（可上传多张）</label>';
      html += '<div id="photos-preview" class="photos-preview" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;justify-content:center;">';
      for (var pi = 0; pi < photos.length; pi++) {
        html += '<div class="photo-thumb" style="position:relative;width:90px;height:90px;border-radius:6px;overflow:hidden;border:1px solid var(--glass-border);flex-shrink:0;">';
        html += '<img src="' + photos[pi] + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.display=\'none\'">';
        html += '<button type="button" onclick="removeActivityPhoto(this,\'' + photos[pi] + '\')" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;line-height:20px;text-align:center;z-index:2;">✕</button>';
        html += '</div>';
      }
      html += '</div>';
      html += '<input type="file" id="field-photos-upload" accept="image/*" multiple style="display:none;" onchange="uploadActivityPhotos(this)">';
      html += '<button type="button" class="btn btn-sm" onclick="document.getElementById(\'field-photos-upload\').click()" style="padding:6px 20px;">📷 选择照片</button>';
      html += '<p style="font-size:11px;color:var(--text-tertiary);margin-top:6px;">支持多选，建议 1920×1080 以上</p>';
      html += '<input type="hidden" id="field-photos" value="' + escapeHtml(JSON.stringify(photos)) + '">';
      html += '</div>';
    } else if (f.type === 'select') {
      html += '<select id="field-' + f.key + '"' + (f.required ? ' required' : '') + '>';
      for (var j = 0; j < f.options.length; j++) {
        var selected = val === f.options[j] ? ' selected' : '';
        html += '<option' + selected + '>' + f.options[j] + '</option>';
      }
      html += '</select>';
    } else if (f.type === 'textarea') {
      html += '<textarea id="field-' + f.key + '"' + (f.required ? ' required' : '') + ' placeholder="请输入' + f.label + '">' + escapeHtml(val) + '</textarea>';
    } else if (f.type === 'date') {
      html += '<input type="date" id="field-' + f.key + '" value="' + val + '"' + (f.required ? ' required' : '') + '>';
    } else {
      html += '<input type="' + f.type + '" id="field-' + f.key + '" value="' + escapeHtml(val) + '" placeholder="' + (f.placeholder || '请输入' + f.label) + '"' + (f.required ? ' required' : '') + '>';
    }

    html += '</div>';
  }

  html += '<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px;">';
  html += '<button type="button" class="btn btn-secondary" onclick="this.closest(\'.admin-modal-overlay\').remove()">取消</button>';
  html += '<button type="submit" class="btn btn-accent" onclick="saveForm(\'' + mod + '\',' + (isEdit ? item.id : 'null') + ')">' + (isEdit ? '保存修改' : '添加') + '</button>';
  html += '</div>';

  html += '</form>';

  box.innerHTML = html;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // 使弹窗可拖拽和缩放
  makeModalDraggableResizable(box);
}

// ===== 弹窗可拖拽 + 可缩放 =====
function makeModalDraggableResizable(box) {
  box.style.position = 'fixed';
  box.style.top = '50%';
  box.style.left = '50%';
  box.style.transform = 'translate(-50%, -50%)';
  box.style.margin = '0';
  box.style.maxHeight = '85vh';

  // 右下角缩放拖柄
  var resizer = document.createElement('div');
  resizer.style.cssText = 'position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 50%,var(--text-tertiary) 50%);opacity:0.35;border-radius:0 0 8px 0;';
  box.appendChild(resizer);

  // 拖拽：通过标题栏
  var headerRow = box.querySelector('[style*="justify-content:space-between"]');
  if (headerRow) {
    headerRow.style.cursor = 'move';
    headerRow.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      box.style.transform = 'none';
      box.style.transition = 'none';
      var rect = box.getBoundingClientRect();
      box.style.top = rect.top + 'px';
      box.style.left = rect.left + 'px';
      var ox = e.clientX - rect.left;
      var oy = e.clientY - rect.top;
      function onMouseMove(e2) {
        box.style.left = (e2.clientX - ox) + 'px';
        box.style.top = (e2.clientY - oy) + 'px';
      }
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // 缩放
  resizer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var startW = box.offsetWidth;
    var startH = box.offsetHeight;
    var startX = e.clientX;
    var startY = e.clientY;
    box.style.maxWidth = 'none';
    function onMouseMove(e2) {
      box.style.width = Math.max(300, startW + (e2.clientX - startX)) + 'px';
      box.style.height = Math.max(200, startH + (e2.clientY - startY)) + 'px';
    }
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function saveForm(mod, editId, continueAdding) {
  var m = MODULES[mod];
  if (!m) return;
  var data = getData(mod);
  var item = {};
  var fileUploads = [];

  for (var i = 0; i < m.fields.length; i++) {
    var f = m.fields[i];
    var el = document.getElementById('field-' + f.key);
    if (el) {
      if (f.type === 'file') {
        fileUploads.push({ key: f.key, el: el });
        // Don't set value from file input here
      } else if (f.type === 'photos') {
        try { item[f.key] = JSON.parse(el.value); } catch(e) { item[f.key] = []; }
      } else {
        item[f.key] = el.value;
      }
    }
  }

  // 族谱配偶字段合并（原配+非原配→spouse_ids）
  if (mod === 'genealogy') {
    var sp1 = document.getElementById('sp-field-primary');
    var sp2 = document.getElementById('sp-field-secondary');
    var spParts = [];
    if (sp1 && sp1.value.trim()) spParts.push(sp1.value.trim());
    if (sp2 && sp2.value.trim()) {
      sp2.value.split(/[、,]/).forEach(function(s) {
        if (s.trim()) spParts.push(s.trim());
      });
    }
    item.spouse_ids = spParts.join(',');
  }

  // Validate required
  for (var j = 0; j < m.fields.length; j++) {
    if (m.fields[j].required && !item[m.fields[j].key]) {
      alert('请填写 ' + m.fields[j].label);
      return;
    }
  }

  var idToSave = editId || getNextId(data);

  if (editId) {
    for (var k = 0; k < data.length; k++) {
      if (data[k].id === editId) {
        for (var key in item) {
          data[k][key] = item[key];
        }
        data[k].id = editId;
        break;
      }
    }
  } else {
    item.id = idToSave;
    data.push(item);
  }

  saveData(mod, data);

  // B站封面自动获取（谢氏集萃）
  if (mod === 'xieCollection' && item.url && !item.poster) {
    var bvid = (item.url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/i) || [])[1];
    if (!bvid) { bvid = (item.url.match(/b23\.tv\/([a-zA-Z0-9]+)/i) || [])[1]; }
    if (bvid) {
      (function(b, id, d) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/bilibili-cover?bvid=' + b, true);
        xhr.onload = function() {
          try {
            var r = JSON.parse(xhr.responseText);
            if (r.cover) {
              for (var i = 0; i < d.length; i++) {
                if (d[i].id === id) { d[i].poster = r.cover; break; }
              }
              saveData(mod, d);
            }
          } catch(e) {}
        };
        xhr.send();
      })(bvid, idToSave, data);
    }
  }

  // Auto-record version for content updates
  var moduleLabels = { genealogy:'族谱', members:'成员', activities:'活动', news:'消息', honors:'村荣誉', reports:'报道', photos:'照片', videos:'视频', music:'背景音乐', messages:'留言', templeCarousel:'宗祠轮播', xieCollection:'谢氏集萃' };
  var label = moduleLabels[mod] || mod;
  var action = editId ? '更新' : '新增';
  autoRecordVersion(action + label + '内容');

  // Handle file uploads — upload each file independently to server
  var uploadPromises = [];
  for (var ui = 0; ui < fileUploads.length; ui++) {
    var fu = fileUploads[ui];
    var fileInput = fu.el;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      var file = fileInput.files[0];
      (function(fieldKey, uploadedFile) {
        var prefix2 = mod === 'photos' ? 'photo_' : (mod === 'videos' ? 'video_' : (mod === 'music' ? 'music_' : (mod === 'templeCarousel' ? 'carousel_' : 'file_')));
        if (fieldKey === 'poster') prefix2 = 'poster_';
        var up = uploadToServer(prefix2 + idToSave, uploadedFile).then(function(result) {
          if (result && result.url) {
            for (var idx = 0; idx < data.length; idx++) {
              if (data[idx].id === idToSave) {
                if (fieldKey === 'poster') {
                  data[idx].poster = result.url;
                } else {
                  data[idx].file_url = result.url;
                }
                data[idx].fileName = uploadedFile.name;
                break;
              }
            }
            saveData(mod, data);
          } else {
            console.error('Upload failed for ' + fieldKey + ' — server returned:', JSON.stringify(result));
          }
          return result;
        });
        uploadPromises.push(up);
      })(fu.key, file);
    }
  }

  // If continue adding, keep form open and clear fields
  if (continueAdding) {
    // Clear form fields but keep generation and father
    var form = document.getElementById('admin-form');
    if (form) {
      var inputs = form.querySelectorAll('input, textarea, select');
      var keepFields = ['generation_num', 'father_id', 'branch'];
      for (var fi = 0; fi < inputs.length; fi++) {
        var inp = inputs[fi];
        if (keepFields.indexOf(inp.id ? inp.id.replace('field-', '') : '') >= 0) continue;
        if (inp.type === 'text' || inp.type === 'textarea') inp.value = '';
        if (inp.tagName === 'SELECT' && inp.id !== 'field-father_id' && inp.id !== 'field-branch') inp.selectedIndex = 0;
      }
    }
    showToast('✅ 已保存，继续添加');
    return;
  }

  var overlay = document.querySelector('.admin-modal-overlay');
  if (overlay) overlay.remove();
  showToast('已保存');
  // Refresh data in background but don't re-render full tree
  if (currentModule === 'genealogyOverview') {
    // 从世代总览打开的表单保存后，留在世代总览并刷新
    setTimeout(function() { renderModule('genealogyOverview'); updateStats(); }, 100);
  } else if (currentModule === 'genealogy' && mod === 'genealogy') {
    // 族谱管理保存后原地刷新（保留展开状态与滚动位置），不刷新页面立即看到修改结果
    setTimeout(function() { renderGenealogyKeepState(); }, 100);
  } else if (mod !== 'genealogy') {
    setTimeout(function() { renderModule(mod); updateStats(); }, 100);
  } else {
    setTimeout(function() { if (typeof updateStats === 'function') updateStats(); }, 100);
  }
}

function deleteItem(mod, id) {
  if (!confirm('确定要删除此项吗？')) return;
  var data = getData(mod);
  var filtered = [];
  var deletedItem = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id !== id) filtered.push(data[i]);
    else deletedItem = data[i];
  }
  saveData(mod, filtered);
  // Auto-record delete version
  var moduleLabels = { genealogy:'族谱', members:'成员', activities:'活动', news:'消息', honors:'村荣誉', reports:'报道', photos:'照片', videos:'视频', music:'背景音乐', messages:'留言', templeCarousel:'宗祠轮播', xieCollection:'谢氏集萃' };
  autoRecordVersion('删除' + (moduleLabels[mod] || mod) + '内容');
  // Delete file from server if has file_url
  if (deletedItem && deletedItem.file_url) {
    var filename = deletedItem.file_url.replace('/uploads/', '');
    if (filename) deleteFromServer(filename);
  }
  // 在世代总览模块中删除时，留在世代总览
  var targetMod = (currentModule === 'genealogyOverview') ? 'genealogyOverview' : mod;
  if (targetMod === 'genealogy') renderGenealogyKeepState(); // 族谱管理删除后原地刷新，保留展开状态
  else renderModule(targetMod);
  updateStats();
  showToast('已删除');
}

// ===== Settings =====
function renderSettings(area) {
  if (!area) area = document.getElementById('admin-content-area');
  if (!area) return;
  var settings = getData('settings');
  var currentTheme = localStorage.getItem('xie_theme') || 'light';
  var currentLang = localStorage.getItem('xie_lang') || 'zh';

  // Load hero settings from server-synced data with localStorage fallback
  var heroStyle = 'clean';
  var heroBg = '';
  for (var i = 0; i < settings.length; i++) {
    if (settings[i].key === 'hero_style') heroStyle = settings[i].value;
    if (settings[i].key === 'hero_bg') heroBg = settings[i].value;
  }
  heroStyle = localStorage.getItem('xie_hero_style') || heroStyle || 'clean';
  heroBg = localStorage.getItem('xie_hero_bg') || heroBg || '';

  var html = '<div class="admin-module">';
  html += '<div class="admin-module-header"><h3>⚙️ 系统设置</h3></div>';

  html += '<div class="glass-card" style="padding:24px;max-width:600px;margin:0 auto;">';
  html += '<div style="margin-top:24px;">';
  html += '<h4 style="font-family:var(--font-title);color:var(--text-primary);margin-bottom:12px;font-weight:500;">首页首屏风格</h4>';
  html += '<div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap;">';
  html += '<button class="btn ' + (heroStyle === 'clean' ? 'btn-accent' : 'btn') + '" id="hero-style-clean" onclick="setHeroStyle(\'clean\')" style="flex:1;min-width:100px;padding:10px;">🎨 纯色</button>';
  html += '<button class="btn ' + (heroStyle === 'photo' ? 'btn-accent' : 'btn') + '" id="hero-style-photo" onclick="setHeroStyle(\'photo\')" style="flex:1;min-width:100px;padding:10px;">🖼️ 照片</button>';
  html += '<button class="btn ' + (heroStyle === 'map' ? 'btn-accent' : 'btn') + '" id="hero-style-map" onclick="setHeroStyle(\'map\')" style="flex:1;min-width:100px;padding:10px;">🗺️ 地图</button>';
  html += '</div>';

  // Hero background image upload
  html += '<div style="background:var(--glass-bg);padding:16px;border-radius:8px;">';
  html += '<label style="display:block;font-size:13px;color:var(--text-secondary);margin-bottom:8px;">🏞️ 背景图片</label>';
  if (heroBg) {
    html += '<div style="position:relative;margin-bottom:10px;border-radius:6px;overflow:hidden;max-height:160px;">';
    html += '<img src="' + heroBg + '" alt="当前背景" style="width:100%;height:140px;object-fit:cover;display:block;">';
    html += '<button onclick="removeHeroBg()" style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:4px;width:28px;height:28px;cursor:pointer;font-size:16px;line-height:28px;text-align:center;">✕</button>';
    html += '</div>';
  }
  html += '<div style="display:flex;gap:8px;">';
  html += '<input type="file" id="hero-bg-input" accept="image/*" style="flex:1;font-size:13px;" onchange="uploadHeroBg(this)">';
  html += '</div>';
  html += '<p style="font-size:12px;color:var(--text-tertiary);margin-top:6px;">建议尺寸 1920×1080 以上，上传后自动替换首页照片背景</p>';
  html += '</div>';
  html += '</div>';

  // Admin password
  html += '<div class="form-group">';
  html += '<label>管理员密码</label>';
  html += '<div style="display:flex;gap:8px;">';
  html += '<input type="text" id="settings-password" value="****** (服务器管理)" style="flex:1;" disabled>';
  html += '<button class="btn btn-accent btn-sm" onclick="saveSettings()">保存</button>';
  html += '</div>';
  html += '<p style="font-size:12px;color:var(--text-tertiary);margin-top:4px;">修改后需同步更新 js/main.js 中的 adminLogin() 函数</p>';
  html += '</div>';

  // Site stats
  html += '<div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--divider);">';
  html += '<h4 style="font-family:var(--font-title);color:var(--text-primary);margin-bottom:12px;font-weight:500;">站点数据</h4>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;">';
  html += '<div style="background:var(--glass-bg);padding:16px;border-radius:8px;text-align:center;"><strong style="color:var(--text-primary);display:block;font-size:24px;" id="settings-news-count">0</strong><span style="color:var(--text-tertiary);">新闻</span></div>';
  html += '<div style="background:var(--glass-bg);padding:16px;border-radius:8px;text-align:center;"><strong style="color:var(--text-primary);display:block;font-size:24px;" id="settings-genealogy-count">0</strong><span style="color:var(--text-tertiary);">族谱条目</span></div>';
  html += '<div style="background:var(--glass-bg);padding:16px;border-radius:8px;text-align:center;"><strong style="color:var(--text-primary);display:block;font-size:24px;" id="settings-members-count">0</strong><span style="color:var(--text-tertiary);">成员</span></div>';
  html += '<div style="background:var(--glass-bg);padding:16px;border-radius:8px;text-align:center;"><strong style="color:var(--text-primary);display:block;font-size:24px;" id="settings-activities-count">0</strong><span style="color:var(--text-tertiary);">活动</span></div>';
  html += '<div style="background:var(--glass-bg);padding:16px;border-radius:8px;text-align:center;"><strong style="color:var(--text-primary);display:block;font-size:24px;" id="settings-honors-count">0</strong><span style="color:var(--text-tertiary);">荣誉</span></div>';
  html += '<div style="background:var(--glass-bg);padding:16px;border-radius:8px;text-align:center;"><strong style="color:var(--text-primary);display:block;font-size:24px;" id="settings-reports-count">0</strong><span style="color:var(--text-tertiary);">报道</span></div>';
  html += '</div></div>';

  // ===== 版本记录 =====
  var versions = getVersionHistory();
  html += '<div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--divider);">';
  html += '<h4 style="font-family:var(--font-title);color:var(--text-primary);margin-bottom:12px;font-weight:500;">📋 版本记录</h4>';
  html += '<div style="display:flex;gap:8px;margin-bottom:12px;">';
  html += '<input type="text" id="version-desc-input" placeholder="本次更新内容说明，如：优化移动端布局、修复XXX" style="flex:1;padding:8px 12px;border:1px solid var(--glass-border);border-radius:6px;background:var(--bg-card);color:var(--text-primary);font-size:13px;" onkeydown="if(event.key===\'Enter\')recordVersion()">';
  html += '<button class="btn btn-accent btn-sm" onclick="recordVersion()">📝 记录</button>';
  html += '</div>';
  if (versions.length === 0) {
    html += '<p style="font-size:13px;color:var(--text-tertiary);padding:12px;text-align:center;">暂无版本记录</p>';
  } else {
    html += '<div style="max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">';
    for (var vi = 0; vi < versions.length; vi++) {
      var v = versions[vi];
      html += '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--glass-bg);border-radius:6px;font-size:13px;">';
      html += '<span style="background:var(--accent-orange-dim);color:var(--accent-orange);padding:2px 8px;border-radius:4px;font-weight:600;font-size:11px;white-space:nowrap;">' + (v.v || '') + '</span>';
      html += '<span style="color:var(--text-tertiary);font-size:11px;white-space:nowrap;">' + (v.date || '') + '</span>';
      html += '<span style="color:var(--text-secondary);flex:1;">' + (v.desc || '') + '</span>';
      html += '<button onclick="deleteVersion(' + vi + ')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:14px;padding:2px;" title="删除">✕</button>';
      html += '</div>';
    }
    html += '</div>';
  }
  html += '</div>';

  // Reset data
  html += '<div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--divider);">';
  html += '<h4 style="font-family:var(--font-title);color:var(--text-primary);margin-bottom:12px;font-weight:500;">数据管理</h4>';
  html += '<div style="display:flex;gap:12px;flex-wrap:wrap;">';
  html += '<button class="btn btn-sm" onclick="exportAllData()" style="padding:8px 20px;">📤 导出数据</button>';
  html += '<button class="btn btn-sm" onclick="document.getElementById(\'import-file-input\').click()" style="padding:8px 20px;">📥 导入数据</button>';
  html += '<input type="file" id="import-file-input" accept=".json" style="display:none;" onchange="importAllData(this)">';
  html += '<button class="btn btn-sm" onclick="checkFileRepair()" style="padding:8px 20px;">🔧 检查/修复文件</button>';
  html += '<button class="btn btn-sm btn-danger" onclick="resetAllData()" style="padding:8px 20px;">重置所有数据</button>';
  html += '</div>';
  html += '<p style="font-size:12px;color:var(--text-tertiary);margin-top:8px;">导出下载 JSON 备份文件 · 导入将覆盖当前所有模块数据</p>';
  html += '<div id="file-repair-result" style="margin-top:12px;"></div>';
  html += '</div>';

  html += '</div></div>';
  area.innerHTML = html;

  // Update counts
  document.getElementById('settings-genealogy-count').textContent = getData('genealogy').length;
  document.getElementById('settings-members-count').textContent = getData('members').length;
  document.getElementById('settings-activities-count').textContent = getData('activities').length;
  var hc = document.getElementById('settings-honors-count');
  if (hc) hc.textContent = getData('honors').length;
  var rc = document.getElementById('settings-reports-count');
  if (rc) rc.textContent = getData('reports').length;
}

function saveSettings() {
  var pwd = document.getElementById('settings-password').value;
  if (pwd && pwd.length > 0) {
    alert('密码修改请联系服务器管理员配置 ADMIN_PASSWORD 环境变量。');
  } else {
    showToast('已保存');
  }
}

function setHeroStyle(style) {
  localStorage.setItem('xie_hero_style', style);
  saveHeroSetting('hero_style', style);
  var ids = ['hero-style-clean', 'hero-style-photo', 'hero-style-map'];
  var vals = ['clean', 'photo', 'map'];
  for (var i = 0; i < ids.length; i++) {
    var btn = document.getElementById(ids[i]);
    if (btn) btn.className = 'btn' + (style === vals[i] ? ' btn-accent' : '');
  }
  var label = { clean: '纯色', photo: '照片背景', map: '迁徙地图' }[style] || style;
  showToast('首页风格已切换为' + label + '，刷新首页查看');
}

// ===== Hero background image upload =====
function uploadHeroBg(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var prefix = 'hero_bg';

  uploadToServer(prefix, file).then(function(result) {
    if (result && result.url) {
      localStorage.setItem('xie_hero_bg', result.url);
      saveHeroSetting('hero_bg', result.url);
      // Auto switch to photo mode if not already
      var curStyle = localStorage.getItem('xie_hero_style') || 'clean';
      if (curStyle !== 'photo') {
        setHeroStyle('photo');
      }
      showToast('背景图片已上传');
      renderSettings();
    } else {
      console.error('Hero BG upload failed — server returned:', JSON.stringify(result));
      var detail = result && result.error ? result.error : '服务器返回格式异常';
      alert('上传失败: ' + detail);
    }
  }).catch(function(err) {
    console.error('Hero BG upload failed:', err);
    alert('上传失败: ' + (err.message || '网络错误'));
  });
}

function removeHeroBg() {
  var url = localStorage.getItem('xie_hero_bg');
  if (url) {
    var filename = url.replace('/uploads/', '');
    if (filename) deleteFromServer(filename);
  }
  localStorage.removeItem('xie_hero_bg');
  saveHeroSetting('hero_bg', '');
  renderSettings();
  showToast('背景图片已移除');
}

// ===== Hero settings sync helper (saves to server for cross-device sync) =====
function saveHeroSetting(key, value) {
  var settings = getData('settings');
  var found = false;
  for (var i = 0; i < settings.length; i++) {
    if (settings[i].key === key) {
      settings[i].value = value;
      found = true;
      break;
    }
  }
  if (!found) {
    var obj = { key: key, value: value };
    settings.push(obj);
  }
  saveData('settings', settings);
}

function resetAllData() {
  if (!confirm('确定要重置所有数据吗？此操作不可撤销！')) return;
  if (!confirm('再次确认：所有自定义数据将被删除，恢复默认内容。')) return;
  for (var mod in MODULES) {
    if (MODULES[mod].defaultData) {
      var defData = JSON.parse(JSON.stringify(MODULES[mod].defaultData));
      localStorage.setItem('xie_admin_' + mod, JSON.stringify(defData));
      // Also sync to Supabase
      if (window.dbSyncModule) {
        setTimeout(function(m, d) {
          dbSyncModule(m, d).catch(function(e) { console.warn('Supabase sync failed for ' + m + ': ' + e.message); });
        }, 50, mod, defData);
      }
    }
  }
  renderModule(currentModule);
  updateStats();
}

// ===== Activity photo upload helpers =====
function uploadActivityPhotos(input) {
  if (!input.files || !input.files.length) return;
  var files = Array.prototype.slice.call(input.files);
  var total = files.length;
  var done = 0;
  var photos = [];
  try { photos = JSON.parse(document.getElementById('field-photos').value || '[]'); } catch(e) {}
  function uploadNext(i) {
    if (i >= files.length) {
      document.getElementById('field-photos').value = JSON.stringify(photos);
      showToast('已上传 ' + photos.length + ' 张照片');
      // Re-render the photo preview
      var preview = document.getElementById('photos-preview');
      if (preview) renderPhotoPreviews(preview, photos);
      input.value = '';
      return;
    }
    uploadToServer('activity_' + Date.now() + '_' + i, files[i]).then(function(result) {
      if (result && result.url) photos.push(result.url);
      uploadNext(i + 1);
    }).catch(function() {
      uploadNext(i + 1);
    });
  }
  uploadNext(0);
}

function removeActivityPhoto(btn, url) {
  var thumb = btn.parentElement;
  thumb.style.display = 'none';
  var hidden = document.getElementById('field-photos');
  if (!hidden) return;
  var photos = [];
  try { photos = JSON.parse(hidden.value || '[]'); } catch(e) {}
  var idx = photos.indexOf(url);
  if (idx > -1) photos.splice(idx, 1);
  hidden.value = JSON.stringify(photos);
  // Also delete from server
  var filename = url.replace('/uploads/', '');
  if (filename) deleteFromServer(filename);
}

function renderPhotoPreviews(container, urls) {
  container.innerHTML = '';
  for (var pi = 0; pi < urls.length; pi++) {
    var div = document.createElement('div');
    div.style.cssText = 'position:relative;width:90px;height:90px;border-radius:6px;overflow:hidden;border:1px solid var(--glass-border);flex-shrink:0;';
    var img = document.createElement('img');
    img.src = urls[pi];
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    img.onerror = function() { this.parentElement.style.display = 'none'; };
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = '✕';
    btn.style.cssText = 'position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;line-height:20px;text-align:center;z-index:2;';
    btn.onclick = function() { removeActivityPhoto(this, urls[pi]); };
    div.appendChild(img);
    div.appendChild(btn);
    container.appendChild(div);
  }
}

// ===== File check & repair =====
function checkFileRepair() {
  var resultEl = document.getElementById('file-repair-result');
  if (!resultEl) return;
  resultEl.innerHTML = '<p style="font-size:13px;color:var(--text-tertiary);">正在检查文件状态...</p>';

  getAllFiles('photo_').then(function(photoFiles) {
    var photoMap = {};
    photoFiles.forEach(function(f) {
      var id = parseInt(f.name.replace('photo_', ''));
      photoMap[id] = true;
    });

    var photos = getData('photos');
    var missing = [];
    var ok = [];
    photos.forEach(function(p) {
      if (p.hasFile && !photoMap[p.id]) {
        missing.push(p);
      } else if (p.hasFile && photoMap[p.id]) {
        ok.push(p);
      }
    });

    // Also check videos
    getAllFiles('video_').then(function(videoFiles) {
      var videoMap = {};
      videoFiles.forEach(function(f) {
        var id = parseInt(f.name.replace('video_', ''));
        videoMap[id] = true;
      });
      var videos = getData('videos');
      var missingVideo = [];
      videos.forEach(function(v) {
        if (v.hasFile && !videoMap[v.id]) {
          missingVideo.push(v);
        }
      });

      var html = '';
      html += '<div style="padding:12px 16px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-border);font-size:13px;">';

      if (ok.length > 0) {
        html += '<p style="color:var(--text-secondary);margin-bottom:8px;">✅ ' + ok.length + ' 张照片文件正常</p>';
      }
      if (missing.length > 0) {
        html += '<p style="color:#e74c3c;margin-bottom:8px;">⚠️ ' + missing.length + ' 张照片文件缺失（IndexedDB 中被清除）</p>';
        html += '<ul style="list-style:none;padding:0;margin:0 0 12px 0;">';
        missing.forEach(function(p) {
          html += '<li style="padding:4px 0;display:flex;justify-content:space-between;align-items:center;">';
          html += '<span>' + (p.title || '未命名') + ' (ID: ' + p.id + ')</span>';
          html += '</li>';
        });
        html += '</ul>';
        html += '<button class="btn btn-sm" onclick="repairMissingFiles()" style="padding:6px 16px;">修复：清除缺失标记，便于重新上传</button>';
      }
      if (missingVideo.length > 0) {
        html += '<p style="color:#e74c3c;margin-top:12px;margin-bottom:8px;">⚠️ ' + missingVideo.length + ' 个视频文件缺失</p>';
        html += '<button class="btn btn-sm" onclick="repairMissingVideoFiles()" style="padding:6px 16px;">修复视频标记</button>';
      }
      if (missing.length === 0 && missingVideo.length === 0 && ok.length === 0) {
        html += '<p style="color:var(--text-tertiary);">未找到已上传的文件记录。</p>';
        html += '<p style="color:var(--text-tertiary);margin-top:4px;">💡 如果之前上传过照片/视频，说明浏览器的 IndexedDB 存储已被清除。请重新上传文件。</p>';
      }

      html += '</div>';
      resultEl.innerHTML = html;
    });
  });
}

function repairMissingFiles() {
  if (!confirm('将清除所有照片的"已上传"标记，以便重新上传。确定吗？')) return;
  var photos = getData('photos');
  photos.forEach(function(p) {
    if (p.hasFile) {
      p.hasFile = false;
      delete p.fileName;
    }
  });
  saveData('photos', photos);
  renderModule('photos');
  var resultEl = document.getElementById('file-repair-result');
  if (resultEl) resultEl.innerHTML = '<p style="font-size:13px;color:#27ae60;">✅ 已修复！照片的已上传标记已清除，可以重新上传文件。</p>';
  showToast('已修复');
}

function repairMissingVideoFiles() {
  if (!confirm('将清除所有视频的"已上传"标记。确定吗？')) return;
  var videos = getData('videos');
  videos.forEach(function(v) {
    if (v.hasFile) {
      v.hasFile = false;
      delete v.fileName;
    }
  });
  saveData('videos', videos);
  renderModule('videos');
  showToast('已修复');
}

// ===== Export / Import =====
function exportAllData() {
  var allData = {};
  for (var mod in MODULES) {
    allData[mod] = getData(mod);
  }
  var blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'xie_admin_backup_' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('已导出');
}

function importAllData(input) {
  if (!input.files || !input.files[0]) return;
  if (!confirm('导入将覆盖当前所有模块数据，确定继续吗？')) {
    input.value = '';
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var allData = JSON.parse(e.target.result);
      var count = 0;
      for (var mod in allData) {
        if (Array.isArray(allData[mod])) {
          localStorage.setItem('xie_admin_' + mod, JSON.stringify(allData[mod]));
          // Also sync to Supabase
          if (window.dbSyncModule) {
            setTimeout(function(m, d) {
              dbSyncModule(m, d).catch(function(e) { console.warn('Supabase sync failed for ' + m + ': ' + e.message); });
            }, 50, mod, allData[mod]);
          }
          count += allData[mod].length;
        }
      }
      renderModule(currentModule);
      updateStats();
      showToast('已导入 ' + count + ' 条数据');
    } catch(err) {
      alert('导入失败：文件格式不正确\n' + err.message);
    }
  };
  reader.readAsText(input.files[0]);
  input.value = '';
}

// ===== Stats =====
function updateStats() {
  var el = document.getElementById('admin-visits');
  if (el) {
    var visits = localStorage.getItem('xie_visits') || '0';
    el.textContent = visits;
  }
  var counts = { news: 0, genealogy: 0, members: 0, activities: 0, honors: 0, reports: 0 };
  for (var mod in counts) {
    counts[mod] = getData(mod).length;
  }
  var statEls = document.querySelectorAll('.admin-stat-value');
  if (statEls.length >= 4) {
    statEls[0].textContent = counts.news;
    statEls[1].textContent = counts.genealogy;
    statEls[2].textContent = counts.members;
    statEls[3].textContent = counts.activities;
  }
}

// ===== Init =====
var currentModule = 'genealogy';

function switchModule(mod) {
  currentModule = mod;
  var area = document.getElementById('admin-content-area');
  // Update active state in sidebar
  var items = document.querySelectorAll('.admin-sidebar-item');
  for (var i = 0; i < items.length; i++) {
    items[i].classList.toggle('active', items[i].getAttribute('data-module') === mod);
  }
  // 使用 anime.js 过渡动画
  if (window.anime && area && area.children.length > 0) {
    anime({
      targets: Array.from(area.children),
      opacity: [1, 0],
      translateY: [0, -10],
      duration: 100,
      easing: 'easeIn',
      complete: function () {
        renderModule(mod);
        var newChildren = Array.from(area.children);
        if (newChildren.length) {
          anime.set(newChildren, { opacity: 0, translateY: 12 });
          anime({
            targets: newChildren,
            opacity: [0, 1],
            translateY: [12, 0],
            duration: 250,
            easing: 'easeOut'
          });
        }
      }
    });
  } else {
    renderModule(mod);
  }
}

// ===== 数据同步（本地服务器优先） =====
function loadFromSupabase() {
  if (!window.dbLoadAll) return Promise.resolve(0);
  return dbLoadAll().then(function(count) {
    if (count > 0) {
      console.log('已从服务器加载 ' + count + ' 条数据');
      // Sync hero settings from server data to localStorage keys
      var settings = getData('settings');
      for (var si = 0; si < settings.length; si++) {
        if (settings[si].key === 'hero_bg') localStorage.setItem('xie_hero_bg', settings[si].value || '');
        if (settings[si].key === 'hero_style') localStorage.setItem('xie_hero_style', settings[si].value || 'clean');
      }
      if (document.getElementById('admin-content-area') && document.getElementById('admin-content-area').innerHTML) {
        renderModule(currentModule);
        updateStats();
      }
    } else {
      console.log('服务器暂无数据，使用本地数据');
    }
    // 后台静默备份到 Supabase（不阻塞）
    if (window.backgroundSyncToSupabase) {
      setTimeout(function() { backgroundSyncToSupabase(); }, 2000);
    }
    return count;
  }).catch(function(e) {
    console.warn('服务器加载失败，使用本地数据:', e.message);
    return 0;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on admin page
  var panel = document.getElementById('admin-panel');
  if (!panel) return;

  // Check if already logged in (e.g., from main.js's adminLogin)
  var loginBox = document.getElementById('admin-login-box');
  var isLoggedIn = panel.classList.contains('active') || loginBox.style.display === 'none';
  if (isLoggedIn) {
    renderModule(currentModule);
    updateStats();
    // 登录后从 Supabase 加载数据
    loadFromSupabase();

    // 从 JSON 文件加载完整族谱数据（后台编辑与 AI 咨询读同一份 genealogy.json，避免数据源不一致）
    fetch('../data/genealogy.json').then(function(r){return r.json()}).then(function(full){
      if (full && full.length > 100) {
        localStorage.setItem('xie_admin_genealogy', JSON.stringify(full));
        // 族谱管理与世代总览都依赖这份数据，加载完成后都需刷新
        if (currentModule === 'genealogy' || currentModule === 'genealogyOverview') { renderModule(currentModule); updateStats(); }
      }
    }).catch(function(){});
    // Also override API-loaded data: delay to run after loadFromSupabase
    setTimeout(function() {
      fetch('../data/genealogy.json').then(function(r){return r.json()}).then(function(full){
        if (full && full.length > 100) {
          localStorage.setItem('xie_admin_genealogy', JSON.stringify(full));
          if (currentModule === 'genealogy' || currentModule === 'genealogyOverview') { renderModule(currentModule); updateStats(); }
        }
      }).catch(function(){});
    }, 2000);
  }

  // Override main.js logout to re-render
  var logoutBtn = document.getElementById('admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      var area = document.getElementById('admin-content-area');
      if (area) area.innerHTML = '';
    });
  }
});

// 暴露给 main.js 的 adminLogin 调用
window.loadFromSupabase = loadFromSupabase;

// ===== Photo thumbnail loader =====
function loadPhotoThumbnails() {
  var thumbs = document.querySelectorAll('.photo-thumb');
  if (!thumbs.length) return;
  // Determine which prefixes to load
  var prefixes = {};
  thumbs.forEach(function(el) {
    var prefix = el.getAttribute('data-file-prefix') || 'photo_';
    prefixes[prefix] = true;
  });
  var promises = Object.keys(prefixes).map(function(p) { return getAllFiles(p); });
  Promise.all(promises).then(function(results) {
    var map = {};
    results.forEach(function(files) {
      files.forEach(function(f) {
        // Extract ID from filename like photo_5 or carousel_3
        var parts = f.name.split('_');
        var id = parseInt(parts[parts.length - 1]);
        if (!isNaN(id)) map[id] = f.dataUrl;
      });
    });
    thumbs.forEach(function(el) {
      var id = parseInt(el.getAttribute('data-photo-id'));
      var hasFile = el.getAttribute('data-has-file') === 'true';
      if (map[id]) {
        el.innerHTML = '<img src="' + map[id] + '" style="width:48px;height:48px;object-fit:cover;">';
      } else if (hasFile) {
        el.innerHTML = '⚠️';
        el.title = '文件缺失，请重新上传';
        el.style.background = 'var(--bg-card)';
      }
    });
  });
}

// Patch renderModule for photos to load thumbnails
var origRender = renderModule;
renderModule = function(mod) {
  origRender(mod);
  if (mod === 'photos' || mod === 'templeCarousel') {
    setTimeout(loadPhotoThumbnails, 200);
  }
};

// Make functions global
// ===== 族谱：父亲切换时动态更新母亲选项 =====
function genealogyUpdateMother() {
  var fatherSelect = document.getElementById('field-father_id');
  var motherSelect = document.getElementById('field-mother_id');
  if (!fatherSelect || !motherSelect) return;

  var allPeople = getData('genealogy');
  var fatherId = parseInt(fatherSelect.value);
  var currentMotherVal = motherSelect.value;

  // 找当前父亲的配偶
  var fatherPerson = null;
  var recommendedMothers = [];
  if (fatherId) {
    for (var fi = 0; fi < allPeople.length; fi++) {
      if (allPeople[fi].id === fatherId) { fatherPerson = allPeople[fi]; break; }
    }
    if (fatherPerson && fatherPerson.spouse_ids) {
      var spouseNames = fatherPerson.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
      spouseNames.forEach(function(nm) {
        for (var fi2 = 0; fi2 < allPeople.length; fi2++) {
          if (allPeople[fi2].name === nm && allPeople[fi2].gender === '女') {
            recommendedMothers.push(allPeople[fi2]);
          }
        }
      });
    }
  }

  // 找出尚未建档的配偶姓名
  var unmatchedSpouseNames = [];
  if (fatherPerson && fatherPerson.spouse_ids) {
    var allSpos = fatherPerson.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
    allSpos.forEach(function(nm) {
      var found = false;
      for (var ri = 0; ri < recommendedMothers.length; ri++) {
        if (recommendedMothers[ri].name === nm) { found = true; break; }
      }
      if (!found) unmatchedSpouseNames.push(nm);
    });
  }

  var html = '<option value="">— 请选择 —</option>';
  var addedIds = {};

  // 推荐母亲（父亲的配偶）
  if (fatherPerson) {
    for (var ri = 0; ri < recommendedMothers.length; ri++) {
      var m = recommendedMothers[ri];
      var sel = currentMotherVal == m.id ? ' selected' : '';
      html += '<option value="' + m.id + '"' + sel + ' style="font-weight:600;color:var(--accent-orange);">★ ' + escapeHtml(m.name) + '（' + escapeHtml(fatherPerson.name) + '之配）</option>';
      addedIds[m.id] = true;
    }
    // 尚未建档的配偶（直接以姓名为值）
    for (var ui = 0; ui < unmatchedSpouseNames.length; ui++) {
      var nm = unmatchedSpouseNames[ui];
      var sel = currentMotherVal === nm ? ' selected' : '';
      html += '<option value="' + escapeHtml(nm) + '"' + sel + ' style="font-weight:600;color:var(--accent-orange);">★ ' + escapeHtml(nm) + '（' + escapeHtml(fatherPerson.name) + '之配，待建档）</option>';
      addedIds[nm] = true;
    }
  }

  var hasAnyRecommended = recommendedMothers.length > 0 || unmatchedSpouseNames.length > 0;
  if (fatherPerson && hasAnyRecommended) {
    html += '<option disabled style="font-size:11px;color:var(--text-tertiary);">─ 其他女性 ─</option>';
  }

  // 所有其他女性
  var otherWomen = [];
  for (var wi = 0; wi < allPeople.length; wi++) {
    if (allPeople[wi].gender !== '女' || addedIds[allPeople[wi].id]) continue;
    otherWomen.push(allPeople[wi]);
  }
  otherWomen.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0) || (a.name || '').localeCompare(b.name || ''); });
  for (var wi2 = 0; wi2 < otherWomen.length; wi2++) {
    var sel2 = currentMotherVal == otherWomen[wi2].id ? ' selected' : '';
    html += '<option value="' + otherWomen[wi2].id + '"' + sel2 + '>[' + (otherWomen[wi2].generation_num || '?') + '世] ' + escapeHtml(otherWomen[wi2].name) + '</option>';
  }

  motherSelect.innerHTML = html;
}

// ===== 族谱树：缩放和平移 =====
var treeZoom = 1;
var treePanX = 0, treePanY = 0;
var treeDragging = false, treeDragStartX, treeDragStartY, treePanStartX, treePanStartY;

function initTreePanZoom() {
  var vp = document.getElementById('apt-tree-viewport');
  if (!vp) return;
  var tree = vp.querySelector('.apt-tree');
  if (!tree) return;

  vp.onwheel = function(e) {
    e.preventDefault();
    var rect = vp.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var factor = e.deltaY < 0 ? 1.1 : 0.9;
    var newZoom = Math.max(0.1, Math.min(5, treeZoom * factor));
    treePanX = mx - (mx - treePanX) * (newZoom / treeZoom);
    treePanY = my - (my - treePanY) * (newZoom / treeZoom);
    treeZoom = newZoom;
    applyTreeTransform(tree);
    updateZoomLevel();
  };

  vp.onmousedown = function(e) {
    if (e.target.closest('.apt-zoom-btn, .apt-btn-expand, .apt-card, .apt-btn-add, .apt-btn-del, select, input, button')) return;
    treeDragging = true;
    treeDragStartX = e.clientX;
    treeDragStartY = e.clientY;
    treePanStartX = treePanX;
    treePanStartY = treePanY;
    vp.style.cursor = 'grabbing';
    e.preventDefault();
  };

  window.onmousemove = function(e) {
    if (!treeDragging) return;
    var dx = e.clientX - treeDragStartX;
    var dy = e.clientY - treeDragStartY;
    treePanX = treePanStartX + dx;
    treePanY = treePanStartY + dy;
    applyTreeTransform(tree);
  };

  window.onmouseup = function() {
    if (treeDragging) {
      treeDragging = false;
      var vp2 = document.getElementById('apt-tree-viewport');
      if (vp2) vp2.style.cursor = 'grab';
    }
  };
}

function applyTreeTransform(tree) {
  if (!tree) tree = document.querySelector('#apt-tree-viewport .apt-tree');
  if (!tree) return;
  tree.style.transform = 'translate(' + treePanX + 'px, ' + treePanY + 'px) scale(' + treeZoom + ')';
}

function zoomTree(factor) {
  var vp = document.getElementById('apt-tree-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!tree) return;
  if (factor === 1) {
    treeZoom = 1; treePanX = 0; treePanY = 0;
  } else {
    treeZoom = Math.max(0.1, Math.min(5, treeZoom * factor));
  }
  applyTreeTransform(tree);
  updateZoomLevel();
}

function fitTree() {
  var vp = document.getElementById('apt-tree-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!tree || !vp) return;
  var vpw = vp.clientWidth - 40, vph = vp.clientHeight - 40;
  var tw = tree.scrollWidth || 800, th = tree.scrollHeight || 600;
  var sx = vpw / tw, sy = vph / th;
  treeZoom = Math.min(sx, sy, 1.5);
  treeZoom = Math.max(0.1, treeZoom);
  treePanX = 20;
  treePanY = 20;
  applyTreeTransform(tree);
  updateZoomLevel();
}

function updateZoomLevel() {
  var el = document.getElementById('apt-zoom-level');
  if (el) el.textContent = Math.round(treeZoom * 100) + '%';
}

function toggleTreeFullscreen() {
  var split = document.querySelector('.apt-split');
  if (!split) return;
  split.classList.toggle('apt-tree-fullscreen');
  var btn = document.getElementById('apt-fullscreen-btn');
  if (btn) btn.textContent = split.classList.contains('apt-tree-fullscreen') ? '✕' : '⛶';
  setTimeout(function() { fitTree(); }, 100);
  if (split.classList.contains('apt-tree-fullscreen')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// ===== 世代总览：少数支系独立角落框（通用，丹三 1210 / 文榘 1211 及各自后代独立小树，点击缩放查看） =====
// 每框状态（zoom/pan/expanded）挂在本框 DOM 元素 _st 上，互不干扰

// 收集 rootId 及其全部后代 id（父链遍历，含环保护；供主区域剔除丹三支、角落框取数）
function collectOverviewSubtree(rootId, data) {
  var ids = {};
  ids[rootId] = true;
  var byFather = {};
  for (var i = 0; i < data.length; i++) {
    var f = parseInt(data[i].father_id);
    if (f && f !== data[i].id) { (byFather[f] = byFather[f] || []).push(data[i]); }
  }
  var stack = [rootId];
  while (stack.length) {
    var cur = stack.pop();
    var kids = byFather[cur];
    if (!kids) continue;
    for (var k = 0; k < kids.length; k++) {
      if (!ids[kids[k].id]) { ids[kids[k].id] = true; stack.push(kids[k].id); }
    }
  }
  return ids;
}

function buildCornerBoxHtml(boxId, title, data) {
  var n = data ? data.length : 0;
  var html = '<div class="apt-dsan-box" id="' + boxId + '">';
  html += '<div class="apt-dsan-header" title="' + title + '（' + n + '人）· 拖动移动位置 · 点击展开/收起">';
  html += '<span class="dsan-drag-icon">⠿</span><span>' + title + '</span><span class="dsan-count">' + n + '人</span><span class="dsan-toggle-btn">⛶</span>';
  html += '</div>';
  html += '<div class="apt-dsan-viewport">';
  html += buildAdminTreeHtml(data || [], {ancBox: false, hideBranch: true});
  html += '</div>';
  html += '<div class="apt-dsan-resize" title="拖动调整框大小"></div>';
  html += '</div>';
  return html;
}

function cornerBoxState(boxId) {
  var box = document.getElementById(boxId);
  if (!box) return null;
  if (!box._st) box._st = { z: 1, px: 0, py: 0, expanded: false };
  return box._st;
}

// 角落框位置/尺寸偏好：跨重渲染（renderGenealogyTree 重建 outerHTML）保留，并持久化到 localStorage
// x/y = 拖拽后的 left/top（null = 默认 right/bottom 定位）；w/h = 迷你尺寸；ew/eh = 展开尺寸（null = 默认类）
var __cornerBoxPrefs = null;
function loadCornerBoxPrefs() {
  if (__cornerBoxPrefs) return __cornerBoxPrefs;
  __cornerBoxPrefs = {};
  try {
    var s = localStorage.getItem('xie_admin_corner_boxes');
    if (s) { var o = JSON.parse(s); if (o && typeof o === 'object') __cornerBoxPrefs = o; }
  } catch (e) {}
  return __cornerBoxPrefs;
}
function cornerBoxPrefs(boxId) {
  var all = loadCornerBoxPrefs();
  if (!all[boxId]) all[boxId] = { x: null, y: null, w: 250, h: 168, ew: null, eh: null };
  return all[boxId];
}
function saveCornerBoxPrefs() {
  try { localStorage.setItem('xie_admin_corner_boxes', JSON.stringify(__cornerBoxPrefs)); } catch (e) {}
}

// 迷你模式：把整棵小树缩放到角落框内（layout 跑完后自然尺寸已定）
function fitCornerMini(boxId) {
  var box = document.getElementById(boxId);
  if (!box || !box._st) return;
  var vp = box.querySelector('.apt-dsan-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!vp || !tree) return;
  var W = tree.offsetWidth || 1, H = tree.offsetHeight || 1;
  if (W < 20 || H < 20) return; // 尚未布局（如数据未就绪的空树）
  var vw = vp.clientWidth || 240, vh = vp.clientHeight || 140;
  var s = Math.min(vw / W, vh / H);
  s = Math.max(0.02, Math.min(s, 1));
  var tx = Math.max(0, (vw - W * s) / 2); // 水平/垂直居中（树可能比框窄/矮）
  var ty = Math.max(0, (vh - H * s) / 2);
  tree.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
}

function toggleCornerBox(boxId) {
  var box = document.getElementById(boxId);
  if (!box) return;
  var st = cornerBoxState(boxId);
  var prefs = cornerBoxPrefs(boxId);
  st.expanded = !st.expanded;
  box.classList.toggle('dsan-expanded', st.expanded);
  var btn = box.querySelector('.dsan-toggle-btn');
  if (btn) btn.textContent = st.expanded ? '✕' : '⛶';
  var vp = box.querySelector('.apt-dsan-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (st.expanded) {
    // 展开：应用用户自定义展开尺寸（若有），无自定义则清空 inline 让 .dsan-expanded 类生效；先清 transform
    box.style.width = prefs.ew ? prefs.ew + 'px' : '';
    box.style.height = prefs.eh ? prefs.eh + 'px' : '';
    st.z = 1; st.px = 0; st.py = 0;
    if (tree) tree.style.transform = '';
    setTimeout(function() { fitCornerExpanded(boxId); }, 60);
    setTimeout(function() { fitCornerExpanded(boxId); }, 320); // 过渡(0.2s)结束后精确适应，避免小视口测得偏小
  } else {
    // 收起：回到用户自定义迷你尺寸（过渡结束后再测尺寸，避免框还在缩小测得视口偏大导致裁剪）
    box.style.width = (prefs.w || 250) + 'px';
    box.style.height = (prefs.h || 168) + 'px';
    st.z = 1; st.px = 0; st.py = 0;
    setTimeout(function() { fitCornerMini(boxId); }, 60);
    setTimeout(function() { fitCornerMini(boxId); }, 320);
  }
}

function fitCornerExpanded(boxId) {
  var box = document.getElementById(boxId);
  if (!box || !box._st || !box._st.expanded) return;
  var vp = box.querySelector('.apt-dsan-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!vp || !tree) return;
  var tw = tree.scrollWidth || tree.offsetWidth || 1;
  var th = tree.scrollHeight || tree.offsetHeight || 1;
  var vw = vp.clientWidth - 10, vh = vp.clientHeight - 10;
  var z = Math.min(vw / tw, vh / th);
  z = Math.max(0.05, Math.min(z, 1.5));
  box._st.z = z; box._st.px = 5; box._st.py = 5;
  applyCornerTransform(boxId);
}

function applyCornerTransform(boxId) {
  var box = document.getElementById(boxId);
  if (!box || !box._st) return;
  var tree = box.querySelector('.apt-dsan-viewport .apt-tree');
  if (!tree) return;
  tree.style.transform = 'translate(' + box._st.px + 'px,' + box._st.py + 'px) scale(' + box._st.z + ')';
}

function initCornerPanZoom(boxId) {
  var box = document.getElementById(boxId);
  if (!box || !box._st) return;
  var vp = box.querySelector('.apt-dsan-viewport');
  if (!vp) return;
  var drag = { on: false, sx: 0, sy: 0, pxs: 0, pys: 0 };
  vp.onwheel = function(e) {
    if (!box._st.expanded) return;
    e.preventDefault();
    var rect = vp.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    var f = e.deltaY < 0 ? 1.1 : 0.9;
    var nz = Math.max(0.05, Math.min(5, box._st.z * f));
    box._st.px = mx - (mx - box._st.px) * (nz / box._st.z);
    box._st.py = my - (my - box._st.py) * (nz / box._st.z);
    box._st.z = nz;
    applyCornerTransform(boxId);
  };
  vp.onmousedown = function(e) {
    if (!box._st.expanded) return;
    if (e.target.closest('.apt-card, button, select, input')) return;
    drag.on = true;
    drag.sx = e.clientX; drag.sy = e.clientY;
    drag.pxs = box._st.px; drag.pys = box._st.py;
    vp.style.cursor = 'grabbing';
    e.preventDefault();
  };
  vp.onmousemove = function(e) {
    if (!drag.on) return;
    box._st.px = drag.pxs + (e.clientX - drag.sx);
    box._st.py = drag.pys + (e.clientY - drag.sy);
    applyCornerTransform(boxId);
  };
  vp.onmouseup = function() {
    if (drag.on) { drag.on = false; vp.style.cursor = 'grab'; }
  };
  vp.onmouseleave = function() {
    if (drag.on) { drag.on = false; vp.style.cursor = 'grab'; }
  };
}

// 角落框自身交互：标题栏拖拽移动整个框（位移>6px 判拖拽，否则=点击展开/收起）；右下角手柄缩放框大小
// 位置/尺寸经 cornerBoxPrefs 记忆，跨重渲染保留并持久化到 localStorage
function initCornerBoxControls(boxId) {
  var box = document.getElementById(boxId);
  if (!box || box._cbInit) return;
  box._cbInit = true;
  var st = cornerBoxState(boxId);
  var prefs = cornerBoxPrefs(boxId);
  var header = box.querySelector('.apt-dsan-header');
  var resize = box.querySelector('.apt-dsan-resize');
  if (!header) return;

  // 恢复用户拖拽位置（left/top 覆盖默认 right/bottom 定位）
  if (prefs.x != null) {
    box.style.left = prefs.x + 'px';
    box.style.top = prefs.y + 'px';
    box.style.right = 'auto';
    box.style.bottom = 'auto';
  }
  // 恢复用户自定义尺寸（展开态用 ew/eh，否则用 mini 的 w/h）。
  // ⚠️ 展开态无自定义时须清空 inline，让 .dsan-expanded 类默认尺寸生效（inline 会永久覆盖类）
  if (st.expanded) {
    box.style.width = prefs.ew ? prefs.ew + 'px' : '';
    box.style.height = prefs.eh ? prefs.eh + 'px' : '';
  } else {
    box.style.width = (prefs.w || 250) + 'px';
    box.style.height = (prefs.h || 168) + 'px';
  }

  var drag = { on: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false };
  // 迷你态整框可拖（含迷你图区域，pointer-events:none 使事件穿透到框）；展开态仅标题栏可拖（树视口保留平移）
  box.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    if (st.expanded && !e.target.closest('.apt-dsan-header')) return; // 展开态：非标题栏区域归树视口平移/卡片
    if (e.target.closest('.apt-dsan-resize')) return;
    e.preventDefault();
    var r = box.getBoundingClientRect();
    drag.on = true; drag.moved = false;
    drag.sx = e.clientX; drag.sy = e.clientY;
    drag.ox = prefs.x != null ? prefs.x : r.left;
    drag.oy = prefs.y != null ? prefs.y : r.top;
    box.classList.add('cb-dragging');
  });
  document.addEventListener('mousemove', function(e) {
    if (!drag.on) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
    if (!drag.moved) return;
    var nx = Math.max(0, Math.min(window.innerWidth - 80, drag.ox + dx));
    var ny = Math.max(0, Math.min(window.innerHeight - 44, drag.oy + dy));
    prefs.x = nx; prefs.y = ny;
    box.style.left = nx + 'px'; box.style.top = ny + 'px';
    box.style.right = 'auto'; box.style.bottom = 'auto';
    saveCornerBoxPrefs();
  });
  document.addEventListener('mouseup', function() {
    if (!drag.on) return;
    drag.on = false;
    box.classList.remove('cb-dragging');
    if (!drag.moved) toggleCornerBox(boxId); // 原地点击 = 展开/收起
  });

  var rs = { on: false, sx: 0, sy: 0, w: 0, h: 0, expanded: false };
  resize.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    rs.on = true;
    rs.sx = e.clientX; rs.sy = e.clientY;
    rs.w = box.offsetWidth; rs.h = box.offsetHeight;
    rs.expanded = st.expanded;
    box.classList.add('cb-resizing');
  });
  document.addEventListener('mousemove', function(e) {
    if (!rs.on) return;
    var nw = Math.max(160, rs.w + (e.clientX - rs.sx));
    var nh = Math.max(110, rs.h + (e.clientY - rs.sy));
    if (rs.expanded) {
      prefs.ew = Math.min(nw, window.innerWidth - 20);
      prefs.eh = Math.min(nh, window.innerHeight - 20);
      box.style.width = prefs.ew + 'px'; box.style.height = prefs.eh + 'px';
      fitCornerExpanded(boxId); // 整树重新适应新视口
    } else {
      prefs.w = Math.min(nw, window.innerWidth - 20);
      prefs.h = Math.min(nh, window.innerHeight - 20);
      box.style.width = prefs.w + 'px'; box.style.height = prefs.h + 'px';
      fitCornerMini(boxId);
    }
    saveCornerBoxPrefs();
  });
  document.addEventListener('mouseup', function() {
    if (rs.on) { rs.on = false; box.classList.remove('cb-resizing'); }
  });
}

var origRenderGenealogyTree = renderGenealogyTree;
renderGenealogyTree = function() {
  var savedZoom = treeZoom, savedX = treePanX, savedY = treePanY;
  if (origRenderGenealogyTree) origRenderGenealogyTree();
  setTimeout(function() {
    initTreePanZoom();
    treeZoom = savedZoom;
    treePanX = savedX;
    treePanY = savedY;
    applyTreeTransform();
    updateZoomLevel();
  }, 50);
};

// ===== 族谱树：展开/折叠节点 =====
function toggleTreeNode(btn) {
  var card = btn.closest('.apt-card');
  if (!card) return;
  toggleTreeNodeByPid(card);
}

// 点击卡片/按钮 展开/折叠某大支（攒/撰/彬/乾等）；展开时只收起同级的其他可折叠大支，保持页面简洁
function toggleTreeNodeByPid(card) {
  if (!card) return;
  // 防抖：同一卡片 150ms 内只响应一次（按钮的 mouseup 冒泡 + click 双击会连触发两次）
  var now = Date.now();
  if (card._lastToggle && now - card._lastToggle < 150) return;
  card._lastToggle = now;
  var pid = card.getAttribute('data-pid');
  var root = card.closest('.apt-tree');
  if (!root || !pid) return;
  var sub = root.querySelector('.apt-sub[data-pid="' + pid + '"]');
  if (!sub) return;
  var btn = card.querySelector('.apt-btn-expand');
  var collapsed = sub.style.display === 'none';
  if (collapsed) {
    // 手风琴：展开一个时，只收起【同卡片行】的其他可折叠大支（攒/撰互斥、彬/乾互斥）。
    // 同一 .apt-cards-row = 同一父的兄弟支；不跨层级——否则在攒大支内点彬，会把祖先攒也收起导致彬不可见
    var cardRow = card.closest('.apt-cards-row');
    var others = root.querySelectorAll('.apt-card.apt-collapsible[data-pid]');
    for (var oi = 0; oi < others.length; oi++) {
      var oc = others[oi];
      if (oc === card) continue;
      if (cardRow && oc.closest('.apt-cards-row') !== cardRow) continue; // 只互斥同级兄弟支
      var opid = oc.getAttribute('data-pid');
      var osub = root.querySelector('.apt-sub[data-pid="' + opid + '"]');
      if (osub && osub.style.display !== 'none') {
        osub.style.display = 'none';
        var obtn = oc.querySelector('.apt-btn-expand');
        if (obtn) obtn.textContent = '▶';
      }
    }
  }
  sub.style.display = collapsed ? '' : 'none';
  if (btn) btn.textContent = collapsed ? '▼' : '▶';
  scheduleAptLayout();
}

// ===== 族谱树：按筛选条件重新渲染 =====
function renderGenealogyTree() {
  var treeEl = document.getElementById('admin-genealogy-tree');
  if (!treeEl) return;
  // ⚠️ 与世代总览一致：基于后台录入数据；丹三支/文榘支从主区域剔除（收进各自角落框）
  var allData = getData('genealogy');
  var dsanAllIds = collectOverviewSubtree(1210, allData);
  var wenjuAllIds = collectOverviewSubtree(1211, allData);
  var boxedIds = {};
  [1210, 1211].forEach(function(root) {
    var ids = (root === 1210) ? dsanAllIds : wenjuAllIds;
    for (var dk in ids) { if (+dk !== root) boxedIds[dk] = true; }
  });
  var mainData = allData.filter(function(p) { return !boxedIds[p.id]; });
  var genFilter = document.getElementById('tree-filter-gen');
  var filtered = mainData;
  if (genFilter && genFilter.value) {
    filtered = filtered.filter(function(p) { return String(p.generation_num) === genFilter.value; });
  }
  treeEl.innerHTML = buildAdminTreeHtml(filtered, {ancBox: true, hideBranch: true, noDescIds: {1209: true}, cornerIds: {1210: true, 1211: true}, collapsedIds: {12: true, 59: true, 60: true}, collapsibleIds: {12: true, 13: true, 59: true, 60: true}});
  // 同步刷新各角落框（数据可能已变化），重新绑定并缩成迷你图
  var dsanBox = document.getElementById('apt-dsan-box');
  if (dsanBox) {
    var dsanData = allData.filter(function(p) { return dsanAllIds[p.id]; });
    dsanBox.outerHTML = buildCornerBoxHtml('apt-dsan-box', '丹三支系', dsanData);
  }
  var wenjuBox = document.getElementById('apt-wenju-box');
  if (wenjuBox) {
    var wenjuData = allData.filter(function(p) { return wenjuAllIds[p.id]; });
    wenjuBox.outerHTML = buildCornerBoxHtml('apt-wenju-box', '文榘支系', wenjuData);
  }
  setTimeout(function() { initCornerBoxControls('apt-dsan-box'); initCornerPanZoom('apt-dsan-box'); fitCornerMini('apt-dsan-box'); initCornerBoxControls('apt-wenju-box'); initCornerPanZoom('apt-wenju-box'); fitCornerMini('apt-wenju-box'); }, 150);
}

window.genealogyUpdateMother = genealogyUpdateMother;
window.toggleTreeNode = toggleTreeNode;
window.toggleTreeNodeByPid = toggleTreeNodeByPid;
window.toggleCornerBox = toggleCornerBox;
window.renderGenealogyTree = renderGenealogyTree;
window.switchModule = switchModule;
window.showAddForm = showAddForm;
window.showEditForm = showEditForm;
window.adminLineageEditByName = adminLineageEditByName;
window.adminEditOrNotice = adminEditOrNotice;
window.deleteItem = deleteItem;
window.saveForm = saveForm;
window.renderModule = renderModule;
window.saveSettings = saveSettings;
window.resetAllData = resetAllData;
window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.loadPhotoThumbnails = loadPhotoThumbnails;
window.checkFileRepair = checkFileRepair;
window.repairMissingFiles = repairMissingFiles;
window.repairMissingVideoFiles = repairMissingVideoFiles;
window.filterGenealogyTable = filterGenealogyTable;
window.uploadHeroBg = uploadHeroBg;
window.removeHeroBg = removeHeroBg;
window.exportGenealogyCSV = exportGenealogyCSV;
window.importGenealogyCSV = importGenealogyCSV;
window.generateGenealogyBook = generateGenealogyBook;

// ===== 一键生成谱书 =====
function generateGenealogyBook() {
  var data = getData('genealogy');
  if (!data || data.length === 0) {
    showToast('没有族谱数据，请先添加人员');
    return;
  }
  // Open book view in new window
  var w = window.open('', '_blank');
  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>下枫槎谢氏宗谱</title>');
  w.document.write('<style>' +
    'body{margin:0;padding:0;font-family:"Noto Serif SC","STSong","SimSun","Songti SC",serif;background:#f5f0eb;color:#2d2a24;}' +
    '.book-wrap{max-width:800px;margin:0 auto;padding:40px 60px 80px;}' +
    '.cover{text-align:center;padding:120px 40px 80px;margin-bottom:40px;}' +
    '.cover h1{font-size:36px;letter-spacing:8px;margin-bottom:16px;color:#8b1a1a;}' +
    '.cover .sub{font-size:16px;color:#8b7355;letter-spacing:4px;margin-bottom:40px;}' +
    '.cover .year{font-size:14px;color:#666;margin-top:60px;}' +
    '.section-title{font-size:20px;font-weight:600;color:#8b1a1a;border-bottom:2px solid #c4a882;padding-bottom:8px;margin:40px 0 24px;letter-spacing:2px;}' +
    '.preface{font-size:14px;line-height:2.2;text-indent:2em;color:#444;margin-bottom:30px;}' +
    '.gen-table{width:100%;border-collapse:collapse;margin-bottom:30px;font-size:13px;}' +
    '.gen-table th{background:#c4a882;color:#fff;padding:8px 12px;text-align:left;font-weight:500;}' +
    '.gen-table td{padding:6px 12px;border-bottom:1px solid #ddd;}' +
    '.gen-table tr:hover td{background:#f5ede0;}' +
    '.biography{margin-bottom:20px;padding:16px 20px;background:#fff;border-left:3px solid #c4a882;border-radius:4px;}' +
    '.bio-name{font-size:16px;font-weight:600;color:#333;margin-bottom:4px;}' +
    '.bio-meta{font-size:12px;color:#999;margin-bottom:8px;}' +
    '.bio-text{font-size:13px;line-height:1.8;color:#555;}' +
    '.page-break{page-break-before:always;}' +
    '.gen-group{margin-bottom:30px;}' +
    '.gen-heading{font-size:18px;font-weight:600;color:#8b1a1a;padding:8px 16px;background:#f5ede0;border-radius:4px;margin-bottom:16px;}' +
    '.print-btn{position:fixed;bottom:30px;right:30px;padding:10px 24px;background:#8b1a1a;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.2);z-index:999;}' +
    '.print-btn:hover{background:#a52a2a;}' +
    '@media print{body{background:#fff;}.print-btn{display:none;}.book-wrap{padding:0;}}' +
    '</style></head><body>');
  w.document.write('<button class="print-btn" onclick="window.print()">🖨️ 打印谱书</button>');
  w.document.write('<div class="book-wrap">');

  // Cover page
  w.document.write('<div class="cover">');
  w.document.write('<h1>下枫槎谢氏宗谱</h1>');
  w.document.write('<div class="sub">敦睦堂珍藏</div>');
  w.document.write('<div style="margin:30px 0;font-size:15px;color:#8b7355;line-height:2;">乌衣世泽 · 宝树家声</div>');
  w.document.write('<div class="year">公元二〇二六年 丙午年春 续修</div>');
  w.document.write('</div>');

  // Preface
  w.document.write('<div class="section-title">谱序</div>');
  w.document.write('<div class="preface">盖闻木有本而枝叶茂，水有源而流派长。下枫槎谢氏，自北宋宣和年间文杲公居岩下以来，历九百载，传三十六世。明隆庆壬申（一五七二年）迁居枫槎，至今四百五十余年。今续修宗谱于丙午之春（公元二〇二六年），敦睦堂珍藏，分上下两册。凡我族人，当览斯谱而明世系、序昭穆、敦亲睦、传家风，继往开来，光大门楣。</div>');

  // Stats
  var total = data.length;
  var gens = {}, branchSet = {}, males = 0, females = 0;
  var skipBranches = ['长房', '二房', '三房', '四房', '后枫椿', '前枫椿', '临海下渡', '石马下谢', '枫椿分支', '前枫槎派', '后枫槎东房', '枫槎始祖'];
  data.forEach(function(p) {
    gens[p.generation_num || 0] = (gens[p.generation_num || 0] || 0) + 1;
    if (p.branch && p.branch !== '—' && skipBranches.indexOf(p.branch) < 0) branchSet[p.branch] = true;
    if (p.gender === '男') males++;
    if (p.gender === '女') females++;
  });
  var genKeys = Object.keys(gens).filter(Number).sort(function(a,b){return a-b;});
  w.document.write('<div style="text-align:center;font-size:13px;color:#666;margin-bottom:30px;padding:16px;background:#f5ede0;border-radius:8px;">');
  w.document.write('总人口 ' + total + ' 人 · ' + genKeys.length + ' 世 · ' + Object.keys(branchSet).length + ' 支系 · 男 ' + males + ' 人 · 女 ' + females + ' 人');
  w.document.write('</div>');

  // Lineage table by generation (世系表)
  w.document.write('<div class="section-title page-break">世系表</div>');
  genKeys.forEach(function(g) {
    var members = data.filter(function(p) { return p.generation_num === parseInt(g); });
    if (members.length === 0) return;
    members.sort(function(a, b) { return (a.name || '').localeCompare(b.name || ''); });
    w.document.write('<div class="gen-group">');
    w.document.write('<div class="gen-heading">第' + g + '世（共' + members.length + '人）</div>');
    w.document.write('<table class="gen-table"><thead><tr><th>姓名</th><th>性别</th><th>字辈</th><th>支系</th><th>父亲</th><th>配偶</th><th>生卒</th><th>居住地</th></tr></thead><tbody>');
    members.forEach(function(p) {
      var fatherName = '—';
      if (p.father_id) {
        for (var fi = 0; fi < data.length; fi++) {
          if (data[fi].id === parseInt(p.father_id)) { fatherName = data[fi].name; break; }
        }
      }
      var spouseNames = p.spouse_ids ? p.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;}).join('、') : '—';
      w.document.write('<tr><td>' + escapeHtml(p.name) + '</td><td>' + (p.gender || '—') + '</td><td>' + (p.generation || '—') + '</td><td>' + (p.branch || '—') + '</td><td>' + fatherName + '</td><td>' + spouseNames + '</td><td>' + (p.birth_date||'') + (p.death_date ? '~' + p.death_date : '') + '</td><td>' + escapeHtml(p.address||'') + '</td></tr>');
    });
    w.document.write('</tbody></table></div>');
  });

  // Biographies (行传)
  w.document.write('<div class="section-title page-break">行传</div>');
  data.sort(function(a, b) { return (a.generation_num || 0) - (b.generation_num || 0) || (a.name || '').localeCompare(b.name || ''); });
  data.forEach(function(p) {
    if (!p.biography && !p.birth_date && !p.death_date) return; // Skip entries with no info
    w.document.write('<div class="biography">');
    w.document.write('<div class="bio-name">' + escapeHtml(p.name) + (p.generation_num ? '（第' + p.generation_num + '世）' : '') + '</div>');
    w.document.write('<div class="bio-meta">');
    var parts = [];
    if (p.gender) parts.push(p.gender);
    if (p.generation && p.generation !== '—') parts.push(p.generation + '字辈');
    if (p.branch && p.branch !== '—') parts.push(p.branch);
    if (p.birth_date || p.death_date) parts.push((p.birth_date||'') + (p.death_date ? ' ~ ' + p.death_date : ''));
    if (p.is_alive === '是') parts.push('在世');
    if (p.address) parts.push('居' + p.address);
    w.document.write(parts.join(' · '));
    w.document.write('</div>');
    if (p.spouse_ids) {
      var sp = p.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
      if (sp.length > 0) w.document.write('<div style="font-size:12px;color:#888;margin-bottom:6px;">配: ' + escapeHtml(sp.join('、')) + '</div>');
    }
    if (p.biography) {
      w.document.write('<div class="bio-text">' + escapeHtml(p.biography).replace(/\n/g, '<br>') + '</div>');
    }
    w.document.write('</div>');
  });

  // Family tree diagram (世系图) - simplified vertical text diagram
  w.document.write('<div class="section-title page-break">世系图</div>');
  w.document.write('<div style="font-size:12px;color:#666;margin-bottom:16px;">以下为各世系传承关系：</div>');

  // Build tree structure from data
  var existingIds = {};
  data.forEach(function(p) { existingIds[p.id] = true; });
  var roots = data.filter(function(p) {
    return !p.father_id || !existingIds[parseInt(p.father_id)];
  });
  // Filter out spouses from roots
  var spouseIds = {};
  data.forEach(function(p) {
    if (p.spouse_ids) {
      var names = p.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
      data.forEach(function(other){
        if (other.id !== p.id && names.indexOf(other.name) !== -1) spouseIds[other.id] = p.id;
      });
    }
  });
  roots = roots.filter(function(p){ return !spouseIds[p.id] || spouseIds[p.id] > p.id; });
  if (roots.length === 0 && data.length > 0) roots = [data[0]];

  function renderLineage(person, depth) {
    var children = data.filter(function(p) { return parseInt(p.father_id) === person.id || parseInt(p.mother_id) === person.id; });
    var indent = depth * 20;
    var marker = depth === 0 ? '●' : '○';
    var spouseTxt = '';
    if (person.spouse_ids) {
      var sp = person.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
      if (sp.length > 0) spouseTxt = ' 配 ' + sp.join('、');
    }
    var genTxt = person.generation_num ? '第' + person.generation_num + '世' : '';
    var html = '<div style="padding-left:' + indent + 'px;padding-top:4px;font-size:13px;line-height:1.8;">';
    html += '<span style="color:#8b1a1a;margin-right:6px;">' + marker + '</span>';
    html += '<strong>' + escapeHtml(person.name) + '</strong>';
    if (genTxt) html += ' <span style="color:#999;font-size:12px;">' + genTxt + '</span>';
    if (spouseTxt) html += ' <span style="color:#888;font-size:12px;">' + spouseTxt + '</span>';
    if (person.biography && person.biography.length > 60) html += ' <span style="color:#aaa;font-size:11px;">——' + escapeHtml(person.biography.slice(0,60)) + '…</span>';
    html += '</div>';
    children.forEach(function(child) {
      html += renderLineage(child, depth + 1);
    });
    return html;
  }
  roots.forEach(function(root) {
    w.document.write('<div style="margin-bottom:20px;padding:12px 16px;background:#fff;border-radius:6px;border:1px solid #e8ddd0;">');
    w.document.write(renderLineage(root, 0));
    w.document.write('</div>');
  });

  // End
  w.document.write('<div style="text-align:center;padding:60px 0 40px;color:#999;font-size:13px;">— 谱书完 —</div>');
  w.document.write('<div style="text-align:center;color:#999;font-size:12px;padding-bottom:40px;">下枫槎谢氏数字宗祠 · 公元二〇二六年</div>');
  w.document.write('</div></body></html>');
  w.document.close();
}

// ===== 数据备份提醒 =====
// 启动时提醒一次
setTimeout(function() {
  var lastBackup = localStorage.getItem('xie_last_backup_date');
  var today = new Date().toISOString().slice(0, 10);
  if (lastBackup !== today) {
    var msg = '💾 数据备份提醒\n\n请记得备份族谱数据，防止丢失。\n\n点击族谱管理顶部的「⬇️导出JSON」下载到电脑。\n或点击「📥手动备份」同步到服务器。';
    var notified = localStorage.getItem('xie_backup_notified_' + today);
    if (!notified) {
      localStorage.setItem('xie_backup_notified_' + today, '1');
      setTimeout(function() {
        showToast(msg);
      }, 5000);
    }
  }
}, 3000);

// 每7天自动提醒一次
setInterval(function() {
  var lastExport = localStorage.getItem('xie_last_export_date');
  if (lastExport) {
    var days = Math.floor((Date.now() - new Date(lastExport).getTime()) / 86400000);
    if (days >= 7) {
      showToast('⏰ 已7天未导出数据，请点「⬇️导出JSON」备份');
    }
  }
}, 86400000); // 每天检查一次

// 记录导出日期
document.addEventListener('click', function(e) {
  if (e.target.textContent && e.target.textContent.includes('导出JSON')) {
    localStorage.setItem('xie_last_export_date', new Date().toISOString().slice(0, 10));
    localStorage.setItem('xie_last_backup_date', new Date().toISOString().slice(0, 10));
  }
});

// Tree card click handler (supports both normal edit and link mode)
function handleTreeCardClick(event, personId) {
  if (linkMode) {
    // Handled by the document click listener
    return;
  }
  showEditForm('genealogy', personId);
}

// ===== 连接模式：手动建立世系关系 =====
var linkMode = false;
var linkSource = null; // 第一个选中的person

function toggleLinkMode() {
  linkMode = !linkMode;
  linkSource = null;
  var btn = document.getElementById('link-mode-btn');
  var status = document.getElementById('link-status');
  if (!btn || !status) return;
  if (linkMode) {
    btn.style.color = '#2196f3';
    btn.style.background = 'rgba(33,150,243,0.15)';
    status.style.display = 'block';
    status.textContent = '🔗 连接模式: 点击树中第一个人（来源）';
  } else {
    btn.style.color = '';
    btn.style.background = '';
    status.style.display = 'none';
  }
}

// Hook into tree card clicks for connection mode
var origTreeClick = window._treeCardClick;
window._treeCardClick = function(personId, e) {
  if (origTreeClick) origTreeClick(personId, e);
};

// ===== 拖拽建立世系关系 =====
var dragPersonId = null;

function onCardDragStart(event, personId) {
  dragPersonId = personId;
  event.dataTransfer.setData('text/plain', personId);
  event.dataTransfer.effectAllowed = 'move';
}

function onCardDrop(event) {
  event.preventDefault();
  // Reset outline
  var cards = document.querySelectorAll('.apt-card');
  for (var ci = 0; ci < cards.length; ci++) cards[ci].style.outline = '';

  var sourceId = dragPersonId;
  var targetCard = event.target.closest('.apt-card');
  if (!targetCard) return;
  var targetId = parseInt(targetCard.getAttribute('data-pid'));
  if (!targetId || sourceId === targetId) return;

  var data = getData('genealogy');
  var source = null, target = null;
  for (var di = 0; di < data.length; di++) {
    if (data[di].id === sourceId) source = data[di];
    if (data[di].id === targetId) target = data[di];
  }
  if (!source || !target) return;

  // Ask what relationship to create
  var choice = prompt(
    '将 ' + source.name + ' 拖到 ' + target.name + '\n\n'
    + '1. ' + source.name + ' 做 ' + target.name + ' 的儿子\n'
    + '2. ' + source.name + ' 做 ' + target.name + ' 的父亲\n'
    + '3. ' + source.name + ' 和 ' + target.name + ' 做兄弟\n\n'
    + '请输入 1/2/3 (回车取消)',
    '1'
  );

  if (!choice) return;
  var saved = false;
  if (choice === '1') { source.father_id = target.id; saved = true; }
  else if (choice === '2') { target.father_id = source.id; saved = true; }
  else if (choice === '3') {
    if (target.father_id) { source.father_id = target.father_id; saved = true; }
    else { alert(target.name + ' 没有父亲，无法建立兄弟关系'); }
  }

  if (saved) {
    localStorage.setItem('_genealogy_use_local', 'true');
    syncToServer('genealogy', data);  // save to API (async)
    alert('✅ 关系已建立');
    // 直接用更新后的数据渲染
    var area = document.getElementById('admin-content-area');
    if (area) renderGenealogy(area);
  }
  dragPersonId = null;
}

// ===== 世系原始数据（用于合并到全部世代总览） =====
var _SHENBO_RAW = [
  [65,1,'申伯','谢氏鼻祖','佐'],[66,2,'弘','申伯之子','申伯'],[66,2,'猛','申伯之子','申伯'],
  [67,3,'广','弘之子','弘'],[67,3,'协','弘之子','弘'],
  [68,4,'列宗','广之子','广'],[68,4,'穆宗','广之子','广'],
  [69,5,'骘','列宗之子','列宗'],[70,6,'预','骘之子','骘'],[71,7,'昌后','预之子','预'],
  [72,8,'达','昌后之子','昌后'],[72,8,'守礼','昌后之子','昌后'],
  [73,9,'子民','达之子','达'],[74,10,'秩','子民之子','子民'],
  [75,11,'雍','秩之子','秩'],[76,12,'林','雍之子','雍'],
  [77,13,'涣','林之子','林'],[78,14,'旺','涣之子','涣'],
  [79,15,'珽','旺之子','旺'],[80,16,'国辉','珽之子','珽'],
  [81,17,'宁','国辉之子','国辉'],[82,18,'福','宁之子','宁'],
  [83,19,'杨贞','福之子','福'],
  [84,20,'平利','杨贞之子','杨贞'],[84,20,'平和','杨贞之子','杨贞'],[84,20,'平祖','杨贞之子','杨贞'],
  [85,21,'翠','平和之子','平和'],[85,21,'利','平和之子','平和'],[85,21,'文','平和之子','平和'],
  [86,22,'武','文之子','文'],[87,23,'秉槐','武之子','武'],[88,24,'堂','秉槐之子','秉槐'],
  [89,25,'瑛','堂之子','堂'],[90,26,'文轩','瑛之子','瑛'],[90,26,'文昂','瑛之子','瑛'],
  [91,27,'福郎','文轩之子','文轩'],[91,27,'丙郎','文轩之子','文轩'],[91,27,'应郎','文轩之子','文轩'],
  [92,28,'宜礼','福郎之子','福郎'],[92,28,'宜乐','福郎之子','福郎'],
  [93,29,'逵','宜礼之子','宜礼'],[94,30,'简','逵之子','逵'],[95,31,'瑰','简之子','简'],
  [96,32,'懿','瑰之子','瑰'],[97,33,'鳅','懿之子','懿'],
  [98,34,'当','鳅之后','鳅'],[98,34,'景秀','鳅之后','鳅'],
  [99,35,'缵','景秀之后/东山第一世','景秀'],[99,35,'显','景秀之后','景秀'],[99,35,'顼','景秀之后','景秀']
];
var _DONGSHAN_RAW = [
  [99,35,'缵','东山第一世',null],[100,36,'衡','会稽东山始祖','缵'],
  [100,37,'鲲','衡之子','衡'],[100,37,'裒','衡之子，谢安之父','衡'],[100,37,'广','衡之子','衡'],
  [101,38,'奕','裒之子','裒'],[101,38,'据','裒之子','裒'],[101,38,'安','字安石，东晋名相','裒'],
  [101,38,'万','裒之子','裒'],[101,38,'淮','裒之子','裒'],[101,38,'石','裒之子','裒'],[101,38,'铁','裒之子','裒'],
  [102,39,'瑶','安之子','安'],[102,39,'琰','安之子','安'],
  [103,40,'肇','琰之子','琰'],[103,40,'峻','琰之子','琰'],[103,40,'混','琰之子','琰'],
  [104,41,'密','混之子','混'],[105,42,'庄','密之子','密'],
  [106,43,'飏','庄之子','庄'],[106,43,'胜','庄之子','庄'],[106,43,'灏','庄之子','庄'],[106,43,'丛','庄之子','庄'],[106,43,'沦','庄之子','庄'],
  [107,44,'览','飏之子','飏'],[108,45,'琢','览之子','览'],[108,45,'侨','览之子','览'],
  [109,46,'琂','琢之子','琢'],[109,46,'琬','琢之子','琢'],
  [110,47,'峤','琂之子','琂'],[110,47,'植','琂之子','琂'],
  [111,48,'钝','植之子','植'],[111,48,'缪','植之子','植'],
  [112,49,'修','钝之子','钝'],[112,49,'豹','钝之子','钝'],
  [113,50,'恺','修之子','修'],[114,51,'骢','恺之子','恺'],[114,51,'驼','恺之子','恺'],[114,51,'绰','恺之子','恺'],
  [115,52,'式','绰之子','绰'],[116,53,'革','式之子','式'],[116,53,'造','式之子','式'],
  [117,54,'直','造之子','造'],[118,55,'是温','直之子','直'],
  [119,56,'翳','是温之子','是温'],[120,57,'静','翳之子','翳'],[120,57,'观','翳之子','翳'],
  [122,58,'闓','观之子/临海下渡第一世','观']
];
var _LINHAI_RAW = [
  [122,58,'闓','观之子/临海下渡第一世',null],
  [122,59,'俨','闓之子','闓'],[123,60,'诜','俨之子','俨'],
  [124,61,'景之','诜之子','诜'],[124,61,'考之','诜之子','诜'],
  [125,62,'润甫','景之之后','景之'],[125,62,'深甫','景之之后','景之'],
  [126,63,'采伯','深甫之后','深甫'],[126,63,'渠伯','深甫之后','深甫'],[126,63,'棐伯','深甫之后','深甫'],[126,63,'彚伯','深甫之后','深甫'],
  [127,64,'奕修','采伯之后','采伯'],[127,64,'奕懋','采伯之后','采伯'],[127,64,'奕恭','采伯之后','采伯'],[127,64,'奕容','采伯之后','采伯'],[127,64,'奕信','采伯之后','采伯'],
  [128,65,'在鉴','奕信之后','奕信'],[128,65,'在勋','奕信之后','奕信'],[128,65,'在纲','奕信之后','奕信'],[128,65,'在机','奕信之后','奕信'],
  [130,66,'大四','在纲之后','在纲'],[130,66,'小四','在纲之后','在纲']
];
var _SHIMA_RAW = [
  [1,'小四','石马第一世',null],[2,'丹一','小四之子','小四'],[2,'丹二','小四之子','小四'],[2,'丹三','小四之子','小四'],
  [3,'文杲','丹一之后，枫槎谢氏始迁祖','丹一'],[3,'文榘','丹一之后，东门桃源陈氏之祖','丹一'],[3,'丹九','丹三之后','丹三'],
  [4,'廿一','丹九之后','丹九'],[4,'廿二','丹九之后','丹九'],[4,'廿四','丹九之后','丹九'],
  [4,'十三','文榘之后','文榘'],[4,'十七','文榘之后','文榘'],[4,'二一','文榘之后','文榘'],
  [5,'廿七','十三之后','十三'],[5,'廿九','十三之后','十三'],[5,'三十一','十三之后','十三'],[5,'四十','廿二之后','廿二'],
  [6,'百十','廿七之后','廿七'],[6,'庆三','廿七之后','廿七'],
  [6,'千九','四十之后','四十'],[6,'千十','四十之后','四十'],[6,'千十一','四十之后','四十'],[6,'千十三','四十之后','四十'],
  [7,'敬乙','庆三之后','庆三'],[7,'一廷','千十一之后','千十一'],[7,'隆','千十一之后','千十一'],
  [8,'琰','隆之后','隆'],[8,'琇','隆之后','隆'],
  [9,'位','琰之后','琰'],[9,'倍','琰之后','琰'],[9,'侍','琰之后','琰'],[9,'体','琰之后','琰'],[9,'旦','琰之后','琰'],[9,'俱生','琇之后','琇'],
  [10,'礼','位之后','位'],[10,'管','位之后','位'],[10,'罗','位之后','位'],
  [11,'泰鹏','管之后','管'],[11,'泰颚','管之后','管'],
  [12,'秀廉','泰颚之后','泰颚'],[12,'秀洁','泰颚之后','泰颚'],[12,'秀驹','泰颚之后','泰颚']
];

// ===== 世系数据提取函数（用于合并到全部世代总览） =====
function _rawToData(raw, baseId, branch) {
  var nameToId = {}, data = [];
  // Detect format
  var isShima = (raw.length > 0 && raw[0].length === 4);
  var ni = isShima ? 1 : 2;
  var di = isShima ? 2 : 3;
  var fi = isShima ? 3 : 4;
  for (var i = 0; i < raw.length; i++) nameToId[raw[i][ni]] = baseId + i;
  for (var i = 0; i < raw.length; i++) {
    var r = raw[i], pid = baseId + i;
    data.push({
      id: pid, name: r[ni], gender: '男', generation_num: r[0], generation: r[0].toString(),
      branch: branch, father_id: r[fi] ? (nameToId[r[fi]] || null) : null,
      spouse_ids: '', is_alive: '否', biography: r[di], highlight: i === 0
    });
  }
  return data;
}
function getShenboData() { return _rawToData(_SHENBO_RAW, 10000, '申伯世系'); }
function getDongshanData() { return _rawToData(_DONGSHAN_RAW, 20000, '东山世系'); }
function getLinhaiData() { return _rawToData(_LINHAI_RAW, 30000, '临海下渡'); }
function getShimaData() { return _rawToData(_SHIMA_RAW, 40000, '石马分房'); }

// 统一世系数据（申伯→小四，无重复、连接准确）
function _ancientRawToData(raw) {
  // raw format: [gen, name, note, parentName] → convert to proper objects
  var nameToId = {}, data = [];
  for (var i = 0; i < raw.length; i++) { if (!nameToId[raw[i][1]]) nameToId[raw[i][1]] = 50000 + i; }
  for (var i = 0; i < raw.length; i++) {
    var r = raw[i], pid = 50000 + i;
    data.push({
      id: pid, name: r[1], gender: '男', generation_num: r[0], generation: r[0].toString(),
      branch: '古世系', father_id: r[3] ? (nameToId[r[3]] || null) : null,
      spouse_ids: '', is_alive: '否', biography: r[2], highlight: i === 0
    });
  }
  return data;
}
function getAllAncientData() {
  return _ancientRawToData([
    // 远古世系 — 炎帝→申伯
    [1,'炎帝神农氏','中华民族人文始祖',null],[2,'临魁','炎帝之子','炎帝神农氏'],
    [10,'榆罔','临魁之后','临魁'],[11,'帝柱','榆罔之后','榆罔'],
    [15,'祝融','帝柱之后','帝柱'],[54,'吕尚','姜太公，周朝开国功臣','祝融'],
    [55,'佐','吕尚之子，申伯之父','吕尚'],
    // 申伯世系 — 炎帝65→99
    [65,'申伯','谢氏鼻祖','佐'],[66,'弘','申伯之子','申伯'],[66,'猛','申伯之子','申伯'],
    [67,'广','弘之子','弘'],[67,'协','弘之子','弘'],
    [68,'列宗','广之子','广'],[68,'穆宗','广之子','广'],
    [69,'骘','列宗之子','列宗'],[70,'预','骘之子','骘'],[71,'昌后','预之子','预'],
    [72,'达','昌后之子','昌后'],[72,'守礼','昌后之子','昌后'],
    [73,'子民','达之子','达'],[74,'秩','子民之子','子民'],
    [75,'雍','秩之子','秩'],[76,'林','雍之子','雍'],
    [77,'涣','林之子','林'],[78,'旺','涣之子','涣'],
    [79,'珽','旺之子','旺'],[80,'国辉','珽之子','珽'],
    [81,'宁','国辉之子','国辉'],[82,'福','宁之子','宁'],
    [83,'杨贞','福之子','福'],
    [84,'平利','杨贞之子','杨贞'],[84,'平和','杨贞之子','杨贞'],[84,'平祖','杨贞之子','杨贞'],
    [85,'翠','平和之子','平和'],[85,'利','平和之子','平和'],[85,'文','平和之子','平和'],
    [86,'武','文之子','文'],[87,'秉槐','武之子','武'],[88,'堂','秉槐之子','秉槐'],
    [89,'瑛','堂之子','堂'],[90,'文轩','瑛之子','瑛'],[90,'文昂','瑛之子','瑛'],
    [91,'福郎','文轩之子','文轩'],[91,'丙郎','文轩之子','文轩'],[91,'应郎','文轩之子','文轩'],
    [92,'宜礼','福郎之子','福郎'],[92,'宜乐','福郎之子','福郎'],
    [93,'逵','宜礼之子','宜礼'],[94,'简','逵之子','逵'],[95,'瑰','简之子','简'],
    [96,'懿','瑰之子','瑰'],[97,'鳅','懿之子','懿'],
    [98,'当','鳅之后','鳅'],[98,'景秀','鳅之后','鳅'],
    [99,'缵','景秀之后/东山第一世','景秀'],[99,'显','景秀之后','景秀'],[99,'顼','景秀之后','景秀'],
    // 东山世系 — 炎帝100→121
    [100,'衡','会稽东山始祖','缵'],[101,'鲲','衡之子','衡'],[101,'裒','衡之子，谢安之父','衡'],[101,'广','衡之子','衡'],
    [102,'奕','裒之子','裒'],[102,'据','裒之子','裒'],[102,'安','字安石，东晋名相','裒'],[102,'万淮','裒之子','裒'],[102,'石','裒之子','裒'],[102,'铁','裒之子','裒'],
    [103,'瑶','安之子','安'],[103,'琰','安之子','安'],
    [104,'肇','琰之子','琰'],[104,'峻','琰之子','琰'],[104,'混','琰之子','琰'],
    [105,'密','峻之子','峻'],[106,'庄','密之子','密'],
    [107,'飏','庄之子','庄'],[107,'胜','庄之子','庄'],[107,'灏','庄之子','庄'],[107,'丛','庄之子','庄'],[107,'沦','庄之子','庄'],
    [108,'览','沦之子','沦'],[109,'琢','览之子','览'],[109,'侨','览之子','览'],
    [110,'琂','琢之子','琢'],[110,'琬','琢之子','琢'],
    [111,'峤','琂之子','琂'],[111,'植','琂之子','琂'],
    [112,'钝','植之子','植'],[112,'缪','植之子','植'],
    [113,'修','钝之子','钝'],[113,'豹','钝之子','钝'],
    [114,'恺','修之子','修'],
    [115,'骢','恺之子','恺'],[115,'驼','恺之子','恺'],[115,'绰','恺之子','恺'],
    [116,'式','绰之子','绰'],[117,'革','式之子','式'],[117,'造','式之子','式'],
    [118,'直','造之子','造'],[119,'是温','直之子','直'],
    [120,'翳','是温之子','是温'],[121,'静','翳之子','翳'],[121,'观','翳之子','翳'],
    [122,'闓','观之子/临海下渡第一世','观'],
    // 临海下渡 — 炎帝122→129
    [123,'俨','闓之子','闓'],[124,'诜','俨之子','俨'],
    [125,'景之','诜之子','诜'],[125,'考之','诜之子','诜'],
    [126,'润甫','景之之后','景之'],[126,'深甫','景之之后','景之'],
    [127,'采伯','深甫之后','深甫'],[127,'渠伯','深甫之后','深甫'],[127,'棐伯','深甫之后','深甫'],[127,'彚伯','深甫之后','深甫'],
    [128,'奕修','采伯之后','采伯'],[128,'奕懋','采伯之后','采伯'],[128,'奕恭','采伯之后','采伯'],[128,'奕容','采伯之后','采伯'],[128,'奕信','采伯之后','采伯'],
    [129,'在鉴','奕信之后','奕信'],[129,'在勋','奕信之后','奕信'],[129,'在纲','奕信之后','奕信'],[129,'在机','奕信之后','奕信'],
    [130,'大四','在纲之后','在纲'],[130,'小四','在纲之后','在纲'],
    // 石马分房 — 炎帝130→140
    [131,'丹一','小四之子','小四'],[131,'丹二','小四之子','小四'],[131,'丹三','小四之子','小四'],
    [132,'文杲','丹一之后，枫槎谢氏始迁祖','丹一'],[132,'文榘','丹一之后，东门桃源陈氏之祖','丹一'],[132,'丹九','丹三之后','丹三'],
    [133,'廿一','丹九之后','丹九'],[133,'廿二','丹九之后','丹九'],[133,'廿四','丹九之后','丹九'],
    [133,'十三','文榘之后','文榘'],[133,'十七','文榘之后','文榘'],[133,'二一','文榘之后','文榘'],
    [133,'廿七','十三之后','十三'],[133,'廿九','十三之后','十三'],[133,'三十一','十三之后','十三'],[133,'四十','廿二之后','廿二'],
    [134,'百十','廿七之后','廿七'],[134,'庆三','廿七之后','廿七'],
    [134,'千九','四十之后','四十'],[134,'千十','四十之后','四十'],[134,'千十一','四十之后','四十'],[134,'千十三','四十之后','四十'],
    [135,'敬乙','庆三之后','庆三'],[135,'一廷','千十一之后','千十一'],[135,'隆','千十一之后','千十一'],
    [136,'琰·石马','隆之后','隆'],[136,'琇','隆之后','隆'],
    [137,'位','琰之后','琰·石马'],[137,'倍','琰之后','琰·石马'],[137,'侍','琰之后','琰·石马'],[137,'体','琰之后','琰·石马'],[137,'旦','琰之后','琰·石马'],[137,'俱生','琇之后','琇'],
    [138,'礼','位之后','位'],[138,'管','位之后','位'],[138,'罗','位之后','位'],
    [139,'泰鹏','管之后','管'],[139,'泰颚','管之后','管'],
    [140,'秀廉','泰颚之后','泰颚'],[140,'秀洁','泰颚之后','泰颚'],[140,'秀驹','泰颚之后','泰颚']
  ]);
}

// ===== 申伯世系完整树状图（管理后台使用） =====
function buildAdminShenboTree() {
  var raw = [
    [65,1,'申伯','谢氏鼻祖','佐'],[66,2,'弘','申伯之子','申伯'],[66,2,'猛','申伯之子','申伯'],
    [67,3,'广','弘之子','弘'],[67,3,'协','弘之子','弘'],
    [68,4,'列宗','广之子','广'],[68,4,'穆宗','广之子','广'],
    [69,5,'骘','列宗之子','列宗'],[70,6,'预','骘之子','骘'],[71,7,'昌后','预之子','预'],
    [72,8,'达','昌后之子','昌后'],[72,8,'守礼','昌后之子','昌后'],
    [73,9,'子民','达之子','达'],[74,10,'秩','子民之子','子民'],
    [75,11,'雍','秩之子','秩'],[76,12,'林','雍之子','雍'],
    [77,13,'涣','林之子','林'],[78,14,'旺','涣之子','涣'],
    [79,15,'珽','旺之子','旺'],[80,16,'国辉','珽之子','珽'],
    [81,17,'宁','国辉之子','国辉'],[82,18,'福','宁之子','宁'],
    [83,19,'杨贞','福之子','福'],
    [84,20,'平利','杨贞之子','杨贞'],[84,20,'平和','杨贞之子','杨贞'],[84,20,'平祖','杨贞之子','杨贞'],
    [85,21,'翠','平和之子','平和'],[85,21,'利','平和之子','平和'],[85,21,'文','平和之子','平和'],
    [86,22,'武','文之子','文'],[87,23,'秉槐','武之子','武'],[88,24,'堂','秉槐之子','秉槐'],
    [89,25,'瑛','堂之子','堂'],[90,26,'文轩','瑛之子','瑛'],[90,26,'文昂','瑛之子','瑛'],
    [91,27,'福郎','文轩之子','文轩'],[91,27,'丙郎','文轩之子','文轩'],[91,27,'应郎','文轩之子','文轩'],
    [92,28,'宜礼','福郎之子','福郎'],[92,28,'宜乐','福郎之子','福郎'],
    [93,29,'逵','宜礼之子','宜礼'],[94,30,'简','逵之子','逵'],[95,31,'瑰','简之子','简'],
    [96,32,'懿','瑰之子','瑰'],[97,33,'鳅','懿之子','懿'],
    [98,34,'当','鳅之后','鳅'],[98,34,'景秀','鳅之后','鳅'],
    [99,35,'缵','景秀之后/东山第一世','景秀'],[99,35,'显','景秀之后','景秀'],[99,35,'顼','景秀之后','景秀']
  ];
  // Build name → edit id map：真实录入数据优先（点击卡片即编辑该人），未录入的用合成 id（点击给出提示）
  var idByName = {};
  for (var i = 0; i < raw.length; i++) {
    var nm = raw[i][2];
    idByName[nm] = adminLineageIdFor(nm, '申伯世系') || (10000 + i);
  }
  // Build data array for buildAdminTreeHtml
  var treeData = [];
  for (var i = 0; i < raw.length; i++) {
    var r = raw[i];
    var lp = adminLivePersonById(idByName[r[2]]); // 真实录入的人显示数据库最新姓名（改名后立即体现）
    treeData.push({
      id: idByName[r[2]],
      name: (lp && lp.name) ? lp.name : r[2],
      gender: '男',
      generation_num: r[0],
      generation: r[0].toString(),
      branch: '申伯世系',
      father_id: r[4] ? (idByName[r[4]] || null) : null,
      spouse_ids: '',
      is_alive: '否',
      biography: r[3],
      highlight: i === 0
    });
  }
  return buildAdminTreeHtml(treeData, {hideGen: true});
}

// ===== 申伯树平移缩放 =====
var _sbZoom = 1, _sbPanX = 0, _sbPanY = 0, _sbDragging = false;
var _sbDragX = 0, _sbDragY = 0, _sbStartX = 0, _sbStartY = 0;

function initShenboTreePanZoom() {
  var vp = document.getElementById('shenbo-tree-viewport');
  if (!vp || vp.dataset.sbInit) return;
  vp.dataset.sbInit = '1';

  function getTree() { return vp.querySelector('.apt-tree'); }

  function apply() {
    var tree = getTree();
    if (!tree) return;
    tree.style.transform = 'translate(' + _sbPanX + 'px, ' + _sbPanY + 'px) scale(' + _sbZoom + ')';
    var el = document.getElementById('sb-zoom-level');
    if (el) el.textContent = Math.round(_sbZoom * 100) + '%';
  }

  vp.onwheel = function(e) {
    e.preventDefault();
    var rect = vp.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var factor = e.deltaY < 0 ? 1.1 : 0.9;
    var newZ = Math.max(0.1, Math.min(5, _sbZoom * factor));
    _sbPanX = mx - (mx - _sbPanX) * (newZ / _sbZoom);
    _sbPanY = my - (my - _sbPanY) * (newZ / _sbZoom);
    _sbZoom = newZ;
    apply();
  };

  vp.onmousedown = function(e) {
    if (e.target.closest('.apt-zoom-btn, .apt-btn-expand, .apt-card, .apt-btn-add, .apt-btn-del, button')) return;
    _sbDragging = true;
    _sbDragX = e.clientX;
    _sbDragY = e.clientY;
    _sbStartX = _sbPanX;
    _sbStartY = _sbPanY;
    vp.style.cursor = 'grabbing';
    e.preventDefault();
  };

  window.addEventListener('mousemove', _sbOnMouseMove = function(e) {
    if (!_sbDragging) return;
    _sbPanX = _sbStartX + (e.clientX - _sbDragX);
    _sbPanY = _sbStartY + (e.clientY - _sbDragY);
    apply();
  });

  window.addEventListener('mouseup', _sbOnMouseUp = function() {
    if (_sbDragging) {
      _sbDragging = false;
      var vp2 = document.getElementById('shenbo-tree-viewport');
      if (vp2) vp2.style.cursor = 'grab';
    }
  });

  // Fit to viewport once tree is visible
  function fitWhenReady() {
    var tree = getTree();
    if (!tree) { setTimeout(fitWhenReady, 200); return; }
    var vpr = vp.getBoundingClientRect();
    var tr = tree.getBoundingClientRect();
    var scaleX = vpr.width / (tr.width || 1);
    var scaleY = vpr.height / (tr.height || 1);
    var s = Math.min(1, Math.min(scaleX, scaleY) * 0.9);
    _sbZoom = Math.max(0.1, Math.min(1, s));
    _sbPanX = Math.max(0, (vpr.width - tr.width * _sbZoom) / 2);
    _sbPanY = 10;
    apply();
  }
  setTimeout(fitWhenReady, 300);
}

window.zoomShenboTree = function(factor) {
  var vp = document.getElementById('shenbo-tree-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!tree) return;
  if (factor === 1) { _sbZoom = 1; _sbPanX = 0; _sbPanY = 0; }
  else {
    var rect = vp.getBoundingClientRect();
    var mx = rect.width / 2, my = rect.height / 2;
    var newZ = Math.max(0.1, Math.min(5, _sbZoom * factor));
    _sbPanX = mx - (mx - _sbPanX) * (newZ / _sbZoom);
    _sbPanY = my - (my - _sbPanY) * (newZ / _sbZoom);
    _sbZoom = newZ;
  }
  tree.style.transform = 'translate(' + _sbPanX + 'px, ' + _sbPanY + 'px) scale(' + _sbZoom + ')';
  var el = document.getElementById('sb-zoom-level');
  if (el) el.textContent = Math.round(_sbZoom * 100) + '%';
};

// ===== 始宁东山世系树状图 =====
function buildAdminDongshanTree() {
  var raw = [
    [99,35,'缵','东山第一世',null],
    [100,36,'衡','会稽东山始祖','缵'],
    [100,37,'鲲','衡之子','衡'],[100,37,'裒','衡之子，谢安之父','衡'],[100,37,'广','衡之子','衡'],
    [101,38,'奕','裒之子','裒'],[101,38,'据','裒之子','裒'],[101,38,'安','字安石，东晋名相','裒'],
    [101,38,'万','裒之子','裒'],[101,38,'淮','裒之子','裒'],[101,38,'石','裒之子','裒'],[101,38,'铁','裒之子','裒'],
    [102,39,'瑶','安之子','安'],[102,39,'琰','安之子','安'],
    [103,40,'肇','琰之子','琰'],[103,40,'峻','琰之子','琰'],[103,40,'混','琰之子','琰'],
    [104,41,'密','混之子','混'],
    [105,42,'庄','密之子','密'],
    [106,43,'飏','庄之子','庄'],[106,43,'胜','庄之子','庄'],[106,43,'灏','庄之子','庄'],[106,43,'丛','庄之子','庄'],[106,43,'沦','庄之子','庄'],
    [107,44,'览','飏之子','飏'],
    [108,45,'琢','览之子','览'],[108,45,'侨','览之子','览'],
    [109,46,'琂','琢之子','琢'],[109,46,'琬','琢之子','琢'],
    [110,47,'峤','琂之子','琂'],[110,47,'植','琂之子','琂'],
    [111,48,'钝','植之子','植'],[111,48,'缪','植之子','植'],
    [112,49,'修','钝之子','钝'],[112,49,'豹','钝之子','钝'],
    [113,50,'恺','修之子','修'],
    [114,51,'骢','恺之子','恺'],[114,51,'驼','恺之子','恺'],[114,51,'绰','恺之子','恺'],
    [115,52,'式','绰之子','绰'],
    [116,53,'革','式之子','式'],[116,53,'造','式之子','式'],
    [117,54,'直','造之子','造'],
    [118,55,'是温','直之子','直'],
    [119,56,'翳','是温之子','是温'],
    [120,57,'静','翳之子','翳'],[120,57,'观','翳之子','翳'],
    [122,58,'闓','观之子/临海下渡第一世','观']
  ];
  var idByName = {};
  for (var i = 0; i < raw.length; i++) {
    var nm = raw[i][2];
    idByName[nm] = adminLineageIdFor(nm, '始宁东山') || (20000 + i);
  }
  var treeData = [];
  for (var i = 0; i < raw.length; i++) {
    var r = raw[i];
    var lp = adminLivePersonById(idByName[r[2]]); // 真实录入的人显示数据库最新姓名（改名后立即体现）
    treeData.push({
      id: idByName[r[2]], name: (lp && lp.name) ? lp.name : r[2], gender: '男', generation_num: r[0], generation: r[0].toString(),
      branch: '东山世系', father_id: (r[4] || r[3]) ? (idByName[r[4] || r[3]] || null) : null,
      spouse_ids: '', is_alive: '否', biography: r[3], highlight: i === 0
    });
  }
  return buildAdminTreeHtml(treeData, {hideGen: true});
}

// ===== 临海下渡世系树状图 =====
function buildAdminLinhaiTree() {
  var raw = [
    [122,58,'闓','观之子/临海下渡第一世',null],
    [122,59,'俨','闓之子','闓'],[123,60,'诜','俨之子','俨'],
    [124,61,'景之','诜之子','诜'],[124,61,'考之','诜之子','诜'],
    [125,62,'润甫','景之之后','景之'],[125,62,'深甫','景之之后','景之'],
    [126,63,'采伯','深甫之后','深甫'],[126,63,'渠伯','深甫之后','深甫'],[126,63,'棐伯','深甫之后','深甫'],[126,63,'彚伯','深甫之后','深甫'],
    [127,64,'奕修','采伯之后','采伯'],[127,64,'奕懋','采伯之后','采伯'],[127,64,'奕恭','采伯之后','采伯'],[127,64,'奕容','采伯之后','采伯'],[127,64,'奕信','采伯之后','采伯'],
    [128,65,'在鉴','奕信之后','奕信'],[128,65,'在勋','奕信之后','奕信'],[128,65,'在纲','奕信之后','奕信'],[128,65,'在机','奕信之后','奕信'],
    [130,66,'大四','在纲之后','在纲'],[130,66,'小四','在纲之后','在纲']
  ];
  var idByName = {};
  for (var i = 0; i < raw.length; i++) {
    var nm = raw[i][2];
    idByName[nm] = adminLineageIdFor(nm, '临海下渡') || (30000 + i);
  }
  var treeData = [];
  for (var i = 0; i < raw.length; i++) {
    var r = raw[i];
    var lp = adminLivePersonById(idByName[r[2]]); // 真实录入的人显示数据库最新姓名（改名后立即体现）
    treeData.push({
      id: idByName[r[2]], name: (lp && lp.name) ? lp.name : r[2], gender: '男', generation_num: r[0], generation: r[0].toString(),
      branch: '临海下渡', father_id: (r[4] || r[3]) ? (idByName[r[4] || r[3]] || null) : null,
      spouse_ids: '', is_alive: '否', biography: r[3], highlight: i === 0
    });
  }
  return buildAdminTreeHtml(treeData, {hideGen: true});
}

// ===== 石马（下谢）分房派树状图 =====
function buildAdminShimaTree() {
  var raw = [
    [1,'小四','石马第一世',null],
    [2,'丹一','小四之子','小四'],[2,'丹二','小四之子','小四'],[2,'丹三','小四之子','小四'],
    [3,'文杲','丹一之后，枫槎谢氏始迁祖','丹一'],[3,'文榘','丹一之后，东门桃源陈氏之祖','丹一'],
    [3,'丹九','丹三之后','丹三'],
    [4,'廿一','丹九之后','丹九'],[4,'廿二','丹九之后','丹九'],[4,'廿四','丹九之后','丹九'],
    [4,'十三','文榘之后','文榘'],[4,'十七','文榘之后','文榘'],[4,'二一','文榘之后','文榘'],
    [5,'廿七','十三之后','十三'],[5,'廿九','十三之后','十三'],[5,'三十一','十三之后','十三'],
    [5,'四十','廿二之后','廿二'],
    [6,'百十','廿七之后','廿七'],[6,'庆三','廿七之后','廿七'],
    [6,'千九','四十之后','四十'],[6,'千十','四十之后','四十'],[6,'千十一','四十之后','四十'],[6,'千十三','四十之后','四十'],
    [7,'敬乙','庆三之后','庆三'],
    [7,'一廷','千十一之后','千十一'],[7,'隆','千十一之后','千十一'],
    [8,'琰','隆之后','隆'],[8,'琇','隆之后','隆'],
    [9,'位','琰之后','琰'],[9,'倍','琰之后','琰'],[9,'侍','琰之后','琰'],[9,'体','琰之后','琰'],[9,'旦','琰之后','琰'],
    [9,'俱生','琇之后','琇'],
    [10,'礼','位之后','位'],[10,'管','位之后','位'],[10,'罗','位之后','位'],
    [11,'泰鹏','管之后','管'],[11,'泰颚','管之后','管'],
    [12,'秀廉','泰颚之后','泰颚'],[12,'秀洁','泰颚之后','泰颚'],[12,'秀驹','泰颚之后','泰颚'],
  ];
  var idByName = {};
  for (var i = 0; i < raw.length; i++) {
    var nm = raw[i][1];
    idByName[nm] = adminLineageIdFor(nm, '石马(下谢)') || (40000 + i);
  }
  var treeData = [];
  for (var i = 0; i < raw.length; i++) {
    var r = raw[i];
    var lp = adminLivePersonById(idByName[r[1]]); // 真实录入的人显示数据库最新姓名（改名后立即体现）
    treeData.push({
      id: idByName[r[1]], name: (lp && lp.name) ? lp.name : r[1], gender: '男', generation_num: r[0], generation: r[0].toString(),
      branch: '石马分房', father_id: r[3] ? (idByName[r[3]] || null) : null,
      spouse_ids: '', is_alive: '否', biography: r[2], highlight: i === 0
    });
  }
  return buildAdminTreeHtml(treeData, {hideGen: true});
}

// ===== 东山/临海/石马树平移缩放 =====
var _dsZoom = 1, _dsPanX = 0, _dsPanY = 0, _dsDragging = false;
var _lhZoom = 1, _lhPanX = 0, _lhPanY = 0, _lhDragging = false;
var _smZoom = 1, _smPanX = 0, _smPanY = 0, _smDragging = false;

function initTreeViewportPanZoom(id, zoomId, state) {
  var vp = document.getElementById(id);
  if (!vp || vp.dataset.init) return;
  vp.dataset.init = '1';
  function getTree() { return vp.querySelector('.apt-tree'); }
  function apply() {
    var tree = getTree();
    if (!tree) return;
    tree.style.transform = 'translate(' + state.px + 'px, ' + state.py + 'px) scale(' + state.z + ')';
    var el = document.getElementById(zoomId);
    if (el) el.textContent = Math.round(state.z * 100) + '%';
  }
  vp.onwheel = function(e) {
    e.preventDefault();
    var rect = vp.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    var factor = e.deltaY < 0 ? 1.1 : 0.9;
    var newZ = Math.max(0.1, Math.min(5, state.z * factor));
    state.px = mx - (mx - state.px) * (newZ / state.z);
    state.py = my - (my - state.py) * (newZ / state.z);
    state.z = newZ; apply();
  };
  vp.onmousedown = function(e) {
    if (e.target.closest('.apt-zoom-btn, .apt-btn-expand, .apt-card, .apt-btn-add, .apt-btn-del, button')) return;
    state.drag = true; state.dx = e.clientX; state.dy = e.clientY;
    state.sx = state.px; state.sy = state.py;
    vp.style.cursor = 'grabbing'; e.preventDefault();
  };
  function onMove(e) {
    if (!state.drag) return;
    state.px = state.sx + (e.clientX - state.dx);
    state.py = state.sy + (e.clientY - state.dy); apply();
  }
  function onUp() {
    if (state.drag) { state.drag = false; var v2 = document.getElementById(id); if(v2) v2.style.cursor = 'grab'; }
  }
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  setTimeout(function fit() {
    var tree = getTree();
    if (!tree) { setTimeout(fit, 200); return; }
    var vpr = vp.getBoundingClientRect(), tr = tree.getBoundingClientRect();
    var s = Math.min(1, Math.min(vpr.width/(tr.width||1), vpr.height/(tr.height||1)) * 0.9);
    state.z = Math.max(0.1, Math.min(1, s));
    state.px = Math.max(0, (vpr.width - tr.width * state.z) / 2);
    state.py = 10; apply();
  }, 300);
}

window.zoomDongshanTree = function(factor) {
  var vp = document.getElementById('dongshan-tree-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!tree) return;
  if (factor === 1) { _dsZoom = 1; _dsPanX = 0; _dsPanY = 0; }
  else {
    var rect = vp.getBoundingClientRect();
    var mx = rect.width / 2, my = rect.height / 2;
    var newZ = Math.max(0.1, Math.min(5, _dsZoom * factor));
    _dsPanX = mx - (mx - _dsPanX) * (newZ / _dsZoom);
    _dsPanY = my - (my - _dsPanY) * (newZ / _dsZoom);
    _dsZoom = newZ;
  }
  tree.style.transform = 'translate(' + _dsPanX + 'px, ' + _dsPanY + 'px) scale(' + _dsZoom + ')';
  var el = document.getElementById('ds-zoom-level');
  if (el) el.textContent = Math.round(_dsZoom * 100) + '%';
};

window.zoomLinhaiTree = function(factor) {
  var vp = document.getElementById('linhai-tree-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!tree) return;
  if (factor === 1) { _lhZoom = 1; _lhPanX = 0; _lhPanY = 0; }
  else {
    var rect = vp.getBoundingClientRect();
    var mx = rect.width / 2, my = rect.height / 2;
    var newZ = Math.max(0.1, Math.min(5, _lhZoom * factor));
    _lhPanX = mx - (mx - _lhPanX) * (newZ / _lhZoom);
    _lhPanY = my - (my - _lhPanY) * (newZ / _lhZoom);
    _lhZoom = newZ;
  }
  tree.style.transform = 'translate(' + _lhPanX + 'px, ' + _lhPanY + 'px) scale(' + _lhZoom + ')';
  var el = document.getElementById('lh-zoom-level');
  if (el) el.textContent = Math.round(_lhZoom * 100) + '%';
};

window.zoomShimaTree = function(factor) {
  var vp = document.getElementById('shima-tree-viewport');
  var tree = vp ? vp.querySelector('.apt-tree') : null;
  if (!tree) return;
  if (factor === 1) { _smZoom = 1; _smPanX = 0; _smPanY = 0; }
  else {
    var rect = vp.getBoundingClientRect();
    var mx = rect.width / 2, my = rect.height / 2;
    var newZ = Math.max(0.1, Math.min(5, _smZoom * factor));
    _smPanX = mx - (mx - _smPanX) * (newZ / _smZoom);
    _smPanY = my - (my - _smPanY) * (newZ / _smZoom);
    _smZoom = newZ;
  }
  tree.style.transform = 'translate(' + _smPanX + 'px, ' + _smPanY + 'px) scale(' + _smZoom + ')';
  var el = document.getElementById('sm-zoom-level');
  if (el) el.textContent = Math.round(_smZoom * 100) + '%';
};

// ===== 本宗世系图（后枫槎）=====
// 共享数据：后台管理页与前端族谱查询页共用同一份精选世系，保证两处显示一致
function getHoufengchaTreeData() {
  var raw = [
    // [gen, name, desc, father]
    [1,'小四','石马第一世',null],
    [2,'丹一','小四之子','小四'],
    [3,'文杲','丹一之后，枫槎谢氏始迁祖','丹一'],
    [3,'文榘','丹一之后，东门桃源陈氏之祖','丹一'],
    [4,'攒','后枫槎/文杲之后','文杲'],
    [4,'撰','前枫槎/文杲之后','文杲'],
    [5,'伯能','攒之子','攒'],
    [6,'祖田','伯能之子','伯能'],
    [7,'宗孝','祖田之子','祖田'],
    [8,'道济','宗孝之子','宗孝'],
    [9,'体仁','道济之子','道济'],
    [10,'开绪','体仁之子','体仁'],
    [11,'裕南','开绪之子','开绪'],
    [12,'静庵','裕南之子','裕南'],
    [13,'元峰','静庵之子','静庵'],
    [14,'宏基(孟献祧)','元峰之子','元峰'],
    [14,'文用','元峰之子','元峰'],
    [15,'孟献','文用之子','文用'],
    [16,'公表','孟献之子','孟献'],
    [17,'叔仅','公表之子','公表'],
    [18,'彬','东房祖/叔仅之后','叔仅'],
    [18,'乾','西房祖/叔仅之后','叔仅'],
    [19,'子达','乾之后','乾'],
    [20,'承志','子达之子','子达'],
    [20,'承恩','子达之子','子达'],
    [21,'连溪','承志之后','承志'],
    [21,'东溪','承恩之后','承恩'],
    [22,'延佳','连溪之后','连溪'],
    [22,'延信','连溪之后','连溪'],
    [22,'延甫','连溪之后','连溪'],
    [22,'廷光','东溪之后','东溪'],
    [23,'光宇','延佳之后','延佳'],
    [23,'光环','延甫之后','延甫'],
    [23,'光洪','延甫之后','延甫'],
    [23,'瑞卿','廷光之后','廷光'],
    [24,'云英','光宇之后','光宇'],
    [24,'云韬','光宇之后','光宇'],
    [24,'云先','光宇之后','光宇'],
    [24,'云先(环)','光环之后','光环'],
    [24,'云生','光环之后','光环'],
    [24,'云美','光洪之后','光洪'],
    [24,'云全','光洪之后','光洪'],
    [24,'云良','光洪之后','光洪'],
    [24,'汝节','瑞卿之后','瑞卿'],
    [24,'汝月','瑞卿之后','瑞卿'],
    [25,'大德','云英之后','云英'],
    [25,'小妹','云英之后','云英'],
    [25,'大恩','云韬之后','云韬'],
    [25,'大功','云韬之后','云韬'],
    [25,'大性(入继)','云先之后','云先'],
    [25,'大岳','云先之后','云先'],
    [25,'大义','云生之后','云生'],
    [25,'大性(出继)','云生之后','云生'],
    [25,'大明','云生之后','云生'],
    [25,'大文(入继)','云美之后','云美'],
    [25,'大才','云良之后','云良'],
    [25,'大文(出继)','云良之后','云良'],
    [25,'大法','云良之后','云良'],
    [25,'大振','云良之后','云良'],
    [25,'大顺(出继)','云良之后','云良'],
    [25,'大智','汝节之后','汝节'],
    [25,'大忠','汝月之后','汝月'],
    [25,'大孝','汝月之后','汝月'],
    [25,'大贤','汝月之后','汝月'],
    // 彬公分支
    [19,'子选','彬之后','彬'],
    [20,'承意','子选之后','子选'],
    [20,'承爱','子选之后','子选'],
    [21,'怀年','承意之后','承意'],
    [21,'怀春','承爱之后','承爱'],
    [22,'廷魁','怀年之后','怀年'],
    [22,'廷省','怀春之后','怀春'],
    [22,'廷荐','怀春之后','怀春'],
    [23,'光富','廷魁之后','廷魁'],
    [23,'光祖','廷省之后','廷省'],
    [23,'寅卿(出继)','廷省之后','廷省'],
    [23,'寅卿(入继)','廷荐之后','廷荐'],
    [24,'云昌','光富之后','光富'],
    [24,'云奇','光祖之后','光祖'],
    [25,'大宾','云昌之后','云昌'],
    [25,'大顺(入继)','云奇之后','云奇']
  ];
  var nameToId = {};
  for (var i = 0; i < raw.length; i++) { nameToId[raw[i][1]] = 60000 + i; }
  var treeData = [];
  for (var i = 0; i < raw.length; i++) {
    var r = raw[i], pid = 60000 + i;
    treeData.push({
      id: pid, name: r[1], gender: '男', generation_num: r[0], generation: r[0].toString(),
      branch: '后枫槎', father_id: r[3] ? (nameToId[r[3]] || null) : null,
      spouse_ids: '', is_alive: '否', biography: r[2], highlight: i === 0
    });
  }
  return treeData;
}

// 后台本宗世系图（后枫槎）增强挂接：与前台 genealogy.html 内联 getHoufengchaEnhancedData 同逻辑，
// 但数据源=后台完整库（getData('genealogy')，原始体系大字辈=23世，前台 getGenealogyData 有 +131 平移）。
// delta 动态计算（base大字辈gen − full大字辈gen = +2），无需硬编码平移。
// 副本结构与其他节点完全一致（无 _enhanced 区分标记），显示/编辑行为与精选树原有节点一致（用户要求保持一样不要区分）。
// 注意：副本 father_id 指向精选树 id(60000+)，仅用于本树内父子连线；编辑/保存走完整库真实记录（showEditForm 按 id 查 getData），不写回 60000+。
function buildAdminHoufengchaEnhancedData(fullData) {
  var base = getHoufengchaTreeData();
  var full = fullData || [];
  function cleanName(n) { return String(n || '').replace(/\(.*\)$/, ''); }
  var childrenOfFull = {}, byName = {};
  for (var fi = 0; fi < full.length; fi++) {
    var fp = full[fi];
    if (fp.father_id) (childrenOfFull[fp.father_id] = childrenOfFull[fp.father_id] || []).push(fp);
    var fnm = cleanName(fp.name);
    (byName[fnm] = byName[fnm] || []).push(fp);
  }
  var out = base.slice();
  var added = {}, usedName = {}, childCount = 0;
  for (var bj = 0; bj < base.length; bj++) {
    var p = base[bj];
    var cn = cleanName(p.name);
    if (!/^大/.test(cn)) continue;                                    // 只补「大」字辈
    var cands = (byName[cn] || []).filter(function(c) { return (childrenOfFull[c.id] || []).length > 0; });
    if (!cands.length) continue;
    var idx = usedName[cn] || 0;
    usedName[cn] = idx + 1;
    var match = cands[idx % cands.length];
    var delta = (parseInt(p.generation_num, 10) || 0) - (parseInt(match.generation_num, 10) || 0);
    (function attach(fParent, newFid) {
      var kids = childrenOfFull[fParent.id] || [];
      for (var k2 = 0; k2 < kids.length; k2++) {
        var c = kids[k2];
        var cg = parseInt(c.generation_num, 10) || 0;
        var pg = parseInt(fParent.generation_num, 10) || 0;
        if (cg <= pg) continue;                                        // 交叉异常（子不晚于父）
        if (added[c.id]) continue;
        var n = {};
        for (var kk in c) { if (Object.prototype.hasOwnProperty.call(c, kk)) n[kk] = c[kk]; }
        n.father_id = newFid;
        n.generation_num = cg + delta;
        n.generation = n.generation_num.toString();
        n.branch = '后枫槎';
        added[c.id] = true;
        out.push(n); childCount++;
        attach(c, c.id);
      }
    })(match, p.id);
  }
  window._adminHoufengchaInfo = { base: base.length, added: childCount };
  return out;
}

function buildAdminHoufengchaTree() {
  var fullData = getData('genealogy');
  var data = (fullData && fullData.length) ? buildAdminHoufengchaEnhancedData(fullData) : getHoufengchaTreeData();
  return buildAdminTreeHtml(data, {hideGen: true});
}
