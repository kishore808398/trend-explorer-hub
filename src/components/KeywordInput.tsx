import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search } from "lucide-react";

interface KeywordInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  onSearch: () => void;
  loading: boolean;
}

const KeywordInput = ({ keywords, onKeywordsChange, onSearch, loading }: KeywordInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      onKeywordsChange([...keywords, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeKeyword = (index: number) => {
    onKeywordsChange(keywords.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword();
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Handle comma-separated keywords
    if (value.includes(",")) {
      const newKeywords = value
        .split(",")
        .map(k => k.trim())
        .filter(k => k && !keywords.includes(k));
      
      if (newKeywords.length > 0) {
        onKeywordsChange([...keywords, ...newKeywords]);
        setInputValue("");
      }
    }
  };

  return (
    <div className="chart-container p-6 animate-slide-up">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Enter keywords (comma-separated or use + button)"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          
          <Button
            onClick={addKeyword}
            disabled={!inputValue.trim() || keywords.includes(inputValue.trim())}
            size="icon"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onSearch}
            disabled={keywords.length === 0 || loading}
            className="gradient-primary hover:opacity-90 transition-opacity"
          >
            {loading ? "Searching..." : "Analyze Trends"}
          </Button>
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center space-x-1 px-3 py-1 animate-scale-in"
              >
                <span>{keyword}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
                  onClick={() => removeKeyword(index)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordInput;