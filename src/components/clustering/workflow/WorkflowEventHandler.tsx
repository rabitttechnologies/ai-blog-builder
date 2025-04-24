
import React from 'react';
import type { TitleDescriptionResponse } from '@/types/clustering';
import type { FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

interface WorkflowEventHandlerProps {
  clusteringData: any;
  titleDescriptionData: TitleDescriptionResponse | null;
  outlineFormData: any;
  finalBlogFormData: FinalBlogFormData;
  onGenerateTitleDescription: () => Promise<any>;
  onGenerateOutlinePrompt: (selectedItem: any) => Promise<any>;
  onCreateFinalBlog: (formData: any) => Promise<any>;
  onSaveBlog: (formData: FinalBlogFormData) => Promise<boolean>;
  setDataError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setWorkflowStep: (step: 'clustering' | 'titleDescription' | 'outlinePrompt' | 'finalBlog') => void;
  onClose: () => void;
  children: React.ReactNode;
}

const WorkflowEventHandler: React.FC<WorkflowEventHandlerProps> = ({
  onGenerateTitleDescription,
  onGenerateOutlinePrompt,
  onCreateFinalBlog,
  onSaveBlog,
  setDataError,
  setIsLoading,
  setWorkflowStep,
  onClose,
  children
}) => {
  const handleGenerateTitles = async () => {
    try {
      setDataError(null);
      setIsLoading(true);
      const result = await onGenerateTitleDescription();
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
      const result = await onGenerateOutlinePrompt(selectedItem);
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

  const handleCreateFinalBlog = async (formData: any) => {
    try {
      setDataError(null);
      setIsLoading(true);
      const result = await onCreateFinalBlog(formData);
      if (result) {
        setWorkflowStep('finalBlog');
      }
      return result;
    } catch (err) {
      console.error("Error creating final blog:", err);
      setDataError("Failed to create final blog. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBlog = async (formData: FinalBlogFormData): Promise<boolean> => {
    try {
      setDataError(null);
      setIsLoading(true);
      const result = await onSaveBlog(formData);
      if (result) {
        onClose();
      }
      return result;
    } catch (err) {
      console.error("Error saving blog:", err);
      setDataError("Failed to save blog. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              onGenerateTitles: handleGenerateTitles,
              onGenerateOutlinePrompt: handleGenerateOutlinePrompt,
              onCreateFinalBlog: handleCreateFinalBlog,
              onSaveBlog: handleSaveBlog
            })
          : child
      )}
    </div>
  );
};

export default WorkflowEventHandler;
