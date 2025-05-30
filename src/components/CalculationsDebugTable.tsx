import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, TrendingDown, TrendingUp, Minus, PlusCircle } from 'lucide-react';
import type { YearlyCalculation } from '@/utils/portfolioCalculator';

interface CalculationsDebugTableProps {
  yearlyCalculations: YearlyCalculation[];
  language?: string;
}

export const CalculationsDebugTable: React.FC<CalculationsDebugTableProps> = ({ yearlyCalculations, language = 'lt' }) => {
  const formatCurrency = (value: number) => `€${Math.round(value).toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  const isEnglish = language === 'en';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEnglish ? 'Calculation Details (Debug)' : 'Skaičiavimų detalės (Debug)'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEnglish ? 'Year' : 'Metai'}</TableHead>
                <TableHead>{isEnglish ? 'Status' : 'Statusas'}</TableHead>
                <TableHead>{isEnglish ? 'Instrument' : 'Instrumentas'}</TableHead>
                <TableHead>{isEnglish ? 'Allocation %' : 'Alokacija %'}</TableHead>
                <TableHead>{isEnglish ? 'Annual Return %' : 'Metinė grąža %'}</TableHead>
                <TableHead>{isEnglish ? 'Crash drawdown %' : 'Crash drawdown %'}</TableHead>
                <TableHead>{isEnglish ? 'Correction drawdown %' : 'Correction drawdown %'}</TableHead>
                <TableHead>{isEnglish ? 'Recovery Progress' : 'Atsigavimo progresija'}</TableHead>
                <TableHead>{isEnglish ? 'Value' : 'Vertė'}</TableHead>
                <TableHead>{isEnglish ? 'Total Value' : 'Bendra vertė'}</TableHead>
                <TableHead className="min-w-[140px]">{isEnglish ? 'Volatility Impact' : 'Volatyvumo poveikis'}</TableHead>
                <TableHead>{isEnglish ? 'Invested' : 'Investuota'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlyCalculations.map((yearCalc) => (
                <>
                  {yearCalc.instruments.map((instrument, index) => (
                    <TableRow key={`${yearCalc.year}-${index}`} className={
                      yearCalc.isMarginCall ? 'bg-red-100 border-red-300' :
                      yearCalc.isCrashYear ? 'bg-red-50' : 
                      yearCalc.isRecoveryYear ? 'bg-yellow-50' : 
                      yearCalc.isCorrectionYear ? 'bg-orange-50' : 
                      yearCalc.isLowestPoint ? 'bg-purple-50' : ''
                    }>
                      {index === 0 && (
                        <TableCell rowSpan={yearCalc.instruments.length + (yearCalc.year > 0 ? 1 : 0)} className="font-medium">
                          <div className="flex flex-col items-center">
                            <span>{yearCalc.year}</span>
                            {yearCalc.isMarginCall && (
                              <span className="text-xs text-red-600 font-bold mt-1">MARGIN CALL</span>
                            )}
                            {yearCalc.isLowestPoint && !yearCalc.isMarginCall && (
                              <span className="text-xs text-purple-600 font-bold mt-1">LOWEST</span>
                            )}
                          </div>
                        </TableCell>
                      )}
                      {index === 0 && (
                        <TableCell rowSpan={yearCalc.instruments.length + (yearCalc.year > 0 ? 1 : 0)} className="text-center">
                          {yearCalc.isCrashYear && (
                            <div className="flex items-center justify-center space-x-1 text-red-600">
                              <TrendingDown className="h-4 w-4" />
                              <span className="text-xs font-medium">CRASH</span>
                            </div>
                          )}
                          {yearCalc.isRecoveryYear && !yearCalc.isCrashYear && (
                            <div className="flex items-center justify-center space-x-1 text-orange-600">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-xs font-medium">RECOVERY</span>
                            </div>
                          )}
                          {yearCalc.isCorrectionYear && (
                            <div className="flex items-center justify-center space-x-1 text-orange-500">
                              <Minus className="h-4 w-4" />
                              <span className="text-xs font-medium">CORRECTION</span>
                            </div>
                          )}
                          {!yearCalc.isCrashYear && !yearCalc.isRecoveryYear && !yearCalc.isCorrectionYear && yearCalc.year > 0 && (
                            <span className="text-xs text-green-600 font-medium">NORMAL</span>
                          )}
                          {yearCalc.year === 0 && (
                            <span className="text-xs text-gray-600 font-medium">START</span>
                          )}
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
                      <TableCell className="text-red-600">
                        {instrument.crashDrawdown ? formatPercentage(instrument.crashDrawdown) : '-'}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        {instrument.correctionDrawdown ? formatPercentage(instrument.correctionDrawdown) : '-'}
                      </TableCell>
                      <TableCell>
                        {instrument.isRecovering && instrument.recoveryProgress !== undefined ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all" 
                                style={{ width: `${instrument.recoveryProgress * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{(instrument.recoveryProgress * 100).toFixed(0)}%</span>
                          </div>
                        ) : instrument.isCorrection && instrument.correctionRecoveryProgress !== undefined ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-400 h-2 rounded-full transition-all" 
                                style={{ width: `${instrument.correctionRecoveryProgress * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{(instrument.correctionRecoveryProgress * 100).toFixed(0)}%</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{formatCurrency(instrument.value)}</TableCell>
                      {index === 0 && (
                        <>
                          <TableCell rowSpan={yearCalc.instruments.length + (yearCalc.year > 0 ? 1 : 0)} className="font-bold">
                            {formatCurrency(yearCalc.totalValue)}
                          </TableCell>
                          <TableCell rowSpan={yearCalc.instruments.length + (yearCalc.year > 0 ? 1 : 0)} className={
                            !yearCalc.netImpact || yearCalc.netImpact === 0 ? '' :
                            yearCalc.netImpact > 0 ? 'font-bold text-green-600' : 'font-bold text-red-600'
                          }>
                            {!yearCalc.netImpact || yearCalc.netImpact === 0 ? '-' : 
                             yearCalc.netImpact > 0 ? `+€${Math.abs(yearCalc.netImpact).toLocaleString()}` : 
                             `-€${Math.abs(yearCalc.netImpact).toLocaleString()}`}
                          </TableCell>
                          <TableCell rowSpan={yearCalc.instruments.length + (yearCalc.year > 0 ? 1 : 0)}>
                            {formatCurrency(yearCalc.totalInvested)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                  {/* Add contributions row for years > 0 */}
                  {yearCalc.year > 0 && (
                    <TableRow className="bg-blue-50 border-t border-blue-200">
                      <TableCell className="font-medium text-blue-700 flex items-center space-x-2">
                        <PlusCircle className="h-4 w-4" />
                        <span>{isEnglish ? 'Contributions' : 'Įmokos'}</span>
                      </TableCell>
                      <TableCell className="text-blue-600">-</TableCell>
                      <TableCell className="text-blue-600">-</TableCell>
                      <TableCell className="text-blue-600">-</TableCell>
                      <TableCell className="text-blue-600">-</TableCell>
                      <TableCell className="text-blue-600">-</TableCell>
                      <TableCell className="font-medium text-blue-700">
                        {formatCurrency(2400)} {/* Annual contribution */}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Crash metai</p>
                <p className="text-red-600">18.7% tikimybė per metus</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Atsigavimo metai</p>
                <p className="text-orange-600">1-1.7 metų trukmė</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
              <Minus className="h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-orange-700">Correction metai</p>
                <p className="text-orange-500">50% tikimybė, 6-10 mėn.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Normalūs metai</p>
                <p className="text-green-600">Standartinės grąžos</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Rinkos scenarijų modeliai:</strong></p>
            
            <p><strong>Crash scenarijus:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Tikimybė:</strong> 18.7% kiekvienais metais</li>
              <li><strong>Drawdown:</strong> 15-45% priklausomai nuo aktyvų volatilumu (tik vizualizacijai)</li>
              <li><strong>Atsigavimas:</strong> 1-1.7 metų (atsitiktinai parenkama)</li>
              <li><strong>Skaičiavimas:</strong> Portfolio vertė skaičiuojama normaliai, drawdown rodomas tik grafike ir loguose</li>
            </ul>
            
            <p><strong>Correction scenarijus:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Tikimybė:</strong> 50% kiekvienais metais (išskyrus crash/recovery metus)</li>
              <li><strong>Drawdown:</strong> 5-30% priklausomai nuo aktyvų volatilumu (tik vizualizacijai)</li>
              <li><strong>Atsigavimas:</strong> 6-10 mėnesių (atsitiktinai parenkama)</li>
              <li><strong>Skaičiavimas:</strong> Portfolio vertė skaičiuojama normaliai, drawdown rodomas tik grafike ir loguose</li>
            </ul>
            
            <p className="mt-4"><strong>Aktyvų crash drawdown:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Mažo volatilumu (Auksas, ETF): 15-25%</li>
              <li>Vidutinio volatilumu (Augimo akcijos): 20-30%</li>
              <li>Didelio volatilumu (Sektorių ETF): 25-40%</li>
              <li>Labai didelio volatilumu (Kripto ETF, Leveraged): 35-45%</li>
              <li>Ekstremalu volatilumu (Kripto, Moonshot): 40-45%</li>
            </ul>
            
            <p className="mt-4"><strong>Aktyvų correction drawdown:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Mažo volatilumu (Auksas, ETF): 5-12%</li>
              <li>Vidutinio volatilumu (Augimo akcijos): 10-15%</li>
              <li>Didelio volatilumu (Sektorių ETF): 12-20%</li>
              <li>Labai didelio volatilumu (Kripto ETF, Leveraged): 18-30%</li>
              <li>Ekstremalu volatilumu (Kripto, Moonshot): 20-30%</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
