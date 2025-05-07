export interface ClusteringResponse {
  [key: string]: any;
}

export interface GroupingOption {
  label: string;
  value: string;
}

// Additional types for TitleDescriptionResponse
export interface TitleDescriptionResponse {
  workflowId: string;
  userId: string;
  executionId: string;
  originalKeyword: string;
  country: string;
  language: string;
  typeOfContent: string;
  mainKeyword: string;
  additionalKeyword: string[];
  references: { title: string; url: string }[];
  researchType: string;
  titlesandShortDescription?: any;
  additionalData?: any;
  articleoutline?: Array<{
    [key: string]: string;
  }>;
  data: Array<{
    id?: string;
    keyword: string;
    title: string;
    description: string;
    category?: string;
    cluster_name?: string;
    [key: string]: any;
  }>;
}
