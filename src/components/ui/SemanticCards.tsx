import { type ReactNode, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { SkullLogo } from '@/components/SkullLogo';

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
          'relative overflow-hidden rounded-2xl bg-surface/60 backdrop-blur-sm border border-border',
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
          'relative rounded-xl bg-surface/60 backdrop-blur-sm border border-border',
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
          'relative rounded-2xl overflow-hidden bg-surface/60 backdrop-blur-sm border border-border',
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
          'relative rounded-xl bg-surface/60 backdrop-blur-sm border border-border p-6',
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
 * MediaCard — Image/video heavy card for clips, wishlist items, expeditions
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
}

export const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(
  ({ className, image, title, subtitle, badge, meta, actions, aspectRatio = 'video', accent = '#A855F7', overlay, children, ...props }, ref) => {
    const aspectStyles = {
      video: 'aspect-video',
      square: 'aspect-square',
      portrait: 'aspect-[9/16]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl overflow-hidden bg-surface/60 backdrop-blur-sm border border-border',
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
          <h3 className="font-display font-700 text-heading-sm text-text line-clamp-1">{title}</h3>
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
            : 'bg-surface/60 backdrop-blur-sm border border-border hover:border-primary/30 hover:bg-surface-elevated/50 hover:shadow-depth-1 text-text',
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
