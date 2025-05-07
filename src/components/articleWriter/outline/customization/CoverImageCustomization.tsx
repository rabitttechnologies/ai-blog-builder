
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
  'Photograph', 'Illustration', 'Anime', 'Fantasy', 'Watercolor', 'Isometric', 
  'Cartoon', '3D Render', 'Vector', 'Minimalist'
];

const IMAGE_SIZES = [
  '1200x628 (Social Media)', '1920x1080 (Full HD)', '1280x720 (HD)', 
  '800x600 (Standard)', '1080x1080 (Square)', '900x1600 (Pinterest)'
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cover-image-type">Image Style</Label>
          <Select 
            value={imageType} 
            onValueChange={onTypeChange}
          >
            <SelectTrigger id="cover-image-type">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cover-image-size">Image Size</Label>
          <Select 
            value={imageSize} 
            onValueChange={onSizeChange}
          >
            <SelectTrigger id="cover-image-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_SIZES.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CustomizationSection>
  );
};

export default CoverImageCustomization;
