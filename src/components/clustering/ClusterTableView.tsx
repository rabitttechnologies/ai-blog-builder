
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown } from 'lucide-react';
import useSortableTable from '@/hooks/useSortableTable';
import type { ClusterGroup, ClusterItem } from '@/types/clustering';

interface ClusterTableViewProps {
  clusters: ClusterGroup[];
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
}

const ClusterTableView: React.FC<ClusterTableViewProps> = ({ clusters, onUpdateKeyword }) => {
  const [usedPriorityNumbers, setUsedPriorityNumbers] = useState<number[]>([]);
  const [sortField, setSortField] = useState<string>('keyword');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Flatten all items from all clusters
  const allItems = clusters.flatMap(cluster => 
    cluster.items.map(item => ({
      ...item,
      clusterName: cluster.clusterName
    }))
  );

  // Sort items based on current sort configuration
  const sortedItems = [...allItems].sort((a, b) => {
    // First, sort by priority
    const priorityA = a.priority || Number.MAX_SAFE_INTEGER;
    const priorityB = b.priority || Number.MAX_SAFE_INTEGER;
    
    if (priorityA !== Number.MAX_SAFE_INTEGER && priorityB !== Number.MAX_SAFE_INTEGER) {
      return priorityA - priorityB;
    }
    
    if (priorityA !== Number.MAX_SAFE_INTEGER) return -1;
    if (priorityB !== Number.MAX_SAFE_INTEGER) return 1;
    
    // Then sort by the selected field
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    // Compare based on type
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // For numeric values
    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline" />
      : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  // Handle priority selection
  const handlePriorityChange = (clusterName: string, keyword: string, priorityStr: string) => {
    const priority = parseInt(priorityStr, 10);
    
    // Check if this priority is already used
    if (usedPriorityNumbers.includes(priority) && priorityStr !== '0') {
      alert(`Priority ${priority} is already assigned to another keyword.`);
      return;
    }
    
    // Get current priority
    const currentItem = allItems.find(item => 
      item.clusterName === clusterName && item.keyword === keyword
    );
    const currentPriority = currentItem?.priority || 0;
    
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

  // Generate priority options (1-10)
  const priorityOptions = [
    { value: '0', label: 'No Priority' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(i + 1),
      label: String(i + 1)
    }))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keywords by Cluster</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('keyword')}
                >
                  Keyword {renderSortIndicator('keyword')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('clusterName')}
                >
                  Cluster {renderSortIndicator('clusterName')}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('monthlySearchVolume')}
                >
                  Monthly Searches {renderSortIndicator('monthlySearchVolume')}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('keywordDifficulty')}
                >
                  Difficulty {renderSortIndicator('keywordDifficulty')}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('competition')}
                >
                  Competition {renderSortIndicator('competition')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  Category {renderSortIndicator('category')}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('cpc')}
                >
                  CPC {renderSortIndicator('cpc')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {renderSortIndicator('status')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item, index) => (
                <TableRow key={`${item.clusterName}-${item.keyword}-${index}`}>
                  <TableCell>
                    <Select
                      value={String(item.priority || 0)}
                      onValueChange={(value) => 
                        handlePriorityChange(item.clusterName, item.keyword, value)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            disabled={usedPriorityNumbers.includes(parseInt(option.value, 10)) && 
                                    option.value !== '0' && 
                                    option.value !== String(item.priority)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-medium">{item.keyword}</TableCell>
                  <TableCell>{item.clusterName}</TableCell>
                  <TableCell className="text-right">
                    {item.monthlySearchVolume !== null ? item.monthlySearchVolume.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.keywordDifficulty !== null ? item.keywordDifficulty : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.competition || 'N/A'}
                  </TableCell>
                  <TableCell>{item.category || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    {item.cpc !== null ? `$${item.cpc.toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.status || 'Select for Blog Creation'}
                      onValueChange={(value: string) => 
                        onUpdateKeyword(item.clusterName, item.keyword, {
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterTableView;
