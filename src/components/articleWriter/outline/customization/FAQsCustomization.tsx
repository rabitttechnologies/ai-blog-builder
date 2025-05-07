
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomizationSection from './CustomizationSection';

interface FAQsCustomizationProps {
  isEnabled: boolean;
  faqCount: number;
  onToggle: (enabled: boolean) => void;
  onCountChange: (count: number) => void;
}

const FAQsCustomization: React.FC<FAQsCustomizationProps> = ({
  isEnabled,
  faqCount,
  onToggle,
  onCountChange
}) => {
  return (
    <CustomizationSection
      title="Generate FAQs"
      description="Add frequently asked questions to your article"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <Label htmlFor="faq-count">Number of FAQs</Label>
        <Select 
          value={faqCount.toString()} 
          onValueChange={(value) => onCountChange(parseInt(value))}
        >
          <SelectTrigger id="faq-count">
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          FAQs can help with SEO and provide valuable information to your readers.
        </p>
      </div>
    </CustomizationSection>
  );
};

export default FAQsCustomization;
