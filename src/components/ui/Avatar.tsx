import { type Profile } from '@/lib/supabase';
import { initials } from '@/lib/utils';
import { getClass } from '@/data/classes';

type AvatarProfile = Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'class_id'>>;

type AvatarProps = {
  profile?: AvatarProfile | null;
  userId?: string;
  name?: string;
  avatarUrl?: string;
  classId?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
};

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

export function Avatar({ profile, name, avatarUrl, classId, size = 'md', onClick }: AvatarProps) {
  const displayName = profile?.display_name || name || 'Desconhecido';
  const url = profile?.avatar_url || avatarUrl;
  const cls = getClass(profile?.class_id || classId || null);
  const accentColor = cls?.accent || '#A855F7';

  return (
    <div
      onClick={onClick}
      className={`${sizeMap[size]} rounded-full flex items-center justify-center overflow-hidden relative shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: url ? undefined : `linear-gradient(135deg, ${accentColor}40, ${accentColor}10)`,
        border: `1.5px solid ${accentColor}50`,
      }}
    >
      {url ? (
        <img src={url} alt={displayName} className="w-full h-full object-cover" />
      ) : (
        <span className="font-display font-700" style={{ color: accentColor }}>
          {initials(displayName)}
        </span>
      )}
    </div>
  );
}
