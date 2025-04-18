
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import TranslationControl from './TranslationControl';
import SearchResultsContent from './SearchResultsContent';
import { searchResultsTranslations } from '@/translations/searchResults';

interface SearchResultsDisplayProps {
  data: any;
  onClose: () => void;
  onLanguageChange?: (language: string) => void;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ 
  data, 
  onClose,
  onLanguageChange 
}) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  if (!data) return null;
  
  const translations = searchResultsTranslations[currentLanguage as keyof typeof searchResultsTranslations] || 
                      searchResultsTranslations.en;

  const handleLanguageSwitch = (newLang: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      toast({
        title: "Language Change Not Available",
        description: "This content is not available in the selected language yet.",
        variant: "destructive"
      });
    }
  };

  const showTranslationControls = currentLanguage !== 'en' && !onLanguageChange;
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">
          {translations.resultsTitle}: <span className="text-primary">{data.keyword}</span>
        </h3>
        <Button variant="ghost" onClick={onClose}>{translations.closeButton}</Button>
      </div>
      
      <TranslationControl 
        showControls={showTranslationControls}
        currentLanguage={currentLanguage}
        entityId={data.id || ''}
      />
      
      <Separator />
      
      <SearchResultsContent 
        data={data}
        language={currentLanguage}
        onLanguageChange={handleLanguageSwitch}
      />
      
      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={onClose}>{translations.closeResultsButton}</Button>
      </div>
    </div>
  );
};

export default SearchResultsDisplay;
