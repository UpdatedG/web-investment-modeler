import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalculationsDebugTable } from '@/components/CalculationsDebugTable';
import type { YearlyCalculation } from '@/utils/portfolioCalculator';

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  yearlyCalculations: YearlyCalculation[];
  language: string;
}

export const DebugModal: React.FC<DebugModalProps> = ({ 
  isOpen, 
  onClose, 
  yearlyCalculations, 
  language 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Detailed Calculations' : 'Detalūs skaičiavimai'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CalculationsDebugTable 
            yearlyCalculations={yearlyCalculations} 
            language={language} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 