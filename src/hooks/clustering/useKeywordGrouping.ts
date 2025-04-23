
import { useState, useCallback } from 'react';
import type { ClusterGroup, GroupingOption, ClusteringFilters } from '@/types/clustering';

export const useKeywordGrouping = () => {
  const [groupBy, setGroupBy] = useState<GroupingOption>('clusterName');
  const [filters, setFilters] = useState<ClusteringFilters>({});

  // Group clusters based on selected grouping option
  const groupClusters = useCallback((
    clusters: ClusterGroup[], 
    currentFilters: ClusteringFilters
  ): ClusterGroup[] => {
    if (!clusters) return [];

    // First apply filters
    const filteredClusters = clusters.map(cluster => {
      const filteredItems = cluster.items.filter(item => {
        // Filter by keyword
        if (currentFilters.keyword && !item.keyword.toLowerCase().includes(currentFilters.keyword.toLowerCase())) {
          return false;
        }
        
        // Filter by competition
        if (currentFilters.competition && item.competition !== currentFilters.competition) {
          return false;
        }
        
        // Filter by keyword difficulty range
        if (currentFilters.minDifficulty !== undefined && 
            item.keywordDifficulty !== null && 
            item.keywordDifficulty < currentFilters.minDifficulty) {
          return false;
        }
        
        if (currentFilters.maxDifficulty !== undefined && 
            item.keywordDifficulty !== null && 
            item.keywordDifficulty > currentFilters.maxDifficulty) {
          return false;
        }
        
        // Filter by search intent
        if (currentFilters.searchIntent && item.searchIntent !== currentFilters.searchIntent) {
          return false;
        }
        
        // Filter by category
        if (currentFilters.category && item.category !== currentFilters.category) {
          return false;
        }
        
        return true;
      });

      return {
        ...cluster,
        items: filteredItems
      };
    }).filter(cluster => cluster.items.length > 0);

    // Then group by the selected option if it's not clusterName
    if (groupBy === 'clusterName' || !filteredClusters.length) {
      return filteredClusters;
    }

    // For other grouping options, restructure the data
    const grouped = new Map<string, ClusterGroup>();
    
    filteredClusters.forEach(cluster => {
      cluster.items.forEach(item => {
        // Get the value to group by
        const groupValue = item[groupBy] || 'Unknown';
        
        // Create a new group if needed
        if (!grouped.has(groupValue)) {
          grouped.set(groupValue, {
            clusterName: groupValue,
            intentPattern: groupBy === 'intentPattern' ? groupValue : 'Various',
            coreTopic: groupBy === 'coreTopic' ? groupValue : 'Various',
            reasoning: `Items grouped by ${groupBy}`,
            items: []
          });
        }
        
        // Add the item to the appropriate group
        grouped.get(groupValue)!.items.push(item);
      });
    });

    return Array.from(grouped.values());
  }, [groupBy]);

  return {
    groupBy,
    filters,
    setGroupBy,
    setFilters,
    groupClusters
  };
};
