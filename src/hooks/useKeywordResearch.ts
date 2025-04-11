
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface KeywordSuggestions {
  topInSERP: string[];
  hotKeywordIdeas: string[];
  popularRightNow: string[];
  topSuggestions: string[];
}

export interface KeywordResearchFormData {
  keyword: string;
  language: string;
  country: string;
  depth: number;
  limit: number;
}

export const useKeywordResearch = () => {
  const [formData, setFormData] = useState<KeywordResearchFormData>({
    keyword: '',
    language: 'English',
    country: 'US',
    depth: 12,
    limit: 20
  });
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

  // Fetch user preferences on mount
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (user) {
        try {
          // Fetch language and country from user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('language, country')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile data:', profileError);
          } else {
            // Update form data with fetched profile values
            setFormData(prev => ({
              ...prev,
              language: profileData?.language || prev.language,
              country: profileData?.country || prev.country
            }));
          }

          // Fetch depth and limit from Primary Research Table
          const { data: researchData, error: researchError } = await supabase
            .from('Primary Research Table')
            .select('Depth, Limit')
            .eq('uuid', user.id)
            .maybeSingle();

          if (researchError) {
            console.error('Error fetching research data:', researchError);
          } else {
            // Update form data with fetched research values
            setFormData(prev => ({
              ...prev,
              depth: researchData?.Depth || prev.depth,
              limit: researchData?.Limit || prev.limit
            }));
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        }
      }
    };

    fetchUserPreferences();
  }, [user]);

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

  const updateFormField = (field: keyof KeywordResearchFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveUserPreferences = async () => {
    if (!user) return;

    try {
      // Update profile with language and country
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          language: formData.language,
          country: formData.country
        })
        .eq('id', user.id);

      if (profileUpdateError) {
        console.error('Error updating profile:', profileUpdateError);
        throw profileUpdateError;
      }

      // Check if the user has an entry in Primary Research Table
      const { data: existingEntry } = await supabase
        .from('Primary Research Table')
        .select('id')
        .eq('uuid', user.id)
        .maybeSingle();

      // Update or insert research preferences
      if (existingEntry) {
        const { error: researchUpdateError } = await supabase
          .from('Primary Research Table')
          .update({
            Depth: formData.depth,
            Limit: formData.limit
          })
          .eq('uuid', user.id);
          
        if (researchUpdateError) {
          console.error('Error updating research preferences:', researchUpdateError);
          throw researchUpdateError;
        }
      } else {
        const { error: researchInsertError } = await supabase
          .from('Primary Research Table')
          .insert({
            uuid: user.id,
            Depth: formData.depth,
            Limit: formData.limit,
            Primary_Keyword: formData.keyword,
            Location: formData.country,
            Laungage: formData.language
          });
          
        if (researchInsertError) {
          console.error('Error inserting research preferences:', researchInsertError);
          throw researchInsertError;
        }
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
      toast({
        title: 'Error Saving Preferences',
        description: 'Unable to save your preferences. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const submitKeyword = async () => {
    if (!formData.keyword.trim()) {
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
      // Save user preferences
      await saveUserPreferences();
      
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
      const fetchPromise = fetch('https://n8n.agiagentworld.com/webhook/googlesearchresponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword: formData.keyword,
          language: formData.language,
          location: formData.country,
          depth: formData.depth,
          limit: formData.limit,
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
    formData,
    updateFormField,
    suggestions,
    isLoading,
    loadingProgress,
    submitKeyword
  };
};
