
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SectionHeaderProps {
  title: string;
  description: string;
  language?: string;
  onLanguageChange?: (language: string) => void;
}

// Available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
];

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  description,
  language = 'en',
  onLanguageChange 
}) => {
  // If no language change handler is provided, don't show the language selector
  const showLanguageSelector = !!onLanguageChange;
  
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      
      {showLanguageSelector && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto h-8 gap-1"
            >
              <Globe className="h-4 w-4" />
              {languages.find(lang => lang.code === language)?.name || 'Language'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map(lang => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={language === lang.code ? "bg-primary/10" : ""}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </CardHeader>
  );
};

export default SectionHeader;
