
import React from 'react';
import { Globe, MapPin, Building } from 'lucide-react';

interface GeographySelectorEnProps {
  value: string;
  onChange: (value: string) => void;
}

export const GeographySelectorEn: React.FC<GeographySelectorEnProps> = ({ value, onChange }) => {
  const geographies = [
    { 
      id: 'global', 
      label: 'Global markets', 
      description: 'World markets',
      icon: Globe, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      id: 'europe', 
      label: 'European markets', 
      description: 'EU countries',
      icon: MapPin, 
      color: 'text-green-600', 
      bg: 'bg-green-100' 
    },
    { 
      id: 'emerging', 
      label: 'Emerging markets', 
      description: 'Growing economies',
      icon: Building, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100' 
    }
  ];

  return (
    <div className="space-y-3">
      {geographies.map((geo) => (
        <button
          key={geo.id}
          type="button"
          onClick={() => onChange(geo.id)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
            value === geo.id
              ? `border-gray-400 ${geo.bg} shadow-md`
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center space-x-3">
            {React.createElement(geo.icon, { 
              className: `h-6 w-6 ${value === geo.id ? geo.color : 'text-gray-400'}` 
            })}
            <div className="text-left">
              <p className={`font-medium ${
                value === geo.id ? 'text-gray-800' : 'text-gray-600'
              }`}>
                {geo.label}
              </p>
              <p className={`text-sm ${
                value === geo.id ? 'text-gray-600' : 'text-gray-500'
              }`}>
                {geo.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
