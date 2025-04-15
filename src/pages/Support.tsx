
import React from 'react';
import { Helmet } from 'react-helmet';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>Support - Insight Writer AI</title>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Customer Support</h1>
        <p className="text-muted-foreground mb-4">
          Need help? Our support team is here to assist you. We'll be adding more support resources soon.
        </p>
      </div>
    </div>
  );
};

export default Support;
