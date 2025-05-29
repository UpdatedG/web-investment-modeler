import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PortfolioAllocation } from '@/pages/Index';

interface PortfolioBreakdownProps {
  portfolio: PortfolioAllocation;
}

export const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({ portfolio }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  // Function to format instrument names with line breaks after each ticker for pie chart
  const formatInstrumentNameForChart = (name: string) => {
    // Look for pattern like "ETF_NAME (TICKER1, TICKER2, TICKER3)" and add line breaks
    const tickerMatch = name.match(/^(.+)\s+\(([^)]+)\)(.*)$/);
    if (tickerMatch) {
      const [, etfName, tickers, rest] = tickerMatch;
      // Split tickers by comma and add line breaks after each
      const formattedTickers = tickers.split(',').map(ticker => ticker.trim()).join(',\n');
      return `${etfName} (${formattedTickers})\n${rest}`.trim();
    }
    return name;
  };

  // Function to format instrument names for the list (keep original format)
  const formatInstrumentName = (name: string) => {
    return name; // Keep original format without line breaks for the list
  };

  const chartData = portfolio.instruments.map((instrument, index) => ({
    ...instrument,
    fill: colors[index % colors.length],
    // Format name for pie chart with line breaks after each ticker
    chartName: formatInstrumentNameForChart(instrument.name)
  }));

  // Custom label function for pie chart
  const renderCustomLabel = ({ chartName, percentage }: any) => {
    return `${chartName}: ${percentage}%`;
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
                label={renderCustomLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [`${value}%`, props.payload.chartName]}
              />
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
                  <h4 className="font-semibold text-gray-900 leading-tight">
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
