type LogoProps = {
  size?: number;
  className?: string;
};

export function SkullLogo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="skull-grad" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8E4F0" />
          <stop offset="0.5" stopColor="#A855F7" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
        <filter id="skull-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#skull-glow)">
        <path
          d="M32 4C18 4 8 14 8 28C8 36 12 42 18 46V54C18 56 20 58 22 58H26V52H30V58H34V52H38V58H42C44 58 46 56 46 54V46C52 42 56 36 56 28C56 14 46 4 32 4Z"
          fill="url(#skull-grad)"
          fillOpacity="0.95"
        />
        <ellipse cx="22" cy="30" rx="5" ry="6" fill="#050407" fillOpacity="0.9" />
        <ellipse cx="42" cy="30" rx="5" ry="6" fill="#050407" fillOpacity="0.9" />
        <ellipse cx="23" cy="28" rx="1.5" ry="2" fill="#A855F7" fillOpacity="0.6" />
        <ellipse cx="43" cy="28" rx="1.5" ry="2" fill="#A855F7" fillOpacity="0.6" />
        <path d="M28 40L32 44L36 40" stroke="#050407" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M30 42H34" stroke="#050407" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 38L14 36M14 36L12 38M14 36L10 35" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M46 38L50 36M50 36L52 38M50 36L54 35" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}

export function SkullLogoFull({ size = 32, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <SkullLogo size={size} />
      <span className="font-display font-700 text-lg tracking-wider text-text">
        nicotinacat
      </span>
    </div>
  );
}
