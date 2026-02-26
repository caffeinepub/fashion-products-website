import { useImageLoader } from '../hooks/useImageLoader';
import { Button } from '../components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function KurtaSuitProductSection() {
  const { imageSrc, isLoading } = useImageLoader({
    src: '/assets/IMG_20260226_075731.jpg',
  });

  const amazonUrl = 'https://amzn.to/4rGaVQa';

  return (
    <div className="bg-accent/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <img
              src={imageSrc}
              alt="Pink Kurta Suit with Dupatta"
              className={`w-full h-auto object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />
          </div>
          <Button
            size="lg"
            className="font-semibold text-lg px-8 py-6 shadow-md hover:shadow-lg transition-all"
            onClick={() => window.open(amazonUrl, '_blank', 'noopener,noreferrer')}
          >
            Lookout
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
