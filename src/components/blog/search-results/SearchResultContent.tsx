
import React from 'react';
import { isValidData } from '@/utils/dataValidation';
import { useLanguage } from '@/context/language/LanguageContext';
import { searchResultsTranslations } from '@/translations/searchResults';
import SearchResultSection from './SearchResultSection';
import KeywordListSection from './KeywordListSection';

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

  const sections = [
    {
      key: 'organicResults',
      type: 'link',
      title: translations.organicResultsTitle,
      description: translations.organicResultsDesc
    },
    {
      key: 'peopleAlsoAsk',
      type: 'content',
      title: translations.peopleAlsoAskTitle,
      description: translations.peopleAlsoAskDesc
    },
    {
      key: 'relatedQueries',
      type: 'keyword',
      title: translations.relatedQueriesTitle,
      description: translations.relatedQueriesDesc
    },
    {
      key: 'paidResults',
      type: 'link',
      title: translations.paidResultsTitle,
      description: translations.paidResultsDesc
    },
    {
      key: 'suggestedResults',
      type: 'keyword',
      title: translations.suggestedResultsTitle,
      description: translations.suggestedResultsDesc
    }
  ];

  return (
    <>
      {sections.map(section => {
        if (!isValidData(data[section.key], 'array')) return null;

        return section.type === 'keyword' ? (
          <KeywordListSection
            key={section.key}
            title={section.title}
            description={section.description}
            keywords={data[section.key]}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        ) : (
          <SearchResultSection
            key={section.key}
            title={section.title}
            description={section.description}
            items={data[section.key]}
            type={section.type}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        );
      })}
    </>
  );
};

export default SearchResultsContent;
