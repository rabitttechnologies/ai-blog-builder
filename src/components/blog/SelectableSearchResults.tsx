
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/Button';
import { isItemSelected } from '@/utils/selectionUtils';
import { isValidData, headingMappings, safeGet } from '@/utils/dataValidation';
import { useKeywordSelections, MAX_SELECTIONS, SelectionsState } from '@/hooks/useKeywordSelections';
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
  onBack: () => void;
}

const SelectableSearchResults: React.FC<SelectableSearchResultsProps> = ({ 
  data, 
  keyword,
  workflowId,
  onClose,
  onBack
}) => {
  const { selections, totalSelections, handleToggleSelection } = useKeywordSelections();
  const { isLoading, volumeData, setVolumeData, analyzeSelectedKeywords } = useVolumeAnalysis(keyword, workflowId);
  const profileData = useProfileData();
  
  // Early return if data is completely missing
  if (!data) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold">No Data Available</h3>
        <p className="text-muted-foreground mb-4">We couldn't retrieve search results for your keyword.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }
  
  // If we have volume data, show the volume results component
  if (volumeData) {
    return (
      <PastSearchVolumeResults
        volumeData={volumeData}
        workflowId={workflowId}
        originalKeyword={keyword}
        onComplete={onClose}
        onCancel={() => setVolumeData(null)}
        onBack={() => setVolumeData(null)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <SearchResultsHeader
        keyword={keyword || 'Unknown'}
        totalSelections={totalSelections}
        maxSelections={MAX_SELECTIONS}
        isLoading={isLoading}
      />
      
      <Separator />
      
      {Object.entries(headingMappings).map(([heading, mapping]) => {
        let sectionData;
        
        try {
          if ('key' in mapping) {
            // Safely access data using the key
            sectionData = safeGet(data, mapping.key, []);
          } else if ('keys' in mapping) {
            // Combine data from multiple keys with safety checks
            sectionData = (mapping.keys || [])
              .map(key => safeGet(data, key, []))
              .filter(Array.isArray)
              .flat();
          }
          
          // Skip rendering if we don't have valid data
          if (!isValidData(sectionData, mapping.type)) {
            return null;
          }
        } catch (error) {
          console.error(`Error processing data for section "${heading}":`, error);
          return null;
        }
        
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
            data={sectionData || []}
            selections={selections}
            totalSelections={totalSelections}
            maxSelections={MAX_SELECTIONS}
            onToggleSelection={handleToggleSelection}
            editable={true}
          />
        );
      })}
      
      {isLoading && <LoadingOverlay message="Getting Past Search Data" />}
      
      <div className="flex justify-between pt-4 pb-8">
        <Button onClick={onBack} variant="outline" size="md">Back</Button>
        <Button 
          onClick={() => {
            if (selections && Object.keys(selections).length > 0) {
              analyzeSelectedKeywords(selections, profileData);
            }
          }} 
          disabled={isLoading || totalSelections === 0}
          size="md"
        >
          Get Past Search History
        </Button>
      </div>
    </div>
  );
};

export default SelectableSearchResults;
