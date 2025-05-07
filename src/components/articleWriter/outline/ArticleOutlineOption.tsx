
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import MarkdownRenderer from '@/components/articleWriter/outline/MarkdownRenderer';

interface ArticleOutlineOptionProps {
  id: string;
  content: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: () => void;
}

const ArticleOutlineOption: React.FC<ArticleOutlineOptionProps> = ({
  id,
  content,
  isSelected,
  onSelect,
  onEdit
}) => {
  return (
    <Card 
      className={cn(
        "p-4 transition-colors cursor-pointer border-2 hover:border-primary/60",
        isSelected ? "border-primary bg-primary/5" : "border-transparent"
      )}
      onClick={() => onSelect(id)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">Outline Option {id.split('-')[1]}</h3>
          {isSelected && (
            <div className="bg-primary text-white rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <div className="prose prose-sm max-w-none">
          <MarkdownRenderer content={content} />
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="mt-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ArticleOutlineOption;
