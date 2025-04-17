
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { isValidData } from '@/utils/dataValidation';
import SearchResultSection from './SearchResultSection';
import KeywordListSection from './KeywordListSection';
import { useLanguage } from '@/context/language/LanguageContext';

const searchResultsTranslations = {
  en: {
    resultsTitle: "Search Results",
    closeButton: "Close",
    organicResultsTitle: "Organic Results",
    organicResultsDesc: "Top search results for your keyword",
    peopleAlsoAskTitle: "People Also Ask",
    peopleAlsoAskDesc: "Related questions from users",
    relatedQueriesTitle: "Related Queries",
    relatedQueriesDesc: "Similar searches users perform",
    paidResultsTitle: "Paid Results",
    paidResultsDesc: "Sponsored content related to your search",
    suggestedResultsTitle: "Suggested Results",
    suggestedResultsDesc: "Additional suggestions for your search",
    keywordClustersTitle: "Keyword Clusters",
    keywordClustersDesc: "Groups of related keywords",
    historicalDataTitle: "Historical Data",
    historicalDataDesc: "Search volume trends over time",
    categoryKeywordTitle: "Category Keywords",
    categoryKeywordDesc: "Keywords categorized by theme",
    closeResultsButton: "Close Results"
  },
  es: {
    resultsTitle: "Resultados de Búsqueda",
    closeButton: "Cerrar",
    organicResultsTitle: "Resultados Orgánicos",
    organicResultsDesc: "Principales resultados de búsqueda para tu palabra clave",
    peopleAlsoAskTitle: "La Gente También Pregunta",
    peopleAlsoAskDesc: "Preguntas relacionadas de los usuarios",
    relatedQueriesTitle: "Consultas Relacionadas",
    relatedQueriesDesc: "Búsquedas similares que realizan los usuarios",
    paidResultsTitle: "Resultados Pagados",
    paidResultsDesc: "Contenido patrocinado relacionado con tu búsqueda",
    suggestedResultsTitle: "Resultados Sugeridos",
    suggestedResultsDesc: "Sugerencias adicionales para tu búsqueda",
    keywordClustersTitle: "Grupos de Palabras Clave",
    keywordClustersDesc: "Grupos de palabras clave relacionadas",
    historicalDataTitle: "Datos Históricos",
    historicalDataDesc: "Tendencias de volumen de búsqueda a lo largo del tiempo",
    categoryKeywordTitle: "Palabras Clave por Categoría",
    categoryKeywordDesc: "Palabras clave clasificadas por tema",
    closeResultsButton: "Cerrar Resultados"
  },
  fr: {
    resultsTitle: "Résultats de Recherche",
    closeButton: "Fermer",
    organicResultsTitle: "Résultats Organiques",
    organicResultsDesc: "Principaux résultats de recherche pour votre mot-clé",
    peopleAlsoAskTitle: "Les Gens Demandent Aussi",
    peopleAlsoAskDesc: "Questions connexes des utilisateurs",
    relatedQueriesTitle: "Requêtes Connexes",
    relatedQueriesDesc: "Recherches similaires effectuées par les utilisateurs",
    paidResultsTitle: "Résultats Sponsorisés",
    paidResultsDesc: "Contenu sponsorisé lié à votre recherche",
    suggestedResultsTitle: "Résultats Suggérés",
    suggestedResultsDesc: "Suggestions supplémentaires pour votre recherche",
    keywordClustersTitle: "Groupes de Mots-Clés",
    keywordClustersDesc: "Groupes de mots-clés connexes",
    historicalDataTitle: "Données Historiques",
    historicalDataDesc: "Tendances du volume de recherche au fil du temps",
    categoryKeywordTitle: "Mots-Clés par Catégorie",
    categoryKeywordDesc: "Mots-clés classés par thème",
    closeResultsButton: "Fermer les Résultats"
  },
  de: {
    resultsTitle: "Suchergebnisse",
    closeButton: "Schließen",
    organicResultsTitle: "Organische Ergebnisse",
    organicResultsDesc: "Top-Suchergebnisse für Ihr Keyword",
    peopleAlsoAskTitle: "Andere Fragen Auch",
    peopleAlsoAskDesc: "Verwandte Fragen von Benutzern",
    relatedQueriesTitle: "Verwandte Suchanfragen",
    relatedQueriesDesc: "Ähnliche Suchen, die Benutzer durchführen",
    paidResultsTitle: "Bezahlte Ergebnisse",
    paidResultsDesc: "Gesponserter Inhalt bezogen auf Ihre Suche",
    suggestedResultsTitle: "Vorgeschlagene Ergebnisse",
    suggestedResultsDesc: "Zusätzliche Vorschläge für Ihre Suche",
    keywordClustersTitle: "Keyword-Cluster",
    keywordClustersDesc: "Gruppen verwandter Keywords",
    historicalDataTitle: "Historische Daten",
    historicalDataDesc: "Suchvolumen-Trends im Zeitverlauf",
    categoryKeywordTitle: "Kategorie-Keywords",
    categoryKeywordDesc: "Nach Thema kategorisierte Keywords",
    closeResultsButton: "Ergebnisse Schließen"
  },
  zh: {
    resultsTitle: "搜索结果",
    closeButton: "关闭",
    organicResultsTitle: "自然结果",
    organicResultsDesc: "您的关键词的顶级搜索结果",
    peopleAlsoAskTitle: "人们还问",
    peopleAlsoAskDesc: "用户的相关问题",
    relatedQueriesTitle: "相关查询",
    relatedQueriesDesc: "用户执行的类似搜索",
    paidResultsTitle: "付费结果",
    paidResultsDesc: "与您的搜索相关的赞助内容",
    suggestedResultsTitle: "建议结果",
    suggestedResultsDesc: "您搜索的其他建议",
    keywordClustersTitle: "关键词集群",
    keywordClustersDesc: "相关关键词组",
    historicalDataTitle: "历史数据",
    historicalDataDesc: "随时间推移的搜索量趋势",
    categoryKeywordTitle: "分类关键词",
    categoryKeywordDesc: "按主题分类的关键词",
    closeResultsButton: "关闭结果"
  }
};

