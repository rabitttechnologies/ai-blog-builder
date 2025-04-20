
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Check, X } from 'lucide-react';
import type { ClusterItem } from '@/types/clustering';

interface KeywordItemProps {
  item: ClusterItem;
  clusterName: string;
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
}

const KeywordItem: React.FC<KeywordItemProps> = ({ item, clusterName, onUpdateKeyword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedKeyword, setEditedKeyword] = useState(item.keyword);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditedKeyword(item.keyword);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedKeyword(item.keyword);
  };

  const handleEditSave = () => {
    if (editedKeyword.trim()) {
      onUpdateKeyword(clusterName, item.keyword, { keyword: editedKeyword });
    }
    setIsEditing(false);
  };

  const handleStatusChange = (value: string) => {
    onUpdateKeyword(clusterName, item.keyword, { 
      status: value as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future' 
    });
  };

  const handlePriorityChange = (value: string) => {
    onUpdateKeyword(clusterName, item.keyword, { priority: parseInt(value) });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              {isEditing ? (
                <div className="flex items-center w-full">
                  <Input 
                    value={editedKeyword} 
                    onChange={(e) => setEditedKeyword(e.target.value)} 
                    className="mr-2"
                  />
                  <Button size="icon" variant="ghost" onClick={handleEditSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleEditCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h4 className="font-medium">{item.keyword}</h4>
                  <Button size="icon" variant="ghost" onClick={handleEditStart}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Monthly Search:</span>{' '}
                {item.monthlySearchVolume !== null ? item.monthlySearchVolume.toLocaleString() : 'N/A'}
              </div>
              <div>
                <span className="text-muted-foreground">Difficulty:</span>{' '}
                {item.keywordDifficulty !== null ? item.keywordDifficulty : 'N/A'}
              </div>
              <div>
                <span className="text-muted-foreground">Competition:</span>{' '}
                {item.competition || 'N/A'}
              </div>
              <div>
                <span className="text-muted-foreground">Intent:</span>{' '}
                {item.searchIntent ? (
                  <Badge variant="outline" className="font-normal">
                    {item.searchIntent}
                  </Badge>
                ) : 'N/A'}
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>{' '}
                {item.category ? (
                  <Badge variant="outline" className="font-normal">
                    {item.category}
                  </Badge>
                ) : 'N/A'}
              </div>
              <div>
                <span className="text-muted-foreground">CPC:</span>{' '}
                {item.cpc !== null ? `$${item.cpc.toFixed(2)}` : 'N/A'}
              </div>
            </div>
            
            {item.reasoning && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Reasoning:</span>{' '}
                {item.reasoning}
              </div>
            )}
          </div>
          
          <div className="flex flex-row md:flex-col gap-2 justify-between">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Priority:</label>
              <Select 
                value={item.priority ? item.priority.toString() : "0"} 
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="#" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">-</SelectItem>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Status:</label>
              <Select
                value={item.status || 'Select for Blog Creation'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select for Blog Creation">Select for Blog</SelectItem>
                  <SelectItem value="Reject for Blog Creation">Reject for Blog</SelectItem>
                  <SelectItem value="Keep for Future">Keep for Future</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordItem;
