
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormValues } from '@/hooks/useSearchFormData';
import { useLanguage } from '@/context/language/LanguageContext';

interface UseKeywordSearchProps {
  getSessionId: () => string;
  generateWorkflowId: () => string;
  userId: string;
  onComplete: (data: any) => void;
}

export const useKeywordSearch = ({ getSessionId, generateWorkflowId, userId, onComplete }: UseKeywordSearchProps) => {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const submitSearch = async (formData: FormValues) => {
    setIsLoading(true);
    setTimeoutReached(false);

    const workflowId = generateWorkflowId();
    const sessionId = getSessionId();

    // Use the form's language or fall back to the current UI language
    const searchLanguage = formData.language || currentLanguage;

    const payload = {
      keyword: formData.keyword,
      language: searchLanguage,
      country: formData.country,
      depth: Number(formData.depth),
      limit: Number(formData.limit),
      uuid: userId,
      workflowId,
      sessionId,
      uiLanguage: currentLanguage // Add UI language as separate parameter
    };

    try {
      // Set up timeout for the fetch request - increased to 2 minutes (120000ms)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch('https://n8n.agiagentworld.com/webhook/googlesearchresponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("RESPONSE DATA", responseData);
      
      // Process successful response - filtering out null values
      if (responseData) {
        // Only include fields that have non-null values
        const filteredData = Object.fromEntries(
          Object.entries(responseData[0]).filter(([_, value]) => value !== null)
        );
        console.log(filteredData);
        onComplete({
          ...filteredData,
          keyword: formData.keyword,
          workflowId,
          language: searchLanguage // Include language in the results
        });
      } else {
        toast({
          title: "Empty Response",
          description: "The search returned no results. Please try a different keyword.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setTimeoutReached(true);
        toast({
          title: "Request Timeout",
          description: "The request took too long to complete. Please try again or try another keyword.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Request Failed",
          description: error.message || "Failed to fetch search data.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    timeoutReached,
    submitSearch
  };
};
