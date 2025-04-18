
import React from 'react';
import { isValidData } from '@/utils/dataValidation';
import SearchResultSection from './SearchResultSection';
import KeywordListSection from './KeywordListSection';
import { useLanguage } from '@/context/language/LanguageContext';
import { searchResultsTranslations } from '@/translations/searchResults';

interface SearchResultsContentProps {
  data: any;
  language: string;
  onLanguageChange: (language: string) => void;
}

const SearchResultsContent: React.FC<SearchResultsContentProps> = ({
  data,
  language,
  onLanguageChange
}) => {
  const { currentLanguage } = useLanguage();
  const translations = searchResultsTranslations[currentLanguage as keyof typeof searchResultsTranslations] || 
                      searchResultsTranslations.en;

  return (
    <>
      {isValidData(data.organicResults, 'array') && (
        <SearchResultSection
          title={translations.organicResultsTitle}
          description={translations.organicResultsDesc}
          items={data.organicResults}
          type="link"
          language={language}
          onLanguageChange={onLanguageChange}
        />
      )}
      
      {isValidData(data.peopleAlsoAsk, 'array') && (
        <SearchResultSection
          title={translations.peopleAlsoAskTitle}
          description={translations.peopleAlsoAskDesc}
          items={data.peopleAlsoAsk}
          language={language}
        />
      )}
      
      {isValidData(data.relatedQueries, 'array') && (
        <KeywordListSection
          title={translations.relatedQueriesTitle}
          description={translations.relatedQueriesDesc}
          keywords={data.relatedQueries}
          language={language}
        />
      )}
      
      {isValidData(data.paidResults, 'array') && (
        <SearchResultSection
          title={translations.paidResultsTitle}
          description={translations.paidResultsDesc}
          items={data.paidResults}
          language={language}
        />
      )}
      
      {isValidData(data.suggestedResults, 'array') && (
        <KeywordListSection
          title={translations.suggestedResultsTitle}
          description={translations.suggestedResultsDesc}
          keywords={data.suggestedResults}
          language={language}
        />
      )}
    </>
  );
};

export default SearchResultsContent;
