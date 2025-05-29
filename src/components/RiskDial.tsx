
import React from 'react';
import { Shield, TrendingUp, Zap, Flame, Rocket, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RiskDialProps {
  value: number;
  onChange: (value: number) => void;
  age?: number;
  familySituation?: string;
}

export const RiskDial: React.FC<RiskDialProps> = ({ value, onChange, age, familySituation }) => {
  const riskLevels = [
    { level: 0, label: 'Minimali rizika', icon: Shield, color: 'text-green-600', bg: 'bg-green-100' },
    { level: 1, label: 'Maža rizika', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { level: 2, label: 'Vidutinė rizika', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { level: 3, label: 'Didesnė rizika', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100' },
    { level: 4, label: 'Didelė rizika', icon: Rocket, color: 'text-red-600', bg: 'bg-red-100' },
    { level: 5, label: 'Ultra rizika', icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  // Function to determine risk recommendation based on age and family situation
  const getRiskRecommendation = (riskLevel: number): 'acceptable' | 'risky' | 'not-recommended' => {
    if (!age || !familySituation) return 'acceptable';

    // Map family situation values to the table format
    const isMarriedWithKids = familySituation === 'family';
    const isMarriedNoKids = familySituation === 'couple';
    const isSingle = familySituation === 'single' || familySituation === 'single-parent';

    // Define risk level mappings (0=Minimali, 1=Maža, 2=Vidutinė, 3=Didesnė, 4=Didelė, 5=Ultra)
    let maxAcceptableRisk = 5; // Default: all levels acceptable
    let maxRiskyLevel = 5; // Level that's risky but not forbidden

    if (age < 30) {
      if (isMarriedWithKids) {
        maxAcceptableRisk = 4; // Up to Didelė
        maxRiskyLevel = 4;
      } else {
        maxAcceptableRisk = 5; // All levels acceptable
        maxRiskyLevel = 5;
      }
    } else if (age >= 30 && age < 40) {
      if (isSingle) {
        maxAcceptableRisk = 5; // All levels acceptable
        maxRiskyLevel = 5;
      } else if (isMarriedNoKids) {
        maxAcceptableRisk = 4; // Up to Didelė
        maxRiskyLevel = 4;
      } else if (isMarriedWithKids) {
        maxAcceptableRisk = 2; // Up to Vidutinė
        maxRiskyLevel = 3; // Didesnė is risky
      }
    } else if (age >= 40 && age < 50) {
      if (isSingle) {
        maxAcceptableRisk = 4; // Up to Didelė
        maxRiskyLevel = 4;
      } else if (isMarriedNoKids) {
        maxAcceptableRisk = 2; // Up to Vidutinė
        maxRiskyLevel = 3; // Didesnė is risky
      } else if (isMarriedWithKids) {
        maxAcceptableRisk = 1; // Up to Maža
        maxRiskyLevel = 2; // Vidutinė is risky
      }
    } else if (age >= 50 && age < 60) {
      maxAcceptableRisk = 2; // Up to Vidutinė
      maxRiskyLevel = 3; // Didesnė is risky
    } else if (age >= 60) {
      maxAcceptableRisk = 1; // Up to Maža
      maxRiskyLevel = 2; // Vidutinė is risky
    }

    if (riskLevel <= maxAcceptableRisk) {
      return 'acceptable';
    } else if (riskLevel <= maxRiskyLevel) {
      return 'risky';
    } else {
      return 'not-recommended';
    }
  };

  const getButtonStyles = (risk: any) => {
    const recommendation = getRiskRecommendation(risk.level);
    const isSelected = value === risk.level;

    let borderColor = 'border-gray-200';
    let bgColor = 'bg-white';
    let hoverBg = 'hover:border-gray-300 hover:shadow-sm';

    if (isSelected) {
      borderColor = 'border-gray-400';
      bgColor = risk.bg;
    }

    // Apply color coding based on recommendation
    if (recommendation === 'not-recommended') {
      borderColor = isSelected ? 'border-red-500' : 'border-red-300';
      bgColor = isSelected ? 'bg-red-100' : 'bg-red-50';
      hoverBg = 'hover:border-red-400';
    } else if (recommendation === 'risky') {
      borderColor = isSelected ? 'border-yellow-500' : 'border-yellow-300';
      bgColor = isSelected ? 'bg-yellow-100' : 'bg-yellow-50';
      hoverBg = 'hover:border-yellow-400';
    }

    return `p-3 rounded-lg border-2 transition-all duration-200 ${borderColor} ${bgColor} ${hoverBg}`;
  };

  const getTooltipText = (riskLevel: number) => {
    const recommendation = getRiskRecommendation(riskLevel);
    if (recommendation === 'not-recommended') {
      return 'Atsižvelgiant į jūsų amžių ir šeimyninę padėtį šis investavimo modelis nerekomenduojamas';
    } else if (recommendation === 'risky') {
      return 'Atsižvelgiant į jūsų amžių ir šeimyninę padėtį šis investavimo modelis yra rizikingas';
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
