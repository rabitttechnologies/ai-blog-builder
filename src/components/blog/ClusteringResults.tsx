
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/Button';

interface ClusterItem {
  keyword: string;
  monthlySearchVolume: number | null;
  keywordDifficulty: number | null;
  competition: string | null;
  searchIntent: string | null;
  reasoning: string | null;
  cpc: number | null;
}

interface ClusterGroup {
  clusterName: string;
  intentPattern: string;
  coreTopic: string;
  reasoning: string;
  items: ClusterItem[];
}

interface ClusteringResultsProps {
  clusters: ClusterGroup[];
  workflowId: string;
  executionId: string;
  onClose: () => void;
}

const ClusteringResults: React.FC<ClusteringResultsProps> = ({
  clusters,
  workflowId,
  executionId,
  onClose
}) => {
  if (!clusters || clusters.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No clusters found</h3>
        <p className="text-muted-foreground mb-4">No clustering data is available for this analysis.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Keyword Clustering Results</h3>
          <p className="text-sm text-muted-foreground">
            Workflow ID: {workflowId} | Execution ID: {executionId}
          </p>
        </div>
        <Button onClick={onClose}>Close Results</Button>
      </div>

      {clusters.map((cluster, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{cluster.clusterName}</CardTitle>
            <CardDescription>
              <strong>Intent Pattern:</strong> {cluster.intentPattern}<br />
              <strong>Core Topic:</strong> {cluster.coreTopic}<br />
              <strong>Reasoning:</strong> {cluster.reasoning}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Monthly Searches</TableHead>
                    <TableHead className="text-right">Keyword Difficulty</TableHead>
                    <TableHead className="text-right">Competition</TableHead>
                    <TableHead className="text-right">Search Intent</TableHead>
                    <TableHead className="text-right">CPC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cluster.items.map((item, itemIndex) => (
                    <TableRow key={itemIndex}>
                      <TableCell className="font-medium">{item.keyword}</TableCell>
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
                        {item.cpc !== null ? `$${item.cpc.toFixed(2)}` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={onClose}>Close Clustering Results</Button>
      </div>
    </div>
  );
};

export default ClusteringResults;
