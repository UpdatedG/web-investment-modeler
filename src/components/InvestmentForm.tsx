
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        {/* Asmeninė informacija */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Asmeninė informacija</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="age">Amžius</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="80"
                value={formData.age}
                onChange={(e) => updateField('age', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="family">Šeimos padėtis</Label>
              <Select value={formData.familySituation} onValueChange={(value) => updateField('familySituation', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pasirinkite šeimos padėtį" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Vienišas/a</SelectItem>
                  <SelectItem value="couple">Pora be vaikų</SelectItem>
                  <SelectItem value="family">Šeima su vaikais</SelectItem>
                  <SelectItem value="single-parent">Vienas iš tėvų</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Finansinė informacija */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Finansinė informacija</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="initial">Pradinė suma (€)</Label>
              <Input
                id="initial"
                type="number"
                min="100"
                step="50"
                value={formData.initialSum}
                onChange={(e) => updateField('initialSum', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="monthly">Mėnesinis įnašas (€)</Label>
              <Input
                id="monthly"
                type="number"
                min="0"
                step="10"
                value={formData.monthlyContribution}
                onChange={(e) => updateField('monthlyContribution', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="horizon">Investavimo laikotarpis (metai)</Label>
              <Input
                id="horizon"
                type="number"
                min="1"
                max="50"
                value={formData.timeHorizon}
                onChange={(e) => updateField('timeHorizon', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rizikos tolerancija */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Rizikos tolerancija</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDial 
              value={formData.riskTolerance} 
              onChange={(value) => updateField('riskTolerance', value)} 
            />
          </CardContent>
        </Card>

        {/* Valdymo preferencijos */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Valdymo preferencijos</CardTitle>
          </CardHeader>
          <CardContent>
            <ManagementDial 
              value={formData.managementPreference} 
              onChange={(value) => updateField('managementPreference', value)} 
            />
          </CardContent>
        </Card>

        {/* Geografijos preferencijos */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Geografijos preferencijos</CardTitle>
          </CardHeader>
          <CardContent>
            <GeographySelector 
              value={formData.geographyPreference} 
              onChange={(value) => updateField('geographyPreference', value)} 
            />
          </CardContent>
        </Card>

        {/* Sektorių preferencijos */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Sektorių preferencijos</CardTitle>
          </CardHeader>
          <CardContent>
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
          Gauti investavimo rekomendacijas
        </Button>
      </div>
    </form>
  );
};
