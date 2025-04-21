
import { useState, useEffect, useMemo } from 'react';
import type { ClusterItem, ClusteringResponse } from '@/types/clustering';
import { safeGet } from '@/utils/dataValidation';

export const useKeywordSelection = (clusteringData: ClusteringResponse | null) => {
  const [selectedKeywords, setSelectedKeywords] = useState<Map<string, ClusterItem>>(new Map());

  // Update selected keywords when clustering data changes or is updated
  useEffect(() => {
    if (!clusteringData) {
      setSelectedKeywords(new Map());
      return;
    }

    try {
      const newSelection = new Map<string, ClusterItem>();
      
      // Safely iterate through clusters with proper validation
      const clusters = safeGet(clusteringData, 'clusters', []);
      
      if (Array.isArray(clusters)) {
        clusters.forEach(cluster => {
          // Skip if cluster doesn't have items array
          const items = safeGet(cluster, 'items', []);
          
          if (Array.isArray(items)) {
            items.forEach(item => {
              // Ensure item has required properties
              if (item && 
                  typeof item.keyword === 'string' && 
                  item.status === 'Select for Blog Creation' && 
                  (Number(item.priority) || 0) > 0) {
                newSelection.set(item.keyword, item);
              }
            });
          }
        });
      }
      
      setSelectedKeywords(newSelection);
    } catch (error) {
      console.error("Error processing keyword selection:", error);
      // Reset to empty map if there's an error
      setSelectedKeywords(new Map());
    }
  }, [clusteringData]);

  // Count of selected keywords with error handling
  const selectedCount = useMemo(() => {
    try {
      return selectedKeywords.size;
    } catch (error) {
      console.error("Error calculating selected count:", error);
      return 0;
    }
  }, [selectedKeywords]);

  return {
    selectedKeywords,
    selectedCount
  };
};
