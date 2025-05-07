
import React from 'react';
import CustomizationSection from './CustomizationSection';

interface SimpleCustomizationOptionsProps {
  humanized: boolean;
  comparison: boolean;
  expertQuotes: boolean;
  onHumanizedChange: (value: boolean) => void;
  onComparisonChange: (value: boolean) => void;
  onExpertQuotesChange: (value: boolean) => void;
}

const SimpleCustomizationOptions: React.FC<SimpleCustomizationOptionsProps> = ({
  humanized,
  comparison,
  expertQuotes,
  onHumanizedChange,
  onComparisonChange,
  onExpertQuotesChange
}) => {
  return (
    <>
      <CustomizationSection
        title="Generate Humanized Article"
        description="Make the article sound more natural and human-written"
        isEnabled={humanized}
        onToggle={onHumanizedChange}
      />
      
      <CustomizationSection
        title="Generate Comparison Table"
        description="Include tables comparing different aspects of your topic"
        isEnabled={comparison}
        onToggle={onComparisonChange}
      />
      
      <CustomizationSection
        title="Include Expert Quotes"
        description="Add quotes from industry experts to add credibility"
        isEnabled={expertQuotes}
        onToggle={onExpertQuotesChange}
      />
    </>
  );
};

export default SimpleCustomizationOptions;
