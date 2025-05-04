
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  titlesandShortDescription?: TitleDescriptionOption[];
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

// New interface for title-description options from the webhook
export interface TitleDescriptionOption {
  title: string;
  description: string;
}

// Article outline section
export interface OutlineSection {
  heading: string;
  content: string;
}

// New interfaces for advanced title description form
export type HeadingCount = '4-5' | '6-7' | '7-8' | '8-9' | '9-10';
export type PointOfView = 'Writer' | 'Writer Immediate Reference' | 'Others';

export interface HeadingCountOption {
  value: HeadingCount;
  label: string;
  wordCount: string;
}

export interface WritingStyle {
  id: string;
  name: string;
  description: string;
}

export interface TitleDescriptionFormData {
  selectedTitle: TitleDescriptionOption | null;
  headingCount: HeadingCount;
  writingStyle: string;
  pointOfView: PointOfView;
  expertGuidance: string;
  saveWritingStyle: boolean;
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
  // New title description form data
  titleDescriptionFormData: TitleDescriptionFormData;
  updateTitleDescriptionFormData: (updates: Partial<TitleDescriptionFormData>) => void;
  // Saved writing styles
  savedWritingStyles: WritingStyle[];
  addSavedWritingStyle: (style: Omit<WritingStyle, 'id'>) => WritingStyle;
  // Article outline properties
  articleOutlineOptions: ArticleOutline[];
  setArticleOutlineOptions: (options: ArticleOutline[]) => void;
  selectedOutline: ArticleOutline | null;
  setSelectedOutline: (outline: ArticleOutline | null) => void;
  // Generated article properties
  generatedArticle: GeneratedArticle | null;
  setGeneratedArticle: (article: GeneratedArticle | null) => void;
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // Methods
  setCurrentStep: (step: number) => void;
  updateKeywordForm: (updates: Partial<KeywordFormData>) => void;
  setKeywordResponse: (response: KeywordResponse | null) => void;
  setKeywordSelectResponse: (response: KeywordSelectResponse | null) => void;
  updateSelectedKeyword: (keyword: string, isSelected: boolean) => void;
  resetArticleWriter: () => void;
  resetWorkflow: () => void; // Alias for resetArticleWriter
  // Webhook methods
  submitTitleDescriptionForm: () => Promise<any>;
}

// Create the context
const ArticleWriterContext = createContext<ArticleWriterContextType | undefined>(undefined);

// Generate a unique ID for session and workflow
const generateId = () => Math.random().toString(36).substring(2, 15);

// Default heading count options
export const headingCountOptions: HeadingCountOption[] = [
  { value: '4-5', label: '4-5 Headings', wordCount: '500-1000 words' },
  { value: '6-7', label: '6-7 Headings', wordCount: '1000-2000 words' },
  { value: '7-8', label: '7-8 Headings', wordCount: '2000-3000 words' },
  { value: '8-9', label: '8-9 Headings', wordCount: '3000-4000 words' },
  { value: '9-10', label: '9-10 Headings', wordCount: '4000-5000 words' },
];

// Default point of view options
export const pointOfViewOptions = [
  { value: 'Writer', label: 'Writer (I, We, Us, Our)' },
  { value: 'Writer Immediate Reference', label: 'Writer Immediate Reference (You, Your, Yours)' },
  { value: 'Others', label: 'Others (He, She, They)' },
];

// Get saved writing styles from localStorage
const getSavedWritingStyles = (): WritingStyle[] => {
  if (typeof window === 'undefined') return [];
  
  const storedStyles = localStorage.getItem('articleWriter_writingStyles');
  if (!storedStyles) return [];
  
  try {
    return JSON.parse(storedStyles);
  } catch (error) {
    console.error('Error parsing saved writing styles:', error);
    return [];
  }
};

