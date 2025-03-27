
import React, { useEffect, useRef } from "react";
import { 
  BarChart3, 
  Sparkles, 
  Clock, 
  MessageSquareText 
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { type CarouselApi } from "@/components/ui/carousel";

interface BenefitItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const benefitItems: BenefitItem[] = [
  {
    title: "Data-Driven",
    description: "Leverages historical search data for informed content creation.",
    icon: <BarChart3 className="h-12 w-12 text-primary" />
  },
  {
    title: "AI-Powered",
    description: "Uses advanced AI to generate engaging, SEO-friendly articles, meta descriptions, and headers.",
    icon: <Sparkles className="h-12 w-12 text-primary" />
  },
  {
    title: "Time-Saving",
    description: "Automates the research and writing process so you can focus on strategy.",
    icon: <Clock className="h-12 w-12 text-primary" />
  },
  {
    title: "Human-Like Quality",
    description: "AI trained on top-performing content across niches.",
    icon: <MessageSquareText className="h-12 w-12 text-primary" />
  },
];

const BenefitsSlider: React.FC = () => {
  const isMobile = useIsMobile();
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
    <div className="w-full py-6 sm:py-10">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: isMobile ? 1 : 2,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {benefitItems.map((item, index) => (
            <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
              <Card className="h-full transition-all duration-300 hover:shadow-lg border border-blue-100/40 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2 pt-6 flex items-center justify-center">
                  <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <CardTitle className="mb-2 text-xl font-semibold">{item.title}</CardTitle>
                  <CardDescription className="text-foreground/70 text-sm md:text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-6">
          <CarouselPrevious className="relative inset-auto translate-y-0 h-9 w-9" />
          <CarouselNext className="relative inset-auto translate-y-0 h-9 w-9" />
        </div>
      </Carousel>
    </div>
  );
};

export default BenefitsSlider;
