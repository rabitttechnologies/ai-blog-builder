
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

  // Enhanced initialize outlines function with better error handling and data normalization
  const initializeOutlines = useCallback(() => {
    if (!keywordSelectResponse) {
      console.log('No keyword select response available');
      return;
    }
    
    try {
      console.log('Initializing outlines from keyword select response:', keywordSelectResponse);
      
      // First, check if we have the latest response from the webhook
      // This will be in the current keywordSelectResponse object
      
      // Added extensive debugging
      if (keywordSelectResponse.articleoutline) {
        console.log('Found articleoutline directly in response:', keywordSelectResponse.articleoutline);
        
        if (Array.isArray(keywordSelectResponse.articleoutline) && keywordSelectResponse.articleoutline.length > 0) {
          console.log('Processing article outlines...', keywordSelectResponse.articleoutline);
          const parsedOutlines = formatOutlineOptions(keywordSelectResponse);
          
          if (parsedOutlines && parsedOutlines.length > 0) {
            console.log('Setting outlines from parsed outlines:', parsedOutlines);
            setOutlines(parsedOutlines);
            return;
          }
        }
      } else {
        // Try looking for article outlines in the executionId property
        if (keywordSelectResponse.executionId && keywordSelectResponse.articleoutline) {
          console.log('Found articleoutline in executionId data:', keywordSelectResponse.articleoutline);
          const parsedOutlines = formatOutlineOptions(keywordSelectResponse);
          
          if (parsedOutlines && parsedOutlines.length > 0) {
            console.log('Setting outlines from executionId data:', parsedOutlines);
            setOutlines(parsedOutlines);
            return;
          }
        }
      }
      
      // If we still don't have outlines, check if we're dealing with a nested response
      if (keywordSelectResponse.data && keywordSelectResponse.data.articleoutline) {
        console.log('Found articleoutline in nested data property:', keywordSelectResponse.data.articleoutline);
        const parsedOutlines = formatOutlineOptions(keywordSelectResponse.data);
        
        if (parsedOutlines && parsedOutlines.length > 0) {
          console.log('Setting outlines from nested data:', parsedOutlines);
          setOutlines(parsedOutlines);
          return;
        }
      }
      
      console.warn('No article outlines found in any response format. Adding debug info:', {
        hasArticleOutline: Boolean(keywordSelectResponse?.articleoutline),
        executionId: keywordSelectResponse?.executionId,
        hasNestedData: Boolean(keywordSelectResponse?.data),
      });
    } catch (error) {
      console.error('Error initializing outlines:', error);
      setError('Failed to parse outline options.');
    }
  }, [keywordSelectResponse]);

  // Monitor keywordSelectResponse changes to update outlines
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
      
      // Handle case sensitivity differences in API response fields
      const titlesAndShortDescription = keywordSelectResponse.titlesAndShortDescription || 
                                       keywordSelectResponse.titlesandShortDescription || {};
                                       
      // Prepare payload
      const payload: ArticleCustomizationPayload = {
        workflowId: keywordSelectResponse.workflowId || '',
        userId: user.id,
        sessionId: getSessionId(),
        originalKeyword: keywordSelectResponse.originalKeyword || '',
        country: keywordSelectResponse.country || 'US',
        language: keywordSelectResponse.language || 'en',
        typeOfContent: keywordSelectResponse.typeOfContent || 'Blog Post',
        mainKeyword: keywordSelectResponse.mainKeyword || '',
        additionalKeyword: keywordSelectResponse.additionalKeyword || [],
        references: keywordSelectResponse.references || [],
        researchType: keywordSelectResponse.researchType || 'AI Agent Search',
        titlesAndShortDescription: titlesAndShortDescription,
        headingsCount: keywordSelectResponse.numberofheadings || '7-8',
        writingStyle: keywordSelectResponse.writingstyle || 'professional',
        articlePointOfView: keywordSelectResponse.articlepointofview || 'reference',
        expertGuidance: keywordSelectResponse.expertGuidance || undefined,
        articleOutline: selectedOutline.content,
        editedArticlePrompt: selectedOutline.content, // Same as article outline initially
        generateHumanisedArticle: customization.generateHumanisedArticle || null,
        generateComparisonTable: customization.generateComparisonTable || null,
        includeExpertQuotes: customization.includeExpertQuotes || null,
        includeImagesInArticle: customization.includeImagesInArticle || null,
        imageType: customization.imageType,
        imageCount: customization.imageCount,
        includeInternalLinks: customization.includeInternalLinks || null,
        internalLinkCount: customization.internalLinkCount,
        internalLinks: customization.internalLinks,
        includeExternalLinks: customization.includeExternalLinks || null,
        externalLinkCount: customization.externalLinkCount,
        generateCoverImage: customization.generateCoverImage || null,
        coverImageType: customization.coverImageType,
        coverImageSize: customization.coverImageSize,
        includeCta: customization.includeCta || null,
        ctaText: customization.ctaText,
        generateFaqs: customization.generateFaqs || null,
        faqCount: customization.faqCount,
        includeGeneralGuidance: customization.includeGeneralGuidance || null,
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
  }, [selectedOutline, keywordSelectResponse, user, customization, toast, getSessionId]);

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
