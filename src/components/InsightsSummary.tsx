import { TrendingUp, Calendar, BarChart, Award } from "lucide-react";

interface InsightsData {
  peakDay: string;
  peakValue: number;
  averageInterest: number;
  trendingKeyword: string;
  totalDataPoints: number;
}

interface InsightsSummaryProps {
  insights: InsightsData | null;
  keywords: string[];
}

const InsightsSummary = ({ insights, keywords }: InsightsSummaryProps) => {
  if (!insights || keywords.length === 0) {
    return null;
  }

  const insightCards = [
    {
      icon: Calendar,
      title: "Peak Interest Day",
      value: insights.peakDay,
      subtitle: `Interest Score: ${insights.peakValue}`,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      icon: BarChart,
      title: "Average Interest",
      value: `${insights.averageInterest.toFixed(1)}%`,
      subtitle: `Over ${insights.totalDataPoints} data points`,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: Award,
      title: "Top Trending",
      value: insights.trendingKeyword,
      subtitle: "Most searched keyword",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: TrendingUp,
      title: "Keywords Analyzed",
      value: keywords.length.toString(),
      subtitle: keywords.join(", "),
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="chart-container p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Smart Insights</h3>
        <p className="text-muted-foreground">
          Automatically generated analytics showing peak interest periods, trending keywords, and overall search patterns for: <span className="font-medium text-foreground">{keywords.join(", ")}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-lg animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-lg font-semibold text-foreground truncate">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {card.subtitle}
                  </p>
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/5 to-primary-glow/5" />
            </div>
          );
        })}
      </div>

      {/* Additional insights section */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 border">
        <h4 className="font-medium text-foreground mb-2">Key Observations</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Peak interest occurred on {insights.peakDay} with a score of {insights.peakValue}</li>
          <li>• "{insights.trendingKeyword}" shows the highest overall search volume</li>
          <li>• Average interest rate is {insights.averageInterest.toFixed(1)}% across all keywords</li>
          {keywords.length > 1 && (
            <li>• Comparing {keywords.length} keywords reveals distinct search patterns</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InsightsSummary;