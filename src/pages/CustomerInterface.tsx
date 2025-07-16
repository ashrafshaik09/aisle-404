import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  Search, 
  ShoppingCart, 
  MapPin,
  Gift
} from 'lucide-react';
import { fetchAllProducts } from '@/services/productService';
import EnhancedQRScanner from '@/components/customer/EnhancedQRScanner';
import EnhancedProductSearch from '@/components/customer/EnhancedProductSearch';
import VirtualCart from '@/components/customer/VirtualCart';
import StoreMap from '@/components/customer/StoreMap';
import CompactProductCard from '@/components/customer/CompactProductCard';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import { incrementProductCartCount } from '@/services/productService';

const CustomerInterface = () => {
  const { user, logout } = useAuth();
  const [scannedProducts, setScannedProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<{product: any, quantity: number}[]>([]);
  const [showFirstTimeDiscount, setShowFirstTimeDiscount] = useState(false);
  const [userBudget, setUserBudget] = useState<number>(1000);
  const [activeTab, setActiveTab] = useState('scan');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  // Load featured products on mount
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    if (user?.isFirstTime) {
      setShowFirstTimeDiscount(true);
      toast({
        title: t("customer.welcomeNew"),
        description: t("customer.firstPurchaseDiscount"),
      });
    }
  }, [user, t]);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    try {
      const products = await fetchAllProducts();
      // Select a few random products to feature
      const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);
      setFeaturedProducts(randomProducts);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductScan = (product: any) => {
    setScannedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (!exists) {
        toast({
          title: t("customer.productScanned"),
          description: `${product.name} - ₹${product.price}`,
        });
        return [...prev, product];
      }
      return prev;
    });
  };

  const addToCart = async (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    // Update cart count in database
    try {
      await incrementProductCartCount(product.productId);
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
    
    const updatedTotalAmount = getTotalAmount() + product.price;
    if (updatedTotalAmount > userBudget * 0.8) {
      const percentage = Math.round((updatedTotalAmount / userBudget) * 100);
      toast({
        title: t("customer.budgetReached"),
        description: t("customer.budgetReachedDescription", { percentage, amount: userBudget }),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("cart.addedToCart"),
        description: `${product.name} - ₹${product.price}`,
      });
    }
  };

  const getTotalAmount = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const discount = user?.isFirstTime ? subtotal * 0.05 : 0;
    return subtotal - discount;
  };

  const getBudgetStatus = () => {
    const total = getTotalAmount();
    const percentage = (total / userBudget) * 100;
    
    if (percentage >= 100) return { status: 'over', message: t('cart.budgetExceeded'), color: 'text-destructive' };
    if (percentage >= 80) return { status: 'warning', message: t('cart.approachingBudget'), color: 'text-warning' };
    return { status: 'safe', message: t('cart.withinBudget'), color: 'text-success' };
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header - Hidden on Mobile */}
      <header className="hidden md:block bg-gradient-to-r from-primary via-blue-600 to-blue-700 border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-full p-2 shadow-soft">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <span className="text-2xl font-bold text-white tracking-wide">{t("common.welcome")}</span>
              </div>
              {user?.isFirstTime && (
                <Badge variant="secondary" className="bg-success-light text-success ml-4">
                  <Gift className="w-3 h-3 mr-1" />
                  {t("customer.firstPurchaseDiscount")}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <LanguageSelector />
              <div className="flex items-center space-x-2 bg-white/80 rounded-lg px-3 py-1 shadow-soft">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="text-base font-semibold text-primary">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                <span className="text-base text-muted-foreground">₹{getTotalAmount().toFixed(2)}</span>
              </div>
              <Button variant="outline" onClick={logout} className="border-white text-white hover:bg-white hover:text-primary">
                {t("common.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b border-border">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <QrCode className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-bold text-foreground">{t("common.welcome")}</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
        {/* Recommended Products Card for Larger Screens */}
        <div className="hidden md:block mb-8">
          <Card className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t("customer.smartShopping")}</h2>
                <Button variant="outline">{t("common.viewAll")}</Button>
              </div>
              <p className="text-muted-foreground mb-6">{t("customer.scanDescription")}</p>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.map(product => (
                    <CompactProductCard
                      key={product.productid}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area with Tabs */}
        <Tabs defaultValue="scan" value={activeTab} onValueChange={handleTabChange}>
          {/* Mobile Tabs - Hidden on Desktop */}
 

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:block mb-6">
            <TabsList>
              <TabsTrigger value="scan">
                <QrCode className="h-4 w-4 mr-2" />
                {t("customer.scanQR")}
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="h-4 w-4 mr-2" />
                {t("customer.productSearch")}
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapPin className="h-4 w-4 mr-2" />
                {t("customer.storeMap")}
              </TabsTrigger>
              <TabsTrigger value="cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("customer.virtualCart")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="scan" className="mt-2 space-y-4">
            <EnhancedQRScanner 
              onProductScan={handleProductScan} 
              onAddToCart={addToCart}
            />
          </TabsContent>

          <TabsContent value="search" className="mt-2 space-y-4">
            <EnhancedProductSearch onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="map" className="mt-2 space-y-4">
            <StoreMap />
          </TabsContent>

          <TabsContent value="cart" className="mt-2 space-y-4">
            <VirtualCart 
              cartItems={cartItems} 
              setCartItems={setCartItems} 
              userBudget={userBudget}
              setUserBudget={setUserBudget}
              isFirstTime={!!user?.isFirstTime}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-16 px-4 z-50">
        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'map' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs">{t("customer.storeMap")}</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'search' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">{t("customer.productSearch")}</span>
          </button>
        </div>
          
        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'scan' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">{t("customer.scan")}</span>
          </button>
        </div>
          
        <div className="flex flex-col items-center justify-center space-y-1">
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center justify-center space-y-1 relative ${
              activeTab === 'cart' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs">{t("customer.virtualCart")}</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInterface;
