
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import DOMPurify from 'dompurify';

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
  const [editableContent, setEditableContent] = useState(content || '');
  
  // Update internal state when content prop changes
  useEffect(() => {
    if (content !== undefined) {
      setEditableContent(content || '');
    }
  }, [content]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditableContent(newContent);
    if (onChange) onChange(newContent);
  };
  
  // Return placeholder for empty content in read-only mode
  if ((!content || content === '') && !isEditable) {
    return (
      <div 
        id={id}
        className={`prose prose-slate max-w-none ${className}`}
      >
        <p className="text-muted-foreground italic">No content available.</p>
      </div>
    );
  }
  
  // Render as div with HTML for non-editable content
  if (!isEditable) {
    // Sanitize the HTML to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(content || '');
    
    return (
      <div 
        id={id}
        className={`prose prose-slate max-w-none overflow-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
      />
    );
  }
  
  // Render as textarea for editable content
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
