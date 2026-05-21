/*
  # Add bilingual (Arabic) fields to content tables

  1. Modified Tables
    - `products` — add product_name_ar, short_description_ar, full_description_ar
    - `portfolio_projects` — add title_ar, description_ar, client_name_ar
    - `partners` — add name_ar, description_ar
    - `blog_posts` — add title_ar, content_ar, excerpt_ar (if table exists)

  2. Notes
    - All new columns default to empty string (not null) for safe fallback
    - Existing rows remain unaffected; Arabic fields will be empty until filled via admin
    - No data is dropped
*/

-- Products bilingual fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'product_name_ar') THEN
    ALTER TABLE products ADD COLUMN product_name_ar text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'short_description_ar') THEN
    ALTER TABLE products ADD COLUMN short_description_ar text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'full_description_ar') THEN
    ALTER TABLE products ADD COLUMN full_description_ar text DEFAULT '';
  END IF;
END $$;

-- Portfolio projects bilingual fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_projects' AND column_name = 'title_ar') THEN
    ALTER TABLE portfolio_projects ADD COLUMN title_ar text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_projects' AND column_name = 'description_ar') THEN
    ALTER TABLE portfolio_projects ADD COLUMN description_ar text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_projects' AND column_name = 'client_name_ar') THEN
    ALTER TABLE portfolio_projects ADD COLUMN client_name_ar text DEFAULT '';
  END IF;
END $$;

-- Partners bilingual fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'name_ar') THEN
    ALTER TABLE partners ADD COLUMN name_ar text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'description_ar') THEN
    ALTER TABLE partners ADD COLUMN description_ar text DEFAULT '';
  END IF;
END $$;

-- Blog posts bilingual fields (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'title_ar') THEN
      ALTER TABLE blog_posts ADD COLUMN title_ar text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'content_ar') THEN
      ALTER TABLE blog_posts ADD COLUMN content_ar text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'excerpt_ar') THEN
      ALTER TABLE blog_posts ADD COLUMN excerpt_ar text DEFAULT '';
    END IF;
  END IF;
END $$;
