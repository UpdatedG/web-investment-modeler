
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { PortfolioChart } from '@/components/PortfolioChart';
import { PortfolioBreakdown } from '@/components/PortfolioBreakdown';
import { CalculationsDebugTable } from '@/components/CalculationsDebugTable';
import { calculatePortfolio, calculateDetailedProjections } from '@/utils/portfolioCalculator';
import { AlertTriangle, ArrowLeft, TrendingUp, Calculator, MessageSquare } from 'lucide-react';
import type { InvestmentInputs } from '@/pages/Index';

interface PortfolioResultsProps {
  inputs: InvestmentInputs;
  onReset: () => void;
}

export const PortfolioResults: React.FC<PortfolioResultsProps> = ({ inputs, onReset }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(inputs.timeHorizon);
  const [showDebugTable, setShowDebugTable] = useState(false);
  
  const portfolio = calculatePortfolio(inputs);
  
  // Calculate projections only once using useMemo
  const { projectionData, yearlyCalculations } = useMemo(() => 
    calculateDetailedProjections(inputs, selectedPeriod), 
    [inputs, selectedPeriod]
  );

  const handleFeedback = () => {
    window.open('https://www.reddit.com/message/compose/?to=violt&subject=r/6nuliai%20skai%C4%8Diuokl%C4%97', '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Antraštė su grįžimo mygtuku */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Grįžti</span>
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Jūsų investavimo planas</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleFeedback}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Palikti atsiliepimą</span>
          </Button>
          <div className="flex items-center space-x-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">{portfolio.riskLevel}</span>
          </div>
        </div>
      </div>

      {/* Įspėjimai */}
      {portfolio.warning && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {portfolio.warning}
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio sudėtis */}
      <PortfolioBreakdown portfolio={portfolio} />

      {/* Laikotarpio pasirinkimas */}
      <Card>
        <CardHeader>
          <CardTitle>Projekcijos laikotarpis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {[5, 10, 15, 20, 25, 30].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period)}
                className="flex-1"
              >
                {period}m.
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio augimo grafikas */}
      <PortfolioChart 
        data={projectionData} 
        period={selectedPeriod}
        inputs={inputs}
        showDebugTable={showDebugTable}
        onToggleDebugTable={() => setShowDebugTable(!showDebugTable)}
      />

      {/* Prognozės santrauka */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prognozės santrauka ({selectedPeriod} metų)</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowDebugTable(!showDebugTable)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 animate-pulse hover:animate-none transition-all duration-3000 shadow-lg hover:shadow-xl"
            >
              <Calculator className="h-4 w-4" />
              <span>{showDebugTable ? 'Slėpti' : 'Rodyti'} skaičiavimus</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Bendras investuotas kapitalas</p>
              <p className="text-2xl font-bold text-gray-900">
                €{(inputs.initialSum + inputs.monthlyContribution * 12 * selectedPeriod).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Prognozuojama vertė</p>
              <p className="text-2xl font-bold text-green-600">
                €{projectionData[projectionData.length - 1]?.value.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Galimas pelnas</p>
              <p className="text-2xl font-bold text-blue-600">
                €{((projectionData[projectionData.length - 1]?.value || 0) - (inputs.initialSum + inputs.monthlyContribution * 12 * selectedPeriod)).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug lentelė */}
      {showDebugTable && (
        <CalculationsDebugTable yearlyCalculations={yearlyCalculations} />
      )}

      {/* Apatinis atsiliepimo mygtukas */}
      <div className="flex justify-center">
        <Button 
          onClick={handleFeedback}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Palikti atsiliepimą</span>
        </Button>
      </div>
    </div>
  );
};
