
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import type { ClusterItem } from '@/types/clustering';

interface KeywordItemProps {
  item: ClusterItem;
  onUpdateKeyword: (keyword: string, updates: Partial<ClusterItem>) => void;
  clusterName: string;
  usedPriorities: number[];
  isPrioritized: boolean;
}

const KeywordItem: React.FC<KeywordItemProps> = ({ 
  item, 
  onUpdateKeyword, 
  clusterName,
  usedPriorities,
  isPrioritized
}) => {
  const [isEditing, setIsEditing] = useState(!!item.isEditing);
  const [availablePriorities, setAvailablePriorities] = useState<number[]>([]);
  const [mergeKeywords, setMergeKeywords] = useState<string[]>([]);
  const [showMergeKeywords, setShowMergeKeywords] = useState(false);

  // Generate available priorities (1-10 sequential only)
  useEffect(() => {
    // Start from 1 or the next available number after the highest used priority
    const highestUsedPriority = usedPriorities.length > 0 
      ? Math.max(...usedPriorities) 
      : 0;
      
    // The next available priority is the highest + 1, unless there are gaps
    // For sequential selection, we only offer the next number in sequence
    const nextPriority = highestUsedPriority + 1;
    
    // Only show priorities up to 10
    const priorities = nextPriority <= 10 ? [nextPriority] : [];
    
    // If this item already has a priority, include it as well
    if (item.priority && !usedPriorities.includes(item.priority) && item.priority !== nextPriority) {
      priorities.push(item.priority);
    }
    
    setAvailablePriorities(priorities);
  }, [usedPriorities, item.priority]);

  const handleStatusChange = (status: string) => {
    // If moving away from selected status, clear priority
    if (item.status === 'Select for Blog Creation' && status !== 'Select for Blog Creation') {
      onUpdateKeyword(item.keyword, { 
        status: status as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future',
        priority: undefined
      });
    } else {
      onUpdateKeyword(item.keyword, { 
        status: status as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future'
      });
    }
    
    setIsEditing(false);
  };

  const handlePriorityChange = (value: string) => {
    const priority = parseInt(value, 10);
    onUpdateKeyword(item.keyword, { priority });
  };

  const handleToggleMerge = () => {
    setShowMergeKeywords(!showMergeKeywords);
  };

  const handleAddMergeKeyword = (keyword: string) => {
    if (mergeKeywords.length < 3 && !mergeKeywords.includes(keyword)) {
      const newMergeKeywords = [...mergeKeywords, keyword];
      setMergeKeywords(newMergeKeywords);
      
      // Update the keyword field with merged keywords
      const mergedKeywordString = newMergeKeywords.join(', ');
      onUpdateKeyword(item.keyword, { keyword: mergedKeywordString });
    }
  };

  const handleRemoveMergeKeyword = (keyword: string) => {
    const newMergeKeywords = mergeKeywords.filter(k => k !== keyword);
    setMergeKeywords(newMergeKeywords);
    
    // Update the keyword field with merged keywords or revert to original
    if (newMergeKeywords.length === 0) {
      onUpdateKeyword(item.keyword, { keyword: item.keyword });
    } else {
      const mergedKeywordString = newMergeKeywords.join(', ');
      onUpdateKeyword(item.keyword, { keyword: mergedKeywordString });
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${isPrioritized ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Keyword:</span>
              <span>{item.keyword}</span>
            </div>
            {item.status === 'Select for Blog Creation' && (
              <Badge variant="default" className="ml-auto">
                Priority: {item.priority || 'None'}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Monthly Volume:</span>{' '}
              <span className="font-medium">{item.monthlySearchVolume || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Difficulty:</span>{' '}
              <span className="font-medium">{item.keywordDifficulty || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Competition:</span>{' '}
              <span className="font-medium">{item.competition || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">CPC:</span>{' '}
              <span className="font-medium">${item.cpc?.toFixed(2) || 'N/A'}</span>
            </div>
          </div>
          
          {item.searchIntent && (
            <div className="text-sm">
              <span className="text-muted-foreground">Search Intent:</span>{' '}
              <Badge variant="outline">{item.searchIntent}</Badge>
            </div>
          )}
          
          {item.category && (
            <div className="text-sm">
              <span className="text-muted-foreground">Category:</span>{' '}
              <Badge variant="outline">{item.category}</Badge>
            </div>
          )}
          
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
              <Select
                value={item.status || 'Select for Blog Creation'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select for Blog Creation">Select for Blog</SelectItem>
                  <SelectItem value="Reject for Blog Creation">Reject for Blog</SelectItem>
                  <SelectItem value="Keep for Future">Keep for Future</SelectItem>
                </SelectContent>
              </Select>
              
              {item.status === 'Select for Blog Creation' && (
                <Select
                  value={item.priority?.toString() || ''}
                  onValueChange={handlePriorityChange}
                  disabled={availablePriorities.length === 0}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePriorities.length === 0 ? (
                      <SelectItem value="" disabled>No available priorities</SelectItem>
                    ) : (
                      availablePriorities.map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleMerge}
              className="w-full mt-1"
            >
              {showMergeKeywords ? 'Hide Merge Options' : 'Merge Keywords'}
            </Button>
            
            {showMergeKeywords && (
              <div className="mt-2 border rounded-md p-2">
                <p className="text-sm mb-2">Select up to 3 keywords to merge:</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {mergeKeywords.map(keyword => (
                    <Badge 
                      key={keyword} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {keyword}
                      <button 
                        onClick={() => handleRemoveMergeKeyword(keyword)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select
                  onValueChange={handleAddMergeKeyword}
                  disabled={mergeKeywords.length >= 3}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add keyword" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={item.keyword} disabled={mergeKeywords.includes(item.keyword)}>
                      {item.keyword}
                    </SelectItem>
                    <SelectItem value="example keyword 1" disabled={mergeKeywords.includes("example keyword 1")}>
                      example keyword 1
                    </SelectItem>
                    <SelectItem value="example keyword 2" disabled={mergeKeywords.includes("example keyword 2")}>
                      example keyword 2
                    </SelectItem>
                    <SelectItem value="example keyword 3" disabled={mergeKeywords.includes("example keyword 3")}>
                      example keyword 3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordItem;
