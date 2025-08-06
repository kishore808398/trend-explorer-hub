import React from "react";
import { Badge } from "@/components/ui/badge";

interface ChartLegendProps {
  keywords: string[];
  chartType: string;
}

const ChartLegend = ({ keywords, chartType }: ChartLegendProps) => {
  const chartColors = [
    "hsl(217, 91%, 60%)",
    "hsl(142, 76%, 36%)",
    "hsl(346, 77%, 49%)",
    "hsl(262, 83%, 58%)",
    "hsl(43, 74%, 49%)",
  ];

  const getChartExplanation = () => {
    switch (chartType) {
      case "line":
        return "Lines show search trends over time. Higher peaks indicate more interest.";
      case "bar":
        return "Bars compare search volumes. Taller bars represent higher search interest.";
      case "pie":
        return "Slices show relative popularity. Larger slices indicate more searches.";
      case "radar":
        return "Points show data across multiple dimensions. Outer points indicate higher values.";
      default:
        return "Chart displays search trend data for the selected keywords.";
    }
  };

  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex flex-wrap gap-2 mb-3">
        {keywords.map((keyword, index) => (
          <Badge
            key={keyword}
            variant="outline"
            className="flex items-center gap-2"
            style={{
              borderColor: chartColors[index % chartColors.length],
              color: chartColors[index % chartColors.length],
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chartColors[index % chartColors.length] }}
            />
            {keyword}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {getChartExplanation()}
      </p>
    </div>
  );
};

export default ChartLegend;