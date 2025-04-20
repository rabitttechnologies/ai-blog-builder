
import React, { useState } from 'react';
import { useClusteringWorkflow } from '@/hooks/useClusteringWorkflow';
import ClusteringResults from './ClusteringResults';
import TitleDescriptionResults from './TitleDescriptionResults';
import LoadingOverlay from '@/components/blog/LoadingOverlay';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { ClusteringResponse, TitleDescriptionResponse } from '@/types/clustering';

interface ClusteringWorkflowProps {
  initialData?: any;
  onClose: () => void;
}

const ClusteringWorkflow: React.FC<ClusteringWorkflowProps> = ({ initialData, onClose }) => {
  const [workflowStep, setWorkflowStep] = useState<'clustering' | 'titleDescription'>('clustering');
  const {
    clusteringData,
    titleDescriptionData,
    loading,
    error,
    groupBy,
    filters,
    selectedKeywords,
    groupedClusters,
    setFilters,
    setGroupBy,
    updateKeyword,
    fetchClusteringData,
    generateTitleDescription,
    updateTitleDescription,
    createBlog,
  } = useClusteringWorkflow();

  // Initialize clustering data if provided
  React.useEffect(() => {
    if (initialData && !clusteringData) {
      fetchClusteringData(initialData);
    }
  }, [initialData, clusteringData, fetchClusteringData]);

  // Handle title/description generation
  const handleGenerateTitles = async () => {
    const result = await generateTitleDescription();
    if (result) {
      setWorkflowStep('titleDescription');
    }
  };

  // Handle going back to clustering step
  const handleBackToClusteringStep = () => {
    setWorkflowStep('clustering');
  };

  // Handle blog creation
  const handleCreateBlog = async (selectedItem: TitleDescriptionResponse['data'][0]) => {
    await createBlog(selectedItem);
    onClose();
  };

  // Count selected keywords
  const selectedCount = React.useMemo(() => {
    return Array.from(selectedKeywords.values())
      .filter(item => item.status === 'Select for Blog Creation' && (item.priority || 0) > 0)
      .length;
  }, [selectedKeywords]);

  if (error) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">An error occurred</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {workflowStep === 'clustering' && clusteringData && (
        <ClusteringResults
          clusters={groupedClusters}
          workflowId={clusteringData.workflowId}
          executionId={clusteringData.executionId}
          groupBy={groupBy}
          filters={filters}
          onUpdateKeyword={updateKeyword}
          onSetFilters={setFilters}
          onSetGroupBy={setGroupBy}
          onClose={onClose}
          selectedCount={selectedCount}
          onGenerateTitles={handleGenerateTitles}
        />
      )}
      
      {workflowStep === 'titleDescription' && titleDescriptionData && (
        <div className="space-y-4">
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
      
      {!clusteringData && !loading && (
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">No clustering data</h3>
          <p className="text-muted-foreground mb-4">No clustering data is available.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
      
      {loading && <LoadingOverlay />}
      
      {workflowStep === 'clustering' && selectedCount > 0 && (
        <div className="fixed bottom-4 right-4 z-10">
          <Button 
            onClick={handleGenerateTitles} 
            disabled={loading || selectedCount < 10}
            className="shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Create Title and Description (${selectedCount}/10)`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClusteringWorkflow;
