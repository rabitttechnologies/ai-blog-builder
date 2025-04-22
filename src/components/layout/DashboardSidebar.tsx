
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, CreditCard, LogOut, Globe, Users } from "lucide-react";
import { useAuth } from "@/context/auth";

type DashboardSidebarProps = {
  handleLogout: () => void;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ handleLogout }) => {
  const { user } = useAuth();
  return (
    <aside className="hidden md:block w-56 bg-white h-[calc(100vh-57px)] sticky top-[57px] border-r">
      <nav className="py-4 px-3 space-y-1">
        <Link to="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link to="/blogs" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <FileText className="w-5 h-5" />
          <span>My Blogs</span>
        </Link>
        <Link to="/blog" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <Globe className="w-5 h-5" />
          <span>Blog</span>
        </Link>
        <Link to="/account" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <Settings className="w-5 h-5" />
          <span>Account</span>
        </Link>
        <Link to="/subscription" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <CreditCard className="w-5 h-5" />
          <span>Subscription</span>
        </Link>
        {user?.isAdmin && (
          <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
            <Users className="w-5 h-5" />
            <span>Admin Dashboard</span>
          </Link>
        )}
        <button 
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
