import { type ReactNode, forwardRef, type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SkullLogo } from '@/components/SkullLogo';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

/**
 * FeatureCard — Editorial card for hero teasers, class selection, major features
 * Layout: Large visual + headline + description + CTA
 */
export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  image?: string;
  title: string;
  description?: string;
  accent?: string;
  action?: ReactNode;
  badge?: ReactNode;
  layout?: 'vertical' | 'horizontal';
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon, image, title, description, accent = '#A855F7', action, badge, layout = 'vertical', children, ...props }, ref) => {
    const accentColor = accent;

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-2xl bg-surface/80 border border-border',
          'transition-all duration-500 ease-out-expo',
          'hover:border-primary/30 hover:shadow-depth-3 hover:-translate-y-1',
          layout === 'horizontal' ? 'flex flex-col md:flex-row' : 'flex flex-col',
          className
        )}
        style={{ '--accent': accentColor } as React.CSSProperties}
        {...props}
      >
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            {badge}
          </div>
        )}

        {layout === 'horizontal' ? (
          <>
            <div className="relative md:w-2/5 flex-shrink-0 overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
              ) : icon ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-deep-surface">
                  <div className="relative z-10" style={{ color: accentColor }}>
                    {icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-deep-surface">
                  <SkullLogo size={64} className="opacity-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
            </div>

            <div className="relative md:w-3/5 p-8 flex flex-col justify-center min-h-[280px]">
              {children}
              <div className="space-y-4">
                <h3 className="font-display font-800 text-display-sm text-text">{title}</h3>
                {description && <p className="text-body-md text-text-muted leading-relaxed">{description}</p>}
                {action && <div className="pt-2">{action}</div>}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-video overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
              ) : icon ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-deep-surface">
                  <div className="relative z-10" style={{ color: accentColor }}>
                    {icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-deep-surface">
                  <SkullLogo size={64} className="opacity-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
            </div>

            <div className="p-8 flex flex-col flex-1">
              {badge && <div className="mb-4">{badge}</div>}
              {children}
              <div className="space-y-4 mt-auto">
                <h3 className="font-display font-800 text-display-sm text-text">{title}</h3>
                {description && <p className="text-body-md text-text-muted leading-relaxed">{description}</p>}
                {action && <div className="pt-2">{action}</div>}
              </div>
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    )
  }
);

FeatureCard.displayName = 'FeatureCard';

/**
 * ContentCard — For feed items, posts, articles
 * Layout: Avatar + meta + content + actions
 */
export interface ContentCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'ref'> {
  author?: {
    name: string;
    username: string;
    avatar?: string;
    classId?: string;
  };
  timestamp?: string;
  title?: string;
  content: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  accent?: string;
}

