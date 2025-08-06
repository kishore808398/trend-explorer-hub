import { useState, useCallback } from "react";

const API_KEY = "a40429b450bb03507a257b7d7ddcde7fa15cb4fb5edc9dc8d290045261e5caac";
const API_BASE_URL = "https://api.serpapi.com/search";

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

// Mock data generator for fallback
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

// Real API data fetching functions
const fetchRealTrendsData = async (keywords: string[], timeRange: string, country: string): Promise<TrendsData> => {
  console.log("Attempting to fetch real trends data for:", keywords);
  
  const params = new URLSearchParams({
    engine: "google_trends",
    q: keywords.join(","),
    date: timeRange,
    geo: country === "worldwide" ? "" : country,
    api_key: API_KEY,
  });

  console.log("API URL:", `${API_BASE_URL}?${params}`);

  const response = await fetch(`${API_BASE_URL}?${params}`);
  const data = await response.json();

  console.log("API Response:", data);

  if (!response.ok) {
    console.error("API Error:", data);
    throw new Error(data.error || "Failed to fetch trends data");
  }

  // Transform API response to our format
  const timelineData = data.interest_over_time?.timeline_data || [];
  const labels = timelineData.map((item: any) => item.date);
  
  const datasets = keywords.map((keyword, index) => {
    const keywordData = timelineData.map((item: any) => {
      const values = item.values || [];
      const keywordValue = values.find((v: any) => v.query === keyword);
      return keywordValue ? keywordValue.value : 0;
    });
    
    return {
      label: keyword,
      data: keywordData,
      borderColor: `hsl(${index * 60 + 217}, 91%, 60%)`,
      backgroundColor: `hsl(${index * 60 + 217}, 91%, 60%, 0.1)`,
    };
  });

  return { labels, datasets };
};

const generateInsightsFromRealData = (data: TrendsData): InsightsData => {
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
    averageInterest: Math.round(totalSum / totalPoints),
    trendingKeyword,
    totalDataPoints: data.labels.length,
  };
};

const fetchRealGlobalData = async (keyword: string): Promise<CountryData[]> => {
  const params = new URLSearchParams({
    engine: "google_trends",
    q: keyword,
    date: "today 12-m",
    api_key: API_KEY,
  });

  try {
    const response = await fetch(`${API_BASE_URL}?${params}`);
    const data = await response.json();
    
    const regionData = data.interest_by_region || [];
    return regionData.map((item: any) => ({
      country: item.location,
      value: item.value || 0,
    }));
  } catch (error) {
    console.error("Error fetching global data:", error);
    // Fallback to mock data if API fails
    const countries = ["US", "GB", "CA", "DE", "FR", "JP", "IN", "BR", "AU", "IT"];
    return countries.map(country => ({
      country,
      value: Math.floor(Math.random() * 100),
    }));
  }
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
      // Try to fetch real data from API first
      console.log("Trying to fetch real API data...");
      const data = await fetchRealTrendsData(keywords, timeRange, country);
      const insightsData = generateInsightsFromRealData(data);
      const globalMapData = await fetchRealGlobalData(keywords[0]);
      
      setTrendsData(data);
      setInsights(insightsData);
      setGlobalData(globalMapData);
    } catch (error) {
      console.error("API failed, falling back to mock data:", error);
      
      // Fallback to mock data when API fails
      const mockData = generateMockData(keywords, timeRange);
      const mockInsights = generateInsightsFromRealData(mockData);
      const mockGlobalData = await fetchRealGlobalData(keywords[0]).catch(() => {
        // If global data also fails, use mock
        const countries = ["US", "GB", "CA", "DE", "FR", "JP", "IN", "BR", "AU", "IT"];
        return countries.map(country => ({
          country,
          value: Math.floor(Math.random() * 100),
        }));
      });
      
      setTrendsData(mockData);
      setInsights(mockInsights);
      setGlobalData(mockGlobalData);
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