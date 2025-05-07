
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomizationSection from './CustomizationSection';

interface ImagesCustomizationProps {
  isEnabled: boolean;
  imageType: 'Copyright Image' | 'Non-Copyright' | null;
  imageCount: number;
  onToggle: (enabled: boolean) => void;
  onTypeChange: (type: 'Copyright Image' | 'Non-Copyright') => void;
  onCountChange: (count: number) => void;
}

const ImagesCustomization: React.FC<ImagesCustomizationProps> = ({
  isEnabled,
  imageType,
  imageCount,
  onToggle,
  onTypeChange,
  onCountChange
}) => {
  return (
    <CustomizationSection
      title="Include Images in Article"
      description="Add images to enhance your article"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="image-type">Image Type</Label>
          <Select 
            value={imageType || ''} 
            onValueChange={(value) => onTypeChange(value as 'Copyright Image' | 'Non-Copyright')}
          >
            <SelectTrigger id="image-type">
              <SelectValue placeholder="Select image type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Copyright Image">Copyright Image</SelectItem>
              <SelectItem value="Non-Copyright">Non-Copyright</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image-count">Number of Images</Label>
          <Select 
            value={imageCount.toString()} 
            onValueChange={(value) => onCountChange(parseInt(value))}
          >
            <SelectTrigger id="image-count">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CustomizationSection>
  );
};

export default ImagesCustomization;
