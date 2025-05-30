import React from 'react';
import { TrendingUp, Calculator, Globe, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderEnProps {
  onLanguageChange: () => void;
}

export const HeaderEn: React.FC<HeaderEnProps> = ({ onLanguageChange }) => {
  const handleFeedback = () => {
    window.open('https://www.reddit.com/message/compose/?to=violt&subject=r/6nuliai%20calculator', '_blank');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">r/6nuliai</h1>
              <p className="text-sm text-gray-600">Investment Calculator</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleFeedback}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Leave feedback</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onLanguageChange}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Lietuviškai</span>
            </Button>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">v0.3b</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
