
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { KeywordFormData, KeywordResponse } from '@/context/articleWriter/ArticleWriterContext';

interface UseKeywordResearchProps {
  userId: string;
  sessionId: string;
  workflowId: string;
}

export const useKeywordResearch = ({ userId, sessionId, workflowId }: UseKeywordResearchProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [response, setResponse] = useState<KeywordResponse | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const submitKeywordResearch = async (formData: KeywordFormData) => {
    setIsLoading(true);
    setTimeoutReached(false);
    setResponse(null);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    const payload = {
      workflowId,
      userId,
      sessionId,
      originalKeyword: formData.keyword,
      country: formData.country,
      language: formData.language,
      depth: 2, // Default value, could be made configurable by admin
      limit: 50, // Default value, could be made configurable by admin
      contentType: formData.contentType,
      additionalData: {} // Optional additional data
    };

    console.log("Submitting keyword research with payload:", payload);

    try {
      // Set up timeout for 2 minutes (120000ms)
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 120000); // 2 minutes

      const response = await fetch('https://n8n.agiagentworld.com/webhook/keywordresearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Keyword research response:", responseData);
      
      // Process successful response
      if (responseData) {
        const keywordResponse: KeywordResponse = {
          workflowId: responseData.workflowId || workflowId,
          userId: responseData.userId || userId,
          executionId: responseData.executionId || '',
          originalKeyword: responseData.originalKeyword || formData.keyword,
          country: responseData.country || formData.country,
          language: responseData.language || formData.language,
          contentType: responseData.contentType || formData.contentType,
          historicalSearchData: responseData.historicalSearchData || [],
          references: responseData.references || [],
          additionalData: responseData.additionalData || {}
        };
        
        setResponse(keywordResponse);
        return keywordResponse;
      } else {
        toast({
          title: "Empty Response",
          description: "The keyword research returned no results. Please try a different keyword.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setTimeoutReached(true);
        toast({
          title: "Request Timeout",
          description: "The keyword research took too long to complete. Please try again with a different keyword.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Request Failed",
          description: error.message || "Failed to fetch keyword research data.",
          variant: "destructive"
        });
      }
      return null;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return {
    isLoading,
    timeoutReached,
    response,
    submitKeywordResearch
  };
};
