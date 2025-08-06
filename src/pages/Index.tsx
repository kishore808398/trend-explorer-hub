import { useState, useRef } from "react";
import TrendsHeader from "@/components/TrendsHeader";
import KeywordInput from "@/components/KeywordInput";
import ChartControls from "@/components/ChartControls";
import TrendsChart from "@/components/TrendsChart";
import InsightsSummary from "@/components/InsightsSummary";
import GlobalMap from "@/components/GlobalMap";
import { useTrendsData } from "@/hooks/useTrendsData";
import { exportChartAsImage, exportDataAsCSV, exportDataAsPDF } from "@/utils/exportUtils";

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("now 3-M");
  const [country, setCountry] = useState("worldwide");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  const chartRef = useRef(null);
  const { loading, trendsData, insights, globalData, fetchTrendsData } = useTrendsData();

  const handleSearch = () => {
    if (keywords.length === 0) return;
    fetchTrendsData(keywords, timeRange, country);
  };

  const handleExportImage = () => {
    exportChartAsImage(chartRef, `trends-${keywords.join("-")}`);
  };

  const handleExportData = () => {
    exportDataAsCSV(trendsData, keywords, `trends-data-${keywords.join("-")}`);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("light");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "" : "light"}`}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <TrendsHeader darkMode={darkMode} onToggleTheme={toggleTheme} />
        
        <KeywordInput
          keywords={keywords}
          onKeywordsChange={setKeywords}
          onSearch={handleSearch}
          loading={loading}
        />
        
        <ChartControls
          chartType={chartType}
          onChartTypeChange={setChartType}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          country={country}
          onCountryChange={setCountry}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
          onExportImage={handleExportImage}
          onExportData={handleExportData}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <TrendsChart
              data={trendsData}
              chartType={chartType}
              loading={loading}
            />
          </div>
          
          {trendsData && (
            <>
              <div className="lg:col-span-2">
                <InsightsSummary insights={insights} keywords={keywords} />
              </div>
              
              <div className="lg:col-span-2">
                <GlobalMap
                  data={globalData}
                  selectedKeyword={keywords[0] || ""}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            Google Trends Visualizer - Explore search trends across the globe
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;