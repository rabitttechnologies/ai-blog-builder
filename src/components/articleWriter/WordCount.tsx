
import React from 'react';
import { countWords } from '@/utils/articleUtils';

interface WordCountProps {
  content: string;
  className?: string;
}

const WordCount: React.FC<WordCountProps> = ({ content, className = '' }) => {
  const count = countWords(content || '');
  
  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      <span className="font-medium">{count}</span> words
    </div>
  );
};

export default WordCount;
