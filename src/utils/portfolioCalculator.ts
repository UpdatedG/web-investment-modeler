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

// Calculate crash loss based on asset volatility
function calculateCrashLoss(instrumentName: string): number {
  // Gold spikes during crashes, so return positive value
  if (instrumentName.includes('Auksas') || instrumentName.includes('Auksas')) {
    return -(15 + Math.random() * 10); // -15% to -25% (negative because gold goes up)
  }
  
  // Map instruments to volatility levels and crash loss ranges
  const crashLossMap: Record<string, [number, number]> = {
    // Low volatility assets (bonds, utilities equivalent)
    'ETF': [15, 25],
    
    // Moderate volatility (broad market ETFs)
    'Augimo akcijos': [20, 30],
    
    // High volatility (sector/regional ETFs)
    'Technologijų ETF': [25, 35],
    'Sveikatos sektorius ETF': [25, 35],
    'Energetikos ETF': [25, 35],
    'Europos rinkų ETF': [25, 35],
    'Besivystančių rinkų ETF': [30, 40],
    
    // Very high volatility (individual stocks, leveraged)
    'Kriptovaliutų ETF': [35, 45],
    'Leveraged produktai': [40, 45],
    'Opcionai': [40, 45],
    
    // Extreme volatility (crypto, moonshots)
    'Kriptovaliutos': [40, 45],
    'Moonshot aktyvai': [40, 45]
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
  if (instrumentName.includes('Auksas') || instrumentName.includes('Auksas')) {
    return -(5 + Math.random() * 5); // -5% to -10% (negative because gold goes up)
  }
  
  // Corrections are typically 10-20% losses, scaled by volatility
  const correctionLossMap: Record<string, [number, number]> = {
    // Low volatility assets
    'ETF': [8, 12],
    
    // Moderate volatility
    'Augimo akcijos': [10, 15],
    
    // High volatility
    'Technologijų ETF': [12, 18],
    'Sveikatos sektorius ETF': [12, 18],
    'Energetikos ETF': [12, 18],
    'Europos rinkų ETF': [12, 18],
    'Besivystančių rinkų ETF': [15, 20],
    
    // Very high volatility
    'Kriptovaliutų ETF': [18, 25],
    'Leveraged produktai': [20, 30],
    'Opcionai': [20, 30],
    
    // Extreme volatility
    'Kriptovaliutos': [20, 30],
    'Moonshot aktyvai': [20, 30]
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
export function calculateDetailedProjections(inputs: InvestmentInputs, period: number): { 
  projectionData: Array<{ year: number; value: number; invested: number; bestCase: number; worstCase: number; volatileValue: number; }>;
  yearlyCalculations: YearlyCalculation[];
} {
  const portfolio = calculatePortfolio(inputs);
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
