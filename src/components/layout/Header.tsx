
import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChevronDown, Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          BlogCraft
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/features"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
              )
            }
          >
            Features
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
              )
            }
          >
            Pricing
          </NavLink>
          <div className="relative group">
            <button className="flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Resources
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 origin-top-left glass rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-1">
                <Link
                  to="/blog"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                >
                  Blog
                </Link>
                <Link
                  to="/guides"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                >
                  Guides
                </Link>
                <Link
                  to="/api"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                >
                  API
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm">Start Free Trial</Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-4 space-y-6">
          <Link
            to="/"
            className="text-lg font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/features"
            className="text-lg font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-lg font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <details className="group">
            <summary className="text-lg font-medium list-none flex justify-between cursor-pointer">
              Resources
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 pl-4 space-y-2">
              <Link
                to="/blog"
                className="block text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/guides"
                className="block text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Guides
              </Link>
              <Link
                to="/api"
                className="block text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                API
              </Link>
            </div>
          </details>

          <div className="mt-auto space-y-4 pt-6">
            <Button variant="outline" fullWidth onClick={() => setIsMobileMenuOpen(false)}>
              Log in
            </Button>
            <Button fullWidth onClick={() => setIsMobileMenuOpen(false)}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Import the cn utility
import { cn } from "@/lib/utils";

export default Header;
