
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
      // Insert into Primary Research Table
      const { data: insertedData, error: insertError } = await supabase
        .from('Primary Research Table')
        .insert({
          "Primary Keyword": keyword,
          "Laungage": "English",
          "Location": user?.profile.country || 'US',
          "Depth": 12,
          "Limit": 20,
          "Trigger": "Get the Past Search Data"
        })
        .select();

      if (insertError) throw insertError;

      // Simulate webhook call (in a real app, this would be handled by a backend/edge function)
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
          limit: 20
        })
      });

      const responseData = await webhookResponse.json();

      // Update suggestions based on webhook response
      setSuggestions({
        topInSERP: responseData.organicResults || [],
        hotKeywordIdeas: responseData.relatedQueries || [],
        popularRightNow: responseData.peopleAlsoAsk || [],
        topSuggestions: responseData.autoComplete || []
      });

    } catch (error) {
      console.error('Keyword research error:', error);
      toast({
        title: 'Research Failed',
        description: 'Unable to complete keyword research. Please try again.',
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
