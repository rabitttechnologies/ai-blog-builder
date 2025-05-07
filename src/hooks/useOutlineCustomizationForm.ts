
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';

export interface OutlineCustomizationFormState {
  selectedOutlineId: string | null;
  customOutline: string;
  generateHumanisedArticle: boolean;
  generateComparisonTable: boolean;
  includeExpertQuotes: boolean;
  includeImagesInArticle: boolean;
  imageType: 'Copyright Image' | 'Non-Copyright' | null;
  imageCount: number;
  internalLinks: boolean;
  internalLinkCount: number;
  internalLinkUrls: string[];
  externalLinks: boolean;
  externalLinkCount: number;
  generateCoverImage: boolean;
  coverImageType: string;
  coverImageSize: string;
  includeCallToAction: boolean;
  callToActionText: string;
  generateFAQs: boolean;
  faqCount: number;
  generalGuidance: boolean;
  generalGuidanceText: string;
  savedGeneralGuidance: string[];
}

export const useOutlineCustomizationForm = () => {
  const { toast } = useToast();
  const { savedExpertGuidance } = useArticleWriter();
  
  const [formState, setFormState] = useState<OutlineCustomizationFormState>({
    selectedOutlineId: null,
    customOutline: '',
    generateHumanisedArticle: false,
    generateComparisonTable: false,
    includeExpertQuotes: false,
    includeImagesInArticle: false,
    imageType: null,
    imageCount: 1,
    internalLinks: false,
    internalLinkCount: 1,
    internalLinkUrls: [''],
    externalLinks: false,
    externalLinkCount: 1,
    generateCoverImage: false,
    coverImageType: '',
    coverImageSize: '',
    includeCallToAction: false,
    callToActionText: '',
    generateFAQs: false,
    faqCount: 1,
    generalGuidance: false,
    generalGuidanceText: '',
    savedGeneralGuidance: savedExpertGuidance || []
  });

  const updateField = <K extends keyof OutlineCustomizationFormState>(
    field: K,
    value: OutlineCustomizationFormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  // Update internal link URL at specific index
  const updateInternalLinkUrl = (index: number, url: string) => {
    const newUrls = [...formState.internalLinkUrls];
    newUrls[index] = url;
    setFormState(prev => ({
      ...prev,
      internalLinkUrls: newUrls
    }));
  };
  
  // Update internal link count and resize URLs array
  const updateInternalLinkCount = (count: number) => {
    // Ensure count is within bounds
    const safeCount = Math.min(Math.max(1, count), 30);
    
    // Resize the URLs array accordingly
    let newUrls = [...formState.internalLinkUrls];
    if (safeCount > newUrls.length) {
      // Add empty strings for new slots
      newUrls = [
        ...newUrls,
        ...Array(safeCount - newUrls.length).fill('')
      ];
    } else if (safeCount < newUrls.length) {
      // Truncate the array
      newUrls = newUrls.slice(0, safeCount);
    }
    
    setFormState(prev => ({
      ...prev,
      internalLinkCount: safeCount,
      internalLinkUrls: newUrls
    }));
  };
  
  // Validate the form before submission
  const validateForm = (): boolean => {
    if (!formState.selectedOutlineId && !formState.customOutline.trim()) {
      toast({
        title: "Outline Required",
        description: "Please select or create an outline for your article",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if internal links are enabled but URLs are empty
    if (formState.internalLinks && formState.internalLinkUrls.some(url => !url.trim())) {
      toast({
        title: "Internal Links",
        description: "Please provide URLs for all internal links",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if call to action is enabled but text is empty
    if (formState.includeCallToAction && !formState.callToActionText.trim()) {
      toast({
        title: "Call to Action Required",
        description: "Please provide text for your call to action",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if general guidance is enabled but text is empty
    if (formState.generalGuidance && !formState.generalGuidanceText.trim()) {
      toast({
        title: "General Guidance Required",
        description: "Please provide general guidance text",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  // Prepare payload for submission
  const preparePayload = (baseData: any): any => {
    // Extract the outline content to use
    const selectedOutlineContent = formState.selectedOutlineId === 'custom' 
      ? formState.customOutline 
      : baseData?.articleoutline?.find?.(
          (item: any, idx: number) => `outline-${idx + 1}` === formState.selectedOutlineId
        )?.[`outline${formState.selectedOutlineId.split('-')[1]}`] || '';
    
    return {
      // Base data from previous steps
      workflowId: baseData.workflowId,
      userId: baseData.userId,
      sessionId: baseData.sessionId,
      originalKeyword: baseData.originalKeyword,
      country: baseData.country,
      language: baseData.language,
      typeOfContent: baseData.typeOfContent,
      mainKeyword: baseData.mainKeyword,
      additionalKeyword: baseData.additionalKeyword || [],
      references: baseData.references || [],
      researchType: baseData.researchType || 'AI Agent Search',
      titlesAndShortDescription: baseData.titlesandShortDescription || {
        title: baseData.title,
        description: baseData.description
      },
      headingsCount: baseData.numberofheadings || '4-5',
      writingStyle: baseData.writingstyle || 'Professional',
      articlePointOfView: baseData.articlepointofview || 'writer',
      expertGuidance: baseData.expertGuidance || '',
      
      // Outline selection
      articleOutline: selectedOutlineContent,
      editedArticlePrompt: formState.customOutline,
      
      // Customization options
      generateHumanisedArticle: formState.generateHumanisedArticle ? "Generate Humanised Article" : null,
      generateComparisonTable: formState.generateComparisonTable ? "Generate Comparison Table" : null,
      includeExpertQuotes: formState.includeExpertQuotes ? "Include Expert Quotes" : null,
      
      // Image settings
      includeImagesInArticle: formState.includeImagesInArticle ? {
        type: formState.imageType,
        count: formState.imageCount
      } : null,
      
      // Link settings
      internalLinking: formState.internalLinks ? {
        count: formState.internalLinkCount,
        urls: formState.internalLinkUrls
      } : null,
      externalLinks: formState.externalLinks ? {
        count: formState.externalLinkCount
      } : null,
      
      // Cover image settings
      generateCoverImage: formState.generateCoverImage ? {
        type: formState.coverImageType,
        size: formState.coverImageSize
      } : null,
      
      // Call to action settings
      includeCallToAction: formState.includeCallToAction ? formState.callToActionText : null,
      
      // FAQ settings
      generateFAQs: formState.generateFAQs ? {
        count: formState.faqCount
      } : null,
      
      // General guidance settings
      generalGuidanceForWriting: formState.generalGuidance ? formState.generalGuidanceText : null,
      
      // Additional data passthrough
      additionalData: baseData.additionalData || {}
    };
  };

  return {
    formState,
    updateField,
    updateInternalLinkUrl,
    updateInternalLinkCount,
    validateForm,
    preparePayload
  };
};
