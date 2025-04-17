
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'outline',
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  
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
        {SUPPORTED_LANGUAGES.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={currentLanguage === lang.code ? "bg-primary/10" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
