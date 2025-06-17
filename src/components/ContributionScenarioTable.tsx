import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Pause, Zap } from 'lucide-react';
import type { InvestmentInputs } from '@/pages/Index';
import { calculateDetailedProjections } from '@/utils/portfolioCalculator';

interface ContributionScenarioTableProps {
  inputs: InvestmentInputs;
  period: number;
  baselineValue: number;
  isEnglish?: boolean;
}

export const ContributionScenarioTable: React.FC<ContributionScenarioTableProps> = ({ 
  inputs, 
  period, 
  baselineValue,
  isEnglish = false 
}) => {
  const formatCurrency = (value: number) => `€${Math.round(value).toLocaleString()}`;
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  // Calculate scenarios using proper portfolio calculations
  const calculateScenario = (stopYear: number | null, multiplier: number = 1) => {
    // Skip scenarios where stopYear >= period (doesn't make sense)
    if (stopYear && stopYear >= period) {
      return null;
    }
    
    // Get the baseline projection data that's already calculated
    const { projectionData: baselineProjection } = calculateDetailedProjections(inputs, period, isEnglish ? 'en' : 'lt');
    
    let finalValue: number;
    let totalContributions: number;
    let growth: number;
    
    if (stopYear) {
      // For stop scenarios: Use baseline market performance but stop contributions
      const stopYearData = baselineProjection[stopYear];
      
      // Safety check
      if (!stopYearData) {
        return null;
      }
      
      // Calculate what the portfolio would be worth at stop year with baseline performance
      const stopYearValue = stopYearData.value;
      const stopYearContributions = inputs.initialSum + (inputs.monthlyContribution * 12 * stopYear);
      
      // Extract the growth rate from baseline performance for remaining years
      const remainingYears = period - stopYear;
      if (remainingYears > 0) {
        // Calculate average annual portfolio growth rate from baseline
        const finalBaselineValue = baselineProjection[baselineProjection.length - 1].value;
        const totalBaselineContributions = inputs.initialSum + (inputs.monthlyContribution * 12 * period);
        const portfolioGrowthRate = Math.pow(finalBaselineValue / totalBaselineContributions, 1 / period) - 1;
        
        // Apply this growth rate to the stopped portfolio (no new contributions)
        finalValue = stopYearValue * Math.pow(1 + portfolioGrowthRate, remainingYears);
      } else {
        finalValue = stopYearValue;
      }
      
      totalContributions = stopYearContributions;
      growth = finalValue - totalContributions;
    } else {
      // For double contributions: Scale the baseline results proportionally
      if (multiplier === 2) {
        // Double contributions means roughly double the final value (simplified)
        // Use baseline growth pattern but with doubled contribution impact
        const baselineFinalValue = baselineProjection[baselineProjection.length - 1].value;
        const baselineContributions = inputs.initialSum + (inputs.monthlyContribution * 12 * period);
        const baselineGrowth = baselineFinalValue - baselineContributions;
        
        // Double the contributions, keep the same growth rate on the larger base
        totalContributions = inputs.initialSum + (inputs.monthlyContribution * 2 * 12 * period);
        const additionalContributions = inputs.monthlyContribution * 12 * period;
        
        // Apply the same growth rate to the larger contribution base
        const growthRate = baselineGrowth / baselineContributions;
        finalValue = totalContributions * (1 + growthRate);
        growth = finalValue - totalContributions;
      } else {
        // Baseline scenario - use existing data
        const baselineData = baselineProjection[baselineProjection.length - 1];
        finalValue = baselineData.value;
        totalContributions = inputs.initialSum + (inputs.monthlyContribution * 12 * period);
        growth = finalValue - totalContributions;
      }
    }
    
    return {
      finalValue,
      totalContributions,
      growth,
      differenceFromBaseline: finalValue - baselineValue,
      percentageDifference: ((finalValue - baselineValue) / baselineValue) * 100
    };
  };

  // Create scenarios dynamically based on period
  const possibleScenarios = [
    {
      id: 'stop1',
      name: isEnglish ? 'Stop after 1 year' : 'Sustabdyti po 1 metų',
      icon: <Pause className="h-4 w-4 text-red-500" />,
      description: isEnglish ? 'No more contributions after year 1' : 'Daugiau nebeįmokėti po 1 metų',
      stopYear: 1
    },
    {
      id: 'stop3',
      name: isEnglish ? 'Stop after 3 years' : 'Sustabdyti po 3 metų',
      icon: <Pause className="h-4 w-4 text-orange-500" />,
      description: isEnglish ? 'No more contributions after year 3' : 'Daugiau nebeįmokėti po 3 metų',
      stopYear: 3
    },
    {
      id: 'stop10',
      name: isEnglish ? 'Stop after 10 years' : 'Sustabdyti po 10 metų',
      icon: <Pause className="h-4 w-4 text-yellow-500" />,
      description: isEnglish ? 'No more contributions after year 10' : 'Daugiau nebeįmokėti po 10 metų',
      stopYear: 10
    }
  ];

  // Filter scenarios that make sense for the selected period and calculate their values
  const scenarios = [
    ...possibleScenarios
      .filter(scenario => scenario.stopYear < period)
      .map(scenario => {
        const calculation = calculateScenario(scenario.stopYear);
        return calculation ? { ...scenario, ...calculation } : null;
      })
      .filter(Boolean),
    {
      id: 'baseline',
      name: isEnglish ? 'Current plan' : 'Dabartinis planas',
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      description: isEnglish ? 'Continue as planned' : 'Tęsti kaip suplanuota',
      finalValue: baselineValue,
      totalContributions: inputs.initialSum + (inputs.monthlyContribution * 12 * period),
      growth: baselineValue - (inputs.initialSum + (inputs.monthlyContribution * 12 * period)),
      differenceFromBaseline: 0,
      percentageDifference: 0
    }
  ];

  // Add doubling scenario with error handling
  const doublingCalculation = calculateScenario(null, 2);
  if (doublingCalculation) {
    scenarios.push({
      id: 'double',
      name: isEnglish ? 'Double contributions' : 'Dvigubos įmokos',
      icon: <Zap className="h-4 w-4 text-green-500" />,
      description: isEnglish ? 'Double monthly contributions' : 'Dvigubinti mėnesines įmokas',
      ...doublingCalculation
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEnglish ? 'Contribution Scenario Analysis' : 'Įmokų scenarijų analizė'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEnglish ? 'Scenario' : 'Scenarijus'}</TableHead>
                <TableHead>{isEnglish ? 'Final Value' : 'Galutinė vertė'}</TableHead>
                <TableHead>{isEnglish ? 'Total Contributions' : 'Bendros įmokos'}</TableHead>
                <TableHead>{isEnglish ? 'Investment Growth' : 'Investicijų augimas'}</TableHead>
                <TableHead>{isEnglish ? 'vs. Current Plan' : 'vs. dabartinis planas'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow 
                  key={scenario.id}
                  className={
                    scenario.id === 'baseline' ? 'bg-blue-50 border-blue-200' :
                    scenario.id === 'double' ? 'bg-green-50' :
                    'bg-gray-50'
                  }
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {scenario.icon}
                      <div>
                        <p className="font-medium">{scenario.name}</p>
                        <p className="text-xs text-gray-600">{scenario.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(scenario.finalValue)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(scenario.totalContributions)}
                  </TableCell>
                  <TableCell className={scenario.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(scenario.growth)}
                  </TableCell>
                  <TableCell>
                    {scenario.id === 'baseline' ? (
                      <span className="text-blue-600 font-medium">
                        {isEnglish ? 'Baseline' : 'Bazinis'}
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        <span className={
                          scenario.differenceFromBaseline > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                        }>
                          {scenario.differenceFromBaseline > 0 ? '+' : ''}{formatCurrency(scenario.differenceFromBaseline)}
                        </span>
                        <span className={`text-xs ${
                          scenario.percentageDifference > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(scenario.percentageDifference)}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">
              {isEnglish ? 'Key Insights:' : 'Pagrindinės įžvalgos:'}
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>
                  {isEnglish 
                    ? 'Stopping contributions early significantly reduces final value due to lost compound growth.'
                    : 'Ankstyvas įmokų sustabdymas žymiai sumažina galutinę vertę dėl prarastos sudėtinio augimo galios.'
                  }
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>
                  {isEnglish 
                    ? 'Doubling contributions can dramatically increase your final portfolio value.'
                    : 'Įmokų padvigubinimas gali drastiškai padidinti galutinę portfelio vertę.'
                  }
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  {isEnglish 
                    ? 'Consistency in contributions is key to long-term wealth building.'
                    : 'Nuoseklumas įmokose yra raktinis ilgalaikio turto kaupimo veiksnys.'
                  }
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">
              {isEnglish ? 'Assumptions:' : 'Prielaidos:'}
            </h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• {isEnglish ? `Uses same market conditions as baseline projection` : `Naudoja tas pačias rinkos sąlygas kaip bazinė projekcija`}</li>
              <li>• {isEnglish ? 'Stop scenarios apply baseline growth rate to stopped portfolio' : 'Sustabdymo scenarijai taiko bazinį augimo tempą sustabdytam portfeliui'}</li>
              <li>• {isEnglish ? 'Double contributions scale proportionally with same growth patterns' : 'Dvigubos įmokos proporcingai didėja su tais pačiais augimo šablonais'}</li>
              <li>• {isEnglish ? 'No fees or taxes included' : 'Mokesčiai ir komisiniai neįtraukti'}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 