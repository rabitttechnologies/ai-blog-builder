
import React, { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Marketer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    quote: "Insight Writer AI has cut my content creation time in half while improving the quality of my blogs. The keyword research feature is especially valuable. We've saved over 200 hours of research time in just one quarter.",
    stats: "40% increase in organic traffic"
  },
  {
    name: "Michael Chen",
    role: "SEO Specialist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    quote: "The SEO optimization is fantastic. Our organic traffic has increased by 40% since we started using Insight Writer AI for our content strategy. We've saved approximately $5,000 per month in content creation costs.",
    stats: "60% reduction in content production costs"
  },
  {
    name: "Emily Rodriguez",
    role: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "As someone who isn't a natural writer, Insight Writer AI has been a game-changer for my business blog. It's like having a content team at a fraction of the cost. I've saved thousands of hours on keyword research and content creation.",
    stats: "Rank #1 for 3 competitive keywords"
  },
  {
    name: "James Wilson",
    role: "Digital Marketing Manager",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote: "Our blog traffic increased by 135% within three months of using Insight Writer AI. The content is not only SEO-friendly but also genuinely helpful to our audience. We've saved countless hours on keyword research and content creation.",
    stats: "135% increase in blog traffic"
  },
  {
    name: "Sophia Garcia",
    role: "E-commerce Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    quote: "The ROI with Insight Writer AI has been incredible. Our product descriptions and blog content are driving more organic traffic and conversions than ever before. We've saved over 400 hours on content creation in six months.",
    stats: "52% increase in organic conversions"
  },
  {
    name: "Daniel Kim",
    role: "Content Creator",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote: "I can now produce high-quality, SEO-optimized content in a quarter of the time it used to take me. Insight Writer AI has transformed my workflow and allowed me to take on twice as many clients. It's saved me thousands of hours of research time.",
    stats: "100% increase in content production capacity"
  },
  {
    name: "Olivia Thompson",
    role: "Travel Blogger",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    quote: "My travel blog now ranks on the first page for multiple competitive keywords thanks to Insight Writer AI. The tool has saved me countless hours of research and writing time, allowing me to focus on creating travel experiences to share.",
    stats: "First page rankings for 7 target keywords"
  },
  {
    name: "Robert Patel",
    role: "B2B Marketing Director",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    quote: "Our content marketing ROI has increased by 85% since implementing Insight Writer AI. The tool has enabled us to produce more targeted, high-quality content while reducing our resource allocation by half. It's saved us millions in content creation costs.",
    stats: "85% increase in content marketing ROI"
  },
  {
    name: "Natalie Wong",
    role: "Startup Founder",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
    quote: "As a startup, we couldn't afford a full content team. Insight Writer AI has allowed us to compete with established brands by producing high-quality content that ranks well. We've saved at least 30 hours per week on content creation.",
    stats: "Competing with industry leaders with 1/10th the budget"
  },
  {
    name: "Thomas Anderson",
    role: "SaaS Marketing Lead",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    quote: "Our organic lead generation has increased by 78% since using Insight Writer AI to revamp our blog strategy. The time and resources saved on content creation have allowed us to focus on other growth initiatives. We've saved millions of hours collectively.",
    stats: "78% increase in organic lead generation"
  }
];

const Testimonials: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!api) return;
    
    // Start autoplay with 6-second intervals
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 6000);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  return (
    <section className="py-20 bg-secondary">
      <div className="container-wide">
        <div className="text-center mb-16">
          <div className="badge badge-primary mb-3">Testimonials</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of content creators who have streamlined their workflow with Insight Writer AI, saved millions of hours for keyword research and content creation.
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
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="glass p-6 rounded-xl h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-primary/20"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-foreground/70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 mb-4 flex-1">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-auto">
                    <div className="badge badge-secondary p-2">{testimonial.stats}</div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
