
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader';

interface SearchResultSectionProps {
  title: string;
  description: string;
  items: any[];
  type?: 'link' | 'text';
  language?: string; // Add language support
  onLanguageChange?: (language: string) => void; // Optional language change handler
}

const SearchResultSection: React.FC<SearchResultSectionProps> = ({ 
  title, 
  description, 
  items,
  type = 'text',
  language = 'en', // Default to English
  onLanguageChange
}) => {
  if (!items || items.length === 0) return null;

  return (
    <Card>
      <SectionHeader 
        title={title} 
        description={description} 
        language={language}
        onLanguageChange={onLanguageChange}
      />
      <CardContent>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-md">
              {type === 'link' && typeof item === 'object' ? (
                <>
                  <p className="font-semibold">{item.title}</p>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm flex items-center hover:underline"
                  >
                    {item.url.substring(0, 50)}...
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  {item.snippet && <p className="text-sm text-gray-600 mt-1">{item.snippet}</p>}
                </>
              ) : (
                <p>{typeof item === 'string' ? item : JSON.stringify(item)}</p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SearchResultSection;
