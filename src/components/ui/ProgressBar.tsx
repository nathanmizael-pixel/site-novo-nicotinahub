type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  height?: string;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
};

export function ProgressBar({ value, max = 100, className = '', color = '#A855F7', height = 'h-2', animated = true, showLabel = false, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-text-muted font-500">{label || 'Progress'}</span>
          <span className="text-xs text-text font-600 font-mono">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-abyss rounded-full overflow-hidden border border-border relative`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out relative ${animated ? 'animate-bar-fill' : ''}`}
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          } as React.CSSProperties & { '--bar-width'?: string }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ backgroundSize: '200% 100%' }} />
        </div>
      </div>
    </div>
  );
}
