
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import TitleItem from './TitleItem';
import type { TitleDescriptionResponse } from '@/types/clustering';

interface TitleGroupListProps {
  groupedItems: Record<string, TitleDescriptionResponse['data']>;
  onUpdateItem: (itemId: string, updates: Partial<TitleDescriptionResponse['data'][0]>) => void;
  onCreateBlog: (item: TitleDescriptionResponse['data'][0]) => void;
}

const TitleGroupList: React.FC<TitleGroupListProps> = ({ 
  groupedItems, 
  onUpdateItem, 
  onCreateBlog 
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([groupKey, items], groupIndex) => (
        <Accordion key={groupIndex} type="single" collapsible defaultValue={`item-${groupIndex}`}>
          <AccordionItem value={`item-${groupIndex}`}>
            <AccordionTrigger>
              <div className="flex flex-col items-start text-left">
                <div className="font-semibold">{groupKey}</div>
                <div className="text-sm text-muted-foreground">
                  {items.length} titles
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {items.map((item, itemIndex) => (
                  <TitleItem 
                    key={itemIndex} 
                    item={item} 
                    onUpdateItem={onUpdateItem} 
                    onCreateBlog={onCreateBlog} 
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default TitleGroupList;
