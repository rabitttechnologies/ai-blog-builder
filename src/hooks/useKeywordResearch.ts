
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const { user } = useAuth();
  const { toast } = useToast();

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

    try {
      // Generate a unique workflow execution ID
      const executionId = crypto.randomUUID();
      
      // Insert into Primary Research Table
      const { data: insertedData, error: insertError } = await supabase
        .from('Primary Research Table')
        .insert({
          "Primary Keyword": keyword,
          "Laungage": "English",
          "Location": user?.profile.country || 'US',
          "Depth": 12,
          "Limit": 20,
          "Trigger": "Get the Past Search Data",
          "execution Id": executionId,
          "uuid": user?.id // Include the user's ID
        })
        .select();

      if (insertError) throw insertError;

      console.log("Keyword research data inserted:", insertedData);

      // Call webhook with enhanced data
      const webhookResponse = await fetch('https://www.n8n.agiagentworld.com/googlesearchresponse', {
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

      if (!webhookResponse.ok) {
        throw new Error(`Webhook responded with status: ${webhookResponse.status}`);
      }

      const responseData = await webhookResponse.json();
      console.log("Webhook response:", responseData);

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
        description: `Unable to complete keyword research: ${error.message || 'Please try again.'}`,
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
    submitKeyword
  };
};
