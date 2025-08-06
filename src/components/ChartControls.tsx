import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, BarChart3, LineChart, PieChart, Radar } from "lucide-react";

interface ChartControlsProps {
  chartType: string;
  onChartTypeChange: (type: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  country: string;
  onCountryChange: (country: string) => void;
  customDateRange: { start: string; end: string };
  onCustomDateRangeChange: (range: { start: string; end: string }) => void;
  onExportImage: () => void;
  onExportData: () => void;
}

const ChartControls = ({
  chartType,
  onChartTypeChange,
  timeRange,
  onTimeRangeChange,
  country,
  onCountryChange,
  customDateRange,
  onCustomDateRangeChange,
  onExportImage,
  onExportData,
}: ChartControlsProps) => {
  const chartTypeIcons = {
    line: LineChart,
    bar: BarChart3,
    pie: PieChart,
    radar: Radar,
  };

  const chartTypeOptions = [
    { value: "line", label: "Line Chart", icon: LineChart },
    { value: "bar", label: "Bar Chart", icon: BarChart3 },
    { value: "pie", label: "Pie Chart", icon: PieChart },
    { value: "radar", label: "Radar Chart", icon: Radar },
  ];

  const timeRangeOptions = [
    { value: "now 7-d", label: "Past 7 Days" },
    { value: "now 1-M", label: "Past 30 Days" },
    { value: "now 3-M", label: "Past 3 Months" },
    { value: "now 12-M", label: "Past 12 Months" },
    { value: "today 5-y", label: "Past 5 Years" },
    { value: "custom", label: "Custom Range" },
  ];

  const countryOptions = [
    { value: "worldwide", label: "Worldwide" },
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "JP", label: "Japan" },
    { value: "IN", label: "India" },
    { value: "BR", label: "Brazil" },
    { value: "AU", label: "Australia" },
  ];

  return (
    <div className="chart-container p-6 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chart Type Selection */}
        <div className="space-y-2">
          <Label>Chart Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {chartTypeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={chartType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChartTypeChange(option.value)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{option.label.split(" ")[0]}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Time Range Selection */}
        <div className="space-y-2">
          <Label>Time Range</Label>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country Selection */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Export Options */}
        <div className="space-y-2">
          <Label>Export</Label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportImage}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {timeRange === "custom" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={customDateRange.start}
              onChange={(e) =>
                onCustomDateRangeChange({ ...customDateRange, start: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={customDateRange.end}
              onChange={(e) =>
                onCustomDateRangeChange({ ...customDateRange, end: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartControls;