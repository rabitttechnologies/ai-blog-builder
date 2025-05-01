import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/auth';

// Define types for our article writer workflow
export type ContentType = 'Blog Post' | 'News Article' | 'How to Guide' | 'Comparison Blog' | 'Technical Article' | 'Product Reviews';

export interface KeywordFormData {
  keyword: string;
  country: string;
  language: string;
  contentType: ContentType;
}

export interface KeywordResponse {
  workflowId: string;
  userId: string;
  executionId: string;
  originalKeyword: string;
  country: string;
  language: string;
  contentType: ContentType;
  historicalSearchData?: any[];
  references?: any[];
  additionalData?: any;
}

export interface SelectedKeyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  isSelected: boolean;
}

export interface TitleDescription {
  id: string;
  title: string;
  description: string;
  isSelected?: boolean;
}

export interface OutlineSection {
  heading: string;
  content: string;
}

export interface ArticleOutline {
  id: string;
  title: string;
  introduction: string;
  sections: OutlineSection[];
  conclusion: string;
  isSelected?: boolean;
}

export interface GeneratedArticle {
  id: string;
  title: string;
  content: string;
  metaDescription: string;
  date: string;
}

interface ArticleWriterContextType {
  // Identifiers
  sessionId: string;
  workflowId: string;
  generateWorkflowId: () => string;
  
  // Step 1: Keyword Form
  keywordForm: KeywordFormData;
  updateKeywordForm: (data: Partial<KeywordFormData>) => void;
  keywordResponse: KeywordResponse | null;
  setKeywordResponse: (data: KeywordResponse | null) => void;
  
  // Step 2: Select Keywords
  selectedKeywords: SelectedKeyword[];
  updateSelectedKeyword: (keyword: string, isSelected: boolean) => void;
  
  // Step 3: Title & Description
  titleDescriptionOptions: TitleDescription[];
  setTitleDescriptionOptions: (options: TitleDescription[]) => void;
  selectedTitleDescription: TitleDescription | null;
  setSelectedTitleDescription: (option: TitleDescription | null) => void;
  
  // Step 4: Article Outline
  articleOutlineOptions: ArticleOutline[];
  setArticleOutlineOptions: (options: ArticleOutline[]) => void;
  selectedOutline: ArticleOutline | null;
  setSelectedOutline: (outline: ArticleOutline | null) => void;
  updateOutlineSection: (index: number, sectionData: Partial<OutlineSection>) => void;
  
  // Step 5: Generated Article
  generatedArticle: GeneratedArticle | null;
  setGeneratedArticle: (article: GeneratedArticle | null) => void;
  
  // Workflow state
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Reset
  resetWorkflow: () => void;
}

const ArticleWriterContext = createContext<ArticleWriterContextType | null>(null);

export const useArticleWriter = () => {
  const context = useContext(ArticleWriterContext);
  if (!context) {
    throw new Error('useArticleWriter must be used within an ArticleWriterProvider');
  }
  return context;
};

export const ArticleWriterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Identifiers
  const [sessionId] = useState(() => uuidv4());
  const [workflowId, setWorkflowId] = useState(() => uuidv4());
  
  // Step 1: Keyword Form
  const [keywordForm, setKeywordForm] = useState<KeywordFormData>({
    keyword: '',
    country: 'US',
    language: 'en',
    contentType: 'Blog Post',
  });
  const [keywordResponse, setKeywordResponse] = useState<KeywordResponse | null>(null);
  
  // Step 2: Select Keywords
  const [selectedKeywords, setSelectedKeywords] = useState<SelectedKeyword[]>([]);
  
  // Step 3: Title & Description
  const [titleDescriptionOptions, setTitleDescriptionOptions] = useState<TitleDescription[]>([]);
  const [selectedTitleDescription, setSelectedTitleDescription] = useState<TitleDescription | null>(null);
  
  // Step 4: Article Outline
  const [articleOutlineOptions, setArticleOutlineOptions] = useState<ArticleOutline[]>([]);
  const [selectedOutline, setSelectedOutline] = useState<ArticleOutline | null>(null);
  
  // Step 5: Generated Article
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  
  // Workflow state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateWorkflowId = useCallback(() => {
    const newWorkflowId = uuidv4();
    setWorkflowId(newWorkflowId);
    return newWorkflowId;
  }, []);
  
  const updateKeywordForm = useCallback((data: Partial<KeywordFormData>) => {
    setKeywordForm(prev => ({ ...prev, ...data }));
  }, []);
  
  const updateSelectedKeyword = useCallback((keyword: string, isSelected: boolean) => {
    setSelectedKeywords(prev => {
      const existingKeywordIndex = prev.findIndex(k => k.keyword === keyword);
      if (existingKeywordIndex !== -1) {
        // Update existing keyword
        const updatedKeywords = [...prev];
        updatedKeywords[existingKeywordIndex] = { 
          ...updatedKeywords[existingKeywordIndex], 
          isSelected 
        };
        return updatedKeywords;
      } else {
        // Add new keyword
        return [...prev, { keyword, isSelected }];
      }
    });
  }, []);
  
  const updateOutlineSection = useCallback((index: number, sectionData: Partial<OutlineSection>) => {
    if (!selectedOutline) return;
    
    setSelectedOutline(prev => {
      if (!prev) return null;
      
      const updatedSections = [...prev.sections];
      updatedSections[index] = { ...updatedSections[index], ...sectionData };
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
  }, [selectedOutline]);
  
  const resetWorkflow = useCallback(() => {
    // Keep session ID but generate new workflow ID
    setWorkflowId(uuidv4());
    setKeywordForm({
      keyword: '',
      country: 'US',
      language: 'en',
      contentType: 'Blog Post',
    });
    setKeywordResponse(null);
    setSelectedKeywords([]);
    setTitleDescriptionOptions([]);
    setSelectedTitleDescription(null);
    setArticleOutlineOptions([]);
    setSelectedOutline(null);
    setGeneratedArticle(null);
    setCurrentStep(1);
    setError(null);
  }, []);
  
  const value = useMemo(() => ({
    // Identifiers
    sessionId,
    workflowId,
    generateWorkflowId,
    
    // Step 1
    keywordForm,
    updateKeywordForm,
    keywordResponse,
    setKeywordResponse,
    
    // Step 2
    selectedKeywords,
    updateSelectedKeyword,
    
    // Step 3
    titleDescriptionOptions,
    setTitleDescriptionOptions,
    selectedTitleDescription,
    setSelectedTitleDescription,
    
    // Step 4
    articleOutlineOptions,
    setArticleOutlineOptions,
    selectedOutline,
    setSelectedOutline,
    updateOutlineSection,
    
    // Step 5
    generatedArticle,
    setGeneratedArticle,
    
    // Workflow state
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    error,
    setError,
    
    // Reset
    resetWorkflow,
  }), [
    sessionId,
    workflowId,
    generateWorkflowId,
    keywordForm,
    updateKeywordForm,
    keywordResponse,
    selectedKeywords,
    updateSelectedKeyword,
    titleDescriptionOptions,
    selectedTitleDescription,
    articleOutlineOptions,
    selectedOutline,
    updateOutlineSection,
    generatedArticle,
    currentStep,
    isLoading,
    error,
    resetWorkflow
  ]);
  
  return (
    <ArticleWriterContext.Provider value={value}>
      {children}
    </ArticleWriterContext.Provider>
  );
};
