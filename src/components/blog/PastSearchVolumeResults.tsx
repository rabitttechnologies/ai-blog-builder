
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/auth';
import LoadingOverlay from './LoadingOverlay';
import ClusteringWorkflow from '../clustering/ClusteringWorkflow';
import { safeGet, safeMap } from '@/utils/dataValidation';

// Consistent shared UI class sets
const contentContainerClasses = "space-y-6 max-w-6xl mx-auto";
const headerClasses = "flex items-center justify-between flex-wrap gap-4";
const buttonContainerClasses = "flex items-center gap-2";

type VolumeData = {
  keyword: string;
  monthlySearches: number | null;
  competitionIndex: number | null;
  competition: string | null;
  lowTopOfPageBid: number | null;
  highTopOfPageBid: number | null;
};

type ClusteringOption = 'Select for Clustering' | 'Reject for Clustering' | 'Keep for Future';

interface KeywordSelectionRow extends VolumeData {
  clusteringOption: ClusteringOption;
  isSelected: boolean;
}

type SortField = 'keyword' | 'monthlySearches' | 'competitionIndex' | 'competition' | 'lowTopOfPageBid' | 'highTopOfPageBid';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface PastSearchVolumeResultsProps {
  volumeData: VolumeData[];
  workflowId: string;
  originalKeyword: string;
  onComplete: () => void;
  onCancel: () => void;
  onBack?: () => void;
}

const formatBidValue = (bid: any): string => {
  // Check if the value is valid for calculation
  if (bid === null || bid === undefined || isNaN(Number(bid))) {
    return "N/A";
  }
  
  // Convert to number, divide, and format with 2 decimal places
  const numericBid = Number(bid);
  const formattedBid = (numericBid / 1000000000).toFixed(2);
  
  // Return formatted string with dollar sign
  return `$${formattedBid}`;
};

