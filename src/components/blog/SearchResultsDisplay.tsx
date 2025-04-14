
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink } from 'lucide-react';

interface SearchResultsDisplayProps {
  data: any;
  onClose: () => void;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ data, onClose }) => {
  if (!data) return null;
  
  // Helper to check if a section has data before rendering
  const hasData = (section: any) => section && Array.isArray(section) && section.length > 0;
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Search Results: <span className="text-primary">{data.keyword}</span></h3>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      
      <Separator />
      
      {/* Organic Results Section */}
      {hasData(data.organicResults) && (
        <Card>
          <CardHeader>
            <CardTitle>Organic Results</CardTitle>
            <CardDescription>Top search results for your keyword</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.organicResults.map((result: any, index: number) => (
                <li key={index} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold">{result.title}</p>
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm flex items-center hover:underline"
                  >
                    {result.url.substring(0, 50)}...
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* People Also Ask */}
      {hasData(data.peopleAlsoAsk) && (
        <Card>
          <CardHeader>
            <CardTitle>People Also Ask</CardTitle>
            <CardDescription>Related questions from users</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.peopleAlsoAsk.map((question: string, index: number) => (
                <li key={index} className="p-2 bg-gray-50 rounded-md">{question}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Related Queries */}
      {hasData(data.relatedQueries) && (
        <Card>
          <CardHeader>
            <CardTitle>Related Queries</CardTitle>
            <CardDescription>Similar searches users perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.relatedQueries.map((query: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {query}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Keyword Clusters */}
      {hasData(data.keywordClusters) && (
        <Card>
          <CardHeader>
            <CardTitle>Keyword Clusters</CardTitle>
            <CardDescription>Groups of related keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.keywordClusters.map((cluster: any, index: number) => (
                <div key={index} className="border rounded-md p-3">
                  <h4 className="font-medium mb-2">{cluster.cluster}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cluster.keywords?.map((kw: string, kwIndex: number) => (
                      <span key={kwIndex} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Historical Data */}
      {hasData(data.historicalData) && (
        <Card>
          <CardHeader>
            <CardTitle>Historical Data</CardTitle>
            <CardDescription>Search volume trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.historicalData.map((item: any, index: number) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span>{item.period}</span>
                  <span className="font-medium">{item.volume} searches</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Pillar Content */}
      {hasData(data.pillarContent) && (
        <Card>
          <CardHeader>
            <CardTitle>Pillar Content</CardTitle>
            <CardDescription>Suggested content topics based on your keyword</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.pillarContent.map((pillar: any, index: number) => (
                <div key={index} className="border p-3 rounded-md">
                  <h4 className="font-semibold">{pillar.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{pillar.description}</p>
                  {hasData(pillar.topics) && (
                    <div className="mt-2">
                      <h5 className="text-xs font-medium text-gray-500 mb-1">Suggested Topics:</h5>
                      <ul className="space-y-1">
                        {pillar.topics.map((topic: string, tIndex: number) => (
                          <li key={tIndex} className="text-sm">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Category Keywords */}
      {hasData(data.categoryKeyword) && (
        <Card>
          <CardHeader>
            <CardTitle>Category Keywords</CardTitle>
            <CardDescription>Keywords categorized by theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.categoryKeyword.map((category: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                  {category}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={onClose}>Close Results</Button>
      </div>
    </div>
  );
};

export default SearchResultsDisplay;
