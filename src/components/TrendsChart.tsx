import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Radar } from "react-chartjs-2";
import ChartLegend from "./ChartLegend";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

interface TrendsChartProps {
  data: TrendsData | null;
  chartType: string;
  loading: boolean;
  keywords?: string[];
}

const TrendsChart = ({ data, chartType, loading, keywords = [] }: TrendsChartProps) => {
  const chartRef = useRef<any>(null);

  const chartColors = [
    "hsl(217, 91%, 60%)",
    "hsl(142, 76%, 36%)",
    "hsl(346, 77%, 49%)",
    "hsl(262, 83%, 58%)",
    "hsl(43, 74%, 49%)",
  ];

  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: "hsl(var(--foreground))",
            font: {
              family: "Inter, sans-serif",
            },
          },
        },
        tooltip: {
          backgroundColor: "hsl(var(--card))",
          titleColor: "hsl(var(--foreground))",
          bodyColor: "hsl(var(--foreground))",
          borderColor: "hsl(var(--border))",
          borderWidth: 1,
        },
      },
      scales: chartType !== "pie" && chartType !== "radar" ? {
        x: {
          grid: {
            color: "hsl(var(--border))",
          },
          ticks: {
            color: "hsl(var(--muted-foreground))",
          },
        },
        y: {
          grid: {
            color: "hsl(var(--border))",
          },
          ticks: {
            color: "hsl(var(--muted-foreground))",
          },
        },
      } : {},
    };

    if (chartType === "radar") {
      return {
        ...baseOptions,
        scales: {
          r: {
            angleLines: {
              color: "hsl(var(--border))",
            },
            grid: {
              color: "hsl(var(--border))",
            },
            pointLabels: {
              color: "hsl(var(--foreground))",
            },
            ticks: {
              color: "hsl(var(--muted-foreground))",
              backdropColor: "transparent",
            },
          },
        },
      };
    }

    return baseOptions;
  };

  const processDataForChart = (rawData: TrendsData) => {
    if (!rawData) return null;

    const processedData = {
      ...rawData,
      datasets: rawData.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: chartColors[index % chartColors.length],
        backgroundColor: chartType === "pie" 
          ? chartColors.map(color => color.replace("60%)", "60%, 0.8)"))
          : chartColors[index % chartColors.length].replace("60%)", "60%, 0.1)"),
        borderWidth: chartType === "line" ? 3 : 2,
        fill: chartType === "line",
        tension: chartType === "line" ? 0.4 : 0,
      })),
    };

    return processedData;
  };

  const renderChart = () => {
    if (!data) return null;

    const processedData = processDataForChart(data);
    if (!processedData) return null;

    const options = getChartOptions();

    switch (chartType) {
      case "bar":
        return <Bar ref={chartRef} data={processedData} options={options} />;
      case "pie":
        return <Pie ref={chartRef} data={processedData} options={options} />;
      case "radar":
        return <Radar ref={chartRef} data={processedData} options={options} />;
      default:
        return <Line ref={chartRef} data={processedData} options={options} />;
    }
  };

  if (loading) {
    return (
      <div className="chart-container p-6 animate-fade-in">
        <div className="h-96 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Analyzing trends...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="chart-container p-6 animate-fade-in">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
            <p className="text-muted-foreground">
              Enter keywords and click "Analyze Trends" to see the visualization
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getChartTitle = () => {
    switch (chartType) {
      case "line":
        return "Search Interest Over Time";
      case "bar":
        return "Search Volume Comparison";
      case "pie":
        return "Keyword Share Distribution";
      case "radar":
        return "Multi-dimensional Trend Analysis";
      default:
        return "Search Trends";
    }
  };

  const getChartDescription = () => {
    switch (chartType) {
      case "line":
        return "Shows how search interest changes over time for each keyword";
      case "bar":
        return "Compares search volumes across different time periods";
      case "pie":
        return "Shows the relative popularity of each keyword as a percentage";
      case "radar":
        return "Displays multiple data points in a radar/spider web format";
      default:
        return "Visualizes search trend data";
    }
  };

  return (
    <div className="chart-container p-6 animate-scale-in">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {getChartTitle()}
        </h3>
        <p className="text-sm text-muted-foreground">
          {getChartDescription()}
        </p>
      </div>
      <div className="h-96">
        {renderChart()}
      </div>
      {data && keywords.length > 0 && (
        <ChartLegend keywords={keywords} chartType={chartType} />
      )}
    </div>
  );
};

export default TrendsChart;