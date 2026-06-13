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

  // For genealogy, if localStorage data is small (<100), try loading from JSON file
  if (module === 'genealogy') {
    var cached = raw ? (function(){ try{return JSON.parse(raw);}catch(e){return null} })() : null;
    if (cached && cached.length >= 100) return cached;

    // Try synchronous XHR to load full data
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '../data/genealogy_full.json', false);
      xhr.overrideMimeType('application/json');
      xhr.send();
      if (xhr.status === 200) {
        var full = JSON.parse(xhr.responseText);
        if (full && full.length > 100) {
          localStorage.setItem(key, JSON.stringify(full));
          return full;
        }
      }
    } catch(e) {}

    if (cached) return cached;
    var def = (MODULES[module] && MODULES[module].defaultData) || [];
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

  // Batch save for large datasets
  var batchSize = 500;
  var totalBatches = Math.ceil(data.length / batchSize);
  var completed = 0;

  function sendBatch(start) {
    if (start >= data.length) {
      showSyncStatus(module, '✅ 已同步');
      return;
    }
    var batch = data.slice(start, start + batchSize);
    fetch('/api/data/' + module, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(batch)
    }).then(function(r) { return r.json(); }).then(function() {
      completed++;
      showSyncStatus(module, '同步中… ' + completed + '/' + totalBatches);
      sendBatch(start + batchSize);
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
  sendBatch(0);
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

// ===== 给renderModule打补丁，增加备份按钮 =====
var origRenderModule = renderModule;
renderModule = function(mod) {
  origRenderModule(mod);
  // Add backup button after module title
  var titleEl = document.querySelector('.apt-module-title');
  if (titleEl) {
    var btnHtml = renderBackupButton(mod);
    var existing = document.getElementById('backup-bar-' + mod);
    if (!existing) {
      var div = document.createElement('div');
      div.id = 'backup-bar-' + mod;
      div.innerHTML = btnHtml;
      titleEl.parentNode.insertBefore(div, titleEl.nextSibling);
    }
  }
};

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
  if (mod === 'ruzhuimarry') {
    var area = document.getElementById('admin-content-area');
    if (!area) return;
    renderRuzhuiMarriage(area);
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

function buildAdminTreeHtml(data) {
  if (!data || data.length === 0) return '<div style="padding:20px;text-align:center;color:var(--text-tertiary);font-size:13px;">暂无数据</div>';

  var existingIds = {};
  data.forEach(function(p) { existingIds[p.id] = true; });

  // 工具：获取某人的直接子女
  function childrenOf(person) {
    var result = [];
    for (var ci = 0; ci < data.length; ci++) {
      var child = data[ci];
      var fid = parseInt(child.father_id);
      var mid = parseInt(child.mother_id);
      if (fid === person.id || mid === person.id) {
        result.push(child);
      }
    }
    return result;
  }

  // 工具：递归统计后代总数
  function countDescendants(person) {
    var count = 0;
    var direct = childrenOf(person);
    for (var i = 0; i < direct.length; i++) {
      count += 1 + countDescendants(direct[i]);
    }
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
    return !p.father_id || !existingIds[parseInt(p.father_id)];
  });
  roots = roots.filter(function(p) {
    return !spouseOf[p.id] || spouseOf[p.id] > p.id;
  });
  if (roots.length === 0 && data.length > 0) roots = [data[0]];

  function renderPerson(person) {
    var html = '<div class="apt-person">';
    var isRuzhui = person.name.indexOf('入赘') >= 0 || person.name.indexOf('女婿') >= 0;
    var ruzhuiPartner = false;
    if (person.spouse_ids) {
      var spN = person.spouse_ids.toString().split(',').map(function(n){return n.trim();}).filter(function(n){return n;});
      for (var si = 0; si < spN.length; si++) { if (spN[si].indexOf('入赘') >= 0 || spN[si].indexOf('女婿') >= 0) { ruzhuiPartner = true; break; } }
    }
    var cClass = 'apt-card ' + (person.gender === '男' ? 'apt-male' : 'apt-female');
    if (isRuzhui) cClass += ' apt-ruzhui';
    if (ruzhuiPartner) cClass += ' apt-ruzhui-partner';
    html += '<div class="' + cClass + '" onclick="showEditForm(\'genealogy\',' + person.id + ')" title="点击编辑">';
    html += '<div class="apt-card-inner">';
    html += '<div class="apt-card-actions" onclick="event.stopPropagation();">';
    html += '<button class="apt-btn-add" onclick="showAddChildForm(' + person.id + ')" title="添加子女">+</button>';
      if (childrenOf(person).length > 0) {
        html += '<button class="apt-btn-expand" onclick="toggleTreeNode(this)" title="展开/折叠">▶</button>';
      }
    html += '<button class="apt-btn-del" onclick="if(confirm(\'确定删除 ' + escapeHtml(person.name) + ' 吗？\'))deleteItem(\'genealogy\',' + person.id + ')" title="删除此人">−</button>';
    html += '</div>';
    html += '<div class="apt-name">';
    if (person.adopted && person.adopted !== '否') {
      if (person.adopted === '出继') html += '<span class="apt-adopted-badge" style="background:#22c55e;" title="出继">出</span>';
      else html += '<span class="apt-adopted-badge" title="' + escapeHtml(person.adopted) + '">嗣</span>';
    }
    html += escapeHtml(person.name) + '</div>';
    html += '<div class="apt-meta">' + (person.generation_num || '?') + '世' + (person.generation && person.generation !== '—' ? ' · ' + escapeHtml(person.generation) : '') + '</div>';
    if (person.branch && person.branch !== '—') {
      html += '<div class="apt-branch">' + escapeHtml(person.branch) + '</div>';
    }
    if (person.spouse_ids) {
      var sp = person.spouse_ids.toString().split(',').map(function(n) { return n.trim(); }).filter(function(n) { return n; });
      if (sp.length > 0) html += '<div class="apt-spouse">配: ' + escapeHtml(sp.join('、')) + '</div>';
    }
    // 显示母亲（多妻情况下区分不同母亲所出）
    if (person.mother_id) {
      var mn = getPersonName(parseInt(person.mother_id), data) || person.mother_id;
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

    // Children
    var children = childrenOf(person);
    if (children.length > 0) {
      html += '<div class="apt-children-wrap">';
      html += '<div class="apt-connector"></div>';
      html += '<div class="apt-children">';
      if (children.length > 1) {
        html += '<div class="apt-hline"></div>';
      }
      for (var ci2 = 0; ci2 < children.length; ci2++) {
        html += '<div class="apt-child">';
        html += '<div class="apt-vline"></div>';
        html += renderPerson(children[ci2]);
        html += '</div>';
      }
      html += '</div>';
      html += '</div>'; // apt-children-wrap
    }

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
        var bioPerson = null;
        for (var bi = 0; bi < data.length; bi++) {
          if (data[bi].id === curBioId) { bioPerson = data[bi]; break; }
        }
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

  var out = '<div class="apt-tree">';
  for (var r = 0; r < roots.length; r++) {
    out += renderPerson(roots[r]);
  }
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

  var gens = {};
  var branchSet = {};
  var skipBranches = ['长房', '二房', '三房', '四房', '后枫椿', '前枫椿', '临海下渡', '石马下谢', '枫椿分支', '前枫槎派', '后枫槎东房', '枫槎始祖'];
  data.forEach(function(p) {
    var g = p.generation_num || 0;
    gens[g] = (gens[g] || 0) + 1;
    if (p.branch && p.branch !== '—' && skipBranches.indexOf(p.branch) < 0) branchSet[p.branch] = true;
  });

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

  // Split layout: left = tree, right = table
  html += '<div class="apt-split">';

  // ===== LEFT: Tree =====
  html += '<div class="apt-left">';
  html += '<div class="apt-tree-filters">';
  html += '<select id="tree-filter-gen" onchange="renderGenealogyTree()"><option value="">全部世代</option>';
  for (var g = 1; g <= 150; g++) {
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
  html += buildAdminTreeHtml(data);
  html += '</div>';
  html += '</div>';
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
    html += '<td>';
    html += '<button class="btn-sm" onclick="showEditForm(\'genealogy\',' + p.id + ')">✏️</button> ';
    html += '<button class="btn-sm btn-danger" onclick="deleteItem(\'genealogy\',' + p.id + ')">🗑️</button>';
    html += '</td></tr>';
  }

  html += '</tbody></table></div>'; // close table, table-wrap
  html += '</div>'; // close apt-right
  html += '</div>'; // close apt-split
  html += '</div>'; // close admin-module

  // CSS for admin tree
  html += '<style>' +
    '.apt-split{display:flex;gap:16px;min-height:600px;}' +
    '.apt-left{flex:2;min-width:0;border:1px solid var(--glass-border);border-radius:12px;background:var(--bg-card);overflow:hidden;padding:24px 20px;}' +
    '.apt-right{width:320px;min-width:280px;display:flex;flex-direction:column;gap:12px;}' +
    '.apt-tree{display:flex;flex-direction:column;align-items:center;gap:0;}' +
    '.apt-person{display:flex;flex-direction:column;align-items:center;}' +
    '.apt-card{display:inline-flex;flex-direction:column;align-items:center;padding:14px 20px 10px 20px;border-radius:10px;cursor:pointer;border:1.5px solid var(--glass-border);background:var(--glass-bg);min-width:70px;transition:all 0.15s;position:relative;}' +
    '.apt-card-inner{display:flex;flex-direction:column;align-items:center;width:100%;}' +
    '.apt-card-actions{position:absolute;top:2px;right:2px;display:flex;gap:2px;opacity:0;transition:opacity 0.15s;}' +
    '.apt-card:hover .apt-card-actions{opacity:1;}' +
    '.apt-btn-add,.apt-btn-del{width:20px;height:20px;border:none;border-radius:50%;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;padding:0;transition:transform 0.1s;}' +
    '.apt-btn-add:hover,.apt-btn-del:hover{transform:scale(1.2);}' +
    '.apt-btn-add{background:#4a9eff;color:#fff;}' +
    '.apt-btn-del{background:#e74c3c;color:#fff;}' +
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
    '.apt-children{display:flex;gap:24px;position:relative;justify-content:center;}' +
    '.apt-hline{position:absolute;top:0;left:20px;right:20px;height:2px;background:var(--accent-orange);opacity:0.15;}' +
    '.apt-child{display:flex;flex-direction:column;align-items:center;position:relative;}' +
    '.apt-vline{width:2px;height:12px;background:var(--accent-orange);opacity:0.15;}' +
    '.apt-children-wrap{display:block;}' +
    '.apt-collapsed>.apt-children-wrap{display:none;}' +
    '.apt-btn-expand{width:18px;height:18px;border:none;border-radius:50%;font-size:10px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;background:var(--accent-orange);color:#fff;transition:transform 0.1s;}' +
    '.apt-btn-expand:hover{transform:scale(1.2);}' +
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
    '.apt-tree-fullscreen .apt-right{display:none;}' +
    '.apt-tree-fullscreen .apt-left{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;padding:56px 12px 12px 12px;border-radius:0;overflow:hidden;}' +
    '.apt-tree-fullscreen .apt-tree-viewport{height:calc(100vh - 100px);min-height:0;}' +
    '.apt-tree-fullscreen #apt-fullscreen-btn{background:var(--accent-orange);color:#fff;}' +
  '</style>';

  area.innerHTML = html;
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
    html += '<div style="font-size:11px;color:var(--text-tertiary);">填写姓名、世代、父母配偶等核心信息</div>';
    html += '</div>';

    for (var bi = 0; bi < basicKeys.length; bi++) {
      html += renderGenealogyFieldHtml(mod, m, basicKeys[bi], isEdit ? item : null);
    }

    html += '<div style="margin:12px 0;">';
    html += '<button type="button" class="btn btn-sm" id="btn-advanced-toggle" style="width:100%;padding:8px;font-size:12px;color:var(--text-tertiary);background:var(--glass-bg);border:1px dashed var(--glass-border);border-radius:8px;cursor:pointer;">📂 高级信息（生卒、支系、简介等）</button>';
    html += '</div>';

    html += '<div id="genealogy-advanced-fields" style="display:none;">';
    for (var ai = 0; ai < advancedKeys.length; ai++) {
      html += renderGenealogyFieldHtml(mod, m, advancedKeys[ai], isEdit ? item : null);
    }
    html += '</div>';

    html += '</form>';
    html += '<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px;">';
    html += '<button type="button" class="btn btn-secondary" onclick="this.closest(\'.admin-modal-overlay\').remove()">取消</button>';
    html += '<button type="submit" class="btn btn-accent" onclick="saveForm(\'' + mod + '\',' + (isEdit ? item.id : 'null') + ')">' + (isEdit ? '保存修改' : '添加') + '</button>';
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

function saveForm(mod, editId) {
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

  // Auto-record version for content updates
  var moduleLabels = { genealogy:'族谱', members:'成员', activities:'活动', news:'消息', honors:'村荣誉', reports:'报道', photos:'照片', videos:'视频', music:'背景音乐', messages:'留言', templeCarousel:'宗祠轮播' };
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

  var overlay = document.querySelector('.admin-modal-overlay');
  if (overlay) overlay.remove();
  showToast('已保存');
  // Refresh data in background but don't re-render full tree
  if (mod !== 'genealogy') {
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
  var moduleLabels = { genealogy:'族谱', members:'成员', activities:'活动', news:'消息', honors:'村荣誉', reports:'报道', photos:'照片', videos:'视频', music:'背景音乐', messages:'留言', templeCarousel:'宗祠轮播' };
  autoRecordVersion('删除' + (moduleLabels[mod] || mod) + '内容');
  // Delete file from server if has file_url
  if (deletedItem && deletedItem.file_url) {
    var filename = deletedItem.file_url.replace('/uploads/', '');
    if (filename) deleteFromServer(filename);
  }
  renderModule(mod);
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

    // 从 JSON 文件加载完整族谱数据（1080条）
    fetch('../data/genealogy_full.json').then(function(r){return r.json()}).then(function(full){
      if (full && full.length > 100) {
        localStorage.setItem('xie_admin_genealogy', JSON.stringify(full));
        if (currentModule === 'genealogy') { renderModule('genealogy'); updateStats(); }
      }
    }).catch(function(){});
    // Also override API-loaded data: delay to run after loadFromSupabase
    setTimeout(function() {
      fetch('../data/genealogy_full.json').then(function(r){return r.json()}).then(function(full){
        if (full && full.length > 100) {
          localStorage.setItem('xie_admin_genealogy', JSON.stringify(full));
          if (currentModule === 'genealogy') { renderModule('genealogy'); updateStats(); }
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
  var person = btn.closest('.apt-person');
  if (!person) return;
  person.classList.toggle('apt-collapsed');
  btn.textContent = person.classList.contains('apt-collapsed') ? '▶' : '▼';
}

// ===== 族谱树：按筛选条件重新渲染 =====
function renderGenealogyTree() {
  var treeEl = document.getElementById('admin-genealogy-tree');
  if (!treeEl) return;
  var allData = getData('genealogy');
  var genFilter = document.getElementById('tree-filter-gen');
  var filtered = allData;
  if (genFilter && genFilter.value) {
    filtered = filtered.filter(function(p) { return String(p.generation_num) === genFilter.value; });
  }
  treeEl.innerHTML = buildAdminTreeHtml(filtered);
}

window.genealogyUpdateMother = genealogyUpdateMother;
window.toggleTreeNode = toggleTreeNode;
window.renderGenealogyTree = renderGenealogyTree;
window.switchModule = switchModule;
window.showAddForm = showAddForm;
window.showEditForm = showEditForm;
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
