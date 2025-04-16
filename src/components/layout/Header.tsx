
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";

// Import our new components
import NavItems from "./navigation/NavItems";
import UserDropdown from "./navigation/UserDropdown";
import AuthButtons from "./navigation/AuthButtons";
import MobileMenu from "./navigation/MobileMenu";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-wide flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400"
        >
          Insight Writer AI
        </Link>

        {/* Desktop Navigation */}
        <NavItems />

        {/* Auth Buttons or User Menu */}
        {isAuthenticated ? (
          <UserDropdown user={user} onLogout={handleLogout} />
        ) : (
          <AuthButtons />
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
