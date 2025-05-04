
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
