
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { safeGet } from '@/utils/dataValidation';
import type { 
  TitleDescriptionResponse,
  BlogCreationPayload
} from '@/types/clustering';

export const useBlogCreation = (titleDescriptionData: TitleDescriptionResponse | null) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a session ID for request tracking
  const getSessionId = useCallback(() => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  }, [session]);

  // Submit final blog creation request
  const createBlog = useCallback(async (selectedItem: TitleDescriptionResponse['data'][0]) => {
    if (!titleDescriptionData || !user?.id) {
      toast({
        title: "Missing Data",
        description: "Title data or user information is missing.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate a blog ID (random number starting from 11111)
      const blogId = 11111 + Math.floor(Math.random() * 88888);
      
      const payload: BlogCreationPayload = {
        Title: safeGet(selectedItem, 'title', ''),
        Description: safeGet(selectedItem, 'description', ''),
        Keyword: safeGet(selectedItem, 'keyword', ''),
        BlogId: blogId,
        workflowId: safeGet(titleDescriptionData, 'workflowId', ''),
        userId: user.id,
        originalKeyword: safeGet(titleDescriptionData, 'originalKeyword', ''),
        sessionId: getSessionId()
      };

      console.log("Submitting blog creation request with payload:", JSON.stringify(payload));

      const response = await fetch('https://n8n.agiagentworld.com/webhook/createblogmetatags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Blog creation response:", JSON.stringify(data));
      
      toast({
        title: "Blog Creation Initiated",
        description: "Your blog is being created.",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating blog:', error);
      setError(error.message || 'Failed to create blog');
      
      toast({
        title: "Blog Creation Failed",
        description: error.message || "An error occurred while creating the blog.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [titleDescriptionData, user, toast, getSessionId]);

  return {
    loading,
    error,
    createBlog
  };
};
