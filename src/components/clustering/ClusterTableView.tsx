
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ClusterGroup, ClusterItem } from '@/types/clustering';

interface ClusterTableViewProps {
  clusters: ClusterGroup[];
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
}

const ClusterTableView: React.FC<ClusterTableViewProps> = ({ clusters, onUpdateKeyword }) => {
  return (
    <>
      {clusters.map((cluster, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>{cluster.clusterName}</CardTitle>
            <CardDescription>
              <strong>Intent Pattern:</strong> {cluster.intentPattern}<br />
              <strong>Core Topic:</strong> {cluster.coreTopic}<br />
              <strong>Reasoning:</strong> {cluster.reasoning}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Priority</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Monthly Vol</TableHead>
                    <TableHead className="text-right">Difficulty</TableHead>
                    <TableHead className="text-right">Competition</TableHead>
                    <TableHead className="text-right">Intent</TableHead>
                    <TableHead className="text-right">Category</TableHead>
                    <TableHead className="text-right">CPC</TableHead>
                    <TableHead className="w-[180px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cluster.items.map((item, itemIndex) => (
                    <TableRow key={itemIndex}>
                      <TableCell>
                        <Select 
                          value={item.priority ? item.priority.toString() : "0"} 
                          onValueChange={(value) => onUpdateKeyword(cluster.clusterName, item.keyword, { priority: parseInt(value) })}
                        >
                          <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="#" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">-</SelectItem>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.isEditing ? (
                          <div className="flex items-center">
                            <Input 
                              value={item.keyword} 
                              onChange={(e) => onUpdateKeyword(cluster.clusterName, item.keyword, { keyword: e.target.value })}
                              className="h-8 mr-2"
                            />
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8" 
                              onClick={() => onUpdateKeyword(cluster.clusterName, item.keyword, { isEditing: false })}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div 
                            className="cursor-pointer hover:text-primary" 
                            onClick={() => onUpdateKeyword(cluster.clusterName, item.keyword, { isEditing: true })}
                          >
                            {item.keyword}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.monthlySearchVolume !== null
                          ? item.monthlySearchVolume.toLocaleString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.keywordDifficulty !== null ? item.keywordDifficulty : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.competition || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.searchIntent || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.category || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.cpc !== null ? `$${item.cpc.toFixed(2)}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status || 'Select for Blog Creation'}
                          onValueChange={(value) => onUpdateKeyword(cluster.clusterName, item.keyword, { 
                            status: value as 'Select for Blog Creation' | 'Reject for Blog Creation' | 'Keep for Future' 
                          })}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Select for Blog Creation">Select for Blog Creation</SelectItem>
                            <SelectItem value="Reject for Blog Creation">Reject for Blog Creation</SelectItem>
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
      ))}
    </>
  );
};

export default ClusterTableView;
