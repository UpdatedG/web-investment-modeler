import type { InvestmentInputs, PortfolioAllocation } from '@/pages/Index';

export interface YearlyCalculation {
  year: number;
  instruments: Array<{
    name: string;
    percentage: number;
    annualReturn: number;
    value: number;
    crashDrawdown?: number;
    correctionDrawdown?: number;
    isRecovering?: boolean;
    isCorrection?: boolean;
    recoveryProgress?: number;
    correctionRecoveryProgress?: number;
  }>;
  totalValue: number;
  totalInvested: number;
  isCrashYear?: boolean;
  isRecoveryYear?: boolean;
  isCorrectionYear?: boolean;
  recoveryTimeRemaining?: number;
  correctionRecoveryTimeRemaining?: number;
  volatileValue?: number;
  isLowestPoint?: boolean;
  drawdownFromPeak?: number;
  isMarginCall?: boolean;
  netImpact?: number;
}

export function calculatePortfolio(inputs: InvestmentInputs, language: string = 'lt'): PortfolioAllocation {
  const { riskTolerance, sectorPreference, geographyPreference, managementPreference } = inputs;
  
  // Baziniai instrumentų aprašymai
  const baseInstruments = {
    etf: {
      name: getETFName(sectorPreference, geographyPreference, language, managementPreference),
      description: getETFDescription(sectorPreference, geographyPreference, language, managementPreference),
      returnRange: getETFReturnRange(sectorPreference, geographyPreference)
    },
    growthStock: {
      name: language === 'en' ? 'Growth stocks' : 'Augimo akcijos',
      description: language === 'en' ? 'High potential company stocks (e.g. Apple, Microsoft, Tesla, Google)' : 'Didelio potencialo įmonių akcijos (pvz. Apple, Microsoft, Tesla, Google)',
      returnRange: [10, 15] // Generic stocks (Large Cap)
    },
    cryptoETF: {
      name: language === 'en' ? 'Crypto ETF' : 'Kriptovaliutų ETF',
      description: language === 'en' ? 'Diversified cryptocurrency fund (e.g. BITO, ETHE)' : 'Diversifikuotas kriptovaliutų fondas (pvz. BITO, ETHE)',
      returnRange: [15, 35] // Crypto ETFs - using moderate estimate
    },
    crypto: {
      name: language === 'en' ? 'Cryptocurrencies' : 'Kriptovaliutos',
      description: language === 'en' ? 'Direct cryptocurrency investments (Bitcoin, Ethereum, Solana)' : 'Tiesioginės kriptovaliutų investicijos (Bitcoin, Ethereum, Solana)',
      returnRange: [10, 50] // High volatility around 30% average - BTC/ETH/SOL mix
    },
    gold: {
      name: language === 'en' ? 'Gold' : 'Auksas',
      description: language === 'en' ? 'Physical gold or gold ETF (e.g. GLD, IAU) as inflation hedge' : 'Fizinis auksas arba aukso ETF (pvz. GLD, IAU) kaip infliacijos apsauga',
      returnRange: [3, 8] // Conservative commodity
    },
    options: {
      name: language === 'en' ? 'Options' : 'Opcionai',
      description: language === 'en' ? 'LEAPS options for leveraged stock exposure (SPY, QQQ options)' : 'LEAPS opcionai leveraged akcijų ekspozicijai (SPY, QQQ opcionai)',
      returnRange: [15, 75] // 3x leveraged stock returns (3x of ~5-25% stock range)
    },
    leveraged: {
      name: language === 'en' ? 'Leveraged products' : 'Leveraged produktai',
      description: language === 'en' ? 'Leveraged investment products (e.g. TQQQ, UPRO)' : 'Finanisniais svertais pagrįsti investavimo produktai (pvz. TQQQ, UPRO)',
      returnRange: [25, 35] // Leveraged ETFs (3x) - 32% YoY historical
    },
    moonshot: {
      name: language === 'en' ? 'Moonshot assets' : 'Moonshot aktyvai',
      description: language === 'en' ? 'Highly speculative lottery-ticket assets (penny stocks, meme coins, SPAC)' : 'Itin spekuliatyvūs loterijos bilieto tipo aktyvai (penny stocks, meme coins, SPAC)',
      returnRange: [-80, 500] // Lottery ticket model - frequent losses, rare massive gains
    }
  };

  // Portfolio konfigūracijos pagal rizikos lygį
  const portfolioConfigs = [
    {
      riskLevel: language === 'en' ? 'Minimal risk' : 'Minimali rizika',
      instruments: [
        { ...baseInstruments.etf, percentage: 100 }
      ],
      warning: undefined
    },
    {
      riskLevel: language === 'en' ? 'Low risk' : 'Maža rizika',
      instruments: [
        { ...baseInstruments.etf, percentage: 50 },
        { ...baseInstruments.growthStock, percentage: 50 }
      ],
      warning: undefined
    },
    {
      riskLevel: language === 'en' ? 'Medium risk' : 'Vidutinė rizika',
      instruments: [
        { ...baseInstruments.growthStock, percentage: 50 },
        { ...baseInstruments.etf, percentage: 30 },
        { ...baseInstruments.cryptoETF, percentage: 10 },
        { ...baseInstruments.gold, percentage: 10 }
      ],
      warning: language === 'en' ? 'Medium risk may be too high for beginner investors.' : 'Vidutinė rizika gali būti per didelė pradedantiesiems investuotojams.'
    },
    {
      riskLevel: language === 'en' ? 'Higher risk' : 'Didesnė rizika',
      instruments: [
        { ...baseInstruments.growthStock, percentage: 50 },
        { ...baseInstruments.options, percentage: 20 },
        { ...baseInstruments.leveraged, percentage: 20 },
        { ...baseInstruments.crypto, percentage: 10 }
      ],
      warning: language === 'en' ? 'This portfolio is not recommended for beginner investors due to increased risk.' : 'Šis portfolio nėra rekomenduojamas pradedantiesiems investuotojams dėl padidėjusios rizikos.'
    },
    {
      riskLevel: language === 'en' ? 'High risk' : 'Didelė rizika',
      instruments: [
        { ...baseInstruments.growthStock, percentage: 30 },
        { ...baseInstruments.crypto, percentage: 30 },
        { ...baseInstruments.leveraged, percentage: 30 },
        { ...baseInstruments.options, percentage: 10 }
      ],
      warning: language === 'en' ? 'HIGH RISK: This portfolio is very speculative and can cause large losses. Recommended only for experienced investors.' : 'DIDELĖ RIZIKA: Šis portfolio yra labai spekuliatyvus ir gali sukelti didelius nuostolius. Rekomenduojamas tik patyrusiems investuotojams.'
    },
    {
      riskLevel: language === 'en' ? 'Ultra risk' : 'Ultra rizika',
      instruments: [
        { ...baseInstruments.crypto, percentage: 30 },
        { ...baseInstruments.options, percentage: 30 },
        { ...baseInstruments.leveraged, percentage: 30 },
        { ...baseInstruments.moonshot, percentage: 10 }
      ],
      warning: language === 'en' ? 'EXTREME RISK: This portfolio can cause total capital loss. Only invest money you can afford to lose.' : 'EKSTREMALI RIZIKA: Šis portfolio gali sukelti visiško kapitalo praradimą. Investuokite tik tuos pinigus, kuriuos galite prarasti.'
    }
  ];

  const portfolio = portfolioConfigs[riskTolerance];
  
  // Add management warning for active management
  if (managementPreference >= 1) {
    const managementWarning = managementPreference === 1 
      ? (language === 'en' 
          ? 'You have selected medium-active management: Please note that unless you are a professional investor with vast experience, your actual results are expected to be noticeably worse.' 
          : 'Jūs pasirinkote vidutiniškai aktyvų valdymą: Atkreipkite dėmesį, kad nebent esate profesionalus investuotojas su didžiule patirtimi, jūsų tikri rezultatai tikėtina bus prastesni.')
      : (language === 'en' 
          ? 'You have selected active management: Please note that unless you are a professional investor with vast experience, your actual results are expected to be very significantly worse.' 
          : 'Jūs pasirinkote aktyvų valdymą: Atkreipkite dėmesį, kad nebent esate profesionalus investuotojas su didžiule patirtimi, jūsų tikri rezultatai tikėtina bus žymiai prastesni.');
    
    portfolio.warning = portfolio.warning 
      ? `${managementWarning} ${portfolio.warning}`
      : managementWarning;
  }

  return portfolio;
}

