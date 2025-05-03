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
      return null;
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

      const rawData = await response.json();
      console.log("Title generation raw response:", JSON.stringify(rawData));
      
      // Handle the array-wrapped response structure from the webhook
      // The structure is [{ data: [{ data: [...], userId, workflowId, ExecutionId }] }]
      let responseData;
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        // Handle array-wrapped response
        const firstItem = rawData[0];
        if (firstItem && Array.isArray(firstItem.data) && firstItem.data.length > 0) {
          responseData = firstItem.data[0];
        }
      } else if (rawData && rawData.data) {
        // Handle object response with data property
        responseData = safeGet(rawData, 'data.0', {});
      }
      
      // If we couldn't extract the data using either method, throw an error
      if (!responseData) {
        console.error("Invalid response format:", rawData);
        throw new Error('Invalid response format');
      }
      
      console.log("Processed response data:", JSON.stringify(responseData));
      
      // Extract data items ensuring type safety
      const dataItems = Array.isArray(safeGet(responseData, 'data', [])) 
        ? safeGet(responseData, 'data', []) 
        : [];
      
      if (dataItems.length === 0) {
        throw new Error('No title/description data returned');
      }
      
      // Handle the ExecutionId/executionId case sensitivity issue
      const executionId = safeGet(responseData, 'ExecutionId', '') || 
                         safeGet(responseData, 'executionId', '');
      
      // Use provided values or fallback to clustering data
      const userId = safeGet(responseData, 'userId', user.id);
      const workflowId = safeGet(responseData, 'workflowId', safeGet(clusteringData, 'workflowId', ''));
      const originalKeyword = safeGet(responseData, 'originalKeyword', safeGet(clusteringData, 'originalKeyword', ''));
      
      const titleDescData: TitleDescriptionResponse = {
        data: dataItems.map(item => ({
          cluster_name: safeGet(item, 'cluster_name', ''),
          keyword: safeGet(item, 'keyword', ''),
          title: safeGet(item, 'title', ''),
          description: safeGet(item, 'description', ''),
          type: safeGet(item, 'type', 'spoke'),
          reasoning: safeGet(item, 'reasoning', ''),
          primary_keyword: safeGet(item, 'primary_keyword', ''),
          category: safeGet(item, 'category', ''),
          status: 'Select for Blog Creation'
        })),
        workflowId,
        userId,
        originalKeyword,
        executionId
      };
      
      console.log("Processed title description data:", JSON.stringify(titleDescData));
      
      setTitleDescriptionData(titleDescData);
      
      toast({
        title: "Title Generation Complete",
        description: "Blog titles and descriptions have been generated.",
      });
      
      return titleDescData;
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
    setTitleDescriptionData(prevData => {
      if (!prevData) return null;

      // Assert that prevData is of type TitleDescriptionResponse
      const prev = prevData as TitleDescriptionResponse;

      const updatedData: TitleDescriptionResponse = {
        ...prev,
        data: safeMap(safeGet(prev, 'data', []), (item) => {
          // Assert item type for spreading
          const currentItem = item as TitleDescriptionResponse['data'][0];
          if (currentItem.keyword === itemId) {
            return { ...currentItem, ...updates };
          }
          return currentItem;
        }),
      };

      return updatedData;
    });
  }, []);

  return {
    titleDescriptionData,
    loading,
    error,
    generateTitleDescription,
    updateTitleDescription,
    resetTitleDescriptionData: () => setTitleDescriptionData(null),
  };
};
