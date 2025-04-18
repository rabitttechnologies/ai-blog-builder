import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Type for content that can be translated
export interface TranslatableContent<T> {
  en: T; // English version (default)
  [key: string]: T | undefined; // Other language versions
}

export function useTranslation<T>(content: TranslatableContent<T> | T) {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [translatedContent, setTranslatedContent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  useEffect(() => {
    // If content is not an object with language keys, return it as is
    if (typeof content !== 'object' || content === null) {
      setTranslatedContent(content as T);
      return;
    }

    // Determine available languages
    if (typeof content === 'object' && content !== null) {
      const languages = Object.keys(content).filter(key => 
        // Only include keys that are actually language codes (e.g., 'en', 'fr', etc.)
        // and have valid content
        content[key] !== undefined && content[key] !== null
      );
      setAvailableLanguages(languages);
    }

    // If content has the current language key, use that
    if (
      'en' in content && 
      typeof content === 'object' && 
      currentLanguage in content
    ) {
      setTranslatedContent((content as TranslatableContent<T>)[currentLanguage] || (content as TranslatableContent<T>).en);
      return;
    }

    // Otherwise, use the content as is (assuming it's already in the right language)
    setTranslatedContent(content as T);
  }, [content, currentLanguage]);

  // Function to dynamically fetch translation if not available
  const fetchTranslation = async () => {
    // Skip if translation is already available
    if (
      typeof content === 'object' && 
      content !== null && 
      'en' in content && 
      currentLanguage in content
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we have an English source to translate from
      if (typeof content !== 'object' || !('en' in content)) {
        throw new Error('No English source content available for translation');
      }
      
      // Get the English content to translate
      const sourceContent = (content as TranslatableContent<T>).en;
      
      // Log the translation request
      console.log(`Requesting translation from en to ${currentLanguage}`, {
        sourceContent,
        currentLanguage
      });
      
      toast({
        title: "Requesting translation",
        description: `Translating content to ${currentLanguage}...`,
      });
      
      // In a real implementation, this would call a translation API via your backend
      // For demonstration, we'll simulate a successful translation after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful translation - in reality, this would come from your API
      const mockTranslation = sourceContent;
      
      // Update available languages
      setAvailableLanguages(prev => [...new Set([...prev, currentLanguage])]);
      
      // Update the translated content
      setTranslatedContent(mockTranslation as T);
      
      toast({
        title: "Translation complete",
        description: `Content has been translated to ${currentLanguage}`,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during translation';
      console.error('Translation error:', errorMessage);
      
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      toast({
        variant: "destructive",
        title: "Translation failed",
        description: errorMessage,
      });
      
      // Fallback to English
      setTranslatedContent(
        typeof content === 'object' && 'en' in content 
          ? (content as TranslatableContent<T>).en 
          : content as T
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    translatedContent, 
    isLoading, 
    error, 
    fetchTranslation,
    availableLanguages
  };
}
