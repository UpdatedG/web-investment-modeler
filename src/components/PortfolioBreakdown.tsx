
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PortfolioAllocation } from '@/pages/Index';

interface PortfolioBreakdownProps {
  portfolio: PortfolioAllocation;
}

export const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({ portfolio }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  const chartData = portfolio.instruments.map((instrument, index) => ({
    ...instrument,
    fill: colors[index % colors.length]
  }));

  // Function to format instrument names with line breaks after tickers
  const formatInstrumentName = (name: string) => {
    // Look for pattern like "ETF_NAME (TICKER)" and add line break after ticker
    const tickerMatch = name.match(/^(.+)\s+\(([^)]+)\)(.*)$/);
    if (tickerMatch) {
      const [, etfName, ticker, rest] = tickerMatch;
      return `${etfName} (${ticker})\n${rest}`.trim();
    }
    return name;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Portfolio skirstinys */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio skirstinys</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="percentage"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Instrumentų aprašymai */}
      <Card>
        <CardHeader>
          <CardTitle>Investavimo instrumentai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.instruments.map((instrument, index) => (
              <div key={index} className="border-l-4 pl-4" style={{ borderColor: colors[index % colors.length] }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 whitespace-pre-line leading-tight">
                    {formatInstrumentName(instrument.name)}
                  </h4>
                  <span className="text-lg font-bold text-gray-700 ml-2 flex-shrink-0">{instrument.percentage}%</span>
                </div>
                <p className="text-sm text-gray-600">{instrument.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
