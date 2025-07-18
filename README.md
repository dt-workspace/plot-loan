# Plot Loan Calculator

A comprehensive React application for calculating and analyzing plot and construction loan details with financial impact assessment.

## Features

### 🏠 Home Investment Analysis
- **Plot Configuration**: Configure plot size and price per square foot
- **Construction Planning**: Optional construction area and cost calculations
- **Combined Loan Calculation**: Single loan covering both plot and construction costs
- **Financial Impact Assessment**: FOIR analysis and EMI capacity evaluation
- **Real-time Calculations**: Interactive sliders for instant loan detail updates

### 💰 Key Calculations
- Total project cost (plot + construction)
- Down payment requirements
- Monthly EMI calculations
- Total interest over loan tenure
- FOIR (Fixed Obligation to Income Ratio) analysis
- Available EMI capacity assessment

### 📊 Financial Metrics
- Current vs. projected FOIR comparison
- Risk level assessment (Low/Medium/High)
- EMI capacity analysis
- Loan affordability recommendations
- Construction cost planning

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom slider components and metric cards

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd plot-loan
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

### Basic Plot Loan Calculation
1. Configure your plot size and price per square foot
2. Set your preferred down payment percentage
3. Adjust interest rate and loan tenure
4. View calculated EMI and loan details

### Including Construction Costs
1. Enable "Include Construction" checkbox
2. Set construction area and price per square foot
3. The system will calculate a combined loan for both plot and construction
4. Review the total project cost and monthly EMI

### Financial Impact Analysis
- View your current FOIR vs. projected FOIR
- Check available EMI capacity after the investment
- Get risk assessment and recommendations
- Compare before and after investment scenarios

## Key Components

- **CurrentHome.tsx**: Main analysis component with loan calculations
- **MetricCard.tsx**: Reusable metric display components
- **CustomSlider.tsx**: Interactive input sliders
- **Store**: Zustand-based state management for user profile and calculations

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   └── tabs/            # Main tab components
├── store/               # State management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and calculations
└── assets/              # Static assets
```

## Configuration

The application uses several configurable parameters:

- **Plot Size**: 500 - 3000 sq ft
- **Plot Price**: ₹1,000 - ₹5,000 per sq ft
- **Construction Area**: 800 - 2,500 sq ft
- **Construction Price**: ₹1,200 - ₹3,000 per sq ft
- **Down Payment**: 10% - 50%
- **Interest Rate**: 7% - 12%
- **Loan Tenure**: 5 - 30 years

## Features in Detail

### Combined Loan Approach
Unlike traditional calculators that treat plot and construction as separate loans, this application calculates a single combined loan that includes:
- Plot acquisition cost
- Construction cost (if applicable)
- Single EMI for the entire project
- Unified down payment calculation

### FOIR Analysis
The application provides comprehensive FOIR (Fixed Obligation to Income Ratio) analysis:
- Current FOIR calculation
- Projected FOIR after investment
- Risk level assessment
- Recommendations based on financial capacity

### Interactive Configuration
- Real-time slider controls for all parameters
- Instant calculation updates
- Visual feedback for risk levels
- Comprehensive metric display

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the GitHub repository or contact the development team.