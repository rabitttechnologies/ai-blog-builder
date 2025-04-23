
import React from 'react';
import ClusteringStep from './steps/ClusteringStep';
import TitleDescriptionStep from './steps/TitleDescriptionStep';
import DialogSteps from './steps/DialogSteps';
import type { ClusteringResponse, TitleDescriptionResponse } from '@/types/clustering';
import type { OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';
import type { GroupingOption } from '@/types/clustering';

interface WorkflowStepsProps {
  step: 'clustering' | 'titleDescription' | 'outlinePrompt' | 'finalBlog';
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
      <ClusteringStep
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
      <TitleDescriptionStep
        data={titleDescriptionData}
        onBack={onBackToClusteringStep}
        onClose={onClose}
        onCreateBlog={onGenerateOutlinePrompt}
      />
    );
  }

  return (
    <DialogSteps
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
};

export default WorkflowSteps;
