
import React, { useEffect } from 'react';
import { useClusteringWorkflow } from '@/hooks/useClusteringWorkflow';
import { useWorkflowState } from '@/hooks/clustering/useWorkflowState';
import ErrorDisplay from './workflow/ErrorDisplay';
import WorkflowSteps from './workflow/WorkflowSteps';
import WorkflowLoadingOverlay from './workflow/WorkflowLoadingOverlay';
import WorkflowEventHandler from './workflow/WorkflowEventHandler';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

interface ClusteringWorkflowProps {
  initialData?: any;
  onClose: () => void;
  onBack?: () => void;
}

const ClusteringWorkflow: React.FC<ClusteringWorkflowProps> = ({ 
  initialData, 
  onClose, 
  onBack 
}) => {
  const {
    clusteringData,
    titleDescriptionData,
    outlinePromptData,
    finalBlogData,
    outlineFormData,
    finalBlogFormData,
    loading,
    error,
    groupBy,
    filters,
    selectedCount,
    setFilters,
    setGroupBy,
    updateKeyword,
    fetchClusteringData,
    generateTitleDescription,
    updateTitleDescription,
    generateOutlinePrompt,
    updateOutlineField,
    createFinalBlog,
    updateFinalBlogField,
    saveBlogToSupabase,
  } = useClusteringWorkflow();

  const {
    workflowStep,
    setWorkflowStep,
    dataError,
    setDataError,
    isLoading,
    setIsLoading,
    selectedTitleItem,
    setSelectedTitleItem,
    resetWorkflowState
  } = useWorkflowState();

  // Initialize clustering data
  useEffect(() => {
    if (initialData && !clusteringData) {
      try {
        console.log("Initializing clustering workflow with data:", JSON.stringify(initialData));
        fetchClusteringData(initialData).catch(err => {
          console.error("Error fetching clustering data:", err);
          setDataError("Failed to fetch clustering data. Please try again.");
        });
      } catch (err) {
        console.error("Exception in fetching clustering data:", err);
        setDataError("An unexpected error occurred. Please try again.");
      }
    }
  }, [initialData, clusteringData, fetchClusteringData, setDataError]);

  // Handle back navigation from different steps
  const handleBackToClusteringStep = () => {
    setWorkflowStep('clustering');
  };

  const handleBackToTitleStep = () => {
    setWorkflowStep('titleDescription');
  };

  const handleBackToOutlineStep = () => {
    setWorkflowStep('outlinePrompt');
  };

  // Handle errors
  const displayError = error || dataError;
  if (displayError) {
    return (
      <ErrorDisplay
        error={displayError}
        onRetry={() => {
          setDataError(null);
          if (initialData) {
            fetchClusteringData(initialData);
          }
        }}
        onClose={onClose}
        initialData={initialData}
      />
    );
  }

  if (!clusteringData && !loading && !isLoading) {
    return (
      <ErrorDisplay
        error="No clustering data available."
        onClose={onClose}
      />
    );
  }

  return (
    <div className="relative min-h-[600px]">
      <WorkflowEventHandler
        clusteringData={clusteringData}
        titleDescriptionData={titleDescriptionData}
        outlineFormData={outlineFormData}
        finalBlogFormData={finalBlogFormData}
        onGenerateTitleDescription={generateTitleDescription}
        onGenerateOutlinePrompt={generateOutlinePrompt}
        onCreateFinalBlog={createFinalBlog}
        onSaveBlog={saveBlogToSupabase}
        setDataError={setDataError}
        setIsLoading={setIsLoading}
        setWorkflowStep={setWorkflowStep}
        onClose={onClose}
      >
        <WorkflowSteps
          step={workflowStep}
          clusteringData={clusteringData}
          titleDescriptionData={titleDescriptionData}
          outlinePromptData={outlinePromptData}
          finalBlogData={finalBlogData}
          outlineFormData={outlineFormData}
          finalBlogFormData={finalBlogFormData}
          loading={loading || isLoading}
          groupBy={groupBy}
          filters={filters}
          selectedCount={selectedCount}
          onUpdateKeyword={updateKeyword}
          onSetFilters={setFilters}
          onSetGroupBy={setGroupBy}
          onClose={onClose}
          onBack={onBack}
          onUpdateOutlineField={updateOutlineField}
          onUpdateFinalBlogField={updateFinalBlogField}
          onBackToClusteringStep={handleBackToClusteringStep}
          onBackToTitleStep={handleBackToTitleStep}
          onBackToOutlineStep={handleBackToOutlineStep}
          // Initialize with placeholder functions that will be overridden by WorkflowEventHandler
          onGenerateTitles={() => {}} 
          onGenerateOutlinePrompt={() => {}}
          onCreateFinalBlog={() => {}}
          onSaveBlog={(formData: FinalBlogFormData) => Promise.resolve(false)} // Updated to return Promise<boolean>
        />
      </WorkflowEventHandler>
      
      <WorkflowLoadingOverlay 
        isVisible={loading || isLoading}
        step={workflowStep}
      />
    </div>
  );
};

export default ClusteringWorkflow;
