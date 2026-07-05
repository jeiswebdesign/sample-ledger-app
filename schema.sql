-- Run this once against your Neon database before first deploy.
-- (Neon SQL Editor, or `psql` with your connection string.)

CREATE TABLE IF NOT EXISTS sample_entries (
  id             TEXT PRIMARY KEY,
  brand          TEXT NOT NULL,
  product        TEXT,
  asin           TEXT,
  category       TEXT,
  date_received  DATE,
  value          NUMERIC(10,2) DEFAULT 0,
  collab         TEXT DEFAULT 'unknown',
  elsewhere      TEXT,
  sponsor        TEXT,
  resold         TEXT DEFAULT 'no',
  resale_date    DATE,
  resale_amount  NUMERIC(10,2) DEFAULT 0,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);
