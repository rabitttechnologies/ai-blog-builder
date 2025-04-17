
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from './SectionHeader';
import { Badge } from '@/components/ui/badge';

interface KeywordListSectionProps {
  title: string;
  description: string;
  keywords: string[];
  language?: string; // Add language support
  onLanguageChange?: (language: string) => void; // Optional language change handler
}

const KeywordListSection: React.FC<KeywordListSectionProps> = ({
  title,
  description,
  keywords,
  language = 'en', // Default to English
  onLanguageChange
}) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <Card>
      <SectionHeader 
        title={title} 
        description={description} 
        language={language}
        onLanguageChange={onLanguageChange}
      />
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 bg-gray-100 text-foreground">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordListSection;
