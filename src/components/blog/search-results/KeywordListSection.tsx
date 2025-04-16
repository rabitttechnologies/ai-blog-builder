
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from './SectionHeader';

interface KeywordListSectionProps {
  title: string;
  description: string;
  keywords: string[];
}

const KeywordListSection: React.FC<KeywordListSectionProps> = ({
  title,
  description,
  keywords
}) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <Card>
      <SectionHeader title={title} description={description} />
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordListSection;
