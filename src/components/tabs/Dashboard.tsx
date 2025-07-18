import React, { useEffect } from "react";
import { useAppStore } from "../../store";
import { MetricGrid, CurrencyMetricCard } from "../common/MetricCard";
import { CurrencySlider, PercentageSlider } from "../common/CustomSlider";
import { SalaryGrowthChart, FOIRChart } from "../common/Chart";
import { formatCurrency, formatPercentage } from "../../utils/calculations";

export const Dashboard: React.FC = () => {
  const {
    userProfile,
    currentMetrics,
    updateUserProfile,
    calculateMetrics,
    calculateSalaryProjections,
    updateDashboardChart,
    updateFoirChart,
  } = useAppStore();

  useEffect(() => {
    calculateMetrics();
    calculateSalaryProjections();
    updateDashboardChart();
    updateFoirChart();
  }, [
    calculateMetrics,
    calculateSalaryProjections,
    updateDashboardChart,
    updateFoirChart,
  ]);

  const handleSalaryChange = (value: number) => {
    updateUserProfile({ currentSalary: value });
  };

  const handleGrowthChange = (value: number) => {
    updateUserProfile({ salaryGrowthRate: value });
  };

  const handleCurrentEMIChange = (value: number) => {
    updateUserProfile({ currentEMI: value });
  };

  const handleFOIRChange = (value: number) => {
    updateUserProfile({ maxFOIR: value });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return "🟢";
      case "medium":
        return "🟡";
      case "high":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Financial Dashboard
        </h2>
        <p className="text-gray-600">
          Analyze your financial capacity and plan your plot investments
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Control Panel */}
        <div className="control-panel">
          <h3>
            <span className="text-xl mr-2">⚙️</span>
            Financial Parameters
          </h3>

          <div className="space-y-6">
            {/* Current Salary */}
            <div className="input-group">
              <CurrencySlider
                min={20000}
                max={500000}
                step={1000}
                value={userProfile.currentSalary}
                onChange={handleSalaryChange}
                label="Current Monthly Salary"
                compact={true}
              />
            </div>

            {/* Growth Rate */}
            <div className="input-group">
              <PercentageSlider
                min={0}
                max={100}
                step={1}
                value={userProfile.salaryGrowthRate}
                onChange={handleGrowthChange}
                label="Annual Salary Growth Rate"
              />
            </div>

            {/* Current EMI */}
            <div className="input-group">
              <CurrencySlider
                min={0}
                max={100000}
                step={500}
                value={userProfile.currentEMI}
                onChange={handleCurrentEMIChange}
                label="Current Monthly EMI"
                compact={true}
              />
            </div>

            {/* Max FOIR */}
            <div className="input-group">
              <PercentageSlider
                min={20}
                max={60}
                step={1}
                value={userProfile.maxFOIR}
                onChange={handleFOIRChange}
                label="Maximum FOIR Limit"
              />
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary-600 flex items-center gap-2">
            <span>📈</span>
            Quick Metrics
          </h3>

          <MetricGrid columns={1}>
            <CurrencyMetricCard
              label="Current EMI Capacity"
              value={(userProfile.currentSalary * userProfile.maxFOIR) / 100}
              compact={true}
              icon="💰"
            />

            <CurrencyMetricCard
              label="Available for New Plots"
              value={currentMetrics.availableEMICapacity}
              compact={true}
              icon="🏗️"
              valueClassName={
                currentMetrics.availableEMICapacity > 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            />

            <CurrencyMetricCard
              label="Total Debt Capacity"
              value={currentMetrics.totalDebtCapacity}
              compact={true}
              icon="🏦"
            />

            <div className="metric-card">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">
                  {getRiskIcon(currentMetrics.riskLevel)}
                </span>
                <span className="metric-label">Risk Level</span>
              </div>
              <div
                className={`metric-value capitalize ${getRiskColor(currentMetrics.riskLevel)}`}
              >
                {currentMetrics.riskLevel}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Current FOIR: {formatPercentage(currentMetrics.currentFOIR)}
              </div>
            </div>
          </MetricGrid>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span>
            Salary Growth Projection
          </h3>
          <SalaryGrowthChart
            currentSalary={userProfile.currentSalary}
            growthRate={userProfile.salaryGrowthRate}
            years={8}
          />
        </div>

        {/* FOIR Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            FOIR Usage
          </h3>
          <FOIRChart
            currentFOIR={currentMetrics.currentFOIR}
            maxFOIR={userProfile.maxFOIR}
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Using {formatPercentage(currentMetrics.currentFOIR)} of{" "}
              {formatPercentage(userProfile.maxFOIR)} maximum FOIR
            </p>
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              💰 Monthly Capacity
            </h4>
            <p className="text-sm text-blue-700">
              You can afford{" "}
              {formatCurrency(currentMetrics.availableEMICapacity)} monthly EMI
              for new investments
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">
              📈 Growth Impact
            </h4>
            <p className="text-sm text-green-700">
              With {formatPercentage(userProfile.salaryGrowthRate)} annual
              growth, your capacity will increase significantly
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              currentMetrics.riskLevel === "low"
                ? "bg-green-50"
                : currentMetrics.riskLevel === "medium"
                  ? "bg-yellow-50"
                  : "bg-red-50"
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                currentMetrics.riskLevel === "low"
                  ? "text-green-900"
                  : currentMetrics.riskLevel === "medium"
                    ? "text-yellow-900"
                    : "text-red-900"
              }`}
            >
              {getRiskIcon(currentMetrics.riskLevel)} Risk Assessment
            </h4>
            <p
              className={`text-sm ${
                currentMetrics.riskLevel === "low"
                  ? "text-green-700"
                  : currentMetrics.riskLevel === "medium"
                    ? "text-yellow-700"
                    : "text-red-700"
              }`}
            >
              {currentMetrics.riskLevel === "low" &&
                "Your financial position is stable for new investments"}
              {currentMetrics.riskLevel === "medium" &&
                "Consider your risk tolerance before new investments"}
              {currentMetrics.riskLevel === "high" &&
                "High risk - consider reducing existing EMIs first"}
            </p>
          </div>
        </div>
      </div>

      {/* Projected Growth Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📅</span>
          5-Year Salary Projection
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Year</th>
                <th className="text-left py-2">Monthly Salary</th>
                <th className="text-left py-2">EMI Capacity</th>
                <th className="text-left py-2">Available Capacity</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((year) => {
                const projectedSalary =
                  userProfile.currentSalary *
                  Math.pow(1 + userProfile.salaryGrowthRate / 100, year);
                const emiCapacity =
                  (projectedSalary * userProfile.maxFOIR) / 100;
                const availableCapacity = emiCapacity - userProfile.currentEMI;

                return (
                  <tr key={year} className="border-b border-gray-100">
                    <td className="py-2 font-medium">
                      {new Date().getFullYear() + year}
                    </td>
                    <td className="py-2">
                      {formatCurrency(projectedSalary, true)}
                    </td>
                    <td className="py-2">
                      {formatCurrency(emiCapacity, true)}
                    </td>
                    <td
                      className={`py-2 font-semibold ${availableCapacity > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(availableCapacity, true)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
