
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { useLanguage } from '@/context/language/LanguageContext';

export const useVolumeAnalysis = (keyword: string, workflowId: string) => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [volumeData, setVolumeData] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Get session ID for request tracking
  const getSessionId = () => session?.access_token?.substring(0, 16) || 'anonymous-session';

  const analyzeSelectedKeywords = async (selections: Record<string, any[]>, profileData: any) => {
    const hasSelections = Object.values(selections).some(items => items.length > 0);
    
    if (!hasSelections) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to analyze.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to use this feature.",
        variant: "destructive"
      });
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);

    try {
      // Use the profile's language or fall back to the current UI language
      const searchLanguage = profileData?.language || currentLanguage;
      
      const payload = {
        selectedData: selections,
        workflowId,
        userId: user.id, 
        sessionId: getSessionId(),
        keyword,
        country: profileData?.country || null,
        language: searchLanguage,
        uiLanguage: currentLanguage // Add UI language as separate parameter
      };
      
      // Set up timeout for 2 minutes (120000ms)
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 120000); // 2 minutes
      
      const response = await fetch('https://n8n.agiagentworld.com/webhook/pastsearchvolume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Request failed (${response.status}): ${errorText}`);
      }
      
      const responseData = await response.json();
      
      // Check if response has the expected format
      if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
        throw new Error('Received empty or invalid response from the server');
      }
      
      setVolumeData(responseData);
      
      toast({
        title: "Analysis Complete",
        description: "Volume data retrieved successfully.",
      });
      
      console.log("Volume analysis response:", responseData);
      
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError' 
        ? 'Request timed out. Please try again.'
        : error.message || 'Failed to analyze selected items';
        
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return {
    isLoading,
    volumeData,
    setVolumeData,
    analyzeSelectedKeywords
  };
};
