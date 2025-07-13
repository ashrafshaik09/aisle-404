import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, TrendingUp, TrendingDown, AlertTriangle, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

interface AnalyticsData {
  productid: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  stockcount: number;
  scannedcount: number;
  cartaddcount: number;
  salecount: number;
  salesvelocity: number;
  expirydate: string;
  cluster?: number;
  managementTip?: string;
  smartSuggestions?: string;
  predictedSafeDiscount?: number;
  conversionRate?: number;
  abandonRate?: number;
  profit?: number;
  closeToExpiry?: boolean;
}

const SmartAnalytics = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, searchTerm, selectedCluster]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      const processedData = products.map(product => analyzeProduct(product));
      setData(processedData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const analyzeProduct = (product: any): AnalyticsData => {
    const conversionRate = product.scannedcount ? product.salecount / product.scannedcount : 0;
    const abandonRate = product.cartaddcount ? 1 - (product.salecount / product.cartaddcount) : 0;
    const profit = product.price * product.salecount;
    const closeToExpiry = product.expirydate ? 
      new Date(product.expirydate).getTime() - Date.now() <= 30 * 24 * 60 * 60 * 1000 : false;

    // Simple clustering logic based on performance
    let cluster = 1;
    const performance = (conversionRate * 0.4) + (profit / 1000 * 0.3) + ((1 - abandonRate) * 0.3);
    if (performance > 0.7) cluster = 1; // High performer
    else if (performance > 0.3) cluster = 2; // Moderate
    else cluster = 3; // Low performer

    const clusterTips = {
      1: "🟢 High Performer – Promote and Stock More",
      2: "🟡 Moderate – Adjust Placement or Price", 
      3: "🔴 Low Performer – Discount or Remove"
    };

    const suggestions = generateSuggestions(product, conversionRate, abandonRate, profit, closeToExpiry);
    const predictedSafeDiscount = calculateSafeDiscount(product, profit);

    return {
      ...product,
      conversionRate,
      abandonRate,
      profit,
      closeToExpiry,
      cluster,
      managementTip: clusterTips[cluster as keyof typeof clusterTips],
      smartSuggestions: suggestions,
      predictedSafeDiscount
    };
  };

  const generateSuggestions = (product: any, conversionRate: number, abandonRate: number, profit: number, closeToExpiry: boolean) => {
    const suggestions = [];
    if (conversionRate < 0.2) suggestions.push("Improve product description and visibility");
    if (abandonRate > 0.5) suggestions.push("Offer incentives to reduce cart abandonment");
    if (product.stockcount < 10) suggestions.push("Low stock: consider restocking soon");
    if (product.stockcount > 100) suggestions.push("High stock: consider promotional campaigns");
    if (profit < 50) suggestions.push("Low profit: review pricing or supplier costs");
    if (closeToExpiry) suggestions.push("Close to expiry: increase discount to clear stock");
    return suggestions.length ? suggestions.join(" | ") : "No immediate action needed";
  };

  const calculateSafeDiscount = (product: any, profit: number) => {
    try {
      const profitMargin = profit / (product.price * product.salecount);
      return Math.min(product.discount + 0.1, profitMargin * 0.8);
    } catch {
      return 0;
    }
  };

  const filterData = () => {
    let filtered = data;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCluster) {
      filtered = filtered.filter(item => item.cluster === selectedCluster);
    }
    
    setFilteredData(filtered);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    // Here you would implement Excel file parsing
    // For now, just reload existing data
    await loadData();
  };

  const downloadExcel = () => {
    // Convert filtered data to CSV for download
    const csvContent = [
      ['Product ID', 'Name', 'Category', 'Cluster', 'Management Tip', 'Smart Suggestions', 'Predicted Safe Discount'],
      ...filteredData.map(item => [
        item.productid,
        item.name,
        item.category,
        item.cluster,
        item.managementTip,
        item.smartSuggestions,
        item.predictedSafeDiscount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_analytics.csv';
    a.click();
  };

  const clusterData = {
    labels: ['High Performers', 'Moderate', 'Low Performers'],
    datasets: [{
      data: [
        filteredData.filter(d => d.cluster === 1).length,
        filteredData.filter(d => d.cluster === 2).length,
        filteredData.filter(d => d.cluster === 3).length
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
    }]
  };

  const profitData = {
    labels: filteredData.slice(0, 10).map(d => d.name.slice(0, 15)),
    datasets: [{
      label: 'Profit',
      data: filteredData.slice(0, 10).map(d => d.profit),
      backgroundColor: '#3b82f6'
    }]
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Smart Analytics Dashboard</h2>
          <p className="text-gray-600">AI-powered inventory insights and recommendations</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileUpload}
            className="hidden"
            id="excel-upload"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('excel-upload')?.click()}
            className="animate-slideInLeft"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Excel
          </Button>
          <Button 
            onClick={downloadExcel}
            className="animate-slideInLeft animate-stagger-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-bounceIn">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        
        <Card className="animate-bounceIn animate-stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredData.filter(d => d.cluster === 1).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-bounceIn animate-stagger-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredData.filter(d => d.cluster === 3).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slideInLeft">
          <CardHeader>
            <CardTitle>Performance Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={clusterData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slideInLeft animate-stagger-1">
          <CardHeader>
            <CardTitle>Top 10 Products by Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={profitData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-slideInUp">
        <CardHeader>
          <CardTitle>Smart Recommendations</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            {[1, 2, 3].map(cluster => (
              <Button
                key={cluster}
                variant={selectedCluster === cluster ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCluster(selectedCluster === cluster ? null : cluster)}
              >
                Cluster {cluster}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredData.slice(0, 20).map((product, index) => (
              <div 
                key={product.productid} 
                className="border rounded-lg p-4 animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category} • ₹{product.price}</p>
                  </div>
                  <Badge 
                    variant={product.cluster === 1 ? "default" : product.cluster === 2 ? "secondary" : "destructive"}
                  >
                    {product.managementTip?.slice(2, 15)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{product.smartSuggestions}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Conversion: {(product.conversionRate! * 100).toFixed(1)}%</span>
                  <span>Stock: {product.stockcount}</span>
                  <span>Profit: ₹{product.profit?.toFixed(0)}</span>
                  {product.closeToExpiry && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Near Expiry
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartAnalytics;