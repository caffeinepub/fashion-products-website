import { useState, useMemo } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import { useImageLoader } from '../hooks/useImageLoader';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import CategoryImageSection from '../components/CategoryImageSection';
import SwipeableGallery from '../components/SwipeableGallery';
import WatchProductSection from '../components/WatchProductSection';
import MeeshoProductSection from '../components/MeeshoProductSection';
import AttackOnTitanGallery from '../components/AttackOnTitanGallery';
import KurtaSuitProductSection from '../components/KurtaSuitProductSection';
import LoadingTimeout from '../components/LoadingTimeout';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';

function PromotionalImage({ src, alt, meeshoUrl }: { src: string; alt: string; meeshoUrl: string }) {
  const { imageSrc, isLoading } = useImageLoader({ src });

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      </div>
      <Button
        size="lg"
        className="font-semibold text-lg px-8 py-6 shadow-md hover:shadow-lg transition-all"
        onClick={() => window.open(meeshoUrl, '_blank', 'noopener,noreferrer')}
      >
        Look Out
        <ExternalLink className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

export default function ProductBrowse() {
  const { data: products, isLoading, isPending, error, refetch } = useGetAllProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Swipeable gallery images
  const swipeableImages = [
    '/assets/IMG_20260223_160209-5.jpg',
    '/assets/ms_fr1ch_512_563768314-8.jpg',
  ];

  const meeshoUrl = 'https://www.meesho.com/af_invite/234223027:youtube_long_form:2000433?p_id=563768316&ext_id=9bnif0&utm_source=youtube_long_form';
  const attackOnTitanUrl = 'https://www.meesho.com/af_invite/234223027:instagram_stories:2007896?p_id=418433257&ext_id=6x4h61&utm_source=instagram_stories';

  const renderProductsSection = () => {
    if (isLoading || isPending) {
      return (
        <LoadingTimeout
          isLoading={isLoading || isPending}
          timeout={15000}
          onRetry={() => refetch()}
          loadingMessage="Loading products..."
          timeoutMessage="Products are taking longer than expected to load"
        />
      );
    }

    if (error) {
      return (
        <div className="py-8">
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load products</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{error instanceof Error ? error.message : 'An unexpected error occurred while loading products.'}</p>
              <Button onClick={() => refetch()} variant="outline" size="sm" className="w-full">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {selectedCategory === 'All'
              ? 'No products available yet.'
              : `No products in "${selectedCategory}" category.`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id.toString()} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden bg-muted">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Fashion Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-3">
              Curated Fashion
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover unique pieces inspired by the latest trends on Pinterest
            </p>
          </div>
        </div>
      </div>

      {/* Swipeable Gallery Section */}
      <div className="bg-accent/20 py-12">
        <div className="container mx-auto px-4">
          <SwipeableGallery images={swipeableImages} meeshoUrl={meeshoUrl} />
        </div>
      </div>

      {/* Attack on Titan Gallery Section */}
      <div className="bg-background py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8">
            Featured: Attack on Titan Collection
          </h2>
          <AttackOnTitanGallery meeshoUrl={attackOnTitanUrl} />
        </div>
      </div>

      {/* Meesho Product Section */}
      <MeeshoProductSection />

      {/* Watch Product Section */}
      <WatchProductSection />

      {/* Promotional Section */}
      <div className="bg-accent/30 py-12">
        <div className="container mx-auto px-4">
          <PromotionalImage
            src="/assets/ms_df88y_512_388205135.jpg"
            alt="Featured Fashion"
            meeshoUrl="https://www.meesho.com/af_invite/234223027:youtube_long_form:1998242?p_id=388205135&ext_id=6f4kzz&utm_source=youtube_long_form"
          />
        </div>
      </div>

      {/* Second Promotional Section */}
      <div className="bg-background py-12">
        <div className="container mx-auto px-4">
          <PromotionalImage
            src="/assets/ms_9wecb_512_690945320.jpg"
            alt="Featured Fashion Item"
            meeshoUrl="https://www.meesho.com/af_invite/234223027:youtube_long_form:1998930?p_id=690945320&ext_id=bfdctk&utm_source=youtube_long_form"
          />
        </div>
      </div>

      {/* Kurta Suit Product Section */}
      <KurtaSuitProductSection />

      {/* Category Filter */}
      <div className="container mx-auto px-4 pt-12 pb-6">
        {!isLoading && !isPending && !error && categories.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-4">Filter by Category</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        {renderProductsSection()}
      </div>

      {/* Category Image Section */}
      <CategoryImageSection />
    </div>
  );
}
