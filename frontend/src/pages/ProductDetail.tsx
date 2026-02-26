import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useImageLoader } from '../hooks/useImageLoader';
import LoadingTimeout from '../components/LoadingTimeout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { SiPinterest } from 'react-icons/si';

const PLACEHOLDER = '/assets/generated/placeholder-product.dim_400x600.png';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();

  // Safely parse productId to BigInt
  let parsedId: bigint | undefined;
  try {
    parsedId = BigInt(productId);
  } catch {
    parsedId = undefined;
  }

  const { data: product, isLoading, error, refetch } = useGetProduct(parsedId);

  // Always call useImageLoader at the top level — use placeholder when product not yet loaded
  const imageUrl = product?.imageUrl && product.imageUrl.trim() !== ''
    ? product.imageUrl
    : PLACEHOLDER;

  const { imageSrc, isLoading: imageLoading } = useImageLoader({
    src: imageUrl,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <LoadingTimeout
            isLoading={isLoading}
            timeout={15000}
            onRetry={() => refetch()}
            loadingMessage="Loading product details..."
            timeoutMessage="Product details are taking longer than expected to load"
          />
        </div>
      </div>
    );
  }

  if (parsedId === undefined) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Product</AlertTitle>
            <AlertDescription>The product ID is invalid.</AlertDescription>
          </Alert>
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            Return to Products
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load product</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unexpected error occurred while loading the product.'}
            </AlertDescription>
          </Alert>
          <div className="flex gap-3">
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1">
              Return to Products
            </Button>
            <Button onClick={() => refetch()} className="flex-1">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Product Not Found</AlertTitle>
            <AlertDescription>
              The product you are looking for does not exist or has been removed.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            Return to Products
          </Button>
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
