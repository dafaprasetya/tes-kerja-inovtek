-- RecruitHub · Inovtek Cipta Digital
-- Supabase SQL Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Full-time',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  position TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'interview', 'hired', 'rejected')),
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (demo purposes — tighten in production!)
CREATE POLICY "allow_all_jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_candidates" ON candidates FOR ALL USING (true) WITH CHECK (true);

-- Seed jobs
INSERT INTO jobs (title, department, location, type, status, description) VALUES
  ('Senior Frontend Developer', 'Engineering', 'Jakarta, Remote', 'Full-time', 'open', 'Looking for a Senior Frontend Developer with React expertise.'),
  ('Backend Engineer', 'Engineering', 'Jakarta', 'Full-time', 'open', 'Backend Engineer with Node.js and PostgreSQL experience.'),
  ('UI/UX Designer', 'Design', 'Remote', 'Full-time', 'open', 'Creative UI/UX Designer to craft beautiful user experiences.'),
  ('Product Manager', 'Product', 'Jakarta', 'Full-time', 'closed', 'Product Manager to lead our core product team.'),
  ('DevOps Engineer', 'Engineering', 'Jakarta, Remote', 'Contract', 'draft', 'DevOps Engineer with AWS and Kubernetes experience.'),
  ('Data Analyst', 'Data', 'Jakarta', 'Full-time', 'open', 'Data Analyst with Python and SQL proficiency.');

-- Seed candidates (job_id will reference the inserted jobs)
-- Note: Run the candidates insert after jobs are inserted
DO $$
DECLARE
  job1 UUID;
  job2 UUID;
  job3 UUID;
  job4 UUID;
  job5 UUID;
  job6 UUID;
BEGIN
  SELECT id INTO job1 FROM jobs WHERE title = 'Senior Frontend Developer' LIMIT 1;
  SELECT id INTO job2 FROM jobs WHERE title = 'Backend Engineer' LIMIT 1;
  SELECT id INTO job3 FROM jobs WHERE title = 'UI/UX Designer' LIMIT 1;
  SELECT id INTO job4 FROM jobs WHERE title = 'Product Manager' LIMIT 1;
  SELECT id INTO job5 FROM jobs WHERE title = 'DevOps Engineer' LIMIT 1;
  SELECT id INTO job6 FROM jobs WHERE title = 'Data Analyst' LIMIT 1;

  INSERT INTO candidates (name, email, phone, position, status, job_id) VALUES
    ('Budi Santoso', 'budi@email.com', '08123456789', 'Senior Frontend Developer', 'applied', job1),
    ('Siti Rahayu', 'siti@email.com', '08234567890', 'UI/UX Designer', 'interview', job3),
    ('Ahmad Fauzi', 'ahmad@email.com', '08345678901', 'Backend Engineer', 'hired', job2),
    ('Dewi Lestari', 'dewi@email.com', '08456789012', 'Data Analyst', 'applied', job6),
    ('Eko Prasetyo', 'eko@email.com', '08567890123', 'Senior Frontend Developer', 'interview', job1),
    ('Fitri Handayani', 'fitri@email.com', '08678901234', 'Product Manager', 'hired', job4),
    ('Galih Wicaksono', 'galih@email.com', '08789012345', 'DevOps Engineer', 'applied', job5),
    ('Hani Permata', 'hani@email.com', '08890123456', 'UI/UX Designer', 'interview', job3);
END $$;
