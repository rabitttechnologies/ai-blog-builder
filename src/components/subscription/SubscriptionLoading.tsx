
import React from "react";

export const SubscriptionLoading: React.FC = () => {
  return (
    <div className="glass p-6 rounded-xl text-center">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
};
