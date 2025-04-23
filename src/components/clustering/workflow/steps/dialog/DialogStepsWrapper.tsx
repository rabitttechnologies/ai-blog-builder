
import React from 'react';
import DialogSteps from '../DialogSteps';
import type { OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

interface DialogStepsWrapperProps {
  step: 'outlinePrompt' | 'finalBlog';
  outlinePromptData: any;
  finalBlogData: any;
  outlineFormData: OutlinePromptFormData;
  finalBlogFormData: FinalBlogFormData;
  loading: boolean;
  onClose: () => void;
  onBackToTitleStep: () => void;
  onBackToOutlineStep: () => void;
  onCreateFinalBlog: (formData?: any) => void;
  onSaveBlog: (formData?: any) => void;
  onUpdateOutlineField: (field: string, value: string) => void;
  onUpdateFinalBlogField: (field: string, value: string) => void;
}

const DialogStepsWrapper: React.FC<DialogStepsWrapperProps> = (props) => {
  return (
    <DialogSteps {...props} />
  );
};

export default DialogStepsWrapper;
