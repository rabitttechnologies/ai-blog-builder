
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Edit, Save } from 'lucide-react';
import { toast } from 'sonner';

interface EditableArticleContentProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

const EditableArticleContent: React.FC<EditableArticleContentProps> = ({
  content,
  onChange,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(content);
  };
  
  const handleSave = () => {
    onChange(editedContent);
    setIsEditing(false);
    toast.success("Content updated successfully");
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content);
  };
  
  if (isEditing) {
    return (
      <div className={`relative ${className}`}>
        <Textarea 
          value={editedContent} 
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
        />
        <div className="flex justify-end mt-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            className="flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      {content ? (
        <div 
          className="prose prose-slate max-w-none article-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-gray-500 italic">No content available</p>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="absolute top-0 right-0 flex items-center gap-1.5"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
    </div>
  );
};

export default EditableArticleContent;
