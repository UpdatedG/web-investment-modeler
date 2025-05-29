
import React from 'react';
import { Euro } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface InitialSumDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const InitialSumDial: React.FC<InitialSumDialProps> = ({ value, onChange }) => {
  const minSum = 500;
  const maxSum = 50000;
  const step = 500;

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const formatSum = (sum: number) => {
    if (sum >= 1000000) return `€${(sum/1000000).toFixed(1)}M`;
    if (sum >= 1000) return `€${(sum/1000).toFixed(0)}k`;
    return `€${sum}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Pradinė suma</p>
        <p className="text-3xl font-bold text-green-600">{formatSum(value)}</p>
        <p className="text-sm text-gray-500">{formatSum(minSum)} - {formatSum(maxSum)}</p>
      </div>
      
      <div className="w-48 space-y-4">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={minSum}
          max={maxSum}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatSum(minSum)}</span>
          <span>{formatSum(maxSum)}</span>
        </div>
      </div>
    </div>
  );
};
