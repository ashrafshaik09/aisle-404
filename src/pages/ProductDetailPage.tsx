import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  MessageCircle, 
  MapPin, 
  X, 
  Navigation,
  ShoppingCart,
  ChevronDown
} from 'lucide-react';
import { fetchProductById } from '@/services/productService';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const minSwipeDistance = 50;
  const maxSwipeDistance = 150;

  // Sample comments for products
  const sampleComments = [
    { id: 1, user: "राहुल शर्मा", comment: "बहुत अच्छी गुणवत्ता! मुझे यह बहुत पसंद आया।", rating: 5, time: "2 घंटे पहले" },
    { id: 2, user: "प्रिया गुप्ता", comment: "ताज़ा और स्वादिष्ट। बच्चों को बहुत पसंद आया।", rating: 5, time: "4 घंटे पहले" },
    { id: 3, user: "अमित कुमार", comment: "वैल्यू फॉर मनी। अच्छी डील है।", rating: 4, time: "6 घंटे पहले" },
    { id: 4, user: "सुनीता देवी", comment: "हमेशा की तरह बेहतरीन क्वालिटी।", rating: 5, time: "8 घंटे पहले" },
    { id: 5, user: "विकास यादव", comment: "पैकेजिंग अच्छी थी। जल्दी डिलीवरी।", rating: 4, time: "10 घंटे पहले" },
    { id: 6, user: "अंकिता सिंह", comment: "ब्रांड भरोसेमंद है। बार-बार खरीदते हैं।", rating: 5, time: "12 घंटे पहले" },
    { id: 7, user: "मनोज तिवारी", comment: "थोड़ा महंगा लगा लेकिन क्वालिटी अच्छी है।", rating: 4, time: "1 दिन पहले" },
    { id: 8, user: "रेखा पटेल", comment: "बच्चों के लिए परफेक्ट। न्यूट्रिशियस।", rating: 5, time: "1 दिन पहले" },
    { id: 9, user: "संदीप जोशी", comment: "एक्सपायरी डेट चेक करके लें।", rating: 3, time: "1 दिन पहले" },
    { id: 10, user: "कविता राव", comment: "हमारे घर में यही ब्रांड चलता है।", rating: 5, time: "2 दिन पहले" },
    { id: 11, user: "राजेश मेहता", comment: "डिस्काउंट के साथ बहुत अच्छा डील।", rating: 4, time: "2 दिन पहले" },
    { id: 12, user: "पूजा अग्रवाल", comment: "स्वाद में कोई कमी नहीं। रेकमेंड करती हूं।", rating: 5, time: "3 दिन पहले" }
  ];

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        try {
          const productData = await fetchProductById(productId);
          setProduct(productData);
        } catch (error) {
          toast({
            title: t("customer.error"),
            description: t("customer.productNotFound"),
            variant: "destructive"
          });
          navigate('/customer');
        } finally {
          setLoading(false);
        }
      }
    };
    loadProduct();
  }, [productId, navigate, t]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeDistance(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    const distance = touchStart - currentTouch;
    if (distance > 0) {
      setSwipeDistance(Math.min(distance, maxSwipeDistance));
    }
  };

  const onTouchEnd = () => {
    if (swipeDistance >= minSwipeDistance) {
      setIsSwipeActive(true);
    } else {
      setSwipeDistance(0);
    }
    setTouchStart(null);
  };

  const handleAddToCart = () => {
    toast({
      title: t("customer.addedToCart"),
      description: `${product.name} ${t("customer.addedToCartSuccess")}`,
    });
    setIsSwipeActive(false);
    setSwipeDistance(0);
  };

  const handleCancel = () => {
    setIsSwipeActive(false);
    setSwipeDistance(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t("customer.productNotFound")}</p>
      </div>
    );
  }

  const savings = product.mrp - product.price;
  const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const likes = Math.floor(Math.random() * 3000) + 1000;
  const comments = Math.floor(Math.random() * 800) + 400;
  const displayedComments = showAllComments ? sampleComments : sampleComments.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customer')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg">{t("customer.productDetails")}</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Product Image and Basic Info */}
      <div className="relative">
        <div className="aspect-square bg-muted flex items-center justify-center relative">
          <img 
            src={`https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discountPercentage > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white">
              {discountPercentage}% {t("common.off")}
            </Badge>
          )}
        </div>

        {/* Swipe to Add to Cart Overlay */}
        {(isSwipeActive || swipeDistance > 0) && (
          <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
            <div className="text-center text-white">
              {isSwipeActive ? (
                <div className="space-y-4">
                  <ShoppingCart className="h-12 w-12 mx-auto" />
                  <p className="font-semibold text-lg">{t("customer.addToCart")}</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleAddToCart} variant="secondary" size="lg">
                      {t("customer.confirm")}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm opacity-80">{t("customer.swipeToAdd")}</div>
                  <div className="w-48 h-2 bg-white/30 rounded-full mt-2 mx-auto">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{ width: `${(swipeDistance / maxSwipeDistance) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-4">
        {/* Title and Rating */}
        <div>
          <h1 className="text-xl font-bold text-foreground mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="text-sm font-medium ml-1">4.8</span>
            </div>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{product.location || "एसिले 5B"}</span>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <Navigation className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-lg text-muted-foreground line-through">₹{product.mrp}</span>
          )}
          {savings > 0 && (
            <span className="text-sm text-green-600 font-medium">
              ₹{savings} {t("common.saved")}
            </span>
          )}
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <button 
            className={`flex items-center gap-1 ${liked ? 'text-red-500' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
            <span className="text-sm">{(likes + (liked ? 1 : 0)).toLocaleString('hi')}</span>
          </button>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{comments}</span>
          </div>
        </div>

        {/* Add to Cart Button (non-swipe) */}
        <div 
          className="relative bg-card rounded-lg overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Button className="w-full" size="lg">
            <ShoppingCart className="h-5 w-5 mr-2" />
            {t("customer.addToCart")}
          </Button>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-500/20 pointer-events-none" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {t("customer.swipeRight")}
          </div>
        </div>

        {/* Comments Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{t("customer.reviews")}</h3>
              <span className="text-sm text-muted-foreground">
                {sampleComments.length} {t("customer.reviews")}
              </span>
            </div>
            
            <div className="space-y-4">
              {displayedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {comment.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.user}</span>
                      <div className="flex">
                        {[...Array(comment.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-foreground">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {!showAllComments && sampleComments.length > 10 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => setShowAllComments(true)}
              >
                {t("customer.showMore")} <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;