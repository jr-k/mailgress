-- Add first_name and last_name to users table
ALTER TABLE users ADD COLUMN first_name TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN last_name TEXT DEFAULT '';
