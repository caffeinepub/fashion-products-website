import { useState } from 'react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { useImageLoader } from '../hooks/useImageLoader';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';

interface AttackOnTitanGalleryProps {
  meeshoUrl: string;
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
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

export default function AttackOnTitanGallery({ meeshoUrl }: AttackOnTitanGalleryProps) {
  const images = [
    '/assets/generated/attack-on-titan-shirt.dim_800x1000.png',
    '/assets/ms_cblw2_512_418433257.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50,
  });

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
            alt={`Attack on Titan T-Shirt ${currentIndex + 1}`}
          />

          {/* Navigation Arrows */}
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

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Indicators */}
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
      </div>

      {/* Lookout Button */}
      <div className="mt-6 text-center">
        <Button
          size="lg"
          className="font-semibold text-lg px-8 py-6 shadow-md hover:shadow-lg transition-all"
          onClick={() => window.open(meeshoUrl, '_blank', 'noopener,noreferrer')}
        >
          Lookout
          <ExternalLink className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
