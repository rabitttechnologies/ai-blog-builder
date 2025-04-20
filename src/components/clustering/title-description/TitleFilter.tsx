
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface TitleFilterProps {
  filters: { keyword?: string; title?: string; category?: string };
  setFilters: React.Dispatch<React.SetStateAction<{ keyword?: string; title?: string; category?: string }>>;
  categories: string[];
}

const TitleFilter: React.FC<TitleFilterProps> = ({ filters, setFilters, categories }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Filters</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilters({})}
          >
            <X className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="keyword-filter">Keyword</Label>
            <Input
              id="keyword-filter"
              value={filters.keyword || ''}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              placeholder="Filter by keyword..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="title-filter">Title</Label>
            <Input
              id="title-filter"
              value={filters.title || ''}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              placeholder="Filter by title..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="category-filter">Category</Label>
            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? undefined : value })}
            >
              <SelectTrigger id="category-filter" className="mt-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TitleFilter;
