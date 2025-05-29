
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { YearlyCalculation } from '@/utils/portfolioCalculator';

interface CalculationsDebugTableProps {
  yearlyCalculations: YearlyCalculation[];
}

export const CalculationsDebugTable: React.FC<CalculationsDebugTableProps> = ({ yearlyCalculations }) => {
  const formatCurrency = (value: number) => `€${Math.round(value).toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skaičiavimų detalės (Debug)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metai</TableHead>
                <TableHead>Instrumentas</TableHead>
                <TableHead>Alokacija %</TableHead>
                <TableHead>Metinė grąža %</TableHead>
                <TableHead>Vertė</TableHead>
                <TableHead>Bendra vertė</TableHead>
                <TableHead>Investuota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlyCalculations.map((yearCalc) => (
                yearCalc.instruments.map((instrument, index) => (
                  <TableRow key={`${yearCalc.year}-${index}`}>
                    {index === 0 && (
                      <TableCell rowSpan={yearCalc.instruments.length} className="font-medium">
                        {yearCalc.year}
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{instrument.name}</TableCell>
                    <TableCell>{instrument.percentage}%</TableCell>
                    <TableCell className={
                      instrument.annualReturn > 0 ? 'text-green-600' : 
                      instrument.annualReturn < 0 ? 'text-red-600' : 'text-gray-600'
                    }>
                      {yearCalc.year === 0 ? '-' : formatPercentage(instrument.annualReturn)}
                    </TableCell>
                    <TableCell>{formatCurrency(instrument.value)}</TableCell>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={yearCalc.instruments.length} className="font-bold">
                          {formatCurrency(yearCalc.totalValue)}
                        </TableCell>
                        <TableCell rowSpan={yearCalc.instruments.length}>
                          {formatCurrency(yearCalc.totalInvested)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Pastaba:</strong> Metinės grąžos yra atsitiktinai generuojamos pagal kiekvieno instrumento istorinį grąžos intervalą su papildoma volatilumu.</p>
          <p><strong>Grąžos intervalai:</strong></p>
          <ul className="list-disc list-inside mt-2">
            <li>Globalūs ETF: 12.8% - 13.2%</li>
            <li>Technologijų ETF: 18.3% - 18.8%</li>
            <li>Sveikatos ETF: 8.5% - 10.2%</li>
            <li>Energetikos ETF: 2.1% - 4.8%</li>
            <li>Europos ETF: 6.8% - 8.2%</li>
            <li>Besivystančių rinkų ETF: 4.2% - 6.1%</li>
            <li>Akcijos (Large Cap): 10% - 15%</li>
            <li>Leveraged ETF (3x): 25% - 35%</li>
            <li>Kriptovaliutos: -20% - +60%</li>
            <li>Moonshot aktyvai: -50% - +100%</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
