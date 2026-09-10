import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Post } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { timeAgo } from '@/lib/utils';
import { Heart, MessageCircle, Share2, Send, Users, Skull } from 'lucide-react';

export function Community() {
  const { session, profile } = useAuth();
  const { addToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Array<{ id: string; content: string; author_id: string; created_at: string; author?: { display_name: string; avatar_url: string } }>>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(*),
        likes(count),
        comments(count)
      `)
      .order('created_at', { ascending: false })
      .limit(30);

    if (data) {
      const postsWithFlags = data.map((p: { likes?: Array<{ count: number }>; comments?: Array<{ count: number }> }) => ({
        ...p,
        like_count: p.likes?.[0]?.count || 0,
        comment_count: p.comments?.[0]?.count || 0,
      }));
      setPosts(postsWithFlags as Post[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handlePost() {
    if (!session || !newPost.trim()) return;
    setPosting(true);
    const { error } = await supabase.from('posts').insert({
      author_id: session.user.id,
      content: newPost.trim(),
    });
    if (error) {
      addToast('error', 'Failed to post. Try again.');
    } else {
      addToast('success', 'Posted to the community.');
      setNewPost('');
      loadPosts();
    }
    setPosting(false);
  }

  async function handleLike(postId: string) {
    if (!session) return;
    
    // Get the post author before any state updates to avoid race conditions
    const post = posts.find((p) => p.id === postId);
    const authorId = post?.author_id;
    
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', session.user.id);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, like_count: (p.like_count || 0) - 1, liked_by_me: false } : p));
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: session.user.id });
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, like_count: (p.like_count || 0) + 1, liked_by_me: true } : p));
      if (profile && authorId) {
        await supabase.from('notifications').insert({
          user_id: authorId,
          actor_id: session.user.id,
          type: 'like',
          entity_id: postId,
          entity_type: 'post',
          content: `${profile.display_name} liked your post`,
        });
      }
    }
  }

  async function loadComments(postId: string) {
    const { data } = await supabase
      .from('comments')
      .select('*, author:profiles!comments_author_id_fkey(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (data) {
      setCommentsByPost((prev) => ({ ...prev, [postId]: data }));
    }
  }

  function toggleComments(postId: string) {
    if (expandedComments.has(postId)) {
      setExpandedComments((prev) => { const n = new Set(prev); n.delete(postId); return n; });
    } else {
      setExpandedComments((prev) => new Set(prev).add(postId));
      loadComments(postId);
    }
  }

  async function handleComment(postId: string) {
    if (!session || !commentInputs[postId]?.trim()) return;
    const content = commentInputs[postId].trim();
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: session.user.id,
      content,
    });
    if (!error) {
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      loadComments(postId);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p));
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users size={24} className="text-primary" />
          <h1 className="font-display font-700 text-3xl text-text">Community</h1>
        </div>
        <p className="text-sm text-text-muted">Share your thoughts with the coven</p>
      </div>

      {session ? (
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="flex gap-3">
            <Avatar profile={profile} size="md" />
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="bg-abyss"
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" variant="primary" icon={<Send size={14} />} loading={posting} onClick={handlePost} disabled={!newPost.trim()}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card variant="elevated" padding="lg" className="mb-6 text-center">
          <Skull size={32} className="text-text-dim mx-auto mb-3" />
          <h3 className="font-display font-600 text-lg text-text mb-1">Join the Conversation</h3>
          <p className="text-sm text-text-muted mb-4">Sign in to post, like, and comment in the community.</p>
          <Link to="/auth">
            <Button variant="primary" size="md">Sign In</Button>
          </Link>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="The void is silent"
          description="No posts yet. Be the first to share something with the community."
          icon={<Users size={48} />}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} variant="default" padding="lg" className="animate-fade-in-up">
              <div className="flex items-start gap-3">
                <Link to={`/profile/${post.author_id}`}>
                  <Avatar profile={post.author} size="md" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/profile/${post.author_id}`} className="font-600 text-sm text-text hover:text-primary-bright transition-colors">
                      {post.author?.display_name || 'Unknown'}
                    </Link>
                    <span className="text-xs text-text-dim">@{post.author?.username || 'unknown'}</span>
                    <span className="text-xs text-text-dim">· {timeAgo(post.created_at)}</span>
                  </div>
                  <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  {post.media_url && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-border">
                      <img src={post.media_url} alt="" className="w-full" />
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      disabled={!session}
                      className={`flex items-center gap-1.5 text-xs transition-all ${post.liked_by_me ? 'text-primary-bright' : 'text-text-muted hover:text-text'}`}
                    >
                      <Heart size={14} className={post.liked_by_me ? 'fill-primary-bright' : ''} />
                      {post.like_count || 0}
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
                    >
                      <MessageCircle size={14} />
                      {post.comment_count || 0}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors">
                      <Share2 size={14} />
                    </button>
                  </div>

                  {expandedComments.has(post.id) && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
                      {session && (
                        <div className="flex gap-2">
                          <Avatar profile={profile} size="xs" />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                              className="flex-1 px-3 py-1.5 bg-abyss border border-border rounded-md text-sm text-text placeholder:text-text-dim focus:border-primary/50 outline-none"
                            />
                            <Button size="sm" variant="ghost" onClick={() => handleComment(post.id)}>Send</Button>
                          </div>
                        </div>
                      )}
                      {(commentsByPost[post.id] || []).map((c: { id: string; content: string; author_id: string; created_at: string; author?: { display_name: string; avatar_url: string } }) => (
                        <div key={c.id} className="flex gap-2">
                          <Link to={`/profile/${c.author_id}`}>
                            <Avatar profile={c.author} size="xs" />
                          </Link>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Link to={`/profile/${c.author_id}`} className="text-xs font-600 text-text hover:text-primary-bright">
                                {c.author?.display_name}
                              </Link>
                              <span className="text-[10px] text-text-dim">{timeAgo(c.created_at)}</span>
                            </div>
                            <p className="text-sm text-text mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))}
                      {(commentsByPost[post.id] || []).length === 0 && (
                        <p className="text-xs text-text-dim text-center py-2">No comments yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}