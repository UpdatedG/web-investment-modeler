
import React from 'react';
import { User } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AgeDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const AgeDial: React.FC<AgeDialProps> = ({ value, onChange }) => {
  const minAge = 18;
  const maxAge = 80;

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Amžius</p>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
        <p className="text-sm text-gray-500">metų</p>
      </div>
      
      <div className="w-48 space-y-4">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={minAge}
          max={maxAge}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{minAge}</span>
          <span>{maxAge}</span>
        </div>
      </div>
    </div>
  );
};
