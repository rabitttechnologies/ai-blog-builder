
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  ArticleOutlineCustomization, 
  OutlineOption, 
  ArticleCustomizationPayload,
  ArticleCustomizationResponse
} from '@/types/outlineCustomize';
import { 
  formatOutlineOptions, 
  parseArticleOutline, 
  saveGeneralGuidance, 
  submitOutlineCustomization 
} from '@/services/outlineCustomizeService';

export const useOutlineCustomization = (keywordSelectResponse: any) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outlines, setOutlines] = useState<OutlineOption[]>([]);
  const [customOutline, setCustomOutline] = useState<OutlineOption>({
    id: 'custom',
    content: '',
    parsed: { headings: [] }
  });
  const [selectedOutline, setSelectedOutline] = useState<OutlineOption | null>(null);
  const [editingOutlineId, setEditingOutlineId] = useState<string | null>(null);
  const [editedOutlineContent, setEditedOutlineContent] = useState<string>('');
  const [customization, setCustomization] = useState<ArticleOutlineCustomization>({
    generateHumanisedArticle: false,
    generateComparisonTable: false,
    includeExpertQuotes: false,
    includeImagesInArticle: false,
    includeInternalLinks: false,
    includeExternalLinks: false,
    generateCoverImage: false,
    includeCta: false,
    generateFaqs: false,
    includeGeneralGuidance: false
  });
  const [customizationResponse, setCustomizationResponse] = useState<ArticleCustomizationResponse | null>(null);
  
  // We need outlineOptions and selectedOutlineIndex for the UI
  const [outlineOptions, setOutlineOptions] = useState<OutlineOption[]>([]);
  const [selectedOutlineIndex, setSelectedOutlineIndex] = useState<number | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<ArticleOutlineCustomization>({
    generateHumanisedArticle: false,
    generateComparisonTable: false,
    includeExpertQuotes: false,
    includeImagesInArticle: false,
    includeInternalLinks: false,
    includeExternalLinks: false,
    generateCoverImage: false,
    includeCta: false,
    generateFaqs: false,
    includeGeneralGuidance: false
  });
  
  // Add state for the additional fields
  const [promptForBody, setPromptForBody] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [keyTakeaways, setKeyTakeaways] = useState<string>('');
  
  // Debug logging function
  const logDebug = (prefix: string, obj: any) => {
    console.log(`${prefix}:`, obj);
  };
  
  // Initialize outlines from the keyword select response
  // This is the main function that extracts article outlines from the response
  const initializeOutlines = useCallback(() => {
    console.log('Initializing outlines...');
    
    if (keywordSelectResponse) {
      logDebug('Processing keywordSelectResponse', keywordSelectResponse);
      
      // Check if the response has articleoutline data
      if (keywordSelectResponse.articleoutline || keywordSelectResponse.articleOutline) {
        const parsedOutlines = formatOutlineOptions(keywordSelectResponse);
        
        if (parsedOutlines && parsedOutlines.length > 0) {
          console.log('Setting outlines from keywordSelectResponse:', parsedOutlines);
          setOutlines(parsedOutlines);
          setOutlineOptions(parsedOutlines);
          
          // Store the additional fields if they exist
          if (keywordSelectResponse.promptforbody) {
            setPromptForBody(keywordSelectResponse.promptforbody);
            console.log('Found promptforbody:', keywordSelectResponse.promptforbody);
          }
          
          if (keywordSelectResponse.Introduction) {
            setIntroduction(keywordSelectResponse.Introduction);
            console.log('Found Introduction:', keywordSelectResponse.Introduction);
          }
          
          if (keywordSelectResponse.key_takeaways) {
            setKeyTakeaways(keywordSelectResponse.key_takeaways);
            console.log('Found key_takeaways:', keywordSelectResponse.key_takeaways);
          }
          
          return;
        }
      } else {
        console.warn('No articleoutline found in keywordSelectResponse:', {
          hasArticleoutline: !!keywordSelectResponse.articleoutline,
          hasArticleOutline: !!keywordSelectResponse.articleOutline,
          executionId: keywordSelectResponse.executionId
        });
      }
    } else {
      console.warn('No keywordSelectResponse available');
    }
  }, [keywordSelectResponse]);

  // Initialize outlines when keywordSelectResponse is available
  useEffect(() => {
    if (keywordSelectResponse) {
      initializeOutlines();
    }
  }, [keywordSelectResponse, initializeOutlines]);

  // Start editing an outline
  const startEditingOutline = (outline: OutlineOption) => {
    setEditingOutlineId(outline.id);
    setEditedOutlineContent(outline.content);
  };

  // Cancel outline editing
  const cancelEditingOutline = () => {
    setEditingOutlineId(null);
    setEditedOutlineContent('');
  };

  // Update edited outline content
  const updateEditedOutlineContent = (content: string) => {
    setEditedOutlineContent(content);
  };

  // Save edited outline
  const saveEditedOutline = (outlineId: string) => {
    if (outlineId === 'custom') {
      const parsedOutline = parseArticleOutline(editedOutlineContent);
      setCustomOutline({
        id: 'custom',
        content: editedOutlineContent,
        parsed: parsedOutline
      });
      setSelectedOutline({
        id: 'custom',
        content: editedOutlineContent,
        parsed: parsedOutline
      });
    } else {
      const updatedOutlines = outlines.map(outline => {
        if (outline.id === outlineId) {
          const parsedOutline = parseArticleOutline(editedOutlineContent);
          return {
            ...outline,
            content: editedOutlineContent,
            parsed: parsedOutline
          };
        }
        return outline;
      });
      
      setOutlines(updatedOutlines);
      setOutlineOptions(updatedOutlines);
      
      const selectedOutline = updatedOutlines.find(o => o.id === outlineId) || null;
      setSelectedOutline(selectedOutline);
    }
    
    setEditingOutlineId(null);
    setEditedOutlineContent('');
  };

  // Select an outline
  const selectOutline = (outline: OutlineOption) => {
    if (editingOutlineId === outline.id) {
      saveEditedOutline(outline.id);
    } else {
      setSelectedOutline(outline);
    }
  };

  // Update customization options
  const updateCustomization = (field: keyof ArticleOutlineCustomization, value: any) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
    setCustomizationOptions(prev => ({ ...prev, [field]: value }));
  };
  
  // Convenience function for the component
  const updateCustomizationOption = (field: keyof ArticleOutlineCustomization, value: any) => {
    updateCustomization(field, value);
  };

  // Get session ID for request tracking
  const getSessionId = useCallback(() => {
    return session?.access_token?.substring(0, 16) || 'anonymous-session';
  }, [session]);

  // Submit outline and customization
  const submitOutlineAndCustomization = useCallback(async () => {
    if (!selectedOutline || !keywordSelectResponse || !user?.id) {
      toast({
        title: "Missing Data",
        description: "Please select an outline and ensure all required data is available.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Save general guidance if option is selected and not empty
      if (customization.includeGeneralGuidance && customization.generalGuidance) {
        saveGeneralGuidance(customization.generalGuidance);
      }
      
      // Choose the source for title/description
      const source = keywordSelectResponse;
      
      // Handle case sensitivity differences in API response fields
      const titlesAndShortDescription = source.titlesAndShortDescription || source.titlesandShortDescription || {};
      
      // Prepare payload with the new fields
      const payload: ArticleCustomizationPayload = {
        workflowId: source.workflowId || '',
        userId: user.id,
        sessionId: getSessionId(),
        originalKeyword: source.originalKeyword || '',
        country: source.country || 'US',
        language: source.language || 'en',
        typeOfContent: source.typeOfContent || 'Blog Post',
        mainKeyword: source.mainKeyword || '',
        additionalKeyword: source.additionalKeyword || [],
        references: source.references || [],
        researchType: source.researchType || 'AI Agent Search',
        titlesAndShortDescription: titlesAndShortDescription,
        headingsCount: source.headingsCount || source.numberofheadings || '7-8',
        writingStyle: source.writingStyle || source.writingstyle || 'professional',
        articlePointOfView: source.articlePointOfView || source.articlepointofview || 'reference',
        expertGuidance: source.expertGuidance || undefined,
        articleOutline: selectedOutline.content,
        editedArticlePrompt: promptForBody || selectedOutline.content, // Use promptforbody if available
        Introduction: introduction || undefined, // Add Introduction field
        key_takeaways: keyTakeaways || undefined, // Add key_takeaways field
        generateHumanisedArticle: customization.generateHumanisedArticle || false,
        generateComparisonTable: customization.generateComparisonTable || false,
        includeExpertQuotes: customization.includeExpertQuotes || false,
        includeImagesInArticle: customization.includeImagesInArticle || false,
        imageType: customization.imageType,
        imageCount: customization.imageCount,
        includeInternalLinks: customization.includeInternalLinks || false,
        internalLinkCount: customization.internalLinkCount,
        internalLinks: customization.internalLinks,
        includeExternalLinks: customization.includeExternalLinks || false,
        externalLinkCount: customization.externalLinkCount,
        generateCoverImage: customization.generateCoverImage || false,
        coverImageType: customization.coverImageType,
        coverImageSize: customization.coverImageSize,
        includeCta: customization.includeCta || false,
        ctaText: customization.ctaText,
        generateFaqs: customization.generateFaqs || false,
        faqCount: customization.faqCount,
        includeGeneralGuidance: customization.includeGeneralGuidance || false,
        generalGuidance: customization.generalGuidance,
        additionalData: {}
      };
      
      console.log('Submitting outline and customization:', payload);
      
      // Submit to webhook
      const response = await submitOutlineCustomization(payload);
      setCustomizationResponse(response);
      
      toast({
        title: "Success",
        description: "Outline and customization options submitted successfully.",
      });
      
      return response;
    } catch (error: any) {
      console.error('Error submitting outline and customization:', error);
      setError(error.message || 'Failed to submit outline and customization');
      
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting your outline and customization.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [
    selectedOutline, 
    keywordSelectResponse, 
    user, 
    customization, 
    toast, 
    getSessionId, 
    promptForBody, 
    introduction, 
    keyTakeaways
  ]);
  
  // Convenience functions for the component
  const submitOutlineAndCustomizations = submitOutlineAndCustomization;
  
  // Added parseOutline function for components to use
  const parseOutline = parseArticleOutline;

  return {
    loading,
    error,
    outlines,
    customOutline,
    selectedOutline,
    editingOutlineId,
    editedOutlineContent,
    customization,
    customizationResponse,
    promptForBody,
    introduction,
    keyTakeaways,
    // Added these for the component to use
    outlineOptions,
    selectedOutlineIndex,
    customizationOptions,
    setSelectedOutlineIndex,
    updateCustomizationOption,
    submitOutlineAndCustomizations,
    parseOutline,
    // Original functions
    initializeOutlines,
    startEditingOutline,
    cancelEditingOutline,
    updateEditedOutlineContent,
    saveEditedOutline,
    selectOutline,
    updateCustomization,
    submitOutlineAndCustomization
  };
};
