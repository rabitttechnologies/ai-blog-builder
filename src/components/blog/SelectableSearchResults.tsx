import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { CheckIcon, X, Edit, Save, ArrowLeft } from 'lucide-react';
import { isItemSelected } from '@/utils/selectionUtils';
import { isValidData, headingMappings, safeFilter, safeGet } from '@/utils/dataValidation';
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
  const [editableKeywords, setEditableKeywords] = useState<Record<string, boolean>>({});
  const [keywordValues, setKeywordValues] = useState<Record<string, string>>({});
  
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
        onBack={() => setVolumeData(null)}
      />
    );
  }

  // Handle editing for keywords
  const startEditing = (heading: string, item: any) => {
    const keyId = `${heading}-${item.keyword || item}`;
    setEditableKeywords(prev => ({ ...prev, [keyId]: true }));
    setKeywordValues(prev => ({ ...prev, [keyId]: item.keyword || item }));
  };

  const stopEditing = (heading: string, item: any, save: boolean = false) => {
    const keyId = `${heading}-${item.keyword || item}`;
    
    if (save && keywordValues[keyId] && keywordValues[keyId] !== (item.keyword || item)) {
      // Handle updating the keyword value in your data structure
      // This is a placeholder - you'll need to implement actual update logic
      console.log(`Updated keyword from ${item.keyword || item} to ${keywordValues[keyId]}`);
    }
    
    setEditableKeywords(prev => ({ ...prev, [keyId]: false }));
  };

  const updateKeywordValue = (heading: string, item: any, value: string) => {
    const keyId = `${heading}-${item.keyword || item}`;
    setKeywordValues(prev => ({ ...prev, [keyId]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SearchResultsHeader
        keyword={keyword || 'Unknown'}
        title="Keyword Ideas for:"
        totalSelections={totalSelections}
        maxSelections={MAX_SELECTIONS}
        isLoading={isLoading}
        showCloseButton={false}
        onClose={onClose}
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
            selections={selections || {}}
            totalSelections={totalSelections}
            maxSelections={MAX_SELECTIONS}
            onToggleSelection={handleToggleSelection}
            editableKeywords={editableKeywords}
            keywordValues={keywordValues}
            onStartEditing={startEditing}
            onStopEditing={stopEditing}
            onUpdateKeyword={updateKeywordValue}
          />
        );
      })}
      
      {isLoading && 
        <LoadingOverlay 
          loadingText="Getting Past Search Data" 
        />
      }
      
      <div className="flex justify-between pt-4 pb-8">
        <Button 
          onClick={onBack} 
          disabled={isLoading}
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={() => {
            // Only analyze if we have selections
            if (selections && Object.keys(selections).length > 0) {
              analyzeSelectedKeywords(selections, profileData);
            }
          }} 
          disabled={isLoading || totalSelections === 0}
        >
          Get Past Search History
        </Button>
      </div>
    </div>
  );
};

export default SelectableSearchResults;
