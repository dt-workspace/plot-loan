// Core data types for the Plot Planner application

export interface UserProfile {
  currentSalary: number;
  salaryGrowthRate: number;
  currentEMI: number;
  maxFOIR: number; // Fixed Obligation to Income Ratio
  riskTolerance: "low" | "medium" | "high";
  preferredLoanTenure: number;
}

export interface ConstructionData {
  includeConstruction: boolean;
  constructionArea: number; // in sq ft
  constructionPricePerSqFt: number;
  constructionCost: number;
  constructionTimeframe: number; // in months
}

export interface PlotData {
  id: string;
  name: string;
  location: string;
  size: number; // in sq ft
  pricePerSqFt: number;
  totalCost: number;
  downPaymentPercentage: number;
  downPaymentAmount: number;
  loanAmount: number;
  interestRate: number;
  loanTenure: number;
  monthlyEMI: number;
  totalInterest: number;
  purchaseYear: number;
  status: "planned" | "purchased" | "sold";
  registrationCost: number;
  stampDuty: number;
  otherCharges: number;
  estimatedAppreciation: number;
  construction: ConstructionData;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialMetrics {
  totalProjectCost: number;
  totalLoanAmount: number;
  totalMonthlyEMI: number;
  totalInterest: number;
  currentFOIR: number;
  availableEMICapacity: number;
  totalDebtCapacity: number;
  riskLevel: "low" | "medium" | "high";
  loanEndYear: number;
}

export interface SalaryProjection {
  year: number;
  salary: number;
  emiCapacity: number;
  availableCapacity: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: "purchase" | "emi" | "completion" | "milestone";
  amount?: number;
  plotId?: string;
}

export interface AppState {
  // User Profile
  userProfile: UserProfile;

  // Plots data
  plots: PlotData[];

  // Current calculations
  currentMetrics: FinancialMetrics;

  // Salary projections
  salaryProjections: SalaryProjection[];

  // Timeline events
  timelineEvents: TimelineEvent[];

  // UI State
  activeTab: "dashboard" | "current" | "future" | "timeline";
  isMobileNavOpen: boolean;
  isLoading: boolean;

  // Chart data
  dashboardChartData: ChartData | null;
  timelineChartData: ChartData | null;
  scenarioChartData: ChartData | null;
  foirChartData: ChartData | null;
}

export interface AppActions {
  // User Profile actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Plot actions
  addPlot: (plot: Omit<PlotData, "id" | "createdAt" | "updatedAt">) => void;
  updatePlot: (id: string, updates: Partial<PlotData>) => void;
  deletePlot: (id: string) => void;

  // Calculation actions
  calculateMetrics: () => void;
  calculateSalaryProjections: () => void;

  // Timeline actions
  addTimelineEvent: (event: Omit<TimelineEvent, "id">) => void;
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;

  // UI actions
  setActiveTab: (tab: AppState["activeTab"]) => void;
  setMobileNavOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Chart actions
  updateDashboardChart: () => void;
  updateTimelineChart: () => void;
  updateScenarioChart: () => void;
  updateFoirChart: () => void;

  // Data persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
  resetData: () => void;
}

export interface LoanCalculationParams {
  principal: number;
  interestRate: number;
  tenure: number;
}

export interface LoanCalculationResult {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  yearlyBreakdown: {
    year: number;
    beginningBalance: number;
    payment: number;
    principal: number;
    interest: number;
    endingBalance: number;
  }[];
}

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  formatter?: (value: number) => string;
  className?: string;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  formatter?: (value: number) => string;
  className?: string;
  valueClassName?: string;
}

export interface ChartProps {
  data: ChartData;
  height?: number;
  options?: unknown;
  className?: string;
}

export interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export interface FormData {
  [key: string]: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Constants
export const DEFAULT_USER_PROFILE: UserProfile = {
  currentSalary: 88000,
  salaryGrowthRate: 58,
  currentEMI: 20600,
  maxFOIR: 40,
  riskTolerance: "medium",
  preferredLoanTenure: 20,
};

export const DEFAULT_CONSTRUCTION_DATA: ConstructionData = {
  includeConstruction: false,
  constructionArea: 1200,
  constructionPricePerSqFt: 1800,
  constructionCost: 0,
  constructionTimeframe: 12,
};

export const DEFAULT_PLOT_DATA: Omit<
  PlotData,
  "id" | "createdAt" | "updatedAt"
> = {
  name: "",
  location: "",
  size: 1500,
  pricePerSqFt: 2200,
  totalCost: 0,
  downPaymentPercentage: 20,
  downPaymentAmount: 0,
  loanAmount: 0,
  interestRate: 8.5,
  loanTenure: 20,
  monthlyEMI: 0,
  totalInterest: 0,
  purchaseYear: new Date().getFullYear(),
  status: "planned",
  registrationCost: 0,
  stampDuty: 0,
  otherCharges: 0,
  estimatedAppreciation: 8,
  construction: DEFAULT_CONSTRUCTION_DATA,
};

export const LOAN_INTEREST_RATES = {
  HOME_LOAN: 8.5,
  PLOT_LOAN: 9.0,
  CONSTRUCTION_LOAN: 8.5,
  PERSONAL_LOAN: 12.0,
} as const;

export const CHART_COLORS = {
  PRIMARY: "#2563eb",
  SECONDARY: "#10b981",
  ACCENT: "#f59e0b",
  DANGER: "#ef4444",
  SUCCESS: "#22c55e",
  WARNING: "#f97316",
  INFO: "#06b6d4",
  GRAY: "#6b7280",
} as const;

export const TABS = {
  DASHBOARD: "dashboard",
  CURRENT: "current",
  FUTURE: "future",
  TIMELINE: "timeline",
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;
