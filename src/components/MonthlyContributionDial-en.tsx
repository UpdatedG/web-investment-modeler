
import React from 'react';
import { PiggyBank } from 'lucide-react';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';

interface MonthlyContributionDialEnProps {
  value: number;
  onChange: (value: number) => void;
}

export const MonthlyContributionDialEn: React.FC<MonthlyContributionDialEnProps> = ({ value, onChange }) => {
  const minContribution = 0;
  const maxContribution = 10000;
  
  // Convert exponential value to linear slider position (0-100)
  const valueToSlider = (val: number): number => {
    if (val === 0) return 0;
    const logMin = Math.log(10); // Start from 10 for log calculation
    const logMax = Math.log(maxContribution);
    const logVal = Math.log(Math.max(val, 10));
    return ((logVal - logMin) / (logMax - logMin)) * 100;
  };

  // Convert linear slider position to exponential value
  const sliderToValue = (sliderPos: number): number => {
    if (sliderPos === 0) return 0;
    const logMin = Math.log(10);
    const logMax = Math.log(maxContribution);
    const logVal = logMin + (sliderPos / 100) * (logMax - logMin);
    const result = Math.exp(logVal);
    // Round to nearest 25
    return Math.round(result / 25) * 25;
  };

  const currentSliderValue = valueToSlider(value);

  const handleSliderChange = (values: number[]) => {
    const newValue = sliderToValue(values[0]);
    onChange(newValue);
  };

  const formatContribution = (amount: number) => {
    if (amount >= 1000) return `€${(amount/1000).toFixed(1)}k`;
    return `€${amount}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
          <PiggyBank className="h-6 w-6 text-purple-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Monthly Contribution</p>
        <p className="text-3xl font-bold text-purple-600">{formatContribution(value)}</p>
        <p className="text-sm text-gray-500">per month</p>
      </div>
      
      <div className="w-48 space-y-4">
        <EnhancedSlider
          value={[currentSliderValue]}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={0.1}
          colorScheme="purple"
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatContribution(minContribution)}</span>
          <span>{formatContribution(maxContribution)}</span>
        </div>
      </div>
    </div>
  );
};
