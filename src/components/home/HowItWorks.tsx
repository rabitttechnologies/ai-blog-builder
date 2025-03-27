
import React, { useEffect, useRef } from "react";
import { Search, BarChart3, FileText, Sparkles } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const steps = [
  {
    number: 1,
    title: "Input a keyword",
    description: "Enter your main keyword or topic that you want to create content about.",
    icon: <Search className="h-6 w-6 text-primary" />,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    number: 2,
    title: "Get historical and relevant search data",
    description: "Our AI analyzes search patterns and generates insights based on real user behavior.",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    number: 3,
    title: "Choose your title and Short Description",
    description: "Select from AI-generated titles and descriptions optimized for your keyword.",
    icon: <FileText className="h-6 w-6 text-primary" />,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    number: 4,
    title: "Let AI create your article",
    description: "Our AI generates a complete, SEO-optimized article that's ready to publish or customize.",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  }
];

const HowItWorks: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!api) return;
    
    // Start autoplay
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <div className="badge badge-primary mb-3">Workflow</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Insight Writer AI Works</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            From keywords to published content in minutes, not days.
          </p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {steps.map((step, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <Card className="h-full">
                  <CardHeader className="relative pb-2">
                    <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 ml-6">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold mb-3 pt-1">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 mb-4">
                      {step.description}
                    </p>
                    <img
                      src={step.image}
                      alt={step.title}
                      className="rounded-lg w-full aspect-video object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        <div className="mt-16 text-center">
          <Link to="/signup">
            <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
              Start Creating Content
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
