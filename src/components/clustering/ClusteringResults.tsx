
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Filter } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import FilterControls from './FilterControls';
import ClusterCardView from './ClusterCardView';
import ClusterTableView from './ClusterTableView';
import SelectionCounter from './SelectionCounter';
import type { ClusterGroup, ClusteringFilters, GroupingOption, ClusterItem } from '@/types/clustering';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClusteringResultsProps {
  clusters: ClusterGroup[];
  workflowId: string;
  executionId: string;
  groupBy: GroupingOption;
  filters: ClusteringFilters;
  selectedCount: number;
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
  onSetFilters: (filters: ClusteringFilters) => void;
  onSetGroupBy: (groupBy: GroupingOption) => void;
  onClose: () => void;
  onBack?: () => void;
  onGenerateTitles: () => void;
}

const ClusteringResults: React.FC<ClusteringResultsProps> = ({
  clusters,
  groupBy,
  filters,
  selectedCount,
  onUpdateKeyword,
  onSetFilters,
  onSetGroupBy,
  onClose,
  onBack,
  onGenerateTitles
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'card' | 'table'>('card');
  
  if (!clusters || clusters.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No clusters found</h3>
        <p className="text-muted-foreground mb-4">No clustering data is available for this analysis.</p>
        <Button onClick={onClose} size="md">Close</Button>
      </div>
    );
  }

  const toggleFilters = () => setShowFilters(!showFilters);

  // Get unique search intents for filters
  const searchIntents = Array.from(
    new Set(
      clusters.flatMap(cluster => 
        cluster.items
          .map(item => item.searchIntent)
          .filter((intent): intent is string => intent !== null && intent !== undefined)
      )
    )
  );

  // Get unique categories for filters
  const categories = Array.from(
    new Set(
      clusters.flatMap(cluster => 
        cluster.items
          .map(item => item.category)
          .filter((category): category is string => category !== null && category !== undefined)
      )
    )
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 relative">
        <div>
          <h3 className="text-2xl font-semibold">Keyword Clusters</h3>
        </div>
      </div>

      {/* Tabs for view selection */}
      <Tabs defaultValue="card" onValueChange={(v) => setView(v as 'card' | 'table')}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="card">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select value={groupBy} onValueChange={(value) => onSetGroupBy(value as GroupingOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clusterName">Cluster Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="intentPattern">Intent Pattern</SelectItem>
                <SelectItem value="coreTopic">Core Topic</SelectItem>
                <SelectItem value="searchIntent">Search Intent</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={toggleFilters} size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Filter controls */}
        {showFilters && (
          <FilterControls 
            filters={filters} 
            onSetFilters={onSetFilters}
            searchIntents={searchIntents}
            categories={categories}
          />
        )}

        {/* Card View */}
        <TabsContent value="card" className="mt-6">
          <ClusterCardView 
            clusters={clusters} 
            onUpdateKeyword={onUpdateKeyword} 
          />
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-6">
          <ClusterTableView 
            clusters={clusters} 
            onUpdateKeyword={onUpdateKeyword} 
          />
        </TabsContent>
      </Tabs>

      {/* Bottom action buttons */}
      <div className="flex justify-between pt-4 pb-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} size="md">
            Back
          </Button>
        )}
        
        <div className="flex-1" />
        
        <Button 
          onClick={onGenerateTitles} 
          disabled={selectedCount < 1}
          size="md"
        >
          Create Title and Description
        </Button>
      </div>
      
      {/* Selection counter */}
      <SelectionCounter
        selectedCount={selectedCount}
        onGenerateTitles={onGenerateTitles}
      />
    </div>
  );
};

export default ClusteringResults;
