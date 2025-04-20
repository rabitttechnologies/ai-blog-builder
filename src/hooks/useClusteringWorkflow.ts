
import { useClusteringData } from './clustering/useClusteringData';
import { useTitleGeneration } from './clustering/useTitleGeneration';
import { useBlogCreation } from './clustering/useBlogCreation';
import { useClusteringFilters } from './clustering/useClusteringFilters';
import { useKeywordSelection } from './clustering/useKeywordSelection';

// Main hook that composes all the clustering workflow hooks
export const useClusteringWorkflow = () => {
  const {
    clusteringData,
    loading: clusterLoading,
    error: clusterError,
    fetchClusteringData,
    updateKeyword,
    resetClusteringData
  } = useClusteringData();

  const {
    filters,
    groupBy,
    setFilters,
    setGroupBy,
    filteredClusters,
    groupedClusters
  } = useClusteringFilters(clusteringData);

  const {
    selectedKeywords,
    selectedCount
  } = useKeywordSelection(clusteringData);

  const {
    titleDescriptionData,
    loading: titleLoading,
    error: titleError,
    generateTitleDescription,
    updateTitleDescription,
    resetTitleDescriptionData
  } = useTitleGeneration(clusteringData);

  const {
    loading: blogLoading,
    error: blogError,
    createBlog
  } = useBlogCreation(titleDescriptionData);

  // Combine loading and error states
  const loading = clusterLoading || titleLoading || blogLoading;
  const error = clusterError || titleError || blogError;

  return {
    // State
    clusteringData,
    titleDescriptionData,
    loading,
    error,
    groupBy,
    filters,
    selectedKeywords,
    selectedCount,
    
    // Computed values
    filteredClusters,
    groupedClusters,
    
    // Actions
    setFilters,
    setGroupBy,
    updateKeyword,
    fetchClusteringData,
    generateTitleDescription,
    updateTitleDescription,
    createBlog,
    
    // Reset functions
    resetClusteringData,
    resetTitleDescriptionData,
  };
};
