import { type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function CommunitySkullIcon({ size = 28, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 13 L18 18 L14 7 L12 13 Z" fill="#18181B" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M36 13 L30 18 L34 7 L36 13 Z" fill="#18181B" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M6 21 C4 24 3 29 3 34 C3 40 6 45 11 47 L11 49 H37 L37 47 C42 44 45 40 45 34 C45 29 44 24 42 21"
        fill="#121215"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse cx="17" cy="32" rx="4.5" ry="5.5" fill="#0A0A0C" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="31" cy="32" rx="4.5" ry="5.5" fill="#0A0A0C" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="31" r="1.5" fill="currentColor" opacity="0.75" />
      <circle cx="32" cy="31" r="1.5" fill="currentColor" opacity="0.75" />
      <circle cx="17" cy="32" r="0.8" fill="#E8E4F0" />
      <circle cx="31" cy="32" r="0.8" fill="#E8E4F0" />
      <path d="M24 36 L21 39 L27 39 Z" fill="currentColor" />
      <line x1="12" y1="46" x2="12" y2="49" stroke="currentColor" strokeWidth="1.2" />
      <line x1="36" y1="46" x2="36" y2="49" stroke="currentColor" strokeWidth="1.2" />
      <line x1="11" y1="47" x2="37" y2="47" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function VideoSkullIcon({ size = 28, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 13 L18 18 L14 7 L12 13 Z" fill="#18181B" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M36 13 L30 18 L34 7 L36 13 Z" fill="#18181B" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M6 21 C4 24 3 29 3 34 C3 40 6 45 11 47 L11 49 H37 L37 47 C42 44 45 40 45 34 C45 29 44 24 42 21"
        fill="#121215"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse cx="17" cy="32" rx="4.5" ry="5.5" fill="#0A0A0C" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="31" cy="32" rx="4.5" ry="5.5" fill="#0A0A0C" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="31" r="1.5" fill="currentColor" opacity="0.75" />
      <circle cx="32" cy="31" r="1.5" fill="currentColor" opacity="0.75" />
      <circle cx="17" cy="32" r="0.8" fill="#E8E4F0" />
      <circle cx="31" cy="32" r="0.8" fill="#E8E4F0" />
      <path d="M24 36 L21 39 L27 39 Z" fill="currentColor" />
      <rect x="12" y="41" width="24" height="14" rx="3" ry="3" fill="#121215" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="42" width="22" height="12" rx="2.5" ry="2.5" fill="#0A0A0C" />
      <circle cx="28" cy="49" r="5" fill="#0A0A0C" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="28" cy="49" r="2" fill="currentColor" />
      <circle cx="20" cy="45" r="1.1" fill="currentColor" opacity="0.55" />
      <circle cx="20" cy="53" r="1.1" fill="currentColor" opacity="0.55" />
      <rect x="15" y="43.5" width="3.5" height="2.5" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
