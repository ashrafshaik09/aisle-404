import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Calendar,
  QrCode,
  BarChart3,
  Plus,
  Search,
  Download,
  Gift,
  Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import InventoryManagement from '@/components/admin/InventoryManagement';
import QRCodeGeneration from '@/components/admin/QRCodeGeneration';
import OfferSetup from '@/components/admin/OfferSetup';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import SmartAnalytics from '@/components/admin/SmartAnalytics';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockAlerts: 0,
    slowMovingStock: 0,
    upcomingBatches: 0
  });

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('admin-session');
    if (!adminSession) {
      navigate('/admin-login');
      return;
    }
    setAdminUser(JSON.parse(adminSession));
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      setStats({
        totalProducts: products?.length || 0,
        lowStockAlerts: products?.filter(p => p.stockcount <= (p.restockthreshold || 10)).length || 0,
        slowMovingStock: products?.filter(p => (p.salesvelocity || 0) < 1).length || 0,
        upcomingBatches: 8 // Mock value for demo
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-session');
    navigate('/admin-login');
  };

  const statsConfig = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockAlerts,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Slow Moving Stock",
      value: stats.slowMovingStock,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Upcoming Batches",
      value: stats.upcomingBatches,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-full p-2 shadow-soft">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <span className="text-2xl font-bold text-white tracking-wide">Aisle404 Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-base font-medium text-white/80">
                {t("common.welcome")}, {adminUser?.name || 'Admin'}
              </span>
              <LanguageSelector />
              <Button variant="outline" onClick={handleLogout} className="border-black text-black hover:bg-white hover:text-primary">
                {t("common.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-slideInLeft">Dashboard Overview</h2>
          <p className="text-gray-600 animate-slideInLeft animate-stagger-1">Monitor store performance and manage inventory</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all duration-300 animate-bounceIn animate-stagger-${index + 1} hover:scale-105`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1 animate-fadeIn">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 animate-pulse-slow">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor} animate-pulse-slow`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6 animate-slideInUp">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>{t('admin.analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="smart-analytics" className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4" />
              <span>Smart Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>{t('admin.inventory')}</span>
            </TabsTrigger>
            <TabsTrigger value="qrcodes" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>{t('admin.qrCodes')}</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>{t('admin.offers')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6 animate-fadeIn">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="smart-analytics" className="space-y-6 animate-fadeIn">
            <SmartAnalytics />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6 animate-fadeIn">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="qrcodes" className="space-y-6 animate-fadeIn">
            <QRCodeGeneration />
          </TabsContent>

          <TabsContent value="offers" className="space-y-6 animate-fadeIn">
            <OfferSetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;