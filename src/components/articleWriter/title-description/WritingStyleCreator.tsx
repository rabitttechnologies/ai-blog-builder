
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';

interface WritingStyleCreatorProps {
  description: string;
  onSave: (name: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

const WritingStyleCreator: React.FC<WritingStyleCreatorProps> = ({
  description,
  onSave,
  onCancel,
  disabled = false
}) => {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div>
        <Label htmlFor="style-name">Style Name</Label>
        <Input
          id="style-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Professional, Casual, Technical..."
          required
          disabled={disabled}
          className="mt-1"
        />
      </div>
      
      <div className="text-xs text-gray-500">
        <span className="font-medium">Style Description:</span>
        <p className="mt-1">{description}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          type="submit"
          size="sm"
          className="flex items-center"
          disabled={!name.trim() || disabled}
        >
          <Check className="h-4 w-4 mr-1" />
          Save Style
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex items-center"
          disabled={disabled}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default WritingStyleCreator;
