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
  'mobile.story.title': { zh: '一页族谱，<br>一座村庄，一脉家风', en: 'One genealogy,<br>one village, one family legacy' },
  'mobile.story.desc': { zh: '从这里开始，慢慢认识下枫槎谢氏。', en: 'Begin here and get to know the Xie family of Xiafengcha.' },
  'mobile.entry.explore': { zh: '开始探索', en: 'Explore' },
  'mobile.entry.genealogy': { zh: '寻根问祖', en: 'Find Your Roots' },
  'mobile.entry.hint': { zh: '左右滑动选择入口，点击进入', en: 'Swipe to choose an entrance, then tap to enter' },

};

/*
 * Legacy pages contain a number of unmarked text nodes and dynamically-created
 * labels. Keep these translations here so the language switch is consistent
 * even when an older page has not yet been converted to data-i18n markup.
 */
const EXTRA_TRANSLATIONS = {
  '谢': 'Xie',
  '下枫槎谢氏': 'Xie Family of Xiafengcha',
  '家族网站': 'Family Website',
  '宁海 · 下枫槎村': 'Ninghai · Xiafengcha Village',
  '宁海下枫槎村': 'Xiafengcha Village, Ninghai',
  '下枫槎': 'Xiafengcha',
  '宁海': 'Ninghai',
  '谢氏': 'Xie family',
  '谢家': 'Xie family',
  '家族': 'family',
  '宗祠': 'ancestral hall',
  '族谱': 'genealogy',
  '宗谱': 'genealogy',
  '村史': 'village history',
  '村庄': 'village',
  '历史': 'history',
  '文化': 'culture',
  '传承': 'heritage',
  '源流': 'origins',
  '迁徙': 'migration',
  '世次': 'generation',
  '世代': 'generations',
  '始祖': 'founding ancestor',
  '先祖': 'ancestors',
  '祖先': 'ancestors',
  '后人': 'descendants',
  '名人': 'notable figures',
  '简介': 'Overview',
  '详情': 'Details',
  '说明': 'Notes',
  '内容': 'Content',
  '资料': 'records',
  '数据': 'data',
  '记录': 'records',
  '来源': 'source',
  '更新': 'update',
  '加载': 'load',
  '暂无': 'No',
  '正在': 'Currently',
  '请': 'Please ',
  '输入': 'Enter',
  '选择': 'Select',
  '点击': 'Click',
  '进入': 'Open',
  '查看': 'View',
  '显示': 'Show',
  '隐藏': 'Hide',
  '返回': 'Back',
  '打开': 'Open',
  '关闭': 'Close',
  '继续': 'Continue',
  '验证': 'Verify',
  '错误': 'Error',
  '成功': 'Success',
  '失败': 'Failed',
  '重试': 'Try again',
  '刷新': 'Refresh',
  '确定': 'Confirm',
  '取消': 'Cancel',
  '全部': 'All',
  '成员': 'members',
  '人员': 'people',
  '人数': 'people',
  '关系': 'relationship',
  '父亲': 'father',
  '祖父': 'grandfather',
  '配偶': 'spouse',
  '男': 'Male',
  '女': 'Female',
  '在世': 'Living',
  '已故': 'Deceased',
  '未标注': 'Not specified',
  '家训': 'Family Instructions',
  '族规': 'Clan Rules',
  '卷轴': 'Scroll',
  '大事记': 'Chronicle',
  '家族 AI 咨询': 'Family AI Assistant',
  'AI 咨询': 'AI Assistant',
  'AI 问答': 'AI Q&A',
  '您好呀，我是下枫槎谢氏的小管家，族谱、村史、世系想问什么都可以哦～': 'Hello, I am the Xiafengcha Xie family guide. Ask me about genealogy, village history or lineage anytime.',
  '您好，我是下枫槎谢氏家族的 AI 助手 🤖\n可以问我村史、族谱、字辈等公开问题。涉及个人世系、族人个人信息的查询，需先完成族人身份验证。': 'Hello, I am the Xie family AI assistant 🤖\nAsk about public village history, genealogy and generation poems. Personal lineage and member information require identity verification first.',
  '放大到整屏': 'Open fullscreen',
  '语音朗读开关': 'Text-to-speech',
  '暂停口播': 'Pause narration',
  '清空咨询记录': 'Clear consultation history',
  '手机端页面入口': 'Mobile page navigation',
  '返回上一页': 'Back to previous page',
  '快捷族谱查询': 'Quick genealogy search',
  '输入族人姓名，如：伟中': 'Enter a member name, e.g. Weizhong',
  '🌳 炎帝至此人': '🌳 Emperor Yan to this person',
  '🔗 与此人最亲': '🔗 Closest relatives',
  '输入村史、族谱、字辈等问题': 'Ask about village history, genealogy or generation poems',
  '例如：谢氏家族是如何迁徙到宁海的？': 'Example: How did the Xie family migrate to Ninghai?',
  '↓ 回到最新': '↓ Jump to latest',
  '思考中…': 'Thinking…',
  '思考中...': 'Thinking…',
  '（无回答）': '(No answer)',
  '📚 参考：': '📚 Sources: ',
  '查看树状世系图': 'View lineage tree',
  '全面展示出继 / 入继关系图': 'Show adoption and inheritance relationships',
  '亲生父亲、继父及关系线同时呈现': 'Show the biological father, adoptive father and both relationship lines',
  '查看出继 / 入继详情图': 'View adoption and inheritance details',
  '亲生父系与承嗣父系同时呈现': 'Show both biological and adoptive paternal lines',
  '已选择': 'Selected',
  '正在查询…': 'Searching…',
  '正在查询...': 'Searching…',
  '正在生成完整的出继 / 入继关系图…': 'Generating the complete adoption and inheritance relationship graph…',
  '当前选择': 'Selected',
  '可左右滑动切换入口': 'Swipe left or right to switch entrances',
  '请选择您要查询的哪一位': 'Choose the person you want to query',
  '请选择要按亲生父系还是承嗣父系查询': 'Choose whether to query the biological or adoptive paternal line',
  '父亲未详': 'Father not recorded',
  '亲生父亲：': 'Biological father: ',
  '继父：': 'Adoptive father: ',
  '父亲：': 'Father: ',
  '（本人）': '(self)',
  '您的姓名': 'Your name',
  '父亲名字': 'Father’s name',
  '祖父名字（可留空）': 'Grandfather’s name (optional)',
  '请填写姓名和父亲名字': 'Please enter the name and father’s name',
  '验证身份': 'Verify identity',
  '网络错误，请重试': 'Network error. Please try again.',
  '信息不符，请核对': 'The information does not match. Please check it.',
  '该问题涉及个人世系图谱，请先完成族人身份验证（与站内验证一致，填姓名、父亲、祖父）。': 'This question concerns a personal lineage chart. Please verify your identity first by entering your name, father and grandfather.',
  '该问题涉及族人的个人信息（隐私），请先完成族人身份验证（与站内验证一致，填姓名、父亲、祖父）。': 'This question concerns private member information. Please verify your identity first by entering your name, father and grandfather.',
  '✅ 身份验证通过，现在可以查询您的个人世系了。': '✅ Identity verified. You can now query your personal lineage.',
  '请从炎帝神农氏开始，呈现我的世系图': 'Show my lineage starting with Emperor Yan, Shennong',
  '请列出和我血缘最亲的人': 'List the relatives closest to me by blood',
  '下枫槎谢氏的始祖是谁？族谱记载了哪些早期祖先？': 'Who founded the Xiafengcha Xie family? Which early ancestors are recorded in the genealogy?',
  '谢氏家族是如何迁徙到宁海下枫槎村的？': 'How did the Xie family migrate to Xiafengcha Village, Ninghai?',
  '我现在是第几代？和我同辈的族人有哪些？': 'Which generation am I in, and who are my fellow-generation relatives?',
  '字辈排行诗是什么？各世对应哪个字？': 'What is the generation-name poem, and which character belongs to each generation?',
  '一键查族谱': 'One-click Genealogy Search',
  '只填姓名，不用提问': 'Enter a name only; no question needed',
  '发送': 'Send',
  '回到最新': 'Jump to latest',
  '清空对话': 'Clear conversation',
  '从炎帝神农氏开始': 'Starting with Emperor Yan, Shennong',
  '请输入姓名和父亲名字': 'Enter the name and father’s name',
  '未验证 · 仅公开问题': 'Not verified · Public questions only',
  '已验证': 'Verified',
  '仅公开问题': 'Public questions only',
  '⛩ 返回石门': '⛩ Back to Entrance',
  '返回石门': 'Back to Entrance',
  '返回开启页': 'Back to Opening',
  '返回导航页': 'Back to Navigation',
  '返回首页': 'Back Home',
  '← 返回首页': '← Back Home',
  '← 返回': '← Back',
  '返回': 'Back',
  '首页': 'Home',
  '家族历史': 'Family History',
  '今日下枫槎': 'Xiafengcha Today',
  '家族活动': 'Family Activities',
  '消息发布': 'News',
  '新闻报道': 'News Reports',
  '影像记录': 'Media Archive',
  '影像': 'Media',
  '视频': 'Videos',
  '名人事迹': 'Notable Figures',
  '谢氏集萃': 'Xie Collection',
  '族谱查询': 'Genealogy',
  '功德卷轴': 'Merit Scroll',
  '听下枫槎': 'Listen to Xiafengcha',
  '联系我们': 'Contact Us',
  '风物古迹': 'Landmarks',
  '村荣誉': 'Village Honors',
  '荣誉墙': 'Honor Wall',
  '村组织架构': 'Village Committee',
  '乡村物产': 'Local Products',
  '枫槎留声机': 'Xiafengcha Music Player',
  '栏目导航': 'Navigation',
  '总导航': 'Navigation',
  '进入主首页': 'Main Home',
  '选择左侧栏目查看内容': 'Select a section on the left',
  '快速查找栏目…': 'Search sections…',
  '主题': 'Theme',
  '浅色': 'Light',
  '深色': 'Dark',
  '语言': 'Language',
  '简体中文': 'Chinese',
  '英文': 'English',
  '中英文切换': 'Switch language',
  '切换语言': 'Switch language',
  '打开手机导航': 'Open mobile navigation',
  '收起导航栏': 'Hide navigation',
  '展开导航栏': 'Show navigation',
  '切换到黑夜模式': 'Switch to dark mode',
  '切换到白天模式': 'Switch to light mode',
  '黑夜': 'Dark',
  '白天': 'Light',
  '加载中...': 'Loading…',
  '加载中…': 'Loading…',
  '加载数据中...': 'Loading data…',
  '加载数据中…': 'Loading data…',
  '正在加载…': 'Loading…',
  '正在整理主题': 'Preparing topics',
  '暂未收录内容': 'No content has been added yet.',
  '未命名': 'Untitled',
  '未命名消息': 'Untitled news item',
  '暂无活动数据': 'No activity data yet.',
  '暂无音乐': 'No music available',
  '请将音乐文件放到 music/ 目录下': 'Place music files in the music/ folder.',
  '正在工作中': 'Working',
  '回到顶部': 'Back to top',
  '上一页': 'Previous',
  '下一页': 'Next',
  '清除': 'Clear',
  '查询': 'Search',
  '搜索': 'Search',
  '全部': 'All',
  '查看': 'View',
  '查看更多 →': 'View more →',
  '阅读全文': 'Read full story',
  '展开全部': 'Expand all',
  '全部展开': 'Expand all',
  '全部收起': 'Collapse all',
  '隐藏左栏': 'Hide sidebar',
  '隐藏详情': 'Hide details',
  '全屏浏览': 'Fullscreen',
  '全屏播放': 'Play fullscreen',
  '点击播放宣传片': 'Click to play the film',
  '点击 ▶ 开始收听': 'Click ▶ to listen',
  '点击进入全屏阅读': 'Open fullscreen reader',
  '点击人物卡片查看完整详情': 'Click a person card for full details',
  '数据来源：族谱管理后台最终数据（交付版基线）': 'Source: final genealogy management data (delivery baseline)',
  '族谱数据管理请通过后台管理系统进行操作。': 'Manage genealogy data through the administration system.',
  '族谱资料由管理后台统一维护。': 'Genealogy records are maintained through the administration system.',
  '请选择上册或下册': 'Choose the upper or lower volume',
  '上册': 'Upper Volume',
  '下册': 'Lower Volume',
  '电子族谱': 'Digital Genealogy',
  '查世系图': 'Lineage Charts',
  '查族人': 'Find a Person',
  '查世代': 'Find a Generation',
  '查关系': 'Find a Relationship',
  '亲缘关系查询': 'Relationship Search',
  '族谱统计': 'Genealogy Statistics',
  '高级搜索': 'Advanced Search',
  '出继入继一览表': 'Adoption and Inheritance Records',
  '世代时间轴': 'Generation Timeline',
  '支系筛选': 'Branch Filter',
  '世代筛选': 'Generation Filter',
  '全部支系': 'All branches',
  '全部性别': 'All genders',
  '全部状态': 'All statuses',
  '男': 'Male',
  '女': 'Female',
  '未标注': 'Not specified',
  '在世': 'Living',
  '已故': 'Deceased',
  '总人数': 'Total people',
  '在世成员': 'Living members',
  '全部成员': 'All members',
  '访问人数': 'Visitors',
  '背景音乐': 'Background music',
  '播放/暂停': 'Play/Pause',
  '音量+': 'Volume up',
  '音量-': 'Volume down',
  '放大': 'Zoom in',
  '缩小': 'Zoom out',
  '复位': 'Reset',
  '全景': 'Overview',
  '打印世系图': 'Print lineage chart',
  '返回世系选择': 'Back to lineage selection',
  '返回电子族谱': 'Back to digital genealogy',
  '浏览各类世系图': 'Browse lineage charts',
  '输入一个姓名，查看详情或寻根': 'Enter a name to view details or trace roots',
  '按一世或连续世次查看人员列表': 'View people by one or more generations',
  '查询两位族人的亲属称呼和关系路径': 'Find the kinship and relationship path between two people',
  '信息更新中': 'Information is being updated',
  '信息更新中，敬请期待': 'Information is being updated. Please check back soon.',
  '正在建设中...': 'Under construction…',
  '正在建设中…': 'Under construction…',
  '提交留言': 'Submit message',
  '意见反馈': 'Feedback',
  '寻亲求助': 'Find relatives',
  '投稿分享': 'Submit a story',
  '活动报名': 'Register for an event',
  '捐款咨询': 'Donation inquiry',
  '其他': 'Other',
  '姓名': 'Name',
  '联系电话': 'Phone',
  '联系方式': 'Contact details',
  '电子邮箱': 'Email',
  '在线留言': 'Message us',
  '友情链接': 'Related links',
  '捐款通道': 'Donations',
  '支持家族文化建设': 'Support family heritage projects',
  '宗祠修缮基金': 'Ancestral Hall Restoration Fund',
  '教育基金': 'Education Fund',
  '组织架构': 'Organization',
  '党员风采': 'Party member profiles',
  '大事记': 'Chronicle',
  '产业振兴': 'Industry revitalization',
  '村庄风貌': 'Village Landscape',
  '村庄故事': 'Village Stories',
  '家族故事': 'Family Stories',
  '听·下枫槎': 'Listen · Xiafengcha',
  '进入听下枫槎': 'Listen to Xiafengcha',
  '进入谢氏集萃': 'Open Xie Collection',
  '进入家族历史': 'Open Family History',
  '寻根问祖': 'Find Your Roots',
  '开始探索': 'Explore',
  '左右滑动选择入口，点击进入': 'Swipe to choose an entrance, then tap to enter',
  '已选择开始探索 · 点击进入': 'Explore selected · Tap to enter',
  '已选择寻根问祖 · 点击进入': 'Find Your Roots selected · Tap to enter',
  '一页族谱，': 'One genealogy,',
  '一座村庄，一脉家风': 'one village, one family legacy',
  '从这里开始，慢慢认识下枫槎谢氏。': 'Begin here and get to know the Xie family of Xiafengcha.',
  'ONE VILLAGE · ONE FAMILY': 'ONE VILLAGE · ONE FAMILY',
  '农历': 'Lunar ',
  '农历四月初十': 'Lunar fourth month, tenth day',
  '农历九月初九': 'Lunar ninth month, ninth day',
  '重阳节': 'Double Ninth Festival',
  '下枫槎村景': 'Xiafengcha village view',
  '下枫槎风光': 'Xiafengcha landscape',
  '宗祠全景': 'Ancestral Hall exterior',
  '宗祠内景': 'Ancestral Hall interior',
  '活动留影': 'Event photo',
  '宗祠作品一': 'Ancestral Hall artwork 1',
  '宗祠作品二': 'Ancestral Hall artwork 2',
  '宗祠作品三': 'Ancestral Hall artwork 3',
  '宗祠作品四': 'Ancestral Hall artwork 4',
  '新闻原文': 'News Source',
  '返回新闻报道': 'Back to News Reports',
  '打开原网站 ↗': 'Open Original Website ↗',
  '原文由来源网站提供；如页面未显示，请点击右上角“打开原网站”。': 'The source page is provided by the original website. If it does not load, click “Open Original Website” above.',
  '序章 · 村庄印象': 'Prologue · Village Impressions',
  '章节列表': 'Chapters',
  '音乐库': 'Music Library',
  '首': ' tracks',
  '暂停': 'Pause',
  '播放': 'Play',
  '清空': 'Clear',
  '管理员': 'Administrator',
  '退出登录': 'Log out',
  '验证身份': 'Verify identity',
  '管理员身份验证': 'Administrator Verification',
  '请输入管理员密码以进入后台管理': 'Enter the administrator password to access the dashboard',
  '密码错误，请重试': 'Incorrect password. Please try again.',
  '网站内容管理': 'Website Content Management',
  '系统设置': 'System Settings',
  '管理后台': 'Admin',
  '成员管理': 'Members',
  '族谱管理': 'Genealogy Management',
  '活动管理': 'Activities',
  '村荣誉管理': 'Village Honors',
  '新闻报道管理': 'News Reports',
  '照片管理': 'Photos',
  '视频管理': 'Videos',
  '留言管理': 'Messages',
  '访客管理': 'Visitors',
  '功德管理': 'Merit Records',
  '背景音乐': 'Background Music',
  '输入密码以查看族谱内容': 'Enter the password to view genealogy content',
  '请输入密码': 'Enter password',
  '← 返回新闻报道': '← Back to News Reports'
};

