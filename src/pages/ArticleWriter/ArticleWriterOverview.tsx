
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { PenTool, FileText, CheckCircle, XCircle } from 'lucide-react';

const ArticleWriterOverview = () => {
  const navigate = useNavigate();
  const { resetWorkflow, currentStep } = useArticleWriter();
  
  const handleNewArticle = () => {
    resetWorkflow();
    navigate('/article-writer/keyword');
  };
  
  const handleContinue = () => {
    // Determine which step to continue from
    const nextRoute = getRouteForStep(currentStep);
    navigate(nextRoute);
  };
  
  const getRouteForStep = (step: number) => {
    switch(step) {
      case 1:
        return '/article-writer/keyword';
      case 2:
        return '/article-writer/select-keywords';
      case 3:
        return '/article-writer/title-description';
      case 4:
        return '/article-writer/outline';
      case 5:
        return '/article-writer/generated';
      default:
        return '/article-writer/keyword';
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Article Writer AI Agent - Insight Writer AI</title>
      </Helmet>
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Article Writer AI Agent</h1>
          <p className="text-lg text-gray-600">Create high-quality articles with our AI-powered workflow</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <PenTool className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-xl font-semibold">Create New Article</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Start fresh with a new article. Our AI agent will guide you through each step of the process:
              </p>
              
              <ol className="space-y-4 mb-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                  <div>
                    <h3 className="font-medium">Enter a keyword</h3>
                    <p className="text-sm text-gray-500">Start with a primary keyword for your article</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                  <div>
                    <h3 className="font-medium">Select Keywords</h3>
                    <p className="text-sm text-gray-500">Choose related keywords to include in your article</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                  <div>
                    <h3 className="font-medium">Title & Description</h3>
                    <p className="text-sm text-gray-500">Select or customize the perfect title and description</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                  <div>
                    <h3 className="font-medium">Article Outline</h3>
                    <p className="text-sm text-gray-500">Review and customize the article structure</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5">5</span>
                  <div>
                    <h3 className="font-medium">Generated Article</h3>
                    <p className="text-sm text-gray-500">Get your complete, ready-to-use article</p>
                  </div>
                </li>
              </ol>
              
              <Button onClick={handleNewArticle} className="w-full">
                Create New Article
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-xl font-semibold">Current Progress</h2>
              </div>
              
              {currentStep > 1 ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-600">
                        You have an article in progress (Step {currentStep} of 5)
                      </span>
                    </div>
                    
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(currentStep / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button onClick={handleContinue} variant="outline" className="w-full mb-3">
                    Continue Where You Left Off
                  </Button>
                  
                  <Button onClick={handleNewArticle} variant="ghost" className="w-full">
                    Start a New Article Instead
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center mb-6">
                    You don't have any articles in progress.<br />
                    Start creating your first article now!
                  </p>
                  <Button onClick={handleNewArticle} variant="outline" className="w-full">
                    Create New Article
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleWriterOverview;
