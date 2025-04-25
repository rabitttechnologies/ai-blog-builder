
import React from 'react';
import OutlinePromptDialog from '../../outline-prompt/OutlinePromptDialog';
import FinalBlogDialog from '../../final-blog/FinalBlogDialog';
import type { OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

type WorkflowStep = 'clustering' | 'titleDescription' | 'outlinePrompt' | 'finalBlog';

interface DialogStepsProps {
  step: WorkflowStep;
  outlinePromptData: any;
  finalBlogData: any;
  outlineFormData: OutlinePromptFormData;
  finalBlogFormData: FinalBlogFormData;
  loading: boolean;
  onClose: () => void;
  onBackToTitleStep: () => void;
  onBackToOutlineStep: () => void;
  onCreateFinalBlog: (formData?: any) => void;
  onSaveBlog: (formData: FinalBlogFormData) => Promise<boolean>;
  onUpdateOutlineField: (field: string, value: string) => void;
  onUpdateFinalBlogField: (field: string, value: string) => void;
}

const DialogSteps: React.FC<DialogStepsProps> = ({
  step,
  outlinePromptData,
  finalBlogData,
  outlineFormData,
  finalBlogFormData,
  loading,
  onClose,
  onBackToTitleStep,
  onBackToOutlineStep,
  onCreateFinalBlog,
  onSaveBlog,
  onUpdateOutlineField,
  onUpdateFinalBlogField
}) => {
  return (
    <>
      {step === 'outlinePrompt' && (
        <OutlinePromptDialog 
          isOpen={true}
          onClose={onClose}
          onBack={onBackToTitleStep}
          data={outlinePromptData}
          formData={outlineFormData}
          onUpdateField={onUpdateOutlineField}
          onSubmit={onCreateFinalBlog}
          isLoading={loading}
        />
      )}
      
      {step === 'finalBlog' && (
        <FinalBlogDialog 
          isOpen={true}
          onClose={onClose}
          onBack={onBackToOutlineStep}
          data={finalBlogData}
          formData={finalBlogFormData}
          onUpdateField={onUpdateFinalBlogField}
          onSubmit={() => onSaveBlog(finalBlogFormData)}
          isLoading={loading}
          onSaveBlog={onSaveBlog}
        />
      )}
    </>
  );
};

export default DialogSteps;
