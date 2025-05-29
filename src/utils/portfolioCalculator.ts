
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
      description: 'Didelio potencialo įmonių akcijos (pvz. Apple, Microsoft, Tesla, Google)'
    },
    cryptoETF: {
      name: 'Kriptovaliutų ETF',
      description: 'Diversifikuotas kriptovaliutų fondas (pvz. BITO, ETHE)'
    },
    crypto: {
      name: 'Kriptovaliutos',
      description: 'Tiesioginės kriptovaliutų investicijos (Bitcoin, Ethereum, Solana)'
    },
    gold: {
      name: 'Auksas',
      description: 'Fizinis auksas arba aukso ETF (pvz. GLD, IAU) kaip infliacijos apsauga'
    },
    options: {
      name: 'Opcionai',
      description: 'Akcijų opcionai didelio potencialo pelno gavimui (SPY, QQQ opcionai)'
    },
    leveraged: {
      name: 'Leveraged produktai',
      description: 'Finanisniais svertais pagrįsti investavimo produktai (pvz. TQQQ, UPRO)'
    },
    moonshot: {
      name: 'Moonshot aktyvai',
      description: 'Itin spekuliatyvūs aktyvai (penny stocks, meme coins, SPAC)'
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
      technology: 'Technologijų ETF (pvz. VGT, XLK)',
      healthcare: 'Sveikatos sektorius ETF (pvz. VHT, XLV)',
      energy: 'Energetikos ETF (pvz. VDE, XLE)',
      automotive: 'Automobilių ETF (pvz. CARZ, DRIV)',
      realestate: 'Nekilnojamojo turto ETF (pvz. VNQ, REIT)'
    };
    return sectorNames[sector] || 'VWCE ETF';
  }

  const geoNames: Record<string, string> = {
    global: 'VWCE ETF (Vanguard FTSE All-World)',
    europe: 'Europos rinkų ETF (pvz. VGK, EZU)',
    emerging: 'Besivystančių rinkų ETF (pvz. VWO, EEM)'
  };

  return geoNames[geography] || 'VWCE ETF';
}

function getETFDescription(sector: string, geography: string): string {
  if (sector !== 'general') {
    const sectorDescriptions: Record<string, string> = {
      technology: 'Diversifikuotas technologijų sektorius ETF su daugiau nei 100 įmonių (Apple, Microsoft, Google)',
      healthcare: 'Sveikatos sektorius ir biotechnologijų ETF (Johnson & Johnson, Pfizer, UnitedHealth)',
      energy: 'Atsinaujinančios energetikos ir energijos ETF (Exxon, Chevron, NextEra Energy)',
      automotive: 'Automobilių pramonės ir elektrinių automobilių ETF (Tesla, Ford, GM)',
      realestate: 'Nekilnojamojo turto investicinių fondų (REIT) ETF (diversifikuotas NT portfolio)'
    };
    return sectorDescriptions[sector] || 'Plačiai diversifikuotas ETF fondas';
  }

  const geoDescriptions: Record<string, string> = {
    global: 'Pasaulio akcijų indeksas su daugiau nei 4000 įmonių (Apple, Microsoft, ASML, Samsung)',
    europe: 'Europos šalių akcijų indeksas (ASML, SAP, LVMH, Nestle)',
    emerging: 'Besivystančių šalių akcijų indeksas (Taiwan Semi, Alibaba, Samsung, Tencent)'
  };

  return geoDescriptions[geography] || 'Plačiai diversifikuotas ETF fondas';
}
