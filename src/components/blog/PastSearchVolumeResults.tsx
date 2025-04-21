
import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Loader2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/auth';
import LoadingOverlay from './LoadingOverlay';
import ClusteringWorkflow from '../clustering/ClusteringWorkflow';
import { safeMap } from '@/utils/dataValidation';

// Consistent shared UI class sets
const contentContainerClasses = "space-y-6 max-w-6xl mx-auto min-h-[600px]";
const headerClasses = "flex items-center justify-between flex-wrap gap-4";
const buttonContainerClasses = "flex items-center gap-2";

type SortDirection = 'asc' | 'desc' | null;

type SortableField = 'keyword' | 'monthlySearches' | 'competitionIndex' | 'competition' | 'lowTopOfPageBid' | 'highTopOfPageBid';

interface SortState {
  field: SortableField;
  direction: SortDirection;
}

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

export interface PastSearchVolumeResultsProps {
  volumeData: VolumeData[];
  workflowId: string;
  originalKeyword: string;
  onComplete: () => void;
  onCancel: () => void;
  onBack: () => void;
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

const getSortIcon = (field: SortableField, sort: SortState) => {
  if (sort.field !== field) return null;
  return sort.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
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
      // Don't auto-select keywords with zero monthly searches
      isSelected: item.monthlySearches !== null && item.monthlySearches > 0
    }))
  );
  const [clusteringData, setClusteringData] = useState<any>(null);
  const [sort, setSort] = useState<SortState>({ field: 'monthlySearches', direction: 'desc' });
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  // Select or deselect all keywords except those with zero monthly searches
  const toggleSelectAll = (select: boolean) => {
    setKeywordRows(prev => 
      prev.map(row => ({
        ...row,
        isSelected: select && (row.monthlySearches !== null && row.monthlySearches > 0)
      }))
    );
  };

  // Handle sorting
  const handleSort = (field: SortableField) => {
    if (sort.field === field) {
      // Toggle direction or reset
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc'
      });
    } else {
      // New field, default to ascending
      setSort({ field, direction: 'asc' });
    }
  };

  // Sort rows based on current sort state
  const sortedRows = [...keywordRows].sort((a, b) => {
    if (sort.direction === null) return 0;

    // Helper function for null-safe comparison
    const compare = (valA: any, valB: any, numeric = false) => {
      // Handle null values
      if (valA === null && valB === null) return 0;
      if (valA === null) return 1;
      if (valB === null) return -1;

      // Compare based on type
      if (numeric) {
        return sort.direction === 'asc' ? valA - valB : valB - valA;
      } else {
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sort.direction === 'asc' 
          ? strA.localeCompare(strB) 
          : strB.localeCompare(strA);
      }
    };

    // Sort based on field
    switch (sort.field) {
      case 'keyword':
        return compare(a.keyword, b.keyword);
      case 'monthlySearches':
        return compare(a.monthlySearches, b.monthlySearches, true);
      case 'competitionIndex':
        return compare(a.competitionIndex, b.competitionIndex, true);
      case 'competition':
        return compare(a.competition, b.competition);
      case 'lowTopOfPageBid':
        return compare(a.lowTopOfPageBid, b.lowTopOfPageBid, true);
      case 'highTopOfPageBid':
        return compare(a.highTopOfPageBid, b.highTopOfPageBid, true);
      default:
        return 0;
    }
  });

  // Get selected count
  const selectedCount = keywordRows.filter(row => row.isSelected).length;

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

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

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
      
      // Set up timeout for 3 minutes (180000ms)
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 180000); // 3 minutes
      
      // Store the payload for ClusteringWorkflow component
      setClusteringData(payload);
      
      // Clear timeout as we're not actually making the request here
      clearTimeout(timeoutId);
      
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
      abortControllerRef.current = null;
    }
  };

  // If clustering data is set, show the clustering workflow
  if (clusteringData) {
    return (
      <ClusteringWorkflow
        initialData={clusteringData}
        onClose={onComplete}
        onBack={() => {
          setClusteringData(null);
          setIsLoading(false);
        }}
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
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className={contentContainerClasses}>
      <div className="relative">
        <div className={headerClasses}>
          <h3 className="text-2xl font-semibold">Past Search Data for: <span className="text-primary">{originalKeyword}</span></h3>
          <Button variant="ghost" size="icon" onClick={onComplete} className="absolute top-0 right-0 md:mr-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
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
                disabled={keywordRows.every(row => row.isSelected || (row.monthlySearches !== null && row.monthlySearches === 0))}
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
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('keyword')}
                  >
                    <div className="flex items-center gap-1">
                      Keyword 
                      {getSortIcon('keyword', sort)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('monthlySearches')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Monthly Searches
                      {getSortIcon('monthlySearches', sort)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('competitionIndex')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Competition Index
                      {getSortIcon('competitionIndex', sort)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('competition')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Competition
                      {getSortIcon('competition', sort)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('lowTopOfPageBid')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Top of Page Bid (Low)
                      {getSortIcon('lowTopOfPageBid', sort)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('highTopOfPageBid')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Top of Page Bid (High)
                      {getSortIcon('highTopOfPageBid', sort)}
                    </div>
                  </TableHead>
                  <TableHead className="w-[180px]">Clustering Option</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((row, index) => (
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
                          updateClusteringOption(sortedRows.indexOf(row), value as ClusteringOption)
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
        <Button onClick={onBack} variant="outline">Back</Button>
        <Button 
          onClick={handleSendToClustering}
          disabled={isLoading || selectedCount === 0}
        >
          Send for Clustering
        </Button>
      </div>
      
      {isLoading && <LoadingOverlay message="Our AI agent is Clustering Your Keywords" />}
    </div>
  );
};

export default PastSearchVolumeResults;
