import { type ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  color?: string;
  variant?: 'solid' | 'outline' | 'glow';
  size?: 'sm' | 'md';
  className?: string;
};

export function Badge({ children, color = '#A855F7', variant = 'solid', size = 'sm', className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    solid: `text-void`,
    outline: `border`,
    glow: `border shadow-glow-sm`,
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  const style: React.CSSProperties = variant === 'solid'
    ? { backgroundColor: color, borderColor: color }
    : { color, borderColor: color, backgroundColor: `${color}15` };

  return (
    <span
      className={`inline-flex items-center gap-1 font-600 uppercase tracking-wider rounded clip-tag font-body ${styles[variant]} ${sizeClasses} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
