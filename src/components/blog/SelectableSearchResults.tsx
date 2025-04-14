
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';

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
  
  // Helper to check if a section has data before rendering
  const isValidData = (data: any, type?: string): boolean => {
    if (data === null || data === undefined) return false;
    
    if (type === 'array') return Array.isArray(data) && data.length > 0;
    if (type === 'object') return typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0;
    if (type === 'string') return typeof data === 'string' && data.trim() !== '';
    
    // Default comprehensive check
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object' && data !== null) return Object.keys(data).length > 0;
    return !!data;
  };

  // Mapping display headings to data keys
  const headingMappings = {
    'Keyword': { key: 'keyword', type: 'string' },
    'Top in SERP': { key: 'organicResults', type: 'array' },
    'Hot Keyword Ideas': { key: 'relatedQueries', type: 'array' },
    'Popular Right Now': { key: 'peopleAlsoAsk', type: 'array' },
    'Other Keyword Ideas': { keys: ['keywordClusters', 'categoryKeyword'], type: 'array' }
  };

  // Toggle selection for an item
  const toggleSelection = (heading: string, item: any) => {
    setSelections(prev => {
      // Get current selections for this heading
      const currentSelections = prev[heading] || [];
      
      // Determine item identifier based on type
      const getItemId = (item: any) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // Try to find a unique identifier
          return item.id || item.url || item.title || JSON.stringify(item);
        }
        return String(item);
      };
      
      const itemId = getItemId(item);
      
      // Check if already selected
      const isSelected = currentSelections.some(selectedItem => 
        getItemId(selectedItem) === itemId
      );
      
      // Update selections
      return {
        ...prev,
        [heading]: isSelected
          ? currentSelections.filter(i => getItemId(i) !== itemId)
          : [...currentSelections, item]
      };
    });
  };

  // Check if an item is selected
  const isSelected = (heading: string, item: any) => {
    const currentSelections = selections[heading] || [];
    
    const getItemId = (item: any) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        return item.id || item.url || item.title || JSON.stringify(item);
      }
      return String(item);
    };
    
    return currentSelections.some(selectedItem => 
      getItemId(selectedItem) === getItemId(item)
    );
  };

  // Render selectable items
  const renderSelectableItems = (heading: string, items: any[]) => {
    if (!items || !Array.isArray(items)) return null;
    
    return (
      <div className="space-y-2">
        {items.map((item, index) => {
          // Handle different item types
          let content;
          
          if (typeof item === 'string') {
            content = (
              <div className="ml-2">{item}</div>
            );
          } else if (item.title && item.url) {
            // Organic results
            content = (
              <div className="ml-2">
                <p className="font-semibold">{item.title}</p>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm flex items-center hover:underline"
                >
                  {item.url.substring(0, 50)}...
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                {item.snippet && <p className="text-sm text-gray-600 mt-1">{item.snippet}</p>}
              </div>
            );
          } else if (item.cluster && item.keywords) {
            // Keyword clusters
            content = (
              <div className="ml-2">
                <h4 className="font-medium">{item.cluster}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.keywords.map((kw: string, kwIndex: number) => (
                    <span key={kwIndex} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          } else if (item.period && item.volume) {
            // Historical data
            content = (
              <div className="ml-2 flex justify-between items-center">
                <span>{item.period}</span>
                <span className="font-medium">{item.volume} searches</span>
              </div>
            );
          } else if (item.title && item.description) {
            // Pillar content
            content = (
              <div className="ml-2">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                {item.topics && item.topics.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-500 mb-1">Suggested Topics:</h5>
                    <ul className="space-y-1">
                      {item.topics.map((topic: string, tIndex: number) => (
                        <li key={tIndex} className="text-sm">{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          } else {
            // Generic object
            content = (
              <div className="ml-2">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium">{key}: </span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            );
          }
          
          return (
            <div 
              key={index} 
              className="flex items-start p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Checkbox 
                id={`${heading}-${index}`}
                checked={isSelected(heading, item)}
                onCheckedChange={() => toggleSelection(heading, item)}
                className="mt-1"
              />
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  // Get session ID
  const getSessionId = () => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  };

  // Handle submission of selected items
  const handleAnalyzeSelected = async () => {
    // Check if there are any selections
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
        workflowId, // Use preserved ID from first webhook
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
      
      // Here you would handle the next step with the analysis data
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

  // Calculate total selections
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
      
      {/* Display sections based on data availability */}
      {Object.entries(headingMappings).map(([heading, mapping]) => {
        // Get data based on mapping
        let sectionData;
        
        if ('key' in mapping) {
          // Single key mapping
          sectionData = data[mapping.key];
        } else if ('keys' in mapping) {
          // Multiple keys mapping
          sectionData = mapping.keys
            .map(key => data[key])
            .filter(Boolean)
            .flat();
        }
        
        // Skip rendering if no valid data
        if (!isValidData(sectionData, mapping.type)) return null;
        
        // Special case for keyword (string value)
        if (heading === 'Keyword' && typeof sectionData === 'string') {
          return null; // Skip keyword section as it's in the heading
        }
        
        return (
          <Card key={heading}>
            <CardHeader>
              <CardTitle>{heading}</CardTitle>
              <CardDescription>
                {heading === 'Top in SERP' && 'Top search results for your keyword'}
                {heading === 'Hot Keyword Ideas' && 'Related queries users are searching for'}
                {heading === 'Popular Right Now' && 'Questions people are asking'}
                {heading === 'Other Keyword Ideas' && 'Additional keyword suggestions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(sectionData) 
                ? renderSelectableItems(heading, sectionData)
                : null
              }
            </CardContent>
          </Card>
        );
      })}
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Analyzing your selection...</p>
            <p className="text-sm text-muted-foreground">This may take up to a minute</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={onClose} disabled={isLoading}>Close Results</Button>
      </div>
    </div>
  );
};

export default SelectableSearchResults;
