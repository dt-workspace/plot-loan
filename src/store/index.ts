import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Core data types for the Plot Planner application
export interface UserProfile {
  currentSalary: number;
  salaryGrowthRate: number;
  currentEMI: number;
  maxFOIR: number; // Fixed Obligation to Income Ratio
  riskTolerance: "low" | "medium" | "high";
  preferredLoanTenure: number;
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

// Constants
export const DEFAULT_USER_PROFILE: UserProfile = {
  currentSalary: 88000,
  salaryGrowthRate: 58,
  currentEMI: 20600,
  maxFOIR: 40,
  riskTolerance: "medium",
  preferredLoanTenure: 20,
};

// Utility functions for calculations
const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const calculateLoanEMI = (
  params: LoanCalculationParams,
): LoanCalculationResult => {
  const { principal, interestRate, tenure } = params;

  if (principal <= 0 || interestRate <= 0 || tenure <= 0) {
    return {
      monthlyEMI: 0,
      totalInterest: 0,
      totalAmount: 0,
      yearlyBreakdown: [],
    };
  }

  const monthlyRate = interestRate / 12 / 100;
  const numberOfPayments = tenure * 12;

  const monthlyEMI =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalAmount = monthlyEMI * numberOfPayments;
  const totalInterest = totalAmount - principal;

  // Calculate yearly breakdown
  const yearlyBreakdown = [];
  let remainingBalance = principal;

  for (let year = 1; year <= tenure; year++) {
    const beginningBalance = remainingBalance;
    const yearlyPayment = monthlyEMI * 12;
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let month = 1; month <= 12; month++) {
      const monthlyInterest = remainingBalance * monthlyRate;
      const monthlyPrincipal = monthlyEMI - monthlyInterest;

      yearlyInterest += monthlyInterest;
      yearlyPrincipal += monthlyPrincipal;
      remainingBalance -= monthlyPrincipal;

      if (remainingBalance <= 0) {
        remainingBalance = 0;
        break;
      }
    }

    yearlyBreakdown.push({
      year,
      beginningBalance,
      payment: yearlyPayment,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      endingBalance: remainingBalance,
    });

    if (remainingBalance <= 0) break;
  }

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    yearlyBreakdown,
  };
};

const calculateProjectedSalary = (
  currentSalary: number,
  growthRate: number,
  years: number,
): number => {
  return currentSalary * Math.pow(1 + growthRate / 100, years);
};

