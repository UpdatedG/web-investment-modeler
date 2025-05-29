
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';

export const Disclaimer = () => {
  return (
    <Card className="mt-12 border-orange-200 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="font-semibold text-orange-900">Svarbus pranešimas</h3>
            <div className="text-sm text-orange-800 space-y-2">
              <p>
                <strong>Tai nėra finansiniai patarimai.</strong> Pateikta informacija skirta tik švietimo tikslams ir neturėtų būti laikoma individualizuotais investavimo patarimais.
              </p>
              <p>
                <strong>Investavimo rizikos:</strong> Bet koks investavimas gali atnešti tiek pelną, tiek nuostolius. Praeities veikla negarantuoja ateities rezultatų.
              </p>
              <p>
                <strong>Atsakomybės išsisakymas:</strong> Šio skaičiuoklės kūrėjai neprisiima jokios atsakomybės už sprendimus, priimtus remiantis šia informacija.
              </p>
              <p>
                <strong>Rekomendacija:</strong> Prieš priimant investavimo sprendimus, rekomenduojame pasikonsultuoti su kvalifikuotais finansų specialistais.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2 border-t border-orange-200">
              <Info className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-orange-700">
                Paskutinis atnaujinimas: 2025-05-29 | Duomenys atnaujinami periodiškai
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
