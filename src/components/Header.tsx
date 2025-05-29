
import React from 'react';
import { TrendingUp, Calculator } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InvestLT</h1>
              <p className="text-sm text-gray-600">Investavimo skaičiuoklė</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Pradedantiesiems</span>
          </div>
        </div>
      </div>
    </header>
  );
};
