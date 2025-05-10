
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { KeywordFormData, KeywordResponse } from '@/context/articleWriter/ArticleWriterContext';
import { normalizeResponse } from '@/utils/dataValidation';

// HTTP status code error messages
const ERROR_MESSAGES = {
  400: "Invalid request parameters. Please check your inputs and try again.",
  401: "Authentication error. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "Keyword research service not found. Please try again later.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Server error. Our team has been notified.",
  503: "Keyword research service is currently unavailable. Please try again later.",
  default: "An unexpected error occurred. Please try again."
};

interface UseKeywordResearchProps {
  userId: string;
  sessionId: string;
  workflowId: string;
}

interface KeywordResearchOptions {
  timeoutDuration?: number; // in milliseconds
  retryAttempts?: number;
}

export const useKeywordResearch = ({ 
  userId, 
  sessionId, 
  workflowId 
}: UseKeywordResearchProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100 progress indicator
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [response, setResponse] = useState<KeywordResponse | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const retryCountRef = useRef<number>(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Validates the response data structure
  const validateResponse = (data: any): KeywordResponse | null => {
    if (!data) return null;
    
    // Normalize the response fields
    const normalized = normalizeResponse(data);
    if (!normalized) return null;
    
    // Check required fields
    const requiredFields = ['workflowId', 'userId', 'originalKeyword', 'country', 'language'];
    const missingFields = requiredFields.filter(field => !normalized[field]);
    
    if (missingFields.length > 0) {
      console.warn(`Response missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Safe access to historicalSearchData with type checking
    const historicalSearchData = Array.isArray(normalized.historicalSearchData) 
      ? normalized.historicalSearchData 
      : [];
      
    // Handle references
    let parsedReferences = [];
    if (normalized.references) {
      if (Array.isArray(normalized.references)) {
        parsedReferences = normalized.references;
      } else if (typeof normalized.references === 'string') {
        try {
          parsedReferences = JSON.parse(normalized.references);
        } catch (e) {
          console.error("Error parsing references:", e);
          parsedReferences = [];
        }
      }
    }
    
    // Log the normalized data for debugging
    console.log("Normalized response data:", normalized);
    
    // Construct validated response with fallbacks for missing data
    return {
      workflowId: normalized.workflowId || workflowId,
      userId: normalized.userId || userId,
      executionId: normalized.executionId || '',
      originalKeyword: normalized.originalKeyword || '',
      country: normalized.country || '',
      language: normalized.language || '',
      contentType: normalized.contentType || '',
      historicalSearchData: historicalSearchData,
      references: parsedReferences,
      additionalData: normalized.additionalData || {}
    };
  };

  // Start progress simulation for better UX
  const startProgressSimulation = (timeoutDuration: number) => {
    // Reset progress
    setProgress(0);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Calculate how often to update the progress
    const totalSteps = 95; // Go up to 95% (save the last 5% for actual completion)
    const intervalTime = timeoutDuration / totalSteps;
    
    // Set up the interval
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prevProgress => {
        // Stop at 95%
        if (prevProgress >= 95) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          return 95;
        }
        return prevProgress + 1;
      });
    }, intervalTime);
  };

  // Handle HTTP error responses
  const handleHttpError = (status: number): string => {
    return ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
  };

  // Retry logic
  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries: number) => {
    try {
      return await fn();
    } catch (error: any) {
      if (retryCountRef.current >= maxRetries) {
        throw error; // Give up after max retries
      }
      
      const delay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
      console.log(`Retrying request (${retryCountRef.current + 1}/${maxRetries}) after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCountRef.current++;
      return retryWithBackoff(fn, maxRetries);
    }
  };

  const submitKeywordResearch = async (
    formData: KeywordFormData, 
    options: KeywordResearchOptions = {}
  ) => {
    const { 
      timeoutDuration = 120000, // Default to 2 minutes
      retryAttempts = 0 
    } = options;
    
    setIsLoading(true);
    setTimeoutReached(false);
    setResponse(null);
    setProgress(0);
    retryCountRef.current = 0;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    // Start the progress simulation
    startProgressSimulation(timeoutDuration);

    // Prepare payload with admin-defined values or defaults
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
      // Set up timeout for the request
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, timeoutDuration);

      // Create the request function that we might retry
      const makeRequest = async () => {
        // Check if already aborted
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Request was aborted");
        }

        const response = await fetch('https://n8n.agiagentworld.com/webhook/keywordresearch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current?.signal,
          mode: 'cors',
          credentials: 'omit'
        });
        
        // Check for empty response
        if (!response.ok) {
          const errorMessage = handleHttpError(response.status);
          throw new Error(errorMessage);
        }

        const responseText = await response.text();
        
        // Check if response is empty
        if (!responseText || responseText.trim() === '') {
          throw new Error("Server returned an empty response");
        }
        
        try {
          return JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          console.log("Raw response:", responseText);
          throw new Error("Invalid JSON response from server");
        }
      };

      // Execute request with retry logic if configured
      const responseData = await (retryAttempts > 0 
        ? retryWithBackoff(makeRequest, retryAttempts)
        : makeRequest());

      // Clear timeout and progress interval
      clearTimeout(timeoutId);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Set progress to 100% on successful response
      setProgress(100);
      
      // Process and validate successful response
      if (responseData) {
        console.log("Keyword research raw response:", responseData);
        
        const validatedResponse = validateResponse(responseData);
        
        if (validatedResponse) {
          console.log("Validated response:", validatedResponse);
          setResponse(validatedResponse);
          return validatedResponse;
        } else {
          toast({
            title: "Invalid Response Format",
            description: "The keyword research service returned data in an unexpected format.",
            variant: "destructive"
          });
          return null;
        }
      } else {
        toast({
          title: "Empty Response",
          description: "The keyword research returned no results. Please try a different keyword.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error: any) {
      // Clear progress interval if it's still running
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
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
      throw error; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return {
    isLoading,
    timeoutReached,
    progress, // Expose progress for UI components
    response,
    submitKeywordResearch
  };
};