function getETFName(sector: string, geography: string, language: string = 'lt', managementPreference: number = 0): string {
  // Trolling: Replace ETFs with individual stocks for active management
  if (managementPreference >= 1) {
    if (sector !== 'general') {
      const sectorStocks: Record<string, string> = {
        technology: language === 'en' ? 'Tech stocks (Apple, Microsoft, Google, Tesla)' : 'Technologijų akcijos (Apple, Microsoft, Google, Tesla)',
        healthcare: language === 'en' ? 'Healthcare stocks (Johnson & Johnson, Pfizer, Moderna)' : 'Sveikatos sektorius akcijos (Johnson & Johnson, Pfizer, Moderna)',
        energy: language === 'en' ? 'Energy stocks (ExxonMobil, Shell, BP)' : 'Energetikos akcijos (ExxonMobil, Shell, BP)',
        automotive: language === 'en' ? 'Auto stocks (Tesla, Ford, BMW, Toyota)' : 'Automobilių akcijos (Tesla, Ford, BMW, Toyota)',
        realestate: language === 'en' ? 'REIT stocks (American Tower, Prologis, Crown Castle)' : 'REIT akcijos (American Tower, Prologis, Crown Castle)'
      };
      return sectorStocks[sector] || (language === 'en' ? 'Individual stocks (S&P 500 picks)' : 'Individualios akcijos (S&P 500 atranka)');
    }

    const geoStocks: Record<string, string> = {
      global: language === 'en' ? 'Global stocks (Apple, Microsoft, ASML, Samsung)' : 'Globalios akcijos (Apple, Microsoft, ASML, Samsung)',
      europe: language === 'en' ? 'European stocks (ASML, SAP, Nestlé, LVMH)' : 'Europos akcijos (ASML, SAP, Nestlé, LVMH)',
      emerging: language === 'en' ? 'Emerging market stocks (Taiwan Semi, Tencent, Alibaba)' : 'Besivystančių rinkų akcijos (Taiwan Semi, Tencent, Alibaba)'
    };

    return geoStocks[geography] || (language === 'en' ? 'Individual stocks (S&P 500 picks)' : 'Individualios akcijos (S&P 500 atranka)');
  }

  // Original ETF logic for passive management
  if (sector !== 'general') {
    const sectorNames: Record<string, string> = {
      technology: language === 'en' ? 'Technology ETF (e.g. EQQQ, IITU)' : 'Technologijų ETF (pvz. EQQQ, IITU)',
      healthcare: language === 'en' ? 'Healthcare ETF (e.g. HEAL, IEHS)' : 'Sveikatos sektorius ETF (pvz. HEAL, IEHS)',
      energy: language === 'en' ? 'Energy ETF (e.g. INRG, IQQH)' : 'Energetikos ETF (pvz. INRG, IQQH)',
      automotive: language === 'en' ? 'Automotive ETF (e.g. ECAR, DRIV)' : 'Automobilių ETF (pvz. ECAR, DRIV)',
      realestate: language === 'en' ? 'Real Estate ETF (e.g. IPRP, EPRA)' : 'Nekilnojamojo turto ETF (pvz. IPRP, EPRA)'
    };
    return sectorNames[sector] || (language === 'en' ? 'VWCE ETF' : 'VWCE ETF');
  }

  const geoNames: Record<string, string> = {
    global: language === 'en' ? 'Global ETF (VWCE, IWDA, SWDA)' : 'Globalūs ETF (VWCE, IWDA, SWDA)',
    europe: language === 'en' ? 'European markets ETF (IEUS, VMEU, CSSPX)' : 'Europos rinkų ETF (IEUS, VMEU, CSSPX)',
    emerging: language === 'en' ? 'Emerging markets ETF (EIMI, IEMM, VFEM)' : 'Besivystančių rinkų ETF (EIMI, IEMM, VFEM)'
  };

  return geoNames[geography] || (language === 'en' ? 'VWCE ETF' : 'VWCE ETF');
}

function getETFDescription(sector: string, geography: string, language: string = 'lt', managementPreference: number = 0): string {
  // Trolling: Change descriptions for active management
  if (managementPreference >= 1) {
    if (sector !== 'general') {
      const sectorStockDescriptions: Record<string, string> = {
        technology: language === 'en' ? 'Hand-picked technology stocks for active portfolio management' : 'Rankiniu būdu atrinktos technologijų akcijos aktyviam portfolio valdymui',
        healthcare: language === 'en' ? 'Selected healthcare and biotech stocks for targeted exposure' : 'Atrinktos sveikatos sektorius ir biotechnologijų akcijos tikslinei ekspozicijai',
        energy: language === 'en' ? 'Individual energy company stocks for sector concentration' : 'Individualios energetikos įmonių akcijos sektorinei koncentracijai',
        automotive: language === 'en' ? 'Carefully selected automotive stocks for industry focus' : 'Kruopščiai atrinktos automobilių akcijos pramonės šakos fokusui',
        realestate: language === 'en' ? 'Individual REIT stocks for real estate exposure' : 'Individualios REIT akcijos nekilnojamojo turto ekspozicijai'
      };
      return sectorStockDescriptions[sector] || (language === 'en' ? 'Actively managed individual stock selection' : 'Aktyviai valdomos individualios akcijos');
    }

    const geoStockDescriptions: Record<string, string> = {
      global: language === 'en' ? 'Hand-picked global market leaders for active management' : 'Rankiniu būdu atrinkti globalūs rinkos lyderiai aktyviam valdymui',
      europe: language === 'en' ? 'Selected European blue-chip stocks for regional focus' : 'Atrinktos Europos mėlynųjų lustų akcijos regioniniam fokusui',
      emerging: language === 'en' ? 'Targeted emerging market stocks for growth potential' : 'Tikslinės besivystančių rinkų akcijos augimo potencialui'
    };

    return geoStockDescriptions[geography] || (language === 'en' ? 'Actively managed individual stock selection' : 'Aktyviai valdomos individualios akcijos');
  }

  // Original ETF descriptions for passive management
  if (sector !== 'general') {
    const sectorDescriptions: Record<string, string> = {
      technology: language === 'en' ? 'Technology sector ETF (18.3% - 18.8% average annual return)' : 'Technologijų sektorius ETF (18.3% - 18.8% vidutinis metinis grąža)',
      healthcare: language === 'en' ? 'Healthcare and biotech ETF (8.5% - 10.2% average annual return)' : 'Sveikatos sektorius ir biotechnologijų ETF (8.5% - 10.2% vidutinis metinis grąža)',
      energy: language === 'en' ? 'Energy sector ETF (2.1% - 4.8% average annual return)' : 'Energetikos ETF (2.1% - 4.8% vidutinis metinis grąža)',
      automotive: language === 'en' ? 'Automotive industry ETF (moderate growth)' : 'Automobilių pramonės ETF (moderatus augimas)',
      realestate: language === 'en' ? 'Real Estate Investment Trust (REIT) ETF (7.2% - 8.8% average annual return)' : 'Nekilnojamojo turto investicinių fondų (REIT) ETF (7.2% - 8.8% vidutinis metinis grąža)'
    };
    return sectorDescriptions[sector] || (language === 'en' ? 'Broadly diversified ETF fund' : 'Plačiai diversifikuotas ETF fondas');
  }

  const geoDescriptions: Record<string, string> = {
    global: language === 'en' ? 'Global market index (12.8% - 13.2% average annual return)' : 'Globalūs rinkų indeksas (12.8% - 13.2% vidutinis metinis grąža)',
    europe: language === 'en' ? 'European countries stock index (6.8% - 8.2% average annual return)' : 'Europos šalių akcijų indeksas (6.8% - 8.2% vidutinis metinis grąža)',
    emerging: language === 'en' ? 'Emerging countries stock index (4.2% - 6.1% average annual return)' : 'Besivystančių šalių akcijų indeksas (4.2% - 6.1% vidutinis metinis grąža)'
  };

  return geoDescriptions[geography] || (language === 'en' ? 'Broadly diversified ETF fund' : 'Plačiai diversifikuotas ETF fondas');
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

// Calculate crash loss based on asset volatility
function calculateCrashLoss(instrumentName: string): number {
  // Gold spikes during crashes, so return positive value
  if (instrumentName.includes('Auksas') || instrumentName.includes('Gold')) {
    return -(15 + Math.random() * 10); // -15% to -25% (negative because gold goes up)
  }
  
  // Map instruments to volatility levels and crash loss ranges
  const crashLossMap: Record<string, [number, number]> = {
    // Low volatility assets (bonds, utilities equivalent)
    'ETF': [15, 25],
    
    // Moderate volatility (broad market ETFs)
    'Augimo akcijos': [20, 30],
    'Growth stocks': [20, 30],
    
    // High volatility (sector/regional ETFs)
    'Technologijų ETF': [25, 35],
    'Technology ETF': [25, 35],
    'Sveikatos sektorius ETF': [25, 35],
    'Healthcare ETF': [25, 35],
    'Energetikos ETF': [25, 35],
    'Energy ETF': [25, 35],
    'Europos rinkų ETF': [25, 35],
    'European markets ETF': [25, 35],
    'Besivystančių rinkų ETF': [30, 40],
    'Emerging markets ETF': [30, 40],
    
    // Very high volatility (individual stocks, leveraged)
    'Kriptovaliutų ETF': [35, 45],
    'Crypto ETF': [35, 45],
    'Leveraged produktai': [40, 45],
    'Leveraged products': [40, 45],
    'Opcionai': [40, 45],
    'Options': [40, 45],
    
    // Extreme volatility (crypto, moonshots)
    'Kriptovaliutos': [40, 45],
    'Cryptocurrencies': [40, 45],
    'Moonshot aktyvai': [40, 45],
    'Moonshot assets': [40, 45]
  };
  
  // Find matching instrument type
  for (const [key, range] of Object.entries(crashLossMap)) {
    if (instrumentName.includes(key) || instrumentName.includes('ETF')) {
      return range[0] + Math.random() * (range[1] - range[0]);
    }
  }
  
  // Default to moderate crash loss
  return 20 + Math.random() * 10; // 20-30%
}

// Calculate correction loss (smaller than crash) based on asset volatility
function calculateCorrectionLoss(instrumentName: string): number {
  // Gold spikes during corrections too
  if (instrumentName.includes('Auksas') || instrumentName.includes('Gold')) {
    return -(5 + Math.random() * 5); // -5% to -10% (negative because gold goes up)
  }
  
  // Corrections are typically 10-20% losses, scaled by volatility
  const correctionLossMap: Record<string, [number, number]> = {
    // Low volatility assets
    'ETF': [8, 12],
    
    // Moderate volatility
    'Augimo akcijos': [10, 15],
    'Growth stocks': [10, 15],
    
    // High volatility
    'Technologijų ETF': [12, 18],
    'Technology ETF': [12, 18],
    'Sveikatos sektorius ETF': [12, 18],
    'Healthcare ETF': [12, 18],
    'Energetikos ETF': [12, 18],
    'Energy ETF': [12, 18],
    'Europos rinkų ETF': [12, 18],
    'European markets ETF': [12, 18],
    'Besivystančių rinkų ETF': [15, 20],
    'Emerging markets ETF': [15, 20],
    
    // Very high volatility
    'Kriptovaliutų ETF': [18, 25],
    'Crypto ETF': [18, 25],
    'Leveraged produktai': [20, 30],
    'Leveraged products': [20, 30],
    'Opcionai': [20, 30],
    'Options': [20, 30],
    
    // Extreme volatility
    'Kriptovaliutos': [20, 30],
    'Cryptocurrencies': [20, 30],
    'Moonshot aktyvai': [20, 30],
    'Moonshot assets': [20, 30]
  };
  
  // Find matching instrument type
  for (const [key, range] of Object.entries(correctionLossMap)) {
    if (instrumentName.includes(key) || instrumentName.includes('ETF')) {
      return range[0] + Math.random() * (range[1] - range[0]);
    }
  }
  
  // Default to moderate correction loss
  return 10 + Math.random() * 5; // 10-15%
}

// Generate random return within asset's range with additional volatility
export function generateRandomReturn(baseRange: [number, number], volatilityFactor: number = 1, assetName?: string): number {
  const [min, max] = baseRange;
  
  // Special handling for moonshot assets - lottery ticket model
  if (assetName && (assetName.includes('Moonshot') || assetName.includes('moonshot'))) {
    // 85% chance of loss (-80% to -10%), 15% chance of big gain (50% to 500%)
    if (Math.random() < 0.85) {
      return -80 + Math.random() * 70; // -80% to -10%
    } else {
      return 50 + Math.random() * 450; // 50% to 500%
    }
  }
  
  const baseReturn = min + Math.random() * (max - min);
  
  // Reduce volatility multiplier to prevent excessive swings
  const volatility = baseReturn * 0.15 * volatilityFactor; // Reverted back to 0.15
  const finalReturn = baseReturn + (Math.random() - 0.5) * 2 * volatility;
  
  return Math.max(-95, finalReturn); // Cap losses at -95% (margin call territory)
}

// Generate random inflation rate based on historical data
function generateInflationRate(): number {
  // Use more conservative inflation: mostly around 2% with occasional spikes
  // 80% chance of 1.5-2.5%, 20% chance of 2.5-4%
  if (Math.random() < 0.8) {
    return 1.5 + Math.random() * 1.0; // 1.5% to 2.5%
  } else {
    return 2.5 + Math.random() * 1.5; // 2.5% to 4% (higher years)
  }
}

// Calculate detailed projections with yearly breakdown including crash and correction scenarios
export function calculateDetailedProjections(inputs: InvestmentInputs, period: number, language: string = 'lt'): { 
  projectionData: Array<{ 
    year: number; 
    value: number; 
    invested: number; 
    bestCase: number; 
    worstCase: number; 
    volatileValue: number;
    contributions: number;
    growth: number;
    inflationAdjustedValue: number;
    annualInflation: number;
  }>;
  yearlyCalculations: YearlyCalculation[];
  drawdownStats: {
    lowestValue: number;
    lowestValueYear: number;
    maxDrawdownPercent: number;
    maxDrawdownYear: number;
    peakValue: number;
    peakValueYear: number;
    isMarginCalled: boolean;
    marginCallYear?: number;
  };
  performanceMetrics: {
    cagr: number;
    sharpeRatio: number;
    totalContributions: number;
    totalGrowth: number;
    inflationImpact: number;
  };
} {
  const portfolio = calculatePortfolio(inputs, language);
  const yearlyCalculations: YearlyCalculation[] = [];
  const projectionData = [];
  
  let currentValue = inputs.initialSum;
  let peakValue = inputs.initialSum;
  let peakValueYear = 0;
  let lowestValue = inputs.initialSum;
  let lowestValueYear = 0;
  let maxDrawdownPercent = 0;
  let maxDrawdownYear = 0;
  let isMarginCalled = false;
  let marginCallYear: number | undefined;
  
  // Track inflation and real values
  let cumulativeInflation = 1;
  let totalContributions = inputs.initialSum;
  let annualReturns: number[] = [];
  
  // Track crash impacts and recovery
  let pendingCrashImpact = 0; // Amount to be recovered over time
  let pendingCorrectionImpact = 0; // Amount to be recovered over time
  
  let recoveryState: { 
    isRecovering: boolean; 
    targetValue: number; 
    recoveryTimeRemaining: number; 
    totalRecoveryTime: number;
    yearlyRecoveryAmount: number;
  } = { isRecovering: false, targetValue: 0, recoveryTimeRemaining: 0, totalRecoveryTime: 0, yearlyRecoveryAmount: 0 };
  
  let correctionState: {
    isInCorrection: boolean;
    correctionTimeRemaining: number;
    totalCorrectionTime: number;
    yearlyRecoveryAmount: number;
  } = { isInCorrection: false, correctionTimeRemaining: 0, totalCorrectionTime: 0, yearlyRecoveryAmount: 0 };
  
  for (let year = 0; year <= period; year++) {
    const totalInvested = inputs.initialSum + inputs.monthlyContribution * 12 * year;
    const annualContribution = inputs.monthlyContribution * 12;
    const annualInflation = year === 0 ? 0 : generateInflationRate();
    
    if (year > 0) {
      cumulativeInflation *= (1 + annualInflation / 100);
      totalContributions += annualContribution;
    }
    
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
        totalInvested: totalInvested,
        volatileValue: currentValue,
        drawdownFromPeak: 0,
        isLowestPoint: false,
        isMarginCall: false
      };
      yearlyCalculations.push(initialCalc);
    } else {
      // Check for crash (18.7% probability) - only if not in recovery or correction
      const isCrashYear = !recoveryState.isRecovering && !correctionState.isInCorrection && Math.random() < 0.187;
      
      // Check for correction (50% probability) - only if not crashing or recovering
      const isCorrectionYear = !isCrashYear && !recoveryState.isRecovering && !correctionState.isInCorrection && Math.random() < 0.5;
      
      const yearCalculation: YearlyCalculation = {
        year,
        instruments: [],
        totalValue: 0,
        totalInvested,
        isCrashYear,
        isRecoveryYear: recoveryState.isRecovering,
        isCorrectionYear,
        recoveryTimeRemaining: recoveryState.recoveryTimeRemaining,
        correctionRecoveryTimeRemaining: correctionState.correctionTimeRemaining,
        volatileValue: 0,
        drawdownFromPeak: 0,
        isLowestPoint: false,
        isMarginCall: false
      };
      
      let newTotalValue = 0;
      let crashImpact = 0;
      let correctionImpact = 0;
      let recoveryImpact = 0;
      
      // Calculate normal returns and apply crash/correction impacts
      portfolio.instruments.forEach(instrument => {
        const allocation = currentValue * (instrument.percentage / 100);
        const returnRange = (instrument as any).returnRange || [5, 10];
        const normalReturn = generateRandomReturn(returnRange, 1, instrument.name);
        
        // Apply normal growth to existing allocation
        const grownAllocation = allocation * (1 + normalReturn / 100);
        // Add contributions with partial year growth
        const contributionWithGrowth = (annualContribution * (instrument.percentage / 100)) * (1 + (normalReturn / 100) * 0.5);
        let instrumentValue = grownAllocation + contributionWithGrowth;
        
        // Calculate crash/correction impacts
        let crashDrawdown: number | undefined;
        let correctionDrawdown: number | undefined;
        let isRecovering = false;
        let isCorrection = false;
        let recoveryProgress: number | undefined;
        let correctionRecoveryProgress: number | undefined;
        
        if (isCrashYear) {
          const rawCrashDrawdown = calculateCrashLoss(instrument.name);
          
          if (instrument.name.includes('Auksas') || instrument.name.includes('Gold')) {
            // Gold gains during crashes - add to returns instead of showing drawdown
            const goldBoost = Math.abs(rawCrashDrawdown);
            instrumentValue = (allocation * (1 + (normalReturn + goldBoost) / 100)) + contributionWithGrowth;
            crashDrawdown = undefined;
          } else {
            crashDrawdown = Math.abs(rawCrashDrawdown);
            // Calculate crash impact on existing allocation only (not contributions)
            const crashImpactOnAllocation = grownAllocation * (crashDrawdown / 100);
            crashImpact += crashImpactOnAllocation;
            instrumentValue = grownAllocation - crashImpactOnAllocation + contributionWithGrowth;
          }
          
          // Set up recovery
          recoveryState.totalRecoveryTime = 1 + Math.random() * 0.7; // 1-1.7 years
          recoveryState.recoveryTimeRemaining = recoveryState.totalRecoveryTime;
          recoveryState.yearlyRecoveryAmount = crashImpact / recoveryState.totalRecoveryTime;
          recoveryState.isRecovering = true;
          
          isRecovering = true;
          recoveryProgress = Math.min(1, 1 / recoveryState.totalRecoveryTime);
          
          if (recoveryState.totalRecoveryTime <= 1) {
            recoveryState.isRecovering = false;
          } else {
            recoveryState.recoveryTimeRemaining -= 1;
          }
        } else if (recoveryState.isRecovering) {
          // Apply recovery
          const recoveryAmount = (allocation / currentValue) * recoveryState.yearlyRecoveryAmount;
          instrumentValue += recoveryAmount;
          recoveryImpact += recoveryAmount;
          
          isRecovering = true;
          recoveryProgress = (recoveryState.totalRecoveryTime - recoveryState.recoveryTimeRemaining) / recoveryState.totalRecoveryTime;
          
          if (recoveryState.recoveryTimeRemaining <= 1) {
            recoveryState.isRecovering = false;
          } else {
            recoveryState.recoveryTimeRemaining -= 1;
          }
        } else if (isCorrectionYear) {
          const rawCorrectionDrawdown = calculateCorrectionLoss(instrument.name);
          
          if (instrument.name.includes('Auksas') || instrument.name.includes('Gold')) {
            // Gold gains during corrections
            const goldBoost = Math.abs(rawCorrectionDrawdown);
            instrumentValue = (allocation * (1 + (normalReturn + goldBoost) / 100)) + contributionWithGrowth;
            correctionDrawdown = undefined;
          } else {
            correctionDrawdown = Math.abs(rawCorrectionDrawdown);
            // Calculate correction impact on existing allocation only
            const correctionImpactOnAllocation = grownAllocation * (correctionDrawdown / 100);
            correctionImpact += correctionImpactOnAllocation;
            instrumentValue = grownAllocation - correctionImpactOnAllocation + contributionWithGrowth;
          }
          
          // Set up correction recovery
          correctionState.totalCorrectionTime = 0.5 + Math.random() * 0.33; // 6-10 months
          correctionState.correctionTimeRemaining = correctionState.totalCorrectionTime;
          correctionState.yearlyRecoveryAmount = correctionImpact / correctionState.totalCorrectionTime;
          correctionState.isInCorrection = true;
          
          isCorrection = true;
          correctionRecoveryProgress = Math.min(1, 1 / correctionState.totalCorrectionTime);
          
          if (correctionState.totalCorrectionTime <= 1) {
            correctionState.isInCorrection = false;
          } else {
            correctionState.correctionTimeRemaining -= 1;
          }
        } else if (correctionState.isInCorrection) {
          // Apply correction recovery
          const recoveryAmount = (allocation / currentValue) * correctionState.yearlyRecoveryAmount;
          instrumentValue += recoveryAmount;
          recoveryImpact += recoveryAmount;
          
          if (correctionState.correctionTimeRemaining <= 1) {
            correctionState.isInCorrection = false;
          } else {
            correctionState.correctionTimeRemaining -= 1;
          }
        }
        
        yearCalculation.instruments.push({
          name: instrument.name,
          percentage: instrument.percentage,
          annualReturn: normalReturn,
          value: instrumentValue,
          crashDrawdown,
          correctionDrawdown,
          isRecovering,
          isCorrection,
          recoveryProgress,
          correctionRecoveryProgress
        });
        
        newTotalValue += instrumentValue;
      });
      
      // Calculate net impact for display
      let netImpact = 0;
      if (crashImpact > 0) {
        netImpact = -crashImpact; // Negative impact
      } else if (correctionImpact > 0) {
        netImpact = -correctionImpact; // Negative impact
      } else if (recoveryImpact > 0) {
        netImpact = recoveryImpact; // Positive impact
      }
      
      yearCalculation.totalValue = newTotalValue;
      yearCalculation.volatileValue = newTotalValue; // Same as total value now
      yearCalculation.netImpact = Math.round(netImpact);
      
      // Track overall peak for statistics and drawdown calculation
      if (newTotalValue > peakValue) {
        peakValue = newTotalValue;
        peakValueYear = year;
      }
      
      if (newTotalValue < lowestValue) {
        lowestValue = newTotalValue;
        lowestValueYear = year;
        yearCalculation.isLowestPoint = true;
      }
      
      // Calculate drawdown percentage from all-time high
      const currentDrawdown = peakValue > 0 ? ((peakValue - newTotalValue) / peakValue) * 100 : 0;
      yearCalculation.drawdownFromPeak = Math.max(0, currentDrawdown);
      
      if (currentDrawdown > maxDrawdownPercent) {
        maxDrawdownPercent = currentDrawdown;
        maxDrawdownYear = year;
      }
      
      // Check for margin call (portfolio value <= 0)
      if (newTotalValue <= 0 && !isMarginCalled) {
        isMarginCalled = true;
        marginCallYear = year;
        yearCalculation.isMarginCall = true;
        newTotalValue = 0; // Set to zero after margin call
      }
      
      currentValue = newTotalValue;
      
      // Track annual return for Sharpe ratio calculation
      if (year > 0) {
        const previousValue = projectionData[year - 1].value;
        const annualReturn = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
        annualReturns.push(annualReturn);
      }
      
      yearlyCalculations.push(yearCalculation);
    }
    
    projectionData.push({
      year,
      value: Math.round(currentValue),
      invested: totalInvested,
      bestCase: Math.round(currentValue * 1.3),
      worstCase: Math.round(currentValue * 0.7),
      volatileValue: Math.round(currentValue),
      contributions: Math.round(year === 0 ? inputs.initialSum : annualContribution),
      growth: Math.round(currentValue - totalContributions),
      inflationAdjustedValue: Math.round(currentValue / cumulativeInflation),
      annualInflation: Math.round(annualInflation * 100) / 100
    });
  }
  
  const drawdownStats = {
    lowestValue: Math.round(lowestValue),
    lowestValueYear,
    maxDrawdownPercent: Math.round(maxDrawdownPercent * 100) / 100,
    maxDrawdownYear,
    peakValue: Math.round(peakValue),
    peakValueYear,
    isMarginCalled,
    marginCallYear
  };
  
  const performanceMetrics = {
    cagr: calculateCAGR(totalContributions, currentValue, period),
    sharpeRatio: calculateSharpeRatio(annualReturns),
    totalContributions: Math.round(totalContributions),
    totalGrowth: Math.round(currentValue - totalContributions),
    inflationImpact: Math.round(currentValue - (currentValue / cumulativeInflation))
  };
  
  return { projectionData, yearlyCalculations, drawdownStats, performanceMetrics };
}

function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  if (years <= 0 || initialValue <= 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

function calculateSharpeRatio(returns: number[]): number {
  if (returns.length === 0) return 0;
  
  const riskFreeRate = 2.0; // Assume 2% risk-free rate
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const excessReturns = returns.map(r => r - riskFreeRate);
  const avgExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
  
  if (excessReturns.length < 2) return 0;
  
  const variance = excessReturns.reduce((sum, r) => sum + Math.pow(r - avgExcessReturn, 2), 0) / (excessReturns.length - 1);
  const stdDev = Math.sqrt(variance);
  
  return stdDev === 0 ? 0 : avgExcessReturn / stdDev;
}
