
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { InvestmentInputs } from '@/pages/Index';

interface PortfolioChartEnProps {
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

export const PortfolioChartEn: React.FC<PortfolioChartEnProps> = ({ 
  data, 
  period, 
  inputs
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}k`;
    }
    return `€${value.toLocaleString()}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Portfolio Growth Projection ({period} years)</CardTitle>
          <p className="text-sm text-gray-600">
            Projections are based on real historical data (average intervals) applying volatility characteristic of this asset class.
            Historical data does not guarantee future results.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Value (€)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  'value': 'Portfolio value (projection)',
                  'invested': 'Invested amount',
                  'bestCase': 'Optimistic scenario',
                  'worstCase': 'Pessimistic scenario',
                  'volatileValue': 'Portfolio volatility'
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
            <span>Invested amount</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span>Pessimistic scenario</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-yellow-500"></div>
            <span>Volatility</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500"></div>
            <span>Portfolio value (projection)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span>Optimistic scenario</span>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Projections use real historical return data with random volatility each year. 
            The yellow line shows portfolio value with crash and correction effects for visualization.
            Results may vary in each new calculation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
