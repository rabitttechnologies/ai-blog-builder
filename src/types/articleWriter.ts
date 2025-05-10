
export type WritingStyle = 'Formal' | 'Informal' | 'Professional' | 'Creative' | string;
export type ArticlePointOfView = 'writer' | 'reader' | 'neutral';

export interface HeadingsOption {
  id: string;
  label: string;
  value: number;
  count?: number;
  wordCount?: string;
}

export const headingsOptions: HeadingsOption[] = [
  { id: 'headings-3', label: '3 Headings', value: 3, wordCount: 'Approx. 800 words' },
  { id: 'headings-5', label: '5 Headings', value: 5, wordCount: 'Approx. 1200 words' },
  { id: 'headings-7', label: '7 Headings', value: 7, wordCount: 'Approx. 1600 words' },
  { id: 'headings-9', label: '9 Headings', value: 9, wordCount: 'Approx. 2000 words' },
  { id: 'headings-11', label: '11 Headings', value: 11, wordCount: 'Approx. 2400 words' },
];

// Define point of view options for the article
export const pointOfViewOptions = [
  { id: 'writer', label: 'Writer (I, We)', value: 'writer' },
  { id: 'reader', label: 'Reader (You)', value: 'reader' },
  { id: 'neutral', label: 'Neutral (3rd Person)', value: 'neutral' }
];

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
  references: { title: string; url: string }[];
  researchType: string;
  titlesAndShortDescription: {
    title: string;
    description: string;
  };
  headingsCount: string;
  writingStyle: string;
  articlePointOfView: ArticlePointOfView;
  expertGuidance?: string;
  additionalData?: any;
}

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
  articleOutline: any;
  promptforbody?: string;
  Introduction?: string;
  key_takeaways?: string;
  headingsCount?: string;
  writingStyle?: string;
  articlePointOfView?: string;
  additionalData?: any;
}

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
  titlesAndShortDescription?: {
    title: string;
    description: string;
  }[];
  titlesandShortDescription?: any;
  title?: string;
  description?: string;
  headingsCount: string;
  writingStyle: string;
  articlePointOfView: string;
  expertGuidance?: string;
  articleOutline: any; // Standardize on articleOutline (camelCase)
  articleOutline1?: string;
  articleOutline2?: string;
  promptforbody?: string;
  Introduction?: string;
  key_takeaways?: string;
  additionalData?: any;
  GeneratedArticle?: string; // For the generated article
  generatedArticle?: string; // Alternative casing
  HumanizedGeneratedArticle?: string; // Humanized version of the article
  metaTags?: string; // Meta description and other meta tags
}
