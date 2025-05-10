
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface KeywordInfoDisplayProps {
  contentType?: string;
  originalKeyword?: string;
  mainKeyword?: string;
  additionalKeywords?: string[];
}

const KeywordInfoDisplay: React.FC<KeywordInfoDisplayProps> = ({
  contentType,
  originalKeyword,
  mainKeyword,
  additionalKeywords = []
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Keyword Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {contentType && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Content Type</span>
            <span className="font-medium">{contentType}</span>
          </div>
        )}
        
        {originalKeyword && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Original Keyword</span>
            <span className="font-medium">{originalKeyword}</span>
          </div>
        )}
        
        {mainKeyword && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Main Keyword</span>
            <span className="font-medium">{mainKeyword}</span>
          </div>
        )}
        
        {additionalKeywords && additionalKeywords.length > 0 && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Additional Keywords</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {additionalKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">{keyword}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordInfoDisplay;
