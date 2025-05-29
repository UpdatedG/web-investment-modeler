
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { PortfolioChart } from '@/components/PortfolioChart';
import { PortfolioBreakdown } from '@/components/PortfolioBreakdown';
import { calculatePortfolio } from '@/utils/portfolioCalculator';
import { AlertTriangle, ArrowLeft, TrendingUp, MessageCircle, LogIn } from 'lucide-react';
import type { InvestmentInputs } from '@/pages/Index';

interface PortfolioResultsProps {
  inputs: InvestmentInputs;
  onReset: () => void;
}

export const PortfolioResults: React.FC<PortfolioResultsProps> = ({ inputs, onReset }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(inputs.timeHorizon);
  const [showChat, setShowChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const portfolio = calculatePortfolio(inputs);
  const projectionData = calculateProjections(inputs, selectedPeriod);

  const handleChatSubmit = () => {
    if (!isLoggedIn) {
      alert('Prisijunkite su Google paskyra, kad galėtumėte užduoti klausimus apie portfolio');
      return;
    }
    // Here would be the LLM integration
    console.log('Sending to LLM:', { message: chatMessage, portfolio, inputs });
    setChatMessage('');
  };

  const handleLogin = () => {
    // Mock login for now
    setIsLoggedIn(true);
    alert('Sėkmingai prisijungėte!');
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
          {!isLoggedIn && (
            <Button 
              onClick={handleLogin}
              className="flex items-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Prisijungti</span>
            </Button>
          )}
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

      {/* LLM Chat sekcija */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Klauskite apie savo portfolio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Užduokite klausimą apie savo investavimo strategiją..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              className="flex-1"
            />
            <Button onClick={handleChatSubmit}>
              Klausti
            </Button>
          </div>
          {!isLoggedIn && (
            <p className="text-sm text-gray-600 mt-2">
              Prisijunkite su Google paskyra, kad galėtumėte užduoti klausimus
            </p>
          )}
        </CardContent>
      </Card>

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
      />

      {/* Prognozės santrauka */}
      <Card>
        <CardHeader>
          <CardTitle>Prognozės santrauka ({selectedPeriod} metų)</CardTitle>
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
    </div>
  );
};

// Papildoma funkcija projekcijų skaičiavimui su scenarijais
function calculateProjections(inputs: InvestmentInputs, period: number) {
  const portfolio = calculatePortfolio(inputs);
  const baseReturn = getExpectedReturn(portfolio.riskLevel);
  
  const data = [];
  let currentValue = inputs.initialSum;
  
  for (let month = 0; month <= period * 12; month++) {
    if (month > 0) {
      const monthlyReturn = baseReturn / 12;
      currentValue = currentValue * (1 + monthlyReturn) + inputs.monthlyContribution;
    }
    
    if (month % 12 === 0) {
      data.push({
        year: month / 12,
        value: Math.round(currentValue),
        invested: inputs.initialSum + inputs.monthlyContribution * month,
        bestCase: Math.round(currentValue * 1.3), // 30% better than median
        worstCase: Math.round(currentValue * 0.7)  // 30% worse than median
      });
    }
  }
  
  return data;
}

function getExpectedReturn(riskLevel: string): number {
  const returns: Record<string, number> = {
    'Minimali rizika': 0.05,
    'Maža rizika': 0.07,
    'Vidutinė rizika': 0.09,
    'Didesnė rizika': 0.12,
    'Didelė rizika': 0.15,
    'Ultra rizika': 0.20
  };
  return returns[riskLevel] || 0.07;
}
