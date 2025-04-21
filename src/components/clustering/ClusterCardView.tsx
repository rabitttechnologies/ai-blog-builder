
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KeywordItem from './KeywordItem';
import type { ClusterGroup, ClusterItem } from '@/types/clustering';

interface ClusterCardViewProps {
  clusters: ClusterGroup[];
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
}

const ClusterCardView: React.FC<ClusterCardViewProps> = ({ clusters, onUpdateKeyword }) => {
  const [usedPriorityNumbers, setUsedPriorityNumbers] = useState<number[]>([]);

  // Move keywords with assigned priorities to the top
  const getSortedItems = (items: ClusterItem[]) => {
    return [...items].sort((a, b) => {
      if (a.priority && b.priority) return a.priority - b.priority;
      if (a.priority) return -1;
      if (b.priority) return 1;
      return 0;
    });
  };

  // Handle priority selection
  const handlePriorityChange = (clusterName: string, keyword: string, priorityStr: string) => {
    const priority = parseInt(priorityStr, 10);
    
    // Check if this priority is already used
    if (usedPriorityNumbers.includes(priority) && priorityStr !== '0') {
      alert(`Priority ${priority} is already assigned to another keyword.`);
      return;
    }
    
    // Find current priority of this keyword
    const cluster = clusters.find(c => c.clusterName === clusterName);
    const item = cluster?.items.find(i => i.keyword === keyword);
    const currentPriority = item?.priority || 0;
    
    // Update used priorities
    setUsedPriorityNumbers(prev => {
      const newPriorities = prev.filter(p => p !== currentPriority);
      if (priority > 0) {
        newPriorities.push(priority);
      }
      return newPriorities;
    });
    
    // Update the keyword
    onUpdateKeyword(clusterName, keyword, { 
      priority,
      status: priority > 0 ? 'Select for Blog Creation' : 'Keep for Future'
    });
  };

  return (
    <div className="space-y-6">
      {clusters.map((cluster) => (
        <Card key={cluster.clusterName} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">{cluster.clusterName}</CardTitle>
            <CardDescription>
              {cluster.coreTopic && <div><strong>Core Topic:</strong> {cluster.coreTopic}</div>}
              {cluster.intentPattern && <div><strong>Intent Pattern:</strong> {cluster.intentPattern}</div>}
              {cluster.reasoning && <div><strong>Reasoning:</strong> {cluster.reasoning}</div>}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              {getSortedItems(cluster.items).map((item, index) => (
                <div 
                  key={`${item.keyword}-${index}`} 
                  className="p-3 rounded-md border bg-card hover:bg-accent/5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-medium">Keyword:</div>
                        <div>{item.keyword}</div>
                        
                        {item.category && (
                          <Badge variant="outline" className="ml-auto">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Monthly Searches:</span>{' '}
                          <span className="font-medium">
                            {item.monthlySearchVolume !== null ? item.monthlySearchVolume.toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Difficulty:</span>{' '}
                          <span className="font-medium">
                            {item.keywordDifficulty !== null ? item.keywordDifficulty : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Competition:</span>{' '}
                          <span className="font-medium">
                            {item.competition || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CPC:</span>{' '}
                          <span className="font-medium">
                            {item.cpc !== null ? `$${item.cpc.toFixed(2)}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center justify-end">
                      <div>
                        <Select
                          value={String(item.priority || 0)}
                          onValueChange={(value) => 
                            handlePriorityChange(cluster.clusterName, item.keyword, value)
                          }
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No Priority</SelectItem>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                              <SelectItem 
                                key={num} 
                                value={String(num)}
                                disabled={usedPriorityNumbers.includes(num) && num !== item.priority}
                              >
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Select
                          value={item.status || 'Select for Blog Creation'}
                          onValueChange={(value: string) => 
                            onUpdateKeyword(cluster.clusterName, item.keyword, {
                              status: value as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future'
                            })
                          }
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClusterCardView;
