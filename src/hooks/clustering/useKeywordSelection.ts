
import { useState, useEffect, useMemo } from 'react';
import type { ClusterItem, ClusteringResponse } from '@/types/clustering';

export const useKeywordSelection = (clusteringData: ClusteringResponse | null) => {
  const [selectedKeywords, setSelectedKeywords] = useState<Map<string, ClusterItem>>(new Map());

  // Update selected keywords when clustering data changes or is updated
  useEffect(() => {
    if (!clusteringData) {
      setSelectedKeywords(new Map());
      return;
    }

    const newSelection = new Map<string, ClusterItem>();
    
    clusteringData.clusters.forEach(cluster => {
      cluster.items.forEach(item => {
        if (item.status === 'Select for Blog Creation' && (item.priority || 0) > 0) {
          newSelection.set(item.keyword, item);
        }
      });
    });
    
    setSelectedKeywords(newSelection);
  }, [clusteringData]);

  // Count of selected keywords
  const selectedCount = useMemo(() => selectedKeywords.size, [selectedKeywords]);

  return {
    selectedKeywords,
    selectedCount
  };
};
