
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import type { 
  ClusteringResponse, 
  ClusteringFilters, 
  GroupingOption,
  ClusterGroup,
  ClusterItem,
  TitleDescriptionResponse,
  BlogCreationPayload
} from '@/types/clustering';

export const useClusteringWorkflow = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [clusteringData, setClusteringData] = useState<ClusteringResponse | null>(null);
  const [titleDescriptionData, setTitleDescriptionData] = useState<TitleDescriptionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupingOption>('clusterName');
  const [filters, setFilters] = useState<ClusteringFilters>({});
  const [selectedKeywords, setSelectedKeywords] = useState<Map<string, ClusterItem>>(new Map());
  
  // Generate a session ID for request tracking
  const getSessionId = useCallback(() => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  }, [session]);

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
                const updatedItem = { ...item, ...updates };
                
                // Update selected keywords map if priority or status changes
                if (updates.priority !== undefined || updates.status !== undefined) {
                  const newSelectedKeywords = new Map(selectedKeywords);
                  
                  if (updates.status === 'Select for Blog Creation' && (updates.priority || 0) > 0) {
                    newSelectedKeywords.set(updatedItem.keyword, updatedItem);
                  } else if (updates.status !== 'Select for Blog Creation') {
                    newSelectedKeywords.delete(updatedItem.keyword);
                  }
                  
                  setSelectedKeywords(newSelectedKeywords);
                }
                
                return updatedItem;
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
  }, [clusteringData, selectedKeywords]);

  // Filter clusters based on current filters
  const filteredClusters = useMemo(() => {
    if (!clusteringData) return [];

    return clusteringData.clusters.map(cluster => {
      const filteredItems = cluster.items.filter(item => {
        // Apply all filters
        if (filters.keyword && !item.keyword.toLowerCase().includes(filters.keyword.toLowerCase())) {
          return false;
        }
        if (filters.competition && item.competition !== filters.competition) {
          return false;
        }
        if (filters.minDifficulty !== undefined && 
            item.keywordDifficulty !== null && 
            item.keywordDifficulty < filters.minDifficulty) {
          return false;
        }
        if (filters.maxDifficulty !== undefined && 
            item.keywordDifficulty !== null && 
            item.keywordDifficulty > filters.maxDifficulty) {
          return false;
        }
        if (filters.searchIntent && item.searchIntent !== filters.searchIntent) {
          return false;
        }
        if (filters.category && item.category !== filters.category) {
          return false;
        }
        return true;
      });

      return {
        ...cluster,
        items: filteredItems
      };
    }).filter(cluster => cluster.items.length > 0);
  }, [clusteringData, filters]);

  // Group clusters based on selected grouping
  const groupedClusters = useMemo(() => {
    if (!filteredClusters) return [];

    if (groupBy === 'clusterName') {
      // Already grouped by cluster name
      return filteredClusters;
    }

    // For other grouping options, we need to restructure
    const grouped = new Map<string, ClusterGroup>();

    filteredClusters.forEach(cluster => {
      cluster.items.forEach(item => {
        const groupValue = item[groupBy] || 'Unknown';
        if (!grouped.has(groupValue)) {
          grouped.set(groupValue, {
            clusterName: groupValue,
            intentPattern: groupBy === 'intentPattern' ? groupValue : cluster.intentPattern,
            coreTopic: groupBy === 'coreTopic' ? groupValue : cluster.coreTopic,
            reasoning: cluster.reasoning,
            items: []
          });
        }
        grouped.get(groupValue)!.items.push(item);
      });
    });

    return Array.from(grouped.values());
  }, [filteredClusters, groupBy]);

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

    // Check if we have enough selected keywords with priority
    const prioritizedKeywords = Array.from(selectedKeywords.values())
      .filter(k => k.status === 'Select for Blog Creation' && (k.priority || 0) > 0);
    
    if (prioritizedKeywords.length < 10) {
      toast({
        title: "Not Enough Keywords",
        description: "Please select and prioritize at least 10 keywords for blog creation.",
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
  }, [clusteringData, user, selectedKeywords, toast, getSessionId]);

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
        Title: selectedItem.title,
        Description: selectedItem.description,
        Keyword: selectedItem.keyword,
        BlogId: blogId,
        workflowId: titleDescriptionData.workflowId,
        userId: user.id,
        originalKeyword: titleDescriptionData.originalKeyword,
        sessionId: getSessionId()
      };

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
    // State
    clusteringData,
    titleDescriptionData,
    loading,
    error,
    groupBy,
    filters,
    selectedKeywords,
    
    // Computed values
    filteredClusters,
    groupedClusters,
    
    // Actions
    setFilters,
    setGroupBy,
    updateKeyword,
    fetchClusteringData,
    generateTitleDescription,
    updateTitleDescription,
    createBlog,
    
    // Reset functions
    resetClusteringData: () => setClusteringData(null),
    resetTitleDescriptionData: () => setTitleDescriptionData(null),
  };
};
