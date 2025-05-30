import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { PortfolioChartEn } from '@/components/PortfolioChart-en';
import { PortfolioBreakdownEn } from '@/components/PortfolioBreakdown-en';
import { DebugModal } from '@/components/DebugModal';
import { BrutalTruthModal } from '@/components/BrutalTruthModal';
import { ContributionGrowthChart } from '@/components/ContributionGrowthChart';
import { SharpeRatioDisplay } from '@/components/SharpeRatioDisplay';
import { ContributionScenarioTable } from '@/components/ContributionScenarioTable';
import { calculatePortfolio, calculateDetailedProjections } from '@/utils/portfolioCalculator';
import { AlertTriangle, ArrowLeft, TrendingUp, Calculator, MessageSquare } from 'lucide-react';
import { Github } from 'lucide-react';
import type { InvestmentInputs } from '@/pages/Index-en';

interface PortfolioResultsEnProps {
  inputs: InvestmentInputs;
  onReset: () => void;
}

export const PortfolioResultsEn: React.FC<PortfolioResultsEnProps> = ({ inputs, onReset }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(inputs.timeHorizon);
  const [showDebugTable, setShowDebugTable] = useState(false);
  const [showBrutalTruth, setShowBrutalTruth] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const portfolio = calculatePortfolio(inputs, 'en');
  
  // Calculate projections only once using useMemo
  const { projectionData, yearlyCalculations, drawdownStats, performanceMetrics } = useMemo(() => 
    calculateDetailedProjections(inputs, selectedPeriod, 'en'), 
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
            <span>Back</span>
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Your Investment Plan</h2>
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
                  Why?
                </button>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio composition */}
      <PortfolioBreakdownEn portfolio={portfolio} />

      {/* Period selection */}
      <Card>
        <CardHeader>
          <CardTitle>Projection Period</CardTitle>
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
                {period}y
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio growth chart */}
      <PortfolioChartEn 
        data={projectionData} 
        period={selectedPeriod}
        inputs={inputs}
        showDebugTable={showDebugTable}
        onToggleDebugTable={() => setShowDebugTable(!showDebugTable)}
      />

      {/* Contribution vs Growth Breakdown */}
      <ContributionGrowthChart 
        projectionData={projectionData}
        isEnglish={true}
      />

      {/* Sharpe Ratio and Performance Metrics */}
      <SharpeRatioDisplay 
        sharpeRatio={performanceMetrics.sharpeRatio}
        cagr={performanceMetrics.cagr}
        isEnglish={true}
      />

      {/* Contribution Scenario Analysis */}
      <ContributionScenarioTable 
        inputs={inputs}
        period={selectedPeriod}
        baselineValue={projectionData[projectionData.length - 1]?.value || 0}
        isEnglish={true}
      />

      {/* Forecast summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Forecast Summary ({selectedPeriod} years)</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowDebugTable(!showDebugTable)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 animate-pulse hover:animate-none transition-all duration-3000 shadow-lg hover:shadow-xl"
            >
              <Calculator className="h-4 w-4" />
              <span>{showDebugTable ? 'Hide' : 'Show'} Calculations</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Invested Capital</p>
              <p className="text-2xl font-bold text-gray-900">
                €{(inputs.initialSum + inputs.monthlyContribution * 12 * selectedPeriod).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Projected Value</p>
              <p className="text-2xl font-bold text-green-600">
                €{projectionData[projectionData.length - 1]?.value.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Potential Profit</p>
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
          <CardTitle>Risk Statistics (Volatility)</CardTitle>
        </CardHeader>
        <CardContent>
          {drawdownStats.isMarginCalled ? (
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>MARGIN CALL:</strong> According to the model, the portfolio would have been liquidated in year {drawdownStats.marginCallYear}. 
                The real value should be set to €0.
              </AlertDescription>
            </Alert>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Lowest Value</p>
              <p className="text-xl font-bold text-red-600">
                €{drawdownStats.lowestValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Year {drawdownStats.lowestValueYear}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Maximum Drawdown</p>
              <p className="text-xl font-bold text-red-600">
                -{drawdownStats.maxDrawdownPercent}%
              </p>
              <p className="text-xs text-gray-500">Year {drawdownStats.maxDrawdownYear}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Peak Value</p>
              <p className="text-xl font-bold text-green-600">
                €{drawdownStats.peakValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Year {drawdownStats.peakValueYear}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Portfolio Status</p>
              <p className={`text-xl font-bold ${drawdownStats.isMarginCalled ? 'text-red-600' : 'text-green-600'}`}>
                {drawdownStats.isMarginCalled ? 'Liquidated' : 'Active'}
              </p>
              {drawdownStats.isMarginCalled && (
                <p className="text-xs text-gray-500">Year {drawdownStats.marginCallYear}</p>
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
        language="en"
      />

      {/* Bottom buttons */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleFeedback}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Leave Feedback</span>
        </Button>
        <Button 
          onClick={handleGithub}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Github className="h-4 w-4" />
          <span>View Source Code</span>
        </Button>
      </div>

      {/* Brutal Truth Modal */}
      <BrutalTruthModal
        isOpen={showBrutalTruth}
        onClose={() => setShowBrutalTruth(false)}
        isEnglish={true}
      />
    </div>
  );
};
