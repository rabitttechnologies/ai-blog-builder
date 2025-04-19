
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';
import { formatLocalizedDate } from '@/utils/languageUtils';
import { Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { TranslationWorkflow } from '@/types/blog';

export interface TranslationHistoryProps {
  translations: (TranslationWorkflow & {
    blog_posts?: {
      title: string;
      language_code: string;
    };
  })[];
  isLoading: boolean;
}

export function TranslationHistoryView({ translations, isLoading }: TranslationHistoryProps) {
  const getTranslationProgress = (completed: string[], requested: string[]) => {
    if (!requested.length) return 0;
    return (completed.length / requested.length) * 100;
  };

  const getLanguageLabel = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRemainingLanguages = (completed: string[], requested: string[]) => {
    return requested.filter(lang => !completed.includes(lang));
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading translation history...</div>;
  }

  if (!translations?.length) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No translation history available.</p>
      </div>
    );
  }

  return (
    <div className="container-wide py-6">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Blog Title</TableHead>
              <TableHead>Requested Languages</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {translations?.map((translation) => (
              <TableRow key={translation.id}>
                <TableCell className="font-medium">
                  {translation.blog_posts?.title}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {translation.requested_languages.map((lang) => (
                      <Badge 
                        key={lang} 
                        variant={translation.completed_languages.includes(lang) ? "default" : "outline"}
                      >
                        {getLanguageLabel(lang)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-full max-w-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {Math.round(getTranslationProgress(
                          translation.completed_languages,
                          translation.requested_languages
                        ))}%
                      </span>
                      
                      {translation.completed_languages.length < translation.requested_languages.length && (
                        <Tooltip content={
                          <div className="p-2">
                            <p className="font-medium">Pending translations:</p>
                            <ul className="text-xs list-disc pl-4 mt-1">
                              {getRemainingLanguages(translation.completed_languages, translation.requested_languages)
                                .map(lang => (
                                  <li key={lang}>{getLanguageLabel(lang)}</li>
                                ))
                              }
                            </ul>
                          </div>
                        }>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </Tooltip>
                      )}
                    </div>
                    <Progress
                      value={getTranslationProgress(
                        translation.completed_languages,
                        translation.requested_languages
                      )}
                      className="h-1.5"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(translation.status)}>
                    {translation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatLocalizedDate(new Date(translation.created_at), 'en')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
