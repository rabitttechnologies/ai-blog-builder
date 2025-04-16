
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AuthUser } from "@/context/auth/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div
      className={cn(
        "md:hidden fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col h-full pt-16 pb-6 px-4 space-y-6">
        <Link
          to="/"
          className="text-lg font-medium"
          onClick={() => onClose()}
        >
          Home
        </Link>
        <Link
          to="/features"
          className="text-lg font-medium"
          onClick={() => onClose()}
        >
          Features
        </Link>
        <Link
          to="/pricing"
          className="text-lg font-medium"
          onClick={() => onClose()}
        >
          Pricing
        </Link>
        <Link
          to="/contact"
          className="text-lg font-medium"
          onClick={() => onClose()}
        >
          Contact
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
              onClick={() => onClose()}
            >
              Blog
            </Link>
            <Link
              to="/guides"
              className="block text-base"
              onClick={() => onClose()}
            >
              Guides
            </Link>
            <Link
              to="/api"
              className="block text-base"
              onClick={() => onClose()}
            >
              API
            </Link>
          </div>
        </details>

        {isAuthenticated ? (
          <div className="mt-auto space-y-4 pt-6">
            <Link
              to="/dashboard"
              className="block text-lg font-medium"
              onClick={() => onClose()}
            >
              Dashboard
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="block text-lg font-medium flex items-center"
                onClick={() => onClose()}
              >
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/account"
              className="block text-lg font-medium"
              onClick={() => onClose()}
            >
              Account Settings
            </Link>
            <Link
              to="/subscription"
              className="block text-lg font-medium"
              onClick={() => onClose()}
            >
              Subscription
            </Link>
            <button 
              className="text-lg font-medium text-red-600"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="mt-auto space-y-4 pt-6">
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => handleNavigation('/login')}
            >
              Log in
            </Button>
            <Button 
              fullWidth 
              onClick={() => handleNavigation('/signup')}
            >
              Start Free Trial
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
