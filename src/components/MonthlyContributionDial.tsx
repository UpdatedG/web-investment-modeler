
import React from 'react';
import { PiggyBank } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface MonthlyContributionDialProps {
  value: number;
  onChange: (value: number) => void;
}

export const MonthlyContributionDial: React.FC<MonthlyContributionDialProps> = ({ value, onChange }) => {
  const minContribution = 0;
  const maxContribution = 2000;
  const step = 25;

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
          <PiggyBank className="h-6 w-6 text-purple-600" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Mėnesinis įnašas</p>
        <p className="text-3xl font-bold text-purple-600">€{value}</p>
        <p className="text-sm text-gray-500">per mėnesį</p>
      </div>
      
      <div className="w-48 space-y-4">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={minContribution}
          max={maxContribution}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>€{minContribution}</span>
          <span>€{maxContribution}</span>
        </div>
      </div>
    </div>
  );
};