const PastSearchVolumeResults: React.FC<PastSearchVolumeResultsProps> = ({
  volumeData,
  workflowId,
  originalKeyword,
  onComplete,
  onCancel,
  onBack
}) => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [keywordRows, setKeywordRows] = useState<KeywordSelectionRow[]>(() => 
    safeMap(volumeData, item => ({
      ...item,
      clusteringOption: 'Select for Clustering',
      isSelected: item.monthlySearches !== null && item.monthlySearches > 0
    }))
  );
  const [clusteringData, setClusteringData] = useState<any>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'keyword', direction: 'asc' });

  // Get session ID for request tracking
  const getSessionId = () => session?.access_token?.substring(0, 16) || 'anonymous-session';

  // Toggle selection for a keyword
  const toggleSelection = (index: number) => {
    setKeywordRows(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].isSelected = !updated[index].isSelected;
      }
      return updated;
    });
  };

  // Update clustering option for a keyword
  const updateClusteringOption = (index: number, option: ClusteringOption) => {
    setKeywordRows(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].clusteringOption = option;
      }
      return updated;
    });
  };

  // Select or deselect all keywords
  const toggleSelectAll = (select: boolean) => {
    setKeywordRows(prev => 
      prev.map(row => ({
        ...row,
        isSelected: select
      }))
    );
  };

  // Get selected count
  const selectedCount = keywordRows.filter(row => row.isSelected).length;

  // Handle sorting
  const requestSort = (field: SortField) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.field === field) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ field, direction });
  };

  // Get sorted data
  const sortedKeywordRows = useMemo(() => {
    const sortableRows = [...keywordRows];
    
    sortableRows.sort((a, b) => {
      // Handle null values
      if (a[sortConfig.field] === null && b[sortConfig.field] === null) return 0;
      if (a[sortConfig.field] === null) return 1;
      if (b[sortConfig.field] === null) return -1;
      
      // Compare values based on field type
      if (typeof a[sortConfig.field] === 'string') {
        return sortConfig.direction === 'asc'
          ? (a[sortConfig.field] as string).localeCompare(b[sortConfig.field] as string)
          : (b[sortConfig.field] as string).localeCompare(a[sortConfig.field] as string);
      }
      
      // For numeric values
      return sortConfig.direction === 'asc'
        ? (a[sortConfig.field] as number) - (b[sortConfig.field] as number)
        : (b[sortConfig.field] as number) - (a[sortConfig.field] as number);
    });
    
    return sortableRows;
  }, [keywordRows, sortConfig]);

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline" />
      : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  // Handle sending selected keywords to clustering
  const handleSendToClustering = async () => {
    // Validate authentication
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with clustering.",
        variant: "destructive"
      });
      return;
    }

    // Validate selections
    const selectedKeywords = keywordRows.filter(row => row.isSelected);
    if (selectedKeywords.length === 0) {
      toast({
        title: "No keywords selected",
        description: "Please select at least one keyword to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        selectedKeywords: selectedKeywords.map(row => ({
          keyword: row.keyword,
          clusteringOption: row.clusteringOption,
          monthlySearches: row.monthlySearches,
          competitionIndex: row.competitionIndex,
          competition: row.competition,
          lowTopOfPageBid: row.lowTopOfPageBid,
          highTopOfPageBid: row.highTopOfPageBid
        })),
        workflowId,
        userId: user.id,
        sessionId: getSessionId(),
        originalKeyword
      };
      
      console.log("Preparing clustering request with payload:", JSON.stringify(payload));
      
      // Store the payload for ClusteringWorkflow component
      setClusteringData(payload);
      
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError' 
        ? 'Request timed out. Clustering operation may take longer than expected.'
        : error.message || 'Failed to perform clustering operation';
        
      toast({
        title: "Clustering Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Clustering error:', error);
      setIsLoading(false);
    }
  };

  // If clustering data is set, show the clustering workflow
  if (clusteringData) {
    return (
      <ClusteringWorkflow
        initialData={clusteringData}
        onClose={onComplete}
      />
    );
  }

  // Validate volumeData
  if (!volumeData || !Array.isArray(volumeData) || volumeData.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No volume data available</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't retrieve volume data for your selected keywords.
        </p>
        <Button onClick={onCancel}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className={contentContainerClasses}>
      <div className={headerClasses}>
        <h3 className="text-2xl font-semibold">Past Search Data for <span className="text-primary">{originalKeyword}</span></h3>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Volume Results</CardTitle>
          <CardDescription>
            Review monthly search volume and competition metrics for your selected keywords
          </CardDescription>
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-muted-foreground">
              {selectedCount} keywords selected
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => toggleSelectAll(true)}
                disabled={keywordRows.every(row => row.isSelected)}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => toggleSelectAll(false)}
                disabled={keywordRows.every(row => !row.isSelected)}
              >
                Deselect All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('keyword')}>
                    Keyword {renderSortIndicator('keyword')}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => requestSort('monthlySearches')}>
                    Monthly Searches {renderSortIndicator('monthlySearches')}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => requestSort('competitionIndex')}>
                    Competition Index {renderSortIndicator('competitionIndex')}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => requestSort('competition')}>
                    Competition {renderSortIndicator('competition')}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => requestSort('lowTopOfPageBid')}>
                    Top of Page Bid (Low) {renderSortIndicator('lowTopOfPageBid')}
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => requestSort('highTopOfPageBid')}>
                    Top of Page Bid (High) {renderSortIndicator('highTopOfPageBid')}
                  </TableHead>
                  <TableHead className="w-[180px]">Clustering Option</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedKeywordRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={row.isSelected}
                        onChange={() => toggleSelection(index)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{row.keyword}</TableCell>
                    <TableCell className="text-right">
                      {row.monthlySearches !== null ? row.monthlySearches.toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.competitionIndex !== null ? row.competitionIndex : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.competition || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatBidValue(row.lowTopOfPageBid)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatBidValue(row.highTopOfPageBid)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.clusteringOption}
                        onValueChange={(value: ClusteringOption) => 
                          updateClusteringOption(index, value as ClusteringOption)
                        }
                        disabled={!row.isSelected}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Select for Clustering">Select for Clustering</SelectItem>
                          <SelectItem value="Reject for Clustering">Reject for Clustering</SelectItem>
                          <SelectItem value="Keep for Future">Keep for Future</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between pt-4 pb-8">
        {onBack && (
          <Button onClick={onBack} variant="outline" disabled={isLoading}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <Button 
          onClick={handleSendToClustering}
          disabled={isLoading || selectedCount === 0}
        >
          Send for Clustering {selectedCount > 0 && `(${selectedCount})`}
        </Button>
      </div>
      
      {isLoading && <LoadingOverlay loadingText="Our AI agent is Clustering Your Keywords" />}
    </div>
  );
};

export default PastSearchVolumeResults;
