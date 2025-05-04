
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { TitleDescriptionOption } from '@/context/articleWriter/ArticleWriterContext';

interface TitleSelectionCardProps {
  title: TitleDescriptionOption;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const TitleSelectionCard: React.FC<TitleSelectionCardProps> = ({
  title,
  isSelected,
  onSelect,
  disabled = false
}) => {
  return (
    <Card 
      className={`p-4 transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title.title}</h3>
          <p className="text-gray-600 text-sm">{title.description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          {isSelected ? (
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <CheckCircle className="h-5 w-5" />
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onSelect}
              disabled={disabled}
            >
              Select
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TitleSelectionCard;
