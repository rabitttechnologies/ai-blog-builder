
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { PenTool } from 'lucide-react';

const ArticleWriterOverview = () => {
  const navigate = useNavigate();
  const { resetWorkflow } = useArticleWriter();
  
  const handleStartWriting = () => {
    resetWorkflow();
    navigate('/article-writer/title-description');
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Article Writer AI Agent</h1>
        <p className="text-lg text-gray-600">Create high-quality articles with AI assistance</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <PenTool className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-xl font-semibold">Create New Article</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Start writing a new article with our AI article writer. Our system will guide you through the process from selecting a title to generating the final content.
          </p>
          
          <Button onClick={handleStartWriting} className="w-full">
            Start Writing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleWriterOverview;
