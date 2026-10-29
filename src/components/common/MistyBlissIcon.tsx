import React from 'react';

interface MistyBlissIconProps {
  className?: string;
  size?: number;
  variant?: 'monochrome' | 'colored' | 'light';
  /** Show circular crop (default) or full square logo mark */
  shape?: 'circle' | 'rounded';
}

export const MistyBlissIcon: React.FC<MistyBlissIconProps> = ({
  className = '',
  size = 28,
  shape = 'circle',
}) => {
  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-md';

  return (
    <img
      src="/images/misty-bliss-logo-circle.png"
      alt="Misty Bliss"
      width={size}
      height={size}
      className={`shrink-0 object-cover ${radiusClass} ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
};
