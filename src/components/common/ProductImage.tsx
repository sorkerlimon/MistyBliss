'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4/3' | '3/4' | '16/9';
  priority?: boolean;
}

// Curated high-res reliable fallback images for home décor
const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
];

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '4/3',
  priority = false,
}) => {
  const fallbackUrl = DEFAULT_FALLBACK_IMAGES[Math.abs(alt.length) % DEFAULT_FALLBACK_IMAGES.length];
  const initialSrc = src && src.trim() ? src : fallbackUrl;

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [retryWithFallback, setRetryWithFallback] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync when src prop changes
  useEffect(() => {
    const validSrc = src && src.trim() ? src : fallbackUrl;
    setCurrentSrc(validSrc);
    setRetryWithFallback(false);
    setIsLoaded(false);
  }, [src, fallbackUrl]);

  // Check if image is already cached or completed
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const aspectClass = {
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-[16/9]',
  }[aspectRatio];

  const handleError = () => {
    if (!retryWithFallback && currentSrc !== fallbackUrl) {
      setRetryWithFallback(true);
      setCurrentSrc(fallbackUrl);
    } else {
      setIsLoaded(true);
    }
  };

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#F4EFEB] ${className}`}>
      {/* Skeleton placeholder while loading image */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFE9E3] via-[#FAF6F2] to-[#EFE9E3] animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-200 relative z-10 ${
          isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
      />
    </div>
  );
};
