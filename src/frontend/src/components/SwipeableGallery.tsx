import { useState } from 'react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { useImageLoader } from '../hooks/useImageLoader';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';

interface SwipeableGalleryProps {
  images: string[];
  meeshoUrl: string;
}

function GalleryImage({ src, alt, isActive }: { src: string; alt: string; isActive: boolean }) {
  const { imageSrc, isLoading, hasError } = useImageLoader({ src });

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        draggable={false}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          Image unavailable
        </div>
      )}
    </>
  );
}

export default function SwipeableGallery({ images, meeshoUrl }: SwipeableGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Call all hooks at the top level, before any conditional returns
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50,
  });

  const { imageSrc: promoImageSrc, isLoading: promoLoading } = useImageLoader({
    src: '/assets/ms_swnvi_512_735387723.jpg',
  });

  // Handle empty images array AFTER all hooks are called
  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-lg shadow-xl bg-muted aspect-[3/4] flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Gallery Container */}
      <div className="relative overflow-hidden rounded-lg shadow-xl bg-muted">
        {/* Image Display */}
        <div
          className="relative aspect-[3/4] cursor-grab active:cursor-grabbing select-none"
          onTouchStart={swipeHandlers.handleTouchStart}
          onTouchMove={swipeHandlers.handleTouchMove}
          onTouchEnd={swipeHandlers.handleTouchEnd}
          onMouseDown={swipeHandlers.handleMouseDown}
          onMouseMove={swipeHandlers.handleMouseMove}
          onMouseUp={swipeHandlers.handleMouseUp}
          onMouseLeave={swipeHandlers.handleMouseLeave}
        >
          <GalleryImage
            src={images[currentIndex]}
            alt={`Product ${currentIndex + 1}`}
            isActive={true}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow-lg transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow-lg transition-all hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 py-4 bg-background/50">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Look Out Button */}
      <div className="mt-6 text-center">
        <Button
          size="lg"
          className="font-semibold text-lg px-8 py-6 shadow-md hover:shadow-lg transition-all"
          onClick={() => window.open(meeshoUrl, '_blank', 'noopener,noreferrer')}
        >
          Look Out
          <ExternalLink className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Promotional Image Below Gallery */}
      <div className="mt-8 relative overflow-hidden rounded-lg shadow-lg">
        {promoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <img
          src={promoImageSrc}
          alt="Promotional Product"
          className={`w-full h-auto object-cover transition-opacity duration-300 ${
            promoLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