const EXTRA_TRANSLATION_ENTRIES = Object.keys(EXTRA_TRANSLATIONS).sort(function(a, b) {
  return b.length - a.length;
});

function translateString(value, lang) {
  if (lang !== 'en' || value === null || value === undefined) return value;
  var input = String(value);
  var trimmed = input.trim();
  if (!trimmed) return input;

  var exact = EXTRA_TRANSLATIONS[trimmed];
  if (!exact) {
    Object.keys(TRANSLATIONS).some(function(key) {
      var item = TRANSLATIONS[key];
      if (item && item.zh === trimmed && item.en) { exact = item.en; return true; }
      return false;
    });
  }
  if (exact) return input.replace(trimmed, exact);

  var output = input;
  EXTRA_TRANSLATION_ENTRIES.forEach(function(key) {
    if (key.length > 1 && output.indexOf(key) !== -1) output = output.split(key).join(EXTRA_TRANSLATIONS[key]);
  });
  Object.keys(TRANSLATIONS).forEach(function(key) {
    var item = TRANSLATIONS[key];
    if (item && item.zh && item.en && item.zh.length > 1 && output.indexOf(item.zh) !== -1) {
      output = output.split(item.zh).join(item.en);
    }
  });

  // Common numeric labels used by genealogy, archive and pagination views.
  output = output
    .replace(/第\s*(\d+)\s*[世代]/g, 'Generation $1')
    .replace(/第\s*(\d+)\s*页/g, 'Page $1')
    .replace(/共\s*(\d+)\s*人/g, '$1 people')
    .replace(/(\d+)\s*人/g, '$1 people')
    .replace(/第\s*(\d+)\s*张/g, 'Image $1')
    .replace(/(\d+)\s*条消息/g, '$1 messages')
    .replace(/(\d+)\s*件/g, '$1 items')
    .replace(/(\d+)\s*首/g, '$1 tracks')
    .replace(/世代/g, 'generations')
    .replace(/世系图/g, 'lineage chart')
    .replace(/世系/g, 'lineage')
    .replace(/支系/g, 'branch')
    .replace(/第([一二三四五六七八九十百零〇]+)世/g, 'Generation $1');

  // Strict English mode: no unmarked Chinese glyphs may remain on screen.
  return output.replace(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+/g, 'Family record');
}

function translateTextNode(node, lang) {
  if (!node || !node.nodeValue) return;
  var parent = node.parentElement;
  if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/i.test(parent.tagName)) return;
  if (lang === 'en') {
    if (node.__xieOriginalText === undefined) node.__xieOriginalText = node.nodeValue;
    var next = translateString(node.__xieOriginalText, lang);
    if (next !== node.nodeValue) node.nodeValue = next;
  } else if (node.__xieOriginalText !== undefined) {
    node.nodeValue = node.__xieOriginalText;
    delete node.__xieOriginalText;
  }
}

function translateElementAttributes(el, lang) {
  if (!el || el.nodeType !== 1 || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/i.test(el.tagName)) return;
  ['title', 'aria-label', 'placeholder', 'alt'].forEach(function(attr) {
    if (!el.hasAttribute(attr)) return;
    if (!el.__xieOriginalAttrs) el.__xieOriginalAttrs = {};
    if (el.__xieOriginalAttrs[attr] === undefined) el.__xieOriginalAttrs[attr] = el.getAttribute(attr);
    if (lang === 'en') el.setAttribute(attr, translateString(el.__xieOriginalAttrs[attr], lang));
    else {
      el.setAttribute(attr, el.__xieOriginalAttrs[attr]);
      delete el.__xieOriginalAttrs[attr];
    }
  });
}

function translateUnmarkedDocument(lang) {
  var walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
  var node;
  while ((node = walker.nextNode())) translateTextNode(node, lang);
  document.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(function(el) {
    translateElementAttributes(el, lang);
  });
}

var languageObserver = null;
function startLanguageObserver() {
  if (languageObserver || !window.MutationObserver) return;
  languageObserver = new MutationObserver(function(records) {
    if (getLang() !== 'en') return;
    ensureLanguageToggle();
    document.querySelectorAll('#lang-toggle, .language-toggle').forEach(function(toggle) {
      toggle.textContent = '中';
      toggle.classList.add('active');
    });
    records.forEach(function(record) {
      Array.prototype.forEach.call(record.addedNodes || [], function(node) {
        if (node.nodeType === 3) translateTextNode(node, 'en');
        else if (node.nodeType === 1) {
          var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          var child;
          while ((child = walker.nextNode())) translateTextNode(child, 'en');
          translateElementAttributes(node, 'en');
          node.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(function(el) {
            translateElementAttributes(el, 'en');
          });
        }
      });
    });
  });
  languageObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
}

function ensureLanguageToggle() {
  if (!document.getElementById('xie-language-style')) {
    var style = document.createElement('style');
    style.id = 'xie-language-style';
    style.textContent = '.site-language-toggle{position:fixed;top:14px;right:16px;z-index:2147483000;min-width:42px;height:32px;padding:0 10px;border:1px solid rgba(128,128,128,.35);border-radius:999px;background:rgba(255,255,255,.92);color:#26343c;font:600 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;box-shadow:0 5px 18px rgba(0,0,0,.12)}.site-language-toggle:hover,.site-language-toggle.active{color:#995b24;border-color:#995b24}[data-theme="dark"] .site-language-toggle{background:rgba(20,20,20,.94);color:#f2eee7}@media(max-width:768px){.site-language-toggle{top:10px;right:10px}}';
    document.head.appendChild(style);
  }
  var toggles = document.querySelectorAll('#lang-toggle, .language-toggle');
  var hasSidebarScript = Array.prototype.some.call(document.scripts || [], function(script) {
    return /(?:^|\/)sidebar\.js(?:\?|$)/.test(script.getAttribute('src') || '');
  });
  if (!toggles.length && document.body && !document.querySelector('.navhub-page') && !hasSidebarScript) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'site-language-toggle';
    btn.className = 'language-toggle site-language-toggle';
    btn.textContent = 'EN';
    btn.setAttribute('aria-label', 'Switch language');
    btn.title = 'Switch language';
    document.body.appendChild(btn);
  }
  document.querySelectorAll('#lang-toggle, .language-toggle').forEach(function(toggle) {
    toggle.classList.add('language-toggle');
    if (toggle.dataset.i18nBound === '1') return;
    toggle.dataset.i18nBound = '1';
    toggle.addEventListener('click', toggleLanguage);
  });
}

