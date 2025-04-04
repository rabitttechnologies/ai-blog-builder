
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { useKeywordResearch } from '@/hooks/useKeywordResearch';
import { Loader2 } from 'lucide-react';  // Replace Spinner with Loader2

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyword Research</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              placeholder="Enter your keyword" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              onClick={submitKeyword} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : 'Research'}
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <p>Researching keyword suggestions...</p>
            </div>
          )}

          {!isLoading && (
            <div>
              {renderSuggestionSection('Top in SERP', suggestions.topInSERP)}
              {renderSuggestionSection('Hot Keyword Ideas', suggestions.hotKeywordIdeas)}
              {renderSuggestionSection('Popular Right Now', suggestions.popularRightNow)}
              {renderSuggestionSection('Top Suggestions', suggestions.topSuggestions)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
