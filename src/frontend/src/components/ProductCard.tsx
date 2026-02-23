import { Link } from '@tanstack/react-router';
import type { Product } from '../backend';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { SiPinterest } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.imageUrl || '/assets/generated/placeholder-product.dim_400x600.png';
  const hasPinterestPin = product.pinterestPinId && product.pinterestPinId.trim() !== '';

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <Link to="/product/$id" params={{ id: product.id.toString() }} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasPinterestPin && (
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm p-2 rounded-full shadow-md">
              <SiPinterest className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {product.category}
            </Badge>
          </div>
          <p className="text-2xl font-bold tracking-tight">${product.price.toFixed(2)}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
