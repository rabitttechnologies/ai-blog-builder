
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const NavItems: React.FC = () => {
  return (
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
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
          )
        }
      >
        Contact
      </NavLink>
      <ResourcesDropdown />
    </nav>
  );
};

// Resources dropdown component
const ResourcesDropdown: React.FC = () => {
  return (
    <div className="relative group">
      <button className="flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        Resources
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      <div className="absolute left-0 mt-2 w-48 origin-top-left glass rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        <div className="py-1">
          <NavLink
            to="/blog"
            className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            Blog
          </NavLink>
          <NavLink
            to="/guides"
            className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            Guides
          </NavLink>
          <NavLink
            to="/api"
            className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            API
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavItems;
