import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Star,
  Heart,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CompactProductCardProps {
  product: any;
  onAddToCart?: (product: any) => void;
}

const CompactProductCard: React.FC<CompactProductCardProps> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const discountPercentage = product.mrp > product.price ? 
    Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  
  // Generate random engagement metrics
  const likes = Math.floor(Math.random() * 3000) + 1000;
  const comments = Math.floor(Math.random() * 800) + 400;

  const handleCardClick = () => {
    navigate(`/customer/product/${product.productid}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div 
      className="bg-card rounded-lg overflow-hidden border cursor-pointer hover:shadow-md transition-all duration-200 animate-fade-in"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-muted">
        <img 
          src={`https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 py-0.5">
            {discountPercentage}% {t("common.off")}
          </Badge>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 space-y-2">
        {/* Title and Category */}
        <div>
          <h3 className="font-medium text-sm text-foreground line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs px-1 py-0.5">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="text-xs">{product.location || "एसिले 5B"}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
            />
          ))}
          <span className="text-xs font-medium ml-1">4.8</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
          )}
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <button 
              className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleLikeClick}
            >
              <Heart className={`h-3 w-3 ${liked ? 'fill-red-500' : ''}`} />
              <span className="text-xs">{(likes + (liked ? 1 : 0)).toLocaleString('hi')}</span>
            </button>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span className="text-xs">{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactProductCard;