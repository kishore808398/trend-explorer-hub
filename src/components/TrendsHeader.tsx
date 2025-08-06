import { Moon, Sun, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendsHeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

const TrendsHeader = ({ darkMode, onToggleTheme }: TrendsHeaderProps) => {
  return (
    <header className="relative overflow-hidden rounded-lg bg-card border p-6 mb-6 animate-fade-in">
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg gradient-primary">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Google Trends Visualizer
              </h1>
              <p className="text-muted-foreground">
                Explore and analyze search trends across the globe
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            className="relative overflow-hidden group"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
      
      <div className="absolute inset-0 gradient-accent opacity-50" />
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-primary-glow/10 rounded-full blur-2xl" />
    </header>
  );
};

export default TrendsHeader;