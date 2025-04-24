import { useState, useEffect, useCallback, useMemo } from 'react';
import { useClusteringData } from './clustering/useClusteringData';
import { useKeywordGrouping } from './clustering/useKeywordGrouping';
import { useTitleGeneration } from './clustering/useTitleGeneration';
import { useOutlinePrompt, OutlinePromptFormData } from './clustering/useOutlinePrompt';
import { useFinalBlogCreation, FinalBlogFormData } from './clustering/useFinalBlogCreation';
import { useBlogCreation } from './clustering/useBlogCreation';
import type { ClusteringResponse, ClusterItem, ClusterGroup, GroupingOption, ClusteringFilters } from '@/types/clustering';

export const useClusteringWorkflow = () => {
  const clusteringHook = useClusteringData();
  const titleHook = useTitleGeneration(clusteringHook.clusteringData);
  const outlineHook = useOutlinePrompt(titleHook.titleDescriptionData);
  const finalBlogHook = useFinalBlogCreation(outlineHook.outlinePromptData);
  const blogCreationHook = useBlogCreation(titleHook.titleDescriptionData);
  
  const {
    groupBy,
    filters,
    setGroupBy,
    setFilters,
    groupClusters
  } = useKeywordGrouping();

  const [selectedKeywords, setSelectedKeywords] = useState<{ [key: string]: boolean }>({});

  // Count selected keywords
  const selectedCount = useMemo(() => {
    return Object.values(selectedKeywords).filter(Boolean).length;
  }, [selectedKeywords]);

  // Group clusters based on the selected grouping option
  const groupedClusters = useMemo(() => {
    if (clusteringHook.clusteringData?.clusters) {
      return groupClusters(clusteringHook.clusteringData.clusters, filters);
    }
    return [];
  }, [clusteringHook.clusteringData?.clusters, groupClusters, filters]);

  // Update keyword status
  const updateKeyword = useCallback((clusterName: string, keyword: string, updates: Partial<ClusterItem>) => {
    clusteringHook.updateKeyword(clusterName, keyword, updates);
    
    // Update selected keywords if status is changed
    if (updates.status) {
      setSelectedKeywords(prev => {
        const newState = { ...prev };
        if (updates.status === 'Select for Blog Creation') {
          newState[keyword] = true;
        } else {
          newState[keyword] = false;
        }
        return newState;
      });
    }
  }, [clusteringHook]);

  // Initialize selected keywords based on clustering data
  useEffect(() => {
    if (clusteringHook.clusteringData?.clusters) {
      const selected: { [key: string]: boolean } = {};
      clusteringHook.clusteringData.clusters.forEach(cluster => {
        cluster.items.forEach(item => {
          selected[item.keyword] = item.status === 'Select for Blog Creation';
        });
      });
      setSelectedKeywords(selected);
    }
  }, [clusteringHook.clusteringData]);

  // Fetch clustering data (pass through from clusteringHook)
  const fetchClusteringData = useCallback(async (data: any) => {
    return clusteringHook.fetchClusteringData(data);
  }, [clusteringHook.fetchClusteringData]);

  // Generate title and description (pass through from titleHook)
  const generateTitleDescription = useCallback(async () => {
    return titleHook.generateTitleDescription();
  }, [titleHook.generateTitleDescription]);

  // Update title/description (pass through from titleHook)
  const updateTitleDescription = useCallback((itemId: string, updates: any) => {
    titleHook.updateTitleDescription(itemId, updates);
  }, [titleHook.updateTitleDescription]);

  // Generate outline and prompt (using outlineHook)
  const generateOutlinePrompt = useCallback(async (selectedItem: any) => {
    return outlineHook.generateOutlinePrompt(selectedItem);
  }, [outlineHook.generateOutlinePrompt]);

  // Create final blog (using finalBlogHook)
  const createFinalBlog = useCallback(async (formData: OutlinePromptFormData) => {
    return finalBlogHook.createFinalBlog(formData);
  }, [finalBlogHook.createFinalBlog]);

  // Save blog to Supabase (using finalBlogHook)
  const saveBlogToSupabase = useCallback(async (formData: FinalBlogFormData) => {
    return finalBlogHook.saveBlogToSupabase(formData);
  }, [finalBlogHook.saveBlogToSupabase]);

  // Legacy blog creation (pass through from blogCreationHook)
  const createBlog = useCallback(async (selectedItem: any) => {
    return blogCreationHook.createBlog(selectedItem);
  }, [blogCreationHook.createBlog]);

  return {
    clusteringData: clusteringHook.clusteringData,
    titleDescriptionData: titleHook.titleDescriptionData,
    outlinePromptData: outlineHook.outlinePromptData,
    finalBlogData: finalBlogHook.finalBlogData,
    outlineFormData: outlineHook.formData,
    finalBlogFormData: finalBlogHook.formData,
    loading: clusteringHook.loading || titleHook.loading || outlineHook.loading || finalBlogHook.loading || blogCreationHook.loading,
    error: clusteringHook.error || titleHook.error || outlineHook.error || finalBlogHook.error || blogCreationHook.error,
    groupBy,
    filters,
    selectedKeywords,
    selectedCount,
    groupedClusters,
    setFilters,
    setGroupBy,
    updateKeyword,
    fetchClusteringData,
    generateTitleDescription,
    updateTitleDescription,
    generateOutlinePrompt,
    updateOutlineField: outlineHook.updateField,
    createFinalBlog,
    updateFinalBlogField: finalBlogHook.updateField,
    saveBlogToSupabase,
    createBlog,  // Legacy method
    resetWorkflow: () => {
      clusteringHook.resetClusteringData();
      titleHook.resetTitleDescriptionData();
      outlineHook.resetOutlinePromptData();
      finalBlogHook.resetFinalBlogData();
    }
  };
};
