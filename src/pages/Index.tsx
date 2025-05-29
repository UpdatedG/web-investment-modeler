
import React, { useState } from 'react';
import { InvestmentForm } from '@/components/InvestmentForm';
import { PortfolioResults } from '@/components/PortfolioResults';
import { Header } from '@/components/Header';
import { Disclaimer } from '@/components/Disclaimer';

export interface InvestmentInputs {
  age: number;
  familySituation: string;
  initialSum: number;
  monthlyContribution: number;
  timeHorizon: number;
  riskTolerance: number;
  managementPreference: number;
  sectorPreference: string;
  geographyPreference: string;
}

export interface PortfolioAllocation {
  instruments: Array<{
    name: string;
    percentage: number;
    description: string;
  }>;
  riskLevel: string;
  warning?: string;
}

const Index = () => {
  const [inputs, setInputs] = useState<InvestmentInputs | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFormSubmit = (data: InvestmentInputs) => {
    setInputs(data);
    setShowResults(true);
  };

  const handleReset = () => {
    setInputs(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investavimo Kalkuliatorius
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sužinokite, kokia investavimo strategija geriausiai tiks jūsų situacijai ir tikslams
          </p>
        </div>

        {!showResults ? (
          <InvestmentForm onSubmit={handleFormSubmit} />
        ) : (
          <PortfolioResults inputs={inputs!} onReset={handleReset} />
        )}
        
        <Disclaimer />
      </main>
    </div>
  );
};

export default Index;
