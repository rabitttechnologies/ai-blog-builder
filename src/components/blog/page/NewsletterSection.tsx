
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold mb-4">Get the Latest Content Tips</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Subscribe to our newsletter for weekly insights on AI content creation, SEO, and more.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 text-white placeholder:text-white/60 border-white/30 focus-visible:ring-white"
          />
          <Button className="bg-white text-blue-600 hover:bg-white/90" type="submit">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
