import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, Download, Search, RefreshCw, Eye, Printer, Settings, FileDown } from 'lucide-react';
import { mockProducts } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product, QRCodeData } from '@/types/product';
import { useIsMobile } from '@/hooks/use-mobile';

// Using QR Server API as it's free and reliable
const QR_API_URL = "https://api.qrserver.com/v1/create-qr-code/";

const WALMART_QR_COLORS = {
  background: "FFFFFF", // white
  foreground: "0071CE", // Walmart blue
  eo: "FFC220",         // Walmart yellow (eye outer)
  ei: "0071CE",         // Walmart blue (eye inner)
};

// QR Code field options for selection
const QR_FIELD_OPTIONS = [
  { id: 'productId', label: 'Product ID', required: true },
  { id: 'name', label: 'Product Name' },
  { id: 'price', label: 'Price' },
  { id: 'discount', label: 'Discount' },
  { id: 'expiryDate', label: 'Expiry Date' },
  { id: 'batchNumber', label: 'Batch Number' },
  { id: 'category', label: 'Category' },
  { id: 'location', label: 'Location' },
  { id: 'shelfNumber', label: 'Shelf Number' },
  { id: 'isEcoFriendly', label: 'Eco Friendly Product' },
  { id: 'isOnPromotion', label: 'On Promotion' },
  { id: 'offerId', label: 'Offer ID' },
];

function buildQrApiUrl({
  text,
  size = 256,
  color = "0071ce",
  bgcolor = "ffffff",
  format = "svg"
}: {
  text: string;
  size?: number;
  color?: string;
  bgcolor?: string;
  format?: string;
}) {
  const params = new URLSearchParams({
    data: encodeURIComponent(text),
    size: String(size),
    color,
    bgcolor,
    format
  });
  return `${QR_API_URL}?${params.toString()}`;
}

