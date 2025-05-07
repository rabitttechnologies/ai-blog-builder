
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface CustomizationSectionProps {
  title: string;
  description?: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
  children,
  className = ""
}) => {
  return (
    <div className={`space-y-4 pb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">{title}</Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={onToggle} 
        />
      </div>
      
      {isEnabled && children && (
        <div className="pl-2 border-l-2 border-muted">
          {children}
        </div>
      )}
      
      <Separator />
    </div>
  );
};

export default CustomizationSection;
