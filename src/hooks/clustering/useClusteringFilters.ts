
import { useState, useMemo } from 'react';
import type { ClusteringResponse, ClusteringFilters, GroupingOption, ClusterGroup } from '@/types/clustering';

export const useClusteringFilters = (clusteringData: ClusteringResponse | null) => {
  const [groupBy, setGroupBy] = useState<GroupingOption>('clusterName');
  const [filters, setFilters] = useState<ClusteringFilters>({});

  // Filter clusters based on current filters
  const filteredClusters = useMemo(() => {
    if (!clusteringData) return [];

    return clusteringData.clusters.map(cluster => {
      const filteredItems = cluster.items.filter(item => {
        // Apply all filters
        if (filters.keyword && !item.keyword.toLowerCase().includes(filters.keyword.toLowerCase())) {
          return false;
        }
        if (filters.competition && item.competition !== filters.competition) {
          return false;
        }
        if (filters.minDifficulty !== undefined && 
            item.keywordDifficulty !== null && 
            item.keywordDifficulty < filters.minDifficulty) {
          return false;
        }
        if (filters.maxDifficulty !== undefined && 
            item.keywordDifficulty !== null && 
            item.keywordDifficulty > filters.maxDifficulty) {
          return false;
        }
        if (filters.searchIntent && item.searchIntent !== filters.searchIntent) {
          return false;
        }
        if (filters.category && item.category !== filters.category) {
          return false;
        }
        return true;
      });

      return {
        ...cluster,
        items: filteredItems
      };
    }).filter(cluster => cluster.items.length > 0);
  }, [clusteringData, filters]);

  // Group clusters based on selected grouping
  const groupedClusters = useMemo(() => {
    if (!filteredClusters) return [];

    if (groupBy === 'clusterName') {
      // Already grouped by cluster name
      return filteredClusters;
    }

    // For other grouping options, we need to restructure
    const grouped = new Map<string, ClusterGroup>();

    filteredClusters.forEach(cluster => {
      cluster.items.forEach(item => {
        const groupValue = item[groupBy] || 'Unknown';
        if (!grouped.has(groupValue)) {
          grouped.set(groupValue, {
            clusterName: groupValue,
            intentPattern: groupBy === 'intentPattern' ? groupValue : cluster.intentPattern,
            coreTopic: groupBy === 'coreTopic' ? groupValue : cluster.coreTopic,
            reasoning: cluster.reasoning,
            items: []
          });
        }
        grouped.get(groupValue)!.items.push(item);
      });
    });

    return Array.from(grouped.values());
  }, [filteredClusters, groupBy]);

  return {
    groupBy,
    filters,
    setGroupBy,
    setFilters,
    filteredClusters,
    groupedClusters
  };
};
