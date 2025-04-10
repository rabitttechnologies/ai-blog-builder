
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';

export interface KeywordSuggestions {
  topInSERP: string[];
  hotKeywordIdeas: string[];
  popularRightNow: string[];
  topSuggestions: string[];
}

export const useKeywordResearch = () => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<KeywordSuggestions>({
    topInSERP: [],
    hotKeywordIdeas: [],
    popularRightNow: [],
    topSuggestions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Effect to animate the progress bar
  useEffect(() => {
    if (isLoading && loadingProgress < 95) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Slow down as we approach 95%
          const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
          return Math.min(prev + increment, 95);
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingProgress]);

  const submitKeyword = async () => {
    if (!keyword.trim()) {
      toast({
        title: 'Invalid Keyword',
        description: 'Please enter a keyword before submitting.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      // Generate a unique execution ID for tracking
      const executionId = crypto.randomUUID();
      
      console.log("Sending keyword research request to webhook");
      
      // Set a timeout to handle cases where the webhook doesn't respond
      const timeoutPromise = new Promise<never>((_, reject) => {
        timerRef.current = setTimeout(() => {
          reject(new Error('Request timed out after 60 seconds. Please try again or check your connection.'));
        }, 60000);
      });
      
      // Call webhook with explicit POST method
      const fetchPromise = fetch('https://www.n8n.agiagentworld.com/googlesearchresponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword,
          language: 'English',
          location: user?.profile.country || 'US',
          depth: 12,
          limit: 20,
          userId: user?.id || 'anonymous',
          executionId: executionId
        })
      });

      // Race between the fetch and the timeout
      const webhookResponse = await Promise.race([fetchPromise, timeoutPromise]);

      // Clear the timeout if fetch completes successfully
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!webhookResponse.ok) {
        throw new Error(`Webhook responded with status: ${webhookResponse.status}`);
      }

      const responseData = await webhookResponse.json();
      console.log("Webhook response:", responseData);

      // Set progress to 100% when we get data back
      setLoadingProgress(100);

      // Update suggestions based on webhook response
      setSuggestions({
        topInSERP: responseData.organicResults || [],
        hotKeywordIdeas: responseData.relatedQueries || [],
        popularRightNow: responseData.peopleAlsoAsk || [],
        topSuggestions: responseData.autoComplete || []
      });

      toast({
        title: 'Research Complete',
        description: 'Keyword research has been completed successfully.',
      });

    } catch (error: any) {
      console.error('Keyword research error:', error);
      toast({
        title: 'Research Failed',
        description: `${error.message || 'Unable to complete keyword research. Please try again or check your connection.'}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    keyword,
    setKeyword,
    suggestions,
    isLoading,
    loadingProgress,
    submitKeyword
  };
};
