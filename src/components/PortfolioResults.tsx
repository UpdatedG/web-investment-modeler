import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { PortfolioChart } from '@/components/PortfolioChart';
import { PortfolioBreakdown } from '@/components/PortfolioBreakdown';
import { DebugModal } from '@/components/DebugModal';
import { BrutalTruthModal } from '@/components/BrutalTruthModal';
import { ContributionGrowthChart } from '@/components/ContributionGrowthChart';
import { SharpeRatioDisplay } from '@/components/SharpeRatioDisplay';
import { ContributionScenarioTable } from '@/components/ContributionScenarioTable';
import { calculatePortfolio, calculateDetailedProjections } from '@/utils/portfolioCalculator';
import { AlertTriangle, ArrowLeft, TrendingUp, Calculator, MessageSquare } from 'lucide-react';
import { Github } from 'lucide-react';
import type { InvestmentInputs } from '@/pages/Index';

interface PortfolioResultsProps {
  inputs: InvestmentInputs;
  onReset: () => void;
}

export const PortfolioResults: React.FC<PortfolioResultsProps> = ({ inputs, onReset }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(inputs.timeHorizon);
  const [showDebugTable, setShowDebugTable] = useState(false);
  const [showBrutalTruth, setShowBrutalTruth] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const portfolio = calculatePortfolio(inputs, 'lt');
  
  // Calculate projections only once using useMemo
  const { projectionData, yearlyCalculations, drawdownStats, performanceMetrics } = useMemo(() => 
    calculateDetailedProjections(inputs, selectedPeriod, 'lt'), 
    [inputs, selectedPeriod]
  );

  const handleFeedback = () => {
    window.open('https://www.reddit.com/message/compose/?to=violt&subject=r/6nuliai%20calculator', '_blank');
  };

  const handleGithub = () => {
    window.open('https://github.com/UpdatedG/web-investment-modeler', '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="flex items-center space-x-2 border-2 border-gray-300 hover:border-gray-400 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Atgal</span>
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Jūsų investavimo planas</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">{portfolio.riskLevel}</span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {portfolio.warning && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {portfolio.warning}
            {(portfolio.warning.includes('aktyvų valdymą') || portfolio.warning.includes('active management')) && (
              <>
                {' '}
                <button
                  onClick={() => setShowBrutalTruth(true)}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Kodėl?
                </button>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio composition */}
      <PortfolioBreakdown portfolio={portfolio} />

      {/* Period selection */}
      <Card>
        <CardHeader>
          <CardTitle>Prognozės laikotarpis</CardTitle>
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

      {/* Portfolio growth chart */}
      <PortfolioChart 
        data={projectionData} 
        period={selectedPeriod}
        inputs={inputs}
        showDebugTable={showDebugTable}
        onToggleDebugTable={() => setShowDebugTable(!showDebugTable)}
      />

      {/* Contribution vs Growth Breakdown */}
      <ContributionGrowthChart 
        projectionData={projectionData}
        isEnglish={false}
      />

      {/* Sharpe Ratio and Performance Metrics */}
      <SharpeRatioDisplay 
        sharpeRatio={performanceMetrics.sharpeRatio}
        cagr={performanceMetrics.cagr}
        isEnglish={false}
      />

      {/* Contribution Scenario Analysis */}
      <ContributionScenarioTable 
        inputs={inputs}
        period={selectedPeriod}
        baselineValue={projectionData[projectionData.length - 1]?.value || 0}
        isEnglish={false}
      />

      {/* Forecast summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prognozės santrauka ({selectedPeriod} metai)</CardTitle>
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
              <p className="text-sm text-gray-600">Iš viso investuota</p>
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

      {/* Drawdown and Risk Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Rizikos statistika (volatilumas)</CardTitle>
        </CardHeader>
        <CardContent>
          {drawdownStats.isMarginCalled ? (
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>MARGIN CALL:</strong> Pagal modelį, portfolio būtų buvęs likviduotas {drawdownStats.marginCallYear} metais. 
                Tikroji vertė turėtų būti nustatyta į €0.
              </AlertDescription>
            </Alert>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Žemiausia vertė</p>
              <p className="text-xl font-bold text-red-600">
                €{drawdownStats.lowestValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{drawdownStats.lowestValueYear} metais</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Didžiausias kritimas</p>
              <p className="text-xl font-bold text-red-600">
                -{drawdownStats.maxDrawdownPercent}%
              </p>
              <p className="text-xs text-gray-500">{drawdownStats.maxDrawdownYear} metais</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Aukščiausia vertė</p>
              <p className="text-xl font-bold text-green-600">
                €{drawdownStats.peakValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{drawdownStats.peakValueYear} metais</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Portfolio statusas</p>
              <p className={`text-xl font-bold ${drawdownStats.isMarginCalled ? 'text-red-600' : 'text-green-600'}`}>
                {drawdownStats.isMarginCalled ? 'Likviduotas' : 'Aktyvus'}
              </p>
              {drawdownStats.isMarginCalled && (
                <p className="text-xs text-gray-500">{drawdownStats.marginCallYear} metais</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug modal */}
      <DebugModal
        isOpen={showDebugTable}
        onClose={() => setShowDebugTable(false)}
        yearlyCalculations={yearlyCalculations}
        language="lt"
      />

      {/* Bottom buttons */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleFeedback}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Palikti atsiliepimą</span>
        </Button>
        <Button 
          onClick={handleGithub}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Github className="h-4 w-4" />
          <span>Šaltinio kodas</span>
        </Button>
      </div>

      {/* Brutal Truth Modal */}
      <BrutalTruthModal
        isOpen={showBrutalTruth}
        onClose={() => setShowBrutalTruth(false)}
        isEnglish={false}
      />
    </div>
  );
};
