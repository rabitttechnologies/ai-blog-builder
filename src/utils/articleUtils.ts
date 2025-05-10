
/**
 * Safely gets title from a KeywordSelectResponse, handling different
 * possible structure variants
 */
export const getTitleFromResponse = (response?: any | null, fallback: string = ''): string => {
  if (!response) return fallback;
  
  // Case 1: Direct title property
  if (response.title) return response.title;
  
  // Case 2: Title in titlesAndShortDescription object
  const titlesAndDesc = response.titlesAndShortDescription || response.titlesandShortDescription;
  
  if (titlesAndDesc) {
    // Handle if it's a JSON string that needs parsing
    if (typeof titlesAndDesc === 'string') {
      try {
        const parsed = JSON.parse(titlesAndDesc);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
          return parsed[0].title;
        } else if (parsed && parsed.title) {
          return parsed.title;
        }
      } catch (e) {
        console.error('Failed to parse titlesAndShortDescription string:', e);
      }
    }
    
    // Handle if it's an object with title property
    if (typeof titlesAndDesc === 'object' && !Array.isArray(titlesAndDesc) && titlesAndDesc.title) {
      return titlesAndDesc.title;
    }
    
    // Handle if it's an array - return first item's title (with fallback)
    if (Array.isArray(titlesAndDesc) && titlesAndDesc.length > 0 && titlesAndDesc[0]?.title) {
      return titlesAndDesc[0].title;
    }
  }
  
  // Case 3: Fall back to mainKeyword as last resort
  return response.mainKeyword || fallback;
};

/**
 * Safely gets description from a KeywordSelectResponse, handling different
 * possible structure variants
 */
export const getDescriptionFromResponse = (response?: any | null, fallback: string = ''): string => {
  if (!response) return fallback;
  
  // Check for direct description field
  if (typeof response.description === 'string') return response.description;
  
  // Case 2: Description in titlesAndShortDescription object
  const titlesAndDesc = response.titlesAndShortDescription || response.titlesandShortDescription;
  
  if (titlesAndDesc) {
    // Handle if it's a JSON string that needs parsing
    if (typeof titlesAndDesc === 'string') {
      try {
        const parsed = JSON.parse(titlesAndDesc);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.description) {
          return parsed[0].description;
        } else if (parsed && parsed.description) {
          return parsed.description;
        }
      } catch (e) {
        console.error('Failed to parse titlesAndShortDescription string:', e);
      }
    }
    
    // Handle if it's an object with description property
    if (typeof titlesAndDesc === 'object' && !Array.isArray(titlesAndDesc) && titlesAndDesc.description) {
      return titlesAndDesc.description;
    }
    
    // Handle if it's an array - return first item's description (with fallback)
    if (Array.isArray(titlesAndDesc) && titlesAndDesc.length > 0 && titlesAndDesc[0]?.description) {
      return titlesAndDesc[0].description;
    }
  }
  
  return fallback;
};

/**
 * Remove AI thinking blocks from content - these are not meant for display
 */
export const cleanArticleContent = (content: string | null | undefined): string => {
  if (!content) return '';
  
  // First, clean up AI thinking blocks with the <think> tag
  let cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '');
  
  // Also handle alternative format where thinking is wrapped in backticks
  cleanedContent = cleanedContent.replace(/```[\s\S]*?```/g, '');
  
  // Handle cases where markdown code blocks might be present
  cleanedContent = cleanedContent.replace(/```[a-z]*\n[\s\S]*?\n```/g, '');
  
  // Handle abruptly ended content due to truncation
  if (cleanedContent.endsWith("'t wait to see")) {
    cleanedContent += " what you accomplish next!";
  } else if (cleanedContent.endsWith("'t wait")) {
    cleanedContent += " to see what you accomplish next!";
  }
  
  // Trim any excessive whitespace that may have been left
  return cleanedContent.trim();
};

/**
 * Get article content from response - enhanced to handle truncated/fragmented content
 */
export const getGeneratedArticleContent = (response?: any | null, fallback: string = ''): string => {
  if (!response) {
    console.log('No response provided to getGeneratedArticleContent');
    return fallback;
  }
  
  console.log('Attempting to extract generated article content from response fields:', Object.keys(response));
  
  // Try to extract from GeneratedArticle field with thinking blocks removed
  if (typeof response.GeneratedArticle === 'string' && response.GeneratedArticle.length > 20) {
    console.log('Found article content in GeneratedArticle field');
    return cleanArticleContent(response.GeneratedArticle);
  }
  
  // Try with lowercase variant
  if (typeof response.generatedArticle === 'string' && response.generatedArticle.length > 20) {
    console.log('Found article content in generatedArticle field');
    return cleanArticleContent(response.generatedArticle);
  }
  
  // First, check for complete article content in various naming conventions
  const directContentFields = ['generatedArticle', 'GeneratedArticle', 'generated_article', 'GENERATEDARTICLE', 'final_article'];
  for (const field of directContentFields) {
    if (typeof response[field] === 'string' && response[field].length > 20) {
      console.log(`Found article content in field: ${field}`);
      return cleanArticleContent(response[field]);
    }
  }
  
  // If we have a truncated GeneratedArticle field (as seen in logs), reconstruct it
  // This handles cases where the content might have been split or truncated
  const reconstructedContent = [];
  
  // Try to gather all possible content pieces
  if (typeof response.Introduction === 'string') {
    console.log('Adding Introduction to reconstructed content');
    reconstructedContent.push(response.Introduction);
  }
  
  // Try to extract outlines and any content sections
  if (response.articleOutline || response.articleoutline) {
    const outlines = response.articleOutline || response.articleoutline;
    console.log('Examining article outline for content sections');
    
    if (Array.isArray(outlines)) {
      outlines.forEach(outline => {
        if (outline && typeof outline === 'object') {
          Object.values(outline).forEach(value => {
            if (typeof value === 'string' && value.length > 50) {
              console.log('Adding outline section content');
              reconstructedContent.push(value);
            }
          });
        }
      });
    }
  }
  
  // If we have any content in key_takeaways, add it
  if (typeof response.key_takeaways === 'string') {
    console.log('Adding key_takeaways to reconstructed content');
    reconstructedContent.push(response.key_takeaways);
  }
  
  // If we found content to reconstruct
  if (reconstructedContent.length > 0) {
    console.log(`Reconstructed content from ${reconstructedContent.length} sections`);
    return cleanArticleContent(reconstructedContent.join('\n\n'));
  }
  
  // Look for any large text fields that might contain content
  console.log('Searching for any substantial text field as fallback');
  for (const key of Object.keys(response)) {
    if (typeof response[key] === 'string' && response[key].length > 100) {
      if (key.toLowerCase() !== 'humanizedgeneratedarticle' && key.toLowerCase() !== 'humanized_generated_article') {
        console.log(`Using content from field: ${key} as fallback`);
        return cleanArticleContent(response[key]);
      }
    }
  }
  
  console.warn('No suitable article content found in response');
  return fallback;
};

