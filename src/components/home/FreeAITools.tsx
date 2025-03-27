
import React from "react";
import { Sparkles, Pencil, PenTool, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "AI Title Generator",
    description: "Generate SEO-optimized blog titles based on your keywords and niche.",
    icon: <Pencil className="h-6 w-6 text-primary" />,
    link: "/tools/title-generator",
  },
  {
    title: "Meta Description Writer",
    description: "Create compelling meta descriptions that improve click-through rates.",
    icon: <PenTool className="h-6 w-6 text-primary" />,
    link: "/tools/meta-description",
  },
  {
    title: "Keyword Research Tool",
    description: "Discover high-potential keywords related to your content topics.",
    icon: <Search className="h-6 w-6 text-primary" />,
    link: "/tools/keyword-research",
  },
  {
    title: "Content Analyzer",
    description: "Analyze your content for SEO optimization and readability.",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    link: "/tools/content-analyzer",
  },
];

const FreeAITools: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <div className="badge badge-primary mb-3">Free Resources</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Free AI Tools</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Try these powerful AI tools to enhance your content strategy at no cost.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div key={index} className="glass p-6 rounded-xl card-hover">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
              <p className="text-foreground/70 mb-4">
                {tool.description}
              </p>
              <Link to={tool.link}>
                <Button variant="outline" size="sm" className="w-full">
                  Try Now
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/tools">
            <Button 
              rightIcon={<Sparkles className="h-4 w-4" />}
              variant="secondary"
            >
              Explore All Free Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreeAITools;
