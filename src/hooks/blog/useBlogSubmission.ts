
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { FinalBlogFormData } from '../clustering/useFinalBlogCreation';

interface UseBlogSubmissionProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useBlogSubmission = ({ onSuccess, onError }: UseBlogSubmissionProps = {}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const cancelSubmission = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsSubmitting(false);
      toast({
        title: "Submission Cancelled",
        description: "The blog submission was cancelled.",
        variant: "default"
      });
    }
  }, [abortController, toast]);

  const submitBlog = useCallback(async (formData: FinalBlogFormData) => {
    // Cancel any existing submission
    if (abortController) {
      cancelSubmission();
    }

    // Validate required fields
    const requiredFields: (keyof FinalBlogFormData)[] = ['title', 'alternateTitle', 'finalArticle'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
      onError?.(error);
      toast({
        title: "Validation Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Set up timeout (5 minutes)
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await fetch('https://n8n.agiagentworld.com/webhook/createblogmetatags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          alternateTitle: formData.alternateTitle,
          content: formData.finalArticle
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('No data received from server');
      }

      onSuccess?.();
      toast({
        title: "Success",
        description: "Blog created successfully!",
        variant: "default"
      });

      return true;
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError' 
        ? 'Request timed out. Please try again.'
        : error.message || 'An error occurred while creating the blog.';
      
      onError?.(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
      setAbortController(null);
    }
  }, [cancelSubmission, onError, onSuccess, toast]);

  return {
    isSubmitting,
    submitBlog,
    cancelSubmission
  };
};
