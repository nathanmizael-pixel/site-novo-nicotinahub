import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  display_name: string;
  username: string;
  bio: string;
  avatar_url: string;
  class_id: string | null;
  level: number;
  xp: number;
  gold: number;
  last_active_at: string;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  content: string;
  media_url: string;
  created_at: string;
  author?: Profile;
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
};

export type Follow = {
  follower_id: string;
  followee_id: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  entity_id: string | null;
  entity_type: string;
  content: string;
  read: boolean;
  created_at: string;
  actor?: Profile | null;
};

export type UserCard = {
  id: string;
  user_id: string;
  card_id: string;
  count: number;
  discovered_at: string;
};

export type UserDeck = {
  id: string;
  user_id: string;
  card_id: string;
  position: number;
};

export type UserInventory = {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  acquired_at: string;
};

export type Expedition = {
  id: string;
  user_id: string;
  expedition_id: string;
  started_at: string;
  completes_at: string;
  status: string;
  reward_xp: number;
  reward_gold: number;
  reward_chest: boolean;
};

export type WishlistItem = {
  id: string;
  name: string;
  price: string;
  image_url: string;
  link: string;
  category: string;
  status: string;
  priority: number;
};
