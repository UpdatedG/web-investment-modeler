
import React from 'react';
import { Shield, TrendingUp, Zap, Flame, Rocket, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RiskDialEnProps {
  value: number;
  onChange: (value: number) => void;
  age?: number;
  familySituation?: string;
}

export const RiskDialEn: React.FC<RiskDialEnProps> = ({ value, onChange, age, familySituation }) => {
  // Function to determine risk recommendation based on age and family situation
  const getRiskRecommendation = React.useCallback((riskLevel: number): 'acceptable' | 'risky' | 'not-recommended' => {
    console.log(`Checking risk level ${riskLevel}, age: ${age}, family: ${familySituation}`);
    
    if (!age || !familySituation) return 'acceptable';

    // Map family situation values to the table format
    const isMarriedWithKids = familySituation === 'family';
    const isMarriedNoKids = familySituation === 'couple';
    const isSingle = familySituation === 'single' || familySituation === 'single-parent';

    // Define risk level mappings (0=Minimal, 1=Low, 2=Medium, 3=Higher, 4=High, 5=Ultra)
    let maxAcceptableRisk = 5; // Default: all levels acceptable
    let maxRiskyLevel = 5; // Level that's risky but not forbidden

    if (age < 30) {
      if (isMarriedWithKids) {
        maxAcceptableRisk = 4; // Up to High
        maxRiskyLevel = 5; // Ultra is risky
      } else {
        maxAcceptableRisk = 5; // All levels acceptable
        maxRiskyLevel = 5;
      }
    } else if (age >= 30 && age < 40) {
      if (isSingle) {
        maxAcceptableRisk = 5; // All levels acceptable
        maxRiskyLevel = 5;
      } else if (isMarriedNoKids) {
        maxAcceptableRisk = 4; // Up to High
        maxRiskyLevel = 5; // Ultra is risky
      } else if (isMarriedWithKids) {
        maxAcceptableRisk = 2; // Up to Medium
        maxRiskyLevel = 3; // Higher is risky
      }
    } else if (age >= 40 && age < 50) {
      if (isSingle) {
        maxAcceptableRisk = 4; // Up to High
        maxRiskyLevel = 5; // Ultra is risky
      } else if (isMarriedNoKids) {
        maxAcceptableRisk = 2; // Up to Medium
        maxRiskyLevel = 3; // Higher is risky
      } else if (isMarriedWithKids) {
        maxAcceptableRisk = 1; // Up to Low
        maxRiskyLevel = 2; // Medium is risky
      }
    } else if (age >= 50 && age < 60) {
      maxAcceptableRisk = 2; // Up to Medium
      maxRiskyLevel = 3; // Higher is risky
    } else if (age >= 60) {
      maxAcceptableRisk = 1; // Up to Low
      maxRiskyLevel = 2; // Medium is risky
    }

    console.log(`Age ${age}, family ${familySituation}, maxAcceptable: ${maxAcceptableRisk}, maxRisky: ${maxRiskyLevel}`);

    if (riskLevel <= maxAcceptableRisk) {
      return 'acceptable';
    } else if (riskLevel <= maxRiskyLevel) {
      return 'risky';
    } else {
      return 'not-recommended';
    }
  }, [age, familySituation]);

  const riskLevels = [
    { level: 0, label: 'Minimal risk', icon: Shield, color: 'text-green-600', bg: 'bg-green-100' },
    { level: 1, label: 'Low risk', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { level: 2, label: 'Medium risk', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { level: 3, label: 'Higher risk', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100' },
    { level: 4, label: 'High risk', icon: Rocket, color: 'text-red-600', bg: 'bg-red-100' },
    { level: 5, label: 'Ultra risk', icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  const getButtonStyles = (risk: any) => {
    const recommendation = getRiskRecommendation(risk.level);
    const isSelected = value === risk.level;

    console.log(`Risk level ${risk.level}, recommendation: ${recommendation}, isSelected: ${isSelected}`);

    // Base styles
    let classes = 'p-3 rounded-lg border-2 transition-all duration-200';
    
    // Apply color coding based on recommendation
    if (recommendation === 'not-recommended') {
      if (isSelected) {
        classes += ' border-red-500 bg-red-200 text-red-800';
      } else {
        classes += ' border-red-400 bg-red-100 hover:border-red-500 hover:bg-red-200';
      }
    } else if (recommendation === 'risky') {
      if (isSelected) {
        classes += ' border-yellow-500 bg-yellow-200 text-yellow-800';
      } else {
        classes += ' border-yellow-400 bg-yellow-100 hover:border-yellow-500 hover:bg-yellow-200';
      }
    } else {
      // Acceptable risk - use normal colors
      if (isSelected) {
        classes += ` border-gray-400 ${risk.bg}`;
      } else {
        classes += ' border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm';
      }
    }

    return classes;
  };

  const getTooltipText = (riskLevel: number) => {
    const recommendation = getRiskRecommendation(riskLevel);
    if (recommendation === 'not-recommended') {
      return 'Given your age and family situation, this investment model is not recommended';
    } else if (recommendation === 'risky') {
      return 'Given your age and family situation, this investment model is risky';
    }
    return null;
  };

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
      
      <TooltipProvider>
        <div className="grid grid-cols-3 gap-3">
          {riskLevels.map((risk) => {
            const tooltipText = getTooltipText(risk.level);
            
            const ButtonContent = (
              <button
                key={risk.level}
                type="button"
                onClick={() => onChange(risk.level)}
                className={getButtonStyles(risk)}
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
            );

            if (tooltipText) {
              return (
                <Tooltip key={risk.level}>
                  <TooltipTrigger asChild>
                    {ButtonContent}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-center">{tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return ButtonContent;
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};
