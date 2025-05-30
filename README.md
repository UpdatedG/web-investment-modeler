# r/6nuliai Investment Calculator

A web-based investment scenario generator that helps users plan their investment strategies by calculating projected portfolio growth based on various risk models and financial instruments. This calculator uses real historical market data to provide realistic projections for different investment scenarios.

## Purpose and Functionality

This investment calculator provides:

- **Portfolio Allocation**: Generates diversified investment portfolios based on user preferences
- **Growth Projections**: Calculates projected portfolio value over time using historical market data
- **Risk Assessment**: Offers different risk models from conservative to aggressive strategies
- **Scenario Analysis**: Shows optimistic, pessimistic, and volatile market scenarios
- **Interactive Visualization**: Charts and graphs to visualize portfolio breakdown and growth projections
- **Performance Metrics**: CAGR calculation, Sharpe ratio analysis, and risk-adjusted returns
- **Contribution Analysis**: Breakdown of contributions vs. investment growth vs. inflation impact
- **Risk Statistics**: Comprehensive drawdown tracking, volatility analysis, and margin call detection
- **Educational Features**: Active management warnings with academic research backing
- **Bilingual Support**: Available in Lithuanian and English

### Key Features

- Age-based investment recommendations
- Family situation considerations
- Customizable initial investment and monthly contributions
- Time horizon planning (5-30 years)
- Risk tolerance assessment
- Geographic and sector preference settings
- **Management preference selection** with educational warnings
- Real-time calculation debugging table
- Historical volatility modeling
- **Contribution vs. Growth breakdown charts** with inflation tracking
- **Sharpe ratio performance metrics** with risk-adjusted returns
- **Contribution scenario analysis** (stopping vs. doubling contributions)
- **Comprehensive risk statistics** including drawdown tracking and margin call detection
- **Active management education** with research-backed warnings about underperformance
- **"The Brutal Truth" modal** showing academic research on active vs. passive investing

## How Calculations Are Made

### Portfolio Allocation
The calculator uses a semi-sophisticated algorithm that considers:
- **Age factor**: Younger investors get higher stock allocation
- **Risk tolerance**: User's comfort level with market volatility
- **Time horizon**: Longer periods allow for more aggressive strategies
- **Family situation**: Affects risk capacity and liquidity needs

### Growth Projections
Calculations are based on:
- **Historical Returns**: Uses real market data averages for different asset classes
- **Compound Interest**: Applies monthly contributions with compound growth
- **Volatility Modeling**: Incorporates realistic-ish market fluctuations
- **Multiple Scenarios**: 
  - **Optimistic**: Above-average market performance
  - **Expected**: Historical average returns
  - **Pessimistic**: Below-average performance with market downturns
  - **Volatile**: Realistic year-to-year fluctuations

### Accuracy
- **Approximate accuracy**: ±15-25% over 10+ year periods. The for higher risk asset classes that include options and crypto ETF accuracy is "ballpark" due to lack of historical data and testing
- **Based on**: Historical market data from major European and global indices
- **Limitations**: Past performance does not guarantee future results
- **Volatility**: Real markets experience significant short-term fluctuations

The calculator is designed for educational and planning purposes, mostly visualisation. Always consult with qualified financial advisors for personalized investment advice.

### Active Management Education

The calculator includes an educational feature that demonstrates the challenges of active investment management:

- **Smart Portfolio Adaptation**: When users select "medium-active" or "active" management preferences, ETF allocations are automatically replaced with individual stock picks (e.g., "Technology ETF" becomes "Tech stocks (Apple, Microsoft, Google, Tesla)")
- **Research-Based Warnings**: Users receive warnings about expected underperformance based on academic research
- **"The Brutal Truth" Modal**: Clicking "Why?" opens a comprehensive modal with academic research showing:
  - 98%+ of active stock pickers underperform the market over 20 years
  - 88.99% of large-cap US funds underperformed the S&P 500 over 10 years  
  - 90% of retail investors lose money or underperform the broader market
  - Detailed findings from Barber & Odean (Berkeley) and DALBAR research studies
- **Educational Purpose**: This feature helps users understand why passive index investing typically outperforms active stock picking for most investors

**Note**: The underlying calculations remain mathematically identical regardless of management preference - only the display names and educational warnings change.

### WARNING
- **This is mostly vibecoded stuff dont hate me for it**

### Known issues
- **Low accuracy for highest-risk assets**
- **Sector and geography preferences DO impact calculations** with different return ranges (Technology: 18.3-18.8%, Energy: 2.1-4.8%, etc.)
- **Management preference is purely educational** - it only changes display names and warnings, not actual calculations

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React hooks
- **Data Fetching**: TanStack React Query

## Requirements

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/UpdatedG/web-investment-modeler.git
   cd web-investment-modeler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Environment Configuration

No environment variables are required for basic functionality. The application runs entirely on the client side.

## Default Language Setting

To set English as the default language, modify `src/pages/Index.tsx`:
```typescript
const [isEnglish, setIsEnglish] = useState(true); // Change false to true
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── *-en.tsx        # English versions of components
│   └── *.tsx           # Lithuanian versions of components
├── pages/              # Page components
├── utils/              # Utility functions and calculations
├── hooks/              # Custom React hooks
└── lib/                # Library configurations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This calculator is for educational and planning purposes only. It provides estimates based on historical data and mathematical models. Investment returns are not guaranteed, and actual results may vary significantly. Always consult with qualified financial professionals before making investment decisions.

## Support

For questions, feedback, or issues:
- Create an issue on GitHub
- Contact via Reddit: u/violt
- Submit feedback through the application

## Acknowledgments

- Historical market data sources
- r/6nuliai community for feedback and testing
- Open source libraries and tools used in this project
