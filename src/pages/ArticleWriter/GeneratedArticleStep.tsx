
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useArticleWriter } from '@/context/articleWriter/ArticleWriterContext';
import { Card } from '@/components/ui/card';
import { ChevronLeft, FileText, Copy, Download, RefreshCw, Share, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useBlogPosts } from '@/hooks/useBlogPosts';

// Mock article content
const mockArticleContent = `
<h1>Sustainable Gardening: 10 Eco-Friendly Tips for a Greener Garden</h1>

<p>Sustainable gardening is not just a trend but a necessary approach to creating outdoor spaces that work in harmony with nature. By adopting eco-friendly gardening practices, you can reduce your environmental impact while creating a beautiful, thriving garden that supports local ecosystems.</p>

<h2>What is Sustainable Gardening?</h2>

<p>Sustainable gardening is an approach that minimizes environmental impact while maximizing the garden's benefits. It involves working with nature rather than against it, conserving resources, and creating habitats for wildlife.</p>

<p>The core principles of sustainable gardening include:</p>

<ul>
  <li>Conserving water and energy</li>
  <li>Reducing waste and recycling materials</li>
  <li>Avoiding chemical pesticides and fertilizers</li>
  <li>Supporting local biodiversity</li>
  <li>Building healthy soil naturally</li>
</ul>

<p>By embracing these principles, you can create a garden that's not only beautiful but also environmentally responsible.</p>

<h2>Water Conservation Techniques</h2>

<p>Water is one of our most precious resources, and sustainable gardens are designed to use it wisely. Here are some effective methods for reducing water usage:</p>

<p><strong>Rainwater harvesting:</strong> Collect rainwater in barrels or tanks to use during dry periods. A simple rain barrel can save thousands of gallons of water annually.</p>

<p><strong>Drip irrigation:</strong> Install drip systems that deliver water directly to plant roots, reducing evaporation and runoff compared to sprinklers.</p>

<p><strong>Proper mulching:</strong> Apply 2-3 inches of organic mulch around plants to retain soil moisture, suppress weeds, and gradually add nutrients to the soil as it breaks down.</p>

<p><strong>Drought-tolerant plants:</strong> Choose native and adapted plants that require minimal supplemental watering once established.</p>

<h2>Chemical-Free Pest Management</h2>

<p>Conventional pesticides can harm beneficial insects, soil microorganisms, and potentially human health. Sustainable gardens rely on natural methods of pest control:</p>

<p><strong>Companion planting:</strong> Grow plants that naturally repel pests or attract beneficial insects. For example, marigolds deter many garden pests, while flowering herbs attract pollinators and predatory insects.</p>

<p><strong>Beneficial insects:</strong> Encourage ladybugs, lacewings, and predatory wasps that feed on common garden pests.</p>

<p><strong>Organic solutions:</strong> Use homemade remedies like garlic or soap sprays for specific pest problems.</p>

<p><strong>Prevention:</strong> Keep plants healthy with proper spacing, cleaning up debris, and rotating crops to prevent pest and disease cycles.</p>

<h2>Composting Fundamentals</h2>

<p>Composting is the cornerstone of sustainable gardening. It recycles kitchen and yard waste into valuable soil amendment while keeping these materials out of landfills.</p>

<p>To start composting:</p>

<ol>
  <li>Choose a location that's convenient but not too close to your home</li>
  <li>Create a balance of "green" materials (nitrogen-rich items like food scraps and grass clippings) and "brown" materials (carbon-rich items like dried leaves and paper)</li>
  <li>Keep the pile moderately moist and turn it occasionally to introduce oxygen</li>
  <li>Be patient—compost typically takes 3-12 months to fully mature</li>
</ol>

<p>The resulting compost will improve soil structure, add nutrients, and enhance microbial activity in your garden.</p>

<h2>Native Plant Selection</h2>

<p>Native plants are adapted to your local climate, soil conditions, and wildlife. They offer numerous advantages:</p>

<ul>
  <li>Require less water once established</li>
  <li>Need little or no fertilizer</li>
  <li>Provide appropriate habitat for local wildlife</li>
  <li>Maintain regional biodiversity</li>
  <li>Generally have fewer pest problems</li>
</ul>

<p>Research native plants for your area through local extension offices, native plant societies, or botanical gardens. Even incorporating some natives into a conventional garden can make a significant difference.</p>

<h2>Soil Health Management</h2>

<p>Healthy soil is alive with beneficial organisms that support plant growth naturally. To nurture soil health:</p>

<p><strong>Soil testing:</strong> Understand your soil's pH and nutrient profile before making amendments.</p>

<p><strong>Organic matter:</strong> Add compost regularly to improve structure, nutrition, and microbial activity.</p>

<p><strong>Cover crops:</strong> Plant "green manures" like clover or rye in off-seasons to prevent erosion, suppress weeds, and add nutrients when tilled under.</p>

<p><strong>Minimal tillage:</strong> Limit digging and turning of soil to prevent disruption of beneficial fungi and soil structure.</p>

<p>Healthy soil acts as a carbon sink, helping mitigate climate change while producing stronger plants that resist pests and diseases.</p>

<h2>Energy-Efficient Garden Design</h2>

<p>Thoughtful garden design can reduce resource use and maintenance requirements:</p>

<p><strong>Strategic tree planting:</strong> Position deciduous trees to shade your home in summer and allow sunlight in winter, reducing heating and cooling costs.</p>

<p><strong>Solar-powered features:</strong> Use solar lighting, pumps for water features, and battery-powered tools.</p>

<p><strong>Efficient layouts:</strong> Group plants with similar water needs together, create paths that minimize soil compaction, and design spaces that serve multiple purposes.</p>

<p>These design principles not only save energy but often create more functional and beautiful outdoor spaces.</p>

<h2>Sustainable Lawn Alternatives</h2>

<p>Traditional lawns require significant inputs of water, fertilizer, and maintenance. Consider these eco-friendly alternatives:</p>

<p><strong>Native meadows:</strong> Replace portions of lawn with native grasses and wildflowers that provide habitat for pollinators and require minimal care.</p>

<p><strong>Ground covers:</strong> Plant low-growing perennials like creeping thyme, clover, or native sedges in areas where you don't need traditional turf.</p>

<p><strong>Edible landscapes:</strong> Transform lawn areas into productive gardens growing fruits, vegetables, and herbs.</p>

<p><strong>Eco-friendly turf:</strong> If you do maintain lawn areas, choose drought-resistant varieties, mow higher (3-4 inches), leave clippings in place, and avoid chemical inputs.</p>

<h2>Resource-Efficient Gardening Tools</h2>

<p>The tools and materials you choose can significantly impact your garden's sustainability:</p>

<p><strong>Manual tools:</strong> Hand tools often work as well as power equipment for small gardens while providing exercise and eliminating emissions.</p>

<p><strong>Electric equipment:</strong> When power tools are necessary, choose electric over gas-powered models.</p>

<p><strong>Recycled materials:</strong> Use salvaged materials for garden structures, containers, and edges.</p>

<p><strong>Water-saving tools:</strong> Invest in moisture meters, rain sensors for irrigation systems, and water timers to prevent overwatering.</p>

<p>Each sustainable choice adds up to significant resource conservation over time.</p>

<h2>Creating Wildlife Habitats</h2>

<p>A sustainable garden becomes part of the local ecosystem by providing for wildlife:</p>

<p><strong>Diverse plantings:</strong> Include plants that flower and fruit in different seasons to provide year-round food sources.</p>

<p><strong>Water features:</strong> Even small water sources like bird baths or shallow dishes provide essential hydration for wildlife.</p>

<p><strong>Shelter:</strong> Leave some areas "wild" with brush piles, unmulched areas for ground-nesting bees, and diverse plant structures.</p>

<p><strong>Nesting sites:</strong> Install bird houses, bat boxes, and insect hotels to provide safe spaces for beneficial creatures.</p>

<p>A wildlife-friendly garden comes alive with movement, sound, and ecological interactions that make gardening more rewarding.</p>

<h2>Conclusion</h2>

<p>By implementing these sustainable gardening practices, you can create a beautiful outdoor space that not only brings you joy but also contributes positively to the environment. Start with small changes and gradually transform your garden into an eco-friendly haven that future generations will thank you for.</p>

<p>Remember that sustainable gardening is a journey rather than a destination. Each eco-friendly choice you make contributes to a healthier planet, no matter the size of your garden or your experience level. The rewards—from vibrant flowers and nutritious harvests to visiting butterflies and birds—make the effort well worthwhile.</p>
`;

const GeneratedArticleStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    keywordForm,
    selectedTitleDescription,
    selectedOutline,
    setCurrentStep,
    generatedArticle,
    setGeneratedArticle
  } = useArticleWriter();
  
  const { refetch } = useBlogPosts();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // Update current step
    setCurrentStep(5);
    
    // If we don't have required data, redirect back
    if (!selectedOutline) {
      navigate('/article-writer/outline');
      return;
    }
    
    // If we don't have a generated article yet, generate one now
    if (!generatedArticle) {
      generateArticle();
    }
  }, [setCurrentStep, selectedOutline, navigate, generatedArticle]);
  
  const generateArticle = () => {
    setIsLoading(true);
    
    // In a real implementation, this would call an API endpoint
    // For this demo, we'll just simulate a delay and set mock content
    setTimeout(() => {
      const newArticle = {
        id: 'article-1',
        title: selectedOutline?.title || '',
        content: mockArticleContent,
        metaDescription: selectedTitleDescription?.description || '',
        date: new Date().toISOString()
      };
      
      setGeneratedArticle(newArticle);
      setIsLoading(false);
      
      toast({
        title: "Article generated",
        description: "Your article has been successfully created."
      });
    }, 2000);
  };
  
  const handleCopyToClipboard = () => {
    if (!generatedArticle) return;
    
    // Create a plain text version of the article content
    const tempElement = document.createElement('div');
    tempElement.innerHTML = generatedArticle.content;
    const plainText = tempElement.textContent || tempElement.innerText;
    
    navigator.clipboard.writeText(plainText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Article content has been copied to your clipboard."
      });
    });
  };
  
  const handleSaveArticle = async () => {
    if (!generatedArticle) return;
    
    setIsSaving(true);
    
    // In a real implementation, this would save to your database
    // For this demo, we'll just simulate a delay
    setTimeout(() => {
      toast({
        title: "Article saved",
        description: "Your article has been saved to your blogs."
      });
      setIsSaving(false);
      
      // Refresh the blog posts list
      refetch();
      
      // Navigate to the blogs page after a short delay
      setTimeout(() => {
        navigate('/blogs');
      }, 1000);
    }, 1500);
  };
  
  const handleRegenerate = () => {
    generateArticle();
  };
  
  const handleBack = () => {
    navigate('/article-writer/outline');
  };
  
  if (isLoading || !generatedArticle) {
    return (
      <DashboardLayout>
        <Helmet>
          <title>Generating Article - Article Writer AI</title>
        </Helmet>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Generating Your Article</h1>
            <p className="text-gray-600">
              Our AI is creating your article about <span className="font-medium">{keywordForm.keyword}</span>. This may take a minute...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Generated Article - Article Writer AI</title>
      </Helmet>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Generated Article</h1>
          <p className="text-gray-600">
            Your article about <span className="font-medium">{keywordForm.keyword}</span> is ready! Review it below and make any final adjustments.
          </p>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-3">
          <Button 
            variant="outline"
            onClick={handleCopyToClipboard}
            className="flex items-center"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleRegenerate}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => window.open(`/blog/${generatedArticle.id}`, '_blank')}
            className="flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          <Button
            onClick={handleSaveArticle}
            isLoading={isSaving}
            className="flex items-center ml-auto"
          >
            <FileText className="h-4 w-4 mr-2" />
            Save to My Blogs
          </Button>
        </div>
        
        <Card className="mb-6">
          <div className="p-6 sm:p-8">
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: generatedArticle.content }} />
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
            onClick={handleSaveArticle}
            isLoading={isSaving}
          >
            Save Article
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneratedArticleStep;
