
import React from 'react';
import { Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface TimeHorizonDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const TimeHorizonDial: React.FC<TimeHorizonDialProps> = ({ value, onChange }) => {
  const minYears = 1;
  const maxYears = 50;

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-2">
          <Clock className="h-6 w-6 text-orange-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Investavimo laikotarpis</p>
        <p className="text-3xl font-bold text-orange-600">{value}</p>
        <p className="text-sm text-gray-500">{value === 1 ? 'metai' : 'metų'}</p>
      </div>
      
      <div className="w-48 space-y-4">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={minYears}
          max={maxYears}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{minYears}</span>
          <span>{maxYears}</span>
        </div>
      </div>
    </div>
  );
};
