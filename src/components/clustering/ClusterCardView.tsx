
import React from 'react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import KeywordItem from './KeywordItem';
import type { ClusterGroup, ClusterItem } from '@/types/clustering';

interface ClusterCardViewProps {
  clusters: ClusterGroup[];
  onUpdateKeyword: (clusterName: string, keyword: string, updates: Partial<ClusterItem>) => void;
}

const ClusterCardView: React.FC<ClusterCardViewProps> = ({ clusters, onUpdateKeyword }) => {
  return (
    <div className="space-y-6">
      {clusters.map((cluster, index) => (
        <Accordion key={index} type="single" collapsible defaultValue={`item-${index}`}>
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger>
              <div className="flex flex-col items-start text-left">
                <div className="font-semibold">{cluster.clusterName}</div>
                <div className="text-sm text-muted-foreground">
                  {cluster.items.length} keywords · {cluster.coreTopic}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardHeader className="p-0 pb-4">
                  <CardDescription>
                    <strong>Intent Pattern:</strong> {cluster.intentPattern}<br />
                    <strong>Core Topic:</strong> {cluster.coreTopic}<br />
                    <strong>Reasoning:</strong> {cluster.reasoning}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3">
                    {cluster.items.map((item, itemIndex) => (
                      <KeywordItem
                        key={itemIndex}
                        item={item}
                        clusterName={cluster.clusterName}
                        onUpdateKeyword={onUpdateKeyword}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default ClusterCardView;
