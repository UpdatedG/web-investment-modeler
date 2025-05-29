
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';

export const DisclaimerEn = () => {
  return (
    <Card className="mt-12 border-orange-200 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="font-semibold text-orange-900">Important Notice</h3>
            <div className="text-sm text-orange-800 space-y-2">
              <p>
                <strong>This is not financial advice.</strong> The information provided is for educational purposes only and should not be considered individualized investment advice.
              </p>
              <p>
                <strong>Investment risks:</strong> Any investment can bring both profits and losses. Past performance does not guarantee future results.
              </p>
              <p>
                <strong>Disclaimer:</strong> The creators of this calculator do not assume any responsibility for decisions made based on this information.
              </p>
              <p>
                <strong>Recommendation:</strong> Before making investment decisions, we recommend consulting with qualified financial professionals.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2 border-t border-orange-200">
              <Info className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-orange-700">
                Last updated: 2025-05-29 | Data is updated periodically
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
