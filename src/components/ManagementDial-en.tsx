
import React from 'react';
import { Clock, Settings, Wrench } from 'lucide-react';

interface ManagementDialEnProps {
  value: number;
  onChange: (value: number) => void;
}

export const ManagementDialEn: React.FC<ManagementDialEnProps> = ({ value, onChange }) => {
  const managementLevels = [
    { level: 0, label: 'Passive management', description: 'Check rarely', icon: Clock, color: 'text-green-600', bg: 'bg-green-100' },
    { level: 1, label: 'Medium management', description: 'Check monthly', icon: Settings, color: 'text-blue-600', bg: 'bg-blue-100' },
    { level: 2, label: 'Active management', description: 'Monitor constantly', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${managementLevels[value].bg} mb-2`}>
          {React.createElement(managementLevels[value].icon, { 
            className: `h-8 w-8 ${managementLevels[value].color}` 
          })}
        </div>
        <p className="text-lg font-semibold text-gray-800">{managementLevels[value].label}</p>
        <p className="text-sm text-gray-600">{managementLevels[value].description}</p>
      </div>
      
      <div className="space-y-3">
        {managementLevels.map((mgmt) => (
          <button
            key={mgmt.level}
            type="button"
            onClick={() => onChange(mgmt.level)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              value === mgmt.level
                ? `border-gray-400 ${mgmt.bg} shadow-md`
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              {React.createElement(mgmt.icon, { 
                className: `h-6 w-6 ${value === mgmt.level ? mgmt.color : 'text-gray-400'}` 
              })}
              <div className="text-left">
                <p className={`font-medium ${
                  value === mgmt.level ? 'text-gray-800' : 'text-gray-600'
                }`}>
                  {mgmt.label}
                </p>
                <p className={`text-sm ${
                  value === mgmt.level ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {mgmt.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
