
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KeywordsDisplayProps {
  title: string;
  description: string;
  keywords: string[];
}

const KeywordsDisplay: React.FC<KeywordsDisplayProps> = ({
  title,
  description,
  keywords
}) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
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

export default KeywordsDisplay;
