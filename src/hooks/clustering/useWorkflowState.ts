
import { useState } from 'react';
import type { TitleDescriptionResponse } from '@/types/clustering';

type WorkflowStep = 'clustering' | 'titleDescription' | 'outlinePrompt' | 'finalBlog';

export const useWorkflowState = () => {
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('clustering');
  const [dataError, setDataError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTitleItem, setSelectedTitleItem] = useState<TitleDescriptionResponse['data'][0] | null>(null);

  const resetWorkflowState = () => {
    setWorkflowStep('clustering');
    setDataError(null);
    setIsLoading(false);
    setSelectedTitleItem(null);
  };

  return {
    workflowStep,
    setWorkflowStep,
    dataError,
    setDataError,
    isLoading,
    setIsLoading,
    selectedTitleItem,
    setSelectedTitleItem,
    resetWorkflowState
  };
};
