
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KeywordInputProps {
  onSubmit: (keywords: string[], niche: string) => void;
  initialKeywords?: string[];
}

const KeywordInput: React.FC<KeywordInputProps> = ({ onSubmit, initialKeywords = [] }) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [niche, setNiche] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (initialKeywords.length > 0) {
      setKeywords(initialKeywords);
    }
  }, [initialKeywords]);

  const handleAddKeyword = () => {
    const trimmedKeyword = currentKeyword.trim();
    
    if (!trimmedKeyword) {
      return;
    }
    
    if (keywords.includes(trimmedKeyword)) {
      toast({
        title: "Duplicate keyword",
        description: "This keyword is already in your list.",
        variant: "destructive",
      });
      return;
    }
    
    if (keywords.length >= 5) {
      toast({
        title: "Maximum keywords reached",
        description: "You can only add up to 5 keywords.",
        variant: "destructive",
      });
      return;
    }
    
    setKeywords([...keywords, trimmedKeyword]);
    setCurrentKeyword("");
  };
  
  const handleRemoveKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (keywords.length === 0) {
      toast({
        title: "No keywords added",
        description: "Please add at least one keyword.",
        variant: "destructive",
      });
      return;
    }
    
    if (!niche.trim()) {
      toast({
        title: "Missing niche",
        description: "Please specify your blog niche.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(keywords, niche.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="keywords" className="text-base font-medium">
          Target Keywords (max 5)
        </Label>
        <p className="text-sm text-foreground/70 mb-4">
          Add keywords that best describe the topic of your blog.
        </p>
        
        <div className="flex items-center mb-3">
          <Input
            id="keywords"
            value={currentKeyword}
            onChange={(e) => setCurrentKeyword(e.target.value)}
            placeholder="Enter a keyword"
            className="flex-grow"
          />
          <Button
            type="button"
            onClick={handleAddKeyword}
            className="ml-2"
            disabled={!currentKeyword.trim() || keywords.length >= 5}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add
          </Button>
        </div>
        
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="bg-secondary/30 text-foreground rounded-md px-3 py-1 text-sm flex items-center"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(index)}
                  className="ml-2 text-foreground/70 hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="niche" className="text-base font-medium">
          Blog Niche
        </Label>
        <p className="text-sm text-foreground/70 mb-4">
          What industry or topic does your blog focus on?
        </p>
        
        <Input
          id="niche"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g., Digital Marketing, Health & Wellness, Personal Finance"
          className="w-full"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full mt-8"
        disabled={keywords.length === 0 || !niche.trim()}
      >
        Generate Title Ideas
      </Button>
    </form>
  );
};

export default KeywordInput;
