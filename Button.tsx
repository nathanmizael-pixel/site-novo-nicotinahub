import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-void font-600 hover:bg-primary-bright shadow-glow-sm hover:shadow-glow border border-primary-bright/30',
  secondary: 'bg-surface text-text border border-border hover:border-primary/50 hover:bg-elevated',
  ghost: 'text-text-muted hover:text-text hover:bg-surface/50',
  danger: 'bg-danger/20 text-danger border border-danger/40 hover:bg-danger/30',
  outline: 'bg-transparent text-text border border-border-bright hover:border-primary hover:text-primary-bright',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({ variant = 'primary', size = 'md', children, icon, loading, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-body tracking-wide rounded-md transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed clip-corner-sm ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}
