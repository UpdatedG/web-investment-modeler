
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AgeDial } from '@/components/AgeDial';
import { InitialSumDial } from '@/components/InitialSumDial';
import { MonthlyContributionDial } from '@/components/MonthlyContributionDial';
import { TimeHorizonDial } from '@/components/TimeHorizonDial';
import { FamilySituationSelector } from '@/components/FamilySituationSelector';
import { RiskDial } from '@/components/RiskDial';
import { ManagementDial } from '@/components/ManagementDial';
import { GeographySelector } from '@/components/GeographySelector';
import { SectorSelector } from '@/components/SectorSelector';
import type { InvestmentInputs } from '@/pages/Index';

interface InvestmentFormProps {
  onSubmit: (data: InvestmentInputs) => void;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSubmit }) => {
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
        {/* Amžius */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <AgeDial 
              value={formData.age} 
              onChange={(value) => updateField('age', value)} 
            />
          </CardContent>
        </Card>

        {/* Pradinė suma */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <InitialSumDial 
              value={formData.initialSum} 
              onChange={(value) => updateField('initialSum', value)} 
            />
          </CardContent>
        </Card>

        {/* Šeimos padėtis */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <FamilySituationSelector 
              value={formData.familySituation} 
              onChange={(value) => updateField('familySituation', value)} 
            />
          </CardContent>
        </Card>

        {/* Mėnesinis įnašas */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <MonthlyContributionDial 
              value={formData.monthlyContribution} 
              onChange={(value) => updateField('monthlyContribution', value)} 
            />
          </CardContent>
        </Card>

        {/* Investavimo laikotarpis */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <TimeHorizonDial 
              value={formData.timeHorizon} 
              onChange={(value) => updateField('timeHorizon', value)} 
            />
          </CardContent>
        </Card>

        {/* Rizikos tolerancija */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <RiskDial 
              value={formData.riskTolerance} 
              onChange={(value) => updateField('riskTolerance', value)}
              age={formData.age}
              familySituation={formData.familySituation}
            />
          </CardContent>
        </Card>

        {/* Valdymo preferencijos */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <ManagementDial 
              value={formData.managementPreference} 
              onChange={(value) => updateField('managementPreference', value)} 
            />
          </CardContent>
        </Card>

        {/* Geografijos preferencijos */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <GeographySelector 
              value={formData.geographyPreference} 
              onChange={(value) => updateField('geographyPreference', value)} 
            />
          </CardContent>
        </Card>

        {/* Sektorių preferencijos */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <SectorSelector 
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
          Sumodeliuoti galimą gražą
        </Button>
      </div>
    </form>
  );
};
