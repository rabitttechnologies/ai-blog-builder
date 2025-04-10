
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { useKeywordResearch } from '@/hooks/useKeywordResearch';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface KeywordResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeywordResearchModal: React.FC<KeywordResearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    keyword, 
    setKeyword, 
    suggestions, 
    isLoading, 
    submitKeyword 
  } = useKeywordResearch();

  const renderSuggestionSection = (title: string, items: string[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="grid grid-cols-2 gap-2">
          {items.slice(0, 6).map((item, index) => (
            <div 
              key={index} 
              className="bg-secondary/30 p-2 rounded-md text-sm truncate"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKeyword();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyword Research</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input 
              placeholder="Enter your keyword" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Research'}
            </Button>
          </form>

          {isLoading && (
            <div className="text-center py-6 space-y-4">
              <div className="relative">
                <Progress value={65} className="h-2" />
                <div className="absolute -top-1 left-[65%] w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              </div>
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-primary" />
              <div className="space-y-1">
                <p className="font-medium">Researching keyword suggestions...</p>
                <p className="text-sm text-muted-foreground">
                  Analyzing search trends and gathering related topics
                </p>
              </div>
            </div>
          )}

          {!isLoading && (
            <div>
              {renderSuggestionSection('Top in SERP', suggestions.topInSERP)}
              {renderSuggestionSection('Hot Keyword Ideas', suggestions.hotKeywordIdeas)}
              {renderSuggestionSection('Popular Right Now', suggestions.popularRightNow)}
              {renderSuggestionSection('Top Suggestions', suggestions.topSuggestions)}
              
              {/* Show a message if no results were returned */}
              {!suggestions.topInSERP.length && 
               !suggestions.hotKeywordIdeas.length && 
               !suggestions.popularRightNow.length && 
               !suggestions.topSuggestions.length && (
                <div className="text-center py-4 text-muted-foreground">
                  {keyword ? 
                    "No results found. Try another keyword or check your connection." : 
                    "Enter a keyword above to start your research."}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