function getLang() {
  return localStorage.getItem('xie_lang') || 'zh';
}

function setLang(lang) {
  localStorage.setItem('xie_lang', lang);
}

function applyLanguage(lang) {
  lang = lang || getLang();
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  // Pages created before the keyed translation table may still have a plain
  // Chinese <title>. Preserve it once so switching back to Chinese is lossless.
  var titleRoot = document.documentElement;
  if (titleRoot.__xieOriginalTitle === undefined) titleRoot.__xieOriginalTitle = document.title;
  if (lang === 'en') document.title = translateString(titleRoot.__xieOriginalTitle, lang);
  else document.title = titleRoot.__xieOriginalTitle;
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

  // Update every language control, including the compact mobile opening-page control.
  ensureLanguageToggle();
  document.querySelectorAll('#lang-toggle, .language-toggle').forEach(function(toggle) {
    toggle.textContent = lang === 'en' ? '中' : 'EN';
    toggle.classList.toggle('active', lang === 'en');
    toggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : 'Switch to English');
    toggle.title = lang === 'en' ? 'Switch to Chinese' : 'Switch to English';
  });

  // Translate legacy/unmarked DOM and refresh page-specific dynamic widgets.
  translateUnmarkedDocument(lang);
  if (lang === 'en' && window.syncOpeningPageLanguage) window.syncOpeningPageLanguage();
  if (window.syncOpeningEntryLanguage) window.syncOpeningEntryLanguage();
  window.dispatchEvent(new CustomEvent('xie-language-change', { detail: { lang: lang } }));

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
      try { var c = JSON.parse(cache); descEl.textContent = translateString(c.condition, next); } catch(e) {}
    }
  }
  // Refresh location text
  var locEl = document.getElementById('weather-location');
  if (locEl) locEl.textContent = TRANSLATIONS['weather.location'][next] || '宁波宁海';
  if (window.syncOpeningPageLanguage) window.syncOpeningPageLanguage();
  if (window.syncOpeningEntryLanguage) window.syncOpeningEntryLanguage();
}

