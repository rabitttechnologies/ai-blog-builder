
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
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
      className={`p-4 transition-colors cursor-pointer border-2 hover:border-primary/60 ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-transparent'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect()}
    >
      <div className="flex">
        <div className="flex-grow">
          <h3 className="font-bold text-lg mb-2">{title.title}</h3>
          <p className="text-gray-600 text-sm">{title.description}</p>
        </div>
        {isSelected && (
          <div className="flex items-center">
            <div className="bg-primary text-white rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TitleSelectionCard;
