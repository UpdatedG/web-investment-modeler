import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ContributionGrowthChartProps {
  projectionData: Array<{
    year: number;
    value: number;
    contributions: number;
    growth: number;
    inflationAdjustedValue: number;
    annualInflation: number;
  }>;
  isEnglish?: boolean;
}

export const ContributionGrowthChart: React.FC<ContributionGrowthChartProps> = ({ 
  projectionData, 
  isEnglish = false 
}) => {
  // Transform data for stacked area chart
  const chartData = projectionData.map((data, index) => {
    const cumulativeContributions = projectionData
      .slice(0, index + 1)
      .reduce((sum, item) => sum + item.contributions, 0);
    
    // Total growth is everything above contributions
    const totalGrowth = Math.max(0, data.value - cumulativeContributions);
    
    // Inflation impact is the difference between nominal and real value
    // But it should be calculated as a portion of the total value, not subtracted from growth
    const inflationImpact = Math.max(0, data.value - data.inflationAdjustedValue);
    
    // Growth should be the actual investment returns (not reduced by inflation impact)
    const realGrowth = Math.max(0, totalGrowth);
    
    return {
      year: data.year,
      contributions: cumulativeContributions,
      growth: realGrowth,
      inflationImpact: Math.min(inflationImpact, realGrowth * 0.3), // Cap inflation impact to reasonable level
      totalValue: data.value,
      realValue: data.inflationAdjustedValue
    };
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    } else {
      return `€${Math.round(value).toLocaleString()}`;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{isEnglish ? `Year ${label}` : `${label} metai`}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              {isEnglish ? 'Contributions:' : 'Įmokos:'} {formatCurrency(data.contributions)}
            </p>
            <p className="text-orange-600">
              {isEnglish ? 'Inflation Impact:' : 'Infliacijos poveikis:'} {formatCurrency(data.inflationImpact)}
            </p>
            <p className="text-green-600">
              {isEnglish ? 'Growth:' : 'Augimas:'} {formatCurrency(data.growth)}
            </p>
            <p className="text-gray-600 border-t pt-1">
              {isEnglish ? 'Total Value:' : 'Bendra vertė:'} {formatCurrency(data.totalValue)}
            </p>
            <p className="text-purple-600">
              {isEnglish ? 'Real Value:' : 'Reali vertė:'} {formatCurrency(data.realValue)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEnglish ? 'Contribution vs. Growth and Inflation Impact' : 'Įmokų vs. augimo ir infliacijos poveikio analizė'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ 
                  value: isEnglish ? 'Years' : 'Metai', 
                  position: 'insideBottom', 
                  offset: -5 
                }} 
              />
              <YAxis 
                tickFormatter={formatCurrency}
                label={{ 
                  value: isEnglish ? 'Value (€)' : 'Vertė (€)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Area
                type="monotone"
                dataKey="contributions"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.8}
                name={isEnglish ? 'Contributions' : 'Įmokos'}
              />
              <Area
                type="monotone"
                dataKey="inflationImpact"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name={isEnglish ? 'Inflation Impact' : 'Infliacijos poveikis'}
              />
              <Area
                type="monotone"
                dataKey="growth"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
                name={isEnglish ? 'Investment Growth' : 'Investicijų augimas'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <div>
              <p className="font-medium text-blue-800">
                {isEnglish ? 'Your Contributions' : 'Jūsų įmokos'}
              </p>
              <p className="text-blue-600">
                {isEnglish ? 'Money you put in' : 'Pinigai, kuriuos įdėjote'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div>
              <p className="font-medium text-orange-800">
                {isEnglish ? 'Inflation Impact' : 'Infliacijos poveikis'}
              </p>
              <p className="text-orange-600">
                {isEnglish ? 'Purchasing power loss' : 'Perkamosios galios praradimas'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <div>
              <p className="font-medium text-green-800">
                {isEnglish ? 'Investment Growth' : 'Investicijų augimas'}
              </p>
              <p className="text-green-600">
                {isEnglish ? 'Market returns' : 'Rinkos grąža'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 