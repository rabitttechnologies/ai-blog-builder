
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, User } from "lucide-react";
import { useAuth } from "@/context/auth";

type UserMenuProps = {};

const UserMenu: React.FC<UserMenuProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2"
        onClick={() => setIsUserMenuOpen((open) => !open)}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-500" />
        </div>
        <span className="hidden md:block text-sm font-medium">{user?.email?.split('@')[0]}</span>
        <ChevronDown className="hidden md:block w-4 h-4" />
      </button>
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-foreground/60">Free Trial</p>
          </div>
          <Link 
            to="/account" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Account Settings
          </Link>
          <Link 
            to="/subscription" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Subscription
          </Link>
          <button 
            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
