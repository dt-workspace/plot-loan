import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import type { ChartOptions, ChartData } from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface BaseChartProps {
  data: ChartData<any>;
  options?: ChartOptions<any>;
  height?: number;
  width?: number;
  className?: string;
  title?: string;
  subtitle?: string;
}

// Base Chart wrapper
export const BaseChart: React.FC<
  BaseChartProps & { type: "line" | "bar" | "doughnut" | "pie" }
> = ({
  data,
  options,
  height = 300,
  width,
  className = "",
  title,
  subtitle,
  type,
}) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#2563eb",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (typeof context.parsed.y === "number") {
                // Format as currency if the value is large
                if (context.parsed.y > 1000) {
                  label += "₹" + context.parsed.y.toLocaleString("en-IN");
                } else {
                  label += context.parsed.y.toLocaleString("en-IN");
                }
              }
            }
            return label;
          },
        },
      },
    },
    scales:
      type === "doughnut" || type === "pie"
        ? undefined
        : {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                font: {
                  size: 11,
                },
                callback: function (value: any) {
                  if (typeof value === "number") {
                    if (value >= 1000000) {
                      return "₹" + (value / 1000000).toFixed(1) + "M";
                    } else if (value >= 1000) {
                      return "₹" + (value / 1000).toFixed(1) + "K";
                    } else {
                      return "₹" + value.toLocaleString("en-IN");
                    }
                  }
                  return value;
                },
              },
            },
          },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    ...options,
  };

  const renderChart = () => {
    const commonProps = {
      data,
      options: defaultOptions,
      height,
      width,
    };

    switch (type) {
      case "line":
        return <Line {...commonProps} />;
      case "bar":
        return <Bar {...commonProps} />;
      case "doughnut":
        return <Doughnut {...commonProps} />;
      case "pie":
        return <Pie {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  return (
    <div className={`chart-container ${className}`}>
      {subtitle && (
        <p className="text-sm text-gray-600 mb-2 text-center">{subtitle}</p>
      )}
      <div style={{ height: `${height}px` }}>{renderChart()}</div>
    </div>
  );
};

// Specific Chart Components
export const LineChart: React.FC<BaseChartProps> = (props) => (
  <BaseChart {...props} type="line" />
);

export const BarChart: React.FC<BaseChartProps> = (props) => (
  <BaseChart {...props} type="bar" />
);

export const DoughnutChart: React.FC<BaseChartProps> = (props) => (
  <BaseChart {...props} type="doughnut" />
);

export const PieChart: React.FC<BaseChartProps> = (props) => (
  <BaseChart {...props} type="pie" />
);

// Salary Growth Chart
interface SalaryGrowthChartProps {
  currentSalary: number;
  growthRate: number;
  years?: number;
  className?: string;
}

export const SalaryGrowthChart: React.FC<SalaryGrowthChartProps> = ({
  currentSalary,
  growthRate,
  years = 8,
  className = "",
}) => {
  const generateData = () => {
    const currentYear = new Date().getFullYear();
    const labels = [];
    const salaryData = [];
    const emiCapacityData = [];

    for (let i = 0; i < years; i++) {
      const year = currentYear + i;
      const salary = currentSalary * Math.pow(1 + growthRate / 100, i);
      const emiCapacity = salary * 0.4; // 40% FOIR

      labels.push(year.toString());
      salaryData.push(Math.round(salary));
      emiCapacityData.push(Math.round(emiCapacity));
    }

    return {
      labels,
      datasets: [
        {
          label: "Monthly Salary",
          data: salaryData,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
        {
          label: "EMI Capacity (40% FOIR)",
          data: emiCapacityData,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Salary Growth Projection (${growthRate}% annually)`,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (typeof value === "number") {
              return "₹" + (value / 1000).toFixed(0) + "K";
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <LineChart
      data={generateData()}
      options={options}
      className={className}
      height={350}
    />
  );
};

// FOIR Chart
interface FOIRChartProps {
  currentFOIR: number;
  maxFOIR?: number;
  className?: string;
}

export const FOIRChart: React.FC<FOIRChartProps> = ({
  currentFOIR,
  maxFOIR = 40,
  className = "",
}) => {
  const data = {
    labels: ["Used FOIR", "Available FOIR"],
    datasets: [
      {
        data: [currentFOIR, maxFOIR - currentFOIR],
        backgroundColor: [
          currentFOIR > maxFOIR * 0.8
            ? "#ef4444"
            : currentFOIR > maxFOIR * 0.6
              ? "#f59e0b"
              : "#10b981",
          "#e5e7eb",
        ],
        borderColor: [
          currentFOIR > maxFOIR * 0.8
            ? "#dc2626"
            : currentFOIR > maxFOIR * 0.6
              ? "#d97706"
              : "#059669",
          "#d1d5db",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "FOIR Usage",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <DoughnutChart
      data={data}
      options={options}
      className={className}
      height={300}
    />
  );
};

// Timeline Chart
interface TimelineChartProps {
  plots: Array<{
    id: string;
    name: string;
    totalCost: number;
    loanAmount: number;
    purchaseYear: number;
  }>;
  className?: string;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  plots,
  className = "",
}) => {
  const generateData = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const purchaseData = [];
    const loanData = [];

    for (let i = 0; i < 10; i++) {
      const year = currentYear + i;
      years.push(year.toString());

      const yearPlots = plots.filter((plot) => plot.purchaseYear === year);
      const totalPurchase = yearPlots.reduce(
        (sum, plot) => sum + plot.totalCost,
        0,
      );
      const totalLoan = yearPlots.reduce(
        (sum, plot) => sum + plot.loanAmount,
        0,
      );

      purchaseData.push(totalPurchase);
      loanData.push(totalLoan);
    }

    return {
      labels: years,
      datasets: [
        {
          label: "Total Investment",
          data: purchaseData,
          backgroundColor: "#2563eb",
          borderColor: "#1d4ed8",
          borderWidth: 1,
        },
        {
          label: "Loan Amount",
          data: loanData,
          backgroundColor: "#10b981",
          borderColor: "#059669",
          borderWidth: 1,
        },
      ],
    };
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Investment Timeline",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  };

  return (
    <BarChart
      data={generateData()}
      options={options}
      className={className}
      height={350}
    />
  );
};

// Scenario Comparison Chart
interface ScenarioChartProps {
  scenarios: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  className?: string;
  title?: string;
}

export const ScenarioChart: React.FC<ScenarioChartProps> = ({
  scenarios,
  className = "",
  title = "Scenario Comparison",
}) => {
  const data = {
    labels: scenarios.map((s) => s.name),
    datasets: [
      {
        label: "Projected Value",
        data: scenarios.map((s) => s.value),
        backgroundColor: scenarios.map((s) => s.color),
        borderColor: scenarios.map((s) => s.color),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <BarChart
      data={data}
      options={options}
      className={className}
      height={300}
    />
  );
};
