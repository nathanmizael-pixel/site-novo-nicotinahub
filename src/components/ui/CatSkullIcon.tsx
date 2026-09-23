export function CatSkullIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cat ears */}
      <path d="M7 11L13 14L10 6L7 11Z" fill="#18181B" stroke="#A855F7" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M29 11L23 14L26 6L29 11Z" fill="#18181B" stroke="#A855F7" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Skull head */}
      <path
        d="M18 5C11.3726 5 6 10.3726 6 17C6 21.5 8.5 25.5 12 27.5V31H15V33H21V31H24V27.5C27.5 25.5 30 21.5 30 17C30 10.3726 24.6274 5 18 5Z"
        fill="#121215"
        stroke="#A855F7"
        strokeWidth="1.5"
      />
      {/* Eye sockets */}
      <circle cx="13" cy="16" r="3.5" fill="#0A0A0C" stroke="#A855F7" strokeWidth="1" />
      <circle cx="23" cy="16" r="3.5" fill="#0A0A0C" stroke="#A855F7" strokeWidth="1" />
      {/* Nose */}
      <path d="M18 21L16.5 23H19.5L18 21Z" fill="#A855F7" />
      {/* Teeth line */}
      <line x1="13" y1="27" x2="23" y2="27" stroke="#A855F7" strokeWidth="1" />
      <line x1="16" y1="25" x2="16" y2="29" stroke="#0A0A0C" strokeWidth="1" />
      <line x1="20" y1="25" x2="20" y2="29" stroke="#0A0A0C" strokeWidth="1" />
    </svg>
  );
}
