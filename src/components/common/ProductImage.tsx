import React, { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4/3' | '3/4' | '16/9';
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '4/3',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass = {
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-[16/9]',
  }[aspectRatio];

  if (hasError || !src) {
    return (
      <div
        className={`w-full ${aspectClass} bg-[#F4EFEB] flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden ${className}`}
        aria-label={alt}
      >
        <div className="w-12 h-12 mb-2 rounded-full bg-[#E8DFD7] flex items-center justify-center text-[#8C7E75]">
          <svg className="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </div>
        <span className="text-xs font-medium text-[#77716C] tracking-tight line-clamp-1">{alt}</span>
        <span className="text-[10px] text-[#A89F97] uppercase tracking-wider mt-0.5">Misty Bliss Décor</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#F4EFEB] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#EFE9E3] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
