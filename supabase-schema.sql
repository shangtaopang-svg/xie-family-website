-- ============================================
-- 宁海下枫槎村 · 谢氏家族网站
-- Supabase 数据库建表脚本
-- 客户端管理 ID（用于保持族谱跨表引用一致性）
-- 在 Supabase 控制台 → SQL Editor 中运行
-- ============================================

-- 1. 新闻报道 (reports)
CREATE TABLE IF NOT EXISTS reports (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT DEFAULT '',
  source TEXT DEFAULT '',
  url TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 新闻动态 (news)
CREATE TABLE IF NOT EXISTS news (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  date TEXT DEFAULT '',
  author TEXT DEFAULT '',
  url TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 家族成员 (members)
CREATE TABLE IF NOT EXISTS members (
  id BIGINT PRIMARY KEY,
  name TEXT DEFAULT '',
  branch TEXT DEFAULT '',
  generation TEXT DEFAULT '',
  avatar TEXT DEFAULT '👤',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 家族活动 (activities)
CREATE TABLE IF NOT EXISTS activities (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT DEFAULT '',
  status TEXT DEFAULT '',
  icon TEXT DEFAULT '📌',
  content TEXT DEFAULT '',
  location TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 荣誉奖项 (honors)
CREATE TABLE IF NOT EXISTS honors (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT DEFAULT '',
  awarder TEXT DEFAULT '',
  icon TEXT DEFAULT '🏆',
  url TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 轮播图片 (temple_carousel)
CREATE TABLE IF NOT EXISTS temple_carousel (
  id BIGINT PRIMARY KEY,
  title TEXT DEFAULT '',
  has_file BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 相册 (photos)
CREATE TABLE IF NOT EXISTS photos (
  id BIGINT PRIMARY KEY,
  title TEXT DEFAULT '',
  icon TEXT DEFAULT '🖼️',
  color TEXT DEFAULT '#0f0f1a',
  has_file BOOLEAN DEFAULT FALSE,
  file_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 视频 (videos)
CREATE TABLE IF NOT EXISTS videos (
  id BIGINT PRIMARY KEY,
  title TEXT DEFAULT '',
  url TEXT DEFAULT '',
  embed TEXT DEFAULT '',
  poster TEXT DEFAULT '🎬',
  description TEXT DEFAULT '',
  has_file BOOLEAN DEFAULT FALSE,
  file_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 留言 (messages)
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT PRIMARY KEY,
  name TEXT DEFAULT '',
  message TEXT DEFAULT '',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 系统设置 (settings)
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY,
  key TEXT DEFAULT '',
  value TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. 族谱 (genealogy)
CREATE TABLE IF NOT EXISTS genealogy (
  id BIGINT PRIMARY KEY,
  generation_num INTEGER DEFAULT 0,
  name TEXT DEFAULT '',
  gender TEXT DEFAULT '男',
  generation TEXT DEFAULT '',
  father_id BIGINT DEFAULT NULL,
  mother_id BIGINT DEFAULT NULL,
  spouse_ids TEXT DEFAULT '',
  adopted TEXT DEFAULT '否',
  branch TEXT DEFAULT '',
  birth_date TEXT DEFAULT '',
  death_date TEXT DEFAULT '',
  is_alive TEXT DEFAULT '是',
  address TEXT DEFAULT '',
  biography TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== RLS 策略：允许所有操作（安全性由前端密码门控制） =====
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE honors ENABLE ROW LEVEL SECURITY;
ALTER TABLE temple_carousel ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE genealogy ENABLE ROW LEVEL SECURITY;

-- 允许所有人读写所有表（安全性由前端密码门控制）
CREATE POLICY "public_all" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON honors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON temple_carousel FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON genealogy FOR ALL USING (true) WITH CHECK (true);