interface SearchResultsDisplayProps {
  data: any;
  onClose: () => void;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ data, onClose }) => {
  const { currentLanguage } = useLanguage();
  if (!data) return null;
  
  // Get translations for current language, fallback to English
  const translations = searchResultsTranslations[currentLanguage as keyof typeof searchResultsTranslations] || 
                      searchResultsTranslations.en;
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">
          {translations.resultsTitle}: <span className="text-primary">{data.keyword}</span>
        </h3>
        <Button variant="ghost" onClick={onClose}>{translations.closeButton}</Button>
      </div>
      
      <Separator />
      
      {/* Organic Results */}
      {isValidData(data.organicResults, 'array') && (
        <SearchResultSection
          title={translations.organicResultsTitle}
          description={translations.organicResultsDesc}
          items={data.organicResults}
          type="link"
          language={currentLanguage}
        />
      )}
      
      {/* People Also Ask */}
      {isValidData(data.peopleAlsoAsk, 'array') && (
        <SearchResultSection
          title={translations.peopleAlsoAskTitle}
          description={translations.peopleAlsoAskDesc}
          items={data.peopleAlsoAsk}
          language={currentLanguage}
        />
      )}
      
      {/* Related Queries */}
      {isValidData(data.relatedQueries, 'array') && (
        <KeywordListSection
          title={translations.relatedQueriesTitle}
          description={translations.relatedQueriesDesc}
          keywords={data.relatedQueries}
          language={currentLanguage}
        />
      )}
      
      {/* Paid Results */}
      {isValidData(data.paidResults, 'array') && (
        <SearchResultSection
          title={translations.paidResultsTitle}
          description={translations.paidResultsDesc}
          items={data.paidResults}
          language={currentLanguage}
        />
      )}
      
      {/* Suggested Results */}
      {isValidData(data.suggestedResults, 'array') && (
        <KeywordListSection
          title={translations.suggestedResultsTitle}
          description={translations.suggestedResultsDesc}
          keywords={data.suggestedResults}
          language={currentLanguage}
        />
      )}
      
      {/* Keyword Clusters */}
      {isValidData(data.keywordClusters, 'array') && (
        <SearchResultSection
          title={translations.keywordClustersTitle}
          description={translations.keywordClustersDesc}
          items={data.keywordClusters}
          language={currentLanguage}
        />
      )}
      
      {/* Historical Data */}
      {isValidData(data.historicalData, 'array') && (
        <SearchResultSection
          title={translations.historicalDataTitle}
          description={translations.historicalDataDesc}
          items={data.historicalData}
          language={currentLanguage}
        />
      )}
      
      {/* Category Keywords */}
      {isValidData(data.categoryKeyword, 'array') && (
        <KeywordListSection
          title={translations.categoryKeywordTitle}
          description={translations.categoryKeywordDesc}
          keywords={data.categoryKeyword}
          language={currentLanguage}
        />
      )}
      
      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={onClose}>{translations.closeResultsButton}</Button>
      </div>
    </div>
  );
};

export default SearchResultsDisplay;
