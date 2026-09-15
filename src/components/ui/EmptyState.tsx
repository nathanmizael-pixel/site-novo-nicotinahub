import { type ReactNode, type CSSProperties } from 'react';
import { SkullLogo } from '@/components/SkullLogo';

type EmptyStateProps = {
  title: string;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function EmptyState({ title, titleAs = 'h3', description, icon, action, className = '', style }: EmptyStateProps) {
  const TitleTag = titleAs;

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
      style={style}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 opacity-30" aria-hidden="true">
        {icon || <SkullLogo size={48} />}
      </div>
      <TitleTag className="font-display font-600 text-lg text-text mb-1">{title}</TitleTag>
      {description && <p className="text-sm text-text-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}