CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source_type VARCHAR(50) NOT NULL,
  source_url TEXT,
  repo_name TEXT,
  average_score NUMERIC(3,1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  language VARCHAR(50),
  code_content TEXT,
  bug_report JSONB,
  improvements JSONB,
  quality_score NUMERIC(3,1),
  documentation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
