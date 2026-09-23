import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, type Profile as ProfileType, type Post } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { timeAgo } from '@/lib/utils';
import { Heart, MessageCircle, Skull, Edit3, Save, X, ArrowLeft, Music2 } from 'lucide-react';
import { TikTokConnect } from '@/components/TikTokConnect';
import { Section, Container, Stack } from '@/components/layout/LayoutPrimitives';

export function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, profile: ownProfile, updateProfile, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ display_name: '', username: '', bio: '' });

  const targetId = id || session?.user.id;
  const isOwn = targetId === session?.user.id;

  useEffect(() => {
    if (!targetId) {
      setLoading(false);
      return;
    }
    const isOwn = targetId === session?.user.id;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('profiles').select('*').eq('id', targetId).maybeSingle();
      setProfileData(data as ProfileType | null);

      const [{ data: postData }, { count: followerCount }, { count: followingCount }] = await Promise.all([
        supabase.from('posts').select('*, author:profiles!posts_author_id_fkey(*)').eq('author_id', targetId).order('created_at', { ascending: false }).limit(10),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('followee_id', targetId),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', targetId),
      ]);

      setPosts((postData as Post[]) || []);
      setFollowers(followerCount || 0);
      setFollowing(followingCount || 0);

      if (session && !isOwn) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('followee_id', targetId)
          .maybeSingle();
        setIsFollowing(!!followData);
      }

      setLoading(false);
    })();
  }, [targetId, session]);

  async function handleFollow() {
    if (!session || !targetId || isOwn) return;
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', session.user.id).eq('followee_id', targetId);
      setIsFollowing(false);
      setFollowers((f) => f - 1);
    } else {
      await supabase.from('follows').insert({ follower_id: session.user.id, followee_id: targetId });
      setIsFollowing(true);
      setFollowers((f) => f + 1);
      if (ownProfile) {
        await supabase.from('notifications').insert({
          user_id: targetId,
          actor_id: session.user.id,
          type: 'follow',
          content: `${ownProfile.display_name} começou a seguir você`,
        });
      }
    }
  }

  async function handleSaveEdit() {
    if (!ownProfile) return;
    await updateProfile({
      display_name: editForm.display_name,
      username: editForm.username,
      bio: editForm.bio,
    });
    setProfileData((prev) => prev ? { ...prev, ...editForm } : null);
    setEditing(false);
    addToast('success', 'Perfil atualizado.');
  }

  if (loading) {
    return (
      <Section size="normal" background="atmosphere" className="vignette min-h-screen">
        <Container size="lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <SkeletonCard className="max-w-2xl" />
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (!profileData) {
    return (
      <Section size="normal" background="atmosphere" className="vignette min-h-screen">
        <Container size="lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <EmptyState
              title="Perfil não encontrado"
              titleAs="h1"
              description="Esta alma se perdeu no vazio. Ou talvez nunca tenha existido."
              icon={<Skull size={48} />}
              action={
                <Button variant="outline" icon={<ArrowLeft size={14} />} onClick={() => navigate('/community')}>
                  Voltar à Comunidade
                </Button>
              }
            />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section size="normal" background="atmosphere" className="vignette min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <Container size="lg">
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
          {/* Profile Header */}
          <Card variant="elevated" padding="lg" radius="xl" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-30" />
            <div className="absolute inset-0 hex-pattern opacity-20" />

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative shrink-0">
                  <Avatar profile={profileData} size="xl" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="font-display font-700 text-2xl sm:text-3xl text-text">{profileData.display_name}</h1>
                      <p className="text-sm text-text-muted">@{profileData.username}</p>
                      <p className="text-xs text-text-dim mt-1">Membro desde {timeAgo(profileData.created_at)}</p>
                    </div>
                    {isOwn ? (
                      !editing ? (
                        <Button variant="outline" size="sm" icon={<Edit3 size={14} />} onClick={() => { setEditForm({ display_name: profileData.display_name, username: profileData.username, bio: profileData.bio }); setEditing(true); }}>
                          Editar
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSaveEdit}>Salvar</Button>
                          <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setEditing(false)}>Cancelar</Button>
                        </div>
                      )
                    ) : session ? (
                      <Button variant={isFollowing ? 'secondary' : 'primary'} size="sm" onClick={handleFollow}>
                        {isFollowing ? 'Seguindo' : 'Seguir'}
                      </Button>
                    ) : null}
                  </div>

                  {editing ? (
                    <div className="mt-4 space-y-3 sm:grid sm:grid-cols-2 sm:gap-4">
                      <Input label="Nome de Exibição" value={editForm.display_name} onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })} className="sm:col-span-2" />
                      <Input label="Nome de Usuário" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} />
                      <Textarea label="Bio" value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3} className="sm:col-span-2" />
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted mt-3 leading-relaxed">
                      {profileData.bio || 'Sem bio. Mistério é o charme.'}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-6 pt-6 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-display font-700 text-text">{followers}</p>
                      <p className="text-xs text-text-muted">Seguidores</p>
                    </div>
                    <div className="text-center border-x border-border py-2 sm:py-0">
                      <p className="text-2xl sm:text-3xl font-display font-700 text-text">{following}</p>
                      <p className="text-xs text-text-muted">Seguindo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-display font-700 text-text">{posts.length}</p>
                      <p className="text-xs text-text-muted">Posts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* TikTok Integration (admin only) */}
          {isAdmin && (
            <Card variant="default" padding="md" className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music2 size={20} className="text-primary-bright" />
                  <div>
                    <p className="text-sm font-600 text-text">TikTok</p>
                    <p className="text-xs text-text-muted">Sincronize vídeos do canal editorial @nicotinaclipes</p>
                  </div>
                </div>
                <TikTokConnect variant="primary" size="sm" />
              </div>
            </Card>
          )}

          {/* Posts */}
          <div>
            <Stack gap="sm" className="mb-4">
              <h2 className="font-display font-600 text-lg text-text">Posts</h2>
            </Stack>
            {posts.length === 0 ? (
              <EmptyState title="Vazio por aqui" description="Nenhum eco na câmara ainda." icon={<MessageCircle size={36} />} />
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Card key={post.id} variant="default" padding="md" className="transition-all duration-200 hover:border-primary/20 hover:shadow-depth-1">
                    <div className="flex items-start gap-3">
                      <Avatar profile={profileData} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-600 text-text truncate">{profileData.display_name}</span>
                          <span className="text-xs text-text-dim whitespace-nowrap">{timeAgo(post.created_at)}</span>
                        </div>
                        <p className="text-sm text-text leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-text-muted"><Heart size={12} /> {post.like_count || 0}</span>
                          <span className="flex items-center gap-1 text-xs text-text-muted"><MessageCircle size={12} /> {post.comment_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}