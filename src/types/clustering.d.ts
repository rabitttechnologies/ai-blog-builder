
/**
 * Type definitions for clustering workflow
 */

export interface ClusterItem {
  keyword: string;
  category?: string | null;
  monthlySearchVolume: number | null;
  keywordDifficulty: number | null;
  competition: string | null;
  searchIntent: string | null;
  reasoning: string | null;
  cpc: number | null;
  priority?: number;
  status?: 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future';
  isEditing?: boolean;
}

export interface ClusterGroup {
  clusterName: string;
  intentPattern: string;
  coreTopic: string;
  reasoning: string;
  items: ClusterItem[];
}

export interface ClusteringResponse {
  clusters: ClusterGroup[];
  workflowId: string;
  userId: string;
  originalKeyword: string;
  executionId: string;
}

export interface TitleDescriptionItem {
  cluster_name: string;
  keyword: string;
  title: string;
  description: string;
  type: 'hub' | 'spoke';
  reasoning: string;
  primary_keyword: string;
  category: string;
  status?: 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future';
}

export interface TitleDescriptionResponse {
  data: TitleDescriptionItem[];
  workflowId: string;
  userId: string;
  originalKeyword: string;
  executionId: string;
}

export interface BlogCreationPayload {
  Title: string;
  Description: string;
  Keyword: string;
  BlogId: number;
  workflowId: string;
  userId: string;
  originalKeyword: string;
  sessionId: string;
}

export interface ClusteringFilters {
  keyword?: string;
  competition?: string;
  minDifficulty?: number;
  maxDifficulty?: number;
  searchIntent?: string;
  category?: string;
}

export type GroupingOption = 'clusterName' | 'category' | 'intentPattern' | 'coreTopic' | 'searchIntent';

export interface ClusteringState {
  data: ClusteringResponse | null;
  loading: boolean;
  error: string | null;
  groupBy: GroupingOption;
  filters: ClusteringFilters;
  editingKeyword: string | null;
}

export interface TitleDescriptionState {
  data: TitleDescriptionResponse | null;
  loading: boolean;
  error: string | null;
  groupBy: 'cluster_name' | 'category';
  filters: {
    keyword?: string;
    title?: string;
    category?: string;
  };
  selectedItem: TitleDescriptionItem | null;
}
