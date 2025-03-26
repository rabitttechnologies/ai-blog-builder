
import React from "react";

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container-wide">
        <div className="text-center mb-16">
          <div className="badge badge-primary mb-3">Testimonials</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of content creators who have streamlined their workflow with Insight Writer AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
                alt="Sarah Johnson" 
                className="h-12 w-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-sm text-foreground/70">Content Marketer</p>
              </div>
            </div>
            <p className="text-foreground/80">
              "Insight Writer AI has cut my content creation time in half while improving the quality of my blogs. The keyword research feature is especially valuable."
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                alt="Michael Chen" 
                className="h-12 w-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold">Michael Chen</h4>
                <p className="text-sm text-foreground/70">SEO Specialist</p>
              </div>
            </div>
            <p className="text-foreground/80">
              "The SEO optimization is fantastic. Our organic traffic has increased by 40% since we started using Insight Writer AI for our content strategy."
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                alt="Emily Rodriguez" 
                className="h-12 w-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold">Emily Rodriguez</h4>
                <p className="text-sm text-foreground/70">Small Business Owner</p>
              </div>
            </div>
            <p className="text-foreground/80">
              "As someone who isn't a natural writer, Insight Writer AI has been a game-changer for my business blog. It's like having a content team at a fraction of the cost."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
