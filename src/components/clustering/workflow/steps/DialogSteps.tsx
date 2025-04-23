
import React from 'react';
import OutlinePromptDialog from '../../outline-prompt/OutlinePromptDialog';
import FinalBlogDialog from '../../final-blog/FinalBlogDialog';
import type { OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

interface DialogStepsProps {
  step: 'outlinePrompt' | 'finalBlog' | 'clustering' | 'titleDescription';
  outlinePromptData: any;
  finalBlogData: any;
  outlineFormData: OutlinePromptFormData;
  finalBlogFormData: FinalBlogFormData;
  loading: boolean;
  onClose: () => void;
  onBackToTitleStep: () => void;
  onBackToOutlineStep: () => void;
  onCreateFinalBlog: () => void;
  onSaveBlog: () => void;
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
  // Only render outline prompt if step is 'outlinePrompt'
  // Only render final blog if step is 'finalBlog'
  // Ignore other steps ('clustering', 'titleDescription')
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

export default DialogSteps;
