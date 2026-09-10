import { type ReactNode, forwardRef, type HTMLAttributes, type ReactElement } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Container — Max-width wrapper with responsive padding
 */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = true, children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[90rem]',
      full: 'max-w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          sizeStyles[size],
          padding && 'px-4 sm:px-6 lg:px-8',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
);

Container.displayName = 'Container';

/**
 * Section — Vertical rhythm wrapper with consistent spacing
 */
export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'tight' | 'normal' | 'loose' | 'hero';
  background?: 'none' | 'void' | 'abyss' | 'atmosphere' | 'vignette';
  divider?: boolean;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ className, size = 'normal', background = 'none', divider = false, children, ...props }, ref) => {
    const spacingStyles = {
      tight: 'py-8 md:py-12',
      normal: 'py-12 md:py-16 lg:py-20',
      loose: 'py-16 md:py-24 lg:py-32',
      hero: 'py-20 md:py-32 lg:py-40',
    };

    const backgroundStyles = {
      none: '',
      void: 'bg-void',
      abyss: 'bg-abyss',
      atmosphere: 'relative before:atmosphere',
      vignette: 'relative before:vignette',
    };

    return (
      <section
        ref={ref}
        className={cn(
          'relative w-full',
          spacingStyles[size],
          backgroundStyles[background],
          divider && 'border-t border-border',
          className
        )}
        {...props}
      >
        {background === 'atmosphere' && <div className="absolute inset-0 pointer-events-none atmosphere" />}
        {background === 'vignette' && <div className="absolute inset-0 pointer-events-none vignette" />}
        <div className="relative z-10">{children}</div>
      </section>
    )
  }
);

Section.displayName = 'Section';

/**
 * Stack — Vertical stack with consistent gap
 */
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  divider?: boolean;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = 'md', align = 'stretch', divider = false, children, ...props }, ref) => {
    const gapStyles = {
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
      '2xl': 'gap-16',
    };

    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    const childArray = React.Children.toArray(children).filter((child: React.ReactNode): child is ReactElement => React.isValidElement(child));

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          gapStyles[gap],
          alignStyles[align],
          className
        )}
        {...props}
      >
        {childArray.map((child: ReactElement, index: number) => (
          <div key={child.key ?? index} className={cn(divider && index > 0 && 'pt-6 border-t border-border')}>
            {child}
          </div>
        ))}
      </div>
    )
  }
);

Stack.displayName = 'Stack';

/**
 * Cluster — Horizontal cluster with wrapping and gap
 */
export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
}

export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(
  ({ className, gap = 'md', justify = 'start', align = 'center', wrap = true, children, ...props }, ref) => {
    const gapStyles = {
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };

    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    };

    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          wrap && 'flex-wrap',
          gapStyles[gap],
          justifyStyles[justify],
          alignStyles[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
);

Cluster.displayName = 'Cluster';

/**
 * Grid — Responsive grid with consistent columns
 */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
  colsSm?: 1 | 2 | 3 | 4;
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6;
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6;
  colsXl?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean;
  minItemWidth?: string;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, colsSm, colsMd, colsLg, colsXl, gap = 'md', autoFit = false, minItemWidth = '280px', children, ...props }, ref) => {
    const gapStyles = {
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };

    let gridTemplateColumns = '';

    if (autoFit) {
      gridTemplateColumns = `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
    } else {
      const responsiveCols = [
        `grid-cols-${cols}`,
        colsSm && `sm:grid-cols-${colsSm}`,
        colsMd && `md:grid-cols-${colsMd}`,
        colsLg && `lg:grid-cols-${colsLg}`,
        colsXl && `xl:grid-cols-${colsXl}`,
      ].filter(Boolean).join(' ');

      return (
        <div
          ref={ref}
          className={cn(
            'grid',
            gapStyles[gap],
            responsiveCols,
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          gapStyles[gap],
          className
        )}
        style={{ gridTemplateColumns } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    )
  }
);

Grid.displayName = 'Grid';

/**
 * FeedLayout — Sidebar + main content layout for feeds
 */
export interface FeedLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  sidebarWidth?: 'sm' | 'md' | 'lg';
  gap?: 'md' | 'lg' | 'xl';
}

export const FeedLayout = forwardRef<HTMLDivElement, FeedLayoutProps>(
  ({ className, sidebar, sidebarWidth = 'md', gap = 'lg', children, ...props }, ref) => {
    const sidebarWidthStyles = {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
    };

    const gapStyles = {
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col lg:flex-row',
          gapStyles[gap],
          className
        )}
        {...props}
      >
        {sidebar && (
          <aside className={cn('flex-shrink-0 hidden lg:block', sidebarWidthStyles[sidebarWidth])}>
            {sidebar}
          </aside>
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    )
  }
);

FeedLayout.displayName = 'FeedLayout';

/**
 * SidebarLayout — Page with sidebar navigation
 */
export interface SidebarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode;
  sidebarWidth?: 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
}

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ className, sidebar, sidebarWidth = 'md', header, footer, children, ...props }, ref) => {
    const sidebarWidthStyles = {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
    };

    return (
      <div
        ref={ref}
        className={cn('flex min-h-screen bg-void', className)}
        {...props}
      >
        <aside className={cn('flex-shrink-0 hidden lg:flex lg:flex-col', sidebarWidthStyles[sidebarWidth], 'border-r border-border bg-abyss/50')}>
          {header && <div className="p-6 border-b border-border">{header}</div>}
          <nav className="flex-1 p-4 overflow-y-auto">{sidebar}</nav>
          {footer && <div className="p-6 border-t border-border">{footer}</div>}
        </aside>
        <main className="flex-1 min-w-0 lg:min-w-0">
          {children}
        </main>
      </div>
    )
  }
);

SidebarLayout.displayName = 'SidebarLayout';

/**
 * HeroSection — Specialized section for hero areas
 */
export interface HeroSectionProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'centered' | 'asymmetric' | 'split';
  background?: 'atmosphere' | 'vignette' | 'gradient' | 'none';
  height?: 'auto' | 'screen' | 'screen-75' | 'screen-50';
}

export const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ className, variant = 'centered', background = 'atmosphere', height = 'auto', children, ...props }, ref) => {
    const heightStyles = {
      auto: 'min-h-[60vh]',
      screen: 'min-h-screen',
      'screen-75': 'min-h-[75vh]',
      'screen-50': 'min-h-[50vh]',
    };

    return (
      <section
        ref={ref}
        className={cn(
          'relative w-full flex items-center justify-center',
          heightStyles[height],
          className
        )}
        {...props}
      >
        {background === 'atmosphere' && <div className="absolute inset-0 pointer-events-none atmosphere" />}
        {background === 'vignette' && <div className="absolute inset-0 pointer-events-none vignette" />}
        {background === 'gradient' && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 via-transparent to-void" />
        )}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className={cn(
            variant === 'centered' && 'text-center',
            variant === 'split' && 'lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center',
            variant === 'asymmetric' && 'max-w-7xl mx-auto'
          )}>
            {children}
          </div>
        </div>
      </section>
    )
  }
);

HeroSection.displayName = 'HeroSection';