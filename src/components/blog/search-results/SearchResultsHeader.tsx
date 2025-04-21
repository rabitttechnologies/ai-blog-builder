
import React from 'react';

interface SearchResultsHeaderProps {
  keyword: string;
  totalSelections: number;
  maxSelections: number;
  isLoading: boolean;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  keyword,
  totalSelections,
  maxSelections,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-semibold">Keyword Ideas for: <span className="text-primary">{keyword}</span></h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select up to {maxSelections} keywords to analyze ({totalSelections}/{maxSelections} selected)
        </p>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
