
import React from "react";
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
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <div className="w-full py-6 sm:py-10">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {benefitItems.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <Card className="glass card-hover h-full transition-all duration-300 hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative inset-auto translate-y-0" />
          <CarouselNext className="relative inset-auto translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default BenefitsSlider;
