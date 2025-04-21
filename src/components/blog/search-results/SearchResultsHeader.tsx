
import React from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface SearchResultsHeaderProps {
  keyword: string;
  title?: string;
  totalSelections: number;
  maxSelections: number;
  isLoading: boolean;
  showCloseButton?: boolean;
  onClose: () => void;
  onAnalyze?: () => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  keyword,
  title = "Search Results",
  totalSelections,
  maxSelections,
  isLoading,
  showCloseButton = true,
  onClose,
  onAnalyze
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{title} <span className="text-primary">{keyword}</span></h2>
        <p className="text-sm text-muted-foreground">
          {totalSelections} of {maxSelections} keywords selected
        </p>
      </div>
      
      {showCloseButton && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          
          {onAnalyze && (
            <Button 
              size="sm" 
              onClick={onAnalyze}
              disabled={isLoading || totalSelections === 0}
            >
              Get Past Search History
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsHeader;
