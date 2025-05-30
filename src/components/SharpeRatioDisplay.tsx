import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SharpeRatioDisplayProps {
  sharpeRatio: number;
  cagr: number;
  isEnglish?: boolean;
}

export const SharpeRatioDisplay: React.FC<SharpeRatioDisplayProps> = ({ 
  sharpeRatio, 
  cagr,
  isEnglish = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSharpeRatingText = (ratio: number) => {
    if (ratio < 0) return isEnglish ? 'Poor' : 'Prastas';
    if (ratio < 0.5) return isEnglish ? 'Below Average' : 'Žemiau vidurkio';
    if (ratio < 1) return isEnglish ? 'Average' : 'Vidutinis';
    if (ratio < 1.5) return isEnglish ? 'Good' : 'Geras';
    if (ratio < 2) return isEnglish ? 'Very Good' : 'Labai geras';
    return isEnglish ? 'Excellent' : 'Puikus';
  };

  const getSharpeRatingColor = (ratio: number) => {
    if (ratio < 0) return 'text-red-600';
    if (ratio < 0.5) return 'text-orange-600';
    if (ratio < 1) return 'text-yellow-600';
    if (ratio < 1.5) return 'text-blue-600';
    if (ratio < 2) return 'text-green-600';
    return 'text-emerald-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{isEnglish ? 'Risk-Adjusted Performance' : 'Rizikos koreguota grąža'}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {isEnglish 
                    ? 'Risk-adjusted performance shows how much return you get per unit of risk taken. It accounts for volatility to give a clearer picture of investment efficiency.'
                    : 'Rizikos koreguota grąža rodo, kiek grąžos gaunate už kiekvieną rizikos vienetą. Ji atsižvelgia į volatilumą ir atskleidžia investicijų efektyvumą.'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {isEnglish ? 'Compound Annual Growth Rate (CAGR)' : 'Sudėtinė metinė augimo norma (CAGR)'}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {cagr.toFixed(2)}%
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {isEnglish ? 'Sharpe Ratio' : 'Sharpe koeficientas'}
              </p>
              <div className="flex items-center space-x-3">
                <p className="text-2xl font-bold">
                  {sharpeRatio.toFixed(2)}
                </p>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <Info className="h-5 w-5 text-blue-600" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {isEnglish ? 'Understanding Sharpe Ratio' : 'Sharpe koeficiento supratimas'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {isEnglish ? 'Sharpe Ratio Visual' : 'Sharpe koeficiento vizualizacija'}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center space-x-8">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              R
                            </div>
                            <p className="text-sm mt-2">{isEnglish ? 'Return' : 'Grąža'}</p>
                          </div>
                          <div className="text-2xl font-bold text-gray-600">-</div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              Rf
                            </div>
                            <p className="text-sm mt-2">{isEnglish ? 'Risk-free' : 'Be rizikos'}</p>
                          </div>
                          <div className="text-2xl font-bold text-gray-600">÷</div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              σ
                            </div>
                            <p className="text-sm mt-2">{isEnglish ? 'Risk' : 'Rizika'}</p>
                          </div>
                          <div className="text-2xl font-bold text-gray-600">=</div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              S
                            </div>
                            <p className="text-sm mt-2">{isEnglish ? 'Sharpe' : 'Sharpe'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <p>
                          {isEnglish 
                            ? 'The Sharpe ratio measures how much excess return you receive for the extra volatility you endure for holding a riskier asset.'
                            : 'Sharpe koeficientas matuoja, kiek papildomos grąžos gaunate už papildomą volatilumą, kurį patiriate laikydami rizikingesnius aktyvus.'
                          }
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">
                              {isEnglish ? 'Interpretation:' : 'Interpretacija:'}
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              <li>&lt; 0: {isEnglish ? 'Poor performance' : 'Prastas rezultatas'}</li>
                              <li>0-0.5: {isEnglish ? 'Below average' : 'Žemiau vidurkio'}</li>
                              <li>0.5-1: {isEnglish ? 'Average' : 'Vidutinis'}</li>
                              <li>1-1.5: {isEnglish ? 'Good' : 'Geras'}</li>
                              <li>1.5-2: {isEnglish ? 'Very good' : 'Labai geras'}</li>
                              <li>&gt; 2: {isEnglish ? 'Excellent' : 'Puikus'}</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium">
                              {isEnglish ? 'Formula:' : 'Formulė:'}
                            </p>
                            <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                              (Return - Risk-free rate) / Standard deviation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className={`text-sm font-medium ${getSharpeRatingColor(sharpeRatio)}`}>
                {getSharpeRatingText(sharpeRatio)}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">
              {isEnglish ? 'What this means:' : 'Ką tai reiškia:'}
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                {isEnglish 
                  ? `Your portfolio's risk-adjusted return is ${getSharpeRatingText(sharpeRatio).toLowerCase()}.`
                  : `Jūsų portfelio rizikos koreguota grąža yra ${getSharpeRatingText(sharpeRatio).toLowerCase()}.`
                }
              </p>
              <p>
                {isEnglish 
                  ? 'This metric helps compare investments with different risk levels.'
                  : 'Šis rodiklis padeda palyginti investicijas su skirtingais rizikos lygiais.'
                }
              </p>
              {sharpeRatio > 1 && (
                <p className="text-green-600 font-medium">
                  {isEnglish 
                    ? 'Your portfolio provides good compensation for the risk taken.'
                    : 'Jūsų portfelis gerai kompensuoja prisiimtą riziką.'
                  }
                </p>
              )}
              {sharpeRatio < 0.5 && (
                <p className="text-orange-600 font-medium">
                  {isEnglish 
                    ? 'Consider reducing risk or seeking higher returns.'
                    : 'Apsvarstykite rizikos mažinimą arba didesnės grąžos siekimą.'
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 