/**
 * Get humanized article content from response - enhanced version
 */
export const getHumanizedArticleContent = (response?: any | null): string | null => {
  if (!response) {
    console.log('No response provided to getHumanizedArticleContent');
    return null;
  }
  
  console.log('Searching for humanized content in fields:', Object.keys(response));
  
  // Check all possible field naming variations
  const humanizedFields = [
    'HumanizedGeneratedArticle', 
    'humanizedGeneratedArticle', 
    'humanized_generated_article',
    'humanizedgeneratedarticle'
  ];
  
  for (const field of humanizedFields) {
    if (typeof response[field] === 'string' && response[field].length > 20) {
      console.log(`Found humanized content in field: ${field}`);
      return cleanArticleContent(response[field]);
    }
  }
  
  // Look for any field that might contain humanized content
  for (const key of Object.keys(response)) {
    if (typeof response[key] === 'string' && 
        response[key].length > 100 && 
        key.toLowerCase().includes('humanized')) {
      console.log(`Found humanized content in field with 'humanized' in name: ${key}`);
      return cleanArticleContent(response[key]);
    }
  }
  
  console.log('No humanized content found in response');
  return null;
};

/**
 * Extract meta description from meta tags field
 */
export const getMetaDescription = (response?: any | null, fallback: string = ''): string => {
  if (!response) return fallback;
  
  // Direct field access for metaTags
  if (typeof response.metaTags === 'string') {
    // Simple extraction of content between the meta description tags
    const metaTags = response.metaTags;
    const metaDescription = metaTags.replace(/^## Meta Description\s+/i, '').trim();
    return metaDescription;
  }
  
  // Try alternative field names
  const metaDescriptionFields = ["Meta description", "meta_description", "metaDescription"];
  for (const field of metaDescriptionFields) {
    if (typeof response[field] === 'string') {
      return response[field];
    }
  }
  
  return fallback;
};

/**
 * Count words in a text string
 */
export const countWords = (text: string): number => {
  if (!text) return 0;
  
  // Remove HTML tags if any
  const plainText = text.replace(/<[^>]+>/g, ' ');
  
  // Count words by splitting on whitespace
  return plainText.trim().split(/\s+/).filter(Boolean).length;
};

/**
 * Debugging helper function to analyze the structure of webhook responses
 */
export const analyzeResponseStructure = (response: any): string => {
  if (!response) return 'Response is null or undefined';
  
  const structure: Record<string, string> = {};
  
  for (const key in response) {
    const value = response[key];
    if (value === null) {
      structure[key] = 'null';
    } else if (typeof value === 'undefined') {
      structure[key] = 'undefined';
    } else if (Array.isArray(value)) {
      structure[key] = `Array(${value.length})`;
    } else if (typeof value === 'object') {
      structure[key] = `Object with keys: ${Object.keys(value).join(', ')}`;
    } else {
      structure[key] = typeof value;
    }
  }
  
  return JSON.stringify(structure, null, 2);
};

/**
 * Parse titles and short descriptions from the API response
 */
export const parseTitlesAndDescriptions = (response?: any | null): { title: string, description: string }[] => {
  if (!response) return [];
  
  const titlesAndDesc = response.titlesAndShortDescription || response.titlesandShortDescription;
  
  if (!titlesAndDesc) return [];
  
  // Handle JSON string format
  if (typeof titlesAndDesc === 'string') {
    try {
      const parsed = JSON.parse(titlesAndDesc);
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          title: item.title || '',
          description: item.description || ''
        }));
      }
      return [{ title: parsed.title || '', description: parsed.description || '' }];
    } catch (e) {
      console.error('Failed to parse titlesAndShortDescription string:', e);
      return [];
    }
  }
  
  // Handle array format
  if (Array.isArray(titlesAndDesc)) {
    return titlesAndDesc.map(item => ({
      title: item.title || '',
      description: item.description || ''
    }));
  }
  
  // Handle object format
  if (typeof titlesAndDesc === 'object' && titlesAndDesc !== null) {
    return [{ 
      title: titlesAndDesc.title || '', 
      description: titlesAndDesc.description || '' 
    }];
  }
  
  return [];
};

/**
 * Format the keywords array for display
 */
export const formatKeywords = (keywords?: string[] | null): string => {
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) return '-';
  return keywords.join(', ');
};
