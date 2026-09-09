/*
# nicotinacat Hub — Full Database Schema

## Overview
Creates the complete schema for the nicotinacat Hub community + arcade platform:
- Profiles with class selection, level, XP, gold
- Social: posts, comments, likes, follows, notifications
- Arcade: card collection, deck, inventory, expeditions
- Wishlist items (curated)

## Tables
1. profiles — extends auth.users with display_name, username, bio, avatar_url, class_id, level, xp, gold
2. posts — community feed posts
3. comments — comments on posts
4. likes — likes on posts (unique per user per post)
5. follows — follow relationships
6. notifications — user notifications
7. user_cards — cards owned by users
8. user_decks — deck composition
9. user_inventory — items owned
10. expeditions — expedition state
11. wishlist_items — curated Amazon wishlist items

## Security
- RLS enabled on every table.
- profiles: all authenticated can read; owner can insert/update.
- posts/comments/likes/follows: all authenticated can read; owner can write/delete.
- notifications/user_cards/user_decks/user_inventory/expeditions: owner-only CRUD.
- wishlist_items: all authenticated read-only.
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Newcomer',
  username text UNIQUE NOT NULL DEFAULT 'newcomer',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  class_id text DEFAULT NULL,
  level int NOT NULL DEFAULT 1,
  xp int NOT NULL DEFAULT 0,
  gold int NOT NULL DEFAULT 0,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  media_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_all" ON posts;
CREATE POLICY "posts_select_all" ON posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "posts_insert_own" ON posts;
CREATE POLICY "posts_insert_own" ON posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "posts_update_own" ON posts;
CREATE POLICY "posts_update_own" ON posts FOR UPDATE
  TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "posts_delete_own" ON posts;
CREATE POLICY "posts_delete_own" ON posts FOR DELETE
  TO authenticated USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts (author_id);

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_all" ON comments;
CREATE POLICY "comments_select_all" ON comments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_own" ON comments;
CREATE POLICY "comments_insert_own" ON comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "comments_delete_own" ON comments;
CREATE POLICY "comments_delete_own" ON comments FOR DELETE
  TO authenticated USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);

-- likes
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "likes_select_all" ON likes;
CREATE POLICY "likes_select_all" ON likes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "likes_insert_own" ON likes;
CREATE POLICY "likes_insert_own" ON likes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "likes_delete_own" ON likes;
CREATE POLICY "likes_delete_own" ON likes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes (post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes (user_id);

-- follows
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  followee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (follower_id, followee_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "follows_select_all" ON follows;
CREATE POLICY "follows_select_all" ON follows FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "follows_insert_own" ON follows;
CREATE POLICY "follows_insert_own" ON follows FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "follows_delete_own" ON follows;
CREATE POLICY "follows_delete_own" ON follows FOR DELETE
  TO authenticated USING (auth.uid() = follower_id);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee_id ON follows (followee_id);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'general',
  entity_id uuid,
  entity_type text DEFAULT '',
  content text DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id, created_at DESC);

-- user_cards
CREATE TABLE IF NOT EXISTS user_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  card_id text NOT NULL,
  count int NOT NULL DEFAULT 1,
  discovered_at timestamptz DEFAULT now(),
  UNIQUE (user_id, card_id)
);

ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_cards_select_own" ON user_cards;
CREATE POLICY "user_cards_select_own" ON user_cards FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_cards_insert_own" ON user_cards;
CREATE POLICY "user_cards_insert_own" ON user_cards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_cards_update_own" ON user_cards;
CREATE POLICY "user_cards_update_own" ON user_cards FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_cards_delete_own" ON user_cards;
CREATE POLICY "user_cards_delete_own" ON user_cards FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- user_decks
CREATE TABLE IF NOT EXISTS user_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  card_id text NOT NULL,
  position int NOT NULL DEFAULT 0,
  UNIQUE (user_id, card_id)
);

ALTER TABLE user_decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_decks_select_own" ON user_decks;
CREATE POLICY "user_decks_select_own" ON user_decks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_decks_insert_own" ON user_decks;
CREATE POLICY "user_decks_insert_own" ON user_decks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_decks_update_own" ON user_decks;
CREATE POLICY "user_decks_update_own" ON user_decks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_decks_delete_own" ON user_decks;
CREATE POLICY "user_decks_delete_own" ON user_decks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- user_inventory
CREATE TABLE IF NOT EXISTS user_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  acquired_at timestamptz DEFAULT now(),
  UNIQUE (user_id, item_id)
);

ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_inventory_select_own" ON user_inventory;
CREATE POLICY "user_inventory_select_own" ON user_inventory FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_inventory_insert_own" ON user_inventory;
CREATE POLICY "user_inventory_insert_own" ON user_inventory FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_inventory_update_own" ON user_inventory;
CREATE POLICY "user_inventory_update_own" ON user_inventory FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_inventory_delete_own" ON user_inventory;
CREATE POLICY "user_inventory_delete_own" ON user_inventory FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- expeditions
CREATE TABLE IF NOT EXISTS expeditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  expedition_id text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completes_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'active',
  reward_xp int DEFAULT 0,
  reward_gold int DEFAULT 0,
  reward_chest boolean DEFAULT false,
  UNIQUE (user_id, expedition_id)
);

ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "expeditions_select_own" ON expeditions;
CREATE POLICY "expeditions_select_own" ON expeditions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "expeditions_insert_own" ON expeditions;
CREATE POLICY "expeditions_insert_own" ON expeditions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "expeditions_update_own" ON expeditions;
CREATE POLICY "expeditions_update_own" ON expeditions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "expeditions_delete_own" ON expeditions;
CREATE POLICY "expeditions_delete_own" ON expeditions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- wishlist_items
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text DEFAULT '',
  image_url text DEFAULT '',
  link text NOT NULL DEFAULT '',
  category text DEFAULT '',
  status text DEFAULT 'available',
  priority int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlist_select_all" ON wishlist_items;
CREATE POLICY "wishlist_select_all" ON wishlist_items FOR SELECT
  TO authenticated USING (true);
