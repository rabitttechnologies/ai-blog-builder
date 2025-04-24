
import React from 'react';
import ClusteringStepWrapper from './steps/clustering/ClusteringStepWrapper';
import TitleDescriptionStepWrapper from './steps/title/TitleDescriptionStepWrapper';
import DialogStepsWrapper from './steps/dialog/DialogStepsWrapper';
import type { ClusteringResponse, TitleDescriptionResponse, GroupingOption } from '@/types/clustering';
import type { OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

type WorkflowStep = 'clustering' | 'titleDescription' | 'outlinePrompt' | 'finalBlog';

interface WorkflowStepsProps {
  step: WorkflowStep;
  clusteringData: ClusteringResponse;
  titleDescriptionData: TitleDescriptionResponse | null;
  outlinePromptData: any;
  finalBlogData: any;
  outlineFormData: OutlinePromptFormData;
  finalBlogFormData: FinalBlogFormData;
  loading: boolean;
  groupBy: GroupingOption;
  filters: any;
  selectedCount: number;
  onUpdateKeyword: (clusterName: string, keyword: string, updates: any) => void;
  onSetFilters: (filters: any) => void;
  onSetGroupBy: (groupBy: GroupingOption) => void;
  onClose: () => void;
  onBack?: () => void;
  onGenerateTitles: () => void;
  onGenerateOutlinePrompt: (selectedItem: any) => void;
  onCreateFinalBlog: (formData?: any) => void;
  onSaveBlog: (formData: FinalBlogFormData) => Promise<boolean>; // Updated signature to match
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
      <ClusteringStepWrapper
        clusteringData={clusteringData}
        groupBy={groupBy}
        filters={filters}
        selectedCount={selectedCount}
        onUpdateKeyword={onUpdateKeyword}
        onSetFilters={onSetFilters}
        onSetGroupBy={onSetGroupBy}
        onClose={onClose}
        onBack={onBack}
        onGenerateTitles={onGenerateTitles}
      />
    );
  }

  if (step === 'titleDescription' && titleDescriptionData) {
    return (
      <TitleDescriptionStepWrapper
        data={titleDescriptionData}
        onBack={onBackToClusteringStep}
        onClose={onClose}
        onCreateBlog={onGenerateOutlinePrompt}
      />
    );
  }

  // For outline prompt and final blog steps
  if ((step === 'outlinePrompt' || step === 'finalBlog')) {
    return (
      <DialogStepsWrapper
        step={step}
        outlinePromptData={outlinePromptData}
        finalBlogData={finalBlogData}
        outlineFormData={outlineFormData}
        finalBlogFormData={finalBlogFormData}
        loading={loading}
        onClose={onClose}
        onBackToTitleStep={onBackToTitleStep}
        onBackToOutlineStep={onBackToOutlineStep}
        onCreateFinalBlog={onCreateFinalBlog}
        onSaveBlog={onSaveBlog}
        onUpdateOutlineField={onUpdateOutlineField}
        onUpdateFinalBlogField={onUpdateFinalBlogField}
      />
    );
  }

  return null;
};

export default WorkflowSteps;
