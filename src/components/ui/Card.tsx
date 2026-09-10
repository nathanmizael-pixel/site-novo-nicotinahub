import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'glass';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'md' | 'lg' | 'xl' | '2xl';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, padding = 'md', radius = 'lg', children, ...props }, ref) => {
    const baseStyles = {
      default: 'bg-surface/60 backdrop-blur-sm border border-border',
      elevated: 'bg-surface-elevated/80 backdrop-blur-sm border border-border shadow-depth-2',
      interactive: 'bg-surface-interactive/60 backdrop-blur-sm border border-border-bright',
      glass: 'bg-white/5 backdrop-blur-md border border-white/10',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const radiusStyles = {
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
      '2xl': 'rounded-3xl',
    };

    const hoverStyles = hover
      ? 'transition-all duration-300 ease-out-expo hover:border-primary/30 hover:shadow-depth-2 hover:-translate-y-0.5'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          radiusStyles[radius],
          baseStyles[variant],
          paddingStyles[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4 border-b border-border', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4 border-t border-border', className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';