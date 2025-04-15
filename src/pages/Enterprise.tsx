
import React from 'react';
import { Helmet } from 'react-helmet';

const Enterprise = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>Enterprise Solutions - Insight Writer AI</title>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Enterprise Solutions</h1>
        <p className="text-muted-foreground mb-4">
          Discover scalable AI writing solutions for your enterprise. Custom integrations and dedicated support available.
        </p>
      </div>
    </div>
  );
};

export default Enterprise;
