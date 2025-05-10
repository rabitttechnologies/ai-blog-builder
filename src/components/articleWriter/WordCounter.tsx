
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { countWordsInHtml } from '@/utils/articleUtils';

interface WordCounterProps {
  content: string;
}

const WordCounter: React.FC<WordCounterProps> = ({ content }) => {
  const wordCount = countWordsInHtml(content);
  
  return (
    <Badge variant="outline" className="flex items-center gap-1 py-1">
      <FileText className="h-3 w-3" />
      <span>{wordCount} words</span>
    </Badge>
  );
};

export default WordCounter;
