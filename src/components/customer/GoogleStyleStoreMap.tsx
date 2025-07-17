import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Navigation, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GoogleStyleStoreMap = () => {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const storeSections = [
    { id: '2A', name: 'Dairy & Beverages', x: 15, y: 25, width: 25, height: 15, color: 'bg-blue-500' },
    { id: '3A', name: 'Beverages', x: 50, y: 15, width: 20, height: 20, color: 'bg-green-500' },
    { id: '6B', name: 'Snacks & Confectionery', x: 25, y: 55, width: 30, height: 15, color: 'bg-purple-500' },
    { id: '8A', name: 'Personal Care', x: 10, y: 75, width: 25, height: 15, color: 'bg-pink-500' },
    { id: '9A', name: 'Household Items', x: 65, y: 65, width: 25, height: 20, color: 'bg-orange-500' },
  ];

  const facilities = [
    { id: 'entrance', name: 'Entrance', x: 45, y: 92, icon: '🚪' },
    { id: 'checkout', name: 'Checkout', x: 75, y: 45, icon: '💳' },
    { id: 'you', name: 'You are here', x: 50, y: 50, icon: '📍' },
  ];

  const handleSectionClick = (section: any) => {
    setSelectedSection(section.id);
  };

  return (
    <div className="h-full bg-background">
      {/* Google Maps Style Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold">Interactive Store Layout</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-1" />
              Layers
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gray-50 border rounded-lg m-4 overflow-hidden">
        {/* Store Layout */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
        >
          {/* Store sections */}
          {storeSections.map((section) => (
            <g key={section.id}>
              <rect
                x={section.x}
                y={section.y}
                width={section.width}
                height={section.height}
                fill={selectedSection === section.id ? '#3b82f6' : '#ffffff'}
                stroke="#e5e7eb"
                strokeWidth="0.5"
                rx="2"
                className="cursor-pointer transition-all duration-200 hover:fill-blue-100"
                onClick={() => handleSectionClick(section)}
              />
              <text
                x={section.x + section.width / 2}
                y={section.y + section.height / 2 - 2}
                textAnchor="middle"
                fontSize="3"
                fill={selectedSection === section.id ? '#ffffff' : '#374151'}
                className="font-medium pointer-events-none"
              >
                {section.id}
              </text>
              <text
                x={section.x + section.width / 2}
                y={section.y + section.height / 2 + 2}
                textAnchor="middle"
                fontSize="2"
                fill={selectedSection === section.id ? '#ffffff' : '#6b7280'}
                className="pointer-events-none"
              >
                {section.name.split(' ')[0]}
              </text>
            </g>
          ))}

          {/* Facilities */}
          {facilities.map((facility) => (
            <g key={facility.id}>
              <circle
                cx={facility.x}
                cy={facility.y}
                r="3"
                fill={facility.id === 'you' ? '#10b981' : '#6366f1'}
                stroke="#ffffff"
                strokeWidth="0.5"
              />
              <text
                x={facility.x}
                y={facility.y + 6}
                textAnchor="middle"
                fontSize="2.5"
                fill="#374151"
                className="font-medium"
              >
                {facility.name}
              </text>
            </g>
          ))}

          {/* You are here indicator */}
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            className="animate-pulse"
          />
        </svg>

        {/* You are here badge - positioned like Google Maps */}
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          You are here
        </div>
      </div>

      {/* Section Details */}
      {selectedSection && (
        <Card className="m-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  Section {selectedSection}
                </h3>
                <p className="text-muted-foreground">
                  {storeSections.find(s => s.id === selectedSection)?.name}
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="m-4 p-4 bg-white rounded-lg border">
        <h4 className="font-medium mb-3">Store Sections</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {storeSections.map((section) => (
            <div key={section.id} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${section.color.replace('bg-', 'bg-opacity-80 bg-')}`}></div>
              <span className="text-sm">{section.id} - {section.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleStyleStoreMap;