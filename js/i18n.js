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
  'nav.back': {
    zh: '返回导航页',
    en: 'Back to Navigation'
  },
  'nav.audio': { zh: '🎧 听下枫槎', en: '🎧 Listen to Xiafengcha' },
  'nav.player': { zh: '🎵 枫槎留声机', en: '🎵 Xiafengcha Music Player' },
  'nav.collection': { zh: '📚 谢氏集萃', en: '📚 Xie Collection' },

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

  // Mobile home / village introduction. These are full phrases rather than
  // word fragments so English mode never produces concatenated pseudo-English.
  'home.village.title': {
    zh: '绿水青山望府香',
    en: 'Green Mountains, Fragrant Wangfu Tea'
  },
  'home.village.location': {
    zh: '宁海县跃龙街道 · 下枫槎村',
    en: 'Xiafengcha Village, Yuelong Subdistrict, Ninghai'
  },
  'home.village.poem.title': {
    zh: '题下枫槎村',
    en: 'Inscription for Xiafengcha Village'
  },
  'home.village.poem.1': {
    zh: '面港北山一岭高，民贫土瘠尽萧条。',
    en: 'North of the harbor, a high ridge rises; poor soil once left the village bleak.'
  },
  'home.village.poem.2': {
    zh: '人心思变战天地，遂使茶香万里飘。',
    en: 'When people dared to change their world, the fragrance of tea began to travel far.'
  },
  'home.village.poem.author': {
    zh: '—— 王建慈',
    en: '—— Wang Jianci'
  },
  'home.village.p1': {
    zh: '白峤港畔、望府山下、枫槎岭口，有一个山青水绿、风景优美的村庄——下枫槎村。自明初王姓迁入以来，至今已有近650余年历史。全村共256户，居民726人，耕地210亩，茶园400余亩，山林2120亩。',
    en: 'By Baiqiao Harbor, beneath Wangfu Mountain and at the entrance to Fengcha Ridge lies Xiafengcha Village, a beautiful village of green mountains and clear water. Since the Wang family moved here in the early Ming dynasty, nearly 650 years have passed. The village has 256 households and 726 residents, with 210 mu of farmland, more than 400 mu of tea gardens, and 2,120 mu of woodland.'
  },
  'home.village.p2': {
    zh: '村庄背靠大山、面向大溪，境内鸟语茶香、溪流淙淙。望府楼山巍峨挺拔，屹立在南面；枫槎溪由南向北，贯穿全境。村内公路接通宁海至水车公路，枫槎岭隧道贯通后，北通宁海、南至一市，交通十分便捷。',
    en: 'The village faces a broad stream with mountains at its back; birdsong, tea fragrance and running water fill the landscape. Wangfulou Mountain stands tall to the south, while Fengcha Creek runs from south to north through the village. A local road connects with the Ninghai–Shuiche route, and the Fengcha Ridge Tunnel now provides convenient access north to Ninghai and south to Yishi.'
  },
  'home.village.p3': {
    zh: '改革开放以来，下枫槎村建设美丽乡村的步伐不断加快。建起了文化礼堂，修通了村道，办起了厂房，打响了"望府银毫"全国名茶的品牌。昔日的荒芜溪滩，如今盖起了一排排整齐划一的单体别墅，呈现出一片蓬勃发展、欣欣向荣的景象。',
    en: 'Since reform and opening up, Xiafengcha has steadily accelerated its development as a beautiful village. A cultural hall has been built, village roads improved, workshops established, and the nationally known Wangfu Yin Hao tea brand developed. Formerly barren stream banks now hold orderly rows of detached homes, reflecting a thriving and prosperous village.'
  },
  'home.stats.households': { zh: '户', en: 'Households' },
  'home.stats.people': { zh: '口人', en: 'Residents' },
  'home.stats.farmland': { zh: '亩耕地', en: 'Mu of farmland' },
  'home.stats.tea': { zh: '亩茶园', en: 'Mu of tea gardens' },
  'home.stats.forest': { zh: '亩山林', en: 'Mu of woodland' },
  'home.stats.history': { zh: '年历史', en: 'Years of history' },
  'home.audio.title': { zh: '听·下枫槎', en: 'Listen · Xiafengcha' },
  'home.audio.desc': { zh: '村庄故事 · 家族历史 · 名茶飘香', en: 'Village stories · Family history · Fragrant tea' },
  'stats.members': { zh: '族人', en: 'Family Members' },
  'stats.videos': { zh: '视频', en: 'Videos' },
  'stats.photos': { zh: '摄影', en: 'Photography' },
  'stats.honors': { zh: '荣誉', en: 'Honors' },
  'stats.news': { zh: '新闻', en: 'News' },
  'hero.marquee': {
    zh: '谢氏始祖诞辰倒计时 143天 15时 16分 08秒 — 农历九月初九 · 重阳节',
    en: 'Countdown to the Xie founding ancestor’s birthday: 143 days 15 hours 16 minutes 08 seconds — Ninth day of the ninth lunar month · Double Ninth Festival'
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
  // Full phrases must come before the short word entries below. They are
  // intentionally translated as a unit to preserve sentence meaning.
  'ShangTaoPang 正在工作中': 'ShangTaoPang is working',
  '历史线稿 · 今日村景': 'History in Lines · Village Today',
  '山水相依，': 'Where Mountains Meet Water,',
  '家园在此': 'Home Is Here',
  '远山、田野与村庄相望': 'Distant mountains, fields and village in view',
  '生活在继续': 'Life Goes On',
  '溪水、田野与村落相连': 'Streams, fields and village paths connected',
  '写着家园故事': 'Writing the Story of Home',
  '熟悉的风景，留住共同记忆': 'Familiar scenes, shared memories',
  '一笔一画，写着家园故事': 'Every line writes the story of home',
  '亭台、山色与树影相伴': 'Pavilions, mountain views and tree shadows',
  '日落之后，村庄仍有温度': 'After sunset, the village remains warm',
  '您是否下枫槎族人？': 'Are you a member of Xiafengcha?',
  '如果是谢氏族人，请登记信息加入': 'If you are an Xie family member, register to join',
  '如不是，可继续浏览网站': 'Otherwise, continue browsing the website',
  '✅ 我是族人，立即登记': '✅ I am a family member — register now',
  '暂不登记，继续浏览': 'Not now, continue browsing',
  '宁波宁海': 'Ninghai, Ningbo',
  '🎬 视频': '🎬 Videos',
  '📜 功德卷轴': '📜 Merit Scroll',
  '🎧 听下枫槎': '🎧 Listen to Xiafengcha',
  '🎵 枫槎留声机': '🎵 Xiafengcha Music Player',
  '📚 谢氏集萃': '📚 Xie Collection',
  '返回导航页': 'Back to Navigation',
  '旧时王谢堂前燕，飞入寻常百姓家': 'Swallows that once graced the halls of Wang and Xie now fly into the homes of common folk',
  '—— 唐 · 刘禹锡《乌衣巷》': '—— Liu Yuxi, Tang dynasty, “Black-clad Lane”',
  '乌衣世泽，宝树家声': 'The Xie legacy endures; the family name rings true',
  '—— 下枫槎谢氏家族楹联': '—— Couplets of the Xiafengcha Xie family',
  '枫槎谢氏宗谱 · 族谱查询': 'Xiafengcha Xie Genealogy · Genealogy Search',
  '枫槎谢氏宗谱': 'Xiafengcha Xie Genealogy',
  '族谱查询 · 只读世系图': 'Genealogy Search · Read-only Lineage Charts',
  '五项查询': 'Five Queries',
  '搜索人物': 'Search People',
  '展开主脉': 'Expand Main Line',
  '查询提示': 'Search Tips',
  '点击人物卡片查看完整详情；可使用搜索、筛选、全景、缩放和平移浏览世系图。族谱资料由管理后台统一维护。': 'Click a person card for full details. Use search, filters, overview, zoom and pan to browse the lineage chart. Genealogy records are maintained by the administration system.',
  '总览世系图': 'Lineage Overview',
  '复位图面': 'Reset Map',
  '标准': 'Standard',
  '⛶ 横屏全屏': '⛶ Landscape Fullscreen',
  '显示界面': 'Show Controls',
  '滚轮缩放 · 拖拽平移 · Esc 显示界面': 'Scroll to zoom · Drag to pan · Esc to show controls',
  '正在读取宗谱数据…': 'Reading genealogy data…',
  '加载中': 'Loading',
  '正在准备全屏阅读 · 手机端每次显示一页 · 默认最大化显示，可缩放和拖动；未自动横屏请手动旋转手机': 'Preparing fullscreen reading · One page at a time on mobile · Maximized by default; zoom and drag are supported · Rotate your phone if landscape mode does not start automatically',
  '族谱查询与统计': 'Genealogy Search & Statistics',
  '沿用本交付界面风格；查询结果可直接定位到中央世系图并高亮人物。': 'Search results can locate and highlight people directly on the central lineage chart.',
  '请选择上册或下册，手机端进入全屏单页阅读。': 'Choose the upper or lower volume for full-screen, one-page reading on mobile.',
  '按姓名查看原谱': 'Find an Original Record by Name',
  '输入姓名，选择查看世系信息或族人详情；系统只打开已明确标注的原谱页。': 'Enter a name, then choose lineage information or member details. Only explicitly indexed source pages are opened.',
  '手机端单页最大化阅读；可缩放，放大后可拖动查看细节。': 'Mobile reading opens one page at a time; zoom in and drag to inspect details.',
  '左页': 'Left Page',
  '右页': 'Right Page',
  '选择要查看的世系图': 'Choose a lineage chart',
  '远古世系图': 'Ancient Lineage Chart',
  '申伯世系图': 'Shenbo Lineage Chart',
  '始宁东山世系图': 'Shining Dongshan Lineage Chart',
  '临海下渡世系图': 'Linhai Xiadu Lineage Chart',
  '石马（下谢）世系图': 'Shima (Lower Xie) Lineage Chart',
  '第1—65世 · 10人': 'Generations 1–65 · 10 people',
  '第65—101世 · 55人': 'Generations 65–101 · 55 people',
  '第99—122世 · 50人': 'Generations 99–122 · 50 people',
  '第122—130世 · 23人': 'Generations 122–130 · 23 people',
  '第130—141世 · 63人': 'Generations 130–141 · 63 people',
  '起点：炎帝神农氏 · 点击查看本段世系': 'Starting point: Emperor Yan, Shennong · View this lineage segment',
  '起点：申伯 · 点击查看本段世系': 'Starting point: Shenbo · View this lineage segment',
  '起点：缵 · 点击查看本段世系': 'Starting point: Zan · View this lineage segment',
  '起点：闓 · 点击查看本段世系': 'Starting point: Kai · View this lineage segment',
  '起点：小四 · 点击查看本段世系': 'Starting point: Xiaosi · View this lineage segment',
  '文杲至文对/彬/乾世系图': 'Wengao to Wendui / Bin / Qian Lineage Chart',
  '文杲公 · 终至文对、彬、乾': 'Wengao · ending with Wendui, Bin and Qian',
  '起点：文杲 · 点击查看完整路径': 'Starting point: Wengao · View the complete path',
  '撰公派下文对世系': 'Wendui Lineage of Zhuan’s Branch',
  '起点：撰公 · 终至：文对': 'Starting point: Zhuan · Ending at: Wendui',
  '点击查看本支世系': 'View this branch lineage',
  '攒公派下乾公世系': 'Qian Lineage of Zan’s Branch',
  '起点：攒公 · 终至：乾公': 'Starting point: Zan · Ending at: Qian',
  '攒公派下彬公世系': 'Bin Lineage of Zan’s Branch',
  '起点：攒公 · 终至：彬公': 'Starting point: Zan · Ending at: Bin',
  '查第几世': 'Find a Generation',
  '查第几世到第几世': 'Find a Generation Range',
  '点击任一世代，筛选并定位该世代人物': 'Click any generation to filter and locate its people',
  '性别': 'Gender',
  '状态': 'Status',
  '查某人上下7代': 'View seven generations above and below a person',
  '在上方“查族人”中输入姓名并搜索，再点击结果中的“7代人”': 'Enter a name in “Find a Person” above, search, then click “Seven Generations” in the result',
  '第一个人': 'First person',
  '第二个人': 'Second person',
  '族人姓名': 'Member Name',
  '选择电子族谱': 'Choose Digital Genealogy',
  '上册 · 第 1 页': 'Upper Volume · Page 1',
  '同名人物会保留不同 ID，避免混淆': 'People with the same name keep different IDs to avoid confusion',
  '谱': 'Genealogy',
  '← 返回导航': '← Back to Navigation',
  '族谱统计': 'Genealogy Statistics',
  '现有记录、世代、性别及出继入继数据汇总。': 'Summary of current records, generations, gender and adoption/inheritance data.',
  '出继／入继核实': 'Adoption / Inheritance Cross-check',
  '以族谱管理后台主数据为准，逐组对应亲生父亲与承嗣父。': 'The administration system’s primary data is authoritative; each pair links the biological and adoptive fathers.',
  '高级搜索': 'Advanced Search',
  '姓名、字辈或族谱关键词': 'Name, generation character or genealogy keyword',
  '世代从': 'Generation from',
  '查询两位族人的亲属称呼和关系路径': 'Find the kinship term and relationship path between two members',
  '点击人物卡片': 'Click a person card',
  '这里会显示人物的完整资料、父母、配偶、子女、祖先路径和族谱记载。': 'Full details, parents, spouse, children, ancestor path and genealogy notes will appear here.',
  '请选择要查询的内容': 'Choose what to query',
  '浏览各类世系图': 'Browse lineage charts',
  '输入一个姓名，查看详情或寻根': 'Enter a name to view details or trace roots',
  '按一世或连续世次查看人员列表': 'View people by one or more generations',
  '查阅上册、下册原谱页面': 'Read source pages in the upper and lower volumes',
  '总导航': 'Main Navigation',
  '下枫槎村网站': 'Xiafengcha Village Website',
  '网站栏目': 'Website Sections',
  '返回下枫槎村网站首页': 'Return to the Xiafengcha Village home page',
  '村史沿革': 'Village History',
  '村庄历史与人文脉络': 'Village history and cultural heritage',
  '世系图、统计与亲缘查询': 'Lineage charts, statistics and relationship search',
  '山水、村貌与生活': 'Mountains, village scenes and daily life',
  '村务活动': 'Village Affairs & Activities',
  '村务动态与文化活动': 'Village updates and cultural activities',
  '村庄荣誉': 'Village Honors',
  '荣誉成果与发展印记': 'Honors, achievements and milestones',
  '影像资料': 'Visual Archive',
  '照片与珍贵影像': 'Photographs and archival footage',
  '联系与到访信息': 'Contact and visiting information',
  '原文 →': 'Original →',
  '暂无报道': 'No reports yet',
  '新闻原文': 'News Source',
  '原文查看 · 下枫槎谢氏': 'Original Source · Xie Family of Xiafengcha',
  '暂无消息，请关注后续更新': 'No news yet. Please check back for updates.',
  '最新消息': 'Latest News',
  '先看摘要，需要时再展开全文。': 'Read the summary first; expand the full story when needed.',
  '条消息': 'news items',
  '这个分类暂时没有消息。': 'No news in this category yet.',
  '家族消息': 'Family News',
  '村务通知、家族公告与重要动态，集中留存于此。': 'Village notices, family announcements and important updates are kept here.',
  '分享家族故事': 'Share a Family Story',
  '欢迎投稿文章、诗词、影像和村景记录。': 'Contribute articles, poetry, images and village-view records.',
  '联系投稿': 'Contact Us to Contribute',
  '消息全文': 'Full News Story',
  '下枫槎谢氏宗源记': 'Record of the Xie Family Origins at Xiafengcha',
  '点击展开阅读全文': 'Click to read the full story',
  '石马枫槎世系图': 'Shima–Fengcha Lineage Chart',
  '点击展开查看': 'Click to expand',
  '前枫槎（撰公派）': 'Former Fengcha (Zhuan branch)',
  '后枫槎（攒公派）': 'Later Fengcha (Zan branch)',
  '枫槎世 / 石马世': 'Fengcha generation / Shima generation',
  '小四 / 石马1世': 'Xiaosi / Shima Generation 1',
  '丹一 / 石马2世': 'Danyi / Shima Generation 2',
  '文杲 【枫槎1世 / 石马3世】': 'Wengao 【Fengcha Generation 1 / Shima Generation 3】',
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
  '关闭问候': 'Close greeting',
  '恢复小窗': 'Restore window',
  '全屏': 'Fullscreen',
  '还原 100%': 'Reset to 100%',
  '打开声音': 'Turn sound on',
  '静音': 'Mute',
  '返回族谱查询': 'Back to Genealogy',
  '全屏查看世系图': 'View lineage chart fullscreen',
  '出继／入继关系': 'Adoption / inheritance relationship',
  '出继 / 入继关系': 'Adoption / inheritance relationship',
  '出继 / 入继关系详图': 'Adoption / inheritance details',
  '出继 / 入继详情图': 'Adoption / inheritance details',
  '以下为该人物实际承嗣关系': 'This person\'s recorded adoption relationship',
  '同时显示亲生父亲、继父及两条世系关系线': 'Show the biological father, adoptive father and both lineage lines',
  '完整直线世系末端关系': 'The relationship at the end of the complete direct lineage',
  '亲生父系（出继记录）': 'Biological paternal line (out-adoption record)',
  '承嗣父系（入继记录）': 'Adoptive paternal line (in-adoption record)',
  '亲生父子': 'Biological father and son',
  '出继入嗣': 'Adoption as an heir',
  '出继给 / 入继为嗣 · 血缘0%': 'Given out / adopted as heir · 0% blood relation',
  '亲生父亲 · 血缘50%': 'Biological father · 50% blood relation',
  '承嗣父 · 血缘0%': 'Adoptive father · 0% blood relation',
  '出继 / 入继': 'Adoption / inheritance',
  '出继 / 入继关系图': 'Adoption / inheritance relationship chart',
  '完整出继 / 入继关系': 'Complete adoption / inheritance relationship',
  '家族血缘关系图': 'Family blood relationship chart',
  '与您血缘最近的': 'Closest blood relatives of you',
  '位族人': ' family members',
  '从炎帝神农氏到': 'From Emperor Yan, Shennong to',
  '的直系世系图': '\'s direct lineage chart',
  '的亲生父系世系图': '\'s biological paternal lineage chart',
  '的承嗣父系世系图': '\'s adoptive paternal lineage chart',
  '的完整出继 / 入继关系': '\'s complete adoption / inheritance relationship',
  '请从炎帝神农氏开始，呈现': 'Show the lineage from Emperor Yan, Shennong to ',
  '正在生成完整的出继 / 入继关系图…': 'Generating the complete adoption / inheritance chart…',
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
  '本站保存的报道内容': 'Archived report content',
  '后台新闻数据': 'Site news data',
  '以下内容来自本站后台保存的报道资料；右侧“打开原网站”可查看来源页面。': 'This content comes from the report saved in the site database. Use “Open Original Website” to view the source page.',
  '原文页面': 'Original source page',
  '发布人：': 'Published by: ',
  '这篇报道暂未保存正文。': 'The full report text has not been saved yet.',
  '链接无效': 'Invalid link',
  '没有找到有效的原文链接。': 'No valid source link was found.',
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
  ,
  // Collection library and shared dynamic labels. These are kept as complete
  // phrases because the values are often injected by page scripts after the
  // initial language pass.
  '📚 谢氏': '📚 Xie Family',
  '集萃': 'Collection',
  '汇集谢氏起源 · 历史名人 · 宗族文化': 'Xie origins · historical figures · clan culture',
  '项内容': 'items',
  '谢氏集萃内容统计': 'Xie Collection content summary',
  '家族起源': 'Family Origins',
  '家族事务': 'Family Affairs',
  '历史名人': 'Historical Figures',
  '宗谱文化': 'Genealogy Culture',
  '尚韬说': 'ShangTaoPang Talks',
  '本地': 'Local',
  'B站': 'Bilibili',
  '视频号': 'WeChat Channels',
  '公众号': 'WeChat Official Account',
  '本地视频': 'Local Video',
  '打开内容  ›': 'Open content  ›',
  '打开B站视频': 'Open Bilibili video',
  'B站视频播放器': 'Bilibili video player',
  '返回谢氏集萃': 'Back to Xie Collection',
  '← 返回集萃': '← Back to Collection',
  '谢氏集萃视频': 'Xie Collection video',
  '退出全屏': 'Exit Fullscreen',
  '⛶ 退出全屏': '⛶ Exit Fullscreen',
  '⛶ 全屏播放': '⛶ Play Fullscreen',
  '全屏播放': 'Play Fullscreen',
  '全屏': 'Fullscreen',
  '谢氏起源专题': 'Xie Origins Feature',
  '谢氏历史名人': 'Historical Figures of the Xie Family',
  '尚韬说 · 下枫槎谢氏（一）炎帝之后，一脉相承': 'ShangTaoPang Talks · Xie Family of Xiafengcha (1): Descendants of Emperor Yan, One Continuous Line',
  '← 返回导航页': '← Back to Navigation',
  '返回首页': 'Back Home',
  '返回网站首页': 'Return to Website Home',
  '族谱快捷入口': 'Genealogy Shortcuts',
  '唤起五项族谱查询': 'Open the five genealogy queries',
  '世系图控制区': 'Lineage chart controls',
  '世系图操作': 'Lineage chart controls',
  '姓名、字辈、事迹关键词': 'Name, generation character or achievement keyword',
  '拖动调整左侧控制栏宽度': 'Drag to resize the left control rail',
  '将世系图移回中央': 'Center the lineage chart',
  '世系图视图切换': 'Switch lineage chart view',
  '横屏全屏查看世系图': 'View the lineage chart in landscape fullscreen',
  '放大世系图': 'Zoom in on lineage chart',
  '缩小世系图': 'Zoom out on lineage chart',
  '可缩放、可滚动的树状世系图': 'Scrollable, zoomable lineage tree',
  '沉浸全景控制': 'Immersive overview controls',
  '拖动调整右侧详情栏宽度': 'Drag to resize the right details panel',
  '族谱统计、时间轴、高级搜索和亲缘关系查询': 'Genealogy statistics, timeline, advanced search and relationship search',
  '切换查询项目': 'Switch query section',
  '上册下册原谱电子书': 'Upper and lower genealogy volumes',
  '按姓名查看原谱页': 'Find an original page by name',
  '输入姓名，例如：明秀': 'Enter a name, for example: Mingxiu',
  '选择电子族谱册次': 'Choose a genealogy volume',
  '电子族谱缩放': 'Digital genealogy zoom controls',
  '复位到完整页面': 'Reset to full page',
  '关闭电子书': 'Close digital book',
  '原谱连续双页': 'Facing source pages',
  '点击左页翻到上一组双页': 'Click the left page for the previous spread',
  '左侧原始 PDF 页面': 'Original PDF page on the left',
  '上一组双页': 'Previous spread',
  '点击右页翻到下一组双页': 'Click the right page for the next spread',
  '右侧原始 PDF 页面': 'Original PDF page on the right',
  '下一组双页': 'Next spread',
  '选择世系图分区': 'Choose a lineage chart section',
  '按世次查询': 'Search by generation',
  '起始': 'Start',
  '结束': 'End',
  '例如：水财、入继、枫槎': 'For example: Shuicai, adoption, Xiafengcha',
  '查某人上下七代': 'View seven generations around a person',
  '输入姓名': 'Enter a name',
  '人物详情': 'Person details',
  '返回探索导航页': 'Back to Explore navigation',
  '关闭查询选项': 'Close query options',
  '关闭总导航': 'Close main navigation',
  '📹 本地视频': '📹 Local Video',
  '🎬 视频': '🎬 Videos',
  '🎵 背景音乐 · 开': '🎵 Background Music · On',
  '听 · 下枫槎': 'Listen · Xiafengcha',
  '下枫槎村 · AI 语音播报': 'Xiafengcha Village · AI voice guide',
  '🎵 望府楼山间 · 氛围音乐': '🎵 Wangfulou Mountain · Ambient Music',
  '点击开关 · 伴你聆听': 'Tap the switch · Listen along',
  '—— 暂无播放 ——': '—— Nothing playing ——',
  '请从下方选择歌曲': 'Choose a song below',
  '上一首': 'Previous track',
  '下一首': 'Next track',
  '返回新闻报道': 'Back to News Reports',
  '查看来源原文 →': 'View original source →',
  '关闭全文': 'Close full story',
  '日期待定': 'Date to be announced',
  '发布人：': 'Published by: ',
  '这条消息暂未添加摘要。': 'No summary has been added for this news item.',
  '这条消息暂未添加正文。': 'No full text has been added for this news item.',
  '消息分类': 'News categories',
  '消息说明': 'News information',
  '最新消息': 'Latest News',
  '先看摘要，需要时再展开全文。': 'Read the summary first; expand the full story when needed.',
  '消息全文': 'Full News Story',
  '这个分类暂时没有消息。': 'No news in this category yet.',
  '家族消息': 'Family News',
  '村务通知、家族公告与重要动态，集中留存于此。': 'Village notices, family announcements and important updates are kept here.',
  '分享家族故事': 'Share a Family Story',
  '欢迎投稿文章、诗词、影像和村景记录。': 'Contribute articles, poetry, images and village-view records.',
  '联系投稿': 'Contact Us to Contribute',
  '原文页面': 'Original Source Page',
  '原文查看 · 下枫槎谢氏': 'Original Source · Xie Family of Xiafengcha',
  '正在加载…': 'Loading…',
  '原文由来源网站提供；如页面未显示，请点击右上角“打开原网站”。': 'The source page is provided by the original website. If it does not load, click “Open Original Website” above.',
  '本站保存的报道内容': 'Archived Report Content',
  '后台新闻数据': 'Site News Data',
  '以下内容来自本站后台保存的报道资料；右侧“打开原网站”可查看来源页面。': 'This content comes from the report saved in the site database. Use “Open Original Website” to view the source page.',
  '没有找到有效的原文链接。': 'No valid source link was found.',
  '链接无效': 'Invalid link',
  '下枫槎村今日风貌：村组织架构、特色物产、村荣誉展示': 'Xiafengcha Village Today: Committee, Local Products and Village Honors'
  , '探索栏目 · 下枫槎谢氏': 'Explore Sections · Xie Family of Xiafengcha'
  , '探索栏目': 'Explore Sections'
  , '文': 'History'
  , '史': 'History'
  , '下枫槎 · 谢氏家族': 'Xiafengcha · Xie Family'
  , '谢氏家族': 'Xie Family'
  , '从谢氏源流、迁徙脉络，到下枫槎村的家族记忆。': 'From Xie origins and migration routes to the family memories of Xiafengcha Village.'
  , '了解家族从哪里来，也看看我们如何走到今天。': 'Learn where the family came from and how we arrived at today.'
  , '下枫槎 · 山水画卷 — 宁海谢氏家族': 'Xiafengcha · A Landscape Scroll — Ninghai Xie Family'
  , '📜 历史': '📜 History'
  , '🏆 名人': '🏆 Notable Figures'
  , '✦ 主站': '✦ Main Site'
  , '📸 今日': '📸 Today'
  , '🎪 活动': '🎪 Activities'
  , '宁海·下枫槎·谢氏': 'Ninghai · Xiafengcha · Xie Family'
  , '帷幕徐启，流光穿隙': 'The curtain rises; light slips through the gaps'
  , '穿越光影之门': 'Step through the Door of Light and Shadow'
  , '✦ 探索下枫槎': '✦ Explore Xiafengcha'
  , '👤 开发者': '👤 Developer'
  , '✦ 进入主站': '✦ Enter Main Site'
  , '乌衣世泽 · 宝树家声': 'The Xie legacy endures · The family name rings true'
  , '双指缩放 · 拖动浏览': 'Pinch to zoom · Drag to browse'
  , '或使用管理员手机号快捷进入': 'Or use the administrator phone number for quick access'
  , '手机号快捷登录': 'Quick login by phone'
  , '◀ 后台菜单': '◀ Admin menu'
  , '族谱管理后台': 'Genealogy administration'
  , '入赘婚配': 'Matrilineal marriage'
  , '宗祠轮播管理': 'Ancestral hall carousel'
  , '谢氏世系树': 'Xie Family Lineage Tree'
  , '📋 查看全部世系': '📋 View Full Lineage'
  , '影像记忆 · 下枫槎谢氏': 'Visual Memories · Xie Family of Xiafengcha'
  , '📷 影像': '📷 Media'
  , '📷 家族影像': '📷 Family Media'
  , '镜头记录 · 时光印记': 'Through the lens · Imprints of time'
  , '荣耀时刻 · 砥砺前行': 'Moments of Honor · Moving Forward'
  , '世系图谱 · 下枫槎谢氏': 'Lineage Charts · Xie Family of Xiafengcha'
  , '点击姓名查看详情 · ⛶ 可全屏横屏': 'Click a name for details · ⛶ Fullscreen landscape view'
  , '🌳 世系图谱': '🌳 Lineage Charts'
  , '🌳 世系树': '🌳 Lineage Tree'
  , '⛶ 横屏': '⛶ Landscape'
  , '☗ 全貌': '☗ Overview'
  , '📥 导出': '📥 Export'
  , '分支：': 'Branch: '
  , '连续完整世系（炎帝→后枫槎）': 'Complete lineage (Emperor Yan → Later Fengcha)'
  , '全世系总览（炎帝→现在）': 'Full lineage overview (Emperor Yan → present)'
  , '远古世系': 'Ancient lineage'
  , '申伯世系': 'Shenbo lineage'
  , '始宁东山世系': 'Shining Dongshan lineage'
  , '临海下渡世系': 'Linhai Xiadu lineage'
  , '石马（下谢）分房派': 'Shima (Lower Xie) branch families'
  , '本宗世系图（后枫槎）': 'Main clan lineage chart (Later Fengcha)'
  , '页面已取消 · 下枫槎谢氏': 'Page discontinued · Xie Family of Xiafengcha'
  , '成员页面已取消': 'Member page discontinued'
  , '网站已统一使用“族谱查询”查阅族人、世系与人物资料。': 'Use “Genealogy” throughout the website to browse members, lineages and profiles.'
  , '进入族谱查询': 'Open Genealogy'
  , '下枫槎功德卷': 'Xiafengcha Merit Scroll'
  , '凡捐资修谱建祠者 · 勒名于斯 · 永志不忘': 'Those who support genealogy and ancestral-hall restoration · Their names are recorded here · Never forgotten'
  , '★ 大功德主 ★': '★ Major Benefactors ★'
  , '2026年农历四月初一 · 圆谱庆典捐（筹）款': 'First day of the fourth lunar month, 2026 · Genealogy completion ceremony contributions'
  , '一 · 族人捐款名单': '1 · Family member donations'
  , '65人 · 59.17万': '65 people · RMB 591,700'
  , '二 · 族人筹款名单': '2 · Family member fundraising'
  , '142人 · 25.7万': '142 people · RMB 257,000'
  , '三 · 外来宗亲助款名单': '3 · Donations from visiting relatives'
  , '143人 · 18.25万': '143 people · RMB 182,500'
  , '四 · 社会各界（宗族）助款名单': '4 · Donations from the wider community and clans'
  , '16个单位 · 18.9万': '16 organizations · RMB 189,000'
  , '2025年 · 宗祠修缮捐款': '2025 · Ancestral hall restoration donations'
  , '宗祠修缮捐款名单': 'Ancestral hall restoration donors'
  , '4人 · 10.7万': '4 people · RMB 107,000'
  , '功德序': 'Merit Scroll Preface'
  , '晋文靖公安石公': 'Xie An, Duke Wenjing of Jin'
  , '深甫公': 'Duke Shenfu'
  , '文杲公': 'Duke Wengao'
  , '彬、乾二公': 'Dukes Bin and Qian'
  , '昌苗公': 'Duke Changmiao'
  , '世忠、行龙': 'Shizhong and Xinglong'
  , '伟中、行勇': 'Weizhong and Xingyong'
  , '令昂公': 'Duke Lingang'
  , '↺ 重播': '↺ Replay'
  , '下枫槎谢氏 · 数字宗祠宣传片': 'Xiafengcha Xie Family · Digital Ancestral Hall Film'
  , '数字宗祠': 'Digital Ancestral Hall'
  , '序幕': 'Opening'
  , '数据恢复': 'Data Recovery'
  , '🛟 族谱数据恢复工具': '🛟 Genealogy Data Recovery Tool'
  , '这个页面会尝试从你的浏览器中找回丢失的族谱数据。': 'This page will try to recover lost genealogy data from your browser.'
  , '🔍 检查 localStorage 数据': '🔍 Check localStorage data'
  , '📤 发送到服务器恢复': '📤 Send to server for recovery'
  , '视频 · 下枫槎谢氏': 'Videos · Xie Family of Xiafengcha'
  , '石马枫槎世系 · 小四→丹一→文杲→彬/乾': 'Shima–Fengcha Lineage · Xiaosi → Danyi → Wengao → Bin/Qian'
  , '🌳 石马枫槎世系': '🌳 Shima–Fengcha Lineage'
  , '小四 → 丹一 → 文杲 → 彬/乾 直系脉络': 'Direct line from Xiaosi → Danyi → Wengao → Bin/Qian'
};

// Generated from the currently published legacy page text with a real
// zh-CN → en translation pass. These complete phrases are applied after the
// hand-written shared vocabulary so long paragraphs are never split into
// misleading fragments.
const GENERATED_PAGE_TRANSLATIONS = {
  "下枫槎·谢氏": "Xia Fengcha·Xie",
  "宁海 · 乌衣世泽 宝树家声": "Ninghai · Wuyi Shize Baoshu Jiasheng",
  "您是下枫槎村谢氏族人吗？": "Are you a member of the Xie clan in Xia Fengcha Village?",
  "暂时离线 · 下枫槎谢氏": "Temporarily offline · Xia Fengcha Xie",
  "当前暂时离线": "Currently offline",
  "网络恢复后可以重新打开页面。已缓存的首页资源仍可继续使用。": "The page can be reopened after the network is restored. Cached homepage resources can still be used.",
  "返回数字宗祠首页": "Return to the homepage of Digital Ancestral Hall",
  "古代先贤": "ancient sages",
  "下枫槎先祖": "Ancestors of Xia Fengcha",
  "近代名人": "modern celebrities",
  "现代名人": "modern celebrity",
  "谢尚公（308-357）": "Xie Shanggong (308-357)",
  "东晋 · 名将 · 镇西将军": "Eastern Jin · Famous General · General Zhenxi",
  "字仁祖，谢鲲之子，谢安从兄。东晋名将，官至豫州刺史、镇西将军。不仅长于军事，亦精通音律、善书法，时人有\"谢尚善音乐\"之誉。永和年间率军北伐，收复洛阳，威震中原。其才略气度，为东晋名臣之翘楚。": "Named Renzu, son of Xie Kun and brother of Xie Ancong. A famous general in the Eastern Jin Dynasty, he served as governor of Yuzhou and general of Zhenxi. Not only was he good at military affairs, he was also proficient in music and calligraphy. At that time, he was known as \"Xie Shang is good at music\". During the Yonghe period, he led his army in the Northern Expedition and regained Luoyang, which shocked the Central Plains. His talent, strategy and magnanimity made him the leader among famous officials in the Eastern Jin Dynasty.",
  "东晋 · 政治家 · 军事家": "Eastern Jin Dynasty · Politician · Military Strategist",
  "字安石，陈郡阳夏人。东晋著名政治家、军事家，官至宰相。太元八年（383年），前秦苻坚率百万大军南侵，谢安临危受命，以征讨大都督身份坐镇建康，运筹帷幄，以八万北府兵大破秦军于淝水，创造了中国军事史上以少胜多的经典战例。谢安性情温和，风雅飘逸，\"东山再起\"的典故流传千古。谢氏家族因谢安而达到鼎盛，与王氏并称\"王谢\"。": "The courtesy name is Anshi, a native of Yangxia, Chenjun County. A famous politician and military strategist in the Eastern Jin Dynasty, he served as prime minister. In the eighth year of Taiyuan (383), Fu Jian of the former Qin Dynasty led a million-strong army to invade the south. Xie An was ordered to face the danger and sat in Jiankang as the governor of the expedition. He strategized and defeated the Qin army at Feishui with 80,000 Beifu troops, creating a classic example in Chinese military history of defeating more with less. Xie An had a gentle temperament, was elegant and graceful, and the allusion of \"making a comeback\" has been passed down through the ages. The Xie family reached its peak due to Xie An, and was called \"Wang Xie\" together with the Wang family.",
  "东晋 · 名将": "Eastern Jin · Famous Generals",
  "字幼度，谢安之侄。东晋名将，以擅长治军著称。组建北府兵，训练精锐。淝水之战中，谢玄担任前锋都督，率北府兵奋勇杀敌，大破前秦军队。战后因功封康乐公。谢玄治军严谨，爱护士卒，深得军心，是东晋中期最重要的军事将领之一。": "Named Youdu, Xie An's nephew. A famous general in the Eastern Jin Dynasty, he was famous for his ability to manage the army. Establish Beifu soldiers and train elites. During the Battle of Feishui, Xie Xuan served as the forward commander and led the Beifu soldiers to fight bravely against the enemy and defeat the former Qin army. After the war, he was granted the title of Duke Kang Le due to his meritorious service. Xie Xuan was rigorous in running the army, loved his soldiers, and won the hearts of the soldiers. He was one of the most important military generals in the middle of the Eastern Jin Dynasty.",
  "南朝宋 · 诗人": "Southern Song Dynasty·Poet",
  "谢玄之孙，袭封康乐公。中国山水诗派的开创者，其诗作以描绘自然山水见长，语言精丽，意境深远。代表作有《登池上楼》《石壁精舍还湖中作》等。曾任永嘉太守，在任期间寄情山水，创作了大量山水诗篇。谢灵运以其文学成就对后世诗歌发展产生了深远影响，被誉为\"山水诗祖\"。": "Xie Xuan's grandson was granted the title of Duke Kang Le. The founder of the Chinese landscape poetry school, his poems are famous for depicting natural landscapes, with exquisite language and profound artistic conception. His representative works include \"Climbing the Pond and Going Up the Tower\" and \"Returning the Stone-walled Jingshe to the Lake\", etc. He once served as the prefect of Yongjia. During his tenure, he was deeply attached to the landscape and wrote a large number of landscape poems. Xie Lingyun's literary achievements have had a profound impact on the development of poetry in later generations, and he is known as the \"ancestor of landscape poetry\".",
  "谢枋得（1226-1289）": "Xie Fangde (1226-1289)",
  "南宋 · 文学家 · 爱国志士": "Southern Song Dynasty · Writer · Patriot",
  "字君直，号叠山。南宋末年著名文学家、爱国诗人。与文天祥同年进士，曾任江东制置使。元军南侵时，谢枋得率军抗元，兵败后隐居福建，誓不仕元。后被元朝强征至大都，绝食而死，以身殉国。其《叠山集》流传后世，民族气节令人敬仰。": "The courtesy name is Junzhi and the nickname is Dieshan. A famous writer and patriotic poet in the late Southern Song Dynasty. He was a Jinshi in the same year as Wen Tianxiang and served as the envoy of Jiangdong. When the Yuan army invaded the south, Xie Fangde led his army to fight against the Yuan Dynasty. After his defeat, he lived in seclusion in Fujian and vowed not to serve in the Yuan Dynasty. Later, he was forced to Dadu by the Yuan Dynasty, where he went on a hunger strike and died for his country. His \"Dieshan Collection\" has been passed down to later generations, and his national integrity is admirable.",
  "下枫槎谢氏先祖": "Ancestor of the Xie family in Xia Fengcha",
  "申伯（西周）": "Shen Bo (Western Zhou Dynasty)",
  "谢姓得姓始祖 · 约前827年": "The ancestor of the surname Xie · About 827 BC",
  "申伯，周宣王母舅，被封于谢邑（今河南南阳），建立谢国。子孙以国为氏，为谢氏得姓之始。距今已两千八百余年。": "Shen Bo, the maternal uncle of King Xuan of Zhou, was granted the title of Xie Yi (now Nanyang, Henan Province) and established the Xie State. The descendants took the country as their surname, which was the beginning of the Xie family name. It has been more than 2,800 years ago.",
  "小四公（宋）": "Xiao Sigong (Song Dynasty)",
  "石马始祖 · 宋靖康年间": "The ancestor of the stone horse·Jingkang period of Song Dynasty",
  "小四公，会稽人，宋靖康年间迁居石马（今三门），为下枫槎谢氏之直系近祖。": "Xiao Sigong, a native of Kuaiji, moved to Shima (now Sanmen) during the Jingkang period of the Song Dynasty. He is the direct ancestor of the Xie family in Xia Fengcha.",
  "文杲公（北宋）": "Duke Wen Gao (Northern Song Dynasty)",
  "枫槎始迁祖 · 约1125年": "Fengcha first moved to its ancestors · About 1125",
  "文杲公，字克源，北宋宣和年间（约1125年）任越溪司巡检，始居岩下，为枫槎谢氏之始迁祖。至今近九百载，传三十六世。": "Wen Gaogong, whose courtesy name was Keyuan, served as an inspector of the Yuexi Division during the Xuanhe period of the Northern Song Dynasty (about 1125) and first lived at Yanxia. He was the first ancestor of the Xie family in Fengcha. It has lasted nearly nine hundred years and has been passed down to thirty-six generations.",
  "撰公（北宋）": "Zhuan Gong (Northern Song Dynasty)",
  "前枫槎始祖 · 枫槎二世": "Former Fengcha Ancestor · Fengcha II",
  "撰公，文杲公之子，枫槎二世祖。与弟攒公分居前枫槎，为前枫槎谢氏之始。自此一支繁衍，枝分派衍，开前枫槎一脉之基业。": "Zhuan Gong, the son of Wen Gao Gong, the second ancestor of Fengcha. He and his younger brother Changong separated and lived in Qianfengcha, which was the beginning of the Xie family in Qianfengcha. Since then, one branch has multiplied, and branches have spread, and the foundation of the Qianfengcha lineage has been established.",
  "攒公（北宋）": "Lord Chan (Northern Song Dynasty)",
  "后枫槎始祖 · 枫槎二世": "The ancestor of Hou Fengcha · Fengcha II",
  "攒公，文杲公之子，枫槎二世祖。与兄撰公分居后枫槎，为后枫槎谢氏之始。自此一支繁衍，枝分派衍，开后枫槎一脉之基业。": "Cuan Gong, the son of Wen Gao Gong, the second ancestor of Fengcha. He and his brother Zhuan Gong separated and lived in Hou Fengcha, which was the beginning of the Xie family in Hou Fengcha. From then on, one branch multiplied, the branches spread out, and the foundation of Fengcha lineage was established.",
  "谢深甫（1139-1204）": "Xie Shenfu (1139-1204)",
  "南宋 · 右丞相 · 申国公": "Southern Song Dynasty · Prime Minister You · Duke Shen",
  "南宋名相，历仕孝宗、光宗、宁宗三朝，官至右丞相，封申国公，赠太傅，谥\"惠正\"。秉公持正，以才略见称。其孙女谢道清为宋理宗皇后。下枫槎谢氏之直系先祖，谱载第126世，名相封鲁王。": "He was a famous prime minister in the Southern Song Dynasty and served in three dynasties: Xiaozong, Guangzong and Ningzong. He rose to the rank of Prime Minister You, was granted the title of Duke of Shen, was given as a gift to Taifu, and was given the posthumous title of \"Huizheng\". He is impartial and upright and is known for his talents. His granddaughter Xie Daoqing became Queen Lizong of Song Dynasty. The direct ancestor of the Xie family in Xia Fengcha, the 126th generation in the genealogy, was named Prime Minister of Lu.",
  "彬公（明）": "Bin Gong (Ming Dynasty)",
  "下枫槎开基祖 · 1572年": "Xia Fengcha Kaijizu · 1572",
  "彬公，与兄乾公昆仲，明隆庆壬申年（1572年），山洪暴发，率族迁于双枫古槎之下，开基立业。": "Bin Gong, together with his brother Gan Gong Kunzhong, led their clan to move under the ancient Shuangfeng tree in the Renshen year of Longqing in the Ming Dynasty (1572) when a flash flood broke out.",
  "乾公（明）": "Qian Gong (Ming Dynasty)",
  "乾公，与弟彬公昆仲，明隆庆壬申年（1572年），山洪暴发，率族迁于双枫古槎之下，开基立业。": "Qian Gong, together with his younger brother Bin Gong Kunzhong, led their clan to move under the ancient Shuangfeng tree in the Renshen year of Longqing in the Ming Dynasty (1572) when a flash flood broke out.",
  "谢学良": "Xie Xueliang",
  "辛亥革命英烈 · 为国立功": "Heroes of the Revolution of 1911·Served the country",
  "下枫槎谢氏英烈。浙江陆军第一师士兵，在辛亥革命光复杭州、南京的战斗中英勇作战，为国捐躯。民国四年（1915），浙江陆军第一师师长叶颂清题字颁发\"为国立功\"匾额，今藏于下枫槎谢家祠堂。": "The heroic Xie family descends from Fengcha. Soldiers of the First Division of the Zhejiang Army fought bravely and sacrificed their lives for the country in the battles to regain Hangzhou and Nanjing during the Revolution of 1911. In the fourth year of the Republic of China (1915), Ye Songqing, commander of the First Division of the Zhejiang Army, inscribed and issued a plaque with the words \"Serving the Country\", which is now hidden in the Xie Family Ancestral Hall in Xia Fengcha.",
  "谢琳芳": "Xie Linfang",
  "上海知青 · 下枫槎大队党支部书记 · 共青团宁波地委书记": "Shanghai Educated Youth·Secretary of the Party Branch of Xia Fengcha Brigade·Secretary of the Ningbo Prefectural Committee of the Communist Youth League",
  "上海知青，下放下枫槎。率民开荒种茶，扩茶地至二百余亩，为名茶\"望府银毫\"奠基。由大队支书累迁共青团宁波地委书记、团省委常委，心系故土，与乡亲同劳。一九七二年，《解放日报》以《三门湾畔向阳花》为题报道，遂成全国知青楷模。": "The educated youth of Shanghai put down Fengcha. He led the people to open up wasteland and plant tea, expanded the tea land to more than 200 acres, and laid the foundation for the famous tea \"Wangfu Yinhao\". From the brigade secretary to the Ningbo Prefectural Committee secretary of the Communist Youth League and member of the Standing Committee of the Youth League Provincial Committee, he cares about his homeland and works together with his fellow villagers. In 1972, the \"Liberation Daily\" reported on \"Sunflowers by Sanmen Bay\" and became a model for educated youth across the country.",
  "谢幸福": "Xie Xingfu",
  "中共党员 · 中国人民银行宁海县支行行长": "Member of the Communist Party of China·President of Ninghai County Branch of the People's Bank of China",
  "曾任中国人民银行宁海县支行行长。秉公尽职，为国理财，热心家族公益，助力宗祠修缮与谱事，亦为阖族之荣光。": "He once served as the president of Ninghai County Branch of the People's Bank of China. He performed his duties impartially, managed the country's finances, was enthusiastic about family welfare, and assisted in the repair of the ancestral hall and the memorial service, which was also the glory of the family.",
  "谢世忠": "Xie Shizhong",
  "中共党员 · 企业家 · 修谱编修": "Member of the Communist Party of China·Entrepreneur·Compiler and editor of genealogy",
  "中共党员，白手起家，从商办企，心系桑梓，倾力修建宗祠，资助文化礼堂。本届修谱，担道义，任编修，洵德孝之人也。": "A member of the Communist Party of China, he started from scratch and started a business. He cared about his family and devoted himself to building ancestral halls and funding cultural halls. This year's revision of the genealogy is responsible for morality and righteousness. I am responsible for editing and editing. I am a person of virtue and filial piety.",
  "谢行龙": "Xie Xinglong",
  "中共党员 · 浙大MBA · 宁波市优秀企业家": "Member of the Communist Party of China · MBA from Zhejiang University · Outstanding Entrepreneur of Ningbo City",
  "中共党员，浙大MBA，宁波市优秀企业家。历任四届村长，建文化礼堂，捐资奉献，敬祖尊宗，功德流芳。": "Member of the Communist Party of China, MBA from Zhejiang University, and outstanding entrepreneur in Ningbo City. He has served as village chief for four terms, built a cultural hall, donated money and dedicated money, respected his ancestors, and his merits will last forever.",
  "谢海港": "Xie Haigang",
  "中共党员 · 家族公益热心人": "Member of the Communist Party of China · Family philanthropist",
  "中共党员，虽非大富，但格局大、热心肠。村里修宗祠、建文化礼堂，他出钱出力，跑前跑后从不推辞。做事不计较个人得失，重情义、讲奉献。哪里有需要，他第一个上；哪里要募资，他倾力支持。这种胸怀，值得全族学习，也为后代树了好榜样。": "Although members of the Communist Party of China are not rich, they are big-hearted and warm-hearted. He contributed money and effort to build ancestral halls and cultural halls in the village, and never declined. Don't care about personal gains and losses when doing things, value friendship and dedication. Wherever there was a need, he was the first to go; wherever there was a need to raise funds, he gave his full support. This kind of mind is worth learning from the whole clan and sets a good example for future generations.",
  "王家福": "Wang Jiafu",
  "全国名茶创始人 · 市人大代表": "Founder of National Famous Tea · Municipal People’s Congress Representative",
  "曾任下枫槎村党支部副书记、书记。1984年毅然抛弃铁饭碗回乡承包茶场，创办\"望府茶业有限公司\"，注册\"望府银毫\"商标。1989年\"望府银毫\"荣登全国名茶宝座，成为宁波市第一只全国名茶。连续当选宁波市十二、十三、十四届人大代表。": "He once served as deputy secretary and secretary of the Party branch of Xiafengcha Village. In 1984, he resolutely gave up his iron job and returned to his hometown to contract tea farms, founded \"Wangfu Tea Co., Ltd.\" and registered the trademark \"Wangfu Yinhao\". In 1989, \"Wangfu Yinhao\" topped the list of national famous teas, becoming the first nationally famous tea in Ningbo City. He was successively elected as a representative of the 12th, 13th and 14th Ningbo Municipal People’s Congress.",
  "王茂强": "Wang Maoqiang",
  "浙江名红茶之父 · 市杰出青年": "Father of Zhejiang Famous Black Tea · Outstanding Youth of the City",
  "中共党员，浙江工业大学毕业，2005年辞去工作接过父亲担子担任望府茶业有限公司总经理。2010年成功推出\"望府金毫\"获国际金奖，2018年获\"浙江名红茶\"称号，为全市唯一。被评为宁波市十大杰出农村青年、宁海县十大杰出青年。": "A member of the Communist Party of China and a graduate of Zhejiang University of Technology, he resigned from his job in 2005 and took over his father's responsibilities as the general manager of Wangfu Tea Co., Ltd. In 2010, it successfully launched \"Wangfu Jinhao\" and won the international gold medal. In 2018, it won the title of \"Zhejiang Famous Black Tea\", the only one in the city. He was named one of the top ten outstanding rural youths in Ningbo City and one of the top ten outstanding youths in Ninghai County.",
  "陈令昂": "Chen Lingang",
  "宗源考证 · 大德之人": "Origin research · A man of great virtue",
  "宁海桃源街道陈家岙村人。悯下枫槎谢氏族谱源流湮没，自73岁起以十年之功（2016-2026）遍访临海、宁海、天台诸邑，考证出下枫槎谢氏与东门陈氏实同宗同族，俱出自丹一公脉下。其考证成果为谢氏圆谱大典提供了正本清源的世系依据。年八十三终成其事，阖族感泣。": "A native of Chenjia'ao Village, Taoyuan Street, Ninghai. The genealogy of the Xie family in Xia Fengcha was lost. Since the age of 73, he has spent ten years (2016-2026) visiting Linhai, Ninghai, and Tiantai towns, and found out that the Xie family in Xia Fengcha and the Chen family in Dongmen are actually from the same ancestry and are descended from the Danyigong lineage. Its research results provide the original and clear lineage basis for Xie's round spectrum. It finally happened at the age of eighty-three, and the whole family wept.",
  "2026 宁海下枫槎村谢氏家族 · 数字宗祠": "2026 Xiafengcha Village, Ninghai · Xie Family · Digital Ancestral Hall",
  "&copy; 2026 宁海下枫槎村谢氏家族 · 数字宗祠": "© 2026 Xie Family of Fengcha Village, Ninghai · Digital Ancestral Hall",
  "登记 · 下枫槎谢氏": "Register · Xia Fengcha Xie",
  "📋 访客登记": "📋 Visitor registration",
  "欢迎来到下枫槎村数字宗祠": "Welcome to Ha Fengcha Village Digital Ancestral Hall",
  "您是否是下枫槎谢氏族人？": "Are you a member of the Xia Fengcha clan?",
  "✅ 是，我是族人": "✅ Yes, I am a tribesman",
  "👤 访客参观": "👤Visitor visit",
  "姓名 *": "Name *",
  "字辈 / 世代": "generation/generation",
  "父亲姓名": "Father's name",
  "所属分支": "Branch",
  "请选择": "Please select",
  "大房": "big room",
  "二房": "Second bedroom",
  "三房": "three bedrooms",
  "四房": "four bedrooms",
  "未知": "unknown",
  "微信号": "WeChat ID",
  "来访目的": "Purpose of visit",
  "提交登记": "Submit registration",
  "信息仅用于宗祠联络，不会公开": "The information is only used for ancestral contact and will not be made public.",
  "下枫槎村两委组织体系": "The organizational system of the two committees of Xia Fengcha Village",
  "中共下枫槎村支部委员会": "Xiafengcha Village Branch Committee of the Communist Party of China",
  "党支部": "Party branch",
  "村党支部书记": "Village Party Branch Secretary",
  "主持全面工作": "Preside over comprehensive work",
  "村民委员会": "village committee",
  "村委会": "village committee",
  "村委会主任（村长）": "Village committee director (village chief)",
  "村务行政全面管理": "Comprehensive management of village affairs administration",
  "村党支部副书记": "Deputy Secretary of the Village Party Branch",
  "协助书记工作": "Assist secretary in work",
  "村委会副主任（副村长）": "Deputy Director of the Village Committee (Deputy Village Chief)",
  "分管专项工作": "In charge of special work",
  "组织委员": "Organization Committee",
  "党建·组织": "Party Building·Organization",
  "宣传委员": "Publicity Committee",
  "宣传·文化": "Publicity·Culture",
  "纪检委员": "Discipline Inspection Committee",
  "纪律·监督": "Discipline·Supervision",
  "治保主任": "Security Officer",
  "治安·调解": "Public Security·Mediation",
  "妇女主任": "Women's Director",
  "妇女·计生": "Women·Family Planning",
  "民兵连长": "militia company commander",
  "民兵·应急": "Militia·Emergency",
  "村会计": "Village Accountant",
  "财务·统计": "Finance·Statistics",
  "村民代表": "village representative",
  "民意·议事": "Public opinion·Deliberation",
  "村委会成员": "Village committee member",
  "下枫槎村第十一届村委会成员": "Member of the 11th Village Committee of Xia Fengcha Village",
  "党支部书记": "Party branch secretary",
  "中共党员": "member of the Communist Party of China",
  "主持村党支部全面工作，负责党的建设、乡村振兴、重大决策等工作。": "Preside over the overall work of the village party branch and be responsible for party building, rural revitalization, major decision-making and other work.",
  "📋 任期：2024-2027": "📋Term: 2024-2027",
  "主持村委会全面工作，负责村务行政、经济发展、基础设施建设等。": "Preside over the overall work of the village committee and be responsible for village administration, economic development, infrastructure construction, etc.",
  "村委委员": "Village committee member",
  "协助村长工作，分管农业、林业、水利、环境卫生等专项工作。": "Assist the village chief in his work and be in charge of special tasks such as agriculture, forestry, water conservancy, and environmental sanitation.",
  "负责村集体财务管理、村务公开、统计报表、集体经济核算等工作。": "Responsible for village collective financial management, village affairs disclosure, statistical reports, collective economic accounting, etc.",
  "负责村社会治安综合治理、民事调解、消防安全、信访稳定等工作。": "Responsible for the comprehensive management of village social security, civil mediation, fire safety, petition stability, etc.",
  "负责妇女权益保障、计划生育、儿童工作、精神文明建设等。": "Responsible for the protection of women's rights and interests, family planning, children's work, spiritual civilization construction, etc.",
  "中共下枫槎村支部 · 先锋力量": "Xiafengcha Village Branch of the Communist Party of China · Pioneer Force",
  "（信息征集中）": "(Information solicitation)",
  "不忘初心 牢记使命": "Never forget the original intention and keep the mission in mind",
  "全心全意为人民服务": "Serve the people wholeheartedly",
  "发挥先锋作用 永葆先进本色": "Play a pioneering role and always maintain advanced qualities",
  "扎根基层 服务群众": "Taking root at the grassroots level and serving the masses",
  "带头致富 振兴乡村": "Take the lead in getting rich and revitalizing the countryside",
  "恪尽职守 勤勉工作": "Work diligently and diligently",
  "下枫槎村党支部现有党员信息正在整理中，后续将逐一展示党员风采。": "The existing party member information of the Xia Fengcha Village Party Branch is being sorted out, and the demeanor of the party members will be displayed one by one in the future.",
  "地址": "address",
  "浙江省宁波市宁海县下枫槎村": "Xiafengcha Village, Ninghai County, Ningbo City, Zhejiang Province",
  "谢氏宗祠位于村中央": "Xie's Ancestral Hall is located in the center of the village",
  "家族微信群": "Family WeChat group",
  "请联系管理员邀请加入": "Please contact the administrator to invite to join",
  "家族理事会": "family council",
  "下枫槎谢氏家族理事会负责家族日常事务管理": "The Xia Fengcha Xie Family Council is responsible for the management of daily affairs of the family",
  "联系方式（电话/微信）": "Contact information (phone/WeChat)",
  "主题 *": "Topic *",
  "留言内容 *": "Message content *",
  "用于宗祠日常维护和修缮工程": "Used for daily maintenance and repair projects of ancestral halls",
  "捐款方式正在建设中...": "The donation method is under construction...",
  "用于奖励优秀学子，资助困难学生": "Used to reward outstanding students and support needy students",
  "宁波史志网（宁海地方志）": "Ningbo Historical Records Network (Ninghai Local Chronicles)",
  "宁海县人民政府": "Ninghai County People's Government",
  "浙江谢氏宗亲会": "Zhejiang Xie Clan Association",
  "中华谢氏联谊总会": "China Xie Family Association",
  "盖闻木有本而枝叶茂，水有源而流派长。吾谢氏之先，出自姬姓。周宣王封元舅申伯于谢邑，因以国为氏，至今两千八百余载矣。自申伯受封，历代相承，或显于周秦，或盛于汉魏。至东晋时，文靖公谢安、康乐公谢玄叔侄，以八万北府之师破苻坚百万之众于淝水，拯社稷于将倾。一门数公，位极人臣，与琅琊王氏并称\"王谢\"，为天下望族之冠。此吾族千载之荣光也。": "Gai Wen said that trees have roots and branches are luxuriant, water has a source and streams grow. The ancestor of my Xie family comes from the surname Ji. King Xuan of Zhou granted his uncle Yuan Shen Bo to Xie Yi and took the country as his surname. This has lasted more than 2,800 years. Since Shen Bo was granted the title, it has been passed down through the generations. It was either prominent in the Zhou and Qin Dynasties or flourished in the Han and Wei dynasties. During the Eastern Jin Dynasty, Duke Wenjing thanked An, and Duke Kangle thanked Uncle Xuan and his nephew. They used 80,000 troops from Beifu to defeat Fu Jian's millions of troops in Feishui, saving the country from the general collapse. He has several dukes in his sect and is a highly respected official. Together with the Wang family of Langya, he is called \"Wang Xie\" and is the most famous family in the world. This is the glory of our family for thousands of years.",
  "溯吾枫槎一脉，世系源远流长。自申伯传三十六世至东山会稽，再由会稽南下经临海下渡，至石马（下谢）小四公，乃入浙东之近祖也。由石马传十二世，至文杲公，字克源，北宋宣和年间（约公元一一二五年）任越溪司巡检，始居岩下。公为枫槎谢氏之始迁祖，至今近九百载，传三十六世，瓜瓞绵绵。二世祖攒公、撰公，析居后枫槎与前枫槎，两支并茂，各立门户。": "Tracing back to my Fengcha lineage, the lineage has a long history. From the thirty-sixth generation of Shen Bo Zhuan, he went to Dongshan Kuaiji, and then went south from Kuaiji and crossed Linhai to Xiao Sigong in Shima (Xiaxie), which was his recent ancestor who entered eastern Zhejiang. From the twelfth generation of Shima to Wen Gao Gong, whose courtesy name was Keyuan, he served as an inspector of Yuexi Division during the Xuanhe period of the Northern Song Dynasty (about 1125 AD) and first lived at Yanxia. The Duke is the first ancestor of the Xie family in Fengcha. It has been passed down for thirty-six generations for nearly nine hundred years, and the melons and melons are endless. The second generation ancestors, Zuan Gong and Zhuan Gong, lived in Fengcha in the back and Fengcha in the front. Both branches flourished and each established its own branch.",
  "初，吾族世居岩下。迨明隆庆壬申（公元一五七二年），山洪暴发，庐舍为墟。十六世祖乾公、彬公昆仲，相度地势，遂迁于双枫古槎之下，因名其地曰\"下枫槎\"。斩荆棘，辟草莱，筑室于兹，开基立业。自此一脉繁衍，枝分派衍，或习儒术而登科第，或事商贾而通有无，或精农桑而富仓廪。清乾隆间，合族建宗祠于村北，三进两厢，门楣高悬\"谢氏宗祠\"匾额，堂号\"敦睦堂\"，寓敦宗睦族之意。春秋二祭，少长咸集，尊祖敬宗，礼行肃穆。": "In the early days, my family lived under the rock. During the Longqing period of the Ming Dynasty (AD 1572), a flash flood broke out and the cottage became a ruin. The 16th generation ancestors Gan Gong and Bin Gong Kunzhong took advantage of the terrain and moved under Shuangfeng Ancient Cha, so the place was named \"Xia Feng Cha\". Cut off thorns, cultivate grass and grass, build a house here, and establish a foundation. From then on, the lineage multiplied, and its branches spread out. Some people studied Confucianism and gained academic qualifications, some became merchants and became knowledgeable, or they became good farmers and mulberry trees and became rich in warehouses. During the Qianlong period of the Qing Dynasty, the He clan built an ancestral hall in the north of the village, with three entrances and two wings. A plaque of \"Xie's Ancestral Hall\" was hung high on the lintel, and the hall name was \"Dunmutang\", which means Dunmu Hall. During the two festivals of Spring and Autumn, young and old gather together to honor their ancestors and conduct solemn etiquette.",
  "惜乎旧牒不存，世系中阙。先是，吾族旧谱毁于火，世次莫考。同治六年（公元一八六七年），族人首议重修，然因旧谱焚毁、文献无稽，不得已暂将枫槎谢氏附于天台榧树同宗之下，权作权宜之计。民国三十六年（公元一九四七年），再度修谱，仍沿旧误，反将石马一脉之世系错编于榧树派下，以致昭穆颠倒，辈分淆乱，贻误非浅。幸而后来三门石马（下谢）续修宗谱，详加考订，厘清源流，正本清源，吾族世系始得归宗于石马正脉。此前人之失，后人之鉴也。": "It's a pity that the old ultimatum does not exist, and the lineage is in the middle. First of all, the old genealogy of our family was destroyed by fire, and there is no way to test the generations. In the sixth year of Tongzhi (AD 1867), the tribe first proposed to renovate. However, because the old genealogy was burned and the documents were useless, they had no choice but to temporarily attach the Xie family of Fengcha to the same clan of Tiantai Torreya tree as a temporary measure. In the 36th year of the Republic of China (AD 1947), the genealogy was revised again, but the old errors were still followed. Instead, the lineage of the Shima lineage was misorganized into the Torreya sect, which resulted in the Zhaomu being reversed and the generational lines confused. This was a serious mistake. Fortunately, Sanmen Shima (Xiaoxie) later revised the genealogy, conducted detailed research, clarified the origin, and clarified the origin, and our family lineage was finally able to return to the true lineage of Shima. The mistakes of the past are lessons for future generations.",
  "其后，宁海桃源街道陈家岙村有贤达陈君令昂者，悯吾族源流之湮，慨然以考正为己任。自丙申岁（公元二〇一六年）始，时年七十有三，不惮寒暑，访碑搜谱，凡临海、宁海、天台诸邑故家遗编，靡不穷究。辛勤十载，至丙午岁（公元二〇二六年），年八十有三，乃豁然贯通，得出确证：下枫槎谢氏与陈君所出之东门陈氏，实同宗同族，俱出自临海石马下谢之祖小四公（讳聪孙）之子丹一公脉下。丹一公生二子：长文杲公，即吾枫槎始迁祖；次文榘公，即桃源街道陈家岙村始祖。源流派衍，一一可考。阖族闻之，莫不感泣。此诚吾族莫大之恩德也。": "Later, there was a wise man named Chen Junlingang in Chenjia'ao Village, Taoyuan Street, Ninghai. He felt sorry for the loss of our family's origins and took it as his duty to pass the examination. Since the age of Bingshen (AD 2016), when he was seventy-three years old, he was not afraid of the cold and heat, visiting steles and searching for genealogy. After ten years of hard work, at the age of Bingwu (AD 2026), when he was eighty-three years old, he suddenly understood and got conclusive confirmation: the Xie family of Xia Fengcha and the Chen family of Dongmen, from which Chen Jun came, are actually from the same clan and the same clan. Dan Yigong had two sons: Chang Wen Gao Gong, the ancestor of my family who moved to Fengcha; second Wen Chu Gong, the founder of Chenjia'ao Village in Taoyuan Street. The origins and derivation of schools can be examined one by one. When the whole clan heard this, they all cried. This is a great kindness to our family.",
  "今值盛世，国运昌隆，族谱重修于丙午之春（公元二〇二六年），敦睦堂珍藏。复建数字宗祠于云端，录世系于网络，使四海宗亲皆可随时查阅，虽隔山海，犹在目前。此番修谱，悉依陈君令昂所考证之正本，以丹一公为承上启下之枢，以文杲公为枫槎始迁之祖，上接石马小四公，下统三十六世子孙，世次分明，昭穆有序。凡吾族中子弟，自此皆知其所自来、其所自出，尊祖敬宗之心，油然而生矣。": "Today is a prosperous time, and the country is prosperous. The genealogy was rebuilt in the spring of Bingwu (2026 AD) and is treasured by Dunmutang. Restore the digital ancestral hall in the cloud and record the lineage on the Internet, so that clan members from all over the world can check it at any time. Even though they are separated by mountains and seas, they are still in the present. This revision of the genealogy is based on the original text researched by Chen Jun Lingang, with Dan Yigong as the link between the past and the following, Wen Gao Gong as the ancestor of Fengcha's first migration, and Shima Xiaosi Gong as the ancestor, and thirty-six generations of descendants as the descendants. The lineage of generations is clear and orderly. From now on, all the children of our clan know where they come from and where they came from, and the heart of respecting their ancestors will naturally arise.",
  "丙午年四月初吉，天朗气清，惠风和畅，阖族会于下枫槎之祠，恭行圆谱大典焉。是日也，宗祠内外焕然一新，彩幡飘扬，钟鼓齐鸣。四方归省之族人，少长咸集，衣冠济济，共祭先祖。礼成，阖族欣悦，追昔抚今，感念陈君令昂考定宗源之功，莫不肃然起敬。此诚吾族近百年来未有之盛事也。": "It was an auspicious day in the fourth month of the year Bingwu. The sky was clear and the air was clear, and the wind was gentle and gentle. The whole family gathered at Xia Fengcha's temple to respectfully perform the Yuanpu ceremony. On this day, the inside and outside of the ancestral hall were completely new, with colorful flags flying and bells and drums ringing. The tribesmen from all over the country who had returned to the province, young and old, gathered together, dressed up and worshiped their ancestors together. The ceremony was completed, and the whole family was delighted. Looking back on the past and looking back on the present, they were grateful for Chen Jun's contribution to the investigation of the origin of the ancestral line, and everyone was in awe. This is a grand event that has never happened to our clan in the past hundred years.",
  "吾族代有贤达。有谢琳芳者，上海知青，下放下枫槎。率民开荒种茶，扩茶地至二百余亩，为名茶\"望府银毫\"奠基。由大队支书累迁共青团宁波地委书记、团省委常委，心系故土，与乡亲同劳。一九七二年，《解放日报》以《三门湾畔向阳花》为题报道，遂成全国知青楷模。": "There are sages in our clan from generation to generation. There is Xie Linfang, an educated youth in Shanghai, who puts down Fengcha. He led the people to open up wasteland and plant tea, expanded the tea land to more than 200 acres, and laid the foundation for the famous tea \"Wangfu Yinhao\". From the brigade secretary to the Ningbo Prefectural Committee secretary of the Communist Youth League and member of the Standing Committee of the Youth League Provincial Committee, he cares about his homeland and works together with his fellow villagers. In 1972, the \"Liberation Daily\" reported on \"Sunflowers by Sanmen Bay\" and became a model for educated youth across the country.",
  "又有幸福君者，中共党员，曾任中国人民银行宁海县支行行长。秉公尽职，为国理财，热心家族公益，助力宗祠修缮与谱事，亦为阖族之荣光。": "There is also the King of Happiness, a member of the Communist Party of China, and former president of the Ninghai County Branch of the People's Bank of China. He performed his duties impartially, managed the country's finances, was enthusiastic about family welfare, and assisted in the repair of the ancestral hall and the memorial service, which was also the glory of the family.",
  "世忠君者，中共党员，白手起家，从商办企，心系桑梓，倾力修建宗祠，资助文化礼堂。本届修谱，担道义，任编修，洵德孝之人也。": "A person who is loyal to the emperor and a member of the Communist Party of China. He started from scratch, started a business, and cared about his hometown. He devoted his efforts to building ancestral halls and funding cultural halls. This year's revision of the genealogy is responsible for morality and righteousness. I am responsible for editing and editing. I am a person of virtue and filial piety.",
  "行龙君者，中共党员，浙大MBA，宁波市优秀企业家。历任四届村长，建文化礼堂，捐资奉献，敬祖尊宗，功德流芳。": "The Dragon King is a member of the Communist Party of China, an MBA from Zhejiang University, and an outstanding entrepreneur in Ningbo City. He has served as village chief for four terms, built a cultural hall, donated money and dedicated money, respected his ancestors, and his merits will last forever.",
  "海港君者，中共党员，为家族修建宗祠与村文化礼堂建设无私奉献，修谱捐资出资，其心可嘉。": "Mr. Haigang, a member of the Communist Party of China, has made selfless contributions to the construction of the ancestral hall and the village cultural hall for his family, and donated funds for the revision of genealogy. His heart is commendable.",
  "此皆吾族现代之佼佼者，后昆之楷模也。": "These are all the outstanding people of our clan in modern times and the models of Hou Kun.",
  "乌衣世泽，源远流长；宝树家声，继往开来。凡我族人，当念创业之艰难、守成之不易，尤当铭记陈令昂君之高义。陈君以七十三岁高龄始事，至八十三岁终成，十载辛勤，非我族姓而为我族考定宗源、续绝存亡，使尘封之氏族历史与血脉传承，得以昭告先人及当今枫槎全体家族成员，其德其功，没齿难忘。故于此宗源记中，特为记载，以彰其劳，以劝后世。凡我子孙，世世当传颂其事，永志勿谖。同心同德，以光大门楣、垂裕后昆，则吾谢氏之兴，岂有艾乎？": "The beauty of Wuyi Shize has a long history; the reputation of Baoshu family carries on the past and opens up the future. All members of our clan should remember the difficulty of starting a business and the difficulty of maintaining success, and especially the high righteousness of Lord Chen Lingang. Chen Jun started the project at the age of seventy-three and completed it at the age of eighty-three. After ten years of hard work, he not only determined the origin of our clan, but also determined the origin and survival of our clan, so that the dusty clan history and blood inheritance can be revealed to the ancestors and all current Fengcha family members. His virtues and achievements will be unforgettable. Therefore, it is specially recorded in this Zongyuanji to highlight his efforts and to encourage future generations. All my descendants should pass on his deeds from generation to generation, and never be dissatisfied. If we work together with one heart and one virtue to illuminate the lintel of the gate and bring prosperity to the queen, how can our Xie family prosper?",
  "下枫槎谢氏阖族敬撰 · 丙午年仲夏吉日": "Respectfully written by the Xie family in Xia Fengcha · An auspicious day in midsummer, Bingwu year",
  "撰【前枫槎】": "Written by [former Fengcha]",
  "枫槎2世 / 石马4世": "Fengcha 2/Shima 4",
  "攒【后枫槎】": "Save [Hou Fengcha]",
  "伯逊": "Robertson",
  "枫槎3世 / 石马5世": "Fengcha 3rd generation / Shima 5th generation",
  "伯能": "Burnen",
  "祖庚": "Zu Geng",
  "枫槎4世 / 石马6世": "Fengcha 4th generation / Shima 6th generation",
  "祖田": "Zutian",
  "宗政": "Zongzheng",
  "枫槎5世 / 石马7世": "Fengcha 5th generation / Shima 7th generation",
  "宗孝": "Muneko",
  "道立": "Daoli",
  "枫槎6世 / 石马8世": "Fengcha 6th generation / Shima 8th generation",
  "道济": "Daoji",
  "体和": "Body and harmony",
  "枫槎7世 / 石马9世": "Fengcha 7th generation / Shima 9th generation",
  "体仁": "body benevolence",
  "开盛": "in full bloom",
  "枫槎8世 / 石马10世": "Fengcha 8th generation / Shima 10th generation",
  "开绪": "Open thoughts",
  "裕成": "Yucheng",
  "枫槎9世 / 石马11世": "Fengcha 9th generation / Shima 11th generation",
  "裕南": "Yunan",
  "静安": "Jing'an",
  "枫槎10世 / 石马12世": "Fengcha 10th generation / Shima 12th generation",
  "静庵": "Jing'an",
  "元第": "Yuandi",
  "枫槎11世 / 石马13世": "Fengcha 11th generation / Shima 13th generation",
  "元峰": "Yuan Feng",
  "宏章": "Hongzhang",
  "枫槎12世 / 石马14世": "Fengcha 12th generation / Shima 14th generation",
  "文用": "Literary use",
  "孟洄": "Meng Hui",
  "枫槎13世 / 石马15世": "Fengcha 13th generation / Shima 15th generation",
  "孟献": "Meng Xian",
  "公常 公论 公绰 公浴": "Gongchang, Gonglun, Gongchuo, Gongyu",
  "枫槎14世 / 石马16世": "Fengcha 14th generation / Shima 16th generation",
  "公表": "Public table",
  "书载 书茂": "Shuzai Shumao",
  "枫槎15世 / 石马17世": "Fengcha 15th generation / Shima 17th generation",
  "叔仅": "Uncle only",
  "文对": "text pair",
  "枫槎16世 / 石马18世": "Fengcha 16th generation / Shima 18th generation",
  "彬 乾": "Bin and Qian",
  "家训家规": "Family training and rules",
  "乌衣世泽 · 宝树家声 —— 谢氏家训代代传": "Wuyi Shize · Baoshu family reputation - the Xie family motto passed down from generation to generation",
  "📜 谢氏家训": "📜 Xie family motto",
  "一曰孝悌": "One is filial piety and brotherhood",
  "—— 百善孝为先，兄弟和睦，尊长爱幼，此为人伦之本。": "——Filial piety comes first among all good deeds, brotherhood is harmonious, respecting the elders and loving the young are the foundation of human relations.",
  "二曰忠信": "The second is loyalty",
  "—— 事君以忠，待人以信，言必行，行必果，此为立身之基。": "——Be loyal to the king, trustworthy to others, be sure to follow your words, and be sure to bear fruit in your deeds. This is the foundation for establishing a good life.",
  "三曰礼义": "The third is etiquette and justice",
  "—— 知书达礼，明辨是非，循规蹈矩，此为处世之道。": "——Know the book and be polite, distinguish right from wrong, and follow the rules. This is the way to live in the world.",
  "四曰廉耻": "Fourth: Integrity and Shame",
  "—— 清正廉洁，知耻后勇，不取不义之财，此为操守之节。": "——Be honest and honest, be courageous after knowing your shame, and do not take ill-gotten gains. This is the integrity of the people.",
  "五曰勤俭": "The fifth day is diligence and frugality",
  "—— 勤以修身，俭以养德，一粥一饭当思来处不易，此为持家之法。": "——Cultivation of one’s character through diligence, cultivating virtue through frugality, and thinking about how hard it came from for every porridge and meal. This is the way to run a household.",
  "六曰读书": "Six days of reading",
  "—— 耕读传家，诗书继世，读书明理，此为兴族之要。": "——Plowing and reading can be passed down from generation to generation, poems and books can be passed down from generation to generation, and reading and understanding of principles are the key to rejuvenating the clan.",
  "🏮 族规十条": "🏮 Ten rules of the clan",
  "尊祖敬宗，春秋祭祀不可缺废": "Respecting ancestors and lineage, Spring and Autumn sacrifices are indispensable",
  "孝顺父母，生养死葬尽其心力": "Be filial to your parents, do your best in life, care, death and burial",
  "友爱兄弟，手足之情不可相残": "Brotherly love, brotherhood cannot kill each other",
  "和睦乡邻，出入相友守望相助": "Live in harmony with your neighbors, watch and help each other when you come in and out",
  "教训子孙，务令读书明理向善": "Teach your children and grandchildren a lesson and make them read, understand, and be kind.",
  "谨慎婚配，择良家子门户相当": "Be cautious in your marriage and choose good family members.",
  "廉洁奉公，非义之财一介不取": "Be honest and honest, never take any ill-gotten gains",
  "勤业守分，各安其业毋事游惰": "Be diligent and keep your job, everyone should settle down and do not be idle.",
  "保护祖产，祠宇坟茔严禁毁坏": "To protect ancestral property, destruction of ancestral temples and tombs is strictly prohibited",
  "崇俭戒奢，婚丧喜庆勿竞奢华": "Advocate frugality and abstain from extravagance; do not compete with luxury during weddings and funerals",
  "\"乌衣世泽，宝树家声。凡我谢氏子孙，当以家训为镜、族规为准，": "\"Wuyi Shize, Baoshu family reputation. All descendants of my Xie family should take the family motto as a mirror and the clan rules as the standard.",
  "修身齐家，敦亲睦族，光大门楣，垂裕后昆。\"": "Cultivating one's moral integrity and harmonizing one's family, harmonizing one's clan, bringing light to the lintel of the gate, and bringing prosperity to the queen. \"",
  "—— 下枫槎谢氏阖族共立": "——Xia Fengcha’s Xie family and the whole family stand together",
  "谢氏起源": "Origin of Xie family",
  "出自姬姓，以邑为氏。据《元和姓纂》及《通志·氏族略》记载，周宣王（公元前827-前781年在位）封其母舅申伯于谢邑（今河南南阳市一带），建立谢国。其后人以国为氏，称谢氏。": "Derived from the surname Ji, Yi is the surname. According to the records of \"Yuanhe Surname Compilation\" and \"Tongzhi·Clan Brief\", King Zhou Xuan (reigned from 827 BC to 781 BC) granted his maternal uncle Shen Bo to Xie Yi (today's Nanyang City, Henan Province) and established the Xie State. Later generations took the country as their surname and called it Xie's family.",
  "谢氏得姓至今已有两千八百余年历史。在漫长的发展过程中，谢氏逐渐由河南向全国迁徙繁衍，形成了\"陈留谢氏\"、\"会稽谢氏\"等著名郡望。东晋时期，以谢安、谢玄为代表的谢氏家族达到鼎盛，与王氏并称\"王谢\"，为天下望族。": "The Xie family name has a history of more than 2,800 years. In the long process of development, the Xie family gradually migrated and multiplied from Henan to the whole country, forming famous county officials such as \"Chenliu Xie family\" and \"Kuiji Xie family\". During the Eastern Jin Dynasty, the Xie family, represented by Xie An and Xie Xuan, reached its peak. Together with the Wang family, they were called \"Wang Xie\" and became a prominent family in the world.",
  "谢氏堂号众多，最有名者当属": "The Xie family has many titles, and the most famous one is undoubtedly",
  "\"宝树堂\"": "\"Baoshutang\"",
  "和": "and",
  "\"乌衣堂\"": "\"Wu Yi Tang\"",
  "。\"宝树\"出自唐太宗李世民对谢氏家族的赞誉——\"宝树映庭\"；\"乌衣\"则源自东晋建康（今南京）的乌衣巷，为谢氏聚居之地。唐代刘禹锡有诗云：\"旧时王谢堂前燕，飞入寻常百姓家。\"下枫槎谢氏亦以\"乌衣世泽、宝树家声\"为家族楹联，传承千年家风。": ". \"Baoshu\" comes from the praise of the Xie family by Emperor Taizong Li Shimin of the Tang Dynasty - \"Baoshu reflects the courtyard\"; \"Wuyi\" comes from Wuyi Lane in Jiankang (now Nanjing) in the Eastern Jin Dynasty, where the Xie family lived. Liu Yuxi of the Tang Dynasty wrote a poem: \"In the old days, the swallows in front of Wang Xietang flew into the homes of ordinary people.\" The Xie family in Xia Fengcha also used \"Black Clothes, World Ze, Treasure Tree Family Sound\" as a family couplet, inheriting the family tradition for thousands of years.",
  "说说宁海谢氏": "Let’s talk about Ninghai Xie family",
  "自申伯受封至今 · 两千八百载 · 世系源流一览": "From the time when Shen Bo was entrusted to the present day · Two thousand eight hundred years · A list of the origins of the lineage",
  "宁海谢氏均属": "Ninghai Xie family belongs to",
  "姜姓谢氏": "Jiang surnamed Xie",
  "，为申伯后裔，与会稽（绍兴）、临海谢氏同宗，属浙东谢氏大支。唐末至两宋，中原战乱频仍，台州周边（天台、临海）的谢氏族人陆续为避乱或仕宦迁入宁海，形成了有史可考的三支独立始迁支系。其中下枫槎一脉的先祖正是由会稽南下经": ", is a descendant of Shen Bo, the same clan as the Xie family in Kuaiji (Shaoxing) and Linhai, and belongs to the major branch of the Xie family in eastern Zhejiang. From the end of the Tang Dynasty to the Song Dynasty, there were frequent wars in the Central Plains. The Xie clan members from the surrounding areas of Taizhou (Tiantai and Linhai) moved to Ninghai one after another to avoid chaos or to serve as officials, forming three independent migration branches that can be documented in history. Among them, the ancestors of the Xia Fengcha lineage came from Kuaiji to the south.",
  "临海下渡": "Linhaixiadu",
  "，再辗转至石马（下谢），最终定居宁海。": ", then moved to Shima (Xiaxie), and finally settled in Ninghai.",
  "梅林杏树谢氏": "Merlin Apricot Tree Xie",
  "北宋崇宁年间（1102–1106）": "Chongning period of the Northern Song Dynasty (1102–1106)",
  "自天台榧树迁入": "Moved in from the torreya tree on the rooftop",
  "宁海最早谢氏支系": "The earliest Xie family branch in Ninghai",
  "长街谢氏": "Changjie Xie family",
  "南宋末年（1279年前）": "Late Southern Song Dynasty (before 1279)",
  "始迁祖谢寿甫自石马迁入": "Xie Shoufu, the founder of the migration, moved from Shima",
  "全县主流，人口最盛": "Mainstream in the county, with the largest population",
  "北宋宣和 · 文杲公自石马迁岩下": "Xuanhe and Duke Wen Gao of the Northern Song Dynasty moved from Shima to the foot of the rock",
  "溯自临海下渡 → 石马（下谢）": "Trace back from Linhai to Xiadu → Shima (Xiaxie)",
  "以望府茶为业": "Taking Wangfu tea as a business",
  "为宁海有史可考最早迁入的谢氏支系，北宋崇宁年间自天台榧树村迁居梅林杏树村（旧名\"饭店坑\"，后因谢氏聚居更名）。该支世代定居杏树村，后裔以村域为核心，少量散居周边。": "It is the first branch of the Xie family to move into Ninghai in recorded history. During the Chongning period of the Northern Song Dynasty, it moved from Tiantai Jushu Village to Meilin Xingshu Village (formerly known as \"Restaurant Keng\", but later renamed because of the Xie family's settlement). This branch has settled in Xingshu Village for generations, with the village as its core and a small number of descendants living in the surrounding areas.",
  "为宁海谢氏人口最多、分布最广的主流支系。南宋末年，始迁祖谢寿甫自宁海石马（今属三门珠岙镇）迁居长街，堂号\"东山堂\"，承浙东谢氏总堂号，溯源东晋谢安\"东山再起\"之典。明清时期，长街谢氏分房外迁，形成了力洋谢家村等规模化聚居点，后裔还散居易洋、越溪、一市等地。宁海境内除梅林、下枫槎外的谢姓，大多归属长街支系。": "It is the mainstream branch with the largest population and the widest distribution among the Xie family in Ninghai. At the end of the Southern Song Dynasty, the founder Xie Shoufu moved to Changjie from Shima, Ninghai (now part of Zhu'ao Town, Sanmen). The church name is \"Dongshan Hall\", which inherits the name of the Xie family's main hall in eastern Zhejiang and traces back to Xie'an's \"Resurgence\" in the Eastern Jin Dynasty. During the Ming and Qing Dynasties, the Xie family in Changjie moved out of their houses, forming large-scale settlements such as Xiejia Village in Liyang, and their descendants also lived in scattered places such as Yiyang, Yuexi, and Yishi. Most of the Xie surnames in Ninghai, except Meilin and Xiafengcha, belong to the Changjie branch.",
  "即吾族所在。溯吾族迁徙源流：自东山会稽南下经临海下渡，至石马（下谢）小四公，乃入浙东之近祖。北宋宣和年间（约1125年），文杲公自石马（下谢）迁居宁海岩下（岩头下），任越溪司巡检，为枫槎谢氏始迁祖，至今近九百载，传三十六世。与长街谢氏同出石马（下谢），均为浙东谢氏一脉。明隆庆六年（1572），岩下遭特大洪水，村舍损毁，族人举族迁至枫槎岭下首，因地势低于上枫槎，故名\"下枫槎\"，永久定居。堂号\"东山堂\"，承东晋谢安\"东山再起\"之典。族人世代以种茶为业，望府楼山乌砂壤土、云雾缭绕，所产望府茶为宁海名茶，村域茶园连片，至今为支柱产业。": "That is where my clan is. Tracing the origin of the migration of the Wu people: from Dongshan to Kuaiji, southward through Linhai and Xiadu, to Xiao Sigong of Shima (Xiaxie), which is our recent ancestor who entered eastern Zhejiang. During the Xuanhe period of the Northern Song Dynasty (about 1125), Duke Wen Gao moved from Shima (Xiaxie) to Yanxia (Yantouxia), Ninghai, and served as an inspector of Yuexi Division. He was the ancestor of the Xie family in Fengcha. It has been passed down to thirty-six generations for nearly 900 years. Shima (Xia Xie) came from the same family as the Xie family in Changjie, and they were both of the same lineage as the Xie family in eastern Zhejiang. In the sixth year of Longqing's reign in the Ming Dynasty (1572), Yanxia was hit by a severe flood and the village houses were damaged. The tribe moved to the lower head of Fengcha Ridge. Because the terrain was lower than that of Shangfengcha, it was named \"Xiafengcha\" and settled permanently. The name of the hall is \"Dongshan Hall\", which inherits the tradition of Xie An's \"comeback\" in the Eastern Jin Dynasty. The tribe has been growing tea for generations. Wangfulou Mountain has black sandy loam soil and is shrouded in clouds and mist. The Wangfu tea produced is Ninghai's famous tea. The tea gardens in the village are contiguous, and it has become a pillar industry to this day.",
  "除三大支系外，宁海城关、西店、深甽、桥头胡等地的零星谢姓，均为三大支后裔近现代外迁散居，无独立始迁记载。而": "In addition to the three major branches, the sporadic Xie surnames in Ninghai Chengguan, Xidian, Shenzong, Qiaotouhu and other places are all descendants of the three major branches who migrated abroad in modern times, and there is no record of independent migration. And",
  "力洋谢氏": "Liyang Xie",
  "虽聚居规模较大，但实为长街谢氏明至清代分房外迁形成，无独立始迁祖与迁入年代，史料均归入长街支下，并非独立的第四支系。": "Although the scale of the settlement is large, it was actually formed by the migration of the Xie family in Changjie from the Ming to the Qing Dynasties. There is no independent ancestor and migration year. The historical materials are all classified under the Changjie branch and are not an independent fourth branch.",
  "据光绪《宁海县志》、1944年九修《重修谢氏宗谱》及地方史志记载，宁海谢氏脉络清晰，三支并立，各有所源，而同归浙东谢氏一脉。其中下枫槎谢氏尤为特别——它是宁海谢氏中唯一有明确迁址年代（1572年）、完整迁徙事由（洪水迁居），且以特色茶产业闻名的自然村支系。三支族人虽迁入有先后、聚居有远近，然溯源追本，皆申伯之裔，乌衣之脉，同气连枝。": "According to Guangxu's \"Ninghai County Chronicles\", the 1944 Ninth Edition of \"Reconstruction of the Xie Family Genealogy\" and local historical records, the Ninghai Xie family has a clear lineage, with three branches standing side by side, each with its own origin, and all belonging to the Xie family lineage in eastern Zhejiang. Among them, the Xia Fengcha Xie family is particularly special - it is the only natural village branch of the Xie family in Ninghai that has a clear relocation year (1572), a complete migration reason (flood migration), and is famous for its specialty tea industry. Although the people of the three tribes moved in at different times and settled at different distances, tracing back to their roots, they are all descendants of Shen Bo. The veins of Wuyi are connected by the same energy.",
  "📋 宁海谢氏三大支系速览": "📋 A quick overview of the three major branches of the Xie family in Ninghai",
  "① 梅林杏树谢氏": "① Xie Shi, plum grove apricot tree",
  "北宋崇宁 · 天台迁入": "Northern Song Dynasty Chongning · Tiantai moved in",
  "② 长街谢氏": "② Xie’s family on Changjie",
  "南宋末 · 石马迁入": "Late Southern Song Dynasty·Shima moved in",
  "力洋谢氏为其分支": "Liyang Xie's branch",
  "会稽→临海→石马": "Kuaiji→Linhai→Shima",
  "文杲公迁岩下": "Duke Wen Gao moved to Yanxia",
  "村落历史与沿革": "Village history and evolution",
  "从枫槎岭得名到今日新村": "From Fengchaling’s name to today’s new village",
  "📜 村名由来": "📜 Origin of the village name",
  "下枫槎村得名于村南": "Xia Fengcha Village is named after the south of the village",
  "枫槎岭": "maple ridge",
  "。据《嘉定赤城志》记载，晋义熙元年（405），高僧昙猷自海上乘": ". According to \"Jiading Chicheng Chronicles\", in the first year of Jin Yixi (405), the eminent monk Tan You took a boat from the sea.",
  "枫槎": "maple",
  "（枫树做的独木舟）至一市一带，弃槎登岸，游历浙东，先后创建寿宁、柯仙、多宝、广润诸寺，被推为佛教入浙开山大师。其所过山岭后人遂称为": "(canoe made of maple trees) to the city area, abandoned the boat and landed, traveled in eastern Zhejiang, founded Shouning, Kexian, Duobao and Guangrun temples successively, and was regarded as the founder of Buddhism in Zhejiang. Later generations of the mountains he crossed were called",
  "，西面岭下村落亦被称为枫槎村。因村落分两处，南边的称": ", the village under Lingxia to the west is also called Fengcha Village. Because the village is divided into two parts, the one in the south is called",
  "上枫槎": "Shangfengcha",
  "，北边的称": ", the name of the north",
  "🏡 建村历程": "🏡 The process of building a village",
  "最早迁入下枫槎居住的为": "The first people to move to Xia Fengcha were",
  "王氏": "Wang",
  "族人，约在明洪武年间（1368-1398），距今650余年。": "The clan members lived around the Hongwu period of the Ming Dynasty (1368-1398), more than 650 years ago.",
  "明后期，": "In the late Ming Dynasty,",
  "迁入。据枫槎《谢氏宗谱》所载，谢氏始祖原居住在三门石马（下谢），因任越溪巡检司巡检，于北宋圣和二年（1055）迁居双溪岩头下。明隆庆六年（1572），特大洪水成灾，谢氏第十六代裔孙": "Move in. According to Fengcha's \"Genealogy of the Xie Family\", the ancestor of the Xie family originally lived in Shima (Xiaxie), Sanmen. He moved to the foot of Shuangxi Yantou in the second year of Shenghe (1055) in the Northern Song Dynasty because he served as an inspector of the Yuexi Inspection Department. In the sixth year of Longqing's reign in the Ming Dynasty (1572), a severe flood caused disaster. The sixteenth generation descendant of the Xie family",
  "谢彬、谢乾": "Xie Bin, Xie Qian",
  "见下枫槎山清水秀、枫槎岭脚下似港湾环抱、有聚财之象，遂从岩头下迁居下枫槎开基筑庐。此后子孙兴旺、开枝散叶，遂成枫槎": "Seeing the beautiful clear water of Xia Fengcha Mountain, the foot of Fengcha Ridge seems to be surrounded by a harbor, and there is a sign of gathering wealth, so he moved from the rock head to Xia Fengcha and built a cottage. After that, the descendants prospered, branches and leaves spread, and it became a maple tree.",
  "第一大姓": "First most common surname",
  "清代及民国时期，又有": "During the Qing Dynasty and the Republic of China, there were also",
  "陈、葛、史": "Chen, Ge, Shi",
  "等姓氏居民先后迁入。如今的陈姓，与谢姓实有": "Residents with other surnames moved in one after another. Today’s surname Chen is actually related to the surname Xie",
  "同宗之谊": "Friendship from the same clan",
  "——文杲公之弟文榘公，为宁海东门桃源陈氏之祖，故谢陈两姓有\"通谱\"之说。": "——Wen Gao Gong's younger brother Wen Ju Gong is the ancestor of the Chen family in Taoyuan, Dongmen, Ninghai, so the two surnames Xie and Chen have a \"common genealogy\".",
  "🗺️ 行政区划沿革": "🗺️ History of administrative divisions",
  "• 明代与清初 — 属连理乡宣扬里": "• Ming Dynasty and early Qing Dynasty - Belonging to the propaganda area of Lianli Township",
  "• 清雍正六年（1728）— 属南乡石舌庄": "• In the sixth year of Emperor Yongzheng’s reign in the Qing Dynasty (1728) – Belonging to Shijizhuang in Nanxiang",
  "• 民国21年（1932）— 属石兆乡": "• The 21st year of the Republic of China (1932) - Belongs to Shizhao Township",
  "• 民国24年（1935）— 属石舌乡": "• The 24th year of the Republic of China (1935)—belongs to Shitoni Township",
  "• 民国28年（1939）— 属双港乡": "• The 28th year of the Republic of China (1939) - Belongs to Shuanggang Township",
  "• 民国36年（1947）— 属桂峰乡": "• The 36th year of the Republic of China (1947) - Belongs to Guifeng Township",
  "• 1949年解放后 — 属一市区水车乡": "• After liberation in 1949 - it belongs to Shuiche Township, an urban area",
  "• 1958年10月 — 属宁海公社水车管理区": "• October 1958 — Belongs to Ninghai Commune Waterwheel Management Area",
  "• 1961年7月 — 属宁海区水车公社": "• July 1961 — Belongs to Ninghai District Waterwheel Commune",
  "• 1973年 — 属黄坛区水车公社": "• 1973 — Belongs to Huangtan District Waterwheel Commune",
  "• 1983年 — 属水车乡": "• 1983 — Belongs to Shuiche Township",
  "• 1992年至今 — 属跃龙街道水车办事处": "• 1992 to present — Belongs to Yuelong Street Water Truck Office",
  "• 2010年 — 下枫槎与上枫槎、草坦头、大路李3个自然村合并，组成": "• 2010 - Xiafengcha merged with three natural villages of Shangfengcha, Caotantou and Daluli to form",
  "望府村": "Wangfu Village",
  "族姓渊源": "Origin of family name",
  "五姓人家，同聚一村": "Families with five surnames gather together in one village",
  "下枫槎现有": "Xia Fengcha is now available",
  "谢、王、陈、葛、史": "Xie, Wang, Chen, Ge, Shi",
  "共五姓人家，和谐共处，亲如一家。": "There are five families with surnames, living together harmoniously and as close as one family.",
  "👤 王氏": "👤 Wang",
  "最早居民，明洪武年间（1368-1398）迁入，距今600余年。": "The earliest residents moved in during the Hongwu period of the Ming Dynasty (1368-1398), more than 600 years ago.",
  "👤 谢氏": "👤 Xie",
  "明隆庆六年（1572）从岩头下迁入，至今450余年，为村中第一大族。": "In the sixth year of Longqing's reign in the Ming Dynasty (1572), they moved from Yantouxia and have been the largest clan in the village for more than 450 years.",
  "👤 陈、葛、史": "👤 Chen, Ge, Shi",
  "分别于清代、民国及解放前后迁入。其中陈姓与谢姓同宗——文榘公为东门陈氏始祖，故有\"谢陈通谱\"之说。": "They moved here during the Qing Dynasty, the Republic of China and around the time of liberation. Among them, the surname Chen and the surname Xie have the same ancestor - Wen Chugong is the ancestor of the Chen family in Dongmen, so there is a saying of \"Xie Chen Tongpu\".",
  "📜 祖训家风": "📜 Family traditions taught by ancestors",
  "🌿 敦礼让 — 礼曰先之以礼让而民": "🌿 To be courteous and courteous - Li means to be courteous and courteous to the people first",
  "🌿 睦乡邻 — 邻里和睦，守望相助": "🌿 Good Neighbors - Neighbors are in harmony and help each other",
  "🌿 和兄弟 — 兄友弟恭，手足情深": "🌿 And brothers - brothers, friends and brothers respect each other and love each other deeply",
  "🌿 耕读传家 — 亦耕亦读，诗书继世": "🌿 Heirloom of Farming and Reading - Farming and reading, poetry and books will be passed down from generation to generation",
  "🌿 清世明理 — 清白做人，明理处事": "🌿 Qing Shi Ming Li - Live an honest life and deal with things wisely",
  "谢氏家训六则：": "Six family mottos of the Xie family:",
  "孝悌 · 忠信 · 礼义 · 廉耻 · 勤俭 · 读书": "Filial piety · Loyalty · Etiquette · Integrity · Diligence · Reading",
  "谢氏世系源流": "The origin of the Xie family lineage",
  "自炎帝至临海下渡 · 两千八百载世系传承": "From Emperor Yan to Linhai Xiadu·Twenty-eight hundred years of lineage inheritance",
  "炎帝 → 申伯": "Emperor Yan → Shen Bo",
  "自炎帝神农氏传至申伯，凡六十五世。炎帝姜姓，号神农氏，为中华民族人文始祖之一。传至周代，裔孙佐（吕尚之子）生申伯。周宣王封元舅申伯于谢邑，以邑为氏，谢氏自此得姓。": "From the Yan Emperor Shennong clan to the Shen Bo family, there were sixty-five generations. Emperor Yan's surname was Jiang, and his name was Shennong. He was one of the ancestors of the Chinese nation's humanities. It was passed down to the Zhou Dynasty that Sun Zuo (son of Lu Shang) gave birth to Shen Bo. King Xuan of Zhou granted Uncle Yuan Shen Bo to Xie Yi and took Yi as his surname. The Xie family got its surname from then on.",
  "申伯 → 缵 → 衡": "Shen Bo → Zuan → Heng",
  "申伯受封之后，子孙蕃衍，历周秦汉魏，代有闻人。传至晋代，有缵公为东山第一世，其侄衡公为会稽东山始祖，开东山谢氏之基业。": "After Shen Bo was granted the title, his descendants, Fan Yan, passed through the Zhou, Qin, Han, and Wei dynasties, and became famous in every generation. It was passed down to the Jin Dynasty that Duke Zhuan was the first of Dongshan, and his nephew Henggong was the founder of Dongshan in Kuaiji, establishing the foundation of the Xie family in Dongshan.",
  "缵 → 闓 → 临海下渡": "Zuan → Kai → Linhai Xiadu",
  "东山谢氏自衡公始，至东晋谢安、谢玄叔侄，以八万北府兵破苻坚百万之众于淝水，拯社稷于将倾，与琅琊王氏并称\"王谢\"，为天下望族之冠。传至闓公，为临海下渡第一世，浙东谢氏由此始。": "The Dongshan Xie family started from Henggong, and in the Eastern Jin Dynasty, Xie An and Xie Xuan's uncles and nephews used 80,000 Beifu soldiers to defeat Fu Jian and millions of people in Feishui, saving the country from the general collapse. Together with the Langya Wang family, they were called \"Wang Xie\" and became the most famous family in the world. It was passed down to Kai Gong, who was the first generation to cross the sea. This is where the Xie family in eastern Zhejiang began.",
  "闓 → 小四": "Kai → Xiaosi",
  "自闓公（临海下渡第一世）传至小四公（石马始祖），历经九世。小四公为石马（下谢）始祖，乃文杲公（枫槎始迁祖）之直系渊源。": "From Kai Gong (the first generation of Linhai Xiadu) to Xiao Sigong (the ancestor of Shima), it has gone through nine generations. Xiao Sigong is the ancestor of Shima (Xiaxie) and the direct descendant of Wen Gaogong (the ancestor of Fengcha).",
  "石马（下谢）分房派示意简图": "Shi Ma (Xie Xie) simple diagram of the room distribution faction",
  "小四公：炎帝第130世／申伯第66世／东山第32世／临海下渡第9世／石马（下谢）第1世。自小四公开派，衍生丹一、丹二、丹三三房，其后文杲公迁居宁海岩下为枫槎始迁祖，文榘公一派为东门桃源陈氏之祖。": "Xiao Sigong: The 130th life of Emperor Yan/The 66th life of Shen Bo/The 32nd life of Dongshan/The 9th life of Linhai Xiadu/The 1st life of Shima (Xiaxie). From Xiao Si Gong Gong sect, Dan Yi, Dan Er, Dan San and Sanfang were derived. Later, Wen Gao Gong moved to Ninghaiyan and became the ancestor of Fengcha. Wen Gao Gong's sect became the ancestor of Chen family in Dongmen Taoyuan.",
  "迁徙历程": "Migration process",
  "枫槎谢氏 · 千年迁徙源流": "Xie family of Fengcha·The origin of migration for thousands of years",
  "周代": "Zhou Dynasty",
  "前827年 · 西周": "827 BC · Western Zhou Dynasty",
  "申伯受封 · 谢氏得姓": "Uncle Shen was granted the title·Xie received the surname",
  "河南洛阳 · 谢邑": "Luoyang, Henan · Xieyi",
  "周宣王封元舅申伯于谢邑，以邑为氏，谢氏自此得姓。申伯为谢氏得姓始祖，至今两千八百余年。": "King Xuan of Zhou granted Uncle Yuan Shen Bo to Xie Yi and took Yi as his surname. The Xie family got its surname from then on. Uncle Shen was the ancestor of the Xie family for more than 2,800 years.",
  "⬇ 南迁 ↓": "⬇ Migrate south ↓",
  "六朝": "Six Dynasties",
  "东汉—东晋": "Eastern Han Dynasty - Eastern Jin Dynasty",
  "东山会稽 · 王谢世家": "Dongshan Kuaiji · Wang Xie Family",
  "浙江绍兴 · 上虞区上浦镇东山村": "Dongshan Village, Shangpu Town, Shangyu District, Shaoxing, Zhejiang",
  "传三十六世至会稽。东晋谢安、谢玄叔侄淝水之战救社稷，一门数公位极人臣，与琅琊王氏并称\"王谢\"，为天下望族之冠。": "It was passed down to Kuaiji in the thirty-sixth generation. In the Eastern Jin Dynasty, uncles Xie An and Xie Xuan saved Sheji in the battle of Feishui. They had several public positions and were known as \"Wang Xie\" together with the Wang family of Langya, making them the most famous family in the world.",
  "唐末": "Late Tang Dynasty",
  "唐末五代": "Late Tang and Five Dynasties",
  "临海下渡祖 · 台州中转": "Linhai Xiaduzu·Taizhou transit",
  "浙江台州 · 临海市古渡口": "Gudukou, Linhai City, Taizhou, Zhejiang",
  "东山会稽谢氏一支南下，经临海古渡口进入台州腹地。": "A branch of the Xie family from Dongshan and Kuaiji went south and entered the hinterland of Taizhou via Linhai Ancient Ferry.",
  "𫔡【临海下渡祖】炎帝第122世／申伯第58世／临海下渡第1世。": "𫔡【Ancestor who went to the sea to cross the sea】The 122nd life of Emperor Yan/the 58th life of Shen Bo/the first life to go to the sea.",
  "临海为浙东南迁重要节点，由此再分迁石马（下谢）、天台等地。": "Linhai is an important node for the migration to the southeast of Zhejiang Province, from which it was further divided into Shima (Xiaxie), Tiantai and other places.",
  "⬇ 北上 ↓": "⬇ Go north ↓",
  "北宋": "Northern Song Dynasty",
  "北宋初": "Early Northern Song Dynasty",
  "小四公 · 石马（下谢）始祖": "Xiao Sigong·The ancestor of Shima (Xiaxie)",
  "浙江台州 · 三门县珠岙镇石马村": "Shima Village, Zhu'ao Town, Sanmen County, Taizhou, Zhejiang",
  "小四公，字聪孙。自临海下渡迁居石马（下谢），为入浙东之近祖，下枫槎谢氏之直系渊源也。": "Xiao Sigong, named Congsun. He moved to Shima (Xiaxie) from Xiadu, Linhai. He is a recent ancestor who entered eastern Zhejiang, and is directly related to the Xie family in Xiafengcha.",
  "【小四公／石马（下谢）】炎帝第130世／申伯第66世／石马（下谢）第1世。": "[Xiao Si Gong/Shi Ma (thank you below)] The 130th life of Emperor Yan/The 66th life of Shen Bo/The 1st life of Shi Ma (thank you below).",
  "传十二世": "Biography of the Twelve Generations",
  "约1125年 · 宣和年间": "About 1125·Xuanhe period",
  "文杲公 · 枫槎谢氏始迁祖": "Duke Wen Gao, the first ancestor of the Xie family in Fengcha",
  "浙江宁波 · 宁海县跃龙街道岩头下村": "Yantouxia Village, Yuelong Street, Ninghai County, Ningbo, Zhejiang",
  "文杲公，字克源，任越溪司巡检（今宁海越溪乡）。北宋宣和年间始居岩下，为枫槎谢氏始迁祖，至今近九百载，传三十六世。": "Wen Gaogong, whose courtesy name was Keyuan, was appointed as the inspection inspector of Yuexi Division (today's Yuexi Township, Ninghai). He first lived under the rock during the Xuanhe period of the Northern Song Dynasty and was the first ancestor of the Xie family in Fengcha. It has been passed down to thirty-six generations for nearly nine hundred years.",
  "攒公": "Mr. Chan",
  "后枫槎支系": "Houfengcha branch",
  "撰公": "Zhuan Gong",
  "前枫槎支系": "Former Fengcha branch",
  "明代": "Ming Dynasty",
  "1572年 · 隆庆壬申": "1572·Long Qingrenshen",
  "乾公 · 彬公 · 开基下枫槎": "Godfather · Binggong · Kaiji Xia Fengcha",
  "浙江宁波 · 宁海县跃龙街道望府村": "Wangfu Village, Yuelong Street, Ninghai County, Ningbo, Zhejiang",
  "十六世祖乾公、彬公昆仲，因岩下山洪暴发、庐舍尽毁，相度地势，遂迁于双枫古槎之下，命名\"下枫槎\"。斩荆棘、辟草莱，筑室开基，世代繁衍。": "The 16th generation ancestors Gan Gong and Bin Gong Kunzhong, due to a flash flood under the rock and the destruction of all the houses, they moved under the ancient Shuangfeng Cha and named it \"Xia Feng Cha\". Cut off thorns, plant grass and grass, build houses and lay foundations, and multiply from generation to generation.",
  "明隆庆六年（1572年）岩下山洪暴发": "In the sixth year of Longqing's reign in the Ming Dynasty (1572), a flash flood occurred at Yanxia",
  "，庐舍尽毁。乾公、彬公昆仲相度地势，迁于双枫古槎之下，因名\"下枫槎\"。—— 此次迁居是下枫槎谢氏发展史上最重要的转折点。": ", all the houses were destroyed. Qian Gong and Bin Gong Kun Zhong considered the terrain and moved under the ancient Shuangfeng Cha, hence the name \"Xia Feng Cha\". ——This relocation is the most important turning point in the development history of Xia Fengcha.",
  "开基立业 · 一脉繁衍": "Establishing a foundation and reproducing one line of business",
  "清代": "Qing Dynasty",
  "清乾隆年间": "Qianlong period of Qing Dynasty",
  "谢氏宗祠 · 敦睦堂": "Xie's Ancestral Hall · Dunmutang",
  "宁海 · 下枫槎村北": "Ninghai · North of Xiafengcha Village",
  "合族建宗祠于村北，三进两厢，门楣高悬\"谢氏宗祠\"匾额，堂号\"敦睦堂\"，寓敦宗睦族之意。春秋二祭，少长咸集，尊祖敬宗，礼行肃穆。": "The He clan built an ancestral hall in the north of the village, with three entrances and two wings. A plaque of \"Xie's Ancestral Hall\" hangs high on the lintel, and the hall name is \"Dunmutang\", which means Dunmutang. During the two festivals of Spring and Autumn, young and old gather together to honor their ancestors and conduct solemn etiquette.",
  "⬇ 传承至今 ↓": "⬇ Inherited to this day ↓",
  "当代": "contemporary",
  "2026年 · 丙午": "2026 · Bingwu",
  "今日下枫槎 · 传三十六世": "Today I went to Fengcha·Thirty-six generations",
  "浙江宁海 · 下枫槎村": "Ninghai, Zhejiang·Xiafengcha Village",
  "谱牒重修于丙午之春，建数字宗祠于云端，录世系于网络。四海宗亲虽隔山海，犹在目前。乌衣世泽，源远流长；宝树家声，继往开来。": "The genealogy was rebuilt in the spring of Bingwu, a digital ancestral hall was built in the cloud, and the lineage was recorded on the Internet. Although the clan members from all over the world are separated by mountains and seas, they are still present. The beauty of Wuyi Shize has a long history; the reputation of Baoshu family carries on the past and opens up the future.",
  "宗祠文化": "Ancestral Hall Culture",
  "下枫槎谢氏宗祠 · 精神的殿堂": "Xia Fengcha Xie Clan Ancestral Hall·The Palace of Spirit",
  "下枫槎谢氏宗祠始建于清乾隆年间（约1740年），坐北朝南，三进两厢格局。前为门厅，中为议事厅，后为供奉厅。祠堂雕梁画栋，木雕、石雕精湛，具有典型的浙东清代建筑风格。门楣上有\"谢氏宗祠\"匾额，笔力遒劲。堂内悬挂\"敦睦堂\"匾额，寓敦宗睦族之意。每年举行春秋两祭——春祭在清明前后，为扫墓祭祖；秋祭在冬至前后，为宗祠合祭。祭祀仪式遵循古礼，三牲祭品，焚香燃烛，族人按辈分列队行礼。祭后设宴，合族共叙亲情。每逢重大节庆或家族大事，亦在宗祠举行仪式。宗祠不仅是祭祖的场所，更是族人议事、教化、凝聚人心的重要空间。": "The Xie Clan Ancestral Hall in Xia Fengcha was built in the Qianlong period of the Qing Dynasty (about 1740). It faces south from the north and has a three-door and two-chamber layout. The front is the foyer, the middle is the meeting hall, and the back is the worship hall. The ancestral hall has carved beams and painted buildings, exquisite wood carvings and stone carvings, and has a typical Qing Dynasty architectural style in eastern Zhejiang. There is a plaque with \"Xie's Ancestral Hall\" on the lintel, which is written vigorously. There is a plaque \"Dun Mutang\" hanging in the hall, which means Dun Mu Tang. Two festivals are held in spring and autumn every year - the spring festival is held around the Qingming Festival, for sweeping tombs and worshiping ancestors; the autumn festival is held around the winter solstice, for ancestral halls. The sacrificial ceremony followed ancient rituals, with three animal sacrifices, incense and candles burned, and the tribesmen lined up to salute according to their seniority. After the sacrifice, a banquet is held to commemorate family ties. During major festivals or family events, ceremonies are also held in the ancestral hall. The ancestral hall is not only a place for worshiping ancestors, but also an important space for clan members to discuss affairs, educate and gather people's hearts.",
  "祖像": "ancestral statue",
  "祖宗遗像 · 万世瞻仰": "Portraits of Ancestors · Viewed by All Ages",
  "申伯": "Shen Bo",
  "谢姓鼻祖，扶周中兴，周宣王赐封于谢邑，子孙以谢为姓（摘自三门下谢谱）": "The originator of the surname Xie helped Zhou Zhongxing. King Xuan of Zhou granted him the title of Xie Yi, and his descendants took Xie as their surname (excerpted from the Xie genealogy under Sanmenxia).",
  "谢尚（308-357）": "Xie Shang (308-357)",
  "东晋名将，豫州刺史，领镇西将军（摘自下谢谱）": "A famous general in the Eastern Jin Dynasty, the governor of Yuzhou, and the general who led the town to the west (excerpted from the score below)",
  "东晋名将，历官冠军将军、前都督，以军功诏加七州大都督（摘自三门下谢宗谱）": "A famous general in the Eastern Jin Dynasty, a champion general and a former governor-general. He was awarded the title of governor-general of seven states for his military merits (excerpted from the genealogy of Sanmenxiaxie)",
  "东晋名相，赠太傅，谥文靖。淝水之战以八万兵战符坚八十万大军之胜，创中国历史上以少胜多战例史篇（摘自三门下谢宗谱）": "He was a famous prime minister in the Eastern Jin Dynasty and was given as a gift to Taifu, with the posthumous title Wenjing. The Battle of Feishui was a victory of 80,000 soldiers against Fu Jian's 800,000 troops, setting an example in Chinese history of winning more battles with less (excerpted from the Xie Genealogy of Sanmenxia)",
  "谢宏道": "Xie Hongdao",
  "字宏道，宋中叶张镇孙榜进士，历官国子监司（摘自三门下谢宗谱）": "The courtesy name is Hongdao. In the middle of the Song Dynasty, he was a Jinshi in the Sun List of Zhangzhen, and a senior official in the Imperial Academy (excerpted from Xie's genealogy under the Three Gates).",
  "南朝宋著名诗人，玄公之孙。十八岁封康乐公，世称谢康乐。入宋降公爵为侯爵。温州太守、秘书监、内史（摘自中国通史·榧树宗谱）": "A famous poet in the Southern Song Dynasty and the grandson of Duke Xuan. At the age of eighteen, he was granted the title of Duke Kang Le, and the world praised Kang Le. In the Song Dynasty, the Duke was demoted to Marquis. Wenzhou Prefect, Secretary Supervisor, Internal History (excerpted from General History of China·Torreya Genealogy)",
  "三世祖杲公，字克，枫槎始迁祖。宋登仕郎，英敏卓荦，文武兼备，任司巡检。岩下开基置产居卜": "The third generation ancestor Gao Gong, whose courtesy name was Ke, was the first to move to Fengcha. Deng Shilang of Song Dynasty, a wise and talented man with both civil and military skills, served as the inspection department. Founding a foundation under the rock to purchase property and divination",
  "小四公": "Little Sigong",
  "三门石马下谢始祖小四公（谢聪孙），朝奉郎谢奕信之孙、将仕郎兼文学家谢在纲之子": "Under the stone horse of the three gates are Xie's ancestor Xiao Sigong (grandson of Xie Cong), grandson of Xie Yixin, the court minister, and son of Xie Zaigang, a general and writer.",
  "四世（杲公长子）": "Fourth generation (eldest son of Duke Gao)",
  "四世杲公长子，宋仕工部侍中，性和厚，在位小心醇谨，葬石马龙头山之原": "The eldest son of the fourth Duke Gao, he was a minister of the Song Dynasty's Ministry of Industry and Commerce. He was kind-hearted and careful in his reign. He was buried on the site of Malongtou Mountain.",
  "三世榘公": "The third generation of Duke",
  "三世榘公，宋居士，下延邑城桃源祖，杲公胞弟。派下子孙邑城内东乡南乡西乡北乡各地。七世敬乙为复兴祖": "The third generation of Duke Chu was a lay scholar of the Song Dynasty. He was the ancestor of Taoyuan in Yanyi City and the younger brother of Duke Gao. He sent his descendants to various places in Dongxiang, Nanxiang, Xixiang and Beixiang in the city. The seventh generation honored Yi as the ancestor of Fuxing",
  "彬公": "Bin Gong",
  "十八世叔仅公长子，出仕明祭酒，冠带荣身，素有孝行（岁隆庆始迁今枫槎，居为东房祖）": "The 18th generation uncle was the eldest son of the Duke. He served as an official, offered sacrifices to wine, wore a royal crown, and had a long history of filial piety.",
  "五世攒公子，宋乡榜举人，好古力学，博通经史": "The son of the fifth generation, he was a good candidate in Songxiang. He was fond of ancient mechanics and had extensive knowledge of classics and history.",
  "乾公": "godfather",
  "十八世叔仅公次子，与兄同为省祭酒，冠带荣身，素有孝行（与兄同迁枫槎，派在西房之祖）": "The 18th generation uncle is the second son of the Duke. He and his elder brother are ministers to the province, and they have honorable bodies and filial piety.",
  "以上祖像均按页码顺序载于《枫槎谢氏宗谱》祖像篇（敦睦堂珍藏·公元二〇二六年丙午春重修）": "The above ancestral portraits are listed in page order in the ancestral portrait chapter of \"Fengcha Xie Family Genealogy\" (collected by Dunmutang, renovated in the spring of Bingwu, 2026 AD)",
  "查阅电子族谱 · 了解家族世系": "View electronic genealogy · Understand family lineage",
  "《下枫槎谢氏宗谱》": "\"Genealogy of the Xie Family in Xia Fengcha\"",
  "族谱是家族的历史典籍。下枫槎谢氏族谱历经续修，自宋绍兴间已有序文，清嘉庆、道光年间递有增补。公元二〇二六年（岁次丙午春）重修，敦睦堂珍藏，分上下两册，详录自炎帝以来世系传承与人物事迹。": "A genealogy is a family history book. The genealogy of the Xie family in Xia Fengcha has been continuously revised, with a preface since the Shaoxing period of the Song Dynasty, and additions during the Jiaqing and Daoguang years of the Qing Dynasty. It was rebuilt in 2026 AD (Bingwu Spring of the Year) and collected by Dunmutang. It is divided into two volumes, detailing the lineage and deeds of people since Emperor Yan.",
  "* 族谱查询需密码验证，请联系管理员获取权限": "* Genealogy query requires password verification, please contact the administrator to obtain permission",
  "荣誉墙 — 望府村 · 红头文件风": "Wall of Honor — Wangfu Village · Red-headed Document Style",
  "荣 誉 墙": "wall of honor",
  "宁海县跃龙街道望府村 · 历年荣誉汇集": "Wangfu Village, Yuelong Street, Ninghai County·A collection of honors over the years",
  "荣誉〔2026〕第 01 号": "Honor [2026] No. 01",
  "★ 永久": "★ permanent",
  "中共宁波市委 宁波市人民政府": "Ningbo Municipal Committee of the Communist Party of China Ningbo Municipal People's Government",
  "文明村": "Civilized Village",
  "经考核评定，授予宁海县跃龙街道望府村": "After assessment and evaluation, it was awarded to Wangfu Village, Yuelong Street, Ninghai County",
  "「文明村」": "\"Civilized Village\"",
  "荣誉称号。": "Honorary title.",
  "宁波": "Ningbo",
  "市委": "Municipal Party Committee",
  "中共宁波市委": "Ningbo Municipal Committee of the Communist Party of China",
  "宁波市人民政府": "Ningbo Municipal People's Government",
  "荣誉〔2007〕第 02 号": "Honor [2007] No. 02",
  "宁波生态市建设工作领导小组办公室": "Ningbo Ecological City Construction Leading Group Office",
  "宁波市级生态村": "Ningbo Municipal Ecological Village",
  "「宁波市级生态村」": "\"Ningbo Municipal Ecological Village\"",
  "二〇〇七年二月": "February 2007",
  "荣誉〔2007〕第 03 号": "Honor [2007] No. 03",
  "宁波市爱国卫生运动委员会": "Ningbo Patriotic Health Campaign Committee",
  "卫生村": "health village",
  "经考核评定，授予宁波市望府村": "After assessment and evaluation, it was awarded to Wangfu Village, Ningbo City",
  "「卫生村」": "\"Health Village\"",
  "二〇〇七年十二月": "December 2007",
  "荣誉〔2020〕第 04 号": "Honor [2020] No. 04",
  "中共宁波市委宣传部 等": "Propaganda Department of Ningbo Municipal Committee of the Communist Party of China, etc.",
  "宁波市书香文化礼堂": "Ningbo Scholarly Culture Auditorium",
  "「宁波市书香文化礼堂」": "\"Ningbo Scholarly Culture Auditorium\"",
  "中共宁波市委宣传部": "Propaganda Department of Ningbo Municipal Committee of the Communist Party of China",
  "宁波市农村文化礼堂建设领导小组办公室": "Ningbo Rural Cultural Auditorium Construction Leading Group Office",
  "二〇二〇年十二月": "December 2020",
  "荣誉〔2021〕第 05 号": "Honor [2021] No. 05",
  "宁波市妇女联合会 宁波市民政局": "Ningbo Women's Federation Ningbo Civil Affairs Bureau",
  "儿童之家": "children's home",
  "「儿童之家」": "\"Children's Home\"",
  "（示范型）荣誉称号。": "(Exemplary) honorary title.",
  "宁波市妇女联合会": "Ningbo Women's Federation",
  "宁波市民政局": "Ningbo Civil Affairs Bureau",
  "二〇二一年二月": "February 2021",
  "荣誉〔2022〕第 06 号": "Honor [2022] No. 06",
  "宁波市住房和城乡建设局": "Ningbo Municipal Housing and Urban-Rural Development Bureau",
  "宁波市安居示范村": "Ningbo Anju Demonstration Village",
  "「宁波市安居示范村」": "\"Ningbo Anju Demonstration Village\"",
  "二〇二二年": "2022",
  "荣誉〔2023〕第 07 号": "Honor [2023] No. 07",
  "宁波市精神文明建设指导委员会办公室": "Ningbo Spiritual Civilization Construction Steering Committee Office",
  "新时代文明实践示范站": "New Era Civilized Practice Demonstration Station",
  "「新时代文明实践示范站」": "\"New Era Civilization Practice Demonstration Station\"",
  "二〇二三年三月": "March 2023",
  "荣誉〔2023〕第 08 号": "Honor [2023] No. 08",
  "中共宁波市委组织部": "Organization Department of Ningbo Municipal Committee of the Communist Party of China",
  "五星级基层党组织": "Five-star grassroots party organization",
  "「五星级基层党组织」": "\"Five-star grassroots party organization\"",
  "荣誉〔2023〕第 09 号": "Honor [2023] No. 09",
  "中共浙江省委宣传部 等": "Propaganda Department of Zhejiang Provincial Committee of the Communist Party of China, etc.",
  "文化礼堂": "Cultural Auditorium",
  "经考核评定，宁海县跃龙街道望府村文化礼堂荣获": "After assessment and evaluation, the Wangfu Village Cultural Hall of Yuelong Street, Ninghai County won the",
  "「五星级」": "\"Five stars\"",
  "评定。": "assessment.",
  "中共浙江省委宣传部": "Propaganda Department of the Zhejiang Provincial Committee of the Communist Party of China",
  "浙江省农村文化礼堂建设工作领导小组办公室": "Zhejiang Provincial Rural Cultural Auditorium Construction Leading Group Office",
  "二〇二三年四月": "April 2023",
  "荣誉〔2023〕第 10 号": "Honor [2023] No. 10",
  "宁波市民族宗教事务局": "Ningbo Ethnic and Religious Affairs Bureau",
  "重点培育单位": "Key training units",
  "经考核评定，宁波市民族团结进步创建": "After assessment and evaluation, Ningbo City’s National Unity and Progress Foundation was established",
  "「重点培育单位」": "\"Key training unit\"",
  "——望府村。": "——Wangfu Village.",
  "二〇二三年十月": "October 2023",
  "荣誉〔2024〕第 11 号": "Honor [2024] No. 11",
  "浙江省人力资源和社会保障厅": "Zhejiang Provincial Department of Human Resources and Social Security",
  "优秀单位": "Excellent unit",
  "2023年度返乡入乡合作创业考核，宁海县跃龙街道望府村被评为": "In the 2023 return to hometown cooperation and entrepreneurship assessment, Wangfu Village, Yuelong Street, Ninghai County was rated as",
  "「优秀单位」": "\"Excellent Unit\"",
  "二〇二四年三月": "March 2024",
  "荣誉〔2024〕第 12 号": "Honor [2024] No. 12",
  "宁波市民间文艺家协会": "Ningbo Folk Writers and Artists Association",
  "宁波市茶文化特色村": "Ningbo Tea Culture Characteristic Village",
  "授予宁海县跃龙街道望府村": "Awarded to Wangfu Village, Yuelong Street, Ninghai County",
  "「宁波市茶文化特色村」": "\"Ningbo Tea Culture Characteristic Village\"",
  "展开": "Expand",
  "盖闻水有源而流派长，木有本而枝叶茂。族之有谱，犹国之有史。谱者，纪世系、序昭穆、联族谊、垂后昆，立族之大典也。昔苏老泉作族谱引，有感于一人之身分而至于途人，良可慨也。是以君子务本，尊祖敬宗，敬宗收族，此修谱之义也。": "Gai Wen said that when water has a source, its branches will grow, and when trees have roots, their branches and leaves will be luxuriant. A family has a genealogy, and a country has a history. The genealogist records the lineage of generations, prefaces Zhaomu, unites clan friendships, and descends to Kun, which is the grand ceremony of establishing a clan. In the past, when Su Laoquan was writing a genealogy guide, he was inspired by one person's identity and passed it on to passers-by, which was very touching. Therefore, a gentleman should respect his roots, respect his ancestors, respect his ancestors, and collect his clan. This is the meaning of cultivating genealogy.",
  "溯吾谢氏，出自炎帝，为姜姓。周宣王封申伯于谢邑，子孙以国为氏。自申伯肇基，传三十六世至东山会稽，族始大显。": "The Xie family of Suwu came from Emperor Yan and was named Jiang. King Xuan of Zhou granted Shen Bo the title of Xie Yi, and his descendants took the country as their surname. From Shenbo Zhaoji, it was passed down for thirty-six generations to Kuaiji, Dongshan, where the clan began to show its prominence.",
  "，淝水一战功盖寰宇；幼度公武略安邦，灵运公文采耀世。乌衣世泽，宝树家声，于斯为盛。唐有偃公，宋有翱、翔二公位列台阁，洎乎南宋，": ", Fei Shui's battle achievements have touched the whole world; young Duke Gong's military strategy has brought peace to the country, and his dexterity and official documents have shone in the world. Wuyi Shize, Baoshu family reputation, this is the most prosperous. In the Tang Dynasty, there was Duke Yan, and in the Song Dynasty, there were two Dukes, Ao and Xiang, who were ranked in the Taige. Even in the Southern Song Dynasty,",
  "位至右丞相，封鲁国公，一代名臣。簪缨不绝，世称望族。": "He became the prime minister on the right, was granted the title of Duke of Lu, and became a famous official of his generation. The hairpins are endless, and the family is known as a distinguished family in the world.",
  "其后由会稽南下，至石马小四公，为入浙东之近祖。北宋宣和间，": "Then he went south from Kuaiji to Shimaxiaosigong, becoming his recent ancestor who entered eastern Zhejiang. During the Xuanhe period of the Northern Song Dynasty,",
  "迁居宁海岩下，任越溪司巡检，为枫槎谢氏始迁祖，垂今九百载。明隆庆壬申，": "He moved to the foot of Ninghaiyan and served as an inspector of the Yuexi Division. He was the first ancestor of the Xie family in Fengcha and has lived for nine hundred years. Minglong Qingrenshen,",
  "遭洪患，自岩下迁双枫古槎之下，开基立业，垂今四百五十余载，历十六世，瓜瓞绵绵，为南乡之巨族。": "Affected by floods, he moved from Yanxia to the ancient Shuangfeng tree and established a business that has lasted for more than 450 years and lasted for 16 generations. With endless melon fields, he became a giant in Nanxiang.",
  "夫家国一理，族运系乎文脉。三千余载世变迭经而宗风不坠者，非徒血脉之绵延，实精神之相续也。其间播迁之艰、开拓之勇、守成之毅、兴发之智，皆载于谱牒，铭于人心。修谱非惟纪事，乃所以立心；建祠非惟崇祀，乃所以聚魂。魂聚则族强，心立则道远。": "The husband's family and country are the same, and the fate of the family is related to the cultural context. For more than three thousand years, the sect's style has not declined despite the many changes in the world. This is not due to the continuity of the bloodline, but to the continuity of the spirit. During this period, the difficulties of transplantation, the courage to pioneer, the perseverance to maintain success, and the wisdom to thrive are all recorded in the genealogy and engraved in people's hearts. Compiling genealogies is not just to record events, but to establish one's mind; building a temple is not just to worship, but to gather souls. If the soul is gathered together, the clan will be strong, but if the heart is strong, the road will be long.",
  "本届修谱，族长": "This year's genealogy revision, the patriarch",
  "总其事，主修": "In short, majoring in",
  "二公董全局，监修": "Ergong Dong overall, supervision",
  "二公协庶务，秉修": "The second public servant assists in general affairs and upholds repairs",
  "考世系，历数载告成，诚继往开来之功也。": "Testing the lineage has been successful for several years, and it is a contribution to the past and the future.",
  "宗祠者，一族之根本。奉先思孝，睦族敦伦，建祠与修谱并重，不可偏废。乙巳（2025）三月宗祠修缮肇兴，至七月告成。族人踊跃捐资，共襄义举。丙午（2026）四月初一，圆谱大典颁谱祭祖，盛况空前。阖族及外来宗亲、社会各界踊跃捐资贺仪，其情可感。两项捐款明细，皆勒石镌碑，昭示后人，俾先德永垂不朽。": "The ancestral hall is the foundation of a clan. Paying equal attention to the construction of ancestral halls and the compilation of genealogies should not be neglected. In Yisi (2025), the ancestral hall was renovated in March and completed in July. The clan members enthusiastically donated money and participated in the charity event. On the first day of April in Bingwu (2026), the Yuan Pu Ceremony was held to award the music spectrum and worship the ancestors, which was an unprecedented grand event. The whole family, extended family members, and all walks of life enthusiastically donated money to congratulate the ceremony, and their sentiments can be appreciated. The details of the two donations are engraved on stone tablets to show to future generations, so that the late ancestors will be immortalized.",
  "尤有进者，族中贤达慷慨解囊，外来宗亲盛情贺仪，令人感佩。其余诸君，或捐万金，或助数千，多寡有别而尊祖敬宗之心则一。修谱以存世系，建祠以奉先祖，捐资以助其成，勒名以彰其德，其事殊而其义一。今按捐资多寡，分列卷轴，各标芳名，彰善励后。庶几继往开来，永世其昌。": "Especially for those who have advanced, the sages of the clan generously donated money, and the relatives from outside extended their congratulations, which is admirable. The rest of the monarchs may donate tens of thousands of gold, or help thousands. The amount is different, but the heart of respecting the ancestors is the same. Revise genealogies to preserve the lineage, build temples to honor ancestors, donate funds to help them succeed, and confer names to highlight their virtues. These things are special but have the same meaning. Today, the scrolls are arranged according to the amount of donations, and each one is marked with a name to highlight the good deeds and encourage the descendants. The common people will carry on the past and open up the future, and they will be prosperous forever.",
  "是为序。以志先德，以勖后人。": "It's the order. Virtue precedes ambition, and descends with Xu.",
  "公元二〇二六年岁次丙午夏月 · 下枫槎谢氏阖族敬立": "In the summer month of Bingwu in the year 2026 AD, the Xie family in Xia Fengcha stood in honor.",
  "我的 · 下枫槎谢氏": "My · Xia Fengcha Xie",
  "下枫槎村地处宁海山区，群山环抱，溪水长流，气候温和湿润，土壤肥沃，得天独厚的自然环境孕育了丰富的物产。自古以来，村民以农耕为本，兼营林、茶、烟等产业。近年来，在乡村振兴战略的引领下，下枫槎村大力发展特色农业和生态产业，各类物产品质优良，远近闻名。": "Xia Fengcha Village is located in the Ninghai Mountains, surrounded by mountains, long streams, mild and humid climate, fertile soil, and a unique natural environment that has given birth to rich products. Since ancient times, the villagers have been based on farming and also engage in forestry, tea, tobacco and other industries. In recent years, under the guidance of the rural revitalization strategy, Xia Fengcha Village has vigorously developed characteristic agriculture and ecological industries. The high quality of various products has made them famous far and wide.",
  "🍵 望海茶 · 下枫槎云雾茶": "🍵 Wanghai Tea · Xia Fengcha Yunwu Tea",
  "高山云雾出好茶 · 下枫槎村的绿色名片": "High mountain clouds produce good tea·The green business card of Xia Fengcha Village",
  "茶韵悠长": "Tea has a long flavor",
  "下枫槎村地处宁海西部山区，茶园多分布在海拔300-600米的山坡上。这里终年云雾缭绕，昼夜温差大，土壤富含有机质，非常适宜茶树生长。出产的望海茶色泽翠绿、香气清高、滋味鲜爽、汤色明亮，是宁海茶叶中的上品。每年清明前后，茶农开始采摘春茶，一叶一芽，手工炒制，产量虽不多，但品质极佳，深受茶客喜爱。": "Xia Fengcha Village is located in the western mountainous area of Ninghai. Tea gardens are mostly distributed on hillsides with an altitude of 300-600 meters. It is surrounded by clouds and mist all year round, has a large temperature difference between day and night, and the soil is rich in organic matter, which is very suitable for the growth of tea trees. The Wanghai tea produced is emerald green in color, clear in aroma, refreshing in taste, and bright in color. It is the top grade of Ninghai tea. Every year around the Qingming Festival, tea farmers begin to pick spring tea, one leaf and one bud, and fry it by hand. Although the yield is not large, the quality is excellent and is deeply loved by tea drinkers.",
  "采摘与制作": "Picking and Making",
  "下枫槎茶园坚持传统农法种植，不施化肥、不打农药。春茶于清明前后开采，严格遵循\"一芽一叶\"标准。制作工艺传承宁海传统炒青技法：杀青、揉捻、烘干，每一道工序都由经验丰富的茶农手工完成。制成的茶叶外形紧结匀整，冲泡后茶汤碧绿明亮，入口甘醇，回味悠长。下枫槎云雾茶年产量约2000斤，多为老客户预订，供不应求。": "Xia Fengcha Tea Garden adheres to traditional farming methods and does not use chemical fertilizers or pesticides. Spring tea is mined around Qingming and strictly follows the \"one bud, one leaf\" standard. The production process inherits Ninghai's traditional tea-frying techniques: greening, rolling, and drying. Each process is completed by experienced tea farmers. The shape of the tea leaves is tight and even. After brewing, the tea soup is green and bright, with a sweet and mellow taste and a long aftertaste. The annual output of Xia Fengcha Yunwu tea is about 2,000 kilograms, mostly reserved by old customers, and demand exceeds supply.",
  "📞 茶叶订购请联系村委会 · 电话：（信息更新中）": "📞 To order tea, please contact the village committee · Telephone: (information is being updated)",
  "🌿 烤烟种植": "🌿 Flue-cured tobacco cultivation",
  "传统经济支柱 · 匠心烘烤": "Traditional economic pillar · Ingenious baking",
  "📋 产业概况": "📋 Industry Overview",
  "烤烟是下枫槎村的传统经济作物，有着数十年的种植历史。村内拥有标准化烤房设施，烟叶种植、烘烤技术成熟。烤烟产业为村民提供了稳定的收入来源，是下枫槎村农业经济的重要组成部分。": "Flue-cured tobacco is a traditional cash crop in Xia Fengcha Village and has been cultivated for decades. The village has standardized curing facilities and mature tobacco planting and baking technologies. The flue-cured tobacco industry provides a stable source of income for villagers and is an important part of the agricultural economy of Xia Fengcha Village.",
  "🔥 烘烤工艺": "🔥 Baking process",
  "下枫槎烤烟采用先进的密集烤房烘烤技术，严格把控温湿度曲线。从鲜烟叶采摘到烘烤完成，历时约7-8天。烤后烟叶色泽金黄、油润丰满、香气醇和，品质优良，深受烟草公司青睐。": "Xia Fengcha flue-cured tobacco adopts advanced intensive oven baking technology and strictly controls the temperature and humidity curve. From the picking of fresh tobacco leaves to the completion of baking, it takes about 7-8 days. After curing, the tobacco leaves are golden in color, plump and oily, and have a mellow aroma. They are of high quality and are favored by tobacco companies.",
  "🌾 高山生态农业": "🌾Alpine ecological agriculture",
  "绿色有机 · 健康本味": "Green organic · healthy taste",
  "高山玉米": "alpine corn",
  "下枫槎山地玉米，生长在海拔400米以上的山坡地。因昼夜温差大、光照充足，玉米颗粒饱满、香甜可口。每年夏秋两季收获，是村民喜爱的传统粮食作物。": "Xia Fengcha mountain corn grows on hillside areas above 400 meters above sea level. Due to the large temperature difference between day and night and sufficient light, the corn kernels are plump, sweet and delicious. Harvested in summer and autumn every year, it is a traditional food crop loved by villagers.",
  "高山黄豆": "Alpine soybeans",
  "下枫槎高山黄豆，传统品种，不施化肥农药。豆粒饱满、蛋白质含量高。可制作豆腐、豆浆、豆酱等传统豆制品，是村民餐桌上的健康食材。": "Xia Fengcha alpine soybeans are traditional varieties and do not use chemical fertilizers or pesticides. The beans are plump and have high protein content. It can make traditional soy products such as tofu, soy milk, and bean paste, which are healthy ingredients on the villagers' table.",
  "竹笋山珍": "Bamboo shoots and mountain delicacies",
  "下枫槎村竹林资源丰富，每年春季和冬季出产大量鲜笋。春笋鲜嫩爽脆，冬笋细腻甘甜，是宁海地区的山林珍品。村民将竹笋制成笋干、酸笋等特产，四季皆可享用。": "The bamboo forest in Xia Fengcha Village is rich in resources and produces a large number of fresh bamboo shoots every spring and winter. Spring bamboo shoots are tender and crispy, while winter bamboo shoots are delicate and sweet. They are mountain treasures in the Ninghai area. Villagers make bamboo shoots into dried bamboo shoots, sour bamboo shoots and other specialties, which can be enjoyed in all seasons.",
  "🏡 农家特产": "🏡Farm specialties",
  "地道农家味 · 纯手工制作": "Authentic farmhouse flavor·Purely handmade",
  "高山蜂蜜": "alpine honey",
  "山中放养土蜂，采集百花精华，蜜质浓郁，具有独特的花果香。每年割蜜两次，产量稀少。": "Bumblebees are raised in the mountains to collect the essence of flowers. The honey is rich in texture and has a unique floral and fruity aroma. Honey is harvested twice a year and the yield is sparse.",
  "山茶油": "Camellia oil",
  "野生山茶籽压榨而成，色泽金黄透亮，营养丰富，是当地传统的健康食用油，有\"东方橄榄油\"之美誉。": "Made from pressed wild camellia seeds, it is golden and translucent in color and rich in nutrients. It is a traditional local healthy edible oil and is known as \"Oriental Olive Oil\".",
  "农家腌菜": "Farm Pickles",
  "村民遵循古法腌制的雪里蕻、酸菜等传统腌菜，风味独特，是下枫槎人家餐桌上的必备小菜。": "Villagers pickle mustards, sauerkraut and other traditional pickled vegetables according to ancient methods. They have unique flavors and are essential side dishes on the tables of people in Xia Fengcha.",
  "农家米酒": "Farm rice wine",
  "用高山糯米和山泉水，依传统工艺酿造。酒色清澈，入口甘甜醇厚，是节庆待客的佳酿。": "It is brewed with high mountain glutinous rice and mountain spring water according to traditional techniques. The wine is clear in color and sweet and mellow in the mouth. It is a good wine for entertaining guests at festivals.",
  "绿色发展 · 品牌强农": "Green Development · Brand Strengthens Agriculture",
  "近年来，下枫槎村依托良好的生态环境和特色农产品资源，积极探索\"农业+旅游+品牌\"的发展模式。通过注册农产品商标、建设电商平台、发展乡村旅游等方式，让深山里的优质农产品走出大山，让更多人品尝到下枫槎的味道。": "In recent years, Xiafengcha Village has actively explored the development model of \"agriculture + tourism + brand\" relying on its good ecological environment and characteristic agricultural product resources. By registering agricultural product trademarks, building e-commerce platforms, and developing rural tourism, high-quality agricultural products from deep mountains can be brought out of the mountains, allowing more people to taste the taste of Xia Fengcha.",
  "未来，下枫槎村将继续坚持绿色发展理念，保护好这片绿水青山，同时大力发展特色农业和乡村旅游，让乡村物产成为村民增收致富的\"金钥匙\"，让更多人了解下枫槎、走进下枫槎、爱上枫槎。": "In the future, Xia Fengcha Village will continue to adhere to the concept of green development, protect this green water and green mountains, and at the same time vigorously develop characteristic agriculture and rural tourism, making rural products the \"golden key\" for villagers to increase their income and become rich, and let more people know about Xia Fengcha, visit Xia Fengcha, and fall in love with Fengcha.",
  "七殿庙 · 红岩潭 · 望府楼山 · 枫槎岭 · 古井 · 祠堂": "Qidian Temple · Hongyan Pond · Wangfulou Mountain · Fengcha Ridge · Ancient Well · Ancestral Hall",
  "⛩️ 七殿庙": "⛩️ Qidian Temple",
  "七殿庙位于下枫槎村北面500米的西山山脚，因原有殿七个，故称": "Qidian Temple is located at the foot of Xishan Mountain, 500 meters north of Xia Fengcha Village. It was named because it originally had seven temples.",
  "七殿庙": "Qidian Temple",
  "，主奉玉皇大帝。约建于清代中期，距今200余年历史。": ", dedicated to the Jade Emperor. It was built around the middle of the Qing Dynasty and has a history of more than 200 years.",
  "庙坐东朝西，有正殿三间、厢房二间、庭院100余平方米。正殿正中奉": "The temple faces east and west, with three main halls, two wing rooms and a courtyard of more than 100 square meters. In the middle of the main hall",
  "玉皇大帝与王母娘娘": "The Jade Emperor and the Queen Mother",
  "，东边为土地爷、土地婆，西边为财神菩萨、文昌菩萨，两侧奉四大金刚。文革中遭破坏，1993年10月村民集资重修。": ", to the east are Tu Tuye and Tutu Po, to the west are Wealth Bodhisattva and Wenchang Bodhisattva, with the four King Kongs on both sides. It was destroyed during the Cultural Revolution, and villagers raised funds to rebuild it in October 1993.",
  "庙中有": "There is in the temple",
  "玉皇大帝抬阁": "The Jade Emperor raises his pavilion",
  "一尊。每逢村里重大喜庆或演戏，则由四人将玉皇大帝（当地称\"正主人爷\"）扛出，敲锣打鼓进行游行，一时热闹非凡。": "One statue. Whenever there is a major festival or performance in the village, four people will carry out the Jade Emperor (locally known as \"the real master\") and parade with gongs and drums, which is a lively event.",
  "💧 红岩潭": "💧 Hongyantan",
  "红岩潭位于望府楼山北面、山顶两峰之间。因村民每逢干旱均来此祈雨，故又名": "Hongyantan is located on the north side of Wangfulou Mountain and between the two peaks on the top of the mountain. Because villagers come here to pray for rain every time there is a drought, it is also called",
  "龙潭": "longtan",
  "。据旧志载，此潭径尺许，清且深。": ". According to old records, this pool is about a foot in diameter, clear and deep.",
  "今潭口有所扩大，但亦仅": "Today Tankou has been enlarged, but only",
  "1米": "1 meter",
  "。潭水清澈，冬暖夏凉。遇干旱，潭面大不过尺、深仅数寸，但泉水汩汩而流，": ". The water in the pool is clear, warm in winter and cool in summer. In the event of drought, the pool is no larger than a foot and only a few inches deep, but the spring water flows gurglingly.",
  "长年不涸": "Lasts all year round",
  "据《光绪宁海县志》载，望鼓楼山顶有石棋坪，旁有红岩潭，秋夏之际，": "According to the \"Guangxu Ninghai County Chronicle\", there is Shiqiping on the top of the Wanggu Tower and a red rock pool next to it. In autumn and summer,",
  "\"潭中云起，风雨立至\"": "\"The clouds are rising in the pond, and the wind and rain are coming\"",
  "。因而被村民目为龙潭。每逢大旱，一市、水车等地村民均来此求雨——扛龙旗、敲锣打鼓、焚香叩拜，往往十分灵验，遂至名声大振。": ". Therefore, it is called Longtan by the villagers. Whenever there is a severe drought, villagers from the city, waterwheel and other places come here to pray for rain - carrying dragon flags, beating gongs and drums, burning incense and worshiping, which is often very effective and has become famous.",
  "\"琅玗双石认仙踪，何事烂柯不再逢。": "\"The two stones of Langjue recognize the trace of the fairy. If anything dies, we will never meet again.\"",
  "想是乘槎游海上，残坪千载白云封。\"": "I think I am traveling on a boat on the sea, and the remaining ground is covered with white clouds for thousands of years. \"",
  "—— 明 · 宁海诗人禇传中《石棋坪》": "——\"Shiqiping\" in the biography of Ninghai poet Chu, Ming Dynasty",
  "⛰️ 望府楼山": "⛰️ Wangfulou Mountain",
  "望府楼山": "wangfulou mountain",
  "位于下枫槎村庄南面，原名\"望鼓楼山\"，因山顶二山尖正对县城礁楼而得名，后谐音为望府楼山。主峰海拔": "Located in the south of Xia Fengcha Village, it was originally called \"Wanggulou Mountain\". It was named because the two peaks on the top of the mountain are facing the county's reef tower. Later, it was pronounced as Wangfulou Mountain. Main peak altitude",
  "523.3米": "523.3 meters",
  "，属我县南部干山，南接新岭，东北连枫槎岭。": ", belongs to Ganshan Mountain in the south of our county, connected to Xinling in the south and Fengcha Ridge in the northeast.",
  "山原多松、柴，1965年村民在山麓开发茶叶种植，现茶园2000余亩，成为我县茶叶重要产地，所产": "The mountain plain is rich in pine and firewood. In 1965, villagers developed tea planting at the foot of the mountain. There are now more than 2,000 acres of tea gardens, which has become an important tea production area in our county.",
  "望府银毫": "Wang Fu Yin Hao",
  "被农业部评为全国名茶。": "It was rated as a national famous tea by the Ministry of Agriculture.",
  "山顶有": "There is",
  "石棋坪": "Shiqiping",
  "（今已废），旁有": "(now obsolete), next to",
  "红岩潭": "Hongyantan",
  "。明诗人禇传中有《石棋坪》诗咏之。秋夏之际潭中云起，风雨立至，向为祈雨灵地。": ". Ming poet Chu Chuan has a poem about Shiqiping. In autumn and summer, clouds rise in the pond, and the wind and rain are approaching, making it a spiritual place to pray for rain.",
  "🛤️ 枫槎岭": "🛤️ Fengchaling",
  "枫槎岭位于下枫槎村东南。据传晋代高僧": "Fengcha Ridge is located southeast of Xia Fengcha Village. It is said that eminent monks of Jin Dynasty",
  "昙猷": "Tan You",
  "为弘扬佛法，乘": "In order to promote Buddhism,",
  "（枫树独木舟）踏海而来，弃槎上岭，岭遂名": "(Maple Canoe) came from the sea and abandoned the canoe to reach the ridge, hence the name of the ridge.",
  "。这是村庄得名的由来。": ". This is how the village got its name.",
  "枫槎岭全长近": "The total length of Fengcha Ridge is nearly",
  "20里": "20 miles",
  "，高点海拔261米，系县城通向东南七市、一市一带的重要交通要道。至岭顶分路两条，东南向至七市、南向至一市。顶上有路廊与庙，供行人歇息饮水，庙奉赵玄坛（赵公元帅），保佑行路之人平安。": ", the highest point is 261 meters above sea level, and it is an important transportation artery leading from the county to seven cities and one city in the southeast. There are two roads to the top of the mountain, one running southeast to Seventh City and the other south to First City. There are corridors and temples on the top for pedestrians to rest and drink water. The temple is dedicated to Zhao Xuantan (Marshal Zhao Gong) to protect the safety of travelers.",
  "\"廿里枫槎岗，好人挖黄胖\"": "\"Ninli Fengchagang, good people poach Huang Pang\"",
  "——在七市、一市通公路之前，枫槎岭是县城通东南唯一便捷的通道。山两边的货物、农产品、海鲜都要通过这里运送，全靠步行挑担，十分辛苦。": "——Before seven cities and one city were connected to highways, Fengcha Ridge was the only convenient passage from the county seat to the southeast. Goods, agricultural products, and seafood on both sides of the mountain have to be transported through here, and they all have to be carried on foot, which is very hard.",
  "直至1977年宁海至一市公路开通，两地民众才彻底告别枫槎岭。2008年枫槎岭隧道通车，联接同三高速，彻底解决了城乡交通瓶颈。": "It was not until the opening of the highway from Ninghai to Yishi in 1977 that the people of the two places said goodbye to Fengchaling. In 2008, the Fengchaling Tunnel was opened to traffic and connected to the Tongsan Expressway, completely solving the urban and rural traffic bottleneck.",
  "💧 古井遗存": "💧 Remains of ancient wells",
  "半边井": "half well",
  "位于村西北路口，因井面仅半幅，故名": "It is located at the northwest intersection of the village. It is named because the well surface is only half of the area.",
  "。现有井面50余平方米，原系泥坎，1998年重修砌石。井水来自高山，": ". The existing well covers an area of ​​more than 50 square meters. It was originally a mud sill and was rebuilt with stonework in 1998. Well water comes from high mountains,",
  "十分清澈，冬暖夏凉": "Very clear, warm in winter and cool in summer",
  "，向为村民洗涤用井，名闻周边，水车一带村民亦多来此洗刷。": "The well is famous for being used by villagers for washing, and many villagers from the waterwheel area also come here to wash themselves.",
  "三角井": "triangle well",
  "位于村北一百米处，因井形似三角，故名": "Located one hundred meters north of the village, the well is named because it is shaped like a triangle.",
  "。夏秋之际水量很大，奔腾而入，又名": ". During summer and autumn, there is a lot of water, rushing in, also known as",
  "长虎潭": "changhutan",
  "。井大近30平方米，井水洁白清澈，冬不冻手。村民多在此洗衣淘米，井边建有15米长廊，成为村民夏日纳凉歇息之所。": ". The well is nearly 30 square meters in size. The water in the well is white and clear, and your hands will not freeze in winter. Villagers mostly wash clothes and wash rice here. There is a 15-meter long corridor built beside the well, which becomes a place for villagers to cool down and rest in summer.",
  "🏛️ 谢家祠堂与\"为国立功\"匾": "🏛️ Xie Family Ancestral Hall and the plaque of \"Serving the Country\"",
  "谢家祠堂位于下枫槎村中心。据村民传说，谢氏始祖自明隆庆年间自双溪岩头下迁居此处后，宗族兴旺，遂在清初": "The Xie Family Ancestral Hall is located in the center of Xia Fengcha Village. According to villagers' legend, the ancestor of the Xie family moved here from Shuangxi Yantou during the Longqing period of the Ming Dynasty. The clan prospered, and then in the early Qing Dynasty",
  "康熙年间": "Kangxi period",
  "建祠堂，以祭祀祖先、教化后人，距今近300年历史。": "Ancestral halls were built to worship ancestors and educate descendants. It has a history of nearly 300 years.",
  "今祠堂系": "Today's ancestral hall system",
  "2004年重建": "Rebuilt in 2004",
  "，总占地面积450余平方米，北为4间大厅，南为戏台，左右两侧有6间厢房。堂号": ", covering a total area of more than 450 square meters, with 4 halls in the north, a stage in the south, and 6 wing rooms on the left and right sides. Hall number",
  "\"敦睦堂\"": "\"Dunmutang\"",
  "，寓敦宗睦族之意。": ", which means to uphold the clan and harmonize the clan.",
  "祠堂藏有": "The ancestral hall contains",
  "\"为国立功\"匾额": "\"Serving the country\" plaque",
  "，系民国四年（1915）浙江陆军第一师师长": ", the commander of the First Division of the Zhejiang Army in the fourth year of the Republic of China (1915)",
  "叶颂清": "Ye Songqing",
  "题字颁发，以表彰下枫槎谢氏英烈": "The inscription was awarded in recognition of the heroes and martyrs of Xia Fengcha",
  "。谢学良为第一师士兵，在辛亥革命光复杭州、南京的战斗中英勇作战，为国捐躯。今匾额完好。": ". Xie Xueliang was a soldier of the First Division. He fought bravely in the battle to regain Hangzhou and Nanjing during the Revolution of 1911 and died for his country. Today the plaque is intact.",
  "修祠堂捐款名录 · 碑记": "List of donations for temple repairs·Inscriptions",
  "修祠堂捐款名录": "List of donations for temple repairs",
  "世忠": "Shizhong",
  "拾萬圓": "One hundred thousand yuan",
  "行龙": "Xinglong",
  "伟中": "Wei Zhong",
  "伍萬圓": "Wu Wanyuan",
  "云国": "Yunguo",
  "叁萬捌": "Thirty thousand eight",
  "海港": "harbor",
  "貳萬圓": "Twenty thousand yuan",
  "平彪": "Ping Biao",
  "世能": "Shi Neng",
  "壹萬圓": "One thousand yuan",
  "行尉": "Xingwei",
  "建国": "Jianguo",
  "世夫": "Shifu",
  "高飞": "fly high",
  "京翰": "Jinghan",
  "行安": "Travel safely",
  "海飞": "Haifei",
  "世省": "world province",
  "永军": "Yongjun",
  "建杰": "Jianjie",
  "伍仟圓": "Five thousand yuan",
  "中良": "Zhongliang",
  "行平": "Yukihira",
  "会福": "Blessing",
  "世彩": "world color",
  "叁仟圓": "Three thousand yuan",
  "行海": "Traveling to the sea",
  "建禄": "Jianlu",
  "孝满": "Takaman",
  "伟国": "great country",
  "貳仟圓": "Two thousand yuan",
  "建军": "Jianjun",
  "兴隆": "prosperous",
  "海峰": "Haifeng",
  "孝弟": "filial brother",
  "壹仟圓": "One thousand yuan",
  "孝强": "Xiaoqiang",
  "孝国": "Filial piety",
  "湖北": "hubei",
  "壹仟貳": "One thousand two",
  "公元二〇二六年 · 下枫槎谢氏阖族敬立": "A.D. 2026 · Xia Fengcha’s Xie family members stood in honor of each other",
  "荣誉 · 组织 · 物产": "Honor · Organization · Property",
  "点击展开 · 荣耀时刻": "Click to expand · Moment of Glory",
  "荣誉〔2026〕第01号": "Honor [2026] No. 01",
  "★永久": "★Permanent",
  "经考核评定，授予望府村": "After assessment and evaluation, it was awarded to Wangfu Village",
  "荣誉〔2007〕第02号": "Honor [2007] No. 02",
  "授予望府村": "Granted to Wangfu Village",
  "称号。": "title.",
  "荣誉〔2007〕第03号": "Honor [2007] No. 03",
  "荣誉〔2020〕第04号": "Honor [2020] No. 04",
  "荣誉〔2021〕第05号": "Honor [2021] No. 05",
  "（示范型）称号。": "(Exemplary) title.",
  "荣誉〔2022〕第06号": "Honor [2022] No. 06",
  "荣誉〔2023〕第07号": "Honor [2023] No. 07",
  "荣誉〔2023〕第08号": "Honor [2023] No. 08",
  "荣誉〔2023〕第09号": "Honor [2023] No. 09",
  "望府村文化礼堂获": "Wangfu Village Cultural Hall won the",
  "荣誉〔2023〕第10号": "Honor [2023] No. 10",
  "宁波市民族团结进步创建": "Ningbo City National Unity and Progress Creation",
  "荣誉〔2024〕第11号": "Honor [2024] No. 11",
  "2023年度返乡入乡合作创业考核，望府村被评为": "In the 2023 return to hometown cooperation and entrepreneurship assessment, Wangfu Village was rated",
  "荣誉〔2024〕第12号": "Honor [2024] No. 12",
  "📜 下枫槎村大事记": "📜 Major events in Xia Fengcha Village",
  "跨越1600年 · 点击展开历代大事": "Spanning 1,600 years · Click to expand the major events of the past dynasties",
  "古代 · 晋至明": "Ancient times·Jin to Ming",
  "晋义熙元年，高僧昙猷自海上乘": "In the first year of Jin Yixi, the eminent monk Tan You took a ride from the sea.",
  "至一市，弃槎登岸，此岭遂名": "When he arrived at a city, he abandoned the boat and landed on the shore, hence the name of the mountain.",
  "明洪武年间，": "During the Hongwu period of the Ming Dynasty,",
  "族人迁居下枫槎，为村中最早居民。": "The tribe moved to Xia Fengcha and became the earliest residents of the village.",
  "明隆庆六年，谢氏第十六代裔孙": "In the sixth year of Longqing's reign in the Ming Dynasty, the sixteenth generation descendant of the Xie family",
  "自岩头下迁居下枫槎开基，谢氏遂成第一大姓。": "After moving to Xia Fengcha from Yantou to Kaiji, the Xie family became the most common surname.",
  "清康熙年间，谢氏族人建": "During the Kangxi period of the Qing Dynasty, the Xie clan built",
  "谢家宗祠": "Xie Family Ancestral Hall",
  "，堂号\"敦睦堂\"。": ", the hall name is \"Dunmutang\".",
  "清雍正六年，下枫槎属": "In the sixth year of Emperor Yongzheng's reign in the Qing Dynasty, under the maple tree",
  "南乡石舌庄": "Nanxiang Shijizhuang",
  "清中叶，村民集资建": "In the middle of the Qing Dynasty, villagers raised funds to build",
  "，主奉玉皇大帝。": ", dedicated to the Jade Emperor.",
  "民国至解放": "Republic of China to liberation",
  "民国四年，为表彰谢氏英烈": "In the fourth year of the Republic of China, in order to commend the heroic heroes of the Xie family",
  "在辛亥革命中为国捐躯，颁发": "He sacrificed his life for the country in the Revolution of 1911 and was awarded",
  "\"为国立功\"": "\"Contribute to the country\"",
  "匾额。": "plaque.",
  "民国21年，废庄设乡镇，下枫槎属": "In the 21st year of the Republic of China, villages and towns were established in the abandoned village, and Xia Fengcha belonged to",
  "石兆乡": "Shi Zhaoxiang",
  "民国34年6月29日，日寇占领宁海县城，四处劫掠。": "On June 29, 1934, the Japanese invaders occupied Ninghai County and looted everywhere.",
  "7月5日，解放军攻占宁海，宁海宣告解放。下枫槎属": "On July 5, the People's Liberation Army captured Ninghai and Ninghai was declared liberated. Maple genus",
  "城关区水车乡": "Shuiche Township, Chengguan District",
  "建国初期": "Early days of the founding of the People's Republic of China",
  "6月成立枫槎村农民协会；8月实施土地改革。": "In June, the Fengcha Village Farmers Association was established; in August, land reform was implemented.",
  "9月建立互助合作组，下枫槎共建两个互助组。": "In September, a mutual aid cooperation group was established, and two mutual aid groups were established in Xia Fengcha.",
  "8月建立": "Established in August",
  "下枫槎高级合作社": "Haofengcha Senior Cooperative",
  "，社长谢绍艮。": ", President Xie Shaogen.",
  "10月撤乡镇建公社，属宁海公社水车管理区。大办食堂吃大锅饭。": "In October, the villages and towns were evacuated to build a commune, which belongs to the waterwheel management area of Ninghai Commune. Eat a big pot of rice in the big cafeteria.",
  "以谢行青等为主自发成立": "Spontaneously established by Xie Xingqing and others",
  "乱弹剧团": "Luan Dan Theater Company",
  "，30多位村民参加。": ", more than 30 villagers participated.",
  "响应农业学大寨，100多劳动力向望府楼荒山进军，建成": "In response to the agricultural imitation of Dazhai, more than 100 laborers marched to the barren hills of Wangfulou and built",
  "标准梯田75亩": "Standard terraced fields 75 acres",
  "将旱地约70亩改为水田，实现\"山下粮仓\"的初步设想。": "About 70 acres of dry land will be converted into paddy fields to realize the initial idea of \"granary under the mountain\".",
  "全村通电，告别洋油灯照明时代。": "The whole village is electrified, bidding farewell to the era of foreign oil lamp lighting.",
  "新建朝阳排水站和外坑头机灌站，解决农田水利灌溉。": "A new Chaoyang drainage station and a Waikengtou mechanical irrigation station were built to solve the problem of farmland water conservancy irrigation.",
  "集体出资统建": "Collective investment and construction",
  "大寨屋": "Dazhaiwu",
  "。同年宁海至一市公路开通。": ". In the same year, the highway from Ninghai to Yishi was opened.",
  "重新调整分配自留地，标准每人0.17斗。": "Re-adjust the distribution of private land, with a standard of 0.17 buckets per person.",
  "改革开放后": "After reform and opening up",
  "将枫槎溪村庄段改坑，坑道外拓30米、总长200米，实现防洪。": "The village section of Fengcha River was transformed into a tunnel, and the tunnel was extended 30 meters outward and 200 meters in total to achieve flood control.",
  "落实": "implement",
  "家庭联产承包责任制": "household responsibility system",
  "，分田到户、分山到户。": ", allocate fields to households, allocate mountains to households.",
  "建立村经济合作社，承包责任制调整后15年不变。": "Village economic cooperatives will be established, and the contract responsibility system will remain unchanged for 15 years after adjustment.",
  "\"7·30\"百年不遇特大洪灾": "\"July 30\", the worst flood in a century",
  "，每户进水5米以上，1人死亡。": ", each household received more than 5 meters of water, and one person died.",
  "接通自流水，挖沟铺管建造蓄水池，延用至2011年通大水网终止。": "Artesian water was connected, trenches were dug and pipes were laid to build a reservoir, and the use was extended until the completion of the large water network in 2011.",
  "10月完善承包责任制，30年不变。同年所有道路装上": "In October, the contract responsibility system will be improved and will remain unchanged for 30 years. In the same year, all roads were installed",
  "路灯": "street lamp",
  "新世纪至今": "new century to present",
  "村庄内道路全部硬化，路平灯明。": "All roads in the village are hardened, level and illuminated.",
  "全面绿化，打碎露天粪缸55只、新建公厕5只，环境极大改善。": "Comprehensive greening was carried out, 55 open-air excrement tanks were smashed and 5 new public toilets were built, greatly improving the environment.",
  "枫槎岭隧道": "Maple Ridge Tunnel",
  "正式通车，联接同三高速，彻底解决交通瓶颈。": "Officially opened to traffic, connected to Tongsan Expressway, completely solving traffic bottlenecks.",
  "全面开展": "comprehensively carried out",
  "旧村改造": "Renovation of old villages",
  "，拆除危旧房100多间，30户住上联排别墅。": ", more than 100 dilapidated houses were demolished and 30 households were moved into townhouses.",
  "在杉树山投资80万元新建": "Invested 800,000 yuan to build a new building in Shanshushan",
  "生态公墓": "Eco Cemetery",
  "一处。": "One place.",
  "投资300万新建标准厂房": "Invest 3 million to build a new standard factory building",
  "3500平方米": "3500 square meters",
  "，年增收租金50万元。": ", the annual rent increase is 500,000 yuan.",
  "投资500万元在村后建造": "Invest 5 million yuan to build behind the village",
  "综合楼": "Comprehensive building",
  "一座，成为村中标志性建筑。": "A building that has become a landmark building in the village.",
  "接受": "accept",
  "联合国资助项目": "United Nations funded projects",
  "，全面改造排污管道系统，雨污分离。": ", comprehensively transform the sewage pipeline system and separate rainwater and sewage.",
  "投资220万元装修综合楼，创建": "Invested 2.2 million yuan to renovate the comprehensive building and create",
  "，成为村民精神家园。": ", becoming the spiritual home of the villagers.",
  "丙午年春，下枫槎谢氏举行": "In the spring of the Bingwu year, Xie's family held a ceremony in Fengcha",
  "圆谱大典": "round spectrum ceremony",
  "。谱牒重修，阖族会于宗祠恭行大典，钟鼓齐鸣，盛况空前。": ". The genealogy was renovated, and the whole family gathered in the ancestral hall to hold a grand ceremony. The bells and drums rang in unison, and the occasion was unprecedented.",
  "🍵 全国名茶 · 望府银毫": "🍵 Nationally Famous Tea · Wangfu Yinhao",
  "宁海山水秀 · 望府佳茗香": "Ninghai’s beautiful scenery·Wangfujiamingxiang",
  "\"宁海山水秀，望府佳茗香\"": "\"The beautiful scenery of Ninghai and the fragrance of Wangfu's fine tea\"",
  "—— 时任浙江省省长薛驹 亲笔题词": "——A personal inscription by Xue Ju, then governor of Zhejiang Province",
  "高山云雾出好茶": "High mountain clouds produce good tea",
  "望府楼山常年云雾缭绕、雨量充沛，年均气温13.2℃，特有的乌砂壤土是培育优质茶叶的天堂。茶园多分布在海拔300-600米山坡，出产的望府茶色泽翠绿、香气清高、滋味鲜爽。每年清明前后采摘，一叶一芽，手工炒制。": "Wangfulou Mountain is shrouded in clouds and mist all year round, with abundant rainfall and an average annual temperature of 13.2°C. The unique black sandy loam soil is a paradise for cultivating high-quality tea. Tea gardens are mostly distributed on hillsides with an altitude of 300-600 meters. The Wangfu tea produced is green in color, aromatic and refreshing in taste. It is picked every year around Qingming Festival, one leaf and one bud, and fried by hand.",
  "王家福与望府银毫": "Wang Jiafu and Wangfu Silver",
  "1984年，王家福毅然抛弃铁饭碗回乡承包茶场，创办\"望府茶业有限公司\"，注册\"望府银毫\"商标。1989年荣登全国名茶宝座，成为宁波市第一只全国名茶。其茶外形秀丽、紧直披毫、色泽绿翠光润；香气高鲜纯、滋味鲜醇回甘。此后又获中国农博会、茶博会金奖等荣誉。王家福连续当选宁波市十二、十三、十四届人大代表。": "In 1984, Wang Jiafu resolutely abandoned his iron job and returned to his hometown to contract tea farms. He founded \"Wangfu Tea Co., Ltd.\" and registered the trademark \"Wangfu Yinhao\". In 1989, it topped the list of national famous teas and became the first nationally famous tea in Ningbo City. The tea has a beautiful appearance, tight and straight hair, green and smooth color, high and pure aroma, and fresh and sweet taste. Since then, it has won honors such as gold medals at China Agricultural Expo and Tea Expo. Wang Jiafu was successively elected as a representative of the 12th, 13th and 14th Ningbo Municipal People’s Congress.",
  "✨ 望府金毫 · 浙江名红茶": "✨ Wangfu Jinhao · Zhejiang famous black tea",
  "王家福之子王茂强辞去工作接棒，2008年起开发红茶。2010年\"望府金毫\"问世即获国际名茶评比金奖。2014年获\"浙茶杯\"金奖，2018年获\"浙江名红茶\"称号，成为全省七大名红茶之一、全市唯一当选品牌。王茂强被评为宁波市十大杰出农村青年、宁海县十大杰出青年。": "Wang Jiafu's son Wang Maoqiang resigned from his job and took over, and began developing black tea in 2008. In 2010, \"Wangfu Jinhao\" came out and won the gold medal in the international tea competition. It won the \"Zhejiang Tea Cup\" gold medal in 2014 and the title of \"Zhejiang Famous Black Tea\" in 2018, becoming one of the seven famous black teas in the province and the only selected brand in the city. Wang Maoqiang was named one of the top ten outstanding rural youths in Ningbo City and one of the top ten outstanding youths in Ninghai County.",
  "🥕 枫槎红萝卜": "🥕 Maple Carrot",
  "一口清脆 · 两百年传承": "A crisp bite · Two hundred years of heritage",
  "百年种植 · 匠心传承": "Centuries of cultivation · Inherited craftsmanship",
  "下枫槎村曾是宁海县种植红萝卜的专业村与特色村，种植历史已近200年。种出的红萝卜挺拔粗壮、色泽红润、香气浓郁、爽脆可口，深受县城及一市、前童、海游等地乡民喜爱。处暑播种至腊月收拔，需经八道工序：配种采籽 → 双耕双耙 → 翻灰拌种 → 划垄播种 → 间苗留壮 → 松土通风 → 挖沟施肥 → 轻摇轻拔，一丝不苟。": "Xia Fengcha Village was once a professional and characteristic village for growing carrots in Ninghai County, with a planting history of nearly 200 years. The carrots grown are tall and strong, ruddy in color, rich in aroma, crisp and delicious, and are deeply loved by villagers in the county, city, Qiantong, Haiyou and other places. From sowing in the summer heat to harvesting in the twelfth lunar month, eight processes are required: seed harvesting → double plowing and double harrowing → ash plowing and seed dressing → ridge sowing → thinning to keep strong seedlings → loose soil and ventilation → digging trenches and fertilizing → gently shaking and pulling, meticulously.",
  "枫槎萝卜客": "maple carrot guest",
  "七、八十年代最盛时，腊月里成群结队的下枫槎人被亲切称为\"枫槎萝卜客\"。凌晨二时出发，鸡鸣时分山中漆黑一片，萝卜客们手持\"火燎灯\"结伴同行。一盏盏火燎灯汇成一条金色火龙，成为当年枫槎岭上一道靓丽的风景线。": "During the heyday of the 1970s and 1980s, the hordes of Xiafengcha people who gathered in the twelfth lunar month were affectionately called \"Fengcha Carrot Guests.\" We set off at two o'clock in the morning. When the rooster crows, the mountains are pitch black, and the carrot lovers walk together holding \"fire lanterns\". The burning lanterns merged into a golden fire dragon, which became a beautiful scenery on Fengcha Ridge.",
  "下枫槎村人文景观 · 历史遗存": "Xia Fengcha Village Cultural Landscape·Historical Relics",
  "位于村庄南面，原名\"望鼓楼山\"，主峰海拔523.3米。山上有石棋坪，旁有红岩潭，秋夏之际潭中云起、风雨立至。1965年村民在山麓开发茶园，现为望府银毫核心产区。": "Located in the south of the village, it was originally called \"Wanggulou Mountain\" and the main peak is 523.3 meters above sea level. There is a stone chess flat on the mountain and a red rock pool next to it. In autumn and summer, clouds rise in the pool and the wind and rain arrive. In 1965, villagers developed a tea garden at the foot of the mountain, which is now the core production area of ​​Wangfu Yinhao.",
  "位于村东南，全长近20里。晋代高僧昙猷乘枫槎（枫树独木舟）踏海而来，弃槎上岭，岭遂得名。1977年前为县城通东南唯一通道，山顶有路廊与庙供行人歇息。": "It is located in the southeast of the village and has a total length of nearly 20 miles. Tan You, an eminent monk from the Jin Dynasty, came to the sea on a maple canoe and abandoned the canoe to go up to the ridge, so the ridge got its name. Before 1977, it was the only passage to the southeast of the county. There were corridors and temples on the top of the mountain for pedestrians to rest.",
  "谢家祠堂": "Xie Family Ancestral Hall",
  "位于村中心，清康熙年间建，2004年重建，占地450余平方米。北为大厅南为戏台，左右厢房六间。堂号\"敦睦堂\"，藏有\"为国立功\"匾额，表彰谢学良在辛亥革命中的英勇牺牲。": "Located in the center of the village, it was built during the Kangxi period of the Qing Dynasty and rebuilt in 2004, covering an area of more than 450 square meters. There is a hall in the north, a stage in the south, and six wing rooms on the left and right. The hall is named \"Dunmutang\" and contains a plaque \"Making Service to the Country\" in recognition of Xie Xueliang's heroic sacrifice in the Revolution of 1911.",
  "位于村北500米西山脚，清代中期建，主奉玉皇大帝。正殿三间庭院百余平方米。藏有玉皇大帝抬阁一尊，每逢喜庆四人扛出游行，锣鼓喧天。": "Located at the foot of the west mountain 500 meters north of the village, it was built in the mid-Qing Dynasty and dedicated to the Jade Emperor. The three courtyards of the main hall are more than 100 square meters. There is a statue of the Jade Emperor in the pavilion. During festivals, four people carry it out in processions, with gongs and drums noisy.",
  "古井遗存": "Remains of ancient well",
  "半边井位于村西北路口，因路面占去半幅得名，井水来自高山清澈冰凉。三角井位于村北百米处，形似三角又名长鼓潭，井边建有长廊为村民纳凉之所。": "Banbianjing is located at the northwest intersection of the village. It is named because it takes up half of the road. The well water comes from the mountains and is clear and cold. The Triangular Well is located 100 meters north of the village. It is shaped like a triangle and is also known as the Changgu Pond. There is a promenade beside the well for the villagers to enjoy the cool weather.",
  "位于望府楼山顶两峰之间，因村民每逢干旱来此祈雨又名龙潭。潭径尺许清且深，长年不涸。据光绪县志载秋夏之际\"潭中云起风雨立至\"，极为灵验。": "It is located between the two peaks on the top of Wangfulou Mountain. It is also called Longtan because villagers come here to pray for rain every time there is a drought. The diameter of the pond is clear and deep, and it never dries up all year round. According to the annals of Guangxu County, during autumn and summer, \"the clouds in the pond rise and the wind and rain arrive\", which is extremely effective.",
  "字辈排行": "Character generation ranking",
  "下枫槎谢氏字辈，自迁居始祖起，排行如下：": "The descendants of the Xie family in Xia Fengcha, starting from the ancestor who moved here, are ranked as follows:",
  "一(150)": "One(150)",
  "懋(151)": "Mao(151)",
  "之(152)": "of (152)",
  "嘉(153)": "Chia(153)",
  "永(154)": "Yong(154)",
  "孝(155)": "Filial piety(155)",
  "思(156)": "Thinking(156)",
  "台(157)": "Taiwan(157)",
  "邦(158)": "Bang(158)",
  "令(159)": "Order(159)",
  "序(160)": "Preface(160)",
  "善(161)": "Good(161)",
  "道(162)": "Tao(162)",
  "开(163)": "Open(163)",
  "时(164)": "Hours(164)",
  "天(165)": "days(165)",
  "每格一代 · 柱高=人丁 · 点击柱子查看该世族人 · 右上角「全屏」可缩放": "One generation per grid · Column height = people · Click on the column to view the people of this clan · The upper right corner of the \"Full Screen\" can be zoomed",
  "后枫槎世系": "Later Fengcha lineage",
  "前枫槎世系": "Former maple lineage",
  "📋 世系简表": "📋 Brief lineage table",
  "字辈": "generation",
  "生卒": "birth and death",
  "🔧 管理员操作": "🔧 Administrator operation",
  "族谱数据管理请通过后台管理系统操作": "Genealogy data management please operate through the backend management system",
  "（需管理员权限）": "(Administrator rights required)",
  "吾族行第字辈，自十九世起，依次为：一、懋、之、嘉、永、孝、思、台、邦、令、序、善、道、开、时、天，凡十六字，周而复始。今已传至\"天\"字辈，族众蕃衍，蔚为大观。散居四方者，或负笈远游而求学于外，或投身实业而建功于业，或捐资修路以利乡邻，或助学奖教以育英才。然心系故土，情牵宗亲，每逢清明冬至，千里归来，聚首祖祠，其乐融融。": "Our family generation sequence, beginning with Generation 19, is: Yi, Mao, Zhi, Jia, Yong, Xiao, Si, Tai, Bang, Ling, Xu, Shan, Dao, Kai, Shi and Tian. These sixteen characters repeat in order. The lineage has now reached the Tian generation. Family members live and study or work in many places, support their neighbors, build careers, repair roads and support education. Yet their hearts remain with their ancestral home. At Qingming and the winter solstice, relatives travel home from far away to gather at the ancestral hall.",
  "目前已传至\"天\"字辈（第一百六十五世）": "The lineage has now reached the Tian generation (Generation 165)."
};
const INTRO_PAGE_TRANSLATIONS = {
  '下枫槎 · 数字乡村': 'Xiafengcha · Digital Rural Platform',
  '系统开发': 'Digital Product Development',
  '数字乡村 · 族谱平台': 'Digital Rural & Genealogy Platform',
  '功能': 'Features',
  '关于': 'About',
  '联系': 'Contact',
  '✦ 参观案例': '✦ View Case Study',
  '宁海下枫槎村 · 数字乡村平台': 'Ninghai Xiafengcha Village · Digital Rural Platform',
  '同姓族人的': 'For People Who Share a Family Name ',
  '数字家园': 'Digital Home',
  '不止是族谱 —— 更是村庄文化展示、宗亲联络、活动纪实的一站式平台': 'More than a genealogy — an all-in-one platform for village culture, kinship connections and activity records',
  '为同姓族人打造专属的数字化乡村社区': 'A dedicated digital village community for people who share a family name',
  '📩 为我的宗族定制': '📩 Build One for My Clan',
  '平台功能': 'Platform Features',
  '族谱 · 村务 · 文化 · 影像 · 互动': 'Genealogy · Village Affairs · Culture · Media · Community',
  '家族世系树': 'Family Lineage Tree',
  '交互式可视化树，世代关系一目了然，支持缩放拖拽': 'Interactive visual tree with clear generations; zoom and drag supported',
  '族谱查询': 'Genealogy Search',
  '多维检索，按姓名字辈快速定位族人信息': 'Search by name and generation character to find family members quickly',
  '家族成员': 'Family Members',
  '完整记录族人信息，支持批量管理': 'Complete member records with batch management',
  '名人功德': 'Notable Figures & Contributions',
  '收录先贤事迹，功德榜单传承荣光': 'Preserve the stories of respected ancestors and carry their legacy forward',
  '迁徙地图': 'Migration Map',
  '动态路线展示从始祖到现居的千年历程': 'A dynamic route showing the journey from the founding ancestor to the present',
  '村庄概况': 'Village Overview',
  '村庄介绍、地理风貌、产业文化全景展示': 'A panoramic view of the village, its landscape, industries and culture',
  '村务消息': 'Village Updates',
  '通知公告、活动发布、新闻报道实时更新': 'Notices, activities and news updated in real time',
  '影像记录': 'Media Archive',
  '视频照片集中管理，珍贵瞬间永续保存': 'Manage photos and videos in one place and preserve precious moments',
  '深浅主题': 'Light & Dark Themes',
  '双模式自由切换，夜间浏览更舒适': 'Switch freely between two modes for comfortable night browsing',
  '管理后台': 'Admin Console',
  '全功能后台，数据备份权限管理一应俱全': 'Full-featured administration with backups and access control',
  '关于这个平台': 'About This Platform',
  '以技术助力宗族文化数字化传承': 'Using technology to preserve clan culture in the digital age',
  '🏛️ 数字宗祠': '🏛️ Digital Ancestral Hall',
  '将传统宗祠搬到线上，族人无论身在何处都能查阅族谱、了解家族历史，参与宗族事务': 'Bring the traditional ancestral hall online so relatives anywhere can read the genealogy, learn family history and take part in clan affairs',
  '🏘️ 乡村展示': '🏘️ Village Showcase',
  '全方位展示村庄风貌、产业特色、文化活动，打造对外宣传的数字化窗口': 'Showcase the village landscape, local industries and cultural activities through a digital window to the outside world',
  '📱 多端适配': '📱 Multi-device Access',
  '电脑、手机、平板均可流畅访问，族人随时随地都能使用': 'Smooth access on computers, phones and tablets, wherever relatives are',
  '🔒 数据安全': '🔒 Data Security',
  '自有服务器部署，定期自动备份，数据安全自主可控': 'Deployed on our own server with regular backups and full control of data security',
  '联系我': 'Contact Me',
  '为您的宗族打造专属数字平台': 'Build a dedicated digital platform for your clan',
  '姓名': 'Name',
  '邮箱': 'Email',
  '宗族/村庄名称': 'Clan / Village Name',
  '您的需求...': 'Your requirements...',
  '发送咨询 ✉': 'Send Inquiry ✉',
  '浙江宁海县北斗北路81弄11号': 'No. 11, Lane 81, Beidou North Road, Ninghai, Zhejiang',
  '为您的宗族打造数字家园': 'Build a Digital Home for Your Clan',
  '让族谱文化在数字时代焕发新生': 'Bring genealogy culture to life in the digital age',
  '✦ 参观下枫槎案例': '✦ View the Xiafengcha Case',
  '📩 立即咨询': '📩 Contact Me Now',
  '© 2026 庞尚韬 · 数字乡村/族谱系统开发': '© 2026 Shangtao Pang · Digital Rural & Genealogy System Development',
  '参观案例：下枫槎村': 'View Case Study: Xiafengcha Village',
  '© 2026 庞尚韬 · 数字乡村/族谱系统开发 | 参观案例：下枫槎村': '© 2026 Shangtao Pang · Digital Rural & Genealogy System Development | View Case Study: Xiafengcha Village'
};
Object.assign(EXTRA_TRANSLATIONS, GENERATED_PAGE_TRANSLATIONS, INTRO_PAGE_TRANSLATIONS);

