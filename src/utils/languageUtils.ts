
import { SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';

/**
 * Get language code from URL path
 * @param path URL path
 * @returns language code if present, null otherwise
 */
export const getLanguageFromPath = (path: string): string | null => {
  if (!path.startsWith('/')) path = '/' + path;
  
  const pathParts = path.split('/').filter(Boolean);
  if (pathParts.length === 0) return null;
  
  const maybeLanguage = pathParts[0];
  return SUPPORTED_LANGUAGES.some(lang => lang.code === maybeLanguage) 
    ? maybeLanguage 
    : null;
};

/**
 * Create a URL with the specified language
 * @param path Base path
 * @param languageCode Language code
 * @returns URL with language code
 */
export const createLocalizedUrl = (path: string, languageCode: string): string => {
  // Remove any existing language code
  let cleanPath = path;
  const existingLanguage = getLanguageFromPath(path);
  
  if (existingLanguage) {
    cleanPath = '/' + path.split('/').filter(Boolean).slice(1).join('/');
  }
  
  // If it's the default language (English), don't add the prefix
  if (languageCode === 'en') {
    return cleanPath || '/';
  }
  
  // For other languages, add the language code
  return `/${languageCode}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
};

/**
 * Safely get translated content with fallback
 * @param content Object with language keys
 * @param language Target language
 * @param fallbackLanguage Fallback language
 * @returns Translated content
 */
export const getTranslatedContent = <T>(
  content: Record<string, T> | T, 
  language: string, 
  fallbackLanguage = 'en'
): T => {
  if (typeof content !== 'object' || content === null) {
    return content as T;
  }
  
  // Check if content has language keys
  if (language in (content as Record<string, T>)) {
    return (content as Record<string, T>)[language];
  }
  
  // Fall back to fallbackLanguage
  if (fallbackLanguage in (content as Record<string, T>)) {
    return (content as Record<string, T>)[fallbackLanguage];
  }
  
  // Last resort, return the content itself
  return content as T;
};

/**
 * Check if a text is likely in a right-to-left language
 * @param text Text to check
 * @returns true if RTL, false otherwise
 */
export const isRTL = (text: string): boolean => {
  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

/**
 * Format a date according to the locale
 * @param date Date to format
 * @param languageCode Language code
 * @returns Formatted date string
 */
export const formatLocalizedDate = (date: Date, languageCode: string): string => {
  try {
    return new Intl.DateTimeFormat(languageCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    // Fallback to basic ISO format
    return date.toISOString().split('T')[0];
  }
};
