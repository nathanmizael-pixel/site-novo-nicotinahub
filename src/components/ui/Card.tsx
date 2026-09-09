import { type ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  hover?: boolean;
  onClick?: () => void;
};

export function Card({ children, className = '', elevated, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`${elevated ? 'card-elevated' : 'card-surface'} rounded-lg ${hover ? 'transition-all duration-300 hover:border-primary/40 hover:shadow-glow-sm cursor-pointer' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 border-b border-border ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}
