
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { useLocalizedUrl } from '@/hooks/useLocalizedUrl';

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
  showAuto?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'outline',
  size = 'sm',
  showLabel = false,
  className = '',
  showAuto = false,
}) => {
  const { currentLanguage, setLanguage, detectLanguage } = useLanguage();
  const { currentPath } = useLocalizedUrl();
  
  const currentLanguageName = SUPPORTED_LANGUAGES.find(
    lang => lang.code === currentLanguage
  )?.name || 'Language';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant as any} 
          size={size as any} 
          className={`gap-1 ${className}`}
        >
          <Globe className="h-4 w-4" />
          {showLabel && currentLanguageName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {SUPPORTED_LANGUAGES.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex justify-between items-center ${currentLanguage === lang.code ? "bg-primary/10" : ""}`}
          >
            <span>{lang.name}</span>
            {currentLanguage === lang.code && (
              <Badge variant="outline" className="ml-2">Active</Badge>
            )}
          </DropdownMenuItem>
        ))}
        
        {showAuto && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={detectLanguage}>
              Auto-detect from browser
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
