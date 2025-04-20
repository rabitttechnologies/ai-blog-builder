
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import type { 
  ClusteringResponse, 
  TitleDescriptionResponse 
} from '@/types/clustering';

export const useTitleGeneration = (clusteringData: ClusteringResponse | null) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [titleDescriptionData, setTitleDescriptionData] = useState<TitleDescriptionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a session ID for request tracking
  const getSessionId = useCallback(() => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  }, [session]);

  // Submit selected keywords for title/description generation
  const generateTitleDescription = useCallback(async () => {
    if (!clusteringData || !user?.id) {
      toast({
        title: "Missing Data",
        description: "Clustering data or user information is missing.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare the payload
      const payload = {
        data: [{
          clusters: clusteringData.clusters.map(cluster => ({
            clusterName: cluster.clusterName,
            intentPattern: cluster.intentPattern,
            coreTopic: cluster.coreTopic,
            Reasoning: cluster.reasoning,
            items: cluster.items.map(item => ({
              keyword: item.keyword,
              category: item.category,
              monthlySearchVolume: item.monthlySearchVolume,
              keywordDifficulty: item.keywordDifficulty,
              competition: item.competition,
              searchIntent: item.searchIntent,
              reasoning: item.reasoning,
              cpc: item.cpc,
              status: item.status || 'Select for Blog Creation'
            }))
          })),
          workflowId: clusteringData.workflowId,
          userId: user.id,
          originalKeyword: clusteringData.originalKeyword,
          sessionId: getSessionId()
        }]
      };

      const response = await fetch('https://n8n.agiagentworld.com/webhook/titleshortdescription', {
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
      
      // Process and set title/description data
      if (data && data.data && Array.isArray(data.data)) {
        const titleDescData = {
          data: data.data[0]?.data || [],
          workflowId: clusteringData.workflowId,
          userId: user.id,
          originalKeyword: clusteringData.originalKeyword,
          executionId: data.data[0]?.executionId || ''
        };
        
        setTitleDescriptionData(titleDescData);
        
        toast({
          title: "Title Generation Complete",
          description: "Blog titles and descriptions have been generated.",
        });
        
        return titleDescData;
      }
      
      throw new Error('Invalid response format');
    } catch (error: any) {
      console.error('Error generating titles/descriptions:', error);
      setError(error.message || 'Failed to generate titles and descriptions');
      
      toast({
        title: "Title Generation Failed",
        description: error.message || "An error occurred while generating blog titles.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [clusteringData, user, toast, getSessionId]);

  // Update a title/description item
  const updateTitleDescription = useCallback((itemId: string, updates: Partial<TitleDescriptionResponse['data'][0]>) => {
    if (!titleDescriptionData) return;
    
    setTitleDescriptionData(prevData => {
      if (!prevData) return null;
      
      return {
        ...prevData,
        data: prevData.data.map(item => {
          if (item.keyword === itemId) {
            return { ...item, ...updates };
          }
          return item;
        })
      };
    });
  }, [titleDescriptionData]);

  return {
    titleDescriptionData,
    loading,
    error,
    generateTitleDescription,
    updateTitleDescription,
    resetTitleDescriptionData: () => setTitleDescriptionData(null),
  };
};
