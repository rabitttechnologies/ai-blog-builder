
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

/**
 * Generate hreflang tags for SEO
 * @param baseUrl Base URL without language code
 * @param currentPath Current path without language code
 * @returns Array of objects with hreflang and href properties
 */
export const generateHrefLangTags = (baseUrl: string, currentPath: string): Array<{hrefLang: string, href: string}> => {
  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure currentPath starts with a slash
  const cleanPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  
  return SUPPORTED_LANGUAGES.map(lang => {
    const localizedPath = createLocalizedUrl(cleanPath, lang.code);
    return {
      hrefLang: lang.code,
      href: `${cleanBaseUrl}${localizedPath}`
    };
  });
};

/**
 * Add language meta tags to document head
 * @param language Current language code
 */
export const updateLanguageMeta = (language: string): void => {
  // Set the lang attribute on the html element
  document.documentElement.lang = language;
  
  // Update meta tags
  let metaLanguage = document.querySelector('meta[name="language"]');
  if (!metaLanguage) {
    metaLanguage = document.createElement('meta');
    metaLanguage.setAttribute('name', 'language');
    document.head.appendChild(metaLanguage);
  }
  metaLanguage.setAttribute('content', language);
  
  // Set the content-language HTTP header as a meta tag
  let metaContentLanguage = document.querySelector('meta[http-equiv="content-language"]');
  if (!metaContentLanguage) {
    metaContentLanguage = document.createElement('meta');
    metaContentLanguage.setAttribute('http-equiv', 'content-language');
    document.head.appendChild(metaContentLanguage);
  }
  metaContentLanguage.setAttribute('content', language);
};

/**
 * Calculate translation progress for multiple items
 * @param translationProgressMap Record mapping IDs to progress values
 * @returns Average progress (0-100)
 */
export const calculateOverallTranslationProgress = (
  translationProgressMap: Record<string, number>
): number => {
  const values = Object.values(translationProgressMap);
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};
