
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us | Insight Writer AI</title>
        <meta name="description" content="Get in touch with the Insight Writer AI team. We're here to answer your questions and help you get the most out of our AI content creation platform." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Get in Touch
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Have questions or need help? We're here for you. Reach out and we'll respond as quickly as possible.
            </p>
          </div>
        </section>
        
        {/* Contact info and form */}
        <section className="py-20">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact information */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-6 flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                      <p className="text-foreground/70 mb-1">General Inquiries:</p>
                      <a href="mailto:info@insightwriter.ai" className="text-primary hover:text-primary/80 transition-colors">
                        info@insightwriter.ai
                      </a>
                      <p className="text-foreground/70 mt-3 mb-1">Support:</p>
                      <a href="mailto:support@insightwriter.ai" className="text-primary hover:text-primary/80 transition-colors">
                        support@insightwriter.ai
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-6 flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                      <p className="text-foreground/70 mb-1">Support Hotline:</p>
                      <a href="tel:+1-800-123-4567" className="text-primary hover:text-primary/80 transition-colors">
                        +1 (800) 123-4567
                      </a>
                      <p className="text-foreground/70 mt-3 mb-1">Hours:</p>
                      <p>Monday - Friday, 9 AM - 6 PM ET</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-6 flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                      <p className="text-foreground/70 mb-1">Headquarters:</p>
                      <address className="not-italic">
                        123 Innovation Way<br />
                        Suite 400<br />
                        San Francisco, CA 94107<br />
                        United States
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-6 flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                      <p className="text-foreground/70 mb-4">Get immediate assistance through our live chat.</p>
                      <Button variant="outline" size="sm">
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact form */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
                
                <div className="glass p-8 rounded-xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        placeholder="Please describe your inquiry in detail..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {[
                  {
                    question: "How quickly can I expect a response?",
                    answer: "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please use our live chat or phone support for immediate assistance."
                  },
                  {
                    question: "Do you offer demo sessions for teams?",
                    answer: "Yes! We offer personalized demos for teams and businesses. Please fill out the contact form and select 'Request Demo' as the subject, and our sales team will arrange a suitable time."
                  },
                  {
                    question: "Where can I find tutorials and guides?",
                    answer: "We have comprehensive documentation, tutorials, and guides available in our Help Center. You can also check our YouTube channel for video tutorials."
                  },
                  {
                    question: "Do you offer enterprise solutions?",
                    answer: "Absolutely. Our enterprise solutions include custom integrations, dedicated support, and tailored features for large organizations. Contact our sales team to discuss your specific requirements."
                  }
                ].map((faq, index) => (
                  <details key={index} className="glass p-6 rounded-xl group">
                    <summary className="list-none flex justify-between cursor-pointer font-medium text-lg">
                      {faq.question}
                      <span className="text-primary transition-transform group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="mt-4 text-foreground/70">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
