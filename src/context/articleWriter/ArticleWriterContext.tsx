
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the possible content types
export type ContentType = 'Blog Post' | 'News Article' | 'How to Guide' | 'Comparison Blog' | 'Technical Article' | 'Product Reviews';

// Form data for keyword research
export interface KeywordFormData {
  keyword: string;
  country: string;
  language: string;
  contentType: ContentType;
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
  titlesAndShortDescription?: any[];
  additionalData?: any;
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

// Article writer context interface
interface ArticleWriterContextType {
  currentStep: number;
  sessionId: string;
  workflowId: string;
  keywordForm: KeywordFormData;
  keywordResponse: KeywordResponse | null;
  keywordSelectResponse: KeywordSelectResponse | null;
  selectedKeywords: SelectedKeyword[];
  // Title description properties
  titleDescriptionOptions: TitleDescription[];
  setTitleDescriptionOptions: (options: TitleDescription[]) => void;
  selectedTitleDescription: TitleDescription | null;
  setSelectedTitleDescription: (titleDesc: TitleDescription | null) => void;
  // Article outline properties
  articleOutlineOptions: ArticleOutline[];
  setArticleOutlineOptions: (options: ArticleOutline[]) => void;
  selectedOutline: ArticleOutline | null;
  setSelectedOutline: (outline: ArticleOutline | null) => void;
  // Generated article properties
  generatedArticle: GeneratedArticle | null;
  setGeneratedArticle: (article: GeneratedArticle | null) => void;
  // Methods
  setCurrentStep: (step: number) => void;
  updateKeywordForm: (updates: Partial<KeywordFormData>) => void;
  setKeywordResponse: (response: KeywordResponse | null) => void;
  setKeywordSelectResponse: (response: KeywordSelectResponse | null) => void;
  updateSelectedKeyword: (keyword: string, isSelected: boolean) => void;
  resetArticleWriter: () => void;
  resetWorkflow: () => void; // Alias for resetArticleWriter
}

// Create the context
const ArticleWriterContext = createContext<ArticleWriterContextType | undefined>(undefined);

// Generate a unique ID for session and workflow
const generateId = () => Math.random().toString(36).substring(2, 15);

// Provider component
export const ArticleWriterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Generate session ID and workflow ID once on initial render
  const [sessionId] = useState<string>(generateId());
  const [workflowId] = useState<string>(generateId());
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Form data for keyword research
  const [keywordForm, setKeywordForm] = useState<KeywordFormData>({
    keyword: '',
    country: 'US',
    language: 'en',
    contentType: 'Blog Post'
  });
  
  // Responses from webhooks
  const [keywordResponse, setKeywordResponse] = useState<KeywordResponse | null>(null);
  const [keywordSelectResponse, setKeywordSelectResponse] = useState<KeywordSelectResponse | null>(null);
  
  // Selected keywords
  const [selectedKeywords, setSelectedKeywords] = useState<SelectedKeyword[]>([]);
  
  // Title description state
  const [titleDescriptionOptions, setTitleDescriptionOptions] = useState<TitleDescription[]>([]);
  const [selectedTitleDescription, setSelectedTitleDescription] = useState<TitleDescription | null>(null);
  
  // Article outline state
  const [articleOutlineOptions, setArticleOutlineOptions] = useState<ArticleOutline[]>([]);
  const [selectedOutline, setSelectedOutline] = useState<ArticleOutline | null>(null);
  
  // Generated article state
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  
  // Update keyword form data
  const updateKeywordForm = (updates: Partial<KeywordFormData>) => {
    setKeywordForm(prev => ({ ...prev, ...updates }));
  };
  
  // Update selected keyword
  const updateSelectedKeyword = (keyword: string, isSelected: boolean) => {
    // Check if keyword already exists in the list
    const exists = selectedKeywords.some(k => k.keyword === keyword);
    
    if (exists) {
      // Update existing keyword
      setSelectedKeywords(prev =>
        prev.map(k =>
          k.keyword === keyword ? { ...k, isSelected } : k
        )
      );
    } else {
      // Add new keyword
      setSelectedKeywords(prev => [...prev, { keyword, isSelected }]);
    }
  };
  
  // Reset the article writer state
  const resetArticleWriter = () => {
    setCurrentStep(1);
    setKeywordForm({
      keyword: '',
      country: 'US',
      language: 'en',
      contentType: 'Blog Post'
    });
    setKeywordResponse(null);
    setKeywordSelectResponse(null);
    setSelectedKeywords([]);
    setTitleDescriptionOptions([]);
    setSelectedTitleDescription(null);
    setArticleOutlineOptions([]);
    setSelectedOutline(null);
    setGeneratedArticle(null);
  };
  
  // Alias for resetArticleWriter
  const resetWorkflow = resetArticleWriter;
  
  // Context value
  const value = {
    currentStep,
    sessionId,
    workflowId,
    keywordForm,
    keywordResponse,
    keywordSelectResponse,
    selectedKeywords,
    titleDescriptionOptions,
    setTitleDescriptionOptions,
    selectedTitleDescription,
    setSelectedTitleDescription,
    articleOutlineOptions,
    setArticleOutlineOptions,
    selectedOutline,
    setSelectedOutline,
    generatedArticle,
    setGeneratedArticle,
    setCurrentStep,
    updateKeywordForm,
    setKeywordResponse,
    setKeywordSelectResponse,
    updateSelectedKeyword,
    resetArticleWriter,
    resetWorkflow
  };
  
  return (
    <ArticleWriterContext.Provider value={value}>
      {children}
    </ArticleWriterContext.Provider>
  );
};

// Custom hook to use the article writer context
export const useArticleWriter = (): ArticleWriterContextType => {
  const context = useContext(ArticleWriterContext);
  
  if (context === undefined) {
    throw new Error('useArticleWriter must be used within an ArticleWriterProvider');
  }
  
  return context;
};
