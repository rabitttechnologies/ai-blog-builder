export type WritingStyle = 'Formal' | 'Informal' | 'Professional' | 'Creative' | string;
export type ArticlePointOfView = 'writer' | 'reader' | 'neutral';

export interface HeadingsOption {
  label: string;
  value: number;
}

export const headingsOptions: HeadingsOption[] = [
  { label: '3 Headings', value: 3 },
  { label: '5 Headings', value: 5 },
  { label: '7 Headings', value: 7 },
  { label: '9 Headings', value: 9 },
  { label: '11 Headings', value: 11 },
];

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
  titlesAndShortDescription: {
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
  articleOutline: any;
  articleOutline1?: string;
  articleOutline2?: string;
  promptforbody?: string;
  Introduction?: string;
  key_takeaways?: string;
  additionalData?: any;
  GeneratedArticle?: string; // Alternative casing
  HumanizedGeneratedArticle?: string; // Humanized version of the article
  metaTags?: string; // Meta description and other meta tags
}
