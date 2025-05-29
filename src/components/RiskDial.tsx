
import React from 'react';
import { Shield, TrendingUp, Zap, Flame, Rocket, Star } from 'lucide-react';

interface RiskDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const RiskDial: React.FC<RiskDialProps> = ({ value, onChange }) => {
  const riskLevels = [
    { level: 0, label: 'Minimali rizika', icon: Shield, color: 'text-green-600', bg: 'bg-green-100' },
    { level: 1, label: 'Maža rizika', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { level: 2, label: 'Vidutinė rizika', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { level: 3, label: 'Didesnė rizika', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100' },
    { level: 4, label: 'Didelė rizika', icon: Rocket, color: 'text-red-600', bg: 'bg-red-100' },
    { level: 5, label: 'Ultra rizika', icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${riskLevels[value].bg} mb-2`}>
          {React.createElement(riskLevels[value].icon, { 
            className: `h-8 w-8 ${riskLevels[value].color}` 
          })}
        </div>
        <p className="text-lg font-semibold text-gray-800">{riskLevels[value].label}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {riskLevels.map((risk) => (
          <button
            key={risk.level}
            type="button"
            onClick={() => onChange(risk.level)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              value === risk.level
                ? `border-gray-400 ${risk.bg} shadow-md`
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              {React.createElement(risk.icon, { 
                className: `h-5 w-5 ${value === risk.level ? risk.color : 'text-gray-400'}` 
              })}
              <span className={`text-xs font-medium ${
                value === risk.level ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {risk.label.split(' ')[0]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
