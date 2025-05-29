
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AgeDialEn } from '@/components/AgeDial-en';
import { InitialSumDialEn } from '@/components/InitialSumDial-en';
import { MonthlyContributionDialEn } from '@/components/MonthlyContributionDial-en';
import { TimeHorizonDialEn } from '@/components/TimeHorizonDial-en';
import { FamilySituationSelectorEn } from '@/components/FamilySituationSelector-en';
import { RiskDialEn } from '@/components/RiskDial-en';
import { ManagementDialEn } from '@/components/ManagementDial-en';
import { GeographySelectorEn } from '@/components/GeographySelector-en';
import { SectorSelectorEn } from '@/components/SectorSelector-en';
import type { InvestmentInputs } from '@/pages/Index';

interface InvestmentFormEnProps {
  onSubmit: (data: InvestmentInputs) => void;
}

export const InvestmentFormEn: React.FC<InvestmentFormEnProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<InvestmentInputs>({
    age: 25,
    familySituation: 'single',
    initialSum: 1000,
    monthlyContribution: 200,
    timeHorizon: 10,
    riskTolerance: 0,
    managementPreference: 0,
    sectorPreference: 'general',
    geographyPreference: 'global'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof InvestmentInputs, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <AgeDialEn 
              value={formData.age} 
              onChange={(value) => updateField('age', value)} 
            />
          </CardContent>
        </Card>

        {/* Initial Amount */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <InitialSumDialEn 
              value={formData.initialSum} 
              onChange={(value) => updateField('initialSum', value)} 
            />
          </CardContent>
        </Card>

        {/* Family Situation */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <FamilySituationSelectorEn 
              value={formData.familySituation} 
              onChange={(value) => updateField('familySituation', value)} 
            />
          </CardContent>
        </Card>

        {/* Monthly Contribution */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <MonthlyContributionDialEn 
              value={formData.monthlyContribution} 
              onChange={(value) => updateField('monthlyContribution', value)} 
            />
          </CardContent>
        </Card>

        {/* Investment Period */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <TimeHorizonDialEn 
              value={formData.timeHorizon} 
              onChange={(value) => updateField('timeHorizon', value)} 
            />
          </CardContent>
        </Card>

        {/* Risk Tolerance */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <RiskDialEn 
              value={formData.riskTolerance} 
              onChange={(value) => updateField('riskTolerance', value)}
              age={formData.age}
              familySituation={formData.familySituation}
            />
          </CardContent>
        </Card>

        {/* Management Preferences */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <ManagementDialEn 
              value={formData.managementPreference} 
              onChange={(value) => updateField('managementPreference', value)} 
            />
          </CardContent>
        </Card>

        {/* Geography Preferences */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <GeographySelectorEn 
              value={formData.geographyPreference} 
              onChange={(value) => updateField('geographyPreference', value)} 
            />
          </CardContent>
        </Card>

        {/* Sector Preferences */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <SectorSelectorEn 
              value={formData.sectorPreference} 
              onChange={(value) => updateField('sectorPreference', value)} 
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button 
          type="submit" 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Model Potential Returns
        </Button>
      </div>
    </form>
  );
};
