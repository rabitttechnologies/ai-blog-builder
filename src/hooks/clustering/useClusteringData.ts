
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import type { ClusteringResponse, ClusterItem } from '@/types/clustering';
import { safeGet } from '@/utils/dataValidation';

export const useClusteringData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clusteringData, setClusteringData] = useState<ClusteringResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Process clustering response data
  const processClusteringData = useCallback((data: any) => {
    try {
      // Handle the specific nested structure from the clustering webhook
      // The response is: [{ data: [{ clusters: [...], workflowId: '...', ... }] }]
      let responseClusters = [];
      let workflowId = '';
      let userId = '';
      let originalKeyword = '';
      let executionId = '';

      // Extract from the nested structure with proper validation
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        const dataArray = safeGet(firstItem, 'data', []);
        
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const dataItem = dataArray[0];
          responseClusters = safeGet(dataItem, 'clusters', []);
          workflowId = safeGet(dataItem, 'workflowId', '');
          userId = safeGet(dataItem, 'userId', '');
          originalKeyword = safeGet(dataItem, 'originalKeyword', '');
          executionId = safeGet(dataItem, 'executionId', '');
        }
      } else if (typeof data === 'object' && data !== null) {
        // Handle case where the response might be flattened
        const dataArray = safeGet(data, 'data', []);
        
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const dataItem = dataArray[0];
          responseClusters = safeGet(dataItem, 'clusters', []);
          workflowId = safeGet(dataItem, 'workflowId', '');
          userId = safeGet(dataItem, 'userId', '');
          originalKeyword = safeGet(dataItem, 'originalKeyword', '');
          executionId = safeGet(dataItem, 'executionId', '');
        } else {
          // Try alternative paths
          responseClusters = safeGet(data, 'clusters', []);
          workflowId = safeGet(data, 'workflowId', '');
          userId = safeGet(data, 'userId', user?.id || '');
          originalKeyword = safeGet(data, 'originalKeyword', '');
          executionId = safeGet(data, 'executionId', '');
        }
      }

      // Validate and normalize clusters
      if (Array.isArray(responseClusters)) {
        responseClusters = responseClusters.map(cluster => {
          const normalizedCluster = {
            clusterName: safeGet(cluster, 'clusterName', 'Unnamed Cluster'),
            intentPattern: safeGet(cluster, 'intentPattern', ''),
            coreTopic: safeGet(cluster, 'coreTopic', ''),
            reasoning: safeGet(cluster, 'reasoning', ''),
            items: []
          };

          // Process and normalize items
          const items = safeGet(cluster, 'items', []);
          if (Array.isArray(items)) {
            normalizedCluster.items = items.map(item => ({
              keyword: safeGet(item, 'keyword', ''),
              monthlySearchVolume: safeGet(item, 'monthlySearchVolume', null),
              keywordDifficulty: safeGet(item, 'keywordDifficulty', null),
              competition: safeGet(item, 'competition', null),
              searchIntent: safeGet(item, 'searchIntent', null),
              reasoning: safeGet(item, 'reasoning', null),
              cpc: safeGet(item, 'cpc', null),
              category: safeGet(item, 'category', null),
              status: 'Select for Blog Creation', // Default status
              priority: 0 // Default priority
            }));
          }
          
          return normalizedCluster;
        });
      }

      // Create the properly formatted response
      const formattedResponse: ClusteringResponse = {
        clusters: responseClusters,
        workflowId: workflowId,
        userId: userId || user?.id || '',
        originalKeyword: originalKeyword,
        executionId: executionId
      };

      return formattedResponse;
    } catch (error) {
      console.error('Error processing clustering data:', error);
      throw new Error('Failed to process clustering data');
    }
  }, [user]);

  // Update keyword status and priority
  const updateKeyword = useCallback((clusterName: string, keywordText: string, updates: Partial<ClusterItem>) => {
    if (!clusteringData) return;

    setClusteringData(prevData => {
      if (!prevData) return null;

      const newData = { ...prevData };
      const updatedClusters = newData.clusters.map(cluster => {
        if (cluster.clusterName === clusterName) {
          return {
            ...cluster,
            items: cluster.items.map(item => {
              if (item.keyword === keywordText) {
                return { ...item, ...updates };
              }
              return item;
            })
          };
        }
        return cluster;
      });

      return {
        ...newData,
        clusters: updatedClusters
      };
    });
  }, [clusteringData]);

  // Fetch clustering data from API
  const fetchClusteringData = useCallback(async (workflowData: any) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Requesting clustering data with payload:", JSON.stringify(workflowData));
      
      const response = await fetch('https://n8n.agiagentworld.com/webhook/clustering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received clustering response:", JSON.stringify(data));
      
      const processedData = processClusteringData(data);
      console.log("Processed clustering data:", JSON.stringify(processedData));
      
      setClusteringData(processedData);
      
      toast({
        title: "Clustering Complete",
        description: "Keywords have been successfully clustered.",
      });

      return processedData;
    } catch (error: any) {
      console.error('Error fetching clustering data:', error);
      setError(error.message || 'Failed to fetch clustering data');
      
      toast({
        title: "Clustering Failed",
        description: error.message || "An error occurred while fetching clustering data.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast, processClusteringData]);

  return {
    clusteringData,
    loading,
    error,
    updateKeyword,
    fetchClusteringData,
    resetClusteringData: () => setClusteringData(null),
  };
};
