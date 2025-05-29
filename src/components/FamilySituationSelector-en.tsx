
import React from 'react';
import { User, Users, Baby, Heart } from 'lucide-react';

interface FamilySituationSelectorEnProps {
  value: string;
  onChange: (value: string) => void;
}

export const FamilySituationSelectorEn: React.FC<FamilySituationSelectorEnProps> = ({ value, onChange }) => {
  const familyOptions = [
    { 
      value: 'single', 
      label: 'Single', 
      icon: User, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      hoverBg: 'hover:bg-blue-200'
    },
    { 
      value: 'couple', 
      label: 'Couple without kids', 
      icon: Heart, 
      color: 'text-pink-600', 
      bg: 'bg-pink-100',
      hoverBg: 'hover:bg-pink-200'
    },
    { 
      value: 'family', 
      label: 'Family with kids', 
      icon: Users, 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      hoverBg: 'hover:bg-green-200'
    },
    { 
      value: 'single-parent', 
      label: 'Single parent', 
      icon: Baby, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100',
      hoverBg: 'hover:bg-orange-200'
    }
  ];

  const selectedOption = familyOptions.find(option => option.value === value);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        {selectedOption && (
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${selectedOption.bg} mb-2`}>
            {React.createElement(selectedOption.icon, { 
              className: `h-8 w-8 ${selectedOption.color}` 
            })}
          </div>
        )}
        <p className="text-lg font-semibold text-gray-800">Family Situation</p>
        {selectedOption && (
          <p className="text-sm text-gray-600">{selectedOption.label}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {familyOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              value === option.value
                ? `border-gray-400 ${option.bg} shadow-md`
                : `border-gray-200 bg-white ${option.hoverBg} hover:border-gray-300 hover:shadow-sm`
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              {React.createElement(option.icon, { 
                className: `h-6 w-6 ${value === option.value ? option.color : 'text-gray-400'}` 
              })}
              <span className={`text-xs font-medium text-center ${
                value === option.value ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {option.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
