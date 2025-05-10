
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { OutlineOption } from '@/types/outlineCustomize';

interface OutlineOptionsListProps {
  outlines: OutlineOption[];
  selectedOutlineIndex: number;
  onSelect: (index: number) => void;
}

const OutlineOptionsList: React.FC<OutlineOptionsListProps> = ({
  outlines,
  selectedOutlineIndex,
  onSelect,
}) => {
  if (!outlines || outlines.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No outlines available. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {outlines.map((outline, index) => {
        const isSelected = index === selectedOutlineIndex;
        
        return (
          <Card 
            key={outline.id || `outline-${index}`}
            className={`cursor-pointer transition-all ${
              isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-gray-300'
            }`}
            onClick={() => onSelect(index)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 prose prose-sm max-w-none">
                  {outline.parsed && outline.parsed.headings ? (
                    <div className="space-y-2">
                      {outline.parsed.headings.map((heading, idx) => {
                        // Render based on heading level (h1-h6)
                        const HeadingTag = `h${Math.min(heading.level + 1, 6)}` as keyof JSX.IntrinsicElements;
                        const indentClass = heading.level > 1 ? `ml-${(heading.level - 1) * 4}` : '';
                        
                        return (
                          <div key={idx} className={indentClass}>
                            <HeadingTag className="text-sm font-medium my-1">
                              {heading.title}
                            </HeadingTag>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <pre className="text-sm whitespace-pre-wrap">{outline.content}</pre>
                  )}
                </div>
                
                {isSelected && (
                  <div className="ml-2 flex-shrink-0">
                    <span className="bg-primary text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OutlineOptionsList;
