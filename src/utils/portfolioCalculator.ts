
import type { InvestmentInputs, PortfolioAllocation } from '@/pages/Index';

export interface YearlyCalculation {
  year: number;
  instruments: Array<{
    name: string;
    percentage: number;
    annualReturn: number;
    value: number;
  }>;
  totalValue: number;
  totalInvested: number;
}

export function calculatePortfolio(inputs: InvestmentInputs): PortfolioAllocation {
  const { riskTolerance, sectorPreference, geographyPreference } = inputs;
  
  // Baziniai instrumentų aprašymai
  const baseInstruments = {
    etf: {
      name: getETFName(sectorPreference, geographyPreference),
      description: getETFDescription(sectorPreference, geographyPreference),
      returnRange: getETFReturnRange(sectorPreference, geographyPreference)
    },
    growthStock: {
      name: 'Augimo akcijos',
      description: 'Didelio potencialo įmonių akcijos (pvz. Apple, Microsoft, Tesla, Google)',
      returnRange: [10, 15] // Generic stocks (Large Cap)
    },
    cryptoETF: {
      name: 'Kriptovaliutų ETF',
      description: 'Diversifikuotas kriptovaliutų fondas (pvz. BITO, ETHE)',
      returnRange: [15, 35] // Crypto ETFs - using moderate estimate
    },
    crypto: {
      name: 'Kriptovaliutos',
      description: 'Tiesioginės kriptovaliutų investicijos (Bitcoin, Ethereum, Solana)',
      returnRange: [-20, 60] // Extreme volatility
    },
    gold: {
      name: 'Auksas',
      description: 'Fizinis auksas arba aukso ETF (pvz. GLD, IAU) kaip infliacijos apsauga',
      returnRange: [3, 8] // Conservative commodity
    },
    options: {
      name: 'Opcionai',
      description: 'Akcijų opcionai didelio potencialo pelno gavimui (SPY, QQQ opcionai)',
      returnRange: [-30, 80] // Very high volatility
    },
    leveraged: {
      name: 'Leveraged produktai',
      description: 'Finanisniais svertais pagrįsti investavimo produktai (pvz. TQQQ, UPRO)',
      returnRange: [25, 35] // Leveraged ETFs (3x)
    },
    moonshot: {
      name: 'Moonshot aktyvai',
      description: 'Itin spekuliatyvūs aktyvai (penny stocks, meme coins, SPAC)',
      returnRange: [-50, 100] // Extreme moonshot range
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
      technology: 'Technologijų ETF (pvz. XLK, QQQ)',
      healthcare: 'Sveikatos sektorius ETF (pvz. VHT, XLV)',
      energy: 'Energetikos ETF (pvz. XLE)',
      automotive: 'Automobilių ETF (pvz. CARZ, DRIV)',
      realestate: 'Nekilnojamojo turto ETF (pvz. VNQ, XLRE)'
    };
    return sectorNames[sector] || 'VWCE ETF';
  }

  const geoNames: Record<string, string> = {
    global: 'Globalūs ETF (SPY, VTI, VOO)',
    europe: 'Europos rinkų ETF (EFA, VGK, IEFA)',
    emerging: 'Besivystančių rinkų ETF (EEM, VWO)'
  };

  return geoNames[geography] || 'VWCE ETF';
}

function getETFDescription(sector: string, geography: string): string {
  if (sector !== 'general') {
    const sectorDescriptions: Record<string, string> = {
      technology: 'Technologijų sektorius ETF (18.3% - 18.8% vidutinis metinis grąža)',
      healthcare: 'Sveikatos sektorius ir biotechnologijų ETF (8.5% - 10.2% vidutinis metinis grąža)',
      energy: 'Energetikos ETF (2.1% - 4.8% vidutinis metinis grąža)',
      automotive: 'Automobilių pramonės ETF (moderatus augimas)',
      realestate: 'Nekilnojamojo turto investicinių fondų (REIT) ETF (7.2% - 8.8% vidutinis metinis grąža)'
    };
    return sectorDescriptions[sector] || 'Plačiai diversifikuotas ETF fondas';
  }

  const geoDescriptions: Record<string, string> = {
    global: 'Globalūs rinkų indeksas (12.8% - 13.2% vidutinis metinis grąža)',
    europe: 'Europos šalių akcijų indeksas (6.8% - 8.2% vidutinis metinis grąža)',
    emerging: 'Besivystančių šalių akcijų indeksas (4.2% - 6.1% vidutinis metinis grąža)'
  };

  return geoDescriptions[geography] || 'Plačiai diversifikuotas ETF fondas';
}