const QRCodeGeneration = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>(['productId', 'name', 'price']);
  const [qrType, setQrType] = useState<"SVG" | "PNG">("SVG");
  const [qrBg, setQrBg] = useState(WALMART_QR_COLORS.background);
  const [qrFg, setQrFg] = useState(WALMART_QR_COLORS.foreground);
  const [qrEo, setQrEo] = useState(WALMART_QR_COLORS.eo);
  const [qrEi, setQrEi] = useState(WALMART_QR_COLORS.ei);
  const [qrSize, setQrSize] = useState<number>(256);
  const [qrPadding, setQrPadding] = useState<number>(4);
  const [showQrPreview, setShowQrPreview] = useState<boolean>(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateQR = (product: Product) => {
    // In a real app, this would generate an actual QR code
    const qrData = createQRData(product);
    
    // Update product with new QR data
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          qrGeneratedDate: new Date().toISOString(),
          qrLink: `https://store.example.com/p/${p.productId}`,
        };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    
    toast({
      title: t("QR Code Generated"),
      description: t("QR code has been generated and is ready for download"),
    });
  };

  const handleBulkGenerate = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: t("No products selected"),
        description: t("Please select products to generate QR codes"),
        variant: "destructive",
      });
      return;
    }

    // Update all selected products with QR data
    const updatedProducts = products.map(product => {
      if (selectedProducts.includes(product.id)) {
        return {
          ...product,
          qrGeneratedDate: new Date().toISOString(),
          qrLink: `https://store.example.com/p/${product.productId}`,
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);

    toast({
      title: t("Bulk QR Generation"),
      description: t(`Generated QR codes for ${selectedProducts.length} products`),
    });
    setSelectedProducts([]);
  };

  const handleDownloadQR = (product: Product) => {
    // In a real app, this would download the actual QR code
    toast({
      title: t("Download Started"),
      description: t(`Downloading QR code for ${product.name}`),
    });
  };

  const handlePreviewQR = (product: Product) => {
    setPreviewProduct(product);
    setShowQrPreview(true);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };
  
  const handleFieldToggle = (fieldId: string) => {
    if (fieldId === 'productId') return; // Can't deselect product ID
    
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const createQRData = (product: Product): QRCodeData => {
    const qrData: any = { qrLink: product.qrLink, qrGeneratedDate: new Date().toISOString() };
    
    selectedFields.forEach(field => {
      if (field in product) {
        qrData[field] = (product as any)[field];
      }
    });
    
    return qrData as QRCodeData;
  };

  // Generate QR code text from product fields
  function getQrText(product: Product) {
    // You can customize this to include any product fields
    return [
      `Product: ${product.name}`,
      `ID: ${product.productId}`,
      `Price: ₹${product.price}`,
      `Discount: ${product.discount}%`,
      `Category: ${product.category}`,
      `Location: ${product.location}`,
      `Expiry: ${product.expiryDate}`,
      `EcoFriendly: ${product.isEcoFriendly ? "Yes" : "No"}`,
      `OnPromotion: ${product.isOnPromotion ? "Yes" : "No"}`,
    ].join(" | ");
  }

  // QR Code Preview Component using API
  const QRCodePreview = ({ product }: { product: Product }) => {
    const qrUrl = buildQrApiUrl({
      text: getQrText(product),
      size: qrSize,
      color: qrFg.toLowerCase(),
      bgcolor: qrBg.toLowerCase(),
      format: qrType.toLowerCase()
    });

    return (
      <div className="flex flex-col items-center gap-4">
        <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
        <div className="text-center">
          <h4 className="font-semibold">{product.name}</h4>
          <p className="text-sm text-muted-foreground">ID: {product.productId}</p>
        </div>
        <Button
          size="sm"
          onClick={() => window.open(qrUrl, "_blank")}
        >
          {t("Download QR")}
        </Button>
      </div>
    );
  };

  // Mock QR code thumbnail component
  const QRCodeDisplay = ({ product }: { product: Product }) => {
    const qrUrl = buildQrApiUrl({
      text: getQrText(product),
      size: 64,
      color: qrFg.toLowerCase(),
      bgcolor: qrBg.toLowerCase(),
      format: "svg"
    });
    return (
      <img src={qrUrl} alt="QR Code" className="w-12 h-12" />
    );
  };

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{t("QR Code Generation")}</h3>
          <p className="text-muted-foreground">{t("Generate and manage QR codes for your products")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                {t("QR Settings")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("QR Code Settings")}</DialogTitle>
                <DialogDescription>
                  {t("Configure what information to include in your QR codes")}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="fields" className="w-full mt-4">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="fields">{t("Fields")}</TabsTrigger>
                  <TabsTrigger value="appearance">{t("Appearance")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fields" className="mt-4 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{t("Select Fields to Include")}</h4>
                    <p className="text-xs text-muted-foreground">{t("Choose what product information to include in generated QR codes")}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QR_FIELD_OPTIONS.map(field => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`field-${field.id}`}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => handleFieldToggle(field.id)}
                          disabled={field.required}
                        />
                        <label 
                          htmlFor={`field-${field.id}`}
                          className={`text-sm ${field.required ? 'font-medium' : ''}`}
                        >
                          {t(field.label)}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="qr-template" className="text-sm font-medium">{t("QR Template")}</label>
                    <Select
                      value={qrType}
                      onValueChange={(val) => setQrType(val as "SVG" | "PNG")}
                    >
                      <SelectTrigger id="qr-template" className="mt-1">
                        <SelectValue placeholder={t("Select template")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SVG">{t("SVG")}</SelectItem>
                        <SelectItem value="PNG">{t("PNG")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="qr-size" className="text-sm font-medium">{t("QR Code Size")}</label>
                    <Select
                      value={String(qrSize)}
                      onValueChange={(val) => setQrSize(Number(val))}
                    >
                      <SelectTrigger id="qr-size" className="mt-1">
                        <SelectValue placeholder={t("Select size")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64">{t("Small")}</SelectItem>
                        <SelectItem value="128">{t("Medium")}</SelectItem>
                        <SelectItem value="256">{t("Large")}</SelectItem>
                        <SelectItem value="512">{t("Extra Large")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">{t("Cancel")}</Button>
                </DialogClose>
                <Button>{t("Save Settings")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleBulkGenerate}
            disabled={selectedProducts.length === 0}
            variant={isMobile ? "mobile" : "default"}
            className={isMobile ? "w-full" : ""}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("Generate Selected")} ({selectedProducts.length})
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search products...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button 
          onClick={() => setSearchTerm('')}
          variant="outline"
          className="md:w-auto w-full"
        >
          {t("Clear")}
        </Button>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} {t("products found")}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectedProducts.length === filteredProducts.length
                  ? t("Deselect All")
                  : t("Select All")}
              </Button>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              {t("No products found matching your search")}
            </p>
          )}

          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="p-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleSelectProduct(product.id)}
                      id={`select-${product.id}`}
                      className="h-5 w-5"
                    />
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {product.productId}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  {product.qrGeneratedDate && (
                    <div className="flex items-center">
                      <QRCodeDisplay product={product} />
                    </div>
                  )}
                </div>
                <CardFooter className="bg-muted/30 p-2 flex justify-between">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePreviewQR(product)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {t("Preview")}
                  </Button>

                  {product.qrGeneratedDate ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownloadQR(product)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {t("Download")}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleGenerateQR(product)}
                    >
                      <QrCode className="h-4 w-4 mr-1" />
                      {t("Generate")}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">{t("QR")}</TableHead>
                  <TableHead>{t("Product")}</TableHead>
                  <TableHead>{t("Category")}</TableHead>
                  <TableHead>{t("Location")}</TableHead>
                  <TableHead>{t("Generated Date")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleSelectProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {product.qrGeneratedDate && (
                          <QRCodeDisplay product={product} />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.productId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.location}</TableCell>
                      <TableCell>
                        {product.qrGeneratedDate ? (
                          <div className="text-sm">
                            {new Date(product.qrGeneratedDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground bg-muted/50">
                            {t("Not Generated")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePreviewQR(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {product.qrGeneratedDate ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadQR(product)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleGenerateQR(product)}
                            >
                              <QrCode className="h-4 w-4 mr-1" />
                              {t("Generate")}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {t("No products found matching your search")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* QR Code Preview Dialog */}
      <Dialog open={showQrPreview} onOpenChange={setShowQrPreview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("QR Code Preview")}</DialogTitle>
            <DialogDescription>
              {t("Preview how your QR code will appear")}
            </DialogDescription>
          </DialogHeader>
          
          {previewProduct && (
            <div className="flex justify-center py-4">
              <QRCodePreview product={previewProduct} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCodeGeneration;