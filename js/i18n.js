/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   中英文切换 / Chinese-English Toggle
   ============================================ */

const TRANSLATIONS = {
  'site.title': {
    zh: '宁海下枫槎村 · 谢氏家族',
    en: 'Xiafengcha Village · Xie Family'
  },
  'logo.title': {
    zh: '下枫槎谢氏',
    en: 'Xie of Xiafengcha'
  },
  'logo.subtitle': {
    zh: '宁海 · 下枫槎村',
    en: 'Ninghai · Xiafengcha Village'
  },
  'nav.toggle': {
    zh: '菜单',
    en: 'Menu'
  },
  'nav.theme': {
    zh: '切换主题',
    en: 'Toggle theme'
  },
  'nav.lang': {
    zh: '中英文切换',
    en: 'Switch language'
  },
  'back.top': {
    zh: '回到顶部',
    en: 'Back to top'
  },
  'video.unsupported': {
    zh: '您的浏览器不支持视频播放',
    en: 'Your browser does not support video'
  },
  'nav.home': {
    zh: '首页',
    en: 'Home'
  },
  'nav.history': {
    zh: '家族历史',
    en: 'History'
  },
  'nav.genealogy': {
    zh: '族谱查询',
    en: 'Genealogy'
  },
  'nav.celebrities': {
    zh: '名人事迹',
    en: 'Celebrities'
  },
  'nav.news': {
    zh: '消息发布',
    en: 'News'
  },
  'nav.members': {
    zh: '家族成员',
    en: 'Members'
  },
  'nav.activities': {
    zh: '家族活动',
    en: 'Activities'
  },
  'nav.contact': {
    zh: '联系我们',
    en: 'Contact'
  },
  'nav.honors': {
    zh: '村荣誉',
    en: 'Honors'
  },
  'nav.reports': {
    zh: '新闻报道',
    en: 'Reports'
  },
  'nav.admin': {
    zh: '管理后台',
    en: 'Admin'
  },

  'hero.motto': {
    zh: '乌衣世泽 宝树家声',
    en: 'Legacy of the Xie Clan'
  },
  'hero.sub': {
    zh: '—— 宁海下枫槎村 · 谢氏家族 ——',
    en: '—— Xiafengcha Village, Ninghai · Xie Family ——'
  },
  'hero.desc1': {
    zh: '谢氏出自姬姓，以邑为氏。自周宣王封申伯于谢邑，谢氏一脉源远流长。',
    en: 'The Xie clan traces its origins to the Zhou Dynasty, with a heritage spanning over two thousand years.'
  },
  'hero.desc2': {
    zh: '下枫槎村谢氏世代耕读传家，诗书继世，今建宗族官网以续文脉、联宗亲。',
    en: 'Generation after generation, the Xie family of Xiafengcha Village uphold scholarship and tradition. This family website connects kin and preserves our cultural legacy.'
  },

  'section.video': {
    zh: '视频',
    en: 'Video'
  },
  'section.video.sub': {
    zh: '影像记录 · 家族记忆',
    en: 'Visual Memories · Family Legacy'
  },
  'video.play': {
    zh: '点击播放宣传片',
    en: 'Click to play'
  },
  'video.pending': {
    zh: '宣传片制作中',
    en: 'Video in production'
  },
  'section.carousel': {
    zh: '摄影',
    en: 'Photography'
  },
  'section.carousel.sub': {
    zh: '下枫槎村风光 · 宗祠 · 家族活动',
    en: 'Landscapes · Ancestral Hall · Family Events'
  },
  'section.news': {
    zh: '家族动态',
    en: 'Family News'
  },
  'section.news.sub': {
    zh: '了解下枫槎谢氏最新消息与活动',
    en: 'Latest updates and events of the Xie family'
  },
  'section.celebrities': {
    zh: '家族名人',
    en: 'Notable Ancestors'
  },
  'section.celebrities.sub': {
    zh: '历代谢氏先贤与当代精英',
    en: 'Esteemed ancestors and contemporary luminaries'
  },

  'page.history': {
    zh: '探本溯源 · 继往开来',
    en: 'Tracing Our Roots · Carrying Forward'
  },
  'page.celebrities': {
    zh: '先贤风范 · 后世楷模',
    en: 'Ancestral Virtue · Eternal Model'
  },
  'page.news': {
    zh: '村务通知 · 家族公告',
    en: 'Notices · Announcements'
  },
  'page.members': {
    zh: '枝繁叶茂 · 奕世其昌',
    en: 'Thriving Branches · Flourishing Legacy'
  },
  'page.activities': {
    zh: '凝聚宗亲 · 传承文化',
    en: 'Gathering Kin · Preserving Heritage'
  },
  'page.contact': {
    zh: '沟通 · 交流 · 共建',
    en: 'Connect · Communicate · Collaborate'
  },
  'page.honors': {
    zh: '村荣誉 · 荣耀时刻',
    en: 'Village Honors · Glorious Moments'
  },
  'page.honors.title': {
    zh: '村荣誉 · 下枫槎谢氏',
    en: 'Honors · Xie of Xiafengcha'
  },
  'page.reports': {
    zh: '媒体报道 · 新闻聚焦',
    en: 'Media Reports · News Spotlight'
  },
  'page.reports.title': {
    zh: '新闻报道 · 下枫槎谢氏',
    en: 'News Reports · Xie of Xiafengcha'
  },
  'page.genealogy': {
    zh: '追本溯源 · 知根知底',
    en: 'Trace Your Roots · Know Your Lineage'
  },
  'page.admin': {
    zh: '网站内容管理 · 权限验证',
    en: 'Content Management · Authorization'
  },
  'page.admin.title': {
    zh: '管理后台 · 下枫槎谢氏',
    en: 'Admin · Xie of Xiafengcha'
  },
  'page.history.title': {
    zh: '家族历史 · 下枫槎谢氏',
    en: 'History · Xie of Xiafengcha'
  },
  'page.celebrities.title': {
    zh: '名人事迹 · 下枫槎谢氏',
    en: 'Celebrities · Xie of Xiafengcha'
  },
  'page.committee': {
    zh: '村组织架构',
    en: 'Village Committee'
  },
  'page.committee.sub': {
    zh: '党建引领 · 乡村振兴',
    en: 'Party Leadership · Rural Revitalization'
  },
  'page.committee.title': {
    zh: '村组织架构 · 下枫槎谢氏',
    en: 'Committee · Xie of Xiafengcha'
  },
  'page.products': {
    zh: '乡村物产',
    en: 'Local Products'
  },
  'page.products.sub': {
    zh: '绿水青山 · 物华天宝',
    en: 'Green Mountains · Natural Treasures'
  },
  'page.products.title': {
    zh: '乡村物产 · 下枫槎谢氏',
    en: 'Products · Xie of Xiafengcha'
  },
  'nav.today': {
    zh: '今日下枫槎',
    en: 'Xiafengcha Today'
  },
  'page.today': {
    zh: '今日下枫槎',
    en: 'Xiafengcha Today'
  },
  'page.today.sub': {
    zh: '组织 · 物产 · 荣誉',
    en: 'Organization · Products · Honors'
  },
  'page.today.title': {
    zh: '今日下枫槎 · 下枫槎谢氏',
    en: 'Today · Xie of Xiafengcha'
  },
  'admin.password.placeholder': {
    zh: '请输入管理密码',
    en: 'Enter admin password'
  },
  'admin.footnote': {
    zh: '* 仅限家族管理员登录 · 未经授权禁止进入',
    en: '* Authorized administrators only · Unauthorized access prohibited'
  },
  'admin.login.name': {
    zh: '管理员',
    en: 'Admin'
  },
  'page.news.title': {
    zh: '消息发布 · 下枫槎谢氏',
    en: 'News · Xie of Xiafengcha'
  },
  'page.members.title': {
    zh: '家族成员 · 下枫槎谢氏',
    en: 'Members · Xie of Xiafengcha'
  },
  'page.activities.title': {
    zh: '家族活动 · 下枫槎谢氏',
    en: 'Activities · Xie of Xiafengcha'
  },
  'page.contact.title': {
    zh: '联系我们 · 下枫槎谢氏',
    en: 'Contact · Xie of Xiafengcha'
  },
  'page.genealogy.title': {
    zh: '族谱查询 · 下枫槎谢氏',
    en: 'Genealogy · Xie of Xiafengcha'
  },
  'genealogy.lock.desc2': {
    zh: '族谱为家族内部资料，请输入管理员密码以继续查询',
    en: 'Family genealogy is private. Enter password to continue.'
  },
  'genealogy.lock.note': {
    zh: '* 忘记密码请联系家族管理员',
    en: '* Forgot password? Contact the family administrator.'
  },
  'genealogy.password.placeholder': {
    zh: '请输入密码',
    en: 'Enter password'
  },
  'footer.section.content': {
    zh: '内容',
    en: 'Content'
  },
  'footer.section.contact': {
    zh: '联系',
    en: 'Contact'
  },
  'footer.link.feedback': {
    zh: '意见反馈',
    en: 'Feedback'
  },
  'footer.link.honors': {
    zh: '村荣誉',
    en: 'Honors'
  },
  'footer.link.reports': {
    zh: '新闻报道',
    en: 'Reports'
  },
  'admin.honors': {
    zh: '村荣誉管理',
    en: 'Honors'
  },
  'admin.reports': {
    zh: '新闻报道管理',
    en: 'Reports'
  },
  'section.honors': {
    zh: '村荣誉',
    en: 'Village Honors'
  },
  'section.honors.sub': {
    zh: '下枫槎村获得的荣誉与表彰',
    en: 'Awards and recognition received by Xiafengcha Village'
  },
  'section.reports': {
    zh: '新闻报道',
    en: 'News Reports'
  },
  'section.reports.sub': {
    zh: '媒体报道与新闻聚焦',
    en: 'Media coverage and news highlights'
  },
  'honor.1.title': {
    zh: '浙江省美丽乡村示范村',
    en: 'Zhejiang Province Beautiful Village Model'
  },
  'honor.2.title': {
    zh: '宁海县文明村',
    en: 'Ninghai County Civilized Village'
  },
  'honor.3.title': {
    zh: '谢氏宗祠文物保护单位',
    en: 'Xie Ancestral Hall Heritage Site'
  },
  'report.1.title': {
    zh: '宁海下枫槎村：古村焕新颜 数字宗祠传家风',
    en: 'Ninghai Xiafengcha: Ancient Village Meets Digital Ancestral Hall'
  },
  'report.1.desc': {
    zh: '下枫槎村依托数字宗祠平台，将传统家族文化融入现代数字技术，探索传统文化传承新路径。',
    en: 'Xiafengcha Village uses its digital ancestral hall to blend tradition with modern technology.'
  },
  'report.2.title': {
    zh: '下枫槎村乡村振兴纪实：古村落的美丽蝶变',
    en: 'Rural Revitalization: The Beautiful Transformation of Xiafengcha'
  },
  'report.2.desc': {
    zh: '下枫槎村在保持古村落风貌的同时，大力发展乡村旅游和特色农业，实现从偏远山村到美丽乡村的华丽转身。',
    en: 'Xiafengcha develops rural tourism and specialty agriculture while preserving its ancient village character.'
  },
  'report.3.title': {
    zh: '谢氏后人的文化坚守：老祠堂变身新课堂',
    en: 'Cultural Heritage: Ancestral Hall Becomes a Classroom'
  },
  'report.3.desc': {
    zh: '谢氏族人将百年宗祠改造成传统文化课堂，定期组织青少年学习国学经典、书法礼仪。',
    en: 'The Xie family transforms their ancestral hall into a classroom for traditional culture.'
  },
  'report.4.title': {
    zh: '艺探新乡村 | 最是茶香抚人心——宁海县跃龙街道下枫槎村',
    en: 'Art Exploration: Tea Fragrance Soothes the Soul in Xiafengcha Village'
  },
  'report.4.desc': {
    zh: '宁波市文联"艺探新乡村"专栏报道下枫槎村，以茶文化为主线，讲述艺术赋能乡村振兴的生动故事。',
    en: 'Ningbo Literary Federation features Xiafengcha Village in its "Art Exploration" column, telling the story of art-empowered rural revitalization through tea culture.'
  },
  'report.5.title': {
    zh: '望府山下清"枫"徐来',
    en: 'Clear Breeze Under Wangfu Mountain'
  },
  'report.5.desc': {
    zh: '浙江省纪委监委"清风之旅"专栏报道下枫槎村，以茶为媒打造"茶廉枫香"廉洁文化品牌，实现从城郊乡村到城市后花园的"美丽蝶变"。',
    en: 'Zhejiang Commission for Discipline Inspection features Xiafengcha Village, building a clean governance culture brand through tea culture.'
  },
  'report.6.title': {
    zh: '宁波宁海：农家爱艺术 废物尽"奇"用',
    en: 'Ninghai: Villagers Turn Waste into Art'
  },
  'report.6.desc': {
    zh: '央广网报道下枫槎村"尽奇用——废物不废"行动，村民利用废旧物品改造家庭空间为公共文化空间，探索艺术赋能乡村振兴新路径。',
    en: 'China National Radio reports on Xiafengcha\'s "Waste to Art" campaign, where villagers transform waste into public cultural spaces.'
  },
  'report.7.title': {
    zh: '宁海下枫槎村｜"茶文化"艺术村展露风姿',
    en: 'Xiafengcha: A Tea Culture Art Village Blossoms'
  },
  'report.7.desc': {
    zh: '宁海下枫槎村依托望府楼山和望府茶产区优势，打造"望府茶飨、自在曲水"IP，建成艺术节点17个、培育产业项目5个，总投资超千万元。',
    en: 'Xiafengcha Village leverages its Wangfu Mountain tea heritage to build 17 art nodes and 5 industry projects, showcasing tea culture art village.'
  },
  'report.8.title': {
    zh: '宁海跃龙：以艺术激活乡村振兴的"一池春水"',
    en: 'Yuelong: Activating Rural Revitalization Through Art'
  },
  'report.8.desc': {
    zh: '浙江日报报道宁海跃龙街道以艺术激活乡村振兴，下枫槎村引入艺术家团队打造茶文化IP，建成艺术节点17个，推动"美丽颜值"向"发展产值"转变。',
    en: 'Zhejiang Daily reports on Yuelong\'s art-driven rural revitalization, where Xiafengcha Village built 17 art nodes and transformed beauty into economic value.'
  },
  'card.report.title': {
    zh: '媒体报道',
    en: 'Media Reports'
  },
  'card.report.desc': {
    zh: '汇集各类媒体关于下枫槎村及谢氏家族的新闻报道。',
    en: 'News coverage about Xiafengcha Village and the Xie family.'
  },
  'card.link.title': {
    zh: '媒体链接',
    en: 'Media Links'
  },
  'card.link.desc': {
    zh: '宁海新闻网 · 宁波日报 · 浙江新闻',
    en: 'Ninghai News · Ningbo Daily · Zhejiang News'
  },

  'footer.desc': {
    zh: '宁海下枫槎村谢氏家族数字宗祠，致力于家族文化传承与宗亲联络。',
    en: 'Digital ancestral hall of the Xie family, Xiafengcha Village, Ninghai. Dedicated to preserving family heritage and connecting kin.'
  },
  'footer.copyright': {
    zh: '© 2026 宁海下枫槎村谢氏家族 · 数字宗祠',
    en: '© 2026 Xie Family of Xiafengcha Village, Ninghai · Digital Ancestral Hall'
  },

  'btn.more': {
    zh: '查看更多 →',
    en: 'View more →'
  },
  'btn.enter': {
    zh: '进入族谱查询 →',
    en: 'Search Genealogy →'
  },
  'btn.submit': {
    zh: '提交留言',
    en: 'Submit'
  },
  'btn.verify': {
    zh: '验证身份',
    en: 'Verify'
  },

  'weather.location': {
    zh: '宁波宁海',
    en: 'Ninghai, Ningbo'
  },
  'weather.fetching': {
    zh: '获取天气中...',
    en: 'Fetching weather...'
  },

  // Carousel slide labels
  'slide.1': { zh: '谢氏宗祠 · 始建于清乾隆年间', en: 'Xie Ancestral Hall · Built in Qianlong Era' },
  'slide.2': { zh: '古树参天 · 下枫槎村口古枫树', en: 'Ancient Trees · Village Entrance' },
  'slide.3': { zh: '青山环绕 · 下枫槎村全景', en: 'Mountains · Panoramic View' },
  'slide.4': { zh: '明清古民居 · 石板路蜿蜒', en: 'Ming-Qing Houses · Cobbled Paths' },
  'slide.5': { zh: '清明祭祖 · 合族共祭先祖', en: 'Qingming Ritual · Honoring Ancestors' },
  'slide.6': { zh: '新春团拜 · 宗亲欢聚一堂', en: 'New Year Gathering · Family Reunion' },

  // News items
  'news.1.title': { zh: '下枫槎村谢氏宗祠修缮工程启动', en: 'Renovation of Xie Ancestral Hall Begins' },
  'news.1.desc': { zh: '宗祠始建于清乾隆年间，历经两百余年风雨。本次修缮将秉持"修旧如旧"原则，预计年底前完成。', en: 'Built during the Qianlong era, the hall has stood for over 200 years. The restoration follows "repair as original" principles, targeting completion by year-end.' },
  'news.2.title': { zh: '2026年清明祭祖大典圆满举行', en: '2026 Qingming Ancestral Ceremony Held' },
  'news.2.desc': { zh: '百余位宗亲齐聚下枫槎，共祭先祖。今年新增了年轻一代主祭环节，传承家族文化。', en: 'Over a hundred kin gathered at Xiafengcha for the ceremony. This year featured a youth-led祭祀 segment to pass on family traditions.' },
  'news.3.title': { zh: '《下枫槎谢氏宗谱》电子版编纂启动', en: 'Digital Genealogy of Xie Family Launched' },
  'news.3.desc': { zh: '家族理事会决定启动宗谱数字化工程，将纸质老谱整理为可检索的电子版族谱。', en: 'The family council launched a project to digitize the paper genealogy into a searchable electronic format.' },
  'news.4.title': { zh: '谢氏家族网站"数字宗祠"正式上线', en: 'Xie Family Digital Ancestral Hall Goes Live' },
  'news.4.desc': { zh: '下枫槎谢氏数字宗祠今日上线，旨在通过互联网平台传承家族文化、联络宗亲情谊。', en: 'The digital ancestral hall of Xiafengcha Xie Family is now online, connecting kin and preserving heritage in the digital age.' },

  // Info cards
  'card.hall.title': { zh: '下枫槎宗祠', en: 'Xiafengcha Ancestral Hall' },
  'card.hall.desc': { zh: '坐落于宁海县下枫槎村，始建于清·乾隆年间，三进两厢格局，雕梁画栋，古朴庄严。', en: 'Located in Xiafengcha Village, Ninghai. Built during the Qianlong era with a three-hall, two-wing layout, featuring carved beams and ancient splendor.' },
  'card.village.title': { zh: '下枫槎村风貌', en: 'Village Landscape' },
  'card.village.desc': { zh: '依山傍水，古树参天，村中石板路蜿蜒，明清古民居错落有致。', en: 'Nestled between mountains and water, ancient trees tower over winding cobblestone paths lined with Ming-Qing era houses.' },

  // Celebrities
  'home.quote': {
    zh: '旧时王谢堂前燕，飞入寻常百姓家',
    en: 'Swallows that once graced the halls of Wang and Xie, now fly into the homes of common folk.'
  },
  'celeb.1.name': { zh: '谢安（320-385）', en: 'Xie An (320-385)' },
  'celeb.1.desc': { zh: '东晋著名政治家、军事家，淝水之战中以少胜多，功勋卓著。谢氏家族史上最具代表性人物之一。', en: 'Renowned Eastern Jin statesman and military strategist. Victory at the Fei River Battle. One of the most iconic figures in Xie family history.' },
  'celeb.2.name': { zh: '谢灵运（385-433）', en: 'Xie Lingyun (385-433)' },
  'celeb.2.desc': { zh: '南朝宋著名诗人，中国山水诗派创始人。曾任永嘉太守，其诗作开山水诗之先河。', en: 'Famous poet of the Liu Song dynasty, founder of the Chinese landscape poetry school. Served as governor of Yongjia.' },
  'celeb.3.name': { zh: '谢玄（343-388）', en: 'Xie Xuan (343-388)' },
  'celeb.3.desc': { zh: '东晋名将，谢安之侄。组建北府兵，在淝水之战中担任前锋，大破前秦苻坚百万大军。', en: 'Eastern Jin general, nephew of Xie An. Led the elite Beifu Army as vanguard in the Fei River Battle, crushing the Former Qin forces.' },

  // Footer sections
  'footer.section1.title': { zh: '下枫槎谢氏', en: 'Xie of Xiafengcha' },
  'footer.section2.title': { zh: '快捷链接', en: 'Quick Links' },
  'footer.link.genealogy': { zh: '族谱查询', en: 'Genealogy' },
  'footer.section3.title': { zh: '家族活动', en: 'Activities' },
  'footer.link.review': { zh: '活动回顾', en: 'Review' },
  'footer.link.upcoming': { zh: '活动预告', en: 'Upcoming' },
  'footer.link.gallery': { zh: '活动相册', en: 'Gallery' },
  'footer.link.ritual': { zh: '祭祀传统', en: 'Traditions' },
  'footer.section4.title': { zh: '后台管理', en: 'Dashboard' },
  'footer.link.admin': { zh: '管理后台', en: 'Admin Panel' },
  'footer.link.genealogy.mgmt': { zh: '族谱管理', en: 'Genealogy Mgmt' },
  'music.label': {
    zh: '背景音乐',
    en: 'Music'
  },
  'visit.label': {
    zh: '访问人数',
    en: 'Visitors'
  },
  'genealogy.lock.title': {
    zh: '族谱查询',
    en: 'Genealogy Search'
  },
  'genealogy.lock.desc': {
    zh: '请输入密码以查看族谱内容',
    en: 'Enter password to access genealogy'
  },
  'genealogy.error': {
    zh: '密码错误，请重试',
    en: 'Incorrect password, please try again'
  },
  'admin.login.title': {
    zh: '管理员身份验证',
    en: 'Admin Login'
  },
  'admin.login.desc': {
    zh: '请输入管理员密码以进入后台管理',
    en: 'Enter admin password to access the dashboard'
  },
  'admin.login.error': {
    zh: '密码错误，请重试',
    en: 'Incorrect password, please try again'
  },
  'admin.panel.title': {
    zh: '网站内容管理',
    en: 'Content Management'
  },
  'admin.logout': {
    zh: '退出登录',
    en: 'Logout'
  },
  'admin.overview': {
    zh: '站点概况',
    en: 'Site Overview'
  },
  'admin.visits': {
    zh: '访问量',
    en: 'Visitors'
  },
  'admin.articles': {
    zh: '文章数',
    en: 'Articles'
  },
  'admin.pages': {
    zh: '页面数',
    en: 'Pages'
  },
  'admin.news': {
    zh: '消息发布',
    en: 'News'
  },
  'admin.genealogy': {
    zh: '族谱管理',
    en: 'Genealogy'
  },
  'admin.members': {
    zh: '成员管理',
    en: 'Members'
  },
  'admin.activities': {
    zh: '活动管理',
    en: 'Activities'
  },
  'admin.photos': {
    zh: '照片管理',
    en: 'Photos'
  },
  'admin.videos': {
    zh: '视频管理',
    en: 'Videos'
  },
  'admin.messages': {
    zh: '留言管理',
    en: 'Messages'
  },
  'admin.settings': {
    zh: '系统设置',
    en: 'Settings'
  },

  'weekday.0': { zh: '星期日', en: 'Sunday' },
  'weekday.1': { zh: '星期一', en: 'Monday' },
  'weekday.2': { zh: '星期二', en: 'Tuesday' },
  'weekday.3': { zh: '星期三', en: 'Wednesday' },
  'weekday.4': { zh: '星期四', en: 'Thursday' },
  'weekday.5': { zh: '星期五', en: 'Friday' },
  'weekday.6': { zh: '星期六', en: 'Saturday' },
  // ===== Stats =====
  'stats.games': { zh: '总场次', en: 'Games' },
  'stats.amount': { zh: '总流水', en: 'Total Flow' },
  'stats.players': { zh: '活跃玩家', en: 'Active Players' },
  'stats.posts': { zh: '心得', en: 'Posts' },
  'stats.mymonth': { zh: '我的本月', en: 'My Month' },
  'stats.male': { zh: '男', en: 'Male' },
  'stats.female': { zh: '女', en: 'Female' },
  'stats.alive': { zh: '在世', en: 'Alive' },
  'stats.deceased': { zh: '已故', en: 'Deceased' },
  'stats.total': { zh: '总人数', en: 'Total' },
  'stats.generations': { zh: '世代', en: 'Gens' },
  'stats.branches': { zh: '支系', en: 'Branches' },
  'search.placeholder': { zh: '搜索姓名、字辈、支系...', en: 'Search name...' },
  'search.gen_from': { zh: '世代从', en: 'Gen from' },
  'search.gen_to': { zh: '到', en: 'to' },
  'search.branch_all': { zh: '全部支系', en: 'All branches' },
  'search.gender_all': { zh: '全部性别', en: 'All genders' },
  'search.status_all': { zh: '全部状态', en: 'All status' },
  'search.btn': { zh: '搜索', en: 'Search' },
  'search.clear': { zh: '清除', en: 'Clear' },
  'filter.all': { zh: '全部世系', en: 'All' },
  'members.alive': { zh: '在世成员', en: 'Living' },
  'members.all': { zh: '全部成员', en: 'All Members' },
  'members.import': { zh: '📥 导入 Excel', en: '📥 Import' },
  'members.export': { zh: '📤 导出 Excel', en: '📤 Export' },
  'genealogy.click_detail': { zh: '点击姓名查看详情', en: 'Click for details' },
  'genealogy.expand_all': { zh: '全部展开', en: 'Expand All' },
  'genealogy.collapse_all': { zh: '全部收起', en: 'Collapse All' },
  'genealogy.fullscreen': { zh: '⛶ 全屏', en: '⛶ Fullscreen' },
  'genealogy.locate': { zh: '🌳 定位', en: '🌳 Locate' },
  'genealogy.ancestors': { zh: '⬆ 祖先', en: '⬆ Ancestors' },
  'genealogy.gen': { zh: '世', en: 'Gen' },
  'visit.label': { zh: '访问人数', en: 'Visitors' },

};

function getLang() {
  return localStorage.getItem('xie_lang') || 'zh';
}

function setLang(lang) {
  localStorage.setItem('xie_lang', lang);
}

function applyLanguage(lang) {
  lang = lang || getLang();
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var text = TRANSLATIONS[key];
    if (text && text[lang]) {
      if (el.tagName === 'TITLE') {
        document.title = text[lang];
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = text[lang];
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', text[lang]);
      } else {
        el.textContent = text[lang];
      }
    }
  });

  // Handle data-i18n-aria → sets aria-label attribute
  document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-aria');
    var text = TRANSLATIONS[key];
    if (text && text[lang]) {
      el.setAttribute('aria-label', text[lang]);
    }
  });

  // Handle data-i18n-title → sets title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-title');
    var text = TRANSLATIONS[key];
    if (text && text[lang]) {
      el.setAttribute('title', text[lang]);
    }
  });

  // Update lang toggle button text
  var toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.textContent = lang === 'en' ? '中' : 'EN';
    toggle.classList.toggle('active', lang === 'en');
  }

  // Update date display if present
  updateDateDisplay(lang);
}

function toggleLanguage() {
  var current = getLang();
  var next = current === 'zh' ? 'en' : 'zh';
  setLang(next);
  applyLanguage(next);
  // Refresh weather description text
  var descEl = document.getElementById('hero-weather-desc');
  if (descEl) {
    var cache = localStorage.getItem('xie_weather_cache');
    if (cache) {
      try { var c = JSON.parse(cache); descEl.textContent = c.condition; } catch(e) {}
    }
  }
  // Refresh location text
  var locEl = document.getElementById('weather-location');
  if (locEl) locEl.textContent = TRANSLATIONS['weather.location'][next] || '宁波宁海';
}

function initLanguage() {
  var lang = getLang();
  applyLanguage(lang);

  var toggle = document.getElementById('lang-toggle');
  if (toggle) {
    // Remove old listener by cloning
    var newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    newToggle.addEventListener('click', toggleLanguage);
  }
}

/* ===== Lunar Calendar (simplified) ===== */
function getLunarDate(year, month, day) {
  // Simplified lookup for 2026
  var LUNAR_2026 = {
    '1-1': '冬月十三', '1-2': '冬月十四', '1-3': '冬月十五', '1-4': '冬月十六',
    '1-5': '冬月十七', '1-6': '冬月十八', '1-7': '冬月十九', '1-8': '冬月二十',
    '1-9': '冬月廿一', '1-10': '冬月廿二', '1-11': '冬月廿三', '1-12': '冬月廿四',
    '1-13': '冬月廿五', '1-14': '冬月廿六', '1-15': '冬月廿七', '1-16': '冬月廿八',
    '1-17': '冬月廿九', '1-18': '腊月初一', '1-19': '腊月初二', '1-20': '腊月初三',
    '1-21': '腊月初四', '1-22': '腊月初五', '1-23': '腊月初六', '1-24': '腊月初七',
    '1-25': '腊月初八', '1-26': '腊月初九', '1-27': '腊月初十', '1-28': '腊月十一',
    '1-29': '腊月十二', '1-30': '腊月十三', '1-31': '腊月十四',
    '2-1': '腊月十五', '2-2': '腊月十六', '2-3': '腊月十七', '2-4': '腊月十八',
    '2-5': '腊月十九', '2-6': '腊月二十', '2-7': '腊月廿一', '2-8': '腊月廿二',
    '2-9': '腊月廿三', '2-10': '腊月廿四', '2-11': '腊月廿五', '2-12': '腊月廿六',
    '2-13': '腊月廿七', '2-14': '腊月廿八', '2-15': '腊月廿九', '2-16': '腊月三十',
    '2-17': '正月初一', '2-18': '正月初二', '2-19': '正月初三', '2-20': '正月初四',
    '2-21': '正月初五', '2-22': '正月初六', '2-23': '正月初七', '2-24': '正月初八',
    '2-25': '正月初九', '2-26': '正月初十', '2-27': '正月十一', '2-28': '正月十二',
    '3-1': '正月十三', '3-2': '正月十四', '3-3': '正月十五', '3-4': '正月十六',
    '3-5': '正月十七', '3-6': '正月十八', '3-7': '正月十九', '3-8': '正月二十',
    '3-9': '正月廿一', '3-10': '正月廿二', '3-11': '正月廿三', '3-12': '正月廿四',
    '3-13': '正月廿五', '3-14': '正月廿六', '3-15': '正月廿七', '3-16': '正月廿八',
    '3-17': '正月廿九', '3-18': '二月初一', '3-19': '二月初二', '3-20': '二月初三',
    '3-21': '二月初四', '3-22': '二月初五', '3-23': '二月初六', '3-24': '二月初七',
    '3-25': '二月初八', '3-26': '二月初九', '3-27': '二月初十', '3-28': '二月十一',
    '3-29': '二月十二', '3-30': '二月十三', '3-31': '二月十四',
    '4-1': '二月十五', '4-2': '二月十六', '4-3': '二月十七', '4-4': '二月十八',
    '4-5': '二月十九', '4-6': '二月二十', '4-7': '二月廿一', '4-8': '二月廿二',
    '4-9': '二月廿三', '4-10': '二月廿四', '4-11': '二月廿五', '4-12': '二月廿六',
    '4-13': '二月廿七', '4-14': '二月廿八', '4-15': '二月廿九', '4-16': '二月三十',
    '4-17': '三月初一', '4-18': '三月初二', '4-19': '三月初三', '4-20': '三月初四',
    '4-21': '三月初五', '4-22': '三月初六', '4-23': '三月初七', '4-24': '三月初八',
    '4-25': '三月初九', '4-26': '三月初十', '4-27': '三月十一', '4-28': '三月十二',
    '4-29': '三月十三', '4-30': '三月十四',
    '5-1': '三月十五', '5-2': '三月十六', '5-3': '三月十七', '5-4': '三月十八',
    '5-5': '三月十九', '5-6': '三月二十', '5-7': '三月廿一', '5-8': '三月廿二',
    '5-9': '三月廿三', '5-10': '三月廿四', '5-11': '三月廿五', '5-12': '三月廿六',
    '5-13': '三月廿七', '5-14': '三月廿八', '5-15': '三月廿九', '5-16': '四月初一',
    '5-17': '四月初二', '5-18': '四月初三', '5-19': '四月初四', '5-20': '四月初五',
    '5-21': '四月初六', '5-22': '四月初七', '5-23': '四月初八', '5-24': '四月初九',
    '5-25': '四月初十', '5-26': '四月十一', '5-27': '四月十二', '5-28': '四月十三',
    '5-29': '四月十四', '5-30': '四月十五', '5-31': '四月十六',
    '6-1': '四月十七', '6-2': '四月十八', '6-3': '四月十九', '6-4': '四月二十',
    '6-5': '四月廿一', '6-6': '四月廿二', '6-7': '四月廿三', '6-8': '四月廿四',
    '6-9': '四月廿五', '6-10': '四月廿六', '6-11': '四月廿七', '6-12': '四月廿八',
    '6-13': '四月廿九', '6-14': '五月初一', '6-15': '五月初二', '6-16': '五月初三',
    '6-17': '五月初四', '6-18': '五月初五', '6-19': '五月初六', '6-20': '五月初七',
    '6-21': '五月初八', '6-22': '五月初九', '6-23': '五月初十', '6-24': '五月十一',
    '6-25': '五月十二', '6-26': '五月十三', '6-27': '五月十四', '6-28': '五月十五',
    '6-29': '五月十六', '6-30': '五月十七',
    '7-1': '五月十八', '7-2': '五月十九', '7-3': '五月二十', '7-4': '五月廿一',
    '7-5': '五月廿二', '7-6': '五月廿三', '7-7': '五月廿四', '7-8': '五月廿五',
    '7-9': '五月廿六', '7-10': '五月廿七', '7-11': '五月廿八', '7-12': '五月廿九',
    '7-13': '五月三十', '7-14': '六月初一', '7-15': '六月初二', '7-16': '六月初三',
    '7-17': '六月初四', '7-18': '六月初五', '7-19': '六月初六', '7-20': '六月初七',
    '7-21': '六月初八', '7-22': '六月初九', '7-23': '六月初十', '7-24': '六月十一',
    '7-25': '六月十二', '7-26': '六月十三', '7-27': '六月十四', '7-28': '六月十五',
    '7-29': '六月十六', '7-30': '六月十七', '7-31': '六月十八',
    '8-1': '六月十九', '8-2': '六月二十', '8-3': '六月廿一', '8-4': '六月廿二',
    '8-5': '六月廿三', '8-6': '六月廿四', '8-7': '六月廿五', '8-8': '六月廿六',
    '8-9': '六月廿七', '8-10': '六月廿八', '8-11': '六月廿九', '8-12': '七月初一',
    '8-13': '七月初二', '8-14': '七月初三', '8-15': '七月初四', '8-16': '七月初五',
    '8-17': '七月初六', '8-18': '七月初七', '8-19': '七月初八', '8-20': '七月初九',
    '8-21': '七月初十', '8-22': '七月十一', '8-23': '七月十二', '8-24': '七月十三',
    '8-25': '七月十四', '8-26': '七月十五', '8-27': '七月十六', '8-28': '七月十七',
    '8-29': '七月十八', '8-30': '七月十九', '8-31': '七月二十',
    '9-1': '七月廿一', '9-2': '七月廿二', '9-3': '七月廿三', '9-4': '七月廿四',
    '9-5': '七月廿五', '9-6': '七月廿六', '9-7': '七月廿七', '9-8': '七月廿八',
    '9-9': '七月廿九', '9-10': '八月初一', '9-11': '八月初二', '9-12': '八月初三',
    '9-13': '八月初四', '9-14': '八月初五', '9-15': '八月初六', '9-16': '八月初七',
    '9-17': '八月初八', '9-18': '八月初九', '9-19': '八月初十', '9-20': '八月十一',
    '9-21': '八月十二', '9-22': '八月十三', '9-23': '八月十四', '9-24': '八月十五',
    '9-25': '八月十六', '9-26': '八月十七', '9-27': '八月十八', '9-28': '八月十九',
    '9-29': '八月二十', '9-30': '八月廿一'
  };
  var key = month + '-' + day;
  return LUNAR_2026[key] || '';
}

