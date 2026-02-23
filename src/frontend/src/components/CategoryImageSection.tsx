import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoryImageSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryImage = '/assets/uploaded/1771838406102.png';
  const productImages = [
    '/assets/uploaded/1771838406102-1.png',
    '/assets/uploaded/1771838406102-2.png',
    '/assets/uploaded/1771838406102-3.png',
    '/assets/uploaded/1771838406102-4.png',
    '/assets/uploaded/1771838406102-5.png',
    '/assets/uploaded/1771838406102-6.png',
    '/assets/uploaded/1771838406102-7.png',
  ];

  return (
    <div className="bg-accent/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Category Thumbnail - Clickable */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <img
              src={categoryImage}
              alt="Men's Fashion Category"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
                <span>{isExpanded ? 'Hide Products' : 'View Products'}</span>
                {isExpanded ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </div>
            </div>
          </button>

          {/* Product Images Grid - Collapsible */}
          {isExpanded && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    <img
                      src={image}
                      alt={`Men's Fashion Product ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
