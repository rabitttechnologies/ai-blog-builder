
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import ClusteringResults from '../ClusteringResults';
import TitleDescriptionResults from '../TitleDescriptionResults';
import OutlinePromptDialog from '../outline-prompt/OutlinePromptDialog';
import FinalBlogDialog from '../final-blog/FinalBlogDialog';
import type { ClusteringResponse, TitleDescriptionResponse } from '@/types/clustering';
import type { OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

interface WorkflowStepsProps {
  step: 'clustering' | 'titleDescription' | 'outlinePrompt' | 'finalBlog';
  clusteringData: ClusteringResponse;
  titleDescriptionData: TitleDescriptionResponse | null;
  outlinePromptData: any;
  finalBlogData: any;
  outlineFormData: OutlinePromptFormData;
  finalBlogFormData: FinalBlogFormData;
  loading: boolean;
  groupBy: string;
  filters: any;
  selectedCount: number;
  onUpdateKeyword: (clusterName: string, keyword: string, updates: any) => void;
  onSetFilters: (filters: any) => void;
  onSetGroupBy: (groupBy: string) => void;
  onClose: () => void;
  onBack?: () => void;
  onGenerateTitles: () => void;
  onGenerateOutlinePrompt: (selectedItem: any) => void;
  onCreateFinalBlog: () => void;
  onSaveBlog: () => void;
  onUpdateOutlineField: (field: string, value: string) => void;
  onUpdateFinalBlogField: (field: string, value: string) => void;
  onBackToClusteringStep: () => void;
  onBackToTitleStep: () => void;
  onBackToOutlineStep: () => void;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  step,
  clusteringData,
  titleDescriptionData,
  outlinePromptData,
  finalBlogData,
  outlineFormData,
  finalBlogFormData,
  loading,
  groupBy,
  filters,
  selectedCount,
  onUpdateKeyword,
  onSetFilters,
  onSetGroupBy,
  onClose,
  onBack,
  onGenerateTitles,
  onGenerateOutlinePrompt,
  onCreateFinalBlog,
  onSaveBlog,
  onUpdateOutlineField,
  onUpdateFinalBlogField,
  onBackToClusteringStep,
  onBackToTitleStep,
  onBackToOutlineStep
}) => {
  if (step === 'clustering' && clusteringData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <ClusteringResults
          clusters={clusteringData.clusters}
          workflowId={clusteringData.workflowId}
          executionId={clusteringData.executionId}
          groupBy={groupBy}
          filters={filters}
          onUpdateKeyword={onUpdateKeyword}
          onSetFilters={onSetFilters}
          onSetGroupBy={onSetGroupBy}
          onClose={onClose}
          onBack={onBack}
          selectedCount={selectedCount}
          onGenerateTitles={onGenerateTitles}
        />
      </div>
    );
  }

  if (step === 'titleDescription' && titleDescriptionData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBackToClusteringStep}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Keywords
          </Button>
          <h2 className="text-2xl font-semibold">Blog Title Options</h2>
        </div>
        
        <TitleDescriptionResults
          data={titleDescriptionData}
          onUpdateItem={() => {}}
          onCreateBlog={onGenerateOutlinePrompt}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <>
      <OutlinePromptDialog 
        isOpen={step === 'outlinePrompt'}
        onClose={onClose}
        onBack={onBackToTitleStep}
        data={outlinePromptData}
        formData={outlineFormData}
        onUpdateField={onUpdateOutlineField}
        onSubmit={onCreateFinalBlog}
        isLoading={loading}
      />
      
      <FinalBlogDialog 
        isOpen={step === 'finalBlog'}
        onClose={onClose}
        onBack={onBackToOutlineStep}
        data={finalBlogData}
        formData={finalBlogFormData}
        onUpdateField={onUpdateFinalBlogField}
        onSubmit={onSaveBlog}
        isLoading={loading}
      />
    </>
  );
};

export default WorkflowSteps;
