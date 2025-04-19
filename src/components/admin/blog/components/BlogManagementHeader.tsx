
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BlogManagementHeaderProps {
  onCreateClick: () => void;
}

export function BlogManagementHeader({ onCreateClick }: BlogManagementHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 className="text-2xl font-bold">Blog Management</h2>
      <Button onClick={onCreateClick} className="w-full md:w-auto">
        <Plus className="mr-2 h-4 w-4" /> Create New Blog
      </Button>
    </div>
  );
}
