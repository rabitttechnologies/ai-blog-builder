
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Filter, Edit, Check, X } from 'lucide-react';
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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemField, setEditingItemField] = useState<'title' | 'description' | null>(null);
  const [editValue, setEditValue] = useState('');
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

  // Handle edit actions
  const startEditing = (itemId: string, field: 'title' | 'description', initialValue: string) => {
    setEditingItemId(itemId);
    setEditingItemField(field);
    setEditValue(initialValue);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditingItemField(null);
    setEditValue('');
  };

  const saveEditing = () => {
    if (editingItemId && editingItemField && editValue.trim()) {
      onUpdateItem(editingItemId, { [editingItemField]: editValue });
    }
    cancelEditing();
  };

  // Handle status change
  const handleStatusChange = (itemId: string, status: string) => {
    onUpdateItem(itemId, { 
      status: status as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future' 
    });
  };

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
                    {Array.from(new Set(data.data.map(item => item.category))).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grouped results */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([groupKey, items], groupIndex) => (
          <Accordion key={groupIndex} type="single" collapsible defaultValue={`item-${groupIndex}`}>
            <AccordionItem value={`item-${groupIndex}`}>
              <AccordionTrigger>
                <div className="flex flex-col items-start text-left">
                  <div className="font-semibold">{groupKey}</div>
                  <div className="text-sm text-muted-foreground">
                    {items.length} titles
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge>{item.type}</Badge>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            
                            <div className="flex items-start justify-between mb-2">
                              {editingItemId === item.keyword && editingItemField === 'title' ? (
                                <div className="flex items-center w-full mb-2">
                                  <Input 
                                    value={editValue} 
                                    onChange={(e) => setEditValue(e.target.value)} 
                                    className="mr-2"
                                  />
                                  <div className="flex">
                                    <Button size="sm" variant="ghost" onClick={saveEditing}>
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h4 className="font-semibold text-lg">{item.title}</h4>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => startEditing(item.keyword, 'title', item.title)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                            
                            {editingItemId === item.keyword && editingItemField === 'description' ? (
                              <div className="flex flex-col w-full mb-2">
                                <Textarea 
                                  value={editValue} 
                                  onChange={(e) => setEditValue(e.target.value)} 
                                  className="mb-2 min-h-[100px]"
                                />
                                <div className="flex justify-end">
                                  <Button size="sm" variant="ghost" onClick={cancelEditing} className="mr-2">
                                    Cancel
                                  </Button>
                                  <Button size="sm" variant="primary" onClick={saveEditing}>
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative mb-2">
                                <p className="text-sm text-muted-foreground pr-8">{item.description}</p>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => startEditing(item.keyword, 'description', item.description)}
                                  className="absolute top-0 right-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            
                            <div className="text-sm">
                              <span className="text-muted-foreground">Keyword:</span>{' '}
                              <strong>{item.keyword}</strong> | 
                              <span className="text-muted-foreground ml-2">Cluster:</span>{' '}
                              {item.cluster_name}
                            </div>
                            
                            {item.reasoning && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Reasoning:</span>{' '}
                                {item.reasoning}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 min-w-[180px]">
                            <Select
                              value={item.status || 'Select for Blog Creation'}
                              onValueChange={(value) => handleStatusChange(item.keyword, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Select for Blog Creation">Select for Blog</SelectItem>
                                <SelectItem value="Reject for Blog Creation">Reject for Blog</SelectItem>
                                <SelectItem value="Keep for Future">Keep for Future</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button 
                              onClick={() => handleCreateBlog(item)}
                              disabled={item.status !== 'Select for Blog Creation'}
                            >
                              Create Blog
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {/* Confirmation dialog */}
      <Dialog open={!!confirmationItem} onOpenChange={(open) => !open && setConfirmationItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Blog</DialogTitle>
            <DialogDescription>
              You're about to create a blog with the following details:
            </DialogDescription>
          </DialogHeader>
          
          {confirmationItem && (
            <div className="py-4">
              <h4 className="font-semibold mb-2">{confirmationItem.title}</h4>
              <p className="text-sm mb-4">{confirmationItem.description}</p>
              
              <div className="text-sm grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Keyword:</span> {confirmationItem.keyword}</div>
                <div><span className="text-muted-foreground">Cluster:</span> {confirmationItem.cluster_name}</div>
                <div><span className="text-muted-foreground">Category:</span> {confirmationItem.category}</div>
                <div><span className="text-muted-foreground">Type:</span> {confirmationItem.type}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationItem(null)}>Cancel</Button>
            <Button onClick={confirmCreateBlog}>Create Blog</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TitleDescriptionResults;
