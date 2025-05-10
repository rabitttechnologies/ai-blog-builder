
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
  
  // Case 1: Check for description field (not excerpt)
  if (response.description) return response.description;
  
  // Case 2: Description in titlesAndShortDescription object
  const titlesAndDesc = response.titlesAndShortDescription || response.titlesandShortDescription;
  
  if (titlesAndDesc) {
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
