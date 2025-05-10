
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
 * Get article content from response
 */
export const getGeneratedArticleContent = (response?: any | null, fallback: string = ''): string => {
  if (!response) return fallback;
  
  // Try both possible field names for generated article content
  if (typeof response.generatedArticle === 'string') return response.generatedArticle;
  if (typeof response.GeneratedArticle === 'string') return response.GeneratedArticle;
  
  console.log('Article content not found in response, available keys:', Object.keys(response));
  return fallback;
};

/**
 * Get humanized article content from response
 */
export const getHumanizedArticleContent = (response?: any | null): string | null => {
  if (!response) return null;
  
  return typeof response.HumanizedGeneratedArticle === 'string' 
    ? response.HumanizedGeneratedArticle 
    : null;
};

/**
 * Extract meta description from meta tags field
 */
export const getMetaDescription = (response?: any | null, fallback: string = ''): string => {
  if (!response) return fallback;
  
  if (typeof response.metaTags === 'string') {
    // Simple extraction of content between the meta description tags
    // This is a basic implementation that assumes metaTags follows the format:
    // ## Meta Description\nContent here...
    const metaTags = response.metaTags;
    const lines = metaTags.split('\n');
    
    if (lines.length > 1) {
      return lines.slice(1).join('\n').trim();
    }
  }
  
  // Try to find meta description in other fields
  if (typeof response["Meta description"] === 'string') {
    return response["Meta description"];
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
