
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { safeGet, safeMap } from '@/utils/dataValidation';
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
      const clusters = safeGet(clusteringData, 'clusters', []);
      const mappedClusters = safeMap(clusters, cluster => ({
        clusterName: safeGet(cluster, 'clusterName', ''),
        intentPattern: safeGet(cluster, 'intentPattern', ''),
        coreTopic: safeGet(cluster, 'coreTopic', ''),
        Reasoning: safeGet(cluster, 'reasoning', ''),
        items: safeMap(safeGet(cluster, 'items', []), item => ({
          keyword: safeGet(item, 'keyword', ''),
          category: safeGet(item, 'category', ''),
          monthlySearchVolume: safeGet(item, 'monthlySearchVolume', null),
          keywordDifficulty: safeGet(item, 'keywordDifficulty', null),
          competition: safeGet(item, 'competition', null),
          searchIntent: safeGet(item, 'searchIntent', null),
          reasoning: safeGet(item, 'reasoning', null),
          cpc: safeGet(item, 'cpc', null),
          status: safeGet(item, 'status', 'Select for Blog Creation')
        }))
      }));

      const payload = {
        data: [{
          clusters: mappedClusters,
          workflowId: safeGet(clusteringData, 'workflowId', ''),
          userId: user.id,
          originalKeyword: safeGet(clusteringData, 'originalKeyword', ''),
          sessionId: getSessionId()
        }]
      };

      console.log("Requesting title generation with payload:", JSON.stringify(payload));

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
      console.log("Title generation response:", JSON.stringify(data));
      
      // Process and set title/description data
      const responseData = safeGet(data, 'data.0', {});
      
      if (responseData) {
        const titleDescData = {
          data: safeGet(responseData, 'data', []),
          workflowId: safeGet(clusteringData, 'workflowId', ''),
          userId: user.id,
          originalKeyword: safeGet(clusteringData, 'originalKeyword', ''),
          executionId: safeGet(responseData, 'executionId', '')
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
        data: safeMap(safeGet(prevData, 'data', []), item => {
          if (safeGet(item, 'keyword', '') === itemId) {
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
