
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomizationSection from './CustomizationSection';

interface CoverImageCustomizationProps {
  isEnabled: boolean;
  imageType: string;
  imageSize: string;
  onToggle: (enabled: boolean) => void;
  onTypeChange: (type: string) => void;
  onSizeChange: (size: string) => void;
}

const IMAGE_TYPES = [
  'Photograph', 'Illustration', 'Anime', 'Fantasy', 'Watercolor', 
  'Isometric', 'Minimalist', 'Abstract', '3D Render'
];

const IMAGE_SIZES = [
  { label: 'Standard Blog (1200 × 630)', value: '1200x630' },
  { label: 'Square (1080 × 1080)', value: '1080x1080' },
  { label: 'Wide (1920 × 1080)', value: '1920x1080' },
  { label: 'Pinterest (735 × 1102)', value: '735x1102' },
  { label: 'Facebook Banner (851 × 315)', value: '851x315' }
];

const CoverImageCustomization: React.FC<CoverImageCustomizationProps> = ({
  isEnabled,
  imageType,
  imageSize,
  onToggle,
  onTypeChange,
  onSizeChange
}) => {
  return (
    <CustomizationSection
      title="Generate Cover Image"
      description="Create a cover image for your article"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Image Style</Label>
          <Select 
            value={imageType} 
            onValueChange={onTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select image style" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_TYPES.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Style</SelectItem>
            </SelectContent>
          </Select>
          
          {imageType === 'custom' && (
            <Input 
              placeholder="Enter custom image style" 
              className="mt-2"
              onChange={(e) => onTypeChange(e.target.value)}
            />
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Image Size</Label>
          <Select 
            value={imageSize} 
            onValueChange={onSizeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select image size" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CustomizationSection>
  );
};

export default CoverImageCustomization;
