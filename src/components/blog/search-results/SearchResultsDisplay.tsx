
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { isValidData } from '@/utils/dataValidation';
import SearchResultSection from './SearchResultSection';
import KeywordListSection from './KeywordListSection';

interface SearchResultsDisplayProps {
  data: any;
  onClose: () => void;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ data, onClose }) => {
  if (!data) return null;
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">
          Search Results: <span className="text-primary">{data.keyword}</span>
        </h3>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      
      <Separator />
      
      {/* Organic Results */}
      {isValidData(data.organicResults, 'array') && (
        <SearchResultSection
          title="Organic Results"
          description="Top search results for your keyword"
          items={data.organicResults}
          type="link"
        />
      )}
      
      {/* People Also Ask */}
      {isValidData(data.peopleAlsoAsk, 'array') && (
        <SearchResultSection
          title="People Also Ask"
          description="Related questions from users"
          items={data.peopleAlsoAsk}
        />
      )}
      
      {/* Related Queries */}
      {isValidData(data.relatedQueries, 'array') && (
        <KeywordListSection
          title="Related Queries"
          description="Similar searches users perform"
          keywords={data.relatedQueries}
        />
      )}
      
      {/* Paid Results */}
      {isValidData(data.paidResults, 'array') && (
        <SearchResultSection
          title="Paid Results"
          description="Sponsored content related to your search"
          items={data.paidResults}
        />
      )}
      
      {/* Suggested Results */}
      {isValidData(data.suggestedResults, 'array') && (
        <KeywordListSection
          title="Suggested Results"
          description="Additional suggestions for your search"
          keywords={data.suggestedResults}
        />
      )}
      
      {/* Keyword Clusters */}
      {isValidData(data.keywordClusters, 'array') && (
        <SearchResultSection
          title="Keyword Clusters"
          description="Groups of related keywords"
          items={data.keywordClusters}
        />
      )}
      
      {/* Historical Data */}
      {isValidData(data.historicalData, 'array') && (
        <SearchResultSection
          title="Historical Data"
          description="Search volume trends over time"
          items={data.historicalData}
        />
      )}
      
      {/* Category Keywords */}
      {isValidData(data.categoryKeyword, 'array') && (
        <KeywordListSection
          title="Category Keywords"
          description="Keywords categorized by theme"
          keywords={data.categoryKeyword}
        />
      )}
      
      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={onClose}>Close Results</Button>
      </div>
    </div>
  );
};

export default SearchResultsDisplay;