export const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
  ({ className, author, timestamp, title, content, meta, actions, accent, children, ...props }, ref) => {
    return (
      <article
        ref={ref}
        className={cn(
          'relative rounded-xl bg-surface/80 border border-border',
          'transition-all duration-300 ease-out-expo',
          'hover:border-primary/20 hover:shadow-depth-1',
          className
        )}
        {...props}
      >
        <div className="p-5">
          {(author || timestamp) && (
            <div className="flex items-center gap-3 mb-4">
              {author && (
                <>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20"
                    style={{ color: accent || '#A855F7' }}
                  >
                    {author.avatar ? (
                      <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display font-700 text-sm">{author.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-600 text-sm text-text truncate">{author.name}</p>
                    <p className="text-xs text-text-dim">@{author.username}</p>
                  </div>
                </>
              )}
              {timestamp && (
                <time className="text-xs text-text-dim ml-auto whitespace-nowrap" dateTime={timestamp}>
                  {timestamp}
                </time>
              )}
            </div>
          )}

          {title && (
            <h3 className="font-display font-700 text-heading-md text-text mb-3">{title}</h3>
          )}

          <div className="prose prose-invert max-w-none text-body-md text-text/90 leading-relaxed">
            {content}
          </div>

          {(meta || actions) && (
            <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {meta && <div className="flex items-center gap-3 text-sm text-text-muted">{meta}</div>}
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}
        </div>

        {children}
      </article>
    )
  }
);

ContentCard.displayName = 'ContentCard';

/**
 * PostCard — Community post with author identity, content, actions, and comments
 * Layout: Author header + content + action bar + expandable comments
 */
export interface PostCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  postId: string;
  author: {
    id: string;
    display_name: string;
    username: string;
    avatar_url?: string;
    class_id?: string | null;
  };
  content: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  media_url?: string | null;
  accent?: string;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onToggleComments: (postId: string) => void;
  isExpanded: boolean;
  comments: Array<{
    id: string;
    content: string;
    author_id: string;
    created_at: string;
    author?: { display_name: string; avatar_url: string };
  }>;
  commentInput: string;
  onCommentInputChange: (postId: string, value: string) => void;
  onSubmitComment: (postId: string) => void;
  isCommenting: boolean;
  classColor?: string;
  className?: string;
  classIcon?: ReactNode;
  animate?: boolean;
  animationDelay?: number;
  style?: React.CSSProperties;
}

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  ({
    className,
    postId,
    author,
    content,
    created_at,
    like_count,
    comment_count,
    liked_by_me,
    media_url,
    accent = '#A855F7',
    onLike,
    onShare,
    onToggleComments,
    isExpanded,
    comments,
    commentInput,
    onCommentInputChange,
    onSubmitComment,
    isCommenting,
    classColor,
    classIcon,
    children,
    animate,
    animationDelay,
    ...props
  }, ref) => {
    const authorClassColor = classColor || accent;

    return (
      <article
        ref={ref}
        className={cn(
          'relative rounded-2xl bg-surface/80 border border-border',
          'transition-all duration-500 ease-out-expo',
          'hover:border-primary/20 hover:shadow-depth-2',
          animate && 'animate-reveal-up',
          className
        )}
        style={{ '--accent': accent, animationDelay: animationDelay ? `${animationDelay}ms` : undefined } as React.CSSProperties}
        {...props}
      >
        <div className="p-5">
          {/* Author Header */}
          <div className="flex items-start gap-3 mb-4">
            <Link to={`/profile/${author.id}`} className="flex-shrink-0">
              <div className="relative">
                <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                  {author.avatar_url ? (
                    <img src={author.avatar_url} alt={author.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display font-700 text-sm" style={{ color: authorClassColor }}>{author.display_name.charAt(0)}</span>
                  )}
                </div>
                {classIcon && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border bg-void" style={{ borderColor: authorClassColor }}>
                    {classIcon}
                  </div>
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/profile/${author.id}`} className="font-display font-600 text-sm text-text hover:text-primary-bright transition-colors truncate">
                  {author.display_name}
                </Link>
                <span className="text-xs text-text-dim">@{author.username}</span>
                {classIcon && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-600" style={{ background: `${authorClassColor}15`, color: authorClassColor, border: `1px solid ${authorClassColor}30` }}>
                    {classIcon}
                    {className}
                  </span>
                )}
              </div>
              <time className="text-xs text-text-dim" dateTime={created_at}>
                {new Date(created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </time>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-text leading-relaxed whitespace-pre-wrap mb-4">{content}</p>

          {/* Media */}
          {media_url && (
            <div className="mt-4 rounded-xl overflow-hidden border border-border">
              <img src={media_url} alt="" className="w-full" />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <button
              onClick={() => onLike(postId)}
              className={`flex items-center gap-1.5 text-xs transition-all duration-200 ${liked_by_me ? 'text-primary-bright' : 'text-text-muted hover:text-text'}`}
              aria-label={liked_by_me ? 'Remover curtida' : 'Curtir'}
            >
              <Heart size={14} className={liked_by_me ? 'fill-primary-bright' : ''} />
              <span className="font-mono">{like_count}</span>
            </button>
            <button
              onClick={() => onToggleComments(postId)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
              aria-label={isExpanded ? 'Ocultar comentários' : 'Mostrar comentários'}
            >
              <MessageCircle size={14} />
              <span className="font-mono">{comment_count}</span>
            </button>
            <button
              onClick={() => onShare(postId)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors ml-auto"
              aria-label="Compartilhar"
            >
              <Share2 size={14} />
            </button>
          </div>

          {/* Comments Section */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
              {comments.length > 0 && comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <Link to={`/profile/${c.author_id}`}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                      {c.author?.avatar_url ? (
                        <img src={c.author.avatar_url} alt={c.author.display_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-700 text-[10px]" style={{ color: accent }}>{c.author?.display_name?.charAt(0)}</span>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${c.author_id}`} className="text-xs font-600 text-text hover:text-primary-bright truncate">
                        {c.author?.display_name}
                      </Link>
                      <span className="text-[10px] text-text-dim">{new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-text mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}

              {/* Comment Composer */}
              <div className="flex gap-2 pt-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex-shrink-0">
                  {/* Current user avatar would go here */}
                  <span className="font-display font-700 text-[10px]" style={{ color: accent }}>?</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={commentInput}
                    onChange={(e) => onCommentInputChange(postId, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && e.preventDefault() && onSubmitComment(postId)}
                    disabled={isCommenting}
                    className="flex-1 px-3 py-2 bg-abyss border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none transition-all duration-200 disabled:opacity-50"
                  />
                  <button
                    onClick={() => onSubmitComment(postId)}
                    disabled={isCommenting || !commentInput.trim()}
                    className="px-4 py-2 bg-primary/15 text-primary-bright hover:bg-primary/25 text-sm font-600 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </article>
    )
  }
);

PostCard.displayName = 'PostCard';

/**
 * ProfileCard — User profile display with class, stats, bio
 */
export interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  className?: string;
  classColor?: string;
  classIcon?: ReactNode;
  stats?: Array<{ label: string; value: string | number; icon?: ReactNode }>;
  actions?: ReactNode;
  accent?: string;
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ className, name, username, bio, avatar, className: classProp, classColor = '#A855F7', classIcon, stats, actions, accent, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl overflow-hidden bg-surface/80 border border-border',
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 50% 0%, ${classColor}, transparent 70%)` }} />
        <div className="absolute inset-0 hex-pattern opacity-20" />

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-surface to-deep-surface flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-800 text-4xl" style={{ color: classColor }}>{name.charAt(0)}</span>
                )}
              </div>
              {classProp && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-void" style={{ borderColor: classColor }}>
                  {classIcon || <span className="font-display font-700 text-sm" style={{ color: classColor }}>★</span>}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display font-800 text-display-md text-text">{name}</h1>
                  <p className="text-label-md text-text-muted mt-1">@{username}</p>
                  {classProp && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-600" style={{ background: `${classColor}15`, color: classColor, border: `1px solid ${classColor}30` }}>
                        {classIcon && <span>{classIcon}</span>}
                        {classProp}
                      </span>
                    </div>
                  )}
                </div>
                {actions && <div className="flex-shrink-0">{actions}</div>}
              </div>

              {bio && <p className="text-body-md text-text-muted leading-relaxed mb-6">{bio}</p>}

              {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      {stat.icon && <div className="mb-1.5" style={{ color: accent || classColor }}>{stat.icon}</div>}
                      <p className="font-display font-800 text-mono-lg text-text">{stat.value}</p>
                      <p className="text-label-sm text-text-dim mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

ProfileCard.displayName = 'ProfileCard';

/**
 * StatCard — Single metric display
 */
export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: string;
  layout?: 'vertical' | 'horizontal';
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, icon, trend, accent = '#A855F7', layout = 'vertical', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl bg-surface/80 border border-border p-6',
          'transition-all duration-300 ease-out-expo hover:border-primary/20 hover:shadow-depth-1',
          layout === 'horizontal' ? 'flex items-center gap-6' : 'flex flex-col items-center text-center',
          className
        )}
        style={{ '--accent': accent } as React.CSSProperties}
        {...props}
      >
        {layout === 'horizontal' ? (
          <>
            {icon && <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>{icon}</div>}
            <div className="flex-1 text-left">
              <p className="text-label-md text-text-muted">{label}</p>
              <p className="font-display font-800 text-mono-lg text-text mt-1">{value}</p>
              {trend && (
                <p className="text-label-sm mt-1 flex items-center gap-1" style={{ color: trend.positive ? '#22C55E' : '#EF4444' }}>
                  {trend.value}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {icon && <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${accent}15`, color: accent }}>{icon}</div>}
            <p className="font-display font-800 text-mono-xl text-text">{value}</p>
            <p className="text-label-md text-text-muted mt-1">{label}</p>
            {trend && (
              <p className="text-label-sm mt-2 flex items-center justify-center gap-1" style={{ color: trend.positive ? '#22C55E' : '#EF4444' }}>
                {trend.value}
              </p>
            )}
          </>
        )}
        {children}
      </div>
    )
  }
);

