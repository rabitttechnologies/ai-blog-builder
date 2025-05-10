
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { countWords } from '@/utils/articleUtils';

interface ArticleContentEditorProps {
  content: string;
  onChange?: (content: string) => void;
  isEditable?: boolean;
  className?: string;
  id?: string;
}

const ArticleContentEditor: React.FC<ArticleContentEditorProps> = ({
  content,
  onChange,
  isEditable = true,
  className = '',
  id
}) => {
  const [editableContent, setEditableContent] = useState(content);
  
  // Update internal state when content prop changes
  useEffect(() => {
    setEditableContent(content);
  }, [content]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditableContent(newContent);
    if (onChange) onChange(newContent);
  };
  
  if (!isEditable) {
    // If not editable, render as div with HTML content
    return (
      <div 
        id={id}
        className={`prose prose-slate max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content || '' }} 
      />
    );
  }
  
  // If editable, render as textarea
  return (
    <Textarea
      id={id}
      value={editableContent}
      onChange={handleChange}
      className={`min-h-[500px] font-mono text-sm ${className}`}
      placeholder="Article content..."
    />
  );
};

export default ArticleContentEditor;
