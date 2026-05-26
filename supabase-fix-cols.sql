-- Fix column naming mismatch in Supabase
-- JS 代码使用 camelCase，需要和数据库列名一致

-- Photos
ALTER TABLE photos RENAME COLUMN has_file TO "hasFile";
ALTER TABLE photos RENAME COLUMN file_name TO "fileName";

-- Videos
ALTER TABLE videos RENAME COLUMN description TO "desc";
ALTER TABLE videos ADD COLUMN IF NOT EXISTS "hasFile" BOOLEAN DEFAULT FALSE;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS "fileName" TEXT DEFAULT '';
ALTER TABLE videos DROP COLUMN IF EXISTS has_file;
ALTER TABLE videos DROP COLUMN IF EXISTS file_name;

-- Temple carousel
ALTER TABLE temple_carousel RENAME COLUMN has_file TO "hasFile";
