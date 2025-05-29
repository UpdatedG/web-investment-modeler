
import React from 'react';
import { Euro } from 'lucide-react';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';

interface InitialSumDialEnProps {
  value: number;
  onChange: (value: number) => void;
}

export const InitialSumDialEn: React.FC<InitialSumDialEnProps> = ({ value, onChange }) => {
  const minSum = 500;
  const maxSum = 1000000;
  
  // Convert exponential value to linear slider position (0-100)
  const valueToSlider = (val: number): number => {
    const logMin = Math.log(minSum);
    const logMax = Math.log(maxSum);
    const logVal = Math.log(val);
    return ((logVal - logMin) / (logMax - logMin)) * 100;
  };

  // Convert linear slider position to exponential value
  const sliderToValue = (sliderPos: number): number => {
    const logMin = Math.log(minSum);
    const logMax = Math.log(maxSum);
    const logVal = logMin + (sliderPos / 100) * (logMax - logMin);
    const result = Math.exp(logVal);
    // Round to nearest sensible increment
    if (result < 5000) return Math.round(result / 100) * 100;
    if (result < 50000) return Math.round(result / 500) * 500;
    return Math.round(result / 5000) * 5000;
  };

  const currentSliderValue = valueToSlider(value);

  const handleSliderChange = (values: number[]) => {
    const newValue = sliderToValue(values[0]);
    onChange(newValue);
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
        <p className="text-lg font-semibold text-gray-800">Initial Amount</p>
        <p className="text-3xl font-bold text-green-600">{formatSum(value)}</p>
        <p className="text-sm text-gray-500">initial investment</p>
      </div>
      
      <div className="w-48 space-y-4">
        <EnhancedSlider
          value={[currentSliderValue]}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={0.1}
          colorScheme="green"
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
