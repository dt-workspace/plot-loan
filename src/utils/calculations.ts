// Utility functions for financial calculations and formatting

export interface LoanCalculationParams {
  principal: number;
  interestRate: number;
  tenure: number;
}

export interface LoanCalculationResult {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

/**
 * Calculate EMI for a loan
 */
export const calculateEMI = (params: LoanCalculationParams): LoanCalculationResult => {
  const { principal, interestRate, tenure } = params;

  if (principal <= 0 || interestRate <= 0 || tenure <= 0) {
    return {
      monthlyEMI: 0,
      totalInterest: 0,
      totalAmount: 0,
      yearlyBreakdown: []
    };
  }

  const monthlyRate = interestRate / 12 / 100;
  const numberOfPayments = tenure * 12;

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyEMI = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) /
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalAmount = monthlyEMI * numberOfPayments;
  const totalInterest = totalAmount - principal;

  // Calculate yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let remainingBalance = principal;

  for (let year = 1; year <= tenure; year++) {
    const beginningBalance = remainingBalance;
    let yearlyPayment = 0;
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    // Calculate for 12 months or until loan is paid off
    for (let month = 1; month <= 12 && remainingBalance > 0; month++) {
      const monthlyInterest = remainingBalance * monthlyRate;
      const monthlyPrincipal = Math.min(monthlyEMI - monthlyInterest, remainingBalance);

      yearlyInterest += monthlyInterest;
      yearlyPrincipal += monthlyPrincipal;
      yearlyPayment += monthlyInterest + monthlyPrincipal;
      remainingBalance -= monthlyPrincipal;
    }

    yearlyBreakdown.push({
      year,
      beginningBalance,
      payment: yearlyPayment,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      endingBalance: Math.max(0, remainingBalance)
    });

    if (remainingBalance <= 0) break;
  }

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    yearlyBreakdown
  };
};

/**
 * Calculate projected salary based on growth rate
 */
export const calculateProjectedSalary = (
  currentSalary: number,
  growthRate: number,
  years: number
): number => {
  if (currentSalary <= 0 || years < 0) return 0;
  return Math.round(currentSalary * Math.pow(1 + growthRate / 100, years));
};

/**
 * Calculate FOIR (Fixed Obligation to Income Ratio)
 */
export const calculateFOIR = (monthlyEMI: number, monthlyIncome: number): number => {
  if (monthlyIncome <= 0) return 0;
  return Math.round((monthlyEMI / monthlyIncome) * 100 * 100) / 100;
};

/**
 * Calculate maximum loan amount based on income and FOIR
 */
export const calculateMaxLoanAmount = (
  monthlyIncome: number,
  maxFOIR: number,
  interestRate: number,
  tenure: number,
  existingEMI: number = 0
): number => {
  const maxEMI = (monthlyIncome * maxFOIR) / 100;
  const availableEMI = maxEMI - existingEMI;

  if (availableEMI <= 0) return 0;

  const monthlyRate = interestRate / 12 / 100;
  const numberOfPayments = tenure * 12;

  // Reverse EMI calculation to get principal
  const maxLoanAmount = availableEMI * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) /
                       (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));

  return Math.round(maxLoanAmount);
};

/**
 * Calculate plot total cost including registration and stamp duty
 */
export const calculatePlotTotalCost = (
  size: number,
  pricePerSqFt: number,
  registrationRate: number = 1,
  stampDutyRate: number = 5,
  otherCharges: number = 0
): {
  baseCost: number;
  registrationCost: number;
  stampDuty: number;
  totalCost: number;
} => {
  const baseCost = size * pricePerSqFt;
  const registrationCost = (baseCost * registrationRate) / 100;
  const stampDuty = (baseCost * stampDutyRate) / 100;
  const totalCost = baseCost + registrationCost + stampDuty + otherCharges;

  return {
    baseCost: Math.round(baseCost),
    registrationCost: Math.round(registrationCost),
    stampDuty: Math.round(stampDuty),
    totalCost: Math.round(totalCost)
  };
};

/**
 * Calculate future value with appreciation
 */
export const calculateFutureValue = (
  presentValue: number,
  appreciationRate: number,
  years: number
): number => {
  if (presentValue <= 0 || years < 0) return 0;
  return Math.round(presentValue * Math.pow(1 + appreciationRate / 100, years));
};

/**
 * Calculate risk level based on FOIR and other factors
 */
