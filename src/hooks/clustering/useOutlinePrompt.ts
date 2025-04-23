
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { safeGet } from '@/utils/dataValidation';

export interface OutlinePromptPayload {
  Title: string;
  Description: string;
  Keyword: string;
  BlogId: number;
  workflowId: string;
  userId: string;
  originalKeyword: string;
  sessionId: string;
}

export interface OutlinePromptResponse {
  "Blog id": string;
  "Primary Keyword": string;
  "Keyword": string;
  "Title": string;
  "new_title": string;
  "Prompt for writing body": string;
  "Article Outline": string;
  "Article introduction": string;
  "key_takeaways": string;
  "target_audience": string;
  "article_goal": string;
  "Workflow Id": string;
  "User Id": string;
  "execution Id": string;
}

export interface OutlinePromptFormData {
  title: string;
  alternateTitle: string;
  outline: string;
  promptForBody: string;
  targetAudience: string;
  goal: string;
}

export const useOutlinePrompt = (titleDescriptionData: any | null) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutReached, setTimeoutReached] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outlinePromptData, setOutlinePromptData] = useState<OutlinePromptResponse | null>(null);
  const [formData, setFormData] = useState<OutlinePromptFormData>({
    title: '',
    alternateTitle: '',
    outline: '',
    promptForBody: '',
    targetAudience: '',
    goal: ''
  });

  // Generate a session ID for request tracking
  const getSessionId = useCallback(() => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  }, [session]);

  // Generate a random blog ID
  const generateBlogId = useCallback(() => {
    return 11111 + Math.floor(Math.random() * 88888);
  }, []);

  // Update form data fields
  const updateField = useCallback((field: keyof OutlinePromptFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Submit selected title/description for outline generation
  const generateOutlinePrompt = useCallback(async (selectedItem: any) => {
    if (!titleDescriptionData || !user?.id) {
      toast({
        title: "Missing Data",
        description: "Title data or user information is missing.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    setError(null);
    setTimeoutReached(false);

    // Set up timeout after 300 seconds
    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
      setLoading(false);
      toast({
        title: "Operation Taking Too Long",
        description: "The request is still processing but may take longer than expected.",
        variant: "destructive" // Changed from "warning" to "destructive"
      });
    }, 300000); // 300 seconds

    try {
      // Generate blog ID
      const blogId = generateBlogId();
      
      // Prepare payload for outline prompt webhook
      const payload: OutlinePromptPayload = {
        Title: safeGet(selectedItem, 'title', ''),
        Description: safeGet(selectedItem, 'description', ''),
        Keyword: safeGet(selectedItem, 'keyword', ''),
        BlogId: blogId,
        workflowId: safeGet(titleDescriptionData, 'workflowId', ''),
        userId: user.id,
        originalKeyword: safeGet(titleDescriptionData, 'originalKeyword', ''),
        sessionId: getSessionId()
      };

      console.log("Submitting outline prompt request with payload:", JSON.stringify(payload));

      // Make the API request with fetch
      const response = await fetch('https://n8n.agiagentworld.com/webhook/outlinebodyprompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response data
      const rawData = await response.json();
      console.log("Outline prompt response:", JSON.stringify(rawData));
      
      // Handle array wrapped response
      let responseData: OutlinePromptResponse;
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        responseData = rawData[0];
      } else if (rawData && typeof rawData === 'object') {
        responseData = rawData;
      } else {
        throw new Error('Invalid response format');
      }
      
      // Update state with the response data
      setOutlinePromptData(responseData);
      
      // Initialize form data with values from response
      setFormData({
        title: responseData.new_title || '',
        alternateTitle: responseData.Title || '',
        outline: responseData["Article Outline"] || '',
        promptForBody: responseData["Prompt for writing body"] || '',
        targetAudience: responseData.target_audience || '',
        goal: responseData.article_goal || ''
      });
      
      // Show success toast
      toast({
        title: "Outline Generated",
        description: "Blog outline and prompt have been generated successfully.",
      });
      
      return responseData;
    } catch (error: any) {
      console.error('Error generating outline and prompt:', error);
      setError(error.message || 'Failed to generate outline and prompt');
      
      toast({
        title: "Generation Failed",
        description: error.message || "An error occurred while generating the outline and prompt.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [titleDescriptionData, user, toast, getSessionId, generateBlogId]);

  return {
    loading,
    timeoutReached,
    error,
    outlinePromptData,
    formData,
    updateField,
    generateOutlinePrompt,
    resetOutlinePromptData: () => setOutlinePromptData(null)
  };
};
