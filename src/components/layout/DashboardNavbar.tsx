
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";

type DashboardNavbarProps = {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
};

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  isMobileMenuOpen,
  toggleMobileMenu
}) => (
  <header className="bg-white shadow-sm sticky top-0 z-10">
    <div className="container max-w-6xl py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="md:hidden mr-2 text-foreground/70"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
        <Link to="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          Insight Writer AI
        </Link>
      </div>
      <div className="flex items-center">
        <UserMenu />
      </div>
    </div>
  </header>
);

export default DashboardNavbar;