// Save writing styles to localStorage
const saveWritingStylesToStorage = (styles: WritingStyle[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('articleWriter_writingStyles', JSON.stringify(styles));
};

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
  
  // New title description form data
  const [titleDescriptionFormData, setTitleDescriptionFormData] = useState<TitleDescriptionFormData>({
    selectedTitle: null,
    headingCount: '6-7',
    writingStyle: '',
    pointOfView: 'Writer',
    expertGuidance: '',
    saveWritingStyle: false,
  });
  
  // Saved writing styles
  const [savedWritingStyles, setSavedWritingStyles] = useState<WritingStyle[]>([]);
  
  // Article outline state
  const [articleOutlineOptions, setArticleOutlineOptions] = useState<ArticleOutline[]>([]);
  const [selectedOutline, setSelectedOutline] = useState<ArticleOutline | null>(null);
  
  // Generated article state
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load saved writing styles from localStorage on initial render
  useEffect(() => {
    setSavedWritingStyles(getSavedWritingStyles());
  }, []);
  
  // Update keyword form data
  const updateKeywordForm = (updates: Partial<KeywordFormData>) => {
    setKeywordForm(prev => ({ ...prev, ...updates }));
  };
  
  // Update title description form data
  const updateTitleDescriptionFormData = (updates: Partial<TitleDescriptionFormData>) => {
    setTitleDescriptionFormData(prev => ({ ...prev, ...updates }));
  };
  
  // Add a new saved writing style
  const addSavedWritingStyle = (style: Omit<WritingStyle, 'id'>): WritingStyle => {
    const newStyle: WritingStyle = {
      ...style,
      id: generateId(),
    };
    
    const updatedStyles = [...savedWritingStyles, newStyle];
    setSavedWritingStyles(updatedStyles);
    saveWritingStylesToStorage(updatedStyles);
    
    return newStyle;
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
  
  // Submit title description form to webhook
  const submitTitleDescriptionForm = async () => {
    if (!keywordSelectResponse) {
      throw new Error('No keyword selection data available');
    }
    
    setIsLoading(true);
    
    try {
      const payload = {
        workflowId,
        userId: keywordSelectResponse.userId,
        sessionId,
        originalKeyword: keywordSelectResponse.originalKeyword,
        country: keywordSelectResponse.country,
        language: keywordSelectResponse.language,
        typeOfContent: keywordSelectResponse.typeOfContent,
        mainKeyword: keywordSelectResponse.mainKeyword,
        additionalKeyword: keywordSelectResponse.additionalKeyword,
        references: keywordSelectResponse.references,
        researchType: keywordSelectResponse.researchType,
        titlesAndShortDescription: titleDescriptionFormData.selectedTitle ? [titleDescriptionFormData.selectedTitle] : [],
        headingCount: titleDescriptionFormData.headingCount,
        writingStyle: titleDescriptionFormData.writingStyle,
        pointOfView: titleDescriptionFormData.pointOfView,
        expertGuidance: titleDescriptionFormData.expertGuidance,
        additionalData: keywordSelectResponse.additionalData || {}
      };
      
      const response = await fetch('https://n8n.agiagentworld.com/webhook/titleandshortdescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If the writing style should be saved
      if (titleDescriptionFormData.saveWritingStyle && titleDescriptionFormData.writingStyle) {
        addSavedWritingStyle({
          name: `Style ${savedWritingStyles.length + 1}`,
          description: titleDescriptionFormData.writingStyle
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error submitting title description form:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
    setTitleDescriptionFormData({
      selectedTitle: null,
      headingCount: '6-7',
      writingStyle: '',
      pointOfView: 'Writer',
      expertGuidance: '',
      saveWritingStyle: false,
    });
    setArticleOutlineOptions([]);
    setSelectedOutline(null);
    setGeneratedArticle(null);
    setIsLoading(false);
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
    titleDescriptionFormData,
    updateTitleDescriptionFormData,
    savedWritingStyles,
    addSavedWritingStyle,
    articleOutlineOptions,
    setArticleOutlineOptions,
    selectedOutline,
    setSelectedOutline,
    generatedArticle,
    setGeneratedArticle,
    isLoading,
    setIsLoading,
    setCurrentStep,
    updateKeywordForm,
    setKeywordResponse,
    setKeywordSelectResponse,
    updateSelectedKeyword,
    resetArticleWriter,
    resetWorkflow,
    submitTitleDescriptionForm
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
