import { useState, useEffect, useCallback, useRef } from 'react';

const FALLBACK_SRC = '/assets/generated/placeholder-product.dim_400x600.png';

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
  fallbackSrc = FALLBACK_SRC,
  maxRetries = 2,
  retryDelay = 1000,
}: UseImageLoaderOptions): UseImageLoaderReturn {
  // If src is empty/falsy, immediately use fallback
  const effectiveSrc = src && src.trim() !== '' ? src : fallbackSrc;

  const [imageSrc, setImageSrc] = useState<string>(effectiveSrc);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loadTrigger, setLoadTrigger] = useState<number>(0);

  // Use refs to avoid stale closures and circular dependencies
  const retryCountRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Reset retry count when src changes
    retryCountRef.current = 0;
    setIsLoading(true);
    setHasError(false);
    setImageSrc(effectiveSrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    // If effectiveSrc is the fallback (because src was empty), skip loading attempt
    // and just mark as loaded with the fallback
    if (!src || src.trim() === '') {
      setIsLoading(false);
      setHasError(false);
      setImageSrc(fallbackSrc);
      return;
    }

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Abort any in-flight image load
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
      imgRef.current = null;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    imgRef.current = img;

    img.onload = () => {
      if (imgRef.current !== img) return; // stale load
      setIsLoading(false);
      setHasError(false);
      setImageSrc(src);
      imgRef.current = null;
    };

    img.onerror = () => {
      if (imgRef.current !== img) return; // stale load
      imgRef.current = null;

      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        // Schedule a retry by updating the trigger after a delay
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setLoadTrigger((prev) => prev + 1);
        }, retryDelay);
      } else {
        // Max retries reached, use fallback
        setIsLoading(false);
        setHasError(true);
        setImageSrc(fallbackSrc);
      }
    };

    img.src = src;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
        imgRef.current = null;
      }
    };
    // loadTrigger is intentionally included to re-run on retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, loadTrigger]);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    setHasError(false);
    setIsLoading(true);
    setImageSrc(effectiveSrc);
    setLoadTrigger((prev) => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return {
    imageSrc,
    isLoading,
    hasError,
    retry,
  };
}