StatCard.displayName = 'StatCard';

/**
 * MediaCard — Image/video heavy card for videos, wishlist items, expeditions
 */
export interface MediaCardProps extends HTMLAttributes<HTMLDivElement> {
  image?: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  aspectRatio?: 'video' | 'square' | 'portrait';
  accent?: string;
  overlay?: ReactNode;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(
  ({ className, image, title, subtitle, badge, meta, actions, aspectRatio = 'video', accent = '#A855F7', overlay, children, titleAs = 'h3', ...props }, ref) => {
    const aspectStyles = {
      video: 'aspect-video',
      square: 'aspect-square',
      portrait: 'aspect-[9/16]',
    };

    const TitleTag = titleAs;

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl overflow-hidden bg-surface/80 border border-border',
          'transition-all duration-500 ease-out-expo',
          'hover:shadow-depth-3 hover:-translate-y-1 hover:border-primary/30',
          className
        )}
        style={{ '--accent': accent } as React.CSSProperties}
        {...props}
      >
        <div className={cn('relative overflow-hidden', aspectStyles[aspectRatio])}>
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-deep-surface">
              <SkullLogo size={48} className="opacity-20" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/20" />

          {badge && (
            <div className="absolute top-3 left-3 z-10">{badge}</div>
          )}

          {overlay && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">{overlay}</div>}

          {(meta || actions) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {meta && <div className="flex items-center gap-2 text-sm text-text/90">{meta}</div>}
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}
        </div>

        <div className="p-5">
          <TitleTag className="font-display font-700 text-heading-sm text-text line-clamp-1">{title}</TitleTag>
          {subtitle && <p className="text-body-sm text-text-muted mt-1">{subtitle}</p>}
          {children}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    )
  }
);

