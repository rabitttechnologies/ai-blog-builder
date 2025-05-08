
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const KeywordEntryStep = () => {
  const navigate = useNavigate();
  const { setCurrentStep, keywordForm, updateKeywordForm } = useArticleWriter();

  // Set current step when component mounts
  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handleBack = () => {
    navigate('/article-writer');
  };

  const handleContinue = () => {
    navigate('/article-writer/select-keywords');
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Enter Keywords - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Enter Keywords</h1>
          <p className="text-gray-600">
            Start by entering the main keyword for your article.
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Keyword Entry Form</h2>
              <p className="text-gray-500">
                Enter a keyword or phrase to generate content ideas.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex items-center"
          >
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KeywordEntryStep;
