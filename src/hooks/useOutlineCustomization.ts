
import { useState, useEffect } from 'react';
import { KeywordSelectResponse, TitleDescriptionResponse } from '@/types/articleWriter';
import { ArticleOutlineCustomization, ArticleCustomizationPayload, OutlineOption } from '@/types/outlineCustomize';

interface UseOutlineCustomizationProps {
  keywordSelectResponse?: KeywordSelectResponse | null;
  userId: string;
  workflowId: string;
  sessionId: string;
}

export const useOutlineCustomization = ({ 
  keywordSelectResponse,
  userId,
  workflowId,
  sessionId
}: UseOutlineCustomizationProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // The available outline options
  const [outlines, setOutlines] = useState<OutlineOption[]>([]);
  
  // A user-defined custom outline
  const [customOutline, setCustomOutline] = useState<OutlineOption>({
    id: 'custom',
    content: '',
    parsed: { headings: [] }
  });
  
  // The currently selected outline
  const [selectedOutline, setSelectedOutline] = useState<OutlineOption | null>(null);
  
  // Which outline is being edited, if any
  const [editingOutlineId, setEditingOutlineId] = useState<string>('');
  
  // All customization options for the article
  const [customizationOptions, setCustomizationOptions] = useState<ArticleOutlineCustomization>({
    generateHumanisedArticle: true,
    generateComparisonTable: false,
    includeExpertQuotes: true,
    includeImagesInArticle: false,
    imageType: 'Non-Copyright',
    imageCount: 3,
    includeInternalLinks: false,
    internalLinkCount: 3,
    includeExternalLinks: false,
    externalLinkCount: 3,
    generateCoverImage: false,
    coverImageType: 'Featured',
    coverImageSize: '1200x630',
    includeCta: false,
    ctaText: 'Learn more about our services',
    generateFaqs: true,
    faqCount: 3,
    includeGeneralGuidance: false,
    generalGuidance: ''
  });
  
  // Parse article outline from markdown to structured headings
  const parseOutline = (content: string): { headings: { level: number; title: string }[] } => {
    const headings: { level: number; title: string }[] = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();
        headings.push({ level, title });
      }
    });
    
    return { headings };
  };
  
  // Initialize outlines from keywordSelectResponse
  useEffect(() => {
    if (keywordSelectResponse) {
      const outlineData = keywordSelectResponse.articleoutline || keywordSelectResponse.articleOutline;
      
      if (outlineData && Array.isArray(outlineData)) {
        // Convert from API format to internal format
        const parsedOutlines: OutlineOption[] = outlineData.map((item, index) => {
          // Join all outline fields into a markdown-formatted string
          const keys = Object.keys(item).filter(key => key.startsWith('outline'));
          keys.sort(); // Sort to ensure correct order (outline1, outline2, etc.)
          
          const content = keys.map(key => {
            const value = item[key];
            if (value && typeof value === 'string') {
              return value;
            }
            return '';
          }).join('\n\n');
          
          // Return formatted outline
          return {
            id: `outline-${index}`,
            content,
            parsed: parseOutline(content)
          };
        });
        
        setOutlines(parsedOutlines);
        
        // Auto-select first outline if none selected
        if (parsedOutlines.length > 0 && !selectedOutline) {
          setSelectedOutline(parsedOutlines[0]);
        }
      }
    }
  }, [keywordSelectResponse]);
  
  // Update a customization option
  const updateCustomizationOption = (key: keyof ArticleOutlineCustomization, value: any) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Submit outline and customizations to generate article
  const submitOutlineAndCustomization = async () => {
    if (!selectedOutline) {
      throw new Error("Please select an outline before continuing");
    }
    
    if (!keywordSelectResponse) {
      throw new Error("Missing keyword data");
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare payload for customization webhook
      const payload: ArticleCustomizationPayload = {
        workflowId,
        userId,
        sessionId,
        originalKeyword: keywordSelectResponse.originalKeyword,
        country: keywordSelectResponse.country,
        language: keywordSelectResponse.language,
        typeOfContent: keywordSelectResponse.typeOfContent,
        mainKeyword: keywordSelectResponse.mainKeyword,
        additionalKeyword: keywordSelectResponse.additionalKeyword,
        references: keywordSelectResponse.references,
        researchType: keywordSelectResponse.researchType,
        titlesAndShortDescription: keywordSelectResponse.titlesAndShortDescription || 
                                  (keywordSelectResponse.titlesandShortDescription as any) || 
                                  { title: '', description: '' },
        headingsCount: keywordSelectResponse.headingsCount || '',
        writingStyle: keywordSelectResponse.writingStyle || '',
        articlePointOfView: keywordSelectResponse.articlePointOfView || 'writer',
        expertGuidance: keywordSelectResponse.expertGuidance,
        articleOutline: selectedOutline.content,
        editedArticlePrompt: keywordSelectResponse.promptforbody || '',
        Introduction: keywordSelectResponse.Introduction,
        key_takeaways: keywordSelectResponse.key_takeaways,
        // Customization options
        generateHumanisedArticle: customizationOptions.generateHumanisedArticle,
        generateComparisonTable: customizationOptions.generateComparisonTable,
        includeExpertQuotes: customizationOptions.includeExpertQuotes,
        includeImagesInArticle: customizationOptions.includeImagesInArticle,
        imageType: customizationOptions.imageType,
        imageCount: customizationOptions.imageCount,
        includeInternalLinks: customizationOptions.includeInternalLinks,
        internalLinkCount: customizationOptions.internalLinkCount,
        internalLinks: customizationOptions.internalLinks,
        includeExternalLinks: customizationOptions.includeExternalLinks,
        externalLinkCount: customizationOptions.externalLinkCount,
        generateCoverImage: customizationOptions.generateCoverImage,
        coverImageType: customizationOptions.coverImageType,
        coverImageSize: customizationOptions.coverImageSize,
        includeCta: customizationOptions.includeCta,
        ctaText: customizationOptions.ctaText,
        generateFaqs: customizationOptions.generateFaqs,
        faqCount: customizationOptions.faqCount,
        includeGeneralGuidance: customizationOptions.includeGeneralGuidance,
        generalGuidance: customizationOptions.generalGuidance,
        additionalData: keywordSelectResponse.additionalData
      };
      
      console.log('Submitting article customization:', payload);
      
      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2-minute timeout
      
      const response = await fetch('https://n8n.agiagentworld.com/webhook/articleoutlinecustomization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseText = await response.text();
      
      // Check if response is empty
      if (!responseText) {
        throw new Error("Server returned an empty response");
      }
      
      try {
        const responseData = JSON.parse(responseText);
        console.log("Article customization response:", responseData);
        return responseData;
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError, "Raw response:", responseText);
        throw new Error("Invalid response format from server");
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Failed to generate article: ${err.message}`);
      }
      console.error('Error generating article:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    outlines,
    customOutline,
    selectedOutline,
    editingOutlineId,
    customizationOptions,
    setOutlines,
    setCustomOutline,
    setSelectedOutline,
    setEditingOutlineId,
    updateCustomizationOption,
    submitOutlineAndCustomization,
    parseOutline
  };
};
