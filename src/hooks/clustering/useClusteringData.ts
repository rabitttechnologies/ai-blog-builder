
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import type { ClusteringResponse, ClusterItem } from '@/types/clustering';

export const useClusteringData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clusteringData, setClusteringData] = useState<ClusteringResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Process clustering response data
  const processClusteringData = useCallback((data: any) => {
    try {
      // Extract the clusters array from the response structure
      let clusters = data;
      if (data && data.data && Array.isArray(data.data)) {
        const firstItem = data.data[0];
        if (firstItem && firstItem.clusters) {
          clusters = firstItem.clusters;
        }
      }

      // Set default status for all items
      if (Array.isArray(clusters)) {
        clusters.forEach(cluster => {
          if (cluster.items && Array.isArray(cluster.items)) {
            cluster.items.forEach(item => {
              item.status = 'Select for Blog Creation';
              item.priority = 0;
            });
          }
        });
      }

      // Extract other fields from the response
      const workflowId = data.data?.[0]?.workflowId || data.workflowId || '';
      const userId = data.data?.[0]?.userId || data.userId || user?.id || '';
      const originalKeyword = data.data?.[0]?.originalKeyword || data.originalKeyword || '';
      const executionId = data.data?.[0]?.executionId || '';

      const formattedResponse: ClusteringResponse = {
        clusters: clusters || [],
        workflowId,
        userId,
        originalKeyword,
        executionId
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
      const processedData = processClusteringData(data);
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
