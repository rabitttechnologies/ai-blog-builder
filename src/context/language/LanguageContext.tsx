
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' }
];

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  getLocalizedPath: (path: string) => string;
  getOriginalPath: (path: string) => string;
  isLanguageSupported: (content: any) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize from localStorage or default to browser language or 'en'
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) return savedLanguage;
    
    const browserLang = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang) ? browserLang : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  // Change the current language
  const setLanguage = (language: string) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === language)) {
      setCurrentLanguage(language);
    }
  };

  // Generate a localized path for the current language
  const getLocalizedPath = (path: string) => {
    // Don't modify paths that already have a language prefix
    if (SUPPORTED_LANGUAGES.some(lang => path.startsWith(`/${lang.code}/`))) {
      return path;
    }

    // Don't add prefix for default language (optional, based on SEO strategy)
    if (currentLanguage === 'en') {
      return path;
    }

    // Add language prefix for other languages
    // Remove any leading slash to avoid double slashes
    const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
    return `/${currentLanguage}/${pathWithoutLeadingSlash}`;
  };

  // Extract the original path without language prefix
  const getOriginalPath = (path: string) => {
    for (const lang of SUPPORTED_LANGUAGES) {
      if (path.startsWith(`/${lang.code}/`)) {
        return '/' + path.substring(`/${lang.code}/`.length);
      }
    }
    return path;
  };

  // Check if content is available in the current language
  const isLanguageSupported = (content: any) => {
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
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage, 
        getLocalizedPath, 
        getOriginalPath,
        isLanguageSupported
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
