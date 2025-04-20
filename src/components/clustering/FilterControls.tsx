
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import type { ClusteringFilters } from '@/types/clustering';

interface FilterControlsProps {
  filters: ClusteringFilters;
  onSetFilters: (filters: ClusteringFilters) => void;
  searchIntents: string[];
  categories: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onSetFilters,
  searchIntents,
  categories
}) => {
  // Handle keyword filter change
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetFilters({ ...filters, keyword: e.target.value });
  };

  // Handle competition filter change
  const handleCompetitionChange = (value: string) => {
    onSetFilters({ ...filters, competition: value === 'all' ? undefined : value });
  };

  // Handle search intent filter change
  const handleSearchIntentChange = (value: string) => {
    onSetFilters({ ...filters, searchIntent: value === 'all' ? undefined : value });
  };

  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    onSetFilters({ ...filters, category: value === 'all' ? undefined : value });
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (values: number[]) => {
    onSetFilters({ 
      ...filters, 
      minDifficulty: values[0],
      maxDifficulty: values[1]
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    onSetFilters({});
  };

  // Prepare filter values for display
  const competitionValue = filters.competition || 'all';
  const searchIntentValue = filters.searchIntent || 'all';
  const categoryValue = filters.category || 'all';

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Filters</h3>
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
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
              onChange={handleKeywordChange}
              placeholder="Filter by keyword..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="competition-filter">Competition</Label>
            <Select value={competitionValue} onValueChange={handleCompetitionChange}>
              <SelectTrigger id="competition-filter" className="mt-1">
                <SelectValue placeholder="All Competitions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="search-intent-filter">Search Intent</Label>
            <Select value={searchIntentValue} onValueChange={handleSearchIntentChange}>
              <SelectTrigger id="search-intent-filter" className="mt-1">
                <SelectValue placeholder="All Intents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intents</SelectItem>
                {searchIntents.map(intent => (
                  <SelectItem key={intent} value={intent}>{intent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category-filter">Category</Label>
            <Select value={categoryValue} onValueChange={handleCategoryChange}>
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
          
          <div className="md:col-span-2">
            <Label htmlFor="difficulty-filter">Keyword Difficulty</Label>
            <div className="px-2 pt-4 pb-2">
              <Slider
                defaultValue={[filters.minDifficulty || 0, filters.maxDifficulty || 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleDifficultyChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.minDifficulty || 0}</span>
                <span>{filters.maxDifficulty || 100}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
