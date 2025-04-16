
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/Button';
import { isItemSelected } from '@/utils/selectionUtils';
import { isValidData, headingMappings } from '@/utils/dataValidation';
import { useKeywordSelections, MAX_SELECTIONS } from '@/hooks/useKeywordSelections';
import { useVolumeAnalysis } from '@/hooks/useVolumeAnalysis';
import { useProfileData } from '@/hooks/useProfileData';
import LoadingOverlay from './LoadingOverlay';
import PastSearchVolumeResults from './PastSearchVolumeResults';
import SearchResultsHeader from './search-results/SearchResultsHeader';
import SearchResultsSection from './search-results/SearchResultsSection';

interface SelectableSearchResultsProps {
  data: any;
  keyword: string;
  workflowId: string;
  onClose: () => void;
}

const SelectableSearchResults: React.FC<SelectableSearchResultsProps> = ({ 
  data, 
  keyword,
  workflowId,
  onClose 
}) => {
  const { selections, totalSelections, handleToggleSelection } = useKeywordSelections();
  const { isLoading, volumeData, setVolumeData, analyzeSelectedKeywords } = useVolumeAnalysis(keyword, workflowId);
  const profileData = useProfileData();
  
  if (!data) return null;
  
  // If we have volume data, show the volume results component
  if (volumeData) {
    return (
      <PastSearchVolumeResults
        volumeData={volumeData}
        workflowId={workflowId}
        originalKeyword={keyword}
        onComplete={onClose}
        onCancel={() => setVolumeData(null)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SearchResultsHeader
        keyword={keyword}
        totalSelections={totalSelections}
        maxSelections={MAX_SELECTIONS}
        isLoading={isLoading}
        onClose={onClose}
        onAnalyze={() => analyzeSelectedKeywords(selections, profileData)}
      />
      
      <Separator />
      
      {Object.entries(headingMappings).map(([heading, mapping]) => {
        let sectionData;
        
        if ('key' in mapping) {
          sectionData = data[mapping.key];
        } else if ('keys' in mapping) {
          sectionData = mapping.keys
            .map(key => data[key])
            .filter(Boolean)
            .flat();
        }
        
        if (!isValidData(sectionData, mapping.type)) return null;
        
        return (
          <SearchResultsSection
            key={heading}
            heading={heading}
            description={
              heading === 'Top in SERP' ? 'Top search results for your keyword' :
              heading === 'Hot Keyword Ideas' ? 'Related queries users are searching for' :
              heading === 'Popular Right Now' ? 'Questions people are asking' :
              'Additional keyword suggestions'
            }
            data={sectionData}
            selections={selections}
            totalSelections={totalSelections}
            maxSelections={MAX_SELECTIONS}
            onToggleSelection={handleToggleSelection}
          />
        );
      })}
      
      {isLoading && <LoadingOverlay />}
      
      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={onClose} disabled={isLoading}>Close Results</Button>
      </div>
    </div>
  );
};

export default SelectableSearchResults;
