import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, type Profile as ProfileType, type Post } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { getClass } from '@/data/classes';
import { xpForLevel } from '@/data/core';
import { xpProgress, timeAgo } from '@/lib/utils';
import { Heart, MessageCircle, Users, Skull, Coins, Zap, Edit3, Save, X } from 'lucide-react';

export function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, profile: ownProfile, updateProfile } = useAuth();
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
          content: `${ownProfile.display_name} started following you`,
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
    addToast('success', 'Profile updated.');
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="shimmer-bg h-48 rounded-xl" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <EmptyState
          title="Profile not found"
          description="This soul has not yet entered the Hub."
          icon={<Skull size={48} />}
          action={<Button variant="primary" onClick={() => navigate('/community')}>Back to Community</Button>}
        />
      </div>
    );
  }

  const cls = getClass(profileData.class_id);
  const { pct, intoLevel, span } = xpProgress(profileData.xp, profileData.level);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Character Sheet Header */}
      <Card variant="elevated" padding="lg" radius="xl" className="mb-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: cls ? `radial-gradient(circle at 50% 0%, ${cls.accent}, transparent 70%)` : undefined }}
        />
        <div className="absolute inset-0 hex-pattern opacity-30" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <Avatar profile={profileData} size="xl" />
              {cls && (
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 bg-void"
                  style={{ borderColor: cls.accent }}
                >
                  <Skull size={12} style={{ color: cls.accent }} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-display font-700 text-2xl text-text">{profileData.display_name}</h1>
                  <p className="text-sm text-text-muted">@{profileData.username}</p>
                  {cls && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge color={cls.accent} variant="glow">{cls.name}</Badge>
                      <span className="text-xs text-text-dim">{cls.title}</span>
                    </div>
                  )}
                </div>
                {isOwn ? (
                  !editing ? (
                    <Button variant="outline" size="sm" icon={<Edit3 size={14} />} onClick={() => { setEditForm({ display_name: profileData.display_name, username: profileData.username, bio: profileData.bio }); setEditing(true); }}>
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSaveEdit}>Save</Button>
                      <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                  )
                ) : session ? (
                  <Button variant={isFollowing ? 'secondary' : 'primary'} size="sm" onClick={handleFollow}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                ) : null}
              </div>

              {editing ? (
                <div className="mt-4 space-y-3">
                  <Input label="Display Name" value={editForm.display_name} onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })} />
                  <Input label="Username" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} />
                  <Textarea label="Bio" value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={2} />
                </div>
              ) : (
                <p className="text-sm text-text-muted mt-3 leading-relaxed">
                  {profileData.bio || 'No bio set. This soul is shrouded in mystery.'}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-display font-700 text-text">{followers}</p>
                  <p className="text-xs text-text-muted">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display font-700 text-text">{following}</p>
                  <p className="text-xs text-text-muted">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display font-700 text-text">{posts.length}</p>
                  <p className="text-xs text-text-muted">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Journey Stats */}
      <Card variant="default" padding="lg" className="mb-6">
        <h2 className="font-display font-600 text-lg text-text mb-4">Journey Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-abyss rounded-lg border border-border">
            <Zap size={20} className="text-primary" />
            <div>
              <p className="text-xs text-text-muted">Level</p>
              <p className="text-lg font-display font-700 text-text">{profileData.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-abyss rounded-lg border border-border">
            <Coins size={20} className="text-warning" />
            <div>
              <p className="text-xs text-text-muted">Gold</p>
              <p className="text-lg font-display font-700 text-text">{profileData.gold}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-abyss rounded-lg border border-border">
            <Skull size={20} className="text-primary-bright" />
            <div>
              <p className="text-xs text-text-muted">Class</p>
              <p className="text-lg font-display font-700 text-text">{cls?.name || 'None'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-abyss rounded-lg border border-border">
            <Users size={20} className="text-success" />
            <div>
              <p className="text-xs text-text-muted">Joined</p>
              <p className="text-sm font-600 text-text">{timeAgo(profileData.created_at)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-600 uppercase tracking-wider text-text-muted">XP Progress</span>
            <span className="text-xs text-text font-mono">{intoLevel} / {span} XP</span>
          </div>
          <ProgressBar value={pct} color={cls?.accent || '#A855F7'} height="h-3" />
          <p className="text-xs text-text-dim mt-1.5">Next level at {xpForLevel(profileData.level + 1)} XP</p>
        </div>
      </Card>

      {/* Recent Posts */}
      <div>
        <h2 className="font-display font-600 text-lg text-text mb-4">Recent Posts</h2>
        {posts.length === 0 ? (
          <EmptyState title="No posts yet" description="This soul has not spoken in the community." icon={<MessageCircle size={36} />} />
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} variant="default" padding="md" className="transition-all duration-200 hover:border-primary/20 hover:shadow-depth-1">
                <div className="flex items-start gap-3">
                  <Avatar profile={profileData} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-600 text-text">{profileData.display_name}</span>
                      <span className="text-xs text-text-dim">{timeAgo(post.created_at)}</span>
                    </div>
                    <p className="text-sm text-text leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2">
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
  );
}
