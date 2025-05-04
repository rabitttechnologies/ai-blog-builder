
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TitleDescriptionFormData, KeywordSelectResponse } from '@/context/articleWriter/ArticleWriterContext';

interface UseTitleDescriptionWebhookProps {
  sessionId: string;
  workflowId: string;
  keywordSelectResponse: KeywordSelectResponse | null;
  titleDescriptionFormData: TitleDescriptionFormData;
}

export const useTitleDescriptionWebhook = ({
  sessionId,
  workflowId,
  keywordSelectResponse,
  titleDescriptionFormData,
}: UseTitleDescriptionWebhookProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const submitForm = async () => {
    if (!keywordSelectResponse) {
      const error = 'No keyword selection data available';
      setError(error);
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      throw new Error(error);
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        workflowId,
        userId: keywordSelectResponse.userId,
        sessionId,
        originalKeyword: keywordSelectResponse.originalKeyword,
        country: keywordSelectResponse.country,
        language: keywordSelectResponse.language,
        typeOfContent: keywordSelectResponse.typeOfContent,
        mainKeyword: keywordSelectResponse.mainKeyword,
        additionalKeyword: keywordSelectResponse.additionalKeyword,
        references: keywordSelectResponse.references,
        researchType: keywordSelectResponse.researchType,
        titlesAndShortDescription: titleDescriptionFormData.selectedTitle ? [titleDescriptionFormData.selectedTitle] : [],
        headingCount: titleDescriptionFormData.headingCount,
        writingStyle: titleDescriptionFormData.writingStyle,
        pointOfView: titleDescriptionFormData.pointOfView,
        expertGuidance: titleDescriptionFormData.expertGuidance,
        additionalData: keywordSelectResponse.additionalData || {},
      };

      // Log the request for debugging
      console.log('Title and description webhook request:', payload);

      const response = await fetch('https://n8n.agiagentworld.com/webhook/titleandshortdescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Title and description webhook response:', responseData);

      return responseData;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while submitting the form';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitForm,
    isLoading,
    error,
  };
};

export default useTitleDescriptionWebhook;