MediaCard.displayName = 'MediaCard';

/**
 * NavigationCard — For navigation items, sidebar links, footer links
 */
export interface NavigationCardProps extends Omit<React.HTMLAttributes<HTMLAnchorElement> & React.HTMLAttributes<HTMLButtonElement>, 'href' | 'onClick'> {
  icon?: ReactNode;
  label: string;
  description?: string;
  badge?: ReactNode;
  active?: boolean;
  accent?: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export function NavigationCard({ className, icon, label, description, badge, active = false, accent = '#A855F7', href, onClick, target, rel, children, ...props }: NavigationCardProps) {
    const isLink = !!href;
    const Component = isLink ? 'a' : 'button';

    return (
      <Component
        href={isLink ? href : undefined}
        onClick={onClick}
        target={isLink ? target : undefined}
        rel={isLink ? rel : undefined}
        className={cn(
          'relative rounded-xl flex items-center gap-4 p-4',
          'transition-all duration-300 ease-out-expo',
          active
            ? 'bg-primary/15 border border-primary/30 shadow-glow-primary text-text'
            : 'bg-surface/80 border border-border hover:border-primary/30 hover:bg-surface-elevated/50 hover:shadow-depth-1 text-text',
          'focus-ring',
          className
        )}
        style={{ '--accent': accent } as React.CSSProperties}
        {...props}
      >
        {icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}15`, color: accent }}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <p className="font-display font-600 text-sm text-text">{label}</p>
            {badge}
          </div>
          {description && <p className="text-body-sm text-text-muted mt-0.5 line-clamp-1">{description}</p>}
        </div>
        {children}
      </Component>
    )
  }

NavigationCard.displayName = 'NavigationCard';
