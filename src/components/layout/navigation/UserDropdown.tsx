
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, Shield } from "lucide-react";
import { AuthUser } from "@/context/auth/types";

interface UserDropdownProps {
  user: AuthUser | null;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-500" />
        </div>
        <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link 
            to="/dashboard" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Dashboard
          </Link>
          {user?.isAdmin && (
            <Link 
              to="/admin" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Shield className="w-4 h-4 mr-2 text-primary" />
              Admin Dashboard
            </Link>
          )}
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
            onClick={onLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