function updateDateDisplay(lang) {
  var dayEl = document.getElementById('hero-date-day');
  var weekdayEl = document.getElementById('hero-date-weekday');
  var monthEl = document.getElementById('hero-date-month');
  var lunarEl = document.getElementById('hero-date-lunar');
  var yearEl = document.getElementById('hero-date-year');
  if (!dayEl) return;

  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  var w = now.getDay();

  dayEl.textContent = d;
  if (monthEl) {
    monthEl.textContent = lang === 'en' ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1] : m + '月';
  }
  var enWeekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var zhWeekday = (TRANSLATIONS['weekday.' + w] || {}).zh || '';
  var enWeekday = enWeekdays[w] || '';
  var zhLunar = getLunarDate(y, m, d);
  var enLunar = 'Lunar ' + (zhLunar.replace(/[^初二十廿卅一二三四五六七八九十]/g, '') || '');

  if (weekdayEl) {
    weekdayEl.textContent = lang === 'en' ? enWeekday : zhWeekday;
  }
  if (lunarEl) {
    lunarEl.textContent = lang === 'en' ? enLunar : ('农历' + zhLunar);
  }
  if (yearEl) {
    yearEl.textContent = lang === 'en' ? y.toString() : y + '年';
  }

  // Weather location text
  var locEl = document.getElementById('weather-location');
  if (locEl) {
    locEl.textContent = TRANSLATIONS['weather.location'][lang || 'zh'];
  }
}