export const calculateRiskLevel = (
  currentFOIR: number,
  projectedFOIR: number,
  ageAtLoanEnd: number,
  hasEmergencyFund: boolean = false
): 'low' | 'medium' | 'high' => {
  let riskScore = 0;

  // FOIR risk
  if (currentFOIR > 40) riskScore += 3;
  else if (currentFOIR > 30) riskScore += 2;
  else if (currentFOIR > 20) riskScore += 1;

  // Projected FOIR risk
  if (projectedFOIR > 45) riskScore += 2;
  else if (projectedFOIR > 35) riskScore += 1;

  // Age risk
  if (ageAtLoanEnd > 65) riskScore += 2;
  else if (ageAtLoanEnd > 60) riskScore += 1;

  // Emergency fund bonus
  if (hasEmergencyFund) riskScore -= 1;

  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount: number, compact: boolean = false): string => {
  if (amount === 0) return '₹0';

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (compact) {
    if (absAmount >= 10000000) { // 1 crore
      return `${sign}₹${(absAmount / 10000000).toFixed(1)}Cr`;
    } else if (absAmount >= 100000) { // 1 lakh
      return `${sign}₹${(absAmount / 100000).toFixed(1)}L`;
    } else if (absAmount >= 1000) { // 1 thousand
      return `${sign}₹${(absAmount / 1000).toFixed(1)}K`;
    }
  }

  return `${sign}₹${absAmount.toLocaleString('en-IN')}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with Indian number system
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[₹,\s]/g, '');
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Calculate monthly savings required for a target
 */
export const calculateMonthlySavings = (
  targetAmount: number,
  timeInYears: number,
  currentSavings: number = 0,
  interestRate: number = 6
): number => {
  if (timeInYears <= 0) return targetAmount;

  const monthlyRate = interestRate / 12 / 100;
  const numberOfMonths = timeInYears * 12;

  // Future value of current savings
  const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, numberOfMonths);

  // Remaining amount needed
  const remainingAmount = targetAmount - futureValueOfCurrentSavings;

  if (remainingAmount <= 0) return 0;

  // Monthly savings needed using PMT formula
  const monthlySavings = remainingAmount * monthlyRate /
                        (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

  return Math.round(monthlySavings);
};

/**
 * Calculate debt-to-income ratio
 */
export const calculateDebtToIncomeRatio = (
  totalMonthlyDebt: number,
  monthlyIncome: number
): number => {
  if (monthlyIncome <= 0) return 0;
  return Math.round((totalMonthlyDebt / monthlyIncome) * 100 * 100) / 100;
};

/**
 * Generate amortization schedule
 */
export const generateAmortizationSchedule = (
  principal: number,
  interestRate: number,
  tenure: number
): {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}[] => {
  const schedule = [];
  const monthlyRate = interestRate / 12 / 100;
  const numberOfPayments = tenure * 12;

  const monthlyEMI = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) /
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  let remainingBalance = principal;

  for (let month = 1; month <= numberOfPayments; month++) {
    const monthlyInterest = remainingBalance * monthlyRate;
    const monthlyPrincipal = Math.min(monthlyEMI - monthlyInterest, remainingBalance);

    remainingBalance -= monthlyPrincipal;

    schedule.push({
      month,
      payment: Math.round(monthlyEMI),
      principal: Math.round(monthlyPrincipal),
      interest: Math.round(monthlyInterest),
      balance: Math.round(Math.max(0, remainingBalance))
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
};

/**
 * Calculate tax benefits (approximate)
 */
export const calculateTaxBenefits = (
  principalAmount: number,
  interestAmount: number,
  isFirstHome: boolean = false
): {
  principalDeduction: number;
  interestDeduction: number;
  totalBenefit: number;
} => {
  // Section 80C - Principal repayment (max 1.5L)
  const principalDeduction = Math.min(principalAmount, 150000);

  // Section 24 - Interest deduction
  const maxInterestDeduction = isFirstHome ? 200000 : 200000; // Same for both currently
  const interestDeduction = Math.min(interestAmount, maxInterestDeduction);

  // Assuming 30% tax bracket
  const taxRate = 0.30;
  const totalBenefit = (principalDeduction + interestDeduction) * taxRate;

  return {
    principalDeduction,
    interestDeduction,
    totalBenefit: Math.round(totalBenefit)
  };
};

/**
 * Validate financial inputs
 */
export const validateFinancialInputs = (inputs: {
  salary?: number;
  emi?: number;
  plotSize?: number;
  pricePerSqFt?: number;
  downPayment?: number;
  interestRate?: number;
  tenure?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (inputs.salary !== undefined && inputs.salary <= 0) {
    errors.push('Salary must be greater than 0');
  }

  if (inputs.emi !== undefined && inputs.emi < 0) {
    errors.push('EMI cannot be negative');
  }

  if (inputs.plotSize !== undefined && inputs.plotSize <= 0) {
    errors.push('Plot size must be greater than 0');
  }

  if (inputs.pricePerSqFt !== undefined && inputs.pricePerSqFt <= 0) {
    errors.push('Price per sq ft must be greater than 0');
  }

  if (inputs.downPayment !== undefined && (inputs.downPayment < 0 || inputs.downPayment > 100)) {
    errors.push('Down payment must be between 0 and 100 percent');
  }

  if (inputs.interestRate !== undefined && (inputs.interestRate <= 0 || inputs.interestRate > 50)) {
    errors.push('Interest rate must be between 0 and 50 percent');
  }

  if (inputs.tenure !== undefined && (inputs.tenure <= 0 || inputs.tenure > 50)) {
    errors.push('Loan tenure must be between 1 and 50 years');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculate optimal down payment
 */
export const calculateOptimalDownPayment = (
  totalCost: number,
  availableFunds: number,
  interestRate: number,
  tenure: number,
  monthlyIncome: number,
  maxFOIR: number
): {
  optimalDownPayment: number;
  optimalPercentage: number;
  reasoning: string;
} => {
  const maxEMI = (monthlyIncome * maxFOIR) / 100;

  // Calculate minimum down payment needed to keep EMI within FOIR
  let minDownPayment = 0;
  for (let dp = 0; dp <= totalCost; dp += totalCost * 0.01) {
    const loanAmount = totalCost - dp;
    const emi = calculateEMI({ principal: loanAmount, interestRate, tenure }).monthlyEMI;

    if (emi <= maxEMI) {
      minDownPayment = dp;
      break;
    }
  }

  const optimalDownPayment = Math.max(minDownPayment, Math.min(availableFunds, totalCost * 0.30));
  const optimalPercentage = (optimalDownPayment / totalCost) * 100;

  let reasoning = '';
  if (optimalDownPayment === minDownPayment) {
    reasoning = 'Minimum down payment to meet FOIR requirements';
  } else if (optimalDownPayment === availableFunds) {
    reasoning = 'Using all available funds for down payment';
  } else {
    reasoning = 'Optimal balance between EMI and liquidity';
  }

  return {
    optimalDownPayment: Math.round(optimalDownPayment),
    optimalPercentage: Math.round(optimalPercentage),
    reasoning
  };
};
