import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";

interface CountryData {
  country: string;
  value: number;
}

interface GlobalMapProps {
  data: CountryData[] | null;
  selectedKeyword: string;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const GlobalMap = ({ data, selectedKeyword }: GlobalMapProps) => {
  const getCountryValue = (geoId: string) => {
    if (!data) return 0;
    const country = data.find(d => d.country === geoId);
    return country ? country.value : 0;
  };

  const getColorIntensity = (value: number) => {
    if (value === 0) return "hsl(var(--muted))";
    const intensity = value / 100;
    return `hsl(217, 91%, ${Math.max(30, 70 - intensity * 40)}%)`;
  };

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
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Global Interest Map</h3>
            <p className="text-muted-foreground">
              Search for keywords to see global interest distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container p-6 animate-scale-in">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Global Interest: "{selectedKeyword}"
        </h3>
        <p className="text-muted-foreground">
          Hover over countries to see interest scores
        </p>
      </div>

      <div className="relative">
        <ComposableMap
          projectionConfig={{
            scale: 140,
          }}
          style={{
            width: "100%",
            height: "400px",
          }}
        >
          <Sphere stroke="hsl(var(--border))" strokeWidth={0.5} />
          <Graticule stroke="hsl(var(--border))" strokeWidth={0.3} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const value = getCountryValue(geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColorIntensity(value)}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill: "hsl(217, 91%, 50%)",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-3 shadow-lg">
          <h4 className="font-medium text-foreground mb-2 text-sm">Interest Level</h4>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-4 h-4 rounded bg-muted"></div>
            <span className="text-muted-foreground">Low</span>
            <div className="w-8 h-2 bg-gradient-to-r from-blue-200 to-blue-600 rounded"></div>
            <span className="text-muted-foreground">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMap;