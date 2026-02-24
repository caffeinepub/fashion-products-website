import { ExternalLink } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useImageLoader } from '../hooks/useImageLoader';
import { Skeleton } from './ui/skeleton';

function WatchImage({ src, alt }: { src: string; alt: string }) {
  const { imageSrc, isLoading, hasError } = useImageLoader({ src });

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-auto object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Image unavailable
        </div>
      )}
    </div>
  );
}

export default function WatchProductSection() {
  const meeshoUrl = 'https://www.meesho.com/af_invite/234223027:youtube_long_form:2004187?p_id=483483241&ext_id=7zuq21&utm_source=youtube_long_form';

  const watchImages = [
    {
      src: '/assets/ms_q1gi6_512_483483241.jpg',
      alt: 'ABREXO Watch - Black Dial with Brown Strap - Main View'
    },
    {
      src: '/assets/ms_lvpjs_512_483483241.jpg',
      alt: 'ABREXO Watch - Black Dial with Brown Strap - Front View'
    },
    {
      src: '/assets/ms_lvpjs_512_483483241-1.jpg',
      alt: 'ABREXO Watch - Black Dial with Brown Strap - Side View'
    },
    {
      src: '/assets/ms_lvpjs_512_483483241-2.jpg',
      alt: 'ABREXO Watch - Black Dial with Brown Strap - Detail View'
    }
  ];

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Watch Product Images Carousel */}
          <div className="relative mb-6">
            <Carousel className="w-full">
              <CarouselContent>
                {watchImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <WatchImage src={image.src} alt={image.alt} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* Lookout Icon Link */}
          <a
            href={meeshoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="View product on Meesho"
          >
            <img
              src="/assets/generated/lookout-icon.dim_64x64.png"
              alt="Look Out"
              className="w-16 h-16 hover:opacity-80 transition-opacity"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