const initialState: AppState = {
  userProfile: DEFAULT_USER_PROFILE,
  plots: [],
  currentMetrics: {
    totalProjectCost: 0,
    totalLoanAmount: 0,
    totalMonthlyEMI: 0,
    totalInterest: 0,
    currentFOIR: 0,
    availableEMICapacity: 0,
    totalDebtCapacity: 0,
    riskLevel: "low",
    loanEndYear: new Date().getFullYear(),
  },
  salaryProjections: [],
  timelineEvents: [],
  activeTab: "dashboard",
  isMobileNavOpen: false,
  isLoading: false,
  dashboardChartData: null,
  timelineChartData: null,
  scenarioChartData: null,
  foirChartData: null,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // User Profile actions
      updateUserProfile: (profile: Partial<UserProfile>) => {
        set((state) => {
          state.userProfile = { ...state.userProfile, ...profile };
        });
        get().calculateMetrics();
        get().calculateSalaryProjections();
        get().updateDashboardChart();
      },

      // Plot actions
      addPlot: (plotData: Omit<PlotData, "id" | "createdAt" | "updatedAt">) => {
        set((state) => {
          const newPlot: PlotData = {
            ...plotData,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Calculate loan details
          const loanResult = calculateLoanEMI({
            principal: newPlot.loanAmount,
            interestRate: newPlot.interestRate,
            tenure: newPlot.loanTenure,
          });

          newPlot.monthlyEMI = loanResult.monthlyEMI;
          newPlot.totalInterest = loanResult.totalInterest;
          newPlot.totalCost = newPlot.size * newPlot.pricePerSqFt;
          newPlot.downPaymentAmount =
            newPlot.totalCost * (newPlot.downPaymentPercentage / 100);
          newPlot.loanAmount = newPlot.totalCost - newPlot.downPaymentAmount;

          state.plots.push(newPlot);
        });
        get().calculateMetrics();
        get().updateTimelineChart();
      },

      updatePlot: (id: string, updates: Partial<PlotData>) => {
        set((state) => {
          const plotIndex = state.plots.findIndex((plot) => plot.id === id);
          if (plotIndex !== -1) {
            state.plots[plotIndex] = {
              ...state.plots[plotIndex],
              ...updates,
              updatedAt: new Date(),
            };

            // Recalculate loan details if necessary
            const plot = state.plots[plotIndex];
            if (
              updates.loanAmount ||
              updates.interestRate ||
              updates.loanTenure
            ) {
              const loanResult = calculateLoanEMI({
                principal: plot.loanAmount,
                interestRate: plot.interestRate,
                tenure: plot.loanTenure,
              });

              plot.monthlyEMI = loanResult.monthlyEMI;
              plot.totalInterest = loanResult.totalInterest;
            }
          }
        });
        get().calculateMetrics();
        get().updateTimelineChart();
      },

      deletePlot: (id: string) => {
        set((state) => {
          state.plots = state.plots.filter((plot) => plot.id !== id);
        });
        get().calculateMetrics();
        get().updateTimelineChart();
      },

      // Calculation actions
      calculateMetrics: () => {
        set((state) => {
          const { userProfile, plots } = state;
          const totalProjectCost = plots.reduce(
            (sum, plot) => sum + plot.totalCost,
            0,
          );
          const totalLoanAmount = plots.reduce(
            (sum, plot) => sum + plot.loanAmount,
            0,
          );
          const totalMonthlyEMI =
            plots.reduce((sum, plot) => sum + plot.monthlyEMI, 0) +
            userProfile.currentEMI;
          const totalInterest = plots.reduce(
            (sum, plot) => sum + plot.totalInterest,
            0,
          );

          const monthlyIncome = userProfile.currentSalary;
          const currentFOIR = (totalMonthlyEMI / monthlyIncome) * 100;
          const maxEMICapacity = (monthlyIncome * userProfile.maxFOIR) / 100;
          const availableEMICapacity = maxEMICapacity - totalMonthlyEMI;
          const totalDebtCapacity = availableEMICapacity * 20 * 12; // Assuming 20 years

          let riskLevel: "low" | "medium" | "high" = "low";
          if (currentFOIR > 30) riskLevel = "medium";
          if (currentFOIR > 40) riskLevel = "high";

          const maxLoanEndYear = Math.max(
            ...plots.map((plot) => plot.purchaseYear + plot.loanTenure),
            new Date().getFullYear(),
          );

          state.currentMetrics = {
            totalProjectCost,
            totalLoanAmount,
            totalMonthlyEMI,
            totalInterest,
            currentFOIR,
            availableEMICapacity,
            totalDebtCapacity,
            riskLevel,
            loanEndYear: maxLoanEndYear,
          };
        });
      },

      calculateSalaryProjections: () => {
        set((state) => {
          const { userProfile } = state;
          const currentYear = new Date().getFullYear();
          const projections: SalaryProjection[] = [];

          for (let i = 0; i < 10; i++) {
            const year = currentYear + i;
            const salary = calculateProjectedSalary(
              userProfile.currentSalary,
              userProfile.salaryGrowthRate,
              i,
            );
            const emiCapacity = (salary * userProfile.maxFOIR) / 100;
            const availableCapacity = emiCapacity - userProfile.currentEMI;

            projections.push({
              year,
              salary,
              emiCapacity,
              availableCapacity,
            });
          }

          state.salaryProjections = projections;
        });
      },

      // Timeline actions
      addTimelineEvent: (event: Omit<TimelineEvent, "id">) => {
        set((state) => {
          const newEvent: TimelineEvent = {
            ...event,
            id: generateId(),
          };
          state.timelineEvents.push(newEvent);
          state.timelineEvents.sort(
            (a, b) => a.date.getTime() - b.date.getTime(),
          );
        });
      },

      updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => {
        set((state) => {
          const eventIndex = state.timelineEvents.findIndex(
            (event) => event.id === id,
          );
          if (eventIndex !== -1) {
            state.timelineEvents[eventIndex] = {
              ...state.timelineEvents[eventIndex],
              ...updates,
            };
            state.timelineEvents.sort(
              (a, b) => a.date.getTime() - b.date.getTime(),
            );
          }
        });
      },

      deleteTimelineEvent: (id: string) => {
        set((state) => {
          state.timelineEvents = state.timelineEvents.filter(
            (event) => event.id !== id,
          );
        });
      },

      // UI actions
      setActiveTab: (tab: AppState["activeTab"]) => {
        set((state) => {
          state.activeTab = tab;
        });
      },

      setMobileNavOpen: (open: boolean) => {
        set((state) => {
          state.isMobileNavOpen = open;
        });
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      // Chart actions
      updateDashboardChart: () => {
        set((state) => {
          const { salaryProjections } = state;
          const labels = salaryProjections.map((proj) => proj.year.toString());
          const salaryData = salaryProjections.map((proj) => proj.salary);
          const emiCapacityData = salaryProjections.map(
            (proj) => proj.emiCapacity,
          );

          state.dashboardChartData = {
            labels,
            datasets: [
              {
                label: "Salary",
                data: salaryData,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "EMI Capacity",
                data: emiCapacityData,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 2,
                fill: false,
              },
            ],
          };
        });
      },

      updateTimelineChart: () => {
        set((state) => {
          const { plots } = state;
          const years = [];
          const purchaseData = [];
          const loanData = [];

          const currentYear = new Date().getFullYear();
          for (let i = 0; i < 10; i++) {
            const year = currentYear + i;
            years.push(year.toString());

            const yearPurchases = plots.filter(
              (plot) => plot.purchaseYear === year,
            );
            const yearPurchaseAmount = yearPurchases.reduce(
              (sum, plot) => sum + plot.totalCost,
              0,
            );
            const yearLoanAmount = yearPurchases.reduce(
              (sum, plot) => sum + plot.loanAmount,
              0,
            );

            purchaseData.push(yearPurchaseAmount);
            loanData.push(yearLoanAmount);
          }

          state.timelineChartData = {
            labels: years,
            datasets: [
              {
                label: "Purchase Amount",
                data: purchaseData,
                backgroundColor: "#2563eb",
                borderColor: "#2563eb",
                borderWidth: 1,
              },
              {
                label: "Loan Amount",
                data: loanData,
                backgroundColor: "#10b981",
                borderColor: "#10b981",
                borderWidth: 1,
              },
            ],
          };
        });
      },

      updateScenarioChart: () => {
        set((state) => {
          const { userProfile } = state;
          const scenarios = ["Conservative", "Moderate", "Aggressive"];
          const growthRates = [
            userProfile.salaryGrowthRate - 2,
            userProfile.salaryGrowthRate,
            userProfile.salaryGrowthRate + 2,
          ];
          const projectedValues = [];

          for (let i = 0; i < 3; i++) {
            const projectedSalary = calculateProjectedSalary(
              userProfile.currentSalary,
              growthRates[i],
              5,
            );
            projectedValues.push(projectedSalary);
          }

          state.scenarioChartData = {
            labels: scenarios,
            datasets: [
              {
                label: "5-Year Salary Projection",
                data: projectedValues,
                backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
                borderColor: ["#dc2626", "#d97706", "#059669"],
                borderWidth: 1,
              },
            ],
          };
        });
      },

      updateFoirChart: () => {
        set((state) => {
          const { currentMetrics } = state;
          const foirData = [
            currentMetrics.currentFOIR,
            100 - currentMetrics.currentFOIR,
          ];

          state.foirChartData = {
            labels: ["Used FOIR", "Available FOIR"],
            datasets: [
              {
                label: "FOIR Distribution",
                data: foirData,
                backgroundColor: ["#2563eb", "#e2e8f0"],
                borderColor: ["#1d4ed8", "#cbd5e1"],
                borderWidth: 1,
              },
            ],
          };
        });
      },

      // Data persistence
      saveToStorage: () => {
        // This is handled automatically by the persist middleware
      },

      loadFromStorage: () => {
        // This is handled automatically by the persist middleware
        get().calculateMetrics();
        get().calculateSalaryProjections();
        get().updateDashboardChart();
        get().updateTimelineChart();
        get().updateScenarioChart();
        get().updateFoirChart();
      },

      resetData: () => {
        set(() => ({ ...initialState }));
      },
    })),
    {
      name: "plot-planner-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        plots: state.plots,
        timelineEvents: state.timelineEvents,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loadFromStorage();
        }
      },
    },
  ),
);

// Selectors for better performance
export const useUserProfile = () => useAppStore((state) => state.userProfile);
export const usePlots = () => useAppStore((state) => state.plots);
export const useCurrentMetrics = () =>
  useAppStore((state) => state.currentMetrics);
export const useSalaryProjections = () =>
  useAppStore((state) => state.salaryProjections);
export const useTimelineEvents = () =>
  useAppStore((state) => state.timelineEvents);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useIsMobileNavOpen = () =>
  useAppStore((state) => state.isMobileNavOpen);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useDashboardChartData = () =>
  useAppStore((state) => state.dashboardChartData);
export const useTimelineChartData = () =>
  useAppStore((state) => state.timelineChartData);
export const useScenarioChartData = () =>
  useAppStore((state) => state.scenarioChartData);
export const useFoirChartData = () =>
  useAppStore((state) => state.foirChartData);
