
// Article writer types

// Writing style interface
export interface WritingStyle {
  id: string;
  name: string;
  description: string;
  isSaved: boolean;
}

// Article point of view options
export type ArticlePointOfView = 'writer' | 'reference' | 'others';

// Headings count options with word count
export interface HeadingsOption {
  id: string;
  label: string;
  count: string;
  wordCount: string;
}

// Export headings options
export const headingsOptions: HeadingsOption[] = [
  { id: '1', label: '4-5 Headings', count: '4-5', wordCount: '500-1000 words' },
  { id: '2', label: '6-7 Headings', count: '6-7', wordCount: '1000-2000 words' },
  { id: '3', label: '7-8 Headings', count: '7-8', wordCount: '2000-3000 words' },
  { id: '4', label: '8-9 Headings', count: '8-9', wordCount: '3000-4000 words' },
  { id: '5', label: '9-10 Headings', count: '9-10', wordCount: '4000-5000 words' }
];

// Point of view options
export const pointOfViewOptions = [
  { id: 'writer', label: 'Writer (I, We, Us, Our)', value: 'writer' },
  { id: 'reference', label: 'Writer Immediate Reference (You, Your, Yours)', value: 'reference' },
  { id: 'others', label: 'Others (He, She, They)', value: 'others' }
];

// Title and description form data
export interface TitleDescriptionFormData {
  selectedTitle: string;
  selectedDescription: string;
  headingsCount: string;
  writingStyle: string;
  customWritingStyle?: string;
  pointOfView: ArticlePointOfView;
  expertGuidance?: string;
  saveExpertGuidance: boolean;
}

// Article outline item interface (matches both outline1, outline2 format from API)
export interface ArticleOutlineItem {
  outline1?: string;
  outline2?: string;
  [key: string]: string | undefined;
}

// Title and short description webhook payload
export interface TitleDescriptionPayload {
  workflowId: string;
  userId: string;
  sessionId: string;
  originalKeyword: string;
  country: string;
  language: string;
  typeOfContent: string;
  mainKeyword: string;
  additionalKeyword: string[];
  references: {
    title: string;
    url: string;
  }[];
  researchType: string;
  titlesAndShortDescription: {
    title: string;
    description: string;
  };
  headingsCount: string;
  writingStyle: string;
  articlePointOfView: string;
  expertGuidance?: string;
  additionalData?: any;
}

// Title and short description response
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
  references: {
    title: string;
    url: string;
  }[];
  researchType: string;
  titlesAndShortDescription: {
    title: string;
    description: string;
  };
  headingsCount: string;
  writingStyle: string;
  articlePointOfView: string;
  expertGuidance?: string;
  articleOutline?: ArticleOutlineItem[];  // Handle both casing variants
  articlePrompt?: string;
  promptforbody?: string;  // Added field for data from title description webhook
  Introduction?: string;   // Added field for Introduction from title description webhook  
  key_takeaways?: string;  // Added field for key_takeaways from title description webhook
  additionalData?: any;
}

// Response from keyword research webhook
export interface KeywordResponse {
  workflowId: string;
  userId: string;
  executionId: string;
  originalKeyword: string;
  country: string;
  language: string;
  contentType: string;
  historicalSearchData: any[]; // Array of keyword data
  references: any[]; // Array of reference links
  additionalData?: any; // Any additional data
}

// Response from selected keywords webhook
export interface KeywordSelectResponse {
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
  
  // Title and descriptions can be in different formats
  titlesandShortDescription?: {
    title: string;
    description: string;
  } | any[] | string;
  titlesAndShortDescription?: {
    title: string;
    description: string;
  } | any[] | string;
  
  // Article outline data - can appear in both lowercase and uppercase variants
  articleoutline?: ArticleOutlineItem[];
  articleOutline?: ArticleOutlineItem[];
  
  // Additional fields from title description response
  promptforbody?: string;
  Introduction?: string;
  key_takeaways?: string;
  
  // Generated article fields from outline and customize webhook
  GeneratedArticle?: string;
  HumanizedGeneratedArticle?: string;
  metaTags?: string;
  
  // The generated article
  generatedArticle?: string;
  
  // Additional fields for convenience
  additionalData?: any;
  title?: string; 
  description?: string;
  
  // Fields from TitleDescriptionResponse
  headingsCount?: string;
  writingStyle?: string;
  articlePointOfView?: string;
  expertGuidance?: string;
  numberofheadings?: string;
}

// Selected keyword data
export interface SelectedKeyword {
  keyword: string;
  isSelected: boolean;
}

// Title description interface
export interface TitleDescription {
  id: string;
  title: string;
  description: string;
}

// Article outline section
export interface OutlineSection {
  heading: string;
  content: string;
}

// Article outline
export interface ArticleOutline {
  id: string;
  title: string;
  introduction: string;
  sections: OutlineSection[];
  conclusion: string;
}

// Generated article
export interface GeneratedArticle {
  id: string;
  title: string;
  content: string;
  metaDescription: string;
  date: string;
}

// New fields for title description step
export interface TitleDescriptionFormState {
  headingsCount: HeadingsOption | null;
  writingStyle: WritingStyle | null;
  pointOfView: ArticlePointOfView;
  expertGuidance: string;
  saveExpertGuidance: boolean;
}

// Generated article tab options
export type ArticleTabOption = 'generated' | 'humanized';
