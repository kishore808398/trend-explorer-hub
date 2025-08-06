import { useState, useCallback } from "react";

interface TrendsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface InsightsData {
  peakDay: string;
  peakValue: number;
  averageInterest: number;
  trendingKeyword: string;
  totalDataPoints: number;
}

interface CountryData {
  country: string;
  value: number;
}

// Mock data generator for demonstration
const generateMockData = (keywords: string[], timeRange: string): TrendsData => {
  const dataPoints = timeRange.includes("7-d") ? 7 : timeRange.includes("1-M") ? 30 : 12;
  const labels = [];
  
  // Generate date labels
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date();
    if (timeRange.includes("7-d")) {
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    } else if (timeRange.includes("1-M")) {
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    } else {
      date.setMonth(date.getMonth() - i);
      labels.push(date.toLocaleDateString("en-US", { year: "numeric", month: "short" }));
    }
  }

  const datasets = keywords.map((keyword, index) => {
    const baseValue = 30 + Math.random() * 40;
    const data = labels.map(() => Math.max(0, baseValue + (Math.random() - 0.5) * 30));
    
    return {
      label: keyword,
      data,
      borderColor: `hsl(${index * 60 + 217}, 91%, 60%)`,
      backgroundColor: `hsl(${index * 60 + 217}, 91%, 60%, 0.1)`,
    };
  });

  return { labels, datasets };
};

const generateMockInsights = (data: TrendsData): InsightsData => {
  let peakValue = 0;
  let peakDay = "";
  let totalSum = 0;
  let totalPoints = 0;
  let trendingKeyword = "";
  let maxAverage = 0;

  data.datasets.forEach((dataset) => {
    const datasetMax = Math.max(...dataset.data);
    const datasetAverage = dataset.data.reduce((a, b) => a + b, 0) / dataset.data.length;
    
    totalSum += dataset.data.reduce((a, b) => a + b, 0);
    totalPoints += dataset.data.length;
    
    if (datasetAverage > maxAverage) {
      maxAverage = datasetAverage;
      trendingKeyword = dataset.label;
    }
    
    if (datasetMax > peakValue) {
      peakValue = datasetMax;
      const peakIndex = dataset.data.indexOf(datasetMax);
      peakDay = data.labels[peakIndex];
    }
  });

  return {
    peakDay,
    peakValue: Math.round(peakValue),
    averageInterest: totalSum / totalPoints,
    trendingKeyword,
    totalDataPoints: data.labels.length,
  };
};

const generateMockGlobalData = (keyword: string): CountryData[] => {
  const countries = ["US", "GB", "CA", "DE", "FR", "JP", "IN", "BR", "AU", "IT"];
  return countries.map(country => ({
    country,
    value: Math.floor(Math.random() * 100),
  }));
};

export const useTrendsData = () => {
  const [loading, setLoading] = useState(false);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [globalData, setGlobalData] = useState<CountryData[] | null>(null);

  const fetchTrendsData = useCallback(async (
    keywords: string[],
    timeRange: string,
    country: string
  ) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock data
      const data = generateMockData(keywords, timeRange);
      const insightsData = generateMockInsights(data);
      const globalMapData = generateMockGlobalData(keywords[0]);
      
      setTrendsData(data);
      setInsights(insightsData);
      setGlobalData(globalMapData);
    } catch (error) {
      console.error("Error fetching trends data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    trendsData,
    insights,
    globalData,
    fetchTrendsData,
  };
};