
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { isItemSelected, toggleItemSelection } from '@/utils/selectionUtils';
import SelectableItem from './SelectableItem';
import SearchSectionHeader from './SearchSectionHeader';
import LoadingOverlay from './LoadingOverlay';

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
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [selections, setSelections] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!data) return null;
  
  const isValidData = (data: any, type?: string): boolean => {
    if (data === null || data === undefined) return false;
    if (type === 'array') return Array.isArray(data) && data.length > 0;
    if (type === 'object') return typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;
    if (type === 'string') return typeof data === 'string' && data.trim() !== '';
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object' && data !== null) return Object.keys(data).length > 0;
    return !!data;
  };

  const headingMappings = {
    'Top in SERP': { key: 'organicResults', type: 'array' },
    'Hot Keyword Ideas': { key: 'relatedQueries', type: 'array' },
    'Popular Right Now': { key: 'peopleAlsoAsk', type: 'array' },
    'Other Keyword Ideas': { keys: ['paidResults', 'suggestedResults'], type: 'array' }
  };

  const getSessionId = () => session?.access_token?.substring(0, 16) || 'anonymous-session';

  const handleAnalyzeSelected = async () => {
    const hasSelections = Object.values(selections).some(items => items.length > 0);
    
    if (!hasSelections) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to analyze.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to use this feature.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        selectedData: selections,
        workflowId,
        userId: user.id, 
        sessionId: getSessionId(),
        keyword
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const response = await fetch('https://n8n.agiagentworld.com/webhook/pastsearchvolume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Request failed (${response.status}): ${errorText}`);
      }
      
      const responseData = await response.json();
      
      toast({
        title: "Analysis Complete",
        description: "Selected items have been successfully analyzed.",
      });
      
      console.log("Analysis response:", responseData);
      
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError' 
        ? 'Request timed out. Please try again.'
        : error.message || 'Failed to analyze selected items';
        
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSelections = Object.values(selections).reduce(
    (total, items) => total + items.length, 0
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Search Results: <span className="text-primary">{keyword}</span></h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button 
            onClick={handleAnalyzeSelected}
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
          <Card key={heading}>
            <SearchSectionHeader 
              heading={heading}
              description={
                heading === 'Top in SERP' ? 'Top search results for your keyword' :
                heading === 'Hot Keyword Ideas' ? 'Related queries users are searching for' :
                heading === 'Popular Right Now' ? 'Questions people are asking' :
                'Additional keyword suggestions'
              }
            />
            <CardContent>
              <div className="space-y-2">
                {Array.isArray(sectionData) && sectionData.map((item, index) => (
                  <SelectableItem
                    key={index}
                    item={item}
                    isSelected={isItemSelected(selections, heading, item)}
                    onToggle={() => toggleItemSelection(selections, heading, item, setSelections)}
                    index={index}
                    heading={heading}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
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
