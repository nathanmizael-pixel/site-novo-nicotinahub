export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer-bg rounded-md ${className}`} />;
}

export function SkeletonCard({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`card-surface rounded-lg p-5 space-y-3 ${className}`} style={style}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}