
import React, { useState } from 'react';
import { InvestmentFormEn } from '@/components/InvestmentForm-en';
import { PortfolioResults } from '@/components/PortfolioResults';
import { HeaderEn } from '@/components/Header-en';
import { DisclaimerEn } from '@/components/Disclaimer-en';

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

interface IndexEnProps {
  onLanguageChange: () => void;
}

const IndexEn: React.FC<IndexEnProps> = ({ onLanguageChange }) => {
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
      <HeaderEn onLanguageChange={onLanguageChange} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Scenario Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find out what average results you can expect by choosing a specific risk model and the resulting instruments (instruments are illustrative)
          </p>
        </div>

        {!showResults ? (
          <InvestmentFormEn onSubmit={handleFormSubmit} />
        ) : (
          <PortfolioResults inputs={inputs!} onReset={handleReset} />
        )}
        
        <DisclaimerEn />
      </main>
    </div>
  );
};

export default IndexEn;
