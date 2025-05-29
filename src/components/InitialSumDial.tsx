
import React from 'react';
import { Euro } from 'lucide-react';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';

interface InitialSumDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const InitialSumDial: React.FC<InitialSumDialProps> = ({ value, onChange }) => {
  // Smart scaling system: exponential growth for larger amounts
  const minSum = 500;
  const maxSliderValue = 100;
  
  // Convert actual value to slider position (0-100)
  const valueToSlider = (actualValue: number): number => {
    if (actualValue <= 10000) {
      // Linear scaling for first 10k (0-50 on slider)
      return (actualValue - minSum) / (10000 - minSum) * 50;
    } else {
      // Exponential scaling for 10k-1M (50-100 on slider)
      const logValue = Math.log(actualValue - 9500) / Math.log(990500) * 50 + 50;
      return Math.min(100, logValue);
    }
  };

  // Convert slider position to actual value
  const sliderToValue = (sliderPos: number): number => {
    if (sliderPos <= 50) {
      // Linear scaling for first half (500-10k)
      return minSum + (sliderPos / 50) * (10000 - minSum);
    } else {
      // Exponential scaling for second half (10k-1M)
      const expValue = Math.pow(990500, (sliderPos - 50) / 50) + 9500;
      return Math.round(expValue / 500) * 500; // Round to nearest 500
    }
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

  const getMaxDisplayValue = () => {
    return sliderToValue(100);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Pradinė suma</p>
        <p className="text-3xl font-bold text-green-600">{formatSum(value)}</p>
        <p className="text-sm text-gray-500">{formatSum(minSum)} - {formatSum(getMaxDisplayValue())}</p>
      </div>
      
      <div className="w-48 space-y-4">
        <EnhancedSlider
          value={[currentSliderValue]}
          onValueChange={handleSliderChange}
          min={0}
          max={maxSliderValue}
          step={0.1}
          colorScheme="green"
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatSum(minSum)}</span>
          <span>{formatSum(getMaxDisplayValue())}</span>
        </div>
        <div className="text-center text-xs text-gray-400">
          Smart scaling: linear up to €10k, then exponential
        </div>
      </div>
    </div>
  );
};
