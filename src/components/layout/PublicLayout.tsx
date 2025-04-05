
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
