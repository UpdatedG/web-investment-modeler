import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface BrutalTruthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEnglish: boolean;
}

export const BrutalTruthModal: React.FC<BrutalTruthModalProps> = ({ 
  isOpen, 
  onClose, 
  isEnglish 
}) => {
  const content = {
    title: isEnglish ? 'The Brutal Truth' : 'Žiauri tiesa',
    subtitle: isEnglish ? 'Individual stock pickers dramatically underperform:' : 'Individualūs akcijų rinkėjai dramatiškai atsilieka:',
    stats: [
      isEnglish 
        ? '98%+ of active stock pickers underperform the market over 20 years'
        : '98%+ aktyvių akcijų rinkėjų atsilieka nuo rinkos per 20 metų',
      isEnglish
        ? '88.99% of large-cap US funds underperformed the S&P 500 over 10 years'
        : '88.99% didelių JAV fondų atsiliko nuo S&P 500 per 10 metų',
      isEnglish
        ? '90% of retail investors lose money or underperform the broader market'
        : '90% mažmeninių investuotojų praranda pinigus arba atsilieka nuo platesnės rinkos'
    ],
    research: {
      title: isEnglish ? 'Key Research Shows' : 'Pagrindiniai tyrimai rodo',
      studies: [
        {
          title: isEnglish ? 'Barber & Odean Study (Berkeley):' : 'Barber & Odean tyrimas (Berkeley):',
          points: [
            isEnglish 
              ? 'Individual investors underperform market indexes significantly'
              : 'Individualūs investuotojai žymiai atsilieka nuo rinkos indeksų',
            isEnglish
              ? 'The bottom 30% underperformed by 20-40%'
              : 'Žemiausi 30% atsiliko 20-40%',
            isEnglish
              ? 'Frequent traders performed even worse due to transaction costs and poor timing'
              : 'Dažni prekiautojai pasirodė dar blogiau dėl sandorių išlaidų ir prasto laiko pasirinkimo'
          ]
        },
        {
          title: isEnglish ? 'DALBAR Research:' : 'DALBAR tyrimai:',
          points: [
            isEnglish
              ? 'Average equity investor earned only 2.57% annually vs inflation of 3.14%'
              : 'Vidutinis akcijų investuotojas uždirbo tik 2.57% per metus, palyginti su 3.14% infliacija',
            isEnglish
              ? 'Typical investor underperforms by substantial margins due to behavioral errors'
              : 'Tipiškas investuotojas atsilieka dideliais skirtumais dėl elgesio klaidų',
            isEnglish
              ? 'Buy-and-hold strategies outperformed active trading by 2.8% on average'
              : 'Pirkti ir laikyti strategijos pranoko aktyvų prekiavimą vidutiniškai 2.8%'
          ]
        }
      ]
    },
    general: {
      title: isEnglish ? 'General Statistics' : 'Bendros statistikos',
      points: [
        isEnglish
          ? 'Average investor earned 9.3% annually vs funds/ETFs earning about 1.7% more'
          : 'Vidutinis investuotojas uždirbo 9.3% per metus, palyginti su fondais/ETF, kurie uždirbo apie 1.7% daugiau',
        isEnglish
          ? 'Passive index investing leads to better long-term returns than individual stock picking'
          : 'Pasyvus indeksų investavimas duoda geresnius ilgalaikius rezultatus nei individualių akcijų rinkimas'
      ]
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <DialogTitle className="text-2xl font-bold text-red-600">
              {content.title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-red-800 mb-3">{content.subtitle}</p>
            <ul className="space-y-2">
              {content.stats.map((stat, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-red-700">{stat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{content.research.title}</h3>
            <div className="space-y-4">
              {content.research.studies.map((study, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{study.title}</h4>
                  <ul className="space-y-1">
                    {study.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start space-x-2">
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-700 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">{content.general.title}</h3>
            <ul className="space-y-2">
              {content.general.points.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 