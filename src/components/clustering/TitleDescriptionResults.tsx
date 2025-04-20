
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TitleFilter from './title-description/TitleFilter';
import TitleGroupList from './title-description/TitleGroupList';
import TitleConfirmationDialog from './title-description/TitleConfirmationDialog';
import type { TitleDescriptionResponse } from '@/types/clustering';

interface TitleDescriptionResultsProps {
  data: TitleDescriptionResponse;
  onUpdateItem: (itemId: string, updates: Partial<TitleDescriptionResponse['data'][0]>) => void;
  onCreateBlog: (selectedItem: TitleDescriptionResponse['data'][0]) => void;
  onClose: () => void;
}

const TitleDescriptionResults: React.FC<TitleDescriptionResultsProps> = ({
  data,
  onUpdateItem,
  onCreateBlog,
  onClose
}) => {
  const [groupBy, setGroupBy] = useState<'cluster_name' | 'category'>('cluster_name');
  const [filters, setFilters] = useState<{ keyword?: string; title?: string; category?: string }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [confirmationItem, setConfirmationItem] = useState<TitleDescriptionResponse['data'][0] | null>(null);

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No titles found</h3>
        <p className="text-muted-foreground mb-4">No title/description data is available.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  const toggleFilters = () => setShowFilters(!showFilters);

  // Apply filters
  const filteredItems = data.data.filter(item => {
    if (filters.keyword && !item.keyword.toLowerCase().includes(filters.keyword.toLowerCase())) {
      return false;
    }
    if (filters.title && !item.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    return true;
  });

  // Group items
  const groupedItems = filteredItems.reduce((groups, item) => {
    const groupKey = item[groupBy] || 'Unknown';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, TitleDescriptionResponse['data']>);

  // Handle create blog action
  const handleCreateBlog = (item: TitleDescriptionResponse['data'][0]) => {
    setConfirmationItem(item);
  };

  const confirmCreateBlog = () => {
    if (confirmationItem) {
      onCreateBlog(confirmationItem);
    }
    setConfirmationItem(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold">Title & Description Options</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleFilters} size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </div>

      {/* Group by selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Group By:</span>
        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as 'cluster_name' | 'category')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Grouping" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cluster_name">Cluster Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter controls */}
      {showFilters && (
        <TitleFilter 
          filters={filters} 
          setFilters={setFilters} 
          categories={Array.from(new Set(data.data.map(item => item.category)))} 
        />
      )}

      {/* Grouped results */}
      <TitleGroupList 
        groupedItems={groupedItems} 
        onUpdateItem={onUpdateItem} 
        onCreateBlog={handleCreateBlog} 
      />

      {/* Confirmation dialog */}
      <TitleConfirmationDialog 
        confirmationItem={confirmationItem} 
        setConfirmationItem={setConfirmationItem} 
        confirmCreateBlog={confirmCreateBlog} 
      />
    </div>
  );
};

export default TitleDescriptionResults;
