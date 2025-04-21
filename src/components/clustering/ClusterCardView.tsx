
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KeywordItem from './KeywordItem';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ClusterGroup, ClusterItem } from '@/types/clustering';

type SortDirection = 'asc' | 'desc' | null;

type SortableField = 'keyword' | 'monthlySearchVolume' | 'keywordDifficulty' | 'competition' | 'cpc' | 'category' | 'status';

interface SortState {
  field: SortableField;
  direction: SortDirection;
}

interface ClusterCardViewProps {
  clusters: ClusterGroup[];
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
}

const ClusterCardView: React.FC<ClusterCardViewProps> = ({ clusters, onUpdateKeyword }) => {
  const [sort, setSort] = useState<SortState>({ field: 'keyword', direction: 'asc' });
  
  // Track used priorities across all clusters
  const usedPriorities = useMemo(() => {
    const priorities: number[] = [];
    
    clusters.forEach(cluster => {
      cluster.items.forEach(item => {
        if (item.priority && !priorities.includes(item.priority)) {
          priorities.push(item.priority);
        }
      });
    });
    
    return priorities.sort((a, b) => a - b);
  }, [clusters]);
  
  // Handle sorting click
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
  
  // Get prioritized keywords
  const prioritizedKeywords = useMemo(() => {
    const keywords: Set<string> = new Set();
    
    clusters.forEach(cluster => {
      cluster.items.forEach(item => {
        if (item.priority && item.priority > 0) {
          keywords.add(item.keyword);
        }
      });
    });
    
    return keywords;
  }, [clusters]);
  
  // Sort and group items by priority
  const sortedClusters = useMemo(() => {
    return clusters.map(cluster => {
      let sortedItems = [...cluster.items];
      
      // First, separate prioritized items
      const prioritizedItems = sortedItems.filter(item => item.priority && item.priority > 0);
      const nonPrioritizedItems = sortedItems.filter(item => !item.priority || item.priority <= 0);
      
      // Sort prioritized items by priority
      prioritizedItems.sort((a, b) => {
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;
        return priorityA - priorityB;
      });
      
      // Sort non-prioritized items based on current sort
      if (sort.direction !== null) {
        nonPrioritizedItems.sort((a, b) => {
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
            case 'monthlySearchVolume':
              return compare(a.monthlySearchVolume, b.monthlySearchVolume, true);
            case 'keywordDifficulty':
              return compare(a.keywordDifficulty, b.keywordDifficulty, true);
            case 'competition':
              return compare(a.competition, b.competition);
            case 'cpc':
              return compare(a.cpc, b.cpc, true);
            case 'category':
              return compare(a.category, b.category);
            case 'status':
              return compare(a.status, b.status);
            default:
              return 0;
          }
        });
      }
      
      // Combine prioritized and non-prioritized items
      return {
        ...cluster,
        items: [...prioritizedItems, ...nonPrioritizedItems]
      };
    });
  }, [clusters, sort]);

  // Helper for sort indicators
  const getSortIcon = (field: SortableField) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  // Sorting headers
  const SortHeader = ({ field, label }: { field: SortableField, label: string }) => (
    <div 
      className="flex items-center gap-1 cursor-pointer hover:text-primary"
      onClick={() => handleSort(field)}
    >
      {label}
      {getSortIcon(field)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sort controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-sm font-medium px-4">
        <SortHeader field="keyword" label="Keyword" />
        <SortHeader field="monthlySearchVolume" label="Volume" />
        <SortHeader field="keywordDifficulty" label="Difficulty" />
        <SortHeader field="competition" label="Competition" />
        <SortHeader field="category" label="Category" />
        <SortHeader field="cpc" label="CPC" />
        <SortHeader field="status" label="Status" />
      </div>
      
      {sortedClusters.map((cluster) => (
        <Card key={cluster.clusterName} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg">{cluster.clusterName}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
              {cluster.items.map((item) => (
                <KeywordItem
                  key={item.keyword}
                  item={item}
                  clusterName={cluster.clusterName}
                  onUpdateKeyword={(keyword, updates) => 
                    onUpdateKeyword(cluster.clusterName, keyword, updates)
                  }
                  usedPriorities={usedPriorities}
                  isPrioritized={!!item.priority && item.priority > 0}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClusterCardView;
