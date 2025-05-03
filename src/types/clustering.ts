// Extend or create if file doesn't exist yet

// Clustering data types
export type ClusteringResponse = {
  clusters: ClusterGroup[];
  workflowId: string;
  userId: string;
  originalKeyword: string;
  executionId: string;
};

export type ClusterGroup = {
  clusterName: string;
  intentPattern: string;
  coreTopic: string;
  reasoning: string;
  items: ClusterItem[];
};

export type ClusterItem = {
  keyword: string;
  monthlySearchVolume: number | null;
  keywordDifficulty: number | null;
  competition: string | null;
  searchIntent: string | null;
  reasoning: string;
  cpc: number | null;
  category: string | null;
  status: 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future';
  priority: number;
  isEditing?: boolean;
};

export type GroupingOption = 'clusterName' | 'category' | 'intentPattern' | 'coreTopic' | 'searchIntent';

export type ClusteringFilters = {
  searchIntent?: string;
  category?: string;
  keyword?: string;
  competition?: string;
  minDifficulty?: number;
  maxDifficulty?: number;
};

// Title/Description types
export type TitleDescriptionResponse = {
  data: Array<{
    cluster_name: string;
    keyword: string;
    title: string;
    description: string;
    type: string;
    reasoning: string;
    primary_keyword: string;
    category: string;
    status: 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future';
  }>;
  workflowId: string;
  userId: string;
  originalKeyword: string;
  executionId: string;
};

// Blog creation types
export type BlogCreationPayload = {
  Title: string;
  Description: string;
  Keyword: string;
  BlogId: number;
  workflowId: string;
  userId: string;
  originalKeyword: string;
  sessionId: string;
};

// User defined types for the outline and final blog process
export type OutlinePromptData = {
  "Blog id": string;
  "Primary Keyword": string;
  "Keyword": string;
  "Title": string;
  "new_title": string;
  "Prompt for writing body": string;
  "Article Outline": string;
  "Article introduction": string;
  "key_takeaways": string;
  "target_audience": string;
  "article_goal": string;
  "Workflow Id": string;
  "User Id": string;
  "execution Id": string;
};

export type FinalBlogData = {
  BlogId: string | number;
  new_title: string;
  Title: string;
  Keywords: string;
  "original Keyword": string;
  final_article: string;
  "Meta description": string;
  "Image Prompt": string;
  "Workflow Id": string;
  UserId: string;
  "Execution Id": string;
};

// Add a new type for the webhook response structure
export type KeywordResearchWebhookResponse = {
  'workflow Id'?: string;
  'user Id'?: string;
  'Execution Id'?: string;
  'Original Keyword'?: string;
  'Country'?: string;
  'Language'?: string;
  'Type of Content'?: string;
  'Historical Search Data'?: Array<{
    text: string;
    keywordMetrics?: {
      competition?: string;
      monthlySearchVolumes?: Array<{
        month: string;
        year: string;
        monthlySearches: string;
      }>;
      avgMonthlySearches?: string;
      competitionIndex?: string;
    };
    closeVariants?: string[];
  }>;
  'References'?: Array<{
    title: string;
    url: string;
  }>;
  'Additional Data'?: string | any;
  
  // Alternative camelCase versions
  workflowId?: string;
  userId?: string;
  executionId?: string;
  originalKeyword?: string;
  country?: string;
  language?: string;
  contentType?: string;
  historicalSearchData?: Array<{
    text: string;
    keywordMetrics?: {
      competition?: string;
      monthlySearchVolumes?: Array<{
        month: string;
        year: string;
        monthlySearches: string;
      }>;
      avgMonthlySearches?: string;
      competitionIndex?: string;
    };
    closeVariants?: string[];
  }>;
  references?: Array<{
    title: string;
    url: string;
  }> | string;
  additionalData?: any;
};
