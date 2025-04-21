
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface SearchResultsHeaderProps {
  keyword: string;
  totalSelections: number;
  maxSelections: number;
  isLoading: boolean;
  onClose: () => void;
  onAnalyze: () => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  keyword,
  totalSelections,
  maxSelections,
  isLoading,
  onClose,
  onAnalyze
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-semibold">Search Results: <span className="text-primary">{keyword}</span></h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select up to {maxSelections} keywords to analyze ({totalSelections}/{maxSelections} selected)
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Close
        </Button>
        <Button 
          onClick={onAnalyze}
          disabled={isLoading || totalSelections === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            `Analyze Selected (${totalSelections})`
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
