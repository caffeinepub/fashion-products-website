import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useImageLoader } from '../hooks/useImageLoader';
import LoadingTimeout from '../components/LoadingTimeout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { SiPinterest } from 'react-icons/si';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading, error, refetch } = useGetProduct(BigInt(productId));

  const imageUrl = product?.imageUrl || '/assets/generated/placeholder-product.dim_400x600.png';
  const { imageSrc, isLoading: imageLoading } = useImageLoader({
    src: imageUrl,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <LoadingTimeout
            isLoading={isLoading}
            timeout={10000}
            onRetry={() => refetch()}
            loadingMessage="Loading product details..."
            timeoutMessage="Product details are taking longer than expected to load"
          />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">Product not found</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate({ to: '/' })}>Return to Products</Button>
            <Button onClick={() => refetch()} variant="outline">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const hasPinterestPin = product.pinterestPinId && product.pinterestPinId.trim() !== '';
  const pinterestUrl = hasPinterestPin
    ? product.pinterestPinId.startsWith('http')
      ? product.pinterestPinId
      : `https://pinterest.com/pin/${product.pinterestPinId}`
    : '';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-8 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
            {imageLoading && (
              <div className="absolute inset-0">
                <Skeleton className="w-full h-full" />
              </div>
            )}
            <img
              src={imageSrc}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.name}</h1>
              <p className="text-4xl font-bold tracking-tight">${product.price.toFixed(2)}</p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {hasPinterestPin && (
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Inspired by Pinterest</h3>
                <a href={pinterestUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2 bg-destructive hover:bg-destructive/90">
                    <SiPinterest className="h-5 w-5" />
                    View on Pinterest
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
