
import { useState, useEffect } from 'react';
import { KeywordSelectResponse } from '@/types/articleWriter';
import { ArticleOutlineCustomization, ArticleCustomizationPayload, OutlineOption } from '@/types/outlineCustomize';
import { corsHeaders } from '@/utils/corsUtils';

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
  
  // The currently selected outline and its index
  const [selectedOutline, setSelectedOutline] = useState<OutlineOption | null>(null);
  const [selectedOutlineIndex, setSelectedOutlineIndex] = useState<number | null>(null);
  
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
    if (!content) {
      return { headings: [] };
    }
    
    // Handle escaped newlines by replacing them with actual newlines
    const normalizedContent = content
      .replace(/\\\\n/g, '\n')
      .replace(/\\n/g, '\n');
    
    const headings: { level: number; title: string }[] = [];
    const lines = normalizedContent.split('\n');
    
    lines.forEach(line => {
      // Match markdown heading syntax (# Heading)
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();
        headings.push({ level, title });
      }
    });
    
    return { headings };
  };
  
  // Debug helper function
  const debugStructure = (obj: any): string => {
    try {
      const basicInfo = {
        type: typeof obj,
        isArray: Array.isArray(obj),
        keys: obj ? (typeof obj === 'object' ? Object.keys(obj) : 'not an object') : 'null/undefined'
      };
      return JSON.stringify(basicInfo, null, 2);
    } catch (error) {
      return `Error analyzing object: ${error}`;
    }
  };
  
  // Initialize outlines from keywordSelectResponse
  useEffect(() => {
    if (keywordSelectResponse) {
      console.log("useOutlineCustomization - Processing keywordSelectResponse:", keywordSelectResponse);

      // Check both possible casing variants of the articleoutline field
      let outlineData = keywordSelectResponse.articleoutline;
      
      if (!outlineData && keywordSelectResponse.articleOutline) {
        outlineData = keywordSelectResponse.articleOutline;
        console.log("useOutlineCustomization - Found articleOutline (uppercase variant)");
      }
      
      console.log("useOutlineCustomization - Processing outline data:", outlineData);
      console.log("Data structure:", debugStructure(outlineData));
      
      if (outlineData && Array.isArray(outlineData)) {
        try {
          // Convert from API format to internal format
          const parsedOutlines: OutlineOption[] = [];
          
          outlineData.forEach((item, index) => {
            // Check for outline1 field
            if (item && typeof item.outline1 === 'string') {
              parsedOutlines.push({
                id: `outline-${index}-1`,
                content: item.outline1.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n'),
                parsed: parseOutline(item.outline1)
              });
            }
            
            // Check for outline2 field
            if (item && typeof item.outline2 === 'string') {
              parsedOutlines.push({
                id: `outline-${index}-2`,
                content: item.outline2.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n'),
                parsed: parseOutline(item.outline2)
              });
            }
            
            // Check for any other outline keys
            if (item) {
              Object.keys(item).forEach(key => {
                if (key.startsWith('outline') && 
                    key !== 'outline1' && 
                    key !== 'outline2' && 
                    typeof item[key] === 'string') {
                  const outlineNumber = key.replace('outline', '');
                  parsedOutlines.push({
                    id: `outline-${index}-${outlineNumber}`,
                    content: item[key].replace(/\\\\n/g, '\n').replace(/\\n/g, '\n'),
                    parsed: parseOutline(item[key])
                  });
                }
              });
            }
          });
          
          console.log("useOutlineCustomization - Parsed outlines:", parsedOutlines);
          setOutlines(parsedOutlines);
          
          // Auto-select first outline if none selected
          if (parsedOutlines.length > 0 && selectedOutlineIndex === null) {
            setSelectedOutline(parsedOutlines[0]);
            setSelectedOutlineIndex(0);
          }
        } catch (parseError) {
          console.error("Error parsing outlines:", parseError);
          setError(`Failed to parse outlines: ${parseError.message}`);
        }
      } else {
        console.warn("useOutlineCustomization - No valid outline data found");
      }
    }
  }, [keywordSelectResponse, selectedOutlineIndex]);
  
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
        typeOfContent: keywordSelectResponse.typeOfContent || '',
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
        expertGuidance: keywordSelectResponse.expertGuidance || undefined,
        articleOutline: selectedOutline.content,
        editedArticlePrompt: keywordSelectResponse.promptforbody || '',
        Introduction: keywordSelectResponse.Introduction || '',
        key_takeaways: keywordSelectResponse.key_takeaways || '',
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
      
      // Use our utility for CORS-friendly API requests
      const response = await fetch('https://n8n.agiagentworld.com/webhook/articleoutlinecustomization', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...corsHeaders
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit' // Avoid sending cookies
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
      } else if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
        setError('Network error: CORS policy restriction. Try again later or contact support.');
        console.error('CORS error:', err);
      } else {
        setError(`Failed to generate article: ${err.message}`);
      }
      console.error('Error generating article:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Alias for the submit function to match expected name in OutlineStep
  const submitOutlineAndCustomizations = submitOutlineAndCustomization;
  
  // We're using outlines array and expose it as outlineOptions to match the naming expected in OutlineStep
  const outlineOptions = outlines;
  
  return {
    loading,
    error,
    outlines,
    customOutline,
    selectedOutline,
    editingOutlineId,
    customizationOptions,
    // Properties to match what OutlineStep expects
    outlineOptions: outlines,
    selectedOutlineIndex,
    setSelectedOutlineIndex,
    setOutlines,
    setCustomOutline,
    setSelectedOutline,
    setEditingOutlineId,
    updateCustomizationOption,
    submitOutlineAndCustomization,
    submitOutlineAndCustomizations: submitOutlineAndCustomization,
    parseOutline
  };
};
