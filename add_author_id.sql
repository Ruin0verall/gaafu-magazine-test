ALTER TABLE articles ADD COLUMN author_id UUID REFERENCES auth.users(id); ALTER TABLE articles ALTER COLUMN author_id DROP NOT NULL;
