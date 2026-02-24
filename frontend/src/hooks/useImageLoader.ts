import { useState, useEffect, useCallback } from 'react';

interface UseImageLoaderOptions {
  src: string;
  fallbackSrc?: string;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseImageLoaderReturn {
  imageSrc: string;
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
}

export function useImageLoader({
  src,
  fallbackSrc = '/assets/generated/placeholder-product.dim_400x600.png',
  maxRetries = 2,
  retryDelay = 1000,
}: UseImageLoaderOptions): UseImageLoaderReturn {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const loadImage = useCallback(() => {
    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
      setImageSrc(src);
    };

    img.onerror = () => {
      if (retryCount < maxRetries) {
        // Retry after delay
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      } else {
        // Max retries reached, use fallback
        setIsLoading(false);
        setHasError(true);
        setImageSrc(fallbackSrc);
      }
    };

    img.src = src;
  }, [src, fallbackSrc, retryCount, maxRetries, retryDelay]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const retry = useCallback(() => {
    setRetryCount(0);
    loadImage();
  }, [loadImage]);

  return {
    imageSrc,
    isLoading,
    hasError,
    retry,
  };
}
