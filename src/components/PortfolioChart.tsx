
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator } from 'lucide-react';
import type { InvestmentInputs } from '@/pages/Index';

interface PortfolioChartProps {
  data: Array<{ 
    year: number; 
    value: number; 
    invested: number;
    bestCase?: number;
    worstCase?: number;
    volatileValue?: number;
  }>;
  period: number;
  inputs: InvestmentInputs;
  showDebugTable: boolean;
  onToggleDebugTable: () => void;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  data, 
  period, 
  inputs, 
  showDebugTable, 
  onToggleDebugTable 
}) => {
  const formatCurrency = (value: number) => `€${value.toLocaleString()}`;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio augimo projekcija ({period} metų)</CardTitle>
            <p className="text-sm text-gray-600">
              Projekcijos pagrįstos realiais istoriniais duomenimis su atsitiktiniu volatilumu
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onToggleDebugTable}
            className="flex items-center space-x-2"
          >
            <Calculator className="h-4 w-4" />
            <span>{showDebugTable ? 'Slėpti' : 'Rodyti'} skaičiavimus</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
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
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  'value': 'Projektyta vertė',
                  'invested': 'Investuota suma',
                  'bestCase': 'Optimistinis scenarijus',
                  'worstCase': 'Pesimistinis scenarijus',
                  'volatileValue': 'Vertė su volatilumu'
                };
                return [formatCurrency(value), labels[name] || name];
              }}
            />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="worstCase"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="volatileValue"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="bestCase"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-gray-400" style={{ borderStyle: 'dashed' }}></div>
            <span>Investuota suma</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span>Pesimistinis scenarijus</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-yellow-500"></div>
            <span>Su volatilumu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500"></div>
            <span>Projektyta vertė</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span>Optimistinis scenarijus</span>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Projekcijos naudoja tikrus istorinės grąžos duomenis su atsitiktiniu volatilumu kiekvienais metais. 
            Geltona linija rodo portfolio vertę su crash ir correction poveikiu vizualizacijai.
            Rezultatai gali skirtis kiekviename naujame skaičiavime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
