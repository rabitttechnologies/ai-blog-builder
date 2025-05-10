
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import { extractMetaDescription } from '@/utils/articleUtils';

interface ArticleMetaEditorProps {
  metaText: string;
  onChange: (metaText: string) => void;
}

const ArticleMetaEditor: React.FC<ArticleMetaEditorProps> = ({
  metaText,
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeta, setEditedMeta] = useState(metaText);
  
  const extractedDescription = extractMetaDescription(metaText);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedMeta(metaText);
  };
  
  const handleSave = () => {
    onChange(editedMeta);
    setIsEditing(false);
    toast.success("Meta description updated successfully");
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedMeta(metaText);
  };
  
  if (isEditing) {
    return (
      <div className="relative">
        <Textarea 
          value={editedMeta} 
          onChange={(e) => setEditedMeta(e.target.value)}
          className="min-h-[100px] font-mono text-sm"
          placeholder="## Meta Description
Your meta description here..."
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
    <div className="relative p-4 border rounded-md bg-gray-50">
      <h3 className="font-medium mb-2 text-sm text-gray-700">Meta Description</h3>
      {extractedDescription ? (
        <div className="text-sm text-gray-600">{extractedDescription}</div>
      ) : (
        <p className="text-gray-500 italic text-sm">No meta description available</p>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="absolute top-2 right-2 flex items-center gap-1.5"
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
    </div>
  );
};

export default ArticleMetaEditor;
