import { useState, useMemo } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import CategoryImageSection from '../components/CategoryImageSection';
import SwipeableGallery from '../components/SwipeableGallery';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ProductBrowse() {
  const { data: products, isLoading, error } = useGetAllProducts();
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-destructive">
          <p>Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

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

      {/* Promotional Section */}
      <div className="bg-accent/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
              <img
                src="/assets/ms_df88y_512_388205135.jpg"
                alt="Featured Fashion"
                className="w-full h-auto object-cover"
              />
            </div>
            <Button
              size="lg"
              className="font-semibold text-lg px-8 py-6 shadow-md hover:shadow-lg transition-all"
              onClick={() => window.open('https://www.meesho.com/af_invite/234223027:youtube_long_form:1998242?p_id=388205135&ext_id=6f4kzz&utm_source=youtube_long_form', '_blank', 'noopener,noreferrer')}
            >
              Look Out
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Second Promotional Section */}
      <div className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
              <img
                src="/assets/ms_9wecb_512_690945320.jpg"
                alt="Featured Fashion Item"
                className="w-full h-auto object-cover"
              />
            </div>
            <Button
              size="lg"
              className="font-semibold text-lg px-8 py-6 shadow-md hover:shadow-lg transition-all"
              onClick={() => window.open('https://www.meesho.com/af_invite/234223027:youtube_long_form:1998930?p_id=690945320&ext_id=bfdctk&utm_source=youtube_long_form', '_blank', 'noopener,noreferrer')}
            >
              Look Out
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter - Now positioned above Category Image Section */}
      <div className="container mx-auto px-4 pt-12 pb-6">
        {!isLoading && categories.length > 0 && (
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
        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {selectedCategory === 'All' ? 'No products available yet.' : `No products in "${selectedCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Category Image Section - Now positioned at the bottom */}
      <CategoryImageSection />
    </div>
  );
}
