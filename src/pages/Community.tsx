import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Post } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { PostCard } from '@/components/ui/SemanticCards';
import { Heart, Send, Skull, Sparkles } from 'lucide-react';
import { useStagger } from '@/hooks/useMotion';
import { Section, Container, Stack } from '@/components/layout/LayoutPrimitives';

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
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);

  const staggerDelays = useStagger(10, 60, 300);

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
      addToast('error', 'Não foi possível publicar. Tente novamente.');
    } else {
      addToast('success', 'Publicado na comunidade.');
      setNewPost('');
      loadPosts();
    }
    setPosting(false);
  }

  async function handleLike(postId: string) {
    if (!session) return;
    
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
          content: `${profile.display_name} curtiu seu post`,
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
    setCommentingPostId(postId);
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
    setCommentingPostId(null);
  }

  const getClassInfo = (classId: string | null | undefined) => {
    const classes: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
      reaper: { name: 'Reaper', color: '#A855F7', icon: <Skull size={10} /> },
      witch: { name: 'Witch', color: '#C084FC', icon: <Sparkles size={10} /> },
      blade: { name: 'Blade', color: '#F43F5E', icon: <Heart size={10} /> },
      oracle: { name: 'Oracle', color: '#FBBF24', icon: <Sparkles size={10} /> },
      warden: { name: 'Warden', color: '#60A5FA', icon: <Heart size={10} /> },
      hollow: { name: 'Hollow', color: '#9CA3AF', icon: <Skull size={10} /> },
    };
    return classId ? classes[classId] : null;
  };

  return (
    <Section size="normal" background="atmosphere" className="vignette min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <Container size="xl">
        {/* Header */}
        <Stack gap="sm" align="center" className="mb-10 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles size={14} className="text-primary" />
            <span className="font-display font-600 text-sm text-text">A Comunidade</span>
          </div>
          <h1 className="font-display font-800 text-display-lg text-text">Comunidade</h1>
          <p className="text-body-md text-text-muted max-w-xl">Compartilhe suas ideias, siga outros viajantes e construa sua reputação na comunidade.</p>
        </Stack>

        {/* Composer */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {session ? (
            <Card variant="elevated" padding="lg" className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative flex gap-4">
                <div className="relative flex-shrink-0">
                  <Avatar profile={profile} size="lg" />
                  {profile?.class_id && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-void" style={{ borderColor: getClassInfo(profile.class_id)?.color || '#A855F7' }}>
                      {getClassInfo(profile.class_id)?.icon}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="O que ecoa no vazio?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-abyss border border-border/50 rounded-xl text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none resize-none transition-all duration-200 min-h-[44px]"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-text-dim">Sua voz ecoa na comunidade</span>
                    <Button size="sm" variant="primary" icon={<Send size={14} />} loading={posting} onClick={handlePost} disabled={!newPost.trim() || posting} className="min-h-[44px]">
                      Publicar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="elevated" padding="lg" className="text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-secondary/5 to-transparent" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                  <Sparkles size={28} className="text-secondary" />
                </div>
                <p className="font-display font-600 text-lg text-text mb-1">Entre para publicar, curtir e comentar.</p>
                <Link to="/auth">
                  <Button variant="primary" size="md" icon={<Sparkles size={14} />} className="min-h-[44px]">Entrar na Comunidade</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Feed */}
        <div className="animate-fade-in" role="feed" aria-label="Posts da comunidade">
          {loading ? (
            <div className="space-y-4" role="status" aria-label="Carregando posts">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} className="animate-shimmer" style={{ animationDelay: `${staggerDelays[i] || 0}ms` }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title="O vazio escuta."
              description="Seja a primeira voz a ecoar."
              icon={<Sparkles size={48} className="text-primary/50 animate-float" />}
              className="py-16 animate-fade-in-up"
            />
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => {
                const classInfo = getClassInfo(post.author?.class_id);
                return (
<PostCard
                  key={post.id}
                  postId={post.id}
                  author={{
                    id: post.author_id,
                    display_name: post.author?.display_name || 'Desconhecido',
                    username: post.author?.username || 'desconhecido',
                    avatar_url: post.author?.avatar_url,
                    class_id: post.author?.class_id,
                  }}
                  content={post.content}
                  created_at={post.created_at}
                  like_count={post.like_count || 0}
                  comment_count={post.comment_count || 0}
                  liked_by_me={post.liked_by_me || false}
                  media_url={post.media_url}
                  accent={classInfo?.color || '#A855F7'}
                  classColor={classInfo?.color}
                  classIcon={classInfo?.icon}
                  className={classInfo?.name}
                  onLike={handleLike}
                  onShare={() => {}}
                  onToggleComments={toggleComments}
                  isExpanded={expandedComments.has(post.id)}
                  comments={commentsByPost[post.id] || []}
                  commentInput={commentInputs[post.id] || ''}
                  onCommentInputChange={(value: string) => setCommentInputs((prev) => ({ ...prev, [post.id]: value }))}
                  onSubmitComment={handleComment}
                  isCommenting={commentingPostId === post.id}
                  animate
                  animationDelay={staggerDelays[index] || 0}
                />
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}