
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
  articleOutline: any[];
  articlePrompt: string;
  additionalData?: any;
}
