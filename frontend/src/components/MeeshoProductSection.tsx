import { useImageLoader } from '../hooks/useImageLoader';
import { Loader2 } from 'lucide-react';

export default function MeeshoProductSection() {
  const { imageSrc, isLoading, hasError } = useImageLoader({
    src: '/assets/ms_dxrpu_512_613389026.jpg',
  });

  const meeshoUrl =
    'https://www.meesho.com/af_invite/234223027:instagram_stories:2007896?p_id=613389026&ext_id=a57202&utm_source=instagram_stories';

  return (
    <div className="bg-accent/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <a
            href={meeshoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <img
              src={imageSrc}
              alt="Demon Slayer Oversized Printed T-Shirt"
              className={`w-full h-auto object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />
            {/* Overlay with "Look Out" text on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-2xl font-semibold tracking-wide">
                Look Out →
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
