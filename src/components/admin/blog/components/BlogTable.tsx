
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Eye, Globe, Trash2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';
import type { BlogPost } from '@/types/blog';

interface BlogTableProps {
  posts: BlogPost[];
  onTranslateClick: (post: BlogPost) => void;
  onPublish: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onPreview: (post: BlogPost) => void;
}

export function BlogTable({
  posts,
  onTranslateClick,
  onPublish,
  onDelete,
  onPreview,
}: BlogTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Translations</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                {post.title}
                {post.is_original && (
                  <Badge variant="outline" className="ml-2">Original</Badge>
                )}
              </TableCell>
              <TableCell>
                {SUPPORTED_LANGUAGES.find(l => l.code === post.language_code)?.name || post.language_code}
              </TableCell>
              <TableCell>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(post.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {post.is_original ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onTranslateClick(post)}
                  >
                    <Globe className="mr-1 h-4 w-4" />
                    <span>Translate</span>
                  </Button>
                ) : (
                  <Badge variant="outline">
                    Translation of {post.original_id}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(post)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant={post.status === 'published' ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => onPublish(post)}
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(post)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
