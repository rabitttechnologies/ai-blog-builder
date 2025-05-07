
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
      description="Add frequently asked questions to improve SEO"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <Label>Number of Questions</Label>
        <Select 
          value={faqCount.toString()} 
          onValueChange={(value) => onCountChange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select number of questions" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({length: 10}, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'question' : 'questions'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CustomizationSection>
  );
};

export default FAQsCustomization;
