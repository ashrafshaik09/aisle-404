import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation,
  Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StoreSection {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

const storeSections: StoreSection[] = [
  { id: '2A', name: 'Dairy & Fresh', x: 15, y: 25, color: 'bg-blue-500' },
  { id: '3A', name: 'Beverages', x: 35, y: 25, color: 'bg-green-500' },
  { id: '6B', name: 'Snacks & Confectionery', x: 65, y: 40, color: 'bg-purple-500' },
  { id: '8A', name: 'Personal Care', x: 15, y: 65, color: 'bg-pink-500' },
  { id: '9A', name: 'Household Items', x: 85, y: 65, color: 'bg-orange-500' },
];

const ModernStoreMap = () => {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId === selectedSection ? null : sectionId);
  };

  const selectedSectionData = storeSections.find(s => s.id === selectedSection);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{t("store.storeMapNavigation")}</h3>
        <p className="text-muted-foreground">{t("store.findYourWay")}</p>
      </div>

      {/* Modern Store Layout */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Interactive Store Layout</span>
            </div>
            <Badge className="bg-green-500 text-white">
              <MapPin className="w-3 h-3 mr-1" />
              You are here
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="relative bg-white rounded-xl border-2 border-slate-200 p-6 aspect-[3/2] overflow-hidden shadow-inner">
            {/* Store sections */}
            {storeSections.map((section) => (
              <div
                key={section.id}
                className={`absolute cursor-pointer transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedSection === section.id 
                    ? 'scale-110 z-10' 
                    : 'hover:scale-105'
                }`}
                style={{ left: `${section.x}%`, top: `${section.y}%` }}
                onClick={() => handleSectionClick(section.id)}
              >
                <div className={`
                  ${section.color} text-white p-4 rounded-lg shadow-lg border-2 border-white
                  ${selectedSection === section.id 
                    ? 'ring-4 ring-primary ring-opacity-50' 
                    : 'hover:shadow-xl'
                  }
                  min-w-[100px] text-center
                `}>
                  <div className="font-bold text-lg">{section.id}</div>
                  <div className="text-xs mt-1 leading-tight opacity-90">
                    {section.name}
                  </div>
                </div>
              </div>
            ))}

            {/* Entrance */}
            <div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg"
            >
              <span className="text-sm font-bold">🚪 Entrance</span>
            </div>

            {/* Checkout */}
            <div 
              className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
            >
              <span className="text-sm font-bold">🛒 Checkout</span>
            </div>

            {/* Current location indicator */}
            <div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded-full shadow-lg animate-pulse"
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Selected Section Info */}
          {selectedSectionData && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-primary text-lg">
                    Section {selectedSectionData.id}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedSectionData.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Estimated walk time: 2-3 minutes</span>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Navigation className="w-4 h-4 mr-2" />
                  {t("customer.takeMeThere")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Directory */}
      <Card>
        <CardHeader>
          <CardTitle>{t("store.aisleDirectory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeSections.map((section) => (
              <Card 
                key={section.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedSection === section.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleSectionClick(section.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-4 h-4 rounded-full ${section.color}`}></div>
                    <Badge variant="outline" className="font-bold">
                      {section.id}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground">{section.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click to view on map
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernStoreMap;