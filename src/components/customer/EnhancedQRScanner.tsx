import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  QrCode, 
  Camera, 
  Package,
  Scan,
  ChevronRight
} from 'lucide-react';
import { fetchProductById } from '@/services/productService';
import CompactProductCard from './CompactProductCard';
import { useTranslation } from 'react-i18next';

interface EnhancedQRScannerProps {
  onProductScan: (product: any) => void;
  onAddToCart: (product: any) => void;
}

const EnhancedQRScanner: React.FC<EnhancedQRScannerProps> = ({ onProductScan, onAddToCart }) => {
  const { t } = useTranslation();
  const [scanInput, setScanInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [recentlyScanned, setRecentlyScanned] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const demoProducts = [
    'PROD001', 'PROD002', 'PROD003', 'PROD004', 'PROD005'
  ];

  const handleScan = async () => {
    if (!scanInput.trim()) return;
    
    setLoading(true);
    try {
      const product = await fetchProductById(scanInput.trim());
      if (product) {
        setScannedProduct(product);
        addToRecentlyScanned(product);
        onProductScan(product);
        setScanInput('');
        toast({
          title: t("customer.productScanned"),
          description: `${product.name} ${t("customer.scannedSuccessfully")}`,
        });
      }
    } catch (error) {
      toast({
        title: t("customer.error"),
        description: t("customer.productNotFound"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedScan = async (productId: string) => {
    setLoading(true);
    try {
      const product = await fetchProductById(productId);
      if (product) {
        setScannedProduct(product);
        addToRecentlyScanned(product);
        onProductScan(product);
        toast({
          title: t("customer.productScanned"),
          description: `${product.name} ${t("customer.scannedSuccessfully")}`,
        });
      }
    } catch (error) {
      toast({
        title: t("customer.error"),
        description: t("customer.productNotFound"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyScanned = (product: any) => {
    setRecentlyScanned(prev => {
      const filtered = prev.filter(p => p.productid !== product.productid);
      return [product, ...filtered].slice(0, 6);
    });
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Auto-scan a demo product for demonstration
      handleSimulatedScan(demoProducts[Math.floor(Math.random() * demoProducts.length)]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* QR Scanner */}
      <Card>
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6" />
            {t("customer.qrScanner")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera Viewfinder */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
            {isScanning ? (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 border-2 border-white rounded-lg relative animate-pulse">
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-red-500 animate-bounce"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  {t("customer.pointCamera")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("customer.qrScanInstructions")}
                </p>
              </div>
            )}
          </div>

          {/* Start Scanning Button */}
          <Button 
            onClick={startScanning} 
            className="w-full" 
            size="lg"
            disabled={isScanning}
          >
            <Scan className="h-5 w-5 mr-2" />
            {isScanning ? t("customer.scanning") : t("customer.startScanning")}
          </Button>

          {/* Manual Input */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("customer.manualEntry")}</p>
            <div className="flex gap-2">
              <Input
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder={t("customer.enterProductId")}
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              />
              <Button onClick={handleScan} disabled={loading || !scanInput.trim()}>
                {loading ? t("common.loading") : t("customer.scan")}
              </Button>
            </div>
          </div>

          {/* Demo Products */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("customer.demoProducts")}</p>
            <div className="grid grid-cols-2 gap-2">
              {demoProducts.slice(0, 4).map((productId) => (
                <Button
                  key={productId}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSimulatedScan(productId)}
                  disabled={loading}
                  className="justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  {productId}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Product Display */}
      {scannedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("customer.scannedProduct")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CompactProductCard
              product={scannedProduct}
              onAddToCart={onAddToCart}
            />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("customer.availability")}</span>
                <Badge variant={scannedProduct.stockcount > 10 ? "default" : "destructive"}>
                  {scannedProduct.stockcount > 10 ? t("customer.inStock") : t("customer.lowStock")}
                </Badge>
              </div>
              {scannedProduct.expirydate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("customer.expiryDate")}</span>
                  <span className="text-sm">
                    {new Date(scannedProduct.expirydate).toLocaleDateString('hi-IN')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Scanned */}
      {recentlyScanned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("customer.recentlyScanned")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {recentlyScanned.map((product) => (
                <CompactProductCard
                  key={product.productid}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanning Tips */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t("customer.scanningTips")}</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {t("customer.tip1")}</li>
              <li>• {t("customer.tip2")}</li>
              <li>• {t("customer.tip3")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedQRScanner;