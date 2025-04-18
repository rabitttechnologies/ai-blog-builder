
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';
import { formatLocalizedDate } from '@/utils/languageUtils';

interface TranslationHistoryProps {
  blogId?: string; // Optional - if provided, shows history for specific blog
}

export function TranslationHistoryView({ blogId }: TranslationHistoryProps) {
  const { data: translations, isLoading } = useQuery({
    queryKey: ['translation-history', blogId],
    queryFn: async () => {
      const query = supabase
        .from('translation_workflows')
        .select(`
          *,
          blog_posts!blog_id (
            title,
            language_code
          )
        `)
        .order('created_at', { ascending: false });

      if (blogId) {
        query.eq('blog_id', blogId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading translation history...</div>;
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
                      <Badge key={lang} variant="outline">
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