function initLanguage() {
  if (document.documentElement.dataset.i18nInitialized === '1') {
    ensureLanguageToggle();
    applyLanguage(getLang());
    return;
  }
  document.documentElement.dataset.i18nInitialized = '1';
  var lang = getLang();
  applyLanguage(lang);
  ensureLanguageToggle();
  startLanguageObserver();
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
  var lunarMonths = {
    '正月': 'the first lunar month', '二月': 'the second lunar month', '三月': 'the third lunar month',
    '四月': 'the fourth lunar month', '五月': 'the fifth lunar month', '六月': 'the sixth lunar month',
    '七月': 'the seventh lunar month', '八月': 'the eighth lunar month', '九月': 'the ninth lunar month',
    '十月': 'the tenth lunar month', '冬月': 'the eleventh lunar month', '腊月': 'the twelfth lunar month'
  };
  var lunarDays = {
    '初一': '1st', '初二': '2nd', '初三': '3rd', '初四': '4th', '初五': '5th', '初六': '6th', '初七': '7th', '初八': '8th', '初九': '9th', '初十': '10th',
    '十一': '11th', '十二': '12th', '十三': '13th', '十四': '14th', '十五': '15th', '十六': '16th', '十七': '17th', '十八': '18th', '十九': '19th', '二十': '20th',
    '廿一': '21st', '廿二': '22nd', '廿三': '23rd', '廿四': '24th', '廿五': '25th', '廿六': '26th', '廿七': '27th', '廿八': '28th', '廿九': '29th', '三十': '30th'
  };
  var lunarMatch = String(zhLunar || '').match(/^(正月|二月|三月|四月|五月|六月|七月|八月|九月|十月|冬月|腊月)(初一|初二|初三|初四|初五|初六|初七|初八|初九|初十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十|廿一|廿二|廿三|廿四|廿五|廿六|廿七|廿八|廿九|三十)$/);
  var enLunar = lunarMatch
    ? 'Lunar ' + lunarMonths[lunarMatch[1]] + ' ' + lunarDays[lunarMatch[2]]
    : 'Lunar date';

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

// i18n is also used by legacy standalone pages that do not load main.js.
// Initialize here so every public page gets the same language behavior.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguage);
} else {
  initLanguage();
}
