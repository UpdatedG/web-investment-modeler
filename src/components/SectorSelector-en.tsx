
import React from 'react';
import { Briefcase, Cpu, HeartHandshake, Zap, Car, Home } from 'lucide-react';

interface SectorSelectorEnProps {
  value: string;
  onChange: (value: string) => void;
}

export const SectorSelectorEn: React.FC<SectorSelectorEnProps> = ({ value, onChange }) => {
  const sectors = [
    { 
      id: 'general', 
      label: 'General', 
      description: 'All sectors',
      icon: Briefcase, 
      color: 'text-gray-600', 
      bg: 'bg-gray-100' 
    },
    { 
      id: 'technology', 
      label: 'Technology', 
      description: 'IT, AI, software',
      icon: Cpu, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      id: 'healthcare', 
      label: 'Healthcare', 
      description: 'Pharma, biotech',
      icon: HeartHandshake, 
      color: 'text-red-600', 
      bg: 'bg-red-100' 
    },
    { 
      id: 'energy', 
      label: 'Energy', 
      description: 'Renewable energy',
      icon: Zap, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100' 
    },
    { 
      id: 'automotive', 
      label: 'Automotive', 
      description: 'Electric vehicles',
      icon: Car, 
      color: 'text-green-600', 
      bg: 'bg-green-100' 
    },
    { 
      id: 'realestate', 
      label: 'Real Estate', 
      description: 'REIT funds',
      icon: Home, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100' 
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {sectors.map((sector) => (
        <button
          key={sector.id}
          type="button"
          onClick={() => onChange(sector.id)}
          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
            value === sector.id
              ? `border-gray-400 ${sector.bg} shadow-md`
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            {React.createElement(sector.icon, { 
              className: `h-6 w-6 ${value === sector.id ? sector.color : 'text-gray-400'}` 
            })}
            <div className="text-center">
              <p className={`text-sm font-medium ${
                value === sector.id ? 'text-gray-800' : 'text-gray-600'
              }`}>
                {sector.label}
              </p>
              <p className={`text-xs ${
                value === sector.id ? 'text-gray-600' : 'text-gray-500'
              }`}>
                {sector.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
