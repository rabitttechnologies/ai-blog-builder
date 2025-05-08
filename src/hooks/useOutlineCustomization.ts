
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
  const [titleDescriptionData, setTitleDescriptionData] = useState<any>(null);
  
  // Update title description data when it changes in the keywordSelectResponse
  useEffect(() => {
    if (keywordSelectResponse && keywordSelectResponse?.executionId !== titleDescriptionData?.executionId) {
      console.log('Updating title description data from keyword select response');
      setTitleDescriptionData(keywordSelectResponse);
    }
  }, [keywordSelectResponse, titleDescriptionData]);

  // Enhanced initialize outlines function with improved error handling
  const initializeOutlines = useCallback(() => {
    console.log('Initializing outlines...');
    
    // Try to directly use title description data (if available) which should have the outlines
    if (titleDescriptionData?.articleoutline) {
      console.log('Found articleoutline in cached title description data');
      const parsedOutlines = formatOutlineOptions(titleDescriptionData);
      
      if (parsedOutlines && parsedOutlines.length > 0) {
        console.log('Setting outlines from cached title description data:', parsedOutlines);
        setOutlines(parsedOutlines);
        return;
      }
    }
    
    // If we get to this point, try to use the keyword select response directly
    if (keywordSelectResponse) {
      console.log('Trying to extract outlines from keyword select response:', keywordSelectResponse);
      
      // Special case: If keywordSelectResponse is a title description response (it has articleoutline)
      if (keywordSelectResponse?.articleoutline) {
        console.log('Found articleoutline directly in keyword select response');
        const parsedOutlines = formatOutlineOptions(keywordSelectResponse);
        
        if (parsedOutlines && parsedOutlines.length > 0) {
          console.log('Setting outlines from keyword select response:', parsedOutlines);
          setOutlines(parsedOutlines);
          return;
        }
      }
      
      // Debug message if no outlines found
      console.warn('No article outlines found in any response. Debug info:', {
        hasTitleDescriptionData: Boolean(titleDescriptionData),
        titleDescExecutionId: titleDescriptionData?.executionId,
        keywordSelectExecutionId: keywordSelectResponse?.executionId,
        hasArticleOutline: Boolean(keywordSelectResponse?.articleoutline),
      });
    } else {
      console.warn('No keyword select response available');
    }
  }, [keywordSelectResponse, titleDescriptionData]);

  // Initialize outlines when necessary data is available
  useEffect(() => {
    if (keywordSelectResponse || titleDescriptionData) {
      initializeOutlines();
    }
  }, [keywordSelectResponse, titleDescriptionData, initializeOutlines]);

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
      
      // Choose the best source for title/description
      const source = titleDescriptionData || keywordSelectResponse;
      
      // Handle case sensitivity differences in API response fields
      const titlesAndShortDescription = source.titlesandShortDescription || 
                                        source.titlesAndShortDescription || {};
      
      // Prepare payload
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
        headingsCount: source.numberofheadings || source.headingsCount || '7-8',
        writingStyle: source.writingstyle || source.writingStyle || 'professional',
        articlePointOfView: source.articlepointofview || source.articlePointOfView || 'reference',
        expertGuidance: source.expertGuidance || undefined,
        articleOutline: selectedOutline.content,
        editedArticlePrompt: selectedOutline.content, // Same as article outline initially
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
  }, [selectedOutline, keywordSelectResponse, titleDescriptionData, user, customization, toast, getSessionId]);

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
    titleDescriptionData,
    setTitleDescriptionData,
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
