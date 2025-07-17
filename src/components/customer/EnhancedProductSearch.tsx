import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import { fetchAllProducts, searchProducts } from '@/services/productService';
import CompactProductCard from './CompactProductCard';
import { useTranslation } from 'react-i18next';

interface EnhancedProductSearchProps {
  onAddToCart: (product: any) => void;
}

const EnhancedProductSearch: React.FC<EnhancedProductSearchProps> = ({ onAddToCart }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categoryTabs = [
    { id: 'All', label: t("common.all"), Hindi: 'सभी' },
    { id: 'DAIRY', label: t("categories.dairy"), Hindi: 'डेयरी' },
    { id: 'BEVERAGES', label: t("categories.beverages"), Hindi: 'पेय पदार्थ' },
    { id: 'SNACKS', label: t("categories.snacks"), Hindi: 'नाश्ता' },
    { id: 'PERSONAL_CARE', label: t("categories.personalCare"), Hindi: 'व्यक्तिगत देखभाल' },
    { id: 'COOKING_OIL', label: t("categories.cookingOil"), Hindi: 'खाना पकाने का तेल' },
    { id: 'PASTA', label: t("categories.pasta"), Hindi: 'पास्ता' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [activeCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await fetchAllProducts();
      setProducts(allProducts);
      const uniqueCategories = Array.from(new Set(allProducts.map((p: any) => p.category).filter(Boolean)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let results;
      if (searchTerm.trim()) {
        results = await searchProducts(searchTerm.trim());
      } else {
        results = await fetchAllProducts();
      }
      setProducts(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t("customer.searchProducts")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} size="icon" variant="outline">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categoryTabs.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap flex-shrink-0"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.Hindi}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredProducts.length} {t("customer.productsFound")}
        </span>
        {activeCategory !== 'All' && (
          <Badge variant="secondary">
            {categoryTabs.find(c => c.id === activeCategory)?.Hindi}
          </Badge>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-square rounded-lg mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <CompactProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t("customer.noProductsFound")}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {t("customer.tryDifferentSearch")}
            </p>
            <Button onClick={() => { setSearchTerm(''); setActiveCategory('All'); handleSearch(); }}>
              {t("customer.clearSearch")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Search Suggestions */}
      {searchTerm === '' && activeCategory === 'All' && !loading && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">{t("customer.quickSearch")}</h3>
          <div className="flex flex-wrap gap-2">
            {['दूध', 'चावल', 'तेल', 'बिस्कुट', 'चाय', 'दाल'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm(suggestion);
                  handleSearch();
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProductSearch;