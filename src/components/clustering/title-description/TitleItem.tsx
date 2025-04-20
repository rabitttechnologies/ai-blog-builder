
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Check, X } from 'lucide-react';
import type { TitleDescriptionResponse } from '@/types/clustering';

interface TitleItemProps {
  item: TitleDescriptionResponse['data'][0];
  onUpdateItem: (itemId: string, updates: Partial<TitleDescriptionResponse['data'][0]>) => void;
  onCreateBlog: (item: TitleDescriptionResponse['data'][0]) => void;
}

const TitleItem: React.FC<TitleItemProps> = ({ item, onUpdateItem, onCreateBlog }) => {
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (field: 'title' | 'description', initialValue: string) => {
    setEditingField(field);
    setEditValue(initialValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEditing = () => {
    if (editingField && editValue.trim()) {
      onUpdateItem(item.keyword, { [editingField]: editValue });
    }
    cancelEditing();
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    onUpdateItem(item.keyword, { 
      status: status as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future' 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge>{item.type}</Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>
            
            <div className="flex items-start justify-between mb-2">
              {editingField === 'title' ? (
                <div className="flex items-center w-full mb-2">
                  <Input 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)} 
                    className="mr-2"
                  />
                  <div className="flex">
                    <Button size="icon" variant="ghost" onClick={saveEditing}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => startEditing('title', item.title)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            {editingField === 'description' ? (
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
                  size="icon" 
                  variant="ghost" 
                  onClick={() => startEditing('description', item.description)}
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
              onValueChange={handleStatusChange}
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
              onClick={() => onCreateBlog(item)}
              disabled={item.status !== 'Select for Blog Creation'}
            >
              Create Blog
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TitleItem;
