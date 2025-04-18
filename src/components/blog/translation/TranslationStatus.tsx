
import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { TranslationStatus } from '@/types/blog';

interface TranslationStatusBadgeProps {
  status: TranslationStatus;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  review_needed: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function TranslationStatusBadge({ status }: TranslationStatusBadgeProps) {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
  
  return (
    <Badge variant="outline" className={`${colorClass}`}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
}