// Runtime labels used by the genealogy, timeline, media and access widgets.
// They are complete translations so MutationObserver never has to guess at
// a fragment inserted by an older page script.
const GENERATED_RUNTIME_TRANSLATIONS = {
  "直系": "direct line",
  "祖宗": "ancestors",
  "后代": "Descendants",
  "后裔": "Descendants",
  "子孙": "descendants",
  "后辈": "junior",
  "几代": "generations",
  "第几代": "Which generation",
  "第几世": "Which generation",
  "辈分": "seniority",
  "排行": "Ranking",
  "谱系": "pedigree",
  "爷爷": "grandpa",
  "奶奶": "grandma",
  "爸爸": "dad",
  "母亲": "mother",
  "妈妈": "mom",
  "太公": "Taigong",
  "儿子": "son",
  "女儿": "daughter",
  "侄子": "nephew",
  "侄女": "niece",
  "叔伯": "uncle",
  "叔叔": "uncle",
  "伯伯": "uncle",
  "姑姑": "aunt",
  "堂兄弟": "cousins",
  "堂姐妹": "cousins",
  "表兄弟": "cousins",
  "表姐妹": "cousins",
  "兄弟": "brother",
  "姐妹": "sisters",
  "高祖": "Emperor Gaozu",
  "曾祖": "great-grandfather",
  "太爷爷": "great grandfather",
  "太奶奶": "Grandma",
  "生平": "life",
  "简历": "Resume",
  "介绍": "Introduction",
  "是谁": "who is",
  "什么来历": "What's the origin",
  "来历": "Origin",
  "情况": "situation",
  "信息": "information",
  "出生": "born",
  "生辰": "birthday",
  "生日": "birthday",
  "去世": "died",
  "死亡": "death",
  "殁": "died",
  "葬": "bury",
  "年纪": "age",
  "年龄": "age",
  "几岁": "How old are you?",
  "多大": "How big",
  "多少岁": "how old",
  "妻子": "wife",
  "丈夫": "husband",
  "夫人": "madam",
  "娶": "marry",
  "嫁": "marry",
  "改嫁": "remarry",
  "续弦": "Continue string",
  "子女": "children",
  "儿女": "children",
  "家庭": "family",
  "家属": "family members",
  "家人": "family",
  "媳妇": "daughter-in-law",
  "女婿": "son-in-law",
  "职业": "Career",
  "工作": "work",
  "住址": "Address",
  "住哪": "Where to live",
  "哪里人": "Where are you from?",
  "电话": "phone",
  "手机": "mobile phone",
  "身份证": "ID card",
  "确定清空全部咨询记录吗？清空后无法恢复。": "Are you sure you want to clear all consultation records? It cannot be restored after being cleared.",
  "」存在出继／入继关系。请选择要按亲生父系还是承嗣父系查询：": "\"There is a step-out/step-in relationship. Please choose whether to query based on biological paternal line or inherited paternal line:",
  "⚠️ 族谱中有 ": "⚠️ Found in the family tree",
  " 位「": "Bit \"",
  "未详": "Unspecified",
  "的世系图，并全面展示出继和入继关系": "Genealogy diagram, and comprehensively display the relationship between descendants and descendants",
  "出错了，请重试": "An error occurred, please try again",
  "提问太频繁，请": "Questions asked too often, please",
  "秒后再试": "Try again in seconds",
  "查询完成，请查看世系图。": "The query is complete, please view the lineage chart.",
  "验证中…": "Verifying…",
  "继续口播": "Continue to broadcast",
  "重新听一遍": "listen again",
  "，是$1本人": ", is $1 per person",
  "播放失败，点击重听": "Playback failed, click to listen again",
  "朗读失败，点击重听": "Failed to read aloud, click to listen again",
  "谢氏宗祠": "Xie's Ancestral Hall",
  "古树参天": "Towering old trees",
  "青山环绕": "Surrounded by green mountains",
  "明清古民居": "Ancient dwellings of Ming and Qing Dynasties",
  "清明祭祖": "Ancestor Worship at Qingming Festival",
  "新春团拜": "New Year's greetings",
  "宗祠风貌": "Ancestral temple style",
  "下枫槎宣传片": "Promotional video of Xia Fengcha",
  "圆谱2026": "Circle spectrum 2026",
  "宣传片2": "Promotional video 2",
  "下枫槎村谢氏来源": "The origin of the Xie family in Xia Fengcha Village",
  "谢邑": "Xie Yi",
  "河南洛阳": "Luoyang, Henan",
  "前806年": "806 BC",
  "周宣王封元舅申伯于谢邑，子孙以国为氏，谢氏自此得姓，至今两千八百余年。": "King Zhou Xuan granted Uncle Yuan Shen Bo to Xie Yi, and his descendants took the country as their surname. From then on, the Xie family got the surname, which has lasted for more than 2,800 years.",
  "东山会稽": "Dongshan Kuaiji",
  "浙江绍兴·上虞区上浦镇东山村": "Dongshan Village, Shangpu Town, Shangyu District, Shaoxing, Zhejiang",
  "东汉-东晋": "Eastern Han Dynasty - Eastern Jin Dynasty",
  "谢氏传三十六世至会稽。东晋谢安、谢玄叔侄淝水之战以八万破百万，与王氏并称\"王谢\"，为天下望族之冠。": "The Xie family passed down to Kuaiji in the thirty-sixth generation. In the Eastern Jin Dynasty, Xie An and Xie Xuan, their uncles and nephews, lost 80,000 to one million in the Feishui battle. Together with the Wang family, they were called \"Wang Xie\" and became the most famous family in the world.",
  "浙江台州·临海市邵家渡街道下渡村": "Xiadu Village, Shaojiadu Street, Linhai City, Taizhou, Zhejiang",
  "东山会稽谢氏一支南下，经临海古渡口进入台州腹地。临海为浙东南迁重要节点，由此再分迁石马、天台等地。": "A branch of the Xie family from Dongshan and Kuaiji went south and entered the hinterland of Taizhou via Linhai Ancient Ferry. Linhai is an important node for the migration to the southeast of Zhejiang, and from there it is further divided into Shima, Tiantai and other places.",
  "石马（下谢）": "Stone horse (Thanks below)",
  "浙江台州·三门县珠岙镇石马村": "Shima Village, Zhu'ao Town, Sanmen County, Taizhou, Zhejiang",
  "小四公（谢聪孙）自临海迁居石马，为下枫槎谢氏之直系近祖。此后传十二世，枝繁叶茂。": "Xiao Sigong (Xie Congsun) moved from Linhai to Shima and was the direct ancestor of the Xie family in Xia Fengcha. After that, it was passed down to twelve generations and flourished.",
  "岩下（岩头下）": "Yanxia (under the rock head)",
  "浙江宁波·宁海县跃龙街道岩头下村": "Yantouxia Village, Yuelong Street, Ninghai County, Ningbo, Zhejiang",
  "约1125年": "About 1125",
  "文杲公任越溪司巡检，从石马迁居岩下，为枫槎谢氏始迁祖。至今近九百年，传三十六世。": "Duke Wen Gao was appointed as an inspector of the Yuexi Division and moved from Shima to Yanxia, becoming the first ancestor of the Xie family in Fengcha. It has been nearly nine hundred years and has been passed down to thirty-six generations.",
  "下枫槎村": "Ha Fengcha Village",
  "浙江宁波·宁海县跃龙街道望府村": "Wangfu Village, Yuelong Street, Ninghai County, Ningbo, Zhejiang",
  "明隆庆六年山洪暴发，乾公、彬公兄弟率族人迁至双枫古槎之下，斩荆棘、辟草莱，开基立业，定名下枫槎。": "In the sixth year of Longqing's reign in the Ming Dynasty, a flash flood occurred. Brothers Gan Gong and Bin Gong led their tribesmen to move under Shuangfeng Ancient Cha, where they cut thorns, opened up grass and established a business, naming it Feng Cha.",
  "播放迁徙动画": "Play migration animation",
  "上一个节点": "Previous node",
  "下一个节点": "next node",
  "重置": "reset",
  "谢小四": "Xie Xiaosi",
  "石马(下谢)": "Stone horse (Thanks below)",
  "宋靖康年间": "During the Jingkang period of Song Dynasty",
  "否": "No",
  "会稽人，宋靖康年间迁居石马，入浙东之近祖。下枫槎谢氏之直系渊源。": "A native of Kuaiji, a recent ancestor who moved to Shima during the Jingkang period of the Song Dynasty and entered eastern Zhejiang. The direct origin of the Xie family in Xia Fengcha.",
  "枫槎始祖": "Ancestor of maple tree",
  "北宋宣和(约1125)": "Xuanhe of the Northern Song Dynasty (about 1125)",
  "字克源，宋登仕郎，越溪司巡检。英敏卓荦，文武兼备，始居岩下，为枫槎谢氏之始迁祖。至今近九百载，传三十六世。": "Zi Keyuan, Song Dengshilang, Yuexi Division inspection. He was a man of great intelligence and talent, both civil and military. He first lived in Yanxia and was the first ancestor of the Xie family in Fengcha. It has lasted nearly nine hundred years and has been passed down to thirty-six generations.",
  "后枫槎派": "Post-Fengcha School",
  "文杲公长子，分居后枫槎，开一派之先河。": "The eldest son of Duke Wen Gao lived in Fengcha after separation and became the first to create a sect.",
  "前枫槎派": "Former Maple Leaf",
  "文杲公次子，分居前枫槎，与前枫槎派并立。": "The second son of Duke Wen Gao lived in Qian Fengcha, and stood side by side with the former Fengcha sect.",
  "后枫槎东房": "Houfengcha East Room",
  "明隆庆壬申(1572)": "Minglong Qingrenshen (1572)",
  "字叔仅，十六世祖。明隆庆六年壬申（1572年），时遭洪水之患，岁季始迁枫槎，为下枫槎开基之祖。": "His courtesy name is Shuzhen, his 16th generation ancestor. In Renshen, the sixth year of Longqing's reign in the Ming Dynasty (1572), it was hit by floods and moved to Fengcha at the beginning of the year, becoming the founder of Xia Fengcha.",
  "与彬公昆仲，明隆庆六年壬申（1572年），山洪暴发，庐舍为墟。与彬公相度地势，遂迁于双枫古槎之下，因名其地曰下枫槎。": "With Bin Gong and Kunzhong, in the sixth year of Renshen (1572), the sixth year of Longqing in Ming Dynasty, a flash flood broke out and the house was in ruins. He and Bin Gong agreed on the terrain, so they moved to Shuangfenggucha, so the place was named Xiafengcha.",
  "云先公": "Yun Xianggong",
  "之": "of",
  "西大房二份": "Second copy of West Dafang",
  "清乾隆间": "Qianlong period of Qing Dynasty",
  "名大性，西大房二份之祖。乾隆二十七年（1762年）首倡并主持修建下枫槎谢氏宗祠，敦睦堂由此而立。": "Named Da Xing, the ancestor of west Dafang Erfen. In the 27th year of Qianlong's reign (1762), he initiated and presided over the construction of Xie's Ancestral Hall in Xia Fengcha, and Dunmutang was established.",
  "枫槎分支": "maple branch",
  "文杲公之子，枫槎谢氏分支祖。": "The son of Duke Wen Gao and the ancestor of the Xie family branch in Fengcha.",
  "炎帝神农氏": "Emperor Yan Shennong",
  "中华民族人文始祖": "The ancestor of the Chinese nation’s humanities",
  "临魁": "Linkui",
  "炎帝之子": "Son of Emperor Yan",
  "榆罔": "Yugong",
  "临魁之后": "After Linkui",
  "帝柱": "Imperial Pillar",
  "榆罔之后": "After Yu Zeng",
  "祝融": "Zhu Rong",
  "帝柱之后": "After the Emperor's Pillar",
  "吕尚": "Lu Shang",
  "姜太公，周朝开国功臣": "Jiang Taigong, the founding hero of the Zhou Dynasty",
  "佐": "Zuo",
  "吕尚之子，申伯之父": "Son of Lu Shang, father of Shen Bo",
  "谢氏鼻祖": "The originator of the Xie family",
  "申甫": "Shen Fu",
  "申伯之弟，仍姓姜氏": "Uncle Shen's younger brother, still surnamed Jiang",
  "弘": "Hong",
  "申伯之子": "Son of Shen Bo",
  "猛": "fierce",
  "广": "wide",
  "弘之子": "Hiroshi's son",
  "协": "association",
  "列宗": "Liezong",
  "广之子": "Hiroyuki's son",
  "穆宗": "Mu Zong",
  "骘": "Stallion",
  "列宗之子": "Son of Liezong",
  "预": "pre",
  "骘之子": "son of stallion",
  "昌后": "After Chang",
  "预之子": "son of Yu",
  "达": "reach",
  "昌后之子": "Changhou's son",
  "守礼": "Observe etiquette",
  "子民": "people",
  "达之子": "son of da",
  "秩": "rank",
  "子民之子": "son of the people",
  "雍": "Yong",
  "秩之子": "son of rank",
  "林": "Lin",
  "雍之子": "Yong's son",
  "涣": "Huan",
  "林之子": "Son of Lin",
  "旺": "prosperous",
  "涣之子": "Son of Huan",
  "珽": "Jue",
  "旺之子": "son of prosperity",
  "国辉": "Guohui",
  "珽之子": "Son of Jue",
  "宁": "Ning",
  "国辉之子": "son of guohui",
  "福": "blessing",
  "宁之子": "Ning's son",
  "杨贞": "Yang Zhen",
  "福之子": "son of fortune",
  "平利": "Pingli",
  "杨贞之子": "Yang Zhen's son",
  "平和": "peaceful",
  "平祖": "Ping Zu",
  "翠": "green",
  "平和之子": "son of peace",
  "利": "profit",
  "武": "Wu",
  "文之子": "Wen Zhizi",
  "秉槐": "Binghuai",
  "武之子": "Wu Zhizi",
  "堂": "hall",
  "秉槐之子": "Binghuai's son",
  "瑛": "Ying",
  "堂之子": "Don's son",
  "文轩": "Wenxuan",
  "瑛之子": "Ying's son",
  "文昂": "Wen Ang",
  "福郎": "Fukuro",
  "文轩之子": "Wenxuan's son",
  "丙郎": "Binglang",
  "应郎": "Ying Lang",
  "宜礼": "Yili",
  "福郎之子": "Son of Fu Lang",
  "宜乐": "Yile",
  "逵": "Kui",
  "宜礼之子": "Yili's son",
  "简": "Jane",
  "逵之子": "Kui's son",
  "瑰": "Rose",
  "简之子": "son of jian",
  "懿": "Yi",
  "瑰之子": "son of rose",
  "鳅": "Loach",
  "懿之子": "Yi's son",
  "当": "when",
  "鳅之后": "After Loach",
  "景秀": "Jingxiu",
  "景秀之后/东山第一世": "After Jingxiu/Dongshan First Life",
  "显": "show",
  "景秀之后": "After Jingxiu",
  "顼": "Xu",
  "衡": "balance",
  "会稽东山始祖": "The ancestor of Dongshan in Kuaiji",
  "鲲": "Kun",
  "衡之子": "Heng's son",
  "裒": "Pei",
  "衡之子，谢安之父": "Son of Heng, father of Xie An",
  "奕": "Yi",
  "裒之子": "Son of Pei",
  "据": "According to",
  "安": "Ann",
  "字安石，东晋名相": "The courtesy name is Anshi, a famous prime minister in the Eastern Jin Dynasty.",
  "万": "million",
  "淮": "Huai",
  "石": "stone",
  "铁": "Iron",
  "瑶": "Yao",
  "安之子": "An's son",
  "琰·东山": "Yan·Dongshan",
  "肇": "Zhao",
  "琰之子": "Yan's son",
  "峻": "Jun",
  "混": "mix",
  "密": "secret",
  "混之子": "Hunzi",
  "庄": "village",
  "密之子": "son of secret",
  "庄之子": "Zhuang Zhizi",
  "胜": "win",
  "灏": "Hao",
  "丛": "Cluster",
  "沦": "fall",
  "览": "View",
  "飏之子": "Son of Yang",
  "琢": "carve",
  "览之子": "son of lan",
  "侨": "Overseas Chinese",
  "琢之子": "Son of Taku",
  "琬": "Wan",
  "琉": "Liu",
  "峤": "Qiao",
  "植": "plant",
  "钝": "blunt",
  "植之子": "son of plant",
  "缪": "Miao",
  "修": "repair",
  "钝之子": "dull son",
  "豹": "leopard",
  "恺": "Kai",
  "修之子": "Son of Xiu",
  "骢": "Cong",
  "恺之子": "son of kai",
  "驼": "camel",
  "绰": "Chua",
  "式": "formula",
  "绰之子": "Chuo's son",
  "革": "Leather",
  "式之子": "son of Shiki",
  "造": "make",
  "直": "straight",
  "造之子": "son of creation",
  "是温": "It's Wen",
  "直之子": "Naoko",
  "翳": "shade",
  "是温之子": "He's Wen's son",
  "静": "quiet",
  "翳之子": "son of yi",
  "观": "view",
  "闓": "Kai",
  "观之子/临海下渡第一世": "The Son of Guan/The First Life of Linhai Xiadu",
  "俨": "Yan",
  "闓之子": "Kai's son",
  "俨之子": "Yan's son",
  "景之": "Jingzhi",
  "诜之子": "Son of Shen",
  "考之": "Test it",
  "润甫": "Runfu",
  "景之之后": "After the scene",
  "深甫": "Shenfu",
  "采伯": "Tsebo",
  "深甫之后": "After Shen Fu",
  "渠伯": "Uncle Qu",
  "棐伯": "Di Bo",
  "彚伯": "Yibo",
  "奕修": "Yi Xiu",
  "采伯之后": "After Tsebo",
  "奕懋": "Yimao",
  "奕恭": "Yikong",
  "奕容": "Yirong",
  "奕信": "Yixin",
  "在鉴": "In review",
  "奕信之后": "After Yixin",
  "在勋": "Jae Hoon",
  "在纲": "In the Gang",
  "在机": "On-board",
  "大四": "Senior year",
  "在纲之后": "after Tsuna",
  "小四": "mistress",
  "丹一": "Danyi",
  "小四之子": "Xiaosi's son",
  "丹二": "Danji",
  "丹三": "Dan San",
  "文杲": "Wen Gao",
  "丹一之后，枫槎谢氏始迁祖": "After Danyi, the Xie family in Fengcha first moved to",
  "文榘": "Wen Ju",
  "丹一之后，东门桃源陈氏之祖": "After Danyi, the ancestor of the Chen family in Dongmen Taoyuan",
  "丹九": "Danjiu",
  "丹三之后": "After Dan San",
  "廿一": "Twenty-one",
  "丹九之后": "After Danjiu",
  "廿二": "twenty-two",
  "廿四": "Twenty-four",
  "十三": "Thirteen",
  "文榘之后": "After Wen Ju",
  "十七": "seventeen",
  "二一": "February 1",
  "廿七": "Twenty-seven",
  "十三之后": "after thirteen",
  "廿九": "Twenty-nine",
  "三十一": "Thirty-one",
  "四十": "forty",
  "廿二之后": "After twenty-two",
  "百十": "One hundred and ten",
  "廿七之后": "After twenty-seven",
  "庆三": "Keizo",
  "千九": "Thousands and nines",
  "四十之后": "after forty",
  "千十": "Thousands of ten",
  "千十一": "Thousand eleven",
  "千十三": "Thousand Thirteen",
  "敬乙": "Jingyi",
  "庆三之后": "After Keisan",
  "一廷": "Yiting",
  "千十一之后": "After the Thousand Eleventh Day",
  "隆": "Long",
  "琰": "Yan",
  "隆之后": "After Long",
  "琇": "Xiu",
  "位": "Bit",
  "琰之后": "After Yan",
  "倍": "times",
  "侍": "waiter",
  "体": "body",
  "旦": "denier",
  "俱生": "born with",
  "琇之后": "After Xiu",
  "礼": "etiquette",
  "位之后": "after bit",
  "管": "tube",
  "罗": "Luo",
  "泰鹏": "Taipeng",
  "管之后": "After taking care of",
  "泰颚": "Tai Jaw",
  "秀廉": "Xiulian",
  "泰颚之后": "After Taja",
  "秀洁": "Xiujie",
  "秀驹": "Xiuju",
  "古世系": "ancient lineage",
  "石马下谢分房": "Shima Xie Xie room allocation",
  "，享年": ", age",
  "岁": "years old",
  "出继": "Idetsu",
  "出": "out",
  "嗣": "heir",
  "第": "No.",
  "子女, ": "children,",
  "前枫槎": "former maple",
  "全世系总览": "Whole lineage overview",
  "连续完整世系": "continuous complete lineage",
  "后枫槎": "Hou Fengcha",
  "撰": "Written",
  "世 (": "world (",
  "远古": "ancient times",
  "东山": "dongshan",
  "临海": "Linhai",
  "石马": "stone horse",
  "查看' + b + '世系": "View ' + b + ' lineage",
  "是": "Yes",
  "共 0 条结果": "0 results in total",
  "共 ": "total",
  " 条结果": "results",
  "是(继子)": "Yes (stepson)",
  "本人": "myself",
  "曾祖父": "great grandfather",
  "高祖父": "great-great-grandfather",
  "天祖": "Tianzu",
  "烈祖": "Liezu",
  "太祖": "Taizu",
  "远祖": "distant ancestor",
  "鼻祖": "Originator",
  "上": "on",
  "世祖": "Shizu",
  "生父": "biological father",
  "继": "follow",
  "生": "give birth to",
  " 与 ": "with",
  " 是 ": "Yes",
  " 的父/母": "'s parent",
  " 的祖父母": "grandparents",
  " 的上": "on",
  "兄弟/姐妹": "brother/sister",
  "叔侄/姑侄": "uncle/nephew",
  "世孙 · 叔侄": "Grandchildren, uncles and nephews",
  "堂兄弟/堂姐妹（共祖": "Cousins/cousins (common ancestors)",
  "世）": "world)",
  "远房亲属": "distant relatives",
  "共同祖先：": "Common ancestor:",
  "（第": "(No.",
  "上古·传说": "Ancient·Legend",
  "周": "week",
  "秦汉": "Qin and Han",
  "魏晋南北朝": "Wei, Jin, Southern and Northern Dynasties",
  "隋唐": "Sui and Tang Dynasties",
  "宋": "Song",
  "元明": "Yuan and Ming Dynasties",
  "清": "Qing",
  "近现代": "modern times",
  "炎帝": "Emperor Yan",
  "彬·乾": "Bin Qian",
  "彬": "Bin",
  "乾": "Qian",
  "云先": "Yun Xian",
  "全屏查看 · 可缩放": "View full screen · Zoomable",
  "」字辈·": "\"Zi generation·",
  "世 共": "世 ",
  "人": "people",
  "请输入登记的管理员手机号": "Please enter the registered administrator’s mobile phone number",
  "请输入手机号": "Please enter mobile phone number",
  "提交成功 ✓": "Submission successful ✓",
  "有新消息": "There is new news",
  " 条新消息发布": "new messages posted",
  "未知曲目": "unknown track",
  "无法连接服务器，请检查网络后重试": "Unable to connect to the server, please check the network and try again",
  "服务器响应超时，请刷新后重试": "Server response timed out, please refresh and try again",
  "缵": "Zan",
  "飏": "Yang",
  "琂": "Yan",
  "琂之子": "Son of Yan",
  "诜": "Shen",
  "共 ": "Total ",
  "共": "Total",
  "《绿水青山望府香》": "Green Mountains and Clear Waters, Fragrance of Wangfu",
  "绿水青山望府香 · 下枫槎村影像记录": "Green Mountains and Clear Waters, Fragrance of Wangfu · Xiafengcha Village Visual Record",
  "宁海滩涂边的下枫槎艺术农场": "Xiafengcha Art Farm by Ninghai's Tidal Flats",
  "宁海滩涂边的下枫槎艺术农场视频记录": "Video Record of the Xiafengcha Art Farm by Ninghai's Tidal Flats",
  "下枫槎谢氏圆谱庆典": "Xiafengcha Xie Family Genealogy Completion Ceremony",
  "宁海下枫槎村谢氏圆谱庆典现场壮观景象": "Scenes from the grand Xie Family Genealogy Completion Ceremony in Xiafengcha Village, Ninghai",
  "2026圆谱大典实录": "2026 Genealogy Ceremony: Full Record",
  "2026年圆谱大典现场完整实录": "Complete Record of the 2026 Genealogy Ceremony",
  "枫槎夜景灯光秀": "Fengcha Night Light Show",
  "下枫槎村夜景灯光秀精彩展示": "Highlights from the Xiafengcha Village Night Light Show",
  "水东居士讲枫槎": "Lay Buddhist Shuidong Talks About Fengcha",
  "水东居士讲述下枫槎村的历史文化": "Lay Buddhist Shuidong Tells the History and Culture of Xiafengcha Village",
  "枫槎美景": "Fengcha Scenic Views",
  "下枫槎村风光美景": "Scenic Views of Xiafengcha Village",
  "来玩吧": "Come Visit",
  "下枫槎村欢迎你": "Xiafengcha Village Welcomes You",
  "云宠": "Cloud Pet",
  "云宠 · 下枫槎": "Cloud Pet · Xiafengcha",
  "茶园风光": "Tea Garden Scenery",
  "下枫槎村茶园风光": "Tea Garden Scenery in Xiafengcha Village",
  "宁海夜景": "Ninghai Night Scene",
  "宁海下枫槎村夜景": "Night Scene of Xiafengcha Village, Ninghai",
  "望府茶园": "Wangfu Tea Garden",
  "望府茶园 · 下枫槎村": "Wangfu Tea Garden · Xiafengcha Village",
  "下枫槎宣传片": "Xiafengcha Village Feature Film",
  "圆谱2026": "2026 Genealogy",
  "宣传片2": "Feature Film 2",
  "下枫槎村谢氏来源": "The Origins of the Xie Family in Xiafengcha Village",
  "下枫槎·谢氏": "Xiafengcha · Xie Family",
  "下枫槎村影像记录": "Xiafengcha Village Visual Record",
  "视频加载失败": "Video failed to load",
  "暂无视频": "No videos available"
};
Object.assign(EXTRA_TRANSLATIONS, GENERATED_RUNTIME_TRANSLATIONS);

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
    // Two-character fragments are too ambiguous in Chinese sentences (for
    // example “记录” may be part of a title or a person's name). Translate
    // complete phrases via the exact lookup above; only use longer entries as
    // safe legacy substring mappings here.
    if (key.length > 2 && output.indexOf(key) !== -1) output = output.split(key).join(EXTRA_TRANSLATIONS[key]);
  });
  Object.keys(TRANSLATIONS).forEach(function(key) {
    var item = TRANSLATIONS[key];
    if (item && item.zh && item.en && item.zh.length > 2 && output.indexOf(item.zh) !== -1) {
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
    .replace(/(\d+)\s*月/g, '$1 month')
    .replace(/(\d+)\s*年/g, '$1')
    .replace(/世代/g, 'generations')
    .replace(/世系图/g, 'lineage chart')
    .replace(/世系/g, 'lineage')
    .replace(/支系/g, 'branch')
    .replace(/第([一二三四五六七八九十百零〇]+)世/g, 'Generation $1');

  // Never replace unknown Chinese with a made-up phrase. That old fallback
  // produced strings such as “Family recordXiafengchaFamily record” and
  // presented them as if they were translations. Pages with source prose must
  // add a real phrase entry; an explicit neutral marker is safer than false
  // information while an untranslated legacy record is being migrated.
  return output.replace(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+/g, '[Source text pending translation]');
}

/*
 * Dynamic records need the same care as static labels.  These are the
 * published records currently supplied by the site's data APIs.  Keeping the
 * English copy by stable record id prevents the generic phrase translator
 * from tearing a Chinese title or article into unrelated fragments.
 */
const RECORD_TRANSLATIONS = {
  news: {
    '1': {
      title: 'Appeal for Contributions to Recompile the Xiafengcha Xie Family Genealogy',
      category: 'Family Affairs',
      author: 'Xiafengcha Xie Family Genealogy Revision Group',
      content: 'Appeal for Contributions to Recompile the Xiafengcha Xie Family Genealogy\n\nDear Xie relatives, elders and fellow villagers:\n\nA nation has its official history, a region has its local records, and a family has its genealogy. A genealogy is a precious record of our ancestors\' origins and family line, an important vessel for maintaining clan ties and honoring family teachings, and a spiritual bond that brings us together as we seek our roots.\n\nTo complete the clan lineage, clarify the generational relationships and preserve our family history, the elders and representatives of the family have agreed to formally begin this genealogy compilation project. It includes collecting and organizing materials, checking and editing the lineage, typesetting, printing and binding the volumes, and producing and distributing the finished genealogy. The required funds must be raised jointly by the whole family.\n\nRemembering the source of the water and honoring our ancestors are the duty and original purpose of every family member. To keep the project moving, the basic compilation contribution is set at RMB 500 per male or female family member for genealogy production and other basic expenses. The genealogy completion ceremony is scheduled for the first day of the fourth lunar month in 2026.\n\nWe also sincerely ask relatives, respected villagers and family members who are able to help to donate generously. Every amount, large or small, expresses devotion to our ancestors and love for the family. All donor names will be registered, entered in the genealogy and engraved on a stele at the ancestral hall for lasting recognition.\n\nPlease submit genealogy funds to the person responsible for your branch. Responsible representatives: Changmiao, Shizhong, Yunguo, Qingwen, Tongning, Haigang, Weiguo, Minhui, Xingping, Zhongda, Shengchang, Youtong, Xiaohuo, Shihe, Gaofei, Xiaokang, Xinglian, Xingyong, Dezong, Shifu and Shiyong. We hope every relative will work together to complete this important project, bless future generations and bring honor to the family.\n\nInitiated by: Xiafengcha Xie Family Genealogy Revision Group\nDate: Eighth day of the third lunar month, 2026'
    },
    '2': {
      title: 'Call for Old Family Photographs and Ancestor Stories',
      category: 'Family Affairs',
      author: 'Xiafengcha Xie Family Website',
      content: 'Call for Old Family Photographs and Ancestor Stories\n\nDear relatives:\n\nA tree may grow a thousand feet high, but its leaves return to the roots. Every yellowed old photograph preserves a moment of family memory; every story passed down by word of mouth carries the wisdom and character of our ancestors. To enrich the family history archive and carry forward the Xie cultural tradition, we are collecting the following materials from all family members:\n\n1. Old photographs\n• Village scenes, buildings and ancestral halls showing the historical appearance of Xiafengcha Village\n• Portraits, group photographs and daily-life photographs of ancestors from every generation\n• Photographs of family events, weddings, funerals, festivals and reunions\n• Images of period documents, certificates, awards and letters\n\n2. Stories of ancestors\n• Oral accounts of ancestors moving here and establishing the family\n• Inspiring deeds, good works and acts of kindness by family members through the generations\n• Family anecdotes, instructions and stories of family values passed down by word of mouth\n• Historical memories and folk stories related to the Xie clan\n\n3. Other family documents\n• Old genealogies, contracts, land deeds and household division documents\n• Rubbings or photographs of historical steles, plaques and couplets\n• Old newspaper reports related to the family\n\nAfter the collected materials are organized, they will be published in the website sections for notable figures and family history, and may also be compiled into a permanent volume. Please include basic background information such as the time, place and people shown so that the materials can be checked.\n\nFor contact, leave a message on the family website\'s Contact page or send the materials through the person responsible for your branch.\n\nWe sincerely ask every relative to support this effort so that the history and spirit of the Xiafengcha Xie family can be passed on from generation to generation.\n\nXiafengcha Xie Family Website\nJune 16, 2026'
    },
    'title:征集家族老照片与先辈故事启事': {
      title: 'Call for Old Family Photographs and Ancestor Stories',
      category: 'Family Affairs',
      author: 'Xiafengcha Xie Family Website',
      content: 'Call for Old Family Photographs and Ancestor Stories\n\nDear relatives:\n\nA tree may grow a thousand feet high, but its leaves return to the roots. Every yellowed old photograph preserves a moment of family memory; every story passed down by word of mouth carries the wisdom and character of our ancestors. To enrich the family history archive and carry forward the Xie cultural tradition, we are collecting the following materials from all family members:\n\n1. Old photographs\n• Village scenes, buildings and ancestral halls showing the historical appearance of Xiafengcha Village\n• Portraits, group photographs and daily-life photographs of ancestors from every generation\n• Photographs of family events, weddings, funerals, festivals and reunions\n• Images of period documents, certificates, awards and letters\n\n2. Stories of ancestors\n• Oral accounts of ancestors moving here and establishing the family\n• Inspiring deeds, good works and acts of kindness by family members through the generations\n• Family anecdotes, instructions and stories of family values passed down by word of mouth\n• Historical memories and folk stories related to the Xie clan\n\n3. Other family documents\n• Old genealogies, contracts, land deeds and household division documents\n• Rubbings or photographs of historical steles, plaques and couplets\n• Old newspaper reports related to the family\n\nAfter the collected materials are organized, they will be published in the website sections for notable figures and family history, and may also be compiled into a permanent volume. Please include basic background information such as the time, place and people shown so that the materials can be checked.\n\nFor contact, leave a message on the family website\'s Contact page or send the materials through the person responsible for your branch.\n\nWe sincerely ask every relative to support this effort so that the history and spirit of the Xiafengcha Xie family can be passed on from generation to generation.\n\nXiafengcha Xie Family Website\nJune 16, 2026'
    }
  },
  reports: {
    '1': { title: 'Ninghai Xiafengcha Xie Family Genealogy Ceremony Concludes Successfully', source: 'Zhejiang Xie Family Kinship Association', content: 'On May 17, the Xie ancestral hall in Xiafengcha, Ninghai, was decorated with lanterns and filled with celebration as the long-awaited genealogy completion ceremony took place. More than 200 representatives from the Dongshan Culture Research Association in Ningbo, Xie relatives from across Ninghai, representatives from Xiaxie in Sanmen and representatives from Feishu in Tiantai gathered from many places. With respect for their ancestors and affection for their shared bloodline, they came together at the ancestral hall for a cultural event that preserves the family roots and brings relatives closer.' },
    '2': { title: 'City Cultural Envoy Vlog: Silver-Haired Shared-Prosperity Tea Workshop Opens in Wangfu Village', source: 'Ningbo Radio and Television', content: 'Recently, the opening ceremony for the Silver-Haired Shared-Prosperity Tea Workshop in Wangfu Village, together with the signing ceremony for the agricultural assistance partnership, was held in the Xiafengcha natural village of Wangfu Village, Yuelong Subdistrict, Ninghai County. Retired cadres from the county agriculture bureau, the Yuelong Subdistrict and representatives of the Xiafengcha Party branch attended.' },
    '3': { title: 'Art Exploration of New Countryside | Tea Fragrance Touches the Heart: Xiafengcha Village, Yuelong Subdistrict, Ninghai', source: 'Ningbo Literature and Art', content: 'In recent years, the Ningbo Federation of Literary and Art Circles has implemented an art-empowered rural development program under its guidelines for artistic village building. The program organizes photographers and writers to visit villages where art is supporting development, recording the changes in images and telling vivid stories in writing. The Ningbo Literature and Art column created “Art Exploration of New Countryside” to showcase selected results and introduce Ningbo villages filled with an artistic spirit.' },
    '4': { title: 'Clear Breeze Beneath Wangfu Mountain', source: 'Clean Zhejiang', content: 'In early spring, Wangfulou Mountain in Ninghai is lush and wrapped in drifting mist. At its foot, Xiafengcha Village has added traditional-style pavilions, a musical fountain, bridges and running water, creating a pastoral landscape. Xiafengcha is a natural village under Wangfu Village, Yuelong Subdistrict, Ninghai County, beside Baiqiao Harbor and below Wangfulou Mountain, at the entrance to Fengcha Ridge, with a history of more than 650 years. In recent years, the village has used its mountain scenery and Wangfu tea-producing area to develop a tea-culture art village and deepen its clean-governance culture, using beautiful village construction to support rural revitalization.' },
    '5': { title: 'A Tea-Culture Art Village Reveals Its Charm', source: 'Sohu', content: 'In midsummer, Wangfulou Mountain in Ninghai is lush and wrapped in mist. At its foot, Xiafengcha Village in Yuelong Subdistrict has built traditional-style pavilions, a musical fountain, bridges and running water, forming a pastoral scene. “The new rural development here is distinctive. Visitors can drink tea, listen to music and enjoy the scenery on a unique tea-culture journey,” said a Ningbo resident who visited with her family during a holiday.' },
    '6': { title: 'Yuelong, Ninghai: Art Brings New Vitality to Rural Revitalization', source: 'Zhejiang Daily', content: 'After summer rain, a sea of clouds appears above the thousand-mu tea gardens on Wangfulou Mountain in Yuelong Subdistrict, Ninghai. Along the ten-li Windmill Road, visitors see a beautiful panorama of tea gardens and clouds. At the foot of the mountain, Xiafengcha Village echoes the scene with traditional-style pavilions, a musical fountain, bridges and running water. The village offers tea, music and scenery as part of a distinctive tea-culture experience.' },
    '7': { title: 'Xiafengcha Village Builds a Tea-Culture Art Village', source: 'Ningbo Radio and Television', content: 'In autumn, the walls of Xiafengcha Village in Yuelong Subdistrict, Ninghai, are covered with distinctive greenery and creative works by rural-art builders. The rice fields are ready for harvest, and many photography enthusiasts visit to record the scene. A visitor from outside Ningbo recently brought his family during a holiday and was impressed by the artistic atmosphere of this small village.' },
    '8': { title: 'Ninghai Village Turns Waste into Art', source: 'Zhejiang Ecological and Environmental Protection News', content: 'Yesterday in Xiafengcha Village, Yuelong Subdistrict, Ninghai, the “Make the Most of Everything — Waste Is Not Useless” initiative sparked villagers\' enthusiasm for artistic creation. At resident Shen Yuyan\'s home, old furniture, used clothes, tree stumps and bamboo became distinctive elements of a public cultural service space. A member of Professor Cong Zhiqiang\'s team from Renmin University of China explained that the team worked with villagers through co-creation and design to turn unused household space into public cultural space.' },
    '9': { title: 'Ninghai Xiafengcha: Exploring Rural Public Cultural Spaces and Illuminating the Courtyard Economy', source: '—', content: 'This report follows the “Make the Most of Everything — Waste Is Not Useless” initiative in Xiafengcha Village, where residents explore how idle household materials and courtyards can become shared public cultural spaces and support a distinctive rural economy.' },
    '10': { title: 'Tea Fragrance Welcomes Visitors: Highlights from the 2022 Wangfu Tea Feast Cultural Festival', source: 'Ningbo News Network', content: 'In late spring, Wangfulou Mountain was lush and the 2022 Zhejiang Ninghai Yuelong Wangfu Tea Feast Cultural Festival opened as scheduled in the Xiafengcha natural village of Wangfu Village. Tasting Fengcha, enjoying the scenery, experiencing local customs, eating tea food and listening to tea traditions gave visitors from near and far a distinctive tea-culture journey.' },
    '11': { title: 'Ninghai “Little Green Dragon” Team Explores a Shared Path to Ecological Beauty and Common Prosperity in Xiafengcha', source: 'Ningbo Agriculture and Rural Affairs Bureau Website', content: 'Recently, the “Little Green Dragon” promotion team of Yuelong Subdistrict, Ninghai, visited Xiafengcha Village for an immersive study activity on the theme “Young People Discuss the Idea that Lucid Waters and Lush Mountains Are Invaluable Assets.” The team explored how ecological beauty and common prosperity can develop together. Residents described the village\'s transformation from worn earthen houses and broken walls into a colorful, playful and welcoming place for visitors.' },
    '12': { title: '“Little Green Dragon” Immersive Study Tour Explores Ecological Beauty and Common Prosperity in Xiafengcha', source: 'Ninghai News Network', content: 'Ninghai News Network reports that the “Little Green Dragon” promotion team of Yuelong Subdistrict recently visited Xiafengcha Village for an immersive study activity about the idea that lucid waters and lush mountains are invaluable assets, exploring a shared path toward ecological beauty and common prosperity.' },
    '13': { title: 'A Fragrance of Tea Lights Up “Poetry and Far Away”: Highlights from the 2023 Wangfu Tea Feast Cultural Festival', source: 'Ninghai News Network', content: 'On April 22, 2023, the Zhejiang Ninghai Yuelong Wangfu Tea Feast Cultural Festival opened in the Xiafengcha natural village of Wangfu Village. A series of activities — enjoying Wangfu, touring Wangfu, tasting Wangfu tea and finding pleasure in Wangfu — invited visitors to experience the character of a tea village, savor Wangfu tea and discover the special charm of the festival.' },
    '14': { title: '“Rural Tourism” Supports Shared Prosperity: Ninghai Builds More Than 200 Scenic Villages', source: 'Ningbo Daily', content: 'With support from the scenery of Wangfulou Mountain and the resident team led by Cong Zhiqiang of Renmin University of China, Xiafengcha Village has developed six modules: tea feasting, tea appreciation, tea activities, tea leisure, tea study and tea views. Art has helped residents build rockeries, traditional-style pavilions, ponds and bridges, illuminated sports courts and parks, giving visitors a distinctive tea-themed rural tourism experience.' },
    '15': { title: 'Original New Work | “May We Live Long” and “Green Mountains, Blue Waters, Wangfu Fragrance”', source: 'Ninghai Community Culture', content: 'The square dance uses “May We Live Long,” a song expressing good wishes, as its music. Its lyrics come from Su Shi\'s ci poem “Prelude to Water Melody,” which conveys longing for family and home. The choreography combines the body forms and rhythm of Song-style dance with the poem\'s mood, creating an imaginative and visually enjoyable performance.' },
    '16': { title: 'The Founding Patriarch of Buddhism in Zhejiang: Do You Know the First Stop of Master Tanyou\'s Eastern Journey?', source: 'Wenzhou Ancient Trail', content: 'Master Tanyou was from Dunhuang during the Eastern Jin period and is regarded as a pioneer of Buddhism on Tiantai Mountain and an early founder of Buddhism in Zhejiang. According to the Gaoseng Zhuan, he ranked third among the twenty-one monks from Dunhuang. He crossed eastward by sea, landed at Baiqiao Harbor in Sanmen Bay, spread Buddhist teachings along the coast and eventually meditated at Chicheng Mountain in Tiantai, leaving behind many stories that have been told through the ages.' },
    '17': { title: 'Culture Ninghai | Chen Qusheng: Visiting Xiafengcha and Interviewing the Sunflowers', source: '—', content: 'A cultural feature on visiting Xiafengcha Village, meeting local people and recording the village\'s everyday vitality through the image of sunflowers.' }
  },
  collection: {
    '2': { title: 'Swallows Once Flew Through Wang and Xie Halls: How Did the Two Eastern Jin Clans Rise?', category: 'Family Origins' },
    '3': { title: 'People Often Mention Wang and Xie Together; Dig Deeper and You See Where the Xie Surname\'s Confidence Comes From', category: 'Historical Figures' },
    '4': { title: 'The Hundred Surnames, Episode 34: The Origins of the Xie Surname, Ranked 23rd', category: 'Family Origins' },
    '5': { title: 'The People\'s Name! Origins and Evolution of Chinese Surnames', category: 'Family Origins' },
    '6': { title: 'How Were Genealogies Compiled in Ancient Times?', category: 'Genealogy Culture' }
  }
};

const PERSON_NAME_TRANSLATIONS = {
  '炎帝神农氏': 'Emperor Yan Shennong',
  '炎帝': 'Emperor Yan',
  '临魁': 'Linkui',
  '榆罔': 'Yuwang',
  '帝柱': 'Dizhu',
  '祝融': 'Zhurong',
  '吕尚': 'Lü Shang',
  '佐': 'Zuo',
  '申伯': 'Shenbo',
  '申甫': 'Shenfu',
  '弘': 'Hong',
  '猛': 'Meng',
  '广': 'Guang',
  '协': 'Xie',
  '列宗': 'Lie Zong',
  '穆宗': 'Mu Zong',
  '缵': 'Zan',
  '衡': 'Heng',
  '安': 'An',
  '闓': 'Kai',
  '文杲': 'Wen Gao',
  '文杲公': 'Wen Gao Gong',
  '文榘': 'Wen Ju',
  '文榘公': 'Wen Ju Gong',
  '攒': 'Zan',
  '撰': 'Zhuan',
  '彬': 'Bin',
  '彬公': 'Bin Gong',
  '乾': 'Qian',
  '乾公': 'Qian Gong',
  '云先': 'Yun Xian',
  '云先公': 'Yun Xian Gong',
  '小四': 'Xiaosi',
  '谢小四': 'Xie Xiaosi'
};

function englishPersonName(person, fallback) {
  var raw = person && person.name !== undefined ? person.name : fallback;
  if (raw === null || raw === undefined || raw === '') return 'Unknown member';
  var name = String(raw);
  if (getLang() !== 'en' || !/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(name)) return name;
  var direct = PERSON_NAME_TRANSLATIONS[name];
  if (direct) return direct;
  var translated = translateString(name, 'en');
  if (translated && !/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(translated) && translated.indexOf('[Source text pending translation]') === -1) return translated;
  var id = person && person.id !== undefined && person.id !== null ? String(person.id) : '';
  return id ? 'Member ' + id : 'Family member';
}

function getLocalizedRecord(record, type) {
  if (!record || getLang() !== 'en') return record;
  var source = Object.assign({}, record);
  var table = RECORD_TRANSLATIONS[type] || {};
  var translated = table[String(record.id)] || {};
  if (!Object.keys(translated).length && record.title) {
    translated = table['title:' + String(record.title)] || {};
  }
  Object.keys(translated).forEach(function (field) { source[field] = translated[field]; });
  ['title', 'category', 'source', 'author', 'content', 'desc', 'cat'].forEach(function (field) {
    if (!source[field]) return;
    if (translated[field]) return;
    var candidate = translateString(source[field], 'en');
    if (candidate && !/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(candidate) && candidate.indexOf('[Source text pending translation]') === -1) {
      source[field] = candidate;
    }
  });
  return source;
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
    // 侧栏脚本可能在语言脚本之后异步注入旧按钮；无论当前语言是什么，
    // 都要把它收拢到统一的顶部按钮，避免页面出现两个切换入口。
    ensureLanguageToggle();
    if (getLang() !== 'en') return;
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
    style.textContent = '.site-language-dock{display:flex;align-items:center;justify-content:flex-end;flex:0 0 auto;min-height:52px;width:100%;padding:9px 14px;box-sizing:border-box;background:var(--bg-primary,var(--navhub-bg,#f6f7f8));border-bottom:1px solid rgba(35,49,58,.1);position:relative;z-index:1000}.site-language-dock .site-language-toggle{position:relative!important;top:auto!important;right:auto!important;z-index:1;flex:0 0 auto}.site-language-toggle{min-width:46px;height:34px;padding:0 11px;border:1px solid rgba(128,128,128,.35);border-radius:999px;background:rgba(255,255,255,.96);color:#26343c;font:700 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;box-shadow:0 5px 18px rgba(0,0,0,.14);-webkit-tap-highlight-color:transparent}.site-language-toggle:hover,.site-language-toggle.active{color:#995b24;border-color:#995b24}.site-language-toggle:focus-visible{outline:3px solid rgba(153,91,36,.22);outline-offset:2px}.site-language-dock--toolbar{width:auto;min-height:0;padding:0;background:transparent;border:0;box-shadow:none;position:static}.news-source-toolbar{flex-wrap:wrap}.site-language-dock--card{width:100%;min-height:38px;margin:0 0 12px;padding:0;background:transparent;border:0;box-shadow:none;position:static}.site-language-dock--entrance{position:absolute;top:12px;right:12px;width:auto;min-height:0;padding:0;background:transparent;border:0;box-shadow:none;z-index:60}.site-language-dock--entrance .site-language-toggle{box-shadow:0 5px 18px rgba(0,0,0,.32)}.site-language-dock--fullscreen{position:absolute;top:16px;left:50%;width:auto;min-height:0;padding:0;background:transparent;border:0;box-shadow:none;transform:translateX(-50%);z-index:60}.site-language-dock--fullscreen .site-language-toggle{box-shadow:0 5px 18px rgba(0,0,0,.32)}#stage #clk{top:60px!important}#pv-overlay.show ~ .site-language-dock--entrance{display:none!important}[data-theme="dark"] .site-language-dock{background:var(--mb-bg,#101214);border-bottom-color:rgba(255,255,255,.1)}[data-theme="dark"] .site-language-dock--toolbar,[data-theme="dark"] .site-language-dock--card,[data-theme="dark"] .site-language-dock--entrance,[data-theme="dark"] .site-language-dock--fullscreen{background:transparent;border-bottom-color:transparent}.site-language-legacy{display:none!important}@media(max-width:768px){.site-language-dock{min-height:48px;padding:7px 10px}.site-language-dock--toolbar{min-height:0;padding:0}.site-language-dock--card{min-height:34px;margin-bottom:10px}.site-language-dock--entrance{top:10px;right:10px}.site-language-dock--fullscreen{top:10px}.site-language-toggle{min-width:44px;height:32px}.site-language-dock--entrance + #clk{top:56px!important}#stage #clk{top:56px!important}}';
    document.head.appendChild(style);
  }
  // 开启页在手机端已有顶部按钮，直接复用它；其他页面把按钮放进有真实占位的安全区域，
  // 避免固定悬浮层遮住页面原有的按钮和正文。
  var canonical = document.getElementById('site-language-toggle');
  var isOpeningMobile = !!(document.querySelector('.mb-story-home') &&
    !document.documentElement.classList.contains('mb-show-main') &&
    window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  if (!canonical && isOpeningMobile) canonical = document.getElementById('mbsLanguageToggle');
  if (!canonical && document.body) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'site-language-toggle';
    btn.className = 'language-toggle site-language-toggle';
    btn.textContent = 'EN';
    btn.setAttribute('aria-label', 'Switch language');
    btn.title = 'Switch language';
    canonical = btn;
  }
  if (canonical && canonical.id === 'site-language-toggle' && !document.getElementById('site-language-dock')) {
    var dock = document.createElement('div');
    dock.id = 'site-language-dock';
    dock.className = 'site-language-dock';
    dock.setAttribute('aria-label', 'Language');
    dock.appendChild(canonical);

    var toolbar = document.querySelector('.news-source-toolbar');
    var offlineCard = document.querySelector('.offline-card');
    var entranceStage = document.getElementById('stage');
    var navhubContent = document.querySelector('.navhub-content');
    var content = document.querySelector('.content');
    var main = document.querySelector('main');
    var fullscreenStage = document.querySelector('.video-container');
    if (toolbar) {
      dock.classList.add('site-language-dock--toolbar');
      toolbar.appendChild(dock);
    } else if (offlineCard) {
      dock.classList.add('site-language-dock--card');
      offlineCard.insertBefore(dock, offlineCard.firstChild);
    } else if (entranceStage) {
      // 全屏入口页的内容层是 fixed，按钮放入 stage 并避开时钟；图片查看器打开时自动让位给关闭按钮。
      dock.classList.add('site-language-dock--entrance');
      entranceStage.appendChild(dock);
    } else if (fullscreenStage) {
      // 宣传片也是全屏 fixed 画布，按钮放在画面上方中央，避开左上角标识、右上角场景名和底部播放控件。
      dock.classList.add('site-language-dock--fullscreen');
      fullscreenStage.appendChild(dock);
    } else if (navhubContent) {
      navhubContent.insertBefore(dock, navhubContent.firstChild);
    } else if (content) {
      content.insertBefore(dock, content.firstChild);
    } else if (main) {
      main.insertBefore(dock, main.firstChild);
    } else {
      document.body.insertBefore(dock, document.body.firstChild);
    }
  }
  document.querySelectorAll('#lang-toggle, .language-toggle').forEach(function(toggle) {
    toggle.classList.add('language-toggle');
    if (toggle !== canonical) toggle.classList.add('site-language-legacy');
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
window.TRANSLATIONS = TRANSLATIONS;
window.getLang = getLang;
window.setLang = setLang;
window.translateString = translateString;
window.englishPersonName = englishPersonName;
window.getLocalizedRecord = getLocalizedRecord;
window.applyLanguage = applyLanguage;
window.toggleLanguage = toggleLanguage;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguage);
} else {
  initLanguage();
}
