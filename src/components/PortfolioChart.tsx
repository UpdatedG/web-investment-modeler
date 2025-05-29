
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { InvestmentInputs } from '@/pages/Index';

interface PortfolioChartProps {
  data: Array<{ year: number; value: number; invested: number }>;
  period: number;
  inputs: InvestmentInputs;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, period, inputs }) => {
  const formatCurrency = (value: number) => `€${value.toLocaleString()}`;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio augimo projekcija ({period} metų)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Metai', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Vertė (€)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'value' ? 'Portfolio vertė' : 'Investuota suma'
              ]}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stackId="1"
              stroke="#94A3B8"
              fill="#94A3B8"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="value"
              stackId="2"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Projekcijos pagrįstos istoriniais duomenimis ir gali skirtis nuo realių rezultatų. 
            Praeities veikla negarantuoja ateities rezultatų.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
