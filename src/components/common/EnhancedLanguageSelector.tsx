
import React, { useMemo } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';

interface EnhancedLanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

const LANGUAGE_REGIONS = {
  asia: ['hi', 'ja', 'ko', 'zh', 'ta', 'te', 'kn', 'ml', 'ur', 'fa'],
  europe: ['en', 'fr', 'de', 'it', 'nl', 'pl', 'sv', 'el', 'da', 'ru'],
  middleEast: ['ar', 'he', 'fa'],
  other: ['id', 'ms', 'pt', 'tr']
};

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const EnhancedLanguageSelector: React.FC<EnhancedLanguageSelectorProps> = ({
  variant = 'outline',
  size = 'sm',
  showLabel = false,
  className = ''
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const currentLanguageName = SUPPORTED_LANGUAGES.find(
    lang => lang.code === currentLanguage
  )?.name || 'Language';

  const filteredLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter(lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant as any}
          size={size as any}
          className={`gap-1 ${className}`}
          dir={RTL_LANGUAGES.includes(currentLanguage) ? 'rtl' : 'ltr'}
        >
          <Globe className="h-4 w-4" />
          {showLabel && currentLanguageName}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[200px] p-0" 
        align="end"
        dir={RTL_LANGUAGES.includes(currentLanguage) ? 'rtl' : 'ltr'}
      >
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search languages..."
            />
          </div>
          <ScrollArea className="h-[300px]">
            {Object.entries(LANGUAGE_REGIONS).map(([region, codes]) => {
              const languagesInRegion = filteredLanguages.filter(lang => 
                codes.includes(lang.code)
              );

              if (languagesInRegion.length === 0) return null;

              return (
                <div key={region}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    {region.charAt(0).toUpperCase() + region.slice(1)}
                  </div>
                  {languagesInRegion.map(lang => (
                    <Command.Item
                      key={lang.code}
                      value={lang.code}
                      onSelect={() => handleLanguageSelect(lang.code)}
                      className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                    >
                      {lang.name}
                    </Command.Item>
                  ))}
                </div>
              );
            })}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
