
import { useState } from 'react';
import { toast } from 'sonner';

interface KeywordCluster {
  name: string;
  keywords: string[];
}

interface SearchVolume {
  [keyword: string]: number;
}

export const useKeywordResearch = () => {
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [language, setLanguage] = useState('en');
  const [location, setLocation] = useState('us');
  const [depth, setDepth] = useState(2);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Result states
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [keywordIdeas, setKeywordIdeas] = useState<string[]>([]);
  const [searchVolumes, setSearchVolumes] = useState<SearchVolume>({});
  const [keywordClusters, setKeywordClusters] = useState<KeywordCluster[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoadingClusters, setIsLoadingClusters] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [pagedKeywords, setPagedKeywords] = useState<string[][]>([]);
  const [currentKeywordPage, setCurrentKeywordPage] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const runSearch = () => {
    if (!primaryKeyword) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // In a real app, this would be an API call to n8n, but for the demo, we'll mock the data
    setTimeout(() => {
      try {
        // Generate mock data based on the primary keyword
        const mockRelatedKeywords = generateMockRelatedKeywords(primaryKeyword);
        const mockKeywordIdeas = generateMockKeywordIdeas(primaryKeyword);
        const mockSearchVolumes = generateMockSearchVolumes(mockRelatedKeywords);
        const mockKeywordClusters = generateMockKeywordClusters(mockRelatedKeywords);
        
        setRelatedKeywords(mockRelatedKeywords);
        setKeywordIdeas(mockKeywordIdeas);
        setSearchVolumes(mockSearchVolumes);
        setKeywordClusters(mockKeywordClusters);
        setHistoricalData([{ month: 'Jan', volume: 1200 }, { month: 'Feb', volume: 1300 }]);
        setHasSearched(true);
        setSearchResults(mockRelatedKeywords.map(keyword => ({ keyword, score: Math.floor(Math.random() * 100) })));
        
        // Paginate keywords
        const keywordsPerPage = 10;
        const pages = [];
        for (let i = 0; i < mockRelatedKeywords.length; i += keywordsPerPage) {
          pages.push(mockRelatedKeywords.slice(i, i + keywordsPerPage));
        }
        setPagedKeywords(pages);
        setCurrentKeywordPage(0);
        
        toast.success('Keyword research completed');
      } catch (err) {
        setError('An error occurred during keyword research');
        toast.error('Keyword research failed');
        console.error('Keyword research error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };
  
  // Mock data generation helpers
  const generateMockRelatedKeywords = (keyword: string): string[] => {
    const baseKeywords = [
      `${keyword} guide`, 
      `best ${keyword}`, 
      `${keyword} tutorial`, 
      `${keyword} tips`, 
      `${keyword} for beginners`,
      `${keyword} advanced`, 
      `how to use ${keyword}`, 
      `${keyword} examples`, 
      `${keyword} vs competitors`,
      `free ${keyword}`, 
      `${keyword} review`, 
      `${keyword} alternatives`, 
      `${keyword} cost`,
      `${keyword} benefits`, 
      `${keyword} features`
    ];
    
    // Randomize which keywords are returned to simulate different results
    return baseKeywords
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 10) + 5);
  };
  
  const generateMockKeywordIdeas = (keyword: string): string[] => {
    const baseIdeas = [
      `why ${keyword} is important`,
      `when to use ${keyword}`,
      `${keyword} case studies`,
      `${keyword} best practices`,
      `${keyword} statistics ${new Date().getFullYear()}`,
      `${keyword} optimization`,
      `${keyword} implementation guide`,
      `${keyword} ROI`,
      `${keyword} industry trends`,
      `${keyword} tools`,
      `${keyword} resources`,
      `${keyword} certification`,
      `learn ${keyword}`,
      `${keyword} techniques`,
      `${keyword} solutions`
    ];
    
    return baseIdeas
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 8) + 3);
  };
  
  const generateMockSearchVolumes = (keywords: string[]): SearchVolume => {
    const volumes: SearchVolume = {};
    
    keywords.forEach(keyword => {
      volumes[keyword] = Math.floor(Math.random() * 9000) + 1000;
    });
    
    return volumes;
  };
  
  const generateMockKeywordClusters = (keywords: string[]): KeywordCluster[] => {
    const shuffled = [...keywords].sort(() => 0.5 - Math.random());
    
    // Create 2-3 clusters
    const numClusters = Math.floor(Math.random() * 2) + 2;
    const clusters: KeywordCluster[] = [];
    
    const clusterNames = [
      'Informational Intent',
      'Commercial Intent',
      'Navigational Intent',
      'Transactional Intent',
      'Educational Intent'
    ];
    
    for (let i = 0; i < numClusters; i++) {
      const clusterSize = Math.floor(shuffled.length / numClusters);
      const startIdx = i * clusterSize;
      const endIdx = i === numClusters - 1 ? shuffled.length : startIdx + clusterSize;
      
      clusters.push({
        name: clusterNames[i % clusterNames.length],
        keywords: shuffled.slice(startIdx, endIdx)
      });
    }
    
    return clusters;
  };

  return {
    primaryKeyword,
    setPrimaryKeyword,
    language,
    setLanguage,
    location,
    setLocation,
    depth,
    setDepth,
    limit,
    setLimit,
    isLoading,
    error,
    hasSearched,
    relatedKeywords,
    keywordIdeas,
    searchVolumes,
    runSearch,
    keywordClusters,
    historicalData,
    isLoadingClusters,
    selectedKeywords,
    setSelectedKeywords,
    pagedKeywords,
    currentKeywordPage,
    setCurrentKeywordPage,
    searchResults
  };
};
