
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLanguageFromPath, createLocalizedUrl, updateLanguageMeta } from '@/utils/languageUtils';
import { isRTLLanguage, getTextDirection } from '@/utils/rtlUtils';

// Safe storage functions to handle localStorage access issues
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }
};

// Update SUPPORTED_LANGUAGES with all new languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malaysian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'tr', name: 'Turkish' },
  { code: 'it', name: 'Italian' },
  { code: 'fa', name: 'Persian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pl', name: 'Polish' },
  { code: 'ko', name: 'Korean' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ur', name: 'Urdu' },
  { code: 'he', name: 'Hebrew' },
  { code: 'el', name: 'Greek' },
  { code: 'da', name: 'Danish' }
];

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  getLocalizedPath: (path: string) => string;
  getOriginalPath: (path: string) => string;
  isLanguageSupported: (content: any) => boolean;
  detectLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize from URL, localStorage, or browser language
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // First priority: check URL path for language code
    const pathLanguage = getLanguageFromPath(location.pathname);
    if (pathLanguage) return pathLanguage;
    
    // Second priority: check localStorage with safe access
    const savedLanguage = safeStorage.getItem('preferredLanguage');
    if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
      return savedLanguage;
    }
    
    // Third priority: check browser language
    try {
      const browserLang = navigator.language.split('-')[0];
      return SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang) ? browserLang : 'en';
    } catch (error) {
      console.error('Error accessing navigator.language:', error);
      return 'en'; // Default to English if all else fails
    }
  });

  // Update localStorage when language changes
  useEffect(() => {
    safeStorage.setItem('preferredLanguage', currentLanguage);
    updateLanguageMeta(currentLanguage);
  }, [currentLanguage]);

  // Sync URL with language when path changes
  useEffect(() => {
    const pathLanguage = getLanguageFromPath(location.pathname);
    
    // If URL has a language code that doesn't match current language, update current language
    if (pathLanguage && pathLanguage !== currentLanguage) {
      setCurrentLanguage(pathLanguage);
    }
    // If URL has no language code but we're not on English, update URL
    else if (!pathLanguage && currentLanguage !== 'en') {
      const newPath = createLocalizedUrl(location.pathname, currentLanguage);
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, currentLanguage, navigate]);

  // Change the current language and update URL
  const setLanguage = useCallback((language: string) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === language)) {
      const newPath = createLocalizedUrl(location.pathname, language);
      navigate(newPath);
      setCurrentLanguage(language);
    }
  }, [location.pathname, navigate]);

  // Generate a localized path for the current language
  const getLocalizedPath = useCallback((path: string) => {
    return createLocalizedUrl(path, currentLanguage);
  }, [currentLanguage]);

  // Extract the original path without language prefix
  const getOriginalPath = useCallback((path: string) => {
    for (const lang of SUPPORTED_LANGUAGES) {
      if (path.startsWith(`/${lang.code}/`)) {
        return '/' + path.substring(`/${lang.code}/`.length);
      }
    }
    return path;
  }, []);

  // Check if content is available in the current language
  const isLanguageSupported = useCallback((content: any) => {
    if (!content) return false;
    
    // If content is a simple object with language keys
    if (typeof content === 'object' && content[currentLanguage]) {
      return true;
    }
    
    // If content has a languages array property
    if (content.supportedLanguages && Array.isArray(content.supportedLanguages)) {
      return content.supportedLanguages.includes(currentLanguage);
    }
    
    // Default to true for content without explicit language support
    return true;
  }, [currentLanguage]);

  // Detect and set language based on browser settings
  const detectLanguage = useCallback(() => {
    try {
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang) 
        ? browserLang 
        : 'en';
      
      if (detectedLang !== currentLanguage) {
        setLanguage(detectedLang);
      }
    } catch (error) {
      console.error('Error detecting browser language:', error);
      // If we can't access navigator.language, don't change anything
    }
  }, [currentLanguage, setLanguage]);

  // Update meta tags and document direction
  useEffect(() => {
    try {
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = getTextDirection(currentLanguage);
      
      let metaLanguage = document.querySelector('meta[name="language"]');
      if (!metaLanguage) {
        metaLanguage = document.createElement('meta');
        metaLanguage.setAttribute('name', 'language');
        document.head.appendChild(metaLanguage);
      }
      metaLanguage.setAttribute('content', currentLanguage);
      
      let metaContentLanguage = document.querySelector('meta[http-equiv="content-language"]');
      if (!metaContentLanguage) {
        metaContentLanguage = document.createElement('meta');
        metaContentLanguage.setAttribute('http-equiv', 'content-language');
        document.head.appendChild(metaContentLanguage);
      }
      metaContentLanguage.setAttribute('content', currentLanguage);
    } catch (error) {
      console.error('Error updating DOM with language settings:', error);
    }
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage, 
        getLocalizedPath, 
        getOriginalPath,
        isLanguageSupported,
        detectLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
