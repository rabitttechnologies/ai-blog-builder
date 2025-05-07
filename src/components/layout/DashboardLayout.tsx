
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileMenu from "./DashboardMobileMenu";

export type DashboardLayoutProps = {
  children?: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <DashboardNavbar 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu}
      />
      <div className="flex">
        {/* Sidebar for desktop */}
        <DashboardSidebar handleLogout={handleLogout} />
        {/* Mobile menu */}
        <DashboardMobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          handleLogout={handleLogout}
        />
        {/* Main content */}
        <main className="flex-1 min-w-0 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
