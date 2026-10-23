import React from 'react';

interface MistyBlissIconProps {
  className?: string;
  size?: number;
  variant?: 'monochrome' | 'colored' | 'light';
}

export const MistyBlissIcon: React.FC<MistyBlissIconProps> = ({
  className = '',
  size = 28,
  variant = 'colored',
}) => {
  const isLight = variant === 'light';
  const isMono = variant === 'monochrome';

  const archStroke = isLight ? '#FAF8F5' : isMono ? 'currentColor' : '#292522';
  const leafStroke = isLight ? '#C77F79' : isMono ? 'currentColor' : '#C77F79';
  const vesselFill = isLight ? 'rgba(241, 229, 225, 0.2)' : isMono ? 'rgba(0,0,0,0.05)' : '#F1E5E1';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Misty Bliss Emblem"
    >
      {/* Outer softened architectural arch */}
      <path
        d="M6 26V13C6 7.47715 10.4772 3 16 3C21.5228 3 26 7.47715 26 13V26"
        stroke={archStroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      
      {/* Horizon baseline */}
      <path
        d="M4 27H28"
        stroke={archStroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Tactile ceramic vessel base */}
      <path
        d="M11 26C11 22 13 18.5 16 18.5C19 18.5 21 22 21 26H11Z"
        fill={vesselFill}
        stroke={archStroke}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Gentle organic botanical stem & leaves springing from vessel */}
      <path
        d="M16 18.5V9"
        stroke={leafStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 13C17.8 11.8 19.5 12.2 20.2 13.5C20.2 15 18.5 15.5 16 14.5"
        stroke={leafStroke}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10.5C14.2 9.3 12.5 9.7 11.8 11C11.8 12.5 13.5 13 16 12"
        stroke={leafStroke}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Delicate bud point */}
      <circle cx="16" cy="7.5" r="1.25" fill={leafStroke} />
    </svg>
  );
};
