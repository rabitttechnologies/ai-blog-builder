
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPostStatus, BlogPostInsert, BlogPostUpdate } from '@/types/blog';
import type { OutlinePromptResponse, OutlinePromptFormData } from './useOutlinePrompt';

export interface FinalBlogPayload {
  Blog_id: string | number;
  new_title: string;
  Title: string;
  Keyword: string;
  "Primary Keyword": string;
  key_takeaways: string;
  "Article introduction": string;
  "Prompt for writing body": string;
  "Workflow Id": string;
  "User Id": string;
  "Session Id": string;
}

export interface FinalBlogResponse {
  BlogId: string | number;
  new_title: string;
  Title: string;
  Keywords: string;
  "original Keyword": string;
  final_article: string;
  "Meta description": string;
  "Image Prompt": string;
  "Workflow Id": string;
  UserId: string;
  "Execution Id": string;
}

export interface FinalBlogFormData {
  title: string;
  alternateTitle: string;
  finalArticle: string;
}

export const useFinalBlogCreation = (outlinePromptData: OutlinePromptResponse | null) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutReached, setTimeoutReached] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [finalBlogData, setFinalBlogData] = useState<FinalBlogResponse | null>(null);
  const [formData, setFormData] = useState<FinalBlogFormData>({
    title: '',
    alternateTitle: '',
    finalArticle: ''
  });

  // Generate a session ID for request tracking
  const getSessionId = useCallback(() => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  }, [session]);

  // Update form data fields
  const updateField = useCallback((field: keyof FinalBlogFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Create final blog from outline and prompt
  const createFinalBlog = useCallback(async (
    updatedFormData: OutlinePromptFormData
  ) => {
    if (!outlinePromptData || !user?.id) {
      toast({
        title: "Missing Data",
        description: "Outline data or user information is missing.",
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
        variant: "destructive"
      });
    }, 300000); // 300 seconds

    try {
      // Prepare payload for final blog creation webhook
      const payload: FinalBlogPayload = {
        Blog_id: outlinePromptData["Blog id"],
        new_title: updatedFormData.title,
        Title: updatedFormData.alternateTitle,
        Keyword: outlinePromptData.Keyword,
        "Primary Keyword": outlinePromptData["Primary Keyword"],
        key_takeaways: outlinePromptData.key_takeaways,
        "Article introduction": outlinePromptData["Article introduction"],
        "Prompt for writing body": updatedFormData.promptForBody,
        "Workflow Id": outlinePromptData["Workflow Id"] || "",
        "User Id": user.id,
        "Session Id": getSessionId()
      };

      console.log("Submitting final blog creation request with payload:", JSON.stringify(payload));

      // Make the API request with fetch
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

      // Parse the response data
      const rawData = await response.json();
      console.log("Final blog creation response:", JSON.stringify(rawData));
      
      // Handle array wrapped response
      let responseData: FinalBlogResponse;
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        responseData = rawData[0];
      } else if (rawData && typeof rawData === 'object') {
        responseData = rawData;
      } else {
        throw new Error('Invalid response format');
      }
      
      // Update state with the response data
      setFinalBlogData(responseData);
      
      // Initialize form data with values from response
      setFormData({
        title: responseData.new_title || '',
        alternateTitle: responseData.Title || '',
        finalArticle: responseData.final_article || ''
      });
      
      // Show success toast
      toast({
        title: "Blog Created",
        description: "Your blog content has been generated successfully.",
      });
      
      return responseData;
    } catch (error: any) {
      console.error('Error creating final blog:', error);
      setError(error.message || 'Failed to create final blog');
      
      toast({
        title: "Blog Creation Failed",
        description: error.message || "An error occurred while creating the blog.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [outlinePromptData, user, toast, getSessionId]);

  // Save blog to Supabase
  const saveBlogToSupabase = useCallback(async (
    updatedFormData: FinalBlogFormData
  ) => {
    if (!finalBlogData || !user?.id) {
      toast({
        title: "Missing Data",
        description: "Blog data or user information is missing.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const blogId = `blog-${finalBlogData.BlogId}`;
      console.log("Saving blog to Supabase with ID:", blogId);

      // Check if the blog already exists
      const { data: existingBlog, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('id', blogId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking for existing blog:", checkError);
        throw new Error("Failed to check if blog already exists");
      }

      // Define the blog status using the correct type
      const blogStatus: BlogPostStatus = 'draft';

      // Prepare blog data for saving with proper JSON content typing
      const blogData: BlogPostUpdate = {
        id: blogId,
        title: updatedFormData.title,
        content: JSON.stringify({ content: updatedFormData.finalArticle }) as any,
        meta_description: finalBlogData["Meta description"],
        excerpt: finalBlogData["Meta description"]?.substring(0, 160),
        status: blogStatus,
        slug: updatedFormData.title.toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-'),
        language_code: 'en',
        author_id: user.id,
        tags: finalBlogData.Keywords?.split(',').map(k => k.trim()) || [],
        updated_at: new Date().toISOString()
      };

      if (existingBlog) {
        // Update existing blog
        console.log("Updating existing blog:", blogId);
        const { error: operationError } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', blogId);
          
        if (operationError) {
          console.error("Blog update operation error:", operationError);
          throw operationError;
        }
      } else {
        // Insert new blog with proper types
        console.log("Inserting new blog:", blogId);
        const newBlogData: BlogPostInsert = {
          ...blogData,
          id: blogId,
          language_code: 'en',
          is_original: true,
          created_at: new Date().toISOString()
        };
        
        const { error: operationError } = await supabase
          .from('blog_posts')
          .insert(newBlogData);
          
        if (operationError) {
          console.error("Blog insert operation error:", operationError);
          throw operationError;
        }
      }
      
      // Show success toast
      toast({
        title: "Blog Saved",
        description: "Your blog has been saved successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error saving blog to Supabase:', error);
      setError(error.message || 'Failed to save blog to Supabase');
      
      toast({
        title: "Save Failed",
        description: error.message || "An error occurred while saving the blog.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [finalBlogData, user, toast]);

  return {
    loading,
    timeoutReached,
    error,
    finalBlogData,
    formData,
    updateField,
    createFinalBlog,
    saveBlogToSupabase,
    resetFinalBlogData: () => setFinalBlogData(null)
  };
};
