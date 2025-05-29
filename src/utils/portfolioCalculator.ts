
import type { InvestmentInputs, PortfolioAllocation } from '@/pages/Index';

export function calculatePortfolio(inputs: InvestmentInputs): PortfolioAllocation {
  const { riskTolerance, sectorPreference, geographyPreference } = inputs;
  
  // Baziniai instrumentų aprašymai
  const baseInstruments = {
    etf: {
      name: getETFName(sectorPreference, geographyPreference),
      description: getETFDescription(sectorPreference, geographyPreference)
    },
    growthStock: {
      name: 'Augimo akcijos',
      description: 'Didelio potencialo įmonių akcijos su stipriu augimu'
    },
    cryptoETF: {
      name: 'Kriptovaliutų ETF',
      description: 'Diversifikuotas kriptovaliutų fondas'
    },
    crypto: {
      name: 'Kriptovaliutos',
      description: 'Tiesioginės kriptovaliutų investicijos (Bitcoin, Ethereum)'
    },
    gold: {
      name: 'Auksas',
      description: 'Fizinis auksas arba aukso ETF kaip infliacijos apsauga'
    },
    options: {
      name: 'Opcionai',
      description: 'Akcijų opcionai didelio potencialo pelno gavimui'
    },
    leveraged: {
      name: 'Leveraged produktai',
      description: 'Finanisniais svertais pagrįsti investavimo produktai'
    },
    moonshot: {
      name: 'Moonshot aktyvai',
      description: 'Itin spekuliatyvūs aktyvai su ekstremalia rizika ir galimybe'
    }
  };

  // Portfolio konfigūracijos pagal rizikos lygį
  const portfolioConfigs = [
    {
      riskLevel: 'Minimali rizika',
      instruments: [
        { ...baseInstruments.etf, percentage: 100 }
      ],
      warning: undefined
    },
    {
      riskLevel: 'Maža rizika',
      instruments: [
        { ...baseInstruments.etf, percentage: 50 },
        { ...baseInstruments.growthStock, percentage: 50 }
      ],
      warning: undefined
    },
    {
      riskLevel: 'Vidutinė rizika',
      instruments: [
        { ...baseInstruments.growthStock, percentage: 50 },
        { ...baseInstruments.etf, percentage: 30 },
        { ...baseInstruments.cryptoETF, percentage: 10 },
        { ...baseInstruments.gold, percentage: 10 }
      ],
      warning: 'Vidutinė rizika gali būti per didelė pradedantiesiems investuotojams.'
    },
    {
      riskLevel: 'Didesnė rizika',
      instruments: [
        { ...baseInstruments.growthStock, percentage: 50 },
        { ...baseInstruments.options, percentage: 20 },
        { ...baseInstruments.leveraged, percentage: 20 },
        { ...baseInstruments.crypto, percentage: 10 }
      ],
      warning: 'Šis portfolio nėra rekomenduojamas pradedantiesiems investuotojams dėl padidėjusios rizikos.'
    },
    {
      riskLevel: 'Didelė rizika',
      instruments: [
        { ...baseInstruments.growthStock, percentage: 30 },
        { ...baseInstruments.crypto, percentage: 30 },
        { ...baseInstruments.leveraged, percentage: 30 },
        { ...baseInstruments.options, percentage: 10 }
      ],
      warning: 'DIDELĖ RIZIKA: Šis portfolio yra labai spekuliatyvus ir gali sukelti didelius nuostolius. Rekomenduojamas tik patyrusiems investuotojams.'
    },
    {
      riskLevel: 'Ultra rizika',
      instruments: [
        { ...baseInstruments.crypto, percentage: 30 },
        { ...baseInstruments.options, percentage: 30 },
        { ...baseInstruments.leveraged, percentage: 30 },
        { ...baseInstruments.moonshot, percentage: 10 }
      ],
      warning: 'EKSTREMALI RIZIKA: Šis portfolio gali sukelti visiško kapitalo praradimą. Investuokite tik tuos pinigus, kuriuos galite prarasti.'
    }
  ];

  return portfolioConfigs[riskTolerance];
}

function getETFName(sector: string, geography: string): string {
  if (sector !== 'general') {
    const sectorNames: Record<string, string> = {
      technology: 'Technologijų ETF',
      healthcare: 'Sveikatos sektorius ETF',
      energy: 'Energetikos ETF',
      automotive: 'Automobilių ETF',
      realestate: 'Nekilnojamojo turto ETF'
    };
    return sectorNames[sector] || 'VWCE ETF';
  }

  const geoNames: Record<string, string> = {
    global: 'VWCE ETF (Vanguard FTSE All-World)',
    europe: 'Europos rinkų ETF',
    emerging: 'Besivystančių rinkų ETF'
  };

  return geoNames[geography] || 'VWCE ETF';
}

function getETFDescription(sector: string, geography: string): string {
  if (sector !== 'general') {
    const sectorDescriptions: Record<string, string> = {
      technology: 'Diversifikuotas technologijų sektorius ETF su daugiau nei 100 įmonių',
      healthcare: 'Sveikatos sektorius ir biotechnologijų ETF',
      energy: 'Atsinaujinančios energetikos ir energijos ETF',
      automotive: 'Automobilių pramonės ir elektrinių automobilių ETF',
      realestate: 'Nekilnojamojo turto investicinių fondų (REIT) ETF'
    };
    return sectorDescriptions[sector] || 'Plačiai diversifikuotas ETF fondas';
  }

  const geoDescriptions: Record<string, string> = {
    global: 'Pasaulio akcijų indeksas su daugiau nei 4000 įmonių',
    europe: 'Europos šalių akcijų indeksas',
    emerging: 'Besivystančių šalių akcijų indeksas'
  };

  return geoDescriptions[geography] || 'Plačiai diversifikuotas ETF fondas';
}
