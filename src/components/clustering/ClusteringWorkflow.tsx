
import React, { useState, useEffect, useRef } from 'react';
import { useClusteringWorkflow } from '@/hooks/useClusteringWorkflow';
import ClusteringResults from './ClusteringResults';
import TitleDescriptionResults from './TitleDescriptionResults';
import LoadingOverlay from '@/components/blog/LoadingOverlay';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import type { ClusteringResponse, TitleDescriptionResponse } from '@/types/clustering';

// Consistent shared UI class sets
const contentContainerClasses = "max-w-6xl mx-auto space-y-6 min-h-[600px]";
const errorContainerClasses = "text-center p-8 max-w-lg mx-auto";
const buttonContainerClasses = "flex gap-2 justify-center";

interface ClusteringWorkflowProps {
  initialData?: any;
  onClose: () => void;
  onBack?: () => void;
}

const ClusteringWorkflow: React.FC<ClusteringWorkflowProps> = ({ initialData, onClose, onBack }) => {
  const [workflowStep, setWorkflowStep] = useState<'clustering' | 'titleDescription'>('clustering');
  const [dataError, setDataError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    clusteringData,
    titleDescriptionData,
    loading,
    error,
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
    createBlog,
  } = useClusteringWorkflow();

  // Initialize clustering data if provided with error handling
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

  // Handle title/description generation
  const handleGenerateTitles = async () => {
    try {
      setDataError(null);
      setIsLoading(true);
      
      // Show improved loading message
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

  // Handle going back to clustering step
  const handleBackToClusteringStep = () => {
    setWorkflowStep('clustering');
  };

  // Handle blog creation with error handling
  const handleCreateBlog = async (selectedItem: TitleDescriptionResponse['data'][0]) => {
    try {
      setDataError(null);
      setIsLoading(true);
      await createBlog(selectedItem);
      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);
      console.error("Error creating blog:", err);
      setDataError("Failed to create blog. Please try again.");
    }
  };

  // Handle errors from the API or processing
  const displayError = error || dataError;
  
  if (displayError) {
    return (
      <div className={errorContainerClasses}>
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">An error occurred</h3>
        <p className="text-muted-foreground mb-4">{displayError}</p>
        <div className={buttonContainerClasses}>
          <Button 
            variant="outline" 
            onClick={() => {
              setDataError(null);
              if (initialData) {
                fetchClusteringData(initialData);
              }
            }}
            size="md"
          >
            Try Again
          </Button>
          <Button onClick={onClose} size="md">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[600px]">
      {workflowStep === 'clustering' && clusteringData && (
        <div className={contentContainerClasses}>
          <ClusteringResults
            clusters={groupedClusters || []}
            workflowId={clusteringData.workflowId || ''}
            executionId={clusteringData.executionId || ''}
            groupBy={groupBy}
            filters={filters}
            onUpdateKeyword={updateKeyword}
            onSetFilters={setFilters}
            onSetGroupBy={setGroupBy}
            onClose={onClose}
            onBack={onBack}
            selectedCount={selectedCount}
            onGenerateTitles={handleGenerateTitles}
          />
        </div>
      )}
      
      {workflowStep === 'titleDescription' && titleDescriptionData && (
        <div className={contentContainerClasses}>
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToClusteringStep}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Keywords
            </Button>
            <h2 className="text-2xl font-semibold">Blog Title Options</h2>
          </div>
          
          <TitleDescriptionResults
            data={titleDescriptionData}
            onUpdateItem={updateTitleDescription}
            onCreateBlog={handleCreateBlog}
            onClose={onClose}
          />
        </div>
      )}
      
      {!clusteringData && !loading && !isLoading && (
        <div className={errorContainerClasses}>
          <h3 className="text-xl font-semibold mb-2">No clustering data</h3>
          <p className="text-muted-foreground mb-4">No clustering data is available.</p>
          <Button onClick={onClose} size="md">Close</Button>
        </div>
      )}
      
      {(loading || isLoading) && (
        <LoadingOverlay 
          message={
            workflowStep === 'clustering' 
              ? "Our AI Agent is Creating Title and Short Description for Your Keywords" 
              : "Processing your request..."
          }
          subMessage="This may take a minute or two to complete" 
        />
      )}
    </div>
  );
};

export default ClusteringWorkflow;