function getETFReturnRange(sector: string, geography: string): [number, number] {
  if (sector !== 'general') {
    const sectorReturns: Record<string, [number, number]> = {
      technology: [18.3, 18.8], // Sector ETFs - Technology
      healthcare: [8.5, 10.2],  // Sector ETFs - Financial (closest match)
      energy: [2.1, 4.8],       // Sector ETFs - Energy
      automotive: [10, 15],     // Generic estimate
      realestate: [7.2, 8.8]    // REITs
    };
    return sectorReturns[sector] || [12.8, 13.2];
  }

  const geoReturns: Record<string, [number, number]> = {
    global: [12.8, 13.2],      // Global ETFs
    europe: [6.8, 8.2],        // Regional ETFs - Developed
    emerging: [4.2, 6.1]       // Regional ETFs - Emerging
  };

  return geoReturns[geography] || [12.8, 13.2];
}

// Generate random return within asset's range with additional volatility
export function generateRandomReturn(baseRange: [number, number], volatilityFactor: number = 1): number {
  const [min, max] = baseRange;
  const baseReturn = min + Math.random() * (max - min);
  
  // Add volatility (±20% of the base return by default)
  const volatility = baseReturn * 0.2 * volatilityFactor;
  const finalReturn = baseReturn + (Math.random() - 0.5) * 2 * volatility;
  
  return Math.max(-90, finalReturn); // Cap losses at -90%
}

// Calculate detailed projections with yearly breakdown
export function calculateDetailedProjections(inputs: InvestmentInputs, period: number): { 
  projectionData: Array<{ year: number; value: number; invested: number; bestCase: number; worstCase: number; }>;
  yearlyCalculations: YearlyCalculation[];
} {
  const portfolio = calculatePortfolio(inputs);
  const yearlyCalculations: YearlyCalculation[] = [];
  const projectionData = [];
  
  let currentValue = inputs.initialSum;
  
  for (let year = 0; year <= period; year++) {
    const totalInvested = inputs.initialSum + inputs.monthlyContribution * 12 * year;
    
    if (year === 0) {
      // Initial year
      const initialCalc: YearlyCalculation = {
        year: 0,
        instruments: portfolio.instruments.map(instrument => ({
          name: instrument.name,
          percentage: instrument.percentage,
          annualReturn: 0,
          value: currentValue * (instrument.percentage / 100)
        })),
        totalValue: currentValue,
        totalInvested: totalInvested
      };
      yearlyCalculations.push(initialCalc);
    } else {
      // Calculate returns for each instrument
      const yearCalculation: YearlyCalculation = {
        year,
        instruments: [],
        totalValue: 0,
        totalInvested
      };
      
      let newTotalValue = 0;
      
      portfolio.instruments.forEach(instrument => {
        const allocation = currentValue * (instrument.percentage / 100);
        const returnRange = (instrument as any).returnRange || [5, 10];
        const annualReturn = generateRandomReturn(returnRange);
        const instrumentValue = allocation * (1 + annualReturn / 100) + (inputs.monthlyContribution * 12 * (instrument.percentage / 100));
        
        yearCalculation.instruments.push({
          name: instrument.name,
          percentage: instrument.percentage,
          annualReturn: annualReturn,
          value: instrumentValue
        });
        
        newTotalValue += instrumentValue;
      });
      
      yearCalculation.totalValue = newTotalValue;
      currentValue = newTotalValue;
      yearlyCalculations.push(yearCalculation);
    }
    
    projectionData.push({
      year,
      value: Math.round(currentValue),
      invested: totalInvested,
      bestCase: Math.round(currentValue * 1.3),
      worstCase: Math.round(currentValue * 0.7)
    });
  }
  
  return { projectionData, yearlyCalculations };
}
