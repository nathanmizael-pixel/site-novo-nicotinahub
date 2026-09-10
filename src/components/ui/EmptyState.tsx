import { type ReactNode, type CSSProperties } from 'react';
import { SkullLogo } from '@/components/SkullLogo';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function EmptyState({ title, description, icon, action, className = '', style }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`} style={style}>
      <div className="mb-4 opacity-30">
        {icon || <SkullLogo size={48} />}
      </div>
      <h3 className="font-display font-600 text-lg text-text mb-1">{title}</h3>
      {description && <p className="text-sm text-text-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}