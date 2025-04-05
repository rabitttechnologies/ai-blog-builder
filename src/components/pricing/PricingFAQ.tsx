
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PricingFAQ: React.FC = () => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Insight Writer AI?</AccordionTrigger>
          <AccordionContent>
            Insight Writer AI is an AI-powered platform that helps you create SEO-optimized blog posts quickly and easily.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Is there a free trial?</AccordionTrigger>
          <AccordionContent>
            Yes, we offer a 14-day free trial with 2 blog posts so you can experience the power of our platform before committing.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I upgrade or downgrade my plan later?</AccordionTrigger>
          <AccordionContent>
            Yes, you can change your plan at any time. If you upgrade, we'll prorate the difference. If you downgrade, the new rate will apply at your next billing cycle.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards through our secure payment processor, Stripe.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PricingFAQ;
