import { KeywordSelectResponse } from '@/types/articleWriter';

/**
 * Safely gets title from a KeywordSelectResponse, handling different
 * possible structure variants
 */
export const getTitleFromResponse = (response?: KeywordSelectResponse | null, fallback: string = ''): string => {
  if (!response) return fallback;
  
  // Case 1: Direct title property
  if (response.title) return response.title;
  
  // Case 2: Title in titlesAndShortDescription object
  const titlesAndDesc = response.titlesAndShortDescription || response.titlesandShortDescription;
  
  if (titlesAndDesc) {
    // Handle if it's an object with title property
    if (typeof titlesAndDesc === 'object' && !Array.isArray(titlesAndDesc) && titlesAndDesc.title) {
      return titlesAndDesc.title;
    }
    
    // Handle if it's a string that needs to be parsed
    if (typeof titlesAndDesc === 'string') {
      try {
        const parsed = JSON.parse(titlesAndDesc);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
          return parsed[0].title;
        }
      } catch (error) {
        console.error('Error parsing titlesAndShortDescription string:', error);
      }
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
export const getDescriptionFromResponse = (response?: KeywordSelectResponse | null, fallback: string = ''): string => {
  if (!response) return fallback;
  
  // Check for direct description field
  if (typeof response.description === 'string') return response.description;
  
  // Case 2: Description in titlesAndShortDescription object
  const titlesAndDesc = response.titlesAndShortDescription || response.titlesandShortDescription;
  
  if (titlesAndDesc) {
    // Handle if it's an object with description property
    if (typeof titlesAndDesc === 'object' && !Array.isArray(titlesAndDesc) && titlesAndDesc.description) {
      return titlesAndDesc.description;
    }
    
    // Handle if it's a string that needs to be parsed
    if (typeof titlesAndDesc === 'string') {
      try {
        const parsed = JSON.parse(titlesAndDesc);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].description) {
          return parsed[0].description;
        }
      } catch (error) {
        console.error('Error parsing titlesAndShortDescription string:', error);
      }
    }
    
    // Handle if it's an array - return first item's description (with fallback)
    if (Array.isArray(titlesAndDesc) && titlesAndDesc.length > 0 && titlesAndDesc[0]?.description) {
      return titlesAndDesc[0].description;
    }
  }
  
  return fallback;
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
 * Safely parse a JSON string with error handling
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined, fallback: T): T => {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    return fallback;
  }
};

/**
 * Count words in HTML content, excluding HTML tags
 */
export const countWordsInHtml = (htmlContent: string | null | undefined): number => {
  if (!htmlContent) return 0;
  
  // Remove HTML tags
  const textOnly = htmlContent.replace(/<\/?[^>]+(>|$)/g, ' ');
  
  // Remove special characters and count words
  const words = textOnly
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
    
  return words.length;
};

/**
 * Extract meta description from markdown text
 */
export const extractMetaDescription = (metaText: string | null | undefined): string => {
  if (!metaText) return '';
  
  // Look for text after "## Meta Description" or similar headers
  const metaRegex = /##\s*Meta\s*Description\s*\n([\s\S]*?)(?:\n##|$)/i;
  const match = metaText.match(metaRegex);
  
  return match ? match[1].trim() : '';
};

/**
 * Get titles and descriptions array from response
 */
export const getTitlesAndDescriptions = (response?: any): Array<{title: string, description: string}> => {
  if (!response) return [];
  
  const titlesAndDesc = response.titlesAndShortDescription || response.titlesandShortDescription;
  
  if (!titlesAndDesc) return [];
  
  // Handle if it's already an array
  if (Array.isArray(titlesAndDesc)) {
    return titlesAndDesc;
  }
  
  // Handle if it's a string that needs to be parsed
  if (typeof titlesAndDesc === 'string') {
    try {
      return JSON.parse(titlesAndDesc);
    } catch (error) {
      console.error('Error parsing titlesAndShortDescription string:', error);
    }
  }
  
  // Handle if it's a single object
  if (typeof titlesAndDesc === 'object' && titlesAndDesc !== null) {
    if (titlesAndDesc.title && titlesAndDesc.description) {
      return [{ title: titlesAndDesc.title, description: titlesAndDesc.description }];
    }
  }
  
  return [];
};
