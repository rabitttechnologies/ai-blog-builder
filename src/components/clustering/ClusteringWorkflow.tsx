
import React, { useState, useEffect } from 'react';
import { useClusteringWorkflow } from '@/hooks/useClusteringWorkflow';
import LoadingOverlay from '@/components/blog/LoadingOverlay';
import ErrorDisplay from './workflow/ErrorDisplay';
import WorkflowSteps from './workflow/WorkflowSteps';
import type { TitleDescriptionResponse } from '@/types/clustering';

type WorkflowStep = 'clustering' | 'titleDescription' | 'outlinePrompt' | 'finalBlog';

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
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('clustering');
  const [dataError, setDataError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTitleItem, setSelectedTitleItem] = useState<TitleDescriptionResponse['data'][0] | null>(null);
  
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
    groupedClusters,
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
  }, [initialData, clusteringData, fetchClusteringData]);

  // Event handlers
  const handleGenerateTitles = async () => {
    try {
      setDataError(null);
      setIsLoading(true);
      const result = await generateTitleDescription();
      if (result) {
        setWorkflowStep('titleDescription');
      }
    } catch (err) {
      console.error("Error generating titles:", err);
      setDataError("Failed to generate titles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutlinePrompt = async (selectedItem: TitleDescriptionResponse['data'][0]) => {
    try {
      setDataError(null);
      setIsLoading(true);
      setSelectedTitleItem(selectedItem);
      const result = await generateOutlinePrompt(selectedItem);
      if (result) {
        setWorkflowStep('outlinePrompt');
      }
    } catch (err) {
      console.error("Error generating outline and prompt:", err);
      setDataError("Failed to generate outline and prompt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFinalBlog = async () => {
    try {
      setDataError(null);
      setIsLoading(true);
      const result = await createFinalBlog(outlineFormData);
      if (result) {
        setWorkflowStep('finalBlog');
      }
    } catch (err) {
      console.error("Error creating final blog:", err);
      setDataError("Failed to create final blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBlog = async () => {
    try {
      setDataError(null);
      setIsLoading(true);
      const result = await saveBlogToSupabase(finalBlogFormData);
      if (result) {
        onClose();
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      setDataError("Failed to save blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleBackToClusteringStep = () => setWorkflowStep('clustering');
  const handleBackToTitleStep = () => setWorkflowStep('titleDescription');
  const handleBackToOutlineStep = () => setWorkflowStep('outlinePrompt');

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

  return (
    <div className="relative min-h-[600px]">
      {!clusteringData && !loading && !isLoading ? (
        <ErrorDisplay
          error="No clustering data available."
          onClose={onClose}
        />
      ) : (
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
          onGenerateTitles={handleGenerateTitles}
          onGenerateOutlinePrompt={handleGenerateOutlinePrompt}
          onCreateFinalBlog={handleCreateFinalBlog}
          onSaveBlog={handleSaveBlog}
          onUpdateOutlineField={updateOutlineField}
          onUpdateFinalBlogField={updateFinalBlogField}
          onBackToClusteringStep={handleBackToClusteringStep}
          onBackToTitleStep={handleBackToTitleStep}
          onBackToOutlineStep={handleBackToOutlineStep}
        />
      )}
      
      {(loading || isLoading) && workflowStep === 'clustering' && (
        <LoadingOverlay 
          message="Our AI Agent is Creating Title and Short Description for Your Keywords" 
          subMessage="This may take a minute or two to complete" 
        />
      )}
    </div>
  );
};

export default ClusteringWorkflow;
