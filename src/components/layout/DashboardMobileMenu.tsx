
import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, CreditCard, LogOut, Globe, Users } from "lucide-react";
import { useAuth } from "@/context/auth";

type DashboardMobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  handleLogout: () => void;
};

const DashboardMobileMenu: React.FC<DashboardMobileMenuProps> = ({ isOpen, onClose, handleLogout }) => {
  const { user } = useAuth();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden">
      <div className="bg-white w-64 h-full overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
        </div>
        <nav className="py-4 px-3 space-y-1">
          <Link to="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/blogs" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <FileText className="w-5 h-5" />
            <span>My Blogs</span>
          </Link>
          <Link to="/blog" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <Globe className="w-5 h-5" />
            <span>Blog</span>
          </Link>
          <Link to="/account" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <Settings className="w-5 h-5" />
            <span>Account</span>
          </Link>
          <Link to="/subscription" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
            <CreditCard className="w-5 h-5" />
            <span>Subscription</span>
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700" onClick={onClose}>
              <Users className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
          <button 
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DashboardMobileMenu;
