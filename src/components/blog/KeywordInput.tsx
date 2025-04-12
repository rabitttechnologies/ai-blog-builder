
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface KeywordInputProps {
  onSubmit: (keywords: string[], niche: string) => void;
  initialKeywords?: string[];
}

const KeywordInput: React.FC<KeywordInputProps> = ({ onSubmit, initialKeywords = [] }) => {
  const [niche, setNiche] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [error, setError] = useState("");

  // Initialize from props if provided
  useEffect(() => {
    if (initialKeywords && initialKeywords.length > 0) {
      setKeywords(initialKeywords);
      console.log("KeywordInput initialized with keywords:", initialKeywords);
    }
  }, [initialKeywords]);

  const handleAddKeyword = () => {
    if (!keyword.trim()) return;
    
    if (keywords.includes(keyword.trim())) {
      setError("This keyword has already been added");
      return;
    }
    
    if (keywords.length >= 5) {
      setError("You can add a maximum of 5 keywords");
      return;
    }
    
    setKeywords([...keywords, keyword.trim()]);
    setKeyword("");
    setError("");
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!niche.trim()) {
      setError("Please enter a niche");
      return;
    }
    
    if (keywords.length < 1) {
      setError("Please add at least 1 keyword");
      return;
    }
    
    onSubmit(keywords, niche.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Start with your topic</h3>
      <p className="text-sm text-foreground/70 mb-6">
        Enter your blog niche and 1-5 keywords to help our AI understand your content needs.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="niche" className="block text-sm font-medium mb-1">
            Blog Niche / Topic Area
          </label>
          <input
            id="niche"
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
            placeholder="e.g., Content Marketing, Fitness, Cryptocurrency"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium mb-1">
            Keywords (1-5)
          </label>
          <div className="flex">
            <input
              id="keywords"
              type="text"
              className="flex-1 px-4 py-2 rounded-l-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/20 outline-none transition-all"
              placeholder="Add a keyword and press Enter"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-r-lg border border-l-0 border-border hover:bg-secondary/80 transition-colors"
              onClick={handleAddKeyword}
            >
              Add
            </button>
          </div>
          
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          
          {keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {keywords.map((kw, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-sm"
                >
                  {kw}
                  <button
                    type="button"
                    className="ml-2 text-foreground/60 hover:text-foreground transition-colors"
                    onClick={() => handleRemoveKeyword(kw)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="mt-2 text-xs text-foreground/60">
            {keywords.length}/5 keywords added
          </p>
        </div>
        
        <Button
          type="submit"
          fullWidth
          disabled={!niche.trim() || keywords.length < 1}
        >
          Generate Blog Ideas
        </Button>
      </form>
    </div>
  );
};

export default KeywordInput;
