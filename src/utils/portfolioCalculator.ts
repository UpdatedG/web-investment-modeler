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
}

export function calculatePortfolio(inputs: InvestmentInputs, language: string = 'lt'): PortfolioAllocation {
  const { riskTolerance, sectorPreference, geographyPreference } = inputs;
  
  // Baziniai instrumentų aprašymai
  const baseInstruments = {
    etf: {
      name: getETFName(sectorPreference, geographyPreference, language),
      description: getETFDescription(sectorPreference, geographyPreference, language),
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
      returnRange: [-20, 60] // Extreme volatility
    },
    gold: {
      name: language === 'en' ? 'Gold' : 'Auksas',
      description: language === 'en' ? 'Physical gold or gold ETF (e.g. GLD, IAU) as inflation hedge' : 'Fizinis auksas arba aukso ETF (pvz. GLD, IAU) kaip infliacijos apsauga',
      returnRange: [3, 8] // Conservative commodity
    },
    options: {
      name: language === 'en' ? 'Options' : 'Opcionai',
      description: language === 'en' ? 'Stock options for high potential gains (SPY, QQQ options)' : 'Akcijų opcionai didelio potencialo pelno gavimui (SPY, QQQ opcionai)',
      returnRange: [-30, 80] // Very high volatility
    },
    leveraged: {
      name: language === 'en' ? 'Leveraged products' : 'Leveraged produktai',
      description: language === 'en' ? 'Leveraged investment products (e.g. TQQQ, UPRO)' : 'Finanisniais svertais pagrįsti investavimo produktai (pvz. TQQQ, UPRO)',
      returnRange: [25, 35] // Leveraged ETFs (3x)
    },
    moonshot: {
      name: language === 'en' ? 'Moonshot assets' : 'Moonshot aktyvai',
      description: language === 'en' ? 'Highly speculative assets (penny stocks, meme coins, SPAC)' : 'Itin spekuliatyvūs aktyvai (penny stocks, meme coins, SPAC)',
      returnRange: [-50, 100] // Extreme moonshot range
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

  return portfolioConfigs[riskTolerance];
}

function getETFName(sector: string, geography: string, language: string = 'lt'): string {
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

function getETFDescription(sector: string, geography: string, language: string = 'lt'): string {
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
export function generateRandomReturn(baseRange: [number, number], volatilityFactor: number = 1): number {
  const [min, max] = baseRange;
  const baseReturn = min + Math.random() * (max - min);
  
  // Add volatility (±20% of the base return by default)
  const volatility = baseReturn * 0.2 * volatilityFactor;
  const finalReturn = baseReturn + (Math.random() - 0.5) * 2 * volatility;
  
  return Math.max(-90, finalReturn); // Cap losses at -90%
}

// Calculate detailed projections with yearly breakdown including crash and correction scenarios
export function calculateDetailedProjections(inputs: InvestmentInputs, period: number, language: string = 'lt'): { 
  projectionData: Array<{ year: number; value: number; invested: number; bestCase: number; worstCase: number; volatileValue: number; }>;
  yearlyCalculations: YearlyCalculation[];
} {
  const portfolio = calculatePortfolio(inputs, language);
  const yearlyCalculations: YearlyCalculation[] = [];
  const projectionData = [];
  
  let currentValue = inputs.initialSum;
  let volatileValue = inputs.initialSum; // Track volatile value for graph
  let recoveryState: { 
    isRecovering: boolean; 
    targetValue: number; 
    recoveryTimeRemaining: number; 
    totalRecoveryTime: number;
  } = { isRecovering: false, targetValue: 0, recoveryTimeRemaining: 0, totalRecoveryTime: 0 };
  
  let correctionState: {
    isInCorrection: boolean;
    correctionTimeRemaining: number;
    totalCorrectionTime: number;
  } = { isInCorrection: false, correctionTimeRemaining: 0, totalCorrectionTime: 0 };
  
  for (let year = 0; year <= period; year++) {
    const totalInvested = inputs.initialSum + inputs.monthlyContribution * 12 * year;
    const annualContribution = inputs.monthlyContribution * 12;
    
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
        correctionRecoveryTimeRemaining: correctionState.correctionTimeRemaining
      };
      
      let newTotalValue = 0;
      let newVolatileValue = 0;
      
      // Calculate normal returns for actual portfolio value
      portfolio.instruments.forEach(instrument => {
        const allocation = currentValue * (instrument.percentage / 100);
        const volatileAllocation = volatileValue * (instrument.percentage / 100);
        const returnRange = (instrument as any).returnRange || [5, 10];
        const normalReturn = generateRandomReturn(returnRange);
        const instrumentValue = allocation * (1 + normalReturn / 100) + (annualContribution * (instrument.percentage / 100));
        
        // Calculate volatile value with drawdowns
        let volatileInstrumentValue = volatileAllocation * (1 + normalReturn / 100) + (annualContribution * (instrument.percentage / 100));
        
        // For logging purposes, calculate drawdowns but don't apply them to actual value
        let crashDrawdown: number | undefined;
        let correctionDrawdown: number | undefined;
        let isRecovering = false;
        let isCorrection = false;
        let recoveryProgress: number | undefined;
        let correctionRecoveryProgress: number | undefined;
        
        if (isCrashYear) {
          const rawCrashDrawdown = calculateCrashLoss(instrument.name);
          
          // For gold, leave drawdown blank and add to ROI
          if (instrument.name.includes('Auksas')) {
            // Add the negative drawdown (positive gain) to the return
            const goldBoost = Math.abs(rawCrashDrawdown);
            volatileInstrumentValue = volatileAllocation * (1 + (normalReturn + goldBoost) / 100) + (annualContribution * (instrument.percentage / 100));
            crashDrawdown = undefined; // Leave blank for gold
          } else {
            crashDrawdown = Math.abs(rawCrashDrawdown);
            // Apply crash drawdown to volatile value
            volatileInstrumentValue = volatileAllocation * (1 - crashDrawdown / 100) + (annualContribution * (instrument.percentage / 100));
          }
          
          recoveryState.targetValue = currentValue + annualContribution;
          recoveryState.totalRecoveryTime = 1 + Math.random() * 0.7; // 1-1.7 years
          recoveryState.recoveryTimeRemaining = recoveryState.totalRecoveryTime;
          recoveryState.isRecovering = true;
          
          if (recoveryState.totalRecoveryTime <= 1) {
            // Recovery completes within this year
            isRecovering = true;
            recoveryProgress = 1;
            recoveryState.isRecovering = false;
          } else {
            // Recovery continues beyond this year
            isRecovering = true;
            recoveryProgress = 1 / recoveryState.totalRecoveryTime;
            recoveryState.recoveryTimeRemaining -= 1;
          }
        } else if (recoveryState.isRecovering) {
          // Continuing recovery from previous crash
          if (recoveryState.recoveryTimeRemaining <= 1) {
            // Recovery completes this year
            isRecovering = true;
            recoveryProgress = 1;
            recoveryState.isRecovering = false;
          } else {
            // Still recovering
            isRecovering = true;
            recoveryProgress = (recoveryState.totalRecoveryTime - recoveryState.recoveryTimeRemaining + 1) / recoveryState.totalRecoveryTime;
            recoveryState.recoveryTimeRemaining -= 1;
          }
        } else if (isCorrectionYear) {
          const rawCorrectionDrawdown = calculateCorrectionLoss(instrument.name);
          
          // For gold, leave drawdown blank and add to ROI
          if (instrument.name.includes('Auksas')) {
            // Add the negative drawdown (positive gain) to the return
            const goldBoost = Math.abs(rawCorrectionDrawdown);
            volatileInstrumentValue = volatileAllocation * (1 + (normalReturn + goldBoost) / 100) + (annualContribution * (instrument.percentage / 100));
            correctionDrawdown = undefined; // Leave blank for gold
          } else {
            correctionDrawdown = Math.abs(rawCorrectionDrawdown);
            // Apply correction drawdown to volatile value
            volatileInstrumentValue = volatileAllocation * (1 - correctionDrawdown / 100) + (annualContribution * (instrument.percentage / 100));
          }
          
          correctionState.totalCorrectionTime = 0.5 + Math.random() * 0.33; // 6-10 months
          correctionState.correctionTimeRemaining = correctionState.totalCorrectionTime;
          correctionState.isInCorrection = true;
          
          isCorrection = true;
          correctionRecoveryProgress = 1; // Assume full recovery within 6-10 months
          
          if (correctionState.totalCorrectionTime <= 1) {
            correctionState.isInCorrection = false;
          } else {
            correctionState.correctionTimeRemaining -= 1;
          }
        } else if (correctionState.isInCorrection) {
          // Continuing correction recovery
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
        newVolatileValue += volatileInstrumentValue;
      });
      
      yearCalculation.totalValue = newTotalValue;
      currentValue = newTotalValue;
      volatileValue = newVolatileValue;
      yearlyCalculations.push(yearCalculation);
    }
    
    projectionData.push({
      year,
      value: Math.round(currentValue),
      invested: totalInvested,
      bestCase: Math.round(currentValue * 1.3),
      worstCase: Math.round(currentValue * 0.7),
      volatileValue: Math.round(volatileValue)
    });
  }
  
  return { projectionData, yearlyCalculations };
}
