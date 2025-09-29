import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store";
import { MetricGrid, CurrencyMetricCard } from "../common/MetricCard";
import {
  CustomSlider,
  CurrencySlider,
  PercentageSlider,
} from "../common/CustomSlider";
import {
  calculateEMI,
  formatCurrency,
  formatPercentage,
} from "../../utils/calculations";

export const CurrentHome: React.FC = () => {
  const { userProfile, currentMetrics, calculateMetrics } = useAppStore();

  // Local state for plot calculations
  const [plotSize, setPlotSize] = useState(1500);
  const [plotPricePerSqFt, setPlotPricePerSqFt] = useState(2200);

  // Local state for construction calculations
  const [includeConstruction, setIncludeConstruction] = useState(false);
  const [constructionArea, setConstructionArea] = useState(1200);
  const [constructionPricePerSqFt, setConstructionPricePerSqFt] =
    useState(1800);

  // Combined loan parameters
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  // Calculate costs
  const plotCost = plotSize * plotPricePerSqFt;
  const constructionCost = includeConstruction
    ? constructionArea * constructionPricePerSqFt
    : 0;
  const totalProjectCost = plotCost + constructionCost;

  // Calculate loan details
  const downPaymentAmount = (totalProjectCost * downPaymentPercentage) / 100;
  const loanAmount = totalProjectCost - downPaymentAmount;

  const loanCalculation = calculateEMI({
    principal: loanAmount,
    interestRate: interestRate,
    tenure: loanTenure,
  });

  const newTotalEMI = userProfile.currentEMI + loanCalculation.monthlyEMI;
  const newFOIR = (newTotalEMI / userProfile.currentSalary) * 100;
  const remainingEMICapacity =
    (userProfile.currentSalary * userProfile.maxFOIR) / 100 - newTotalEMI;

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const getRiskLevel = (foir: number) => {
    if (foir <= 30)
      return { level: "Low", color: "text-green-400" };
    if (foir <= 40)
      return { level: "Medium", color: "text-yellow-400" };
    return { level: "High", color: "text-red-400" };
  };

  const risk = getRiskLevel(newFOIR);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Home Investment Analysis
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Calculate loan details and financial impact for your plot
          {includeConstruction ? " and construction" : ""} investment
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid-2">
        {/* Investment Configuration */}
        <div className="control-panel">
          <h3>
            
            Investment Configuration
          </h3>

          <div className="space-y-6">
            {/* Plot Configuration */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                
                Plot Details
              </h4>

              {/* Plot Size */}
              <div className="input-group">
                <CustomSlider
                  min={500}
                  max={3000}
                  step={50}
                  value={plotSize}
                  onChange={setPlotSize}
                  label="Plot Size (sq ft)"
                  type="number"
                  formatter={(value) => `${value} sq ft`}
                />
              </div>

              {/* Plot Price per sq ft */}
              <div className="input-group">
                <CurrencySlider
                  min={1000}
                  max={5000}
                  step={50}
                  value={plotPricePerSqFt}
                  onChange={setPlotPricePerSqFt}
                  label="Plot Price per sq ft"
                  compact={true}
                />
              </div>
            </div>

            {/* Construction Toggle and Configuration */}
            <div className="bg-green-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-green-900 flex items-center gap-2">
                  
                  Construction Details
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeConstruction}
                    onChange={(e) => setIncludeConstruction(e.target.checked)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-green-900">
                    Include Construction
                  </span>
                </label>
              </div>

              {includeConstruction && (
                <div className="space-y-4">
                  {/* Construction Area */}
                  <div className="input-group">
                    <CustomSlider
                      min={800}
                      max={2500}
                      step={50}
                      value={constructionArea}
                      onChange={setConstructionArea}
                      label="Construction Area (sq ft)"
                      type="number"
                      formatter={(value) => `${value} sq ft`}
                    />
                  </div>

                  {/* Construction Price per sq ft */}
                  <div className="input-group">
                    <CurrencySlider
                      min={1200}
                      max={3000}
                      step={50}
                      value={constructionPricePerSqFt}
                      onChange={setConstructionPricePerSqFt}
                      label="Construction Price per sq ft"
                      compact={true}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Loan Configuration */}
            <div className="bg-purple-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                
                Loan Configuration
              </h4>

              {/* Down Payment */}
              <div className="input-group">
                <PercentageSlider
                  min={10}
                  max={50}
                  step={1}
                  value={downPaymentPercentage}
                  onChange={setDownPaymentPercentage}
                  label="Down Payment"
                />
              </div>

              {/* Interest Rate */}
              <div className="input-group">
                <PercentageSlider
                  min={7}
                  max={12}
                  step={0.1}
                  value={interestRate}
                  onChange={setInterestRate}
                  label="Interest Rate"
                />
              </div>

              {/* Loan Tenure */}
              <div className="input-group">
                <CustomSlider
                  min={5}
                  max={30}
                  step={1}
                  value={loanTenure}
                  onChange={setLoanTenure}
                  label="Loan Tenure (years)"
                  type="number"
                  formatter={(value) => `${value} years`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary-600 flex items-center gap-2">
            
            Investment Summary
          </h3>

          {/* Project Cost Breakdown */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Project Cost Breakdown
            </h4>
            <MetricGrid columns={1}>
              <CurrencyMetricCard
                label="Plot Cost"
                value={plotCost}
                compact={true}
                description={`${plotSize} sq ft @ ₹${plotPricePerSqFt}/sq ft`}
              />

              {includeConstruction && (
                <CurrencyMetricCard
                  label="Construction Cost"
                  value={constructionCost}
                  compact={true}
                  description={`${constructionArea} sq ft @ ₹${constructionPricePerSqFt}/sq ft`}
                />
              )}

              <CurrencyMetricCard
                label="Total Project Cost"
                value={totalProjectCost}
                compact={true}
                valueClassName="text-primary-600 font-bold text-lg"
              />
            </MetricGrid>
          </div>

          {/* Loan Details */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Combined Loan Details
            </h4>
            <MetricGrid columns={1}>
              <CurrencyMetricCard
                label="Down Payment"
                value={downPaymentAmount}
                compact={true}
                description={`${downPaymentPercentage}% of total project cost`}
              />

              <CurrencyMetricCard
                label="Loan Amount"
                value={loanAmount}
                compact={true}
                valueClassName="text-yellow-600 font-bold"
              />

              <CurrencyMetricCard
                label="Monthly EMI"
                value={loanCalculation.monthlyEMI}
                compact={true}
                valueClassName="text-red-600 font-bold text-lg"
                description={`For ${loanTenure} years @ ${interestRate}%`}
              />

              <CurrencyMetricCard
                label="Total Interest"
                value={loanCalculation.totalInterest}
                compact={true}
                description={`Over ${loanTenure} years`}
              />

              <div className="metric-card">
                <div className="flex items-center gap-2 mb-1">
                  
                  <span className="metric-label">Loan End Year</span>
                </div>
                <div className="metric-value">
                  {new Date().getFullYear() + loanTenure}
                </div>
              </div>
            </MetricGrid>
          </div>

          {/* Project Summary */}
          {includeConstruction && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                Project Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Built-up Area:</span>
                  <span className="font-semibold">
                    {constructionArea} sq ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plot Area:</span>
                  <span className="font-semibold">{plotSize} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Construction Ratio:</span>
                  <span className="font-semibold">
                    {((constructionArea / plotSize) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">
                    Cost per sq ft (Built-up):
                  </span>
                  <span className="font-semibold">
                    ₹{Math.round(totalProjectCost / constructionArea)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Impact Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          
          Financial Impact Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="metric-card">
            <div className="flex items-center gap-2 mb-1">
              
              <span className="metric-label">New FOIR</span>
            </div>
            <div className={`metric-value ${risk.color}`}>
              {formatPercentage(newFOIR)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Maximum allowed: {formatPercentage(userProfile.maxFOIR)}
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-2 mb-1">
              
              <span className="metric-label">Available EMI Capacity</span>
            </div>
            <div
              className={`metric-value ${remainingEMICapacity > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(remainingEMICapacity, true)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              After this investment
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg"></span>
              <span className="metric-label">Risk Assessment</span>
            </div>
            <div className={`metric-value ${risk.color}`}>
              {risk.level} Risk
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Based on FOIR analysis
            </div>
          </div>
        </div>
      </div>

      {/* EMI Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📋</span>
          EMI Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Investment */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Before Investment
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Salary:</span>
                <span className="font-semibold">
                  {formatCurrency(userProfile.currentSalary, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current EMI:</span>
                <span className="font-semibold">
                  {formatCurrency(userProfile.currentEMI, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Capacity:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(currentMetrics.availableEMICapacity, true)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Current FOIR:</span>
                <span className="font-semibold">
                  {formatPercentage(currentMetrics.currentFOIR)}
                </span>
              </div>
            </div>
          </div>

          {/* After Investment */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              After Investment
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Salary:</span>
                <span className="font-semibold">
                  {formatCurrency(userProfile.currentSalary, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Investment EMI:</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(loanCalculation.monthlyEMI, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total EMI:</span>
                <span className="font-semibold">
                  {formatCurrency(newTotalEMI, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Capacity:</span>
                <span
                  className={`font-semibold ${remainingEMICapacity > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(remainingEMICapacity, true)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">New FOIR:</span>
                <span className={`font-semibold ${risk.color}`}>
                  {formatPercentage(newFOIR)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          
          Recommendations
        </h3>

        <div className="space-y-3">
          {newFOIR > userProfile.maxFOIR && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                
                <span className="font-semibold text-red-900">
                  FOIR Exceeded
                </span>
              </div>
              <p className="text-red-700 text-sm">
                Your FOIR will exceed the maximum limit. Consider increasing
                down payment
                {includeConstruction ? ", reducing construction area," : ""} or
                adjusting loan tenure.
              </p>
            </div>
          )}

          {newFOIR <= 30 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">✅</span>
                <span className="font-semibold text-green-900">
                  Excellent Financial Position
                </span>
              </div>
              <p className="text-green-700 text-sm">
                Your FOIR is well within safe limits. This investment looks
                financially sound
                {includeConstruction ? " including construction costs" : ""}.
              </p>
            </div>
          )}

          {newFOIR > 30 && newFOIR <= userProfile.maxFOIR && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600">⚡</span>
                <span className="font-semibold text-yellow-900">
                  Moderate Risk
                </span>
              </div>
              <p className="text-yellow-700 text-sm">
                Your FOIR is moderate. Ensure you have emergency funds and
                consider salary growth prospects for the combined loan.
              </p>
            </div>
          )}

          {includeConstruction && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                
                <span className="font-semibold text-blue-900">
                  Construction Planning
                </span>
              </div>
              <p className="text-blue-700 text-sm">
                Plan for construction timeline and potential cost overruns.
                Consider keeping a buffer of 10-15% additional funds for
                unexpected expenses.
              </p>
            </div>
          )}

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              
              <span className="font-semibold text-indigo-900">
                Investment Summary
              </span>
            </div>
            <p className="text-indigo-700 text-sm">
              Total investment: {formatCurrency(totalProjectCost, true)} | Down
              payment: {formatCurrency(downPaymentAmount, true)} | Monthly EMI:{" "}
              {formatCurrency(loanCalculation.monthlyEMI, true)} |
              {includeConstruction &&
                `Built-up area: ${constructionArea} sq ft`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
