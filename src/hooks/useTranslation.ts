import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language/LanguageContext';

// Type for content that can be translated
export interface TranslatableContent<T> {
  en: T; // English version (default)
  [key: string]: T | undefined; // Other language versions
}

export function useTranslation<T>(content: TranslatableContent<T> | T) {
  const { currentLanguage } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If content is not an object with language keys, return it as is
    if (typeof content !== 'object' || content === null) {
      setTranslatedContent(content as T);
      return;
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
      
      // In a real implementation, this would call a translation API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This is where you would call your translation API
      // const response = await fetch('your-translation-api-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     text: typeof content === 'object' ? (content as TranslatableContent<T>).en : content,
      //     targetLanguage: currentLanguage,
      //     sourceLanguage: 'en'
      //   })
      // });
      // 
      // if (!response.ok) throw new Error('Translation failed');
      // const translatedText = await response.json();
      // setTranslatedContent(translatedText as T);
      
      // For now, just return the original content
      setTranslatedContent(
        typeof content === 'object' && 'en' in content 
          ? (content as TranslatableContent<T>).en 
          : content as T
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
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
    fetchTranslation 
  };
}
