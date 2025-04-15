
import React from 'react';
import { Helmet } from 'react-helmet';

const Careers = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>Careers - Insight Writer AI</title>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Join Our Team</h1>
        <p className="text-muted-foreground mb-4">
          Exciting opportunities to work with cutting-edge AI technology. Current job openings will be posted soon.
        </p>
      </div>
    </div>
  );
};

export default Careers;
